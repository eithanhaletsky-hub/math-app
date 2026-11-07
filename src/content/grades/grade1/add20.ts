import type { Level, Topic } from '../../types';
import { distinctInts, randInt } from '../../lib/random';
import { MINUS } from '../../lib/things';

const tenAnd: Level = {
  id: 'g1-add20-1',
  title: '10 ועוד',
  intro: {
    lines: ['10 ועוד 3 זה 13 — עשרת אחת ו-3 יחידות.', 'כל המספרים מ-11 עד 19 הם "10 ועוד משהו".'],
    expr: '10 + 3 = 13',
    visual: { type: 'tenframe', filled: 13, frames: 2 },
  },
  generate: () => {
    const n = randInt(1, 9);
    const kind = randInt(0, 2);
    if (kind === 0) {
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `10 + ${n} = ?`,
        visual: { type: 'tenframe', filled: 10 + n, frames: 2 },
        answer: 10 + n,
        hint: `עשרת שלמה ועוד ${n} יחידות. איך כותבים את זה?`,
        explain: `10 + ${n} = ${10 + n}`,
      };
    }
    if (kind === 1) {
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${n} + 10 = ?`,
        answer: 10 + n,
        hint: 'אפשר להחליף את הסדר: 10 + ' + n + '.',
        explain: `${n} + 10 = ${10 + n}`,
        explainVisual: { type: 'tenframe', filled: 10 + n, frames: 2 },
      };
    }
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${10 + n} ${MINUS} ${n} = ?`,
      visual: { type: 'tenframe', filled: 10 + n, frames: 2 },
      answer: 10,
      hint: `${10 + n} זה 10 ועוד ${n}. מורידים את ה-${n}…`,
      explain: `${10 + n} ${MINUS} ${n} = 10`,
    };
  },
};

const noBridge: Level = {
  id: 'g1-add20-2',
  title: 'חיבור וחיסור בתוך העשרת',
  intro: {
    lines: ['ב-[[12 + 5]] העשרת נשארת. מחברים רק את היחידות: 2 + 5 = 7.', 'לכן [[12 + 5 = 17]].'],
    visual: { type: 'numberline', min: 10, max: 20, labelEvery: 1, jumps: [12, 13, 14, 15, 16].map((f) => ({ from: f, to: f + 1 })) },
  },
  generate: () => {
    const ones = randInt(1, 8);
    const b = randInt(1, 9 - ones);
    const a = 10 + ones;
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${a} + ${b} = ?`,
        answer: a + b,
        hint: `חבר רק את היחידות: ${ones} + ${b}. העשרת נשארת.`,
        explain: `${ones} + ${b} = ${ones + b}, ולכן ${a} + ${b} = ${a + b}.`,
        explainVisual: { type: 'numberline', min: 10, max: 20, labelEvery: 1, highlight: [a + b] },
      };
    }
    const c = a + b;
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${c} ${MINUS} ${b} = ?`,
      answer: a,
      hint: `החסר רק מהיחידות: ${c - 10} ${MINUS} ${b}. העשרת נשארת.`,
      explain: `${c - 10} ${MINUS} ${b} = ${ones}, ולכן ${c} ${MINUS} ${b} = ${a}.`,
      explainVisual: { type: 'numberline', min: 10, max: 20, labelEvery: 1, highlight: [a] },
    };
  },
};

const bridgeAdd: Level = {
  id: 'g1-add20-3',
  title: 'משלימים לעשר',
  intro: {
    lines: ['ב-[[8 + 5]] קודם משלימים ל-10: 8 + 2 = 10.', 'ונשאר עוד 3: 10 + 3 = 13.'],
    expr: '8 + 5 = 8 + 2 + 3 = 13',
    visual: {
      type: 'numberline',
      min: 5,
      max: 15,
      labelEvery: 1,
      highlight: [10],
      jumps: [
        { from: 8, to: 10 },
        { from: 10, to: 13 },
      ],
    },
  },
  generate: () => {
    const a = randInt(5, 9);
    const b = randInt(11 - a, 9);
    const fill = 10 - a;
    const rest = b - fill;
    const [x, y] = Math.random() < 0.7 ? [a, b] : [b, a];
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${x} + ${y} = ?`,
      answer: a + b,
      hint: `כמה חסר ל-${a} כדי להגיע ל-10? הוסף את זה קודם, ואז את מה שנשאר.`,
      explain: `${a} + ${fill} = 10, ועוד ${rest} זה ${a + b}.`,
      explainVisual: {
        type: 'numberline',
        min: Math.min(a, 10) - 1,
        max: 19,
        labelEvery: 1,
        jumps: [
          { from: a, to: 10 },
          { from: 10, to: a + b },
        ],
      },
    };
  },
};

const bridgeSub: Level = {
  id: 'g1-add20-4',
  title: 'חיסור דרך העשר',
  intro: {
    lines: ['ב-[[13 − 5]] קודם יורדים ל-10: 13 − 3 = 10.', 'ונשאר להוריד עוד 2: 10 − 2 = 8.'],
    visual: {
      type: 'numberline',
      min: 5,
      max: 15,
      labelEvery: 1,
      highlight: [10],
      jumps: [
        { from: 13, to: 10 },
        { from: 10, to: 8 },
      ],
    },
  },
  generate: () => {
    const c = randInt(11, 18);
    const b = randInt(c - 9, 9);
    const down = c - 10;
    const rest = b - down;
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${c} ${MINUS} ${b} = ?`,
      answer: c - b,
      hint: rest > 0 ? `קודם הורד ${down} כדי להגיע ל-10, ואז הורד עוד ${rest}.` : `הורד ${b} מהיחידות.`,
      explain:
        rest > 0
          ? `${c} ${MINUS} ${down} = 10, ו-10 ${MINUS} ${rest} = ${c - b}.`
          : `${c} ${MINUS} ${b} = ${c - b}`,
      explainVisual: {
        type: 'numberline',
        min: Math.max(0, c - b - 1),
        max: 19,
        labelEvery: 1,
        jumps: rest > 0 ? [{ from: c, to: 10 }, { from: 10, to: c - b }] : [{ from: c, to: c - b }],
      },
    };
  },
};

const missing: Level = {
  id: 'g1-add20-5',
  title: 'המספר החסר',
  intro: {
    lines: ['איזה מספר מסתתר מאחורי סימן השאלה?', 'אפשר לספור מהמספר הקטן עד לגדול.'],
    expr: '9 + ? = 12',
  },
  generate: () => {
    const total = randInt(8, 20);
    const a = randInt(1, total - 1);
    const b = total - a;
    const kind = randInt(0, 2);
    if (kind === 0) {
      return {
        kind: 'input',
        text: 'איזה מספר חסר?',
        expr: `${a} + ? = ${total}`,
        answer: b,
        hint: `ספור מ-${a} עד ${total}. כמה קפיצות עשית?`,
        explain: `${a} + ${b} = ${total}, אז חסר ${b}.`,
        explainVisual: { type: 'numberline', min: 0, max: 20, labelEvery: 2, jumps: [{ from: a, to: total }] },
      };
    }
    if (kind === 1) {
      return {
        kind: 'input',
        text: 'איזה מספר חסר?',
        expr: `? + ${b} = ${total}`,
        answer: a,
        hint: `אפשר לחשב ${total} ${MINUS} ${b}.`,
        explain: `${a} + ${b} = ${total}, אז חסר ${a}.`,
      };
    }
    return {
      kind: 'input',
      text: 'איזה מספר חסר?',
      expr: `${total} ${MINUS} ? = ${a}`,
      answer: b,
      hint: `כמה צריך להוריד מ-${total} כדי להגיע ל-${a}? ספור אחורה.`,
      explain: `${total} ${MINUS} ${b} = ${a}, אז חסר ${b}.`,
    };
  },
};

const matchTo20: Level = {
  id: 'g1-add20-6',
  title: 'התאמה עד 20',
  intro: { lines: ['פתור כל תרגיל וגרור אליו את התוצאה.'] },
  generate: () => {
    const results = distinctInts(4, 5, 18);
    return {
      kind: 'match',
      text: 'גרור לכל תרגיל את התוצאה שלו.',
      pairs: results.map((r) => {
        if (Math.random() < 0.5) {
          const a = randInt(Math.max(1, r - 9), Math.min(9, r - 1));
          return { left: { label: `${a} + ${r - a}` }, right: { label: String(r) } };
        }
        const b = randInt(1, Math.min(9, 20 - r));
        return { left: { label: `${r + b} ${MINUS} ${b}` }, right: { label: String(r) } };
      }),
      hint: 'זכור את ההשלמה לעשר: קודם מגיעים ל-10, ואז ממשיכים.',
      explain: 'אחרי שפותרים כל תרגיל, רק תוצאה אחת מתאימה לו. נסה שוב בסבב הבא!',
    };
  },
};

export const add20Topic: Topic = {
  id: 'g1-add20',
  title: 'חיבור וחיסור עד 20',
  icon: '🔟',
  levels: [tenAnd, noBridge, bridgeAdd, bridgeSub, missing, matchTo20],
};
