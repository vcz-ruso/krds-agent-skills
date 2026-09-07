# KRDS Next.js(App Router) 관용구

krds-react 컴포넌트를 Next.js App Router 프로젝트에 통합할 때의 관용구를 정리한다. krds-react는 39종 컴포넌트 대부분이 내부적으로 React Context, `useState`/`useEffect`, DOM 이벤트 핸들러(`onClick`, `onChange` 등)를 사용하는 **클라이언트 컴포넌트 라이브러리**라는 전제로 작성했다 — `references/components/` 아래 각 컴포넌트 문서의 prop에 콜백(`onChange`, `onClick` 등)과 상태 제어 prop이 존재하는 것이 이 전제의 근거다. 즉 krds-react 컴포넌트를 직접 렌더링하는 파일이나 그 상위 트리는 `'use client'` 경계 안에 있어야 한다.

## 1. 서버/클라이언트 경계 긋는 법

App Router의 기본 원칙은 "가능한 한 서버에 남기고, 상호작용이 필요한 리프(leaf)만 클라이언트로 내린다"이다. krds-react를 쓸 때도 페이지 전체를 `'use client'`로 만들지 않는다.

- **페이지(`page.tsx`)는 서버 컴포넌트로 유지**하고, 데이터 페칭·메타데이터·정적 텍스트를 담당한다.
- **인터랙티브 섹션만 별도 클라이언트 컴포넌트로 분리**해 krds-react 컴포넌트를 그 안에서만 사용한다.
- 서버 컴포넌트에서 클라이언트 컴포넌트로는 **직렬화 가능한 값만** props로 전달한다(함수·클래스 인스턴스 불가). 이벤트 핸들러가 필요하면 클라이언트 컴포넌트 내부에서 정의한다.

```tsx
// app/notice/page.tsx — 서버 컴포넌트: 데이터 페칭 + 정적 레이아웃
import { NoticeFilterPanel } from './notice-filter-panel';
import { getNotices } from './data'; // 프로젝트의 서버 전용 데이터 페치 함수

export default async function NoticePage() {
  const notices = await getNotices(); // 서버에서 직접 fetch

  return (
    <main>
      <h1>공지사항</h1>
      {/* 인터랙티브 부분만 클라이언트 컴포넌트로 위임 */}
      <NoticeFilterPanel initialNotices={notices} />
    </main>
  );
}
```

```tsx
// app/notice/notice-filter-panel.tsx — 클라이언트 경계
'use client';

import { useState } from 'react';
// Dropdown은 barrel 미노출 컴포넌트다(references/components/README.md 참고) — 선택 UI는 Select를 쓴다
import { Select, TextInput, Button } from 'krds-react';

type Notice = { id: number; title: string }; // 실제 프로젝트에서는 서버 컴포넌트와 공유하는 타입을 import

export function NoticeFilterPanel({ initialNotices }: { initialNotices: Notice[] }) {
  const [keyword, setKeyword] = useState('');

  return (
    <div>
      {/* krds-react 입력류의 onChange는 DOM 이벤트가 아니라 값(string)을 직접 넘긴다 */}
      <TextInput value={keyword} onChange={(value) => setKeyword(value)} placeholder="검색어 입력" />
      <Select label="분류" options={[{ value: 'all', label: '전체' }]} />
      <Button onClick={() => {/* 필터링 */}}>검색</Button>
      {/* 목록 렌더링 */}
    </div>
  );
}
```

경계를 최대한 아래로 내리면 초기 HTML은 서버에서 렌더링되고, krds-react의 JS 번들은 실제로 상호작용이 필요한 부분에만 로드된다. 레이아웃(`layout.tsx`)도 마찬가지로 헤더/푸터처럼 정적인 부분은 서버 컴포넌트로 두고, `Header`/`SideNavigation`처럼 열림·닫힘 상태나 이벤트를 갖는 컴포넌트를 사용하는 지점에서만 `'use client'` 하위 컴포넌트로 감싼다.

## 2. CSS 로드

krds-react는 컴포넌트 스타일을 별도 CSS 번들로 제공하는 CSS-in-JS가 아닌 라이브러리다. 스냅샷 기준 버전(`krds-react@1.1.1`)의 `package.json` `exports`에는 `"./dist/index.css"`와 별칭 `"./styles"`가 모두 선언되어 있어(설치본에서 직접 확인) 아래 두 import 경로가 유효하다. App Router에서는 root layout에서 전역으로 한 번만 import한다.

```tsx
// app/layout.tsx
import 'krds-react/dist/index.css'; // 'krds-react/styles'도 동일 파일을 가리킨다 (exports 별칭)
import './globals.css'; // 프로젝트 전역 스타일(폰트 등)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

- CSS import는 **root layout 한 곳**에만 둔다. 페이지별·컴포넌트별로 중복 import하지 않는다(번들 중복, 순서 꼬임 방지).
- krds-react의 CSS는 `data/kit/resources/css/token/krds_tokens.css`(디자인 토큰)와 `data/kit/resources/css/common/common.css`(공통 스타일)에 대응하는 값들을 기반으로 빌드되어 있다고 가정한다. 별도로 `krds_tokens.css`를 직접 import해서 프로젝트 자체 CSS(모듈 CSS, Tailwind 설정 등)에서 `var(--krds-...)`를 참조하는 것은 가능하며 권장된다 — `references/tokens.md` 참고.
- Tailwind 등 유틸리티 CSS 프레임워크를 함께 쓰는 경우 krds-react CSS와의 클래스 충돌 여부는 프로젝트마다 다르므로 **확인 필요**.

## 3. 폰트 — Pretendard GOV

KRDS 표준형 스타일은 국문·영문 모두 Pretendard GOV 서체를 기본으로 사용하며, `regular(400)`/`bold(700)` 두 굵기만 쓴다(`--krds-typo-font-weight-regular`, `--krds-typo-font-weight-bold`). 출처: `data/site/style/style_03.md`, `data/kit/resources/css/token/krds_tokens.css`.

### 3.1 `next/font/local`로 로드 (권장 — 자체 호스팅, 폰트 파일을 프로젝트에 포함해야 함)

```tsx
// app/fonts.ts
import localFont from 'next/font/local';

export const pretendardGov = localFont({
  src: [
    { path: '../public/fonts/PretendardGOV-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/PretendardGOV-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--krds-typo-font-type',
  display: 'swap',
});
```

```tsx
// app/layout.tsx
import { pretendardGov } from './fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendardGov.variable}>
      <body>{children}</body>
    </html>
  );
}
```

실제 폰트 파일(`.woff2`) 확보 경로와 라이선스 조건, `krds-react`가 폰트 파일을 함께 배포하는지 여부는 **확인 필요** — Pretendard GOV 공식 배포처에서 받아 `public/fonts`에 두는 것이 일반적인 패턴이다.

### 3.2 `<link>` 태그로 로드 (대안 — CDN/외부 호스팅 사용 시)

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="/* Pretendard GOV CDN 경로 — 확인 필요 */" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

CDN 방식은 외부 요청이 추가되므로 공공기관 서비스의 망분리·외부 리소스 정책에 따라 허용 여부를 먼저 확인한다. 특별한 제약이 없다면 `next/font/local`로 자체 호스팅하는 3.1 방식이 폰트 로딩 성능과 접근성(오프라인/사설망 환경 포함) 면에서 더 안전하다.

## 4. 폼 패턴 — 서버 액션 + KRDS 입력 컴포넌트

폼 자체(`<form>` 요소, 제출 로직)는 서버 액션으로 처리하고, 입력 컴포넌트만 krds-react 클라이언트 컴포넌트로 구성하는 조합이 App Router의 기본 패턴과 맞는다.

```tsx
// app/apply/actions.ts
'use server';

export async function submitApplication(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  // 검증 및 처리
  // ...
}
```

```tsx
// app/apply/application-form.tsx
'use client';

import { TextInput, Textarea, Button } from 'krds-react';
import { submitApplication } from './actions';

export function ApplicationForm() {
  return (
    <form action={submitApplication}>
      <TextInput name="name" label="이름" required />
      <TextInput name="email" type="email" label="이메일" required />
      <Textarea name="message" label="문의 내용" />
      <Button type="submit">제출</Button>
    </form>
  );
}
```

```tsx
// app/apply/page.tsx — 서버 컴포넌트, 클라이언트 폼만 위임
import { ApplicationForm } from './application-form';

export default function ApplyPage() {
  return (
    <main>
      <h1>서비스 신청</h1>
      <ApplicationForm />
    </main>
  );
}
```

`<form action={serverAction}>` 방식은 JS가 로드되기 전에도 native form submit으로 동작하는 progressive enhancement를 얻는다. 다만 이 방식이 성립하려면 krds-react 입력 컴포넌트들이 내부적으로 `<input>`/`<textarea>` 등 네이티브 폼 요소를 렌더링하고 `name` prop을 그대로 DOM에 반영해야 한다 — 실제 마크업은 `references/components/TextInput.md`, `references/components/Textarea.md` 등 개별 컴포넌트 문서로 확인한다. 클라이언트 측 실시간 검증이 필요하면 `useState` + `onChange`를 함께 쓰되, 최종 제출 로직은 서버 액션에 맡긴다.

## 5. SSR 스모크 테스트 결과

이전 판에서 "SSR 동작 미검증"으로 남겨 두었던 항목을 실제로 측정했다. 아래는 그 결과다.

### 5.1 측정 환경과 방법

- 대상: `krds-react@1.1.1` (스냅샷 기준 버전, `pipeline/snapshot.lock.json` 참조)
- 렌더러: `react@19.2.8` / `react-dom@19.2.8`의 `react-dom/server` `renderToString()`
- 실행 환경: **폴리필 없는 순정 Node** — jsdom을 설치하지 않았고 `window`/`document`/`navigator` 전역을 만들지 않았다. Next.js 서버 런타임과 마찬가지로 브라우저 전역이 없는 상태에서 렌더링한다.
- 대상 범위: `krds-react` barrel이 내보내는 public export **60개 전부**. 각 export를 `data/types/*.json`에서 뽑은 필수 prop만 채워 개별 렌더한다.
- 재현: `npm run test:ssr` (스크립트 본문은 `pipeline/ssr-smoke.mjs`)

```bash
npm run test:ssr   # FAIL이 1개 이상이면 exit code 1
```

### 5.2 집계

| 결과 | 개수 | 의미 |
| --- | --- | --- |
| OK | 55 | 예외 없이 비어 있지 않은 HTML을 반환 |
| OK-EMPTY | 1 | 예외 없이 렌더됐으나 출력이 빈 문자열 |
| FAIL | 4 | 렌더 중 예외 발생 |
| SKIP | 0 | 컴포넌트가 아닌 export(훅·유틸·상수)는 없었다 |

**`window`/`document` 등 브라우저 전역 참조로 인한 SSR 크래시는 0건**이다. `import * as KRDS from 'krds-react'` 자체도 순정 Node에서 예외 없이 성공한다 — 즉 모듈 최상위(import 시점)에서 브라우저 전역을 만지는 코드는 없다.

### 5.3 FAIL 4건 — 원인은 SSR이 아니라 compound 사용법

FAIL로 잡힌 4개는 모두 **부모 Provider 밖에서 단독 렌더**했을 때 라이브러리가 의도적으로 던지는 가드 에러다.

| 컴포넌트 | 예외 메시지(첫 줄) |
| --- | --- |
| `AccordionItem` | `Accordion 하위 컴포넌트는 Accordion 컴포넌트 내부에서 사용되어야 합니다.` |
| `TabList` | `Tab compound components must be used within a Tab component` |
| `TabTrigger` | `Tab compound components must be used within a Tab component` |
| `TabPanel` | `Tab compound components must be used within a Tab component` |

같은 스크립트가 이 컴포넌트들을 **정상 조합**(`Accordion > Accordion.Item > Header/Panel`, `Tab > TabList > TabTrigger` + `TabContent > TabPanel`)으로 다시 렌더하면 모두 예외 없이 HTML을 반환한다. 따라서 이 4건은 SSR 제약이 아니라 API 계약 위반이며, **Next.js에서 `dynamic(() => ..., { ssr: false })`로 우회할 대상이 아니다.** 올바른 대응은 부모 안에서 쓰는 것뿐이다.

```tsx
// app/guide/tab-section.tsx — 이 조합은 서버 렌더링에서 그대로 통과한다
'use client';

import { Tab, TabList, TabTrigger, TabContent, TabPanel } from 'krds-react';

export function TabSection() {
  return (
    <Tab defaultValue="tab1">
      <TabList>
        <TabTrigger value="tab1">개요</TabTrigger>
      </TabList>
      <TabContent>
        <TabPanel value="tab1">개요 내용</TabPanel>
      </TabContent>
    </Tab>
  );
}
```

### 5.4 OK-EMPTY 1건 — `Modal`

`Modal`은 필수 prop이 없어 자식 없이(`<Modal />`) 렌더되었고 빈 문자열을 반환했다. 자식(`Modal.Content`)을 주면 `open` 여부와 무관하게 `<section role="dialog" class="krds-modal ...">` 마크업을 서버에서 반환한다. 즉 포탈 때문에 서버 출력이 사라지는 것이 아니라 **그릴 자식이 없어서 빈 출력**이었다. 서버 HTML에 모달 마크업이 포함되는 편이 바람직하지 않은 화면이라면 `open` 상태와 렌더 시점을 클라이언트에서 직접 제어한다.

### 5.5 이 측정이 보증하지 않는 것

`renderToString` 통과는 "서버에서 크래시하지 않는다"까지만 보증한다. 다음은 여전히 미검증이다.

- **hydration mismatch**: 서버 HTML과 클라이언트 첫 렌더가 일치하는지는 측정하지 않았다. 브라우저에서 `next dev`로 hydration 경고를 확인해야 한다. 특히 `Modal`처럼 `open` 상태가 초기 마크업을 바꾸는 컴포넌트, `id` 자동 생성(위 출력의 `krds-modal-_R_0_`)에 의존하는 컴포넌트가 후보다.
- **RSC 경계**: 이 테스트는 클래식 SSR(`renderToString`)이며 React Server Components 직렬화 경계는 다루지 않는다. 1항의 `'use client'` 원칙은 그대로 유효하다.
- **스트리밍 SSR**: Next.js App Router가 실제로 쓰는 `renderToReadableStream`/Suspense 경계에서의 동작은 별도다.
- CSS import 경로는 설치본 `exports`로 확정했으나(2항), 폰트 파일 배포 경로·라이선스는 여전히 **확인 필요**(3항 참고).

측정 결과가 위와 같으므로, krds-react 컴포넌트를 클라이언트 컴포넌트 안에 두는 1항의 기본 패턴을 쓰는 한 `ssr: false` 우회는 **기본값으로 필요하지 않다.** `next build` 이후 특정 컴포넌트에서 hydration 경고가 실제로 관측될 때만 해당 컴포넌트에 한정해 `dynamic(() => import('./x'), { ssr: false })`를 적용한다.

이 절의 수치는 `krds-react@1.1.1` + `react-dom@19.2.8` 조합의 스냅샷 결과다. 의존성 버전을 올리면 `npm run test:ssr`을 다시 돌려 갱신해야 한다.

---

데이터 출처: `data/site/style/style_03.md`(서체·굵기), `data/kit/resources/css/token/krds_tokens.css`(font-weight 토큰), `skills/krds-react-dev/references/components/README.md`(컴포넌트 목록·인터랙션 prop 근거), `pipeline/ssr-smoke.mjs` 실행 결과(5항 SSR 수치, `pipeline/snapshot.lock.json` 기준 버전). Next.js App Router 관용구 자체는 레포 데이터가 아닌 일반 프레임워크 지식이며, hydration·RSC·스트리밍 SSR은 5.5항에 명시한 대로 여전히 미검증 상태다.
