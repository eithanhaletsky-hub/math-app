import { forwardRef } from 'react';

export type Hand = 'hour' | 'minute';

/** Angle in degrees (0 = 12 o'clock, clockwise) from a pointer position. */
export function clockAngleAt(svg: SVGSVGElement, clientX: number, clientY: number): number {
  const r = svg.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const deg = (Math.atan2(clientX - cx, cy - clientY) * 180) / Math.PI;
  return (deg + 360) % 360;
}

interface Props {
  hour: number;
  minute: number;
  activeHand?: Hand | null;
  interactive?: boolean;
  lockMinute?: boolean;
  svgProps?: React.SVGProps<SVGSVGElement>;
}

function handEnd(angle: number, len: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: 100 + Math.sin(rad) * len, y: 100 - Math.cos(rad) * len };
}

export const ClockFace = forwardRef<SVGSVGElement, Props>(function ClockFace(
  { hour, minute, activeHand, interactive, lockMinute, svgProps },
  ref,
) {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  const h = handEnd(hourAngle, 46);
  const m = handEnd(minuteAngle, 70);
  return (
    <svg
      ref={ref}
      className={`clock ${interactive ? 'clock--interactive' : ''}`}
      viewBox="0 0 200 200"
      style={{ direction: 'ltr' }}
      role="img"
      aria-label={`שעון: ${hour}:${String(minute).padStart(2, '0')}`}
      {...svgProps}
    >
      <circle cx="100" cy="100" r="95" fill="#fff" stroke="#495057" strokeWidth="5" />
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0;
        const a = handEnd(i * 6, big ? 82 : 86);
        const b = handEnd(i * 6, 90);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#868e96" strokeWidth={big ? 3 : 1.2} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const p = handEnd(n * 30, 68);
        return (
          <text key={n} x={p.x} y={p.y + 7} textAnchor="middle" className="clock__num">
            {n}
          </text>
        );
      })}
      {/* minute hand (long) */}
      <line
        x1="100"
        y1="100"
        x2={m.x}
        y2={m.y}
        stroke={activeHand === 'minute' ? '#1c7ed6' : '#228be6'}
        strokeWidth={activeHand === 'minute' ? 6 : 4.5}
        strokeLinecap="round"
      />
      {/* hour hand (short) */}
      <line
        x1="100"
        y1="100"
        x2={h.x}
        y2={h.y}
        stroke={activeHand === 'hour' ? '#c92a2a' : '#e03131'}
        strokeWidth={activeHand === 'hour' ? 10 : 8}
        strokeLinecap="round"
      />
      {interactive && (
        <>
          {/* big invisible grab areas */}
          {!lockMinute && (
            <line data-hand="minute" x1="100" y1="100" x2={m.x} y2={m.y} stroke="transparent" strokeWidth="26" strokeLinecap="round" />
          )}
          <line data-hand="hour" x1="100" y1="100" x2={h.x} y2={h.y} stroke="transparent" strokeWidth="30" strokeLinecap="round" />
          <circle data-hand="hour" cx={h.x} cy={h.y} r="14" fill="#e03131" opacity="0.25" />
          {!lockMinute && <circle data-hand="minute" cx={m.x} cy={m.y} r="12" fill="#228be6" opacity="0.25" />}
        </>
      )}
      <circle cx="100" cy="100" r="6" fill="#343a40" />
    </svg>
  );
});
