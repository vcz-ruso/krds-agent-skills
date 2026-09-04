# Radio

라디오 버튼은 사용자가 여러 개의 옵션 중 한 개의 값을 선택할 수 있도록 하는 경우에 사용한다. 사용자가 옵션 목록에서 새로운 옵션을 선택했을 때, 기존에 선택되었던 옵션은 자동으로 선택이 해제되어야 한다.

## Import

`import { Radio } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `size` | RadioSize | 아니오 | 라디오 버튼 크기 |
| `description` | string | 아니오 | 추가 설명 텍스트 |
| `defaultChecked` | boolean | 아니오 | 비제어 상태에서 사용할 초기 체크 상태 |

## 타입 값

- RadioSize: medium | large
- RadioChipSize: small | medium | large

## 하위 컴포넌트

### RadioGroup

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `value` | string | 아니오 | 라디오 그룹의 값 (controlled mode) |
| `defaultValue` | string | 아니오 | 초기 값 (uncontrolled mode) |
| `onChange` | (value: string) => void | 아니오 | 값이 변경될 때 호출되는 콜백 |
| `name` | string | 예 | 라디오 그룹의 이름 (name 속성) |
| `children` | ReactNode | 예 | 자식 요소들 |
| `className` | string | 아니오 | 추가 CSS 클래스 |
| `column` | boolean | 아니오 | 세로 배치 여부 |

### RadioChip

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `size` | RadioChipSize | 아니오 | 라디오 칩 크기 |
| `defaultChecked` | boolean | 아니오 | 비제어 상태에서 사용할 초기 체크 상태 |

## 사용 예시

### Default

```tsx
{
  args: {
    children: '라디오 버튼',
    name: 'radio-group'
  }
}
```

### With Description

```tsx
{
  args: {
    children: '라디오 버튼',
    description: '부가적인 설명이 들어갑니다.',
    name: 'radio-group'
  }
}
```

### Size

```tsx
{
  args: {},
  render: _args => <RadioGroup name="example-group-size" defaultValue="option1">
      <Radio value="option1" size="medium">
        사이즈 : medium
      </Radio>
      <Radio value="option2" size="large">
        사이즈 : large
      </Radio>
    </RadioGroup>
}
```

### Disabled

```tsx
{
  args: {
    children: '비활성화',
    disabled: true,
    name: 'radio-group'
  }
}
```

### Checked Disabled

```tsx
{
  args: {
    children: '선택된 비활성화',
    checked: true,
    disabled: true,
    name: 'radio-group'
  }
}
```

### Radio Group Example

```tsx
{
  args: {},
  render: _args => <RadioGroup name="example-group" defaultValue="option4">
      <Radio value="option1">기본</Radio>
      <Radio value="option2">선택됨</Radio>
      <Radio value="option3" disabled>
        비활성화
      </Radio>
      <Radio value="option4" disabled>
        선택된 비활성화
      </Radio>
    </RadioGroup>
}
```

### Radio Group Column

```tsx
{
  args: {},
  render: _args => <RadioGroup name="example-group-column" column defaultValue="option1">
      <Radio value="option1" description="부가적인 설명이 들어갑니다.">
        라디오버튼
      </Radio>
      <Radio value="option2" description="부가적인 설명이 들어갑니다.">
        라디오버튼
      </Radio>
    </RadioGroup>
}
```

### Radio Group Column Controlled

```tsx
{
  args: {},
  render: _args => {
    return <Temp />;
  },
  parameters: {
    docs: {
      source: {
        code: `
const RadioGroupColumnControlled = () => {
  const [value, setValue] = useState('option1');

  return (
    <RadioGroup
      name="example-group-column"
      column
      value={value}
      onChange={value => setValue(value)}
    >
      <Radio value="option1" description="부가적인 설명이 들어갑니다.">
        라디오버튼
      </Radio>
      <Radio value="option2" description="부가적인 설명이 들어갑니다.">
        라디오버튼
      </Radio>
    </RadioGroup>
  );
};
        `
      }
    }
  }
}
```

### Chip Variant

```tsx
{
  args: {},
  render: _args => {
    return <div className="krds-check-area">
        <RadioChip id="chip-1" name="radio-chip-group">
          chip 상태 : default
        </RadioChip>
        <RadioChip id="chip-2" name="radio-chip-group" defaultChecked>
          chip 상태 : checked
        </RadioChip>
        <RadioChip id="chip-3" name="radio-chip-group" disabled>
          chip 상태 : disabled
        </RadioChip>
      </div>;
  }
}
```

### Chip Sizes

```tsx
{
  args: {},
  render: _args => {
    return <div className="krds-check-area">
        <RadioChip id="chip-small" name="radio-chip-sizes" size="small">
          chip 상태 : small
        </RadioChip>
        <RadioChip id="chip-medium" name="radio-chip-sizes" size="medium">
          chip 상태 : medium
        </RadioChip>
        <RadioChip id="chip-large" name="radio-chip-sizes" size="large">
          chip 상태 : large
        </RadioChip>
      </div>;
  }
}
```

### Chip Group

```tsx
{
  args: {},
  render: _args => {
    return <RadioGroup name="chip-example-group" defaultValue="chip1">
        <RadioChip value="chip1">chip 상태 : default</RadioChip>
        <RadioChip value="chip2">chip 상태 : checked</RadioChip>
        <RadioChip value="chip3" disabled>
          chip 상태 : disabled
        </RadioChip>
      </RadioGroup>;
  }
}
```

### Chip Group Controlled

```tsx
{
  args: {},
  render: _args => {
    return <ChipTemp />;
  },
  parameters: {
    docs: {
      source: {
        code: `
const ChipGroupControlled = () => {
  const [value, setValue] = useState('chip1');

  return (
    <RadioGroup name="chip-example-group" value={value} onChange={setValue}>
      <RadioChip value="chip1">chip 상태 : default</RadioChip>
      <RadioChip value="chip2">chip 상태 : checked</RadioChip>
      <RadioChip value="chip3" disabled>
        chip 상태 : disabled
      </RadioChip>
    </RadioGroup>
  );
};
        `
      }
    }
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
