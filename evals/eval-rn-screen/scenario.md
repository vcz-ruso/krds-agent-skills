# eval-rn-screen — 시나리오

## 대상 스킬

`skills/krds-react-dev`(React Native 매핑 경로: `references/react-native/`)

## 전제 조건

1. `krds-react-dev` 스킬이 설치된 Claude Code 세션에서 실행한다.
2. 대상 프로젝트는 React Native(Expo 또는 bare) 프로젝트가 이미 스캐폴딩되어 있다고 가정한다 — `detect-stack.mjs` 기준 `reactNative: true`.
3. `data/kit/rn-tokens.json`(리포지터리 루트 기준 경로)이 프로젝트에 이미 복사되어 있거나 접근 가능하다고 가정한다.
4. 토스트 메시지는 "민원 신청이 완료되었습니다" 같은 짧은 정보성 메시지 1건이라고 가정한다(별도 액션 버튼 없음 — 스낵바가 아니라 토스트가 맞는 경우).

## 사용자 프롬프트 (원문)

```
React Native로 민원 신청 완료 토스트 띄워줘
```

## 관찰 포인트

- KRDS에 토스트의 **공식 React Native 구현이 없다**는 사실을 세션이 명확히 고지하는가(웹에도 krds-react 컴포넌트로서의 Toast는 없고, `component_12_05.md`는 모바일 전용 문서라는 점까지 정확히 짚으면 더 좋다).
- `data/kit/rn-tokens.json` 기반 상수(색상·spacing·radius)를 사용하는가, 하드코딩된 색상·치수를 쓰는가.
- `references/react-native/component-mapping.md` A.5(토스트)의 요구사항 — 화면 중앙 하단 배치(탭바·플로팅 버튼과 비중첩), 한 줄 메시지, 노출 시간(정보형 2~3초), 포커스를 가로채지 않음, 스크린 리더 announce — 를 반영하는가.
- "⚠️ 자체 판단" 태그가 붙은 부분(스크린 리더 announce 처리는 공식 문서에 없고 이 저장소가 제안하는 내용)을 세션이 스스로도 "이 부분은 공식 규정이 아니라 판단"이라고 구분해 표시하는가.
