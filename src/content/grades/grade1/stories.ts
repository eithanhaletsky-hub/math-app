import type { Level, Question, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { MINUS, PEOPLE, g, type Person } from '../../lib/things';

interface Story {
  text: string;
  a: number;
  b: number;
  op: '+' | '-';
  answer: number;
  /** Key words that tell which operation to use. */
  clue: string;
}

/** Original short stories. Numbers stay within 20. */
function makeStory(p: Person): Story {
  const kind = randInt(0, 5);
  const n = p.name;
  if (kind === 0) {
    const a = randInt(3, 12);
    const b = randInt(2, 20 - a);
    return {
      text: `בגינה של ${n} פרחו ${a} פרחים. למחרת פרחו עוד ${b}. כמה פרחים יש עכשיו?`,
      a, b, op: '+', answer: a + b, clue: '"עוד" — מצרפים.',
    };
  }
  if (kind === 1) {
    const a = randInt(8, 20);
    const b = randInt(2, a - 2);
    return {
      text: `${n} ${g(p, 'ניפח', 'ניפחה')} ${a} בלונים. ${b} בלונים התפוצצו. כמה בלונים נשארו?`,
      a, b, op: '-', answer: a - b, clue: '"התפוצצו" ו"נשארו" — מורידים.',
    };
  }
  if (kind === 2) {
    const a = randInt(4, 12);
    const b = randInt(2, 20 - a);
    return {
      text: `באוטובוס ישבו ${a} ילדים. בתחנה עלו עוד ${b} ילדים. כמה ילדים יש עכשיו באוטובוס?`,
      a, b, op: '+', answer: a + b, clue: '"עלו עוד" — מצרפים.',
    };
  }
  if (kind === 3) {
    const a = randInt(8, 20);
    const b = randInt(2, a - 2);
    return {
      text: `באוטובוס ישבו ${a} ילדים. בתחנה ירדו ${b} ילדים. כמה ילדים נשארו באוטובוס?`,
      a, b, op: '-', answer: a - b, clue: '"ירדו" — מורידים.',
    };
  }
  if (kind === 4) {
    const a = randInt(5, 15);
    const b = randInt(1, a - 1);
    return {
      text: `ל${n} יש ${a} מדבקות, ול${g(p, 'חבר שלו', 'חברה שלה')} יש ${b} מדבקות. בכמה מדבקות יש ל${n} יותר?`,
      a, b, op: '-', answer: a - b, clue: '"בכמה יותר" — מחסרים את הקטן מהגדול.',
    };
  }
  const total = randInt(8, 20);
  const a = randInt(2, total - 2);
  return {
    text: `ל${n} היו ${a} גולות. ${g(p, 'הוא קיבל', 'היא קיבלה')} עוד גולות, ועכשיו יש ${g(p, 'לו', 'לה')} ${total}. כמה גולות ${g(p, 'הוא קיבל', 'היא קיבלה')}?`,
    a: total, b: a, op: '-', answer: total - a, clue: 'יודעים כמה היו בהתחלה וכמה יש בסוף. מה ההפרש?',
  };
}

function exprOf(a: number, op: '+' | '-', b: number) {
  return `${a} ${op === '+' ? '+' : MINUS} ${b}`;
}

const pickExercise: Level = {
  id: 'g1-story-1',
  title: 'איזה תרגיל מתאים?',
  intro: {
    lines: ['לפני שפותרים — מחליטים: חיבור או חיסור?', 'מצרפים, מוסיפים, עלו עוד ← חיבור. ירדו, נתנו, נשארו, בכמה יותר ← חיסור.'],
  },
  generate: (): Question => {
    const s = makeStory(pick(PEOPLE));
    const right = exprOf(s.a, s.op, s.b);
    const wrongOp = exprOf(s.a, s.op === '+' ? '-' : '+', s.b);
    const options = [right, wrongOp];
    // a third, plausible distractor
    const third = s.op === '+' ? exprOf(s.a + 1, '+', s.b) : exprOf(s.a, '-', s.b + 1);
    if (!options.includes(third)) options.push(third);
    return {
      kind: 'choice',
      text: s.text,
      options: shuffle(options).map((o) => ({ value: o, label: o })),
      answer: right,
      hint: s.clue,
      explain: `התרגיל המתאים: [[${right} = ${s.answer}]]`,
    };
  },
};

const solve: Level = {
  id: 'g1-story-2',
  title: 'פותרים סיפורים',
  intro: {
    lines: ['קרא את הסיפור עד הסוף.', 'כתוב בראש את התרגיל — ואז פתור.'],
  },
  generate: (): Question => {
    const s = makeStory(pick(PEOPLE));
    return {
      kind: 'input',
      text: s.text,
      answer: s.answer,
      hint: s.clue,
      explain: `[[${exprOf(s.a, s.op, s.b)} = ${s.answer}]]`,
    };
  },
};

export const storiesTopic: Topic = {
  id: 'g1-story',
  title: 'בעיות מילוליות',
  icon: '📖',
  levels: [pickExercise, solve],
};
