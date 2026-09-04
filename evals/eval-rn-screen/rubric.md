# eval-rn-screen — 채점표

| 항목 | 필수/권장 | 통과 기준 | 채점 |
| --- | --- | --- | --- |
| 공식 RN 구현 부재 고지 | 필수 | 답변 또는 코드 주석에 "KRDS는 React Native 공식 구현을 제공하지 않으며, 이 구현은 저장소가 자체 작성한 매핑 가이드를 따른 것"이라는 취지의 고지가 명시적으로 있다 | ☐ |
| rn-tokens 사용 | 필수 | 토스트의 배경색·텍스트색·padding·radius가 `data/kit/rn-tokens.json`에서 가져온 상수(예: `colors.light...`, `spacing...`, `radius...`)로 표현되고, hex/rgb 리터럴이나 임의의 dp 숫자로 하드코딩되지 않는다 | ☐ |
| component-mapping.md A.5 요구사항 반영 | 필수 | 다음 중 핵심 요구사항이 코드에 반영된다: (1) 화면 중앙 하단 배치 + 탭바/플로팅 버튼과 겹치지 않는 오프셋, (2) 한 줄 메시지, (3) 지정된 시간 후 자동 dismiss(정보형 2~3초 범위 근사), (4) 모달처럼 포커스를 가로채지 않음(포커스 트랩 없음) | ☐ |
| 접근성 announce 포함 | 필수 | `AccessibilityInfo.announceForAccessibility(message)` 또는 `accessibilityLiveRegion="polite"` 등으로 토스트 등장을 스크린 리더에 능동적으로 알리는 코드가 포함된다 | ☐ |
| 자체 판단 사항 구분 표시 | 필수 | 공식 문서 근거가 없는 부분(특히 스크린 리더 announce, 정확한 dismiss 타이밍, dp 오프셋 값 등)에 "⚠️ 자체 판단" 또는 동등한 구분 표시와 판단 근거가 코드 주석/답변에 있다. 자체 판단을 공식 규정인 것처럼 서술하면 이 항목은 실패 | ☐ |
| 다크모드/고대비 혼동 없음 | 권장 | `useColorScheme()`(OS 다크모드)을 KRDS 선명한 화면 모드(고대비) 전환 트리거로 잘못 연결하지 않는다(토스트에 고대비 대응이 없다면 언급하지 않아도 무방 — 있다면 `highContrast` 토큰 세트를 올바르게 참조하는지만 확인) | ☐ |
| 스낵바와의 구분 근거 제시 | 권장 | 이 메시지가 액션 버튼 없는 단문 정보성 피드백이므로 스낵바(A.6)가 아닌 토스트(A.5)가 맞다는 판단 근거를 짧게라도 명시한다 | ☐ |
| 최소 터치 타깃/탭바 겹침 회피 근거 | 권장 | 탭바가 있는 화면을 전제로 하단 오프셋을 탭바 높이만큼 두는 이유를 근거(A.5 공식 사용성 규칙)와 함께 설명한다 | ☐ |

## 통과 기준

필수 5항목 100% + 권장 3항목 중 70%(3/3 중 2/3) 이상.

## 정답 근거 (참조해야 할 스킬 파일)

- `skills/krds-react-dev/SKILL.md` — §1 스택 감지 분기("reactNative: true"일 때 `references/react-native/README.md`부터 읽는다), §2 토큰 우선 원칙(RN은 `data/kit/rn-tokens.json`)
- `skills/krds-react-dev/references/react-native/README.md` — "공식 근거 앵커링" vs "⚠️ 자체 판단" 구분 원칙, 다크·고대비 대응(`useColorScheme` 오용 금지)
- `skills/krds-react-dev/references/react-native/tokens-usage.md` — `rn-tokens.json` 실제 키 경로 사용법
- `skills/krds-react-dev/references/react-native/component-mapping.md` — A.5 토스트 절(구조, 공식 용례, 공식 사용성 규칙, RN 구현 요구사항), "접근성 매핑 원칙" 5번(동적 알림 live region)
