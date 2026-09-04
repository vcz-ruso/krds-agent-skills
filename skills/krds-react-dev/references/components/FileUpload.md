# FileUpload

파일 업로드는 하나 이상의 디바이스의 로컬 파일을 선택하고 첨부하는 데 사용하는 입력 컴포넌트이다.

## Import

`import { FileUpload } from 'krds-react'`

## Props

| Prop | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `title` | string | 아니오 | 파일 업로드 제목 |
| `description` | string | 아니오 | 파일 업로드 설명 |
| `uploadText` | string | 아니오 | 업로드 영역 텍스트 |
| `maxFiles` | number | 아니오 | 최대 파일 개수 |
| `maxFileSize` | number | 아니오 | 최대 파일 크기 (bytes) |
| `acceptedFileTypes` | string[] | 아니오 | 허용된 파일 타입 |
| `files` | FileItem[] | 아니오 | — |
| `onFilesChange` | (files: FileItem[]) => void | 아니오 | — |
| `onFileUpload` | (file: File) => Promise<void> | 아니오 | — |
| `onFileDelete` | (fileId: string) => void | 아니오 | — |
| `onAllFilesDelete` | () => void | 아니오 | — |
| `disabled` | boolean | 아니오 | 비활성화 여부 |
| `allowDelete` | boolean | 아니오 | 파일 삭제 허용 여부 |
| `className` | string | 아니오 | — |
| `children` | ReactNode | 아니오 | — |

## 타입 값

- FileUploadSize: small | medium | large

## 사용 예시

### Default

```tsx
{
  args: {
    title: '타이틀영역',
    description: '컨텐츠 영역',
    uploadText: '첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 눌러 파일을 직접 선택해주세요.',
    maxFiles: 10,
    maxFileSize: 20 * 1024 * 1024,
    acceptedFileTypes: ['pdf', 'doc', 'docx', 'hwp', 'jpg', 'png']
  }
}
```

### With Files

```tsx
{
  args: {
    title: '타이틀영역',
    description: '컨텐츠 영역',
    files: [{
      id: '1',
      name: '위임장(주민등록법 시행령 별지 제15호의2호서식)',
      size: 17 * 1024,
      type: 'hwp',
      status: 'uploading'
    }, {
      id: '2',
      name: '위임장(주민등록법 시행령 별지 제15호의2호서식)',
      size: 17 * 1024,
      type: 'hwp',
      status: 'completed'
    }, {
      id: '3',
      name: '위임장(주민등록법 시행령 별지 제15호의2호서식)',
      size: 17 * 1024,
      type: 'hwp',
      status: 'ready'
    }, {
      id: '4',
      name: '전입재등록신고서 [주민등록법 시행령 : 별지서식 15, 15호의2]',
      size: 17 * 1024,
      type: 'hwp',
      status: 'error',
      errorMessage: '등록 가능한 파일 용량을 초과하였습니다.\n20MB 미만의 파일만 등록할 수 있습니다.'
    }, {
      id: '5',
      name: '위임장(주민등록법 시행령 별지 제15호의2호서식)',
      size: 17 * 1024,
      type: 'hwp',
      status: 'ready',
      onDownload: () => alert('다운로드 기능'),
      onPreview: () => alert('바로보기 기능')
    }, {
      id: '6',
      name: '업로드 완료된 파일.pdf',
      size: 25 * 1024,
      type: 'pdf',
      status: 'completed'
    }]
  }
}
```

### Disabled

```tsx
{
  args: {
    title: '파일 업로드',
    description: '비활성화된 파일 업로드',
    disabled: true
  }
}
```

### No Delete

```tsx
{
  args: {
    title: '삭제 불가능한 파일 업로드',
    description: '파일 삭제가 허용되지 않습니다.',
    allowDelete: false,
    files: [{
      id: '1',
      name: '중요한 문서.pdf',
      size: 1024 * 1024,
      type: 'pdf',
      status: 'completed'
    }, {
      id: '2',
      name: '필수 파일.docx',
      size: 2048 * 1024,
      type: 'docx',
      status: 'completed'
    }]
  }
}
```

### Restricted File Types

```tsx
{
  args: {
    title: '이미지 파일 업로드',
    description: 'JPG, PNG 파일만 업로드 가능합니다.',
    uploadText: '이미지 파일을 선택하거나 드래그하여 업로드하세요.',
    acceptedFileTypes: ['jpg', 'png'],
    maxFiles: 5
  }
}
```

### Interactive

```tsx
{
  args: {},
  render: function Render(args) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const handleFilesChange = (newFiles: FileItem[]) => {
      setFiles(newFiles);
    };
    const handleFileUpload = async (_file: File): Promise<void> => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    };
    const handleFileDelete = (fileId: string) => {
      setFiles(files.filter(file => file.id !== fileId));
    };
    const handleAllFilesDelete = () => {
      setFiles([]);
    };
    return <FileUpload {...args} files={files} onFilesChange={handleFilesChange} onFileUpload={handleFileUpload} onFileDelete={handleFileDelete} onAllFilesDelete={handleAllFilesDelete} />;
  },
  args: {
    title: '인터랙티브 파일 업로드',
    description: '실제로 파일을 업로드하고 삭제할 수 있습니다.',
    uploadText: '파일을 선택하거나 드래그하여 업로드하세요.',
    maxFiles: 5,
    maxFileSize: 10 * 1024 * 1024,
    acceptedFileTypes: ['pdf', 'doc', 'docx', 'hwp', 'jpg', 'png']
  }
}
```

---

_krds-react@1.1.1 · Storybook 9.1.17 기준 자동 생성 문서. `npm run build:references`로 재생성._
