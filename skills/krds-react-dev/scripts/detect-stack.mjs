#!/usr/bin/env node
// KRDS 스택 감지 스크립트
// 사용법: node detect-stack.mjs [--help]
//   cwd의 package.json을 읽어 react / next / react-native / krds-react
//   의존성 존재 여부를 JSON으로 표준출력에 출력한다.
//   package.json이 없으면 {"detected": null} 을 출력한다.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function printHelp() {
  console.log(`KRDS 스택 감지 스크립트

사용법:
  node detect-stack.mjs [--help]

설명:
  현재 작업 디렉터리(cwd)의 package.json을 읽어 dependencies와
  devDependencies에서 react, next, react-native, krds-react 존재 여부를
  검사하고 결과를 JSON으로 출력한다.
  package.json이 없으면 {"detected": null} 을 출력한다.`);
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

const pkgPath = resolve(process.cwd(), 'package.json');

if (!existsSync(pkgPath)) {
  console.log(JSON.stringify({ detected: null }));
  process.exit(0);
}

let pkg;
try {
  pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
} catch {
  console.log(JSON.stringify({ detected: null }));
  process.exit(0);
}

const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const has = (name) => Object.prototype.hasOwnProperty.call(deps, name);

const result = {
  detected: {
    react: has('react'),
    next: has('next'),
    reactNative: has('react-native'),
    krdsReact: has('krds-react'),
  },
};

console.log(JSON.stringify(result));
