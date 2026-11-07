import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { MINUS } from '../../lib/things';

const ITEMS = [
  { name: 'העיפרון', emoji: '✏️', female: false },
  { name: 'הנחש', emoji: '🐍', female: false },
  { name: 'הרכבת', emoji: '🚂', female: true },
  { name: 'התולעת', emoji: '🐛', female: true },
  { name: 'הגזר', emoji: '🥕', female: false },
  { name: 'המכחול', emoji: '🖌️', female: false },
];
const COLORS = ['#ff8787', '#74c0fc', '#8ce99a', '#ffd43b', '#da77f2'];

const longer: Level = {
  id: 'g1-len-1',
  title: 'ארוך יותר, קצר יותר',
  intro: {
    lines: ['כדי להשוות אורך — מיישרים את ההתחלות בקו אחד.', 'מי שמגיע הכי רחוק — הוא הארוך ביותר.'],
    visual: {
      type: 'bars',
      items: [
        { label: '🐍', length: 8, color: '#8ce99a' },
        { label: '🐛', length: 5, color: '#ffd43b' },
      ],
    },
  },
  generate: () => {
    const [a, b, c] = shuffle(ITEMS).slice(0, 3);
    const lens = shuffle([randInt(2, 4), randInt(5, 7), randInt(8, 11)]);
    const items = [a, b, c].map((it, i) => ({ ...it, length: lens[i] }));
    const long = Math.random() < 0.5;
    const target = items.reduce((best, it) => ((long ? it.length > best.length : it.length < best.length) ? it : best));
    const colors = shuffle(COLORS);
    return {
      kind: 'choice',
      text: long ? 'מי הכי **ארוך**?' : 'מי הכי **קצר**?',
      visual: { type: 'bars', items: items.map((it, i) => ({ label: it.emoji, length: it.length, color: colors[i] })) },
      options: items.map((it) => ({ value: it.name, label: it.emoji })),
      answer: target.name,
      hint: 'כולם מתחילים מאותו קו. בדוק מי מגיע הכי רחוק — או הכי פחות רחוק.',
      explain: `${target.name} ${long ? (target.female ? 'הכי ארוכה' : 'הכי ארוך') : target.female ? 'הכי קצרה' : 'הכי קצר'}.`,
    };
  },
};

const units: Level = {
  id: 'g1-len-2',
  title: 'מודדים ביחידות',
  intro: {
    lines: ['אפשר למדוד אורך בעזרת משבצות שוות.', 'סופרים כמה משבצות יש לאורך הפס.'],
    visual: { type: 'bars', items: [{ label: '🐍', length: 6, color: '#8ce99a' }], units: true },
  },
  generate: () => {
    const it = pick(ITEMS);
    const n = randInt(3, 12);
    return {
      kind: 'input',
      text: `כמה משבצות אורך ${it.name}?`,
      visual: { type: 'bars', items: [{ label: it.emoji, length: n, color: pick(COLORS) }], units: true },
      answer: n,
      hint: 'ספור את המשבצות אחת-אחת מההתחלה.',
      explain: `יש ${n} משבצות, אז האורך הוא ${n} משבצות.`,
    };
  },
};

const ruler: Level = {
  id: 'g1-len-3',
  title: 'מודדים בסרגל',
  intro: {
    lines: ['מודדים מה-**0** של הסרגל, לא מה-1!', 'המספר שבסוף החפץ הוא האורך בסנטימטרים (ס"מ).'],
    visual: { type: 'ruler', length: 6 },
  },
  generate: () => {
    const n = randInt(2, 12);
    const it = pick(ITEMS);
    return {
      kind: 'input',
      text: `מה האורך של ${it.name} בסנטימטרים?`,
      visual: { type: 'ruler', length: n, emoji: it.emoji, max: 14 },
      answer: n,
      hint: 'ההתחלה ב-0. לאיזה מספר מגיע הקצה השני?',
      explain: `הקצה מגיע ל-${n}, אז האורך ${n} ס"מ.`,
    };
  },
};

const difference: Level = {
  id: 'g1-len-4',
  title: 'בכמה ארוך יותר?',
  intro: {
    lines: ['כדי לדעת בכמה אחד ארוך מהשני — מחסרים.', 'נחש של 9 משבצות ותולעת של 5: [[9 − 5 = 4]].'],
    visual: {
      type: 'bars',
      items: [
        { label: '🐍', length: 9, color: '#8ce99a' },
        { label: '🐛', length: 5, color: '#ffd43b' },
      ],
      units: true,
    },
  },
  generate: () => {
    const [a, b] = shuffle(ITEMS).slice(0, 2);
    const la = randInt(5, 12);
    const lb = randInt(2, la - 1);
    return {
      kind: 'input',
      text: `בכמה משבצות ${a.name} ${a.female ? 'ארוכה' : 'ארוך'} יותר מ${b.name}?`,
      visual: {
        type: 'bars',
        items: [
          { label: a.emoji, length: la, color: '#8ce99a' },
          { label: b.emoji, length: lb, color: '#ffd43b' },
        ],
        units: true,
      },
      answer: la - lb,
      hint: `ספור כמה משבצות יש לכל אחד, ואז חסר: ${la} ${MINUS} ?`,
      explain: `${la} ${MINUS} ${lb} = ${la - lb}`,
    };
  },
};

export const lengthTopic: Topic = {
  id: 'g1-len',
  title: 'מדידת אורך',
  icon: '📏',
  levels: [longer, units, ruler, difference],
};
