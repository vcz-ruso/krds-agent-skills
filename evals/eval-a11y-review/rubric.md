# eval-a11y-review — 채점표

## 정답 위반 목록 (fixtures/bad-form.tsx)

`node skills/krds-a11y-review/scripts/check-static.mjs evals/eval-a11y-review/fixtures/bad-form.tsx`를
이 fixture에 실행해 사전 검증한 결과다(evals 작성 시점 기준 종료 코드 1, 위반 7건 — 아래 5종으로 분류).

| # | 위반 | 위치(줄) | 검출 경로 | confidence |
| --- | --- | --- | --- | --- |
| V1 | 하드코딩 색상(`#003764`, `#ffffff`, `#1e40af`) | 14, 15, 33 | `check-static.mjs` rule `hardcoded-color` | 확정 |
| V2 | `<img>` alt 속성 부재 | 17 | `check-static.mjs` rule `missing-alt` | 확정 |
| V3 | 폼 필드(`input`) label 미연결 — `applicantName`, `phone` 모두 `label`/`aria-label` 없이 `placeholder`만 있음 | 20, 24 | **`check-static.mjs`의 5개 규칙 어디에도 해당하지 않음** — SKILL.md §3 모델 판단 "레이블 적절성" 체크리스트로만 검출 가능 | 수동 검증 필요(모델 판단) |
| V4 | `<div onClick>` 비시맨틱 인터랙션 | 27 | `check-static.mjs` rule `non-semantic-interactive-div` | 확정 |
| V5 | 30px 터치 타깃(버튼 `width: 30px; height: 30px` + `onClick`) | 31–34 | `check-static.mjs` rule `small-touch-target` | 휴리스틱 |

V3는 의도적으로 `check-static.mjs`의 검사 범위 밖에 배치했다 — "5종 위반 전부 검출"을 스크립트 출력을 그대로 베끼는 것으로는 달성할 수 없고, 리뷰 세션이 §3 모델 판단을 실제로 수행해야만 달성 가능하게 설계했다.

## 채점표

| 항목 | 필수/권장 | 통과 기준 | 채점 |
| --- | --- | --- | --- |
| `check-static.mjs` 실행 | 필수 | 리포트에 `node skills/krds-a11y-review/scripts/check-static.mjs evals/eval-a11y-review/fixtures/bad-form.tsx` 실행 흔적(명령어 또는 그 JSON 출력 인용)이 있다 | ☐ |
| 5종 위반 전부 검출 | 필수 | V1~V5 다섯 종류가 모두 리포트의 "위반 상세"에 언급된다(V1의 3개 좌표를 모두 개별 나열할 필요는 없으며 "하드코딩 색상" 범주로 최소 1곳 이상 지적하면 인정). V3(label 부재)를 놓치면 이 항목은 실패로 채점한다 | ☐ |
| KWCAG·WCAG 조항 인용 | 필수 | V1, V2, V4, V5는 `check-static.mjs`의 `kwcag`/`wcag` 필드와 일치하는 조항이 인용되고, V3는 §3 체크리스트("레이블 적절성", component_05_02.md Button 기준) 또는 근접 KWCAG 조항이 근거로 제시된다 | ☐ |
| 확정/수동검증 구분 | 필수 | 리포트가 "코드상 확정"(V1, V2, V4 — confidence 확정)과 "수동 검증이 필요한 항목"(V5 — 휴리스틱, V3 — 모델 판단)을 별도 절로 분리한다. V5를 "확정"으로 잘못 분류하면 실패 | ☐ |
| 코드 수정은 하지 않음(리뷰 전용) | 필수 | 세션이 `bad-form.tsx`를 Edit/Write로 고치지 않는다. 수정 제안은 리포트 안의 코드 스니펫(제안일 뿐 실제 파일 변경 아님)으로만 등장해야 한다 | ☐ |
| 요약표 포함 | 권장 | 심각도(error/warning/info)별 건수 요약표가 리포트 상단에 있다 | ☐ |
| 수정 제안 스니펫 제공 | 권장 | V1~V5 각각에 리포트 템플릿(§6)처럼 수정 방향을 보여주는 코드 스니펫이 붙어 있다(실제 파일에는 적용하지 않음) | ☐ |
| `kwcag-map.md` 보강 시도 | 권장 | 이 fixture가 특정 KRDS 컴포넌트(버튼 등)를 흉내 내는 코드이므로, SKILL.md §4 규칙에 따라 `references/kwcag-map.md`에서 Button 관련 절을 찾아 추가 인용을 시도한 흔적이 있다(찾지 못했다는 명시적 기술도 인정) | ☐ |
| 수동 검증 권고 절 포함 | 권장 | 스크린리더/키보드 순회/실기기 터치 타깃 확인 중 최소 2가지를 권고하는 절이 있다 | ☐ |

## 통과 기준

필수 5항목 100% + 권장 4항목 중 70%(3/4) 이상.

## 정답 근거 (참조해야 할 스킬 파일)

- `skills/krds-a11y-review/SKILL.md` — 리뷰 절차 전체(§1~§6), 특히 §1(diff 우선/전체 폴백 분기), §3(모델 판단 체크리스트), §5(확정/수동검증 구분), §6(리포트 템플릿)
- `skills/krds-a11y-review/scripts/check-static.mjs` — 5개 규칙의 실제 구현과 `CITATIONS` 상수(대표 조항 인용 근거)
- `skills/krds-a11y-review/references/kwcag-map.md` — 컴포넌트별 세부 KWCAG/WCAG 인용 보강 시 참조
