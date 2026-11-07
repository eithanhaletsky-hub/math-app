import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';

const longDivision: Level = {
  id: 'g4-div-1',
  title: 'חילוק ארוך',
  intro: {
    lines: ['בחילוק ארוך מחלקים מהספרה השמאלית, צעד אחר צעד.', '[[756 : 3]]: 7 : 3 = 2 (נשאר 1) → 15 : 3 = 5 → 6 : 3 = 2. התשובה: 252.'],
  },
  generate: () => {
    const d = randInt(2, 9);
    const q = randInt(12, Math.floor(999 / d));
    const n = d * q;
    return {
      kind: 'input',
      text: 'פתור (אפשר בחילוק ארוך על דף):',
      expr: `${n} : ${d} = ?`,
      answer: q,
      hint: `התחל מהספרה השמאלית: כמה פעמים ${d} נכנס ב-${String(n)[0] >= String(d) ? String(n)[0] : String(n).slice(0, 2)}? רשום, הורד את הספרה הבאה והמשך.`,
      explain: `${n} : ${d} = ${q}. בדיקה: ${d} × ${q} = ${n}.`,
    };
  },
};

const longRemainder: Level = {
  id: 'g4-div-2',
  title: 'חילוק ארוך עם שארית',
  intro: { lines: ['לפעמים בסוף נשארת שארית — היא תמיד קטנה מהמחלק.', 'בדיקה: מחלק × מנה + שארית = המספר.'] },
  generate: () => {
    const d = randInt(3, 9);
    const q = randInt(11, 99);
    const r = randInt(1, d - 1);
    const n = d * q + r;
    const opts = shuffle([
      [q, r],
      [q + 1, r],
      [q, (r + 1) % d],
      [q - 1, r + d],
    ]).map(([a, b]) => ({ value: `${a}|${b}`, label: `${a} ושארית ${b}` }));
    return {
      kind: 'choice',
      text: 'פתור:',
      expr: `${n} : ${d} = ?`,
      options: opts,
      answer: `${q}|${r}`,
      hint: `בדוק כל תשובה: ${d} × מנה + שארית צריך לצאת ${n}, והשארית קטנה מ-${d}.`,
      explain: `${d} × ${q} + ${r} = ${n}, לכן ${q} ושארית ${r}.`,
    };
  },
};

const RULES: Record<number, { rule: string; test: (n: number) => boolean }> = {
  2: { rule: 'מתחלק ב-2 אם ספרת היחידות זוגית (0, 2, 4, 6, 8).', test: (n) => n % 2 === 0 },
  5: { rule: 'מתחלק ב-5 אם ספרת היחידות 0 או 5.', test: (n) => n % 5 === 0 },
  10: { rule: 'מתחלק ב-10 אם ספרת היחידות 0.', test: (n) => n % 10 === 0 },
  3: { rule: 'מתחלק ב-3 אם סכום הספרות מתחלק ב-3.', test: (n) => n % 3 === 0 },
};

const divisibility: Level = {
  id: 'g4-div-3',
  title: 'סימני התחלקות',
  intro: {
    lines: ['ב-2: ספרת היחידות זוגית. ב-5: מסתיים ב-0 או 5. ב-10: מסתיים ב-0.', 'ב-3: סכום הספרות מתחלק ב-3 (‏[[417]] → 4+1+7 = 12 ✓).'],
  },
  generate: () => {
    const d = pick([2, 5, 10, 3, 3]);
    const target = randInt(20, 999);
    const yes = Math.random() < 0.5;
    let n = target;
    // nudge n to make it divisible (or not) as wanted
    if (yes) n = target - (target % d);
    else if (n % d === 0) n += 1;
    const sum = String(n).split('').reduce((a, c) => a + Number(c), 0);
    return {
      kind: 'choice',
      text: `האם [[${n}]] מתחלק ב-${d} בלי שארית?`,
      options: [
        { value: 'yes', label: 'כן' },
        { value: 'no', label: 'לא' },
      ],
      answer: RULES[d].test(n) ? 'yes' : 'no',
      hint: RULES[d].rule,
      explain: d === 3 ? `סכום הספרות: ${sum}. ${sum % 3 === 0 ? 'מתחלק ב-3 ✓' : 'לא מתחלק ב-3 ✗'}` : `${n} ${RULES[d].test(n) ? 'כן' : 'לא'} מתחלק ב-${d}. ${RULES[d].rule}`,
    };
  },
};

const findDivisible: Level = {
  id: 'g4-div-4',
  title: 'מי מתחלק?',
  intro: { lines: ['השתמש בסימני ההתחלקות כדי למצוא את המספר הנכון — בלי לחלק!'] },
  generate: () => {
    const d = pick([2, 3, 5, 10]);
    const good = (() => {
      let n = randInt(100, 999);
      n -= n % d;
      return n;
    })();
    const bad: number[] = [];
    while (bad.length < 3) {
      const n = randInt(100, 999);
      if (n % d !== 0 && !bad.includes(n)) bad.push(n);
    }
    return {
      kind: 'choice',
      text: `איזה מספר מתחלק ב-${d}?`,
      options: shuffle([good, ...bad]).map((n) => ({ value: String(n), label: String(n) })),
      answer: String(good),
      hint: RULES[d].rule,
      explain: `${good} : ${d} = ${good / d}`,
    };
  },
};

export const divisionTopic: Topic = {
  id: 'g4-div',
  title: 'חילוק ארוך והתחלקות',
  icon: '➗',
  levels: [longDivision, longRemainder, divisibility, findDivisible],
};
