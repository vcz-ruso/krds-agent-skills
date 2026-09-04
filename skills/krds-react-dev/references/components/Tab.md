# Tab

탭은 버튼을 눌러 상호배타적인 여러 개의 콘텐츠 섹션을 전환할 수 있는 컴포넌트이다. 콘텐츠 섹션은 동일한 영역 내에서 전환되기 때문에 정보를 탐색하는 맥락을 유지할 수 있고 작은 공간에 많은 양의 콘텐츠를 효과적으로 표현할 수 있다.

## Import

`import { Tab } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `value` | string | 아니오 | 활성 탭 값 (제어 모드) |
| `defaultValue` | string | 아니오 | 기본 활성 탭 값 (비제어 모드) |
| `onValueChange` | (value: string) => void | 아니오 | 탭 변경 콜백 |
| `variant` | TabVariant | 아니오 | 탭 변형 ('line' \| 'fill') |
| `size` | TabSize | 아니오 | 탭 크기 ('normal' \| 'full') |
| `children` | ReactNode | 예 | 자식 컴포넌트 |
| `className` | string | 아니오 | 커스텀 클래스명 |

## 타입 값

- TabVariant: line | fill
- TabSize: normal | full

## 하위 컴포넌트

### TabList

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 아니오 | 자식 컴포넌트 (TabTrigger들) |
| `className` | string | 아니오 | 커스텀 클래스명 |

### TabTrigger

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `value` | string | 예 | 탭 식별자 |
| `children` | ReactNode | 예 | 자식 컴포넌트 |
| `className` | string | 아니오 | 커스텀 클래스명 |

### TabContent

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 예 | 자식 컴포넌트 |
| `className` | string | 아니오 | 커스텀 클래스명 |

### TabPanel

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `value` | string | 예 | 탭 식별자 |
| `children` | ReactNode | 예 | 자식 컴포넌트 |
| `className` | string | 아니오 | 커스텀 클래스명 |

## 사용 예시

### Default

```tsx
{
  args: {},
  render: _args => <Tab variant="line" size="full" defaultValue="tab1">
      <TabList>
        <TabTrigger value="tab1">타이틀 1</TabTrigger>
        <TabTrigger value="tab2">타이틀 2</TabTrigger>
        <TabTrigger value="tab3">타이틀 3</TabTrigger>
      </TabList>
      <TabContent>
        <TabPanel value="tab1">
          <div>탭 1 영역</div>
        </TabPanel>
        <TabPanel value="tab2">
          <div>탭 2 영역</div>
        </TabPanel>
        <TabPanel value="tab3">
          <div>탭 3 영역</div>
        </TabPanel>
      </TabContent>
    </Tab>
}
```

### Line 타입

```tsx
{
  name: 'Line 타입',
  args: {},
  render: _args => <Tab variant="line" size="normal" defaultValue="overview">
      <TabList>
        <TabTrigger value="overview">개요</TabTrigger>
        <TabTrigger value="features">기능</TabTrigger>
        <TabTrigger value="usage">사용법</TabTrigger>
      </TabList>
      <TabContent>
        <TabPanel value="overview">
          <div>
            <h4>프로젝트 개요</h4>
            <p>이 프로젝트는 KRDS 디자인 시스템을 구현한 React 컴포넌트 라이브러리입니다.</p>
          </div>
        </TabPanel>
        <TabPanel value="features">
          <div>
            <h4>주요 기능</h4>
            <p>다양한 UI 컴포넌트와 유틸리티를 제공합니다.</p>
          </div>
        </TabPanel>
        <TabPanel value="usage">
          <div>
            <h4>사용법</h4>
            <p>npm 또는 yarn을 통해 설치하고 사용할 수 있습니다.</p>
          </div>
        </TabPanel>
      </TabContent>
    </Tab>
}
```

### Fill 타입

```tsx
{
  name: 'Fill 타입',
  args: {},
  render: _args => <Tab variant="fill" size="normal" defaultValue="home">
      <TabList>
        <TabTrigger value="home">홈</TabTrigger>
        <TabTrigger value="about">소개</TabTrigger>
        <TabTrigger value="contact">연락처</TabTrigger>
      </TabList>
      <TabContent>
        <TabPanel value="home">
          <div>홈 페이지 내용입니다.</div>
        </TabPanel>
        <TabPanel value="about">
          <div>소개 페이지 내용입니다.</div>
        </TabPanel>
        <TabPanel value="contact">
          <div>연락처 정보입니다.</div>
        </TabPanel>
      </TabContent>
    </Tab>
}
```

### Line 타입 (풀사이즈)

```tsx
{
  name: 'Line 타입 (풀사이즈)',
  args: {},
  render: _args => <Tab variant="line" size="full" defaultValue="dashboard">
      <TabList>
        <TabTrigger value="dashboard">대시보드</TabTrigger>
        <TabTrigger value="analytics">분석</TabTrigger>
        <TabTrigger value="reports">보고서</TabTrigger>
      </TabList>
      <TabContent>
        <TabPanel value="dashboard">
          <div>대시보드 내용</div>
        </TabPanel>
        <TabPanel value="analytics">
          <div>분석 내용</div>
        </TabPanel>
        <TabPanel value="reports">
          <div>보고서 내용</div>
        </TabPanel>
      </TabContent>
    </Tab>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        height: '400px'
      }
    }
  }
}
```

### Fill 타입 (풀사이즈)

```tsx
{
  name: 'Fill 타입 (풀사이즈)',
  args: {},
  render: _args => <Tab variant="fill" size="full" defaultValue="settings">
      <TabList>
        <TabTrigger value="settings">설정</TabTrigger>
        <TabTrigger value="profile">프로필</TabTrigger>
        <TabTrigger value="security">보안</TabTrigger>
      </TabList>
      <TabContent>
        <TabPanel value="settings">
          <div>설정 페이지</div>
        </TabPanel>
        <TabPanel value="profile">
          <div>프로필 페이지</div>
        </TabPanel>
        <TabPanel value="security">
          <div>보안 설정</div>
        </TabPanel>
      </TabContent>
    </Tab>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        height: '400px'
      }
    }
  }
}
```

### 풍부한 콘텐츠

```tsx
{
  name: '풍부한 콘텐츠',
  args: {},
  render: _args => <Tab variant="line" size="normal" defaultValue="overview">
      <TabList>
        <TabTrigger value="overview">개요</TabTrigger>
        <TabTrigger value="features">주요 기능</TabTrigger>
        <TabTrigger value="usage">사용법</TabTrigger>
      </TabList>
      <TabContent>
        <TabPanel value="overview">
          <div>
            <h4>프로젝트 개요</h4>
            <p>이 프로젝트는 KRDS 디자인 시스템을 구현한 React 컴포넌트 라이브러리입니다.</p>
            <ul>
              <li>재사용 가능한 컴포넌트</li>
              <li>접근성 준수</li>
              <li>TypeScript 지원</li>
            </ul>
          </div>
        </TabPanel>
        <TabPanel value="features">
          <div>
            <h4>주요 기능</h4>
            <p>다양한 UI 컴포넌트와 유틸리티를 제공합니다.</p>
            <ol>
              <li>Button, Input, Select 등 기본 컴포넌트</li>
              <li>Table, Accordion 등 복합 컴포넌트</li>
              <li>다크모드 및 고대비 모드 지원</li>
            </ol>
          </div>
        </TabPanel>
        <TabPanel value="usage">
          <div>
            <h4>사용법</h4>
            <p>npm 또는 yarn을 통해 설치하고 사용할 수 있습니다.</p>
            <pre style={{
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px'
          }}>
              {`npm install @krds/react
import { Tab, TabList, TabTrigger, TabPanel } from '@krds/react';`}
            </pre>
          </div>
        </TabPanel>
      </TabContent>
    </Tab>,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        height: '500px'
      }
    }
  }
}
```

### 비활성 탭 포함

```tsx
{
  name: '비활성 탭 포함',
  args: {},
  render: _args => <Tab variant="fill" size="normal" defaultValue="enabled1">
      <TabList>
        <TabTrigger value="enabled1">활성 탭 1</TabTrigger>
        <TabTrigger value="disabled1" disabled>
          비활성 탭
        </TabTrigger>
        <TabTrigger value="enabled2">활성 탭 2</TabTrigger>
      </TabList>
      <TabContent>
        <TabPanel value="enabled1">
          <div>첫 번째 활성 탭 내용</div>
        </TabPanel>
        <TabPanel value="disabled1">
          <div>비활성 탭 내용</div>
        </TabPanel>
        <TabPanel value="enabled2">
          <div>두 번째 활성 탭 내용</div>
        </TabPanel>
      </TabContent>
    </Tab>
}
```

### 제어 모드

```tsx
{
  name: '제어 모드',
  args: {},
  render: _args => <ControlledTabExample />,
  parameters: {
    docs: {
      description: {
        story: '외부 상태로 탭을 제어하는 예제입니다. 버튼을 클릭하여 탭을 변경할 수 있습니다.'
      },
      source: {
        language: 'tsx',
        code: `
const ControlledTabExample = () => {
  const [activeTab, setActiveTab] = useState('tab2');

  return (
    <div style={{ width: '600px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <p>
          현재 활성 탭: <strong>{activeTab}</strong>
        </p>
        <button onClick={() => setActiveTab('tab1')} style={{ marginRight: '0.5rem' }}>
          탭 1로 변경
        </button>
        <button onClick={() => setActiveTab('tab2')} style={{ marginRight: '0.5rem' }}>
          탭 2로 변경
        </button>
        <button onClick={() => setActiveTab('tab3')}>탭 3으로 변경</button>
      </div>
      <Tab value={activeTab} onValueChange={setActiveTab} variant="line" size="normal">
        <TabList>
          <TabTrigger value="tab1">타이틀 1</TabTrigger>
          <TabTrigger value="tab2">타이틀 2</TabTrigger>
          <TabTrigger value="tab3">타이틀 3</TabTrigger>
        </TabList>
        <TabContent>
          <TabPanel value="tab1">
            <div>탭 1 영역</div>
          </TabPanel>
          <TabPanel value="tab2">
            <div>탭 2 영역</div>
          </TabPanel>
          <TabPanel value="tab3">
            <div>탭 3 영역</div>
          </TabPanel>
        </TabContent>
      </Tab>
    </div>
  );
};`
      }
    }
  }
}
```

### 비제어 모드

```tsx
{
  name: '비제어 모드',
  args: {},
  render: _args => <Tab variant="line" size="normal" defaultValue="tab2">
      <TabList>
        <TabTrigger value="tab1">타이틀 1</TabTrigger>
        <TabTrigger value="tab2">타이틀 2</TabTrigger>
        <TabTrigger value="tab3">타이틀 3</TabTrigger>
      </TabList>
      <TabContent>
        <TabPanel value="tab1">
          <div>탭 1 영역</div>
        </TabPanel>
        <TabPanel value="tab2">
          <div>탭 2 영역</div>
        </TabPanel>
        <TabPanel value="tab3">
          <div>탭 3 영역</div>
        </TabPanel>
      </TabContent>
    </Tab>,
  parameters: {
    docs: {
      description: {
        story: '내부 상태로 관리되는 탭입니다. defaultValue로 초기 활성 탭을 설정할 수 있습니다.'
      }
    }
  }
}
```

### 키보드 내비게이션

```tsx
{
  name: '키보드 내비게이션',
  args: {},
  render: _args => <Tab variant="line" size="normal" defaultValue="nav1">
      <TabList>
        <TabTrigger value="nav1">내비게이션 1</TabTrigger>
        <TabTrigger value="nav2">내비게이션 2</TabTrigger>
        <TabTrigger value="nav3">내비게이션 3</TabTrigger>
      </TabList>
      <TabContent>
        <TabPanel value="nav1">
          <div>내비게이션 1 내용</div>
        </TabPanel>
        <TabPanel value="nav2">
          <div>내비게이션 2 내용</div>
        </TabPanel>
        <TabPanel value="nav3">
          <div>내비게이션 3 내용</div>
        </TabPanel>
      </TabContent>
    </Tab>,
  parameters: {
    docs: {
      description: {
        story: `
키보드로 탭을 조작할 수 있습니다:
- **Arrow Left/Right**: 이전/다음 탭으로 포커스 이동
- **Home**: 첫 번째 탭으로 포커스 이동
- **End**: 마지막 탭으로 포커스 이동
- **Enter/Space**: 포커스된 탭 활성화
        `
      }
    }
  }
}
```

### Compound Pattern 예제

```tsx
{
  name: 'Compound Pattern 예제',
  args: {},
  render: _args => <Tab variant="line" size="normal" defaultValue="component">
      <TabList>
        <TabTrigger value="component">컴포넌트</TabTrigger>
        <TabTrigger value="usage">사용법</TabTrigger>
        <TabTrigger value="api">API</TabTrigger>
      </TabList>
      <TabContent>
        <TabPanel value="component">
          <div>
            <h4>Compound Pattern</h4>
            <p>Tab 컴포넌트는 다음과 같이 구성됩니다:</p>
            <ul>
              <li>
                <code>&lt;Tab&gt;</code> - 루트 컨테이너
              </li>
              <li>
                <code>&lt;TabList&gt;</code> - 탭 버튼들의 컨테이너
              </li>
              <li>
                <code>&lt;TabTrigger&gt;</code> - 개별 탭 버튼
              </li>
              <li>
                <code>&lt;TabPanel&gt;</code> - 탭 콘텐츠
              </li>
            </ul>
          </div>
        </TabPanel>
        <TabPanel value="usage">
          <div>
            <h4>기본 사용법</h4>
            <pre style={{
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px'
          }}>
              {`<Tab defaultValue="tab1">
  <TabList>
    <TabTrigger value="tab1">탭 1</TabTrigger>
    <TabTrigger value="tab2">탭 2</TabTrigger>
  </TabList>
  <TabPanel value="tab1">콘텐츠 1</TabPanel>
  <TabPanel value="tab2">콘텐츠 2</TabPanel>
</Tab>`}
            </pre>
          </div>
        </TabPanel>
        <TabPanel value="api">
          <div>
            <h4>API 참조</h4>
            <p>각 컴포넌트의 props와 사용법을 확인하세요.</p>
          </div>
        </TabPanel>
      </TabContent>
    </Tab>,
  parameters: {
    docs: {
      description: {
        story: 'Compound Pattern의 사용법을 보여주는 예제입니다.'
      }
    }
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
