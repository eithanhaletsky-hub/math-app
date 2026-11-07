import { useRef, useState } from 'react';
import { ClockFace, clockAngleAt, type Hand } from '../visuals/ClockFace';
import type { ExerciseProps } from './types';

function angleDiff(a: number, b: number) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function ClockExercise({ q, locked, reveal, onSubmit }: ExerciseProps<'clock'>) {
  const lockMinute = q.minuteStep >= 60;
  const svgRef = useRef<SVGSVGElement>(null);
  // start away from 12 so the short hand doesn't hide under the long one
  const [time, setTime] = useState(() => ({ hour: q.answer.hour === 9 ? 3 : 9, minute: 0 }));
  const [active, setActive] = useState<Hand | null>(null);
  const [state, setState] = useState<'idle' | 'right' | 'wrong'>('idle');

  const update = (hand: Hand, clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const angle = clockAngleAt(svgRef.current, clientX, clientY);
    setState('idle');
    if (hand === 'hour') {
      // snap the short hand to whole hours (the minute part is added for display)
      setTime((t) => {
        const raw = angle / 30 - t.minute / 60;
        const h = ((Math.round(raw) % 12) + 12) % 12;
        return { ...t, hour: h === 0 ? 12 : h };
      });
    } else {
      const step = q.minuteStep;
      const m = (Math.round(angle / 6 / step) * step) % 60;
      setTime((t) => ({ ...t, minute: m }));
    }
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (locked || !svgRef.current) return;
    e.preventDefault();
    const target = (e.target as Element).closest('[data-hand]');
    let hand: Hand = (target?.getAttribute('data-hand') as Hand | null) ?? 'hour';
    if (!target && !lockMinute) {
      const a = clockAngleAt(svgRef.current, e.clientX, e.clientY);
      const ha = ((time.hour % 12) + time.minute / 60) * 30;
      const ma = time.minute * 6;
      hand = angleDiff(a, ma) < angleDiff(a, ha) ? 'minute' : 'hour';
    }
    if (lockMinute) hand = 'hour';
    setActive(hand);
    e.currentTarget.setPointerCapture(e.pointerId);
    update(hand, e.clientX, e.clientY);
  };

  const check = () => {
    if (locked) return;
    const ok = time.hour % 12 === q.answer.hour % 12 && time.minute === q.answer.minute;
    setState(ok ? 'right' : 'wrong');
    onSubmit(ok);
  };

  const shown = reveal ? q.answer : time;

  return (
    <div className={`clock-ex ${state === 'right' ? 'is-right' : ''} ${state === 'wrong' ? 'is-wrong' : ''}`}>
      <div className="clock-ex__face">
        <ClockFace
          ref={svgRef}
          hour={shown.hour}
          minute={shown.minute}
          activeHand={active}
          interactive={!locked}
          lockMinute={lockMinute}
          svgProps={{
            onPointerDown: onDown,
            onPointerMove: (e) => active && !locked && update(active, e.clientX, e.clientY),
            onPointerUp: () => setActive(null),
            onPointerCancel: () => setActive(null),
          }}
        />
      </div>
      <p className="clock-ex__legend">
        <span className="legend-dot legend-dot--hour" /> מחוג קצר — שעות
        {!lockMinute && (
          <>
            {'  '}
            <span className="legend-dot legend-dot--minute" /> מחוג ארוך — דקות
          </>
        )}
      </p>
      {!locked && (
        <button type="button" className="btn btn--go" onClick={check}>
          ✓ בדיקה
        </button>
      )}
    </div>
  );
}
