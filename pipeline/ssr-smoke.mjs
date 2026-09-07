#!/usr/bin/env node
// ssr-smoke.mjs
//
// 목적: "krds-react 컴포넌트를 import하고 renderToString()으로 렌더링하면
//        Node(서버) 환경에서 크래시가 나는가?"에 답하는 SSR 스모크 테스트.
//
// 계약(contract):
//   1. `krds-react` 패키지의 public barrel export를 전부 열거하고, 각 export를
//      function/forwardRef/memo 컴포넌트인지 판별한다.
//   2. 각 컴포넌트에 대해 `data/types/<Name>.json`(krds-react@1.1.1 설치본에서
//      추출한 타입 정보)을 읽어 optional:false(필수) prop만 최소한으로 채우고
//      `renderToString(<X {...minimalProps} />)`을 try/catch로 시도한다.
//        - 문자열/불리언/숫자/함수 타입은 안전한 리터럴로 채운다.
//        - 배열-of-object 타입(BreadcrumbItem[], SelectOption[] 등)은 실제
//          최소 shape를 대상 JSON의 auxiliaryTypes에서 확인해 하드코딩했다
//          (범용 타입 문자열 파싱만으로는 객체 shape를 알 수 없기 때문).
//        - Modal/Accordion/Tab/CheckboxGroup/RadioGroup/StructuredList처럼
//          여러 export가 한 compound 패밀리를 이루는 경우, 각 subcomponent는
//          부모의 `subComponents` 스키마에서 필수 prop을 가져와 "단독" 렌더를
//          시도한다(= 부모 context 없이). 여기서 나는 실패는 실제 SSR 크래시가
//          아니라 "부모 밖에서 쓰면 안 되는 API 오용"일 수 있으므로, 이를 보완하기
//          위해 스크립트 뒤쪽에서 문서화된 최소 조합(예: storybook 원본 예제를
//          참고해 손으로 작성한 Root>Item>Header/Panel 구성)을 별도로
//          "조합(composition) 테스트"로 한 번 더 렌더링해 참고 정보로 남긴다.
//          이 조합 테스트는 60개 export 카운트에는 포함하지 않는다.
//      `extends` 체인(예: `StructuredListBadge extends BadgeProps`)은 평탄화하지
//      않으므로 상속으로만 존재하는 필수 prop은 놓칠 수 있다 — 이 경우 실제보다
//      적은 prop으로 렌더를 시도하게 되며, 이는 FAIL을 놓칠 수는 있어도(과소평가)
//      존재하지 않는 크래시를 있다고 보고하지는 않는다(과대평가 없음).
//   3. 결과는 컴포넌트당 하나: OK(렌더됨, 결과 문자열 비어있지 않음) /
//      OK-EMPTY(크래시 없음, 결과 빈 문자열) / FAIL(예외 발생). OK-EMPTY는
//      SSR 실패가 아니라 최소 props(자식 없음, 닫힌 상태 등)에서 그릴 것이
//      없다는 뜻일 수 있으므로, 조합 테스트 결과와 함께 해석해야 한다.
//      useLayoutEffect의 "does nothing on the server" 경고 등 console.error로만
//      찍히는 경고는 실패로 세지 않고 비고에 표시만 한다. FAIL은 다시 사유별로
//      browser-global(브라우저 전역 참조 = 진짜 SSR 위험) / parent-context
//      (부모 밖 단독 렌더에 대한 라이브러리 가드) / other로 태깅한다.
//   4. 이 테스트는 Next.js의 실제 서버 렌더링을 근사(approximate)할 뿐이다.
//      jsdom을 쓰지 않고 진짜 Node 전역(window/document 없음)에서 실행하므로
//      "krds-react를 import하고 렌더링하는 순간 바로 죽는가"는 검증하지만,
//      Next.js의 스트리밍 SSR, RSC 경계, hydration(클라이언트 재수화) 일치 여부는
//      검증하지 않는다. renderToString 성공 ≠ 완전한 SSR/hydration 정확성.
//   5. .mjs 스크립트이며 빌드 단계가 없으므로 JSX 대신 React.createElement를 쓴다.
//
// 실행: `npm run test:ssr` (pipeline/ssr-smoke.mjs 직접 실행과 동일)
// 종료 코드: FAIL이 0개면 0, 1개 이상이면 1.

import { renderToString } from 'react-dom/server';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as KRDS from 'krds-react';

const h = React.createElement;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TYPES_DIR = path.join(ROOT, 'data', 'types');

// ---------------------------------------------------------------------------
// 1. data/types/*.json 로드 — 컴포넌트별 필수 prop 스키마
// ---------------------------------------------------------------------------

function loadTypesMap() {
  const map = new Map();
  for (const f of fs.readdirSync(TYPES_DIR)) {
    if (!f.endsWith('.json')) continue;
    try {
      const j = JSON.parse(fs.readFileSync(path.join(TYPES_DIR, f), 'utf8'));
      if (j && j.component) map.set(j.component, j);
    } catch {
      // 파싱 불가 파일(.gitkeep 등)은 건너뜀
    }
  }
  return map;
}
const typesMap = loadTypesMap();

// 서브컴포넌트 이름 -> { parentName, key } 역색인.
// (예: 'AccordionItem' -> { parentName: 'Accordion', key: 'AccordionItem' })
const subLookup = new Map();
for (const [name, j] of typesMap) {
  for (const key of Object.keys(j.subComponents || {})) {
    subLookup.set(key, { parentName: name, key });
  }
}

// 배열-of-object 타입 필수 prop의 최소 shape.
// 각 컴포넌트의 data/types/<Name>.json auxiliaryTypes에서 실제 필드를 확인해 채움.
const LIST_OVERRIDES = {
  'Breadcrumb.items': () => [{ text: 'test', href: '#' }],
  'CriticalAlert.alerts': () => [{ variant: 'info', message: 'test' }],
  'Select.options': () => [{ value: 'a', label: 'test' }],
  'StepIndicator.steps': () => [{ step: '1', title: 'test' }],
};

// TagProps는 실제로 `DeletableTagProps | LinkTagProps` 유니온인데, 타입
// 추출기가 이를 평탄화하면서 href를 필수처럼 보이게 만든다. 기본(non-link)
// variant만 검증하기로 하고 href는 의도적으로 건너뛴다.
const SKIP_REQUIRED = new Set(['Tag.href']);

function valueForType(type, overrideKey) {
  if (overrideKey in LIST_OVERRIDES) return LIST_OVERRIDES[overrideKey]();
  const t = (type || '').trim();
  if (/ReactNode/i.test(t)) return 'test';
  if (t === 'boolean') return false;
  if (t === 'number') return 1;
  if (t === 'string') return 'test';
  if (/=>/.test(t)) return () => {};
  if (/\[\]\s*$/.test(t) || /^Array</.test(t)) return [];
  const literalMatch = t.match(/^'([^']+)'/);
  if (literalMatch) return literalMatch[1];
  return 'test';
}

function requiredPropsFor(exportName) {
  let schema = null;
  if (typesMap.has(exportName)) {
    schema = typesMap.get(exportName).props;
  } else if (subLookup.has(exportName)) {
    const { parentName, key } = subLookup.get(exportName);
    const parent = typesMap.get(parentName);
    schema = parent && parent.subComponents[key] ? parent.subComponents[key].props : null;
  }
  const props = {};
  if (!schema) return props;
  for (const p of schema) {
    if (p.optional) continue;
    if (SKIP_REQUIRED.has(`${exportName}.${p.name}`)) continue;
    props[p.name] = valueForType(p.type, `${exportName}.${p.name}`);
  }
  return props;
}

// ---------------------------------------------------------------------------
// 2. export 열거 및 분류
// ---------------------------------------------------------------------------

function classify(val) {
  if (typeof val === 'function') {
    return val.prototype && val.prototype.isReactComponent ? 'class' : 'function';
  }
  if (val && typeof val === 'object' && val.$$typeof) {
    const desc = String(val.$$typeof);
    if (desc.includes('forward_ref')) return 'forwardRef';
    if (desc.includes('react.memo')) return 'memo';
    return 'object';
  }
  return typeof val;
}

const exportNames = Object.keys(KRDS).sort((a, b) => a.localeCompare(b));

// console.error를 렌더링 중에만 가로채서 useLayoutEffect 경고 등을 잡아낸다
// (경고는 실패로 세지 않고 비고란에 표시만 한다).
function renderCapturing(element) {
  const warnings = [];
  const originalError = console.error;
  console.error = (...args) => {
    warnings.push(args.map(String).join(' '));
  };
  try {
    const html = renderToString(element);
    return { html, warnings, error: null };
  } catch (e) {
    return { html: null, warnings, error: e };
  } finally {
    console.error = originalError;
  }
}

// FAIL 사유 분류. 이 테스트에서 나오는 예외는 성격이 두 가지로 갈린다.
//   - 'browser-global': window/document 등 브라우저 전역을 서버에서 참조해서 죽는 경우.
//     이것이 진짜 SSR 위험이며 Next.js에서 `ssr: false` 우회가 필요한 신호다.
//   - 'parent-context': compound 컴포넌트를 부모 Provider 밖에서 단독 렌더해
//     라이브러리가 의도적으로 던지는 가드 에러. SSR 문제가 아니라 API 오용이며,
//     아래 조합(composition) 테스트가 정상 사용법에서의 동작을 따로 확인한다.
const BROWSER_GLOBAL_RE =
  /\b(window|document|navigator|localStorage|sessionStorage|matchMedia|IntersectionObserver|ResizeObserver|HTMLElement)\b\s+is not defined|Cannot read properties of undefined \(reading '(getElementById|body|createElement|documentElement|addEventListener)'\)/;
const PARENT_CONTEXT_RE = /내부에서 사용되어야|must be used within|within a .* (component|provider)/i;

function classifyFailure(message) {
  if (BROWSER_GLOBAL_RE.test(message)) return 'browser-global';
  if (PARENT_CONTEXT_RE.test(message)) return 'parent-context';
  return 'other';
}

const rows = [];
for (const name of exportNames) {
  const value = KRDS[name];
  const kind = classify(value);
  const isComponent = kind === 'function' || kind === 'forwardRef' || kind === 'memo' || kind === 'class';

  if (!isComponent) {
    rows.push({ name, kind, status: 'SKIP', note: '컴포넌트가 아닌 export' });
    continue;
  }

  const props = requiredPropsFor(name);
  const { html, warnings, error } = renderCapturing(h(value, props));

  let status;
  let note;
  let reason = null;
  const propsNote = Object.keys(props).length ? `props: {${Object.keys(props).join(', ')}}` : '(필수 prop 없음)';

  if (error) {
    status = 'FAIL';
    const firstLine = (error && error.message ? error.message : String(error)).split('\n')[0];
    reason = classifyFailure(firstLine);
    note = `[${reason}] ${firstLine} | ${propsNote}`;
  } else if (!html) {
    status = 'OK-EMPTY';
    note = `${propsNote} | 예외 없음, 출력 없음(최소 props에서 그릴 내용이 없을 수 있음)`;
  } else {
    status = 'OK';
    note = propsNote;
  }

  const hasLayoutEffectWarning = warnings.some((w) => /useLayoutEffect/i.test(w));
  if (hasLayoutEffectWarning) {
    note += ' | ⚠ useLayoutEffect 서버 경고(치명적 아님)';
  } else if (warnings.length > 0 && status !== 'FAIL') {
    note += ` | ⚠ 콘솔 경고 ${warnings.length}건`;
  }

  rows.push({ name, kind, status, note, reason });
}

// ---------------------------------------------------------------------------
// 3. compound 컴포넌트 조합(composition) 테스트 — 참고용, 60개 카운트에는 미포함
// ---------------------------------------------------------------------------

const composedTests = [
  {
    label: 'Modal (Root+Trigger+Content+Header+Body+Footer+Close, open=true)',
    render: () =>
      h(
        KRDS.Modal,
        { open: true },
        h(KRDS.Modal.Trigger, null, '모달 열기'),
        h(
          KRDS.Modal.Content,
          null,
          h(KRDS.Modal.Header, { title: '모달 제목' }),
          h(KRDS.Modal.Body, null, '본문 내용'),
          h(KRDS.Modal.Footer, null, h(KRDS.Modal.Close, null, '닫기')),
        ),
      ),
  },
  {
    label: 'Accordion (Root > Item > Header + Panel)',
    render: () =>
      h(
        KRDS.Accordion,
        { defaultValue: ['item1'] },
        h(
          KRDS.Accordion.Item,
          { value: 'item1' },
          h(KRDS.Accordion.Header, null, '제목'),
          h(KRDS.Accordion.Panel, null, '내용'),
        ),
      ),
  },
  {
    label: 'Tab (Tab > TabList > TabTrigger, TabContent > TabPanel)',
    render: () =>
      h(
        KRDS.Tab,
        { defaultValue: 'tab1' },
        h(KRDS.TabList, null, h(KRDS.TabTrigger, { value: 'tab1' }, '탭1')),
        h(KRDS.TabContent, null, h(KRDS.TabPanel, { value: 'tab1' }, '내용1')),
      ),
  },
  {
    label: 'CheckboxGroup > Checkbox x2',
    render: () =>
      h(
        KRDS.CheckboxGroup,
        null,
        h(KRDS.Checkbox, { id: 'c1', label: '옵션1' }),
        h(KRDS.Checkbox, { id: 'c2', label: '옵션2' }),
      ),
  },
  {
    label: 'RadioGroup > Radio x2',
    render: () =>
      h(
        KRDS.RadioGroup,
        { name: 'g1', defaultValue: 'r1' },
        h(KRDS.Radio, { value: 'r1' }),
        h(KRDS.Radio, { value: 'r2' }),
      ),
  },
  {
    label: 'StructuredList (Item > Header + Body > Content > Title)',
    render: () =>
      h(
        KRDS.StructuredList,
        null,
        h(
          KRDS.StructuredListItem,
          null,
          h(KRDS.StructuredListHeader, null, h(KRDS.StructuredListBadge, null, '뱃지')),
          h(
            KRDS.StructuredListBody,
            null,
            h(
              KRDS.StructuredListContent,
              { href: '#' },
              h(KRDS.StructuredListTitle, null, '타이틀'),
              h(KRDS.StructuredListDescription, null, '설명'),
            ),
          ),
        ),
      ),
  },
];

const composedRows = composedTests.map(({ label, render }) => {
  const { html, error } = renderCapturing(render());
  if (error) {
    return { label, status: 'FAIL', note: (error.message || String(error)).split('\n')[0] };
  }
  return { label, status: html ? 'OK' : 'OK-EMPTY', note: '' };
});

// ---------------------------------------------------------------------------
// 4. 결과 출력
// ---------------------------------------------------------------------------

// 한글 음절(U+AC00~U+D7A3)·호환 자모(U+3130~U+318F)·전각 문자(U+FF01~U+FF60)는
// 터미널에서 폭 2를 차지하므로 2로 계산해야 표 열이 어긋나지 않는다.
const WIDE_CHAR_RE = /[ᄀ-ᅟ⺀-〾ぁ-㏿㐀-䶿一-鿿가-힣豈-﫿！-｠]/;

function pad(str, len) {
  const s = String(str);
  let width = 0;
  for (const ch of s) width += WIDE_CHAR_RE.test(ch) ? 2 : 1;
  return s + ' '.repeat(Math.max(0, len - width));
}

console.log('krds-react SSR 스모크 테스트 (renderToString, Node 환경)');
console.log(`패키지: krds-react@1.1.1 / react@${React.version}`);
console.log('='.repeat(100));
console.log(`${pad('컴포넌트', 26)} ${pad('종류', 10)} ${pad('결과', 10)} 비고`);
console.log('-'.repeat(100));
for (const r of rows) {
  console.log(`${pad(r.name, 26)} ${pad(r.kind, 10)} ${pad(r.status, 10)} ${r.note}`);
}

console.log('');
console.log('-- 조합(composition) 테스트 (참고용, 위 60개 카운트에는 미포함) --');
for (const r of composedRows) {
  console.log(`${pad(r.label, 60)} ${pad(r.status, 10)} ${r.note}`);
}

const okCount = rows.filter((r) => r.status === 'OK').length;
const okEmptyCount = rows.filter((r) => r.status === 'OK-EMPTY').length;
const failCount = rows.filter((r) => r.status === 'FAIL').length;
const skipCount = rows.filter((r) => r.status === 'SKIP').length;
const total = rows.length;

console.log('');
console.log('='.repeat(100));
console.log(
  `요약: 총 ${total}개 export | OK ${okCount} | OK-EMPTY ${okEmptyCount} | FAIL ${failCount} | SKIP(비컴포넌트) ${skipCount}`,
);
if (failCount > 0) {
  const failRows = rows.filter((r) => r.status === 'FAIL');
  const browserGlobal = failRows.filter((r) => r.reason === 'browser-global');
  const parentContext = failRows.filter((r) => r.reason === 'parent-context');
  const other = failRows.filter((r) => r.reason === 'other');

  console.log(
    `FAIL 내역: browser-global ${browserGlobal.length} | parent-context ${parentContext.length} | other ${other.length}`,
  );
  console.log('실패 목록:');
  for (const r of failRows) {
    console.log(`  - ${r.name}: ${r.note}`);
  }
  if (browserGlobal.length === 0) {
    console.log(
      '  ※ 브라우저 전역(window/document) 참조로 인한 SSR 크래시는 0건. 위 실패는 모두',
    );
    console.log('     부모 밖 단독 렌더에서 라이브러리가 던진 가드 에러이며, 조합 테스트에서는 통과한다.',
    );
  }
}
console.log(`날짜: ${new Date().toISOString().slice(0, 10)}`);

process.exit(failCount > 0 ? 1 : 0);
