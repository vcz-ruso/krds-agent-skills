# KRDS Agent Skills

대한민국 정부 디자인 시스템(KRDS, https://www.krds.go.kr)을 React / Next.js / React Native 환경에 특화시킨 AI 에이전트 스킬 스위트다. Claude Code Agent Skills 포맷을 사용하며, 정부 서비스 UI를 만드는 개발자·디자이너가 KRDS 규범을 정확히 따르도록 돕는 것을 목표로 한다.

> **상태: v1 — 스킬 3종 사용 가능.** `skills/` 아래 세 스킬 모두 구현이 끝났고, 빌드 타임 데이터 파이프라인(`pipeline/`)이 추출한 스냅샷이 `data/`에 커밋되어 있다. 이후 로드맵은 [이슈 #1](https://github.com/vcz-ruso/krds-agent-skills/issues/1) 참조.

## 스킬 3종

| 스킬 | 대상 | 역할 및 주요 산출 |
| --- | --- | --- |
| `krds-react-dev` | 개발자 | React / Next.js / React Native 환경에 맞는 KRDS 컴포넌트 코드를 생성·수정한다. 컴포넌트 레퍼런스 42종, UX 패턴 18종, React Native 토큰·컴포넌트 매핑을 산출로 제공한다. |
| `krds-a11y-review` | 개발자 | React/HTML 코드를 KWCAG 2.2·WCAG 2.1 조항 인용과 함께 접근성 리뷰한다(코드는 직접 고치지 않음). 결정론적 정적 검사기(`scripts/check-static.mjs`)와 컴포넌트별 KWCAG 매핑 156규칙(`references/kwcag-map.md`)을 기반으로 한다. |
| `krds-design` | 디자이너 | KRDS 디자인 원칙(7개), 색상 체계(매직넘버·60-30-10 규칙·선명한 화면 모드), 거버넌스를 코드 작성 없이 질의응답으로 안내한다. |

세 스킬은 `skills/` 디렉터리 아래에 각각 독립된 Agent Skill로 구현되며, 필요한 참조 데이터(`references/`)와 스크립트(`scripts/`)를 디렉터리 안에 자기완결적으로 포함한다.

## 설치

가장 간단한 방법은 대상 프로젝트의 `.claude/skills/`에 `skills/` 아래 원하는 스킬 디렉터리를 그대로 복사하는 것이다. 스킬은 참조 데이터와 스크립트를 포함해 디렉터리 하나로 자기완결적이라 별도 설정 없이 동작한다. Claude Code 기준 설치 절차, 전역 설치, 설치 확인 방법, 다른 Agent Skills 런타임과의 호환성은 [`docs/INSTALL.md`](docs/INSTALL.md)를 참조한다.

## 데이터 갱신

KRDS가 새 버전을 내면 아래 순서로 스냅샷을 갱신한다.

1. `pipeline/snapshot.lock.json`의 버전 필드(`krds-react`, `krds-uiux-html-kit`, `storybook-react` 등)를 새 버전으로 갱신한다.
2. 파이프라인을 순서대로 재실행한다.

   ```bash
   npm run fetch:kit
   npm run extract:storybook
   npm run extract:types
   npm run crawl:site
   npm run transform:rn
   npm run build:references
   npm run build:kwcag
   ```

3. 생성된 diff(`data/`, `skills/*/references/`)를 리뷰한 뒤 커밋한다.

## 데이터 정책

이 프로젝트가 다루는 모든 KRDS 데이터는 **버전 고정 정적 스냅샷**이다. 런타임에 원격 소스를 실시간으로 조회하지 않으며, 빌드 타임에 아래 공식 소스에서 추출한 결과를 저장소에 커밋해 사용한다. 고정된 버전 정보는 `pipeline/snapshot.lock.json`을 참조한다.

소스는 다음 네 곳으로 한정한다.

- 공식 GitHub: [KRDS-uiux/krds-uiux](https://github.com/KRDS-uiux/krds-uiux)
- 공식 npm: `krds-react`
- 공식 Storybook: https://www.krds.go.kr/storybook/react
- 공식 사이트: https://www.krds.go.kr

데이터 추출은 `pipeline/` 아래 스크립트(`npm run extract:storybook`, `extract:types`, `crawl:site`, `transform:rn`)가 담당하며, 각 스크립트의 헤더 주석에 추출 절차와 근거를 명시한다.

## 라이선스

- 이 저장소의 코드(파이프라인 스크립트, 스킬 로직 등)는 **MIT License**를 따른다. `LICENSE` 파일 참조.
- KRDS 원자료(컴포넌트 명세, 토큰, 문서, 예시 코드 등)는 **공공누리 제1유형(KOGL Type 1)** 조건으로 개방되어 있으며, 출처 표기 의무를 진다. KRDS 데이터를 포함하거나 인용하는 모든 산출물에는 다음 출처 표기 문구를 그대로 포함해야 한다.

  > 본 저작물은 행정안전부에서 2024년 작성하여 공공누리 제1유형으로 개방한 '범정부 UI/UX 디자인시스템(KRDS)'을 이용하였으며, 해당 저작물은 KRDS 디자인시스템 홈페이지(www.krds.go.kr)에서 무료로 다운받으실 수 있습니다.
