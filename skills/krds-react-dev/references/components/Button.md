# Button

버튼은 어떤 기능이나 동작을 실행하거나 기능을 사용하기 위한 상태로 변경하는 요소이다. 사용자가 서비스를 이용하는 과정에서 어떤 행동이 중요한지에 따라 관련된 버튼이 다양한 스타일로 표현된다.

## Import

`import { Button } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `variant` | ButtonVariant | 아니오 | 버튼의 시각적 스타일을 결정합니다. |
| `size` | ButtonSize | 아니오 | 버튼의 크기를 결정합니다. |
| `children` | ReactNode | 아니오 | — |
| `className` | string | 아니오 | — |
| `disabled` | boolean | 아니오 | 버튼을 비활성화합니다. |
| `role` | string | 아니오 | — |
| `as` | T | 아니오 | — |

이 컴포넌트는 다형성(polymorphic) 컴포넌트로, `as` prop에 렌더링할 엘리먼트/컴포넌트 타입을 지정하면 그에 맞는 속성 타입 추론이 적용된다.

## 타입 값

- ButtonVariant: primary | secondary | tertiary | text | link | icon
- ButtonSize: xsmall | small | medium | large | xlarge

## 사용 예시

### Primary

```tsx
{
  args: {
    children: '버튼',
    variant: undefined,
    size: undefined
  }
}
```

### Secondary

```tsx
{
  args: {
    children: '버튼',
    variant: 'secondary',
    size: 'large'
  }
}
```

### Tertiary

```tsx
{
  args: {
    children: '버튼',
    variant: 'tertiary',
    size: 'large'
  }
}
```

### Text

```tsx
{
  args: {
    children: '버튼',
    variant: 'text',
    size: 'large'
  }
}
```

### Sizes

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  }}>
      <Button variant="primary" size="xsmall">
        X-Small
      </Button>
      <Button variant="primary" size="small">
        Small
      </Button>
      <Button variant="primary" size="medium">
        Medium
      </Button>
      <Button variant="primary" size="large">
        Large
      </Button>
      <Button variant="primary" size="xlarge">
        X-Large
      </Button>
    </div>
}
```

### Disabled

```tsx
{
  args: {},
  render: _args => <Button variant="primary" disabled>
      Diabled 버튼
    </Button>
}
```

### Icon

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  }}>
      <Button variant="icon" size="medium">
        <i className="svg-icon ico-delete-fill" />
      </Button>
      <Button variant="icon" size="large">
        <i className="svg-icon ico-sch" />
      </Button>
    </div>
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
