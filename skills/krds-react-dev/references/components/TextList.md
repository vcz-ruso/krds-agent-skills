# TextList

텍스트 목록은 계층 구조가 있는 텍스트 블록을 읽기 쉽게 구성한 것이다.

## Import

`import { TextList } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `type` | TextListType | 아니오 | 텍스트 목록 타입 |
| `children` | ReactNode | 아니오 | 자식 요소 |
| `className` | string | 아니오 | 커스텀 클래스명 |

## 타입 값

- TextListType: decimal | dash | hollow | ordered

## 하위 컴포넌트

### TextListItem

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 아니오 | 자식 요소 |
| `className` | string | 아니오 | 커스텀 클래스명 |
| `number` | string | 아니오 | 번호 (ordered 타입에서 사용) |

## 사용 예시

### Default

```tsx
{
  args: {
    type: 'decimal',
    children: <>
        <TextListItem>텍스트 목록 레벨1</TextListItem>
        <TextListItem>
          텍스트 목록 레벨1
          <TextList type="dash">
            <TextListItem>텍스트 목록 레벨2</TextListItem>
            <TextListItem>
              텍스트 목록 레벨2
              <TextList type="hollow">
                <TextListItem>텍스트 목록 레벨3</TextListItem>
                <TextListItem>텍스트 목록 레벨3</TextListItem>
              </TextList>
            </TextListItem>
            <TextListItem>텍스트 목록 레벨2</TextListItem>
          </TextList>
        </TextListItem>
        <TextListItem>텍스트 목록 레벨1</TextListItem>
      </>
  }
}
```

### Mixed

```tsx
{
  args: {
    type: 'decimal',
    children: <>
        <TextListItem>
          텍스트 목록 레벨1
          <TextList type="dash">
            <TextListItem>
              텍스트 목록 레벨2
              <TextList type="ordered">
                <TextListItem number="①">텍스트 목록 레벨3</TextListItem>
                <TextListItem number="②">텍스트 목록 레벨3</TextListItem>
              </TextList>
            </TextListItem>
          </TextList>
        </TextListItem>
        <TextListItem>
          텍스트 목록 레벨1
          <TextList type="ordered">
            <TextListItem number="a. ">
              텍스트 목록 레벨2
              <TextList type="hollow">
                <TextListItem>텍스트 목록 레벨3</TextListItem>
                <TextListItem>텍스트 목록 레벨3</TextListItem>
              </TextList>
            </TextListItem>
          </TextList>
        </TextListItem>
      </>
  }
}
```

### Ordered

```tsx
{
  args: {
    type: 'ordered',
    children: <>
        <TextListItem number="1. ">텍스트 목록 레벨1</TextListItem>
        <TextListItem number="2. ">
          텍스트 목록 레벨1
          <TextList type="ordered">
            <TextListItem number="a. ">텍스트 목록 레벨2</TextListItem>
            <TextListItem number="b. ">
              텍스트 목록 레벨2
              <TextList type="ordered">
                <TextListItem number="①">텍스트 목록 레벨3</TextListItem>
                <TextListItem number="②">텍스트 목록 레벨3</TextListItem>
              </TextList>
            </TextListItem>
            <TextListItem number="c. ">텍스트 목록 레벨2</TextListItem>
          </TextList>
        </TextListItem>
        <TextListItem number="3. ">텍스트 목록 레벨1</TextListItem>
      </>
  }
}
```

### Mixed Ordered

```tsx
{
  args: {
    type: 'ordered',
    children: <>
        <TextListItem number="1. ">
          텍스트 목록 레벨1
          <TextList type="dash">
            <TextListItem>
              텍스트 목록 레벨2
              <TextList type="ordered">
                <TextListItem number="①">텍스트 목록 레벨3</TextListItem>
                <TextListItem number="②">텍스트 목록 레벨3</TextListItem>
              </TextList>
            </TextListItem>
          </TextList>
        </TextListItem>
        <TextListItem number="2. ">
          텍스트 목록 레벨1
          <TextList type="ordered">
            <TextListItem number="a. ">
              텍스트 목록 레벨2
              <TextList type="hollow">
                <TextListItem>텍스트 목록 레벨3</TextListItem>
                <TextListItem>텍스트 목록 레벨3</TextListItem>
              </TextList>
            </TextListItem>
          </TextList>
        </TextListItem>
      </>
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
