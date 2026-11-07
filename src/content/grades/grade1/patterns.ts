import type { Level, Topic } from '../../types';
import { distinctInts, pick, randInt, shuffle } from '../../lib/random';
import { MINUS } from '../../lib/things';

const EMOJI_SETS = [
  ['🔴', '🔵', '🟡', '🟢'],
  ['🍎', '🍌', '🍇', '🍊'],
  ['⭐', '🌙', '☀️', '☁️'],
  ['🐶', '🐱', '🐭', '🐰'],
  ['🔺', '🟦', '⚪', '🔶'],
];

/** Pattern units: AB, AAB, ABB, ABC, AABB */
const UNITS = [[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2], [0, 0, 1, 1]];

const shapesPattern: Level = {
  id: 'g1-pat-1',
  title: 'ממשיכים את הדוגמה',
  intro: {
    lines: ['בדוגמה (סדרה) יש חלק שחוזר על עצמו שוב ושוב.', 'מצא מה חוזר — ותדע מה בא אחר כך.'],
    visual: { type: 'sequence', items: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'] },
  },
  generate: () => {
    const set = pick(EMOJI_SETS);
    const unit = pick(UNITS);
    const len = randInt(unit.length * 2, unit.length * 2 + 2);
    const seq = Array.from({ length: len + 1 }, (_, i) => set[unit[i % unit.length]]);
    const ans = seq[len];
    const used = [...new Set(unit)].map((k) => set[k]);
    const extra = set.find((e) => !used.includes(e))!;
    const options = shuffle([...used, extra]).map((e) => ({ value: e, label: e }));
    return {
      kind: 'choice',
      text: 'מה בא במקום סימן השאלה?',
      visual: { type: 'sequence', items: [...seq.slice(0, len), '?'] },
      options,
      answer: ans,
      hint: 'מצא את החלק שחוזר על עצמו. סמן אותו באצבע מההתחלה.',
      explain: `החלק שחוזר הוא: ${unit.map((k) => set[k]).join(' ')} — לכן בא ${ans}.`,
    };
  },
};

const numberPattern: Level = {
  id: 'g1-pat-2',
  title: 'סדרות של מספרים',
  intro: {
    lines: ['בסדרת מספרים בודקים: בכמה גדל (או קטן) כל מספר?'],
    visual: { type: 'sequence', items: ['2', '4', '6', '8', '?'] },
  },
  generate: () => {
    const step = pick([1, 2, 2, 5, 10, -1, -2, -10]);
    const len = 4;
    const start = step > 0 ? randInt(0, Math.max(0, 100 - step * len)) : randInt(-step * len, 50);
    const normalized = Math.abs(step) >= 5 ? start - (start % Math.abs(step)) : start;
    const seq = Array.from({ length: len + 1 }, (_, i) => normalized + step * i);
    const ans = seq[len];
    const word = step > 0 ? `גדל ב-${step}` : `קטן ב-${-step}`;
    return {
      kind: 'input',
      text: 'מה המספר הבא בסדרה?',
      visual: { type: 'sequence', items: [...seq.slice(0, len).map(String), '?'] },
      answer: ans,
      hint: 'בדוק את ההפרש בין שני מספרים שכנים.',
      explain: `כל מספר ${word}. ${seq[len - 1]} ${step > 0 ? '+' : MINUS} ${Math.abs(step)} = ${ans}.`,
    };
  },
};

const evenOdd: Level = {
  id: 'g1-pat-3',
  title: 'זוגי ואי-זוגי',
  intro: {
    lines: ['מספר **זוגי** — אפשר לסדר אותו בזוגות, ואף אחד לא נשאר לבד.', 'מספר **אי-זוגי** — תמיד נשאר אחד בלי זוג.'],
    visual: { type: 'objects', emoji: '🧦', groups: [2, 2, 2, 1] },
  },
  generate: () => {
    const n = randInt(1, Math.random() < 0.6 ? 12 : 30);
    const even = n % 2 === 0;
    const pairs = Math.floor(n / 2);
    const groups = [...Array(pairs).fill(2), ...(even ? [] : [1])];
    return {
      kind: 'choice',
      text: `האם המספר [[${n}]] זוגי או אי-זוגי?`,
      visual: n <= 12 ? { type: 'objects', emoji: '🧦', groups } : undefined,
      options: [
        { value: 'even', label: 'זוגי' },
        { value: 'odd', label: 'אי-זוגי' },
      ],
      answer: even ? 'even' : 'odd',
      hint: n <= 12 ? 'האם יש גרב שנשארה בלי זוג?' : 'הסתכל רק על ספרת היחידות: 0, 2, 4, 6, 8 — זוגי.',
      explain: even ? `${n} זוגי — כל הגרביים בזוגות.` : `${n} אי-זוגי — נשארת גרב אחת לבד.`,
    };
  },
};

const findEven: Level = {
  id: 'g1-pat-4',
  title: 'מצא את הזוגי',
  intro: {
    lines: ['מספר זוגי מסתיים ב-0, 2, 4, 6 או 8.', 'מספר אי-זוגי מסתיים ב-1, 3, 5, 7 או 9.'],
  },
  generate: () => {
    const wantEven = Math.random() < 0.5;
    const pool = distinctInts(30, 1, 99);
    const target = pool.find((n) => (n % 2 === 0) === wantEven)!;
    const others = pool.filter((n) => (n % 2 === 0) !== wantEven).slice(0, 3);
    const nums = shuffle([target, ...others]);
    return {
      kind: 'choice',
      text: wantEven ? 'איזה מספר הוא **זוגי**?' : 'איזה מספר הוא **אי-זוגי**?',
      options: nums.map((n) => ({ value: String(n), label: String(n) })),
      answer: String(target),
      hint: 'הסתכל רק על ספרת היחידות של כל מספר.',
      explain: `${target} מסתיים ב-${target % 10}, ולכן הוא ${wantEven ? 'זוגי' : 'אי-זוגי'}.`,
    };
  },
};

export const patternsTopic: Topic = {
  id: 'g1-pat',
  title: 'סדרות, זוגי ואי-זוגי',
  icon: '🔁',
  levels: [shapesPattern, numberPattern, evenOdd, findEven],
};
