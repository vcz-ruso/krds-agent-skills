# TutorialPanel

따라하기 패널은 본문 콘텐츠와 관련된 이용 방법을 실제 이용 절차에 따라 단계적으로 수행할 수 있도록 도와주며 코치마크를 실행하는 데 사용되는 사이드 패널이다.

## Import

`import { TutorialPanel } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `isOpen` | boolean | 아니오 | 패널 열림/닫힘 상태 |
| `onOpenChange` | (isOpen: boolean) => void | 아니오 | 패널 열림/닫힘 상태 변경 핸들러 |
| `activeTab` | 'help' \| 'tutorial' | 아니오 | 활성 탭 (controlled에서만 사용) |
| `defaultActiveTab` | 'help' \| 'tutorial' | 아니오 | — |
| `onTabChange` | (tab: 'help' \| 'tutorial') => void | 아니오 | 탭 변경 핸들러 (controlled에서만 사용) |
| `children` | ReactNode | 예 | — |

## 하위 컴포넌트

### TutorialPanelTrigger

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 아니오 | — |

### TutorialPanelContainer

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 예 | — |

### TutorialPanelTabContent

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `value` | 'help' \| 'tutorial' | 예 | — |
| `children` | ReactNode | 예 | — |

### TutorialPanelHelpContent

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `helpContent` | HelpContent | 아니오 | — |
| `relatedServices` | HelpContent[] | 아니오 | — |

### TutorialPanelTutorialContent

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `title` | string | 아니오 | — |
| `steps` | TutorialStep[] | 아니오 | — |
| `onTutorialStop` | () => void | 아니오 | — |
| `stopButtonText` | string | 아니오 | — |

### TutorialPanelClose

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | ReactNode | 아니오 | — |

## 사용 예시

### Default

```tsx
{
  args: {},
  render: _args => <div style={{
    minHeight: '100vh',
    padding: '2rem'
  }}>
      <TutorialPanel.Root defaultActiveTab="tutorial">
        <TutorialPanel.Trigger>도움말</TutorialPanel.Trigger>

        <TutorialPanel.Container>
          <TutorialPanel.Tabs>
            <TutorialPanel.TabPanel value="help">
              <TutorialPanel.HelpContent helpContent={sampleHelpContent} relatedServices={sampleRelatedServices} />
            </TutorialPanel.TabPanel>

            <TutorialPanel.TabPanel value="tutorial">
              <TutorialPanel.TutorialContent title="이사 전 살던 곳 정보 입력하기" steps={sampleTutorialSteps} onTutorialStop={() => console.log('튜토리얼 종료')} stopButtonText="그만 따라하기" />
            </TutorialPanel.TabPanel>
          </TutorialPanel.Tabs>

          <TutorialPanel.Close />
        </TutorialPanel.Container>
      </TutorialPanel.Root>
    </div>
}
```

### Controlled

```tsx
{
  args: {},
  render: _args => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'help' | 'tutorial'>('tutorial');
    return <div style={{
      minHeight: '100vh',
      padding: '2rem'
    }}>
        <TutorialPanel.Root isOpen={isOpen} onOpenChange={setIsOpen} activeTab={activeTab} onTabChange={setActiveTab}>
          <TutorialPanel.Trigger>도움말</TutorialPanel.Trigger>

          <TutorialPanel.Container>
            <TutorialPanel.Tabs>
              <TutorialPanel.TabPanel value="help">
                <TutorialPanel.HelpContent helpContent={sampleHelpContent} relatedServices={sampleRelatedServices} />
              </TutorialPanel.TabPanel>

              <TutorialPanel.TabPanel value="tutorial">
                <TutorialPanel.TutorialContent title="이사 전 살던 곳 정보 입력하기" steps={sampleTutorialSteps} onTutorialStop={() => {
                console.log('튜토리얼 종료');
                setIsOpen(false);
              }} stopButtonText="그만 따라하기" />
              </TutorialPanel.TabPanel>
            </TutorialPanel.Tabs>

            <TutorialPanel.Close />
          </TutorialPanel.Container>
        </TutorialPanel.Root>
      </div>;
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
