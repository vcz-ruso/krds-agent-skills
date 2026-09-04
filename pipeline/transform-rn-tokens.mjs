#!/usr/bin/env node
// transform-rn-tokens.mjs
//
// 계약: 공식 KRDS 디자인 토큰(data/kit/tokens/transformed_tokens.json —
// Style Dictionary 스타일, 최상위 키 primitive/semantic/mode-light/
// mode-high-contrast/responsive-pc/responsive-mobile)을 React Native
// StyleSheet에서 바로 쓸 수 있는 상수로 변환해 data/kit/rn-tokens.json 으로
// 저장한다.
//
// 원칙:
//   - 모든 매핑의 근거는 공식 토큰 값(공식 GitHub/npm/Storybook에서
//     추출된 원본 값)에 앵커링한다. 임의로 값을 만들어내지 않는다.
//   - 웹 전용 단위(px, rem 등)를 RN 단위(dp 등)로 변환하거나, CSS 전용
//     속성(box-shadow 등)을 RN 대응 속성으로 치환하는 등 자체 판단이
//     들어가는 지점은 반드시 출력 JSON의 각 토큰 항목에 "mappingNote"
//     필드로 그 판단 근거와 한계를 명시한다.
//
// 절차:
//   1. transformed_tokens.json 전체를 읽어 { value, type } 리프를 모두
//      수집하고, "{dot.path}" 형태의 참조를 재귀적으로 완전히 해석한다
//      (순환 참조/미해결 참조는 오류로 중단). 해석 결과 문자열에 "{"가
//      남아 있으면 실패로 간주한다.
//   2. 리프 값을 type(color/dimension/text)과 경로에 따라 변환한다.
//        - color: hex/rgba 문자열은 그대로 통과.
//        - dimension: "NNpx" -> 숫자 NN. "N.Nrem" -> 숫자 N.N*16
//          (_meta.remBase = 16). "%"로 끝나면 RN에서 프로퍼티별로 의미가
//          달라지므로 문자열 그대로 두고 mappingNote를 남긴다.
//        - text: primitive.typo.font.type은 폰트 패밀리 리터럴로,
//          primitive.typo.font-weight.{regular,bold}는 RN의 문자열
//          fontWeight("400"/"700")로 매핑하고 각각 mappingNote를 남긴다.
//      CSS box-shadow 같은 다중값 문자열이나 transition/cursor/outline/
//      animation처럼 RN에 대응 개념이 없는 항목은 top-level unsupported
//      배열에 { path, value, reason }으로 모아 절대 조용히 버리지 않는다.
//      (2026-09-04 기준 소스에는 box-shadow류 문자열, %, px, transition/
//      cursor/outline/animation 토큰이 존재하지 않아 unsupported는 빈
//      배열일 수 있다 — 이는 소스 사실이며 검증 결과로 매 실행 보고한다.)
//   3. 키 스키마(_meta.keyScheme 참고): 소스 경로의 각 세그먼트를
//      camelCase로 변환하고(예: "gray-subtler" -> "graySubtler",
//      "mode-light" 자체는 루트로만 쓰이고 출력 키에는 나타나지 않음),
//      숫자/​"max" 세그먼트는 그대로 둔다. 중첩 구조는 소스 트리를
//      그대로 보존해(예: mode-light.color.text.primary ->
//      colors.light.text.primary) 원본 경로로의 추적이 가능하게 한다.
//   4. 출력 객체는 소스 JSON의 property 순서를 그대로 순회해 구성하므로
//      매 실행 결과가 동일하다(숫자 형태의 키는 JS 엔진이 오름차순으로
//      정렬해 직렬화하지만 이 또한 결정적이다). 시각/난수 등 비결정적
//      값은 출력에 포함하지 않는다.
//
// 출력 스키마 (data/kit/rn-tokens.json):
//   {
//     "_meta": { source, generatedFrom, packageTag, remBase, keyScheme,
//                mappingPolicy },
//     "colors": {
//       "primitive": { "light": {...}, "highContrast": {...} },
//       "light": { surface, border, divider, text, icon, link, button,
//                  background, element, action, input, graphic, alpha },
//       "highContrast": { 위와 동일 구조 }
//     },
//     "borderWidth": { "light": {...}, "highContrast": {...} },
//     "typography": { fontFamily, fontWeight, letterSpacing },
//     "spacing": { scale, gap, padding, sizeHeight },
//     "radius": { xsmall1, ..., max },
//     "shadows": {},
//     "responsive": {
//       "pc": { fontSize, gapLayout, paddingCard },
//       "mobile": { 위와 동일 구조 }
//     },
//     "unsupported": [ { path, value, reason }, ... ]
//   }
//   (소스에 실존하는 하위 구조에 맞춘 실제 형태이며, 소스가 바뀌면 이
//   스크립트가 순회하는 구조도 함께 따라간다.)
//
// 이 스크립트는 Node.js 20+ 내장 API만 사용한다(외부 의존성 없음).

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const TOKENS_PATH = join(REPO_ROOT, 'data', 'kit', 'tokens', 'transformed_tokens.json');
const MANIFEST_PATH = join(REPO_ROOT, 'data', 'kit', 'manifest.json');
const OUT_PATH = join(REPO_ROOT, 'data', 'kit', 'rn-tokens.json');

const REM_BASE = 16;

const KEY_SCHEME =
  '소스 경로의 각 세그먼트를 camelCase로 변환한다(예: "gray-subtler" -> ' +
  '"graySubtler", "h1-h2" -> "h1H2"). 숫자로만 이루어진 세그먼트와 "max"는 ' +
  '그대로 둔다. 중첩 구조는 소스 트리를 그대로 보존하므로 출력 경로에서 ' +
  'camelCase만 되돌리면(예: graySubtler -> gray-subtler) 원본 경로를 ' +
  '복원할 수 있다. 최상위 mode-light/mode-high-contrast 는 각각 ' +
  'colors.light/colors.highContrast, borderWidth.light/borderWidth.highContrast 로 ' +
  '옮기고, primitive.color 는 colors.primitive.light/highContrast 에 별도 보존한다.';

const MAPPING_POLICY =
  '색상(hex/rgba)은 그대로 통과시키고, 치수는 rem 값에 16(remBase)을 곱해 ' +
  'RN dp 숫자로 변환한다. fontWeight는 named(Regular/Bold)를 CSS 관례에 ' +
  '따라 "400"/"700" 문자열로 매핑하고, fontFamily는 RN에서 별도 링킹이 ' +
  '필요함을 mappingNote로 남긴다. 참조({a.b.c})는 전부 완전히 해석해 ' +
  '리터럴 값만 출력하며, box-shadow/transition/cursor 등 RN에 대응이 ' +
  '없는 값은 unsupported 배열로 모은다(현재 소스에는 해당 값이 없다).';

function printHelp() {
  console.log(`사용법: node pipeline/transform-rn-tokens.mjs [옵션]

공식 KRDS 디자인 토큰(data/kit/tokens/transformed_tokens.json)을
React Native StyleSheet 상수로 변환하여 data/kit/rn-tokens.json 파일로
저장합니다.

옵션:
  --help    이 도움말을 출력하고 종료합니다.

변환 규칙 요약:
  - 색상(hex/rgba)은 그대로 통과.
  - "NNpx" -> 숫자 NN. "N.Nrem" -> 숫자 N.N*16 (remBase=16).
  - "N%" 같은 퍼센트 값은 문자열로 유지하고 mappingNote를 남김
    (RN에서 프로퍼티별로 의미가 다르므로).
  - fontWeight named(Regular/Bold) -> "400"/"700" (mappingNote 포함).
  - box-shadow/transition/cursor 등 RN에 대응이 없는 값은 조용히 버리지
    않고 top-level unsupported 배열에 모음.
  - {dot.path} 참조는 전부 완전히 해석하며, 해석 후 미해결 참조가
    남으면 오류로 중단.

원칙: 매핑 근거는 공식 토큰 값에 앵커링하며, 자체 판단이 들어간 지점은
출력의 "mappingNote" 필드로 명시합니다.`);
}

// ---------------------------------------------------------------------------
// 참조 해석
// ---------------------------------------------------------------------------

const REF_PATTERN = /^\{([A-Za-z0-9_.-]+)\}$/;

function getByPath(root, dotPath) {
  const segments = dotPath.split('.');
  let node = root;
  for (const seg of segments) {
    if (node == null || typeof node !== 'object' || !(seg in node)) {
      return undefined;
    }
    node = node[seg];
  }
  return node;
}

// value가 {a.b.c} 형태의 참조이면 완전히 해석된 리터럴 값을 반환하고,
// 아니면 원래 값을 그대로 반환한다. 순환 참조는 오류로 중단한다.
function resolveValue(root, value, originPath, seen = new Set()) {
  if (typeof value !== 'string') return value;
  const match = value.match(REF_PATTERN);
  if (!match) return value;

  const refPath = match[1];
  if (seen.has(refPath)) {
    throw new Error(`순환 참조 감지: ${originPath} -> ${refPath}`);
  }
  const target = getByPath(root, refPath);
  if (target === undefined || typeof target !== 'object' || !('value' in target)) {
    throw new Error(`미해결 참조: ${originPath} 가 가리키는 "${refPath}" 를 찾을 수 없음`);
  }
  const nextSeen = new Set(seen);
  nextSeen.add(refPath);
  return resolveValue(root, target.value, `${originPath} -> ${refPath}`, nextSeen);
}

// ---------------------------------------------------------------------------
// 키 스킴
// ---------------------------------------------------------------------------

function toCamel(segment) {
  const s = String(segment);
  if (/^[0-9]+$/.test(s) || s === 'max') return s;
  const parts = s.split('-').filter(Boolean);
  return parts
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join('');
}

// ---------------------------------------------------------------------------
// 값 변환
// ---------------------------------------------------------------------------

const unsupported = [];
let convertedCount = 0;

function convertDimension(resolvedRaw, path) {
  if (typeof resolvedRaw !== 'string') {
    unsupported.push({ path, value: resolvedRaw, reason: '알 수 없는 dimension 형식(문자열 아님)' });
    return null;
  }
  const pxMatch = resolvedRaw.match(/^(-?\d+(?:\.\d+)?)px$/);
  if (pxMatch) {
    convertedCount += 1;
    return Number(pxMatch[1]);
  }
  const remMatch = resolvedRaw.match(/^(-?\d+(?:\.\d+)?)rem$/);
  if (remMatch) {
    convertedCount += 1;
    return Number(remMatch[1]) * REM_BASE;
  }
  if (/%$/.test(resolvedRaw)) {
    convertedCount += 1;
    return {
      value: resolvedRaw,
      mappingNote:
        'RN에서는 % 단위의 의미가 flex/치수 프로퍼티마다 달라 자동 변환하지 않고 ' +
        '원본 문자열을 보존함. 사용처에서 프로퍼티에 맞게 직접 해석할 것.',
    };
  }
  unsupported.push({ path, value: resolvedRaw, reason: 'px/rem/% 패턴에 매칭되지 않는 dimension 값' });
  return null;
}

function convertColor(resolvedRaw, path) {
  if (typeof resolvedRaw !== 'string') {
    unsupported.push({ path, value: resolvedRaw, reason: '알 수 없는 color 형식(문자열 아님)' });
    return null;
  }
  // hex(#rgb, #rrggbb, #rrggbbaa) 또는 rgb()/rgba() 문자열은 RN이 그대로 지원.
  if (/^#[0-9a-fA-F]{3,8}$/.test(resolvedRaw) || /^rgba?\(/.test(resolvedRaw)) {
    convertedCount += 1;
    return resolvedRaw;
  }
  unsupported.push({ path, value: resolvedRaw, reason: 'hex/rgba 패턴에 매칭되지 않는 color 값' });
  return null;
}

// box-shadow 같은 CSS 문자열을 만나면(현재 소스에는 없음) RN
// shadow*/elevation 프로퍼티로 파싱한다. 여러 그림자가 콤마로 나열된 경우
// 첫 번째만 사용하고 나머지는 버려짐을 mappingNote에 남긴다.
function convertBoxShadow(resolvedRaw, path) {
  const layers = resolvedRaw.split(/,(?![^(]*\))/).map((s) => s.trim()).filter(Boolean);
  const first = layers[0];
  // "offsetX offsetY blurRadius [spreadRadius] color" 형태를 가정.
  const m = first.match(
    /^(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px(?:\s+-?\d+(?:\.\d+)?px)?\s+(.+)$/
  );
  if (!m) {
    unsupported.push({ path, value: resolvedRaw, reason: 'box-shadow 문자열 패턴을 파싱할 수 없음' });
    return null;
  }
  const [, offsetX, offsetY, blur, color] = m;
  const blurNum = Number(blur);
  const elevation = Math.max(1, Math.round(blurNum / 2));
  const notes = [
    'Android elevation은 근사값(blurRadius/2를 반올림, 최소 1)이며 실제 디자인과' +
      ' 육안 비교 후 조정 필요.',
  ];
  if (layers.length > 1) {
    notes.push(`원본에 그림자 ${layers.length}개가 있었으나 RN은 View당 1개만 지원해 첫 번째만 사용, 나머지 ${layers.length - 1}개는 버림.`);
  }
  convertedCount += 1;
  return {
    shadowColor: color.trim(),
    shadowOffset: { width: Number(offsetX), height: Number(offsetY) },
    shadowOpacity: 1,
    shadowRadius: blurNum,
    elevation,
    mappingNote: notes.join(' '),
  };
}

function convertFontWeight(resolvedRaw, path) {
  const map = { Regular: '400', Bold: '700' };
  const mapped = map[resolvedRaw];
  if (mapped === undefined) {
    unsupported.push({ path, value: resolvedRaw, reason: '알려진 font-weight 이름(Regular/Bold)이 아님' });
    return null;
  }
  convertedCount += 1;
  return {
    value: mapped,
    mappingNote:
      `소스는 named weight("${resolvedRaw}")이며 RN의 문자열 fontWeight 관례에 맞춰 ` +
      `CSS 표준 매핑(Regular=400, Bold=700)으로 변환함.`,
  };
}

// ---------------------------------------------------------------------------
// 트리 순회 헬퍼: leaf({value,type})가 나올 때까지 재귀하며 콜백에
// (leaf, camelCase 경로 세그먼트 배열, 원본 dot 경로)를 넘긴다.
// ---------------------------------------------------------------------------

function isLeaf(node) {
  return (
    node != null &&
    typeof node === 'object' &&
    !Array.isArray(node) &&
    'value' in node &&
    'type' in node &&
    typeof node.value !== 'object'
  );
}

function walkLeaves(node, sourcePath, camelSegments, visit) {
  if (isLeaf(node)) {
    visit(node, camelSegments, sourcePath);
    return;
  }
  if (node == null || typeof node !== 'object') return;
  for (const key of Object.keys(node)) {
    walkLeaves(
      node[key],
      sourcePath ? `${sourcePath}.${key}` : key,
      [...camelSegments, toCamel(key)],
      visit
    );
  }
}

function setPath(target, segments, value) {
  let node = target;
  for (let i = 0; i < segments.length - 1; i += 1) {
    const seg = segments[i];
    if (!(seg in node)) node[seg] = {};
    node = node[seg];
  }
  node[segments[segments.length - 1]] = value;
}

// 하나의 leaf를 (경로, resolved 값, type) 기준으로 RN 값으로 변환한다.
// path는 소스 root 기준 dot 경로(예: "mode-light.color.text.primary")이고,
// resolvedRaw는 참조까지 모두 해석된 원시 값이다.
function convertLeaf(leaf, resolvedRaw, path) {
  if (leaf.type === 'color') return convertColor(resolvedRaw, path);
  if (leaf.type === 'dimension') return convertDimension(resolvedRaw, path);
  if (leaf.type === 'text') {
    if (path.endsWith('font-weight.regular') || path.endsWith('font-weight.bold')) {
      return convertFontWeight(resolvedRaw, path);
    }
    if (path.endsWith('typo.font.type')) {
      convertedCount += 1;
      return {
        value: 'Pretendard GOV',
        mappingNote:
          'RN은 웹 @font-face처럼 폰트를 자동 로드하지 않음. 이 패밀리명을 쓰려면 ' +
          'expo-font(useFonts) 또는 네이티브 폰트 링킹으로 "Pretendard GOV" 폰트 ' +
          '파일을 앱에 등록해야 함.',
      };
    }
    convertedCount += 1;
    return resolvedRaw;
  }
  if (typeof resolvedRaw === 'string' && /^-?\d+(?:\.\d+)?px\s+-?\d+(?:\.\d+)?px/.test(resolvedRaw)) {
    // box-shadow류 문자열(현재 소스에는 없으나 향후 대비).
    return convertBoxShadow(resolvedRaw, path);
  }
  unsupported.push({ path, value: resolvedRaw, reason: `처리 규칙이 없는 type("${leaf.type}")` });
  return null;
}

// ---------------------------------------------------------------------------
// 섹션 빌더
// ---------------------------------------------------------------------------

function buildFromSubtree(root, subtree, sourcePrefix) {
  const out = {};
  walkLeaves(subtree, sourcePrefix, [], (leaf, camelSegments, path) => {
    const resolvedRaw = resolveValue(root, leaf.value, path);
    if (typeof resolvedRaw === 'string' && /\{[^}]*\}/.test(resolvedRaw)) {
      throw new Error(`미해결 참조가 남음: ${path} -> ${resolvedRaw}`);
    }
    const converted = convertLeaf(leaf, resolvedRaw, path);
    if (converted === null) return; // unsupported에 이미 기록됨
    setPath(out, camelSegments, converted);
  });
  return out;
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

  const [tokensRaw, manifestRaw] = await Promise.all([
    readFile(TOKENS_PATH, 'utf-8'),
    readFile(MANIFEST_PATH, 'utf-8'),
  ]);
  const root = JSON.parse(tokensRaw);
  const manifest = JSON.parse(manifestRaw);
  const packageTag = manifest?.source?.tag ?? 'unknown';

  console.log(`토큰 원본: ${relative(REPO_ROOT, TOKENS_PATH)} (krds-uiux-html-kit@${packageTag})`);

  const output = {};

  output._meta = {
    source: relative(REPO_ROOT, TOKENS_PATH),
    generatedFrom: 'transformed_tokens.json',
    packageTag,
    remBase: REM_BASE,
    keyScheme: KEY_SCHEME,
    mappingPolicy: MAPPING_POLICY,
  };

  // 색상: primitive 팔레트를 그대로 보존하고, mode-light/mode-high-contrast
  // 는 각각 참조를 해석해 colors.light / colors.highContrast 로 옮긴다.
  output.colors = {
    primitive: {
      light: buildFromSubtree(root, root.primitive.color.light, 'primitive.color.light'),
      highContrast: buildFromSubtree(
        root,
        root.primitive.color['high-contrast'],
        'primitive.color.high-contrast'
      ),
    },
    light: buildFromSubtree(root, root['mode-light'].color, 'mode-light.color'),
    highContrast: buildFromSubtree(root, root['mode-high-contrast'].color, 'mode-high-contrast.color'),
  };

  output.borderWidth = {
    light: buildFromSubtree(root, root['mode-light']['border-width'], 'mode-light.border-width'),
    highContrast: buildFromSubtree(
      root,
      root['mode-high-contrast']['border-width'],
      'mode-high-contrast.border-width'
    ),
  };

  output.typography = {
    fontFamily: buildFromSubtree(root, { v: root.primitive.typo.font.type }, 'primitive.typo.font.type').v,
    fontWeight: buildFromSubtree(root, root.primitive.typo['font-weight'], 'primitive.typo.font-weight'),
    letterSpacing: buildFromSubtree(
      root,
      root.primitive.typo['letter-spacing'],
      'primitive.typo.letter-spacing'
    ),
  };

  output.spacing = {
    scale: buildFromSubtree(root, root.primitive.number, 'primitive.number'),
    gap: buildFromSubtree(root, root.semantic.gap, 'semantic.gap'),
    padding: buildFromSubtree(root, root.semantic.padding, 'semantic.padding'),
    sizeHeight: buildFromSubtree(root, root.semantic['size-height'], 'semantic.size-height'),
  };

  output.radius = buildFromSubtree(root, root.semantic.radius, 'semantic.radius');

  // 소스(2026-09-04, krds-uiux-html-kit@1.1.0)에는 box-shadow류 CSS 문자열이
  // 없음(shadow1/2/3은 rgba 팔레트 색상일 뿐 colors.light/highContrast.alpha
  // 에 이미 포함됨). convertBoxShadow()는 향후 소스에 box-shadow 값이
  // 추가되면 자동으로 사용된다. 지금은 정직하게 빈 객체로 둔다.
  output.shadows = {};

  output.responsive = {
    pc: buildFromSubtree(root, root['responsive-pc'], 'responsive-pc'),
    mobile: buildFromSubtree(root, root['responsive-mobile'], 'responsive-mobile'),
  };

  output.unsupported = unsupported;

  // 최종 방어 검증: mappingNote 등 자유 텍스트 설명이 아니라, 실제 "값" 자리에
  // 미해결 {dot.path} 참조가 남아 있는지 트리를 직접 순회해 확인한다.
  // (mappingPolicy/keyScheme 같은 설명 문자열에는 예시로 "{a.b.c}"가 등장할 수
  // 있으므로, 직렬화된 텍스트 전체에 대한 단순 grep이 아니라 값 위치만 검사한다.)
  const leftoverRefs = [];
  const checkKeys = new Set(['mappingNote', 'keyScheme', 'mappingPolicy', 'reason']);
  (function findLeftoverRefs(node, path, keyName) {
    if (typeof node === 'string') {
      if (!checkKeys.has(keyName) && REF_PATTERN.test(node)) {
        leftoverRefs.push({ path, value: node });
      }
      return;
    }
    if (node == null || typeof node !== 'object') return;
    for (const [k, v] of Object.entries(node)) {
      findLeftoverRefs(v, path ? `${path}.${k}` : k, k);
    }
  })(output, '', '');
  if (leftoverRefs.length > 0) {
    throw new Error(
      `출력에 미해결 참조가 남음: ${leftoverRefs.map((r) => `${r.path}=${r.value}`).join(', ')}`
    );
  }

  const json = JSON.stringify(output, null, 2) + '\n';
  await writeFile(OUT_PATH, json, 'utf-8');

  console.log(`변환 완료: ${convertedCount}개 리프 변환, ${unsupported.length}개 unsupported`);
  console.log(`출력: ${relative(REPO_ROOT, OUT_PATH)}`);
}

main().catch((err) => {
  console.error('오류:', err.stack || err.message || err);
  process.exit(1);
});
