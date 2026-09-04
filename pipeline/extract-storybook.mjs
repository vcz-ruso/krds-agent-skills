#!/usr/bin/env node
// extract-storybook.mjs
//
// 계약: 공식 React Storybook(https://www.krds.go.kr/storybook/react)에서
// 컴포넌트별 원본 JSX 예시·argTypes·설명을 추출해
// data/storybook/<Component>.json 으로 저장한다.
//
// 검증된 추출 절차 (수동 조사로 확인된 실제 응답 형태):
//   1. GET {url}/index.json
//      → Storybook v5 인덱스 응답. entries에서 story id / title / importPath를 열거한다.
//   2. GET {url}/iframe.html
//      → 렌더링용 iframe 문서. <script> 태그에서 실제 런타임 번들인
//        `./assets/iframe-*.js` 형태의 URL을 추출한다.
//   3. 번들(iframe-*.js) 본문을 정규식
//        /\.\/[A-Za-z]+\.stories-[A-Za-z0-9_-]+\.js/
//      으로 스캔해 컴포넌트별 story 청크 파일 맵을 수집한다.
//   4. 각 청크 파일을 GET한 뒤 그 안에서
//        - docs.source.originalSource (원본 JSX 예시)
//        - argTypes (prop 타입·기본값·설명)
//        - parameters.docs.description (컴포넌트 설명)
//      을 파싱해 컴포넌트 단위 JSON으로 합친다.
//
// 주의사항:
//   - stories.json, manifest.json 경로는 HTTP 200을 반환하지만 실제로는
//     SPA 라우팅용 index.html을 돌려주는 가짜 응답인 경우가 있다.
//     반드시 응답의 Content-Type이 application/json인지 검사한 뒤
//     사용해야 하며, text/html이 오면 즉시 실패로 처리한다.
//   - 청크 파일은 minify된 ESM이라 유효한 JSON이 아니다. argTypes/originalSource는
//     따옴표·백틱·중괄호를 인식하는 괄호 균형 스캐너로 파싱한다(아래
//     matchBracket/splitTopLevelEntries/parseStringLiteral/readTemplateLiteral).
//   - originalSource는 스토리 소스로더가 백틱 템플릿 리터럴로 감싸며 백틱(`)과
//     `${`는 백슬래시로 이스케이프한다. readTemplateLiteral이 이를 역이스케이프해
//     원문 그대로 복원한다.
//   - index.json의 스토리 항목 순서와 청크 내 originalSource 등장 순서가
//     1:1로 대응한다는 것을 Button(단순 컴포넌트, 7개 스토리)과
//     Modal(복합 컴포넌트, 8개 스토리, argTypes 없음)로 수동 검증했다.
//     따라서 컴포넌트별로 두 목록을 순서대로 zip한다.
//
// 이 스크립트는 더 이상 스텁이 아니며, 실제 fetch/파싱 로직이 구현되어 있다.

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'data', 'storybook');
const REQUEST_DELAY_MS = 100;
const UA = 'Mozilla/5.0 (compatible; krds-agent-skills extractor)';

function printHelp() {
  console.log(`사용법: node pipeline/extract-storybook.mjs [옵션]

공식 React Storybook에서 컴포넌트별 원본 JSX 예시, argTypes, 설명을 추출하여
data/storybook/<Component>.json 파일로 저장합니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

데이터 소스: pipeline/snapshot.lock.json 의 storybook-react.url`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function politeFetch(url, { expect } = {}) {
  await sleep(REQUEST_DELAY_MS);
  let res;
  try {
    res = await fetch(url, { headers: { 'User-Agent': UA } });
  } catch (err) {
    throw new Error(`요청 실패: ${url} (${err.message})`);
  }
  if (!res.ok) {
    throw new Error(`HTTP 오류: ${url} → status ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (expect === 'json' && !contentType.includes('application/json')) {
    throw new Error(
      `Content-Type 검증 실패: ${url} 는 application/json 이어야 하지만 "${contentType}" 를 받았습니다. ` +
        `SPA 라우팅 fallback(가짜 200 HTML) 응답일 가능성이 있습니다.`
    );
  }
  if (expect === 'js' && !/javascript/.test(contentType)) {
    throw new Error(
      `Content-Type 검증 실패: ${url} 는 JavaScript 여야 하지만 "${contentType}" 를 받았습니다.`
    );
  }
  return res;
}

async function fetchJson(url) {
  const res = await politeFetch(url, { expect: 'json' });
  return res.json();
}

async function fetchText(url, expect) {
  const res = await politeFetch(url, { expect });
  return res.text();
}

// ---------------------------------------------------------------------------
// 괄호/따옴표 인식 minified-JS 스캐너
//
// 청크 파일은 minify된 ESM이라 JSON.parse로 파싱할 수 없다. 아래 함수들은
// 문자열(', ")과 템플릿 리터럴(`)을 건너뛰면서 중괄호/대괄호/소괄호의 균형을
// 추적하는 최소한의 스캐너로, argTypes 객체·originalSource 템플릿 리터럴 같은
// 특정 부분을 안전하게 잘라내기 위해서만 사용한다(완전한 JS 파서가 아니다).
// ---------------------------------------------------------------------------

/** text[i]는 따옴표(' 또는 ")여야 한다. { value, end } 반환. end는 닫는 따옴표 다음 인덱스. */
function parseStringLiteral(text, i) {
  const quote = text[i];
  let j = i + 1;
  let out = '';
  const n = text.length;
  const simpleEscapes = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', '0': '\0' };
  while (j < n) {
    const c = text[j];
    if (c === '\\') {
      const next = text[j + 1];
      if (next === 'u') {
        if (text[j + 2] === '{') {
          const end = text.indexOf('}', j + 3);
          out += String.fromCodePoint(parseInt(text.slice(j + 3, end), 16));
          j = end + 1;
        } else {
          out += String.fromCharCode(parseInt(text.slice(j + 2, j + 6), 16));
          j += 6;
        }
        continue;
      }
      if (next === 'x') {
        out += String.fromCharCode(parseInt(text.slice(j + 2, j + 4), 16));
        j += 4;
        continue;
      }
      out += next in simpleEscapes ? simpleEscapes[next] : next;
      j += 2;
      continue;
    }
    if (c === quote) {
      j++;
      break;
    }
    out += c;
    j++;
  }
  return { value: out, end: j };
}

/**
 * text[i]는 백틱(`)이어야 한다. { value, end } 반환.
 * 소스로더가 원본 JSX를 감쌀 때 백틱과 `${`를 백슬래시로 이스케이프하므로,
 * 백슬래시 다음 문자를 그대로 살리는 방식으로 역이스케이프하면 원문이 복원된다.
 */
function readTemplateLiteral(text, i) {
  let j = i + 1;
  let out = '';
  const n = text.length;
  while (j < n) {
    const c = text[j];
    if (c === '\\') {
      out += text[j + 1];
      j += 2;
      continue;
    }
    if (c === '`') {
      j++;
      break;
    }
    out += c;
    j++;
  }
  return { value: out, end: j };
}

/** text[openIdx]는 여는 괄호({, [, ()여야 한다. 대응하는 닫는 괄호의 인덱스를 반환한다. */
function matchBracket(text, openIdx) {
  let i = openIdx + 1;
  let depth = 1;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (c === '"' || c === "'") {
      i = parseStringLiteral(text, i).end;
      continue;
    }
    if (c === '`') {
      i = readTemplateLiteral(text, i).end;
      continue;
    }
    if (c === '{' || c === '[' || c === '(') {
      depth++;
      i++;
      continue;
    }
    if (c === '}' || c === ']' || c === ')') {
      depth--;
      if (depth === 0) return i;
      i++;
      continue;
    }
    i++;
  }
  throw new Error(`균형 잡힌 괄호를 찾을 수 없습니다 (index ${openIdx})`);
}

/** 값 하나를 건너뛰고 다음 위치(콤마 또는 상위 컨테이너의 닫는 괄호)를 반환한다. */
function skipValue(text, start) {
  let i = start;
  let depth = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (c === '"' || c === "'") {
      i = parseStringLiteral(text, i).end;
      continue;
    }
    if (c === '`') {
      i = readTemplateLiteral(text, i).end;
      continue;
    }
    if (c === '{' || c === '[' || c === '(') {
      depth++;
      i++;
      continue;
    }
    if (c === '}' || c === ']' || c === ')') {
      if (depth === 0) return i;
      depth--;
      i++;
      continue;
    }
    if (c === ',' && depth === 0) return i;
    i++;
  }
  return i;
}

/** 객체 리터럴의 내부 텍스트(바깥 { }를 제거한 부분)를 { key, value } 목록으로 분해한다. */
function splitTopLevelEntries(text) {
  const entries = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    while (i < n && /[\s,]/.test(text[i])) i++;
    if (i >= n) break;
    let key;
    if (text[i] === '"' || text[i] === "'") {
      const r = parseStringLiteral(text, i);
      key = r.value;
      i = r.end;
    } else {
      const keyStart = i;
      while (i < n && /[\w$]/.test(text[i])) i++;
      key = text.slice(keyStart, i);
      if (!key) {
        // 인식할 수 없는 문자 — 안전하게 한 칸 건너뛴다.
        i++;
        continue;
      }
    }
    while (i < n && /\s/.test(text[i])) i++;
    if (text[i] !== ':') {
      i = skipValue(text, i);
      continue;
    }
    i++; // ':' 건너뛰기
    while (i < n && /\s/.test(text[i])) i++;
    const valueStart = i;
    i = skipValue(text, i);
    entries.push({ key, value: text.slice(valueStart, i).trim() });
  }
  return entries;
}

/** 배열 리터럴의 내부 텍스트(바깥 [ ]를 제거한 부분)를 값 텍스트 목록으로 분해한다. */
function splitTopLevelValues(text) {
  const values = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    while (i < n && /[\s,]/.test(text[i])) i++;
    if (i >= n) break;
    const start = i;
    i = skipValue(text, i);
    const v = text.slice(start, i).trim();
    if (v) values.push(v);
  }
  return values;
}

/** 값 텍스트 조각을 최선을 다해 JS 원시값으로 변환한다. */
function parsePrimitive(raw) {
  const t = raw.trim();
  if (!t) return null;
  if (t[0] === '"' || t[0] === "'") return parseStringLiteral(t, 0).value;
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (t === 'null' || t === 'undefined' || t === 'void 0') return null;
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  return t; // 식별자/멤버 표현식 등 — 원문 그대로 폴백
}

// ---------------------------------------------------------------------------
// 청크 파싱
// ---------------------------------------------------------------------------

/** 청크 텍스트에서 `{title:"Components/<Name>",...}` 메타 객체를 찾아 설명·argTypes를 추출한다. */
function parseMeta(chunkText) {
  const metaRe = /\{title:"Components\/([A-Za-z]+)"/;
  const m = metaRe.exec(chunkText);
  if (!m) {
    return { name: null, description: null, argTypes: null };
  }
  const openIdx = m.index;
  const closeIdx = matchBracket(chunkText, openIdx);
  const interior = chunkText.slice(openIdx + 1, closeIdx);

  let description = null;
  const descMarker = 'description:{component:';
  const descIdx = interior.indexOf(descMarker);
  if (descIdx !== -1) {
    const strStart = descIdx + descMarker.length;
    if (interior[strStart] === '"' || interior[strStart] === "'") {
      description = parseStringLiteral(interior, strStart).value;
    }
  }

  let argTypes = null;
  const argTypesMarker = 'argTypes:';
  const argMarkerIdx = interior.indexOf(argTypesMarker);
  if (argMarkerIdx !== -1) {
    const openBrace = argMarkerIdx + argTypesMarker.length;
    if (interior[openBrace] === '{') {
      const closeBrace = matchBracket(interior, openBrace);
      const argInterior = interior.slice(openBrace + 1, closeBrace);
      const propEntries = splitTopLevelEntries(argInterior);
      argTypes = {};
      for (const { key, value } of propEntries) {
        let control = null;
        let options = null;
        let description2 = null;
        if (value.startsWith('{') && value.endsWith('}')) {
          const subEntries = splitTopLevelEntries(value.slice(1, -1));
          for (const se of subEntries) {
            if (se.key === 'control') {
              if (se.value.startsWith('{')) {
                const controlEntries = splitTopLevelEntries(se.value.slice(1, -1));
                const typeEntry = controlEntries.find((x) => x.key === 'type');
                control = typeEntry ? parsePrimitive(typeEntry.value) : null;
              } else {
                control = parsePrimitive(se.value);
              }
            } else if (se.key === 'options') {
              if (se.value.startsWith('[')) {
                const arrInner = se.value.slice(1, -1);
                options = splitTopLevelValues(arrInner).map(parsePrimitive);
              }
            } else if (se.key === 'description') {
              description2 = parsePrimitive(se.value);
            }
          }
        }
        argTypes[key] = { control, options: options ?? null, description: description2 ?? null };
      }
    }
  }

  return { name: m[1], description, argTypes };
}

/** 청크 텍스트에 등장하는 순서대로 originalSource 문자열 목록을 추출한다. */
function extractOriginalSources(chunkText) {
  const marker = 'originalSource:';
  const results = [];
  let from = 0;
  while (true) {
    const idx = chunkText.indexOf(marker, from);
    if (idx === -1) break;
    const btIdx = idx + marker.length;
    if (chunkText[btIdx] === '`') {
      const { value, end } = readTemplateLiteral(chunkText, btIdx);
      results.push(value);
      from = end;
    } else {
      from = idx + marker.length;
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const lockPath = join(__dirname, 'snapshot.lock.json');
  const lock = JSON.parse(await readFile(lockPath, 'utf-8'));
  const sbLock = lock['storybook-react'];
  const baseUrl = sbLock.url.replace(/\/$/, '');
  console.log(`대상 Storybook: ${baseUrl} (v${sbLock.storybookVersion})`);

  const warnings = [];

  // 1. index.json
  console.log('1/4 index.json 가져오는 중...');
  const index = await fetchJson(`${baseUrl}/index.json`);
  if (!index || typeof index.entries !== 'object') {
    throw new Error('index.json 응답 형식이 예상과 다릅니다 (entries 필드 없음).');
  }
  const entryList = Object.values(index.entries);

  // 컴포넌트 이름별 스토리 목록(등록 순서 유지) 수집
  const componentTitles = new Map(); // name -> title
  const componentStories = new Map(); // name -> [{id, name}]
  for (const entry of entryList) {
    const m = /^Components\/([A-Za-z]+)$/.exec(entry.title || '');
    if (!m) continue;
    const compName = m[1];
    componentTitles.set(compName, entry.title);
    if (entry.type === 'story') {
      if (!componentStories.has(compName)) componentStories.set(compName, []);
      componentStories.get(compName).push({ id: entry.id, name: entry.name });
    }
  }
  const componentNames = [...componentTitles.keys()].sort();
  console.log(`   → 컴포넌트 ${componentNames.length}개, story 항목 ${entryList.filter((e) => e.type === 'story').length}개`);

  // 2. iframe.html → 런타임 번들 경로
  console.log('2/4 iframe.html 가져오는 중...');
  const iframeHtml = await fetchText(`${baseUrl}/iframe.html`);
  const bundleMatch = /\.\/assets\/iframe-[\w.-]+\.js/.exec(iframeHtml);
  if (!bundleMatch) {
    throw new Error('iframe.html 에서 런타임 번들(./assets/iframe-*.js) 경로를 찾을 수 없습니다.');
  }
  const bundlePath = bundleMatch[0].replace(/^\.\//, '');
  console.log(`   → 번들: ${bundlePath}`);

  // 3. 번들 → 컴포넌트별 청크 파일 맵
  console.log('3/4 런타임 번들 가져와 청크 맵 구성 중...');
  const bundleText = await fetchText(`${baseUrl}/${bundlePath}`, 'js');
  const chunkMap = new Map(); // name -> chunk filename
  for (const m of bundleText.matchAll(/\.\/([A-Za-z]+)\.stories-[A-Za-z0-9_-]+\.js/g)) {
    chunkMap.set(m[1], m[0].replace(/^\.\//, ''));
  }
  console.log(`   → 청크 ${chunkMap.size}개 발견`);

  const missingChunks = componentNames.filter((n) => !chunkMap.has(n));
  if (missingChunks.length > 0) {
    throw new Error(
      `다음 컴포넌트의 story 청크를 번들에서 찾지 못했습니다: ${missingChunks.join(', ')}. ` +
        `추출 절차(2단계 청크 스캔 정규식)가 사이트 변경으로 더 이상 맞지 않을 수 있습니다.`
    );
  }

  // 4. 각 청크를 가져와 파싱, 컴포넌트 단위 JSON 저장
  console.log('4/4 컴포넌트별 청크 파싱 중...');
  await mkdir(OUT_DIR, { recursive: true });

  let written = 0;
  for (const name of componentNames) {
    const chunkFile = chunkMap.get(name);
    const chunkText = await fetchText(`${baseUrl}/assets/${chunkFile}`, 'js');

    const meta = parseMeta(chunkText);
    const originalSources = extractOriginalSources(chunkText);
    const storyEntries = componentStories.get(name) || [];

    if (originalSources.length === 0) {
      warnings.push(`${name}: 청크(${chunkFile})에서 originalSource 블록을 찾지 못했습니다.`);
    }
    if (originalSources.length !== storyEntries.length) {
      warnings.push(
        `${name}: index.json의 story 개수(${storyEntries.length})와 청크에서 추출한 originalSource 개수(${originalSources.length})가 다릅니다. 순서 기반으로 앞에서부터 매칭합니다.`
      );
    }

    const pairCount = Math.min(storyEntries.length, originalSources.length);
    const stories = [];
    for (let i = 0; i < pairCount; i++) {
      stories.push({
        id: storyEntries[i].id,
        name: storyEntries[i].name,
        originalSource: originalSources[i],
      });
    }
    // 매칭되지 못한 나머지 index.json story 항목도 originalSource 없이 누락 없이 기록한다.
    for (let i = pairCount; i < storyEntries.length; i++) {
      stories.push({ id: storyEntries[i].id, name: storyEntries[i].name, originalSource: null });
      warnings.push(`${name}: story "${storyEntries[i].name}" (${storyEntries[i].id}) 의 originalSource를 찾지 못했습니다.`);
    }

    const out = {
      component: name,
      title: componentTitles.get(name),
      description: meta.description,
      argTypes: meta.argTypes,
      stories,
      extractedFrom: { chunk: chunkFile, storybookVersion: sbLock.storybookVersion },
    };

    const outPath = join(OUT_DIR, `${name}.json`);
    await writeFile(outPath, JSON.stringify(out, null, 2) + '\n', 'utf-8');
    written++;
    process.stdout.write(`   [${written}/${componentNames.length}] ${name}.json 저장 (stories=${stories.length}, argTypes=${meta.argTypes ? Object.keys(meta.argTypes).length + '개 prop' : 'null'})\n`);
  }

  console.log(`\n완료: data/storybook/ 에 ${written}개 파일 저장`);
  if (warnings.length > 0) {
    console.log(`\n경고 ${warnings.length}건:`);
    for (const w of warnings) console.log(`  - ${w}`);
  } else {
    console.log('경고 없음');
  }
}

main().catch((err) => {
  console.error(`\n오류: ${err.message}`);
  process.exit(1);
});
