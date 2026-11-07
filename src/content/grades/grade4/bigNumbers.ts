import type { Level, Topic } from '../../types';
import { pick, randInt, sortedNumberOptions } from '../../lib/random';

const fmt = (n: number) => n.toLocaleString('en-US');

const PLACES = ['יחידות', 'עשרות', 'מאות', 'אלפים', 'עשרות אלפים', 'מאות אלפים', 'מיליונים'];

const placeValue: Level = {
  id: 'g4-big-1',
  title: 'מספרים גדולים',
  intro: {
    lines: ['כל 3 ספרות מפרידים בפסיק: [[1,000]] (אלף), [[1,000,000]] (מיליון).', 'ב-[[352,816]]: 3 מאות אלפים, 5 עשרות אלפים, 2 אלפים…'],
  },
  generate: () => {
    const digits = randInt(5, 7);
    const n = randInt(10 ** (digits - 1), 10 ** digits - 1);
    const s = String(n);
    if (Math.random() < 0.5) {
      const i = randInt(0, digits - 1); // index from the right
      const d = Number(s[s.length - 1 - i]);
      return {
        kind: 'choice',
        text: `מה הספרה במקום ה**${PLACES[i]}** במספר [[${fmt(n)}]]?`,
        options: sortedNumberOptions(d, { min: 0, max: 9, near: s.split('').map((c) => Number(c) - d).concat([1, -1]) }),
        answer: String(d),
        hint: 'ספור מקומות מימין: יחידות, עשרות, מאות, אלפים, עשרות אלפים…',
        explain: `במספר ${fmt(n)}, במקום ה${PLACES[i]} נמצאת הספרה ${d}.`,
      };
    }
    // pick a place (not the ones) whose digit is not 0
    const places = Array.from({ length: digits - 1 }, (_, k) => k + 1).filter((k) => s[s.length - 1 - k] !== '0');
    const i = pick(places);
    const d = Number(s[s.length - 1 - i]);
    const value = d * 10 ** i;
    return {
      kind: 'choice',
      text: `במספר [[${fmt(n)}]], מה **הערך** של הספרה ${d} שבמקום ה${PLACES[i]}?`,
      options: [value / 100, value / 10, value, value * 10]
        .filter((v) => v >= 1)
        .map((v) => ({ value: String(v), label: fmt(v) })),
      answer: String(value),
      hint: `הספרה ${d} במקום ה${PLACES[i]} שווה ${d} × ${fmt(10 ** i)}.`,
      explain: `${d} × ${fmt(10 ** i)} = ${fmt(value)}`,
    };
  },
};

const compare: Level = {
  id: 'g4-big-2',
  title: 'משווים מספרים גדולים',
  intro: { lines: ['מספר עם יותר ספרות — גדול יותר.', 'אם מספר הספרות שווה — משווים משמאל, ספרה אחר ספרה.'] },
  generate: () => {
    const a = randInt(10000, 999999);
    const kind = randInt(0, 2);
    let b = kind === 0 ? a + pick([1, -1, 10, -10, 1000, -1000, 100000, -100000]) : kind === 1 ? Number(String(a).slice(0, -1)) : randInt(10000, 999999);
    if (b < 1000) b = randInt(10000, 999999);
    const s = a < b ? '<' : a > b ? '>' : '=';
    return {
      kind: 'choice',
      text: 'בחר את הסימן המתאים:',
      expr: `${fmt(a)}  ?  ${fmt(b)}`,
      options: ['<', '=', '>'].map((x) => ({ value: x, label: x })),
      answer: s,
      hint: 'קודם בדוק כמה ספרות יש בכל מספר.',
      explain: `[[${fmt(a)} ${s} ${fmt(b)}]]`,
    };
  },
};

const rounding: Level = {
  id: 'g4-big-3',
  title: 'עיגול לאלפים',
  intro: {
    lines: ['לעגל לאלפים: מסתכלים על ספרת **המאות**.', '0–4 → מעגלים למטה. 5–9 → מעגלים למעלה. [[34,612 ≈ 35,000]]'],
  },
  generate: () => {
    const to = pick([10, 100, 1000]);
    const n = randInt(1001, 99999);
    if (n % to === 0) return rounding.generate();
    const lo = Math.floor(n / to) * to;
    const ans = n - lo >= to / 2 ? lo + to : lo;
    const word = to === 10 ? 'עשרות' : to === 100 ? 'מאות' : 'אלפים';
    const look = to === 10 ? 'היחידות' : to === 100 ? 'העשרות' : 'המאות';
    return {
      kind: 'choice',
      text: `עגל את [[${fmt(n)}]] ל${word}.`,
      options: [lo, lo + to].map((v) => ({ value: String(v), label: fmt(v) })),
      answer: String(ans),
      hint: `הסתכל על ספרת ${look}: 5 ומעלה — למעלה.`,
      explain: `${fmt(n)} ≈ ${fmt(ans)}`,
    };
  },
};

const times10: Level = {
  id: 'g4-big-4',
  title: 'כפל וחילוק ב-10, 100, 1000',
  intro: {
    lines: ['כפול 10 — מוסיפים אפס. כפול 100 — שני אפסים. כפול 1,000 — שלושה.', 'חילוק ב-10 — מורידים אפס: [[4,500 : 10 = 450]].'],
  },
  generate: () => {
    const p = pick([10, 100, 1000]);
    const zeros = String(p).length - 1;
    if (Math.random() < 0.5) {
      const a = randInt(2, 999);
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${a} × ${fmt(p)} = ?`,
        answer: a * p,
        hint: `הוסף ${zeros === 1 ? 'אפס אחד' : `${zeros} אפסים`} בסוף.`,
        explain: `${a} × ${fmt(p)} = ${fmt(a * p)}`,
      };
    }
    const q = randInt(2, 999);
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${fmt(q * p)} : ${fmt(p)} = ?`,
      answer: q,
      hint: `מחק ${zeros === 1 ? 'אפס אחד' : `${zeros} אפסים`} מהסוף.`,
      explain: `${fmt(q * p)} : ${fmt(p)} = ${q}`,
    };
  },
};

export const bigNumbersTopic: Topic = {
  id: 'g4-big',
  title: 'מספרים גדולים',
  icon: '🏔️',
  levels: [placeValue, compare, rounding, times10],
};
