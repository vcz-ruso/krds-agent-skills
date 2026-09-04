# Textarea

텍스트 영역은 사용자가 키보드로 글자, 숫자, 기호 등이 조합된 여러 줄의 텍스트를 입력하는 경우에 사용하는 요소이다.

## Import

`import { Textarea } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `onChange` | (value: string) => void | 아니오 | 입력 값이 변경될 때 호출되는 콜백 |
| `label` | string | 아니오 | 레이블 |
| `showCount` | boolean | 아니오 | 글자수 카운터 표시 여부 |
| `countTotal` | number | 아니오 | 글자수 총합 표시값 |
| `value` | string | 아니오 | 제어 상태일 때 입력된 값 |
| `defaultValue` | string | 아니오 | 비제어 상태일 때의 초기 값 |

## 사용 예시

### Default

```tsx
{
  args: {
    label: '레이블',
    placeholder: '플레이스홀더'
  }
}
```

### With Counter

```tsx
{
  args: {
    label: '레이블',
    placeholder: '플레이스홀더',
    showCount: true,
    defaultValue: '글자수가 표시됩니다.'
  }
}
```

### With Max Length

```tsx
{
  args: {
    label: '레이블',
    placeholder: '플레이스홀더',
    maxLength: 100,
    defaultValue: '최대 100자까지 입력할 수 있습니다.'
  }
}
```

### States

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      <Textarea label="기본 상태" placeholder="기본 상태의 textarea" />
      <Textarea label="Disabled 상태" placeholder="비활성화된 textarea" disabled defaultValue="비활성화된 상태" />
      <Textarea label="ReadOnly 상태" readOnly defaultValue="읽기 전용 상태" />
    </div>
}
```

### Error With Counter

```tsx
{
  args: {
    label: '메시지 입력',
    placeholder: '메시지를 입력하세요',
    maxLength: 50,
    countTotal: 50,
    defaultValue: '이 텍스트는 50자를 초과하여 에러 메시지가 표시됩니다. 실제로 매우 긴 텍스트입니다.'
  }
}
```

### Controlled

```tsx
{
  args: {},
  render: _args => <ControlledComponent />,
  parameters: {
    docs: {
      description: {
        component: '제어된 컴포넌트 예시입니다.'
      }
    },
    source: {
      code: `

const ControlledComponent = () => {
  const [value, setValue] = useState('제어된 컴포넌트');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Textarea label="제어된 Textarea" value={value} onChange={setValue} maxLength={100} />
      <p>{value.length}자 입력됨</p>
      <button
        onClick={() => setValue('')}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        텍스트 초기화
      </button>
    </div>
  );
};
        `
    }
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
