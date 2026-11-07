import type { Level, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const ratioMeaning: Level = {
  id: 'g6-ratio-1',
  title: 'מהו יחס?',
  intro: {
    lines: ['**יחס** משווה בין שתי כמויות. 2 תפוחים על כל 3 בננות: יחס [[2 : 3]].', 'אפשר לצמצם יחס כמו שבר: [[6 : 9 = 2 : 3]].'],
    visual: { type: 'objects', emoji: '🍎', groups: [2, 2] },
  },
  generate: () => {
    const a = randInt(1, 5);
    let b = randInt(1, 6);
    while (gcd(a, b) !== 1 || a === b) b = randInt(1, 6);
    const k = randInt(2, 6);
    return {
      kind: 'input',
      text: `צמצם את היחס [[${a * k} : ${b * k}]]. מה המספר השני?`,
      expr: `${a * k} : ${b * k} = ${a} : ?`,
      answer: b,
      hint: `חלק את שני המספרים באותו מספר (${k}).`,
      explain: `${a * k} : ${k} = ${a}, ${b * k} : ${k} = ${b}.`,
    };
  },
};

const ratioProblems: Level = {
  id: 'g6-ratio-2',
  title: 'בעיות יחס',
  intro: {
    lines: ['במתכון: 2 כוסות קמח על כל כוס סוכר (יחס [[2 : 1]]).', 'עם 3 כוסות סוכר — צריך פי 3 קמח: 6 כוסות.'],
  },
  generate: () => {
    const kind = randInt(0, 1);
    if (kind === 0) {
      const a = randInt(2, 5);
      const b = randInt(1, 4);
      const k = randInt(2, 6);
      return {
        kind: 'input',
        text: `במיץ יש ${a} כוסות מים על כל ${b === 1 ? 'כוס תרכיז' : `${b} כוסות תרכיז`}. כמה כוסות מים צריך ל-${b * k} כוסות תרכיז?`,
        answer: a * k,
        hint: `${b * k} זה פי ${k} מ-${b}. אז גם המים — פי ${k}.`,
        explain: `${a} × ${k} = ${a * k} כוסות מים`,
      };
    }
    const a = randInt(1, 4);
    const b = randInt(1, 4);
    const k = randInt(2, 8);
    const total = (a + b) * k;
    return {
      kind: 'input',
      text: `בכיתה היחס בין בנים לבנות הוא [[${a} : ${b}]], ויש ${total} תלמידים. כמה בנים?`,
      answer: a * k,
      hint: `בכל "קבוצה" יש ${a} בנים ו-${b} בנות = ${a + b} ילדים. כמה קבוצות יש ב-${total}?`,
      explain: `${total} : ${a + b} = ${k} קבוצות. בנים: ${a} × ${k} = ${a * k}.`,
    };
  },
};

const scale: Level = {
  id: 'g6-ratio-3',
  title: 'קנה מידה',
  intro: {
    lines: ['במפה בקנה מידה [[1 : 1000]] — 1 ס"מ במפה = 1,000 ס"מ (10 מטר) במציאות.'],
  },
  generate: () => {
    const sc = pick([100, 1000, 10000, 100000]);
    const cm = randInt(2, 9);
    const realCm = cm * sc;
    const unit = sc >= 100000 ? 'ק"מ' : 'מטר';
    const real = unit === 'ק"מ' ? realCm / 100000 : realCm / 100;
    return {
      kind: 'input',
      text: `במפה בקנה מידה [[1 : ${sc.toLocaleString('en-US')}]], המרחק בין שני בתים הוא ${cm} ס"מ. מה המרחק במציאות, ב${unit === 'ק"מ' ? 'קילומטרים' : 'מטרים'}?`,
      answer: real,
      hint: `${cm} × ${sc.toLocaleString('en-US')} = ${realCm.toLocaleString('en-US')} ס"מ. ${unit === 'ק"מ' ? '100,000 ס"מ = 1 ק"מ' : '100 ס"מ = 1 מטר'}.`,
      explain: `${realCm.toLocaleString('en-US')} ס"מ = ${real} ${unit}`,
    };
  },
};

export const ratioTopic: Topic = {
  id: 'g6-ratio',
  title: 'יחס וקנה מידה',
  icon: '⚖️',
  levels: [ratioMeaning, ratioProblems, scale],
};
