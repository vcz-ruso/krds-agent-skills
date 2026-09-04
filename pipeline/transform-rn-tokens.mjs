#!/usr/bin/env node
// transform-rn-tokens.mjs
//
// 계약: 공식 KRDS 디자인 토큰(색상, 타이포그래피, 간격 등)을
// React Native StyleSheet에서 바로 쓸 수 있는 상수로 변환해
// data/kit/rn-tokens.json 으로 저장한다.
//
// 원칙:
//   - 모든 매핑의 근거는 공식 토큰 값(공식 GitHub/npm/Storybook에서
//     추출된 원본 값)에 앵커링한다. 임의로 값을 만들어내지 않는다.
//   - 웹 전용 단위(px, rem 등)를 RN 단위(dp 등)로 변환하거나, CSS 전용
//     속성(box-shadow 등)을 RN 대응 속성으로 치환하는 등 자체 판단이
//     들어가는 지점은 반드시 출력 JSON의 각 토큰 항목에 "mappingNote"
//     필드로 그 판단 근거와 한계를 명시한다.
//
// 이 스크립트는 아직 스텁이며 실제 변환 로직은 구현되지 않았다.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function printHelp() {
  console.log(`사용법: node pipeline/transform-rn-tokens.mjs [옵션]

공식 KRDS 디자인 토큰을 React Native StyleSheet 상수로 변환하여
data/kit/rn-tokens.json 파일로 저장합니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

원칙: 매핑 근거는 공식 토큰 값에 앵커링하며, 자체 판단이 들어간 지점은
출력의 "mappingNote" 필드로 명시합니다.`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const lockPath = join(__dirname, 'snapshot.lock.json');
  const lock = JSON.parse(await readFile(lockPath, 'utf-8'));
  console.log(`대상 패키지: krds-react@${lock['krds-react'].version}, krds-uiux-html-kit@${lock['krds-uiux-html-kit'].version}`);

  console.log('TODO: 미구현');
  process.exit(1);
}

main();
