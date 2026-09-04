# Breadcrumb

브레드크럼은 탐색 계층 구조를 표시하여 사용자가 현재 위치를 파악하고 계층 구조의 수준을 이동할 수 있게 해준다. 브레드크럼을 통해 사용자는 탐색 중인 화면의 상위 수준 화면으로 이동할 수 있다.

## Import

`import { Breadcrumb } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `items` | BreadcrumbItem[] | 예 | 브레드크럼 아이템 목록 |
| `className` | string | 아니오 | 추가 클래스명 |
| `ariaLabel` | string | 아니오 | 접근성 레이블 |

## 사용 예시

### Default

```tsx
{
  args: {
    items: [{
      text: '홈',
      href: '#'
    }, {
      text: '서비스 신청',
      href: '#'
    }, {
      text: '서비스 신청2',
      href: '#'
    }, {
      text: '서비스 신청3',
      href: '#'
    }, {
      text: '서비스 신청4',
      href: '#'
    }]
  }
}
```

### With Disabled Item

```tsx
{
  args: {
    items: [{
      text: '홈',
      href: '#'
    }, {
      text: '서비스 신청',
      href: '#'
    }, {
      text: '서비스 신청2',
      href: '#',
      disabled: true
    }]
  }
}
```

### Single Item

```tsx
{
  args: {
    items: [{
      text: '홈',
      href: '#'
    }]
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
