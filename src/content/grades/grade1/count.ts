import type { Level, Topic } from '../../types';
import { pick, randInt, sortedNumberOptions } from '../../lib/random';
import { COUNTABLES } from '../../lib/things';

const countTo10: Level = {
  id: 'g1-count-1',
  title: 'סופרים עד 10',
  intro: {
    lines: ['סופרים כל דבר פעם אחת בלבד.', 'אפשר לגעת בכל ציור בזמן שסופרים — הוא יסומן ✓.'],
    visual: { type: 'objects', emoji: '🍎', groups: [5], tappable: true },
  },
  generate: () => {
    const t = pick(COUNTABLES);
    const n = randInt(3, 10);
    return {
      kind: 'input',
      text: `כמה ${t.plural} יש כאן?`,
      visual: { type: 'objects', emoji: t.emoji, groups: [n], tappable: true },
      answer: n,
      hint: 'גע בכל ציור בזמן שאתה סופר. כך לא תספור אף אחד פעמיים.',
      explain: `סופרים אחד-אחד: יש כאן ${n} ${t.plural}.`,
    };
  },
};

const tenFrame: Level = {
  id: 'g1-count-2',
  title: 'מסגרת העשר',
  intro: {
    lines: ['במסגרת העשר יש 10 משבצות: 2 שורות של 5.', 'שורה מלאה = 5. מסגרת מלאה = 10.'],
    visual: { type: 'tenframe', filled: 7 },
  },
  generate: () => {
    const n = randInt(1, 10);
    return {
      kind: 'choice',
      text: 'כמה עיגולים יש במסגרת?',
      visual: { type: 'tenframe', filled: n },
      options: sortedNumberOptions(n, { min: 0, max: 10, near: [1, -1, 2, -2] }),
      answer: String(n),
      hint: 'שורה מלאה היא 5. בדוק כמה יש בשורה השנייה והמשך לספור מ-5.',
      explain: n > 5 ? `שורה מלאה (5) ועוד ${n - 5} — ביחד ${n}.` : `יש ${n} עיגולים בשורה הראשונה.`,
    };
  },
};

const countTo20: Level = {
  id: 'g1-count-3',
  title: 'סופרים עד 20',
  intro: {
    lines: ['כשיש הרבה, נוח לספור קודם קבוצה של 10.', 'אחרי 10 ממשיכים: 11, 12, 13…'],
    visual: { type: 'tenframe', filled: 14, frames: 2 },
  },
  generate: () => {
    const n = randInt(11, 20);
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'כמה עיגולים יש בשתי המסגרות?',
        visual: { type: 'tenframe', filled: n, frames: 2 },
        answer: n,
        hint: 'המסגרת הראשונה מלאה — זה 10. עכשיו המשך לספור במסגרת השנייה.',
        explain: `10 במסגרת המלאה ועוד ${n - 10} — ביחד ${n}.`,
      };
    }
    const t = pick(COUNTABLES);
    return {
      kind: 'input',
      text: `כמה ${t.plural} יש? (קבוצה אחת היא של 10)`,
      visual: { type: 'objects', emoji: t.emoji, groups: [10, n - 10], tappable: true },
      answer: n,
      hint: 'בקבוצה הראשונה יש 10. המשך לספור משם: 11, 12…',
      explain: `10 ועוד ${n - 10} זה ${n}.`,
    };
  },
};

const placeOnLine: Level = {
  id: 'g1-count-4',
  title: 'על ציר המספרים',
  intro: {
    lines: ['על ציר המספרים, המספרים גדלים משמאל לימין.', 'כל קפיצה קטנה היא 1.'],
    visual: { type: 'numberline', min: 0, max: 10, labelEvery: 1, highlight: [6] },
  },
  generate: () => {
    const max = Math.random() < 0.4 ? 10 : 20;
    const n = randInt(1, max - 1);
    return {
      kind: 'numberline',
      text: `גע בציר במקום של המספר [[${n}]].`,
      min: 0,
      max,
      step: 1,
      labelEvery: max === 10 ? 1 : 5,
      answer: n,
      hint:
        max === 10
          ? 'התחל מ-0 וספור קפיצות של 1.'
          : `מצא את המספר הכתוב הקרוב ביותר ל-${n}, וספור ממנו קפיצות קטנות.`,
      explain: `המספר ${n} נמצא כאן.`,
      explainVisual: { type: 'numberline', min: 0, max, labelEvery: max === 10 ? 1 : 5, highlight: [n] },
    };
  },
};

const beforeAfter: Level = {
  id: 'g1-count-5',
  title: 'לפני ואחרי',
  intro: {
    lines: ['המספר שבא **אחרי** גדול ב-1.', 'המספר שבא **לפני** קטן ב-1.'],
    visual: { type: 'numberline', min: 5, max: 12, labelEvery: 1, jumps: [{ from: 8, to: 9 }] },
  },
  generate: () => {
    const n = randInt(1, 19);
    const after = Math.random() < 0.5;
    const ans = after ? n + 1 : n - 1;
    return {
      kind: 'choice',
      text: after ? `איזה מספר בא מיד **אחרי** [[${n}]]?` : `איזה מספר בא מיד **לפני** [[${n}]]?`,
      visual: { type: 'numberline', min: Math.max(0, n - 4), max: Math.max(0, n - 4) + 8, labelEvery: 1, hideLabels: [ans] },
      options: sortedNumberOptions(ans, { min: 0, max: 20, near: [1, -1, 2, -2, 10] }),
      answer: String(ans),
      hint: after ? 'אחרי = קפיצה אחת ימינה על הציר.' : 'לפני = קפיצה אחת שמאלה על הציר.',
      explain: after ? `אחרי ${n} בא ${ans}.` : `לפני ${n} בא ${ans}.`,
    };
  },
};

const howManyMore: Level = {
  id: 'g1-count-6',
  title: 'יותר או פחות?',
  intro: {
    lines: ['כדי לדעת איפה יש יותר — סופרים את שתי הקבוצות.'],
    visual: { type: 'objects', emoji: '⭐', groups: [4, 6] },
  },
  generate: () => {
    const a = randInt(2, 10);
    let b = randInt(2, 10);
    if (b === a) b = a < 10 ? a + 1 : a - 1;
    const t = pick(COUNTABLES);
    const more = Math.random() < 0.5;
    const ans = more ? Math.max(a, b) : Math.min(a, b);
    return {
      kind: 'choice',
      text: more ? `באיזו קבוצה יש **יותר** ${t.plural}? כמה יש בה?` : `באיזו קבוצה יש **פחות** ${t.plural}? כמה יש בה?`,
      visual: { type: 'objects', emoji: t.emoji, groups: [a, b], tappable: true },
      options: [a, b].sort((x, y) => x - y).map((v) => ({ value: String(v), label: String(v) })),
      answer: String(ans),
      hint: 'ספור כל קבוצה בנפרד, ואז השווה בין המספרים.',
      explain: `בקבוצה אחת ${a} ובשנייה ${b}. ${more ? 'יותר' : 'פחות'} — ${ans}.`,
    };
  },
};

export const countTopic: Topic = {
  id: 'g1-count',
  title: 'מספרים עד 20',
  icon: '🔢',
  levels: [countTo10, tenFrame, countTo20, placeOnLine, beforeAfter, howManyMore],
};
