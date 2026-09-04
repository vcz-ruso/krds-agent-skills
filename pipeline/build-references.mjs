#!/usr/bin/env node
// build-references.mjs
//
// 계약: data/types/<Component>.json (prop API)과 data/storybook/<Component>.json
// (사용 예시·설명)을 합쳐, 컴포넌트별 한국어 레퍼런스 문서를
// skills/krds-react-dev/references/components/<Component>.md 로 생성한다.
// 색인 문서 skills/krds-react-dev/references/components/README.md 도 함께 생성한다.
//
// 절차:
//   1. data/types/*.json 과 data/storybook/*.json 파일명(확장자 제외)의 합집합을
//      컴포넌트 목록으로 삼는다(알파벳순 정렬). data/types에는 있지만
//      data/storybook에는 없는 컴포넌트(Dropdown, Portal)는 "사용 예시" 절 없이
//      생성한다.
//   2. 컴포넌트별로 다음을 병합한다.
//      - Import 절: NON_BARREL_COMPONENTS에 포함된 컴포넌트(Dropdown, MainMenu,
//        Portal — krds-react@1.1.1 dist/index.d.ts 분석 결과 최상위 barrel
//        export에 없음이 확인됨)는 경고 blockquote로 대체한다.
//      - Props 표: data/types의 props(선언 순서 유지)에 data/storybook의
//        argTypes[propName].description(한국어)을 매칭해 "설명" 열을 채우고,
//        없으면 props[].doc(JSDoc), 그마저 없으면 "—"를 쓴다. 필수 여부는
//        optional의 반대다. polymorphic true인 컴포넌트는 표 아래에 `as` prop
//        다형성 안내를 한 줄 추가한다.
//      - 타입 값 절: exportedTypes(문자열 union만 수집된 top-level 타입)를
//        목록으로 나열한다.
//      - 하위 컴포넌트 절: subComponents가 있을 때만, 하위 컴포넌트별 소제목과
//        Props 표를 추가한다. argTypes 매칭 키는 스토리북 관례상
//        "<SubComponent>.<prop>" 형태(예: "MobileTrigger.label")이므로 이를
//        우선 조회하고, 없으면 prop 이름 단독으로도 조회한다.
//      - 사용 예시 절: storybook stories가 있을 때만, 스토리별 소제목 +
//        originalSource를 tsx 코드블록으로 verbatim 삽입한다. originalSource가
//        null인 스토리는 건너뛰고 건수만 파일 끝 주석으로 남긴다.
//   3. 표 셀에 등장하는 "|"는 마크다운 표를 깨뜨리므로 "\|"로 escape한다.
//   4. 생성 결과는 항상 최신 데이터로 덮어쓴다(재실행 가능, 결정적 출력).
//      references/components/.gitkeep은 실제 문서가 생기면 더 이상 필요
//      없으므로 삭제한다.
//
// 이 스크립트는 data/types, data/storybook을 읽기 전용으로만 사용하며,
// 두 디렉터리를 채우는 extract-types.mjs / extract-storybook.mjs와는 독립적으로
// 재실행 가능하다.

import { readFile, readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const TYPES_DIR = join(REPO_ROOT, 'data', 'types');
const STORYBOOK_DIR = join(REPO_ROOT, 'data', 'storybook');
const OUT_DIR = join(REPO_ROOT, 'skills', 'krds-react-dev', 'references', 'components');
const STORYBOOK_VERSION = '9.1.17';

// krds-react@1.1.1의 dist/index.d.ts를 직접 분석해 확인한 결과, 아래 세
// 컴포넌트는 자체 타입 파일(dist/components/<Component>/*.types.d.ts)은
// 있지만 최상위 barrel(dist/index.d.ts)에서 재export되지 않는다. 즉
// `import { X } from 'krds-react'` 로는 접근할 수 없다(내부 전용이거나
// 서브패스 export일 가능성이 있음 — 문서 이용자가 직접 확인해야 함).
const NON_BARREL_COMPONENTS = new Set(['Dropdown', 'MainMenu', 'Portal']);

const CAUTION_BLOCKQUOTE =
  '> ⚠️ 이 컴포넌트는 `krds-react` 패키지 최상위에서 export되지 않는다. 공개 API 여부를 확인한 뒤 사용할 것.';

const KRDS_ATTRIBUTION =
  "본 저작물은 행정안전부에서 2024년 작성하여 공공누리 제1유형으로 개방한 '범정부 UI/UX 디자인시스템(KRDS)'을 이용하였으며, " +
  '해당 저작물은 KRDS 디자인시스템 홈페이지(www.krds.go.kr)에서 무료로 다운받으실 수 있습니다.';

function printHelp() {
  console.log(`사용법: node pipeline/build-references.mjs [옵션]

data/types/<Component>.json (prop API)과 data/storybook/<Component>.json
(사용 예시·설명)을 병합하여 skills/krds-react-dev/references/components/
아래에 컴포넌트별 한국어 레퍼런스 문서(.md)와 색인 문서(README.md)를
생성합니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

데이터 소스: data/types/*.json, data/storybook/*.json (둘 다 읽기 전용)
출력은 실행할 때마다 최신 데이터로 덮어씁니다(재실행 가능, 결정적 출력).`);
}

// ---------------------------------------------------------------------------
// 마크다운 유틸
// ---------------------------------------------------------------------------

/** 표 셀 안에서 "|"가 열 구분자로 오인되지 않도록 escape한다. */
function escapeCell(text) {
  return String(text).replace(/\|/g, '\\|');
}

function mdInlineCode(text) {
  return `\`${text}\``;
}

async function listJsonComponentNames(dir) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  return entries.filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -'.json'.length));
}

async function readJsonIfExists(path) {
  try {
    const text = await readFile(path, 'utf8');
    return JSON.parse(text);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Props 표
// ---------------------------------------------------------------------------

/**
 * props 배열(types.json 선언 순서 유지)과 argTypes(storybook)를 병합해
 * "Prop | 타입 | 필수 | 설명" 마크다운 표를 만든다.
 * keyPrefix가 주어지면(하위 컴포넌트) "<keyPrefix>.<propName>" 키를 먼저
 * 조회하고, 없으면 propName 단독 키로도 조회한다(스토리북 argTypes 관례가
 * 하위 컴포넌트마다 완전히 일관되지는 않기 때문).
 */
function buildPropsTable(props, argTypes, keyPrefix) {
  const lines = ['| Prop | 타입 | 필수 | 설명 |', '| --- | --- | --- | --- |'];
  for (const prop of props) {
    const argType =
      (keyPrefix && argTypes?.[`${keyPrefix}.${prop.name}`]) || argTypes?.[prop.name] || null;
    const description = argType?.description || prop.doc || '—';
    const required = prop.optional ? '아니오' : '예';
    lines.push(
      `| ${mdInlineCode(prop.name)} | ${escapeCell(prop.type)} | ${required} | ${escapeCell(description)} |`,
    );
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 컴포넌트 문서 렌더링
// ---------------------------------------------------------------------------

function buildImportSection(component) {
  if (NON_BARREL_COMPONENTS.has(component)) {
    return CAUTION_BLOCKQUOTE;
  }
  return mdInlineCode(`import { ${component} } from 'krds-react'`);
}

function buildTypeValuesSection(exportedTypes) {
  const names = Object.keys(exportedTypes || {});
  if (names.length === 0) return null;
  const lines = names.map((name) => `- ${name}: ${exportedTypes[name].join(' | ')}`);
  return lines.join('\n');
}

function buildSubComponentsSection(subComponents, argTypes) {
  const names = Object.keys(subComponents || {});
  if (names.length === 0) return null;
  const parts = [];
  for (const name of names) {
    const sub = subComponents[name];
    parts.push(`### ${name}\n\n${buildPropsTable(sub.props, argTypes, name)}`);
  }
  return parts.join('\n\n');
}

function buildUsageSection(stories) {
  if (!stories || stories.length === 0) return null;
  const withSource = stories.filter((s) => s.originalSource !== null);
  const skipped = stories.length - withSource.length;
  if (withSource.length === 0) {
    return skipped > 0 ? `<!-- 원본 소스가 없는 스토리 ${skipped}개는 생략함 -->` : null;
  }
  const parts = withSource.map((story) => `### ${story.name}\n\n\`\`\`tsx\n${story.originalSource}\n\`\`\``);
  if (skipped > 0) {
    parts.push(`<!-- 원본 소스가 없는 스토리 ${skipped}개는 생략함 -->`);
  }
  return parts.join('\n\n');
}

function buildComponentMarkdown(component, types, storybook) {
  const sections = [];

  sections.push(`# ${component}`);
  sections.push(storybook?.description || '(공식 설명 없음)');

  sections.push(`## Import\n\n${buildImportSection(component)}`);

  const argTypes = storybook?.argTypes || {};
  let propsSection = `## Props\n\n${buildPropsTable(types.props, argTypes)}`;
  if (types.polymorphic) {
    propsSection += `\n\n이 컴포넌트는 다형성(polymorphic) 컴포넌트로, ${mdInlineCode('as')} prop에 렌더링할 엘리먼트/컴포넌트 타입을 지정하면 그에 맞는 속성 타입 추론이 적용된다.`;
  }
  sections.push(propsSection);

  const typeValues = buildTypeValuesSection(types.exportedTypes);
  if (typeValues) {
    sections.push(`## 타입 값\n\n${typeValues}`);
  }

  const subComponentsSection = buildSubComponentsSection(types.subComponents, argTypes);
  if (subComponentsSection) {
    sections.push(`## 하위 컴포넌트\n\n${subComponentsSection}`);
  }

  const usageSection = buildUsageSection(storybook?.stories);
  if (usageSection) {
    sections.push(`## 사용 예시\n\n${usageSection}`);
  }

  sections.push('---');
  sections.push(
    `_krds-react@${types.packageVersion} · Storybook ${STORYBOOK_VERSION} 기준 자동 생성 문서. \`npm run build:references\`로 재생성._`,
  );

  return sections.join('\n\n') + '\n';
}

// ---------------------------------------------------------------------------
// README(색인) 렌더링
// ---------------------------------------------------------------------------

function buildReadme(rows) {
  const lines = [];
  lines.push('# 컴포넌트 레퍼런스 색인');
  lines.push('');
  lines.push(
    '이 디렉터리의 문서들은 data/types(prop API)와 data/storybook(사용 예시·설명) 스냅샷에서 ' +
      '`npm run build:references`로 자동 생성된다. 직접 수정하지 말고, 데이터를 갱신한 뒤 다시 생성할 것.',
  );
  lines.push('');
  lines.push('| 컴포넌트 | 하위 컴포넌트 수 | 스토리 수 | 비고 |');
  lines.push('| --- | --- | --- | --- |');
  for (const row of rows) {
    const name = `[${row.component}](./${row.component}.md)`;
    const note = row.nonBarrel ? 'barrel 미노출' : '';
    lines.push(`| ${name} | ${row.subComponentCount} | ${row.storyCount} | ${note} |`);
  }
  lines.push('');
  lines.push('## 출처');
  lines.push('');
  lines.push(KRDS_ATTRIBUTION);
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printHelp();
    return;
  }

  const [typeComponents, storybookComponents] = await Promise.all([
    listJsonComponentNames(TYPES_DIR),
    listJsonComponentNames(STORYBOOK_DIR),
  ]);
  const components = [...new Set([...typeComponents, ...storybookComponents])].sort((a, b) =>
    a.localeCompare(b, 'en'),
  );

  if (components.length === 0) {
    console.warn('경고: data/types, data/storybook 모두 비어 있어 생성할 문서가 없습니다.');
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });

  const readmeRows = [];
  const warnings = [];

  for (const component of components) {
    const types = await readJsonIfExists(join(TYPES_DIR, `${component}.json`));
    const storybook = await readJsonIfExists(join(STORYBOOK_DIR, `${component}.json`));

    if (!types) {
      warnings.push(`${component}: data/types/${component}.json 이 없어 건너뜀 (storybook 데이터만 존재).`);
      continue;
    }

    const markdown = buildComponentMarkdown(component, types, storybook);
    await writeFile(join(OUT_DIR, `${component}.md`), markdown, 'utf8');

    readmeRows.push({
      component,
      subComponentCount: Object.keys(types.subComponents || {}).length,
      storyCount: storybook?.stories?.length || 0,
      nonBarrel: NON_BARREL_COMPONENTS.has(component),
    });
  }

  const readme = buildReadme(readmeRows);
  await writeFile(join(OUT_DIR, 'README.md'), readme, 'utf8');

  // 문서가 실제로 생성되었으니 placeholder .gitkeep은 정리한다.
  await rm(join(OUT_DIR, '.gitkeep'), { force: true });

  console.log(`생성 완료: 컴포넌트 문서 ${readmeRows.length}개 + README.md → ${OUT_DIR}`);
  for (const w of warnings) console.warn(`경고: ${w}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
