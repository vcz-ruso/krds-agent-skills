# InPageNavigation

콘텐츠 내 탐색은 사용자가 본문의 구조를 훑어보고 원하는 콘텐츠로 빠르게 이동할 수 있도록 하는 탐색 수단이다. 화면을 스크롤 할 때 특정 위치에 고정되어 콘텐츠의 목차 역할을 하는 동시에 사용자가 페이지 내 탐색에서 특정 항목을 클릭하면 연결된 섹션으로 스크롤 된다.

## Import

`import { InPageNavigation } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `caption` | string | 아니오 | 페이지 구성 설명 텍스트 |
| `title` | string | 아니오 | 페이지 제목 |
| `items` | NavigationItem[] | 아니오 | 네비게이션 아이템 목록 |
| `actionText` | string | 아니오 | 액션 버튼 텍스트 |
| `onActionClick` | () => void | 아니오 | 액션 버튼 클릭 핸들러 |
| `infoText` | ReactNode | 아니오 | 추가 정보 텍스트 (HTML 태그 지원) |
| `scrollDown` | boolean | 아니오 | 스크롤 시 상단 위치 조정 여부 |
| `scrollContainerRef` | React.RefObject<HTMLElement \| null> | 아니오 | 스크롤 컨테이너 참조 |

## 사용 예시

### Default

```tsx
{
  args: {
    caption: '이 페이지의 구성',
    title: '장애아동수당',
    items: defaultItems,
    actionText: '온라인 신청하기',
    infoText: <>
        장애아동수당 외 <strong>1건</strong>
      </>,
    style: {
      position: 'static',
      margin: '0 auto'
    }
  },
  parameters: {
    docs: {
      description: {
        story: '모든 요소가 포함된 기본 사용 예제입니다. infoText에 HTML 태그가 포함되어 있습니다. position: static 은 스토리북에서 테스트를 위해 추가된 속성입니다.'
      }
    },
    layout: 'centered'
  }
}
```

### Without Action

```tsx
{
  args: {
    caption: '이 페이지의 구성',
    title: '서비스 안내',
    items: defaultItems,
    style: {
      position: 'static',
      margin: '0 auto'
    }
  },
  parameters: {
    docs: {
      description: {
        story: '액션 버튼이 없는 경우의 예제입니다. position: static 은 스토리북에서 테스트를 위해 추가된 속성입니다.'
      }
    },
    layout: 'centered'
  }
}
```

### Long Items

```tsx
{
  args: {
    caption: '이 페이지의 구성',
    title: '긴 텍스트 네비게이션',
    items: [{
      href: '#section_01',
      label: '매우 긴 네비게이션 아이템 텍스트가 있는 경우',
      active: true
    }, {
      href: '#section_02',
      label: '두 번째 긴 텍스트 아이템'
    }, {
      href: '#section_03',
      label: '세 번째 긴 텍스트 아이템'
    }, {
      href: '#section_04',
      label: '네 번째 긴 텍스트 아이템'
    }],
    actionText: '온라인 신청하기',
    infoText: <>
        추가 정보가 있는 경우 <strong>중요한 정보</strong>
      </>,
    style: {
      position: 'static',
      margin: '0 auto'
    }
  },
  parameters: {
    docs: {
      description: {
        story: '긴 텍스트가 포함된 네비게이션 아이템의 레이아웃 테스트 예제입니다. position: static 은 스토리북에서 테스트를 위해 추가된 속성입니다.'
      }
    },
    layout: 'centered'
  }
}
```

### With Scroll Functionality

```tsx
{
  args: {},
  render: _args => <WithScrollContainer />,
  parameters: {
    docs: {
      description: {
        story: '스크롤 기능이 포함된 예제입니다. 스크롤하면 해당 섹션에 맞는 네비게이션 아이템이 자동으로 active 상태가 됩니다. 네비게이션은 오른쪽에 고정되어 있어 스크롤해도 위치가 변하지 않습니다.'
      },
      source: {
        language: 'tsx',
        code: `
const WithScrollContainer = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      {/* 네비게이션 영역 */}
      <InPageNavigation
        caption="이 페이지의 구성"
        title="스크롤 기능 테스트"
        items={[
          { href: '#section_01', label: '서비스 개요' },
          { href: '#section_02', label: '서비스 상세' },
          { href: '#section_03', label: '신청 방법 및 절차' },
          { href: '#section_04', label: '제출 서류' },
          { href: '#section_05', label: '함께 신청할 수 있는 서비스' },
          { href: '#section_06', label: '부가정보' },
          { href: '#section_07', label: '정보 변경 내역' },
        ]}
        actionText="온라인 신청하기"
        infoText={
          <>
            장애아동수당 외 <strong>1건</strong>
          </>
        }
        scrollContainerRef={scrollContainerRef}
      />

      {/* 컨텐츠 영역 */}
      <div
        style={{
          backgroundColor: 'var(--krds-light-color-surface-white-subtle)',
          border:
            'var(--krds-light-border-width-variable-regular) solid var(--krds-light-color-border-gray)',
          borderRadius: 'var(--krds-radius-xlarge2)',
          padding: '5.6rem 0',
          margin: '2rem',
          minHeight: '700px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          ref={scrollContainerRef}
          style={{
            position: 'relative',
            margin: '0 auto',
            backgroundColor: 'white',
            minHeight: '500px',
            padding: '2rem',
            overflow: 'auto',
            maxHeight: '400px',
          }}
        >
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h1>페이지 제목</h1>
              <p>페이지 내용이 여기에 표시됩니다...</p>
            </div>

            <div
              id="section_01"
              style={{
                height: '200px',
                marginBottom: '2rem',
                padding: '2rem',
                backgroundColor: '#f0f0f0',
              }}
            >
              <h2>서비스 개요</h2>
              <p>서비스 개요 내용...</p>
            </div>
            <div
              id="section_02"
              style={{
                height: '200px',
                marginBottom: '2rem',
                padding: '2rem',
                backgroundColor: '#f0f0f0',
              }}
            >
              <h2>서비스 상세</h2>
              <p>서비스 상세 내용...</p>
            </div>
            <div
              id="section_03"
              style={{
                height: '200px',
                marginBottom: '2rem',
                padding: '2rem',
                backgroundColor: '#f0f0f0',
              }}
            >
              <h2>신청 방법 및 절차</h2>
              <p>신청 방법 및 절차 내용...</p>
            </div>
            <div
              id="section_04"
              style={{
                height: '200px',
                marginBottom: '2rem',
                padding: '2rem',
                backgroundColor: '#f0f0f0',
              }}
            >
              <h2>제출 서류</h2>
              <p>제출 서류 내용...</p>
            </div>
            <div
              id="section_05"
              style={{
                height: '200px',
                marginBottom: '2rem',
                padding: '2rem',
                backgroundColor: '#f0f0f0',
              }}
            >
              <h2>함께 신청할 수 있는 서비스</h2>
              <p>함께 신청할 수 있는 서비스 내용...</p>
            </div>
            <div
              id="section_06"
              style={{
                height: '200px',
                marginBottom: '2rem',
                padding: '2rem',
                backgroundColor: '#f0f0f0',
              }}
            >
              <h2>부가정보</h2>
              <p>부가정보 내용...</p>
            </div>
            <div
              id="section_07"
              style={{
                height: '200px',
                marginBottom: '20rem',
                padding: '2rem',
                backgroundColor: '#f0f0f0',
              }}
            >
              <h2>정보 변경 내역</h2>
              <p>정보 변경 내역 내용...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
        `
      }
    },
    layout: 'fullscreen'
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
