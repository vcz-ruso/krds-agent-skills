#!/usr/bin/env node
// KRDS 정적 접근성 검사 스크립트 (스텁)
// 사용법: node check-static.mjs [--help]
//   TODO: 대상 파일/디렉터리를 인자로 받아 아래 항목을 검사할 예정.
//     - 하드코딩 색상 값 사용 여부 (KRDS 토큰 미사용)
//     - 디자인 토큰 미사용 스타일
//     - 터치 타깃 크기 기준 미달
//     - KRDS 클래스/컴포넌트 준수 여부

function printHelp() {
  console.log(`KRDS 정적 접근성 검사 스크립트 (스텁)

사용법:
  node check-static.mjs [--help]

설명:
  아래 항목을 정적으로 검사할 예정이다. (현재는 스텁 상태)
    - 하드코딩 색상 값 사용 여부 (KRDS 토큰 미사용)
    - 디자인 토큰 미사용 스타일
    - 터치 타깃 크기 기준 미달
    - KRDS 클래스/컴포넌트 준수 여부

TODO: 실제 검사 로직 구현.`);
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  printHelp();
  process.exit(0);
}

console.log(JSON.stringify({ status: 'not_implemented', violations: [] }));
