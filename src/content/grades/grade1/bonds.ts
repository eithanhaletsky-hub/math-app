import type { Level, Topic } from '../../types';
import { distinctInts, pick, randInt } from '../../lib/random';
import { COUNTABLES } from '../../lib/things';

const split: Level = {
  id: 'g1-bonds-1',
  title: 'מפרקים מספר',
  intro: {
    lines: ['כל מספר אפשר לפרק לשני חלקים.', 'למשל, 7 זה 3 ועוד 4.'],
    visual: { type: 'bond', whole: 7, parts: [3, 4] },
  },
  generate: () => {
    const whole = randInt(3, 10);
    const a = randInt(1, whole - 1);
    const t = pick(COUNTABLES);
    return {
      kind: 'input',
      text: `[[${whole}]] זה [[${a}]] ועוד כמה?`,
      visual: { type: 'bond', whole, parts: [a, null] },
      answer: whole - a,
      hint: `צייר בראש ${whole} נקודות. כסה ${a} מהן — כמה נשארו?`,
      explain: `${a} ועוד ${whole - a} זה ${whole}.`,
      explainVisual: { type: 'objects', emoji: t.emoji, groups: [a, whole - a] },
    };
  },
};

const friendsOf10: Level = {
  id: 'g1-bonds-2',
  title: 'החברים של 10',
  intro: {
    lines: ['"חברים של 10" הם שני מספרים שביחד עושים 10.', 'למשל 6 ו-4: 6 + 4 = 10.'],
    visual: { type: 'tenframe', filled: 6 },
  },
  generate: () => {
    if (Math.random() < 0.5) {
      const nums = distinctInts(4, 1, 9);
      return {
        kind: 'match',
        text: 'גרור לכל מספר את החבר שלו, כך שביחד יהיה 10.',
        pairs: nums.map((n) => ({ left: { label: String(n) }, right: { label: String(10 - n) } })),
        hint: 'במסגרת העשר: כמה משבצות ריקות נשארות אחרי שממלאים את המספר?',
        explain: nums.map((n) => `${n} + ${10 - n} = 10`).join(' · '),
      };
    }
    const n = randInt(1, 9);
    return {
      kind: 'input',
      text: 'כמה חסר כדי להגיע ל-10?',
      expr: `${n} + ? = 10`,
      visual: { type: 'tenframe', filled: n },
      answer: 10 - n,
      hint: 'ספור את המשבצות הריקות במסגרת.',
      explain: `חסרות ${10 - n} משבצות. ${n} + ${10 - n} = 10.`,
    };
  },
};

export const bondsTopic: Topic = {
  id: 'g1-bonds',
  title: 'פירוק מספרים',
  icon: '🧩',
  levels: [split, friendsOf10],
};
