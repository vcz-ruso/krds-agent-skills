<!--
source: https://www.krds.go.kr/html/site/component/component_04_06.html
fetchedAt: 2026-09-04T01:36:36.895Z
bytes: 77657
-->

# 배지 (Badge)

컴포넌트에 대한 빠른 인지와 탐색을 돕기 위해 컴포넌트 근처에 표시되는 작은 문자 또는 숫자 데이터이다. 컴포넌트의 분류 체계, 구조화된 정보, 상태 정보, 기타 메타 데이터를 표시할 수 있으며 사용자의 주의를 끌기 위해 색상을 활용할 수 있다.

- 개요

- 접근성

- 코드

이 페이지의 구성

### 구조

- 1. 레이블 배지를 통해 전달하고자 하는 메타 데이터

- 2. 컨테이너 배지를 배경과 구분하는 배경색 또는 윤곽선

### 용례

#### 사용하기 적합한 경우

- 새로 등록된 콘텐츠, 읽지 않은 알림을 안내할 때
배지를 사용함으로써 사용자의 주의를 끌어 중요한 정보를 확인하도록 행동을 유도할 수 있다.

- 데이터의 상태 정보를 사용자가 알고 있는 것이 좋을 때
데이터에 2개 이상의 상태 정보가 존재하며, 이를 사용자가 명확하게 인지하는 것이 중요한 경우 배지를 이용한다.
예) 신청 서비스의 진행 상태(접수 중, 마감됨, 모집 완료) 등

#### 사용하기 적합하지 않은 경우

- 대화형으로 사용하고자 할 때
태그를 사용하는 것이 적합하다.

### 사용성 가이드라인

레이블은 정확한 내용으로 간결하게 제공한다.

사용자가 배지를 통해 정보를 빠르게 파악할 수 있도록 핵심 정보를 간결하게 요약하고 텍스트에 줄바꿈이 발생하지 않도록 해야 한다.

레이블과 컨테이너의 색상은 일반적인 의미 체계, 일관성을 고려하여 선택한다.

배지 레이블이 전달하는 정보가 특정 색상이 가진 일반적인 의미 체계와 일치하는 경우, 적절한 색상의 사용은 사용자가 더 빠르게 정보를 처리하는 데 도움된다(예 - 중요, 경고, 반대와 같은 정보에 빨간색 사용). 그러나 과도한 색상 사용은 오히려 사용자의 주의를 분산시킬 수
있다.

배지를 대화형 요소로 사용하지 않는다.

배지를 대화형 요소로 마크업(, 등) 또는 역할(role=link, role=button 등)을 부여하거나 부적절한 속성(0 이상의 속성값을 가진 tabindex 속성)을 적용하여 키보드 사용자, 스크린 리더 사용자가 배지의 용도와
목적을 혼동하지 않도록 해야 한다.

하나의 요소에 한 개의 배지를 사용한다.

배지는 사용자가 빠르게 정보를 훑어 보는 과정을 돕기 위해 사용된다. 만약 한 항목에 여러 개의 배지가 사용된다면 지나치게 많은 정보가 강조되어 있어 배지의 사용 효과를 감소시킨다. 배지는 데이터와 관련된 가장 중요한 특성을 표현하는 데 한 번만 사용하는 것이 적절하다.

배지의 배경색으로 서비스의 주조색을 사용하지 않는다.

배지의 배경색으로 주조색(Primary color)을 이용하게 되면 사용자는 배지를 버튼으로 오인할 수 있다.

### 자주 묻는 질문

 자주 묻는 질문더보기

### 정보 변경 내역

*정보 변경 내역 표로 변경일자, 변경 내용으로 구성되어있음*

| 변경일자 | 변경 내용 | 리소스 |
| --- | --- | --- |
| 2025년 4월 22일 | 배지 컴포넌트 명도대비 수정(.krds-badge.bg-warning) | HTML Component Kit v1.0.5 |
| 2025년 2월 04일 | 배지 컴포넌트 숫자형 표시방법 수정(+999 ⟶ 999+) | HTML Component Kit v1.0.3 |
| 2025년 1월 15일 | 최초 등록 | Figma 라이브러리 v1.0.0 HTML Component Kit v1.0.1 |

### 궁금한 점이나 의견이 있으십니까?

- 소식·소통의 문의 및 건의 게시판을 이용하세요.

- 문의하시기 전 자주 묻는 질문 을 통해 문제 해결방법을 확인하실 수 있습니다.

### 접근성 가이드라인

텍스트 레이블을 제공한다.

배지는 접근성과 명확한 이해를 위해 항상 텍스트 레이블을 제공해야 한다.

- KWCAG 2.2 적절한 대체 텍스트 제공

- WCAG 2.1 Non-text Content (A)

텍스트 레이블의 색상은 배경과 4.5:1 이상의 명도 대비를 갖도록 표현한다.

대부분의 사용자가 텍스트 콘텐츠를 문제없이 인지할 수 있도록 텍스트 색상, 배지의 배경 색상 선정에 유의해야 한다.

- KWCAG 2.2 색에 무관한 콘텐츠 인식

- WCAG 2.1 Contrast (Minimum) (AA)

- WCAG 2.1 Non-text Contrast (AA)

### 예시

#### 기본

 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label

 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label

 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label

 기본 코드 확인하기

#### 사이즈

 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label

 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label

 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label
 Label

 사이즈 코드 확인하기

#### 숫자형

 5
 999+

 5
 999+

 숫자형 코드 확인하기

### 마크업 가이드

#### CSS 선택자

*마크업 가이드 CSS 선택자에 대한 표로 필수/선택으로 구성되어있으며 필수 구분 항목은 전체영역이고 전체영역에 대한 선택항목은 컬러,크기,숫자가 있으며 컬러는 아웃라인.bg,bg (파스텔)로 구성되어있고 크기는 크게,중간,작게로 구성되어있음*

| 필수 | 선택 | | | |
| --- | --- | --- | --- | --- |
| 전체영역 | .krds-badge | 컬러 | 아웃라인 | .outline-* (primary/ secondary/ gray/ point/ danger/ warning/ success/ information/ disabled) |
| bg | .bg-* (primary/ secondary/ gray/ point/ danger/ warning/ success/ information/ disabled) | | | |
| bg (파스텔) | .bg-light-* (primary/ secondary/ gray/ point/ danger/ warning/ success/ information/ disabled) | | | |
| 크기 | 크게 | .large | | |
| 중간 | .medium | | | |
| 작게 | .small | | | |
| 숫자 | .number | | | |

### 컴포넌트 토큰 (css variable)
