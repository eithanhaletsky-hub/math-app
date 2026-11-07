import type { Level, Topic } from '../../types';
import { distinctInts, pick, randInt, sortedNumberOptions } from '../../lib/random';

function factLevel(id: string, title: string, factors: number[], lines: string[]): Level {
  return {
    id,
    title,
    intro: { lines },
    generate: () => {
      const a = pick(factors);
      const b = randInt(1, 10);
      const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
      const strategy =
        a === 9
          ? `טריק: ${a} × ${b} = 10 × ${b} פחות ${b} = ${10 * b} − ${b}.`
          : b > 5
            ? `פרק: ${a} × 5 = ${a * 5}, ועוד ${a} × ${b - 5} = ${a * (b - 5)}.`
            : b > 1
              ? `${a} × ${b - 1} = ${a * (b - 1)}. עכשיו הוסף עוד ${a}.`
              : 'כל מספר כפול 1 שווה לעצמו.';
      if (Math.random() < 0.3) {
        return {
          kind: 'choice',
          text: 'כמה זה?',
          expr: `${x} × ${y} = ?`,
          options: sortedNumberOptions(a * b, { min: 1, max: 100, near: [a, -a, b, -b, 1, 10] }),
          answer: String(a * b),
          hint: strategy,
          explain: `${x} × ${y} = ${a * b}`,
        };
      }
      return {
        kind: 'input',
        text: 'כמה זה?',
        expr: `${x} × ${y} = ?`,
        answer: a * b,
        hint: strategy,
        explain: `${x} × ${y} = ${a * b}`,
        explainVisual: a * b <= 50 ? { type: 'array', rows: Math.min(x, y), cols: Math.max(x, y) } : undefined,
      };
    },
  };
}

const t6 = factLevel('g3-tab-1', 'כפל ב-6', [6], ['6 × מספר = 5 × המספר ועוד המספר פעם אחת.', '[[6 × 7 = 5 × 7 + 7 = 35 + 7 = 42]]']);
const t7 = factLevel('g3-tab-2', 'כפל ב-7', [7], ['7 × מספר = 5 × המספר ועוד 2 × המספר.', '[[7 × 6 = 30 + 12 = 42]]']);
const t8 = factLevel('g3-tab-3', 'כפל ב-8', [8], ['8 × = לכפול ב-2, שוב ב-2, ושוב ב-2.', '[[8 × 3 = 6 → 12 → 24]]']);
const t9 = factLevel('g3-tab-4', 'כפל ב-9', [9], ['9 × מספר = 10 × המספר פחות המספר.', '[[9 × 7 = 70 − 7 = 63]]']);
const tAll = factLevel('g3-tab-5', 'כל לוח הכפל', [2, 3, 4, 5, 6, 7, 8, 9, 10], ['ערבוב של כל לוח הכפל!', 'זכור: 0 × כל מספר = 0, 1 × כל מספר = המספר עצמו.']);

const missing: Level = {
  id: 'g3-tab-6',
  title: 'הגורם החסר',
  intro: { lines: ['[[? × 6 = 42]] — חושבים: איזה מספר כפול 6 נותן 42?', 'זה בדיוק כמו [[42 : 6]].'] },
  generate: () => {
    const a = randInt(2, 10);
    const b = randInt(2, 10);
    return Math.random() < 0.5
      ? {
          kind: 'input',
          text: 'איזה מספר חסר?',
          expr: `${a} × ? = ${a * b}`,
          answer: b,
          hint: `ספור בקפיצות של ${a} עד ${a * b}, או חשוב: ${a * b} : ${a}.`,
          explain: `${a} × ${b} = ${a * b}`,
        }
      : {
          kind: 'input',
          text: 'פתור:',
          expr: `${a * b} : ${a} = ?`,
          answer: b,
          hint: `${a} כפול כמה זה ${a * b}?`,
          explain: `${a * b} : ${a} = ${b}, כי ${a} × ${b} = ${a * b}.`,
        };
  },
};

const matchFacts: Level = {
  id: 'g3-tab-7',
  title: 'התאמה בלוח הכפל',
  intro: { lines: ['גרור לכל תרגיל כפל את התוצאה שלו.'] },
  generate: () => {
    // distinct products so each result fits exactly one exercise
    const used = new Set<number>();
    const pairs: { a: number; b: number }[] = [];
    let guard = 0;
    while (pairs.length < 4 && guard++ < 100) {
      const [a, b] = distinctInts(2, 3, 9);
      if (used.has(a * b)) continue;
      used.add(a * b);
      pairs.push({ a, b });
    }
    return {
      kind: 'match',
      text: 'גרור לכל תרגיל את התוצאה שלו.',
      pairs: pairs.map(({ a, b }) => ({ left: { label: `${a} × ${b}` }, right: { label: String(a * b) } })),
      hint: 'התחל מהתרגיל שאתה הכי בטוח בו.',
      explain: pairs.map(({ a, b }) => `${a} × ${b} = ${a * b}`).join(' · '),
    };
  },
};

export const tableTopic: Topic = {
  id: 'g3-tab',
  title: 'לוח הכפל',
  icon: '✖️',
  levels: [t6, t7, t8, t9, tAll, missing, matchFacts],
};
