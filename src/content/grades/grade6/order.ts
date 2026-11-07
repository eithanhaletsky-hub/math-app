import type { Level, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { MINUS } from '../../lib/things';

const squares: Level = {
  id: 'g6-ord-1',
  title: 'חזקות',
  intro: { lines: ['[[5²]] ("5 בריבוע") = 5 × 5 = 25.', '[[2³]] ("2 בחזקת 3") = 2 × 2 × 2 = 8.'] },
  generate: () => {
    if (Math.random() < 0.65) {
      const a = randInt(2, 12);
      return {
        kind: 'input',
        text: 'כמה זה?',
        expr: `${a}² = ?`,
        answer: a * a,
        hint: `${a} × ${a}`,
        explain: `${a}² = ${a} × ${a} = ${a * a}`,
      };
    }
    const a = randInt(2, 5);
    return {
      kind: 'input',
      text: 'כמה זה?',
      expr: `${a}³ = ?`,
      answer: a ** 3,
      hint: `${a} × ${a} × ${a}`,
      explain: `${a} × ${a} × ${a} = ${a ** 3}`,
    };
  },
};

const fullOrder: Level = {
  id: 'g6-ord-2',
  title: 'סדר פעולות מלא',
  intro: {
    lines: ['1. סוגריים  2. חזקות  3. כפל וחילוק (משמאל לימין)  4. חיבור וחיסור (משמאל לימין)'],
    expr: '2 + 3 × (4 + 1)² = 2 + 3 × 25 = 77',
  },
  generate: () => {
    const kind = randInt(0, 3);
    if (kind === 0) {
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      const c = randInt(2, 9);
      const d = randInt(2, 5);
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${a} × ${b} + ${c} × ${d} = ?`,
        answer: a * b + c * d,
        hint: `קודם שני הכפלים: ${a} × ${b} ו-${c} × ${d}. ואז חבר.`,
        explain: `${a * b} + ${c * d} = ${a * b + c * d}`,
      };
    }
    if (kind === 1) {
      const a = randInt(1, 5);
      const b = randInt(1, 4);
      const c = randInt(2, 4);
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `(${a} + ${b})² ${MINUS} ${c} = ?`,
        answer: (a + b) ** 2 - c,
        hint: `סוגריים: ${a + b}. חזקה: ${a + b}² = ${(a + b) ** 2}. ואז חיסור.`,
        explain: `${(a + b) ** 2} ${MINUS} ${c} = ${(a + b) ** 2 - c}`,
      };
    }
    if (kind === 2) {
      const q = randInt(2, 9);
      const d = randInt(2, 6);
      const e = randInt(1, 9);
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${q * d * 2} : ${d} : 2 + ${e} = ?`,
        answer: q + e,
        hint: 'חילוק אחרי חילוק — משמאל לימין. ובסוף החיבור.',
        explain: `${q * d * 2} : ${d} = ${q * 2}, ${q * 2} : 2 = ${q}, ${q} + ${e} = ${q + e}`,
      };
    }
    const b = randInt(2, 6);
    const c = randInt(1, 5);
    const d = pick([2, 3]);
    const a = randInt(b * (c + d) + 1, b * (c + d) + 40); // keeps the answer positive
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${a} ${MINUS} ${b} × (${c} + ${d}) = ?`,
      answer: a - b * (c + d),
      hint: `סוגריים: ${c + d}. כפל: ${b} × ${c + d} = ${b * (c + d)}. ואז חיסור.`,
      explain: `${a} ${MINUS} ${b * (c + d)} = ${a - b * (c + d)}`,
    };
  },
};

export const orderTopic: Topic = {
  id: 'g6-ord',
  title: 'חזקות וסדר פעולות',
  icon: '🧠',
  levels: [squares, fullOrder],
};
