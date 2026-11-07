import type { Level, Option, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { COUNTABLES } from '../../lib/things';

const label = (q: number, r: number) => (r === 0 ? `${q} (בלי שארית)` : `${q} ושארית ${r}`);

function remainderOptions(q: number, r: number, d: number): Option[] {
  const cands: [number, number][] = [
    [q, r],
    [q + 1, 0],
    [q - 1, r + d], // invalid remainder (too big) — a common mistake
    [q, (r + 1) % d],
    [q + 1, r],
    [q - 1, r],
  ];
  const seen = new Set<string>();
  const out: Option[] = [];
  for (const [a, b] of cands) {
    if (a < 0) continue;
    const key = `${a}|${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ value: key, label: label(a, b) });
    if (out.length === 4) break;
  }
  return shuffle(out);
}

const withRemainder: Level = {
  id: 'g3-div-1',
  title: 'חילוק עם שארית',
  intro: {
    lines: ['לפעמים אי אפשר לחלק בדיוק. מה שנשאר — זו ה**שארית**.', '17 עוגיות ל-5 ילדים: כל אחד מקבל 3, ונשארות 2. [[17 : 5 = 3]] ושארית 2.'],
    visual: { type: 'objects', emoji: '🍪', groups: [5, 5, 5, 2] },
  },
  generate: () => {
    const d = randInt(2, 6);
    const q = randInt(1, 6);
    const r = randInt(1, d - 1);
    const n = d * q + r;
    const t = pick(COUNTABLES);
    return {
      kind: 'choice',
      text: `מחלקים ${n} ${t.plural} לקבוצות של ${d}. כמה קבוצות שלמות יש, ומה השארית?`,
      visual: { type: 'objects', emoji: t.emoji, groups: [...Array(q).fill(d), r] },
      options: remainderOptions(q, r, d),
      answer: `${q}|${r}`,
      hint: `ספור כמה קבוצות של ${d} יש. מה שנשאר בחוץ — השארית (תמיד קטנה מ-${d}).`,
      explain: `${n} : ${d} = ${q} ושארית ${r}, כי ${d} × ${q} = ${d * q} ועוד ${r} = ${n}.`,
    };
  },
};

const noPictures: Level = {
  id: 'g3-div-2',
  title: 'שארית בלי ציורים',
  intro: {
    lines: ['מחפשים את המספר הגדול ביותר בלוח הכפל שלא עובר את המספר.', '[[29 : 4]]: 4 × 7 = 28, ונשאר 1. התשובה: 7 ושארית 1.'],
  },
  generate: () => {
    const d = randInt(3, 9);
    const q = randInt(2, 9);
    const r = randInt(0, d - 1);
    const n = d * q + r;
    return {
      kind: 'choice',
      text: 'פתור:',
      expr: `${n} : ${d} = ?`,
      options: remainderOptions(q, r, d),
      answer: `${q}|${r}`,
      hint: `איזה מספר בלוח של ${d} הכי קרוב ל-${n} ולא גדול ממנו?`,
      explain: `${d} × ${q} = ${d * q}, ו-${n} − ${d * q} = ${r}. ${r === 0 ? 'אין שארית.' : `השארית ${r}.`}`,
    };
  },
};

const remainderOnly: Level = {
  id: 'g3-div-3',
  title: 'מה השארית?',
  intro: { lines: ['השארית תמיד **קטנה** מהמספר שמחלקים בו.'] },
  generate: () => {
    const d = randInt(2, 9);
    const q = randInt(2, 9);
    const r = randInt(0, d - 1);
    const n = d * q + r;
    return {
      kind: 'input',
      text: `מה השארית בתרגיל [[${n} : ${d}]]?`,
      answer: r,
      hint: `${d} × ${q} = ${d * q}. כמה חסר עד ${n}?`,
      explain: `${n} = ${d} × ${q} + ${r}, לכן השארית ${r}.`,
    };
  },
};

const divTens: Level = {
  id: 'g3-div-4',
  title: 'חילוק עשרות שלמות',
  intro: { lines: ['[[80 : 4]] = 8 עשרות : 4 = 2 עשרות = 20.'] },
  generate: () => {
    const d = randInt(2, 9);
    const q = randInt(1, 9);
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${d * q * 10} : ${d} = ?`,
      answer: q * 10,
      hint: `חשוב בעשרות: ${d * q} עשרות : ${d}.`,
      explain: `${d * q} : ${d} = ${q}, ולכן ${d * q * 10} : ${d} = ${q * 10}.`,
    };
  },
};

const stories: Level = {
  id: 'g3-div-5',
  title: 'סיפורי חילוק',
  intro: { lines: ['שימו לב מה עושים עם השארית — לפעמים צריך עוד קבוצה!'] },
  generate: () => {
    const kind = randInt(0, 1);
    const d = pick([4, 5, 6]);
    const q = randInt(3, 8);
    const r = randInt(1, d - 1);
    const n = d * q + r;
    if (kind === 0) {
      return {
        kind: 'input',
        text: `${n} ילדים נוסעים לטיול. בכל רכב יש מקום ל-${d} ילדים. כמה רכבים צריך כדי שכולם ייסעו?`,
        answer: q + 1,
        hint: `${n} : ${d} = ${q} ושארית ${r}. מה עושים עם ${r} הילדים שנשארו?`,
        explain: `${q} רכבים מלאים, ועוד רכב אחד ל-${r} הנותרים: ${q + 1} רכבים.`,
      };
    }
    return {
      kind: 'input',
      text: `יש ${n} ביצים. אורזים אותן בקופסאות של ${d}. כמה קופסאות **מלאות** יהיו?`,
      answer: q,
      hint: `${n} : ${d}. רק קופסאות מלאות נחשבות.`,
      explain: `${n} : ${d} = ${q} ושארית ${r}. ${q} קופסאות מלאות.`,
    };
  },
};

export const divisionTopic: Topic = {
  id: 'g3-div',
  title: 'חילוק ושארית',
  icon: '➗',
  levels: [withRemainder, noPictures, remainderOnly, divTens, stories],
};
