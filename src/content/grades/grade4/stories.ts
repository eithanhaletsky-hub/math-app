import type { Level, Question, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { MINUS, PEOPLE, g } from '../../lib/things';

function story(): { text: string; answer: number; hint: string; explain: string } {
  const p = pick(PEOPLE);
  const n = p.name;
  const kind = randInt(0, 3);
  if (kind === 0) {
    const price = randInt(12, 45);
    const count = randInt(3, 9);
    const budget = Math.ceil((price * count) / 100) * 100 + 100;
    return {
      text: `לכיתה יש ${budget} ₪. קונים ${count} כדורים, כל כדור ב-${price} ₪. כמה כסף יישאר?`,
      answer: budget - price * count,
      hint: `קודם המחיר של כל הכדורים: ${count} × ${price}. אחר כך — כמה נשאר מ-${budget}?`,
      explain: `${count} × ${price} = ${price * count}, ${budget} ${MINUS} ${price * count} = ${budget - price * count} ₪`,
    };
  }
  if (kind === 1) {
    const total = randInt(4, 9) * 24;
    const boxes = total / 24;
    return {
      text: `במפעל ארזו ${total} ביצים בתבניות של 24. כמה תבניות מילאו?`,
      answer: boxes,
      hint: `${total} : 24`,
      explain: `${total} : 24 = ${boxes}`,
    };
  }
  if (kind === 2) {
    const d = pick([3, 4, 5, 6, 8]);
    const unit = randInt(5, 25);
    const total = unit * d;
    const k = randInt(1, d - 1);
    return {
      text: `בספר ${total} עמודים. ${n} ${g(p, 'קרא', 'קראה')} [[${k}/${d}]] מהספר. כמה עמודים ${g(p, 'קרא', 'קראה')}?`,
      answer: unit * k,
      hint: `${total} : ${d} = ? — זה ${d === 2 ? 'חצי' : `חלק אחד מ-${d}`}. ואז כפול ${k}.`,
      explain: `${total} : ${d} = ${unit}, ${unit} × ${k} = ${unit * k}`,
    };
  }
  const w = randInt(8, 25);
  const h = randInt(5, 15);
  const tile = 1;
  return {
    text: `רצפת חדר היא מלבן של ${w} מטר על ${h} מטר. כמה אריחים של מטר רבוע צריך כדי לכסות אותה?`,
    answer: w * h * tile,
    hint: 'מכסים את כל הרצפה — זה שטח: אורך × רוחב.',
    explain: `${w} × ${h} = ${w * h} אריחים`,
  };
}

const solve: Level = {
  id: 'g4-story-1',
  title: 'בעיות מילוליות',
  intro: { lines: ['קרא את כל השאלה. מה יודעים? מה שואלים?', 'תכנן את הצעדים — ורק אז חשב.'] },
  generate: (): Question => {
    const s = story();
    return { kind: 'input', text: s.text, answer: s.answer, hint: s.hint, explain: `[[${s.explain}]]` };
  },
};

export const storiesTopic: Topic = {
  id: 'g4-story',
  title: 'בעיות מילוליות',
  icon: '📖',
  levels: [solve],
};
