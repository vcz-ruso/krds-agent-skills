# CoachMark

코치마크는 사용자에게 새로 도입된 기능을 안내하거나, 여러 단계를 거쳐 수행해야 하는 복잡한 과업을 사용자가 보다 쉽게 완료할 수 있도록 세부 수행 단계별로 고맥락적 도움말을 제공하는 컴포넌트이다.

## Import

`import { CoachMark } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `title` | string | 아니오 | 코치 마크 제목 |
| `description` | string | 아니오 | 코치 마크 설명 |
| `currentStep` | number | 아니오 | 현재 단계 |
| `totalSteps` | number | 아니오 | 총 단계 수 |
| `onSkip` | () => void | 아니오 | 그만보기 버튼 클릭 핸들러 |
| `onPrevious` | () => void | 아니오 | 이전으로 버튼 클릭 핸들러 |
| `onNext` | () => void | 아니오 | 다음으로 버튼 클릭 핸들러 |
| `children` | ReactNode | 아니오 | 코치 마크 내용 |
| `isVisible` | boolean | 아니오 | 코치 마크 표시 여부 |

## 사용 예시

### Default

```tsx
{
  args: {
    title: '1단계 : 코치 마크',
    description: '1단계 코치 마크 내용입니다.',
    currentStep: 1,
    totalSteps: 4,
    children: <h3>코치 마크 내용</h3>
  },
  decorators: [Story => <div style={{
    width: '100%',
    minHeight: '400px',
    position: 'relative'
  }}>
        <Story />
      </div>]
}
```

### Second Step

```tsx
{
  args: {
    title: '2단계 : 다음 단계',
    description: '2단계 코치 마크 내용입니다. 이제 다음 단계로 진행해보세요.',
    currentStep: 2,
    totalSteps: 4,
    children: <h3>코치 마크 내용</h3>
  }
}
```

### Last Step

```tsx
{
  args: {
    title: '4단계 : 마지막 단계',
    description: '마지막 단계입니다. 모든 과정을 완료했습니다.',
    currentStep: 4,
    totalSteps: 4,
    children: <h3>코치 마크 내용</h3>
  }
}
```

### Hidden

```tsx
{
  args: {
    title: '숨겨진 코치 마크',
    description: '이 코치 마크는 표시되지 않습니다.',
    currentStep: 1,
    totalSteps: 4,
    isVisible: false,
    children: <h3>코치 마크 내용</h3>
  }
}
```

### Long Description

```tsx
{
  args: {
    title: '긴 설명이 있는 코치 마크',
    description: '이것은 매우 긴 설명을 가진 코치 마크입니다. 사용자에게 상세한 가이드를 제공하기 위해 충분한 정보를 포함하고 있습니다. 이 설명은 여러 줄에 걸쳐 표시될 수 있으며, 코치 마크의 크기에 맞게 자동으로 조정됩니다.',
    currentStep: 1,
    totalSteps: 5,
    children: <h3>코치 마크 내용</h3>
  }
}
```

### Interactive

```tsx
{
  args: {},
  render: _args => <InteractiveCoachMark />,
  parameters: {
    docs: {
      source: {
        code: `
const InteractiveCoachMark = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const totalSteps = 4;

  const steps = [
    {
      title: '1단계 : 코치 마크 시작',
      description: '첫 번째 단계입니다. 다음으로 버튼을 클릭하여 진행하세요.',
      content: <h3>첫 번째 단계</h3>,
    },
    {
      title: '2단계 : 이전/다음 버튼',
      description: '두 번째 단계입니다. 이제 이전으로와 다음으로 버튼이 모두 표시됩니다.',
      content: <h3>두 번째 단계</h3>,
    },
    {
      title: '3단계 : 거의 완료',
      description: '세 번째 단계입니다. 마지막 단계가 얼마 남지 않았습니다.',
      content: <h3>세 번째 단계</h3>,
    },
    {
      title: '4단계 : 완료',
      description: '마지막 단계입니다. 모든 과정을 완료했습니다!',
      content: <h3>마지막 단계</h3>,
    },
  ];

  const handleSkip = () => {
    setIsVisible(false);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
    }
  };

  const resetCoachMark = () => {
    setCurrentStep(1);
    setIsVisible(true);
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div style={{ width: '100%', minHeight: '400px', position: 'relative', padding: '300px 20px 20px 20px', backgroundColor: '#f5f5f5' }}>
      {isVisible ? (
        <CoachMark
          title={currentStepData.title}
          description={currentStepData.description}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onSkip={handleSkip}
          onPrevious={handlePrevious}
          onNext={handleNext}
        >
          {currentStepData.content}
        </CoachMark>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>코치 마크가 완료되었습니다.</p>
          <button onClick={resetCoachMark} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            다시 시작
          </button>
        </div>
      )}
    </div>
  );
};
        `
      },
      description: {
        story: '실제로 작동하는 코치 마크입니다. 이전으로, 다음으로, 그만보기 버튼을 클릭하여 동작을 확인해보세요.'
      }
    }
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
