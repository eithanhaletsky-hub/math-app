import type { Level, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { PEOPLE, g } from '../../lib/things';

const split = (n: number) => [Math.floor(n / 10) * 10, n % 10].filter((x) => x > 0);

const twoByTwo: Level = {
  id: 'g4-mul-1',
  title: 'דו-ספרתי כפול דו-ספרתי',
  intro: {
    lines: ['מפרקים את שני המספרים: [[23 × 14]] → (20 + 3) × (10 + 4).', 'מחשבים 4 מלבנים ומחברים: 200 + 80 + 30 + 12 = 322.'],
    visual: { type: 'area', rows: [10, 4], cols: [20, 3], showProducts: true },
  },
  generate: () => {
    const a = randInt(11, 49);
    const b = randInt(11, 29);
    const rows = split(b);
    const cols = split(a);
    return {
      kind: 'input',
      text: `חשב בעזרת מודל השטח: [[${a} × ${b}]]`,
      visual: { type: 'area', rows, cols },
      answer: a * b,
      hint: `חשב כל מלבן: ${rows.flatMap((r) => cols.map((c) => `${c} × ${r}`)).join(', ')}. ואז חבר הכול.`,
      explain: `${rows.flatMap((r) => cols.map((c) => c * r)).join(' + ')} = ${a * b}`,
      explainVisual: { type: 'area', rows, cols, showProducts: true },
    };
  },
};

const tensTimesTens: Level = {
  id: 'g4-mul-2',
  title: 'עשרות כפול עשרות',
  intro: {
    lines: ['[[30 × 40]]: מחשבים 3 × 4 = 12, ומוסיפים את שני האפסים → 1,200.'],
    expr: '3 × 4 = 12  →  30 × 40 = 1,200',
  },
  generate: () => {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const za = pick([10, 100]);
    const zb = 10;
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${a * za} × ${b * zb} = ?`,
      answer: a * za * b * zb,
      hint: `${a} × ${b} = ${a * b}. כמה אפסים יש בשני המספרים יחד?`,
      explain: `${a} × ${b} = ${a * b}, ועם האפסים: ${(a * za * b * zb).toLocaleString('en-US')}.`,
    };
  },
};

const longMult: Level = {
  id: 'g4-mul-3',
  title: 'כפל במאונך',
  intro: {
    lines: ['בכפל במאונך כופלים קודם ביחידות, אחר כך בעשרות (ומוסיפים 0),', 'ובסוף מחברים את שתי השורות.'],
    expr: '46 × 23 = 46 × 3 + 46 × 20 = 138 + 920 = 1,058',
  },
  generate: () => {
    const a = randInt(21, 99);
    const b = randInt(12, 39);
    const ones = a * (b % 10);
    const tens = a * Math.floor(b / 10) * 10;
    return {
      kind: 'input',
      text: 'פתור (אפשר במאונך על דף):',
      expr: `${a} × ${b} = ?`,
      answer: a * b,
      hint: `${a} × ${b % 10} = ${ones}. ${a} × ${Math.floor(b / 10) * 10} = ${tens}. עכשיו חבר.`,
      explain: `${ones} + ${tens} = ${(a * b).toLocaleString('en-US')}`,
    };
  },
};

const stories: Level = {
  id: 'g4-mul-4',
  title: 'סיפורי כפל',
  intro: { lines: ['קרא, חשוב אם יש קבוצות שוות — וכפול.'] },
  generate: () => {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const rows = randInt(12, 25);
      const seats = randInt(14, 30);
      return {
        kind: 'input',
        text: `באולם ${rows} שורות, ובכל שורה ${seats} כיסאות. כמה כיסאות יש באולם?`,
        answer: rows * seats,
        hint: `${rows} × ${seats}`,
        explain: `${rows} × ${seats} = ${rows * seats}`,
      };
    }
    if (kind === 1) {
      const p = pick(PEOPLE);
      const amount = pick([15, 20, 25, 35]);
      const weeks = randInt(4, 12);
      return {
        kind: 'input',
        text: `${p.name} ${g(p, 'חוסך', 'חוסכת')} ${amount} ₪ בכל שבוע. כמה ${g(p, 'יחסוך', 'תחסוך')} ב-${weeks} שבועות?`,
        answer: amount * weeks,
        hint: `${weeks} × ${amount}`,
        explain: `${weeks} × ${amount} = ${amount * weeks} ₪`,
      };
    }
    const days = randInt(12, 31);
    const km = randInt(12, 45);
    return {
      kind: 'input',
      text: `משאית נוסעת ${km} ק"מ בכל יום. כמה ק"מ תיסע ב-${days} ימים?`,
      answer: km * days,
      hint: `${km} × ${days}`,
      explain: `${km} × ${days} = ${km * days} ק"מ`,
    };
  },
};

export const multiplyTopic: Topic = {
  id: 'g4-mul',
  title: 'כפל רב-ספרתי',
  icon: '✖️',
  levels: [tensTimesTens, twoByTwo, longMult, stories],
};