#!/usr/bin/env node
// extract-types.mjs
//
// 계약: npm 패키지 krds-react의 tarball에 포함된 .d.ts 파일에서
// 컴포넌트별 prop API(이름, 타입, 필수 여부, 설명)를 추출해
// data/types/<Component>.json 으로 저장한다.
//
// 절차:
//   1. `npm pack krds-react@<snapshot.lock.json의 krds-react.version> --json` 을
//      OS 임시 디렉터리(리포지터리 바깥)에서 실행해 tarball(.tgz)을 내려받는다.
//   2. tarball을 같은 임시 디렉터리에 풀고, dist/components/<Component>/ 아래
//      디렉터리 단위로 순회한다 (dist/components/index.d.ts 같은 파일은
//      readdir 시 디렉터리가 아니므로 자연히 건너뛴다).
//   3. 각 컴포넌트 디렉터리에서 `<Component>.types.d.ts` (없으면 `<Component>.d.ts`
//      로 대체하고 경고를 남김)를 TypeScript 컴파일러 API(`ts.createSourceFile`)로
//      파싱해, export된 최상위 interface/type alias를 수집한다.
//   4. 컴포넌트의 실제 진입점(`<Component>.d.ts`)에서 디렉터리 이름과 동일한
//      식별자를 가진 선언(named export, default export가 가리키는 로컬 변수,
//      또는 `typeof X` 로 참조되는 로컬 변수까지 최대 depth 8로 따라감)을 찾고,
//      그 타입 노드를 preorder로 순회해 처음 등장하는 `<X>Props` 형태의 식별자를
//      "주 Props 타입"으로 결정한다. 이 식별자 탐색은 import 문이 아니라 실제
//      타입 사용 위치를 대상으로 하므로, tsc가 흔히 알파벳순으로 정렬하는
//      import 목록에 의해 오염되지 않는다.
//   5. 주 Props 타입을 제외한, 이름이 "Props"로 끝나는 export 타입은
//      compound 서브컴포넌트로 보고 subComponents에 넣는다 (예: Accordion의
//      AccordionItemProps/AccordionHeaderProps/AccordionPanelProps).
//      "Props"로 끝나지 않는 object 형태의 export 타입(예: BreadcrumbItem,
//      AccordionContextValue)은 auxiliaryTypes에, 그 외 해석 불가능한
//      타입(제네릭 유틸리티 타입 등)은 otherTypes에 원문 그대로 넣는다.
//   6. 문자열 리터럴만으로 구성된 union type alias(예: ButtonVariant)는
//      exportedTypes에 값 배열로 넣는다.
//   7. 각 object 타입의 프로퍼티는 재귀적으로 해석한다(interface 상속,
//      type alias의 intersection/union, 로컬에 선언된 다른 export 타입 참조).
//      react 내장 타입(HTMLAttributes, ComponentPropsWithRef 등)처럼 로컬에서
//      해석 불가능한 부분은 원문 그대로 extends 배열에 남긴다. union으로 합쳐진
//      멤버 이름이 여러 갈래에서 서로 다른 타입으로 나타나면(Tag의 variant처럼)
//      " | "로 이어 붙이고 optional은 OR로 합친다(하나라도 optional이면 optional).
//
// 출력 스키마 (data/types/<Component>.json):
//   {
//     "component": "Button",
//     "packageVersion": "1.1.1",
//     "files": ["dist/components/Button/Button.d.ts", "dist/components/Button/Button.types.d.ts"],
//     "primaryTypeName": "ButtonProps" | null,
//     "props": [ { "name": "variant", "type": "ButtonVariant", "optional": true, "doc": null } ],
//     "extends": ["Omit<ComponentPropsWithRef<T>, keyof ButtonOwnProps>"],
//     "polymorphic": true,
//     "exportedTypes": { "ButtonVariant": ["primary", "secondary", ...] },
//     "subComponents": {
//       "AccordionItem": { "typeName": "AccordionItemProps", "props": [...], "extends": [...] }
//     },
//     "auxiliaryTypes": {
//       "AccordionContextValue": { "props": [...], "extends": [...] }
//     },
//     "otherTypes": { "SomeUnresolvableAlias": "<raw type text>" },
//     "rawDts": "<verbatim .types.d.ts 텍스트>"
//   }
//
// dist/components/ 아래의 모든 디렉터리는 각자 <Component>.types.d.ts (또는
// 대체 파일)를 갖고 있으면 "컴포넌트"로 간주해 스킵하지 않는다(1.1.1 기준
// Portal, Dropdown도 포함 — 이들은 최상위 index.d.ts에서 barrel export되지는
// 않지만 자체 타입 파일이 있으므로 추출 대상에 포함하고, 그 사실을 실행 로그의
// 경고로 남긴다). dist/components/index.d.ts 처럼 디렉터리가 아닌 파일은
// readdir(withFileTypes) 단계에서 자연히 걸러진다.
//
// 파싱 실패(예: 파일을 열 수 없거나 AST에서 아무 export도 못 찾음)는 해당
// 컴포넌트에 대해 즉시 에러를 던지며 전체 실행을 중단한다. 그 외 애매한
// 상황(주 Props 타입을 못 찾음, barrel export에 없는 디렉터리 등)은 경고로
// 수집해 마지막에 한 번에 출력한다.

import ts from 'typescript';
import { readFile, writeFile, mkdir, readdir, rm, mkdtemp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(REPO_ROOT, 'data', 'types');
const PACKAGE_NAME = 'krds-react';
const PROPS_SUFFIX = 'Props';
const MAX_RESOLVE_DEPTH = 8;

function printHelp() {
  console.log(`사용법: node pipeline/extract-types.mjs [옵션]

npm 패키지 krds-react의 tarball에 포함된 .d.ts 선언 파일들에서
컴포넌트별 prop API를 추출하여 data/types/<Component>.json 파일로 저장합니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

데이터 소스: pipeline/snapshot.lock.json 의 krds-react.version (npm)
tarball은 OS 임시 디렉터리에 내려받으며, 실행이 끝나면 정리합니다.`);
}

const warnings = [];
function warn(msg) {
  warnings.push(msg);
  console.warn(`경고: ${msg}`);
}

// ---------------------------------------------------------------------------
// npm pack / 압축 해제
// ---------------------------------------------------------------------------

async function packAndExtract(version, workDir) {
  console.log(`npm pack ${PACKAGE_NAME}@${version} 실행 중 (대상: ${workDir}) ...`);
  const { stdout } = await execFileAsync(
    'npm',
    ['pack', `${PACKAGE_NAME}@${version}`, '--pack-destination', workDir, '--json'],
    { cwd: workDir, maxBuffer: 1024 * 1024 * 32 },
  );
  const parsed = JSON.parse(stdout);
  const info = Array.isArray(parsed) ? parsed[0] : parsed;
  const tarballPath = join(workDir, info.filename);

  console.log(`tarball 압축 해제 중: ${info.filename}`);
  await execFileAsync('tar', ['xzf', tarballPath], { cwd: workDir });

  const packageDir = join(workDir, 'package');
  return packageDir;
}

// ---------------------------------------------------------------------------
// TypeScript AST 파싱 유틸
// ---------------------------------------------------------------------------

function parseSource(fileName, text) {
  return ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, /* setParentNodes */ true, ts.ScriptKind.TS);
}

function isExported(node) {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  return !!modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
}

// 최상위 interface/type alias를 이름 -> 노드 로 수집한다. export 여부와
// 무관하게 전부 담는다: export되지 않은 로컬 헬퍼 타입(예: Button.types.d.ts의
// `type ButtonOwnProps = {...}`, export type ButtonProps = ButtonOwnProps & ...
// 처럼 polymorphic props를 합성하는 데 쓰이는 타입)도 resolveTypeNode가 참조를
// 따라갈 수 있어야 프로퍼티 목록이 누락되지 않는다. exportedNames는 별도로
// 반환해, exportedTypes/subComponents/auxiliaryTypes/otherTypes 분류 대상을
// "공개 export만"으로 제한하는 데 사용한다(비공개 헬퍼 타입 자체가 최상위
// 항목으로 노출되지 않도록).
function collectTopLevelDeclarations(sourceFile) {
  const declMap = new Map();
  const exportedNames = new Set();
  for (const stmt of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(stmt)) {
      declMap.set(stmt.name.text, stmt);
      if (isExported(stmt)) exportedNames.add(stmt.name.text);
    } else if (ts.isTypeAliasDeclaration(stmt)) {
      declMap.set(stmt.name.text, stmt);
      if (isExported(stmt)) exportedNames.add(stmt.name.text);
    }
  }
  return { declMap, exportedNames };
}

function jsDocText(node) {
  const tagsAndComments = ts.getJSDocCommentsAndTags(node);
  for (const doc of tagsAndComments) {
    if (ts.isJSDoc(doc) && doc.comment) {
      const text = typeof doc.comment === 'string' ? doc.comment : ts.getTextOfJSDocComment(doc.comment);
      if (text && text.trim()) return text.trim();
    }
  }
  return null;
}

function extractMember(member) {
  if (!ts.isPropertySignature(member) && !ts.isMethodSignature(member)) return null;
  if (!member.name) return null;
  const name = member.name.getText();
  const optional = !!member.questionToken;
  let type;
  if (member.type) {
    type = member.type.getText().replace(/\s+/g, ' ').trim();
  } else if (ts.isMethodSignature(member)) {
    const params = member.parameters.map((p) => p.getText().replace(/\s+/g, ' ').trim()).join(', ');
    type = `(${params}) => any`;
  } else {
    type = 'any';
  }
  const doc = jsDocText(member);
  return { name, type, optional, doc };
}

function mergeResolved(target, addition) {
  for (const m of addition.members) {
    const existing = target.members.find((x) => x.name === m.name);
    if (!existing) {
      target.members.push({ ...m });
    } else {
      if (existing.type !== m.type) {
        const parts = new Set([...existing.type.split(' | '), ...m.type.split(' | ')]);
        existing.type = [...parts].join(' | ');
      }
      existing.optional = existing.optional || m.optional;
      existing.doc = existing.doc || m.doc;
    }
  }
  for (const e of addition.extends) {
    if (!target.extends.includes(e)) target.extends.push(e);
  }
}

// 타입 노드를 재귀적으로 해석해 { members: [...], extends: [...] } 를 반환한다.
// declMap 에 없는 참조(react 내장 타입, Omit<>, ElementType 등)는 extends에
// 원문 그대로 남긴다.
function resolveTypeNode(typeNode, declMap, depth, seen) {
  if (!typeNode || depth > MAX_RESOLVE_DEPTH) return { members: [], extends: [] };

  if (ts.isParenthesizedTypeNode(typeNode)) {
    return resolveTypeNode(typeNode.type, declMap, depth + 1, seen);
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    const members = typeNode.members.map(extractMember).filter(Boolean);
    return { members, extends: [] };
  }

  if (ts.isIntersectionTypeNode(typeNode) || ts.isUnionTypeNode(typeNode)) {
    const acc = { members: [], extends: [] };
    for (const t of typeNode.types) {
      mergeResolved(acc, resolveTypeNode(t, declMap, depth + 1, seen));
    }
    return acc;
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const name = typeNode.typeName.getText();
    if (seen.has(name)) return { members: [], extends: [] };
    const target = declMap.get(name);
    if (!target) {
      return { members: [], extends: [typeNode.getText().replace(/\s+/g, ' ').trim()] };
    }
    const nextSeen = new Set(seen).add(name);
    return resolveDeclaration(target, declMap, depth + 1, nextSeen);
  }

  // 해석 불가능한 노드(맵드 타입, 조건부 타입, keyof 등)는 원문으로 남긴다.
  return { members: [], extends: [typeNode.getText().replace(/\s+/g, ' ').trim()] };
}

function resolveDeclaration(decl, declMap, depth, seen) {
  if (ts.isTypeAliasDeclaration(decl)) {
    return resolveTypeNode(decl.type, declMap, depth, seen);
  }
  if (ts.isInterfaceDeclaration(decl)) {
    const acc = { members: [], extends: [] };
    if (decl.heritageClauses) {
      for (const hc of decl.heritageClauses) {
        for (const t of hc.types) {
          const heritageName = t.expression.getText();
          if (declMap.has(heritageName) && !seen.has(heritageName)) {
            mergeResolved(acc, resolveDeclaration(declMap.get(heritageName), declMap, depth + 1, new Set(seen).add(heritageName)));
          } else {
            acc.extends.push(t.getText().replace(/\s+/g, ' ').trim());
          }
        }
      }
    }
    const ownMembers = decl.members.map(extractMember).filter(Boolean);
    mergeResolved(acc, { members: ownMembers, extends: [] });
    return acc;
  }
  return { members: [], extends: [] };
}

// 문자열 리터럴만으로 구성된 union type alias인지 확인하고, 맞다면 값 배열을 반환한다.
function asStringUnion(decl) {
  if (!ts.isTypeAliasDeclaration(decl)) return null;
  if (!ts.isUnionTypeNode(decl.type)) return null;
  const values = [];
  for (const member of decl.type.types) {
    if (ts.isLiteralTypeNode(member) && ts.isStringLiteral(member.literal)) {
      values.push(member.literal.text);
    } else {
      return null; // 문자열 리터럴이 아닌 멤버가 하나라도 있으면 stringUnion으로 보지 않는다.
    }
  }
  return values.length > 0 ? values : null;
}

// 진입점(<Component>.d.ts)에서 디렉터리 이름과 동일한 식별자의 선언을 찾고,
// 그 타입 노드에서 처음 등장하는 "<X>Props" 식별자를 주 Props 타입으로 판정한다.
function findPrimaryTypeName(entrySource, componentName, propsTypeNames) {
  // 1) 최상위 변수/함수 선언 중 이름이 componentName과 정확히 일치하는 것을 찾는다.
  //    (declare const X: ...; declare function X(...): ...;)
  const localDecls = new Map(); // name -> typeNode (변수 선언의 타입, 지역 별칭 추적용)
  let candidateTypeNode = null;

  function visitTop(stmt) {
    if (ts.isVariableStatement(stmt)) {
      for (const d of stmt.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.type) {
          localDecls.set(d.name.text, d.type);
          if (d.name.text === componentName) candidateTypeNode = d.type;
        }
      }
    } else if (ts.isExportAssignment(stmt) && !stmt.isExportEquals) {
      // export default <expr>;  expr가 로컬에 선언된 componentName 변수를 가리키면 사용.
      if (ts.isIdentifier(stmt.expression) && localDecls.has(stmt.expression.text) && !candidateTypeNode) {
        candidateTypeNode = localDecls.get(stmt.expression.text);
      }
    }
  }
  for (const stmt of entrySource.statements) visitTop(stmt);

  if (!candidateTypeNode) return null;

  // 2) candidateTypeNode 안에서 propsTypeNames에 속한 식별자를 preorder로 찾는다.
  //    로컬 타입 별칭이나 `typeof X` 참조는 한 단계 더 따라간다(최대 MAX_RESOLVE_DEPTH).
  function search(node, depth, seen) {
    if (!node || depth > MAX_RESOLVE_DEPTH) return null;

    if (ts.isTypeQueryNode(node)) {
      const refName = node.exprName.getText();
      if (localDecls.has(refName) && !seen.has(refName)) {
        return search(localDecls.get(refName), depth + 1, new Set(seen).add(refName));
      }
      return null;
    }

    if (ts.isTypeReferenceNode(node)) {
      const name = node.typeName.getText();
      if (propsTypeNames.has(name)) return name;
      // 로컬 타입 별칭(예: PolymorphicButtonComponent)일 수 있으니 entrySource 내부의
      // 다른 type alias 선언을 한 단계 따라간다. entrySource 자체의 로컬 타입 별칭은
      // localTypeAliases에서 조회한다.
      const aliasNode = localTypeAliases.get(name);
      if (aliasNode && !seen.has(name)) {
        return search(aliasNode, depth + 1, new Set(seen).add(name));
      }
      // typeArguments가 있으면 그 안도 탐색(제네릭 함수 타입 등)
      if (node.typeArguments) {
        for (const arg of node.typeArguments) {
          const found = search(arg, depth + 1, seen);
          if (found) return found;
        }
      }
      return null;
    }

    // 컨테이너 노드는 자식들을 순서대로 탐색한다.
    let found = null;
    ts.forEachChild(node, (child) => {
      if (found) return;
      const r = search(child, depth, seen);
      if (r) found = r;
    });
    return found;
  }

  const localTypeAliases = new Map();
  for (const stmt of entrySource.statements) {
    if (ts.isTypeAliasDeclaration(stmt)) localTypeAliases.set(stmt.name.text, stmt.type);
  }

  return search(candidateTypeNode, 0, new Set());
}

function isPolymorphic(entryText, typesText, primaryTypeName, primaryMembers) {
  if (primaryMembers.some((m) => m.name === 'as')) return true;
  if (!primaryTypeName) return false;
  const re = new RegExp(`${primaryTypeName}\\s*<[^>]*extends\\s+ElementType`);
  return re.test(typesText) || re.test(entryText);
}

// ---------------------------------------------------------------------------
// 컴포넌트 1개 처리
// ---------------------------------------------------------------------------

async function processComponent(componentDir, componentName, version) {
  const entryFile = `${componentName}.d.ts`;
  const typesFile = `${componentName}.types.d.ts`;

  const files = [];
  let typesPath = join(componentDir, typesFile);
  let typesRelPath = `dist/components/${componentName}/${typesFile}`;
  let typesText;
  try {
    typesText = await readFile(typesPath, 'utf-8');
    files.push(`dist/components/${componentName}/${entryFile}`, typesRelPath);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    warn(`${componentName}: ${typesFile} 없음, ${entryFile}로 대체`);
    typesPath = join(componentDir, entryFile);
    typesRelPath = `dist/components/${componentName}/${entryFile}`;
    typesText = await readFile(typesPath, 'utf-8');
    files.push(typesRelPath);
  }

  const entryPath = join(componentDir, entryFile);
  const entryText = await readFile(entryPath, 'utf-8');

  const typesSource = parseSource(typesPath, typesText);
  const entrySource = parseSource(entryPath, entryText);

  const { declMap, exportedNames } = collectTopLevelDeclarations(typesSource);
  if (exportedNames.size === 0) {
    throw new Error(`${componentName}: ${typesRelPath}에서 export된 interface/type을 하나도 찾지 못했습니다.`);
  }

  // 1) 문자열 리터럴 union -> exportedTypes
  // (declMap에는 비공개 로컬 헬퍼 타입도 들어있지만, 여기서는 공개 export만 순회한다.
  //  비공개 헬퍼 타입은 resolveTypeNode/resolveDeclaration이 참조를 따라갈 때만 쓰인다.)
  const exportedTypes = {};
  const remaining = new Map(); // 아직 stringUnion으로 분류되지 않은 공개 export 선언들
  for (const name of exportedNames) {
    const decl = declMap.get(name);
    const union = asStringUnion(decl);
    if (union) {
      exportedTypes[name] = union;
    } else {
      remaining.set(name, decl);
    }
  }

  // 2) 주 Props 타입 결정
  const propsTypeNames = new Set(remaining.keys());
  let primaryTypeName = findPrimaryTypeName(entrySource, componentName, propsTypeNames);
  if (!primaryTypeName) {
    // 흔한 명명 규칙(예외 케이스 대비 fallback): <Component>Props, <Component>RootProps
    const fallbacks = [`${componentName}Props`, `${componentName}RootProps`];
    primaryTypeName = fallbacks.find((n) => propsTypeNames.has(n)) || null;
    if (primaryTypeName) {
      warn(`${componentName}: 진입점 AST에서 주 Props 타입을 못 찾아 명명 규칙 fallback(${primaryTypeName})을 사용했습니다.`);
    } else {
      warn(`${componentName}: 주 Props 타입을 결정하지 못했습니다. (후보: ${[...propsTypeNames].join(', ') || '없음'})`);
    }
  }

  // 3) 각 remaining 선언을 primary / subComponents / auxiliaryTypes / otherTypes로 분류
  let props = [];
  let extendsList = [];
  const subComponents = {};
  const auxiliaryTypes = {};
  const otherTypes = {};

  for (const [name, decl] of remaining) {
    const resolved = resolveDeclaration(decl, declMap, 0, new Set([name]));
    const hasShape = resolved.members.length > 0 || resolved.extends.length > 0;

    if (name === primaryTypeName) {
      props = resolved.members;
      extendsList = resolved.extends;
      continue;
    }

    if (!hasShape) {
      otherTypes[name] = decl.getText(typesSource).replace(/\s+/g, ' ').trim();
      continue;
    }

    if (name.endsWith(PROPS_SUFFIX)) {
      const key = name.slice(0, -PROPS_SUFFIX.length) || name;
      subComponents[key] = { typeName: name, props: resolved.members, extends: resolved.extends };
    } else {
      auxiliaryTypes[name] = { props: resolved.members, extends: resolved.extends };
    }
  }

  const polymorphic = isPolymorphic(entryText, typesText, primaryTypeName, props);

  return {
    component: componentName,
    packageVersion: version,
    files,
    primaryTypeName,
    props,
    extends: extendsList,
    polymorphic,
    exportedTypes,
    subComponents,
    auxiliaryTypes,
    otherTypes,
    rawDts: typesText,
  };
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const lockPath = join(__dirname, 'snapshot.lock.json');
  const lock = JSON.parse(await readFile(lockPath, 'utf-8'));
  const version = lock['krds-react'].version;
  console.log(`대상 패키지: ${PACKAGE_NAME}@${version} (npm)`);

  const workDir = await mkdtemp(join(tmpdir(), 'krds-react-extract-'));
  let processed = 0;

  try {
    const packageDir = await packAndExtract(version, workDir);
    const componentsDir = join(packageDir, 'dist', 'components');

    const entries = await readdir(componentsDir, { withFileTypes: true });
    const componentNames = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b));

    console.log(`발견된 컴포넌트 디렉터리: ${componentNames.length}개`);

    // 최상위 barrel(dist/index.d.ts)에 재export되지 않는 디렉터리는 스킵하지
    // 않되(자체 .types.d.ts가 있으면 추출 대상), 공개 API가 아니라는 사실만 경고로 남긴다.
    let indexDtsText = '';
    try {
      indexDtsText = await readFile(join(packageDir, 'dist', 'index.d.ts'), 'utf-8');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      warn('dist/index.d.ts를 찾지 못해 barrel export 여부 확인을 건너뜁니다.');
    }
    if (indexDtsText) {
      for (const componentName of componentNames) {
        const re = new RegExp(`from '\\./components/${componentName}'`);
        if (!re.test(indexDtsText)) {
          warn(`${componentName}: dist/index.d.ts에서 barrel export되지 않음 (공개 API가 아닐 수 있으나, 자체 .types.d.ts가 있어 추출 대상에는 포함함).`);
        }
      }
    }

    await mkdir(OUTPUT_DIR, { recursive: true });
    // 이전 실행 결과(.gitkeep 제외) 정리 — 삭제된 컴포넌트가 남아있지 않도록 함.
    const existing = await readdir(OUTPUT_DIR);
    for (const f of existing) {
      if (f.endsWith('.json')) await rm(join(OUTPUT_DIR, f));
    }

    for (const componentName of componentNames) {
      const componentDir = join(componentsDir, componentName);
      const result = await processComponent(componentDir, componentName, version);
      const outPath = join(OUTPUT_DIR, `${componentName}.json`);
      await writeFile(outPath, JSON.stringify(result, null, 2) + '\n', 'utf-8');
      processed += 1;
      console.log(`  [OK] ${componentName} -> ${relative(REPO_ROOT, outPath)} (primary=${result.primaryTypeName ?? 'null'}, props=${result.props.length})`);
    }
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }

  console.log(`\n완료: ${processed}개 컴포넌트를 data/types/ 에 저장했습니다.`);
  if (warnings.length > 0) {
    console.log(`\n경고 ${warnings.length}건:`);
    for (const w of warnings) console.log(`  - ${w}`);
  }
}

main().catch((err) => {
  console.error('오류:', err.stack || err.message || err);
  process.exit(1);
});
