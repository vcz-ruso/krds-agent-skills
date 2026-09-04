# HelpPanel

도움 패널은 본문 콘텐츠의 섹션이나 일부 요소에 대한 개념/용어 설명, 옵션의 구성, 이용 방법 등과 관련된 정보나 도움말 콘텐츠를 제공하는 사이드 패널이다.

## Import

`import { HelpPanel } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `isOpen` | boolean | 아니오 | 도움말 패널 열림 상태 |
| `defaultOpen` | boolean | 아니오 | 비제어 상태에서 사용할 초기 열림 상태 |
| `onOpenChange` | (isOpen: boolean) => void | 아니오 | 도움말 패널 열림/닫힘 상태 변경 핸들러 |
| `children` | React.ReactNode | 아니오 | 도움말 패널 내용 |

## 하위 컴포넌트

### HelpPanelTrigger

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 아니오 | 트리거 버튼 텍스트 |

### HelpPanelContent

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 아니오 | 도움말 패널 내용 |
| `srOnlyTitle` | string | 아니오 | 스크린 리더 전용 제목 |

### HelpSection

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `title` | string | 예 | 섹션 제목 |
| `description` | string | 아니오 | 섹션 설명 |
| `children` | React.ReactNode | 아니오 | 섹션 내용 |

### HelpRelatedService

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 아니오 | 관련 서비스 그룹들 |

### HelpServiceGroup

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `title` | string | 예 | 서비스 그룹 제목 |
| `children` | React.ReactNode | 아니오 | 서비스 그룹 내용 |

### HelpLinkList

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `links` | Array<{ text: string; href: string; target?: string; icon?: string; }> | 예 | 링크 목록 |
| `iconPosition` | 'left' \| 'right' | 아니오 | 아이콘 위치 ('left' \| 'right') |

### HelpPanelClose

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 아니오 | 닫기 버튼 텍스트 |

## 사용 예시

### Default

```tsx
{
  args: defaultArgs as unknown as Story['args'],
  render: rawArgs => {
    const args = rawArgs as DefaultStoryArgs;
    return <div style={{
      minHeight: '100vh',
      padding: '2rem'
    }}>
        <HelpPanel isOpen={args.isOpen} defaultOpen={args.defaultOpen} onOpenChange={args.onOpenChange} className={args.className}>
          <HelpPanelTrigger>{args['trigger.children'] ?? '도움말'}</HelpPanelTrigger>
          {args.children as React.ReactNode ?? <>
              <HelpPanelContent srOnlyTitle={args['content.srOnlyTitle']}>
                {args['content.children'] as React.ReactNode ?? <>
                    <HelpSection title={args['section.title'] ?? ''} description={args['section.description']}>
                      {args['section.children'] as React.ReactNode ?? <HelpLinkList iconPosition={args['linkList.iconPosition']} links={args['linkList.links'] ?? defaultSectionLinks} />}
                    </HelpSection>

                    <HelpRelatedService>
                      <HelpServiceGroup title={args['serviceGroup.title'] ?? ''}>
                        {args['serviceGroup.children'] as React.ReactNode ?? <HelpLinkList links={defaultRelatedServiceLinks} />}
                      </HelpServiceGroup>
                      <HelpServiceGroup title="기타 문의/도움말">
                        <HelpLinkList iconPosition="left" links={defaultOtherHelpLinks} />
                      </HelpServiceGroup>
                    </HelpRelatedService>

                    <HelpContentArea>
                      <HelpTutorialTitle title={args['tutorialTitle.title'] ?? ''} href={args['tutorialTitle.href']} />
                      <HelpCoachProcess>
                        <HelpCoachTask title={args['coachTask.title'] ?? ''} isCurrent={args['coachTask.isCurrent']} expandText={args['coachTask.expandText'] ?? ''} steps={args['coachTask.steps'] ?? []} />
                      </HelpCoachProcess>
                    </HelpContentArea>
                  </>}
              </HelpPanelContent>

              <HelpPanelAction>
                <Button size="medium" variant="secondary" className="coach-btn-stop">
                  그만 따라하기
                </Button>
              </HelpPanelAction>
            </>}
          <HelpPanelClose>{args['close.children'] ?? '접어두기'}</HelpPanelClose>
        </HelpPanel>
      </div>;
  }
}
```

### With Tabs

```tsx
{
  render: rawArgs => {
    const args = rawArgs as DefaultStoryArgs;
    return <div style={{
      minHeight: '100vh',
      padding: '2rem'
    }}>
        <HelpPanel isOpen={args.isOpen} defaultOpen={args.defaultOpen} onOpenChange={args.onOpenChange} className={args.className}>
          <HelpPanelTrigger>도움말</HelpPanelTrigger>
          <Tab defaultValue="help" variant="line" className="layer" size="normal">
            <TabList>
              <TabTrigger value="help">도움</TabTrigger>
              <TabTrigger value="tutorial">따라하기</TabTrigger>
            </TabList>
            <TabContent>
              <TabPanel value="help">
                <HelpPanelContent srOnlyTitle="도움">
                  <HelpSection title="전자문서지갑" description="전자문서지갑에서는 전자증명서 출력기능을 제공하지 않으며, 스마트폰 화면을 캡쳐하여 사용할 수 없습니다. 다만, 발급받은 전자증명서를 열람용으로 다운로드할 수는 있습니다.">
                    <HelpLinkList links={[{
                    text: '안드로이드 애플리케이션 다운로드',
                    href: '#',
                    target: '_blank',
                    icon: 'ico-go'
                  }, {
                    text: 'iOS애플리케이션 다운로드',
                    href: '#',
                    target: '_blank',
                    icon: 'ico-go'
                  }]} />
                  </HelpSection>

                  <HelpRelatedService>
                    <HelpServiceGroup title="관련서비스/민원">
                      <HelpLinkList links={[{
                      text: '영문 주민등록표등본',
                      href: '#',
                      icon: 'ico-angle right'
                    }, {
                      text: '영문 주민등록표초본',
                      href: '#',
                      icon: 'ico-angle right'
                    }, {
                      text: '주민등록표등본',
                      href: '#',
                      icon: 'ico-angle right'
                    }]} />
                    </HelpServiceGroup>
                    <HelpServiceGroup title="기타 문의/도움말">
                      <HelpLinkList iconPosition="left" links={[{
                      text: '민원신청 관련 문의 전화 번호 찾기',
                      href: '#',
                      icon: 'ico-call'
                    }, {
                      text: '자주 묻는 질문 확인하기',
                      href: '#',
                      icon: 'ico-faq'
                    }]} />
                    </HelpServiceGroup>
                  </HelpRelatedService>
                </HelpPanelContent>
              </TabPanel>
              <TabPanel value="tutorial">
                <HelpPanelContent srOnlyTitle="따라하기">
                  <HelpContentArea>
                    <HelpTutorialTitle title="이사 전 살던 곳 정보 입력하기" href="#;" />
                    <HelpCoachProcess>
                      <HelpCoachTask title="Task 1: 이사 전에 살던 곳 주소 확인" isCurrent={true} expandText="전체 2단계" steps={['단계1 : 주소조회', '단계2 : 조회 결과 확인']} />
                      <HelpCoachTask title="Task 2: 이사 갈 가족 구성원 선택하기" expandText="전체 1단계" steps={['단계1 : 주소조회']} />
                    </HelpCoachProcess>
                  </HelpContentArea>
                  <HelpPanelAction>
                    <Button size="medium" variant="secondary" className="coach-btn-stop">
                      그만 따라하기
                    </Button>
                  </HelpPanelAction>
                </HelpPanelContent>
              </TabPanel>
            </TabContent>
          </Tab>
          <HelpPanelClose>{args['close.children'] ?? '접어두기'}</HelpPanelClose>
        </HelpPanel>
      </div>;
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
