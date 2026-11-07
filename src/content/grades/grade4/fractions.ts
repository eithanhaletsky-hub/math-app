import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { MINUS } from '../../lib/things';

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const equivalentSee: Level = {
  id: 'g4-frac-1',
  title: 'שברים שקולים',
  intro: {
    lines: ['שברים **שקולים** — אותו חלק מהשלם, בכתיבה אחרת.', '[[1/2 = 2/4 = 4/8]]: חצי מלבן הוא גם 2 רבעים וגם 4 שמיניות.'],
    visual: { type: 'fraction', shape: 'bar', parts: 8, filled: 4 },
  },
  generate: () => {
    const d = pick([2, 3, 4, 5]);
    const n = randInt(1, d - 1);
    const k = pick([2, 3, 4].filter((x) => d * x <= 12));
    const right = `${n * k}/${d * k}`;
    const wrongs = [`${n + k}/${d + k}`, `${n * k}/${d}`, `${n}/${d * k}`, `${n * k + 1}/${d * k}`];
    const opts = shuffle([right, ...shuffle([...new Set(wrongs)].filter((w) => w !== right)).slice(0, 3)]);
    return {
      kind: 'choice',
      text: `איזה שבר שקול ל-[[${n}/${d}]]?`,
      visual: { type: 'fraction', shape: 'bar', parts: d, filled: n },
      options: opts.map((o) => ({ value: o, label: o })),
      answer: right,
      hint: 'כדי לקבל שבר שקול — כופלים את המונה **וגם** את המכנה באותו מספר.',
      explain: `${n} × ${k} = ${n * k}, ${d} × ${k} = ${d * k}. לכן [[${n}/${d} = ${right}]].`,
      explainVisual: { type: 'fraction', shape: 'bar', parts: d * k, filled: n * k },
    };
  },
};

const expand: Level = {
  id: 'g4-frac-2',
  title: 'הרחבה וצמצום',
  intro: {
    lines: ['**הרחבה**: כופלים מונה ומכנה באותו מספר. [[2/3 = 4/6]]', '**צמצום**: מחלקים מונה ומכנה באותו מספר. [[6/9 = 2/3]]'],
  },
  generate: () => {
    const d = randInt(2, 7);
    let n = randInt(1, d - 1);
    while (gcd(n, d) !== 1) n = randInt(1, d - 1);
    const k = randInt(2, 5);
    const kind = randInt(0, 2);
    if (kind === 0) {
      return {
        kind: 'input',
        text: 'השלם את המונה:',
        expr: `${n}/${d} = ?/${d * k}`,
        answer: n * k,
        hint: `ב-מה כפלו את ${d} כדי לקבל ${d * k}? כפול גם את ${n}.`,
        explain: `${d} × ${k} = ${d * k}, ולכן ${n} × ${k} = ${n * k}.`,
      };
    }
    if (kind === 1) {
      return {
        kind: 'input',
        text: 'השלם את המכנה:',
        expr: `${n}/${d} = ${n * k}/?`,
        answer: d * k,
        hint: `${n} × ${k} = ${n * k}. כפול גם את המכנה ב-${k}.`,
        explain: `${d} × ${k} = ${d * k}`,
      };
    }
    return {
      kind: 'input',
      text: 'צמצם עד הסוף. מה המונה?',
      expr: `${n * k}/${d * k} = ?/${d}`,
      answer: n,
      hint: `חלק את המונה והמכנה ב-${k}.`,
      explain: `${n * k} : ${k} = ${n}, ${d * k} : ${k} = ${d}.`,
    };
  },
};

const compare: Level = {
  id: 'g4-frac-3',
  title: 'משווים שברים',
  intro: {
    lines: ['כשהמכנים שונים — מרחיבים למכנה משותף, ואז משווים מונים.', '[[2/3 ? 3/4]] → [[8/12 < 9/12]]'],
  },
  generate: () => {
    const d1 = randInt(2, 6);
    let d2 = randInt(2, 8);
    if (d2 === d1) d2 = d1 + 1;
    const n1 = randInt(1, d1 - 1);
    const n2 = randInt(1, d2 - 1);
    const l = n1 * d2;
    const r = n2 * d1;
    const s = l < r ? '<' : l > r ? '>' : '=';
    return {
      kind: 'choice',
      text: 'בחר את הסימן המתאים:',
      expr: `${n1}/${d1}  ?  ${n2}/${d2}`,
      options: ['<', '=', '>'].map((x) => ({ value: x, label: x })),
      answer: s,
      hint: `הרחב את שניהם למכנה ${d1 * d2}: ${n1}/${d1} = ?/${d1 * d2}, ${n2}/${d2} = ?/${d1 * d2}.`,
      explain: `[[${l}/${d1 * d2} ${s} ${r}/${d1 * d2}]], לכן [[${n1}/${d1} ${s} ${n2}/${d2}]].`,
    };
  },
};

const mixed: Level = {
  id: 'g4-frac-4',
  title: 'מספרים מעורבים',
  intro: {
    lines: ['[[7/4]] = 4 רבעים (שלם אחד) ועוד 3 רבעים = [[1 3/4]].', 'מספר מעורב = שלמים + שבר.'],
    visual: { type: 'fraction', shape: 'circle', parts: 4, filled: 4 },
  },
  generate: () => {
    const d = randInt(2, 8);
    const w = randInt(1, 4);
    const n = randInt(1, d - 1);
    const improper = w * d + n;
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'כתוב כשבר (מה המונה?)',
        expr: `${w} ${n}/${d} = ?/${d}`,
        answer: improper,
        hint: `בכל שלם יש ${d} חלקים: ${w} × ${d} = ${w * d}. ועוד ${n}.`,
        explain: `${w} × ${d} + ${n} = ${improper}, לכן [[${w} ${n}/${d} = ${improper}/${d}]].`,
      };
    }
    return {
      kind: 'input',
      text: 'כמה שלמים יש בשבר?',
      expr: `${improper}/${d} = ? ${n}/${d}`,
      answer: w,
      hint: `כמה פעמים ${d} נכנס ב-${improper}?`,
      explain: `${improper} : ${d} = ${w} ושארית ${n}, לכן [[${improper}/${d} = ${w} ${n}/${d}]].`,
    };
  },
};

const addSame: Level = {
  id: 'g4-frac-5',
  title: 'חיבור וחיסור — אותו מכנה',
  intro: {
    lines: ['כשהמכנה שווה — מחברים (או מחסרים) רק את המונים.', 'המכנה נשאר! [[2/7 + 3/7 = 5/7]]'],
  },
  generate: () => {
    const d = randInt(3, 12);
    const plus = Math.random() < 0.5;
    const a = randInt(1, d - 2);
    if (plus) {
      const b = randInt(1, d - 1 - a);
      return {
        kind: 'input',
        text: 'מה המונה של התוצאה?',
        expr: `${a}/${d} + ${b}/${d} = ?/${d}`,
        answer: a + b,
        hint: `מחברים רק מונים: ${a} + ${b}. המכנה ${d} לא משתנה.`,
        explain: `[[${a}/${d} + ${b}/${d} = ${a + b}/${d}]]`,
      };
    }
    const big = randInt(2, d - 1);
    const b = randInt(1, big - 1);
    return {
      kind: 'input',
      text: 'מה המונה של התוצאה?',
      expr: `${big}/${d} ${MINUS} ${b}/${d} = ?/${d}`,
      answer: big - b,
      hint: `מחסרים רק מונים: ${big} ${MINUS} ${b}.`,
      explain: `[[${big}/${d} ${MINUS} ${b}/${d} = ${big - b}/${d}]]`,
    };
  },
};

const fractionOf: Level = {
  id: 'g4-frac-6',
  title: 'שבר מכמות',
  intro: { lines: ['[[3/4]] מ-20: מחלקים ב-4 (= 5), וכופלים ב-3 (= 15).'] },
  generate: () => {
    const d = pick([2, 3, 4, 5, 6, 8, 10]);
    const n = randInt(1, d - 1);
    const unit = randInt(2, 12);
    const total = unit * d;
    return {
      kind: 'input',
      text: `כמה זה [[${n}/${d}]] מ-${total}?`,
      answer: unit * n,
      hint: `${total} : ${d} = ? ואז כפול ${n}.`,
      explain: `${total} : ${d} = ${unit}, ${unit} × ${n} = ${unit * n}.`,
    };
  },
};

export const fractionsTopic: Topic = {
  id: 'g4-frac',
  title: 'שברים',
  icon: '🍕',
  levels: [equivalentSee, expand, compare, mixed, addSame, fractionOf],
};
