import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';

const divisorsOf = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const isPrime = (n: number) => n > 1 && divisorsOf(n).length === 2;
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const divisors: Level = {
  id: 'g5-div-1',
  title: 'מחלקים',
  intro: {
    lines: ['**מחלק** של מספר — מספר שהוא מתחלק בו בלי שארית.', 'המחלקים של 12: 1, 2, 3, 4, 6, 12 (בזוגות: 1×12, 2×6, 3×4).'],
    visual: { type: 'array', rows: 3, cols: 4 },
  },
  generate: () => {
    const n = pick([12, 16, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48]);
    const ds = divisorsOf(n);
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: `כמה מחלקים יש למספר [[${n}]]? (כולל 1 ו-${n})`,
        answer: ds.length,
        hint: `חפש זוגות שמכפלתם ${n}: 1 × ${n}, 2 × …`,
        explain: `המחלקים של ${n}: ${ds.join(', ')} — ${ds.length} מחלקים.`,
      };
    }
    const yes = pick(ds.filter((d) => d > 1 && d < n));
    const nos = shuffle(Array.from({ length: 14 }, (_, i) => i + 2).filter((x) => n % x !== 0)).slice(0, 3);
    return {
      kind: 'choice',
      text: `איזה מהמספרים הוא מחלק של [[${n}]]?`,
      options: shuffle([yes, ...nos]).map((x) => ({ value: String(x), label: String(x) })),
      answer: String(yes),
      hint: `בדוק: ${n} מתחלק בו בלי שארית?`,
      explain: `${n} : ${yes} = ${n / yes}, בלי שארית.`,
    };
  },
};

const multiples: Level = {
  id: 'g5-div-2',
  title: 'כפולות',
  intro: { lines: ['**כפולה** של מספר — התוצאה כשכופלים אותו במספר שלם.', 'כפולות של 6: 6, 12, 18, 24, 30…'] },
  generate: () => {
    const k = randInt(3, 12);
    if (Math.random() < 0.5) {
      const seq = [1, 2, 3, 4].map((i) => k * i);
      return {
        kind: 'input',
        text: `מה הכפולה הבאה של ${k}?`,
        visual: { type: 'sequence', items: [...seq.map(String), '?'] },
        answer: k * 5,
        hint: `הוסף ${k} לכפולה האחרונה.`,
        explain: `${k} × 5 = ${k * 5}`,
      };
    }
    const good = k * randInt(3, 12);
    const bad = shuffle([good + 1, good - 1, good + Math.ceil(k / 2), good + k + 1, good - k + 1].filter((x) => x > 0 && x % k !== 0)).slice(0, 3);
    return {
      kind: 'choice',
      text: `איזה מספר הוא כפולה של ${k}?`,
      options: shuffle([good, ...bad]).map((x) => ({ value: String(x), label: String(x) })),
      answer: String(good),
      hint: `כפולה של ${k} מתחלקת ב-${k} בלי שארית.`,
      explain: `${good} = ${k} × ${good / k}`,
    };
  },
};

const primes: Level = {
  id: 'g5-div-3',
  title: 'ראשוני או פריק?',
  intro: {
    lines: ['מספר **ראשוני** — יש לו בדיוק 2 מחלקים: 1 והוא עצמו (2, 3, 5, 7, 11…).', 'מספר **פריק** — יש לו יותר מ-2 מחלקים. (1 — לא ראשוני ולא פריק.)'],
  },
  generate: () => {
    const n = randInt(2, 60);
    const p = isPrime(n);
    const ds = divisorsOf(n);
    return {
      kind: 'choice',
      text: `האם [[${n}]] ראשוני או פריק?`,
      options: [
        { value: 'prime', label: 'ראשוני' },
        { value: 'composite', label: 'פריק' },
      ],
      answer: p ? 'prime' : 'composite',
      hint: 'נסה לחלק ב-2, 3, 5, 7. אם אחד מהם מחלק אותו (והוא לא המספר עצמו) — פריק.',
      explain: p ? `ל-${n} רק שני מחלקים: 1 ו-${n}. ראשוני.` : `ל-${n} יש ${ds.length} מחלקים (${ds.join(', ')}). פריק.`,
    };
  },
};

const div9: Level = {
  id: 'g5-div-4',
  title: 'התחלקות ב-9 וב-6',
  intro: {
    lines: ['מתחלק ב-9 — אם סכום הספרות מתחלק ב-9.', 'מתחלק ב-6 — אם מתחלק גם ב-2 וגם ב-3.'],
  },
  generate: () => {
    const d = pick([9, 6, 4]);
    let n = randInt(100, 999);
    if (Math.random() < 0.5) n -= n % d;
    else if (n % d === 0) n += 1;
    const yes = n % d === 0;
    const sum = String(n).split('').reduce((a, c) => a + Number(c), 0);
    const rule =
      d === 9
        ? `סכום הספרות: ${sum}. ${sum % 9 === 0 ? 'מתחלק ב-9 ✓' : 'לא מתחלק ב-9'}`
        : d === 6
          ? `${n % 2 === 0 ? 'זוגי ✓' : 'לא זוגי ✗'}, סכום ספרות ${sum} ${sum % 3 === 0 ? 'מתחלק ב-3 ✓' : 'לא מתחלק ב-3 ✗'}.`
          : `שתי הספרות האחרונות: ${n % 100}. ${(n % 100) % 4 === 0 ? 'מתחלק ב-4 ✓' : 'לא מתחלק ב-4'}`;
    return {
      kind: 'choice',
      text: `האם [[${n}]] מתחלק ב-${d}?`,
      options: [
        { value: 'yes', label: 'כן' },
        { value: 'no', label: 'לא' },
      ],
      answer: yes ? 'yes' : 'no',
      hint: d === 9 ? 'חבר את הספרות.' : d === 6 ? 'בדוק: זוגי? סכום ספרות מתחלק ב-3?' : 'מתחלק ב-4 אם המספר משתי הספרות האחרונות מתחלק ב-4.',
      explain: rule,
    };
  },
};

const common: Level = {
  id: 'g5-div-5',
  title: 'מחלק משותף וכפולה משותפת',
  intro: {
    lines: ['**מחלק משותף גדול ביותר** של 12 ו-18: 6.', '**כפולה משותפת קטנה ביותר** של 4 ו-6: 12.'],
  },
  generate: () => {
    if (Math.random() < 0.5) {
      const g = pick([2, 3, 4, 5, 6]);
      let a = randInt(2, 7);
      let b = randInt(2, 7);
      while (gcd(a, b) !== 1 || a === b) {
        a = randInt(2, 7);
        b = randInt(2, 7);
      }
      return {
        kind: 'input',
        text: `מה המחלק המשותף הגדול ביותר של [[${a * g}]] ו-[[${b * g}]]?`,
        answer: g,
        hint: `רשום את המחלקים של כל מספר, וחפש את הגדול ביותר שמופיע בשתי הרשימות.`,
        explain: `${a * g} = ${g} × ${a}, ${b * g} = ${g} × ${b}. המחלק המשותף הגדול: ${g}.`,
      };
    }
    const a = randInt(2, 10);
    let b = randInt(2, 10);
    if (b === a) b = a + 1;
    const lcm = (a * b) / gcd(a, b);
    return {
      kind: 'input',
      text: `מה הכפולה המשותפת הקטנה ביותר של [[${a}]] ו-[[${b}]]?`,
      answer: lcm,
      hint: `רשום כפולות של ${Math.max(a, b)} ובדוק איזו מתחלקת גם ב-${Math.min(a, b)}.`,
      explain: `${lcm} מתחלק גם ב-${a} וגם ב-${b}, וזו הכפולה הקטנה ביותר כזו.`,
    };
  },
};

export const divisorsTopic: Topic = {
  id: 'g5-div',
  title: 'מחלקים וכפולות',
  icon: '🔍',
  levels: [divisors, multiples, primes, div9, common],
};
