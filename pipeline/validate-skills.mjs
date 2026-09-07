#!/usr/bin/env node
// validate-skills.mjs
//
// 계약: 두 가지를 검증한다.
//
// (1) skills/*/SKILL.md 의 YAML frontmatter
//   - name: 소문자와 하이픈(-)만 사용, 64자 이하
//   - description: 존재해야 하며 1024자 이하
//
// (2) 수기로 작성한 스킬 문서에 포함된 예시 코드 블록의 TypeScript 타입 검증
//   ```tsx / ```ts / ```jsx / ```js 펜스를 추출해 가상 파일로 만들고,
//   TypeScript 컴파일러 API(node_modules/typescript)로 타입 검사한다.
//
// ── (2)의 검증 대상과 제외 근거 ────────────────────────────────────────────
//
// 검증 대상(사람이 직접 쓴 문서 = 오타·환각이 들어갈 수 있는 문서):
//   - skills/krds-react-dev/SKILL.md
//   - skills/krds-react-dev/references/nextjs.md
//   - skills/krds-react-dev/references/tokens.md
//   - skills/krds-react-dev/references/react-native/*.md
//   - skills/krds-a11y-review/SKILL.md
//
// 제외 대상과 근거:
//   - skills/krds-react-dev/references/components/**
//       pipeline/build-references.mjs 가 krds-react 의 Storybook·타입 스냅샷에서
//       자동 생성한다. 예시 코드도 생성원(공식 산출물)에서 그대로 옮겨온 것이라
//       이 스크립트가 검사할 "수기 작성물"이 아니다. 생성 파이프라인 쪽에서
//       원본과의 일치를 보장한다.
//   - skills/krds-a11y-review/references/kwcag-map.md
//       pipeline/build-kwcag-map.mjs 가 자동 생성한다. 위와 같은 이유로 제외.
//   - skills/krds-react-dev/references/patterns/**
//       KRDS 사이트 원문(data/site/**)을 옮긴 문서다. 코드 블록이 있더라도
//       원문 인용이므로 이 저장소가 임의로 타입을 맞출 대상이 아니다.
//
// ── (2)의 검사 환경 ────────────────────────────────────────────────────────
//
// 실제 프로젝트에 준하는 옵션을 쓴다: jsx=react-jsx, moduleResolution=bundler,
// strict=true, target/lib=ES2022+DOM. 미사용 변수(noUnusedLocals/Parameters)는
// 문서 발췌 특성상 흔하므로 에러로 취급하지 않는다.
//
// 모듈 해석 정책:
//   - krds-react: **절대 스텁하지 않는다.** node_modules/krds-react 의 실제
//     .d.ts 에 대해 검사한다. 존재하지 않는 export 를 import 하는 예시를
//     잡아내는 것이 이 검증의 핵심 목적이다.
//   - react / react-dom: 설치되어 있으므로 실제 타입(@types/react 등)을 쓴다.
//   - next/* : 이 저장소에 설치되어 있지 않으므로 **최소 스텁 모듈로 대체한다**
//     (STUBBED_PACKAGES). 따라서 next API 의 시그니처 오류는 이 검증으로
//     잡히지 않는다.
//   - react-native / expo-* / @react-navigation/* : 마찬가지로 미설치이므로
//     **스텁**이다. RN 스타일 객체의 키 오타 등은 잡히지 않는다.
//   - 상대 경로 import('./x', '../x', '*.css', '*.json'): 문서의 코드 블록은
//     단일 파일 발췌이므로 형제 파일이 실재하지 않는다. 이런 지정자도 스텁으로
//     해석하며, 따라서 상대 import 로 끌어온 심볼의 타입 오류는 잡히지 않는다.
//   스텁은 "그 블록이 실제로 import 한 이름만" any 로 내보내는 .d.ts 를
//   그때그때 생성해 붙인다(ambient shorthand 는 상대 경로에 쓸 수 없으므로).
//
// 블록 선택 규칙:
//   - 열 0 에서 시작하는 펜스만 검사한다. 들여쓰기된 펜스는 다른 블록(예:
//     ```markdown 리포트 예시) 안에 중첩된 예시 문자열이므로 검사에서 제외하고
//     건수만 보고한다.
//   - 블록 바로 앞 줄에 `<!-- validate:skip -->` (또는 `<!-- validate:skip: 사유 -->`)
//     주석이 있으면 그 블록을 건너뛴다. 진짜 검사 불가능한 블록(의사코드,
//     부분 발췌)에만 쓰는 최후 수단이다.
//
// skills/ 디렉터리가 아직 존재하지 않을 수 있으므로(다른 작업자가 별도로
// 채워 넣는 영역), 그 경우는 오류가 아니라 "검증 대상 0건"인 정상 종료로
// 처리한다. 검증 대상 문서가 없을 때도 마찬가지로 0건 처리한다.

import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ts from 'typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const SKILLS_DIR = join(ROOT_DIR, 'skills');
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const NAME_MAX_LENGTH = 64;
const DESCRIPTION_MAX_LENGTH = 1024;

// 코드 블록 검증 대상. 디렉터리를 지정하면 그 안의 *.md 를 대상으로 삼는다.
const CODE_TARGETS = [
  { kind: 'file', path: 'skills/krds-react-dev/SKILL.md' },
  { kind: 'file', path: 'skills/krds-react-dev/references/nextjs.md' },
  { kind: 'file', path: 'skills/krds-react-dev/references/tokens.md' },
  { kind: 'dir', path: 'skills/krds-react-dev/references/react-native' },
  { kind: 'file', path: 'skills/krds-a11y-review/SKILL.md' },
];

const CODE_LANGS = new Set(['tsx', 'ts', 'jsx', 'js']);

// 가상 파일이 놓이는 디렉터리(디스크에 만들지 않는다). ROOT_DIR 바로 아래에
// 두어야 node_modules 해석이 실제 설치본을 찾는다.
const VIRTUAL_DIR = join(ROOT_DIR, '__validate_blocks__');

// 미설치 패키지 중 스텁을 허용할 지정자. 여기에 걸리지 않는 패키지는
// 실제 node_modules 로만 해석하므로, krds-react 는 어떤 경우에도 스텁되지 않고
// 오탈자·미존재 export 가 그대로 오류로 드러난다.
const STUBBED_PACKAGES = [
  /^next(\/.*)?$/, // next/font/local, next/link 등 (next 미설치)
  /^react-native(\/.*)?$/, // RN 프리미티브 (react-native 미설치)
  /^expo(-[\w-]+)?(\/.*)?$/, // expo-font 등 (미설치)
  /^@react-navigation\/.+$/, // (미설치)
];

function isStubbedPackage(specifier) {
  return STUBBED_PACKAGES.some((pattern) => pattern.test(specifier));
}

const COMPILER_OPTIONS = {
  target: ts.ScriptTarget.ES2022,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  allowJs: true,
  checkJs: true,
  resolveJsonModule: true,
  skipLibCheck: true,
  noEmit: true,
  // 문서 발췌 특성상 흔한 잡음이므로 에러로 취급하지 않는다.
  noUnusedLocals: false,
  noUnusedParameters: false,
  // 자동 @types 포함을 끄고, 명시적 import 만 해석되게 한다.
  types: [],
};

function printHelp() {
  console.log(`사용법: node pipeline/validate-skills.mjs [옵션]

1) skills/*/SKILL.md 의 frontmatter(name, description)를 검증합니다.
   - name: 소문자와 하이픈만 사용, 64자 이하
   - description: 존재해야 하며 1024자 이하

2) 수기 작성 스킬 문서의 예시 코드 블록(\`\`\`tsx/ts/jsx/js)을 TypeScript로
   타입 검증합니다. krds-react 는 실제 설치본 타입으로 검사하며,
   next/* 와 react-native 는 미설치이므로 최소 스텁 모듈을 사용합니다.
   자동 생성 문서(references/components/, kwcag-map.md)와 사이트 원문 기반
   문서(references/patterns/)는 검증 대상이 아닙니다.

   블록 바로 앞 줄에 <!-- validate:skip --> 주석을 두면 그 블록을 건너뜁니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

skills/ 디렉터리가 없으면 검증 대상 0건으로 정상 종료합니다.`);
}

// 최소한의 YAML frontmatter 파서.
// SKILL.md 는 `---`로 감싼 블록에 단순 key: value 쌍만 사용한다고 가정한다.
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yamlBlock = match[1];
  const result = {};
  for (const rawLine of yamlBlock.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // 앞뒤 따옴표 제거
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

async function findSkillDirs() {
  let entries;
  try {
    entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
  const dirs = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      dirs.push(join(SKILLS_DIR, entry.name));
    }
  }
  return dirs;
}

function validateFrontmatter(skillName, frontmatter) {
  const errors = [];

  if (!frontmatter) {
    errors.push('frontmatter를 찾을 수 없습니다 (--- 로 감싼 YAML 블록 필요).');
    return errors;
  }

  const { name, description } = frontmatter;

  if (!name) {
    errors.push('name 필드가 없습니다.');
  } else {
    if (name.length > NAME_MAX_LENGTH) {
      errors.push(`name 길이가 ${NAME_MAX_LENGTH}자를 초과합니다 (현재 ${name.length}자).`);
    }
    if (!NAME_PATTERN.test(name)) {
      errors.push(`name은 소문자와 하이픈(-)만 사용해야 합니다 (현재 값: "${name}").`);
    }
  }

  if (!description) {
    errors.push('description 필드가 없습니다.');
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.push(`description 길이가 ${DESCRIPTION_MAX_LENGTH}자를 초과합니다 (현재 ${description.length}자).`);
  }

  return errors;
}

// ── 코드 블록 추출 ────────────────────────────────────────────────────────

const SKIP_MARKER = /^<!--\s*validate:skip\s*(?::\s*(.*?))?\s*-->$/;

// 마크다운에서 열 0 펜스 블록을 훑는다.
// 반환: { blocks, nestedCount } — blocks 는 검사 대상 언어의 블록만 담는다.
function extractBlocks(relPath, content) {
  const lines = content.split(/\r?\n/);
  const blocks = [];
  let nestedCount = 0;
  let i = 0;

  while (i < lines.length) {
    const open = lines[i].match(/^(`{3,})\s*([A-Za-z0-9_-]*)\s*$/);
    if (!open) {
      // 들여쓰기된 펜스(중첩 예시)는 건수만 센다.
      const indented = lines[i].match(/^\s+(`{3,})\s*([A-Za-z0-9_-]*)\s*$/);
      if (indented && indented[2] && CODE_LANGS.has(indented[2].toLowerCase())) {
        nestedCount += 1;
      }
      i += 1;
      continue;
    }

    const fence = open[1];
    const lang = (open[2] || '').toLowerCase();
    const openLine = i + 1; // 1-based
    let j = i + 1;
    const body = [];
    while (j < lines.length && !new RegExp(`^\\s{0,3}${fence}\`*\\s*$`).test(lines[j])) {
      body.push(lines[j]);
      j += 1;
    }

    if (CODE_LANGS.has(lang)) {
      // 블록 바로 앞의 마지막 비어있지 않은 줄에서 skip 마커를 찾는다.
      let k = i - 1;
      while (k >= 0 && lines[k].trim() === '') k -= 1;
      const skipMatch = k >= 0 ? lines[k].trim().match(SKIP_MARKER) : null;

      blocks.push({
        file: relPath,
        lang,
        openLine,
        // 블록 첫 줄의 문서상 줄 번호(1-based)
        bodyStartLine: openLine + 1,
        code: body.join('\n'),
        skip: Boolean(skipMatch),
        skipReason: skipMatch ? (skipMatch[1] || '').trim() : '',
      });
    }

    i = j + 1;
  }

  return { blocks, nestedCount };
}

async function collectTargetFiles() {
  const files = [];
  for (const target of CODE_TARGETS) {
    const abs = join(ROOT_DIR, target.path);
    if (target.kind === 'file') {
      try {
        await readFile(abs, 'utf-8');
        files.push(target.path);
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
      }
      continue;
    }
    let entries;
    try {
      entries = await readdir(abs, { withFileTypes: true });
    } catch (err) {
      if (err.code === 'ENOENT') continue;
      throw err;
    }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(`${target.path}/${entry.name}`);
      }
    }
  }
  return files;
}

// ── TypeScript 프로그램 구성 ──────────────────────────────────────────────

function virtualFileName(block, index) {
  const slug = block.file.replace(/[^A-Za-z0-9]+/g, '_');
  const ext = block.lang === 'tsx' || block.lang === 'jsx' ? '.tsx' : '.ts';
  return join(VIRTUAL_DIR, `${String(index).padStart(3, '0')}__${slug}__L${block.openLine}${ext}`);
}

// 블록 소스에서 import 지정자와 바인딩 이름을 수집한다.
// 스텁 대상 모듈에 대해 "실제로 import한 이름만" any 로 내보내는 .d.ts 를
// 만들기 위한 사전 스캔이다(ambient shorthand 로는 상대 경로를 다룰 수 없다).
function scanImportBindings(fileName, code) {
  const scriptKind = fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(fileName, code, ts.ScriptTarget.ES2022, true, scriptKind);
  const specs = new Map();

  const entryFor = (specifier) => {
    if (!specs.has(specifier)) {
      specs.set(specifier, { named: new Set(), hasDefault: false, hasNamespace: false });
    }
    return specs.get(specifier);
  };

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const entry = entryFor(statement.moduleSpecifier.text);
      const clause = statement.importClause;
      if (!clause) continue; // side-effect only import
      if (clause.name) entry.hasDefault = true;
      if (clause.namedBindings) {
        if (ts.isNamespaceImport(clause.namedBindings)) {
          entry.hasNamespace = true;
        } else {
          for (const element of clause.namedBindings.elements) {
            entry.named.add((element.propertyName ?? element.name).text);
          }
        }
      }
    } else if (
      ts.isExportDeclaration(statement) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      const entry = entryFor(statement.moduleSpecifier.text);
      entry.hasNamespace = true;
    }
  }

  return specs;
}

function stubContent(entry) {
  // 네임스페이스 import 만 있으면 모듈 전체를 any 로 돌려준다.
  if (entry.hasNamespace && entry.named.size === 0 && !entry.hasDefault) {
    return 'declare const _m: any;\nexport = _m;\n';
  }
  const lines = ['declare const _m: any;', 'export default _m;'];
  for (const name of entry.named) {
    lines.push(`export declare const ${name}: any;`);
  }
  return `${lines.join('\n')}\n`;
}

function createHost(virtualFiles, stubResolution) {
  const base = ts.createCompilerHost(COMPILER_OPTIONS, true);
  const sourceCache = new Map();

  const host = {
    ...base,
    fileExists: (fileName) => virtualFiles.has(fileName) || base.fileExists(fileName),
    readFile: (fileName) =>
      virtualFiles.has(fileName) ? virtualFiles.get(fileName) : base.readFile(fileName),
    directoryExists: (dirName) =>
      dirName === VIRTUAL_DIR || (base.directoryExists ? base.directoryExists(dirName) : true),
    getSourceFile: (fileName, languageVersion, onError, shouldCreate) => {
      if (virtualFiles.has(fileName)) {
        if (!sourceCache.has(fileName)) {
          sourceCache.set(
            fileName,
            ts.createSourceFile(fileName, virtualFiles.get(fileName), languageVersion, true),
          );
        }
        return sourceCache.get(fileName);
      }
      return base.getSourceFile(fileName, languageVersion, onError, shouldCreate);
    },
    writeFile: () => {},
  };

  // 사전에 만들어 둔 스텁이 있으면 그것으로, 없으면 실제 node_modules 로 해석한다.
  host.resolveModuleNames = (moduleNames, containingFile, _reused, _redirect, options) =>
    moduleNames.map((moduleName) => {
      const stubPath = stubResolution.get(`${containingFile}::${moduleName}`);
      if (stubPath) {
        return {
          resolvedFileName: stubPath,
          extension: ts.Extension.Dts,
          isExternalLibraryImport: false,
        };
      }
      const resolved = ts.resolveModuleName(moduleName, containingFile, options, host);
      return resolved.resolvedModule;
    });

  return host;
}

function formatDiagnostic(diag, blockByFile) {
  const flat = ts.flattenDiagnosticMessageText(diag.messageText, ' ');
  const file = diag.file;
  if (!file || diag.start === undefined) {
    return `  - TS${diag.code}: ${flat}`;
  }
  const block = blockByFile.get(file.fileName);
  const { line, character } = file.getLineAndCharacterOfPosition(diag.start);
  const docLine = block ? block.bodyStartLine + line : line + 1;
  const location = block
    ? `${block.file}:${docLine}:${character + 1} (블록 @L${block.openLine} ${block.lang}, 블록 내 ${line + 1}행)`
    : `${file.fileName}:${line + 1}:${character + 1}`;
  return `  - ${location}\n    TS${diag.code}: ${flat}`;
}

async function checkCodeBlocks() {
  const targetFiles = await collectTargetFiles();

  const allBlocks = [];
  const nestedByFile = new Map();

  for (const relPath of targetFiles) {
    const content = await readFile(join(ROOT_DIR, relPath), 'utf-8');
    const { blocks, nestedCount } = extractBlocks(relPath, content);
    if (nestedCount > 0) nestedByFile.set(relPath, nestedCount);
    allBlocks.push(...blocks);
  }

  const checkedBlocks = allBlocks.filter((b) => !b.skip);
  const skippedBlocks = allBlocks.filter((b) => b.skip);

  const virtualFiles = new Map();
  const stubResolution = new Map(); // `${containingFile}::${specifier}` -> stub 경로

  const blockByFile = new Map();
  checkedBlocks.forEach((block, index) => {
    const fileName = virtualFileName(block, index);
    // `export {}` 를 덧붙여 각 블록을 모듈로 만든다(블록 간 전역 스코프 충돌 방지).
    // 끝에 붙이므로 원본 줄 번호는 그대로 보존된다.
    const source = `${block.code}\nexport {};\n`;
    virtualFiles.set(fileName, source);
    blockByFile.set(fileName, block);

    // 상대 경로 import 와 미설치 패키지 import 에 대해서만 스텁 .d.ts 를 만든다.
    let stubIndex = 0;
    for (const [specifier, entry] of scanImportBindings(fileName, source)) {
      const isRelative = specifier.startsWith('.');
      if (!isRelative && !isStubbedPackage(specifier)) continue;
      const stubPath = join(
        VIRTUAL_DIR,
        `${String(index).padStart(3, '0')}__stub${stubIndex}.d.ts`,
      );
      stubIndex += 1;
      virtualFiles.set(stubPath, stubContent(entry));
      stubResolution.set(`${fileName}::${specifier}`, stubPath);
    }
  });

  const results = new Map(); // relPath -> { checked, errors: string[] }
  for (const relPath of targetFiles) {
    results.set(relPath, { checked: 0, errors: [] });
  }
  for (const block of checkedBlocks) {
    results.get(block.file).checked += 1;
  }

  if (checkedBlocks.length > 0) {
    const host = createHost(virtualFiles, stubResolution);
    const rootNames = [...blockByFile.keys()];
    const program = ts.createProgram(rootNames, COMPILER_OPTIONS, host);

    const diagnostics = [
      ...program.getSyntacticDiagnostics(),
      ...program.getSemanticDiagnostics(),
      ...program.getGlobalDiagnostics(),
    ];

    for (const diag of diagnostics) {
      const owner = diag.file ? blockByFile.get(diag.file.fileName) : undefined;
      const bucket = owner ? results.get(owner.file) : undefined;
      const message = formatDiagnostic(diag, blockByFile);
      if (bucket) {
        bucket.errors.push(message);
      } else {
        // 블록에 귀속되지 않는 진단(설정/스텁 문제)은 전역 오류로 취급한다.
        results.set('(전역)', results.get('(전역)') || { checked: 0, errors: [] });
        results.get('(전역)').errors.push(message);
      }
    }
  }

  return { targetFiles, results, checkedBlocks, skippedBlocks, nestedByFile };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  // 다른 스텁들과의 일관성을 위해 snapshot.lock.json 존재를 확인한다
  // (이 스크립트의 검증 로직 자체는 스냅샷 데이터를 사용하지 않는다).
  const lockPath = join(__dirname, 'snapshot.lock.json');
  await readFile(lockPath, 'utf-8');

  const skillDirs = await findSkillDirs();

  if (skillDirs === null) {
    console.log('skills 디렉터리 없음: 검증 대상 0건');
    process.exit(0);
  }

  let hasError = false;
  let checked = 0;

  console.log('=== frontmatter 검증 ===');

  for (const dir of skillDirs) {
    const skillMdPath = join(dir, 'SKILL.md');
    let content;
    try {
      content = await readFile(skillMdPath, 'utf-8');
    } catch (err) {
      if (err.code === 'ENOENT') continue; // SKILL.md 없는 디렉터리는 건너뜀
      throw err;
    }

    checked += 1;
    const skillName = dir.split('/').pop();
    const frontmatter = parseFrontmatter(content);
    const errors = validateFrontmatter(skillName, frontmatter);

    if (errors.length > 0) {
      hasError = true;
      console.log(`[FAIL] ${skillName}`);
      for (const err of errors) {
        console.log(`  - ${err}`);
      }
    } else {
      console.log(`[OK] ${skillName}`);
    }
  }

  if (checked === 0) {
    console.log('skills/ 아래에 SKILL.md 파일이 없음: 검증 대상 0건');
    process.exit(0);
  }

  console.log('');
  console.log('=== 수기 예시 코드 타입 검증 (tsc) ===');

  const { targetFiles, results, checkedBlocks, skippedBlocks, nestedByFile } =
    await checkCodeBlocks();

  if (targetFiles.length === 0) {
    console.log('검증 대상 문서 없음: 코드 블록 0건');
  } else {
    for (const [relPath, result] of results) {
      if (relPath !== '(전역)' && result.checked === 0) {
        console.log(`[SKIP] ${relPath} — 검사 대상 코드 블록 없음`);
        continue;
      }
      if (result.errors.length > 0) {
        hasError = true;
        console.log(`[FAIL] ${relPath} (블록 ${result.checked}건, 오류 ${result.errors.length}건)`);
        for (const err of result.errors) {
          console.log(err);
        }
      } else {
        console.log(`[OK] ${relPath} (블록 ${result.checked}건)`);
      }
    }

    if (skippedBlocks.length > 0) {
      console.log('');
      console.log('validate:skip 으로 건너뛴 블록:');
      for (const block of skippedBlocks) {
        const reason = block.skipReason ? ` — ${block.skipReason}` : '';
        console.log(`  - ${block.file}:${block.openLine} (${block.lang})${reason}`);
      }
    }

    if (nestedByFile.size > 0) {
      console.log('');
      console.log('중첩(들여쓰기) 코드 펜스 — 다른 블록 안의 예시이므로 검사 제외:');
      for (const [relPath, count] of nestedByFile) {
        console.log(`  - ${relPath}: ${count}건`);
      }
    }

    console.log('');
    console.log(
      `코드 블록 요약: 검사 ${checkedBlocks.length}건 / skip ${skippedBlocks.length}건 / 대상 문서 ${targetFiles.length}개`,
    );
  }

  process.exit(hasError ? 1 : 0);
}

main();
