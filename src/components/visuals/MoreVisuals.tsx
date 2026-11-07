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

const AREA_COLORS = ['#d0ebff', '#d3f9d8', '#fff3bf', '#ffe3e3', '#f3d9fa', '#e3fafc'];

/** Area model: a rectangle split by place value, e.g. 23 × 4 → (20 + 3) × 4. */
export function AreaModel({ rows, cols, showProducts }: { rows: number[]; cols: number[]; showProducts?: boolean }) {
  const W = 300;
  const H = rows.length > 1 ? 170 : 110;
  const colSum = cols.reduce((a, b) => a + b, 0);
  const rowSum = rows.reduce((a, b) => a + b, 0);
  // widths proportional, but never too thin to read
  const colW = cols.map((c) => Math.max(60, (c / colSum) * W));
  const cw = colW.reduce((a, b) => a + b, 0);
  const scaleW = W / cw;
  const rowH = rows.map((r) => Math.max(50, (r / rowSum) * H));
  const rh = rowH.reduce((a, b) => a + b, 0);
  const scaleH = H / rh;
  const ox = 46;
  const oy = 34;
  let y = oy;
  return (
    <svg className="area-model" viewBox={`0 0 ${ox + W + 10} ${oy + H + 10}`} style={{ direction: 'ltr' }} role="img" aria-label={`(${cols.join(' + ')}) × (${rows.join(' + ')})`}>
      {rows.map((r, ri) => {
        const h = rowH[ri] * scaleH;
        let x = ox;
        const rowEl = (
          <g key={ri}>
            <text x={ox - 8} y={y + h / 2 + 7} textAnchor="end" className="area-model__label">
              {r}
            </text>
            {cols.map((c, ci) => {
              const w = colW[ci] * scaleW;
              const cell = (
                <g key={ci}>
                  <rect x={x} y={y} width={w} height={h} fill={AREA_COLORS[(ri * cols.length + ci) % AREA_COLORS.length]} stroke="#343a40" strokeWidth="2.5" />
                  <text x={x + w / 2} y={y + h / 2 + 7} textAnchor="middle" className="area-model__cell">
                    {showProducts ? r * c : '?'}
                  </text>
                  {ri === 0 && (
                    <text x={x + w / 2} y={oy - 10} textAnchor="middle" className="area-model__label">
                      {c}
                    </text>
                  )}
                </g>
              );
              x += w;
              return cell;
            })}
          </g>
        );
        y += h;
        return rowEl;
      })}
    </svg>
  );
}

/** Rectangle with labeled sides (and optional unit grid). Drawn to scale. */
export function RectFigure({ w, h, unit = '', grid, hideW, hideH }: { w: number; h: number; unit?: string; grid?: boolean; hideW?: boolean; hideH?: boolean }) {
  const maxW = 280;
  const maxH = 170;
  const s = Math.min(maxW / w, maxH / h, 40);
  const W = w * s;
  const H = h * s;
  const ox = 20;
  const oy = 30;
  const lbl = (n: number, hide?: boolean) => (hide ? '?' : `${n}${unit ? ' ' + unit : ''}`);
  return (
    <svg className="rect-fig" viewBox={`0 0 ${ox + W + 90} ${oy + H + 20}`} style={{ direction: 'ltr' }} role="img" aria-label="מלבן">
      <rect x={ox} y={oy} width={W} height={H} fill="#d0ebff" stroke="#1c7ed6" strokeWidth="3" />
      {grid &&
        Array.from({ length: w - 1 }, (_, i) => (
          <line key={`v${i}`} x1={ox + (i + 1) * s} y1={oy} x2={ox + (i + 1) * s} y2={oy + H} stroke="#74c0fc" strokeWidth="1.5" />
        ))}
      {grid &&
        Array.from({ length: h - 1 }, (_, i) => (
          <line key={`h${i}`} x1={ox} y1={oy + (i + 1) * s} x2={ox + W} y2={oy + (i + 1) * s} stroke="#74c0fc" strokeWidth="1.5" />
        ))}
      <text x={ox + W / 2} y={oy - 10} textAnchor="middle" className="fig-label">
        {lbl(w, hideW)}
      </text>
      <text x={ox + W + 8} y={oy + H / 2 + 6} textAnchor="start" className="fig-label">
        {lbl(h, hideH)}
      </text>
    </svg>
  );
}

/** Regular polygon with a label on each side (not to scale). */
export function PolygonFigure({ sides, unit = '' }: { sides: (number | null)[]; unit?: string }) {
  const n = sides.length;
  const cx = 150;
  const cy = 115;
  const r = 85;
  const rot = n === 4 ? -45 : -90;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = ((rot + (360 / n) * i) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  return (
    <svg className="poly-fig" viewBox="0 0 300 230" style={{ direction: 'ltr' }} role="img" aria-label={`מצולע עם ${n} צלעות`}>
      <polygon points={pts.map((p) => p.join(',')).join(' ')} fill="#fff3bf" stroke="#f08c00" strokeWidth="3" strokeLinejoin="round" />
      {sides.map((s, i) => {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[(i + 1) % n];
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const d = Math.hypot(dx, dy) || 1;
        return (
          <text key={i} x={mx + (dx / d) * 22} y={my + (dy / d) * 22 + 6} textAnchor="middle" className="fig-label">
            {s === null ? '?' : `${s}${unit ? ' ' + unit : ''}`}
          </text>
        );
      })}
    </svg>
  );
}

/** An angle drawn from a vertex with an arc. */
export function AngleFigure({ deg, rotate = 0 }: { deg: number; rotate?: number }) {
  const vx = 120;
  const vy = 150;
  const len = 120;
  const a1 = (-rotate * Math.PI) / 180;
  const a2 = (-(rotate + deg) * Math.PI) / 180;
  const p1 = [vx + len * Math.cos(a1), vy + len * Math.sin(a1)];
  const p2 = [vx + len * Math.cos(a2), vy + len * Math.sin(a2)];
  const ar = 34;
  const q1 = [vx + ar * Math.cos(a1), vy + ar * Math.sin(a1)];
  const q2 = [vx + ar * Math.cos(a2), vy + ar * Math.sin(a2)];
  return (
    <svg className="angle-fig" viewBox="0 0 260 180" role="img" aria-label="זווית">
      <path d={`M ${q1[0]} ${q1[1]} A ${ar} ${ar} 0 ${deg > 180 ? 1 : 0} 0 ${q2[0]} ${q2[1]}`} fill="none" stroke="#f08c00" strokeWidth="3" />
      <line x1={vx} y1={vy} x2={p1[0]} y2={p1[1]} stroke="#343a40" strokeWidth="5" strokeLinecap="round" />
      <line x1={vx} y1={vy} x2={p2[0]} y2={p2[1]} stroke="#343a40" strokeWidth="5" strokeLinecap="round" />
      <circle cx={vx} cy={vy} r="5" fill="#343a40" />
    </svg>
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
