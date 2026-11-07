import type { Level, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { COUNTABLES } from '../../lib/things';

const colorHalf: Level = {
  id: 'g2-half-1',
  title: 'חצי',
  intro: {
    lines: ['חצי = אחד מ-2 חלקים **שווים**.', 'כותבים [[1/2]].'],
    visual: { type: 'fraction', shape: 'circle', parts: 2, filled: 1 },
  },
  generate: () => {
    const parts = pick([2, 4, 6, 8]);
    const shape = pick(['circle', 'bar'] as const);
    return {
      kind: 'fraction',
      text: `צבע **חצי** מה${shape === 'circle' ? 'עיגול' : 'מלבן'}.`,
      shape,
      parts,
      answer: parts / 2,
      hint: `יש ${parts} חלקים. חצי מהם — כמה זה?`,
      explain: `חצי מ-${parts} חלקים = ${parts / 2} חלקים.`,
    };
  },
};

const colorQuarter: Level = {
  id: 'g2-half-2',
  title: 'רבע',
  intro: {
    lines: ['רבע = אחד מ-4 חלקים **שווים**.', 'כותבים [[1/4]]. שני רבעים = חצי.'],
    visual: { type: 'fraction', shape: 'circle', parts: 4, filled: 1 },
  },
  generate: () => {
    const parts = pick([4, 8]);
    const shape = pick(['circle', 'bar'] as const);
    const quarters = Math.random() < 0.7 ? 1 : 3;
    return {
      kind: 'fraction',
      text: `צבע **${quarters === 1 ? 'רבע' : 'שלושה רבעים'}** מה${shape === 'circle' ? 'עיגול' : 'מלבן'} ([[${quarters}/4]]).`,
      shape,
      parts,
      answer: (parts / 4) * quarters,
      hint: `חלק את ${parts} החלקים ל-4 קבוצות שוות. כל קבוצה היא רבע.`,
      explain: `רבע מ-${parts} = ${parts / 4}${quarters === 3 ? `, ושלושה רבעים = ${(parts / 4) * 3}` : ''}.`,
    };
  },
};

const whichHalf: Level = {
  id: 'g2-half-3',
  title: 'איזה חלק צבוע?',
  intro: {
    lines: ['סופרים כמה חלקים שווים יש, וכמה מהם צבועים.'],
    visual: { type: 'fraction', shape: 'bar', parts: 4, filled: 2 },
  },
  generate: () => {
    const opt = pick([
      { parts: 2, filled: 1, ans: 'half' },
      { parts: 4, filled: 2, ans: 'half' },
      { parts: 4, filled: 1, ans: 'quarter' },
      { parts: 4, filled: 3, ans: 'three' },
      { parts: 4, filled: 4, ans: 'whole' },
      { parts: 8, filled: 2, ans: 'quarter' },
    ]);
    return {
      kind: 'choice',
      text: 'איזה חלק מהצורה צבוע?',
      visual: { type: 'fraction', shape: pick(['circle', 'bar'] as const), parts: opt.parts, filled: opt.filled },
      options: [
        { value: 'quarter', label: 'רבע' },
        { value: 'half', label: 'חצי' },
        { value: 'three', label: 'שלושה רבעים' },
        { value: 'whole', label: 'שלם' },
      ],
      answer: opt.ans,
      hint: `יש ${opt.parts} חלקים, ו-${opt.filled} צבועים. האם זה חצי מהם? רבע מהם?`,
      explain: `${opt.filled} מתוך ${opt.parts} = ${{ half: 'חצי', quarter: 'רבע', three: 'שלושה רבעים', whole: 'שלם' }[opt.ans]}.`,
    };
  },
};

const ofQuantity: Level = {
  id: 'g2-half-4',
  title: 'חצי ורבע מכמות',
  intro: {
    lines: ['חצי מ-8 = מחלקים ל-2 קבוצות שוות → 4.', 'רבע מ-8 = מחלקים ל-4 קבוצות שוות → 2.'],
    visual: { type: 'objects', emoji: '🍪', groups: [4, 4] },
  },
  generate: () => {
    const half = Math.random() < 0.6;
    const each = randInt(1, half ? 10 : 5);
    const total = each * (half ? 2 : 4);
    const t = pick(COUNTABLES);
    return {
      kind: 'input',
      text: `כמה זה ${half ? 'חצי' : 'רבע'} מ-${total} ${t.plural}?`,
      visual: { type: 'objects', emoji: t.emoji, groups: [total], tappable: true },
      answer: each,
      hint: `חלק את ${total} ל-${half ? 2 : 4} קבוצות שוות.`,
      explain: `${total} : ${half ? 2 : 4} = ${each}`,
      explainVisual: { type: 'objects', emoji: t.emoji, groups: Array(half ? 2 : 4).fill(each) },
    };
  },
};

export const halvesTopic: Topic = {
  id: 'g2-half',
  title: 'חצי ורבע',
  icon: '🍕',
  levels: [colorHalf, colorQuarter, whichHalf, ofQuantity],
};
