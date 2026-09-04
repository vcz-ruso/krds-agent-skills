#!/usr/bin/env node
// check-static.mjs
//
// 계약: 파일 경로 인자(.tsx/.jsx/.html/.css)들을 받아 아래 5개 항목을
// 결정론적으로 정적 검사하고, 검출된 위반 사항을 JSON 배열로 stdout에
// 출력한다.
//
//   (a) 하드코딩 색상(hex/rgb) — KRDS 토큰(var(--krds-...)) 미사용 검출.
//       단, krds_tokens.css 자체 및 파일명에 "token"이 들어간 토큰 정의
//       파일(.css)은 검사 대상에서 제외하고, CSS 커스텀 프로퍼티 정의
//       (`--foo: #fff;`) 자체와 var()의 fallback 값은 "토큰 정의/제공"
//       행위이지 "미사용"이 아니므로 건너뛴다.
//   (b) 인라인 style의 터치 타깃 의심 — width/height/minWidth/minHeight가
//       44(px) 미만이면서 같은 태그 안에 onPress/onClick이 있으면 경고.
//       이 휴리스틱은 "같은 여는 태그" 범위만 보는 정적 근사치이며 실제
//       렌더링 크기(부모 padding, 폰트 기반 em 등)는 반영하지 못한다 —
//       리포트에도 confidence: "휴리스틱"으로 명시한다.
//   (c) img/Image 요소에 alt 속성 부재.
//   (d) button/링크류(<button>, <a>, <Button>, <Link>)에 접근 가능한
//       텍스트(자식 텍스트) 또는 aria-label이 모두 없는 경우 — 휴리스틱
//       (아이콘 전용 버튼이 의도적으로 aria-label을 다른 방식(예: title,
//       상위 컴포넌트가 자동 주입)으로 제공했을 가능성을 정적 분석만으로는
//       배제할 수 없음).
//   (e) `<div onClick=...>` 류 비시맨틱 인터랙션(role/tabIndex로 일부
//       보완되어 있어도 시맨틱 요소 사용을 권장하는 관점에서 계속 검출).
//
// 각 위반 항목에는 kwcag-map.md 생성 결과(data/site/component/*.md 원문
// 인용)와 일관되는 대표 KWCAG 2.2 조항명·WCAG 2.1 SC(등급)를 하드코딩해
// 붙인다. 정확히 1:1 대응하는 규칙 문서가 없는 항목(예: 하드코딩 색상)은
// 가장 근접한 대표 조항을 선택했음을 코드 주석에 근거로 남긴다.
//
// 출력 JSON 각 원소: { file, line, rule, severity, message, kwcag, wcag,
//   confidence: "확정" | "휴리스틱" }
//
// Node 20+ builtin만 사용(정규식 기반 텍스트 스캔 — 완전한 AST 파서가
// 아니므로 주석/문자열 리터럴 안의 우연한 매치 등은 걸러내지 못할 수
// 있음. 이는 알려진 한계이며 "확정" confidence는 "패턴이 실제로 파일에
// 존재한다"는 사실 자체에 대한 확정이지, "반드시 실제 결함이다"라는
// 보장은 아니다 — SKILL.md 리뷰 절차에서 모델이 최종 판단한다).

import { readFile } from 'node:fs/promises';
import { extname, basename } from 'node:path';

function printHelp() {
  console.log(`사용법: node scripts/check-static.mjs <파일...> [옵션]

.tsx/.jsx/.html/.css 파일 경로를 인자로 받아 아래 5개 항목을 정적으로
검사하고, 위반 사항을 JSON 배열로 stdout에 출력합니다.

  (a) 하드코딩 색상(hex/rgb) — KRDS 토큰 미사용
  (b) 인라인 style 터치 타깃 의심 크기 (휴리스틱)
  (c) img/Image 요소의 alt 속성 부재
  (d) button/링크류의 접근 가능한 텍스트·aria-label 부재 (휴리스틱)
  (e) <div onClick> 류 비시맨틱 인터랙션

옵션:
  --help    이 도움말을 출력하고 종료합니다.

출력: [{ file, line, rule, severity, message, kwcag, wcag, confidence }]
종료 코드: 위반이 하나 이상 검출되면 1, 없으면 0 (읽기 오류 시 2).`);
}

// ---------------------------------------------------------------------------
// 규칙별 KWCAG 2.2 / WCAG 2.1 대표 인용
// (근거: skills/krds-a11y-review/references/kwcag-map.md 생성에 쓰인
//  data/site/component/*.md 원문. 정확히 대응하는 항목이 없는 경우
//  각 상수 옆 주석에 선택 근거를 남긴다.)
// ---------------------------------------------------------------------------

const CITATIONS = {
  // component_09_03.md(Text input) 등 다수 컴포넌트가 "텍스트 콘텐츠의
  // 명도 대비"/"Contrast (Minimum) (AA)" 조합을 사용한다. 하드코딩 색상은
  // 토큰이 보장하는 명도 대비·다크모드 대응을 우회하므로 가장 근접한
  // 대표 조항으로 선택했다(완전한 대체 검사기는 아님 — 실제 대비율
  // 계산은 별도 도구/수동 검증이 필요하다).
  hardcodedColor: { kwcag: '텍스트 콘텐츠의 명도 대비', wcag: 'Contrast (Minimum) (AA)' },
  // component_05_02.md(Button) "버튼을 적절한 크기로 제공한다." 항목과
  // 동일한 인용.
  touchTarget: { kwcag: '조작 가능', wcag: 'Target Size (AAA)' },
  // component_04_08.md(Image) "장식용 이미지를 제외한 모든 이미지에
  // 대체 텍스트를 제공한다." 항목과 동일한 인용.
  imgAlt: { kwcag: '적절한 대체 텍스트 제공', wcag: 'Non-text Content (A)' },
  // component_05_02.md(Button) "모든 버튼에는 접근 가능한 이름을
  // 제공한다." 항목과 동일한 인용.
  accessibleName: { kwcag: '적절한 링크 텍스트', wcag: 'Name, Role, Value (A)' },
  // component_05_02.md(Button) "버튼으로 작동하는 모든 요소는 스크린
  // 리더에서 버튼으로 인지될 수 있도록 한다." + 키보드 조작 항목 조합.
  nonSemanticInteractive: {
    kwcag: '키보드 사용 보장',
    wcag: 'Name, Role, Value (A); Keyboard (A)',
  },
};

// ---------------------------------------------------------------------------
// 공통 유틸
// ---------------------------------------------------------------------------

function lineAt(content, index) {
  let line = 1;
  for (let i = 0; i < index && i < content.length; i += 1) {
    if (content[i] === '\n') line += 1;
  }
  return line;
}

function isTokenDefinitionFile(filePath) {
  return extname(filePath).toLowerCase() === '.css' && /token/i.test(basename(filePath));
}

function makeViolation(file, index, content, { rule, severity, message, citation, confidence }) {
  return {
    file,
    line: lineAt(content, index),
    rule,
    severity,
    message,
    kwcag: `KWCAG 2.2 ${citation.kwcag}`,
    wcag: `WCAG 2.1 ${citation.wcag}`,
    confidence,
  };
}

// ---------------------------------------------------------------------------
// (a) 하드코딩 색상
// ---------------------------------------------------------------------------

const HEX_COLOR_RE = /#[0-9a-fA-F]{3,8}\b/g;
const RGB_COLOR_RE = /\brgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)/g;
const CUSTOM_PROP_DEF_RE = /^\s*--[\w-]+\s*:/;

/** 매치 위치가 같은 줄의 var(...) 호출 안(폴백 값)에 있는지 확인한다. */
function isInsideVarCall(lineText, matchCol) {
  const before = lineText.slice(0, matchCol);
  const lastVarOpen = before.lastIndexOf('var(');
  if (lastVarOpen === -1) return false;
  const between = before.slice(lastVarOpen);
  return !between.includes(')');
}

function checkHardcodedColors(file, content) {
  if (isTokenDefinitionFile(file)) return [];

  const violations = [];
  const lines = content.split('\n');
  let offset = 0;
  for (const lineText of lines) {
    // 커스텀 프로퍼티 정의(`--krds-foo: #fff;`)는 토큰을 "정의"하는
    // 행위이지 "미사용"이 아니므로 건너뛴다.
    if (!CUSTOM_PROP_DEF_RE.test(lineText)) {
      for (const re of [HEX_COLOR_RE, RGB_COLOR_RE]) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(lineText))) {
          if (isInsideVarCall(lineText, m.index)) continue;
          violations.push(
            makeViolation(file, offset + m.index, content, {
              rule: 'hardcoded-color',
              severity: 'warning',
              message: `KRDS 색상 토큰(var(--krds-color-...)) 대신 하드코딩된 색상 값을 사용했습니다: ${m[0]}`,
              citation: CITATIONS.hardcodedColor,
              confidence: '확정',
            }),
          );
        }
      }
    }
    offset += lineText.length + 1; // '\n'
  }
  return violations;
}

// ---------------------------------------------------------------------------
// 태그 경계 스캐너
//
// JSX 여는 태그는 `onClick={() => doSomething()}`처럼 속성 값 `{...}` 안에
// '>' 문자(화살표 함수의 "=>")를 포함할 수 있다. `[^>]*>` 류 정규식은 이
// '>'에서 태그가 끝난 것으로 잘못 판단해 뒤따르는 속성·자식 텍스트를
// 놓치거나 다음 태그와 뒤섞는다. 이를 피하기 위해 문자열 리터럴(' / ")과
// 중괄호 표현식 깊이를 추적하며 진짜 태그 종료 '>'를 찾는다.
// ---------------------------------------------------------------------------

/** content[ltIndex] === '<' 인 여는 태그의 진짜 종료 '>' 인덱스를 찾는다. */
function findTagEnd(content, ltIndex) {
  let i = ltIndex + 1;
  let braceDepth = 0;
  let quote = null;
  while (i < content.length) {
    const ch = content[i];
    if (quote) {
      if (ch === quote) quote = null;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      i += 1;
      continue;
    }
    if (ch === '{') {
      braceDepth += 1;
      i += 1;
      continue;
    }
    if (ch === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
      i += 1;
      continue;
    }
    if (ch === '<' && braceDepth === 0) {
      // 닫는 '>' 없이 다음 태그가 시작됨: 손상된/미지원 문법으로 보고 중단.
      return -1;
    }
    if (ch === '>' && braceDepth === 0) {
      return i;
    }
    i += 1;
  }
  return -1;
}

/**
 * tagNames(대소문자 구분)에 해당하는 여는 태그를 모두 찾아
 * { tagName, start, tagEnd, attrs, selfClosing } 목록을 반환한다.
 * start는 '<'의 인덱스, tagEnd는 종료 '>'의 인덱스.
 */
function findOpenTags(content, tagNames) {
  const namePattern = tagNames.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const startRe = new RegExp(`<(${namePattern})\\b`, 'g');
  const results = [];
  let m;
  startRe.lastIndex = 0;
  while ((m = startRe.exec(content))) {
    const start = m.index;
    const tagEnd = findTagEnd(content, start);
    if (tagEnd === -1) continue; // 손상된 태그: 건너뜀
    const fullTag = content.slice(start, tagEnd + 1);
    const selfClosing = /\/\s*>$/.test(fullTag);
    const attrs = fullTag.slice(m[0].length, selfClosing ? -2 : -1);
    results.push({ tagName: m[1], start, tagEnd, attrs, selfClosing, fullTag });
  }
  return results;
}

// ---------------------------------------------------------------------------
// (b) 터치 타깃 크기 (휴리스틱)
// ---------------------------------------------------------------------------

const STYLE_ATTR_RE = /\bstyle\s*=\s*(?:\{\{([^}]*)\}\}|"([^"]*)"|'([^']*)')/;
const SIZE_PROP_RE = /\b(width|height|minWidth|minHeight|min-width|min-height)\s*[:=]\s*['"]?(\d+(?:\.\d+)?)(?:px)?['"]?/g;
const TOUCH_TARGET_TAGS = ['button', 'a', 'div', 'span', 'Button', 'Link', 'Pressable', 'TouchableOpacity'];

function checkTouchTargetHeuristic(file, content) {
  const ext = extname(file).toLowerCase();
  if (!['.tsx', '.jsx', '.html'].includes(ext)) return [];

  const violations = [];
  for (const tag of findOpenTags(content, TOUCH_TARGET_TAGS)) {
    const hasPressHandler = /\b(onPress|onClick)\s*=/.test(tag.attrs);
    if (!hasPressHandler) continue;

    const styleMatch = tag.attrs.match(STYLE_ATTR_RE);
    if (!styleMatch) continue;
    const styleBody = styleMatch[1] ?? styleMatch[2] ?? styleMatch[3] ?? '';

    SIZE_PROP_RE.lastIndex = 0;
    let sizeMatch;
    while ((sizeMatch = SIZE_PROP_RE.exec(styleBody))) {
      const prop = sizeMatch[1];
      const value = Number(sizeMatch[2]);
      if (value < 44) {
        violations.push(
          makeViolation(file, tag.start, content, {
            rule: 'small-touch-target',
            severity: 'warning',
            message:
              `onPress/onClick이 있는 요소의 인라인 style에서 ${prop}: ${value}px가 44px 미만입니다 ` +
              '(휴리스틱: 같은 여는 태그 범위만 검사하며 실제 렌더링 크기는 반영하지 않습니다).',
            citation: CITATIONS.touchTarget,
            confidence: '휴리스틱',
          }),
        );
      }
    }
  }
  return violations;
}

// ---------------------------------------------------------------------------
// (c) img/Image alt 부재
// ---------------------------------------------------------------------------

function checkImgAlt(file, content) {
  const ext = extname(file).toLowerCase();
  if (!['.tsx', '.jsx', '.html'].includes(ext)) return [];

  const violations = [];
  for (const tag of findOpenTags(content, ['img', 'Image'])) {
    if (!/\balt\s*=/.test(tag.attrs)) {
      violations.push(
        makeViolation(file, tag.start, content, {
          rule: 'missing-alt',
          severity: 'error',
          message: `<${tag.tagName}> 요소에 alt 속성이 없습니다.`,
          citation: CITATIONS.imgAlt,
          confidence: '확정',
        }),
      );
    }
  }
  return violations;
}

// ---------------------------------------------------------------------------
// (d) button/링크류 텍스트·aria-label 부재 (휴리스틱)
// ---------------------------------------------------------------------------

const INTERACTIVE_LABEL_TAGS = ['button', 'a', 'Button', 'Link'];

function hasAccessibleText(childrenHtml) {
  if (!childrenHtml) return false;
  const stripped = childrenHtml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, ' ') // JSX 주석
    .replace(/<[^>]*>/g, ' ')
    .trim();
  return stripped.length > 0;
}

function checkInteractiveLabel(file, content) {
  const ext = extname(file).toLowerCase();
  if (!['.tsx', '.jsx', '.html'].includes(ext)) return [];

  const violations = [];
  for (const tag of findOpenTags(content, INTERACTIVE_LABEL_TAGS)) {
    const hasAriaLabel = /\baria-label\s*=/.test(tag.attrs) || /\baria-labelledby\s*=/.test(tag.attrs);
    const hasTitle = /\btitle\s*=/.test(tag.attrs);
    if (hasAriaLabel || hasTitle) continue;

    let textOk = false;
    if (!tag.selfClosing) {
      const closeTag = `</${tag.tagName}>`;
      const closeIdx = content.indexOf(closeTag, tag.tagEnd + 1);
      if (closeIdx !== -1) {
        const children = content.slice(tag.tagEnd + 1, closeIdx);
        textOk = hasAccessibleText(children);
      }
    }
    if (textOk) continue;

    violations.push(
      makeViolation(file, tag.start, content, {
        rule: 'missing-accessible-name',
        severity: 'error',
        message:
          `<${tag.tagName}> 요소에 접근 가능한 텍스트나 aria-label이 없습니다 ` +
          '(휴리스틱: 정적 분석으로 자식 텍스트·aria-label 존재만 확인하며, title/상위 컴포넌트가 ' +
          '주입하는 레이블은 감지하지 못할 수 있습니다).',
        citation: CITATIONS.accessibleName,
        confidence: '휴리스틱',
      }),
    );
  }
  return violations;
}

// ---------------------------------------------------------------------------
// (e) <div onClick> 비시맨틱 인터랙션
// ---------------------------------------------------------------------------

function checkNonSemanticDiv(file, content) {
  const ext = extname(file).toLowerCase();
  if (!['.tsx', '.jsx', '.html'].includes(ext)) return [];

  const violations = [];
  for (const tag of findOpenTags(content, ['div'])) {
    if (!/\bonClick\s*=/.test(tag.attrs)) continue;

    const hasRoleButton = /\brole\s*=\s*["']?button["']?/.test(tag.attrs);
    const hasTabIndex = /\btabIndex\s*=/.test(tag.attrs);
    const mitigated = hasRoleButton && hasTabIndex;
    violations.push(
      makeViolation(file, tag.start, content, {
        rule: 'non-semantic-interactive-div',
        severity: mitigated ? 'info' : 'warning',
        message: mitigated
          ? '<div onClick>에 role="button"과 tabIndex가 함께 있어 부분적으로 보완되었지만, 여전히 ' +
            '시맨틱 <button> 사용을 권장합니다.'
          : '<div onClick>은 스크린 리더·키보드 사용자에게 인터랙티브 요소로 인지되지 않습니다. ' +
            '<button> 등 시맨틱 요소를 사용하거나 최소한 role="button"과 tabIndex, 키보드 핸들러를 ' +
            '추가하세요.',
        citation: CITATIONS.nonSemanticInteractive,
        confidence: '확정',
      }),
    );
  }
  return violations;
}

// ---------------------------------------------------------------------------
// 메인
// ---------------------------------------------------------------------------

const SUPPORTED_EXT = new Set(['.tsx', '.jsx', '.html', '.css']);

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const files = args.filter((a) => !a.startsWith('-'));
  const allViolations = [];
  let readErrors = 0;

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!SUPPORTED_EXT.has(ext)) {
      continue; // 지원하지 않는 확장자는 조용히 건너뜀
    }

    let content;
    try {
      content = await readFile(file, 'utf-8');
    } catch (err) {
      readErrors += 1;
      process.stderr.write(`파일을 읽을 수 없습니다: ${file} (${err.code || err.message})\n`);
      continue;
    }

    allViolations.push(
      ...checkHardcodedColors(file, content),
      ...checkTouchTargetHeuristic(file, content),
      ...checkImgAlt(file, content),
      ...checkInteractiveLabel(file, content),
      ...checkNonSemanticDiv(file, content),
    );
  }

  allViolations.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file)));

  console.log(JSON.stringify(allViolations, null, 2));

  if (readErrors > 0) process.exit(2);
  process.exit(allViolations.length > 0 ? 1 : 0);
}

main();
