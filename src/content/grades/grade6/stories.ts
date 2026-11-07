import type { Level, Question, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { MINUS, PEOPLE, g } from '../../lib/things';

function story(): Question {
  const p = pick(PEOPLE);
  const n = p.name;
  const kind = randInt(0, 3);
  if (kind === 0) {
    const price = randInt(2, 15) * 20; // multiples of 20 keep every discount a whole number
    const pct = pick([10, 20, 25, 50]);
    const qty = randInt(2, 4);
    const total = price * qty - (price * qty * pct) / 100;
    return {
      kind: 'input',
      text: `${n} ${g(p, 'קנה', 'קנתה')} ${qty} משחקים, כל אחד ב-${price} ₪, ${g(p, 'וקיבל', 'וקיבלה')} הנחה של ${pct}% על הכול. כמה ${g(p, 'שילם', 'שילמה')}?`,
      answer: total,
      hint: `קודם המחיר המלא: ${qty} × ${price}. ואז הורד ${pct}%.`,
      explain: `${qty * price} ${MINUS} ${(qty * price * pct) / 100} = ${total} ₪`,
    };
  }
  if (kind === 1) {
    const speed = pick([40, 50, 60, 80, 90]);
    const hours = pick([2, 3, 4, 1.5, 2.5]);
    return {
      kind: 'input',
      text: `מכונית נוסעת במהירות ${speed} קמ"ש. כמה ק"מ תעבור ב-${hours} שעות?`,
      answer: speed * hours,
      hint: `מרחק = מהירות × זמן: ${speed} × ${hours}.`,
      explain: `${speed} × ${hours} = ${speed * hours} ק"מ`,
    };
  }
  if (kind === 2) {
    const scores = [randInt(70, 95), randInt(70, 95), randInt(70, 95)];
    const want = Math.ceil((scores.reduce((a, b) => a + b, 0) + 80) / 4);
    const need = want * 4 - scores.reduce((a, b) => a + b, 0);
    if (need > 100 || need < 0) return story();
    return {
      kind: 'input',
      text: `הציונים של ${n}: [[${scores.join(', ')}]]. איזה ציון ${g(p, 'הוא צריך', 'היא צריכה')} במבחן הרביעי כדי שהממוצע יהיה ${want}?`,
      answer: need,
      hint: `סכום 4 ציונים צריך להיות ${want} × 4 = ${want * 4}.`,
      explain: `${want * 4} ${MINUS} ${scores.reduce((a, b) => a + b, 0)} = ${need}`,
    };
  }
  const r = pick([1, 2, 5, 10]);
  return {
    kind: 'input',
    text: `לגלגל ענק במגרש המשחקים יש קוטר של ${r} מטר. כמה מטר הוא עובר בסיבוב אחד? (π = 3.14)`,
    answer: Math.round(r * 314) / 100,
    decimal: true,
    hint: 'בסיבוב אחד הגלגל עובר את ההיקף שלו: קוטר × 3.14.',
    explain: `${r} × 3.14 = ${Math.round(r * 314) / 100} מטר`,
  };
}

const solve: Level = {
  id: 'g6-story-1',
  title: 'בעיות מילוליות',
  intro: { lines: ['בעיות של כמה שלבים: אחוזים, מהירות, ממוצע ומעגל.', 'תכנן — חשב — ובדוק אם התשובה הגיונית.'] },
  generate: story,
};

export const storiesTopic: Topic = {
  id: 'g6-story',
  title: 'בעיות מילוליות',
  icon: '📖',
  levels: [solve],
};
