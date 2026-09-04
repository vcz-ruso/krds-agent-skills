# Footer

푸터는 화면을 구성하는 가장 마지막 요소로 헤더와 본문에서 원하는 정보를 찾지 못하였거나 사이트 구조 탐색 중에 길을 잃은 사용자들이 대면하게 되는 정보이다. 따라서 푸터에는 사용자가 서비스를 탐색할 수 있는 추가적인 수단, 문제를 해결하는 데 참고할 수 있는 유용한 링크가 제공되어야 한다.

## Import

`import { Footer } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `quickLinks` | FooterQuickLink[] | 아니오 | 퀵 링크 목록 |
| `address` | string | 아니오 | 주소 |
| `contacts` | FooterContact[] | 아니오 | 연락처 목록 |
| `links` | FooterLink[] | 아니오 | 링크 목록 |
| `socialLinks` | FooterSocialLink[] | 아니오 | 소셜 미디어 링크 목록 |
| `bottomLinks` | FooterBottomLink[] | 아니오 | 하단 링크 목록 |
| `logo` | FooterLogo | 아니오 | 메인 로고 설정 |
| `copyright` | string | 아니오 | 저작권 텍스트 |
| `identifierText` | string | 아니오 | 식별자 텍스트 |
| `identifier` | FooterIdentifier | 아니오 | 식별자 설정 |
| `defaultLinkTarget` | '_blank' \| '_self' | 아니오 | 모든 링크의 기본 타겟 설정 |
| `hideQuickLinks` | boolean | 아니오 | 퀵 링크 섹션 숨김 여부 |
| `hideIdentifier` | boolean | 아니오 | 식별자 섹션 숨김 여부 |

## 하위 컴포넌트

### FooterMainContent

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `logo` | FooterLogo | 아니오 | 메인 로고 설정 |
| `address` | string | 아니오 | 주소 |
| `contacts` | FooterContact[] | 아니오 | 연락처 목록 |
| `links` | FooterLink[] | 아니오 | 링크 목록 |
| `socialLinks` | FooterSocialLink[] | 아니오 | 소셜 미디어 링크 목록 |
| `defaultLinkTarget` | '_blank' \| '_self' | 아니오 | 모든 링크의 기본 타겟 설정 |

### FooterBottom

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `bottomLinks` | FooterBottomLink[] | 아니오 | 하단 링크 목록 |
| `copyright` | string | 아니오 | 저작권 텍스트 |
| `identifierText` | string | 아니오 | 식별자 텍스트 |
| `identifier` | FooterIdentifier | 아니오 | 식별자 설정 |
| `defaultLinkTarget` | '_blank' \| '_self' | 아니오 | 모든 링크의 기본 타겟 설정 |
| `hideIdentifier` | boolean | 아니오 | 식별자 섹션 숨김 여부 |

## 사용 예시

### Default

```tsx
{
  args: {
    quickLinks: [{
      title: '관련사이트1',
      onClick: () => console.log('관련사이트1 클릭')
    }, {
      title: '관련사이트2',
      onClick: () => console.log('관련사이트2 클릭')
    }, {
      title: '관련사이트3',
      onClick: () => console.log('관련사이트3 클릭')
    }, {
      title: '관련사이트4',
      onClick: () => console.log('관련사이트4 클릭')
    }],
    address: '(26464) 강원특별자치도 원주시 건강로 32(반곡동) 국민건강보험공단',
    contacts: [{
      title: '대표전화 1577-1000',
      description: '(유료, 평일 09시~18시)'
    }, {
      title: '해외이용 82-33-811-2001',
      description: '(유료, 평일 09시~18시)'
    }],
    links: [{
      text: '찾아오시는 길',
      href: '#'
    }, {
      text: '이용안내',
      href: '#'
    }, {
      text: '직원검색',
      href: '#'
    }],
    socialLinks: [{
      platform: 'instagram',
      href: '#'
    }, {
      platform: 'youtube',
      href: '#'
    }, {
      platform: 'x',
      href: '#'
    }, {
      platform: 'facebook',
      href: '#'
    }, {
      platform: 'blog',
      href: '#'
    }],
    bottomLinks: [{
      text: '개인정보처리방침',
      href: '#',
      isHighlighted: true
    }, {
      text: '저작권 정책',
      href: '#'
    }, {
      text: '웹 접근성 품질인증 마크 획득',
      href: '#'
    }],
    copyright: '© 2023 National Health Insurance Service. All rights reserved.',
    identifierText: '이 누리집은 보건복지부 산하기관 누리집입니다.',
    hideQuickLinks: false,
    hideIdentifier: false,
    defaultLinkTarget: '_self',
    className: undefined
  }
}
```

### Simple

```tsx
{
  args: {
    address: '(26464) 강원특별자치도 원주시 건강로 32(반곡동) 국민건강보험공단',
    contacts: [{
      title: '대표전화 1577-1000',
      description: '(유료, 평일 09시~18시)'
    }],
    bottomLinks: [{
      text: '개인정보처리방침',
      href: '#',
      isHighlighted: true
    }, {
      text: '저작권 정책',
      href: '#'
    }]
  }
}
```

### Minimal

```tsx
{
  args: {
    address: '(26464) 강원특별자치도 원주시 건강로 32(반곡동) 국민건강보험공단',
    bottomLinks: [{
      text: '개인정보처리방침',
      href: '#',
      isHighlighted: true
    }]
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
