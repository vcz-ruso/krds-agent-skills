#!/usr/bin/env node
// extract-types.mjs
//
// 계약: npm 패키지 krds-react의 tarball에 포함된 178개의 .d.ts 파일에서
// 컴포넌트별 prop API(이름, 타입, 필수 여부, 설명)를 추출해
// data/types/<Component>.json 으로 저장한다.
//
// 절차:
//   1. `npm pack krds-react@<snapshot.lock.json의 krds-react.version>` 을 실행해
//      tarball(.tgz)을 로컬에 내려받는다.
//   2. tarball을 임시 디렉터리에 풀고, dist/components/**/*.types.d.ts 패턴에
//      해당하는 선언 파일들을 순회한다.
//   3. 각 파일의 TypeScript AST(또는 정규식 기반 파싱)에서 컴포넌트 Props
//      interface/type을 찾아 prop 이름, 타입, optional 여부, JSDoc 설명을
//      추출한다.
//   4. 컴포넌트 단위로 그룹핑해 data/types/<Component>.json 에 기록한다.
//
// 이 스크립트는 아직 스텁이며 실제 npm pack/파싱 로직은 구현되지 않았다.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function printHelp() {
  console.log(`사용법: node pipeline/extract-types.mjs [옵션]

npm 패키지 krds-react의 tarball에 포함된 .d.ts 선언 파일들에서
컴포넌트별 prop API를 추출하여 data/types/<Component>.json 파일로 저장합니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

데이터 소스: pipeline/snapshot.lock.json 의 krds-react.version (npm)`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const lockPath = join(__dirname, 'snapshot.lock.json');
  const lock = JSON.parse(await readFile(lockPath, 'utf-8'));
  console.log(`대상 패키지: krds-react@${lock['krds-react'].version} (npm)`);

  console.log('TODO: 미구현');
  process.exit(1);
}

main();
