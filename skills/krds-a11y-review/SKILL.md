---
name: krds-a11y-review
description: Reviews React and HTML code for KRDS accessibility compliance, reporting violations with KWCAG 2.2 and WCAG 2.1 clause citations. Use when auditing, reviewing, or checking accessibility of Korean government service UI code. 접근성 검토·리뷰·감사 요청 시 사용.
license: MIT
context: fork
---

# KRDS 접근성 리뷰 스킬

## 리뷰 절차

1. **대상 파일/diff 수집** — 리뷰할 React/HTML 파일 또는 변경된 diff를 수집한다. TODO: 대상 범위 결정 규칙(전체 파일 vs diff만) 상세화.
2. **결정론적 검사** — `scripts/check-static.mjs`로 정적 규칙 위반(하드코딩 색상, 토큰 미사용, 터치 타깃 크기, KRDS 클래스 준수 등)을 기계적으로 탐지한다.
3. **모델 판단 검사** — alt 텍스트 품질, 포커스 순서, 레이블 적절성 등 정적 분석으로 판단하기 어려운 항목을 모델이 직접 검토한다. TODO: 판단 기준 체크리스트 추가.
4. **리포트 생성** — 위 결과를 종합해 위반 사항 리포트를 작성한다. TODO: 리포트 템플릿 구체화.

## 리포트 형식

- 위반 사항마다 관련 KWCAG 2.2 조항과 WCAG 2.1 성공 기준(SC)·등급(A/AA/AAA)을 함께 인용한다.
- 각 위반 항목은 "코드상 확인됨"(정적 검사로 확정 가능)과 "수동 검증 필요"(스크린리더·실기기 등 수동 확인 필요)를 명확히 구분해 표기한다.

TODO: 실제 리포트 출력 예시 추가.

## 참조

- `references/kwcag-map.md` — 컴포넌트/패턴별 KWCAG 2.2·WCAG 2.1 매핑표.
