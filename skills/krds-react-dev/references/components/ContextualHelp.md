# ContextualHelp

컴포넌트 주변에 배치되어 해당 컴포넌트의 상태나 관련된 상세 정보를 제공하는 컴포넌트입니다. 맥락적 도움말은 정보 아이콘이나 도움 아이콘 버튼을 통해 사용자가 요청하는 경우에만 화면에 표시됩니다.

## Import

`import { ContextualHelp } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `label` | string | 아니오 | 도움말 라벨 텍스트 |
| `title` | string | 예 | 팝오버 제목 |
| `children` | ReactNode | 예 | 팝오버 내용 |
| `position` | ContextualHelpPosition | 아니오 | 팝오버 위치 |
| `alignment` | ContextualHelpAlignment | 아니오 | 팝오버 정렬 |
| `open` | boolean | 아니오 | 팝오버 열림/닫힘 상태 (제어모드) |
| `defaultOpen` | boolean | 아니오 | 기본 팝오버 열림/닫힘 상태 (비제어모드) |
| `onOpenChange` | (open: boolean) => void | 아니오 | 팝오버 상태 변경 핸들러 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

## 타입 값

- ContextualHelpPosition: top | bottom
- ContextualHelpAlignment: left | center | right

## 사용 예시

### Default

```tsx
{
  args: {
    label: '도움말 라벨',
    title: '도움말 제목',
    defaultOpen: false,
    onOpenChange: undefined,
    className: undefined,
    position: 'top',
    alignment: 'left',
    open: false,
    children: <p>도움말 내용</p>
  },
  render: args => {
    return <ContextualHelp label={args.label} title={args.title} position={args.position} alignment={args.alignment} defaultOpen={args.defaultOpen} onOpenChange={args.onOpenChange} className={args.className} open={args.open}>
        {args.children}
      </ContextualHelp>;
  }
}
```

### List

```tsx
{
  args: {},
  render: _args => {
    const position = ['top', 'bottom'] as const;
    const alignment = ['left', 'center', 'right'] as const;
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
      justifyItems: 'center'
    }}>
        {position.map(position => <Fragment key={position}>
            {alignment.map(alignment => <ContextualHelp label={`예시이미지(${position} ${alignment})`} title="도움말 제목" key={alignment} position={position} alignment={alignment}>
                <p>
                  컴포넌트 주변에 배치되어 해당 컴포넌트의 상태나 관련된 상세 정보를 제공하는
                  컴포넌트이다. 맥락적 도움말은 정보 아이콘이나 도움 아이콘 버튼을 통해 사용자가
                  요청하는 경우에만 화면에 표시된다.
                </p>
                <div className="btn-wrap">
                  <Link href="#!" icon={<i className="svg-icon ico-angle right" />} underline="none" variant="basic" size="small">
                    바로가기
                  </Link>
                </div>
              </ContextualHelp>)}
          </Fragment>)}
      </div>;
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
