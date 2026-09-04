#!/usr/bin/env node
// fetch-kit.mjs
//
// 계약: 공식 KRDS HTML Component Kit(GitHub KRDS-uiux/krds-uiux, 태그는
// pipeline/snapshot.lock.json 의 krds-uiux-html-kit.version)에서
// 디자인 토큰의 원본 소스만 골라 data/kit/ 아래에 그대로(mirroring) 저장한다.
//
// 절차:
//   1. GET /git/refs/tags/<version> → 태그가 가리키는 commit SHA를 얻는다.
//      (태그 자체가 아니라 SHA로 트리를 조회해야 lightweight/annotated
//      태그 여부와 무관하게 안정적으로 동작한다.)
//   2. GET /git/trees/<sha>?recursive=1 → 전체 트리(blob 목록)를 얻는다.
//      truncated:true 이면 저장소가 커서 재귀 트리가 잘린 것이므로 실패 처리한다
//      (이 kit 저장소는 훨씬 작아 실제로는 발생하지 않지만 방어적으로 확인한다).
//   3. 트리에서 아래 기준으로 파일을 선별한다 (SELECT_PATHS 참고).
//   4. 선별된 각 경로를 raw.githubusercontent.com/<repo>/<version>/<path> 에서
//      내려받아 data/kit/<path> 에 그대로 저장한다(디렉터리 구조 보존).
//   5. data/kit/manifest.json 에 출처(repo/tag/commit sha)와 파일 목록,
//      제외한 최상위 디렉터리를 기록한다.
//
// 선별 기준 (수동 조사로 확정, 아래 SELECT_PATHS 에 하드코딩):
//   - tokens/**                     디자인 토큰의 원본 JSON(Figma Tokens 형식
//                                    figma_token.json, Style Dictionary류
//                                    transformed_tokens.json). 토큰의 단일
//                                    진실 공급원이므로 전부 가져온다.
//   - resources/css/token/krds_tokens.css
//                                    빌드된 CSS. ":root { --krds-color-... }"
//                                    형태로 tokens/ JSON과 대응하는 768개의
//                                    전역 --krds-* custom property를 정의한다.
//                                    파일 헤더에 "Do not edit directly"라고
//                                    명시되어 있어 생성 산출물임이 분명하다.
//   - resources/css/common/common.css
//                                    krds_tokens.css를 @import 하고, 그 위에
//                                    font-family-base/transition/box-shadow 등
//                                    krds_tokens.css에는 없는 86개의 추가
//                                    전역 --krds-* custom property를 ":root"
//                                    블록에 더 정의한다. 즉 토큰 계층의 두 번째
//                                    (semantic/base) 레이어이므로 함께 가져온다.
//
// 의도적으로 제외한 것 (SELECT_PATHS에 없는 나머지 전부):
//   - resources/css/component/component.css, output.css
//       컴포넌트 셀렉터(.krds-btn 등) 스코프에 지역 --krds-*--* 변수를
//       정의하는 컴포넌트 구현 CSS. output.css는 사실상
//       krds_tokens.css + common.css + component.css를 이어붙인 번들이라
//       이미 가져온 토큰 파일과 내용이 중복되고, 나머지는 컴포넌트별
//       구현 세부사항이라 "디자인 토큰 소스"의 범위를 벗어난다.
//   - resources/cdn/krds.min.css, krds.min.js
//       위 CSS/JS를 한 번 더 압축·번들링한 배포용 산출물. 토큰 관점에서
//       원본 대비 얻을 정보가 없다.
//   - resources/scss/**
//       component.css/output.css의 Sass 원본. 컴포넌트 구현이 대부분이고,
//       전역 토큰에 해당하는 부분(_root.scss 등)은 이미 컴파일된
//       krds_tokens.css/common.css로 대체 커버된다.
//   - resources/fonts/**, resources/img/**, resources/js/**, html/**
//       폰트/아이콘/이미지 자산과 컴포넌트 마크업 예제. 디자인 토큰이 아니다.
//       html/**, resources/(scss|cdn)/(component 관련)은 다른 작업자가
//       담당하는 skills/krds-react-dev/references/components/** 범위와도
//       겹치므로 이 스크립트는 손대지 않는다.
//   - README.md, package.json
//       저장소 메타데이터.
//
// Node 20+ 내장 fetch만 사용하며 외부 의존성이 없다. GitHub REST API는
// 비인증 상태로 호출한다(이 정도 요청량에서는 rate limit에 걸리지 않는다).

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'data', 'kit');
const REPO = 'KRDS-uiux/krds-uiux';
const REQUEST_DELAY_MS = 100;
const UA = 'Mozilla/5.0 (compatible; krds-agent-skills fetch-kit)';

// 가져올 파일 경로(트리 조회 결과와 대조해 존재를 검증한다).
const SELECT_PATHS = [
  'tokens/figma_token.json',
  'tokens/transformed_tokens.json',
  'resources/css/token/krds_tokens.css',
  'resources/css/common/common.css',
];

// manifest.json에 기록할, 의도적으로 제외한 최상위/주요 디렉터리 목록.
const EXCLUDED = [
  'resources/css/component/ (component.css, output.css — 컴포넌트 구현 CSS, 토큰과 중복)',
  'resources/cdn/ (krds.min.css, krds.min.js — 재압축 배포 번들)',
  'resources/scss/ (Sass 원본 — 컴파일된 CSS로 대체 커버)',
  'resources/fonts/ (폰트 자산)',
  'resources/img/ (아이콘/이미지 자산)',
  'resources/js/ (스크립트)',
  'html/ (컴포넌트 마크업 예제 — 다른 작업자 담당 범위)',
  'README.md, package.json (저장소 메타데이터)',
];

function printHelp() {
  console.log(`사용법: node pipeline/fetch-kit.mjs [옵션]

공식 KRDS HTML Component Kit(GitHub ${REPO})에서 디자인 토큰 소스만
선별해 data/kit/ 디렉터리에 원본 경로 구조 그대로 저장합니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

데이터 소스: pipeline/snapshot.lock.json 의 krds-uiux-html-kit.version (태그)
선별 기준과 제외 목록은 이 스크립트 상단 주석과 data/kit/manifest.json 참고.`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function politeFetch(url, { expect } = {}) {
  await sleep(REQUEST_DELAY_MS);
  let res;
  try {
    res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/vnd.github+json' } });
  } catch (err) {
    throw new Error(`요청 실패: ${url} (${err.message})`);
  }
  if (!res.ok) {
    throw new Error(`HTTP 오류: ${url} → status ${res.status}`);
  }
  if (expect === 'json') {
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error(
        `Content-Type 검증 실패: ${url} 는 application/json 이어야 하지만 "${contentType}" 를 받았습니다.`
      );
    }
  }
  return res;
}

async function fetchJson(url) {
  const res = await politeFetch(url, { expect: 'json' });
  return res.json();
}

async function fetchRaw(url) {
  const res = await politeFetch(url);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const lockPath = join(__dirname, 'snapshot.lock.json');
  const lock = JSON.parse(await readFile(lockPath, 'utf-8'));
  const kitLock = lock['krds-uiux-html-kit'];
  if (!kitLock || !kitLock.version) {
    throw new Error('snapshot.lock.json 에 krds-uiux-html-kit.version 이 없습니다.');
  }
  const tag = kitLock.version;
  console.log(`대상 저장소: ${REPO} @ tag ${tag}`);

  // 1. 태그 → commit SHA
  console.log('1/4 태그 ref 확인 중...');
  const refData = await fetchJson(`https://api.github.com/repos/${REPO}/git/refs/tags/${tag}`);
  const refObj = refData && refData.object;
  if (!refObj || !refObj.sha) {
    throw new Error(`태그 ref 응답 형식이 예상과 다릅니다: ${JSON.stringify(refData)}`);
  }
  let commitSha = refObj.sha;
  if (refObj.type === 'tag') {
    // annotated tag: 태그 객체를 한 번 더 따라가 실제 commit sha를 얻는다.
    const tagObj = await fetchJson(refObj.url);
    if (!tagObj.object || !tagObj.object.sha) {
      throw new Error(`annotated tag 객체에서 commit sha를 찾지 못했습니다: ${JSON.stringify(tagObj)}`);
    }
    commitSha = tagObj.object.sha;
  }
  console.log(`   → commit ${commitSha}`);

  // 2. 재귀 트리
  console.log('2/4 저장소 트리 가져오는 중...');
  const treeData = await fetchJson(`https://api.github.com/repos/${REPO}/git/trees/${commitSha}?recursive=1`);
  if (!Array.isArray(treeData.tree)) {
    throw new Error(`트리 응답 형식이 예상과 다릅니다 (tree 필드 없음): ${JSON.stringify(treeData).slice(0, 200)}`);
  }
  if (treeData.truncated) {
    throw new Error('트리 응답이 truncated=true 입니다. 저장소가 예상보다 커서 recursive=1 조회로 전체를 가져오지 못했습니다.');
  }
  const blobsByPath = new Map();
  for (const entry of treeData.tree) {
    if (entry.type === 'blob') blobsByPath.set(entry.path, entry);
  }
  console.log(`   → blob ${blobsByPath.size}개`);

  // 3. 선별 경로 존재 검증
  console.log('3/4 선별 경로 검증 중...');
  const missing = SELECT_PATHS.filter((p) => !blobsByPath.has(p));
  if (missing.length > 0) {
    throw new Error(
      `다음 경로를 트리에서 찾지 못했습니다: ${missing.join(', ')}. ` +
        `상류 저장소 구조가 바뀌어 SELECT_PATHS를 다시 조사해야 할 수 있습니다.`
    );
  }
  for (const p of SELECT_PATHS) console.log(`   - ${p} (${blobsByPath.get(p).size} bytes, 트리 기준)`);

  // 4. 다운로드 + 저장
  console.log('4/4 파일 다운로드 및 저장 중...');
  await mkdir(OUT_DIR, { recursive: true });

  const files = [];
  for (const relPath of SELECT_PATHS) {
    const rawUrl = `https://raw.githubusercontent.com/${REPO}/${tag}/${relPath}`;
    const buf = await fetchRaw(rawUrl);

    if (relPath.endsWith('.json')) {
      try {
        JSON.parse(buf.toString('utf-8'));
      } catch (err) {
        throw new Error(`JSON 파싱 실패: ${relPath} (${err.message}). 다운로드가 손상되었거나 형식이 바뀌었을 수 있습니다.`);
      }
    }

    const outPath = join(OUT_DIR, relPath);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, buf);
    files.push({ path: relPath, bytes: buf.length });
    console.log(`   [${files.length}/${SELECT_PATHS.length}] ${relPath} 저장 (${buf.length} bytes)`);
  }

  const manifest = {
    source: {
      repo: `https://github.com/${REPO}`,
      tag,
      resolvedCommitSha: commitSha,
    },
    fetchedAt: new Date().toISOString().slice(0, 10),
    files,
    excluded: EXCLUDED,
  };
  const manifestPath = join(OUT_DIR, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');

  console.log(`\n완료: data/kit/ 에 파일 ${files.length}개 + manifest.json 저장`);
}

main().catch((err) => {
  console.error(`\n오류: ${err.message}`);
  process.exit(1);
});
