#!/usr/bin/env node
// validate-skills.mjs
//
// 계약: skills/*/SKILL.md 의 YAML frontmatter를 검증한다.
//   - name: 소문자와 하이픈(-)만 사용, 64자 이하
//   - description: 존재해야 하며 1024자 이하
// 추가로 스킬 문서에 포함된 수기 예시 코드에 대한 tsc 검증은 후일 구현
// (TODO: 예시 코드 블록을 추출해 임시 tsconfig로 타입 체크하는 단계 추가).
//
// skills/ 디렉터리가 아직 존재하지 않을 수 있으므로(다른 작업자가 별도로
// 채워 넣는 영역), 그 경우는 오류가 아니라 "검증 대상 0건"인 정상 종료로
// 처리한다.

import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, '..', 'skills');
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const NAME_MAX_LENGTH = 64;
const DESCRIPTION_MAX_LENGTH = 1024;

function printHelp() {
  console.log(`사용법: node pipeline/validate-skills.mjs [옵션]

skills/*/SKILL.md 의 frontmatter(name, description)를 검증합니다.
  - name: 소문자와 하이픈만 사용, 64자 이하
  - description: 존재해야 하며 1024자 이하

옵션:
  --help    이 도움말을 출력하고 종료합니다.

skills/ 디렉터리가 없으면 검증 대상 0건으로 정상 종료합니다.
(참고: 수기 예시 코드에 대한 tsc 검증은 아직 구현되지 않았습니다.)`);
}

// 최소한의 YAML frontmatter 파서.
// SKILL.md 는 `---`로 감싼 블록에 단순 key: value 쌍만 사용한다고 가정한다.
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yamlBlock = match[1];
  const result = {};
  for (const rawLine of yamlBlock.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // 앞뒤 따옴표 제거
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

async function findSkillDirs() {
  let entries;
  try {
    entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
  const dirs = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      dirs.push(join(SKILLS_DIR, entry.name));
    }
  }
  return dirs;
}

function validateFrontmatter(skillName, frontmatter) {
  const errors = [];

  if (!frontmatter) {
    errors.push('frontmatter를 찾을 수 없습니다 (--- 로 감싼 YAML 블록 필요).');
    return errors;
  }

  const { name, description } = frontmatter;

  if (!name) {
    errors.push('name 필드가 없습니다.');
  } else {
    if (name.length > NAME_MAX_LENGTH) {
      errors.push(`name 길이가 ${NAME_MAX_LENGTH}자를 초과합니다 (현재 ${name.length}자).`);
    }
    if (!NAME_PATTERN.test(name)) {
      errors.push(`name은 소문자와 하이픈(-)만 사용해야 합니다 (현재 값: "${name}").`);
    }
  }

  if (!description) {
    errors.push('description 필드가 없습니다.');
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.push(`description 길이가 ${DESCRIPTION_MAX_LENGTH}자를 초과합니다 (현재 ${description.length}자).`);
  }

  return errors;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  // 다른 스텁들과의 일관성을 위해 snapshot.lock.json 존재를 확인한다
  // (이 스크립트의 검증 로직 자체는 스냅샷 데이터를 사용하지 않는다).
  const lockPath = join(__dirname, 'snapshot.lock.json');
  await readFile(lockPath, 'utf-8');

  const skillDirs = await findSkillDirs();

  if (skillDirs === null) {
    console.log('skills 디렉터리 없음: 검증 대상 0건');
    process.exit(0);
  }

  let hasError = false;
  let checked = 0;

  for (const dir of skillDirs) {
    const skillMdPath = join(dir, 'SKILL.md');
    let content;
    try {
      content = await readFile(skillMdPath, 'utf-8');
    } catch (err) {
      if (err.code === 'ENOENT') continue; // SKILL.md 없는 디렉터리는 건너뜀
      throw err;
    }

    checked += 1;
    const skillName = dir.split('/').pop();
    const frontmatter = parseFrontmatter(content);
    const errors = validateFrontmatter(skillName, frontmatter);

    if (errors.length > 0) {
      hasError = true;
      console.log(`[FAIL] ${skillName}`);
      for (const err of errors) {
        console.log(`  - ${err}`);
      }
    } else {
      console.log(`[OK] ${skillName}`);
    }
  }

  if (checked === 0) {
    console.log('skills/ 아래에 SKILL.md 파일이 없음: 검증 대상 0건');
    process.exit(0);
  }

  console.log('TODO: 수기 예시 코드 tsc 검증은 아직 구현되지 않았습니다.');

  process.exit(hasError ? 1 : 0);
}

main();
