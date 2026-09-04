// evals/eval-a11y-review 평가용 fixture.
// 접근성 위반 5종을 의도적으로 포함한다. 정답 위반 목록은 이 디렉터리의
// rubric.md를 참고할 것 — 이 파일 자체에는 위반 위치를 알려주는 힌트를
// 남기지 않는다(리뷰 대상 스킬이 스스로 찾아내야 하므로).

import React from 'react';

interface BadFormProps {
  onSubmit: () => void;
}

export function BadForm({ onSubmit }: BadFormProps) {
  return (
    <div style={{ backgroundColor: '#003764', padding: '16px' }}>
      <h2 style={{ color: '#ffffff' }}>민원 신청 폼</h2>

      <img src="/icons/info.png" />

      <div className="field">
        <input type="text" name="applicantName" placeholder="이름을 입력하세요" />
      </div>

      <div className="field">
        <input type="tel" name="phone" placeholder="연락처를 입력하세요" />
      </div>

      <div className="agree-toggle" onClick={() => console.log('toggle')}>
        약관에 동의합니다
      </div>

      <button
        onClick={onSubmit}
        style={{ width: '30px', height: '30px', backgroundColor: '#1e40af', border: 'none' }}
      >
        제출
      </button>
    </div>
  );
}
