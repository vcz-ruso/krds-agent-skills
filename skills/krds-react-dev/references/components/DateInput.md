# DateInput

날짜 입력 필드는 사용자가 특정 날짜 또는 기간을 입력하거나 선택하는 데 사용되는 요소이다.

## Import

`import { DateInput } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `onChange` | (value: string) => void | 아니오 | 입력 값이 변경될 때 호출되는 콜백 |
| `label` | string | 아니오 | 레이블 |
| `hint` | string | 아니오 | 도움말 텍스트 |
| `error` | string | 아니오 | 에러 메시지 |
| `success` | string | 아니오 | 성공 메시지 |
| `information` | string | 아니오 | 정보 메시지 |
| `size` | 'small' \| 'medium' \| 'large' | 아니오 | 입력 필드 크기 |
| `value` | string | 아니오 | 현재 입력된 값 |
| `defaultValue` | string | 아니오 | 기본 입력값 |
| `isCalendarOpen` | boolean | 아니오 | 달력 열림 상태 |
| `defaultIsCalendarOpen` | boolean | 아니오 | 기본 달력 열림 상태 |
| `onCalendarOpenChange` | (isOpen: boolean) => void | 아니오 | 달력 열림/닫힘 상태 변경 콜백 |
| `calendarPosition` | 'top' \| 'bottom' | 아니오 | 달력 위치 |
| `disabledDates` | string[] | 아니오 | 비활성화할 날짜 배열 |
| `eventDates` | string[] | 아니오 | 이벤트가 있는 날짜 배열 |
| `onYearChange` | (year: number) => void | 아니오 | 년도 변경 콜백 |
| `onMonthChange` | (month: number) => void | 아니오 | 월 변경 콜백 |
| `onTodayClick` | () => void | 아니오 | 오늘 버튼 클릭 콜백 |
| `onConfirm` | () => void | 아니오 | 확인 버튼 클릭 콜백 |
| `onCancel` | () => void | 아니오 | 취소 버튼 클릭 콜백 |
| `openButtonLabel` | string | 아니오 | 달력 열기 버튼 aria-label |
| `prevButtonLabel` | string | 아니오 | 이전 달 버튼 aria-label |
| `nextButtonLabel` | string | 아니오 | 다음 달 버튼 aria-label |
| `yearSelectLabel` | string | 아니오 | 년도 선택 버튼 aria-label |
| `monthSelectLabel` | string | 아니오 | 월 선택 버튼 aria-label |
| `todayButtonText` | string | 아니오 | 오늘 버튼 텍스트 |
| `cancelButtonText` | string | 아니오 | 취소 버튼 텍스트 |
| `confirmButtonText` | string | 아니오 | 확인 버튼 텍스트 |

## 사용 예시

### Default

```tsx
{
  args: {
    label: '레이블'
  },
  parameters: {
    docs: {
      description: {
        story: '기본 DateInput 컴포넌트입니다.'
      }
    }
  }
}
```

### With Hint

```tsx
{
  args: {
    label: '레이블',
    hint: '도움말'
  },
  parameters: {
    docs: {
      description: {
        story: '도움말이 있는 DateInput입니다.'
      }
    }
  }
}
```

### With Default Value

```tsx
{
  args: {
    label: '레이블',
    defaultValue: '2024.12.25'
  },
  parameters: {
    docs: {
      description: {
        story: '기본값이 설정된 DateInput입니다.'
      }
    }
  }
}
```

### Controlled

```tsx
{
  args: {
    label: '레이블',
    value: '2024.12.25',
    isCalendarOpen: false
  },
  render: function ControlledDateInput(args) {
    const [value, setValue] = React.useState(args.value || '');
    const [isOpen, setIsOpen] = React.useState(args.isCalendarOpen || false);
    return <div>
        <DateInput {...args} value={value} isCalendarOpen={isOpen} onChange={setValue} onCalendarOpenChange={setIsOpen} />
        <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
          <strong>입력된 날짜:</strong> {value || '없음'}
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: '제어된 DateInput입니다.'
      }
    }
  }
}
```

### All States

```tsx
{
  args: {},
  render: _args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }}>
      <DateInput label="기본" />
      <DateInput label="도움말" hint="날짜를 선택해주세요." />
      <DateInput label="에러" error="올바른 날짜를 입력해주세요." />
      <DateInput label="성공" success="올바른 날짜입니다." defaultValue="2024.12.25" />
      <DateInput label="정보" information="YYYY.MM.DD 형식으로 입력해주세요." />
      <DateInput label="비활성화" disabled defaultValue="2024.12.25" />
      <DateInput label="읽기 전용" readOnly defaultValue="2024.12.25" />
    </div>
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
