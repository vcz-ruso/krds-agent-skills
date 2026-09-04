<!--
source: https://www.krds.go.kr/html/site/style/style_07_popup.html
fetchedAt: 2026-09-04T01:36:36.895Z
bytes: 28497
-->

# 디자인 토큰 전체 보기

# 디자인 토큰 전체 보기

KRDS에서 사용된 모든 토큰을 확인할 수 있으며, 각 토큰명과 CSS 변수명, 그리고 값(value)을 명시한다.

CSS 변수명은 실제로 (--krds)로 시작되지만, 편의를 위해 디자인 토큰 목록에서 --namespace 값인 (--krds) 표기는 생략한다.

 CSS 변수 추출 시 확인사항

- #### CSS 변수명 최적화
KRDS Figma Local Variable의 collection 및 기본 mode 명칭은 CSS 변수명이 지나치게 길어지는 것을 방지하기 위해 생략한다.

- KRDS Figma Local Variable의 기본 mode 명칭은 'value-set'이다.

- #### 단위 체계 통일
반응형 디자인과 접근성을 고려해 CSS에서 rem 단위를 사용한다.

- JSON으로 토큰을 내보낼 때 Figma에서 사용된 px 단위를 자동으로 rem으로 변환하여 실제 개발 환경과 동일한 체계를 유지한다.

- semantic token

- primitive token

### 토큰 검색

 검색

이 페이지의 구성
