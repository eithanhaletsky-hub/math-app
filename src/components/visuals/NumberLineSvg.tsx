import { forwardRef } from 'react';

export const NL_W = 640;
export const NL_PAD = 34;
export const NL_Y = 62;

export function nlX(v: number, min: number, max: number): number {
  return NL_PAD + ((v - min) / (max - min)) * (NL_W - 2 * NL_PAD);
}

/** Converts a pointer x (client coords) to the nearest value on the line. */
export function nlValueAt(svg: SVGSVGElement, clientX: number, min: number, max: number, step: number): number {
  const r = svg.getBoundingClientRect();
  const x = ((clientX - r.left) / r.width) * NL_W;
  const raw = min + ((x - NL_PAD) / (NL_W - 2 * NL_PAD)) * (max - min);
  const snapped = Math.round((raw - min) / step) * step + min;
  const clamped = Math.max(min, Math.min(max, snapped));
  return Number(clamped.toFixed(6));
}

export interface NumberLineProps {
  min: number;
  max: number;
  step?: number;
  labelEvery?: number;
  highlight?: number[];
  jumps?: { from: number; to: number }[];
  hideLabels?: number[];
  marker?: number | null;
  markerState?: 'normal' | 'right' | 'wrong';
  interactive?: boolean;
  svgProps?: React.SVGProps<SVGSVGElement>;
}

function fmt(v: number): string {
  return String(Number(v.toFixed(4)));
}

export const NumberLineSvg = forwardRef<SVGSVGElement, NumberLineProps>(function NumberLineSvg(
  { min, max, step = 1, labelEvery = 1, highlight = [], jumps = [], hideLabels = [], marker, markerState = 'normal', interactive, svgProps },
  ref,
) {
  const ticks: number[] = [];
  const n = Math.round((max - min) / step);
  for (let i = 0; i <= n; i++) ticks.push(Number((min + i * step).toFixed(6)));
  const isLabel = (v: number) =>
    v === min || v === max || Math.abs(v / labelEvery - Math.round(v / labelEvery)) < 1e-6;
  const x = (v: number) => nlX(v, min, max);
  return (
    <svg
      ref={ref}
      className={`numberline ${interactive ? 'numberline--interactive' : ''}`}
      viewBox={`0 0 ${NL_W} 100`}
      style={{ direction: 'ltr' }}
      role="img"
      aria-label={`ציר מספרים מ-${fmt(min)} עד ${fmt(max)}`}
      {...svgProps}
    >
      {interactive && <rect x="0" y="0" width={NL_W} height="100" fill="transparent" />}
      <line x1={NL_PAD - 14} y1={NL_Y} x2={NL_W - NL_PAD + 14} y2={NL_Y} stroke="#495057" strokeWidth="3" strokeLinecap="round" />
      <polygon points={`${NL_W - NL_PAD + 22},${NL_Y} ${NL_W - NL_PAD + 10},${NL_Y - 7} ${NL_W - NL_PAD + 10},${NL_Y + 7}`} fill="#495057" />
      {jumps.map((j, i) => {
        const x1 = x(j.from);
        const x2 = x(j.to);
        const h = Math.min(40, 14 + Math.abs(x2 - x1) * 0.35);
        const dir = x2 > x1 ? 1 : -1;
        return (
          <g key={`j${i}`} className="nl-jump">
            <path d={`M ${x1} ${NL_Y - 4} Q ${(x1 + x2) / 2} ${NL_Y - 4 - h * 1.6} ${x2} ${NL_Y - 4}`} fill="none" stroke="#f76707" strokeWidth="3" />
            <polygon points={`${x2},${NL_Y - 3} ${x2 - dir * 9},${NL_Y - 12} ${x2 - dir * 2},${NL_Y - 14}`} fill="#f76707" />
          </g>
        );
      })}
      {ticks.map((v) => {
        const label = isLabel(v);
        const tx = x(v);
        return (
          <g key={v}>
            <line x1={tx} y1={NL_Y - (label ? 10 : 6)} x2={tx} y2={NL_Y + (label ? 10 : 6)} stroke="#495057" strokeWidth={label ? 2.5 : 1.5} />
            {label && (
              <text x={tx} y={NL_Y + 32} textAnchor="middle" className="nl-label">
                {hideLabels.includes(v) ? '?' : fmt(v)}
              </text>
            )}
          </g>
        );
      })}
      {highlight.map((v) => (
        <circle key={`h${v}`} cx={x(v)} cy={NL_Y} r="9" fill="#f03e3e" stroke="#fff" strokeWidth="2" />
      ))}
      {marker != null && (
        <g className={`nl-marker nl-marker--${markerState}`} transform={`translate(${x(marker)} 0)`}>
          <line x1="0" y1={NL_Y - 30} x2="0" y2={NL_Y} strokeWidth="4" />
          <circle cx="0" cy={NL_Y - 36} r="13" />
          <text x="0" y={NL_Y - 31} textAnchor="middle" className="nl-marker__text">
            {fmt(marker)}
          </text>
        </g>
      )}
    </svg>
  );
});
