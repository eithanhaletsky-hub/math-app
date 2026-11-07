import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { MINUS } from '../../lib/things';

/** Avoids floating-point noise: 0.1 + 0.2 → 0.3 */
const r2 = (x: number) => Math.round(x * 100) / 100;
const s = (x: number) => String(r2(x));

const tenths: Level = {
  id: 'g5-dec-1',
  title: 'עשיריות',
  intro: {
    lines: ['[[1/10]] כותבים גם [[0.1]] — "עשירית".', 'הנקודה מפרידה בין השלמים לחלקים: [[2.7]] = 2 שלמים ו-7 עשיריות.'],
    visual: { type: 'fraction', shape: 'bar', parts: 10, filled: 7 },
  },
  generate: () => {
    const n = randInt(1, 9);
    const kind = randInt(0, 2);
    if (kind === 0) {
      return {
        kind: 'input',
        text: 'כתוב כשבר עשרוני: איזה חלק צבוע?',
        visual: { type: 'fraction', shape: 'bar', parts: 10, filled: n },
        answer: n / 10,
        decimal: true,
        hint: `${n} חלקים מתוך 10 = ${n}/10. כותבים: 0 נקודה ${n}.`,
        explain: `[[${n}/10 = 0.${n}]]`,
      };
    }
    if (kind === 1) {
      return {
        kind: 'numberline',
        text: `גע בציר במקום של [[0.${n}]].`,
        min: 0,
        max: 1,
        step: 0.1,
        labelEvery: 0.5,
        answer: n / 10,
        hint: 'הציר מ-0 עד 1 מחולק ל-10 קפיצות. כל קפיצה = 0.1.',
        explain: `0.${n} = ${n} קפיצות של 0.1.`,
        explainVisual: { type: 'numberline', min: 0, max: 1, step: 0.1, labelEvery: 0.1, highlight: [n / 10] },
      };
    }
    const w = randInt(1, 9);
    return {
      kind: 'input',
      text: `כתוב כשבר עשרוני: ${w} שלמים ו-${n} עשיריות.`,
      answer: w + n / 10,
      decimal: true,
      hint: 'השלמים לפני הנקודה, העשיריות אחרי הנקודה.',
      explain: `${w}.${n}`,
    };
  },
};

const hundredths: Level = {
  id: 'g5-dec-2',
  title: 'מאיות',
  intro: {
    lines: ['[[1/100 = 0.01]] — "מאית".', '[[0.35]] = 3 עשיריות ו-5 מאיות = [[35/100]]. 1 שקל = 100 אגורות, אז 35 אגורות = 0.35 ₪.'],
  },
  generate: () => {
    const n = randInt(1, 99);
    const kind = randInt(0, 2);
    const str = (n / 100).toFixed(2);
    if (kind === 0) {
      return {
        kind: 'input',
        text: `כתוב כשבר עשרוני: [[${n}/100]]`,
        answer: n / 100,
        decimal: true,
        hint: 'מאיות = שתי ספרות אחרי הנקודה.' + (n < 10 ? ' שים לב: צריך 0 אחרי הנקודה!' : ''),
        explain: `[[${n}/100 = ${str}]]`,
      };
    }
    if (kind === 1) {
      const ag = randInt(5, 95);
      const sh = randInt(0, 20);
      return {
        kind: 'input',
        text: `כתוב בשקלים: ${sh ? `${sh} שקלים ו-` : ''}${ag} אגורות.`,
        answer: sh + ag / 100,
        decimal: true,
        hint: '100 אגורות = 1 ₪. האגורות — שתי ספרות אחרי הנקודה.',
        explain: `${(sh + ag / 100).toFixed(2)} ₪`,
      };
    }
    const d = String(n).padStart(2, '0');
    const which = pick(['tenths', 'hundredths'] as const);
    const ans = which === 'tenths' ? Number(d[0]) : Number(d[1]);
    return {
      kind: 'input',
      text: `כמה ${which === 'tenths' ? 'עשיריות' : 'מאיות'} יש במספר [[${str}]]? (הספרה במקום הזה)`,
      answer: ans,
      hint: 'אחרי הנקודה: הספרה הראשונה — עשיריות, השנייה — מאיות.',
      explain: `ב-${str}: ${d[0]} עשיריות ו-${d[1]} מאיות.`,
    };
  },
};

const compare: Level = {
  id: 'g5-dec-3',
  title: 'משווים שברים עשרוניים',
  intro: {
    lines: ['משווים משמאל: קודם השלמים, אחר כך העשיריות, אחר כך המאיות.', 'זהירות: [[0.5 > 0.45]]! (5 עשיריות > 4 עשיריות)'],
  },
  generate: () => {
    const kind = randInt(0, 1);
    let a: number;
    let b: number;
    if (kind === 0) {
      // the classic trap: more digits ≠ bigger
      a = randInt(1, 9) / 10;
      b = r2(randInt(1, 9) / 10 + randInt(1, 9) / 100);
    } else {
      a = r2(randInt(0, 5) + randInt(0, 99) / 100);
      b = r2(randInt(0, 5) + randInt(0, 99) / 100);
    }
    const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
    const sg = x < y ? '<' : x > y ? '>' : '=';
    return {
      kind: 'choice',
      text: 'בחר את הסימן המתאים:',
      expr: `${s(x)}  ?  ${s(y)}`,
      options: ['<', '=', '>'].map((v) => ({ value: v, label: v })),
      answer: sg,
      hint: 'הוסף אפסים כדי שיהיה אותו מספר ספרות אחרי הנקודה: 0.5 = 0.50.',
      explain: `[[${x.toFixed(2)} ${sg} ${y.toFixed(2)}]]`,
    };
  },
};

const addSub: Level = {
  id: 'g5-dec-4',
  title: 'חיבור וחיסור עשרוניים',
  intro: {
    lines: ['כותבים נקודה מתחת לנקודה — ומחברים כמו מספרים רגילים.', '[[2.35 + 1.4 = 3.75]]'],
  },
  generate: () => {
    const a = r2(randInt(1, 30) + randInt(0, 99) / 100);
    const b = r2(randInt(0, 9) + randInt(1, 9) / 10);
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${s(a)} + ${s(b)} = ?`,
        answer: r2(a + b),
        decimal: true,
        hint: 'יישר את הנקודות: מאיות עם מאיות, עשיריות עם עשיריות.',
        explain: `${s(a)} + ${s(b)} = ${s(a + b)}`,
      };
    }
    const [big, small] = a > b ? [a, b] : [b, a];
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${s(big)} ${MINUS} ${s(small)} = ?`,
      answer: r2(big - small),
      decimal: true,
      hint: 'יישר את הנקודות. אם חסרה ספרה — הוסף 0 (‏1.4 = 1.40).',
      explain: `${s(big)} ${MINUS} ${s(small)} = ${s(big - small)}`,
    };
  },
};

const times10: Level = {
  id: 'g5-dec-5',
  title: 'כפל וחילוק ב-10 וב-100',
  intro: {
    lines: ['כפול 10 — הנקודה זזה מקום אחד **ימינה**: [[3.45 × 10 = 34.5]].', 'חלקי 10 — הנקודה זזה מקום אחד **שמאלה**: [[34.5 : 10 = 3.45]].'],
  },
  generate: () => {
    const p = pick([10, 100]);
    const x = r2(randInt(1, 99) / 10 + randInt(0, 9) / 100);
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${s(x)} × ${p} = ?`,
        answer: r2(x * p),
        decimal: true,
        hint: `הזז את הנקודה ${p === 10 ? 'מקום אחד' : 'שני מקומות'} ימינה.`,
        explain: `${s(x)} × ${p} = ${s(x * p)}`,
      };
    }
    const y = randInt(10, 999);
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${y} : ${p} = ?`,
      answer: r2(y / p),
      decimal: true,
      hint: `הזז את הנקודה ${p === 10 ? 'מקום אחד' : 'שני מקומות'} שמאלה (${y} = ${y}.0).`,
      explain: `${y} : ${p} = ${s(y / p)}`,
    };
  },
};

const fracToDec: Level = {
  id: 'g5-dec-6',
  title: 'שבר פשוט ↔ עשרוני',
  intro: { lines: ['[[1/2 = 0.5]], [[1/4 = 0.25]], [[3/4 = 0.75]], [[1/5 = 0.2]].', 'מרחיבים למכנה 10 או 100: [[3/5 = 6/10 = 0.6]].'] },
  generate: () => {
    const pair = pick([
      [1, 2],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 20],
      [3, 20],
      [1, 25],
      [7, 10],
      [9, 100],
    ]);
    const [n, d] = pair;
    const v = r2(n / d);
    const opts = shuffle([...new Set([v, r2(n / 10), r2(d / 100), r2(v + 0.1)].map((x) => x.toFixed(2)))]).slice(0, 4);
    if (!opts.includes(v.toFixed(2))) opts[0] = v.toFixed(2);
    return {
      kind: 'choice',
      text: `כתוב כשבר עשרוני: [[${n}/${d}]]`,
      options: shuffle(opts).map((o) => ({ value: o, label: String(Number(o)) })),
      answer: v.toFixed(2),
      hint: `הרחב את ${n}/${d} למכנה 10 או 100.`,
      explain: `[[${n}/${d} = ${s(v)}]]`,
    };
  },
};

export const decimalsTopic: Topic = {
  id: 'g5-dec',
  title: 'שברים עשרוניים',
  icon: '🔟',
  levels: [tenths, hundredths, compare, addSub, times10, fracToDec],
};
