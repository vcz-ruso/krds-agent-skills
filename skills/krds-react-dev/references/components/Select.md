# Select

셀렉트는 사용자에게 여러 개의 옵션 목록을 팝업으로 제공하여 그 중 한 개의 값을 선택할 수 있도록 하는 경우에 사용한다.

## Import

`import { Select } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `value` | string | 아니오 | 선택된 값 |
| `defaultValue` | string | 아니오 | 초기 선택된 값 |
| `onChange` | (value: string) => void | 아니오 | 선택 값이 변경될 때 호출되는 콜백 |
| `options` | SelectOption[] | 예 | 선택 옵션들 |
| `label` | string | 아니오 | 레이블 |
| `hint` | string | 아니오 | 도움말 텍스트 |
| `error` | string | 아니오 | 에러 메시지 |
| `size` | SelectSize | 아니오 | Select의 크기를 결정합니다. |
| `variant` | SelectVariant | 아니오 | Select의 변형을 결정합니다. |

## 타입 값

- SelectSize: small | medium | large
- SelectVariant: default | sorting

## 사용 예시

### Default

```tsx
{
  args: {
    options: sampleOptions,
    label: '레이블',
    hint: '도움말',
    defaultValue: 'option1',
    error: '',
    disabled: false,
    size: undefined,
    variant: undefined
  }
}
```

### List

```tsx
{
  args: {},
  render: _args => <>
      <h3>기본</h3>
      <Select options={sampleOptions} label="레이블" hint="도움말" />
      <Select options={[{
      value: 'selected',
      label: '선택완료 상태'
    }, ...sampleOptions]} label="레이블" hint="도움말" defaultValue="selected" />
      <Select options={sampleOptions} label="레이블" hint="도움말" error="에러 메시지" />
      <Select options={sampleOptions} label="레이블" hint="도움말" disabled />

      <h3>사이즈</h3>
      <Select options={sizeOptions} label="Small 크기" size="small" defaultValue="small" />
      <Select options={sizeOptions} label="Medium 크기" size="medium" defaultValue="medium" />
      <Select options={sizeOptions} label="Large 크기" size="large" defaultValue="large" />

      <h3>상태</h3>
      <Select options={sampleOptions} label="에러 상태" error="에러 메시지" />

      <h3>sorting</h3>
      <div style={{
      display: 'flex',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <Select options={[{
        value: 'option1',
        label: '항목1'
      }, {
        value: 'option2',
        label: '항목2'
      }, {
        value: 'option3',
        label: '항목3'
      }]} variant="sorting" size="small" defaultValue="option3" />
        <Select options={[{
        value: 'option1',
        label: '항목1'
      }, {
        value: 'option2',
        label: '항목2'
      }, {
        value: 'option3',
        label: '항목3'
      }]} variant="sorting" size="medium" defaultValue="option2" />
        <Select options={[{
        value: 'option1',
        label: '항목1'
      }, {
        value: 'option2',
        label: '항목2'
      }, {
        value: 'option3',
        label: '항목3'
      }]} variant="sorting" size="large" defaultValue="option1" />
      </div>
    </>
}
```

### Controlled

```tsx
{
  render: () => <ControlledSelectExample />,
  parameters: {
    docs: {
      source: {
        code: `
const ControlledSelectExample = () => {
  const [selectedValue, setSelectedValue] = useState<string>('option2');
  const [sortingValue, setSortingValue] = useState<string>('option1');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      <h3>기본 제어 컴포넌트 </h3>

      <div>
        <Select
          options={sampleOptions}
          label="제어 Select"
          hint={\`현재 선택된 값: \${selectedValue}\`}
          value={selectedValue}
          onChange={setSelectedValue}
        />
      </div>

      <h3>정렬 제어 컴포넌트 </h3>
      <div>
        <Select
          options={[
            { value: 'option1', label: '최신순' },
            { value: 'option2', label: '인기순' },
            { value: 'option3', label: '이름순' },
          ]}
          variant="sorting"
          size="medium"
          value={sortingValue}
          onChange={setSortingValue}
        />
        <div style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
          정렬 기준:{' '}
          {sortingValue === 'option1' ? '최신순' : sortingValue === 'option2' ? '인기순' : '이름순'}
        </div>
      </div>
    </div>
  );
};
        `
      }
    }
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
