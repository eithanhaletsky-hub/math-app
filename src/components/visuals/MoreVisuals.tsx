import type { SolidName } from '../../content/types';

/** Column arithmetic: numbers right-aligned by place value, operator on the left. */
export function VerticalSum({ rows, op, result }: { rows: number[]; op: '+' | '−'; result?: number | null }) {
  const width = Math.max(...rows.map((r) => String(r).length), result != null ? String(result).length : 0);
  const cells = (n: number | string) => String(n).padStart(width, ' ').split('');
  const answer = result === undefined ? null : result;
  return (
    <div className="vertical" dir="ltr" role="img" aria-label={rows.join(` ${op} `)}>
      {rows.map((r, i) => (
        <div key={i} className="vertical__row">
          <span className="vertical__op">{i === rows.length - 1 ? op : ''}</span>
          {cells(r).map((d, j) => (
            <span key={j} className="vertical__cell">
              {d.trim()}
            </span>
          ))}
        </div>
      ))}
      <div className="vertical__line" />
      <div className="vertical__row">
        <span className="vertical__op" />
        {answer === null ? (
          // one box for the whole answer: the answer may have more digits than the numbers above
          <span className="vertical__q">?</span>
        ) : (
          cells(answer).map((d, j) => (
              <span key={j} className="vertical__cell vertical__cell--ans">
                {d.trim()}
              </span>
            ))
        )}
      </div>
    </div>
  );
}

function moneyLabel(v: number): { big: string; small: string } {
  if (v < 1) return { big: String(Math.round(v * 100)), small: "אג'" };
  return { big: String(v), small: '₪' };
}

/** Generic coins and notes (not copies of real designs): circles and rectangles with the value. */
export function Money({ items }: { items: number[] }) {
  return (
    <div className="money" dir="ltr">
      {items.map((v, i) => {
        const { big, small } = moneyLabel(v);
        if (v >= 20) {
          return (
            <span key={i} className={`note note--${v}`} aria-label={`שטר של ${v} שקלים`}>
              <span className="note__big">{big}</span>
              <span className="note__small">{small}</span>
            </span>
          );
        }
        const kind = v < 1 ? 'agora' : v === 10 ? 'ten' : 'shekel';
        return (
          <span key={i} className={`coin coin--${kind} ${v >= 5 ? 'coin--lg' : v < 1 ? 'coin--sm' : ''}`} aria-label={`מטבע של ${big} ${small}`}>
            <span className="coin__big">{big}</span>
            <span className="coin__small">{small}</span>
          </span>
        );
      })}
    </div>
  );
}

export function ArrayGrid({ rows, cols, emoji }: { rows: number; cols: number; emoji?: string }) {
  return (
    <div className="array" dir="ltr" style={{ gridTemplateColumns: `repeat(${cols}, auto)` }} aria-label={`${rows} שורות של ${cols}`}>
      {Array.from({ length: rows * cols }, (_, i) => (
        <span key={i} className="array__cell">
          {emoji ?? <span className="array__dot" />}
        </span>
      ))}
    </div>
  );
}

/** Simple, shaded 3D solids. */
export function SolidSvg({ solid, color = '#74c0fc', size = 140 }: { solid: SolidName; color?: string; size?: number }) {
  const stroke = { stroke: '#343a40', strokeWidth: 2.5, strokeLinejoin: 'round' as const };
  const dark = 'rgba(0,0,0,0.18)';
  const light = 'rgba(255,255,255,0.35)';
  let el: React.ReactNode;
  switch (solid) {
    case 'cube':
      el = (
        <>
          <polygon points="25,40 75,40 75,90 25,90" fill={color} {...stroke} />
          <polygon points="25,40 45,22 95,22 75,40" fill={color} {...stroke} />
          <polygon points="25,40 45,22 95,22 75,40" fill={light} />
          <polygon points="75,40 95,22 95,72 75,90" fill={color} {...stroke} />
          <polygon points="75,40 95,22 95,72 75,90" fill={dark} />
        </>
      );
      break;
    case 'box':
      el = (
        <>
          <polygon points="10,48 85,48 85,90 10,90" fill={color} {...stroke} />
          <polygon points="10,48 32,30 107,30 85,48" fill={color} {...stroke} />
          <polygon points="10,48 32,30 107,30 85,48" fill={light} />
          <polygon points="85,48 107,30 107,72 85,90" fill={color} {...stroke} />
          <polygon points="85,48 107,30 107,72 85,90" fill={dark} />
        </>
      );
      break;
    case 'cylinder':
      el = (
        <>
          <path d="M28 25 L28 80 A32 11 0 0 0 92 80 L92 25" fill={color} {...stroke} />
          <ellipse cx="60" cy="25" rx="32" ry="11" fill={color} {...stroke} />
          <ellipse cx="60" cy="25" rx="32" ry="11" fill={light} />
        </>
      );
      break;
    case 'cone':
      el = (
        <>
          <path d="M60 8 L28 80 A32 11 0 0 0 92 80 Z" fill={color} {...stroke} />
          <path d="M60 8 L76 86 A32 11 0 0 0 92 80 Z" fill={dark} />
        </>
      );
      break;
    case 'sphere':
      el = (
        <>
          <circle cx="60" cy="52" r="40" fill={color} {...stroke} />
          <circle cx="47" cy="38" r="12" fill={light} />
          <path d="M20 52 A40 12 0 0 0 100 52" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
        </>
      );
      break;
    case 'pyramid':
      el = (
        <>
          <polygon points="60,8 20,82 72,94" fill={color} {...stroke} />
          <polygon points="60,8 72,94 102,72" fill={color} {...stroke} />
          <polygon points="60,8 72,94 102,72" fill={dark} />
        </>
      );
      break;
  }
  return (
    <svg className="shape" width={size} height={(size * 100) / 120} viewBox="0 0 120 100" aria-hidden="true">
      {el}
    </svg>
  );
}
