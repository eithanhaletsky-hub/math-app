import { Fragment } from 'react';

/** Stacked fraction, e.g. <Frac n={3} d={4} />. */
export function Frac({ n, d }: { n: string | number; d: string | number }) {
  return (
    <span className="frac" role="math" aria-label={`${n} חלקי ${d}`}>
      <span className="frac__n">{n}</span>
      <span className="frac__d">{d}</span>
    </span>
  );
}

/** Math shown left-to-right and isolated from the surrounding Hebrew. "a/b" → stacked fraction. */
export function MathText({ children, className = '' }: { children: string; className?: string }) {
  const parts = children.split(/(\d+\/\d+)/g);
  return (
    <bdi dir="ltr" className={`math ${className}`}>
      {parts.map((p, i) => {
        const m = /^(\d+)\/(\d+)$/.exec(p);
        return m ? <Frac key={i} n={m[1]} d={m[2]} /> : <Fragment key={i}>{p}</Fragment>;
      })}
    </bdi>
  );
}

/** Hebrew text with [[math]] and **bold** markup. */
export function RichText({ text }: { text: string }) {
  const tokens = text.split(/(\[\[.+?\]\]|\*\*.+?\*\*)/g);
  return (
    <>
      {tokens.map((t, i) => {
        if (t.startsWith('[[') && t.endsWith(']]')) return <MathText key={i}>{t.slice(2, -2)}</MathText>;
        if (t.startsWith('**') && t.endsWith('**')) return <strong key={i}>{t.slice(2, -2)}</strong>;
        return <Fragment key={i}>{t}</Fragment>;
      })}
    </>
  );
}
