---
name: krds-react-dev
description: Generates and edits React, Next.js, and React Native UI code conforming to KRDS, the Korean government design system. Use when building or modifying Korean government service UI with krds-react components, KRDS design tokens, or KRDS UX patterns. KRDS 기반 정부 서비스 UI를 React 계열 스택으로 구현·수정할 때 사용.
license: MIT
---

# KRDS React 개발 스킬

KRDS(범정부 UI/UX 디자인시스템)에 부합하는 UI 코드를 React 계열 스택으로 작성하기 위한 스킬이다. 기준 버전은 `krds-react@1.1.1` / HTML Component Kit v1.1.0이며, 이 스킬의 모든 참조 데이터는 해당 버전의 공식 산출물 스냅샷에서 생성되었다.

## 작업 워크플로

새 UI를 만들거나 기존 UI를 수정할 때 아래 순서를 따른다.

### 1. 스택 감지

```bash
node skills/krds-react-dev/scripts/detect-stack.mjs
```

출력 JSON(`{"detected":{"react","next","reactNative","krdsReact"}}`)에 따라 분기한다.

- **`krdsReact: true`** — `krds-react` 컴포넌트를 직접 사용한다(§3).
- **React/Next인데 `krdsReact: false`** — 먼저 `npm install krds-react` 후 전역 CSS(`krds-react/dist/index.css`)를 앱 진입점에서 import한다. 설치가 불가능한 제약이 있으면 사용자에게 확인한 뒤, HTML Component Kit의 마크업 규칙(각 컴포넌트 문서의 CSS 클래스 체계)을 따르는 자체 구현으로 진행한다.
- **`reactNative: true`** — 공식 RN 구현이 없으므로 `references/react-native/README.md`부터 읽고 그 매핑 가이드를 따른다.
- **Next.js면** 추가로 `references/nextjs.md`의 'use client' 경계·CSS 로드 규칙을 따른다.

### 2. 토큰 우선 원칙

색상·간격·타이포그래피·radius 값을 하드코딩하지 않는다.

- 웹: `var(--krds-*)` CSS 변수 사용. 변수명 체계와 카테고리별 목록은 `references/tokens.md`.
- RN: `data/kit/rn-tokens.json` 상수 사용. 사용법은 `references/react-native/tokens-usage.md`.
- 폴백 규칙: 원하는 값의 컴포넌트/시맨틱 토큰이 없으면 의미가 가장 가까운 시맨틱 토큰을 쓰고, 그것도 없을 때만 primitive 토큰을 쓰되 선택 이유를 코드 주석으로 남긴다. 토큰 체계 밖의 리터럴 값 도입은 최후 수단이며 사용자에게 확인한다.

### 3. 컴포넌트 선택·합성

- 사용할 컴포넌트의 문서 `references/components/<Name>.md`를 먼저 읽는다. Props 표·타입 값·하위 컴포넌트 합성 구조·공식 사용 예시(JSX)가 있다.
- **문서에 없는 컴포넌트나 prop을 만들어내지 않는다.** `references/components/README.md` 색인에 없으면 그 컴포넌트는 존재하지 않는 것이다. 색인의 barrel 미노출 표시(Dropdown/MainMenu/Portal)가 있는 컴포넌트는 `import { X } from 'krds-react'`가 불가능하므로 사용 전 공개 API 여부를 확인한다.
- 필요한 UI가 42종에 없으면 KRDS 스타일 규칙(토큰·radius·대비)을 지키는 커스텀 구현으로 만들되, 그 사실을 사용자에게 알린다.

### 4. 패턴 적용

로그인, 신청 폼, 검색, 오류 처리, 동의 같은 **여정·화면 단위 작업**은 컴포넌트를 고르기 전에 `references/patterns/`의 해당 패턴 문서를 읽는다. 색인은 `references/patterns/README.md`. 패턴 문서의 필수(Essential) 항목은 반드시 반영하고, 권장·모범사례 항목은 상황에 맞게 적용한 뒤 무엇을 적용/생략했는지 보고한다.

### 5. 접근성 기본 준수

구현하면서 최소한 다음을 지킨다 — ① 시맨틱 요소 우선(`<div onClick>` 금지), ② 이미지 alt(장식 이미지는 `alt=""`), ③ 폼 필드 label 연결, ④ 키보드 조작 가능성(포커스 표시 제거 금지), ⑤ 터치 타깃 최소 44×44px. 완성 후 정밀 검토가 필요하면 이 스킬이 아니라 `krds-a11y-review` 스킬로 위임한다 — 그쪽이 KWCAG 2.2·WCAG 2.1 조항 인용 리포트를 만든다.

## 참조 파일 안내

필요한 시점에만 해당 파일을 읽는다(progressive disclosure). 한 작업에서 모든 파일을 읽지 않는다.

| 상황 | 참조 파일 |
| --- | --- |
| 토큰 값·CSS 변수명 조회, 색상 규칙(매직넘버·60-30-10) | `references/tokens.md` |
| 특정 컴포넌트의 API·합성 구조·공식 예시 | `references/components/<Name>.md` (색인: `components/README.md`) |
| 여정·화면 단위 UX 패턴 | `references/patterns/` (색인: `patterns/README.md`) |
| Next.js: 'use client' 경계, CSS·폰트 로드, 폼 | `references/nextjs.md` |
| React Native: 토큰 사용, 컴포넌트 대응, 고대비 모드 | `references/react-native/` (README → tokens-usage → component-mapping 순) |

## 하지 말 것

- 색상·간격 하드코딩 (§2 폴백 규칙 외).
- 존재하지 않는 컴포넌트·prop·토큰 이름 발명. 근거는 항상 references 문서다.
- `useColorScheme`(OS 다크모드)을 KRDS 선명한 화면 모드(고대비)의 트리거로 직결하는 것 — 별개 개념이다(`references/react-native/README.md` 참조).
- 접근성 속성(alt, label, role)을 "나중에 채울 TODO"로 남기는 것 — 구현 시점에 채운다.

## 출처

이 스킬의 KRDS 데이터는 행정안전부가 공공누리 제1유형으로 개방한 자료를 이용한다: "본 저작물은 행정안전부에서 2024년 작성하여 공공누리 제1유형으로 개방한 '범정부 UI/UX 디자인시스템(KRDS)'을 이용하였으며, 해당 저작물은 KRDS 디자인시스템 홈페이지(www.krds.go.kr)에서 무료로 다운받으실 수 있습니다."
