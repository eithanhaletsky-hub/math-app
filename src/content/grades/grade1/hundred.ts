import type { Level, Topic } from '../../types';
import { pick, randInt, sortedNumberOptions } from '../../lib/random';
import { MINUS } from '../../lib/things';

const tensOnes: Level = {
  id: 'g1-100-1',
  title: 'עשרות ויחידות',
  intro: {
    lines: ['מוט ירוק = עשרת (10). קובייה כתומה = יחידה (1).', '3 עשרות ו-4 יחידות = 34.'],
    visual: { type: 'blocks', tens: 3, ones: 4 },
  },
  generate: () => {
    const tens = randInt(1, 9);
    const ones = randInt(0, 9);
    const n = tens * 10 + ones;
    return {
      kind: 'input',
      text: 'איזה מספר מוצג כאן?',
      visual: { type: 'blocks', tens, ones },
      answer: n,
      hint: 'ספור את המוטות (עשרות) — זו הספרה הראשונה. ואז את הקוביות (יחידות).',
      explain: `${tens} עשרות ו-${ones} יחידות = ${n}.`,
    };
  },
};

const digits: Level = {
  id: 'g1-100-2',
  title: 'מה ערך הספרה?',
  intro: {
    lines: ['ב-[[47]]: הספרה 4 היא **עשרות**, והספרה 7 היא **יחידות**.', '47 = 40 + 7'],
    visual: { type: 'blocks', tens: 4, ones: 7 },
  },
  generate: () => {
    const tens = randInt(1, 9);
    const ones = randInt(1, 9);
    const n = tens * 10 + ones;
    const kind = randInt(0, 2);
    if (kind === 0) {
      return {
        kind: 'choice',
        text: `כמה **עשרות** יש במספר [[${n}]]?`,
        options: sortedNumberOptions(tens, { min: 0, max: 9, near: [1, -1, ones - tens, 2] }),
        answer: String(tens),
        hint: 'העשרות הן הספרה השמאלית במספר.',
        explain: `ב-${n} יש ${tens} עשרות (${tens * 10}) ו-${ones} יחידות.`,
        explainVisual: { type: 'blocks', tens, ones },
      };
    }
    if (kind === 1) {
      return {
        kind: 'choice',
        text: `כמה **יחידות** יש במספר [[${n}]]?`,
        options: sortedNumberOptions(ones, { min: 0, max: 9, near: [1, -1, tens - ones, 2] }),
        answer: String(ones),
        hint: 'היחידות הן הספרה הימנית במספר.',
        explain: `ב-${n} יש ${ones} יחידות.`,
        explainVisual: { type: 'blocks', tens, ones },
      };
    }
    return {
      kind: 'input',
      text: `${tens} עשרות ו-${ones} יחידות — איזה מספר זה?`,
      answer: n,
      hint: `${tens} עשרות זה ${tens * 10}. עכשיו הוסף ${ones}.`,
      explain: `${tens * 10} + ${ones} = ${n}`,
      explainVisual: { type: 'blocks', tens, ones },
    };
  },
};

const hundredChart: Level = {
  id: 'g1-100-3',
  title: 'לוח המאה',
  intro: {
    lines: ['בלוח המאה: ימינה +1, שמאלה −1.', 'שורה למטה: +10. שורה למעלה: −10.'],
    visual: { type: 'hundred', highlight: [34, 35, 44] },
  },
  generate: () => {
    const n = randInt(2, 99);
    return {
      kind: 'choice',
      text: 'איזה מספר מסתתר מאחורי סימן השאלה?',
      visual: { type: 'hundred', hidden: [n] },
      options: sortedNumberOptions(n, { min: 1, max: 100, near: [1, -1, 10, -10] }),
      answer: String(n),
      hint: 'הסתכל על המספרים שליד סימן השאלה, ועל המספר שמעליו.',
      explain:
        n % 10 === 1
          ? `מימין יש ${n + 1}, ומעל יש ${n - 10}. לכן זה ${n}.`
          : n > 10
            ? `משמאל יש ${n - 1}, ומעל יש ${n - 10}. לכן זה ${n}.`
            : `משמאל יש ${n - 1}, לכן זה ${n}.`,
    };
  },
};

const tens: Level = {
  id: 'g1-100-4',
  title: '10 יותר, 10 פחות',
  intro: {
    lines: ['כשמוסיפים 10, רק ספרת העשרות גדלה ב-1.', '[[34 + 10 = 44]] — בלוח המאה זו שורה אחת למטה.'],
    visual: { type: 'hundred', highlight: [34, 44] },
  },
  generate: () => {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const start = randInt(0, 5) * 10;
      const seq = [start, start + 10, start + 20, start + 30];
      return {
        kind: 'input',
        text: 'סופרים בעשרות. מה המספר הבא?',
        visual: { type: 'sequence', items: [...seq.map(String), '?'] },
        answer: start + 40,
        hint: 'בכל צעד מוסיפים 10.',
        explain: `${start + 30} + 10 = ${start + 40}`,
      };
    }
    const n = randInt(11, 89);
    const up = kind === 1;
    const ans = up ? n + 10 : n - 10;
    return {
      kind: 'choice',
      text: up ? `מה המספר שגדול ב-10 מ-[[${n}]]?` : `מה המספר שקטן ב-10 מ-[[${n}]]?`,
      options: sortedNumberOptions(ans, { min: 0, max: 100, near: [1, -1, 10, -10] }),
      answer: String(ans),
      hint: up ? 'רק ספרת העשרות משתנה — היא גדלה ב-1.' : 'רק ספרת העשרות משתנה — היא קטנה ב-1.',
      explain: up ? `${n} + 10 = ${ans}` : `${n} ${MINUS} 10 = ${ans}`,
      explainVisual: { type: 'hundred', highlight: [n, ans] },
    };
  },
};

const line100: Level = {
  id: 'g1-100-5',
  title: 'ציר עד 100',
  intro: {
    lines: ['על ציר עד 100, כל קפיצה גדולה היא 10.', 'באמצע בין 0 ל-100 נמצא 50.'],
    visual: { type: 'numberline', min: 0, max: 100, step: 10, labelEvery: 10 },
  },
  generate: () => {
    if (Math.random() < 0.5) {
      const n = randInt(1, 9) * 10;
      return {
        kind: 'numberline',
        text: `גע בציר במקום של [[${n}]].`,
        min: 0,
        max: 100,
        step: 10,
        labelEvery: 50,
        answer: n,
        hint: 'כל קפיצה היא 10. ספור: 10, 20, 30…',
        explain: `${n} נמצא כאן.`,
        explainVisual: { type: 'numberline', min: 0, max: 100, step: 10, labelEvery: 10, highlight: [n] },
      };
    }
    const decade = randInt(1, 8) * 10;
    const n = decade + pick([1, 2, 3, 4, 6, 7, 8, 9]);
    return {
      kind: 'numberline',
      text: `גע בציר במקום של [[${n}]].`,
      min: decade,
      max: decade + 10,
      step: 1,
      labelEvery: 5,
      answer: n,
      hint: `הציר מתחיל ב-${decade}. ספור קפיצות של 1.`,
      explain: `${n} נמצא כאן.`,
      explainVisual: { type: 'numberline', min: decade, max: decade + 10, labelEvery: 1, highlight: [n] },
    };
  },
};

export const hundredTopic: Topic = {
  id: 'g1-100',
  title: 'מספרים עד 100',
  icon: '💯',
  levels: [tensOnes, digits, hundredChart, tens, line100],
};
