# Modal

모달은 대화창의 한 종류로 기본 창에 종속된 요소이다. 기본 창과 겹쳐져 가장 상단에 표시되며, 이때 기본 창은 비활성 상태로 전환되어 상호작용이 불가능하므로 사용자는 모달에서의 단일한 과업 또는 메시지에 집중할 수 있다.

## Import

`import { Modal } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `open` | boolean | 아니오 | — |
| `defaultOpen` | boolean | 아니오 | — |
| `onOpenChange` | (open: boolean) => void | 아니오 | — |
| `size` | ModalSize | 아니오 | — |
| `variant` | ModalVariant | 아니오 | — |
| `closeOnEsc` | boolean | 아니오 | — |
| `closeOnOverlayClick` | boolean | 아니오 | — |
| `usePortal` | boolean | 아니오 | — |
| `portalContainer` | string \| HTMLElement | 아니오 | — |

## 타입 값

- ModalSize: sm | md | lg
- ModalVariant: default | bottom-sheet

## 하위 컴포넌트

### ModalTrigger

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `asChild` | boolean | 아니오 | — |

### ModalOverlay

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### ModalContent

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### ModalHeader

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `title` | React.ReactNode | 아니오 | — |
| `titleId` | string | 아니오 | — |

### ModalBody

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `descriptionId` | string | 아니오 | — |

### ModalFooter

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### ModalClose

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `asChild` | boolean | 아니오 | — |

## 사용 예시

### Default

```tsx
{
  args: {
    size: 'md',
    variant: 'default',
    closeOnEsc: true,
    closeOnOverlayClick: true,
    usePortal: false,
    portalContainer: undefined,
    defaultOpen: false,
    onOpenChange: undefined
  },
  render: args => {
    return <Modal.Root size={args.size} variant={args.variant} closeOnEsc={args.closeOnEsc} closeOnOverlayClick={args.closeOnOverlayClick} usePortal={args.usePortal} portalContainer={args.portalContainer} open={args.open} defaultOpen={args.defaultOpen} onOpenChange={args.onOpenChange}>
        <Modal.Trigger>모달 열기</Modal.Trigger>
        <Modal.Content>
          <Modal.Header title="모달 제목" titleId="modal-title" />
          <Modal.Body descriptionId="modal-desc">
            대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함합니다.
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="tertiary" size="medium">
                아니요
              </Button>
            </Modal.Close>
            <Modal.Close asChild>
              <Button variant="primary" size="medium">
                예
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>;
  }
}
```

### Size Sm

```tsx
{
  args: {},
  render: _args => {
    return <Modal.Root size="sm">
        <Modal.Trigger>모달 열기</Modal.Trigger>
        <Modal.Content>
          <Modal.Header title="모달 제목" titleId="modal-title" />
          <Modal.Body descriptionId="modal-desc">
            대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함합니다.
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="tertiary" size="medium">
                아니요
              </Button>
            </Modal.Close>
            <Modal.Close asChild>
              <Button variant="primary" size="medium">
                예
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>;
  }
}
```

### Size Md

```tsx
{
  args: {},
  render: _args => {
    return <Modal.Root size="md">
        <Modal.Trigger>모달 열기</Modal.Trigger>
        <Modal.Content>
          <Modal.Header title="모달 제목" titleId="modal-title" />
          <Modal.Body descriptionId="modal-desc">
            대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함합니다.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="tertiary" size="medium">
              아니요
            </Button>
            <Button variant="primary" size="medium">
              예
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>;
  }
}
```

### Size Lg

```tsx
{
  args: {},
  render: _args => {
    return <Modal.Root size="lg">
        <Modal.Trigger>모달 열기</Modal.Trigger>
        <Modal.Content>
          <Modal.Header title="모달 제목" titleId="modal-title" />
          <Modal.Body descriptionId="modal-desc">
            대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함합니다.
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="tertiary" size="medium">
                아니요
              </Button>
            </Modal.Close>
            <Modal.Close asChild>
              <Button variant="primary" size="medium">
                예
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>;
  }
}
```

### Bottom Sheet

```tsx
{
  args: {},
  render: _args => {
    return <Modal.Root size="md" variant="bottom-sheet">
        <Modal.Trigger>모달 열기</Modal.Trigger>
        <Modal.Content>
          <Modal.Header title="모달 제목" titleId="modal-title" />
          <Modal.Body descriptionId="modal-desc">
            대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함합니다.
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="tertiary" size="medium">
                아니요
              </Button>
            </Modal.Close>
            <Modal.Close asChild>
              <Button variant="primary" size="medium">
                예
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>;
  }
}
```

### As Child Trigger

```tsx
{
  args: {},
  render: _args => {
    return <Modal.Root>
        <Modal.Trigger asChild>
          <Button variant="primary" size="medium">
            모달 열기
          </Button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header title="모달 제목" titleId="modal-title" />
          <Modal.Body descriptionId="modal-desc">
            대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함합니다.
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="tertiary" size="medium">
                아니요
              </Button>
            </Modal.Close>
            <Modal.Close asChild>
              <Button variant="primary" size="medium">
                예
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>;
  }
}
```

### Long Content Initial Body Focus

```tsx
{
  args: {},
  render: _args => {
    return <Modal.Root size="md">
        <Modal.Trigger>모달 열기</Modal.Trigger>
        <Modal.Content>
          <Modal.Header title="모달 제목" titleId="modal-title" />
          <Modal.Body descriptionId="modal-desc">
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
            긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문 긴 본문
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="tertiary" size="medium">
                아니요
              </Button>
            </Modal.Close>
            <Modal.Close asChild>
              <Button variant="primary" size="medium">
                예
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>;
  }
}
```

### Use Portal

```tsx
{
  args: {},
  render: _args => {
    return <Modal.Root size="md" usePortal>
        <Modal.Trigger>Document.body 아래 모달 열기</Modal.Trigger>
        <Modal.Content>
          <Modal.Header title="모달 제목" titleId="modal-title" />
          <Modal.Body descriptionId="modal-desc">
            대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함합니다.
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="tertiary" size="medium">
                닫기
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>;
  },
  parameters: {
    docs: {
      description: {
        story: 'usePortal 속성을 사용시 portalContainer 속성을 사용하여 모달 컴포넌트의 위치를 지정할 수 있습니다. portalContainer 속성을 지정하지 않으면 자동으로 document.body 아래에 렌더링 됩니다. '
      }
    }
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
