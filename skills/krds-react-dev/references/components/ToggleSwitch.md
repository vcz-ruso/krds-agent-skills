# ToggleSwitch

토글은 상호 배타적인 두 가지 상태를 전환하는 데 사용되는 요소이다.

## Import

`import { ToggleSwitch } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `size` | ToggleSwitchSize | 아니오 | 토글 스위치 크기 |
| `label` | string | 아니오 | 토글 스위치 라벨 텍스트 |
| `onChange` | (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void | 아니오 | 값 변경 핸들러 |

## 타입 값

- ToggleSwitchSize: medium | large

## 사용 예시

### Default

```tsx
{
  args: {
    label: 'switch : default',
    size: undefined
  }
}
```

### Checked

```tsx
{
  args: {
    label: 'switch : checked',
    defaultChecked: true
  }
}
```

### Disabled

```tsx
{
  args: {
    label: 'switch : disabled',
    disabled: true
  }
}
```

### Disabled Checked

```tsx
{
  args: {
    label: 'switch : disabled checked',
    defaultChecked: true,
    disabled: true
  }
}
```

### Medium

```tsx
{
  args: {
    size: 'medium',
    label: 'switch size : medium'
  }
}
```

### Large

```tsx
{
  args: {
    size: 'large',
    label: 'switch size : large'
  }
}
```

### Controlled

```tsx
{
  render: ControlledToggleSwitch
}
```

### All Variants

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  }}>
      <div>
        <h3>Large Size</h3>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
          <ToggleSwitch size="large" label="switch : default" />
          <ToggleSwitch size="large" label="switch : checked" defaultChecked />
          <ToggleSwitch size="large" label="switch : disabled" disabled />
          <ToggleSwitch size="large" label="switch : disabled checked" defaultChecked disabled />
        </div>
      </div>

      <div>
        <h3>Medium Size</h3>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
          <ToggleSwitch size="medium" label="switch : default" />
          <ToggleSwitch size="medium" label="switch : checked" defaultChecked />
          <ToggleSwitch size="medium" label="switch : disabled" disabled />
          <ToggleSwitch size="medium" label="switch : disabled checked" defaultChecked disabled />
        </div>
      </div>
    </div>
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
