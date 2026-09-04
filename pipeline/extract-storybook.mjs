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
//   - 이 스크립트는 아직 스텁이며 실제 fetch/파싱 로직은 구현되지 않았다.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function printHelp() {
  console.log(`사용법: node pipeline/extract-storybook.mjs [옵션]

공식 React Storybook에서 컴포넌트별 원본 JSX 예시, argTypes, 설명을 추출하여
data/storybook/<Component>.json 파일로 저장합니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

데이터 소스: pipeline/snapshot.lock.json 의 storybook-react.url`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const lockPath = join(__dirname, 'snapshot.lock.json');
  const lock = JSON.parse(await readFile(lockPath, 'utf-8'));
  console.log(`대상 Storybook: ${lock['storybook-react'].url} (v${lock['storybook-react'].storybookVersion})`);

  console.log('TODO: 미구현');
  process.exit(1);
}

main();
