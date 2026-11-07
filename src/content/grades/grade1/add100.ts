import type { Level, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { MINUS, PEOPLE, g } from '../../lib/things';

const wholeTens: Level = {
  id: 'g1-add100-1',
  title: 'עשרות שלמות',
  intro: {
    lines: ['[[30 + 40]] זה 3 עשרות ועוד 4 עשרות = 7 עשרות.', 'לכן [[30 + 40 = 70]].'],
    visual: { type: 'blocks', tens: 7, ones: 0 },
  },
  generate: () => {
    const plus = Math.random() < 0.5;
    if (plus) {
      const a = randInt(1, 8);
      const b = randInt(1, 9 - a);
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${a * 10} + ${b * 10} = ?`,
        visual: { type: 'blocks', tens: a + b, ones: 0 },
        answer: (a + b) * 10,
        hint: `חשוב בעשרות: ${a} עשרות ועוד ${b} עשרות.`,
        explain: `${a} + ${b} = ${a + b}, אז ${a * 10} + ${b * 10} = ${(a + b) * 10}.`,
      };
    }
    const a = randInt(2, 10);
    const b = randInt(1, a - 1);
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${a * 10} ${MINUS} ${b * 10} = ?`,
      answer: (a - b) * 10,
      hint: `חשוב בעשרות: ${a} עשרות פחות ${b} עשרות.`,
      explain: `${a} ${MINUS} ${b} = ${a - b}, אז ${a * 10} ${MINUS} ${b * 10} = ${(a - b) * 10}.`,
      explainVisual: { type: 'blocks', tens: a - b, ones: 0 },
    };
  },
};

const plusOnes: Level = {
  id: 'g1-add100-2',
  title: 'מוסיפים יחידות',
  intro: {
    lines: ['ב-[[34 + 5]] העשרות לא משתנות.', 'מחברים רק את היחידות: 4 + 5 = 9. התשובה: 39.'],
    visual: { type: 'blocks', tens: 3, ones: 9 },
  },
  generate: () => {
    const tens = randInt(1, 9);
    const ones = randInt(0, 8);
    const b = randInt(1, 9 - ones);
    const a = tens * 10 + ones;
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${a} + ${b} = ?`,
        answer: a + b,
        hint: `העשרות נשארות ${tens * 10}. חבר רק את היחידות: ${ones} + ${b}.`,
        explain: `${ones} + ${b} = ${ones + b}, ולכן ${a} + ${b} = ${a + b}.`,
        explainVisual: { type: 'blocks', tens, ones: ones + b },
      };
    }
    const c = a + b;
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${c} ${MINUS} ${b} = ?`,
      answer: a,
      hint: `העשרות נשארות ${tens * 10}. החסר רק מהיחידות: ${ones + b} ${MINUS} ${b}.`,
      explain: `${ones + b} ${MINUS} ${b} = ${ones}, ולכן ${c} ${MINUS} ${b} = ${a}.`,
      explainVisual: { type: 'blocks', tens, ones },
    };
  },
};

const plusTens: Level = {
  id: 'g1-add100-3',
  title: 'מוסיפים עשרות',
  intro: {
    lines: ['ב-[[34 + 20]] היחידות לא משתנות.', 'מחברים רק את העשרות: 3 + 2 = 5. התשובה: 54.'],
    visual: { type: 'hundred', highlight: [34, 44, 54] },
  },
  generate: () => {
    const ones = randInt(1, 9);
    const t1 = randInt(1, 7);
    const t2 = randInt(1, 9 - t1);
    const a = t1 * 10 + ones;
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${a} + ${t2 * 10} = ?`,
        answer: a + t2 * 10,
        hint: `היחידות נשארות ${ones}. חבר רק את העשרות: ${t1} + ${t2}.`,
        explain: `${t1} + ${t2} = ${t1 + t2} עשרות, ולכן ${a} + ${t2 * 10} = ${a + t2 * 10}.`,
        explainVisual: { type: 'hundred', highlight: Array.from({ length: t2 + 1 }, (_, i) => a + i * 10) },
      };
    }
    const c = a + t2 * 10;
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${c} ${MINUS} ${t2 * 10} = ?`,
      answer: a,
      hint: `היחידות נשארות ${ones}. החסר רק מהעשרות: ${t1 + t2} ${MINUS} ${t2}.`,
      explain: `${t1 + t2} ${MINUS} ${t2} = ${t1} עשרות, ולכן ${c} ${MINUS} ${t2 * 10} = ${a}.`,
      explainVisual: { type: 'hundred', highlight: [c, a] },
    };
  },
};

const STICKERS = [
  { thing: 'מדבקות', emoji: '⭐' },
  { thing: 'גולות', emoji: '🔵' },
  { thing: 'קלפים', emoji: '🃏' },
  { thing: 'חרוזים', emoji: '📿' },
];

const stories100: Level = {
  id: 'g1-add100-4',
  title: 'סיפורים עד 100',
  intro: {
    lines: ['קרא את הסיפור. מצרפים? — חיבור. מורידים? — חיסור.', 'אחר כך פתור כמו שלמדנו: עשרות עם עשרות, יחידות עם יחידות.'],
  },
  generate: () => {
    const p = pick(PEOPLE);
    const s = pick(STICKERS);
    const kind = randInt(0, 2);
    if (kind === 0) {
      const a = randInt(2, 7) * 10 + randInt(0, 5);
      const b = randInt(1, 2) * 10;
      return {
        kind: 'input',
        text: `ל${p.name} היו ${a} ${s.thing}. ${g(p, 'הוא קיבל', 'היא קיבלה')} עוד ${b}. כמה ${s.thing} יש ל${p.name} עכשיו?`,
        answer: a + b,
        hint: `"קיבל עוד" — חיבור: ${a} + ${b}. חבר את העשרות.`,
        explain: `${a} + ${b} = ${a + b}`,
      };
    }
    if (kind === 1) {
      const a = randInt(3, 9) * 10 + randInt(0, 9);
      const b = randInt(1, a % 10 || 1) * (a % 10 ? 1 : 10);
      return {
        kind: 'input',
        text: `ל${p.name} היו ${a} ${s.thing}. ${g(p, 'הוא נתן', 'היא נתנה')} ${b} לחבר. כמה ${s.thing} נשארו?`,
        answer: a - b,
        hint: `"נתן" — חיסור: ${a} ${MINUS} ${b}.`,
        explain: `${a} ${MINUS} ${b} = ${a - b}`,
      };
    }
    const a = randInt(1, 5) * 10;
    const b = randInt(1, 4) * 10;
    return {
      kind: 'input',
      text: `בכיתה יש ${a} עפרונות כחולים ו-${b} עפרונות אדומים. כמה עפרונות יש בסך הכול?`,
      answer: a + b,
      hint: '"בסך הכול" — מצרפים את שתי הקבוצות.',
      explain: `${a} + ${b} = ${a + b}`,
    };
  },
};

export const add100Topic: Topic = {
  id: 'g1-add100',
  title: 'חיבור וחיסור עד 100',
  icon: '🧮',
  levels: [wholeTens, plusOnes, plusTens, stories100],
};
