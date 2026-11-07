import type { Level, Topic } from '../../types';
import { distinctInts, randInt } from '../../lib/random';
import { MINUS } from '../../lib/things';

/** a + b where the ones cross 10 (e.g. 38 + 5). */
const crossTen: Level = {
  id: 'g2-reg-1',
  title: 'עוברים את העשרת',
  intro: {
    lines: ['ב-[[38 + 5]] קודם משלימים לעשרת הבאה: 38 + 2 = 40.', 'ואז מוסיפים את מה שנשאר: 40 + 3 = 43.'],
    visual: { type: 'numberline', min: 35, max: 45, labelEvery: 1, highlight: [40], jumps: [{ from: 38, to: 40 }, { from: 40, to: 43 }] },
  },
  generate: () => {
    const tens = randInt(1, 8);
    const ones = randInt(5, 9);
    const a = tens * 10 + ones;
    const b = randInt(10 - ones + 1, 9);
    const fill = 10 - ones;
    if (Math.random() < 0.6) {
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${a} + ${b} = ?`,
        answer: a + b,
        hint: `כמה חסר ל-${a} כדי להגיע ל-${(tens + 1) * 10}? הוסף את זה קודם.`,
        explain: `${a} + ${fill} = ${(tens + 1) * 10}, ועוד ${b - fill} = ${a + b}.`,
        explainVisual: {
          type: 'numberline',
          min: tens * 10,
          max: tens * 10 + 20,
          labelEvery: 5,
          jumps: [
            { from: a, to: (tens + 1) * 10 },
            { from: (tens + 1) * 10, to: a + b },
          ],
        },
      };
    }
    const c = a + b;
    const down = c - (tens + 1) * 10;
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${c} ${MINUS} ${b} = ?`,
      answer: a,
      hint: `קודם יורדים לעשרת השלמה: ${c} ${MINUS} ${down} = ${(tens + 1) * 10}. ואז מורידים את השאר.`,
      explain: `${c} ${MINUS} ${down} = ${(tens + 1) * 10}, ואז ${(tens + 1) * 10} ${MINUS} ${b - down} = ${a}.`,
    };
  },
};

const twoDigit: Level = {
  id: 'g2-reg-2',
  title: 'דו-ספרתי ועוד דו-ספרתי',
  intro: {
    lines: ['מפרקים לעשרות וליחידות:', '[[36 + 27]]: 30 + 20 = 50, 6 + 7 = 13, ו-50 + 13 = 63.'],
    expr: '36 + 27 = 63',
  },
  generate: () => {
    const a = randInt(12, 79);
    const b = randInt(11, 99 - a);
    const tens = Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10;
    const ones = (a % 10) + (b % 10);
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${a} + ${b} = ?`,
      answer: a + b,
      hint: `חבר עשרות עם עשרות (${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10}), ויחידות עם יחידות (${a % 10} + ${b % 10}).`,
      explain: `${tens} + ${ones} = ${a + b}`,
    };
  },
};

const subBorrow: Level = {
  id: 'g2-reg-3',
  title: 'חיסור עם פריטה',
  intro: {
    lines: ['ב-[[52 − 17]] אפשר לחסר בשלבים:', '52 − 10 = 42, ואז 42 − 7 = 35.'],
    visual: { type: 'numberline', min: 30, max: 55, labelEvery: 5, jumps: [{ from: 52, to: 42 }, { from: 42, to: 35 }] },
  },
  generate: () => {
    const b = randInt(11, 49);
    const a = randInt(b + 5, 99);
    const bt = Math.floor(b / 10) * 10;
    const mid = a - bt;
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${a} ${MINUS} ${b} = ?`,
      answer: a - b,
      hint: `קודם הורד את העשרות: ${a} ${MINUS} ${bt} = ${mid}. אחר כך הורד ${b % 10}.`,
      explain: `${a} ${MINUS} ${bt} = ${mid}, ו-${mid} ${MINUS} ${b % 10} = ${a - b}.`,
      explainVisual: {
        type: 'numberline',
        min: Math.floor((a - b) / 10) * 10,
        max: Math.ceil(a / 10) * 10,
        labelEvery: 10,
        jumps: [
          { from: a, to: mid },
          { from: mid, to: a - b },
        ],
      },
    };
  },
};

const missing: Level = {
  id: 'g2-reg-4',
  title: 'המספר החסר עד 100',
  intro: {
    lines: ['כדי למצוא מספר חסר בחיבור — מחסרים.', '[[45 + ? = 72]] → 72 − 45 = 27.'],
  },
  generate: () => {
    const total = randInt(30, 100);
    const a = randInt(10, total - 5);
    const b = total - a;
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'איזה מספר חסר?',
        expr: `${a} + ? = ${total}`,
        answer: b,
        hint: `חשב ${total} ${MINUS} ${a}, או קפוץ מ-${a} עד ${total}.`,
        explain: `${total} ${MINUS} ${a} = ${b}`,
      };
    }
    return {
      kind: 'input',
      text: 'איזה מספר חסר?',
      expr: `${total} ${MINUS} ? = ${a}`,
      answer: b,
      hint: `כמה צריך להוריד מ-${total} כדי להגיע ל-${a}?`,
      explain: `${total} ${MINUS} ${b} = ${a}`,
    };
  },
};

const matchUp: Level = {
  id: 'g2-reg-5',
  title: 'התאמה עד 100',
  intro: { lines: ['פתור כל תרגיל וגרור אליו את התוצאה.'] },
  generate: () => {
    const results = distinctInts(4, 20, 89);
    return {
      kind: 'match',
      text: 'גרור לכל תרגיל את התוצאה שלו.',
      pairs: results.map((r) => {
        if (Math.random() < 0.5) {
          const a = randInt(11, r - 9);
          return { left: { label: `${a} + ${r - a}` }, right: { label: String(r) } };
        }
        const b = randInt(11, Math.max(11, 100 - r));
        return { left: { label: `${r + b} ${MINUS} ${b}` }, right: { label: String(r) } };
      }),
      hint: 'אפשר להעריך: התוצאה קרובה לעשרת שליד המספר הגדול?',
      explain: 'כל תרגיל קיבל את התוצאה שלו. נסה שוב בסבב הבא!',
    };
  },
};

export const regroupTopic: Topic = {
  id: 'g2-reg',
  title: 'חיבור וחיסור עד 100',
  icon: '➕',
  levels: [crossTen, twoDigit, subBorrow, missing, matchUp],
};
