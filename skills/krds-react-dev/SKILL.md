---
name: krds-react-dev
description: Generates and edits React, Next.js, and React Native UI code conforming to KRDS, the Korean government design system. Use when building or modifying Korean government service UI with krds-react components, KRDS design tokens, or KRDS UX patterns. KRDS 기반 정부 서비스 UI를 React 계열 스택으로 구현·수정할 때 사용.
license: MIT
---

# KRDS React 개발 스킬

## 작업 워크플로

1. **스택 감지** — `scripts/detect-stack.mjs`를 실행해 현재 프로젝트가 React / Next.js / React Native 중 어떤 스택이고 `krds-react` 의존성이 있는지 확인한다. TODO: 감지 결과에 따른 분기 로직 상세화.
2. **토큰 우선 원칙** — 색상·간격·타이포그래피 등에 하드코딩 값을 쓰지 않고 KRDS 디자인 토큰(Primitive→Semantic→Component)을 우선 사용한다. TODO: 토큰 미사용 시 폴백 규칙 정의.
3. **컴포넌트 선택·합성** — `references/components/` 아래 해당 컴포넌트 문서를 참조해 krds-react 39종 컴포넌트 중 적절한 것을 선택·합성한다. TODO: 컴포넌트 미존재 시 합성 가이드 추가.
4. **패턴 적용** — `references/patterns/`의 기본 패턴 12종·서비스 패턴 5종을 참조해 UX 흐름을 구성한다. TODO: 패턴별 적용 조건 표 추가.
5. **접근성 기본 준수** — KWCAG 2.2 + WCAG 2.1 기준을 최소한으로 충족하도록 구현한다. 상세 검토는 `krds-a11y-review` 스킬에 위임한다. TODO: 구현 단계에서 바로 점검할 체크리스트 추가.

## 참조 파일 안내

Progressive disclosure 원칙에 따라 필요한 상황에만 해당 참조 파일을 읽는다.

| 상황 | 참조 파일 |
| --- | --- |
| 토큰 값·네이밍 조회 | `references/tokens.md` |
| 특정 컴포넌트의 API·예시 확인 | `references/components/<ComponentName>.md` |
| UX 패턴(기본/서비스) 적용 | `references/patterns/` |
| Next.js 프로젝트 관용구 확인 | `references/nextjs.md` |
| React Native 토큰 매핑·컴포넌트 대응 확인 | `references/react-native/README.md` |

TODO: 각 참조 파일이 채워지면 표에 세부 파일 목록을 추가한다.

## 출처

이 스킬은 대한민국 정부의 KRDS(대한민국 정부 디자인 시스템) 자료를 공공누리 제1유형 조건에 따라 활용합니다. 출처: 행정안전부 KRDS(대한민국 정부 디자인 시스템), 공공누리 제1유형(출처표시).

TODO: 실제 원문 출처 URL 및 버전 정보 확정 후 명시.
