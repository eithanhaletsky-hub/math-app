import type { Level, Question, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { MINUS, PEOPLE, g } from '../../lib/things';

type Op = '+' | '−' | '×' | ':';

interface Story {
  text: string;
  expr: string;
  answer: number;
  op: Op;
  clue: string;
}

function story(): Story {
  const p = pick(PEOPLE);
  const n = p.name;
  const kind = randInt(0, 5);
  if (kind === 0) {
    const a = randInt(25, 70);
    const b = randInt(12, Math.min(29, a - 5));
    return {
      text: `בחצר שיחקו ${a} ילדים. ${b} ילדים נכנסו לכיתה. כמה ילדים נשארו בחצר?`,
      expr: `${a} ${MINUS} ${b}`, answer: a - b, op: '−', clue: '"נשארו" — מחסרים.',
    };
  }
  if (kind === 1) {
    const a = randInt(18, 60);
    const b = randInt(15, 39);
    return {
      text: `${n} ${g(p, 'קרא', 'קראה')} ${a} עמודים ביום ראשון, ו-${b} עמודים ביום שני. כמה עמודים ${g(p, 'קרא', 'קראה')} בסך הכול?`,
      expr: `${a} + ${b}`, answer: a + b, op: '+', clue: '"בסך הכול" — מחברים.',
    };
  }
  if (kind === 2) {
    const rows = randInt(2, 5);
    const each = pick([2, 3, 4, 5, 10]);
    return {
      text: `באולם ${rows} שורות של כיסאות, ובכל שורה ${each} כיסאות. כמה כיסאות יש באולם?`,
      expr: `${rows} × ${each}`, answer: rows * each, op: '×', clue: 'קבוצות שוות — כופלים.',
    };
  }
  if (kind === 3) {
    const kids = pick([2, 3, 4, 5]);
    const each = randInt(2, 6);
    return {
      text: `${n} ${g(p, 'חילק', 'חילקה')} ${kids * each} סוכריות שווה בשווה ל-${kids} חברים. כמה סוכריות קיבל כל חבר?`,
      expr: `${kids * each} : ${kids}`, answer: each, op: ':', clue: '"שווה בשווה" — מחלקים.',
    };
  }
  if (kind === 4) {
    const a = randInt(20, 50);
    const more = randInt(5, 25);
    return {
      text: `לדני יש ${a} גולות. ל${n} יש ${more} גולות יותר מלדני. כמה גולות יש ל${n}?`,
      expr: `${a} + ${more}`, answer: a + more, op: '+', clue: '"יותר מ…" — מוסיפים על מה שיש לדני.',
    };
  }
  const a = randInt(30, 90);
  const b = randInt(10, a - 5);
  return {
    text: `ל${n} ${a} ₪, ול${g(p, 'אחיו', 'אחיה')} ${b} ₪. בכמה שקלים יש ל${n} יותר?`,
    expr: `${a} ${MINUS} ${b}`, answer: a - b, op: '−', clue: '"בכמה יותר" — מחסרים את הקטן מהגדול.',
  };
}

const chooseOp: Level = {
  id: 'g2-story-1',
  title: 'איזו פעולה?',
  intro: {
    lines: ['לפני שפותרים — מחליטים מה עושים:', 'חיבור (+), חיסור (−), כפל (×) או חילוק (:)?'],
  },
  generate: (): Question => {
    const s = story();
    const labels: Record<Op, string> = { '+': 'חיבור (+)', '−': 'חיסור (−)', '×': 'כפל (×)', ':': 'חילוק (:)' };
    return {
      kind: 'choice',
      text: s.text,
      options: shuffle(Object.keys(labels) as Op[]).map((o) => ({ value: o, label: labels[o] })),
      answer: s.op,
      hint: s.clue,
      explain: `${labels[s.op]}: [[${s.expr} = ${s.answer}]]`,
    };
  },
};

const solve: Level = {
  id: 'g2-story-2',
  title: 'פותרים סיפורים',
  intro: { lines: ['קרא את כל הסיפור, כתוב תרגיל — ואז פתור.'] },
  generate: (): Question => {
    const s = story();
    return {
      kind: 'input',
      text: s.text,
      answer: s.answer,
      hint: s.clue,
      explain: `[[${s.expr} = ${s.answer}]]`,
    };
  },
};

export const storiesTopic: Topic = {
  id: 'g2-story',
  title: 'בעיות מילוליות',
  icon: '📖',
  levels: [chooseOp, solve],
};
