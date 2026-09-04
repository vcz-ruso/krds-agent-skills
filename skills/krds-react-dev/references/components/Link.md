# Link

링크는 다른 서비스/애플리케이션, 한 서비스 내의 다른 화면, 한 화면 내의 다른 섹션 등으로 이동하는 데 사용되는 탐색 요소이다.

## Import

`import { Link } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `variant` | LinkVariant | 아니오 | 링크 스타일 타입 |
| `underline` | LinkUnderline | 아니오 | 밑줄 표시 여부 |
| `preserveColorOnHover` | boolean | 아니오 | hover 시 컬러 유지 여부 (pure 클래스) |
| `icon` | ReactNode | 아니오 | 아이콘 표시 여부 |
| `external` | boolean | 아니오 | 외부 링크 여부 |
| `size` | LinkSize | 아니오 | 링크 크기 |
| `disabled` | boolean | 아니오 | 비활성화 여부 |
| `children` | ReactNode | 아니오 | 링크 텍스트 내용 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

## 타입 값

- LinkVariant: default | basic | unstyled
- LinkUnderline: always | hover | none
- LinkSize: xsmall | small | medium | large | xlarge

## 사용 예시

### Default

```tsx
{
  args: {
    children: '기본 링크',
    href: '#',
    variant: undefined,
    size: undefined
  }
}
```

### Variants

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px'
  }}>
      <Link size="small" href="#!" icon={<i className="svg-icon ico-go" />}>
        기본 링크
      </Link>

      <Link size="medium" href="#!" preserveColorOnHover={true}>
        가상클래스 상태 시 컬러 유지
      </Link>

      <Link size="large" variant="basic" href="#!" icon={<i className="svg-icon ico-go" />}>
        본문 텍스트 컬러 링크
      </Link>

      <Link size="large" variant="basic" href="#!" underline="hover">
        가상클래스 상태 시 밑줄
      </Link>

      <Link size="large" variant="basic" href="#!" underline="none">
        밑줄 없음
      </Link>
    </div>
}
```

### Sizes

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px'
  }}>
      <Link size="small" href="#!">
        Small 크기 (14px)
      </Link>
      <Link size="medium" href="#!">
        Medium 크기 (16px)
      </Link>
      <Link size="large" href="#!">
        Large 크기 (18px)
      </Link>
    </div>
}
```

### Underlines

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px'
  }}>
      <Link underline="always" href="#!">
        항상 밑줄 표시
      </Link>
      <Link underline="hover" href="#!">
        호버 시에만 밑줄 표시
      </Link>
      <Link underline="none" href="#!">
        밑줄 없음
      </Link>
    </div>
}
```

### With Icons

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px'
  }}>
      <Link icon={<i className="svg-icon ico-go" />} href="#!" external>
        기본 외부 링크 아이콘
      </Link>
      <Link icon={<i className="svg-icon ico-angle right" />} href="#!">
        내부 링크
      </Link>
    </div>
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
