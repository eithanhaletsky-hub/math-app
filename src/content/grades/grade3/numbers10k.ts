import type { Level, Topic } from '../../types';
import { distinctInts, pick, randInt, sortedNumberOptions } from '../../lib/random';
import { MINUS } from '../../lib/things';

const fmt = (n: number) => n.toLocaleString('en-US');

const placeValue: Level = {
  id: 'g3-10k-1',
  title: 'אלפים',
  intro: {
    lines: ['10 מאות = אלף (1,000).', 'ב-[[4,725]]: 4 אלפים, 7 מאות, 2 עשרות, 5 יחידות.'],
    expr: '4,725 = 4,000 + 700 + 20 + 5',
  },
  generate: () => {
    const d = [randInt(1, 9), randInt(0, 9), randInt(0, 9), randInt(0, 9)];
    const n = d[0] * 1000 + d[1] * 100 + d[2] * 10 + d[3];
    const kind = randInt(0, 2);
    if (kind === 0) {
      const parts = [d[0] * 1000, d[1] * 100, d[2] * 10, d[3]].filter((x) => x > 0);
      return {
        kind: 'input',
        text: 'איזה מספר זה?',
        expr: `${parts.map(fmt).join(' + ')} = ?`,
        answer: n,
        hint: 'כתוב ספרה לכל מקום: אלפים, מאות, עשרות, יחידות. מקום ריק — 0.',
        explain: `${parts.map(fmt).join(' + ')} = ${fmt(n)}`,
      };
    }
    const names = ['אלפים', 'מאות', 'עשרות', 'יחידות'];
    const i = randInt(0, 3);
    return {
      kind: 'choice',
      text: `מה ערך הספרה במקום ה**${names[i]}** במספר [[${fmt(n)}]]?`,
      options: sortedNumberOptions(d[i], { min: 0, max: 9, near: d.map((x) => x - d[i]).concat([1, -1]) }),
      answer: String(d[i]),
      hint: 'מימין לשמאל: יחידות, עשרות, מאות, אלפים.',
      explain: `ב-${fmt(n)} יש ${d[0]} אלפים, ${d[1]} מאות, ${d[2]} עשרות ו-${d[3]} יחידות.`,
    };
  },
};

const compare: Level = {
  id: 'g3-10k-2',
  title: 'משווים וסדרים',
  intro: { lines: ['במספרים עם אותו מספר ספרות — משווים משמאל: קודם אלפים, אחר כך מאות…'] },
  generate: () => {
    if (Math.random() < 0.5) {
      const a = randInt(1000, 9999);
      const kind = randInt(0, 2);
      const b = kind === 0 ? a + pick([-100, 100, -10, 10, -1, 1, -1000, 1000]) : kind === 1 ? Number(String(a).split('').reverse().join('')) : randInt(1000, 9999);
      const bb = b < 1000 || b > 9999 ? randInt(1000, 9999) : b;
      const s = a < bb ? '<' : a > bb ? '>' : '=';
      return {
        kind: 'choice',
        text: 'בחר את הסימן המתאים:',
        expr: `${fmt(a)}  ?  ${fmt(bb)}`,
        options: ['<', '=', '>'].map((x) => ({ value: x, label: x })),
        answer: s,
        hint: 'השווה ספרה אחרי ספרה, משמאל לימין, עד שמוצאים הבדל.',
        explain: `[[${fmt(a)} ${s} ${fmt(bb)}]]`,
      };
    }
    const nums = distinctInts(4, 1000, 9999).sort((x, y) => x - y);
    const places = ['הכי קטן', 'שני', 'שלישי', 'הכי גדול'];
    return {
      kind: 'match',
      text: 'סדר את המספרים מהקטן לגדול.',
      pairs: nums.map((n, i) => ({ left: { label: places[i] }, right: { label: fmt(n) } })),
      hint: 'השווה קודם את ספרת האלפים של כל המספרים.',
      explain: `[[${nums.map(fmt).join(' < ')}]]`,
    };
  },
};

const rounding: Level = {
  id: 'g3-10k-3',
  title: 'עיגול מספרים',
  intro: {
    lines: ['לעגל לעשרות = למצוא את העשרת **הקרובה ביותר**.', '[[47]] קרוב יותר ל-50. [[43]] קרוב יותר ל-40. 5 מעגלים כלפי מעלה.'],
    visual: { type: 'numberline', min: 40, max: 50, labelEvery: 5, highlight: [47] },
  },
  generate: () => {
    const toHundred = Math.random() < 0.4;
    if (!toHundred) {
      const n = randInt(11, 989);
      if (n % 10 === 0) return rounding.generate();
      const lo = Math.floor(n / 10) * 10;
      const ans = n % 10 >= 5 ? lo + 10 : lo;
      return {
        kind: 'choice',
        text: `עגל את [[${n}]] לעשרות.`,
        visual: { type: 'numberline', min: lo, max: lo + 10, labelEvery: 10, highlight: [n] },
        options: [lo, lo + 10].map((v) => ({ value: String(v), label: String(v) })),
        answer: String(ans),
        hint: `${n} נמצא בין ${lo} ל-${lo + 10}. לאיזה מהם הוא קרוב יותר? (ספרת יחידות 5 ומעלה — למעלה)`,
        explain: `ספרת היחידות היא ${n % 10}, לכן מעגלים ל-${ans}.`,
      };
    }
    const n = randInt(101, 9899);
    if (n % 100 === 0) return rounding.generate();
    const lo = Math.floor(n / 100) * 100;
    const ans = n % 100 >= 50 ? lo + 100 : lo;
    return {
      kind: 'choice',
      text: `עגל את [[${fmt(n)}]] למאות.`,
      visual: { type: 'numberline', min: lo, max: lo + 100, step: 10, labelEvery: 50, highlight: [Math.round(n / 10) * 10] },
      options: [lo, lo + 100].map((v) => ({ value: String(v), label: fmt(v) })),
      answer: String(ans),
      hint: 'הסתכל על ספרת העשרות: 5 ומעלה — מעגלים למעלה.',
      explain: `ספרת העשרות היא ${Math.floor((n % 100) / 10)}, לכן מעגלים ל-${fmt(ans)}.`,
    };
  },
};

const addSub: Level = {
  id: 'g3-10k-4',
  title: 'חיבור וחיסור עד 10,000',
  intro: {
    lines: ['בחיבור ובחיסור במאונך מסדרים את הספרות לפי המקומות.', 'מתחילים מהיחידות, ולא שוכחים המרה ופריטה.'],
    visual: { type: 'vertical', rows: [3458, 1276], op: '+', result: 4734 },
  },
  generate: () => {
    const plus = Math.random() < 0.5;
    const a = randInt(1000, 6999);
    const b = randInt(100, Math.min(2999, a - 100));
    if (plus) {
      return {
        kind: 'input',
        text: 'פתור במאונך:',
        visual: { type: 'vertical', rows: [a, b], op: '+', result: null },
        answer: a + b,
        hint: 'חבר עמודה אחר עמודה, מימין. אם יוצא 10 או יותר — העבר 1 לעמודה הבאה.',
        explain: `${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}`,
        explainVisual: { type: 'vertical', rows: [a, b], op: '+', result: a + b },
      };
    }
    return {
      kind: 'input',
      text: 'פתור במאונך:',
      visual: { type: 'vertical', rows: [a, b], op: '−', result: null },
      answer: a - b,
      hint: 'חסר עמודה אחר עמודה, מימין. אם הספרה העליונה קטנה — פרוט מהעמודה שמשמאל.',
      explain: `${fmt(a)} ${MINUS} ${fmt(b)} = ${fmt(a - b)}`,
      explainVisual: { type: 'vertical', rows: [a, b], op: '−', result: a - b },
    };
  },
};

export const numbers10kTopic: Topic = {
  id: 'g3-10k',
  title: 'מספרים עד 10,000',
  icon: '🔢',
  levels: [placeValue, compare, rounding, addSub],
};
