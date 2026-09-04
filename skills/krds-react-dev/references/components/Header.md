# Header

헤더는 사용자가 웹사이트에 접속하자마자 마주하게 되는 화면의 최상단 영역으로 디지털 정부 서비스의 브랜드 이미지를 전달하는 핵심 영역이다. 모든 화면에 일관성 있게 배치되며 통합검색, 메인 메뉴 등 서비스 정보를 탐색하고 이동할 수 있는 핵심 탐색 수단을 제공한다.

## Import

`import { Header } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 아니오 | 자식 컴포넌트들 |
| `mobileMenuTriggerPortalId` | string | 아니오 | 모바일 메뉴 트리거 Portal ID |
| `desktopMenuPortalId` | string | 아니오 | 데스크톱 메뉴 Portal ID |
| `mobileMenuPortalId` | string | 아니오 | 모바일 메뉴 Portal ID |

## 하위 컴포넌트

### HeaderUtilities

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 아니오 | 유틸리티 아이템들 |

### HeaderUtility

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 아니오 | 자식 컴포넌트 |

### HeaderUtilityDropdown

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | string | 아니오 | 드롭다운 고유 ID |
| `label` | ReactNode | 아니오 | 드롭다운 버튼 레이블 |
| `buttonText` | ReactNode | 아니오 | 드롭다운 버튼 텍스트 (label 별칭) |
| `children` | ReactNode | 예 | 드롭다운 아이템들 |
| `dropdownClassName` | string | 아니오 | 드롭다운 컨테이너 커스텀 클래스 |
| `itemClassName` | string | 아니오 | 드롭다운 아이템 커스텀 클래스 |

### HeaderBranding

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `logoHref` | string | 아니오 | 로고 링크 URL |
| `onLogoClick` | () => void | 아니오 | 로고 클릭 핸들러 |
| `logoAltText` | string | 아니오 | 로고 이미지 대체 텍스트 |
| `children` | ReactNode | 아니오 | 자식 컴포넌트들 (주로 Navi) |

### HeaderNavi

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 아니오 | NaviButton 컴포넌트들 |

### HeaderNaviButtonSearch

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `label` | ReactNode | 아니오 | 검색 버튼 레이블 |
| `title` | string | 아니오 | 검색 버튼 title 속성 |

### HeaderNaviButtonLogin

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `href` | string \| undefined | 아니오 | 로그인 링크 URL (지정 시 <a> 태그로 렌더링) |
| `label` | ReactNode | 아니오 | 로그인 버튼 레이블 |

### HeaderNaviButtonJoin

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `label` | ReactNode | 아니오 | 회원가입 버튼 레이블 |

### HeaderMyGov

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `label` | ReactNode | 아니오 | 마이GOV 버튼 레이블 |
| `name` | ReactNode | 예 | 사용자 이름 |
| `remainingTime` | ReactNode | 아니오 | 남은 시간 표시 (예: "29:30") |
| `remainingTimeLabel` | ReactNode | 아니오 | 남은 시간 레이블 |
| `extendTimeLabel` | ReactNode | 아니오 | 시간 연장 버튼 레이블 |
| `onExtendTime` | () => void | 아니오 | 시간 연장 버튼 클릭 핸들러 |
| `items` | HeaderMyGovMenuItem[] | 아니오 | 드롭다운 메뉴 아이템들 |
| `className` | string | 아니오 | 컨테이너 커스텀 클래스 |
| `buttonClassName` | string | 아니오 | 버튼 커스텀 클래스 |
| `dropdownId` | string | 아니오 | 드롭다운 고유 ID |

### HeaderNaviButtonLogout

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 아니오 | 로그아웃 버튼 내용 |

### HeaderMainMenu

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `mobileTrigger` | ReactNode | 아니오 | 커스텀 모바일 트리거 |
| `mobileTriggerProps` | MobileTriggerProps | 아니오 | 모바일 트리거 props |
| `allMenuButtonLabel` | string | 아니오 | 전체 메뉴 버튼 레이블 |

## 사용 예시

### Default

```tsx
{
  args: {},
  render: _args => <Header>
      <Header.Container>
        <Header.Utilities>
          <Header.Utility>
            <a href="#" className="krds-btn small text" target="_blank" title="새 창 열림">
              KRDS 소개 <i className="svg-icon ico-go" />
            </a>
          </Header.Utility>
          <Header.Utility>
            <Resize buttonText="화면크기조절" />
          </Header.Utility>
          <Header.Utility.Dropdown label="사용자 지원">
            <Header.Utility.DropdownItem>인증센터</Header.Utility.DropdownItem>
            <Header.Utility.DropdownItem>도움말</Header.Utility.DropdownItem>
          </Header.Utility.Dropdown>
        </Header.Utilities>
        <Header.Branding logoHref="#">
          <Header.Navi>
            <Header.NaviButton.Search onClick={() => console.log('search click')} />
            <Header.NaviButton.Login href="#login" onClick={() => console.log('login click')} />
            <Header.NaviButton.Join onClick={() => console.log('join click')} />
          </Header.Navi>
        </Header.Branding>
      </Header.Container>
      <Header.MainMenu desktop={desktopMenu} mobile={mobileMenu} />
    </Header>
}
```

### Logged In

```tsx
{
  args: {},
  render: _args => <Header>
      <Header.Container>
        <Header.Utilities>
          <Header.Utility>
            <a href="#" className="krds-btn small text" target="_blank" title="새 창 열림">
              KRDS 소개 <i className="svg-icon ico-go" />
            </a>
          </Header.Utility>
          <Header.Utility>
            <Resize buttonText="화면크기조절" />
          </Header.Utility>
          <Header.Utility.Dropdown label="사용자 지원">
            <Header.Utility.DropdownItem>인증센터</Header.Utility.DropdownItem>
            <Header.Utility.DropdownItem>도움말</Header.Utility.DropdownItem>
          </Header.Utility.Dropdown>
        </Header.Utilities>
        <Header.Branding logoHref="#">
          <Header.Navi>
            <Header.NaviButton.Search onClick={() => console.log('search click')} />
            <Header.NaviButton.MyGov name="홍길동님" remainingTime="29:30" onExtendTime={() => console.log('시간 연장')} items={[{
            label: '내 정보',
            href: '#my'
          }, {
            label: '설정',
            href: '#settings'
          }]} />
          </Header.Navi>
        </Header.Branding>
      </Header.Container>
      <Header.MainMenu desktop={desktopMenu} mobile={{
      ...mobileMenu,
      header: {
        ...mobileMenu.header,
        login: {
          isLoggedIn: true,
          userName: '홍길동',
          logoutText: '로그아웃',
          onLogout: () => console.log('logout')
        }
      }
    }} />
    </Header>
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
