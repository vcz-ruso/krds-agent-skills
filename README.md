# KRDS Agent Skills

대한민국 정부 디자인 시스템(KRDS, https://www.krds.go.kr)을 React / Next.js / React Native 환경에 특화시킨 AI 에이전트 스킬 스위트다. Claude Code Agent Skills 포맷을 사용하며, 정부 서비스 UI를 만드는 개발자·디자이너가 KRDS 규범을 정확히 따르도록 돕는 것을 목표로 한다.

> **상태: 스캐폴딩 단계.** 현재 저장소에는 저장소 기본 파일과 빌드 타임 데이터 추출 파이프라인의 스텁만 존재한다. 실제 스킬 콘텐츠(`skills/`)와 추출된 데이터(`data/`)는 아직 채워지지 않았다.

## 스킬 3종

| 스킬 | 대상 | 역할 |
| --- | --- | --- |
| `krds-react-dev` | 개발자 | React / Next.js / React Native 환경에 맞는 KRDS 컴포넌트 코드 생성 |
| `krds-a11y-review` | 개발자 | KWCAG 2.2·WCAG 2.1 조항을 인용하며 접근성 리뷰 수행 |
| `krds-design` | 디자이너 | KRDS 디자인 원칙·토큰·거버넌스 가이드 제공 |

세 스킬은 `skills/` 디렉터리 아래에 각각 독립된 Agent Skill로 구현된다.

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
