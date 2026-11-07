import { useState } from 'react';
import { FractionSvg } from '../visuals/ShapeSvg';
import type { ExerciseProps } from './types';

export function FractionExercise({ q, locked, reveal, onSubmit }: ExerciseProps<'fraction'>) {
  const [filled, setFilled] = useState<boolean[]>(() => Array(q.parts).fill(false));
  const [state, setState] = useState<'idle' | 'right' | 'wrong'>('idle');
  const count = filled.filter(Boolean).length;

  const toggle = (i: number) => {
    if (locked) return;
    setState('idle');
    setFilled((f) => f.map((v, j) => (j === i ? !v : v)));
  };

  const check = () => {
    if (locked) return;
    const ok = count === q.answer;
    setState(ok ? 'right' : 'wrong');
    onSubmit(ok);
  };

  const shown = reveal ? Array.from({ length: q.parts }, (_, i) => i < q.answer) : filled;

  return (
    <div className={`fraction-ex ${state === 'right' ? 'is-right' : ''} ${state === 'wrong' ? 'is-wrong' : ''}`}>
      <div className={`fraction-ex__shape fraction-ex__shape--${q.shape}`}>
        <FractionSvg shape={q.shape} parts={q.parts} filled={shown} onToggle={locked ? undefined : toggle} />
      </div>
      <div className="fraction-ex__count" dir="ltr">
        {reveal ? q.answer : count} / {q.parts}
      </div>
      {!locked && (
        <button type="button" className="btn btn--go" onClick={check}>
          ✓ בדיקה
        </button>
      )}
    </div>
  );
}
