# KRDS 컴포넌트 → React Native 매핑

이 문서는 세 절로 구성된다.

- **A절**: KRDS가 공식으로 문서화한 모바일 전용 컴포넌트 8종(`data/site/component/component_12_01.md`~`component_12_08.md`). 웹이 아니라 모바일 UX를 전제로 쓰여 있어 RN 매핑의 신뢰도가 가장 높다.
- **B절**: 웹 컴포넌트 42종(`skills/krds-react-dev/references/components/README.md` 색인 기준) 중 RN에 개념적으로 자연스럽게 대응되는 것들의 매핑표.
- **C절**: 같은 42종 중 RN(네이티브 앱 화면)에는 대응하지 않는 것들과 그 이유.

특정 구현 라이브러리(react-navigation, reanimated, react-native-svg 등) 채택은 이 문서의 범위 밖이다. "무엇을 만족해야 하는가"를 기준으로 서술하며, RN 코어 API(View/Pressable/Modal/TextInput/ActivityIndicator/Switch/AccessibilityInfo 등)만 전제한다.

---

## A절 — 공식 모바일 컴포넌트 8종

### A.1 범위 슬라이드 (component_12_01.md)

**구조**: 레이블 / 슬라이더 / 핸들 / 선택 값 / 범위 값(최소·최대).

**공식 용례**: 정확한 수치보다 "범위 내 상대적 위치"가 중요할 때(볼륨, 밝기, 해상도, 선호도 등) 사용하고, 정확한 값 입력이 필요하거나 단순 ON/OFF·3단계 선택이면 부적합하다고 명시한다.

**공식 사용성 규칙**: (1) 레이블 항상 제공, (2) 선택 값은 핸들 위 또는 슬라이더 끝— **하단 배치 금지**(터치 조작 시 손가락에 가려지기 때문), (3) 드래그 조작과 슬라이더 특정 위치 탭 조작 모두 지원, (4) 최소·최대 범위 정보 항상 표시, (5) 단계(step)는 전체 범위의 10~20%로 — 너무 세밀하게 나누지 않음.

**RN 구현 요구사항**:
- 핸들 드래그(PanResponder 또는 제스처 API)와 트랙 탭 모두로 값 변경 가능해야 한다(공식 근거).
- 선택 값 텍스트는 핸들 근접 배치, 화면 하단 고정 배치 금지(공식 근거).
- 핸들 터치 영역 44×44dp 이상(근거: `data/site/utility/utility_04.md:192` 아이콘 버튼류 최소 크기 원칙을 컨트롤 일반에 적용 — ⚠️ 자체 판단으로 확장 적용).
- ⚠️ 자체 판단: 스크린 리더 대응은 공식 문서에 언급이 없다. `accessibilityRole="adjustable"`, `accessibilityValue={{ min, max, now }}`, `onAccessibilityAction`으로 increment/decrement를 받아 값을 조정하는 패턴(WCAG 슬라이더 관용 패턴)을 적용할 것을 제안한다.

### A.2 뒤로가기 버튼 (component_12_02.md)

**구조**: 뒤로가기 버튼(상단바 좌측 고정) / 화면 제목.

**공식 사용성 규칙**: (1) 항상 상단바 좌측에 배치, (2) 이전 화면(또는 상위 단계)으로 이동이 기본 동작이며 닫기·취소 버튼과 역할을 명확히 구분, (3) 이동 결과를 사용자가 예측 가능해야 함, (4) 작성 중인 내용이 사라질 수 있는 상황에서는 항상 사전 경고, (5) 상단 뒤로가기 버튼과 OS 시스템 back(제스처/버튼)이 서로 다른 화면으로 이동하는 등 결과가 달라져서는 안 됨.

**RN 구현 요구사항**:
- 화면 헤더 좌측에 고정 배치(공식 근거). 네비게이션 스택 헤더를 쓰든 커스텀 헤더를 쓰든 위치 규칙은 동일하게 적용한다.
- Android 하드웨어/제스처 back과 헤더의 뒤로가기 버튼이 같은 목적지로 이동하도록 두 트리거를 동일한 핸들러에 연결해야 한다(공식 근거 — "동일하게 동작하여야 한다"). ⚠️ 자체 판단: 구체적으로는 `BackHandler`(Android)와 헤더 버튼 `onPress`가 같은 함수를 호출하도록 구현.
- 작성 중 데이터 손실 경고는 화면 이탈 직전 확인 다이얼로그로 구현(공식 근거는 "경고해야 한다"까지이며, 다이얼로그 UI 자체는 ⚠️ 자체 판단).
- `accessibilityRole="button"`, `accessibilityLabel`은 "뒤로가기"처럼 동작을 명확히 설명(근거: `utility_04.md` 버튼 접근 가능한 이름 제공 원칙).

### A.3 바텀시트 (component_12_03.md)

**구조**: 오버레이 / 헤더(선택) / 핸들 / 본문 / 닫기 버튼.

**공식 용례**: 화면 컨텍스트를 유지하며 부가 정보·옵션을 짧게 제공할 때 적합. 상시 필요한 정보나 서비스 이용 여정의 한 단계로는 부적합(전용 화면을 쓰라는 의미).

**공식 사용성 규칙**: (1) 스와이프/핸들 탭 닫기만으로는 불충분하므로 **명시적 닫기(X) 버튼을 항상 포함**, (2) 여러 바텀시트를 겹쳐 쌓지 않음 — 불가피하면 현재 단계를 명확히 알리고 "현재 시트만 닫기/전체 닫기"를 구분 제공, (3) 짧은 상호작용에만 사용.

**RN 구현 요구사항**:
- `Modal`(`transparent`, 하단에서 위로 슬라이드하는 애니메이션)로 구현하고 배경 오버레이를 탭하면 닫히도록 한다. 명시적 닫기 버튼은 애니메이션/제스처 닫기와 별개로 항상 렌더링(공식 근거).
- 중첩 바텀시트를 앱 상태로 금지하거나, 열 때 스택 검사를 넣는 것은 ⚠️ 자체 판단(원칙은 공식, 구현 방식은 비공식).
- ⚠️ 자체 판단: Android에서는 하드웨어 back으로도 닫히게 하는 것이 플랫폼 관례에 맞는다(공식 문서에 명시 없음).
- 열렸을 때 배경 콘텐츠와의 상호작용을 차단하고 포커스를 바텀시트 내부로 가두어야 한다(`accessibilityViewIsModal`) — 모달 일반 원칙의 적용이며 이 컴포넌트 문서 자체의 명시 사항은 아니다(⚠️ 자체 판단).

### A.4 수량 토글 (component_12_04.md)

**구조**: 레이블 / 증가·감소 버튼 / 수량 필드.

**공식 용례**: 선택지가 좁고 일반적인 값에 몰리는 경우(발급 수, 인원 수 등)에 적합. 나이처럼 범위가 넓고 다양하면 부적합(텍스트 입력을 쓰라는 의미).

**공식 사용성 규칙**: (1) 레이블 필수, (2) 키보드 직접 입력이 아니라 버튼 탭으로만 값을 바꾸는 것을 전제, (3) 현재 값을 필드에 항상 표시, (4) 기준값 포함 총 11단계 이내로 범위 제한 — 최소/최대 도달 시 해당 증감 버튼을 비활성화, (5) 증감 버튼을 너무 작게 만들거나 붙여 배치하지 말고 필드를 가운데 두고 양쪽에 분리 배치.

**RN 구현 요구사항**:
- 증가/감소 `Pressable` 2개 + 중앙 값 표시(텍스트 또는 read-only 입력) 레이아웃(공식 근거 — 가운데 필드, 분리 배치).
- 경계값 도달 시 해당 버튼 `disabled` + `accessibilityState={{ disabled: true }}`(공식 근거: 비활성화 규칙 + `utility_04.md` 상태 전달 원칙).
- 각 버튼 44×44dp 이상(근거: `utility_04.md:192,202`).
- ⚠️ 자체 판단: 값 변경 시 스크린 리더 알림은 공식 문서에 없으나, 값 필드에 `accessibilityLiveRegion="polite"`를 주어 변경을 announce하는 것을 제안(WCAG spinbutton 관용 패턴 차용).

### A.5 토스트 (component_12_05.md)

**구조**: 컨테이너 / 본문(한 문장).

**공식 용례**: 사용자 행동에 대한 즉각적·경미한 피드백(예: 저장 완료). 긴급/중요 메시지, 두 줄 이상 설명, 추가 행동이 필요한 경우, 개별 폼 필드 오류는 각각 모달·스낵바·인라인 텍스트를 쓰라고 명시(토스트 사용 대상이 아님).

**공식 사용성 규칙**: (1) 화면 중앙 하단, 탭바·플로팅 버튼과 겹치지 않게, (2) 한 줄 메시지로 명확·간결하게, (3) 노출 시간은 정보형 2~3초, 주의·경고형 3~4초.

**RN 구현 요구사항**:
- 최상위 오버레이 뷰로 렌더링하되 **포커스를 가로채지 않아야** 한다(모달이 아니므로). 지정된 시간 후 자동 dismiss(공식 근거: 시간 범위).
- 하단 탭바가 있는 화면에서는 탭바 높이만큼 하단 오프셋을 두어 겹치지 않게 한다(공식 근거).
- ⚠️ 자체 판단: 공식 문서는 스크린 리더 처리를 언급하지 않는다. 일시적으로 나타났다 사라지는 정보이므로 `AccessibilityInfo.announceForAccessibility(message)`(iOS/Android 공용 API)로 능동적으로 알리는 것을 제안한다(WCAG Status Messages 패턴).

### A.6 스낵바 (component_12_06.md)

**구조**: 컨테이너 / 아이콘(선택) / 제목 / 본문(+텍스트링크) / 작업 버튼(선택, 텍스트 버튼) / 닫기 버튼.

**공식 용례**: 되돌리기·재시도 등 사용자가 즉시 취할 수 있는 조치를 메시지와 함께 제공할 때. 긴급/중요 메시지, 긴 설명, 개별 폼 오류에는 부적합(토스트와 동일한 배제 기준 공유).

**공식 사용성 규칙**: (1) 화면 중앙 하단, 탭바·플로팅 버튼과 비중첩, (2) 한 문장 이내로 간결, (3) **한 페이지에 하나의 스낵바만** 표시(겹치거나 쌓지 않음), (4) 작업 버튼은 최대 1개, 텍스트 버튼 형태로 메시지 우측에 배치, (5) 아이콘은 반드시 필요할 때만.

**RN 구현 요구사항**:
- 앱 전역에서 "현재 스낵바는 최대 1개"를 보장하는 큐/상태 관리가 필요하다(공식 근거는 "1개만" 원칙까지이며, 큐 구현 자체는 ⚠️ 자체 판단).
- 작업 버튼은 `accessibilityRole="button"` + 조치 내용을 설명하는 `accessibilityLabel`(공식 근거: 버튼 접근 가능한 이름 원칙 재적용).
- ⚠️ 자체 판단: 자동 dismiss 시간이 공식 문서에 규정되어 있지 않다(토스트와 달리). 사용자가 닫거나 작업 버튼을 누를 때까지 유지하거나, 별도의 넉넉한 타임아웃(예: 5초 이상)을 두는 것을 제안하며, 어느 쪽이든 명시적 닫기 버튼은 유지한다.

### A.7 탭바 (Tab bar) (component_12_07.md)

**구조**: 컨테이너 / 아이콘 / 레이블 / 인디케이터(선택) / 배지(선택).

**공식 용례**: 좁은 화면에서 소수의 상위 화면에 빠르게 접근할 때 사용. 화면 폭이 충분하면 메인 메뉴를 쓰라고 명시(탭바는 탭바 자체가 아니라 좁은 화면 전용 패턴).

**공식 사용성 규칙**: 모든 탭 항목 동일 크기, 선택 상태를 아이콘 형태 변화(라인→글리프) 또는 인디케이터로 명확히 표현, 비선택 항목에 임의로 다른 색을 쓰지 않음(일관성), 탭 개수 5개 이내, 아이콘+레이블 동시 사용, 레이블은 1~2단어로 잘리지 않게, 홈 버튼은 최좌측·전체 메뉴 버튼은 최우측, 화면 하단 고정(스크롤에 숨지 않음, 단 하위 화면에서 탭바 자체를 안 보여주는 것은 허용).

**공식 접근성 규칙(문서에 명시된 절)**:
- "탭바의 역할을 스크린 리더에서 인지할 수 있도록 한다": 네이티브 앱은 iOS `Tab bars`/Android `Navigation bar` 같은 OS 내장 요소를 사용해 다른 요소와 역할이 구분되도록 하라고 명시(근거: KWCAG 2.2 제목 제공, WCAG 2.1 Info and Relationships).
- "활성화된 메뉴 정보가 스크린 리더로 전달될 수 있도록 한다": 네이티브 앱은 OS 내장 요소를 쓰면 별도 설정 없이 선택 상태가 전달된다고 명시(근거: WCAG 2.1 Name, Role, Value (A)).

**RN 구현 요구사항 및 한계**:
- RN 코어에는 iOS `UITabBar`/Android `BottomNavigationView`에 대응하는 표준 컴포넌트가 없으므로, 공식 문서가 요구하는 "OS 내장 요소 사용"을 RN만으로 완전히 재현할 수 없다 — 커스텀 `View`(Pressable 행)로 구현할 경우 이 격차를 인지하고 접근성 속성으로 최대한 보완해야 한다(⚠️ 자체 판단).
- ⚠️ 자체 판단: RN `accessibilityRole`에는 플랫폼·버전에 따라 `tab`/`tablist`가 없거나 제한적으로만 동작하므로, 각 탭 항목에 `accessibilityRole="button"` + `accessibilityState={{ selected: boolean }}`을 부여하는 것을 최소 대안으로 제안한다(스크린 리더가 selected 상태를 "선택됨"으로 announce).
- 탭 항목 터치 영역 44×44dp 이상(근거: `utility_04.md`), 레이블 잘림 방지를 위해 `numberOfLines={1}` + 폰트 축소보다는 레이블 길이 자체를 짧게 유지(공식 근거: 1~2단어 규칙).

### A.8 스플래시 스크린 (component_12_08.md)

**구조**: 배경 / 브랜드 아이덴티티(로고) / 텍스트 / 스피너.

**공식 용례**: 실행 리소스가 많아 로딩이 오래 걸리거나 브랜드 경험이 중요할 때. 유형은 "헤더형"(OS 기본 최소 구성)과 "브랜드형"(별도 스타일 적용) 2종.

**공식 사용성 규칙**: OS 기본 스플래시 활용을 우선 권장(개별 서비스 브랜드보다 "하나의 정부서비스" 정체성 우선), 테마별(예: 다크 모드) 최적화 고려, OS·버전 무관 일관된 경험, 로딩이 길어지면 진행 피드백 제공(스피너/텍스트/애니메이션 — 애니메이션은 1,000ms 이내로 제작), 텍스트 사용 최소화, 노출 시간을 실제 로딩 시간보다 임의로 늘리지 않음.

**공식 접근성 규칙(문서에 명시된 절)**:
- 중요 정보를 스플래시에 넣지 않는다 — 스크린 리더/읽기 속도가 느린 사용자가 짧게 노출되는 텍스트를 인지하기 어렵기 때문(근거: WCAG 2.1 Pause, Stop, Hide (AA)).
- 애니메이션 사용 시 번쩍임·깜빡임에 유의(광과민성 발작 위험) — 근거: WCAG 2.1 Three Flashes or Below Threshold (A).

**RN 구현 요구사항**:
- "OS 기본 스플래시 활용"이라는 공식 권장을 따르면, JS 레벨에서 그리는 커스텀 스플래시보다 네이티브 스플래시 메커니즘(Android 12+ SplashScreen API, iOS 런치 화면)을 우선 검토해야 한다.
- ⚠️ 자체 판단: 공식 문서의 "다크 모드 최적화"는 OS 표준 다크 모드(`useColorScheme() === 'dark'`)를 가리키는 것으로 해석된다. 이는 `rn-tokens.json`의 `highContrast`(사용자가 켜는 "선명한 화면 모드")와는 다른 축이며, `rn-tokens.json`에는 OS 다크 모드용 색상 세트가 없으므로 스플래시의 다크 배경/로고 색상은 이 토큰 세트 밖에서 별도로 정의해야 한다.
- 로딩 애니메이션 1,000ms 이내, 텍스트 최소화, 중요 정보 배제는 공식 근거를 그대로 준수.

---

## B절 — 웹 컴포넌트 → RN 자연 대응표

이 절의 "RN 대응 요소" 열은 전부 **⚠️ 자체 판단**이다(공식 RN 컴포넌트 명세 자체가 존재하지 않으므로 어떤 RN 프리미티브를 쓸지는 이 저장소가 정한 것). 반면 "핵심 준수 사항" 열에 적힌 구체적 규칙(터치 타깃 크기, 명도 대비, 스크린 리더 role/name/state)은 아래 공식 근거에서 도출했다.

- 터치 영역 44×44dp 이상: `data/site/utility/utility_04.md:192,202`, `data/site/component/component_08_01.md:161,163`, `component_04_09.md:118`, `component_05_01.md:142`, `component_05_02.md:165`
- 버튼/링크/체크박스 등 역할이 스크린 리더에 인지되어야 함: `utility_04.md` — WCAG 2.1 Name, Role, Value (A)
- 상태(선택/비활성 등)를 색상만으로 구분하지 않음: `utility_04.md` — WCAG 2.1 Use of Color (A)
- 텍스트·비텍스트 요소 명도 대비: `data/site/style/style_02.md`(매직넘버 규칙)

| 웹 컴포넌트 | RN 대응 요소 (⚠️ 자체 판단) | 핵심 준수 사항 | 근거 |
| --- | --- | --- | --- |
| Button | `Pressable`/`TouchableOpacity` + `Text` | `minHeight`/`minWidth` 44dp 이상, `accessibilityRole="button"`, `disabled` 시 `accessibilityState.disabled` | 터치 타깃(utility_04.md), Name/Role/Value |
| Checkbox | `Pressable` + 커스텀 체크 아이콘 (RN 코어에 네이티브 체크박스 없음) | `accessibilityRole="checkbox"`, `accessibilityState={{ checked }}`, 인접 배경과 3:1 이상 대비 | Use of Color, 명도 대비(utility_04.md 체크박스 항목) |
| Radio | `Pressable` 그룹 + 커스텀 마커 | `accessibilityRole="radio"`, 그룹 컨테이너는 `accessibilityRole="radiogroup"` + 그룹 레이블 연결 | Info and Relationships, Name/Role/Value |
| TextInput | RN `TextInput` | `colors.light.input.border` / `.borderError` 등 상태별 테두리 색 적용, `accessibilityLabel`(레이블 대체 시) | 색상 토큰(rn-tokens.json colors.light.input), utility_04.md 레이블 제공 원칙 |
| Textarea | RN `TextInput` (`multiline`) | 위와 동일 + `showCount` 대응 시 글자수를 시각·스크린리더 양쪽에 노출 | 동일 |
| Select | 네이티브 대응 없음 — 커스텀 트리거(`Pressable`) + 옵션 목록(Modal/전체화면 리스트) 패턴 | `accessibilityRole="combobox"`(제한적 지원) 또는 트리거는 `button`+`expanded` state, 옵션 리스트는 `accessibilityRole="radiogroup"`에 준해 단일 선택 상태 전달 | Name/Role/Value, 상태 전달 원칙 |
| Modal | RN `Modal` | `accessibilityViewIsModal`, 오버레이 탭/back 제스처로 닫힘, 포커스 트랩 | 모달 일반 접근성 원칙(⚠️ 자체 판단 확장 적용) |
| Tab | `Pressable` 행 + 조건부 렌더 패널 | 각 탭 `accessibilityRole="button"` + `accessibilityState={{ selected }}`(A.7과 동일한 RN role 한계) | Name/Role/Value, A.7 근거 |
| Accordion | `Pressable` 헤더 + 접히는 `View`(LayoutAnimation 등) | 헤더에 `accessibilityRole="button"` + `accessibilityState={{ expanded }}` | Name/Role/Value, 상태 전달 |
| Badge | `View` + `Text` (비대화형) | 정보 전달이 색상에만 의존하지 않도록 텍스트/아이콘 병행 | Use of Color |
| Spinner | RN `ActivityIndicator` | `accessibilityLabel`(예: "로딩 중"), `accessibilityRole="progressbar"` | Name/Role/Value |
| ToggleSwitch | RN `Switch` | `accessibilityRole="switch"`(Switch는 기본 제공), `accessibilityState={{ checked }}` | Name/Role/Value |
| Tag | `View` + `Text`(선택형은 `Pressable`) | 선택 상태를 색상 외 텍스트/아이콘으로도 구분 | Use of Color |
| Tooltip | 네이티브 대응 없음 — 트리거 근접 절대 위치 `View`(팝오버) | 마우스 hover 전제 대신 탭/롱프레스로 트리거, 닫기 수단 명시 제공 | 웹 hover 전제가 터치에 없음을 반영한 재해석(⚠️ 자체 판단 전면) |
| Pagination | `Pressable` 행 | 각 페이지 버튼 `accessibilityLabel="페이지 N"`, 현재 페이지는 `accessibilityState={{ selected: true }}` | Name/Role/Value |
| StepIndicator | `View` 행(진행 마커) | `accessibilityRole="progressbar"` 또는 각 단계에 완료/현재/예정 상태를 `accessibilityLabel`로 명시 | 상태 전달 원칙 |
| Link | `Text`(`onPress`) 또는 `Pressable` | `accessibilityRole="link"` | Name/Role/Value |
| CriticalAlert | 화면 상단 고정 `View` | `accessibilityRole="alert"`(또는 `AccessibilityInfo.announceForAccessibility`로 등장 시 즉시 announce) | Name/Role/Value, A.5/A.6과 동일한 live-region 필요성 |
| DateInput | `TextInput`(포맷 마스킹) + 네이티브 날짜 선택 화면(Modal) | 선택된 날짜를 텍스트로도 노출(스크린 리더가 값 인지 가능하도록) | 값 전달 원칙 |
| FileUpload | OS 파일/이미지 선택기 연동 + 선택 결과 목록(`FlatList`) | 선택된 파일명·상태(업로드 중/실패)를 텍스트로 노출 | 상태 전달 원칙 |
| Disclosure | Accordion과 동일 패턴(단일 섹션) | Accordion 항목과 동일 | Name/Role/Value |
| ContextualHelp | 아이콘 `Pressable` + 팝오버/바텀시트 | 트리거에 `accessibilityLabel="도움말"`, 콘텐츠는 명시적 닫기 수단 제공 | Name/Role/Value |
| CoachMark | 오버레이 `View`(대상 강조) + 단계 안내 카드 | 스텝 진행 상태와 "건너뛰기"/"다음" 조작을 스크린 리더로도 조작 가능하게 | 상태 전달, 키보드/스크린리더 조작 보장 원칙 |
| HelpPanel | 사이드 패널 → RN에서는 바텀시트 또는 전체화면 `Modal` | 본문과의 관계를 `accessibilityLabel`/제목으로 명시 | Info and Relationships |
| StructuredList | `FlatList`/`SectionList` | 각 행이 개별 대상으로 인지되도록 `accessible={true}` 단위 조정 | Name/Role/Value |
| TextList | `View` + `Text`(계층 들여쓰기) | 계층 구조를 시각적 들여쓰기뿐 아니라 텍스트 구조(줄바꿈 순서)로도 유지 | Info and Relationships |
| Table | 가로 `ScrollView` + 커스텀 그리드(`View` 행/열) | RN에 표 시맨틱이 없어 헤더-셀 관계를 시각 정렬로만 전달하게 되는 한계를 인지, 헤더 텍스트 반복 등으로 보완 | Info and Relationships(한계 명시, ⚠️ 자체 판단) |
| Calendar | 커스텀 날짜 그리드(`View`/`Pressable` 42~箱 그리드) | 각 날짜 셀 44×44dp 이상, 선택/오늘/비활성 상태를 색상+텍스트 병행 | 터치 타깃, Use of Color |
| TutorialPanel | 페이징 `ScrollView`(가로) 또는 `Modal` 단계 카드 | 단계 이동 컨트롤에 명확한 label, 현재 단계 announce | 상태 전달 원칙 |

---

## C절 — RN 무대응 (웹 전용 네비게이션·문서 구조 컴포넌트)

다음 13종은 URL 기반 페이지 구조, DOM 랜드마크, 브라우저 히스토리 등 **웹 특유의 개념에 결합**되어 있어 네이티브 앱 화면(스택 기반 화면 전환)에는 개념적으로 대응하지 않는다. RN으로 이식하려 하기보다, 각 컴포넌트가 웹에서 해결하는 문제를 네이티브 앱 관례로 다시 푸는 것이 맞다.

| 웹 컴포넌트 | 대응하지 않는 이유 | 네이티브 앱에서의 대안 |
| --- | --- | --- |
| SkipLink | 키보드 사용자가 반복 콘텐츠(헤더 등)를 건너뛰고 `#id`로 점프하는 페이지 내 앵커 링크. RN 화면에는 URL 프래그먼트나 "반복되는 헤더를 건너뛰어야 하는" 페이지 개념이 없다. | 화면 자체를 짧게 구성하고, 포커스 순서(`accessible`/`importantForAccessibility` 순서)를 화면 진입 시 주요 콘텐츠부터 오도록 설계 |
| Masthead | 도메인이 정부 공식 사이트임을 브라우저 최상단에서 알리는 웹 배너(주소창 인접). 앱은 스토어 배포·아이콘·앱 이름 자체가 신뢰 식별 수단이다. | 앱 정보 화면(설정 > 정보)에 동일 문구 제공 |
| Identifier | 웹 최하단에서 운영기관을 명시하는 푸터 하위 요소. | 앱 정보/설정 화면에 운영기관 정보 섹션으로 제공 |
| Breadcrumb | 계층적 URL 경로를 시각화하는 웹 내비게이션. 앱은 스택 기반 화면 전환(뒤로가기)이 계층 이동을 대체한다. | A.2 뒤로가기 버튼 + 필요 시 화면 상단에 현재 위치 타이틀만 표시 |
| Header | 검색·메인 메뉴 등을 담은 웹 최상단 영역. 앱에서는 화면별 상단 바(뒤로가기/타이틀/액션)로 대체되며 하나의 고정된 "헤더"가 전 화면에 동일하게 있지 않다. | 화면별 네비게이션 헤더 + A.7 탭바(전역 진입점) |
| Footer | 사이트 전역 링크 모음(웹 페이지 하단). 앱은 페이지 개념이 없고 탭바/설정 화면이 전역 진입점 역할을 한다. | 설정 화면에 관련 링크 모음 배치 |
| MainMenu | 헤더와 결합된 웹 1차 내비게이션(메가메뉴 등). | 좁은 화면 전제인 A.7 탭바 또는 별도 메뉴 화면 |
| SideNavigation | 넓은 화면에서 본문 좌측에 고정하는 하위 내비게이션. 좁은 모바일 화면 폭에서는 상시 고정이 성립하지 않는다. | 별도 메뉴 화면 또는 화면 상단 드롭다운형 선택 |
| InPageNavigation | 스크롤 중 특정 스크롤 위치에 고정되어 페이지 내 앵커로 이동하는 목차. `#id` 스크롤 이동이라는 웹 동작에 결합. | 화면을 섹션별로 분리하거나, `ScrollView`의 `scrollTo` 오프셋으로 유사 기능을 구현할 수는 있으나 이는 이 문서의 매핑 대상이 아님(필요하면 별도 판단 필요) |
| Portal | React DOM 트리 밖(다른 DOM 노드)으로 렌더링을 이동시키는 웹 DOM 전용 기법. RN에는 별도 DOM 트리 개념이 없고 `Modal`이 이미 최상위 렌더링을 보장한다. | 불필요 — `Modal` 자체가 대체 |
| Resize | 브라우저/OS의 텍스트 확대·축소 설정을 웹 페이지가 상대 단위(rem/%)로 따라가게 하는 패턴. | OS 접근성 글자 크기 설정 대응은 RN의 `PixelRatio.getFontScale()`/`allowFontScaling`으로 별도 처리 — Resize 컴포넌트 자체의 이식 대상은 아님 |
| LanguageSwitcher | 콘텐츠 언어를 변경하며 대개 별도 URL/도메인으로 이동하는 웹 내비게이션 동작. | 앱 설정 화면의 언어 선택 항목(OS 로케일과 별개로 인앱 상태 전환) |
| Dropdown | 색인에 "barrel 미노출"로 표기되어 있어 패키지에서 실제로 내보내지지 않는 컴포넌트다(실사용 대상 아님). 개념적으로 겹치는 것은 B절의 Select. | B절 Select 항목 참고 |

---

## 접근성 매핑 원칙 (요약)

1. **터치 타깃 최소 44×44dp**. 공식 근거: `data/site/utility/utility_04.md:192,202`("아이콘 버튼의 크기를 44px x 44px 이상으로 제공"), `component_08_01.md:161,163`, `component_04_09.md:118`, `component_05_01.md:142`, `component_05_02.md:165`(마우스 17×17px / 터치 44×44px 이상). RN에서는 `hitSlop`으로 시각 크기를 키우지 않고 터치 영역만 확장하는 방식도 허용되지만, 시각 크기 자체가 44dp 미만이면 저시력 사용자에게는 여전히 불리하므로 **시각 크기 자체를 44dp 이상으로 맞추는 것을 기본으로 한다**(⚠️ 자체 판단: `hitSlop`만으로 대체 가능하다고 보지 않음).
2. **`accessibilityRole`**: 웹 ARIA role에 대응하는 RN 코어 role을 우선 사용한다(button/link/checkbox/radio/switch/alert/progressbar/adjustable 등). RN 코어에는 `tab`/`tablist`/`combobox` 등 일부 웹 ARIA role에 정확히 대응하는 role이 버전·플랫폼에 따라 없거나 제한적이므로(A.7, B절 Select·Tab 참고), 이 경우 `accessibilityRole="button"` + `accessibilityState`로 근사하는 것을 최소 기준으로 삼는다(⚠️ 자체 판단).
3. **`accessibilityLabel`**: 아이콘만 있는 컨트롤은 반드시 텍스트 대체(`accessibilityLabel`)를 제공한다(근거: `utility_04.md` 적절한 대체 텍스트 제공 / KWCAG 2.2).
4. **`accessibilityState`**: 선택(selected)·체크(checked)·비활성(disabled)·확장(expanded) 상태는 색상만으로 표현하지 않고 `accessibilityState`로도 전달한다(근거: WCAG 2.1 Use of Color (A)).
5. **동적 알림(live region)**: 토스트·스낵바·긴급 공지처럼 사용자 조작 없이 나타나는 메시지는 `AccessibilityInfo.announceForAccessibility` 또는 `accessibilityLiveRegion="polite"`로 스크린 리더에 능동적으로 알린다. 공식 컴포넌트 문서(A.5, A.6)에는 이 요구가 명시되어 있지 않으므로 전부 ⚠️ 자체 판단이며, 근거는 WCAG 2.1의 일반 원칙(상태 메시지 인지 가능성)을 이 저장소가 유추 적용한 것이다.
6. **줄 간격**: 텍스트 컴포넌트의 `lineHeight`는 `fontSize × 1.5` 이상(근거: `data/site/style/style_03.md:47,299`). 상세는 `tokens-usage.md` 2절 참조.
