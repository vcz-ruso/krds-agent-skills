# Checkbox

체크박스는 사용자가 여러 개의 옵션 중 한 개 이상의 값을 선택할 수 있도록 하는 경우에 사용한다. 즉, 체크박스 옵션의 선택은 상호배타적이므로 한 개의 옵션을 선택하는 것은 다른 옵션의 선택에 영향을 미치지 않는다.

## Import

`import { Checkbox } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `size` | CheckboxSize | 아니오 | 체크박스 크기 |
| `description` | string | 아니오 | 추가 설명 텍스트 |
| `defaultValue` | boolean | 아니오 | 비제어 상태에서 사용할 초기 체크 상태 |
| `label` | string | 아니오 | 레이블 텍스트 (children이 없을 경우 사용) |

## 타입 값

- CheckboxSize: medium | large
- CheckboxChipSize: small | medium | large

## 하위 컴포넌트

### CheckboxChip

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `size` | CheckboxChipSize | 아니오 | 체크박스 크기 |
| `defaultValue` | boolean | 아니오 | 비제어 상태에서 사용할 초기 체크 상태 |

### CheckboxGroup

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 그룹 내 체크박스들 |
| `column` | boolean | 아니오 | 세로 배치 여부 |
| `className` | string | 아니오 | 추가 CSS 클래스 |

## 사용 예시

### Default

```tsx
{
  args: {
    id: 'checkbox-1',
    children: '기본',
    size: 'medium',
    disabled: false
  }
}
```

### Checked

```tsx
{
  args: {
    id: 'checkbox-2',
    children: '선택됨',
    size: 'medium',
    disabled: false,
    defaultValue: true
  }
}
```

### Disabled

```tsx
{
  args: {
    id: 'checkbox-3',
    children: '비활성화',
    size: 'medium',
    disabled: true
  }
}
```

### Checked Disabled

```tsx
{
  args: {
    id: 'checkbox-4',
    children: '선택된 비활성화',
    size: 'medium',
    disabled: true,
    defaultValue: true
  }
}
```

### With Description

```tsx
{
  args: {
    id: 'checkbox-5',
    children: '체크박스',
    size: 'medium',
    disabled: false,
    description: '부가적인 설명이 들어갑니다.',
    defaultValue: true
  }
}
```

### Size

```tsx
{
  args: {},
  render: _args => {
    return <div className="fieldset">
        <div className="form-group">
          <div className="form-conts">
            <CheckboxGroup>
              <Checkbox id="checkbox-medium" size="medium">
                사이즈 : medium
              </Checkbox>
              <Checkbox id="checkbox-large" size="large">
                사이즈 : large
              </Checkbox>
            </CheckboxGroup>
          </div>
        </div>
      </div>;
  }
}
```

### Group

```tsx
{
  args: {},
  render: _args => {
    return <div className="fieldset">
        <div className="form-group">
          <div className="form-conts">
            <CheckboxGroup>
              <Checkbox id="group-1" defaultValue={false}>
                기본
              </Checkbox>
              <Checkbox id="group-2" defaultValue={true}>
                선택됨
              </Checkbox>
              <Checkbox id="group-3" disabled>
                비활성화
              </Checkbox>
              <Checkbox id="group-4" disabled defaultValue={true}>
                선택된 비활성화
              </Checkbox>
            </CheckboxGroup>
          </div>
        </div>
      </div>;
  }
}
```

### Group Column

```tsx
{
  args: {},
  render: _args => {
    return <div className="fieldset">
        <div className="form-group">
          <div className="form-conts">
            <CheckboxGroup column>
              <Checkbox id="column-1" defaultValue={true} description="부가적인 설명이 들어갑니다.">
                체크박스
              </Checkbox>
              <Checkbox id="column-2" defaultValue={false} description="부가적인 설명이 들어갑니다.">
                체크박스
              </Checkbox>
            </CheckboxGroup>
          </div>
        </div>
      </div>;
  }
}
```

### Chip Variant

```tsx
{
  args: {},
  render: _args => {
    return <div className="krds-check-area">
        <CheckboxChip id="chip-1" defaultValue={false}>
          chip 상태 : default
        </CheckboxChip>
        <CheckboxChip id="chip-2" defaultValue={true}>
          chip 상태 : checked
        </CheckboxChip>
        <CheckboxChip id="chip-3" disabled>
          chip 상태 : disabled
        </CheckboxChip>
      </div>;
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
