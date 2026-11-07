import type { Level, Question, Topic } from '../../types';
import { distinctInts, pick, randInt, sortedNumberOptions } from '../../lib/random';
import { COUNTABLES, PEOPLE, g } from '../../lib/things';

const MINUS = '−';

const addPictures: Level = {
  id: 'g1-add-1',
  title: 'חיבור עם ציורים',
  intro: {
    lines: ['בחיבור מצרפים שתי קבוצות יחד.', 'סופרים כמה יש בסך הכול.'],
    expr: '3 + 2 = 5',
    visual: { type: 'objects', emoji: '🎈', groups: [3, 2] },
  },
  generate: () => {
    const a = randInt(1, 7);
    const b = randInt(1, 10 - a);
    const t = pick(COUNTABLES);
    return {
      kind: 'input',
      text: 'כמה יש ביחד?',
      expr: `${a} + ${b} = ?`,
      visual: { type: 'objects', emoji: t.emoji, groups: [a, b], tappable: true },
      answer: a + b,
      hint: `התחל מ-${a} והמשך לספור את הקבוצה השנייה.`,
      explain: `${a} ועוד ${b} זה ${a + b}.`,
    };
  },
};

const addLine: Level = {
  id: 'g1-add-2',
  title: 'חיבור על הציר',
  intro: {
    lines: ['בחיבור על הציר קופצים **ימינה**.', 'מתחילים מהמספר הגדול — כך יש פחות קפיצות.'],
    expr: '6 + 3 = 9',
    visual: { type: 'numberline', min: 0, max: 10, labelEvery: 1, jumps: [{ from: 6, to: 7 }, { from: 7, to: 8 }, { from: 8, to: 9 }] },
  },
  generate: () => {
    const a = randInt(2, 8);
    const b = randInt(1, Math.min(4, 10 - a));
    const jumps = Array.from({ length: b }, (_, i) => ({ from: a + i, to: a + i + 1 }));
    return {
      kind: 'choice',
      text: 'לאן הגענו?',
      expr: `${a} + ${b} = ?`,
      visual: { type: 'numberline', min: 0, max: 10, labelEvery: 1, jumps, highlight: [a] },
      options: sortedNumberOptions(a + b, { min: 0, max: 10, near: [1, -1, 2, -2] }),
      answer: String(a + b),
      hint: `התחלנו ב-${a}. ספור ${b} קפיצות ימינה.`,
      explain: `מ-${a} קופצים ${b} קפיצות ומגיעים ל-${a + b}.`,
    };
  },
};

const subPictures: Level = {
  id: 'g1-add-3',
  title: 'חיסור עם ציורים',
  intro: {
    lines: ['בחיסור מורידים חלק מהקבוצה.', 'סופרים כמה נשארו.'],
    expr: `5 ${MINUS} 2 = 3`,
    visual: { type: 'objects', emoji: '🍪', groups: [5], crossed: 2 },
  },
  generate: () => {
    const a = randInt(3, 10);
    const b = randInt(1, a - 1);
    const t = pick(COUNTABLES);
    return {
      kind: 'input',
      text: 'כמה נשארו?',
      expr: `${a} ${MINUS} ${b} = ?`,
      visual: { type: 'objects', emoji: t.emoji, groups: [a], crossed: b },
      answer: a - b,
      hint: 'ספור רק את הציורים שלא מחוקים.',
      explain: `היו ${a}, הורדנו ${b}, ונשארו ${a - b}.`,
    };
  },
};

function plainExercise(): Question {
  const plus = Math.random() < 0.5;
  if (plus) {
    const a = randInt(0, 10);
    const b = randInt(0, 10 - a);
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${a} + ${b} = ?`,
      answer: a + b,
      hint: b === 0 ? 'כשמוסיפים 0 — לא משתנה כלום.' : `התחל מ-${Math.max(a, b)} וספור ${Math.min(a, b)} קדימה.`,
      explain: `${a} + ${b} = ${a + b}`,
      explainVisual: { type: 'numberline', min: 0, max: 10, labelEvery: 1, highlight: [a + b] },
    };
  }
  const a = randInt(1, 10);
  const b = randInt(0, a);
  return {
    kind: 'input',
    text: 'פתור:',
    expr: `${a} ${MINUS} ${b} = ?`,
    answer: a - b,
    hint: b === 0 ? 'כשמורידים 0 — לא משתנה כלום.' : `התחל מ-${a} וספור ${b} אחורה.`,
    explain: `${a} ${MINUS} ${b} = ${a - b}`,
    explainVisual: { type: 'numberline', min: 0, max: 10, labelEvery: 1, highlight: [a - b] },
  };
}

const mixed: Level = {
  id: 'g1-add-4',
  title: 'חיבור וחיסור',
  intro: {
    lines: ['שים לב לסימן!', '**+** מוסיפים, **−** מורידים.'],
    expr: `4 + 3 = 7   ·   7 ${MINUS} 3 = 4`,
  },
  generate: plainExercise,
};

const matchResults: Level = {
  id: 'g1-add-5',
  title: 'התאם תרגיל לתוצאה',
  intro: {
    lines: ['פתור כל תרגיל וגרור אליו את התוצאה.', 'אפשר גם לגעת בתוצאה ואז בתרגיל.'],
  },
  generate: () => {
    const results = distinctInts(4, 1, 10);
    return {
      kind: 'match',
      text: 'גרור לכל תרגיל את התוצאה שלו.',
      pairs: results.map((r) => {
        if (Math.random() < 0.5) {
          const a = r >= 2 ? randInt(1, r - 1) : randInt(0, r);
          return { left: { label: `${a} + ${r - a}` }, right: { label: String(r) } };
        }
        const b = randInt(1, 10 - r);
        return { left: { label: `${r + b} ${MINUS} ${b}` }, right: { label: String(r) } };
      }),
      hint: 'פתור קודם תרגיל אחד, ורק אחר כך חפש את התוצאה.',
      explain: 'כל תרגיל קיבל את התוצאה הנכונה שלו. נסה שוב בסבב הבא!',
    };
  },
};

const stories: Level = {
  id: 'g1-add-6',
  title: 'סיפורים חשבוניים',
  intro: {
    lines: ['קרא את הסיפור ושאל: מצרפים או מורידים?', 'קיבלו עוד / הגיעו עוד ← חיבור. נתנו / אכלו / עפו ← חיסור.'],
  },
  generate: () => {
    const p = pick(PEOPLE);
    const name = p.name;
    const t = pick(COUNTABLES);
    const kind = randInt(0, 3);
    if (kind === 0) {
      const a = randInt(2, 6);
      const b = randInt(1, 10 - a);
      return {
        kind: 'input',
        text: `ל${name} יש ${a} ${t.plural}. קיבלו עוד ${b}. כמה ${t.plural} יש עכשיו?`,
        visual: { type: 'objects', emoji: t.emoji, groups: [a, b] },
        answer: a + b,
        hint: '"קיבלו עוד" — מצרפים. זה תרגיל חיבור.',
        explain: `${a} + ${b} = ${a + b}`,
      };
    }
    if (kind === 1) {
      const a = randInt(4, 10);
      const b = randInt(1, a - 1);
      return {
        kind: 'input',
        text: `ל${name} היו ${a} ${t.plural}. ${b} ${t.plural} הלכו לאיבוד. כמה נשארו?`,
        answer: a - b,
        hint: '"הלכו לאיבוד" — מורידים. זה תרגיל חיסור.',
        explain: `${a} ${MINUS} ${b} = ${a - b}`,
        explainVisual: { type: 'objects', emoji: t.emoji, groups: [a], crossed: b },
      };
    }
    if (kind === 2) {
      const a = randInt(2, 7);
      const b = randInt(1, 10 - a);
      return {
        kind: 'input',
        text: `על העץ ישבו ${a} ציפורים. הגיעו עוד ${b}. כמה ציפורים יש על העץ?`,
        answer: a + b,
        hint: '"הגיעו עוד" — מצרפים.',
        explain: `${a} + ${b} = ${a + b}`,
        explainVisual: { type: 'objects', emoji: '🐦', groups: [a, b] },
      };
    }
    const a = randInt(3, 10);
    const b = randInt(1, a - 1);
    return {
      kind: 'input',
      text: `בצלחת היו ${a} עוגיות. ${name} ${g(p, 'אכל', 'אכלה')} ${b}. כמה עוגיות נשארו בצלחת?`,
      answer: a - b,
      hint: '"אכלו" — מורידים מהצלחת.',
      explain: `${a} ${MINUS} ${b} = ${a - b}`,
      explainVisual: { type: 'objects', emoji: '🍪', groups: [a], crossed: b },
    };
  },
};

export const add10Topic: Topic = {
  id: 'g1-add10',
  title: 'חיבור וחיסור עד 10',
  icon: '➕',
  levels: [addPictures, addLine, subPictures, mixed, matchResults, stories],
};
