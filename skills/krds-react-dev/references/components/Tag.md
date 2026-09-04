# Tag

태그는 키워드 또는 레이블을 사용하여 콘텐츠를 분류하는 수단이다. 콘텐츠 항목에 직접 관련 분류 체계, 데이터 속성을 표시하거나, 목록에서 특정 분류 체계, 데이터 속성을 가진 항목이 선택되었음을 보여주기 위한 태그 그룹으로 사용된다.

## Import

`import { Tag } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 예 | 태그 텍스트 |
| `className` | string | 아니오 | 커스텀 클래스명 |
| `variant` | 'deletable' \| 'link' | 아니오 | 태그 타입 |
| `onDelete` | () => void | 아니오 | 삭제 버튼 클릭 핸들러 |
| `deleteDisabled` | boolean | 아니오 | 삭제 버튼 비활성화 |
| `href` | string | 예 | 링크 URL |

## 타입 값

- TagSize: small | medium | large

## 하위 컴포넌트

### BaseTag

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 예 | 태그 텍스트 |
| `className` | string | 아니오 | 커스텀 클래스명 |

### DeletableTag

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 예 | 태그 텍스트 |
| `className` | string | 아니오 | 커스텀 클래스명 |
| `variant` | 'deletable' | 아니오 | 태그 타입 |
| `onDelete` | () => void | 아니오 | 삭제 버튼 클릭 핸들러 |
| `deleteDisabled` | boolean | 아니오 | 삭제 버튼 비활성화 |

### LinkTag

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 예 | 태그 텍스트 |
| `className` | string | 아니오 | 커스텀 클래스명 |
| `variant` | 'link' | 예 | 태그 타입 |
| `href` | string | 예 | 링크 URL |

### TagWrap

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 예 | 태그들 |
| `size` | TagSize | 아니오 | 태그 크기 |
| `className` | string | 아니오 | 커스텀 클래스명 |

## 사용 예시

### Default

```tsx
{
  args: {
    children: '태그',
    variant: 'deletable',
    onDelete: () => console.log('Tag deleted'),
    deleteDisabled: false,
    href: '#',
    target: '_self',
    className: '',
    'wrap.size': 'medium'
  },
  // @ts-expect-error - Storybook 타입 오류
  render: ({
    children,
    'wrap.size': wrapSize,
    ...rest
  }) => <TagWrap size={wrapSize}>
      <Tag {...rest}>{children}</Tag>
    </TagWrap>
}
```

### Deletable

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  }}>
      <TagWrap size="large">
        <Tag onDelete={() => console.log('Large tag deleted')}>태그</Tag>
        <Tag onDelete={() => console.log('Large tag deleted')}>태그</Tag>
        <Tag onDelete={() => console.log('Large tag deleted')}>태그</Tag>
      </TagWrap>

      <TagWrap size="medium">
        <Tag onDelete={() => console.log('Medium tag deleted')}>태그</Tag>
        <Tag onDelete={() => console.log('Medium tag deleted')}>태그</Tag>
        <Tag onDelete={() => console.log('Medium tag deleted')}>태그</Tag>
      </TagWrap>

      <TagWrap size="small">
        <Tag onDelete={() => console.log('Small tag deleted')}>태그</Tag>
        <Tag onDelete={() => console.log('Small tag deleted')}>태그</Tag>
        <Tag onDelete={() => console.log('Small tag deleted')}>태그</Tag>
      </TagWrap>
    </div>
}
```

### Link

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  }}>
      <TagWrap size="large">
        <Tag variant="link" href="#">
          태그
        </Tag>
        <Tag variant="link" href="#">
          태그
        </Tag>
        <Tag variant="link" href="#">
          태그
        </Tag>
      </TagWrap>

      <TagWrap size="medium">
        <Tag variant="link" href="#">
          태그
        </Tag>
        <Tag variant="link" href="#">
          태그
        </Tag>
        <Tag variant="link" href="#">
          태그
        </Tag>
      </TagWrap>

      <TagWrap size="small">
        <Tag variant="link" href="#">
          태그
        </Tag>
        <Tag variant="link" href="#">
          태그
        </Tag>
        <Tag variant="link" href="#">
          태그
        </Tag>
      </TagWrap>
    </div>
}
```

### Link Tag

```tsx
{
  render: args => <TagWrap>
      <Tag {...args}>태그</Tag>
    </TagWrap>,
  args: {
    children: '태그',
    variant: 'link' as const,
    href: '#'
  }
}
```

### Delete Disabled

```tsx
{
  render: args => <TagWrap>
      <Tag {...args}>삭제 불가 태그</Tag>
    </TagWrap>,
  args: {
    children: '삭제 불가 태그',
    onDelete: () => console.log('This should not be called'),
    deleteDisabled: true
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
