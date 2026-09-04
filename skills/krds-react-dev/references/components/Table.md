# Table

표는 데이터를 하나 이상의 행과 열로 조직화하여 표현하는 형식으로 사용자가 빠르게 많은 양의 정보를 확인하고 비교할 수 있도록 도와준다. 기본적으로 대화형 요소가 아니기 때문에 열 제목에 데이터를 정렬하기 위한 컨트롤 요소가 포함된 상황 외에 행 전체나 데이터 셀이 대화형으로 작동하지 않는다.

## Import

`import { Table } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `scroll` | boolean | 아니오 | 가로 스크롤 활성화 |
| `mobScroll` | boolean | 아니오 | 모바일 스크롤 활성화 |

## 하위 컴포넌트

### TableCaption

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### TableThead

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### TableTbody

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### TableTr

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### TableTh

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### TableTd

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### TableColgroup

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### TableCol

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### TableTFoot

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

## 사용 예시

### Default

```tsx
{
  args: {},
  render: _args => {
    return <Table>
        <Table.Caption>
          000에 대한 표로 제목1,제목2에 대한 내용으로 구성되어 있으며 제목1은
          제목1-1,제목1-2,제목1-3으로 구성되어있다.
        </Table.Caption>
        <Table.Colgroup>
          <Table.Col width="30%" />
          <Table.Col />
        </Table.Colgroup>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">제목1</Table.Th>
            <Table.Th scope="col">제목2</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th scope="row">제목1-1</Table.Th>
            <Table.Td>
              내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이
              들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이
              들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이
              들어갑니다.
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th scope="row">제목1-2</Table.Th>
            <Table.Td>내용이 들어갑니다.</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th scope="row">제목1-3</Table.Th>
            <Table.Td>
              내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다.
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>;
  }
}
```

### Without Caption

```tsx
{
  args: {},
  render: _args => {
    return <Table>
        <Table.Colgroup>
          <Table.Col width="30%" />
          <Table.Col />
        </Table.Colgroup>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">제목1</Table.Th>
            <Table.Th scope="col">제목2</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th scope="row">제목1-1</Table.Th>
            <Table.Td>내용이 들어갑니다.</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th scope="row">제목1-2</Table.Th>
            <Table.Td>내용이 들어갑니다.</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>;
  }
}
```

### Multiple Columns

```tsx
{
  args: {},
  render: _args => {
    return <Table>
        <Table.Caption>다중 컬럼 테이블 예제</Table.Caption>
        <Table.Colgroup>
          <Table.Col width="20%" />
          <Table.Col width="30%" />
          <Table.Col width="25%" />
          <Table.Col width="25%" />
        </Table.Colgroup>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">항목</Table.Th>
            <Table.Th scope="col">설명</Table.Th>
            <Table.Th scope="col">상태</Table.Th>
            <Table.Th scope="col">날짜</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th scope="row">항목1</Table.Th>
            <Table.Td>첫 번째 항목에 대한 설명입니다.</Table.Td>
            <Table.Td>완료</Table.Td>
            <Table.Td>2024-01-01</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th scope="row">항목2</Table.Th>
            <Table.Td>두 번째 항목에 대한 설명입니다.</Table.Td>
            <Table.Td>진행중</Table.Td>
            <Table.Td>2024-01-02</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th scope="row">항목3</Table.Th>
            <Table.Td>세 번째 항목에 대한 설명입니다.</Table.Td>
            <Table.Td>대기</Table.Td>
            <Table.Td>2024-01-03</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>;
  }
}
```

### With Scroll

```tsx
{
  args: {},
  render: _args => {
    return <Table scroll>
        <Table.Caption>스크롤 가능한 테이블</Table.Caption>
        <Table.Colgroup>
          <Table.Col width="15%" />
          <Table.Col width="15%" />
          <Table.Col width="15%" />
          <Table.Col width="15%" />
          <Table.Col width="15%" />
          <Table.Col width="15%" />
          <Table.Col width="10%" />
        </Table.Colgroup>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">항목1</Table.Th>
            <Table.Th scope="col">항목2</Table.Th>
            <Table.Th scope="col">항목3</Table.Th>
            <Table.Th scope="col">항목4</Table.Th>
            <Table.Th scope="col">항목5</Table.Th>
            <Table.Th scope="col">항목6</Table.Th>
            <Table.Th scope="col">액션</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th scope="row">데이터1</Table.Th>
            <Table.Td>긴 내용이 포함된 데이터입니다</Table.Td>
            <Table.Td>긴 내용이 포함된 데이터입니다</Table.Td>
            <Table.Td>긴 내용이 포함된 데이터입니다</Table.Td>
            <Table.Td>긴 내용이 포함된 데이터입니다</Table.Td>
            <Table.Td>긴 내용이 포함된 데이터입니다</Table.Td>
            <Table.Td>보기</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th scope="row">데이터2</Table.Th>
            <Table.Td>긴 내용이 포함된 데이터입니다</Table.Td>
            <Table.Td>긴 내용이 포함된 데이터입니다</Table.Td>
            <Table.Td>긴 내용이 포함된 데이터입니다</Table.Td>
            <Table.Td>긴 내용이 포함된 데이터입니다</Table.Td>
            <Table.Td>긴 내용이 포함된 데이터입니다</Table.Td>
            <Table.Td>보기</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>;
  }
}
```

### Mobile Scroll

```tsx
{
  args: {},
  render: _args => {
    return <Table mobScroll>
        <Table.Caption>모바일 스크롤 테이블</Table.Caption>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">긴제목항목1</Table.Th>
            <Table.Th scope="col">긴제목항목2</Table.Th>
            <Table.Th scope="col">긴제목항목3</Table.Th>
            <Table.Th scope="col">긴제목항목4</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th scope="row">데이터1</Table.Th>
            <Table.Td>줄바꿈되지않는긴내용</Table.Td>
            <Table.Td>줄바꿈되지않는긴내용</Table.Td>
            <Table.Td>줄바꿈되지않는긴내용</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th scope="row">데이터2</Table.Th>
            <Table.Td>줄바꿈되지않는긴내용</Table.Td>
            <Table.Td>줄바꿈되지않는긴내용</Table.Td>
            <Table.Td>줄바꿈되지않는긴내용</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>;
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
