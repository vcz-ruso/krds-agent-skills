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
import { Dropdown, TextInput, Button } from 'krds-react';

export function NoticeFilterPanel({ initialNotices }: { initialNotices: Notice[] }) {
  const [keyword, setKeyword] = useState('');

  return (
    <div>
      <TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="검색어 입력" />
      <Dropdown /* ... */ />
      <Button onClick={() => {/* 필터링 */}}>검색</Button>
      {/* 목록 렌더링 */}
    </div>
  );
}
```

경계를 최대한 아래로 내리면 초기 HTML은 서버에서 렌더링되고, krds-react의 JS 번들은 실제로 상호작용이 필요한 부분에만 로드된다. 레이아웃(`layout.tsx`)도 마찬가지로 헤더/푸터처럼 정적인 부분은 서버 컴포넌트로 두고, `Header`/`SideNavigation`처럼 열림·닫힘 상태나 이벤트를 갖는 컴포넌트를 사용하는 지점에서만 `'use client'` 하위 컴포넌트로 감싼다.

## 2. CSS 로드

krds-react는 컴포넌트 스타일을 별도 CSS 번들(`dist/index.css` 형태 — 실제 배포 경로는 설치한 krds-react 버전의 `package.json` `exports`/`files`를 확인, **확인 필요**)로 제공하는 CSS-in-JS가 아닌 라이브러리라는 전제다. App Router에서는 root layout에서 전역으로 한 번만 import한다.

```tsx
// app/layout.tsx
import 'krds-react/dist/index.css'; // 실제 서브패스는 설치본 기준 확인 필요
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

## 5. 잔여 리스크 — SSR 동작 미검증

이 문서는 krds-react가 "클라이언트 컴포넌트 라이브러리"라는 전제와 일반적인 Next.js App Router 관용구를 조합해 작성했다. 다음은 실제로 검증하지 않은 부분이다.

- **SSR 스모크 테스트 미수행**: krds-react 컴포넌트를 서버 컴포넌트 트리에 배치했을 때, 혹은 클라이언트 컴포넌트 안에서 서버 렌더링(`next build && next start`) 시 hydration mismatch나 `window`/`document` 참조 에러가 발생하는지 실제로 빌드·구동해 확인하지 않았다.
- CSS import 경로(`krds-react/dist/index.css`)는 일반적인 라이브러리 배포 관례를 따른 추정이며, 실제 설치된 krds-react 패키지의 `package.json`으로 검증 필요.
- 폰트 파일 배포 경로·라이선스는 확인 필요 상태로 남겨둠(3항 참고).

krds-react를 실제 프로젝트에 붙일 때는 위 항목을 먼저 로컬에서 `next build`로 검증하고, hydration 경고나 SSR 실패가 발견되면 해당 컴포넌트를 `dynamic(() => import(...), { ssr: false })`로 클라이언트 전용 로드하는 우회책을 검토한다. 이 문서는 이후 실제 검증 결과가 나오면 갱신되어야 한다.

---

데이터 출처: `data/site/style/style_03.md`(서체·굵기), `data/kit/resources/css/token/krds_tokens.css`(font-weight 토큰), `skills/krds-react-dev/references/components/README.md`(컴포넌트 목록·인터랙션 prop 근거). Next.js App Router 관용구 자체는 레포 데이터가 아닌 일반 프레임워크 지식이며, SSR 관련 서술은 4항에 명시한 대로 미검증 상태다.
