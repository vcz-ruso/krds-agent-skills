# Tooltip

툴팁은 요소나 본문 텍스트에 제공되는 짧은 부가 설명이다. 설명이 필요한 대상 또는 별도의 활성화 버튼에 마우스를 올리거나 초점을 이동했을 때 설명 텍스트가 표시된다.

## Import

`import { Tooltip } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 예 | — |
| `text` | string | 예 | 툴팁에 표시될 텍스트 |
| `variant` | 'horizontal' \| 'vertical' \| 'box' | 아니오 | 툴팁 방향 및 스타일 |
| `className` | string | 아니오 | 추가 CSS 클래스명 |

## 사용 예시

### Vertical

```tsx
{
  args: {
    text: '세로형 툴팁입니다',
    variant: 'vertical'
  },
  render: args => <Tooltip {...args}>
      <Button>세로형 툴팁</Button>
    </Tooltip>
}
```

### Horizontal

```tsx
{
  args: {
    text: '가로형 툴팁입니다',
    variant: 'horizontal'
  },
  render: args => <Tooltip {...args}>
      <Button>가로형 툴팁</Button>
    </Tooltip>
}
```

### Box

```tsx
{
  args: {
    text: '박스형 툴팁입니다. 긴 텍스트를 표시할 때 사용합니다.',
    variant: 'box'
  },
  render: args => <Tooltip {...args}>
      <Button>박스형 툴팁</Button>
    </Tooltip>
}
```

### With Icon

```tsx
{
  args: {
    text: '아이콘과 함께 사용하는 툴팁',
    variant: 'vertical'
  },
  render: args => <Tooltip {...args}>
      <i className="svg-icon ico-help" />
    </Tooltip>
}
```

### Keyboard

```tsx
{
  args: {
    text: '키보드로 포커스하면 툴팁이 표시됩니다',
    variant: 'vertical'
  },
  render: args => <>
      <p style={{
      marginBottom: '20px'
    }}>Tab 포커스, ESC key 로 제어</p>
      <Tooltip {...args}>
        <Button>접근성 테스트</Button>
      </Tooltip>
    </>
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
