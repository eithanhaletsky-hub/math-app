import { useCallback, useEffect, useState } from 'react';
import type { ExerciseProps } from './types';

const MAX_LEN = 7;

export function InputExercise({ q, locked, reveal, onSubmit }: ExerciseProps<'input'>) {
  const [value, setValue] = useState('');
  const [shake, setShake] = useState(0);
  const [state, setState] = useState<'idle' | 'right' | 'wrong'>('idle');

  const press = useCallback(
    (key: string) => {
      if (locked) return;
      setState('idle');
      setValue((v) => {
        if (key === 'back') return v.slice(0, -1);
        if (key === '.') return v.includes('.') || !q.decimal ? v : (v || '0') + '.';
        if (v.length >= MAX_LEN) return v;
        if (v === '0') return key;
        return v + key;
      });
    },
    [locked, q.decimal],
  );

  const check = useCallback(() => {
    if (locked || value === '' || value === '.') return;
    const num = Number(value);
    const ok = Math.abs(num - q.answer) < 1e-9;
    if (ok) {
      setState('right');
    } else {
      setState('wrong');
      setShake((s) => s + 1);
      setTimeout(() => setValue(''), 700);
    }
    onSubmit(ok);
  }, [locked, value, q.answer, onSubmit]);

  // physical keyboard (desktop)
  useEffect(() => {
    if (locked) return;
    const on = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('back');
      else if (e.key === '.' || e.key === ',') press('.');
      else if (e.key === 'Enter') check();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [locked, press, check]);

  const shown = reveal ? String(q.answer) : value;

  return (
    <div className="input-ex">
      <div
        key={shake}
        className={`answer-box ${state === 'right' ? 'is-right' : ''} ${state === 'wrong' ? 'is-wrong shake' : ''} ${reveal ? 'is-reveal' : ''}`}
        dir="ltr"
        aria-live="polite"
        aria-label="התשובה שלך"
      >
        {shown || <span className="answer-box__placeholder">?</span>}
      </div>
      {!locked && (
        <div className="keypad" dir="ltr">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
            <button key={k} type="button" className="key" onClick={() => press(k)}>
              {k}
            </button>
          ))}
          <button type="button" className="key key--soft" onClick={() => press('back')} aria-label="מחק">
            ⌫
          </button>
          <button type="button" className="key" onClick={() => press('0')}>
            0
          </button>
          {q.decimal ? (
            <button type="button" className="key key--soft" onClick={() => press('.')} aria-label="נקודה עשרונית">
              .
            </button>
          ) : (
            <button type="button" className="key key--go" onClick={check} disabled={!value} aria-label="בדיקה">
              ✓
            </button>
          )}
          {q.decimal && (
            <button type="button" className="key key--go key--wide" onClick={check} disabled={!value}>
              ✓ בדיקה
            </button>
          )}
        </div>
      )}
    </div>
  );
}
