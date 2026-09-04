# KRDS React Native 매핑

## 이 문서의 성격

KRDS(범정부 UI/UX 디자인시스템)는 웹(`krds-react`, HTML Component Kit)만 공식 구현체로 제공하며, **React Native(또는 다른 네이티브 프레임워크) 공식 구현은 존재하지 않는다.** 이 디렉터리는 KRDS 공식 산출물이 아니라, AI 코딩 에이전트가 KRDS에 부합하는 React Native 앱을 만들 때 참조하도록 이 저장소가 자체적으로 작성한 **매핑 가이드**다.

따라서 이 문서가 제시하는 모든 대응 관계는 다음 두 종류로 구분된다.

- **공식 근거 앵커링**: KRDS 공식 데이터(`data/kit/rn-tokens.json`의 토큰 값, `data/site/component/component_12_*.md`의 모바일 컴포넌트 문서, `data/site/style/*.md`·`data/site/utility/utility_04.md`의 접근성·스타일 규칙)에서 직접 도출된 값이나 규칙. 저장소 내 경로를 근거로 인용한다.
- **⚠️ 자체 판단**: 공식 데이터에 없어 이 저장소가 RN 구현을 위해 임의로 내린 결정(RN 프리미티브 선택, 폰트 링킹 방법, 반응형 분기 전략 등). 반드시 이 태그와 함께 판단 근거를 명시한다.

공식 근거가 없는 부분을 마치 KRDS 표준인 것처럼 서술하지 않는다. RN 구현 라이브러리(react-navigation, reanimated 등) 채택 여부는 이 문서의 범위 밖이며, 특정 라이브러리를 전제하지 않고 "무엇을 만족해야 하는가"를 기준으로 서술한다.

## 파일 색인

| 파일 | 내용 |
| --- | --- |
| `README.md` | 이 문서. RN 지원 범위 선언, 토큰 사용 개요, 다크·고대비 대응 |
| `tokens-usage.md` | `rn-tokens.json`의 실제 구조를 카테고리별로 문서화. lineHeight·반응형 처리 지침 포함 |
| `component-mapping.md` | 공식 모바일 컴포넌트 8종 매핑(A절), 웹 컴포넌트 42종 중 RN 대응표(B절), RN 무대응 컴포넌트(C절), 접근성 매핑 원칙 |

## 토큰 사용법 개요

`data/kit/rn-tokens.json`은 KRDS 공식 디자인 토큰(`data/kit/tokens/transformed_tokens.json`)을 RN에서 바로 쓸 수 있는 상수로 변환한 산출물이다(색상은 그대로, 치수는 rem×16의 dp 숫자로 변환 — 상세는 `_meta.mappingPolicy` 참조). 사용 패턴은 다음과 같다.

1. `rn-tokens.json`을 프로젝트에 복사한다(예: `src/theme/krds-tokens.json`).
2. TypeScript 상수로 import해 `StyleSheet.create`에서 사용한다.

```ts
// src/theme/tokens.ts
import krdsTokens from './krds-tokens.json';

export const colors = krdsTokens.colors;      // colors.light / colors.highContrast
export const spacing = krdsTokens.spacing;    // spacing.scale / gap / padding / sizeHeight
export const radius = krdsTokens.radius;
export const typography = krdsTokens.typography;
```

```tsx
// 컴포넌트에서 사용
import { StyleSheet, View, Text } from 'react-native';
import { colors, spacing, radius, typography } from '../theme/tokens';

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.light.button.primaryFill,
    paddingVertical: spacing.padding[3],
    paddingHorizontal: spacing.padding[5],
    borderRadius: radius.medium1,
    minHeight: 44, // 터치 타깃 최소 크기, component-mapping.md 접근성 절 참조
  },
  buttonText: {
    color: colors.light.surface.white,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight.bold.value,
  },
});
```

값 원본을 임의로 재계산하지 말 것 — `rn-tokens.json`은 이미 완전히 해석된 리터럴 값이므로 코드에서는 참조만 하면 된다. 카테고리별 실제 키 경로와 값 해석 방법은 `tokens-usage.md`를 참조한다.

## 다크·고대비 대응

`rn-tokens.json.colors`에는 `light`와 `highContrast` 두 모드만 존재하며 **OS 다크 모드(`dark`) 토큰은 없다.** `highContrast`는 KRDS가 정의한 "선명한 화면 모드"로, 사용자가 서비스 내에서 켜는 별도의 접근성 설정이며 명도 대비를 강화한 모드다(근거: `data/site/style/style_02.md:54-60`, "표준형 스타일은 사용자 접근성을 고려하여 일반 모드와 선명한 화면 모드를 제공한다"). OS의 라이트/다크 테마와는 별개 개념이므로, RN의 `useColorScheme()`(`'light' | 'dark'`)을 그대로 `highContrast` 전환 트리거로 쓰면 의미가 어긋난다.

```tsx
// ⚠️ 자체 판단: KRDS 웹에 "선명한 화면 모드" 토글 UI 규격은 있으나 저장·전달 방식은
// 규정되어 있지 않다. 앱 내 명시적 설정(예: 설정 화면의 스위치)으로 상태를 관리하고,
// 필요 시 영속화(AsyncStorage 등)하는 것을 권장한다. OS 다크 모드(useColorScheme)는
// 참고용 초기값 힌트로만 사용하고 고대비 모드의 직접적인 트리거로 삼지 않는다.
import { createContext, useContext, useState } from 'react';
import krdsTokens from '../theme/krds-tokens.json';

type Mode = 'light' | 'highContrast';
const KrdsThemeContext = createContext<{ mode: Mode; colors: typeof krdsTokens.colors.light }>({
  mode: 'light',
  colors: krdsTokens.colors.light,
});

export function KrdsThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('light');
  const colors = mode === 'highContrast' ? krdsTokens.colors.highContrast : krdsTokens.colors.light;
  return (
    <KrdsThemeContext.Provider value={{ mode, colors }}>{children}</KrdsThemeContext.Provider>
  );
}

export const useKrdsTheme = () => useContext(KrdsThemeContext);
```

`borderWidth`에도 동일하게 `light`/`highContrast` 두 세트가 있다(고대비 모드는 테두리를 더 두껍게 만드는 경우가 있음 — `borderWidth.highContrast.variableRegular`는 `borderWidth.light.variableRegular`의 2배). 색상뿐 아니라 테두리 두께도 모드에 따라 함께 전환해야 공식 의도에 맞는다.

## 유지보수 노트

`rn-tokens.json`이 갱신되면(원본 `transformed_tokens.json` 변경에 따른 재생성) 이 문서들의 예시 키 경로가 깨질 수 있다. 키 경로를 인용할 때는 실제 파일에서 재확인 후 반영할 것 — 이 저장소는 "존재하지 않는 경로를 근거로 인용하지 않는다"는 원칙을 따른다.
