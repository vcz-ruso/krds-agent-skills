# Calendar

달력은 날짜와 관련된 정보와 기능을 제공하는 데 사용한다.

## Import

`import { Calendar } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `mode` | CalendarMode | 아니오 | 달력 모드 |
| `position` | CalendarPosition | 아니오 | 달력 위치 |
| `value` | string | 아니오 | 현재 선택된 날짜 (단일 선택) |
| `defaultValue` | string | 아니오 | 기본 선택된 날짜 (단일 선택) |
| `startDate` | string | 아니오 | 범위 선택 시작 날짜 |
| `endDate` | string | 아니오 | 범위 선택 종료 날짜 |
| `defaultStartDate` | string | 아니오 | 기본 범위 선택 시작 날짜 |
| `defaultEndDate` | string | 아니오 | 기본 범위 선택 종료 날짜 |
| `disabledDates` | string[] | 아니오 | 비활성화할 날짜 배열 |
| `eventDates` | string[] | 아니오 | 이벤트가 있는 날짜 배열 |
| `isOpen` | boolean | 아니오 | 달력 열림 상태 |
| `defaultIsOpen` | boolean | 아니오 | 기본 달력 열림 상태 |
| `onOpenChange` | (isOpen: boolean) => void | 아니오 | 달력 열림/닫힘 상태 변경 콜백 |
| `onChange` | (value: string) => void | 아니오 | 날짜 선택 변경 콜백 |
| `onRangeChange` | (startDate: string, endDate: string) => void | 아니오 | 범위 선택 변경 콜백 |
| `onYearChange` | (year: number) => void | 아니오 | 년도 변경 콜백 |
| `onMonthChange` | (month: number) => void | 아니오 | 월 변경 콜백 |
| `onTodayClick` | () => void | 아니오 | 오늘 버튼 클릭 콜백 |
| `onConfirm` | () => void | 아니오 | 확인 버튼 클릭 콜백 |
| `onCancel` | () => void | 아니오 | 취소 버튼 클릭 콜백 |
| `label` | string | 아니오 | 입력 필드 레이블 |
| `inputId` | string | 아니오 | 입력 필드 ID |
| `placeholder` | string | 아니오 | 입력 필드 placeholder (단일 선택) |
| `startPlaceholder` | string | 아니오 | 시작 날짜 placeholder |
| `endPlaceholder` | string | 아니오 | 종료 날짜 placeholder |
| `startTitle` | string | 아니오 | 시작 날짜 입력 필드 title |
| `endTitle` | string | 아니오 | 종료 날짜 입력 필드 title |
| `openButtonLabel` | string | 아니오 | 달력 열기 버튼 aria-label |
| `prevButtonLabel` | string | 아니오 | 이전 달 버튼 aria-label |
| `nextButtonLabel` | string | 아니오 | 다음 달 버튼 aria-label |
| `yearSelectLabel` | string | 아니오 | 년도 선택 버튼 aria-label |
| `monthSelectLabel` | string | 아니오 | 월 선택 버튼 aria-label |
| `todayButtonText` | string | 아니오 | 오늘 버튼 텍스트 |
| `cancelButtonText` | string | 아니오 | 취소 버튼 텍스트 |
| `confirmButtonText` | string | 아니오 | 확인 버튼 텍스트 |
| `disabled` | boolean | 아니오 | 비활성화 여부 |
| `readOnly` | boolean | 아니오 | 읽기 전용 여부 |

## 타입 값

- CalendarMode: single | range
- CalendarPosition: top | bottom

## 하위 컴포넌트

### CalendarInput

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `mode` | CalendarMode | 아니오 | 달력 모드 |
| `onChange` | (value: string) => void | 아니오 | 날짜 선택 변경 콜백 |

### CalendarButton

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `variant` | 'icon' \| 'move' \| 'switch' \| 'date' \| 'action' | 아니오 | 버튼 variant |
| `isActive` | boolean | 아니오 | 활성 상태 |
| `isSelected` | boolean | 아니오 | 선택 상태 |

### CalendarDropdown

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `isOpen` | boolean | 아니오 | 달력 열림 상태 |
| `items` | CalendarYearMonth[] | 아니오 | 드롭다운 항목들 |
| `onItemSelect` | (item: CalendarYearMonth) => void | 아니오 | 항목 선택 콜백 |
| `onToggle` | () => void | 아니오 | 드롭다운 토글 콜백 |

### CalendarTable

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `dates` | CalendarDate[] | 아니오 | 달력 데이터 |
| `mode` | CalendarMode | 아니오 | 달력 모드 |
| `currentYear` | number | 아니오 | 현재 년도 |
| `currentMonth` | number | 아니오 | 현재 월 |
| `onDateClick` | (date: CalendarDate) => void | 아니오 | 날짜 클릭 콜백 |

## 사용 예시

### Default

```tsx
{
  args: {
    mode: 'single'
  },
  parameters: {
    docs: {
      description: {
        story: '기본 달력 컴포넌트입니다.'
      }
    }
  }
}
```

### Single

```tsx
{
  args: {
    mode: 'single',
    label: '기간선택',
    placeholder: 'YYYY.MM.DD'
  },
  parameters: {
    docs: {
      description: {
        story: '단일 날짜 선택 모드입니다.'
      }
    }
  }
}
```

### Range

```tsx
{
  args: {
    mode: 'range',
    label: '날짜선택',
    startPlaceholder: '시작날짜',
    endPlaceholder: '종료날짜'
  },
  parameters: {
    docs: {
      description: {
        story: '범위 선택 모드입니다.'
      }
    }
  }
}
```

### Top Position

```tsx
{
  args: {
    mode: 'single',
    position: 'top',
    label: '기간선택'
  },
  parameters: {
    docs: {
      description: {
        story: '달력이 위쪽에 표시되는 경우입니다.'
      }
    }
  }
}
```

### Bottom Position

```tsx
{
  args: {
    mode: 'single',
    position: 'bottom',
    label: '기간선택'
  },
  parameters: {
    docs: {
      description: {
        story: '달력이 아래쪽에 표시되는 경우입니다.'
      }
    }
  }
}
```

### With Default Value

```tsx
{
  args: {
    mode: 'single',
    defaultValue: '2024.12.07',
    label: '기간선택'
  },
  parameters: {
    docs: {
      description: {
        story: '기본값이 설정된 달력입니다.'
      }
    }
  }
}
```

### With Default Range

```tsx
{
  args: {
    mode: 'range',
    defaultStartDate: '2024.12.07',
    defaultEndDate: '2024.12.16',
    label: '날짜선택'
  },
  parameters: {
    docs: {
      description: {
        story: '기본값이 설정된 범위 선택 달력입니다.'
      }
    }
  }
}
```

### With Disabled Dates

```tsx
{
  args: {
    mode: 'single',
    label: '기간선택',
    defaultValue: '2024.12.07',
    disabledDates: ['2024.12.13', '2024.12.25', '2024.12.31']
  },
  parameters: {
    docs: {
      description: {
        story: '특정 날짜들이 비활성화된 달력입니다.'
      }
    }
  }
}
```

### With Event Dates

```tsx
{
  args: {
    mode: 'single',
    label: '기간선택',
    defaultValue: '2024.12.07',
    eventDates: ['2024.12.08', '2024.12.15', '2024.12.22']
  },
  parameters: {
    docs: {
      description: {
        story: '이벤트 날짜가 표시된 달력입니다.'
      }
    }
  }
}
```

### Open State

```tsx
{
  args: {
    mode: 'single',
    defaultIsOpen: true,
    label: '기간선택'
  },
  parameters: {
    docs: {
      description: {
        story: '달력이 열린 상태로 표시됩니다.'
      }
    }
  }
}
```

### Disabled

```tsx
{
  args: {
    mode: 'single',
    disabled: true,
    label: '기간선택',
    defaultValue: '2024.12.07'
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 달력입니다.'
      }
    }
  }
}
```

### Read Only

```tsx
{
  args: {
    mode: 'single',
    readOnly: true,
    label: '기간선택',
    defaultValue: '2024.12.07'
  },
  parameters: {
    docs: {
      description: {
        story: '읽기 전용 달력입니다.'
      }
    }
  }
}
```

### Custom Button Text

```tsx
{
  args: {
    mode: 'single',
    todayButtonText: 'Today',
    cancelButtonText: 'Cancel',
    confirmButtonText: 'OK',
    label: 'Select Date'
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 텍스트를 사용하는 달력입니다.'
      }
    }
  }
}
```

### Controlled

```tsx
{
  args: {
    mode: 'single',
    value: '2024.12.07',
    isOpen: false,
    label: '기간선택'
  },
  render: function ControlledCalendar(args) {
    const [value, setValue] = React.useState(args.value || '');
    const [isOpen, setIsOpen] = React.useState(args.isOpen || false);
    return <div>
        <Calendar {...args} value={value} isOpen={isOpen} onChange={setValue} onOpenChange={setIsOpen} />
        <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
          <strong>선택된 날짜:</strong> {value || '없음'}
        </div>
      </div>;
  }
}
```

### Controlled Range

```tsx
{
  args: {
    mode: 'range',
    startDate: '2024.12.07',
    endDate: '2024.12.16',
    isOpen: false,
    label: '날짜선택'
  },
  render: function ControlledRangeCalendar(args) {
    const [startDate, setStartDate] = React.useState(args.startDate || '');
    const [endDate, setEndDate] = React.useState(args.endDate || '');
    const [isOpen, setIsOpen] = React.useState(args.isOpen || false);
    const handleRangeChange = (start: string, end: string) => {
      setStartDate(start);
      setEndDate(end);
    };
    return <div>
        <Calendar {...args} startDate={startDate} endDate={endDate} isOpen={isOpen} onRangeChange={handleRangeChange} onOpenChange={setIsOpen} />
        <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
          <strong>선택된 기간:</strong>{' '}
          {startDate && endDate ? `${startDate} ~ ${endDate}` : '없음'}
        </div>
      </div>;
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
