import type { Level, Option, Question, Topic } from '../../types';
import { distinctInts, pick, randInt } from '../../lib/random';
import { COUNTABLES } from '../../lib/things';

const SIGNS: Option[] = [
  { value: '<', label: '<' },
  { value: '=', label: '=' },
  { value: '>', label: '>' },
];

function sign(a: number, b: number) {
  return a < b ? '<' : a > b ? '>' : '=';
}

function compareQuestion(a: number, b: number, withPictures: boolean): Question {
  const s = sign(a, b);
  const words = s === '<' ? 'קטן מ' : s === '>' ? 'גדול מ' : 'שווה ל';
  const t = pick(COUNTABLES);
  return {
    kind: 'choice',
    text: 'בחר את הסימן המתאים:',
    expr: `${a}  ?  ${b}`,
    visual: withPictures ? { type: 'objects', emoji: t.emoji, groups: [a, b] } : undefined,
    options: SIGNS,
    answer: s,
    hint: 'הפה הפתוח של הסימן תמיד פונה אל המספר **הגדול** יותר.',
    explain: `${a} ${words}-${b}, לכן: [[${a} ${s} ${b}]]`,
  };
}

const compare20: Level = {
  id: 'g1-cmp-1',
  title: 'גדול, קטן, שווה',
  intro: {
    lines: ['[[<]] פירושו "קטן מ", [[>]] פירושו "גדול מ".', 'הצד הפתוח של הסימן פונה אל המספר הגדול.'],
    expr: '3 < 7   ·   9 > 4   ·   5 = 5',
  },
  generate: () => {
    const a = randInt(1, 10);
    const b = Math.random() < 0.15 ? a : randInt(1, 10);
    return compareQuestion(a, b, true);
  },
};

const compare100: Level = {
  id: 'g1-cmp-2',
  title: 'משווים עד 100',
  intro: {
    lines: ['משווים קודם את **העשרות**.', 'אם העשרות שוות — משווים את היחידות.'],
    expr: '47 < 52   ·   36 > 34',
  },
  generate: () => {
    const a = randInt(10, 99);
    const kind = randInt(0, 3);
    let b: number;
    if (kind === 0) b = a; // equal
    else if (kind === 1) b = Math.floor(a / 10) * 10 + randInt(0, 9); // same tens
    else if (kind === 2) b = (a % 10) * 10 + Math.floor(a / 10); // swapped digits (common trap)
    else b = randInt(10, 99);
    if (b < 10) b = randInt(10, 99);
    return { ...compareQuestion(a, b, false), hint: 'השווה קודם את העשרות. אם הן שוות — השווה את היחידות.' };
  },
};

const biggest: Level = {
  id: 'g1-cmp-3',
  title: 'הכי גדול, הכי קטן',
  intro: {
    lines: ['כדי למצוא את המספר הגדול ביותר — מחפשים את העשרות הגדולות ביותר.'],
  },
  generate: () => {
    const max = Math.random() < 0.3 ? 20 : 99;
    const nums = distinctInts(4, 1, max);
    const big = Math.random() < 0.5;
    const ans = big ? Math.max(...nums) : Math.min(...nums);
    return {
      kind: 'choice',
      text: big ? 'איזה מספר הוא **הגדול ביותר**?' : 'איזה מספר הוא **הקטן ביותר**?',
      options: nums.map((n) => ({ value: String(n), label: String(n) })),
      answer: String(ans),
      hint: 'השווה קודם את ספרת העשרות של כל המספרים.',
      explain: `${big ? 'הגדול' : 'הקטן'} ביותר הוא ${ans}.`,
    };
  },
};

const order: Level = {
  id: 'g1-cmp-4',
  title: 'מסדרים לפי הגודל',
  intro: {
    lines: ['גרור כל מספר למקום שלו: מהקטן ביותר עד הגדול ביותר.'],
    expr: '8 < 15 < 31 < 64',
  },
  generate: () => {
    const nums = distinctInts(4, 1, Math.random() < 0.4 ? 20 : 99).sort((a, b) => a - b);
    const places = ['הכי קטן', 'שני', 'שלישי', 'הכי גדול'];
    return {
      kind: 'match',
      text: 'סדר את המספרים מהקטן ביותר לגדול ביותר.',
      pairs: nums.map((n, i) => ({ left: { label: places[i] }, right: { label: String(n) } })),
      hint: 'מצא קודם את המספר הקטן ביותר ושים אותו ראשון.',
      explain: `הסדר הנכון: [[${nums.join(' < ')}]]`,
    };
  },
};

export const compareTopic: Topic = {
  id: 'g1-cmp',
  title: 'השוואת מספרים',
  icon: '⚖️',
  levels: [compare20, compare100, biggest, order],
};
