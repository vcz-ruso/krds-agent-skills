# 설치 가이드

이 문서는 KRDS Agent Skills 3종(`krds-react-dev`, `krds-a11y-review`, `krds-design`)을 Claude Code에 설치하는 방법을 다룬다. 각 스킬은 `skills/<스킬명>/` 디렉터리 하나로 자기완결적이다 — `SKILL.md`뿐 아니라 필요한 참조 데이터(`references/`)와 스크립트(`scripts/`)를 디렉터리 안에 함께 포함하므로, **디렉터리를 그대로 복사하는 것만으로 동작한다.** 별도 빌드나 의존성 설치가 필요 없다.

## 프로젝트 설치 (권장)

대상 프로젝트에서 사용하려면 이 저장소를 클론한 뒤 원하는 스킬 디렉터리를 프로젝트의 `.claude/skills/`로 복사한다.

```bash
# 1. 이 저장소를 임시 위치에 클론
git clone https://github.com/vcz-ruso/krds-agent-skills.git /tmp/krds-agent-skills

# 2. 대상 프로젝트에 .claude/skills/ 디렉터리 준비
mkdir -p <project>/.claude/skills

# 3. 필요한 스킬만 골라 복사 (세 개 모두 쓰려면 세 줄 모두 실행)
cp -R /tmp/krds-agent-skills/skills/krds-react-dev   <project>/.claude/skills/
cp -R /tmp/krds-agent-skills/skills/krds-a11y-review  <project>/.claude/skills/
cp -R /tmp/krds-agent-skills/skills/krds-design       <project>/.claude/skills/
```

이 저장소를 프로젝트 옆에 별도 클론으로 계속 두고(예: 서브모듈, 혹은 형제 디렉터리) 업데이트가 있을 때마다 위 `cp -R` 3~5단계만 반복해도 된다. `.claude/skills/` 아래 복사된 디렉터리는 프로젝트 저장소에 그대로 커밋해 팀원과 공유하는 것을 권장한다 — Claude Code는 프로젝트에 커밋된 스킬을 별도 설정 없이 인식한다.

복사 후 디렉터리 구조는 다음과 같아야 한다.

```
<project>/.claude/skills/
├── krds-react-dev/
│   ├── SKILL.md
│   ├── references/
│   └── scripts/
├── krds-a11y-review/
│   ├── SKILL.md
│   ├── references/
│   └── scripts/
└── krds-design/
    └── SKILL.md
```

## 개인 전역 설치

여러 프로젝트에서 공통으로 쓰려면 홈 디렉터리의 `~/.claude/skills/`에 동일하게 복사한다.

```bash
mkdir -p ~/.claude/skills
cp -R /tmp/krds-agent-skills/skills/krds-react-dev   ~/.claude/skills/
cp -R /tmp/krds-agent-skills/skills/krds-a11y-review  ~/.claude/skills/
cp -R /tmp/krds-agent-skills/skills/krds-design       ~/.claude/skills/
```

전역 설치는 모든 프로젝트에서 스킬이 항상 활성화된다는 뜻이므로, KRDS와 무관한 프로젝트에서 스킬 설명(description)이 다른 요청과 혼동을 일으키지 않는지 유의한다.

## 설치 확인

Claude Code에서 `/skills` 명령으로 설치된 스킬 목록에 `krds-react-dev`, `krds-a11y-review`, `krds-design`이 나타나는지 확인한다. 목록에 보이지 않으면 복사 경로(`.claude/skills/<스킬명>/SKILL.md`)가 정확한지 다시 확인한다.

또는 스킬 설명에 맞는 요청(예: "이 버튼 컴포넌트를 KRDS 접근성 기준으로 리뷰해줘")을 보내 스킬이 자동으로 트리거되는지로도 확인할 수 있다. 다만 `/skills`의 정확한 화면 구성과 자동 트리거 판단 기준은 Claude Code 버전에 따라 달라질 수 있다.

## 함께 설치하면 좋은 것

`krds-react-dev` 스킬은 작업 시작 시 `scripts/detect-stack.mjs`로 대상 프로젝트의 스택(React / Next.js / React Native, 그리고 `krds-react` 설치 여부)을 감지해 그에 맞는 코드 생성 분기를 탄다. 이 스킬을 쓸 프로젝트에는 이 저장소가 기준으로 삼는 것과 같은 버전인 `krds-react@1.1.1`을 설치해 두는 것을 권장한다.

```bash
npm install krds-react@1.1.1
```

## 다른 런타임 호환성

이 스킬들은 [Agent Skills](https://agentskills.io) 오픈 스탠다드의 `SKILL.md` 포맷을 따르므로, 이를 지원하는 다른 클라이언트에서도 대부분 그대로 동작한다. 다만 일부 스킬은 Claude Code 전용 확장 필드를 사용한다 — `krds-a11y-review`의 frontmatter에 있는 `context: fork`가 그 예로, 이 스킬을 별도 컨텍스트(subagent)에서 실행해 코드 리뷰 결과만 메인 대화로 반환하라는 Claude Code 전용 지시다. 표준 필드만 지원하는 런타임에서는 이 필드가 무시되고 스킬 본문이 메인 컨텍스트에서 그대로 실행될 수 있다. `krds-design`은 표준 필드(`name`, `description`, `license`)만 사용하므로 어떤 Agent Skills 호환 클라이언트에서도 동일하게 동작한다. `krds-react-dev`도 표준 필드만 사용한다.

## 제약·주의

- 이 저장소가 제공하는 모든 KRDS 데이터는 **버전 고정 스냅샷**이다. 현재 기준 버전은 `krds-react@1.1.1` / HTML Component Kit v1.1.0(`pipeline/snapshot.lock.json` 참조)이며, 최신 KRDS 배포판과 내용이 다를 수 있다. 새 버전 대응 절차는 저장소 루트 [`README.md`의 "데이터 갱신"](../README.md#데이터-갱신) 절을 참조한다.
- KRDS 원자료는 **공공누리 제1유형(KOGL Type 1)** 조건으로 개방되어 있어 출처 표기 의무가 있다. 이 스킬들이 생성·인용하는 KRDS 관련 산출물을 배포할 때는 저장소 루트 [`README.md`의 "라이선스"](../README.md#라이선스) 절에 명시된 출처 표기 문구를 함께 포함해야 한다.
