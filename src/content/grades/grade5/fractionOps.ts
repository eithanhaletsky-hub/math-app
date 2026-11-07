import type { Level, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { MINUS } from '../../lib/things';

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const addDifferent: Level = {
  id: 'g5-fop-1',
  title: 'חיבור עם מכנים שונים',
  intro: {
    lines: ['קודם מרחיבים למכנה משותף, ואז מחברים מונים.', '[[1/2 + 1/3 = 3/6 + 2/6 = 5/6]]'],
  },
  generate: () => {
    const d1 = pick([2, 3, 4, 5, 6]);
    let d2 = pick([2, 3, 4, 6, 8, 10, 12]);
    if (d2 === d1) d2 = d1 * 2;
    const L = lcm(d1, d2);
    const n1 = randInt(1, d1 - 1);
    const n2 = randInt(1, d2 - 1);
    const plus = Math.random() < 0.6;
    const a = n1 * (L / d1);
    const b = n2 * (L / d2);
    if (!plus && a < b) {
      return {
        kind: 'input',
        text: 'מה המונה של התוצאה?',
        expr: `${n2}/${d2} ${MINUS} ${n1}/${d1} = ?/${L}`,
        answer: b - a,
        hint: `הרחב ל-${L}: ${n2}/${d2} = ${b}/${L}, ${n1}/${d1} = ${a}/${L}.`,
        explain: `[[${b}/${L} ${MINUS} ${a}/${L} = ${b - a}/${L}]]`,
      };
    }
    if (!plus && a > b) {
      return {
        kind: 'input',
        text: 'מה המונה של התוצאה?',
        expr: `${n1}/${d1} ${MINUS} ${n2}/${d2} = ?/${L}`,
        answer: a - b,
        hint: `הרחב ל-${L}: ${n1}/${d1} = ${a}/${L}, ${n2}/${d2} = ${b}/${L}.`,
        explain: `[[${a}/${L} ${MINUS} ${b}/${L} = ${a - b}/${L}]]`,
      };
    }
    return {
      kind: 'input',
      text: 'מה המונה של התוצאה?',
      expr: `${n1}/${d1} + ${n2}/${d2} = ?/${L}`,
      answer: a + b,
      hint: `הרחב ל-${L}: ${n1}/${d1} = ${a}/${L}, ${n2}/${d2} = ${b}/${L}.`,
      explain: `[[${a}/${L} + ${b}/${L} = ${a + b}/${L}]]`,
    };
  },
};

const mixedAdd: Level = {
  id: 'g5-fop-2',
  title: 'חיבור מספרים מעורבים',
  intro: {
    lines: ['מחברים שלמים עם שלמים, ושברים עם שברים.', '[[2 1/4 + 1 2/4 = 3 3/4]]'],
  },
  generate: () => {
    const d = pick([3, 4, 5, 6, 8]);
    const w1 = randInt(1, 5);
    const w2 = randInt(1, 4);
    const n1 = randInt(1, d - 2);
    const n2 = randInt(1, d - 1 - n1);
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'כמה שלמים בתוצאה?',
        expr: `${w1} ${n1}/${d} + ${w2} ${n2}/${d} = ? ${n1 + n2}/${d}`,
        answer: w1 + w2,
        hint: 'חבר רק את השלמים.',
        explain: `${w1} + ${w2} = ${w1 + w2}`,
      };
    }
    return {
      kind: 'input',
      text: 'מה המונה בתוצאה?',
      expr: `${w1} ${n1}/${d} + ${w2} ${n2}/${d} = ${w1 + w2} ?/${d}`,
      answer: n1 + n2,
      hint: 'חבר את המונים של השברים.',
      explain: `${n1} + ${n2} = ${n1 + n2}`,
    };
  },
};

const timesWhole: Level = {
  id: 'g5-fop-3',
  title: 'שבר כפול מספר שלם',
  intro: {
    lines: ['[[3 × 2/5]] = 2/5 + 2/5 + 2/5 = [[6/5]].', 'כופלים רק את המונה. המכנה נשאר.'],
    visual: { type: 'fraction', shape: 'bar', parts: 5, filled: 2 },
  },
  generate: () => {
    const d = randInt(3, 10);
    const n = randInt(1, d - 1);
    const k = randInt(2, 6);
    return {
      kind: 'input',
      text: 'מה המונה של התוצאה?',
      expr: `${k} × ${n}/${d} = ?/${d}`,
      answer: k * n,
      hint: `כפול את המונה ב-${k}: ${k} × ${n}.`,
      explain: `[[${k} × ${n}/${d} = ${k * n}/${d}]]`,
    };
  },
};

const timesFraction: Level = {
  id: 'g5-fop-4',
  title: 'שבר כפול שבר',
  intro: {
    lines: ['כופלים מונה במונה, ומכנה במכנה.', '[[2/3 × 3/4 = 6/12]] (= חצי).'],
  },
  generate: () => {
    const d1 = randInt(2, 6);
    const d2 = randInt(2, 6);
    const n1 = randInt(1, d1 - 1);
    const n2 = randInt(1, d2 - 1);
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'מה המונה של התוצאה?',
        expr: `${n1}/${d1} × ${n2}/${d2} = ?/${d1 * d2}`,
        answer: n1 * n2,
        hint: `מונה כפול מונה: ${n1} × ${n2}.`,
        explain: `[[${n1}/${d1} × ${n2}/${d2} = ${n1 * n2}/${d1 * d2}]]`,
      };
    }
    return {
      kind: 'input',
      text: 'מה המכנה של התוצאה?',
      expr: `${n1}/${d1} × ${n2}/${d2} = ${n1 * n2}/?`,
      answer: d1 * d2,
      hint: `מכנה כפול מכנה: ${d1} × ${d2}.`,
      explain: `[[${n1}/${d1} × ${n2}/${d2} = ${n1 * n2}/${d1 * d2}]]`,
    };
  },
};

const simplify: Level = {
  id: 'g5-fop-5',
  title: 'צמצום עד הסוף',
  intro: { lines: ['מחלקים מונה ומכנה במחלק המשותף הגדול ביותר.', '[[12/18]] → מחלקים ב-6 → [[2/3]].'] },
  generate: () => {
    const d = randInt(2, 9);
    let n = randInt(1, d - 1);
    while (gcd(n, d) !== 1) n = randInt(1, d - 1);
    const k = randInt(2, 6);
    return {
      kind: 'input',
      text: 'צמצם עד הסוף. מה המונה?',
      expr: `${n * k}/${d * k} = ?/${d}`,
      answer: n,
      hint: `מה המחלק המשותף הגדול ביותר של ${n * k} ו-${d * k}?`,
      explain: `מחלקים ב-${k}: ${n * k} : ${k} = ${n}, ${d * k} : ${k} = ${d}.`,
    };
  },
};

export const fractionOpsTopic: Topic = {
  id: 'g5-fop',
  title: 'פעולות בשברים',
  icon: '🧩',
  levels: [addDifferent, mixedAdd, timesWhole, timesFraction, simplify],
};
