import { useState } from 'react';
import type { Visual } from '../../content/types';
import { NumberLineSvg } from './NumberLineSvg';
import { ClockFace } from './ClockFace';
import { FractionSvg, RulerSvg, ShapeSvg } from './ShapeSvg';

function Objects({ emoji, groups, crossed = 0, tappable }: { emoji: string; groups: number[]; crossed?: number; tappable?: boolean }) {
  const total = groups.reduce((a, b) => a + b, 0);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  let idx = 0;
  const toggle = (i: number) =>
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  return (
    <div className="objects" dir="ltr">
      {groups.map((g, gi) => (
        <div key={gi} className={`objects__group ${groups.length > 1 ? 'objects__group--boxed' : ''}`}>
          {Array.from({ length: g }, () => {
            const i = idx++;
            const isCrossed = i >= total - crossed;
            const isMarked = marked.has(i);
            return tappable ? (
              <button
                key={i}
                type="button"
                className={`obj ${isMarked ? 'obj--marked' : ''} ${isCrossed ? 'obj--crossed' : ''}`}
                onClick={() => toggle(i)}
                aria-label={isMarked ? 'נספר' : 'לא נספר'}
              >
                {emoji}
              </button>
            ) : (
              <span key={i} className={`obj ${isCrossed ? 'obj--crossed' : ''}`}>
                {emoji}
              </span>
            );
          })}
        </div>
      ))}
      {tappable && marked.size > 0 && <div className="objects__count">✓ {marked.size}</div>}
    </div>
  );
}

function TenFrame({ filled, frames = 1 }: { filled: number; frames?: 1 | 2 }) {
  return (
    <div className="tenframes" dir="ltr">
      {Array.from({ length: frames }, (_, f) => (
        <div key={f} className="tenframe">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="tenframe__cell">
              {f * 10 + i < filled && <span className="tenframe__dot" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Bond({ whole, parts }: { whole: number | null; parts: [number | null, number | null] }) {
  const t = (v: number | null) => (v === null ? '?' : String(v));
  return (
    <svg className="bond" viewBox="0 0 220 160" role="img" aria-label="פירוק מספר">
      <line x1="110" y1="42" x2="168" y2="118" stroke="#868e96" strokeWidth="4" />
      <line x1="110" y1="42" x2="52" y2="118" stroke="#868e96" strokeWidth="4" />
      <circle cx="110" cy="38" r="32" fill="#ffe066" stroke="#f08c00" strokeWidth="3" />
      <circle cx="168" cy="122" r="30" fill={parts[0] === null ? '#fff' : '#a5d8ff'} stroke="#1c7ed6" strokeWidth="3" />
      <circle cx="52" cy="122" r="30" fill={parts[1] === null ? '#fff' : '#a5d8ff'} stroke="#1c7ed6" strokeWidth="3" />
      <text x="110" y="49" textAnchor="middle" className="bond__num">{t(whole)}</text>
      <text x="168" y="133" textAnchor="middle" className="bond__num">{t(parts[0])}</text>
      <text x="52" y="133" textAnchor="middle" className="bond__num">{t(parts[1])}</text>
    </svg>
  );
}

function Blocks({ hundreds = 0, tens, ones }: { hundreds?: number; tens: number; ones: number }) {
  return (
    <div className="blocks" dir="ltr" aria-label={`${hundreds} מאות, ${tens} עשרות, ${ones} יחידות`}>
      {hundreds > 0 && (
        <div className="blocks__col">
          {Array.from({ length: hundreds }, (_, i) => (
            <div key={i} className="block-hundred" />
          ))}
        </div>
      )}
      <div className="blocks__col blocks__col--tens">
        {Array.from({ length: tens }, (_, i) => (
          <div key={i} className="block-ten" />
        ))}
      </div>
      <div className="blocks__col blocks__col--ones">
        {Array.from({ length: ones }, (_, i) => (
          <div key={i} className="block-one" />
        ))}
      </div>
    </div>
  );
}

function Hundred({ highlight = [], hidden = [], from = 1 }: { highlight?: number[]; hidden?: number[]; from?: number }) {
  return (
    <div className="hundred" dir="ltr">
      {Array.from({ length: 100 }, (_, i) => {
        const n = from + i;
        const hl = highlight.includes(n);
        const hid = hidden.includes(n);
        return (
          <div key={n} className={`hundred__cell ${hl ? 'hundred__cell--hl' : ''} ${hid ? 'hundred__cell--hidden' : ''}`}>
            {hid ? '?' : n}
          </div>
        );
      })}
    </div>
  );
}

export function VisualView({ v }: { v: Visual }) {
  switch (v.type) {
    case 'objects':
      return <Objects emoji={v.emoji} groups={v.groups} crossed={v.crossed} tappable={v.tappable} />;
    case 'tenframe':
      return <TenFrame filled={v.filled} frames={v.frames} />;
    case 'numberline':
      return (
        <NumberLineSvg
          min={v.min}
          max={v.max}
          step={v.step}
          labelEvery={v.labelEvery}
          highlight={v.highlight}
          jumps={v.jumps}
          hideLabels={v.hideLabels}
        />
      );
    case 'hundred':
      return <Hundred highlight={v.highlight} hidden={v.hidden} from={v.from} />;
    case 'blocks':
      return <Blocks hundreds={v.hundreds} tens={v.tens} ones={v.ones} />;
    case 'clock':
      return <ClockFace hour={v.hour} minute={v.minute} />;
    case 'shape':
      return <ShapeSvg shape={v.shape} color={v.color} />;
    case 'ruler':
      return <RulerSvg length={v.length} emoji={v.emoji} max={v.max} />;
    case 'bond':
      return <Bond whole={v.whole} parts={v.parts} />;
    case 'fraction':
      return (
        <FractionSvg shape={v.shape} parts={v.parts} filled={Array.from({ length: v.parts }, (_, i) => i < v.filled)} />
      );
  }
}
