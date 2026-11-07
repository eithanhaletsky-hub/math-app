import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { COUNTABLES } from '../../lib/things';

const nameFraction: Level = {
  id: 'g3-frac-1',
  title: 'מהו שבר?',
  intro: {
    lines: ['השלם מחולק לחלקים **שווים**. המכנה (למטה) — לכמה חלקים חילקנו.', 'המונה (למעלה) — כמה חלקים לקחנו. [[3/5]] = 3 חלקים מתוך 5.'],
    visual: { type: 'fraction', shape: 'bar', parts: 5, filled: 3 },
  },
  generate: () => {
    const d = randInt(2, 8);
    const n = randInt(1, d - 1);
    const shape = pick(['circle', 'bar'] as const);
    const cands = [
      [n, d],
      [d - n, d],
      [n, d - n],
      [d, n],
      [n + 1, d],
    ].filter(([a, b]) => a > 0 && b > 0);
    const seen = new Set<string>();
    const opts = cands
      .map(([a, b]) => `${a}/${b}`)
      .filter((x) => (seen.has(x) ? false : (seen.add(x), true)))
      .slice(0, 4);
    return {
      kind: 'choice',
      text: 'איזה שבר מהצורה צבוע?',
      visual: { type: 'fraction', shape, parts: d, filled: n },
      options: shuffle(opts).map((o) => ({ value: o, label: o })),
      answer: `${n}/${d}`,
      hint: 'ספור קודם את כל החלקים (מכנה), ואז רק את הצבועים (מונה).',
      explain: `${n} צבועים מתוך ${d} חלקים: [[${n}/${d}]].`,
    };
  },
};

const colorFraction: Level = {
  id: 'g3-frac-2',
  title: 'צובעים שבר',
  intro: { lines: ['כדי לצבוע [[2/3]] — צובעים 2 חלקים מתוך 3.'], visual: { type: 'fraction', shape: 'circle', parts: 3, filled: 2 } },
  generate: () => {
    const d = randInt(2, 8);
    const n = randInt(1, d - 1);
    const shape = pick(['circle', 'bar'] as const);
    return {
      kind: 'fraction',
      text: `צבע [[${n}/${d}]] מה${shape === 'circle' ? 'עיגול' : 'מלבן'}.`,
      shape,
      parts: d,
      answer: n,
      hint: `המכנה ${d}: הצורה מחולקת ל-${d}. המונה ${n}: צבע ${n} חלקים.`,
      explain: `צובעים ${n} חלקים מתוך ${d}.`,
    };
  },
};

const compareUnit: Level = {
  id: 'g3-frac-3',
  title: 'איזה חלק גדול יותר?',
  intro: {
    lines: ['כשמחלקים לעוד חלקים — כל חלק **קטן** יותר.', '[[1/2]] גדול מ-[[1/4]]: חצי פיצה גדולה מרבע פיצה!'],
    visual: { type: 'fraction', shape: 'circle', parts: 4, filled: 1 },
  },
  generate: () => {
    const sameDen = Math.random() < 0.4;
    if (sameDen) {
      const d = randInt(3, 10);
      const a = randInt(1, d - 1);
      let b = randInt(1, d - 1);
      if (b === a) b = a === 1 ? 2 : a - 1;
      const s = a < b ? '<' : '>';
      return {
        kind: 'choice',
        text: 'בחר את הסימן המתאים:',
        expr: `${a}/${d}  ?  ${b}/${d}`,
        options: ['<', '=', '>'].map((x) => ({ value: x, label: x })),
        answer: s,
        hint: 'המכנה שווה — החלקים באותו גודל. למי יש יותר חלקים?',
        explain: `[[${a}/${d} ${s} ${b}/${d}]]`,
      };
    }
    const [x, y] = shuffle([2, 3, 4, 5, 6, 8, 10]).slice(0, 2);
    const s = x < y ? '>' : '<'; // 1/x vs 1/y
    return {
      kind: 'choice',
      text: 'בחר את הסימן המתאים:',
      expr: `1/${x}  ?  1/${y}`,
      options: ['<', '=', '>'].map((v) => ({ value: v, label: v })),
      answer: s,
      hint: 'מונה 1 בשניהם. במכנה גדול יותר — כל חלק קטן יותר.',
      explain: `[[1/${x} ${s} 1/${y}]] — ${x < y ? `חלק אחד מ-${x} גדול מחלק אחד מ-${y}` : `חלק אחד מ-${x} קטן מחלק אחד מ-${y}`}.`,
      explainVisual: { type: 'fraction', shape: 'bar', parts: Math.min(x, y), filled: 1 },
    };
  },
};

const ofQuantity: Level = {
  id: 'g3-frac-4',
  title: 'שבר מכמות',
  intro: {
    lines: ['[[1/3]] מ-12: מחלקים ל-3 קבוצות שוות → 4.', '[[2/3]] מ-12: לוקחים 2 קבוצות → 8.'],
    visual: { type: 'objects', emoji: '🍬', groups: [4, 4, 4] },
  },
  generate: () => {
    const d = pick([2, 3, 4, 5]);
    const each = randInt(1, 6);
    const n = Math.random() < 0.6 ? 1 : randInt(1, d - 1);
    const total = d * each;
    const t = pick(COUNTABLES);
    return {
      kind: 'input',
      text: `כמה זה [[${n}/${d}]] מ-${total} ${t.plural}?`,
      visual: { type: 'objects', emoji: t.emoji, groups: [total], tappable: true },
      answer: n * each,
      hint: `חלק את ${total} ל-${d} קבוצות שוות. ${n === 1 ? 'כמה בקבוצה אחת?' : `כמה ב-${n} קבוצות?`}`,
      explain: `${total} : ${d} = ${each}${n > 1 ? `, ו-${n} × ${each} = ${n * each}` : ''}.`,
      explainVisual: { type: 'objects', emoji: t.emoji, groups: Array(d).fill(each) },
    };
  },
};

export const fractionsTopic: Topic = {
  id: 'g3-frac',
  title: 'מבוא לשברים',
  icon: '🍰',
  levels: [nameFraction, colorFraction, compareUnit, ofQuantity],
};
