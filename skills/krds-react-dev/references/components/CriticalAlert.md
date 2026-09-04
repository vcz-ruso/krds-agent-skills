# CriticalAlert

긴급 공지는 본문 상단에 강조되어 표시되는 배너로 사용자에게 긴급하거나 중요한 정보를 전달하는 데 사용된다. 모든 공공 디지털 서비스에서 동일한 긴급 공지 컴포넌트를 사용함으로써 사용자는 긴급한 정보를 일관되고 예측 가능한 방식으로 찾고 이해할 수 있다.

## Import

`import { CriticalAlert } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `alerts` | CriticalAlertItemProps[] | 예 | alert 목록 |

## 타입 값

- CriticalAlertVariant: danger | ok | info

## 하위 컴포넌트

### CriticalAlertItem

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `variant` | CriticalAlertVariant | 예 | alert의 종류 |
| `message` | string | 예 | alert의 내용 |
| `href` | string | 아니오 | 상세보기 링크 URL |
| `linkText` | string | 아니오 | 상세보기 링크 텍스트 |

## 사용 예시

### Default

```tsx
{
  args: {
    alerts: [{
      variant: 'danger',
      message: '긴급 공지 내용 표시',
      href: '#'
    }, {
      variant: 'ok',
      message: '긴급 공지 내용 표시',
      href: '#'
    }, {
      variant: 'info',
      message: '긴급 공지 내용 표시',
      href: '#'
    }]
  }
}
```

### Without Link

```tsx
{
  args: {
    alerts: [{
      variant: 'info',
      message: '긴급 공지 내용 표시'
    }]
  }
}
```

### Custom Link Text

```tsx
{
  args: {
    alerts: [{
      variant: 'danger',
      message: '긴급 공지 내용 표시',
      href: '#',
      linkText: '더 보기'
    }]
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
