# TextInput

텍스트 입력 필드는 사용자가 키보드로 글자, 숫자, 기호 등이 조합된 한 줄의 짧은 텍스트를 입력하는 경우에 사용하는 요소이다.

## Import

`import { TextInput } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `onChange` | (value: string) => void | 아니오 | 입력 값이 변경될 때 호출되는 콜백 |
| `label` | string | 아니오 | 레이블 |
| `hint` | string | 아니오 | 도움말 |
| `error` | string | 아니오 | 에러 메시지 |
| `success` | string | 아니오 | 성공 메시지 |
| `information` | string | 아니오 | 정보 메시지 |
| `size` | 'small' \| 'medium' \| 'large' | 아니오 | 입력 필드의 크기 |
| `value` | string | 아니오 | 입력 값 |
| `defaultValue` | string | 아니오 | 초기 입력 값 |
| `showPasswordToggle` | boolean | 아니오 | 비밀번호 보기/숨기기 버튼 표시 여부 |
| `showClearButton` | boolean | 아니오 | 삭제 버튼 표시 여부 |

## 사용 예시

### Default

```tsx
{
  args: {
    label: '레이블',
    placeholder: '플레이스홀더',
    hint: '도움말',
    size: undefined
  }
}
```

### Sizes

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '400px'
  }}>
      <TextInput size="small" label="Small" placeholder="플레이스홀더" hint="도움말" />
      <TextInput size="medium" label="Medium" placeholder="플레이스홀더" hint="도움말" />
      <TextInput size="large" label="Large" placeholder="플레이스홀더" hint="도움말" />
    </div>
}
```

### States

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '400px'
  }}>
      <TextInput label="기본 상태" placeholder="플레이스홀더" hint="도움말" />
      <TextInput label="에러 상태" placeholder="플레이스홀더" value="에러" error="에러 메시지" />
      <TextInput label="성공 상태" placeholder="플레이스홀더" value="성공" success="성공 메시지" />
      <TextInput label="정보 상태" placeholder="플레이스홀더" value="정보" information="정보 메시지" />
      <TextInput label="읽기 전용" placeholder="플레이스홀더" value="readonly" readOnly hint="도움말" />
      <TextInput label="비활성화" placeholder="플레이스홀더" value="disabled" disabled hint="도움말" />
    </div>
}
```

### With Password Toggle

```tsx
{
  args: {},
  render: _args => <div style={{
    width: '400px'
  }}>
      <TextInput type="password" label="비밀번호" placeholder="8-12자의 영문자, 숫자, 특수문자 조합" defaultValue="password" showPasswordToggle />
    </div>
}
```

### With Clear Button

```tsx
{
  args: {},
  render: _args => <div style={{
    width: '400px'
  }}>
      <TextInput label="삭제 버튼이 있는 입력 필드" placeholder="내용을 입력하세요" showClearButton defaultValue="삭제 가능한 텍스트" />
    </div>
}
```

### With Multiple Buttons

```tsx
{
  args: {},
  render: _args => <div style={{
    width: '400px'
  }}>
      <TextInput type="password" label="다중 버튼" placeholder="8-12자의 영문자, 숫자, 특수문자 조합" defaultValue="삭제 가능한 텍스트" showPasswordToggle showClearButton />
    </div>
}
```

### Controlled

```tsx
{
  args: {},
  render: _args => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        component: '제어된 컴포넌트 예시입니다.'
      },
      source: {
        code: `
const ControlledExample = () => {
  const [value, setValue] = useState('제어된 입력');

  return (
    <div style={{ width: '400px' }}>
      <TextInput
        label="제어된 컴포넌트"
        placeholder="플레이스홀더"
        value={value}
        onChange={setValue}
        hint={\`현재 값: $\{value}\`}
      />
    </div>
  );
};
        `
      }
    }
  }
}
```

### Uncontrolled

```tsx
{
  args: {
    label: '비제어 컴포넌트',
    defaultValue: '기본값',
    placeholder: '플레이스홀더',
    hint: '비제어 상태로 동작합니다'
  }
}
```

### Without Label

```tsx
{
  args: {
    placeholder: '레이블이 없는 입력 필드',
    hint: '레이블 없이도 사용할 수 있습니다'
  }
}
```

### Without Hint

```tsx
{
  args: {
    label: '도움말이 없는 입력 필드',
    placeholder: '플레이스홀더'
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
