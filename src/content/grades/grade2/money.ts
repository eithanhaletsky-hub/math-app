import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle, sortedNumberOptions } from '../../lib/random';
import { MINUS, PEOPLE, g } from '../../lib/things';

/** Picks coins/notes (from the given denominations) that add up to `total` shekels. */
function makeChange(total: number, denoms: number[]): number[] {
  const out: number[] = [];
  let left = total;
  const sorted = [...denoms].sort((a, b) => b - a);
  while (left > 0) {
    const options = sorted.filter((d) => d <= left);
    // sometimes use a smaller coin to make it interesting
    const d = Math.random() < 0.7 ? options[0] : pick(options);
    out.push(d);
    left -= d;
  }
  return out.sort((a, b) => b - a);
}

const coins: Level = {
  id: 'g2-money-1',
  title: 'סופרים מטבעות',
  intro: {
    lines: ['יש מטבעות של 1, 2, 5 ו-10 שקלים (₪).', 'סופרים קודם את המטבעות הגדולים, ואז מוסיפים את הקטנים.'],
    visual: { type: 'money', items: [10, 5, 2, 1] },
  },
  generate: () => {
    const total = randInt(4, 30);
    const items = makeChange(total, [1, 2, 5, 10]);
    return {
      kind: 'input',
      text: 'כמה שקלים יש כאן?',
      visual: { type: 'money', items },
      answer: total,
      hint: 'התחל מהמטבע הגדול ביותר, והמשך להוסיף.',
      explain: `${items.join(' + ')} = ${total} ₪`,
    };
  },
};

const notes: Level = {
  id: 'g2-money-2',
  title: 'שטרות ומטבעות',
  intro: {
    lines: ['יש גם שטרות: 20, 50, 100 ו-200 ₪.', 'סופרים מהשטר הגדול אל המטבע הקטן.'],
    visual: { type: 'money', items: [50, 20, 10, 5] },
  },
  generate: () => {
    const total = randInt(25, 150);
    const items = makeChange(total, [1, 2, 5, 10, 20, 50, 100]);
    if (items.length > 9) return coins.generate();
    return {
      kind: 'input',
      text: 'כמה שקלים יש כאן?',
      visual: { type: 'money', items },
      answer: total,
      hint: 'חבר קודם את השטרות, ואחר כך את המטבעות.',
      explain: `${items.join(' + ')} = ${total} ₪`,
    };
  },
};

const agorot: Level = {
  id: 'g2-money-3',
  title: 'שקלים ואגורות',
  intro: {
    lines: ['בשקל אחד יש 100 אגורות.', 'מטבע של 50 אגורות = חצי שקל. 2 מטבעות של 50 אג\' = 1 ₪.'],
    visual: { type: 'money', items: [0.5, 0.5, 0.1, 0.1] },
  },
  generate: () => {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const fifties = randInt(0, 2);
      const tens = randInt(1, 5);
      const total = fifties * 50 + tens * 10;
      return {
        kind: 'input',
        text: 'כמה אגורות יש כאן?',
        visual: { type: 'money', items: [...Array(fifties).fill(0.5), ...Array(tens).fill(0.1)] },
        answer: total,
        hint: 'כל מטבע גדול = 50 אגורות, כל מטבע קטן = 10 אגורות.',
        explain: `${total} אגורות`,
      };
    }
    if (kind === 1) {
      const sh = randInt(1, 5);
      return {
        kind: 'choice',
        text: `כמה אגורות יש ב-${sh} ${sh === 1 ? 'שקל' : 'שקלים'}?`,
        options: sortedNumberOptions(sh * 100, { min: 10, near: [-sh * 90, 100, -100, sh * 900] }),
        answer: String(sh * 100),
        hint: 'בכל שקל יש 100 אגורות.',
        explain: `${sh} × 100 = ${sh * 100} אגורות.`,
      };
    }
    const halves = randInt(2, 8);
    return {
      kind: 'input',
      text: `כמה שקלים שווים ${halves} מטבעות של 50 אגורות?`,
      visual: { type: 'money', items: Array(halves).fill(0.5) },
      answer: halves / 2,
      decimal: true,
      hint: 'כל 2 מטבעות של 50 אגורות = שקל אחד.',
      explain: `${halves} חצאי שקל = ${halves / 2} ₪.`,
    };
  },
};

const ITEMS = [
  { name: 'מחברת', e: '📒' },
  { name: 'עיפרון', e: '✏️' },
  { name: 'בקבוק מים', e: '🧃' },
  { name: 'כדור', e: '⚽' },
  { name: 'ספר', e: '📕' },
  { name: 'גלידה', e: '🍦' },
  { name: 'משחק קלפים', e: '🃏' },
];

const shop: Level = {
  id: 'g2-money-4',
  title: 'בחנות',
  intro: {
    lines: ['כשקונים כמה דברים — מחברים את המחירים.', 'כשמשלמים יותר — מקבלים עודף: מחסרים את המחיר מהסכום ששילמנו.'],
  },
  generate: () => {
    const p = pick(PEOPLE);
    const [a, b] = shuffle(ITEMS);
    const kind = randInt(0, 2);
    if (kind === 0) {
      const pa = randInt(3, 25);
      const pb = randInt(2, 20);
      return {
        kind: 'input',
        text: `${a.name} ${a.e} עולה ${pa} ₪, ו${b.name} ${b.e} עולה ${pb} ₪. כמה ${g(p, 'ישלם', 'תשלם')} ${p.name} על שניהם?`,
        answer: pa + pb,
        hint: 'מחברים את שני המחירים.',
        explain: `${pa} + ${pb} = ${pa + pb} ₪`,
      };
    }
    const price = randInt(3, 45);
    const paid = [10, 20, 50].find((v) => v > price) ?? 50;
    return {
      kind: 'input',
      text: `${a.name} ${a.e} עולה ${price} ₪. ${p.name} ${g(p, 'שילם', 'שילמה')} ${paid === 10 ? 'במטבע' : 'בשטר'} של ${paid} ₪. כמה עודף ${g(p, 'יקבל', 'תקבל')}?`,
      visual: { type: 'money', items: [paid] },
      answer: paid - price,
      hint: `עודף = מה ששילמנו פחות המחיר: ${paid} ${MINUS} ${price}. אפשר לספור מ-${price} עד ${paid}.`,
      explain: `${paid} ${MINUS} ${price} = ${paid - price} ₪`,
    };
  },
};

export const moneyTopic: Topic = {
  id: 'g2-money',
  title: 'כסף',
  icon: '🪙',
  levels: [coins, notes, agorot, shop],
};
