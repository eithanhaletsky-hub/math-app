import type { Level, Question, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { MINUS, PEOPLE, g } from '../../lib/things';

const r2 = (x: number) => Math.round(x * 100) / 100;

function story(): Question {
  const p = pick(PEOPLE);
  const n = p.name;
  const kind = randInt(0, 3);
  if (kind === 0) {
    const a = r2(randInt(3, 15) + pick([0.5, 0.9, 0.25, 0.75, 0.4]));
    const b = r2(randInt(2, 12) + pick([0.5, 0.1, 0.25, 0.6]));
    return {
      kind: 'input',
      text: `${n} ${g(p, 'קנה', 'קנתה')} מחברת ב-${a} ₪ ועט ב-${b} ₪. כמה ${g(p, 'שילם', 'שילמה')} בסך הכול?`,
      answer: r2(a + b),
      decimal: true,
      hint: 'חבר את המחירים — נקודה מתחת לנקודה.',
      explain: `[[${a} + ${b} = ${r2(a + b)}]] ₪`,
    };
  }
  if (kind === 1) {
    const L = pick([1, 2, 3]);
    // only splits with an exact answer of at most 2 decimals (e.g. 3 : 4 = 0.75)
    const cups = pick([2, 4, 5, 10]);
    const each = r2(L / cups);
    return {
      kind: 'input',
      text: `בבקבוק ${L} ליטר מיץ. מוזגים אותו שווה בשווה ל-${cups} כוסות. כמה ליטר בכל כוס?`,
      answer: each,
      decimal: true,
      hint: `${L} : ${cups}. אפשר לחשוב במ"ל: ${L * 1000} מ"ל : ${cups}.`,
      explain: `${L * 1000} : ${cups} = ${L * 1000 / cups} מ"ל = ${each} ליטר`,
    };
  }
  if (kind === 2) {
    const total = randInt(4, 12) * 12;
    const d = pick([3, 4, 6]);
    const k = randInt(1, d - 1);
    return {
      kind: 'input',
      text: `בכיתה ${total} מדבקות. [[${k}/${d}]] מהן כוכבים, והשאר לבבות. כמה מדבקות לבבות?`,
      answer: total - (total / d) * k,
      hint: `קודם: כמה כוכבים? (${total} : ${d} × ${k}). ואז מה שנשאר.`,
      explain: `כוכבים: ${(total / d) * k}. לבבות: ${total} ${MINUS} ${(total / d) * k} = ${total - (total / d) * k}`,
    };
  }
  const w = randInt(3, 12);
  const h = randInt(2, 8);
  const price = pick([20, 25, 40, 50]);
  return {
    kind: 'input',
    text: `צובעים קיר מלבני: ${w} מטר רוחב, ${h} מטר גובה. צבע לכל מ"ר עולה ${price} ₪. כמה יעלה הצבע?`,
    answer: w * h * price,
    hint: `קודם השטח: ${w} × ${h}. ואז כפול ${price}.`,
    explain: `${w} × ${h} = ${w * h} מ"ר, × ${price} = ${w * h * price} ₪`,
  };
}

const solve: Level = {
  id: 'g5-story-1',
  title: 'בעיות מילוליות',
  intro: { lines: ['קרא בעיון. מה יודעים? מה שואלים? אילו צעדים צריך?'] },
  generate: story,
};

export const storiesTopic: Topic = {
  id: 'g5-story',
  title: 'בעיות מילוליות',
  icon: '📖',
  levels: [solve],
};
