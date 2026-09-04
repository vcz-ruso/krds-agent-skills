# Resize

화면 크기 조정은 텍스트를 포함하여 화면에 표시되는 정보를 확대하거나 축소하는 데 사용되는 요소이다. 사용자에 따라 읽을 수 있는 텍스트의 크기, 조작할 수 있는 요소의 크기는 다르다. 디바이스나 사용자 에이전트가 지원하는 여러 가지 설정 기능을 활용하면 사용자가 선호하는 방식으로 콘텐츠의 표시 방식을 수정할 수 있다. 그러나 화면 크기 조정 기능을 필요로 하는 사용자는 관련 기능을 찾아 설정하는 데 어려움을 겪을 가능성이 높으므로 서비스 자체적으로 화면 크기 조정 기능을 제공하고 접근하기 쉽게 만드는 것이 중요하다.

## Import

`import { Resize } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `value` | ResizeScale | 아니오 | 현재 선택된 크기입니다. |
| `defaultValue` | ResizeScale | 아니오 | 기본 선택된 크기입니다. |
| `onChange` | (scale: ResizeScale) => void | 아니오 | 크기 변경 시 호출되는 콜백 함수입니다. |
| `buttonText` | string | 아니오 | 드롭다운 버튼의 텍스트입니다. |
| `resetText` | string | 아니오 | 초기화 버튼의 텍스트입니다. |
| `labels` | { sm: string; md: string; lg: string; xlg: string; xxlg: string; } | 아니오 | 각 크기 옵션의 라벨 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

## 타입 값

- ResizeScale: sm | md | lg | xlg | xxlg

## 하위 컴포넌트

### ResizeItem

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `scale` | ResizeScale | 예 | — |
| `label` | string | 예 | — |
| `isActive` | boolean | 예 | — |
| `onClick` | (scale: ResizeScale) => void | 예 | — |

## 사용 예시

### Default

```tsx
{
  args: {
    defaultValue: 'md',
    buttonText: '화면크기',
    resetText: '초기화'
  },
  parameters: {
    docs: {
      description: {
        story: '기본 Resize 컴포넌트입니다.'
      }
    }
  }
}
```

### Controlled

```tsx
{
  render: args => {
    const [value, setValue] = useState<ResizeScale>('md');
    return <div>
        <div style={{
        marginBottom: '16px'
      }}>
          <p>
            현재 선택된 크기: <strong>{value}</strong>
          </p>
        </div>
        <Resize {...args} value={value} onChange={scale => {
        setValue(scale);
        args.onChange?.(scale);
      }} />
      </div>;
  },
  args: {
    buttonText: '화면크기',
    resetText: '초기화'
  },
  parameters: {
    docs: {
      description: {
        story: '제어 상태의 Resize 컴포넌트입니다.'
      }
    }
  }
}
```

### Custom Labels

```tsx
{
  args: {
    defaultValue: 'md',
    buttonText: 'Font Size',
    resetText: 'Reset',
    labels: {
      sm: 'Small',
      md: 'Medium',
      lg: 'Large',
      xlg: 'Extra Large',
      xxlg: 'XXL'
    }
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 라벨을 사용하는 Resize 컴포넌트입니다.'
      }
    }
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
