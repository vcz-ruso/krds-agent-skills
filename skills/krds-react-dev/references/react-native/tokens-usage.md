# rn-tokens.json 사용법

이 문서는 `data/kit/rn-tokens.json`(768개 공식 토큰을 RN 상수로 변환한 산출물)의 실제 구조를 카테고리별로 설명한다. 아래 키 경로는 모두 파일에서 직접 확인한 실존 경로다. 값이 바뀔 수 있으니 정확한 리터럴 값이 필요하면 항상 파일을 재확인할 것 — 이 문서는 "어디에 무엇이 있는지"를 안내하는 지도이지, 값 자체의 스냅샷이 아니다.

## 0. 생성 방식 (`_meta`)

`rn-tokens.json._meta`에 변환 규칙이 그대로 기록되어 있다.

- `source`: `data/kit/tokens/transformed_tokens.json` (원본 공식 토큰)
- `remBase`: `16` — 치수 값은 원본 rem 값 × 16을 RN dp 숫자로 사용
- `keyScheme`: 소스 경로의 각 세그먼트를 camelCase로 변환(`gray-subtler` → `graySubtler`). 숫자·`"max"` 세그먼트는 그대로 둠
- `mappingPolicy`: 색상(hex/rgba)은 그대로 통과, 치수는 dp로 변환, `fontWeight`는 named(Regular/Bold)를 CSS 관례에 따라 `"400"`/`"700"` 문자열로 매핑, 참조(`{a.b.c}`)는 전부 리터럴로 해석, RN에 대응 없는 값(box-shadow/transition/cursor 등)은 `unsupported` 배열에 모음(현재 소스 기준 빈 배열 `[]`)

## 1. `colors`

`colors.light`, `colors.highContrast` 두 모드가 있고, 각각 동일한 하위 카테고리 구조를 가진다: `surface`, `border`, `divider`, `text`, `icon`, `link`, `button`, `background`, `element`, `action`, `input`, `graphic`, `alpha`. `colors.primitive.light` / `colors.primitive.light` `.highContrast`에는 원시 팔레트(예: `colors.primitive.light.primary["50"]`)가 별도 보존되어 있다 — 컴포넌트 스타일링에는 semantic 레이어(`colors.light.*`)를 쓰고 primitive는 새 semantic 색이 필요할 때만 참조한다.

실존 키 경로 예시(직접 확인함):

- `colors.light.text.primary` = `"#0b50d0"` (본문 강조 텍스트)
- `colors.light.button.primaryFill` / `.primaryFillHover` / `.primaryFillPressed` — 버튼 상태별 배경색
- `colors.light.input.border` / `.borderActive` / `.borderError` — 입력 필드 테두리 상태
- `colors.highContrast.text.primary` — 고대비 모드 대응 값 (light와 다른 hex)

카테고리별 대표 하위 키(용도 파악용):

| 카테고리 | 대표 하위 키 |
| --- | --- |
| `surface` | `graySubtler`, `disabled`, `primarySubtler`, `white`, `inverse` |
| `border` | `grayLight`, `gray`, `danger`, `warning`, `success` |
| `divider` | `grayLight`, `primary`, `inverse` |
| `text` | `bolder`, `subtle`, `disabled`, `primary`, `danger`, `basic` |
| `icon` | `gray`, `grayFill`, `inverse`, `primary`, `danger` |
| `link` | `default`, `hover`, `pressed`, `visited` |
| `button` | `primaryFill*`, `secondaryFill*`, `tertiaryFill*`, `disabledFill` |
| `background` | `white`, `inverse`, `graySubtler`, `dim` |
| `element` | `primary`, `secondary`, `point`, `danger`, `warning`, `success`, `information` |
| `action` | `primary`, `primaryHover`, `primaryPressed`, `secondarySelected` |
| `input` | `border`, `borderDisabled`, `borderActive`, `borderError`, `surface` |
| `graphic` | `blue*`, `red*` 등 톤 스텝 |
| `alpha` | `base100`~`base0`, `inverse100`~`inverse0` |

RGBA 등 알파 채널이 포함된 색은 hex8 형태(`#ffffff00`처럼 끝 2자리가 알파)로 그대로 들어있다. RN의 `backgroundColor` 등은 `#RRGGBBAA` 8자리 hex를 지원하므로 변환 없이 사용 가능하다.

## 2. `typography`

```json
{
  "fontFamily": "Pretendard GOV",
  "fontWeight": { "regular": { "value": "400", "mappingNote": "..." }, "bold": { "value": "700", "mappingNote": "..." } },
  "letterSpacing": { "0": 0, "1": 1.6 }
}
```

- `typography.fontWeight.regular.value` / `.bold.value` — RN `fontWeight` 스타일 속성에 그대로 대입 가능한 문자열(`"400"`/`"700"`)
- `typography.letterSpacing["0"]` / `["1"]` — RN `letterSpacing`(숫자, dp 단위)에 그대로 대입

### fontFamily 링킹 — ⚠️ 자체 판단

`typography.fontFamily`는 `"Pretendard GOV"` 문자열만 담고 있다. 웹은 `@font-face`로 원격 로드하면 되지만 RN은 폰트 파일을 앱 번들에 직접 포함해 네이티브 레벨에서 링킹해야 한다. `rn-tokens.json`은 이 방법을 규정하지 않으므로 다음은 이 저장소의 판단이다.

- Pretendard GOV 폰트 파일(otf/ttf)을 확보해 `assets/fonts/`에 둔다.
- Expo 관리형 워크플로: `expo-font`의 `useFonts`로 런타임 로드하거나, `app.json`의 `expo-font` 플러그인으로 사전 링킹.
- Bare RN: `react-native.config.js`의 `assets` 경로 등록 후 `npx react-native-asset`(또는 iOS `Info.plist`의 `UIAppFonts` + Android `android/app/src/main/assets/fonts`) 방식으로 링킹.
- `fontFamily` 스타일 값은 플랫폼마다 실제 등록된 PostScript 이름과 일치해야 한다(iOS는 폰트 내부 이름, Android는 파일명 기준인 경우가 많음) — 폰트 파일을 받은 뒤 반드시 실기기/시뮬레이터에서 렌더링 확인 필요.

### 줄 간격(lineHeight) — 토큰에 없음, 공식 규칙으로 계산 — ⚠️ 자체 판단

`rn-tokens.json`에는 `lineHeight` 관련 키가 전혀 없다(소스 토큰 자체에 부재). 다만 공식 스타일 문서에 수치 규칙이 명시되어 있다.

> 줄 간격(line-height)은 가독성과 접근성을 위해 최소 150% 이상으로 설정하여, 시각적 피로를 줄이고 시각장애나 난독증 사용자의 읽기 편의를 높인다. (`data/site/style/style_03.md:47`, 동일 규칙이 `:299`에도 반복됨)

RN `Text`의 `lineHeight`는 절대 dp 값만 받으므로(em/%를 지원하지 않음), 다음과 같이 fontSize 기반으로 계산해 쓴다. 비율을 정확히 1.5로 고정할지, 텍스트 유형(heading/body 등)별로 다르게 줄지는 공식 문서에 세부 규정이 없으므로 이 저장소는 "최소 150%"를 하한선으로 해석해 균일하게 1.5를 적용하는 것을 기본값으로 제안한다.

```ts
const LINE_HEIGHT_RATIO = 1.5; // ⚠️ 자체 판단: style_03.md의 "최소 150%" 하한을 그대로 채택

function withLineHeight(fontSize: number) {
  return { fontSize, lineHeight: Math.round(fontSize * LINE_HEIGHT_RATIO) };
}

const bodyMediumStyle = withLineHeight(krdsTokens.responsive.mobile.fontSize.body.medium);
```

## 3. `spacing`

네 하위 카테고리 모두 dp 숫자 값(rem×16 변환 완료):

- `spacing.scale["0"]`~`["21"]`, `spacing.scale.max` — 범용 간격 스케일
- `spacing.gap["1"]`~`["12"]` — flex `gap`용
- `spacing.padding["1"]`~`["10"]` — 컴포넌트 내부 여백
- `spacing.sizeHeight["1"]`~`["11"]` — 컴포넌트 높이(버튼/입력 필드 등)

예: `spacing.padding["3"]` = `12.8`, `spacing.sizeHeight["1"]` = `12.8`, `spacing.gap["1"]` = `3.2`. RN `StyleSheet`에서 `paddingHorizontal: spacing.padding[3]`처럼 숫자 인덱스로 접근한다(JSON 키가 문자열이므로 TS에서는 `spacing.padding['3']` 또는 인덱스 시그니처 타입 필요).

`spacing.scale.max` = `1600`은 실사용 dp 값이 아니라 원본 토큰(`primitive.number.max` = `100rem`)의 "무제한" 의도를 담은 값이다(근거: `data/kit/tokens/transformed_tokens.json`의 `primitive.number.max`). 레이아웃 폭 제한을 두지 않으려는 의도로 웹에서 쓰이던 값이며, RN에서 그대로 쓰면 사실상 상한이 없는 것과 같은 효과를 낸다.

## 4. `radius` / `borderWidth`

- `radius.xsmall1`~`radius.xlarge2`, `radius.max`(`1600`, 위와 동일한 "무제한" 의도 — 완전한 pill 모양을 만들 때 요소 높이보다 큰 값을 넣는 관용적 패턴과 일치하므로 RN에서도 그대로 사용 가능)
- `borderWidth.light` / `borderWidth.highContrast` 각각 `variableRegular`, `variableMedium`, `staticRegular`, `staticMedium` 4개 키. 고대비 모드는 두께가 더 두꺼운 경우가 있다(예: `variableRegular`가 `light`=`1.6`, `highContrast`=`3.2`) — 색상만 전환하지 말고 테두리 두께도 모드에 맞춰 함께 전환할 것.

## 5. `shadows`

`shadows` 카테고리 키는 존재하지만 현재 `{}`(빈 객체)다. 원본 소스에 box-shadow류 토큰이 없기 때문이며(`_meta.mappingPolicy`가 명시하듯 그런 값은 `unsupported`로 모으게 되어 있는데 `unsupported`도 현재 `[]`) — 그림자가 필요하면 이 토큰에 의존하지 말고 컴포넌트별 공식 문서(있다면)나 별도 판단으로 처리해야 한다.

## 6. `responsive` — RN에서 다루는 지침 (⚠️ 자체 판단)

`responsive.pc` / `responsive.mobile` 각각 `fontSize`(`display`/`body`/`label`/`heading`/`navigation` 세부 단계), `gapLayout`, `paddingCard` 키를 담고 있다. 예: `responsive.mobile.fontSize.body.medium` = `27.2`, `responsive.pc.fontSize.display.large` = `96`.

이 값들은 웹의 CSS 미디어 쿼리(뷰포트 폭 breakpoint) 기준으로 나뉜 것이며, RN에는 미디어 쿼리가 없다. 어떤 분기 기준을 쓸지는 공식 데이터에 규정이 없으므로 다음은 이 저장소의 판단이다.

- `pc` 세트는 "넓은 화면"(태블릿 가로/폴더블 펼침 등), `mobile` 세트는 "좁은 화면"(폰 세로 기준)에 대응한다고 해석한다.
- 분기는 `Dimensions.get('window')` 1회 조회보다 `useWindowDimensions()` 훅을 권장한다(회전·폴더블 변화에 반응형으로 재렌더링되기 때문).
- breakpoint 수치 자체는 KRDS 공식 데이터에 없으므로, 웹 KRDS가 흔히 쓰는 태블릿 경계값(가로 768px 부근)을 잠정 기준으로 제안한다. 프로젝트마다 실제 지원 기기 폭을 재검토해 조정할 것.

```tsx
import { useWindowDimensions } from 'react-native';
import krdsTokens from '../theme/krds-tokens.json';

const TABLET_BREAKPOINT = 768; // ⚠️ 자체 판단: 공식 breakpoint 수치 없음, 잠정값

function useResponsiveTokens() {
  const { width } = useWindowDimensions();
  return width >= TABLET_BREAKPOINT ? krdsTokens.responsive.pc : krdsTokens.responsive.mobile;
}
```

## 7. `unsupported`

현재 `[]`(빈 배열). 원본 소스 토큰에 RN이 표현할 수 없는 값(예: CSS `transition`, `cursor`)이 없어서 비어 있다는 뜻이며, "RN이 모든 값을 지원한다"는 의미가 아니다. 원본 토큰이 갱신되어 새 값이 추가되면 이 배열도 다시 채워질 수 있으니, 토큰 갱신 시 다시 확인할 것.
