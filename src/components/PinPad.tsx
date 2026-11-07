import { useEffect, useRef, useState } from 'react';

/** 4-digit PIN entry with a big on-screen keypad (and physical keyboard support). */
export function PinPad({ onComplete, error }: { onComplete: (pin: string) => void; error?: number }) {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(0);

  // parent signals a wrong PIN by bumping `error`
  useEffect(() => {
    if (!error) return;
    setShake((s) => s + 1);
    setPin('');
  }, [error]);

  const pinRef = useRef('');
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  const press = (k: string) => {
    const p = pinRef.current;
    let next = p;
    if (k === 'back') next = p.slice(0, -1);
    else if (p.length < 4) next = p + k;
    pinRef.current = next;
    setPin(next);
    if (next.length === 4 && p.length === 3) setTimeout(() => doneRef.current(next), 150);
  };
  const pressRef = useRef(press);
  pressRef.current = press;

  useEffect(() => {
    if (!error) return;
    pinRef.current = '';
  }, [error]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) pressRef.current(e.key);
      else if (e.key === 'Backspace') pressRef.current('back');
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);

  return (
    <div className="pinpad">
      <div key={shake} className={`pin-dots ${shake ? 'shake' : ''}`} dir="ltr" aria-label={`${pin.length} ספרות הוקלדו`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`pin-dot ${i < pin.length ? 'pin-dot--on' : ''}`} />
        ))}
      </div>
      <div className="keypad" dir="ltr">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
          <button key={k} type="button" className="key" onClick={() => press(k)}>
            {k}
          </button>
        ))}
        <span />
        <button type="button" className="key" onClick={() => press('0')}>
          0
        </button>
        <button type="button" className="key key--soft" onClick={() => press('back')} aria-label="מחק">
          ⌫
        </button>
      </div>
    </div>
  );
}
