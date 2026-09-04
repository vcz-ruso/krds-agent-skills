#!/usr/bin/env node
// crawl-site.mjs
//
// 계약: krds.go.kr의 컴포넌트·기본 패턴·서비스 패턴·디자인 스타일·유틸리티
// 문서 페이지(사용성/접근성/패턴 안내 텍스트)를 정적 fetch로 수집해
// data/site/<section>/<page>.md (마크다운) + data/site/manifest.json 으로
// 저장한다.
//
// URL 규칙: <base><section>/<section>_<NN>[_<MM>].html
//   base = pipeline/snapshot.lock.json 의 site.base
//   - component/  색인 component_summary.html, 페이지 component_<CAT>_<NN>.html
//   - global/     색인 global_summary.html, 페이지 global_01.html..
//   - service/    색인 service_summary.html, 페이지 service_<GROUP>_<STEP>.html
//   - style/      style_01.html.. (색인 페이지 없음, 별도로 style_07_popup.html 존재)
//   - utility/    utility_01.html.. (색인 페이지 없음)
//
// 수동 조사로 확인한 사실(2026-09-04):
//   - component_summary.html 본문에 실제 컴포넌트 페이지로의 정적 링크
//     (component_<CAT>_<NN>.html, CAT 02..12)가 모두 포함되어 있어
//     정규식으로 대상 목록을 파싱할 수 있다. 파싱 결과가 비어 있으면
//     CAT 02..12 × NN 01..14 브루트포스 반복으로 폴백한다.
//   - global_*, service_*는 카테고리별로 번호가 연속되며 중간에 구멍 없이
//     끝에서만 404가 난다(예: global_13까지 성공, global_14부터 404 /
//     service_02_08까지 성공, service_02_09부터 404). 따라서 순번을 늘려가며
//     첫 404를 만나면 해당 구간 반복을 멈춘다.
//   - style_*, utility_*는 색인이 없어 알려진 번호 범위를 모두 시도한다.
//     style_03.html처럼 순간적으로 503을 반환하는 경우가 있어(재확인 시 200)
//     5xx 응답과 네트워크 오류는 재시도한다.
//   - 페이지 본문 대부분은 서버가 정적으로 렌더링해 fetch만으로 텍스트를
//     얻을 수 있다(컴포넌트 개요/접근성 탭의 안내 텍스트, KWCAG/WCAG 인용
//     포함). 다만 코드 예시 블록 등 일부 영역은 클라이언트 JS가 채워
//     정적 HTML에는 빈 껍데기로 남는다 — 이런 페이지는 추출 결과가
//     극단적으로 짧게(<200자) 나오므로 실패 처리하지 않고 manifest의
//     needsBrowser 목록에 기록한다(Orca 내장 브라우저로 별도 보강 필요).
//   - 실제 컴포넌트 문서 HTML 구조: <div id="container">...<footer 사이에
//     본문이 있고, <header>/<footer>/<nav>(사이드 내비게이션, 브레드크럼,
//     페이지 내 탭 링크)는 전부 사이트 공통 UI라 콘텐츠가 아니다.
//     <h1 class="h-tit">는 항상 "page title"이라는 리터럴 placeholder만
//     담고 있고 실제 페이지명은 <title>의 " | " 앞부분(또는 " - KRDS"를
//     제거한 나머지)에 있다 — 이를 마크다운 최상위 제목으로 사용한다.
//     본문 섹션 제목은 h3.sec-tit(개요/접근성 가이드라인/마크업 가이드 등),
//     하위 제목은 h4.con-tit로 일관되게 마크업되어 있다.
//
// 추출 방식: 외부 의존성 없이 정규식 기반의 가벼운 상태 기계로 처리한다.
//   1. <div id="container"> ~ <footer 사이만 잘라낸다(본문 슬라이스).
//   2. script/style/HTML 주석/nav 블록 제거.
//   3. table을 먼저 마크다운 표로 변환해 플레이스홀더로 치환(중첩 태그
//      처리 중 표 셀 내용이 깨지지 않도록).
//   4. h1~h4 → #~####, li(중첩 포함, 반복 치환으로 안쪽부터 처리) → "- ",
//      dt/dd → **term**/들여쓰기, p → 문단, br → 줄바꿈.
//   5. 남은 div/section/tr 등 블록 요소는 줄바꿈 경계만 남기고, 나머지
//      인라인 태그(span/a/strong/i/label 등)는 태그만 제거해 텍스트를
//      보존한다.
//   6. HTML 엔티티(named/decimal/hex)를 마지막에 디코드하고, 표 플레이스
//      홀더를 원래 마크다운 표로 되돌린 뒤 빈 줄을 정리한다.
//   완벽한 재현은 목표가 아니며, 제목 위계와 본문 텍스트가 보존되는 것을
//   기준으로 삼는다.
//
// 예의 있는 수집: 순차 요청, 요청당 150ms 지연, 브라우저 User-Agent 헤더
// 사용. 5xx/네트워크 오류는 최대 3회(지수적 백오프)까지 재시도하고, 그래도
// 실패하면 네트워크 오류만 fatal로 처리한다(HTTP 오류는 fatal 아님 — 상태
// 코드를 그대로 manifest에 기록하고 계속 진행). 총 요청 수는 150건을
// 상한으로 하며, 상한에 도달하면 남은 구간을 건너뛰고 지금까지 수집한
// 결과로 manifest를 작성한다.

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'data', 'site');
const REQUEST_DELAY_MS = 150;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (krds-agent-skills crawl-site)';
const MAX_REQUESTS = 150;
const MIN_CONTENT_CHARS = 200;

let requestCount = 0;
let budgetExceededLogged = false;

function printHelp() {
  console.log(`사용법: node pipeline/crawl-site.mjs [옵션]

krds.go.kr의 컴포넌트/기본 패턴/서비스 패턴/디자인 스타일/유틸리티
문서 페이지를 수집하여 data/site/<section>/<page>.md 마크다운과
data/site/manifest.json 을 생성합니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

데이터 소스: pipeline/snapshot.lock.json 의 site.base
JS 렌더링으로 본문이 비어 있는 페이지는 실패 처리하지 않고
manifest.json의 needsBrowser 목록에 기록합니다(Orca 내장 브라우저로
별도 수동 보강 필요).`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function budgetExceeded() {
  if (requestCount >= MAX_REQUESTS) {
    if (!budgetExceededLogged) {
      console.log(`   ⚠ 요청 상한(${MAX_REQUESTS}건)에 도달해 남은 구간을 건너뜁니다.`);
      budgetExceededLogged = true;
    }
    return true;
  }
  return false;
}

// ---- HTTP ----

async function politeFetch(url) {
  requestCount++;
  await sleep(REQUEST_DELAY_MS);
  let res = null;
  let networkErr = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    networkErr = null;
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA } });
    } catch (err) {
      networkErr = err;
      res = null;
    }
    if (res && res.status < 500) break; // 성공 또는 4xx(예: 404)는 재시도하지 않음
    if (attempt < 3) await sleep(400 * attempt); // 네트워크 오류 또는 5xx만 재시도
  }
  if (networkErr) {
    throw new Error(`네트워크 오류(재시도 소진): ${url} (${networkErr.message})`);
  }
  return res; // res.ok가 false일 수 있다(404, 5xx 등) — 호출자가 처리
}

async function fetchPage(url) {
  const res = await politeFetch(url);
  const status = res.status;
  if (!res.ok) {
    // 바디를 소모해 커넥션을 정리한다.
    try {
      await res.arrayBuffer();
    } catch {
      /* 무시 */
    }
    return { status, html: null, bytes: 0 };
  }
  const contentType = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  if (!contentType.includes('text/html')) {
    return { status, html: null, bytes: buf.length, contentType };
  }
  return { status, html: buf.toString('utf-8'), bytes: buf.length, contentType };
}

// ---- HTML → 마크다운 추출 ----

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  middot: '·',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  copy: '©',
  reg: '®',
  trade: '™',
};

function decodeEntities(str) {
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => (NAMED_ENTITIES[name] !== undefined ? NAMED_ENTITIES[name] : m));
}

function stripTags(html) {
  const text = html.replace(/<[^>]+>/g, ' ');
  return decodeEntities(text)
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

function padCells(cells, n) {
  const out = cells.slice();
  while (out.length < n) out.push('');
  return out;
}

function tableToMarkdown(tableHtml) {
  const captionMatch = /<caption[^>]*>([\s\S]*?)<\/caption>/i.exec(tableHtml);
  const caption = captionMatch ? stripTags(captionMatch[1]) : '';

  const rows = [];
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rm;
  while ((rm = rowRe.exec(tableHtml))) {
    const rowHtml = rm[1];
    const cells = [];
    let isHeaderRow = true;
    const cellRe = /<t([hd])[^>]*>([\s\S]*?)<\/t\1>/gi;
    let cm;
    let sawCell = false;
    while ((cm = cellRe.exec(rowHtml))) {
      sawCell = true;
      if (cm[1].toLowerCase() !== 'h') isHeaderRow = false;
      cells.push(stripTags(cm[2]).replace(/\|/g, '\\|').replace(/\n/g, ' '));
    }
    if (sawCell) rows.push({ cells, isHeaderRow });
  }

  if (rows.length === 0) return caption ? `*${caption}*` : '';

  const colCount = Math.max(...rows.map((r) => r.cells.length));
  const lines = [];
  if (caption) lines.push(`*${caption}*`, '');

  const headerRow = rows[0].isHeaderRow ? rows[0] : null;
  const bodyRows = headerRow ? rows.slice(1) : rows;

  if (headerRow) {
    lines.push('| ' + padCells(headerRow.cells, colCount).join(' | ') + ' |');
    lines.push('| ' + new Array(colCount).fill('---').join(' | ') + ' |');
  }
  for (const r of bodyRows) {
    lines.push('| ' + padCells(r.cells, colCount).join(' | ') + ' |');
  }
  return lines.join('\n');
}

function extractMainSlice(html) {
  const containerIdx = html.indexOf('<div id="container"');
  let sliceStart = containerIdx;
  if (sliceStart === -1) {
    const bodyIdx = html.indexOf('<body');
    sliceStart = bodyIdx !== -1 ? bodyIdx : 0;
  }
  const footerIdx = html.indexOf('<footer', sliceStart);
  const sliceEnd = footerIdx !== -1 ? footerIdx : html.length;
  return html.slice(sliceStart, sliceEnd);
}

function extractPageTitle(html) {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (!m) return null;
  let full = decodeEntities(m[1]).trim();
  if (full.includes('|')) {
    full = full.split('|')[0].trim();
  } else {
    full = full.replace(/\s*-\s*KRDS\s*$/i, '').trim();
  }
  return full || null;
}

function htmlToMarkdown(sectionHtml) {
  let html = sectionHtml;

  // 1. script/style/주석/nav 제거
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<nav[\s\S]*?<\/nav>/gi, '');

  // 2. table → 마크다운 표로 변환 후 플레이스홀더로 치환
  const tables = [];
  html = html.replace(/<table[\s\S]*?<\/table>/gi, (m) => {
    tables.push(tableToMarkdown(m));
    return `\n\n@@TABLE_${tables.length - 1}@@\n\n`;
  });

  // 3. 헤딩 (h1은 리터럴 placeholder "page title"이면 건너뜀 — 실제 제목은
  //    extractPageTitle()로 <title>에서 따로 뽑아 최상위에 붙인다)
  html = html.replace(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi, (m, level, inner) => {
    const text = stripTags(inner);
    if (!text || text === 'page title') return '\n\n';
    return `\n\n${'#'.repeat(Number(level))} ${text}\n\n`;
  });

  // 4. 목록 항목 — 중첩 목록도 처리되도록 더 이상 <li>가 없을 때까지 반복
  for (let pass = 0; pass < 6 && /<li[\s>]/i.test(html); pass++) {
    html = html.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, inner) => {
      const text = stripTags(inner);
      return text ? `\n- ${text}` : '';
    });
  }

  // 5. 정의 목록
  html = html.replace(/<dt[^>]*>([\s\S]*?)<\/dt>/gi, (m, inner) => {
    const text = stripTags(inner);
    return text ? `\n**${text}**` : '';
  });
  html = html.replace(/<dd[^>]*>([\s\S]*?)<\/dd>/gi, (m, inner) => {
    const text = stripTags(inner);
    return text ? `\n  ${text}` : '';
  });

  // 6. 문단
  html = html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (m, inner) => {
    const text = stripTags(inner);
    return text ? `\n\n${text}\n\n` : '';
  });

  // 7. 명시적 줄바꿈
  html = html.replace(/<br\s*\/?>/gi, '\n');

  // 8. 남은 블록 요소는 줄바꿈 경계만 남긴다(인라인 태그는 9에서 텍스트만 보존)
  html = html.replace(/<\/?(?:div|section|article|tr|td|th|caption|figure|figcaption)[^>]*>/gi, '\n');

  // 9. 남은 태그 전부 제거 (엔티티는 아직 인코딩된 채로 남아 있어 코드
  //    예시 안의 &lt;/&gt; 등이 실제 태그로 오인되지 않는다)
  html = html.replace(/<[^>]+>/g, '');

  // 10. 엔티티 디코드
  html = decodeEntities(html);

  // 11. 표 플레이스홀더 복원
  html = html.replace(/@@TABLE_(\d+)@@/g, (m, i) => tables[Number(i)] || '');

  // 12. 공백/빈 줄 정리
  html = html
    .split('\n')
    .map((line) => line.replace(/[ \t\f\v]+/g, ' ').trimEnd())
    .join('\n');
  html = html.replace(/\n{3,}/g, '\n\n').trim();

  return html;
}

function extractContent(html) {
  const title = extractPageTitle(html);
  const slice = extractMainSlice(html);
  const body = htmlToMarkdown(slice);
  const markdown = title ? `# ${title}\n\n${body}` : body;
  return { title, markdown };
}

// ---- 페이지 단위 처리 ----

async function processPage(base, section, filename, fetchedAt, results) {
  if (budgetExceeded()) return;

  const url = `${base}${section}/${filename}`;
  const relPath = `${section}/${filename.replace(/\.html$/, '.md')}`;

  const page = await fetchPage(url);

  if (page.status !== 200 || !page.html) {
    results.notFound.push({ path: relPath, url, status: page.status });
    console.log(`   [${page.status}] ${url}`);
    return;
  }

  const { markdown } = extractContent(page.html);
  const contentChars = markdown.length;

  const header = `<!--\nsource: ${url}\nfetchedAt: ${fetchedAt}\nbytes: ${page.bytes}\n-->\n\n`;
  const fileBody = header + markdown + '\n';

  const outPath = join(OUT_DIR, section, filename.replace(/\.html$/, '.md'));
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, fileBody, 'utf-8');

  results.pages.push({ path: relPath, url, status: page.status, bytes: page.bytes, contentChars });

  if (contentChars < MIN_CONTENT_CHARS) {
    results.needsBrowser.push({ path: relPath, url, contentChars });
    console.log(`   [200, ${contentChars}자 — needsBrowser] ${url}`);
  } else {
    console.log(`   [200, ${contentChars}자] ${url}`);
  }
}

// ---- 섹션별 대상 목록 수집 및 처리 ----

async function crawlComponent(base, fetchedAt, results) {
  console.log('\n=== component ===');

  const idxUrl = `${base}component/component_summary.html`;
  const idxPage = await fetchPage(idxUrl);
  if (idxPage.status === 200 && idxPage.html) {
    await saveFetchedPage('component', 'component_summary.html', idxUrl, idxPage, fetchedAt, results);
  } else {
    results.notFound.push({ path: 'component/component_summary.md', url: idxUrl, status: idxPage.status });
    console.log(`   [${idxPage.status}] ${idxUrl}`);
  }

  let filenames = [];
  if (idxPage.html) {
    const found = new Set();
    const re = /component_[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*\.html/g;
    let m;
    while ((m = re.exec(idxPage.html))) {
      if (m[0] !== 'component_summary.html') found.add(m[0]);
    }
    filenames = [...found].sort();
  }

  if (filenames.length === 0) {
    console.log('   ⚠ component_summary.html 링크 파싱 실패 — 브루트포스 폴백(CAT 02-12 × NN 01-14)으로 전환');
    for (let cat = 2; cat <= 12; cat++) {
      for (let nn = 1; nn <= 14; nn++) {
        filenames.push(`component_${pad2(cat)}_${pad2(nn)}.html`);
      }
    }
  } else {
    console.log(`   링크 파싱 성공: 페이지 ${filenames.length}개 발견`);
  }

  for (const filename of filenames) {
    if (budgetExceeded()) break;
    await processPage(base, 'component', filename, fetchedAt, results);
  }
}

async function crawlGlobal(base, fetchedAt, results) {
  console.log('\n=== global ===');
  await processPage(base, 'global', 'global_summary.html', fetchedAt, results);

  for (let n = 1; n <= 20; n++) {
    if (budgetExceeded()) break;
    const filename = `global_${pad2(n)}.html`;
    const url = `${base}global/${filename}`;
    const page = await fetchPage(url);
    if (page.status !== 200 || !page.html) {
      results.notFound.push({ path: `global/${filename.replace(/\.html$/, '.md')}`, url, status: page.status });
      console.log(`   [${page.status}] ${url} → 이 구간 종료`);
      break;
    }
    await saveFetchedPage('global', filename, url, page, fetchedAt, results);
  }
}

async function crawlService(base, fetchedAt, results) {
  console.log('\n=== service ===');
  await processPage(base, 'service', 'service_summary.html', fetchedAt, results);

  for (let group = 1; group <= 5; group++) {
    for (let step = 1; step <= 12; step++) {
      if (budgetExceeded()) return;
      const filename = `service_${pad2(group)}_${pad2(step)}.html`;
      const url = `${base}service/${filename}`;
      const page = await fetchPage(url);
      if (page.status !== 200 || !page.html) {
        results.notFound.push({ path: `service/${filename.replace(/\.html$/, '.md')}`, url, status: page.status });
        console.log(`   [${page.status}] ${url} → 그룹 ${pad2(group)} 종료`);
        break;
      }
      await saveFetchedPage('service', filename, url, page, fetchedAt, results);
    }
  }
}

async function crawlStyle(base, fetchedAt, results) {
  console.log('\n=== style ===');
  const filenames = [];
  for (let n = 1; n <= 9; n++) filenames.push(`style_${pad2(n)}.html`);
  filenames.push('style_07_popup.html');
  for (const filename of filenames) {
    if (budgetExceeded()) break;
    await processPage(base, 'style', filename, fetchedAt, results);
  }
}

async function crawlUtility(base, fetchedAt, results) {
  console.log('\n=== utility ===');
  for (let n = 1; n <= 7; n++) {
    if (budgetExceeded()) break;
    await processPage(base, 'utility', `utility_${pad2(n)}.html`, fetchedAt, results);
  }
}

// component/global/service 루프에서 이미 fetch한 응답을 저장할 때 쓰는 헬퍼.
// (processPage는 fetch까지 자체적으로 하지만, 여기서는 색인 파싱이나
// 순번 종료 판단을 위해 호출자가 이미 page 객체를 들고 있는 경우다.)
async function saveFetchedPage(section, filename, url, page, fetchedAt, results) {
  const relPath = `${section}/${filename.replace(/\.html$/, '.md')}`;
  const { markdown } = extractContent(page.html);
  const contentChars = markdown.length;

  const header = `<!--\nsource: ${url}\nfetchedAt: ${fetchedAt}\nbytes: ${page.bytes}\n-->\n\n`;
  const fileBody = header + markdown + '\n';

  return mkdir(join(OUT_DIR, section), { recursive: true })
    .then(() => writeFile(join(OUT_DIR, section, filename.replace(/\.html$/, '.md')), fileBody, 'utf-8'))
    .then(() => {
      results.pages.push({ path: relPath, url, status: page.status, bytes: page.bytes, contentChars });
      if (contentChars < MIN_CONTENT_CHARS) {
        results.needsBrowser.push({ path: relPath, url, contentChars });
        console.log(`   [200, ${contentChars}자 — needsBrowser] ${url}`);
      } else {
        console.log(`   [200, ${contentChars}자] ${url}`);
      }
    });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const lockPath = join(__dirname, 'snapshot.lock.json');
  const lock = JSON.parse(await readFile(lockPath, 'utf-8'));
  const base = lock.site && lock.site.base;
  if (!base) {
    throw new Error('snapshot.lock.json 에 site.base 가 없습니다.');
  }
  console.log(`대상 사이트: ${base}`);

  const fetchedAt = new Date().toISOString();
  const results = { pages: [], notFound: [], needsBrowser: [] };

  await mkdir(OUT_DIR, { recursive: true });

  await crawlComponent(base, fetchedAt, results);
  await crawlGlobal(base, fetchedAt, results);
  await crawlService(base, fetchedAt, results);
  await crawlStyle(base, fetchedAt, results);
  await crawlUtility(base, fetchedAt, results);

  const manifest = {
    base,
    fetchedAt,
    pages: results.pages,
    needsBrowser: results.needsBrowser,
    notFound: results.notFound,
  };
  const manifestPath = join(OUT_DIR, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');

  console.log(
    `\n완료: 저장 ${results.pages.length}건 (needsBrowser ${results.needsBrowser.length}건 포함), ` +
      `notFound ${results.notFound.length}건, 총 요청 ${requestCount}건`
  );
  console.log(`manifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error(`\n오류: ${err.message}`);
  process.exit(1);
});
