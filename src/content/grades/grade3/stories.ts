import type { Level, Question, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { MINUS, PEOPLE, g } from '../../lib/things';

/** Two-step stories: the child has to plan two operations. */
function twoStep(): { text: string; answer: number; hint: string; explain: string } {
  const p = pick(PEOPLE);
  const n = p.name;
  const kind = randInt(0, 3);
  if (kind === 0) {
    const packs = randInt(3, 6);
    const each = randInt(4, 9);
    const gave = randInt(2, packs * each - 2);
    return {
      text: `${n} ${g(p, 'קנה', 'קנתה')} ${packs} חבילות מדבקות, בכל חבילה ${each}. ${g(p, 'הוא נתן', 'היא נתנה')} ${gave} מדבקות לחברים. כמה מדבקות נשארו ל${n}?`,
      answer: packs * each - gave,
      hint: `קודם: כמה מדבקות ${g(p, 'קנה', 'קנתה')}? (${packs} × ${each}). אחר כך: כמה נשארו?`,
      explain: `${packs} × ${each} = ${packs * each}, ${packs * each} ${MINUS} ${gave} = ${packs * each - gave}`,
    };
  }
  if (kind === 1) {
    const price = randInt(6, 15);
    const count = randInt(2, 5);
    const paid = Math.ceil((price * count + 1) / 50) * 50;
    return {
      text: `מחברת עולה ${price} ₪. ${n} ${g(p, 'קנה', 'קנתה')} ${count} מחברות ${g(p, 'ושילם', 'ושילמה')} ב-${paid} ₪. כמה עודף ${g(p, 'קיבל', 'קיבלה')}?`,
      answer: paid - price * count,
      hint: `קודם המחיר הכולל: ${count} × ${price}. ואז העודף: ${paid} פחות המחיר.`,
      explain: `${count} × ${price} = ${price * count}, ${paid} ${MINUS} ${price * count} = ${paid - price * count} ₪`,
    };
  }
  if (kind === 2) {
    const kids = randInt(3, 8);
    const each = randInt(2, 5);
    const extra = randInt(1, 9);
    return {
      text: `המורה חילקה לכל אחד מ-${kids} ילדים ${each} עפרונות, ונשארו לה עוד ${extra}. כמה עפרונות היו למורה בהתחלה?`,
      answer: kids * each + extra,
      hint: `כמה חולקו? (${kids} × ${each}). ועוד מה שנשאר.`,
      explain: `${kids} × ${each} + ${extra} = ${kids * each + extra}`,
    };
  }
  const total = randInt(4, 9) * 6;
  const groups = pick([2, 3, 6].filter((x) => total % x === 0));
  const per = total / groups;
  const eaten = randInt(1, per - 1);
  return {
    text: `בצלחת ${total} עוגיות. מחלקים אותן שווה בשווה ל-${groups} ילדים, וכל ילד אוכל ${eaten} מהעוגיות שלו. כמה עוגיות נשארו לכל ילד?`,
    answer: per - eaten,
    hint: `קודם: כמה קיבל כל ילד? (${total} : ${groups}). ואז הורד את מה שאכל.`,
    explain: `${total} : ${groups} = ${per}, ${per} ${MINUS} ${eaten} = ${per - eaten}`,
  };
}

const twoSteps: Level = {
  id: 'g3-story-1',
  title: 'סיפורים בשני שלבים',
  intro: {
    lines: ['בחלק מהסיפורים צריך שני תרגילים.', 'שאלו: מה צריך לדעת קודם? ואז — מה עושים עם זה?'],
  },
  generate: (): Question => {
    const s = twoStep();
    return { kind: 'input', text: s.text, answer: s.answer, hint: s.hint, explain: `[[${s.explain}]]` };
  },
};

export const storiesTopic: Topic = {
  id: 'g3-story',
  title: 'בעיות מילוליות',
  icon: '📖',
  levels: [twoSteps],
};
