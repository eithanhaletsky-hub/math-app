import type { Level, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';
import { MINUS, PEOPLE, g } from '../../lib/things';

const meaning: Level = {
  id: 'g6-pct-1',
  title: 'מה זה אחוז?',
  intro: {
    lines: ['אחוז (%) = חלק מתוך 100.', '[[35%]] = 35 מתוך 100 = [[35/100]] = [[0.35]].'],
    visual: { type: 'percentGrid', filled: 35 },
  },
  generate: () => {
    const p = randInt(1, 99);
    const kind = randInt(0, 2);
    if (kind === 0) {
      return {
        kind: 'input',
        text: 'כמה אחוזים מהלוח צבועים?',
        visual: { type: 'percentGrid', filled: p },
        answer: p,
        hint: 'יש 100 משבצות. כל משבצת = 1%. כל שורה = 10%.',
        explain: `${p} משבצות מתוך 100 = ${p}%.`,
      };
    }
    if (kind === 1) {
      return {
        kind: 'input',
        text: `כתוב כשבר עשרוני: [[${p}%]]`,
        answer: p / 100,
        decimal: true,
        hint: `${p}% = ${p}/100.`,
        explain: `${p}% = ${(p / 100).toFixed(2)}`,
      };
    }
    const pair = pick([
      [1, 2, 50],
      [1, 4, 25],
      [3, 4, 75],
      [1, 5, 20],
      [2, 5, 40],
      [1, 10, 10],
      [3, 10, 30],
      [1, 20, 5],
    ]);
    return {
      kind: 'input',
      text: `כמה אחוזים זה [[${pair[0]}/${pair[1]}]]?`,
      answer: pair[2],
      hint: `הרחב למכנה 100: ${pair[0]}/${pair[1]} = ?/100.`,
      explain: `[[${pair[0]}/${pair[1]} = ${pair[2]}/100 = ${pair[2]}%]]`,
    };
  },
};

const ofQuantity: Level = {
  id: 'g6-pct-2',
  title: 'אחוז מכמות',
  intro: {
    lines: ['10% = עשירית: מחלקים ב-10. 50% = חצי. 25% = רבע.', '30% מ-80: 10% = 8, אז 30% = 24.'],
  },
  generate: () => {
    const p = pick([10, 20, 25, 30, 40, 50, 75, 5, 1]);
    const base = p === 25 || p === 75 ? randInt(1, 20) * 4 : p === 5 || p === 1 ? randInt(1, 20) * 100 : randInt(1, 30) * 10;
    const ans = (base * p) / 100;
    return {
      kind: 'input',
      text: `כמה זה [[${p}%]] מ-${base}?`,
      answer: ans,
      hint:
        p === 50
          ? 'חצי.'
          : p === 25
            ? 'רבע — חלק ב-4.'
            : p === 75
              ? 'שלושה רבעים: רבע, ואז כפול 3.'
              : p === 1
                ? '1% — חלק ב-100.'
                : p === 5
                  ? '5% = חצי מ-10%.'
                  : `קודם 10% (חלק ב-10), ואז כפול ${p / 10}.`,
      explain: `${p}% מ-${base} = ${ans}`,
    };
  },
};

const discount: Level = {
  id: 'g6-pct-3',
  title: 'הנחות ומבצעים',
  intro: { lines: ['הנחה של 20% על 150 ₪: ההנחה = 30 ₪.', 'המחיר החדש: [[150 − 30 = 120]] ₪.'] },
  generate: () => {
    const p = pick([10, 20, 25, 50, 30]);
    const price = p === 25 ? randInt(2, 30) * 4 * 5 : randInt(2, 40) * 10;
    const off = (price * p) / 100;
    const ITEMS = ['חולצה', 'משחק', 'זוג נעליים', 'ספר', 'תיק'];
    const item = pick(ITEMS);
    const pp = pick(PEOPLE);
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: `${item} עולה ${price} ₪, ויש הנחה של ${p}%. כמה ${g(pp, 'ישלם', 'תשלם')} ${pp.name}?`,
        answer: price - off,
        hint: `קודם ההנחה: ${p}% מ-${price}. ואז חסר מהמחיר.`,
        explain: `הנחה: ${off} ₪. ${price} ${MINUS} ${off} = ${price - off} ₪`,
      };
    }
    return {
      kind: 'input',
      text: `${item} עולה ${price} ₪. במבצע הוא הוזל ב-${p}%. כמה שקלים חוסכים?`,
      answer: off,
      hint: `${p}% מ-${price}.`,
      explain: `${p}% מ-${price} = ${off} ₪`,
    };
  },
};

const whatPercent: Level = {
  id: 'g6-pct-4',
  title: 'כמה אחוזים?',
  intro: { lines: ['12 מתוך 50 — כמה אחוזים? מרחיבים למכנה 100: [[12/50 = 24/100]] = 24%.'] },
  generate: () => {
    const total = pick([10, 20, 25, 50, 200]);
    const part = randInt(1, total - 1);
    if ((part * 100) % total !== 0) return whatPercent.generate();
    const ans = (part * 100) / total;
    return {
      kind: 'input',
      text: `בכיתה ${total} תלמידים, ו-${part} מהם הגיעו באופניים. כמה אחוזים מהתלמידים הגיעו באופניים?`,
      answer: ans,
      hint: `כתוב כשבר ${part}/${total} והרחב (או צמצם) למכנה 100.`,
      explain: `[[${part}/${total} = ${ans}/100]] = ${ans}%`,
    };
  },
};

export const percentTopic: Topic = {
  id: 'g6-pct',
  title: 'אחוזים',
  icon: '💯',
  levels: [meaning, ofQuantity, discount, whatPercent],
};
