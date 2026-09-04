# StepIndicator

단계 표시기는 서비스 이용을 위해 사용자가 거쳐야 하는 일련의 단계를 시각화하여 표현한 것으로 진행 상태에 대한 피드백을 사용자에게 전달한다.

## Import

`import { StepIndicator } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `steps` | StepItem[] | 예 | 단계 목록 배열 |
| `currentStep` | number | 아니오 | 현재 활성 단계 인덱스 (0부터 시작, -1은 모든 단계가 대기 상태) |
| `currentStepText` | string | 아니오 | 스크린 리더용 현재 단계 텍스트 |
| `pageTitle` | string | 아니오 | 페이지 타이틀 텍스트 |

## 사용 예시

### Default

```tsx
{
  args: {
    steps: defaultSteps,
    currentStep: 3
  },
  parameters: {
    docs: {
      description: {
        story: '기본 사용 예제입니다. currentStep=3으로 설정되어 4번째 단계가 활성화되고, 이전 단계들은 완료 상태로 표시됩니다.'
      }
    }
  }
}
```

### All Completed

```tsx
{
  args: {
    steps: defaultSteps,
    currentStep: 5
  }
}
```

### All Default

```tsx
{
  args: {
    steps: defaultSteps
  }
}
```

### With Page Title

```tsx
{
  args: {
    steps: applicationSteps,
    currentStep: 2,
    pageTitle: '타이틀'
  },
  parameters: {
    docs: {
      description: {
        story: '페이지 타이틀과 함께 사용되는 예제입니다. 실제 업무에서 사용되는 단계들로 구성되어 있습니다.'
      }
    }
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
