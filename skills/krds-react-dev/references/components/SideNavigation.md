# SideNavigation

사이드 메뉴는 서브 화면 내에서의 이동을 위해 사용하는 메뉴이다. 일반적으로 본문 영역의 좌측에 사이드바 형태로 제공된다. 메인 메뉴보다 훨씬 좁고 깊은 페이지 구조 탐색에 사용되기 때문에 링크의 개수가 많고 복잡하게 표현되기 쉽다. 사이트 규모가 클수록 사이드 메뉴를 단순하고 직관적으로 설계하여 사용자가 탐색 중에 길을 잃지 않도록 해야 한다.

## Import

`import { SideNavigation } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `className` | string | 아니오 | 추가 CSS 클래스 |

## 하위 컴포넌트

### SideNavigationTitle

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `className` | string | 아니오 | 추가 CSS 클래스 |

### SideNavigationMenu

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `className` | string | 아니오 | 추가 CSS 클래스 |

### SideNavigationItem

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `active` | boolean | 아니오 | 활성화 상태 |
| `className` | string | 아니오 | 추가 CSS 클래스 |

### SideNavigationSubItem

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `active` | boolean | 아니오 | 활성화 상태 |
| `className` | string | 아니오 | 추가 CSS 클래스 |

### SideNavigationToggle

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `active` | boolean | 아니오 | 활성화 상태 |
| `expanded` | boolean | 아니오 | 확장된 상태 |
| `onClick` | () => void | 아니오 | 클릭 핸들러 |
| `className` | string | 아니오 | 추가 CSS 클래스 |
| `'aria-controls'` | string | 아니오 | ARIA controls 속성 |

### SideNavigationSubMenu

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `id` | string | 아니오 | 메뉴 ID |
| `className` | string | 아니오 | 추가 CSS 클래스 |

### SideNavigationLink

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `href` | string | 아니오 | 링크 URL |
| `current` | boolean | 아니오 | 현재 페이지 여부 |
| `onClick` | () => void | 아니오 | 클릭 핸들러 |
| `className` | string | 아니오 | 추가 CSS 클래스 |

### SideNavigationPopupToggle

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `expanded` | boolean | 아니오 | 확장된 상태 |
| `onClick` | (event: React.MouseEvent<HTMLButtonElement>) => void | 아니오 | 클릭 핸들러 |
| `className` | string | 아니오 | 추가 CSS 클래스 |
| `'aria-controls'` | string | 아니오 | ARIA controls 속성 |

### SideNavigationPopup

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `active` | boolean | 아니오 | 활성화 상태 |
| `id` | string | 아니오 | 메뉴 ID |
| `className` | string | 아니오 | 추가 CSS 클래스 |

### SideNavigationPopupTitle

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `onClick` | (event: React.MouseEvent<HTMLButtonElement>) => void | 아니오 | 클릭 핸들러 |
| `className` | string | 아니오 | 추가 CSS 클래스 |

### SideNavigationPopupMenu

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | 자식 컴포넌트들 |
| `className` | string | 아니오 | 추가 CSS 클래스 |

## 사용 예시

### Default

```tsx
{
  args: {},
  render: _args => {
    const [expanded1, setExpanded1] = useState(true);
    const [expanded2, setExpanded2] = useState(false);
    const [expanded3, setExpanded3] = useState(false);
    const [popup1Active, setPopup1Active] = useState(false);
    const [popup2Active, setPopup2Active] = useState(false);
    const [popup3Active, setPopup3Active] = useState(false);
    return <SideNavigation>
        <SideNavigation.Title>1Depth-title</SideNavigation.Title>
        <SideNavigation.Menu>
          <SideNavigation.Item active={expanded1}>
            <SideNavigation.Toggle active expanded={expanded1} onClick={() => setExpanded1(!expanded1)} aria-controls="lnbmenu-1">
              2Depth-menu
            </SideNavigation.Toggle>
            <SideNavigation.SubMenu id="lnbmenu-1">
              <SideNavigation.SubItem>
                <SideNavigation.PopupToggle expanded={popup1Active} onClick={() => setPopup1Active(!popup1Active)} aria-controls="lnbmenu-2">
                  3Depth-menu
                </SideNavigation.PopupToggle>
                <SideNavigation.Popup active={popup1Active} id="lnbmenu-2">
                  <SideNavigation.PopupTitle onClick={() => setPopup1Active(false)}>
                    3Depth-title
                  </SideNavigation.PopupTitle>
                  <SideNavigation.PopupMenu>
                    <li role="none">
                      <SideNavigation.Link>4Depth</SideNavigation.Link>
                    </li>
                    <li role="none">
                      <SideNavigation.Link>4Depth</SideNavigation.Link>
                    </li>
                    <li role="none">
                      <SideNavigation.Link>4Depth</SideNavigation.Link>
                    </li>
                  </SideNavigation.PopupMenu>
                </SideNavigation.Popup>
              </SideNavigation.SubItem>
              <SideNavigation.SubItem>
                <SideNavigation.Link>3Depth-link</SideNavigation.Link>
              </SideNavigation.SubItem>
              <SideNavigation.SubItem active>
                <SideNavigation.Link current>3Depth-link</SideNavigation.Link>
              </SideNavigation.SubItem>
            </SideNavigation.SubMenu>
          </SideNavigation.Item>

          <SideNavigation.Item active={expanded2}>
            <SideNavigation.Toggle expanded={expanded2} onClick={() => setExpanded2(!expanded2)} aria-controls="lnbmenu-4">
              2Depth-menu
            </SideNavigation.Toggle>
            <SideNavigation.SubMenu id="lnbmenu-4">
              <SideNavigation.SubItem>
                <SideNavigation.PopupToggle expanded={popup2Active} onClick={() => setPopup2Active(!popup2Active)} aria-controls="lnbmenu-5">
                  3Depth-menu
                </SideNavigation.PopupToggle>
                <SideNavigation.Popup active={popup2Active} id="lnbmenu-5">
                  <SideNavigation.PopupTitle onClick={() => setPopup2Active(false)}>
                    3Depth-title
                  </SideNavigation.PopupTitle>
                  <SideNavigation.PopupMenu>
                    <li role="none">
                      <SideNavigation.Link>4Depth</SideNavigation.Link>
                    </li>
                    <li role="none">
                      <SideNavigation.Link>4Depth</SideNavigation.Link>
                    </li>
                    <li role="none">
                      <SideNavigation.Link>4Depth</SideNavigation.Link>
                    </li>
                  </SideNavigation.PopupMenu>
                </SideNavigation.Popup>
              </SideNavigation.SubItem>
              <SideNavigation.SubItem>
                <SideNavigation.Link>3Depth-link</SideNavigation.Link>
              </SideNavigation.SubItem>
              <SideNavigation.SubItem>
                <SideNavigation.Link>3Depth-link</SideNavigation.Link>
              </SideNavigation.SubItem>
            </SideNavigation.SubMenu>
          </SideNavigation.Item>

          <SideNavigation.Item active={expanded3}>
            <SideNavigation.Toggle expanded={expanded3} onClick={() => setExpanded3(!expanded3)} aria-controls="lnbmenu-6">
              2Depth-menu
            </SideNavigation.Toggle>
            <SideNavigation.SubMenu id="lnbmenu-6">
              <SideNavigation.SubItem>
                <SideNavigation.PopupToggle expanded={popup3Active} onClick={() => setPopup3Active(!popup3Active)} aria-controls="lnbmenu-7">
                  3Depth-menu
                </SideNavigation.PopupToggle>
                <SideNavigation.Popup active={popup3Active} id="lnbmenu-7">
                  <SideNavigation.PopupTitle onClick={() => setPopup3Active(false)}>
                    3Depth-title
                  </SideNavigation.PopupTitle>
                  <SideNavigation.PopupMenu>
                    <li role="none">
                      <SideNavigation.Link>4Depth</SideNavigation.Link>
                    </li>
                    <li role="none">
                      <SideNavigation.Link>4Depth</SideNavigation.Link>
                    </li>
                    <li role="none">
                      <SideNavigation.Link>4Depth</SideNavigation.Link>
                    </li>
                  </SideNavigation.PopupMenu>
                </SideNavigation.Popup>
              </SideNavigation.SubItem>
              <SideNavigation.SubItem>
                <SideNavigation.Link>3Depth-link</SideNavigation.Link>
              </SideNavigation.SubItem>
              <SideNavigation.SubItem>
                <SideNavigation.Link>3Depth-link</SideNavigation.Link>
              </SideNavigation.SubItem>
            </SideNavigation.SubMenu>
          </SideNavigation.Item>
        </SideNavigation.Menu>
      </SideNavigation>;
  }
}
```

### Simple Menu

```tsx
{
  args: {},
  render: _args => {
    const [expanded, setExpanded] = useState(true);
    return <SideNavigation>
        <SideNavigation.Title>메뉴 제목</SideNavigation.Title>
        <SideNavigation.Menu>
          <SideNavigation.Item active={expanded}>
            <SideNavigation.Toggle active expanded={expanded} onClick={() => setExpanded(!expanded)} aria-controls="simple-menu">
              메뉴 항목 1
            </SideNavigation.Toggle>
            <SideNavigation.SubMenu id="simple-menu">
              <SideNavigation.SubItem active>
                <SideNavigation.Link current>하위 메뉴 1</SideNavigation.Link>
              </SideNavigation.SubItem>
              <SideNavigation.SubItem>
                <SideNavigation.Link>하위 메뉴 2</SideNavigation.Link>
              </SideNavigation.SubItem>
              <SideNavigation.SubItem>
                <SideNavigation.Link>하위 메뉴 3</SideNavigation.Link>
              </SideNavigation.SubItem>
            </SideNavigation.SubMenu>
          </SideNavigation.Item>
        </SideNavigation.Menu>
      </SideNavigation>;
  }
}
```

### With Popup Only

```tsx
{
  args: {},
  render: _args => {
    const [expanded, setExpanded] = useState(true);
    const [popupActive, setPopupActive] = useState(false);
    return <SideNavigation>
        <SideNavigation.Title>팝업 메뉴 예시</SideNavigation.Title>
        <SideNavigation.Menu>
          <SideNavigation.Item active={expanded}>
            <SideNavigation.Toggle active expanded={expanded} onClick={() => setExpanded(!expanded)} aria-controls="popup-menu">
              상위 메뉴
            </SideNavigation.Toggle>
            <SideNavigation.SubMenu id="popup-menu">
              <SideNavigation.SubItem>
                <SideNavigation.PopupToggle expanded={popupActive} onClick={() => setPopupActive(!popupActive)} aria-controls="popup-content">
                  팝업 메뉴
                </SideNavigation.PopupToggle>
                <SideNavigation.Popup active={popupActive} id="popup-content">
                  <SideNavigation.PopupTitle onClick={() => setPopupActive(false)}>
                    팝업 제목
                  </SideNavigation.PopupTitle>
                  <SideNavigation.PopupMenu>
                    <li role="none">
                      <SideNavigation.Link>세부 항목 1</SideNavigation.Link>
                    </li>
                    <li role="none">
                      <SideNavigation.Link>세부 항목 2</SideNavigation.Link>
                    </li>
                    <li role="none">
                      <SideNavigation.Link>세부 항목 3</SideNavigation.Link>
                    </li>
                  </SideNavigation.PopupMenu>
                </SideNavigation.Popup>
              </SideNavigation.SubItem>
              <SideNavigation.SubItem>
                <SideNavigation.Link>일반 링크</SideNavigation.Link>
              </SideNavigation.SubItem>
            </SideNavigation.SubMenu>
          </SideNavigation.Item>
        </SideNavigation.Menu>
      </SideNavigation>;
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
