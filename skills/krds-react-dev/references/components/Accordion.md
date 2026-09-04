# Accordion

아코디언은 한 페이지에서 관련 있는 여러 콘텐츠 섹션을 확인할 수 있도록 하는 컴포넌트로 콘텐츠 섹션의 헤더 목록이 수직으로 쌓여 있는 형태로 표현된다. 일반적으로 헤더 목록은 컨트롤 요소로 활용되며 사용자는 필요에 따라 헤더를 선택하여 하위 콘텐츠 섹션을 표시하거나 숨길 수 있다.

## Import

`import { Accordion } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `variant` | AccordionVariant | 아니오 | 아코디언 스타일 변형 |
| `allowMultiple` | boolean | 아니오 | 다중 선택 허용 여부 (false일 경우 한 번에 하나만 열림) |
| `value` | string[] | 아니오 | 열린 아이템 값 배열 (제어 상태) |
| `onChange` | (values: string[]) => void | 아니오 | 열린 아이템 변경 핸들러 |
| `defaultValue` | string[] | 아니오 | 초기 열린 아이템 값 배열 (비제어 상태) |
| `children` | ReactNode | 예 | 자식 컴포넌트들 |

## 타입 값

- AccordionVariant: default | line

## 하위 컴포넌트

### AccordionItem

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `value` | string | 예 | 아이템 값 (고유 식별자) |
| `children` | ReactNode | 예 | 자식 컴포넌트들 (Header와 Panel) |

### AccordionHeader

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 예 | 헤더 제목 |
| `onClick` | () => void | 아니오 | 커스텀 클릭 핸들러 |

### AccordionPanel

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 예 | 패널 내용 |

## 사용 예시

### Default

```tsx
{
  args: {
    variant: 'default',
    allowMultiple: true,
    defaultValue: ['item1']
  },
  render: args => <Accordion.Root variant={args.variant} allowMultiple={args.allowMultiple} defaultValue={args.defaultValue}>
      <Accordion.Item value="item1">
        <Accordion.Header>아코디언 타이틀 영역</Accordion.Header>
        <Accordion.Panel>
          아코디언 내용 영역입니다. 여기에 다양한 콘텐츠를 넣을 수 있습니다.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item2">
        <Accordion.Header>두 번째 아코디언 타이틀</Accordion.Header>
        <Accordion.Panel>
          두 번째 아코디언의 내용입니다. 이 영역에는 텍스트뿐만 아니라 다른 컴포넌트도 포함할 수
          있습니다.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item3">
        <Accordion.Header>세 번째 아코디언</Accordion.Header>
        <Accordion.Panel>세 번째 아코디언 내용입니다.</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
}
```

### Single Selection

```tsx
{
  args: {
    variant: 'default',
    allowMultiple: false,
    defaultValue: ['item1']
  },
  render: args => <Accordion.Root variant={args.variant} allowMultiple={false} defaultValue={args.defaultValue}>
      <Accordion.Item value="item1">
        <Accordion.Header>아코디언 타이틀 영역</Accordion.Header>
        <Accordion.Panel>
          아코디언 내용 영역입니다. 여기에 다양한 콘텐츠를 넣을 수 있습니다.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item2">
        <Accordion.Header>두 번째 아코디언 타이틀</Accordion.Header>
        <Accordion.Panel>
          두 번째 아코디언의 내용입니다. 이 영역에는 텍스트뿐만 아니라 다른 컴포넌트도 포함할 수
          있습니다.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item3">
        <Accordion.Header>세 번째 아코디언</Accordion.Header>
        <Accordion.Panel>세 번째 아코디언 내용입니다.</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>,
  parameters: {
    docs: {
      description: {
        story: '기본 아코디언 단일 선택 모드입니다.'
      },
      source: {
        code: `
    <Accordion.Root variant="default" allowMultiple={false}>
      <Accordion.Item value="item1">
        <Accordion.Header>아코디언 타이틀 영역</Accordion.Header>
        <Accordion.Panel>
          아코디언 내용 영역입니다. 여기에 다양한 콘텐츠를 넣을 수 있습니다.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item2">
        <Accordion.Header>두 번째 아코디언 타이틀</Accordion.Header>
        <Accordion.Panel>
          두 번째 아코디언의 내용입니다. 이 영역에는 텍스트뿐만 아니라 다른 컴포넌트도 포함할 수
          있습니다.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="item3">
        <Accordion.Header>세 번째 아코디언</Accordion.Header>
        <Accordion.Panel>세 번째 아코디언 내용입니다.</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>`
      }
    }
  }
}
```

### With Complex Content

```tsx
{
  args: {
    variant: 'default',
    allowMultiple: true,
    defaultValue: ['complex1']
  },
  render: args => <Accordion.Root variant={args.variant} allowMultiple={args.allowMultiple} defaultValue={args.defaultValue}>
      <Accordion.Item value="complex1">
        <Accordion.Header>복잡한 내용이 포함된 아코디언</Accordion.Header>
        <Accordion.Panel>
          <div>
            <p>이 아코디언에는 다양한 콘텐츠가 포함되어 있습니다:</p>
            <ul>
              <li>목록 항목 1</li>
              <li>목록 항목 2</li>
              <li>목록 항목 3</li>
            </ul>
            <p>
              <strong>굵은 텍스트</strong>와 <em>기울임 텍스트</em>도 포함됩니다.
            </p>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="complex2">
        <Accordion.Header>두 번째 복잡한 아코디언</Accordion.Header>
        <Accordion.Panel>
          <div>
            <p>아코디언 내부에 다른 HTML 요소들을 넣을 수 있습니다.</p>
            <blockquote>"인용문도 포함할 수 있습니다."</blockquote>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
}
```

### Controlled

```tsx
{
  render: () => <ControlledAccordion />,
  parameters: {
    docs: {
      description: {
        story: '제어된 아코디언 예시입니다.'
      },
      source: {
        code: `
      const ControlledAccordion = () => {
        const [value, setValue] = useState<string[]>(['item1']);

        return (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <Button size="small" onClick={() => setValue(['item1'])}>
                item1 열기
              </Button>
              <Button size="small" variant="secondary" onClick={() => setValue(['item2'])}>
                item2 열기
              </Button>
              <Button size="small" variant="tertiary" onClick={() => setValue([])}>
                모두 닫기
              </Button>
            </div>

            <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              현재 열린 아코디언 아이템: {value.join(', ')}
            </p>

            <Accordion.Root allowMultiple={false} value={value} onChange={setValue}>
              <Accordion.Item value="item1">
                <Accordion.Header>아코디언 타이틀 영역</Accordion.Header>
                <Accordion.Panel>
                  아코디언 내용 영역입니다. 여기에 다양한 콘텐츠를 넣을 수 있습니다.
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="item2">
                <Accordion.Header>두 번째 아코디언 타이틀</Accordion.Header>
                <Accordion.Panel>
                  두 번째 아코디언의 내용입니다. 이 영역에는 텍스트뿐만 아니라 다른 컴포넌트도 포함할 수
                  있습니다.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion.Root>
          </div>
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
