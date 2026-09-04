# SkipLink

건너뛰기 링크는 웹사이트에서 웹 페이지의 주요 콘텐츠 섹션의 탐색을 도와주는 페이지 내부 링크이다. 키보드나 가상 초점을 이용하여 콘텐츠를 탐색하는 사용자는 건너뛰기 링크를 이용하여 대부분의 페이지에서 반복되는 콘텐츠 영역을 건너뛰고 주요 콘텐츠로 빠르게 이동할 수 있다.

## Import

`import { SkipLink } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `targetId` | string | 아니오 | 이동할 대상 요소 ID |
| `children` | string | 아니오 | 링크 텍스트 내용 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

## 사용 예시

### Default

```tsx
{
  args: {},
  render: args => <div>
      <SkipLink {...args} />
      <div style={{
      height: '200px',
      background: '#f0f0f0',
      padding: '20px'
    }}>
        <p style={{
        marginTop: '20px'
      }}>
          <strong>건너뛰기 링크</strong>
        </p>
        <p>Tab 키를 눌러서 "본문 바로가기" 링크에 포커스를 맞춰보세요.</p>
        <p>포커스될 때만 링크가 화면 상단에 표시됩니다.</p>
      </div>
      <div id="breadcrumb" style={{
      padding: '20px',
      background: '#e0e0e0'
    }}>
        <h2>본문 영역 (breadcrumb)</h2>
        <p>이것은 건너뛰기 링크의 대상 영역입니다.</p>
      </div>
    </div>
}
```

### Custom Target

```tsx
{
  args: {
    targetId: 'main-navigation',
    children: '메뉴 바로가기'
  },
  render: args => <div>
      <SkipLink {...args} />
      <div style={{
      height: '200px',
      background: '#f0f0f0',
      padding: '20px'
    }}>
        <p style={{
        marginTop: '20px'
      }}>
          <strong>커스텀 대상과 텍스트</strong>
        </p>
        <p>위의 링크는 "메뉴 바로가기"로 텍스트가 변경되었습니다.</p>
        <p>클릭하면 아래 네비게이션 영역으로 이동합니다.</p>
      </div>
      <div id="main-navigation" style={{
      padding: '20px',
      background: '#e8f4f8'
    }}>
        <h2>메인 네비게이션 영역</h2>
        <nav>
          <ul style={{
          display: 'flex',
          gap: '20px',
          listStyle: 'none',
          padding: 0
        }}>
            <li>
              <a href="#">홈</a>
            </li>
            <li>
              <a href="#">소개</a>
            </li>
            <li>
              <a href="#">서비스</a>
            </li>
            <li>
              <a href="#">문의</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="breadcrumb" style={{
      display: 'none'
    }}>
        숨겨진 기본 대상
      </div>
    </div>
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
