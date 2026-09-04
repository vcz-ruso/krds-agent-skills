# StructuredList

구조화 목록은 유사하거나 관련된 콘텐츠 집합을 표현하기 위한 형식으로 목록에 제공된 데이터에 대한 상세 정보 탐색 수단 또는 관련 기능 실행 수단으로 활용된다. 사용자가 콘텐츠를 효율적으로 탐색하고 다음 행동을 빠르게 결정할 수 있도록 목록 내 정보는 상세 페이지에서 제공되는 복잡한 콘텐츠 중 핵심적이거나 흥미를 끌 수 있는 정보를 논리적 흐름에 따라 조직화하여 명확한 위계 구조를 반영해 제공해야 한다.

## Import

`import { StructuredList } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

## 하위 컴포넌트

### StructuredListItem

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

### StructuredListHeader

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

### StructuredListBadge

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### StructuredListBody

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

### StructuredListContent

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `href` | string | 아니오 | — |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

### StructuredListTitle

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

### StructuredListDescription

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

### StructuredListMeta

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `label` | string | 아니오 | — |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

### StructuredListAction

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `onClick` | () => void | 아니오 | — |
| `href` | string | 아니오 | — |
| `variant` | 'primary' \| 'secondary' \| 'text' | 아니오 | — |
| `title` | string | 아니오 | — |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

### StructuredListFooter

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

### StructuredListTag

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

### StructuredListButtons

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `children` | React.ReactNode | 예 | StructuredListItem 컴포넌트들 |
| `className` | string | 아니오 | 사용자 정의 클래스명 |

## 사용 예시

### Default

```tsx
{
  args: {},
  render: _args => <StructuredList>
      <StructuredListItem>
        <StructuredListHeader>
          <StructuredListBadge color="primary" variant="light">
            뱃지
          </StructuredListBadge>
        </StructuredListHeader>

        <StructuredListBody>
          <StructuredListContent href="#">
            <StructuredListTitle>타이틀 영역</StructuredListTitle>
            <StructuredListDescription>
              간단한 설명이 들어가는 영역입니다. 최대 3줄까지 작성합니다. 간단한 설명이 들어가는
              영역입니다. 간단한 설명이 들어가는 영역입니다.
            </StructuredListDescription>
            <StructuredListMeta label="신청 기간">2023.00.00-2024.00.00</StructuredListMeta>
          </StructuredListContent>

          <StructuredListAction href="#" title="타이틀 영역">
            신청하기
          </StructuredListAction>
        </StructuredListBody>

        <StructuredListFooter>
          <StructuredListTag>태그</StructuredListTag>
          <StructuredListTag>태그</StructuredListTag>
        </StructuredListFooter>

        <StructuredListButtons>
          <Button variant="text" size="medium" title="타이틀 영역">
            <i className="svg-icon ico-share"></i> 공유하기
          </Button>
          <Button variant="text" size="medium" title="타이틀 영역">
            <i className="svg-icon ico-like"></i> 찜하기
          </Button>
        </StructuredListButtons>
      </StructuredListItem>

      <StructuredListItem>
        <StructuredListHeader>
          <StructuredListBadge color="success" variant="light">
            뱃지
          </StructuredListBadge>
        </StructuredListHeader>

        <StructuredListBody>
          <StructuredListContent href="#">
            <StructuredListTitle>타이틀 영역</StructuredListTitle>
            <StructuredListDescription>
              간단한 설명이 들어가는 영역입니다. 최대 3줄까지 작성합니다. 간단한 설명이 들어가는
              영역입니다. 간단한 설명이 들어가는 영역입니다.
            </StructuredListDescription>
            <StructuredListMeta label="신청 기간">2023.00.00-2024.00.00</StructuredListMeta>
          </StructuredListContent>

          <StructuredListAction href="#" title="타이틀 영역">
            신청하기
          </StructuredListAction>
        </StructuredListBody>

        <StructuredListFooter>
          <StructuredListTag>태그</StructuredListTag>
          <StructuredListTag>태그</StructuredListTag>
        </StructuredListFooter>

        <StructuredListButtons>
          <Button variant="text" size="medium" title="타이틀 영역">
            <i className="svg-icon ico-share"></i> 공유하기
          </Button>
          <Button variant="text" size="medium" title="타이틀 영역">
            <i className="svg-icon ico-like"></i> 찜하기
          </Button>
        </StructuredListButtons>
      </StructuredListItem>

      <StructuredListItem>
        <StructuredListHeader>
          <StructuredListBadge color="secondary" variant="filled">
            뱃지
          </StructuredListBadge>
        </StructuredListHeader>

        <StructuredListBody>
          <StructuredListContent href="#">
            <StructuredListTitle>타이틀 영역</StructuredListTitle>
            <StructuredListDescription>
              간단한 설명이 들어가는 영역입니다. 최대 3줄까지 작성합니다. 간단한 설명이 들어가는
              영역입니다. 간단한 설명이 들어가는 영역입니다.
            </StructuredListDescription>
            <StructuredListMeta label="신청 기간">2023.00.00-2024.00.00</StructuredListMeta>
          </StructuredListContent>

          <StructuredListAction href="#" title="타이틀 영역">
            신청하기
          </StructuredListAction>
        </StructuredListBody>

        <StructuredListFooter>
          <StructuredListTag>태그</StructuredListTag>
          <StructuredListTag>태그</StructuredListTag>
        </StructuredListFooter>

        <StructuredListButtons>
          <Button variant="text" size="medium" title="타이틀 영역">
            <i className="svg-icon ico-share"></i> 공유하기
          </Button>
          <Button variant="text" size="medium" title="타이틀 영역">
            <i className="svg-icon ico-like"></i> 찜하기
          </Button>
        </StructuredListButtons>
      </StructuredListItem>
    </StructuredList>
}
```

### Minimal Data

```tsx
{
  args: {},
  render: _args => <StructuredList>
      <StructuredListItem>
        <StructuredListBody>
          <StructuredListContent>
            <StructuredListTitle>제목만 있는 아이템</StructuredListTitle>
          </StructuredListContent>
        </StructuredListBody>
      </StructuredListItem>

      <StructuredListItem>
        <StructuredListBody>
          <StructuredListContent>
            <StructuredListTitle>제목과 설명이 있는 아이템</StructuredListTitle>
            <StructuredListDescription>간단한 설명입니다.</StructuredListDescription>
          </StructuredListContent>
        </StructuredListBody>
      </StructuredListItem>

      <StructuredListItem>
        <StructuredListBody>
          <StructuredListContent>
            <StructuredListTitle>모든 요소가 있는 아이템</StructuredListTitle>
            <StructuredListDescription>
              설명과 태그, 버튼까지 모든 요소가 포함된 아이템입니다.
            </StructuredListDescription>
          </StructuredListContent>

          <StructuredListAction onClick={() => console.log('버튼 클릭')} title="모든 요소가 있는 아이템">
            버튼
          </StructuredListAction>
        </StructuredListBody>

        <StructuredListFooter>
          <StructuredListTag>태그1</StructuredListTag>
          <StructuredListTag>태그2</StructuredListTag>
        </StructuredListFooter>
      </StructuredListItem>
    </StructuredList>
}
```

### Various Badges

```tsx
{
  args: {},
  render: _args => <StructuredList>
      <StructuredListItem>
        <StructuredListHeader>
          <StructuredListBadge color="primary" variant="filled">
            Primary
          </StructuredListBadge>
        </StructuredListHeader>
        <StructuredListBody>
          <StructuredListContent>
            <StructuredListTitle>Primary 뱃지</StructuredListTitle>
            <StructuredListDescription>
              파란색 뱃지가 적용된 아이템입니다.
            </StructuredListDescription>
          </StructuredListContent>
        </StructuredListBody>
      </StructuredListItem>

      <StructuredListItem>
        <StructuredListHeader>
          <StructuredListBadge color="success" variant="filled">
            Success
          </StructuredListBadge>
        </StructuredListHeader>
        <StructuredListBody>
          <StructuredListContent>
            <StructuredListTitle>Success 뱃지</StructuredListTitle>
            <StructuredListDescription>녹색 뱃지가 적용된 아이템입니다.</StructuredListDescription>
          </StructuredListContent>
        </StructuredListBody>
      </StructuredListItem>

      <StructuredListItem>
        <StructuredListHeader>
          <StructuredListBadge color="secondary" variant="filled">
            Secondary
          </StructuredListBadge>
        </StructuredListHeader>
        <StructuredListBody>
          <StructuredListContent>
            <StructuredListTitle>Secondary 뱃지</StructuredListTitle>
            <StructuredListDescription>회색 뱃지가 적용된 아이템입니다.</StructuredListDescription>
          </StructuredListContent>
        </StructuredListBody>
      </StructuredListItem>
    </StructuredList>
}
```

### Long Text

```tsx
{
  args: {},
  render: _args => <StructuredList>
      <StructuredListItem>
        <StructuredListHeader>
          <StructuredListBadge color="primary" variant="filled">
            긴 뱃지 텍스트
          </StructuredListBadge>
        </StructuredListHeader>

        <StructuredListBody>
          <StructuredListContent>
            <StructuredListTitle>
              매우 긴 제목을 가진 아이템으로 텍스트 오버플로우 처리를 확인하기 위한 테스트
              아이템입니다
            </StructuredListTitle>
            <StructuredListDescription>
              매우 긴 설명 텍스트입니다. 이 텍스트는 3줄을 넘어가는 내용으로 구성되어 있어서 텍스트
              오버플로우가 어떻게 처리되는지 확인할 수 있습니다. 추가로 더 많은 텍스트를 넣어서
              확실히 3줄을 넘어가도록 하겠습니다. 이렇게 해서 말줄임표가 제대로 적용되는지
              테스트합니다.
            </StructuredListDescription>
            <StructuredListMeta label="매우 긴 날짜 레이블">
              2023.01.01 ~ 2024.12.31 (기간이 매우 깁니다)
            </StructuredListMeta>
          </StructuredListContent>

          <StructuredListAction onClick={() => console.log('클릭')} title="매우 긴 제목을 가진 아이템으로 텍스트 오버플로우 처리를 확인하기 위한 테스트 아이템입니다">
            매우 긴 버튼 텍스트
          </StructuredListAction>
        </StructuredListBody>

        <StructuredListFooter>
          <StructuredListTag>매우긴태그이름</StructuredListTag>
          <StructuredListTag>또다른긴태그</StructuredListTag>
          <StructuredListTag>태그3</StructuredListTag>
          <StructuredListTag>태그4</StructuredListTag>
          <StructuredListTag>태그5</StructuredListTag>
        </StructuredListFooter>
      </StructuredListItem>
    </StructuredList>
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
