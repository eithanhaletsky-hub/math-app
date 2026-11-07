import type { Level, Topic } from '../../types';
import { distinctInts, pick, randInt, shuffle, sortedNumberOptions } from '../../lib/random';
import { COUNTABLES, PEOPLE, g } from '../../lib/things';

const groups: Level = {
  id: 'g2-mul-1',
  title: 'קבוצות שוות',
  intro: {
    lines: ['כשיש כמה קבוצות **שוות** — אפשר לכפול.', '3 קבוצות של 4 = [[3 × 4 = 12]].'],
    visual: { type: 'objects', emoji: '🍓', groups: [4, 4, 4] },
  },
  generate: () => {
    const n = randInt(2, 5);
    const size = randInt(2, 5);
    const t = pick(COUNTABLES);
    return {
      kind: 'input',
      text: `יש ${n} קבוצות, ובכל קבוצה ${size} ${t.plural}. כמה ${t.plural} יש בסך הכול?`,
      visual: { type: 'objects', emoji: t.emoji, groups: Array(n).fill(size) },
      answer: n * size,
      hint: `ספור בקפיצות של ${size}: ${Array.from({ length: Math.min(n, 3) }, (_, i) => size * (i + 1)).join(', ')}…`,
      explain: `${n} × ${size} = ${n * size}`,
    };
  },
};

const repeated: Level = {
  id: 'g2-mul-2',
  title: 'חיבור חוזר וכפל',
  intro: {
    lines: ['כפל הוא חיבור של אותו מספר שוב ושוב.', '[[5 + 5 + 5 = 3 × 5]] — שלוש פעמים חמש.'],
  },
  generate: () => {
    const n = randInt(2, 5);
    const k = randInt(2, 9);
    const sum = Array(n).fill(k).join(' + ');
    if (Math.random() < 0.5) {
      const right = `${n} × ${k}`;
      const opts = shuffle([right, `${n} + ${k}`, `${k} × ${k}`, `${n + 1} × ${k}`]);
      return {
        kind: 'choice',
        text: `איזה תרגיל כפל מתאים ל-[[${sum}]]?`,
        options: [...new Set(opts)].map((o) => ({ value: o, label: o })),
        answer: right,
        hint: `ספור כמה פעמים מופיע ${k}.`,
        explain: `${k} מופיע ${n} פעמים, ולכן [[${sum} = ${right}]].`,
      };
    }
    return {
      kind: 'input',
      text: 'כמה זה?',
      expr: `${sum} = ${n} × ${k} = ?`,
      answer: n * k,
      hint: `חבר בהדרגה: ${k}, ${2 * k}${n > 2 ? `, ${3 * k}` : ''}…`,
      explain: `${n} × ${k} = ${n * k}`,
    };
  },
};

const arrays: Level = {
  id: 'g2-mul-3',
  title: 'מערכים',
  intro: {
    lines: ['במערך יש שורות שוות.', '3 שורות של 5 = [[3 × 5 = 15]]. וגם 5 עמודות של 3 = [[5 × 3 = 15]].'],
    visual: { type: 'array', rows: 3, cols: 5 },
  },
  generate: () => {
    const rows = randInt(2, 5);
    const cols = randInt(2, 6);
    return {
      kind: 'input',
      text: `כמה עיגולים יש במערך? (${rows} שורות של ${cols})`,
      visual: { type: 'array', rows, cols },
      answer: rows * cols,
      hint: `ספור שורה אחת (${cols}), ואז קפוץ ${rows} פעמים.`,
      explain: `${rows} × ${cols} = ${rows * cols}`,
    };
  },
};

function tableLevel(id: string, title: string, factors: number[], introLine: string): Level {
  return {
    id,
    title,
    intro: {
      lines: [introLine, 'אפשר לספור בקפיצות, או להיזכר בתרגיל קרוב.'],
      visual: { type: 'sequence', items: [1, 2, 3, 4, 5].map((i) => String(i * factors[0])) },
    },
    generate: () => {
      const a = pick(factors);
      const b = randInt(1, 10);
      const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a];
      if (Math.random() < 0.35) {
        return {
          kind: 'choice',
          text: 'כמה זה?',
          expr: `${x} × ${y} = ?`,
          options: sortedNumberOptions(a * b, { min: 0, max: 100, near: [a, -a, b, -b, 1] }),
          answer: String(a * b),
          hint: `ספור בקפיצות של ${a}, ${b} פעמים.`,
          explain: `${x} × ${y} = ${a * b}`,
        };
      }
      return {
        kind: 'input',
        text: 'כמה זה?',
        expr: `${x} × ${y} = ?`,
        answer: a * b,
        hint: b > 1 ? `${a} × ${b - 1} = ${a * (b - 1)}. עכשיו הוסף עוד ${a}.` : `כל מספר כפול 1 שווה לעצמו.`,
        explain: `${x} × ${y} = ${a * b}`,
      };
    },
  };
}

const t2510 = tableLevel('g2-mul-4', 'כפל ב-2, ב-5 וב-10', [2, 5, 10], 'כפל ב-10: מוסיפים 0. כפל ב-5: חצי מכפל ב-10.');
const t34 = tableLevel('g2-mul-5', 'כפל ב-3 וב-4', [3, 4], 'כפל ב-4 = כפל ב-2, ואז עוד פעם כפול 2.');

const swap: Level = {
  id: 'g2-mul-6',
  title: 'מחליפים סדר',
  intro: {
    lines: ['בכפל אפשר להחליף את הסדר — התוצאה לא משתנה.', '[[3 × 7 = 7 × 3 = 21]]'],
    visual: { type: 'array', rows: 3, cols: 7 },
  },
  generate: () => {
    const pairs = distinctInts(4, 2, 9).map((a) => {
      const b = pick([2, 3, 4, 5, 10].filter((x) => x !== a));
      return { a, b };
    });
    return {
      kind: 'match',
      text: 'גרור לכל תרגיל את אותו תרגיל בסדר הפוך.',
      pairs: pairs.map(({ a, b }) => ({ left: { label: `${a} × ${b}` }, right: { label: `${b} × ${a}` } })),
      hint: 'חפש את אותם שני מספרים בסדר הפוך.',
      explain: 'בכפל הסדר לא משנה: a × b = b × a.',
    };
  },
};

const stories: Level = {
  id: 'g2-mul-7',
  title: 'סיפורי כפל',
  intro: { lines: ['"בכל אחד יש…", "כמה בסך הכול?" — כשהקבוצות שוות, כופלים.'] },
  generate: () => {
    const p = pick(PEOPLE);
    const kind = randInt(0, 2);
    if (kind === 0) {
      const boxes = randInt(2, 6);
      const each = pick([2, 3, 4, 5, 10]);
      return {
        kind: 'input',
        text: `${p.name} ${g(p, 'קנה', 'קנתה')} ${boxes} קופסאות צבעים. בכל קופסה ${each} צבעים. כמה צבעים ${g(p, 'קנה', 'קנתה')}?`,
        answer: boxes * each,
        hint: `${boxes} קבוצות של ${each} — כפל.`,
        explain: `${boxes} × ${each} = ${boxes * each}`,
      };
    }
    if (kind === 1) {
      const cars = randInt(2, 6);
      return {
        kind: 'input',
        text: `בחניה עומדות ${cars} מכוניות. לכל מכונית 4 גלגלים. כמה גלגלים יש בחניה?`,
        visual: { type: 'objects', emoji: '🚗', groups: [cars] },
        answer: cars * 4,
        hint: `${cars} פעמים 4.`,
        explain: `${cars} × 4 = ${cars * 4}`,
      };
    }
    const kids = randInt(2, 9);
    return {
      kind: 'input',
      text: `${kids} ילדים קיבלו כל אחד 5 מדבקות. כמה מדבקות חולקו?`,
      answer: kids * 5,
      hint: `ספור בקפיצות של 5, ${kids} פעמים.`,
      explain: `${kids} × 5 = ${kids * 5}`,
    };
  },
};

export const multiplyTopic: Topic = {
  id: 'g2-mul',
  title: 'מבוא לכפל',
  icon: '✖️',
  levels: [groups, repeated, arrays, t2510, t34, swap, stories],
};
