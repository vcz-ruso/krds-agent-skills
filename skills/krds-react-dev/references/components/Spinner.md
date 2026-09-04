# Spinner

스피너는 화면이나 요소의 다양한 처리 상태를 시각적으로 표시한 것으로 화면 전체나 일부 요소에 접근하기 위해 일정 시간 동안 대기해야 함을 사용자에게 안내한다.

## Import

`import { Spinner } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `label` | string | 아니오 | 스피너 옆에 표시할 텍스트 |
| `className` | string | 아니오 | 추가 커스텀 클래스 |
| `children` | React.ReactNode | 아니오 | — |

## 사용 예시

### Default

```tsx
{
  args: {
    label: 'Loading data..'
  }
}
```

### Without Label

```tsx
{
  args: {}
}
```

### With Form Spinner

```tsx
{
  args: {},
  render: args => <div className="form-group">
      <div className="form-tit">
        <label htmlFor="consult_name">Label</label>
      </div>
      <div className="form-conts">
        <Spinner {...args}>
          <input type="text" id="consult_name" className="krds-input" placeholder="placeholder" />
        </Spinner>
      </div>
    </div>
}
```

### Multiple Spinners

```tsx
{
  args: {},
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  }}>
      <Spinner label="Loading data.." />
      <Spinner label="Processing..." />
      <Spinner />
    </div>
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
