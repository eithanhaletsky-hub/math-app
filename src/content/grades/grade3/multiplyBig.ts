import type { Level, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { PEOPLE, g } from '../../lib/things';

const tens: Level = {
  id: 'g3-mulb-1',
  title: 'כפל בעשרות שלמות',
  intro: {
    lines: ['[[4 × 30]] = 4 × 3 עשרות = 12 עשרות = 120.', 'מחשבים את התרגיל הקטן, ומוסיפים את האפס.'],
    expr: '4 × 3 = 12  →  4 × 30 = 120',
  },
  generate: () => {
    const a = randInt(2, 9);
    const b = randInt(1, 9);
    const big = Math.random() < 0.3 ? 100 : 10;
    const [x, y] = Math.random() < 0.5 ? [a, b * big] : [b * big, a];
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${x} × ${y} = ?`,
      answer: a * b * big,
      hint: `חשב קודם ${a} × ${b} = ${a * b}, ואז הוסף ${big === 10 ? 'אפס אחד' : 'שני אפסים'}.`,
      explain: `${a} × ${b} = ${a * b}, ולכן ${x} × ${y} = ${a * b * big}.`,
    };
  },
};

const areaModel: Level = {
  id: 'g3-mulb-2',
  title: 'מודל השטח',
  intro: {
    lines: ['כדי לחשב [[23 × 4]] מפרקים את 23 ל-20 ו-3.', 'מחשבים כל חלק בנפרד ומחברים: 80 + 12 = 92.'],
    visual: { type: 'area', rows: [4], cols: [20, 3], showProducts: true },
  },
  generate: () => {
    const t = randInt(1, 9);
    const o = randInt(1, 9);
    const m = randInt(2, 9);
    const n = t * 10 + o;
    return {
      kind: 'input',
      text: `חשב בעזרת מודל השטח: [[${n} × ${m}]]`,
      visual: { type: 'area', rows: [m], cols: [t * 10, o] },
      answer: n * m,
      hint: `חשב כל מלבן: ${t * 10} × ${m} ו-${o} × ${m}. ואז חבר.`,
      explain: `${t * 10} × ${m} = ${t * 10 * m}, ${o} × ${m} = ${o * m}. ביחד: ${n * m}.`,
      explainVisual: { type: 'area', rows: [m], cols: [t * 10, o], showProducts: true },
    };
  },
};

const threeDigit: Level = {
  id: 'g3-mulb-3',
  title: 'תלת-ספרתי כפול חד-ספרתי',
  intro: {
    lines: ['גם מספר תלת-ספרתי מפרקים: [[124 × 3]] = 100 × 3 + 20 × 3 + 4 × 3.', '300 + 60 + 12 = 372'],
    visual: { type: 'area', rows: [3], cols: [100, 20, 4], showProducts: true },
  },
  generate: () => {
    const h = randInt(1, 4);
    const t = randInt(0, 9);
    const o = randInt(1, 9);
    const m = randInt(2, 6);
    const cols = [h * 100, t * 10, o].filter((x) => x > 0);
    const n = h * 100 + t * 10 + o;
    return {
      kind: 'input',
      text: `פתור: [[${n} × ${m}]]`,
      visual: { type: 'area', rows: [m], cols },
      answer: n * m,
      hint: `פרק: ${cols.map((c) => `${c} × ${m}`).join(' + ')}.`,
      explain: `${cols.map((c) => c * m).join(' + ')} = ${n * m}`,
      explainVisual: { type: 'area', rows: [m], cols, showProducts: true },
    };
  },
};

const stories: Level = {
  id: 'g3-mulb-4',
  title: 'סיפורי כפל',
  intro: { lines: ['כשיש הרבה קבוצות שוות — כופלים. אפשר לפרק במודל השטח.'] },
  generate: () => {
    const p = pick(PEOPLE);
    const kind = randInt(0, 2);
    if (kind === 0) {
      const days = randInt(3, 7);
      const pages = randInt(12, 35);
      return {
        kind: 'input',
        text: `${p.name} ${g(p, 'קורא', 'קוראת')} ${pages} עמודים בכל יום. כמה עמודים ${g(p, 'יקרא', 'תקרא')} ב-${days} ימים?`,
        answer: days * pages,
        hint: `${days} × ${pages}. פרק את ${pages} לעשרות ויחידות.`,
        explain: `${days} × ${pages} = ${days * pages}`,
      };
    }
    if (kind === 1) {
      const boxes = randInt(3, 9);
      const each = pick([12, 15, 24, 25, 36]);
      return {
        kind: 'input',
        text: `בכל קופסה יש ${each} עפרונות. כמה עפרונות יש ב-${boxes} קופסאות?`,
        answer: boxes * each,
        hint: `${boxes} × ${each}`,
        explain: `${boxes} × ${each} = ${boxes * each}`,
        explainVisual: { type: 'area', rows: [boxes], cols: [Math.floor(each / 10) * 10, each % 10].filter((x) => x > 0), showProducts: true },
      };
    }
    const price = randInt(11, 49);
    const n = randInt(2, 5);
    return {
      kind: 'input',
      text: `כרטיס לסרט עולה ${price} ₪. כמה עולים ${n} כרטיסים?`,
      answer: price * n,
      hint: `${n} × ${price}`,
      explain: `${n} × ${price} = ${n * price} ₪`,
    };
  },
};

export const multiplyBigTopic: Topic = {
  id: 'g3-mulb',
  title: 'כפל במספרים גדולים',
  icon: '🟦',
  levels: [tens, areaModel, threeDigit, stories],
};
