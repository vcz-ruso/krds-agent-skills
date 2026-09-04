# KRDS 디자인 토큰 레퍼런스

krds-react로 UI를 구현할 때 색상·타이포그래피·간격·radius·border에 하드코딩 값을 쓰지 않고 아래 KRDS 디자인 토큰(CSS 변수)을 사용하기 위한 실무 조회용 문서다. 전량 나열이 아니라 네이밍 패턴 + 카테고리별 대표 변수로 구성했으므로, 표에 없는 변수는 패턴으로 유추하고 필요하면 `data/kit/resources/css/token/krds_tokens.css`에서 직접 확인한다.

## 1. 토큰 3계층 구조

KRDS 토큰은 primitive → semantic → component 3레벨로 구성된다. primitive 값을 바꾸면 이를 참조하는 모든 상위 토큰이 자동으로 갱신된다.

| 레벨 | 정의 | 직접 사용 | 예시 |
| --- | --- | --- | --- |
| Primitive | color, typo, spacing(number), radius 등 가장 기본적인 디자인 속성값. 다른 토큰의 참조 대상일 뿐 그 자체로는 사용하지 않는다. | 금지 | `primary-50`, `gray-5`, `number-4` |
| Semantic | 특정 맥락에서의 의미(배경, 아이콘, 테두리 등 역할)를 부여해 primitive를 참조한다. Figma·CSS 양쪽에 존재하는 가장 마지막 "디자인 툴 레벨" 토큰이다. | 컴포넌트를 새로 만들 때 이 레벨까지 사용 | `color-icon-primary`, `color-border-gray-light` |
| Component | 버튼·인풋·카드 등 특정 UI 컴포넌트에 직접 적용되는 표현. semantic을 참조하며 코드(CSS)에서만 정의된다(디자인 툴에는 존재하지 않음). krds-react 내부 컴포넌트 스타일이 이 레벨을 사용한다. | krds-react 내부 구현용, 앱 코드에서 새 컴포넌트를 만들 때만 정의 | `--namespace-component--theme-type-size-modifier` |

출처: `data/site/style/style_07.md`

## 2. 네이밍 규칙 요약

토큰 네이밍은 `namespace > theme > category > component > type > variant > element > state > size > modifier` 순으로 좁혀가며 구성되고, 단어 구분자는 하이픈(`-`)을 사용해 CSS와 일관성을 유지한다(점·슬래시보다 가독성이 높다는 것이 근거). 축약어는 금지한다 — `bg`가 아니라 `background`, `xs`가 아니라 `xsmall`을 쓴다. 시각적 속성(예: "파란색 버튼")이 아니라 기능적 역할을 기준으로 이름을 짓는다.

| 세그먼트 | 의미 | 값 예시 |
| --- | --- | --- |
| namespace | 코드 구분용 접두사 | `krds` |
| theme | 스타일 모드 | `light`, `high-contrast` |
| category | 토큰의 큰 범주 | `color`, `typography`, `spacing`, `shape` |
| component | UI 요소 | `button`, `input`, `link`, `card` |
| type | 카테고리 내 역할 | `background`, `surface`, `icon`, `padding`, `text` |
| variant | 계층/시스템 구분 | `primary`, `secondary`, `tertiary`, `danger`, `warning`, `success`, `info` |
| element | 컴포넌트 하위 구성 요소 | `label`, `title`, `body`, `line` |
| state | 상호작용 상태 | `default`, `hover`, `pressed`, `focused`, `disabled`, `error`, `active`, `completed`, `selected`, `unselected`, `indeterminate` |
| size | 크기(약어 금지) | `xxsmall`, `xsmall`, `small`, `medium`, `large`, `xlarge`, `xxlarge` |
| modifier | 추가 스타일/변형 | `rounded`/`square`, `line`/`fill`, `subtler`/`subtle`/`bold`/`bolder`, `lighter`/`light`/`dark`/`darker` |

색상 팔레트 계열은 `primary-10`, `primary-20`처럼 10 단위 숫자 척도로 명도·채도 변화를 표현하고, 세밀한 조정이 필요하면 5 단위(`primary-5`, `primary-95`)를 추가한다. 간격·radius 등 숫자 토큰은 4px·8px의 배수를 기본으로 하고 2px·10px을 중간 단계로 보충한다.

컴포넌트 토큰(코드 전용)은 컴포넌트명을 다른 속성보다 먼저 쓰고 컴포넌트명 뒤에 더블 대시(`--`)를 붙여 구분한다: `--namespace-component--theme-type-size-modifier`. padding/margin의 좌우·상하가 동일하면 `-x`/`-y`로 축약한다(예: `--namespace-component--type-padding-x`).

출처: `data/site/utility/utility_03.md`, `data/site/style/style_07.md`

## 3. CSS 변수 사용법

krds-react가 로드하는 `krds_tokens.css`(`data/kit/resources/css/token/krds_tokens.css`)는 `:root`에 6개 블록으로 변수를 선언한다.

| 블록 | 내용 | 변수 접두 패턴 |
| --- | --- | --- |
| PRIMITIVE | 색상 팔레트(0/5/10…95/100), 타이포 서체·자간, 숫자 스케일(`number-0`~`number-21`, `number-max`) | `--krds-color-{light\|high-contrast}-{palette}-{step}`, `--krds-typo-*`, `--krds-number-{n}` |
| MODE-LIGHT | 기본 모드 시맨틱 색상·border-width (primitive를 `var()`로 참조) | `--krds-light-color-{type}-{variant}[-{state}]`, `--krds-light-border-width-{variable\|static}-{regular\|medium}` |
| MODE-HIGH-CONTRAST | 선명한 화면 모드 시맨틱 색상·border-width (같은 type/variant, 다른 palette step 참조) | `--krds-high-contrast-color-{type}-{variant}[-{state}]`, `--krds-high-contrast-border-width-*` |
| RESPONSIVE-PC | PC 화면용 폰트 크기·레이아웃 gap·카드 padding | `--krds-pc-font-size-{category}-{size}`, `--krds-pc-gap-layout-*`, `--krds-pc-padding-card-{size}` |
| RESPONSIVE-MOBILE | 모바일 화면용 대응 값(PC와 동일 키, 값만 축소) | `--krds-mobile-font-size-*`, `--krds-mobile-gap-layout-*`, `--krds-mobile-padding-card-*` |
| SEMANTIC | 모드·반응형에 무관한 숫자 스케일(간격/패딩/높이/radius) | `--krds-gap-{n}`, `--krds-padding-{n}`, `--krds-size-height-{n}`, `--krds-radius-{size}{n}`, `--krds-radius-max` |

사용법은 표준 CSS 변수 함수다.

```css
.card {
  background: var(--krds-light-color-surface-white);
  border: var(--krds-light-border-width-variable-regular) solid var(--krds-light-color-border-gray-light);
  padding: var(--krds-padding-6);
  border-radius: var(--krds-radius-medium1);
}
```

라이트/고대비 모드 전환은 컴포넌트 CSS가 아니라 상위(테마) 레벨에서 `--krds-light-*` ↔ `--krds-high-contrast-*` 세트를 스위칭하는 방식으로 처리된다 — 개별 컴포넌트 코드에서 모드별 분기를 직접 작성하지 않는다.

### 3.1 카테고리별 대표 변수

#### 색상 (color) — MODE-LIGHT 기준, 괄호는 대응하는 MODE-HIGH-CONTRAST 변수

| 변수 | 참조 primitive (light) | 용도 |
| --- | --- | --- |
| `--krds-light-color-text-basic` | `--krds-color-light-gray-90` | 본문 텍스트 |
| `--krds-light-color-text-primary` | `--krds-color-light-primary-60` | 강조 텍스트 (↔ `--krds-high-contrast-color-text-primary`) |
| `--krds-light-color-background-white` | `--krds-color-light-gray-0` | 페이지 배경 (↔ `--krds-high-contrast-color-background-white`) |
| `--krds-light-color-surface-white` | `--krds-color-light-gray-0` | 카드 등 표면 |
| `--krds-light-color-border-gray` | `--krds-color-light-gray-30` | 기본 테두리 (↔ `--krds-high-contrast-color-border-gray`) |
| `--krds-light-color-icon-danger` | `--krds-color-light-danger-50` | 오류 아이콘 (↔ `--krds-high-contrast-color-icon-danger`) |
| `--krds-light-color-button-primary-fill` | `--krds-color-light-primary-50` | 주요 버튼 배경 |
| `--krds-light-color-link-default` | `--krds-color-light-primary-50` | 링크 기본색 |
| `--krds-light-color-input-border-error` | `--krds-color-light-danger-50` | 입력 오류 테두리 |
| `--krds-light-color-action-disabled` | `--krds-color-light-gray-20` | 비활성 상호작용 요소 |

나머지 색상 변수는 `--krds-{light|high-contrast}-color-{type}-{variant}[-{state}]` 패턴(type: `surface`/`border`/`divider`/`text`/`icon`/`link`/`button`/`background`/`element`/`action`/`input`/`graphic`/`alpha`)으로 `krds_tokens.css`의 MODE-LIGHT/MODE-HIGH-CONTRAST 블록에서 조회한다.

#### 타이포그래피 (typography)

| 변수 | 값(예시) | 용도 |
| --- | --- | --- |
| `--krds-typo-font-type` | `Pretendard GOV` | 기본 서체 |
| `--krds-typo-font-weight-regular` / `-bold` | `Regular` / `Bold` | 폰트 굵기 |
| `--krds-pc-font-size-body-medium` | `1.7rem` | PC 본문 기본 크기 |
| `--krds-pc-font-size-heading-medium` | `2.4rem` | PC 제목 |
| `--krds-mobile-font-size-body-medium` | `1.7rem` | 모바일 본문(대부분 body/label은 PC와 동일) |
| `--krds-mobile-font-size-heading-medium` | `2.2rem` | 모바일 제목(heading·display 계열은 PC보다 축소) |

`font-size` 계열은 `display`/`body`/`label`/`heading`/`navigation-title`/`navigation-depth` 카테고리 × `xsmall`~`xlarge` 크기로 반복되며, PC/모바일 접두만 다르고 값은 반응형으로 달라진다.

#### 간격/스페이싱 (spacing)

| 변수 | primitive 참조 | 값 |
| --- | --- | --- |
| `--krds-gap-5` | `--krds-number-5` | `0.8rem` |
| `--krds-gap-8` | `--krds-number-7` | `1.2rem` |
| `--krds-padding-6` | `--krds-number-8` | `1.6rem` |
| `--krds-padding-8` | `--krds-number-10` | `2.4rem` |
| `--krds-size-height-7` | `--krds-number-16` | `4.8rem` |
| `--krds-pc-gap-layout-h1-h2` | `--krds-number-16` | 섹션 제목 사이 간격(PC) |
| `--krds-mobile-gap-layout-h1-h2` | `--krds-number-12` | 섹션 제목 사이 간격(모바일, PC보다 좁음) |

`--krds-gap-{1..12}`, `--krds-padding-{1..10}`, `--krds-size-height-{1..11}`은 모두 작은 단계→큰 단계 순으로 `--krds-number-{n}` primitive(4px/8px 배수 + 2px/10px 보정 단계)를 참조한다. 레이아웃 간격은 `--krds-pc-gap-layout-*` / `--krds-mobile-gap-layout-*`로 별도 반응형 세트가 있다.

#### Radius (모서리 둥글기)

| 변수 | 값 |
| --- | --- |
| `--krds-radius-xsmall1` | `0.2rem` |
| `--krds-radius-small1` | `0.4rem` |
| `--krds-radius-medium1` | `0.6rem` |
| `--krds-radius-large1` | `1rem` |
| `--krds-radius-xlarge1` | `1.2rem` |
| `--krds-radius-max` | `100rem` (pill/원형) |

#### Border

| 변수 | 값 | 용도 |
| --- | --- | --- |
| `--krds-light-border-width-variable-regular` | `0.1rem` | 기본 모드, 상태에 따라 굵기가 변하는 테두리(기본) |
| `--krds-light-border-width-variable-medium` | `0.2rem` | 기본 모드, 강조 시 굵어지는 테두리 |
| `--krds-high-contrast-border-width-variable-regular` | `0.2rem` | 고대비 모드 — 동일 역할이라도 기본값 자체가 더 굵다 |
| `--krds-light-border-width-static-regular` / `-medium` | `0.1rem` / `0.2rem` | 모드가 변해도 고정되는 테두리 굵기 |

## 4. 색상 시스템

### 4.1 시맨틱 역할

색상 시스템은 주요 색상(Primary/Secondary/Gray), 강조 색상(Accent), 그래픽 색상(Graphic), 시스템 색상(Danger/Warning/Success/Information)으로 구성된다.

| 역할 | 용도 |
| --- | --- |
| Gray | 중립적 정보, 배경, 구분선, 텍스트 |
| Primary | 주요 상호작용 요소(중요 버튼, 링크 등) |
| Secondary | 보조 상호작용 요소(사이드 메뉴 등 대부분의 UI 요소) |
| Accent(Point) | 강조 요소, 전체 UI의 5% 이하로 제한 사용(새 알림, 중요 배지 등) |
| Graphic | 차트/배너/일러스트 등 보조 시각 요소 |
| Danger / Warning / Success / Information | 오류 / 경고 / 성공 / 안내 상태 전달 |

시스템 색상별 기본 모드(light) / 선명한 화면 모드(high-contrast) 매핑 예 — danger 기준:

| 용도 | light | high-contrast |
| --- | --- | --- |
| 아이콘 | `danger-50` | `danger-20` |
| 텍스트 | `danger-60` | `danger-20` |
| 배경 | `danger-5` | `danger-95` |
| 보더 | `danger-10` | `danger-90` |

warning/success/information도 동일한 단계 패턴(아이콘/텍스트: `-50`/`-60` ↔ `-20`, 배경: `-5` ↔ `-95`, 보더: `-10` ↔ `-90`)을 따른다. 고대비 모드에서는 배경·보더가 어두운 방향(높은 step)으로, 텍스트·아이콘은 더 낮은 step으로 이동해 항상 배경과의 대비를 높인다.

출처: `data/site/style/style_02.md`

### 4.2 매직넘버 ↔ WCAG 대비

매직넘버는 색상 팔레트 단계와 WCAG 명도 대비 기준을 연결하는 수치다. 팔레트를 만들거나 새 색상을 검증할 때 기준으로 삼는다.

| 매직넘버 | 명도 대비 | 적용 예 |
| --- | --- | --- |
| 40 | 3:1 | 아이콘 기본 대비(기본 모드) |
| 50 | 4.5:1 | 본문 텍스트, 인풋 보더 기본 대비 |
| 70 | 7:1 | 아이콘 대비(선명한 화면 모드), 텍스트 최소 대비(선명한 화면 모드) |
| 90 | 15:1 | 본문 텍스트 대비(선명한 화면 모드) |

실무 적용 규칙(gray-0 백색 배경 기준):

- 기본 모드 텍스트: 최소 매직넘버 40, 본문은 매직넘버 50 이상.
- 선명한 화면 모드 텍스트: 매직넘버 70 이상, 본문은 매직넘버 90(15:1).
- 인풋 보더: 기본/선명한 화면 모드 모두 매직넘버 50 (선명한 화면 모드는 두께로 추가 보정).
- 아이콘: 기본 모드 매직넘버 40, 선명한 화면 모드 매직넘버 70.

`gray-0`(흰색)이 아닌 다른 배경 위에 올릴 때는 그 배경 기준으로 매직넘버를 다시 계산해야 한다. 배경과 명도가 가까운 5, 95단계는 기본/선명한 화면 모드 모두에서 배경과 혼동되기 쉬우므로 주의한다.

출처: `data/site/style/style_02.md`

### 4.3 60-30-10 규칙

색상 비율은 60-30-10 원칙을 따른다.

| 비율 | 역할 | 대응 색상 유형 |
| --- | --- | --- |
| 60% | 배경 및 중립적인 색상 | surface, background, text, icon, divider, element |
| 30% | 보조 색상 | element, border, divider, action, icon, text |
| 10% | 주요 기능/중요 상호작용 색상 | element, action, icon, link, button, input, text |

강조 색상(Accent/Point)은 이 비율과 별개로 알림·배지 등에 최대 5%까지만 제한적으로 사용한다 — 과도하게 사용하면 색각 이상자가 인지하기 어려워진다.

출처: `data/site/style/style_02.md`

## 5. 하드코딩 금지 원칙

색상·간격·타이포그래피 값을 헥스코드·px 리터럴로 직접 쓰지 않고 반드시 위 CSS 변수를 통해 참조한다. 시각적 속성이 아니라 역할(semantic) 기준으로 선택한다 — 예를 들어 "파란색이라서" `#256ef4`를 쓰는 것이 아니라 "주요 액션이라서" `--krds-light-color-button-primary-fill`을 쓴다.

```css
/* 잘못된 예 — 하드코딩, 모드 전환·접근성 대비 미반영 */
.alert-danger {
  color: #bd2c0f;
  background: #fdefec;
  border: 1px solid #fcdfd9;
  padding: 12px;
  border-radius: 6px;
}
```

```css
/* 올바른 예 — 시맨틱 토큰 사용, 선명한 화면 모드에서 자동으로 대비 확보 */
.alert-danger {
  color: var(--krds-light-color-text-danger);
  background: var(--krds-light-color-surface-danger-subtler);
  border: var(--krds-light-border-width-variable-regular) solid var(--krds-light-color-border-danger-light);
  padding: var(--krds-padding-7);
  border-radius: var(--krds-radius-medium1);
}
```

```tsx
/* React 인라인 스타일에서도 동일하게 var()를 그대로 사용한다 */
function Callout() {
  return (
    <div
      style={{
        color: 'var(--krds-light-color-text-primary)',
        background: 'var(--krds-light-color-surface-primary-subtler)',
        padding: 'var(--krds-padding-6)',
      }}
    >
      안내 메시지
    </div>
  );
}
```

krds-react 컴포넌트를 그대로 사용하는 경우 컴포넌트 내부가 이미 component 토큰(semantic을 참조)으로 스타일링되어 있으므로, `className`/`style`로 값을 덮어쓰지 말고 컴포넌트가 제공하는 variant/size prop으로 표현한다. prop으로 표현 불가능한 커스텀 스타일이 꼭 필요할 때만 위 예시처럼 semantic 토큰을 참조해 작성한다.

---

데이터 출처: `data/kit/resources/css/token/krds_tokens.css`, `data/kit/tokens/transformed_tokens.json`, `data/site/style/style_02.md`, `data/site/style/style_07.md`, `data/site/style/style_07_popup.md`, `data/site/utility/utility_03.md`
