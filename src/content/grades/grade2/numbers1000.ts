import type { Level, Option, Topic } from '../../types';
import { pick, randInt, sortedNumberOptions } from '../../lib/random';
import { MINUS } from '../../lib/things';

const blocks: Level = {
  id: 'g2-1000-1',
  title: 'מאות, עשרות ויחידות',
  intro: {
    lines: ['ריבוע כחול = מאה (100). 10 עשרות עושות מאה אחת.', '2 מאות, 3 עשרות ו-4 יחידות = 234.'],
    visual: { type: 'blocks', hundreds: 2, tens: 3, ones: 4 },
  },
  generate: () => {
    const h = randInt(1, 9);
    const t = randInt(0, 9);
    const o = randInt(0, 9);
    const n = h * 100 + t * 10 + o;
    return {
      kind: 'input',
      text: 'איזה מספר מוצג כאן?',
      visual: { type: 'blocks', hundreds: h, tens: t, ones: o },
      answer: n,
      hint: 'ספור קודם את המאות (ריבועים), אחר כך את העשרות (מוטות) ובסוף את היחידות.',
      explain: `${h} מאות, ${t} עשרות ו-${o} יחידות = ${n}.`,
    };
  },
};

const placeValue: Level = {
  id: 'g2-1000-2',
  title: 'ערך הספרה',
  intro: {
    lines: ['ב-[[365]]: 3 מאות, 6 עשרות, 5 יחידות.', '365 = 300 + 60 + 5'],
    visual: { type: 'blocks', hundreds: 3, tens: 6, ones: 5 },
  },
  generate: () => {
    const h = randInt(1, 9);
    const t = randInt(0, 9);
    const o = randInt(0, 9);
    const n = h * 100 + t * 10 + o;
    const kind = randInt(0, 3);
    if (kind === 3) {
      return {
        kind: 'input',
        text: 'איזה מספר זה?',
        expr: `${h * 100} + ${t * 10} + ${o} = ?`,
        answer: n,
        hint: 'כתוב את ספרת המאות, אחריה את העשרות ובסוף את היחידות.',
        explain: `${h * 100} + ${t * 10} + ${o} = ${n}`,
      };
    }
    const names = ['מאות', 'עשרות', 'יחידות'];
    const vals = [h, t, o];
    const ans = vals[kind];
    const opts: Option[] = sortedNumberOptions(ans, { min: 0, max: 9, near: [vals[(kind + 1) % 3] - ans, vals[(kind + 2) % 3] - ans, 1, -1] });
    return {
      kind: 'choice',
      text: `כמה **${names[kind]}** יש במספר [[${n}]]?`,
      options: opts,
      answer: String(ans),
      hint: 'במספר תלת-ספרתי: משמאל — מאות, באמצע — עשרות, מימין — יחידות.',
      explain: `ב-${n} יש ${h} מאות, ${t} עשרות ו-${o} יחידות.`,
      explainVisual: { type: 'blocks', hundreds: h, tens: t, ones: o },
    };
  },
};

function signOptions(): Option[] {
  return ['<', '=', '>'].map((s) => ({ value: s, label: s }));
}

const compare: Level = {
  id: 'g2-1000-3',
  title: 'משווים עד 1000',
  intro: {
    lines: ['משווים קודם את **המאות**. אם הן שוות — את העשרות, ואז את היחידות.'],
    expr: '483 < 512   ·   627 > 621',
  },
  generate: () => {
    const a = randInt(100, 999);
    const kind = randInt(0, 3);
    let b =
      kind === 0
        ? a
        : kind === 1
          ? Math.floor(a / 100) * 100 + randInt(0, 99)
          : kind === 2
            ? Number(String(a).split('').reverse().join(''))
            : randInt(100, 999);
    if (b < 100) b = randInt(100, 999);
    const s = a < b ? '<' : a > b ? '>' : '=';
    return {
      kind: 'choice',
      text: 'בחר את הסימן המתאים:',
      expr: `${a}  ?  ${b}`,
      options: signOptions(),
      answer: s,
      hint: 'השווה את ספרת המאות. אם היא שווה — עבור לעשרות.',
      explain: `[[${a} ${s} ${b}]]`,
    };
  },
};

const line1000: Level = {
  id: 'g2-1000-4',
  title: 'ציר עד 1000',
  intro: {
    lines: ['על ציר עד 1000, כל קפיצה היא 100.', 'בין 300 ל-400 יש 10 קפיצות של 10.'],
    visual: { type: 'numberline', min: 0, max: 1000, step: 100, labelEvery: 100 },
  },
  generate: () => {
    if (Math.random() < 0.5) {
      const n = randInt(1, 9) * 100;
      return {
        kind: 'numberline',
        text: `גע בציר במקום של [[${n}]].`,
        min: 0,
        max: 1000,
        step: 100,
        labelEvery: 500,
        answer: n,
        hint: 'כל קפיצה היא 100. האמצע הוא 500.',
        explain: `${n} נמצא כאן.`,
        explainVisual: { type: 'numberline', min: 0, max: 1000, step: 100, labelEvery: 100, highlight: [n] },
      };
    }
    const base = randInt(1, 9) * 100;
    const n = base + pick([10, 20, 30, 40, 60, 70, 80, 90]);
    return {
      kind: 'numberline',
      text: `גע בציר במקום של [[${n}]].`,
      min: base,
      max: base + 100,
      step: 10,
      labelEvery: 50,
      answer: n,
      hint: `הציר מתחיל ב-${base}. כל קפיצה היא 10.`,
      explain: `${n} נמצא כאן.`,
      explainVisual: { type: 'numberline', min: base, max: base + 100, step: 10, labelEvery: 10, highlight: [n] },
    };
  },
};

const skip: Level = {
  id: 'g2-1000-5',
  title: 'קפיצות של 10 ושל 100',
  intro: {
    lines: ['+10: ספרת העשרות גדלה ב-1.', '+100: ספרת המאות גדלה ב-1.'],
    expr: '345 + 10 = 355   ·   345 + 100 = 445',
  },
  generate: () => {
    const step = pick([10, 100, -10, -100]);
    const n = randInt(Math.abs(step) * 4, 999 - Math.abs(step) * 4);
    if (Math.random() < 0.5) {
      const seq = [0, 1, 2, 3].map((i) => n + step * i);
      return {
        kind: 'input',
        text: 'מה המספר הבא בסדרה?',
        visual: { type: 'sequence', items: [...seq.map(String), '?'] },
        answer: n + step * 4,
        hint: 'בדוק בכמה משתנה כל מספר, ואיזו ספרה משתנה.',
        explain: `בכל פעם ${step > 0 ? 'מוסיפים' : 'מורידים'} ${Math.abs(step)}: ${seq[3]} ${step > 0 ? '+' : MINUS} ${Math.abs(step)} = ${n + step * 4}.`,
      };
    }
    const ans = n + step;
    return {
      kind: 'input',
      text: step > 0 ? `מה המספר שגדול ב-${step} מ-[[${n}]]?` : `מה המספר שקטן ב-${-step} מ-[[${n}]]?`,
      answer: ans,
      hint: Math.abs(step) === 10 ? 'שנה רק את ספרת העשרות (שים לב אם היא עוברת את 9 או את 0).' : 'שנה רק את ספרת המאות.',
      explain: `${n} ${step > 0 ? '+' : MINUS} ${Math.abs(step)} = ${ans}`,
    };
  },
};

export const numbers1000Topic: Topic = {
  id: 'g2-1000',
  title: 'מספרים עד 1000',
  icon: '🔢',
  levels: [blocks, placeValue, compare, line1000, skip],
};
