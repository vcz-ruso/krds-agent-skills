# eval-login-page — 채점표

| 항목 | 필수/권장 | 통과 기준 | 채점 |
| --- | --- | --- | --- |
| `service-login.md` 참조 흔적(인증 유형 구분 반영) | 필수 | 산출물(코드 주석 또는 답변 텍스트)에 `references/patterns/service-login.md`를 읽었다는 흔적이 있고, "유형" 표의 4가지 인증 유형(지식 기반/소유 기반/생체 기반/다중 요소) 중 최소 1개 이상을 로그인 방식 UI 또는 설명에 구분해 반영한다(예: 아이디/비밀번호와 간편인증을 별도 탭·섹션으로 분리) | ☐ |
| krds-react 실존 컴포넌트만 사용 | 필수 | 사용된 모든 krds-react 컴포넌트명이 `references/components/README.md` 색인에 실존한다. 색인에 없는 컴포넌트/prop을 발명하지 않는다. `Dropdown`/`MainMenu`/`Portal`을 썼다면 barrel 미노출 주의사항을 지킨 import 방식을 쓴다 | ☐ |
| `'use client'` 경계 분리 | 필수 | `page.tsx`(또는 최상위 페이지 파일)는 서버 컴포넌트로 유지되고, `useState`/`onChange`/`onClick` 등 상호작용이 필요한 로그인 폼만 별도 파일로 분리되어 그 파일 최상단에 `'use client'` 지시어가 있다. 페이지 전체를 통째로 `'use client'`로 만들지 않는다 | ☐ |
| 색상 하드코딩 0건 | 필수 | 생성된 코드 전체(JSX, CSS, style 객체)에 hex(`#fff` 등)·`rgb()`/`rgba()` 색상 리터럴이 하나도 없다. 모든 색상은 `var(--krds-*)`로 표현된다 | ☐ |
| `service-login.md` [필수] 규범 최소 1개 반영 | 필수 | `service-login.md`에 `[필수]`로 표기된 규범(예: "로그인 링크는 모든 화면에서 일관된 위치에 배치", "로그인 링크는 스크린 리더에서 링크로 인지되어야 함(버튼 마크업 금지)" 등) 중 최소 1개를 코드 또는 설명에서 명시적으로 반영한다 | ☐ |
| 토큰 폴백 규칙 준수 | 권장 | 색상·간격·radius에 semantic 토큰(`--krds-color-*` 등)을 우선 사용하고, 부득이 primitive 토큰을 쓴 경우 그 이유를 코드 주석으로 남긴다(SKILL.md §2 폴백 규칙) | ☐ |
| 접근성 기본 — 시맨틱 요소 | 권장 | 클릭 가능한 UI에 `<div onClick>` 대신 `<button>`/`<a>` 등 시맨틱 요소를 쓴다 | ☐ |
| 접근성 기본 — 이미지 alt | 권장 | 페이지에 이미지가 있다면 정보성 이미지는 의미 있는 `alt`, 장식용은 `alt=""`를 갖는다(이미지가 없으면 해당 없음으로 처리하고 권장 항목 모수에서 제외) | ☐ |
| 접근성 기본 — label 연결 | 권장 | 아이디/비밀번호 등 모든 입력 필드에 `label`(또는 `aria-label`)이 연결되어 있고 placeholder만으로 대체하지 않는다 | ☐ |
| 접근성 기본 — 키보드 조작·포커스 표시 | 권장 | 포커스 아웃라인을 임의로 제거(`outline: none` 등 대체 표시 없이)하지 않고, 모든 인터랙티브 요소가 키보드로 접근 가능한 마크업이다 | ☐ |
| 접근성 기본 — 44×44 터치 타깃 | 권장 | 버튼·링크류 클릭 영역이 44×44px 미만으로 축소되어 있지 않다 | ☐ |
| Next.js CSS 로드 규칙 준수 | 권장 | `krds-react/dist/index.css`(또는 등가 전역 스타일)를 `app/layout.tsx`에서 한 번만 import한다(개별 컴포넌트 파일에서 반복 import하지 않음) | ☐ |
| krds-react 미설치 상태 처리 | 권장 | `krdsReact: false`인 전제 조건을 인지하고, 설치 안내·사용자 확인·또는 HTML Component Kit 마크업 규칙을 따르는 자체 구현 중 하나로 명시적으로 대응한다(아무 언급 없이 마치 이미 설치된 것처럼 `import { X } from 'krds-react'`만 쓰고 넘어가면 실패) | ☐ |

## 통과 기준

필수 5항목 100% + 권장 7항목(이미지가 없어 "해당 없음" 처리된 항목은 모수에서 제외) 중 70% 이상.

## 정답 근거 (참조해야 할 스킬 파일)

- `skills/krds-react-dev/SKILL.md` — 작업 워크플로 §1~§5 전체, 특히 §2(토큰 우선 원칙), §3(컴포넌트 선택), §5(접근성 기본)
- `skills/krds-react-dev/references/patterns/service-login.md` — 인증 유형 구분, 단계별 [필수]/[권장]/[우수] 규범
- `skills/krds-react-dev/references/patterns/README.md` — 서비스 패턴 색인, 사용 방법
- `skills/krds-react-dev/references/components/README.md` — 실존 krds-react 컴포넌트 색인(barrel 미노출 표시 포함)
- `skills/krds-react-dev/references/tokens.md` — 토큰 3계층 구조, 네이밍 규칙, 폴백 규칙
- `skills/krds-react-dev/references/nextjs.md` — `'use client'` 경계, CSS 로드 규칙
