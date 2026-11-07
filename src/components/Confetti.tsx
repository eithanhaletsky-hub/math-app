import { useMemo } from 'react';

const COLORS = ['#ff6b6b', '#ffd43b', '#51cf66', '#4dabf7', '#cc5de8', '#ff922b'];

/** CSS confetti burst. Re-mount (change `key`) to fire again. */
export function Confetti({ pieces = 60 }: { pieces?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.6 + Math.random() * 1.2,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 160,
        round: Math.random() < 0.3,
      })),
    [pieces],
  );
  return (
    <div className="confetti" aria-hidden="true">
      {items.map((p) => (
        <span
          key={p.id}
          style={
            {
              left: `${p.left}%`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              borderRadius: p.round ? '50%' : '2px',
              '--rot': `${p.rotate}deg`,
              '--drift': `${p.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
