# LanguageSwitcher

언어 변경은 서비스의 콘텐츠를 표시할 언어를 변경하거나 별도의 외국어 서비스로 이동하는 데 사용되는 요소이다. 한국어가 익숙하지 않은 사용자가 콘텐츠 표시 언어를 변경할 수 있는 수단을 발견하지 못한다면 서비스를 이용할 수 없게 되므로, 디지털 정부서비스로 직관적이고 일관된 방식으로 언어 변경을 제공하는 것이 매우 중요하다.

## Import

`import { LanguageSwitcher } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `value` | string | 아니오 | — |
| `defaultValue` | string | 아니오 | — |
| `onChange` | (value: string, option: LanguageOption) => void | 아니오 | — |
| `options` | LanguageOption[] | 아니오 | — |
| `className` | string | 아니오 | — |
| `open` | boolean | 아니오 | — |
| `defaultOpen` | boolean | 아니오 | — |
| `onOpenChange` | (open: boolean) => void | 아니오 | — |
| `closeOnClickOutside` | boolean | 아니오 | — |

## 하위 컴포넌트

### LanguageSwitcherTrigger

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `label` | string | 아니오 | — |

### LanguageSwitcherMenu

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### LanguageSwitcherCurrent

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `label` | string | 아니오 | — |

### LanguageSwitcherOptionList

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |

### LanguageSwitcherOptionItem

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `value` | string | 예 | — |
| `label` | string | 예 | — |
| `href` | string | 아니오 | — |
| `external` | boolean | 아니오 | — |

## 사용 예시

### Default

```tsx
{
  args: {},
  render: function DefaultStory() {
    return <LanguageSwitcher defaultValue="ko" options={[{
      value: 'ko',
      label: '한국어'
    }, {
      value: 'en',
      label: 'English'
    }]} onChange={val => console.log(val)}>
        <LanguageSwitcher.Trigger label="언어 변경" />
        <LanguageSwitcher.Menu>
          <LanguageSwitcher.Current label="현재 언어" />
          <LanguageSwitcher.OptionList />
        </LanguageSwitcher.Menu>
      </LanguageSwitcher>;
  },
  parameters: {
    docs: {
      description: {
        story: '기본형 입니다'
      }
    },
    source: {
      code: `
<LanguageSwitcher
  options={[
    { value: 'ko', label: '한국어' },
    { value: 'en', label: 'English' },
  ]}
  onChange={val => console.log(val)}
>
  <LanguageSwitcher.Trigger label="언어 변경" />
  <LanguageSwitcher.Menu>
    <LanguageSwitcher.Current label="현재 언어" />
    <LanguageSwitcher.OptionList />
  </LanguageSwitcher.Menu>
</LanguageSwitcher>
  `
    }
  }
}
```

### Simple

```tsx
{
  args: {},
  render: function SimpleStory() {
    return <LanguageSwitcher defaultValue="ko" options={defaultLanguages} onChange={val => console.log(val)}>
        <LanguageSwitcher.Trigger label="언어 변경" />
        <LanguageSwitcher.Menu>
          <LanguageSwitcher.OptionList />
        </LanguageSwitcher.Menu>
      </LanguageSwitcher>;
  },
  parameters: {
    docs: {
      description: {
        story: '기본형에서 현재 언어 표시가 제외된 컴포넌트 입니다'
      }
    },
    source: {
      code: `
<LanguageSwitcher
  defaultValue="ko"
  options={defaultLanguages}
  onChange={val => console.log(val)}
>
  <LanguageSwitcher.Trigger label="언어 변경" />
  <LanguageSwitcher.Menu>
    <LanguageSwitcher.OptionList />
  </LanguageSwitcher.Menu>
</LanguageSwitcher>
      `
    }
  }
}
```

### Controlled

```tsx
{
  args: {},
  render: function ControlledStory() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('ko');
    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
    };
    const handleLanguageSelect = (value: string, language: LanguageOption) => {
      setSelectedLanguage(value);
      console.log('Selected language:', language);
    };
    const currentLabel = {
      ko: '현재 언어',
      en: 'Current Language',
      zh: '当前语言',
      ja: '現在の言語',
      fr: 'Langue actuelle'
    }[selectedLanguage] || '현재 언어';
    return <LanguageSwitcher value={selectedLanguage} options={defaultLanguages} open={isOpen} onOpenChange={handleOpenChange} onChange={handleLanguageSelect}>
        <LanguageSwitcher.Trigger label="언어 변경" />
        <LanguageSwitcher.Menu>
          <LanguageSwitcher.Current label={currentLabel} />
          <LanguageSwitcher.OptionList />
        </LanguageSwitcher.Menu>
      </LanguageSwitcher>;
  },
  parameters: {
    docs: {
      description: {
        story: '제어형 컴포넌트 예시입니다'
      },
      source: {
        code: `
const defaultLanguages: LanguageOption[] = [
  { value: 'ko', label: '한국어', href: '#' },
  { value: 'en', label: 'English (영어)', href: '#', external: true },
  { value: 'zh', label: '中文 (중국어)', href: '#', external: true },
  { value: 'ja', label: '日本語 (일본어)', href: '#', external: true },
  { value: 'fr', label: 'français (프랑스어)', href: '#', external: true },
];

function ControlledStory() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleLanguageSelect = (value: string, language: LanguageOption) => {
    setSelectedLanguage(value);
    console.log('Selected language:', language);
  };

  const currentLabel =
    {
      ko: '현재 언어',
      en: 'Current Language',
      zh: '当前语言',
      ja: '現在の言語',
      fr: 'Langue actuelle',
    }[selectedLanguage] || '현재 언어';

  return (
    <LanguageSwitcher
      value={selectedLanguage}
      options={defaultLanguages}
      open={isOpen}
      onOpenChange={handleOpenChange}
      onChange={handleLanguageSelect}
    >
      <LanguageSwitcher.Trigger label="언어 변경" />
      <LanguageSwitcher.Menu>
        <LanguageSwitcher.Current label={currentLabel} />
        <LanguageSwitcher.OptionList />
      </LanguageSwitcher.Menu>
    </LanguageSwitcher>
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
