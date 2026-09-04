# KRDS Agent Skills 평가 스위트

이 디렉터리는 `skills/krds-react-dev`, `skills/krds-a11y-review`, `skills/krds-design` 3개 Agent Skill이
실제로 의도대로 작동하는지 사람(또는 다른 에이전트 세션)이 반복 실행하고 채점할 수 있는 평가 5종을 담는다.
Anthropic의 스킬 작성 권장사항이 요구하는 "스킬당 최소 3개 평가" 기준을 스킬별 1~2개씩 배분해 총 5개로
충족한다.

## 평가 방법론

각 평가는 아래 세 단계로 실행한다.

### (a) 시나리오 프롬프트 입력

`eval-<slug>/scenario.md`에 적힌 **사용자 프롬프트 원문**을, 대상 스킬이 설치된 새 Claude Code 세션에
**그대로** 입력한다. 프롬프트를 의역하거나 추가 힌트를 덧붙이지 않는다 — 스킬이 자체 판단으로 올바른
참조 문서를 찾아가는지가 평가 대상이기 때문이다. `scenario.md`의 "전제 조건" 절에 명시된 조건(프로젝트
스택, 설치 상태 등)은 프롬프트를 입력하기 전에 세션/환경에 미리 갖춰 둔다.

세션은 매번 새로 시작한다(이전 대화 맥락이 섞이면 스킬이 스스로 문서를 찾아가는지 검증할 수 없다).

### (b) rubric 체크리스트로 채점

세션의 최종 산출물(코드, 답변, 리포트)을 `eval-<slug>/rubric.md`의 표에 있는 항목과 하나씩 대조한다.
각 행은 "필수" 또는 "권장"으로 표시되어 있고, "채점" 칸에 통과 여부를 기록한다(☑ 통과 / ☒ 실패 / — 해당
없음). "해당 없음" 처리한 항목은 통과율 계산의 분모에서 제외한다.

각 rubric 하단의 "정답 근거" 절은 채점자가 실제로 열어봐야 할 스킬 참조 파일 경로를 명시한다 — 채점자의
주관이 아니라 그 파일에 적힌 내용과 산출물을 대조해서 채점한다. `eval-a11y-review`는 fixture에 대한
"정답 위반 목록"도 별도로 제공하므로, 채점 전에 필요하면 `node skills/krds-a11y-review/scripts/check-static.mjs
evals/eval-a11y-review/fixtures/bad-form.tsx`를 직접 실행해 스크립트 출력과 세션 리포트를 비교한다.

### (c) 통과 기준

**필수 항목 100% + 권장 항목 70% 이상**을 모두 만족해야 그 평가가 "통과"다. 필수 항목이 하나라도
실패하면 권장 항목 점수와 무관하게 그 평가는 실패다.

#### 권장 항목이 적은 평가

권장 항목이 3개 미만인 rubric(`eval-negative-trigger`가 해당)은 70% 컷오프가 항목 1개 차이로 뒤집힐 수
있으므로, "권장 N개 중 최소 1개 이상 통과"로 완화 적용한다(반올림: 항목 2개 중 70% = 1.4개 → 올림 시
2개 요구는 과도하므로 1개로 내림). 이는 예외이며, 권장 항목이 3개 이상인 나머지 4개 평가는 원칙대로
"70% 이상(올림 없이 계산값 이상)"을 적용한다.

## 평가 실행 기록

평가를 실제로 돌릴 때마다 아래 표에 행을 추가한다(이 표는 템플릿이며 실행 기록이 쌓일 때마다 직접
채운다).

| 날짜 | 평가 | 모델 | 통과 여부 | 메모 |
| --- | --- | --- | --- | --- |
| YYYY-MM-DD | eval-login-page | (예: claude-sonnet-5) | PASS / FAIL | 실패한 필수 항목, 특이사항 등 |
| YYYY-MM-DD | eval-a11y-review | | | |
| YYYY-MM-DD | eval-design-tokens | | | |
| YYYY-MM-DD | eval-rn-screen | | | |
| YYYY-MM-DD | eval-negative-trigger | | | |

## 평가 목록

| 평가 | 대상 스킬 | 한 줄 요약 |
| --- | --- | --- |
| [eval-login-page](./eval-login-page/) | `krds-react-dev` | Next.js App Router 로그인 페이지 생성 — 서비스 패턴 참조, 실존 컴포넌트 사용, `'use client'` 경계, 토큰 사용을 검증하는 양성 평가 |
| [eval-a11y-review](./eval-a11y-review/) | `krds-a11y-review` | 5종 위반(그중 1종은 정적 스크립트 검사 범위 밖)이 심어진 fixture를 리뷰시켜, 스크립트 실행 여부·전수 검출·확정/수동검증 구분·리뷰 전용 준수(코드 미수정)를 검증하는 양성 평가 |
| [eval-design-tokens](./eval-design-tokens/) | `krds-design` | 배너 배경/텍스트 색상·대비 기준 질의 — 매직넘버 체계로 답하고 코드를 쓰지 않는지 검증하는 양성 평가 |
| [eval-rn-screen](./eval-rn-screen/) | `krds-react-dev` (React Native 매핑) | 민원 완료 토스트 RN 구현 — 공식 구현 부재 고지, rn-tokens 사용, component-mapping.md A.5 요구사항(접근성 announce 포함), 자체 판단 구분 표시를 검증하는 양성 평가 |
| [eval-negative-trigger](./eval-negative-trigger/) | 전체(트리거 경계) | KRDS와 무관한 사내 어드민 대시보드 요청 — 세 스킬 모두 과잉 발동하지 않고 KRDS 규칙을 강제하지 않는지 확인하는 **음성 평가**(자세한 설명은 해당 `scenario.md` 상단 참고) |

## rubric 형식

모든 `rubric.md`는 아래 표 형식을 공통으로 쓴다.

| 항목 | 필수/권장 | 통과 기준 | 채점 |
| --- | --- | --- | --- |
| (평가할 대상) | 필수 또는 권장 | (구체적·검증 가능한 통과 조건) | ☐ (채점 시 ☑/☒/— 로 채움) |

각 `rubric.md` 하단에는 "정답 근거" 절이 있고, 채점 시 실제로 열어 대조해야 할 스킬 파일의 저장소
상대 경로를 나열한다. 이 목록의 경로는 모두 이 스위트를 작성한 시점(2026-09-04)에 저장소에 실존을
확인한 경로다 — 스킬 참조 문서가 재생성(`npm run build:references`, `npm run build:kwcag` 등)되어
구조가 바뀌면 이 목록도 함께 갱신해야 한다.

## 디렉터리 구조

```
evals/
├── README.md                          # 이 문서
├── eval-login-page/
│   ├── scenario.md
│   └── rubric.md
├── eval-a11y-review/
│   ├── scenario.md
│   ├── rubric.md
│   └── fixtures/
│       └── bad-form.tsx               # 위반 5종이 심어진 평가용 fixture
├── eval-design-tokens/
│   ├── scenario.md
│   └── rubric.md
├── eval-rn-screen/
│   ├── scenario.md
│   └── rubric.md
└── eval-negative-trigger/
    ├── scenario.md
    └── rubric.md
```
