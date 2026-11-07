import type { ShapeName } from '../../content/types';

function regular(n: number, cx: number, cy: number, r: number, rot = -90): string {
  return Array.from({ length: n }, (_, i) => {
    const a = ((rot + (360 / n) * i) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

export function ShapeSvg({ shape, color = '#4dabf7', size = 140 }: { shape: ShapeName; color?: string; size?: number }) {
  const common = { fill: color, stroke: '#343a40', strokeWidth: 3, strokeLinejoin: 'round' as const };
  let el: React.ReactNode;
  switch (shape) {
    case 'triangle':
      el = <polygon points="60,8 112,92 8,92" {...common} />;
      break;
    case 'square':
      el = <rect x="20" y="10" width="80" height="80" {...common} />;
      break;
    case 'rectangle':
      el = <rect x="4" y="24" width="112" height="54" {...common} />;
      break;
    case 'circle':
      el = <circle cx="60" cy="50" r="43" {...common} />;
      break;
    case 'oval':
      el = <ellipse cx="60" cy="50" rx="55" ry="34" {...common} />;
      break;
    case 'pentagon':
      el = <polygon points={regular(5, 60, 53, 46)} {...common} />;
      break;
    case 'hexagon':
      el = <polygon points={regular(6, 60, 50, 46, 0)} {...common} />;
      break;
    case 'rhombus':
      el = <polygon points="60,4 108,50 60,96 12,50" {...common} />;
      break;
    case 'parallelogram':
      el = <polygon points="30,20 116,20 90,82 4,82" {...common} />;
      break;
    case 'trapezoid':
      el = <polygon points="34,18 86,18 114,84 6,84" {...common} />;
      break;
    case 'kite':
      el = <polygon points="60,4 96,36 60,96 24,36" {...common} />;
      break;
    case 'triEquilateral':
      el = <polygon points="60,8 109,93 11,93" {...common} />;
      break;
    case 'triIsosceles':
      el = <polygon points="60,4 88,94 32,94" {...common} />;
      break;
    case 'triScalene':
      el = <polygon points="78,8 114,92 6,74" {...common} />;
      break;
    case 'triRight':
      el = (
        <>
          <polygon points="14,10 14,90 106,90" {...common} />
          <polyline points="14,76 28,76 28,90" fill="none" stroke="#343a40" strokeWidth="2" />
        </>
      );
      break;
    case 'triObtuse':
      // the angle at (30,88) is obtuse: the top vertex lies outside the base
      el = <polygon points="30,88 116,88 4,36" {...common} />;
      break;
  }
  return (
    <svg className="shape" width={size} height={(size * 100) / 120} viewBox="0 0 120 100" role="img" aria-hidden="true">
      {el}
    </svg>
  );
}

/** Circle or bar split into equal parts. `filled[i]` colors part i. */
export function FractionSvg({
  shape,
  parts,
  filled,
  onToggle,
  color = '#ff922b',
}: {
  shape: 'circle' | 'bar';
  parts: number;
  filled: boolean[];
  onToggle?: (i: number) => void;
  color?: string;
}) {
  const cls = onToggle ? 'fraction-svg fraction-svg--interactive' : 'fraction-svg';
  if (shape === 'bar') {
    const w = 300 / parts;
    return (
      <svg className={cls} viewBox="0 0 310 80" style={{ direction: 'ltr' }} role="img" aria-label={`מלבן מחולק ל-${parts} חלקים`}>
        {Array.from({ length: parts }, (_, i) => (
          <rect
            key={i}
            x={5 + i * w}
            y="5"
            width={w}
            height="70"
            fill={filled[i] ? color : '#fff'}
            stroke="#343a40"
            strokeWidth="3"
            onClick={onToggle ? () => onToggle(i) : undefined}
          />
        ))}
      </svg>
    );
  }
  const r = 90;
  const c = 100;
  return (
    <svg className={cls} viewBox="0 0 200 200" role="img" aria-label={`עיגול מחולק ל-${parts} חלקים`}>
      {parts === 1 ? (
        <circle cx={c} cy={c} r={r} fill={filled[0] ? color : '#fff'} stroke="#343a40" strokeWidth="3" onClick={onToggle ? () => onToggle(0) : undefined} />
      ) : (
        Array.from({ length: parts }, (_, i) => {
          const a1 = ((i / parts) * 360 - 90) * (Math.PI / 180);
          const a2 = (((i + 1) / parts) * 360 - 90) * (Math.PI / 180);
          const large = 360 / parts > 180 ? 1 : 0;
          const d = `M ${c} ${c} L ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)} A ${r} ${r} 0 ${large} 1 ${c + r * Math.cos(a2)} ${c + r * Math.sin(a2)} Z`;
          return (
            <path
              key={i}
              d={d}
              fill={filled[i] ? color : '#fff'}
              stroke="#343a40"
              strokeWidth="3"
              strokeLinejoin="round"
              onClick={onToggle ? () => onToggle(i) : undefined}
            />
          );
        })
      )}
    </svg>
  );
}

/** An object (pencil-like bar) lying on a centimeter ruler. */
export function RulerSvg({ length, emoji = '✏️', max, start = 0 }: { length: number; emoji?: string; max?: number; start?: number }) {
  const top = max ?? Math.max(10, Math.ceil(start + length + 2));
  const unit = 560 / top;
  const x0 = 20;
  const ox = x0 + start * unit;
  return (
    <svg className="ruler" viewBox="0 0 600 130" style={{ direction: 'ltr' }} role="img" aria-label="סרגל">
      <rect x={ox} y="14" width={length * unit} height="30" rx="8" fill="#ffd43b" stroke="#e67700" strokeWidth="2" />
      <line x1={ox + length * unit} y1="10" x2={ox + length * unit} y2="56" stroke="#e67700" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x={ox + (length * unit) / 2} y="38" textAnchor="middle" fontSize="20">
        {emoji}
      </text>
      <rect x="8" y="56" width="584" height="66" rx="6" fill="#fff3bf" stroke="#adb5bd" strokeWidth="2" />
      {Array.from({ length: top * 2 + 1 }, (_, i) => {
        const v = i / 2;
        const x = x0 + v * unit;
        const whole = i % 2 === 0;
        return (
          <g key={i}>
            <line x1={x} y1="56" x2={x} y2={whole ? 80 : 70} stroke="#495057" strokeWidth={whole ? 2 : 1} />
            {whole && (
              <text x={x} y="104" textAnchor="middle" className="ruler__num">
                {v}
              </text>
            )}
          </g>
        );
      })}
      <line x1={ox} y1="10" x2={ox} y2="56" stroke="#e67700" strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  );
}
