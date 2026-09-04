# KRDS UX 패턴 레퍼런스 색인

KRDS(정부 UI/UX 디자인시스템)의 기본 패턴(global) 13종과 서비스 패턴(service) 5종을 krds-react 개발에 바로 참조할 수 있도록 증류한 문서 모음이다. 각 파일은 원본 KRDS 사이트 크롤링 데이터(`data/site/global/`, `data/site/service/`)를 근거로 작성했으며, 파일 하단에 원본 데이터 경로를 각주로 남긴다.

기본 패턴은 여러 화면에서 반복적으로 쓰이는 UI 조합(예: 입력폼, 오류, 확인) 단위 가이드이고, 서비스 패턴은 방문·검색·로그인·신청·정책정보 확인처럼 사용자 여정 전체를 다단계로 안내하는 가이드다. 서비스 패턴 문서는 원본의 여러 단계별 md 파일을 하나로 통합했으며, 사용성 가이드라인에 원문의 **[필수]-[권장]-[우수]** 적용 수준 표기를 그대로 보존한다.

## 기본 패턴 (Global, 13종)

| 패턴명 | 파일 | 관련 컴포넌트 |
| --- | --- | --- |
| 개인 식별 정보 입력 | [global-personal-info-input.md](./global-personal-info-input.md) | TextInput, DateInput, Radio, Dropdown |
| 도움 | [global-help.md](./global-help.md) | Tooltip, ContextualHelp, HelpPanel, CoachMark, TutorialPanel, Disclosure |
| 동의 | [global-consent.md](./global-consent.md) | Checkbox, Radio, Disclosure |
| 목록 탐색 | [global-list-navigation.md](./global-list-navigation.md) | Table, Accordion, StructuredList, Pagination, Badge, Tag |
| 사용자 피드백 | [global-user-feedback.md](./global-user-feedback.md) | Radio, Checkbox, TextInput, Button |
| 상세 정보 확인 | [global-detail-info.md](./global-detail-info.md) | Tab, InPageNavigation, Disclosure, Link, Button |
| 오류 | [global-error.md](./global-error.md) | Modal, CriticalAlert *(인라인 메시지는 개별 입력 컴포넌트의 오류 상태로 표현)* |
| 입력폼 | [global-form-input.md](./global-form-input.md) | TextInput, Textarea, Select, Dropdown, Checkbox, Radio, DateInput, ToggleSwitch, Button, Spinner, StepIndicator, ContextualHelp |
| 첨부파일 | [global-attachment.md](./global-attachment.md) | Link, StructuredList, Table |
| 필터링·정렬 | [global-filter-sort.md](./global-filter-sort.md) | Dropdown, Select, Checkbox, Radio, DateInput, Tag, Button |
| 확인 | [global-confirmation.md](./global-confirmation.md) | Modal, Button |
| 모바일 알림 | [global-mobile-notification.md](./global-mobile-notification.md) | Modal, CriticalAlert *(네이티브 앱 전제 — krds-react에 직접 대응 컴포넌트 없음, 파일 참고)* |
| 모바일 설정 | [global-mobile-settings.md](./global-mobile-settings.md) | ToggleSwitch, Radio, Checkbox, Dropdown, Select, DateInput, Tab, Modal, Tooltip, Button *(네이티브 앱 전제 — 슬라이더 등 일부 요소는 krds-react에 직접 대응 없음)* |

## 서비스 패턴 (Service, 5종)

| 패턴명 | 파일 | 단계 구성 | 관련 컴포넌트 |
| --- | --- | --- | --- |
| 방문 | [service-visit.md](./service-visit.md) | 정보 탐색·확인·이동 | Tab, Link, Button *(원문의 캐러셀은 krds-react 미구현)* |
| 검색 | [service-search.md](./service-search.md) | 검색 기능 찾기 → 검색어 입력 → 검색 결과 확인 → 상세 검색 → 검색 결과 이용 → 재검색 → 검색 종료 (7단계) | Header, Link, Button, TextInput, StructuredList, Spinner, Tab, Badge, Tag |
| 로그인 | [service-login.md](./service-login.md) | 로그인 기능 찾기 → 로그인 안내 → 로그인 방식 확인/선택 → 로그인 정보 입력 → 로그인 완료 → 서비스 이용 → 로그아웃 (7단계) | Header, Modal *(Checkbox, Dropdown, Spinner는 원문 구조 설명 근거로 추가 연결 가능 — 파일 내 비고 참고)* |
| 신청 | [service-application.md](./service-application.md) | 신청 대상 탐색 → 서비스 정보 확인 → 유의 사항/자격 확인 → 신청서 작성 → 확인·확정 → 완료 → 신청 결과 확인 (7단계) | StructuredList, Link, Pagination, StepIndicator, HelpPanel, ContextualHelp, CoachMark, TutorialPanel, Modal, Badge |
| 정책정보 확인 | [service-policy-info.md](./service-policy-info.md) | 정책 탐색 → 정보 확인 → 정책 자료 탐색 (3단계) | StructuredList, Pagination, Badge |

## 사용 방법

1. 구현하려는 UI가 위 표의 기본 패턴 중 하나에 해당하면 해당 파일의 사용성/접근성 가이드라인을 먼저 확인하고, 규범적 문장("~해야 한다")을 구현 요구사항으로 반영한다.
2. 여러 화면에 걸친 사용자 여정(로그인, 신청 등)을 구현할 때는 서비스 패턴 파일에서 전체 단계 구성과 단계별 **[필수]-[권장]-[우수]** 가이드라인을 확인한다.
3. "관련 컴포넌트" 열의 이름은 모두 `../components/<ComponentName>.md`에 실존하는 krds-react 컴포넌트다. 이 색인과 `../components/README.md`에 없는 이름이 필요하다고 판단되면 임의로 지어내지 말고 합성(조합)으로 해결하거나 사용자에게 확인을 요청한다.
4. 모바일 관련 기본 패턴(모바일 알림, 모바일 설정) 및 서비스 패턴의 일부 네이티브 전용 요소는 krds-react(웹)만으로 구현할 수 없다 — 각 파일 하단의 "관련 KRDS 컴포넌트" 절 설명을 확인한다.

---

데이터 출처: `data/site/global/global_01.md`~`global_13.md`, `data/site/service/service_01_01.md`~`service_05_04.md`
