# Dropdown

(공식 설명 없음)

## Import

> ⚠️ 이 컴포넌트는 `krds-react` 패키지 최상위에서 export되지 않는다. 공개 API 여부를 확인한 뒤 사용할 것.

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `isOpen` | boolean | 아니오 | 드롭다운 열림 상태 (controlled) |
| `defaultOpen` | boolean | 아니오 | 기본 드롭다운 열림 상태 (uncontrolled) |
| `onOpenChange` | (isOpen: boolean) => void | 아니오 | 드롭다운 상태 변경 시 호출되는 콜백 함수 |
| `buttonText` | ReactNode | 예 | 드롭다운 버튼 텍스트 또는 콘텐츠 |
| `buttonClassName` | string | 아니오 | 드롭다운 버튼 클래스명 |
| `children` | ReactNode | 아니오 | 드롭다운 메뉴 콘텐츠 (리스트 아이템) |
| `content` | ReactNode | 아니오 | 커스텀 드롭다운 콘텐츠 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

## 하위 컴포넌트

### DropdownItem

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `isActive` | boolean | 아니오 | 아이템 활성 상태 |

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
