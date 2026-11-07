import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';

const r2 = (x: number) => Math.round(x * 100) / 100;
const s = (x: number) => String(r2(x));
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const decTimesWhole: Level = {
  id: 'g6-num-1',
  title: 'עשרוני כפול שלם',
  intro: {
    lines: ['כופלים כאילו אין נקודה, ואז מחזירים את הנקודה.', '[[1.25 × 3]]: 125 × 3 = 375 → 3.75 (שתי ספרות אחרי הנקודה).'],
  },
  generate: () => {
    const a = r2(randInt(1, 30) / 10 + pick([0, 0.05, 0.25, 0.5, 0.15]));
    const k = randInt(2, 9);
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${s(a)} × ${k} = ?`,
      answer: r2(a * k),
      decimal: true,
      hint: `חשב בלי הנקודה, ואז השאר אותו מספר ספרות אחרי הנקודה כמו ב-${s(a)}.`,
      explain: `${s(a)} × ${k} = ${s(a * k)}`,
    };
  },
};

const decTimesDec: Level = {
  id: 'g6-num-2',
  title: 'עשרוני כפול עשרוני',
  intro: {
    lines: ['סופרים כמה ספרות יש אחרי הנקודה בשני המספרים ביחד.', '[[0.3 × 0.4]]: 3 × 4 = 12, ושתי ספרות אחרי הנקודה → 0.12.'],
  },
  generate: () => {
    const a = randInt(1, 9) / 10;
    const b = r2(randInt(1, 30) / 10);
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${s(a)} × ${s(b)} = ?`,
      answer: r2(a * b),
      decimal: true,
      hint: `${Math.round(a * 10)} × ${Math.round(b * 10)} = ${Math.round(a * 10) * Math.round(b * 10)}. כמה ספרות אחרי הנקודה בסך הכול?`,
      explain: `${s(a)} × ${s(b)} = ${s(a * b)}`,
    };
  },
};

const decDivide: Level = {
  id: 'g6-num-3',
  title: 'חילוק עשרוני',
  intro: {
    lines: ['עשרוני חלקי שלם: מחלקים רגיל, והנקודה נשארת במקומה.', '[[7.5 : 3 = 2.5]]'],
  },
  generate: () => {
    const d = randInt(2, 9);
    const q = r2(randInt(1, 40) / 10 + pick([0, 0.05]));
    const n = r2(q * d);
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${s(n)} : ${d} = ?`,
      answer: q,
      decimal: true,
      hint: `בדוק: איזה מספר כפול ${d} נותן ${s(n)}?`,
      explain: `${s(n)} : ${d} = ${s(q)}, כי ${s(q)} × ${d} = ${s(n)}.`,
    };
  },
};

const roundDec: Level = {
  id: 'g6-num-4',
  title: 'עיגול עשרוניים',
  intro: { lines: ['לעגל לשלם: מסתכלים על העשיריות. 5 ומעלה — למעלה.', '[[3.47 ≈ 3]], [[3.5 ≈ 4]]. לעשיריות: מסתכלים על המאיות.'] },
  generate: () => {
    const x = r2(randInt(0, 20) + randInt(1, 99) / 100);
    const toWhole = Math.random() < 0.5;
    if (toWhole) {
      const lo = Math.floor(x);
      const ans = x - lo >= 0.5 ? lo + 1 : lo;
      return {
        kind: 'choice',
        text: `עגל את [[${s(x)}]] למספר שלם.`,
        options: [lo, lo + 1].map((v) => ({ value: String(v), label: String(v) })),
        answer: String(ans),
        hint: 'הסתכל על ספרת העשיריות.',
        explain: `${s(x)} ≈ ${ans}`,
      };
    }
    const lo = Math.floor(x * 10) / 10;
    const ans = r2(Math.round(x * 100) % 10 >= 5 ? lo + 0.1 : lo);
    return {
      kind: 'choice',
      text: `עגל את [[${x.toFixed(2)}]] לעשיריות.`,
      options: [lo, r2(lo + 0.1)].map((v) => ({ value: v.toFixed(1), label: v.toFixed(1) })),
      answer: ans.toFixed(1),
      hint: 'הסתכל על ספרת המאיות.',
      explain: `${x.toFixed(2)} ≈ ${ans.toFixed(1)}`,
    };
  },
};

const fracDivide: Level = {
  id: 'g6-num-5',
  title: 'חילוק שברים',
  intro: {
    lines: ['[[3 : 1/2]] = כמה חצאים יש ב-3? → 6.', 'כלל: מחלקים בשבר = כופלים בשבר ההפוך. [[2/3 : 4/5 = 2/3 × 5/4]]'],
    visual: { type: 'fraction', shape: 'bar', parts: 2, filled: 1 },
  },
  generate: () => {
    if (Math.random() < 0.5) {
      const w = randInt(1, 6);
      const d = randInt(2, 6);
      return {
        kind: 'input',
        text: `כמה פעמים [[1/${d}]] נכנס ב-${w}?`,
        expr: `${w} : 1/${d} = ?`,
        answer: w * d,
        hint: `בכל שלם יש ${d} חלקים של 1/${d}.`,
        explain: `${w} × ${d} = ${w * d}`,
      };
    }
    const d1 = randInt(2, 6);
    const n1 = randInt(1, d1 - 1);
    const d2 = randInt(2, 6);
    const n2 = randInt(1, d2 - 1);
    // a/b : c/d = (a·d)/(b·c)
    return {
      kind: 'input',
      text: 'מה המונה של התוצאה (בלי לצמצם)?',
      expr: `${n1}/${d1} : ${n2}/${d2} = ?/${d1 * n2}`,
      answer: n1 * d2,
      hint: `הפוך את השבר השני וכפול: ${n1}/${d1} × ${d2}/${n2}.`,
      explain: `[[${n1}/${d1} × ${d2}/${n2} = ${n1 * d2}/${d1 * n2}]]`,
    };
  },
};

const fracOfFrac: Level = {
  id: 'g6-num-6',
  title: 'שבר משבר',
  intro: { lines: ['"חצי מרבע" = [[1/2 × 1/4 = 1/8]].', 'המילה "מ" בשברים פירושה כפל.'] },
  generate: () => {
    const pairs = shuffle([
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [3, 4],
    ]);
    const [a, b] = pairs[0];
    const [c, d] = pairs[1];
    const n = a * c;
    const den = b * d;
    const g = gcd(n, den);
    return {
      kind: 'input',
      text: `כמה זה [[${a}/${b}]] מ-[[${c}/${d}]]? (מה המכנה אחרי צמצום?)`,
      answer: den / g,
      hint: `כפול: ${a}/${b} × ${c}/${d} = ${n}/${den}. אפשר לצמצם?`,
      explain: `[[${n}/${den} = ${n / g}/${den / g}]]`,
    };
  },
};

export const numberOpsTopic: Topic = {
  id: 'g6-num',
  title: 'עשרוניים ושברים',
  icon: '🔢',
  levels: [decTimesWhole, decTimesDec, decDivide, roundDec, fracDivide, fracOfFrac],
};
