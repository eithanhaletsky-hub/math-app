import { useRef, useState } from 'react';
import { NumberLineSvg, nlValueAt } from '../visuals/NumberLineSvg';
import type { ExerciseProps } from './types';

export function NumberLineExercise({ q, locked, reveal, onSubmit }: ExerciseProps<'numberline'>) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const [marker, setMarker] = useState<number | null>(null);
  const [state, setState] = useState<'normal' | 'right' | 'wrong'>('normal');

  const moveTo = (clientX: number) => {
    if (!svgRef.current) return;
    setMarker(nlValueAt(svgRef.current, clientX, q.min, q.max, q.step));
    setState('normal');
  };

  const check = () => {
    if (marker === null || locked) return;
    const ok = Math.abs(marker - q.answer) < 1e-9;
    setState(ok ? 'right' : 'wrong');
    onSubmit(ok);
  };

  return (
    <div className="nl-ex">
      <div className="nl-ex__line">
        <NumberLineSvg
          ref={svgRef}
          min={q.min}
          max={q.max}
          step={q.step}
          labelEvery={q.labelEvery}
          marker={marker}
          markerState={state}
          highlight={reveal ? [q.answer] : []}
          interactive={!locked}
          svgProps={{
            onPointerDown: (e) => {
              if (locked) return;
              dragging.current = true;
              (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
              moveTo(e.clientX);
            },
            onPointerMove: (e) => {
              if (dragging.current && !locked) moveTo(e.clientX);
            },
            onPointerUp: () => {
              dragging.current = false;
            },
            onPointerCancel: () => {
              dragging.current = false;
            },
          }}
        />
      </div>
      {!locked && (
        <button type="button" className="btn btn--go" onClick={check} disabled={marker === null}>
          ✓ בדיקה
        </button>
      )}
    </div>
  );
}
