# Pagination

페이지네이션은 많은 양의 콘텐츠를 탐색하기 쉽도록 여러 화면에 나누고, 분할된 화면을 탐색하는 데 사용되는 요소이다.

## Import

`import { Pagination } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `totalPages` | number | 예 | 전체 페이지 수 |
| `currentPage` | number | 아니오 | 현재 페이지 (제어) |
| `defaultPage` | number | 아니오 | 초기 페이지 (비제어) |
| `onChange` | (page: number) => void | 아니오 | 페이지 변경 핸들러 |
| `prevLabel` | string | 아니오 | 이전 버튼 레이블 |
| `nextLabel` | string | 아니오 | 다음 버튼 레이블 |
| `boundaryCount` | 0 \| 1 \| 2 \| 3 | 아니오 | 경계 페이지 노출 수 |
| `siblingCount` | 0 \| 1 \| 2 \| 3 | 아니오 | 현재 주변 노출 수 |
| `disabled` | boolean | 아니오 | 비활성화 |
| `className` | string | 아니오 | 커스텀 클래스명 |

## 사용 예시

### Default

```tsx
{
  args: {
    totalPages: 10,
    defaultPage: 4
  },
  parameters: {
    docs: {
      source: {
        code: `
import { Pagination } from '@/components';

function DefaultPagination() {
  return (
    <Pagination 
      totalPages={10}
      defaultPage={4} 
    />
  );
}
        `
      }
    }
  }
}
```

### With Many Pages

```tsx
{
  args: {
    totalPages: 99,
    defaultPage: 4
  },
  parameters: {
    docs: {
      source: {
        code: `
import { Pagination } from '@/components';

function ManyPagesPagination() {
  return (
    <Pagination 
      totalPages={99}
      defaultPage={4} 
    />
  );
}
        `
      }
    }
  }
}
```

### Controlled

```tsx
{
  render: args => <ControlledTemplate {...args} />,
  parameters: {
    docs: {
      source: {
        code: `
import React, { useState } from 'react';
import { Pagination } from '@/components';

function ControlledPagination() {
  const [page, setPage] = useState(4);
  
  return (
    <Pagination 
      totalPages={20}
      currentPage={page} 
      onChange={(p) => setPage(p)} 
    />
  );
}
        `
      }
    }
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
