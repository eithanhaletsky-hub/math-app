import { useState } from 'react';
import { VisualView } from '../visuals/VisualView';
import { MathText } from '../RichText';
import type { ExerciseProps } from './types';

export function ChoiceExercise({ q, locked, reveal, onSubmit }: ExerciseProps<'choice'>) {
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [chosen, setChosen] = useState<string | null>(null);
  const hasVisuals = q.options.some((o) => o.visual);
  const layout = q.optionsLayout ?? (hasVisuals || q.options.length > 4 ? 'grid' : 'row');

  const choose = (value: string) => {
    if (locked || wrong.has(value)) return;
    setChosen(value);
    const ok = value === q.answer;
    if (!ok) setWrong((w) => new Set(w).add(value));
    onSubmit(ok);
  };

  return (
    <div className={`choices choices--${layout}`}>
      {q.options.map((o) => {
        const isRight = (chosen === o.value && o.value === q.answer) || (reveal && o.value === q.answer);
        const isWrong = wrong.has(o.value);
        return (
          <button
            key={o.value}
            type="button"
            className={`choice ${o.visual ? 'choice--visual' : ''} ${isRight ? 'is-right' : ''} ${isWrong ? 'is-wrong' : ''}`}
            onClick={() => choose(o.value)}
            disabled={locked && !isRight}
            aria-label={o.label}
          >
            {o.visual ? <VisualView v={o.visual} /> : <MathText>{o.label}</MathText>}
          </button>
        );
      })}
    </div>
  );
}
