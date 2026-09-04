# Badge

컴포넌트에 대한 빠른 인지와 탐색을 돕기 위해 컴포넌트 근처에 표시되는 작은 문자 또는 숫자 데이터이다. 컴포넌트의 분류 체계, 구조화된 정보, 상태 정보, 기타 메타 데이터를 표시할 수 있으며 사용자의 주의를 끌기 위해 색상을 활용할 수 있다.

## Import

`import { Badge } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `variant` | BadgeVariant | 아니오 | 배지의 변형을 지정합니다 |
| `color` | BadgeColor | 아니오 | 배지의 색상을 지정합니다 |
| `size` | BadgeSize | 아니오 | 배지의 크기를 지정합니다 |
| `rounded` | boolean | 아니오 | 배지를 원형으로 만듭니다 |
| `children` | React.ReactNode | 예 | 배지의 내용을 지정합니다 |

## 타입 값

- BadgeVariant: outline | filled | light
- BadgeColor: primary | secondary | gray | point | danger | warning | success | information | disabled
- BadgeSize: small | medium | large

## 하위 컴포넌트

### BadgeWrapper

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 배지의 내용을 지정합니다 |

## 사용 예시

### Default

```tsx
{
  args: {
    children: 'Label',
    variant: undefined,
    color: undefined,
    size: undefined
  }
}
```

### Variants

```tsx
{
  args: {
    children: 'Label'
  },
  render: args => <BadgeWrapper>
      <Badge variant="outline" color="primary">
        {args.children}
      </Badge>
      <Badge variant="filled" color="primary">
        {args.children}
      </Badge>
      <Badge variant="light" color="primary">
        {args.children}
      </Badge>
    </BadgeWrapper>
}
```

### Colors

```tsx
{
  args: {
    children: 'Label'
  },
  render: args => <BadgeWrapper>
      <Badge color="primary">{args.children}</Badge>
      <Badge color="secondary">{args.children}</Badge>
      <Badge color="gray">{args.children}</Badge>
      <Badge color="point">{args.children}</Badge>
      <Badge color="danger">{args.children}</Badge>
      <Badge color="warning">{args.children}</Badge>
      <Badge color="success">{args.children}</Badge>
      <Badge color="information">{args.children}</Badge>
      <Badge color="disabled">{args.children}</Badge>
    </BadgeWrapper>
}
```

### Sizes

```tsx
{
  args: {
    children: 'Label'
  },
  render: args => <BadgeWrapper>
      <Badge size="small">{args.children}</Badge>
      <Badge size="medium">{args.children}</Badge>
      <Badge size="large">{args.children}</Badge>
    </BadgeWrapper>
}
```

### Rounded

```tsx
{
  args: {
    children: '5',
    variant: 'filled',
    color: 'primary',
    rounded: true
  },
  render: args => <BadgeWrapper>
      <Badge variant="filled" color="primary" rounded>
        {args.children}
      </Badge>
      <Badge variant="filled" color="primary" rounded>
        999+
      </Badge>
    </BadgeWrapper>
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
