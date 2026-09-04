#!/usr/bin/env node
// build-kwcag-map.mjs
//
// 계약: data/site/component/component_*.md (component_summary.md 제외) 각각의
// "### 접근성 가이드라인" 절을 파싱해, 컴포넌트별 "규칙 문장 | KWCAG 2.2 조항 |
// WCAG 2.1 SC(등급)" 표를 skills/krds-a11y-review/references/kwcag-map.md 로
// 생성한다.
//
// 원본 구조(component_05_02.md Button에서 확인):
//   ### 접근성 가이드라인
//
//   <규칙 문장(한 문단)>
//
//   <설명 문단(0개 이상, 목록이 풀려 여러 문단으로 쪼개진 경우도 있음)>
//
//   - KWCAG 2.2 <조항명>
//
//   - WCAG 2.1 <SC명> (<등급>)
//   [- WCAG 2.1 <SC명2> (<등급2>) 처럼 같은 규칙에 KWCAG/WCAG 인용이
//    여러 개 붙기도 함]
//
// 즉 절 전체를 빈 줄 기준 문단(block)으로 나누면
//   [규칙 문장] [설명 문단 0개 이상] [인용 블록 1개 이상] 이 하나의 "규칙
// 항목"이고, 이 셋짜리 그룹이 절 끝까지 반복된다. 파싱 알고리즘:
//   1. 절 텍스트를 빈 줄(연속 개행) 기준으로 문단 배열로 만든다.
//   2. "모범 사례" / "피해야 할 사례" 문단은 실제 규칙이 아니라 예시
//      이미지 캡션이므로(component_03_06.md 등에서 확인, 인용이 전혀
//      따라오지 않음) 사전에 제거한다.
//   3. 앞에서부터 순서대로: 인용 블록이 아닌 첫 문단 = 규칙 문장. 이어지는
//      인용 블록이 아닌 문단들은 모두 설명(표에는 쓰지 않음, 부가 정보).
//      그 다음 이어지는 인용 블록들(KWCAG/WCAG)을 모아 하나의 항목으로
//      묶는다. 인용 블록이 하나도 없으면 파싱 경고로 기록한다(목표: 0건 —
//      44개 컴포넌트 문서 전체에서 실측 검증 완료).
//
// 데이터 소스: data/site/component/*.md (읽기 전용)
// 출력: skills/krds-a11y-review/references/kwcag-map.md (실행할 때마다
// 최신 데이터로 덮어씀, 재실행 가능, 결정적 출력)

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const COMPONENT_DIR = join(REPO_ROOT, 'data', 'site', 'component');
const OUT_PATH = join(REPO_ROOT, 'skills', 'krds-a11y-review', 'references', 'kwcag-map.md');

const A11Y_HEADING = '### 접근성 가이드라인';
// 인용이 전혀 따라오지 않는 예시 이미지 캡션 문단(실측 확인: 6건/4건).
const CAPTION_PARAGRAPHS = new Set(['모범 사례', '피해야 할 사례']);

function printHelp() {
  console.log(`사용법: node pipeline/build-kwcag-map.mjs [옵션]

data/site/component/component_*.md (component_summary.md 제외)의
"### 접근성 가이드라인" 절을 파싱하여, 컴포넌트별 "규칙 문장 | KWCAG 2.2 조항 |
WCAG 2.1 SC(등급)" 표를 skills/krds-a11y-review/references/kwcag-map.md 로
생성합니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

데이터 소스: data/site/component/*.md (읽기 전용)
출력은 실행할 때마다 최신 데이터로 덮어씁니다(재실행 가능, 결정적 출력).`);
}

// ---------------------------------------------------------------------------
// 마크다운 유틸
// ---------------------------------------------------------------------------

function escapeCell(text) {
  return String(text).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

async function listComponentFiles() {
  const entries = await readdir(COMPONENT_DIR);
  return entries
    .filter((f) => f.startsWith('component_') && f.endsWith('.md') && f !== 'component_summary.md')
    .sort();
}

/** "# 버튼 (Button)" -> { ko: '버튼', en: 'Button' }. 영문명이 없으면 en은 null. */
function parseTitle(content) {
  const match = content.match(/^# (.+)$/m);
  if (!match) return null;
  const raw = match[1].trim();
  const m2 = raw.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (m2) return { ko: m2[1].trim(), en: m2[2].trim() };
  return { ko: raw, en: null };
}

/** "### 접근성 가이드라인" 절 본문(다음 h1~h3 헤딩 직전까지)을 잘라낸다. */
function extractA11ySection(content) {
  const startMatch = content.match(/^### 접근성 가이드라인\s*$/m);
  if (!startMatch) return null;
  const start = startMatch.index + startMatch[0].length;
  const rest = content.slice(start);
  const nextHeading = rest.match(/^#{1,3}\s/m);
  return nextHeading ? rest.slice(0, nextHeading.index) : rest;
}

function isCitationParagraph(paragraph) {
  return /^- (KWCAG 2\.2|WCAG 2\.1)\s/.test(paragraph);
}

function parseKwcagCitation(paragraph) {
  const m = paragraph.match(/^- KWCAG 2\.2 (.+)$/);
  return m ? m[1].trim() : null;
}

function parseWcagCitation(paragraph) {
  // 등급 "(A)"/"(AA)"/"(AAA)"이 누락된 원본 데이터가 소수 존재한다
  // (component_03_02.md 등 "WCAG 2.1 Info and Relationships" — 등급 없음).
  const m = paragraph.match(/^- WCAG 2\.1 (.+?)(?:\s*\(([A-Za-z]+)\))?$/);
  if (!m) return null;
  return { sc: m[1].trim(), grade: m[2] || null };
}

/**
 * 접근성 절 본문을 문단 배열로 나눈 뒤 [규칙, 설명*, 인용+] 그룹으로 묶는다.
 * 반환: { items: [{rule, kwcag: string[], wcag: {sc,grade}[]}], warnings: string[] }
 */
function parseA11yItems(section, fileLabel) {
  const paragraphs = section
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !CAPTION_PARAGRAPHS.has(p));

  const items = [];
  const warnings = [];
  let i = 0;
  while (i < paragraphs.length) {
    if (isCitationParagraph(paragraphs[i])) {
      warnings.push(`${fileLabel}: 규칙 문장 없이 인용부터 시작함 ("${paragraphs[i].slice(0, 40)}")`);
      i += 1;
      continue;
    }
    const rule = paragraphs[i];
    i += 1;
    // 설명 문단(0개 이상, 목록이 풀려 여러 문단으로 쪼개진 경우 포함)을 인용
    // 블록이 나올 때까지 건너뛴다.
    while (i < paragraphs.length && !isCitationParagraph(paragraphs[i])) {
      i += 1;
    }
    const kwcag = [];
    const wcag = [];
    while (i < paragraphs.length && isCitationParagraph(paragraphs[i])) {
      const p = paragraphs[i];
      const k = parseKwcagCitation(p);
      if (k) kwcag.push(k);
      else {
        const w = parseWcagCitation(p);
        if (w) wcag.push(w);
      }
      i += 1;
    }
    if (kwcag.length === 0 && wcag.length === 0) {
      warnings.push(`${fileLabel}: 규칙 문장에 인용이 붙지 않음 ("${rule.slice(0, 40)}")`);
    }
    items.push({ rule, kwcag, wcag });
  }
  return { items, warnings };
}

// ---------------------------------------------------------------------------
// 메인
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const files = await listComponentFiles();

  const components = []; // { file, title, items }
  const noSection = []; // { file, title }
  const warnings = [];

  for (const file of files) {
    const content = await readFile(join(COMPONENT_DIR, file), 'utf-8');
    const title = parseTitle(content) ?? { ko: file, en: null };
    const label = title.en ? `${title.ko} (${title.en})` : title.ko;

    const section = extractA11ySection(content);
    if (section === null) {
      noSection.push({ file, label });
      continue;
    }

    const { items, warnings: itemWarnings } = parseA11yItems(section, `${file} (${label})`);
    warnings.push(...itemWarnings);
    components.push({ file, label, items });
  }

  const totalRules = components.reduce((sum, c) => sum + c.items.length, 0);

  // 최다 인용 조항 top 5 (KWCAG 조항명 / WCAG SC(등급) 를 한 카운터에서 집계).
  const citationCounts = new Map(); // key: "KWCAG 2.2 <name>" | "WCAG 2.1 <sc> (<grade>)"
  for (const c of components) {
    for (const item of c.items) {
      for (const name of item.kwcag) {
        const key = `KWCAG 2.2 ${name}`;
        citationCounts.set(key, (citationCounts.get(key) || 0) + 1);
      }
      for (const { sc, grade } of item.wcag) {
        const key = `WCAG 2.1 ${sc}${grade ? ` (${grade})` : ''}`;
        citationCounts.set(key, (citationCounts.get(key) || 0) + 1);
      }
    }
  }
  const top5 = [...citationCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5);

  const lines = [];
  lines.push('# KWCAG 2.2 / WCAG 2.1 매핑');
  lines.push('');
  lines.push(
    '> 이 문서는 `data/site/component/component_*.md`의 "### 접근성 가이드라인" 절에서 ' +
      '`npm run build:kwcag` (pipeline/build-kwcag-map.mjs)로 자동 생성됩니다. 직접 수정하지 ' +
      '말고, 원본 데이터를 갱신한 뒤 다시 생성하세요.',
  );
  lines.push('');
  lines.push('## 통계');
  lines.push('');
  lines.push(`- 접근성 가이드라인 절이 있는 컴포넌트 수: ${components.length}개 (전체 컴포넌트 문서 ${files.length}개 중)`);
  lines.push(`- 접근성 가이드라인 절이 없는 컴포넌트 수: ${noSection.length}개`);
  lines.push(`- 규칙 항목 수: ${totalRules}개`);
  lines.push(`- 파싱 경고 수: ${warnings.length}개 (목표: 0)`);
  lines.push('');
  lines.push('### 최다 인용 조항 TOP 5');
  lines.push('');
  if (top5.length === 0) {
    lines.push('(인용 없음)');
  } else {
    lines.push('| 순위 | 조항 | 인용 횟수 |');
    lines.push('| --- | --- | --- |');
    top5.forEach(([name, count], idx) => {
      lines.push(`| ${idx + 1} | ${escapeCell(name)} | ${count} |`);
    });
  }
  lines.push('');

  if (warnings.length > 0) {
    lines.push('### 파싱 경고');
    lines.push('');
    for (const w of warnings) {
      lines.push(`- ${escapeCell(w)}`);
    }
    lines.push('');
  }

  if (noSection.length > 0) {
    lines.push('### 접근성 가이드라인 절이 없는 컴포넌트');
    lines.push('');
    lines.push(
      '아래 문서는 원본 KRDS 사이트에 "접근성" 탭 자체가 없거나 파비콘/스플래시 스크린처럼 ' +
        '접근성 규칙이 별도로 서술되지 않는 컴포넌트다.',
    );
    lines.push('');
    for (const { file, label } of noSection) {
      lines.push(`- ${escapeCell(label)} (\`${file}\`)`);
    }
    lines.push('');
  }

  lines.push('## 컴포넌트별 접근성 규칙');
  lines.push('');
  for (const c of components) {
    lines.push(`### ${c.label}`);
    lines.push('');
    lines.push(`출처: \`data/site/component/${c.file}\``);
    lines.push('');
    if (c.items.length === 0) {
      lines.push('(파싱된 규칙 항목 없음)');
      lines.push('');
      continue;
    }
    lines.push('| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |');
    lines.push('| --- | --- | --- |');
    for (const item of c.items) {
      const kwcagCell = item.kwcag.length > 0 ? item.kwcag.join('; ') : '—';
      const wcagCell =
        item.wcag.length > 0
          ? item.wcag.map(({ sc, grade }) => `${sc}${grade ? ` (${grade})` : ''}`).join('; ')
          : '—';
      lines.push(`| ${escapeCell(item.rule)} | ${escapeCell(kwcagCell)} | ${escapeCell(wcagCell)} |`);
    }
    lines.push('');
  }

  lines.push(
    "본 문서는 행정안전부에서 2024년 작성하여 공공누리 제1유형으로 개방한 '범정부 UI/UX 디자인시스템(KRDS)'의 " +
      '접근성 가이드라인 내용을 이용하였으며, 해당 저작물은 KRDS 디자인시스템 홈페이지(www.krds.go.kr)에서 무료로 ' +
      '다운받으실 수 있습니다.',
  );
  lines.push('');

  await writeFile(OUT_PATH, lines.join('\n'), 'utf-8');

  console.log(`생성 완료: ${OUT_PATH}`);
  console.log(`- 컴포넌트 수(접근성 절 보유): ${components.length}개`);
  console.log(`- 규칙 항목 수: ${totalRules}개`);
  console.log(`- 파싱 경고 수: ${warnings.length}개`);
  if (warnings.length > 0) {
    console.log('경고 상세:');
    for (const w of warnings) console.log(`  - ${w}`);
  }

  process.exit(warnings.length > 0 ? 1 : 0);
}

main();
