import type { Level, Topic } from '../../types';
import { PEOPLE, g, MINUS } from '../../lib/things';
import { pick, randInt } from '../../lib/random';

const vAddNoCarry: Level = {
  id: 'g2-vert-1',
  title: 'חיבור במאונך',
  intro: {
    lines: ['במאונך כותבים יחידות מתחת ליחידות, ועשרות מתחת לעשרות.', 'מתחילים לחבר **מימין** — מהיחידות.'],
    visual: { type: 'vertical', rows: [342, 125], op: '+', result: 467 },
  },
  generate: () => {
    // 2- or 3-digit, no carrying
    const digits = Math.random() < 0.5 ? 2 : 3;
    const a = Array.from({ length: digits }, (_, i) => randInt(i === 0 ? 1 : 0, 8));
    const b = a.map((d, i) => randInt(i === 0 ? 1 : 0, 9 - d));
    const na = Number(a.join(''));
    const nb = Number(b.join(''));
    return {
      kind: 'input',
      text: 'פתור במאונך:',
      visual: { type: 'vertical', rows: [na, nb], op: '+', result: null },
      answer: na + nb,
      hint: 'חבר כל עמודה בנפרד: יחידות עם יחידות, עשרות עם עשרות.',
      explain: `${na} + ${nb} = ${na + nb}`,
      explainVisual: { type: 'vertical', rows: [na, nb], op: '+', result: na + nb },
    };
  },
};

const vAddCarry: Level = {
  id: 'g2-vert-2',
  title: 'חיבור במאונך עם המרה',
  intro: {
    lines: ['אם ביחידות יוצא 10 או יותר — כותבים את היחידות,', 'ואת העשרת "מעבירים" לעמודת העשרות (כותבים 1 קטן למעלה).'],
    visual: { type: 'vertical', rows: [47, 38], op: '+', result: 85 },
  },
  generate: () => {
    const three = Math.random() < 0.4;
    const ao = randInt(3, 9);
    const bo = randInt(10 - ao, 9);
    const at = randInt(1, 7);
    const bt = randInt(1, 8 - at);
    let na = at * 10 + ao;
    let nb = bt * 10 + bo;
    if (three) {
      const ah = randInt(1, 4);
      const bh = randInt(1, 4);
      na += ah * 100;
      nb += bh * 100;
    }
    return {
      kind: 'input',
      text: 'פתור במאונך:',
      visual: { type: 'vertical', rows: [na, nb], op: '+', result: null },
      answer: na + nb,
      hint: `ביחידות: ${ao} + ${bo} = ${ao + bo}. כתוב ${(ao + bo) % 10} והעבר 1 לעשרות.`,
      explain: `${na} + ${nb} = ${na + nb}`,
      explainVisual: { type: 'vertical', rows: [na, nb], op: '+', result: na + nb },
    };
  },
};

const vSubNoBorrow: Level = {
  id: 'g2-vert-3',
  title: 'חיסור במאונך',
  intro: {
    lines: ['גם בחיסור מתחילים מהיחידות.', 'בכל עמודה מחסרים את הספרה התחתונה מהעליונה.'],
    visual: { type: 'vertical', rows: [587, 243], op: '−', result: 344 },
  },
  generate: () => {
    const digits = Math.random() < 0.5 ? 2 : 3;
    const a = Array.from({ length: digits }, (_, i) => randInt(i === 0 ? 2 : 0, 9));
    const b = a.map((d, i) => randInt(i === 0 ? 1 : 0, i === 0 ? d - 1 : d));
    const na = Number(a.join(''));
    const nb = Number(b.join(''));
    return {
      kind: 'input',
      text: 'פתור במאונך:',
      visual: { type: 'vertical', rows: [na, nb], op: '−', result: null },
      answer: na - nb,
      hint: 'חסר כל עמודה בנפרד, מימין לשמאל.',
      explain: `${na} ${MINUS} ${nb} = ${na - nb}`,
      explainVisual: { type: 'vertical', rows: [na, nb], op: '−', result: na - nb },
    };
  },
};

const vSubBorrow: Level = {
  id: 'g2-vert-4',
  title: 'חיסור במאונך עם פריטה',
  intro: {
    lines: ['אם הספרה העליונה קטנה מהתחתונה — "פורטים" עשרת אחת ל-10 יחידות.', 'ב-[[52 − 17]]: 2 קטן מ-7, אז פורטים: 12 − 7 = 5, ונשארו 4 עשרות.'],
    visual: { type: 'vertical', rows: [52, 17], op: '−', result: 35 },
  },
  generate: () => {
    const ao = randInt(0, 7);
    const bo = randInt(ao + 1, 9);
    const at = randInt(2, 9);
    const bt = randInt(0, at - 1);
    let na = at * 10 + ao;
    let nb = bt * 10 + bo;
    if (Math.random() < 0.4) {
      const ah = randInt(2, 9);
      na += ah * 100;
      nb += randInt(1, ah - 1) * 100;
    }
    return {
      kind: 'input',
      text: 'פתור במאונך:',
      visual: { type: 'vertical', rows: [na, nb], op: '−', result: null },
      answer: na - nb,
      hint: `ביחידות ${ao} קטן מ-${bo}. פרוט עשרת: ${ao + 10} ${MINUS} ${bo} = ${ao + 10 - bo}, ובעשרות נשאר אחד פחות.`,
      explain: `${na} ${MINUS} ${nb} = ${na - nb}`,
      explainVisual: { type: 'vertical', rows: [na, nb], op: '−', result: na - nb },
    };
  },
};

const hundreds: Level = {
  id: 'g2-vert-5',
  title: 'מאות שלמות ועשרות',
  intro: {
    lines: ['[[300 + 400]] זה 3 מאות ועוד 4 מאות = 7 מאות = 700.', '[[450 + 30]]: רק העשרות משתנות → 480.'],
  },
  generate: () => {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const a = randInt(1, 8);
      const b = randInt(1, 9 - a);
      const plus = Math.random() < 0.5;
      return plus
        ? {
            kind: 'input',
            text: 'פתור:',
            expr: `${a * 100} + ${b * 100} = ?`,
            answer: (a + b) * 100,
            hint: `חשוב במאות: ${a} + ${b}.`,
            explain: `${a} + ${b} = ${a + b} מאות = ${(a + b) * 100}`,
          }
        : {
            kind: 'input',
            text: 'פתור:',
            expr: `${(a + b) * 100} ${MINUS} ${b * 100} = ?`,
            answer: a * 100,
            hint: `חשוב במאות: ${a + b} ${MINUS} ${b}.`,
            explain: `${a + b} ${MINUS} ${b} = ${a} מאות = ${a * 100}`,
          };
    }
    const h = randInt(1, 9) * 100;
    const t = randInt(1, 6) * 10;
    const add = randInt(1, 9 - t / 10) * 10;
    if (kind === 1) {
      return {
        kind: 'input',
        text: 'פתור:',
        expr: `${h + t} + ${add} = ?`,
        answer: h + t + add,
        hint: 'המאות לא משתנות. חבר רק את העשרות.',
        explain: `${h + t} + ${add} = ${h + t + add}`,
      };
    }
    return {
      kind: 'input',
      text: 'פתור:',
      expr: `${h + t + add} ${MINUS} ${add} = ?`,
      answer: h + t,
      hint: 'המאות לא משתנות. חסר רק מהעשרות.',
      explain: `${h + t + add} ${MINUS} ${add} = ${h + t}`,
    };
  },
};

const stories: Level = {
  id: 'g2-vert-6',
  title: 'סיפורים עם מספרים גדולים',
  intro: { lines: ['קרא, החלט אם מחברים או מחסרים — ופתור (אפשר במאונך על דף).'] },
  generate: () => {
    const p = pick(PEOPLE);
    const kind = randInt(0, 2);
    if (kind === 0) {
      const a = randInt(120, 450);
      const b = randInt(100, 400);
      return {
        kind: 'input',
        text: `בספרייה של בית הספר יש ${a} ספרי קריאה ו-${b} ספרי מדע. כמה ספרים יש בסך הכול?`,
        answer: a + b,
        hint: '"בסך הכול" — חיבור. כתוב את המספרים זה מתחת לזה.',
        explain: `${a} + ${b} = ${a + b}`,
        explainVisual: { type: 'vertical', rows: [a, b], op: '+', result: a + b },
      };
    }
    if (kind === 1) {
      const a = randInt(300, 900);
      const b = randInt(100, a - 50);
      return {
        kind: 'input',
        text: `באלבום של ${p.name} יש מקום ל-${a} מדבקות. ${g(p, 'הוא כבר הדביק', 'היא כבר הדביקה')} ${b}. כמה מקומות נשארו ריקים?`,
        answer: a - b,
        hint: 'כמה נשארו? — חיסור.',
        explain: `${a} ${MINUS} ${b} = ${a - b}`,
        explainVisual: { type: 'vertical', rows: [a, b], op: '−', result: a - b },
      };
    }
    const a = randInt(150, 600);
    const b = randInt(100, 350);
    return {
      kind: 'input',
      text: `ביום ראשון ${g(p, 'רץ', 'רצה')} ${p.name} ${a} מטר, וביום שני ${b} מטר. כמה מטרים ${g(p, 'רץ', 'רצה')} בשני הימים יחד?`,
      answer: a + b,
      hint: '"יחד" — חיבור.',
      explain: `${a} + ${b} = ${a + b}`,
      explainVisual: { type: 'vertical', rows: [a, b], op: '+', result: a + b },
    };
  },
};

export const verticalTopic: Topic = {
  id: 'g2-vert',
  title: 'חיבור וחיסור במאונך',
  icon: '🧮',
  levels: [vAddNoCarry, vAddCarry, vSubNoBorrow, vSubBorrow, hundreds, stories],
};
