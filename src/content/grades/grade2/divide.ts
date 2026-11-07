import type { Level, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { COUNTABLES } from '../../lib/things';

const share: Level = {
  id: 'g2-div-1',
  title: 'מחלקים שווה בשווה',
  intro: {
    lines: ['בחילוק מחלקים לקבוצות **שוות**.', '12 עוגיות ל-3 ילדים: כל ילד מקבל 4. [[12 : 3 = 4]].'],
    visual: { type: 'objects', emoji: '🍪', groups: [4, 4, 4] },
  },
  generate: () => {
    const kids = randInt(2, 5);
    const each = randInt(2, 6);
    const t = pick(COUNTABLES);
    const total = kids * each;
    return {
      kind: 'input',
      text: `מחלקים ${total} ${t.plural} שווה בשווה ל-${kids} ילדים. כמה מקבל כל ילד?`,
      visual: { type: 'objects', emoji: t.emoji, groups: [total], tappable: true },
      answer: each,
      hint: `תן לכל ילד אחד-אחד בתורו, עד שהכול נגמר. אפשר לסמן בנגיעה.`,
      explain: `${total} : ${kids} = ${each}, כי ${kids} × ${each} = ${total}.`,
      explainVisual: { type: 'objects', emoji: t.emoji, groups: Array(kids).fill(each) },
    };
  },
};

const groupsOf: Level = {
  id: 'g2-div-2',
  title: 'כמה קבוצות?',
  intro: {
    lines: ['אפשר גם לשאול: כמה קבוצות של 3 יש ב-15?', 'סופרים בקפיצות של 3 עד 15: 5 קפיצות. [[15 : 3 = 5]].'],
    visual: { type: 'numberline', min: 0, max: 15, labelEvery: 3, jumps: [0, 3, 6, 9, 12].map((f) => ({ from: f, to: f + 3 })) },
  },
  generate: () => {
    const size = pick([2, 3, 4, 5, 10]);
    const n = randInt(2, 6);
    const total = size * n;
    return {
      kind: 'input',
      text: `יש ${total} גלגלים. כמה עגלות אפשר לבנות, אם לכל עגלה צריך ${size} גלגלים?`,
      answer: n,
      hint: `ספור בקפיצות של ${size} עד ${total}. כמה קפיצות?`,
      explain: `${total} : ${size} = ${n}`,
      explainVisual: {
        type: 'numberline',
        min: 0,
        max: total,
        labelEvery: size,
        jumps: Array.from({ length: n }, (_, i) => ({ from: i * size, to: (i + 1) * size })),
      },
    };
  },
};

const inverse: Level = {
  id: 'g2-div-3',
  title: 'כפל וחילוק — משפחה אחת',
  intro: {
    lines: ['כל תרגיל חילוק "מסתתר" בתרגיל כפל.', '[[4 × 5 = 20]] ולכן [[20 : 4 = 5]] וגם [[20 : 5 = 4]].'],
    visual: { type: 'array', rows: 4, cols: 5 },
  },
  generate: () => {
    const a = pick([2, 3, 4, 5, 10]);
    const b = randInt(1, 10);
    const total = a * b;
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'איזה מספר חסר?',
        expr: `${a} × ? = ${total}`,
        answer: b,
        hint: `ספור בקפיצות של ${a} עד ${total}.`,
        explain: `${a} × ${b} = ${total}`,
      };
    }
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${total} : ${a} = ?`,
      answer: b,
      hint: `חשוב: ${a} כפול כמה זה ${total}?`,
      explain: `${total} : ${a} = ${b}, כי ${a} × ${b} = ${total}.`,
    };
  },
};

export const divideTopic: Topic = {
  id: 'g2-div',
  title: 'מבוא לחילוק',
  icon: '➗',
  levels: [share, groupsOf, inverse],
};
