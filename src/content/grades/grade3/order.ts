import type { Level, Topic } from '../../types';
import { randInt } from '../../lib/random';
import { MINUS } from '../../lib/things';

const parens: Level = {
  id: 'g3-ord-1',
  title: 'קודם הסוגריים',
  intro: {
    lines: ['מה שבתוך **סוגריים** — מחשבים ראשון.', '[[(8 − 3) × 2 = 5 × 2 = 10]]'],
  },
  generate: () => {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const a = randInt(2, 9);
      const b = randInt(1, 9);
      const c = randInt(2, 5);
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `(${a} + ${b}) × ${c} = ?`,
        answer: (a + b) * c,
        hint: `קודם הסוגריים: ${a} + ${b} = ${a + b}. ואז כפול ${c}.`,
        explain: `(${a} + ${b}) × ${c} = ${a + b} × ${c} = ${(a + b) * c}`,
      };
    }
    if (kind === 1) {
      const a = randInt(20, 50);
      const b = randInt(2, 9);
      const c = randInt(2, 9);
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${a} ${MINUS} (${b} + ${c}) = ?`,
        answer: a - (b + c),
        hint: `קודם הסוגריים: ${b} + ${c} = ${b + c}.`,
        explain: `${a} ${MINUS} ${b + c} = ${a - b - c}`,
      };
    }
    const c = randInt(2, 6);
    const q = randInt(2, 9);
    const a = randInt(1, c * q - 1);
    const b = c * q - a;
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `(${a} + ${b}) : ${c} = ?`,
      answer: q,
      hint: `קודם הסוגריים: ${a} + ${b} = ${a + b}. ואז לחלק ב-${c}.`,
      explain: `${a + b} : ${c} = ${q}`,
    };
  },
};

const multFirst: Level = {
  id: 'g3-ord-2',
  title: 'כפל וחילוק לפני חיבור וחיסור',
  intro: {
    lines: ['אם אין סוגריים: קודם **כפל וחילוק**, אחר כך חיבור וחיסור.', '[[3 + 4 × 2 = 3 + 8 = 11]] (ולא 14!)'],
  },
  generate: () => {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const a = randInt(1, 20);
      const b = randInt(2, 9);
      const c = randInt(2, 9);
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${a} + ${b} × ${c} = ?`,
        answer: a + b * c,
        hint: `קודם הכפל: ${b} × ${c} = ${b * c}. אחר כך הוסף ${a}.`,
        explain: `${a} + ${b * c} = ${a + b * c}`,
      };
    }
    if (kind === 1) {
      const b = randInt(2, 9);
      const c = randInt(2, 9);
      const a = randInt(b * c + 1, b * c + 30);
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${a} ${MINUS} ${b} × ${c} = ?`,
        answer: a - b * c,
        hint: `קודם הכפל: ${b} × ${c} = ${b * c}.`,
        explain: `${a} ${MINUS} ${b * c} = ${a - b * c}`,
      };
    }
    const c = randInt(2, 9);
    const q = randInt(2, 9);
    const a = randInt(1, 30);
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${a} + ${c * q} : ${c} = ?`,
      answer: a + q,
      hint: `קודם החילוק: ${c * q} : ${c} = ${q}.`,
      explain: `${a} + ${q} = ${a + q}`,
    };
  },
};

const compareOrder: Level = {
  id: 'g3-ord-3',
  title: 'עם סוגריים או בלי?',
  intro: { lines: ['סוגריים יכולים לשנות את התוצאה!', '[[2 + 3 × 4 = 14]], אבל [[(2 + 3) × 4 = 20]].'] },
  generate: () => {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const c = randInt(2, 6);
    const withP = Math.random() < 0.5;
    const ans = withP ? (a + b) * c : a + b * c;
    const other = withP ? a + b * c : (a + b) * c;
    const opts = [...new Set([ans, other, a + b + c, ans + c])];
    return {
      kind: 'choice',
      text: 'מה התוצאה?',
      expr: withP ? `(${a} + ${b}) × ${c}` : `${a} + ${b} × ${c}`,
      options: opts.sort((x, y) => x - y).map((v) => ({ value: String(v), label: String(v) })),
      answer: String(ans),
      hint: withP ? 'יש סוגריים — מתחילים מהם.' : 'אין סוגריים — קודם הכפל.',
      explain: withP ? `(${a} + ${b}) × ${c} = ${a + b} × ${c} = ${ans}` : `${a} + ${b * c} = ${ans}`,
    };
  },
};

export const orderTopic: Topic = {
  id: 'g3-ord',
  title: 'סדר פעולות',
  icon: '🧠',
  levels: [parens, multFirst, compareOrder],
};
