# eval-login-page — 시나리오

## 대상 스킬

`skills/krds-react-dev`

## 전제 조건

1. `krds-react-dev` 스킬이 설치된 Claude Code 세션에서 실행한다.
2. 대상 프로젝트는 Next.js 15 App Router + TypeScript 프로젝트가 이미 스캐폴딩되어 있다고 가정한다(`app/` 디렉터리 존재). `krds-react` 패키지는 아직 설치되어 있지 않다(`detect-stack.mjs` 기준 `krdsReact: false`) — 스킬이 SKILL.md §1의 설치/폴백 분기를 어떻게 처리하는지도 관찰 대상이다.
3. 별도 디자인 요구사항(로그인 방식 종류, 인증 수단 등)은 프롬프트에 주지 않는다 — 스킬이 `patterns/service-login.md`를 읽고 스스로 인증 유형 구분을 반영하는지가 평가 포인트다.

## 사용자 프롬프트 (원문)

```
정부 서비스 로그인 페이지를 Next.js App Router로 만들어줘
```

## 관찰 포인트

- 코드를 쓰기 전에 `references/patterns/service-login.md`(서비스 패턴: 로그인)를 읽는가, 아니면 곧바로 일반적인 로그인 폼 코드를 생성하는가.
- `references/components/README.md` 색인에 없는 컴포넌트나 prop을 지어내지 않는가.
- 페이지(`page.tsx`)와 인터랙티브 폼의 클라이언트 경계를 분리하는가(`references/nextjs.md` 관용구).
- 색상값을 `var(--krds-*)` 토큰 없이 hex/rgb로 하드코딩하지 않는가.
- krds-react 미설치 상태를 스킬이 어떻게 처리하는지(설치 안내, 사용자 확인, 또는 HTML Component Kit 마크업 규칙을 따르는 자체 구현으로 폴백).
