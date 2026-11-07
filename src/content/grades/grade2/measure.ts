import type { Level, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { MINUS } from '../../lib/things';

const ITEMS = [
  { name: 'העיפרון', emoji: '✏️' },
  { name: 'המפתח', emoji: '🔑' },
  { name: 'התולעת', emoji: '🐛' },
  { name: 'הגזר', emoji: '🥕' },
];

const rulerOffset: Level = {
  id: 'g2-meas-1',
  title: 'מדידה שלא מתחילה ב-0',
  intro: {
    lines: ['אם החפץ לא מתחיל ב-0 — מחסרים: סוף פחות התחלה.', 'מ-2 עד 9: [[9 − 2 = 7]] ס"מ.'],
    visual: { type: 'ruler', length: 7, start: 2, max: 12 },
  },
  generate: () => {
    const start = randInt(1, 5);
    const len = randInt(3, 9);
    const it = pick(ITEMS);
    return {
      kind: 'input',
      text: `מה האורך של ${it.name} בסנטימטרים?`,
      visual: { type: 'ruler', length: len, start, emoji: it.emoji, max: 15 },
      answer: len,
      hint: `החפץ מתחיל ב-${start}. איפה הוא נגמר? חסר את ההתחלה מהסוף.`,
      explain: `${start + len} ${MINUS} ${start} = ${len} ס"מ`,
    };
  },
};

const meters: Level = {
  id: 'g2-meas-2',
  title: 'מטר וסנטימטר',
  intro: {
    lines: ['מטר אחד = 100 סנטימטרים.', 'מטר ו-30 ס"מ = 130 ס"מ.'],
  },
  generate: () => {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const m = randInt(1, 9);
      return {
        kind: 'input',
        text: `כמה סנטימטרים יש ב-${m === 1 ? 'מטר אחד' : `${m} מטרים`}?`,
        answer: m * 100,
        hint: 'בכל מטר 100 ס"מ.',
        explain: `${m} × 100 = ${m * 100} ס"מ`,
      };
    }
    if (kind === 1) {
      const m = randInt(1, 3);
      const cm = randInt(1, 9) * 10;
      return {
        kind: 'input',
        text: `${m === 1 ? 'מטר' : `${m} מטרים`} ו-${cm} ס"מ — כמה סנטימטרים זה בסך הכול?`,
        answer: m * 100 + cm,
        hint: `${m === 1 ? 'מטר' : `${m} מטרים`} = ${m * 100} ס"מ. עכשיו הוסף ${cm}.`,
        explain: `${m * 100} + ${cm} = ${m * 100 + cm} ס"מ`,
      };
    }
    const cm = randInt(1, 4) * 100;
    return {
      kind: 'input',
      text: `כמה מטרים הם ${cm} סנטימטרים?`,
      answer: cm / 100,
      hint: 'כל 100 ס"מ = מטר אחד.',
      explain: `${cm} ס"מ = ${cm / 100} מטרים`,
    };
  },
};

const THINGS = [
  { t: 'אורך של מחק', u: 'cm' },
  { t: 'אורך של עיפרון', u: 'cm' },
  { t: 'רוחב של כף יד', u: 'cm' },
  { t: 'אורך של מגרש כדורגל', u: 'm' },
  { t: 'גובה של עץ', u: 'm' },
  { t: 'אורך של כיתה', u: 'm' },
  { t: 'אורך של נמלה', u: 'cm' },
  { t: 'אורך של בריכה', u: 'm' },
];

const units: Level = {
  id: 'g2-meas-3',
  title: 'באיזו יחידה מודדים?',
  intro: { lines: ['דברים קטנים מודדים בסנטימטרים (ס"מ).', 'דברים גדולים — במטרים (מ\').'] },
  generate: () => {
    const x = pick(THINGS);
    return {
      kind: 'choice',
      text: `באיזו יחידה נוח למדוד ${x.t}?`,
      options: [
        { value: 'cm', label: 'סנטימטרים' },
        { value: 'm', label: 'מטרים' },
      ],
      answer: x.u,
      hint: 'האם זה קטן מספיק כדי להניח על סרגל?',
      explain: x.u === 'cm' ? 'זה קטן — מודדים בסנטימטרים.' : 'זה גדול — מודדים במטרים.',
    };
  },
};

export const measureTopic: Topic = {
  id: 'g2-meas',
  title: 'מדידות',
  icon: '📏',
  levels: [rulerOffset, meters, units],
};
