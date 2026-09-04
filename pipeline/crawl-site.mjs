#!/usr/bin/env node
// crawl-site.mjs
//
// 계약: krds.go.kr의 컴포넌트·패턴·스타일 문서 페이지를 수집해
// data/site/ 아래에 저장한다.
//
// URL 규칙: html/site/<section>/<section>_<NN>[_<MM>].html
//   예) html/site/component/component_01.html,
//       html/site/component/component_01_02.html
//
// 주의사항:
//   - 사이트 본문 상당 부분이 클라이언트 사이드 JS로 렌더링되기 때문에
//     정적 fetch만으로는 실제 콘텐츠를 얻을 수 없는 페이지가 있다.
//     이런 구간은 Orca 내장 브라우저(orca-cli 스킬)로 페이지를 열어
//     렌더링이 끝난 DOM을 스냅샷/추출하는 수동 보조 단계가 필요하다.
//   - 자동 수집(정적 fetch)과 수동 보조(브라우저 렌더링) 단계를 명확히
//     구분해 어떤 페이지가 어느 경로로 수집되었는지 기록해야 한다.
//
// 이 스크립트는 아직 스텁이며 실제 크롤링 로직은 구현되지 않았다.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function printHelp() {
  console.log(`사용법: node pipeline/crawl-site.mjs [옵션]

krds.go.kr의 컴포넌트, 패턴, 스타일 문서 페이지를 수집하여
data/site/ 디렉터리에 저장합니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

URL 규칙: html/site/<section>/<section>_<NN>[_<MM>].html
데이터 소스: pipeline/snapshot.lock.json 의 site.base

참고: JS 렌더링 영역은 정적 fetch로 수집할 수 없어 Orca 내장 브라우저를
사용한 수동 보조 단계가 필요합니다.`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const lockPath = join(__dirname, 'snapshot.lock.json');
  const lock = JSON.parse(await readFile(lockPath, 'utf-8'));
  console.log(`대상 사이트: ${lock.site.base}`);

  console.log('TODO: 미구현');
  process.exit(1);
}

main();
