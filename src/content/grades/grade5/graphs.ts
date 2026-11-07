import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { MINUS } from '../../lib/things';

const DATASETS = [
  { title: 'ספרים שקראו בכיתה בכל חודש', labels: ['ספט\'', 'אוק\'', 'נוב\'', 'דצמ\'', 'ינו\''], unit: 'ספרים' },
  { title: 'ילדים לפי פרי אהוב', labels: ['תפוח', 'בננה', 'ענבים', 'תות', 'מלון'], unit: 'ילדים' },
  { title: 'גולים שכל קבוצה הבקיעה', labels: ['כחולים', 'אדומים', 'ירוקים', 'צהובים'], unit: 'גולים' },
  { title: 'מעלות חום בכל יום', labels: ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\''], unit: 'מעלות' },
];

function makeChart() {
  const ds = pick(DATASETS);
  const step = pick([2, 5, 10]);
  const max = step * randInt(4, 6);
  const values = ds.labels.map(() => step * randInt(1, max / step));
  // make sure there is a single max and a single min (so "which is most" has one answer)
  const uniq = [...new Set(values)];
  if (uniq.length !== values.length) return makeChart();
  return { ds, step, bars: ds.labels.map((label, i) => ({ label, value: values[i] })) };
}

const readChart: Level = {
  id: 'g5-graph-1',
  title: 'קוראים דיאגרמה',
  intro: {
    lines: ['בדיאגרמת עמודות — הגובה של כל עמודה מראה כמות.', 'קוראים את הערך לפי הקווים והמספרים בצד.'],
    visual: { type: 'barchart', title: 'דוגמה', bars: [{ label: 'א', value: 10 }, { label: 'ב', value: 25 }, { label: 'ג', value: 15 }], step: 5 },
  },
  generate: () => {
    const { ds, step, bars } = makeChart();
    const kind = randInt(0, 3);
    const visual = { type: 'barchart' as const, title: ds.title, bars, step };
    if (kind === 0) {
      const b = pick(bars);
      return {
        kind: 'input',
        text: `לפי הדיאגרמה: כמה ${ds.unit} ב"${b.label}"?`,
        visual,
        answer: b.value,
        hint: 'מצא את ראש העמודה, והסתכל לאיזה קו הוא מגיע.',
        explain: `בעמודה "${b.label}" — ${b.value}.`,
      };
    }
    if (kind === 1) {
      const most = Math.random() < 0.5;
      const t = bars.reduce((x, y) => (most ? (y.value > x.value ? y : x) : y.value < x.value ? y : x));
      return {
        kind: 'choice',
        text: most ? 'לאיזו עמודה הערך הגבוה ביותר?' : 'לאיזו עמודה הערך הנמוך ביותר?',
        visual,
        options: bars.map((b) => ({ value: b.label, label: b.label })),
        answer: t.label,
        hint: most ? 'חפש את העמודה הגבוהה ביותר.' : 'חפש את העמודה הנמוכה ביותר.',
        explain: `"${t.label}" — ${t.value}.`,
      };
    }
    if (kind === 2) {
      const [a, b] = shuffle(bars).slice(0, 2);
      const [hi, lo] = a.value > b.value ? [a, b] : [b, a];
      return {
        kind: 'input',
        text: `בכמה "${hi.label}" גדול מ"${lo.label}"?`,
        visual,
        answer: hi.value - lo.value,
        hint: `קרא את שני הערכים, וחסר: ${hi.label} ${MINUS} ${lo.label}.`,
        explain: `${hi.value} ${MINUS} ${lo.value} = ${hi.value - lo.value}`,
      };
    }
    const total = bars.reduce((x, y) => x + y.value, 0);
    return {
      kind: 'input',
      text: `כמה ${ds.unit} בסך הכול?`,
      visual,
      answer: total,
      hint: 'קרא את הערך של כל עמודה, וחבר את כולם.',
      explain: `${bars.map((b) => b.value).join(' + ')} = ${total}`,
    };
  },
};

export const graphsTopic: Topic = {
  id: 'g5-graph',
  title: 'דיאגרמות',
  icon: '📊',
  levels: [readChart],
};
