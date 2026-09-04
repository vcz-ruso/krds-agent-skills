# MainMenu

메인 메뉴는 사용자가 서비스의 정보 구조를 탐색할 때, 가장 많이 사용하는 유형의 메뉴이다. 일반적으로 헤더와 함께 거의 모든 화면에 제공되며, 사용자가 자주 방문하거나 중요도가 높은 화면으로 이동할 수 있는 링크가 포함되어 있다. 빈번하게 활용되는 사용자의 일차적인 이동 수단이기 때문에 사용하기 쉽게 설계해야 한다.

## Import

> ⚠️ 이 컴포넌트는 `krds-react` 패키지 최상위에서 export되지 않는다. 공개 API 여부를 확인한 뒤 사용할 것.

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `desktop` | DesktopMenuConfig | 예 | 데스크톱 메뉴 설정 |
| `mobile` | MobileMenuConfig | 예 | 모바일 메뉴 설정 |
| `mobileTrigger` | ReactNode | 아니오 | 모바일 트리거 컴포넌트 |
| `onMobileMenuOpen` | () => void | 아니오 | 모바일 메뉴 열기 핸들러 |
| `onMobileMenuClose` | () => void | 아니오 | 모바일 메뉴 닫기 핸들러 |
| `desktopPortalId` | string | 아니오 | — |
| `mobilePortalId` | string | 아니오 | — |
| `mobileTriggerPortalId` | string \| never | 아니오 | 모바일 트리거 포탈 ID |
| `mobileTriggerContainerElement` | never \| HTMLElement | 아니오 | 모바일 트리거 컨테이너 요소 |

## 하위 컴포넌트

### MobileTrigger

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `label` | string | 아니오 | 모바일 트리거 라벨 |
| `icon` | ReactNode | 아니오 | — |

## 사용 예시

### Default

```tsx
{
  render: () => <MainMenu desktop={desktopConfig} mobile={mobileConfig} mobileTrigger={<MainMenu.MobileTrigger label="전체메뉴" />} mobileTriggerPortalId="mobile-nav" />,
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 900
      },
      source: {
        code: `
        
const desktopConfig: DesktopMenuConfig = {
  items: [
    {
      type: 'dropdown',
      label: '정책정보',
      sections: [
        {
          type: 'menu',
          label: '정책소개',
          quickLinkHref: '#',
          items: [
            { label: '개요', href: '#' },
            { label: '연혁', href: '#' },
            { label: 'FAQ', href: '#', description: '정책 소개 FAQ' },
          ],
          banner: {
            badgeText: '신규 서비스',
            buttonText: '메뉴명',
            onButtonClick: () => console.log('배너 클릭'),
            children: <p>새로운 정책이 시작되었습니다!</p>,
          },
        },
        {
          type: 'menu',
          label: '정책자료',
          layout: 'between',
          items: [
            { label: '정책문서1', href: '#' },
            { label: '정책문서2', href: '#' },
            { label: '정책문서3', href: '#' },
            { label: '정책문서4', href: '#' },
          ],
        },
        {
          type: 'link',
          label: '외부 정책 포털',
          href: '#',
          isExternal: true,
        },
      ],
    },
    {
      type: 'dropdown',
      label: '서비스',
      sections: [
        {
          type: 'menu',
          label: '전자 서비스',
          items: [
            { label: '민원 서비스', href: '#' },
            { label: '예약 서비스', href: '#' },
            { label: '증명 발급', href: '#' },
          ],
        },
        {
          type: 'menu',
          label: '안내 자료',
          items: [
            { label: '이용 가이드', href: '#' },
            { label: '정책 요약', href: '#' },
            { label: '보도 자료', href: '#' },
          ],
        },
      ],
    },
    {
      type: 'link',
      label: '공지사항',
      href: '#',
    },
  ],
};

const mobileConfig: MobileMenuConfig = {
  id: 'mobile-nav-demo',
  header: {
    utilities: [{ label: '즐겨찾기' }, { label: '사이트맵' }],
    login: {
      isLoggedIn: false,
      loginText: '로그인을 해주세요',
      onLogin: () => console.log('로그인 클릭'),
    },
    services: [
      { label: '서비스1', href: '#' },
      { label: '서비스2', href: '#' },
      { label: '서비스3', href: '#' },
    ],
    search: {
      placeholder: '찾고자 하는 메뉴명을 입력해 주세요',
      onSearch: query => console.log('검색:', query),
    },
  },
  body: {
    mainItems: [
      {
        label: '정책정보',
        panels: [
          {
            label: '정책정보',
            items: [
              { type: 'link', label: '정책소개', href: '#' },
              {
                type: 'depth3',
                label: '정책자료',
                items: [
                  { type: 'link', label: '문서1', href: '#' },
                  { type: 'link', label: '문서2', href: '#' },
                  {
                    type: 'depth4',
                    label: '심화자료',
                    title: '세부 정책 자료',
                    items: [
                      { label: '심화1', href: '#' },
                      { label: '심화2', href: '#' },
                      { label: '심화3', href: '#' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: '공지사항',
        panels: [
          {
            label: '공지사항',
            items: [
              { type: 'link', label: '최근 공지', href: '#' },
              { type: 'link', label: '정책 공지', href: '#' },
              { type: 'link', label: '공지 보관함', href: '#' },
            ],
          },
        ],
      },
      {
        label: '대민 서비스',
        panels: [
          {
            label: '대민 서비스',
            items: [
              {
                type: 'depth3',
                label: '신청 서비스',
                items: [
                  { type: 'link', label: '민원 신청', href: '#' },
                  { type: 'link', label: '발급 신청', href: '#' },
                  {
                    type: 'depth4',
                    label: '상세 신청',
                    title: '세부 신청',
                    items: [
                      { label: '신청 A', href: '#' },
                      { label: '신청 B', href: '#' },
                      { label: '신청 C', href: '#' },
                    ],
                  },
                ],
              },
              { type: 'link', label: '상담 예약', href: '#' },
              { type: 'link', label: '서비스 가이드', href: '#' },
            ],
          },
        ],
      },
    ],
  },
  bottomLinks: [
    { label: '개인정보처리방침', href: '#' },
    { label: '이용약관', href: '#' },
    { label: '외부사이트', href: '#', isExternal: true },
  ],
};

<MainMenu
  desktop={desktopConfig}
  mobile={mobileConfig}
  mobileTrigger={<MainMenu.MobileTrigger label="전체메뉴" />}
  mobileTriggerPortalId="mobile-nav"
/>
        `
      }
    }
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
