# KWCAG 2.2 / WCAG 2.1 매핑

> 이 문서는 `data/site/component/component_*.md`의 "### 접근성 가이드라인" 절에서 `npm run build:kwcag` (pipeline/build-kwcag-map.mjs)로 자동 생성됩니다. 직접 수정하지 말고, 원본 데이터를 갱신한 뒤 다시 생성하세요.

## 통계

- 접근성 가이드라인 절이 있는 컴포넌트 수: 44개 (전체 컴포넌트 문서 55개 중)
- 접근성 가이드라인 절이 없는 컴포넌트 수: 11개
- 규칙 항목 수: 156개
- 파싱 경고 수: 0개 (목표: 0)

### 최다 인용 조항 TOP 5

| 순위 | 조항 | 인용 횟수 |
| --- | --- | --- |
| 1 | WCAG 2.1 Info and Relationships (A) | 27 |
| 2 | WCAG 2.1 Name, Role, Value (A) | 27 |
| 3 | WCAG 2.1 Non-text Contrast (AA) | 20 |
| 4 | KWCAG 2.2 초점 이동과 표시 | 15 |
| 5 | KWCAG 2.2 키보드 사용 보장 | 15 |

### 접근성 가이드라인 절이 없는 컴포넌트

아래 문서는 원본 KRDS 사이트에 "접근성" 탭 자체가 없거나 파비콘/스플래시 스크린처럼 접근성 규칙이 별도로 서술되지 않는 컴포넌트다.

- 파비콘 (Favicon) (`component_04_14.md`)
- 플로팅 버튼 (`component_05_03.md`)
- 음성지원 (TTS) (`component_08_06.md`)
- 접근 가능한 미디어 (Accessible multimedia) (`component_11_01.md`)
- 숨긴 콘텐츠 (Visually hidden) (`component_11_02.md`)
- 범위 슬라이드 (`component_12_01.md`)
- 뒤로가기 버튼 (`component_12_02.md`)
- 바텀시트 (`component_12_03.md`)
- 수량 토글 (`component_12_04.md`)
- 토스트 (`component_12_05.md`)
- 스낵바 (`component_12_06.md`)

## 컴포넌트별 접근성 규칙

### 공식 배너 (Masthead)

출처: `data/site/component/component_02_01.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 건너뛰기 링크는 공식 배너 이전에 제공한다. | 반복 영역 건너뛰기 | Bypass Blocks (A) |

### 운영기관 식별자 (Identifier)

출처: `data/site/component/component_02_02.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 식별자 영역은 구조적으로 푸터 내부에 포함되도록 제공한다. | — | Info and Relationships (A) |
| 로고 이미지에 대체 텍스트를 제공한다. | 적절한 대체 텍스트 제공 | Non-text Content (A) |

### 헤더 (Header)

출처: `data/site/component/component_02_03.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 건너뛰기 링크를 최상단에 배치한다. | 반복 영역 건너뛰기 | Bypass Blocks (A) |
| 로고 이미지에 대체 텍스트를 제공한다. | 적절한 대체 텍스트 제공 | Non-text Content (A) |

### 푸터 (Footer)

출처: `data/site/component/component_02_04.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 푸터 영역이 스크린 리더에 인지될 수 있는 방식으로 제공한다. | — | Info and Relationships (A) |
| 로고 이미지에 대체 텍스트를 제공한다. | 적절한 대체 텍스트 제공 | Non-text Content (A) |

### 건너뛰기 링크 (Skip link)

출처: `data/site/component/component_03_01.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 건너뛰기 링크 목록은 문서의 가장 첫 요소로 제공한다. | 반복 영역 건너뛰기 | Bypass Blocks (A); Multiple Ways (AA); Consistent Navigation (AA); Consistent Identification (AA) |
| 건너뛰기 링크의 초점이 명확하게 구분되도록 표현한다. | 초점 이동과 표시 | Focus Visible (AA) |
| 건너뛰기 링크 실행 시 스크롤 동작과 함께 연결된 목적지 섹션으로 Focus 이벤트가 발생해야 한다. | 초점 이동과 표시 | Focus Order (A) |

### 메인 메뉴 (Main menu)

출처: `data/site/component/component_03_02.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 메뉴의 컨테이너가 내비게이션 섹션임을 스크린 리더에서 인지할 수 있도록 한다. | 제목 제공 | Info and Relationships |
| 메뉴 링크의 계층 구조를 표현한다. | 제목 제공 | Info and Relationships (A) |
| 활성화된 메뉴 정보가 스크린 리더로 전달될 수 있도록 한다. | — | Name, Role, Value (A) |
| 메뉴 링크는 키보드로 탐색할 수 있도록 한다. | 키보드 사용 보장 | Keyboard (A); No Keyboard Trap (A) |
| 키보드의 초점은 메뉴의 계층 순서대로 이동하도록 한다. | 초점 이동과 표시 | Focus Order (A) |

### 브레드크럼 (Breadcrumb)

출처: `data/site/component/component_03_03.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 경로 목록을 구획으로 감싸고 적절한 구획 제목을 제공한다. | 제목 제공 | Info and Relationships (A) |
| 순서 있는 목록을 사용한다. | 제목 제공 | Info and Relationships (A) |
| 구분자는 배경과 3:1 이상의 명도 대비를 갖도록 표현한다. | 텍스트 콘텐츠의 명도 대비 | Non-text Contrast (AA) |
| 스크린 리더에서 구분자 정보가 탐지되지 않도록 한다. | — | Non-text Content (A) |

### 사이드 메뉴 (Side navigation)

출처: `data/site/component/component_03_04.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 메뉴의 컨테이너가 내비게이션 섹션임을 스크린 리더에서 인지할 수 있도록 한다. | 제목 제공 | Info and Relationships (A) |
| 메뉴 링크의 계층 구조를 표현한다. | 제목 제공 | Info and Relationships (A) |
| 활성화된 메뉴 정보가 스크린 리더로 전달될 수 있도록 한다. | 적절한 대체 텍스트 제공 | Name, Role, Value (A) |
| 메뉴 링크는 키보드로 탐색할 수 있도록 한다. | 키보드 사용 보장 | Keyboard (A); No Keyboard Trap (A) |
| 키보드의 초점은 메뉴의 계층 순서대로 이동하도록 한다. | 초점 이동과 표시 | Focus Order (A) |
| 스크린 리더에서 하위 수준 메뉴의 확장/축소 상태를 확인할 수 있도록 한다. | — | Name, Role, Value (A) |
| 축소된 메뉴 링크에 보조 기술이 접근되지 않도록 제공한다. | 초점 이동과 표시 | Focus Order (A) |

### 콘텐츠 내 탐색 (In-page navigation)

출처: `data/site/component/component_03_05.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 키보드로 접근과 조작이 가능하도록 한다. | 키보드 사용 보장 | Keyboard (A) |
| 콘텐츠 내 탐색은 제목과 본문 사이에 배치한다. | 콘텐츠의 선형화 | Meaningful Sequence (A); Consistent Navigation (AA) |
| 키보드로 콘텐츠 내 탐색 링크를 실행하였을 때 화면과 함께 키보드 초점이 해당 섹션으로 이동되도록 한다. | 초점 이동과 표시 | Focus Order (A) |
| 링크 목록에 을 사용하지 않는다. | 제목 제공 | Info and Relationships (A) |

### 페이지네이션 (Pagination)

출처: `data/site/component/component_03_06.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 페이지네이션의 컨테이너가 내비게이션 섹션임을 스크린 리더에서 인지할 수 있도록 한다. | 제목 제공 | Info and Relationships |
| 숫자 링크 목록의 구조를 표현한다. | 제목 제공 | Info and Relationships (A) |
| 스크린 리더에서 확인할 수 있는 현재 화면 정보를 제공한다. | — | Name, Role, Value (A) |
| 현재 화면 숫자 링크를 색상만으로 구분하지 않는다. | 색에 무관한 콘텐츠 인식 | Use of Color (A) |
| 숫자 링크에 적절한 접근 가능한 이름을 제공한다. | 적절한 링크 텍스트 | Headings and Labels (AA) |
| 이전/다음 화면 이동 버튼을 아이콘으로만 제공하는 경우 이름을 제공해야 한다. | 적절한 링크 텍스트 | Link Purpose (In Context) (A) |
| 페이지네이션의 구성 요소를 적절한 크기로 표현하고 영역 간 구분을 제공한다. | 콘텐츠 간의 구분; 조작 가능 | Target Size (AAA) |
| 페이지네이션의 구성 요소를 일관된 순서로 제공한다. | 콘텐츠의 선형화 | Meaningful Sequence (A) |
| 목록 확장 페이지네이션을 사용할 때, 초점 이동 순서에 유의한다. | 초점 이동과 표시 | Focus Order (A) |

### 구조화 목록 (Structured list)

출처: `data/site/component/component_04_01.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 구조화 목록에서 제공되는 모든 기능을 키보드로 실행할 수 있도록 한다. | 키보드 사용 보장 | Keyboard (A) |
| 구조화 목록에서 제공되는 모든 기능에 키보드 초점이 명확하게 표시되도록 한다. | 초점 이동 | Focus Visible (AA) |
| 구조화 목록에서 제공되는 모든 기능은 사용자가 예측 가능한 방식으로 작동해야 한다. | 사용자 요구에 따른 실행 | — |

### 긴급 공지 (Critical alerts)

출처: `data/site/component/component_04_02.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 긴급 공지 섹션에 배너 역할을 제공한다. | — | Info and Relationships (A) |
| 아이콘에 대체 텍스트를 제공하지 않는다. | 적절한 대체 텍스트 제공 | Non-text Content (A) |
| 목적지를 예측할 수 있는 링크 이름 또는 부가 설명을 제공한다. | 제목 제공 | 2.4.4 Link Purpose (In Context) (A) |

### 달력 (Calendar)

출처: `data/site/component/component_04_03.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 날짜 및 관련 정보의 의미를 색상으로만 구분하지 않는다. | 색에 무관한 콘텐츠 인식 | Use of Color (A) |
| 날짜 및 관련 정보의 의미를 스크린 리더에서 확인할 수 있도록 한다. | 적절한 대체 텍스트 제공 | Non-text Content (A) |
| 달력에서 제공되는 모든 기능을 키보드로 실행할 수 있도록 한다. | 키보드 사용 보장 | Keyboard (A) |
| 달력에서 제공되는 모든 기능에 키보드 초점이 명확하게 표시되도록 한다. | 초점 이동과 표시 | Focus Visible (AA) |

### 디스클로저 (Disclosure)

출처: `data/site/component/component_04_04.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 디스클로저를 버튼 역할로 제공한다. | — | Name, Role, Value (A) |
| 스크린 리더에서 확장/축소 상태 정보를 확인할 수 있도록 한다. | — | Name, Role, Value (A) |

### 모달 (Modal)

출처: `data/site/component/component_04_05.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 모달과 내부 요소의 초점 이동 순서를 논리적으로 제공한다. | 초점 이동 | Focus Order (A); No Keyboard Trap (A) |
| 모달의 닫기 버튼은 모달의 가장 마지막 요소로 마크업한다. | 콘텐츠의 선형화 | Meaningful Sequence (A) |

### 배지 (Badge)

출처: `data/site/component/component_04_06.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 텍스트 레이블을 제공한다. | 적절한 대체 텍스트 제공 | Non-text Content (A) |
| 텍스트 레이블의 색상은 배경과 4.5:1 이상의 명도 대비를 갖도록 표현한다. | 색에 무관한 콘텐츠 인식 | Contrast (Minimum) (AA); Non-text Contrast (AA) |

### 아코디언 (Accordion)

출처: `data/site/component/component_04_07.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 아코디언에 접근 가능한 제목을 제공한다. | 제목 제공 | Info and Relationships (A) |
| 아코디언의 활성화 상태 정보를 스크린 리더에서 확인할 수 있도록 한다. | — | Name, Role, Value (A) |
| 헤더를 버튼 역할로 제공한다. | — | Name, Role, Value (A) |

### 이미지 (Image)

출처: `data/site/component/component_04_08.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 장식용 이미지를 제외한 모든 이미지에 대체 텍스트를 제공한다. | 적절한 대체 텍스트 제공 | Non-text Content (A) |
| 가능한 한 이미지 텍스트를 사용하지 않는다. | — | Images of Text (AA) |

### 캐러셀 (Carousel)

출처: `data/site/component/component_04_09.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 자동 재생 캐러셀에서 정지 버튼이 상호작용 가능한 첫 요소로 제공되어야 한다. | 정지 기능 제공 | Pause, Stop, Hide (A) |
| 단일 지점과의 상호작용을 통해 슬라이드를 탐색할 수 있는 수단을 제공한다. | 누르기 동작 지원 | Pointer Gestures (A) |
| 캐러셀에서 제공되는 모든 기능을 키보드로 실행할 수 있도록 한다. | 키보드 사용 보장 | Keyboard (A) |
| 키보드와 스크린 리더는 기본 항목에만 접근하도록 한다. | 초점 이동 | Focus Order (A) |
| 텍스트가 포함된 이미지를 사용하지 않는다. | — | Images of Text (AA) |

### 탭 (Tab)

출처: `data/site/component/component_04_10.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 탭의 선택 상태를 색상으로만 구분하지 않는다. | 색에 무관한 콘텐츠 인식 | Use of Color (A) |
| 탭을 키보드로 탐색하고 실행할 수 있도록 한다. | 키보드 사용 보장 | Keyboard (A); No Keyboard Trap (A) |
| 탭의 키보드 초점이 명확하게 표시되도록 한다. | 초점 이동 | Focus Visible (AA); Non-text Contrast (AA) |
| 탭의 선택 상태를 스크린 리더로 확인할 수 있도록 한다. | 적절한 대체 텍스트 제공 | Name, Role, Value (A) |
| 탭과 패널의 역할 및 관계를 스크린 리더로 확인할 수 있도록 한다. | 콘텐츠의 선형화 | Info and Relationships (A); Name, Role, Value (A) |

### 표 (Table)

출처: `data/site/component/component_04_11.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 데이터의 구조를 적절하게 반영하여 마크업한다. | 표의 구성 | Info and Relationships (A) |
| 가로 스크롤이 필요한 경우 단순한 동작으로 스크롤 위치를 조정할 수 있도록 한다. | 누르기 동작 지원 | Pointer Gestures (A) |

### 텍스트 목록 (Text list)

출처: `data/site/component/component_04_13.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 목록 유형에 적합한 태그를 사용한다. | — | Info and Relationships (A) |
| list-style-type: none 스타일 지정으로 인한 접근성 문제에 유의한다. | — | Info and Relationships (A); Name, Role, Value (A) |

### 링크 (Link)

출처: `data/site/component/component_05_01.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 비활성화, 사용불가 상태인 경우를 제외하고 모든 링크는 키보드로 접근하고 조작할 수 있도록 한다. | 키보드 사용 보장 | Keyboard (A) |
| 링크 텍스트는 링크 목적지 정보를 적절하게 설명할 수 있는 내용으로 제공한다. | 적절한 링크 텍스트 | Link Purpose (In Context) (A) |
| 링크 레이블은 고유한 내용으로 제공한다. | 적절한 링크 텍스트 | Link Purpose (In Context) (A); Consistent Identification (AA) |
| 링크를 적절한 크기로 제공한다. | — | Target Size (AAA) |
| 링크로 작동하는 모든 요소는 스크린 리더에서 링크로 인지될 수 있도록 한다. | — | Name, Role, Value (A) |

### 버튼 (Button)

출처: `data/site/component/component_05_02.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 모든 버튼에는 접근 가능한 이름을 제공한다. | 적절한 링크 텍스트 | Name, Role, Value (A) |
| 버튼의 기능을 설명할 수 있는 텍스트 레이블이 있는 아이콘 버튼에 대체 텍스트를 제공하지 않는다. | 적절한 대체 텍스트 제공 | Non-text Content (A) |
| 버튼의 접근 가능한 이름은 버튼을 통해 실행되는 기능을 적절하게 설명할 수 있는 내용으로 제공한다. | 적절한 링크 텍스트 | Headings and Labels (AA) |
| 모든 버튼은 키보드로 접근하고 조작할 수 있도록 한다. | 키보드 사용 보장 | Keyboard (A) |
| 버튼의 키보드 초점이 명확하게 표시되도록 한다. | 초점 이동과 표시 | Focus Visible (AA); Non-text Contrast (AA) |
| 버튼으로 작동하는 모든 요소는 스크린 리더에서 버튼으로 인지될 수 있도록 한다. | — | Name, Role, Value (A) |
| 버튼을 적절한 크기로 제공한다. | 조작 가능 | Target Size (AAA) |

### 라디오 버튼 (Radio button)

출처: `data/site/component/component_06_01.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 버튼 양식과 인접 배경 간 명도 대비를 3:1 이상으로 표현한다. | 텍스트 콘텐츠의 명도 대비 | Non-text Contrast (AA) |
| 버튼 양식의 선택 상태를 색상으로만 구분하지 않는다. | 색에 무관한 콘텐츠 인식 | Use of Color (A) |
| 라디오 버튼을 키보드로 탐색하고 실행할 수 있도록 한다. | 키보드 사용 보장 | Keyboard (A); No Keyboard Trap (A) |
| 라디오 버튼에 키보드 초점이 명확하게 표시되도록 한다. | 초점 이동 | Focus Visible (AA); Non-text Contrast (AA) |
| 라디오 버튼에 접근 가능한 이름을 제공한다. | 키보드 사용 보장 | Keyboard (A); No Keyboard Trap (A) |
| 스크린 리더에서 그룹 레이블과 라디오 버튼 그룹의 관계를 확인할 수 있도록 한다. | — | Info and Relationships (A); Labels or Instructions (A) |

### 체크박스 (Checkbox)

출처: `data/site/component/component_06_02.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 체크박스, 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 표현한다. | 텍스트 콘텐츠의 명도 대비 | Non-text Contrast (AA) |
| 체크박스의 선택 상태를 색상으로만 구분하지 않는다. | 색에 무관한 콘텐츠 인식 | Use of Color (A) |
| 체크박스를 키보드로 탐색하고 실행할 수 있도록 한다. | 키보드 사용 보장 | Keyboard (A); No Keyboard Trap (A) |
| 체크박스에 키보드 초점이 명확하게 표시되도록 한다. | 초점 이동 | Focus Visible (AA); Non-text Contrast (AA) |
| 체크박스에 접근 가능한 이름을 제공한다. | 레이블 제공 | Info and Relationships (A); Name, Role, Value (A) |
| 스크린 리더에서 그룹 레이블과 체크박스 그룹의 관계를 확인할 수 있도록 한다. | — | Info and Relationships (A); Labels or Instructions (A) |

### 셀렉트 (Select)

출처: `data/site/component/component_06_03.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 셀렉트에 접근 가능한 이름을 제공한다. | 레이블 제공 | Info and Relationships (A); Name, Role, Value (A) |
| 셀렉트 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 표현한다. | 텍스트 콘텐츠의 명도 대비 | Non-text Contrast (AA) |

### 태그 (Tag)

출처: `data/site/component/component_06_04.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 대화형 태그의 초점을 명확하게 표시한다. | 초점 이동 | Focus Visible (AA); Non-text Contrast (AA) |
| 대화형 태그에 기능 또는 상태 정보를 명확하게 제공한다. | — | Name, Role, Value (A) |
| 태그의 색상으로 의미를 전달하지 않아야 한다. | 색에 무관한 콘텐츠 인식 | Use of Color (A) |
| 태그 레이블, 아이콘이 인접 배경과 3:1 이상의 명도 대비를 갖도록 표현한다. | 색에 무관한 콘텐츠 인식 | Contrast (Minimum) (AA); Non-text Contrast (AA) |

### 토글 스위치 (Toggle switch)

출처: `data/site/component/component_06_07.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 경로, 핸들, 상태 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 표현한다. | 텍스트 콘텐츠의 명도 대비 | Non-text Contrast (AA) |
| 토글 스위치를 키보드로 탐색하고 실행할 수 있도록 한다. | 키보드 사용 보장 | Keyboard (A); No Keyboard Trap (A) |
| 토글 스위치에 키보드 초점이 명확하게 표시되도록 한다. | 초점 이동과 표시 | Focus Visible (AA); Non-text Contrast (AA) |
| 토글 스위치에 접근 가능한 이름을 제공한다. | 레이블 제공 | Info and Relationships (A); Name, Role, Value (A) |
| 스크린 리더에서 도움말을 인지할 수 있도록 한다. | — | Info and Relationships (A) |

### 단계 표시기 (Step indicator)

출처: `data/site/component/component_07_01.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 순서 있는 목록을 사용한다. | 제목 제공 | Info and Relationships (A) |
| 단계 식별자를 색상으로만 구분하여 표현하지 않는다. | 색에 무관한 콘텐츠 인식 | Use of Color (A) |
| 현재 단계를 스크린 리더로 확인할 수 있도록 한다. | 적절한 대체 텍스트 제공 | Name, Role, Value (A) |

### 스피너 (Spinner)

출처: `data/site/component/component_07_02.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 인접 배경과 경로 간 명도 대비, 경로와 식별자 간 명도 대비를 3:1 이상으로 표현한다. | 텍스트 콘텐츠의 명도 대비; 색에 무관한 콘텐츠 인식 | Use of Color (A); Non-text Contrast (AA) |
| 스피너 상태에 대한 설명을 스크린 리더에서 확인할 수 있도록 한다. | 적절한 링크 텍스트 | Name, Role, Value (A); Status Messages (AA) |

### 도움 패널 (Help panel)

출처: `data/site/component/component_08_01.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 제공한다. | 텍스트 콘텐츠의 명도 대비 | Non-text Contrast (AA) |
| 아이콘 버튼에 이름을 제공한다. | 적절한 링크 텍스트 | Non-text Content (A); Name, Role, Value (A) |
| 아이콘 버튼에 고유하고 적절한 이름을 제공한다. | 적절한 링크 텍스트 | Headings and Labels (AA) |
| 키보드 초점은 논리적인 순서로 이동해야 한다. | 초점 이동과 표시 | Focus Order (A); No Keyboard Trap (A) |
| 아이콘 버튼의 크기를 44px x 44px 이상으로 제공하는 방안을 고려한다. | 조작 가능 | Target Size (AAA) |
| 패널 열기 버튼과 패널은 본문 바로 다음 요소로 제공한다. | 콘텐츠의 선형화 | Meaningful Sequence (A); Consistent Navigation (AA) |

### 따라하기 패널 (Tutorial panel)

출처: `data/site/component/component_08_02.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 키보드 초점은 논리적인 순서로 이동해야 한다. | 초점 이동과 표시 | Focus Order (A); No Keyboard Trap (A) |
| 패널 열기 버튼과 패널은 본문 바로 다음 요소로 제공한다. | 콘텐츠의 선형화 | Meaningful Sequence (A); Consistent Navigation (AA) |

### 맥락적 도움말 (Contextual help)

출처: `data/site/component/component_08_03.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 아이콘과 인접 배경 간 명도 대비를 3:1 이상으로 제공한다. | 텍스트 콘텐츠의 명도 대비 | Non-text Contrast (AA) |
| 아이콘 버튼에 이름을 제공한다. | 적절한 링크 텍스트 | Non-text Content (A); Name, Role, Value (A) |
| 아이콘 버튼에 고유하고 적절한 이름을 제공한다. | 적절한 링크 텍스트 | Headings and Labels (AA) |
| 맥락적 도움말은 사용자가 요청한 경우에만 실행되어야 한다. | 사용자 요구에 따른 실행 | On Focus (A); On Input (A) |
| 아이콘 버튼과 도움말 팝오버 콘텐츠를 적절한 순서로 제공한다. | 콘텐츠의 선형화 | Meaningful Sequence (A) |
| 키보드 초점은 논리적인 순서로 이동해야 한다. | 초점 이동과 표시 | Focus Order (A); No Keyboard Trap (A) |
| 아이콘 버튼의 크기를 44px x 44px 이상으로 제공하는 방안을 고려한다. | 조작 가능 | Target Size (AAA) |

### 코치마크 (Coach mark)

출처: `data/site/component/component_08_04.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 스포트라이트와 인접 배경 간 명도 대비를 3:1 이상으로 제공한다. | 텍스트 콘텐츠의 명도 대비 | Non-text Contrast (AA) |
| 코치마크는 사용자가 요청한 경우에만 실행되어야 한다. | 사용자 요구에 따른 실행 | On Focus (A); On Input (A) |
| 관련 요소와 코치마크 팝오버 콘텐츠를 적절한 순서로 제공한다. | 콘텐츠의 선형화 | Meaningful Sequence (A) |

### 툴팁 (Toolip)

출처: `data/site/component/component_08_05.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 활성화 버튼에 이름을 제공한다. | 적절한 링크 텍스트 | Non-text Content (A); Name, Role, Value (A) |
| 활성화 버튼에 고유하고 적절한 이름을 제공한다. | 적절한 링크 텍스트 | Headings and Labels (AA) |
| 활성화 버튼과 컨테이너 영역을 aria-labelledby 속성으로 연결한다. | — | Info and Relationships (A) |
| 활성화 버튼과 팝오버 콘텐츠를 적절한 순서로 제공한다. | 콘텐츠의 선형화 | Meaningful Sequence (A) |

### 날짜 입력 필드 (Date input)

출처: `data/site/component/component_09_01.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 키보드를 이용하여 조회 날짜를 선택하거나 입력할 수 있도록 제공한다. | 키보드 사용 보장 | Keyboard (A); No Keyboard Trap (A) |
| 입력 필드에 레이블을 명확하게 지정한다. | 레이블 제공 | Info and Relationships (A); Headings and Labels (AA) |
| 날짜 입력 형식이 지정되어 있는 경우 사용자에게 입력 방식을 명확하게 안내한다. | — | Labels or Instructions (A) |

### 텍스트 영역 (Textarea)

출처: `data/site/component/component_09_02.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 입력 영역과 인접 배경 간 명도 대비를 3:1 이상으로 제공한다. | 텍스트 콘텐츠의 명도 대비 | Non-text Contrast (AA) |
| 텍스트 영역에 접근 가능한 이름을 제공한다. | 레이블 제공 | Info and Relationships (A); Name, Role, Value (A) |

### 텍스트 입력 필드 (Text input)

출처: `data/site/component/component_09_03.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 모든 입력 필드의 초점은 시각적으로 확인할 수 있도록 표현한다. | 초점 이동과 표시 | Focus Visible (AA) |
| 입력 필드와 인접 배경 간 명도 대비를 3:1 이상으로 표현한다. | 텍스트 콘텐츠의 명도 대비 | Non-text Contrast (AA) |
| 텍스트 입력 필드에 접근 가능한 이름을 제공한다. | 레이블 제공 | Info and Relationships (A); Name, Role, Value (A) |

### 파일 업로드 (File upload)

출처: `data/site/component/component_09_04.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 파일 업로드에 적절한 레이블을 제공한다. | 레이블 제공 | Headings and Labels (AA) |
| 파일 항목과 항목 삭제 버튼을 하나의 그룹으로 제공한다. | 콘텐츠의 선형화 | Info and Relationships (A) |
| 키보드 초점을 명확하게 표시한다. | 초점 이동과 표시 | Focus Visible (AA); Non-text Contrast (AA) |
| 드래그 앤 드롭 유형은 반드시 파일 업로더와 함께 사용한다. | 키보드 사용 보장; 누르기 동작 지원 | Keyboard (A); No Keyboard Trap (A); Pointer Gestures (A) |
| 스크린 리더로 접근할 수 있도록 한다. | — | Name, Role, Value (A) |

### 언어 변경 (Language switcher)

출처: `data/site/component/component_10_01.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 링크에 lang 속성을 선언하고 레이블과 일치하는 언어 코드를 속성값으로 제공한다. | — | Language of Parts (AA) |

### 화면 크기 조정 (Resize)

출처: `data/site/component/component_10_02.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 화면 크기를 조정했을 때 콘텐츠가 가려지거나 기능이 손실되지 않도록 한다. | — | Resize Text (AA); Reflow (AA) |
| 화면을 확대했을 때 화면 스크롤은 단일 방향으로 유지/생성되도록 한다. | — | Reflow (AA) |

### 탭바 (Tab bar)

출처: `data/site/component/component_12_07.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 탭바의 역할을 스크린 리더에서 인지할 수 있도록 한다. | 제목 제공 | Info and Relationships |
| 활성화된 메뉴 정보가 스크린 리더로 전달될 수 있도록 한다. | — | Name, Role, Value (A) |

### 스플래시 스크린 (Splash screen)

출처: `data/site/component/component_12_08.md`

| 규칙 문장 | KWCAG 2.2 조항 | WCAG 2.1 SC(등급) |
| --- | --- | --- |
| 스플래시 스크린에 중요한 정보를 포함하지 않는다. | — | Pause, Stop, Hide (AA) |
| 애니메이션 사용에 유의한다. | — | Three Flashes or Below Threshold (A) |

본 문서는 행정안전부에서 2024년 작성하여 공공누리 제1유형으로 개방한 '범정부 UI/UX 디자인시스템(KRDS)'의 접근성 가이드라인 내용을 이용하였으며, 해당 저작물은 KRDS 디자인시스템 홈페이지(www.krds.go.kr)에서 무료로 다운받으실 수 있습니다.
