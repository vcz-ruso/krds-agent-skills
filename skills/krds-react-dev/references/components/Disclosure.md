# Disclosure

디스클로저는 특정한 정보/컨트롤/섹션에 관련된 부가적인 정보를 표시하거나 숨기는 데 사용되는 요소이다. 디스클로저 하위 콘텐츠 섹션은 기본으로 축소된 상태로 제공되며 사용자가 요청하는 경우에 확장되어 자세한 정보가 표시된다. 이는 사용자의 인지적 부담을 감소시키고 정보를 빠르게 훑어보는 데 도움이 된다.

## Import

`import { Disclosure } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `buttonText` | string | 예 | 토글 버튼에 표시될 텍스트 |
| `children` | ReactNode | 예 | 확장 가능한 콘텐츠 |
| `defaultExpanded` | boolean | 아니오 | 초기 확장 상태 (비제어 모드) |
| `expanded` | boolean | 아니오 | 확장 상태 (제어 모드) |
| `onToggle` | (expanded: boolean) => void | 아니오 | 확장 상태가 변경될 때 호출되는 콜백 |
| `className` | string | 아니오 | 커스텀 클래스명 |

## 사용 예시

### Default

```tsx
{
  args: {
    buttonText: '신청 서비스안내',
    children: <TextList type="dash">
        <TextListItem>
          하나의 아이디로 안전하고 편리하게 여러 전자정부 서비스를 이용할 수 있는 서비스입니다.
        </TextListItem>
        <TextListItem>디지털원패스 이용문의 : 1533-3713 (평일9~18시, 공휴일제외)</TextListItem>
      </TextList>
  }
}
```

### Default Expanded

```tsx
{
  args: {
    buttonText: '서비스 상세 정보',
    defaultExpanded: true,
    children: <div>
        <h4>서비스 이용 안내</h4>
        <p>본 서비스는 정부24를 통해 제공되는 전자정부 서비스입니다.</p>
        <ul>
          <li>이용 시간: 24시간 연중무휴</li>
          <li>문의 전화: 1588-2188</li>
          <li>홈페이지: www.gov.kr</li>
        </ul>
      </div>
  }
}
```

### Controlled Example

```tsx
{
  args: {},
  render: _args => <ControlledDisclosureExample />
}
```

### Multiple Disclosures

```tsx
{
  args: {},
  render: _args => <div>
      <Disclosure buttonText="첫 번째 디스클로저">
        <div>
          <h4>첫 번째 콘텐츠</h4>
          <p>여러 개의 디스클로저를 함께 사용할 수 있습니다.</p>
        </div>
      </Disclosure>

      <Disclosure buttonText="두 번째 디스클로저" defaultExpanded>
        <div>
          <h4>두 번째 콘텐츠</h4>
          <p>이 디스클로저는 기본적으로 확장된 상태입니다.</p>
        </div>
      </Disclosure>

      <Disclosure buttonText="세 번째 디스클로저">
        <div>
          <h4>세 번째 콘텐츠</h4>
          <p>각각 독립적으로 동작합니다.</p>
        </div>
      </Disclosure>
    </div>
}
```

### With Rich Content

```tsx
{
  args: {
    buttonText: '상세 정보 보기',
    children: <div>
        <h3>서비스 이용 절차</h3>
        <ol>
          <li>회원가입 및 로그인</li>
          <li>서비스 선택</li>
          <li>필요 정보 입력</li>
          <li>신청 완료</li>
        </ol>

        <h3>필요 서류</h3>
        <ul>
          <li>신분증 사본</li>
          <li>증명사진 1매</li>
          <li>기타 관련 서류</li>
        </ul>

        <p>
          <strong>주의사항:</strong> 모든 서류는 최근 3개월 이내 발급된 것이어야 합니다.
        </p>
      </div>
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
