import type { Level, Option, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { MINUS } from '../../lib/things';

const conversions: Level = {
  id: 'g3-meas-1',
  title: 'יחידות מידה',
  intro: {
    lines: ['1 ק"מ = 1,000 מטר.  1 ק"ג = 1,000 גרם.  1 ליטר = 1,000 מ"ל.', '1 מטר = 100 ס"מ.'],
  },
  generate: () => {
    const conv = pick([
      { big: 'ק"מ', small: 'מטר', k: 1000 },
      { big: 'ק"ג', small: 'גרם', k: 1000 },
      { big: 'ליטר', small: 'מ"ל', k: 1000 },
      { big: 'מטר', small: 'ס"מ', k: 100 },
    ]);
    if (Math.random() < 0.5) {
      const n = randInt(1, 9);
      return {
        kind: 'input',
        text: `${n} ${conv.big} = כמה ${conv.small}?`,
        answer: n * conv.k,
        hint: `ב-1 ${conv.big} יש ${conv.k} ${conv.small}.`,
        explain: `${n} × ${conv.k} = ${n * conv.k} ${conv.small}`,
      };
    }
    // half / mixed
    const n = randInt(1, 4);
    const half = conv.k / 2;
    return {
      kind: 'input',
      text: `${n} ${conv.big} וחצי = כמה ${conv.small}?`,
      answer: n * conv.k + half,
      hint: `חצי ${conv.big} = ${half} ${conv.small}.`,
      explain: `${n * conv.k} + ${half} = ${n * conv.k + half} ${conv.small}`,
    };
  },
};

const THINGS = [
  { t: 'תפוח', ans: '200 גרם', opts: ['2 גרם', '200 גרם', '20 ק"ג'] },
  { t: 'ילד בכיתה ג\'', ans: '30 ק"ג', opts: ['3 ק"ג', '30 ק"ג', '300 ק"ג'] },
  { t: 'בקבוק מים קטן', ans: '500 מ"ל', opts: ['5 מ"ל', '500 מ"ל', '50 ליטר'] },
  { t: 'דלי', ans: '10 ליטר', opts: ['10 מ"ל', '10 ליטר', '1,000 ליטר'] },
  { t: 'הדרך מהבית לבית הספר', ans: '1 ק"מ', opts: ['1 ס"מ', '1 מטר', '1 ק"מ'] },
  { t: 'גובה של דלת', ans: '2 מטר', opts: ['2 ס"מ', '2 מטר', '2 ק"מ'] },
  { t: 'כפית', ans: '5 מ"ל', opts: ['5 מ"ל', '5 ליטר', '50 ליטר'] },
];

const estimate: Level = {
  id: 'g3-meas-2',
  title: 'הערכה',
  intro: { lines: ['לפני שמודדים — מעריכים: מה הגיוני?'] },
  generate: () => {
    const x = pick(THINGS);
    return {
      kind: 'choice',
      text: `מה הגיוני יותר? ${x.t}:`,
      options: shuffle(x.opts).map((o): Option => ({ value: o, label: o })),
      answer: x.ans,
      hint: 'דמיין את הדבר בידיים שלך. האם זה כבד? קל? ארוך? קצר?',
      explain: `${x.t} — בערך ${x.ans}.`,
    };
  },
};

const fmt = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;

const clock5: Level = {
  id: 'g3-meas-3',
  title: 'שעון — כל 5 דקות',
  intro: {
    lines: ['כל מספר בשעון = 5 דקות למחוג הארוך.', 'מחוג ארוך על 4 → 20 דקות. על 7 → 35 דקות.'],
    visual: { type: 'clock', hour: 3, minute: 35 },
  },
  generate: () => {
    const h = randInt(1, 12);
    const m = randInt(1, 11) * 5;
    if (Math.random() < 0.5) {
      return {
        kind: 'clock',
        text: `כוון את השעון ל-[[${fmt(h, m)}]].`,
        answer: { hour: h, minute: m },
        minuteStep: 5,
        hint: `המחוג הארוך: ${m} דקות = המספר ${m / 5}. המחוג הקצר: על ${h} (או קצת אחריו).`,
        explain: `ארוך על ${m / 5}, קצר בין ${h} ל-${(h % 12) + 1}.`,
        explainVisual: { type: 'clock', hour: h, minute: m },
      };
    }
    const wrong = [fmt(h, m), fmt((h % 12) + 1, m), fmt(h, (m / 5) % 12 === 0 ? 0 : m / 5), fmt(h, (60 - m) % 60)];
    const opts = [...new Set(wrong)];
    return {
      kind: 'choice',
      text: 'מה השעה?',
      visual: { type: 'clock', hour: h, minute: m },
      options: shuffle(opts).map((o) => ({ value: o, label: o })),
      answer: fmt(h, m),
      hint: 'כפול 5 את המספר שעליו מצביע המחוג הארוך.',
      explain: `ארוך על ${m / 5} → ${m} דקות. השעה ${fmt(h, m)}.`,
    };
  },
};

const elapsed: Level = {
  id: 'g3-meas-4',
  title: 'כמה זמן עבר?',
  intro: { lines: ['סופרים קודם עד השעה העגולה, ואז ממשיכים.', 'מ-[[3:40]] עד [[4:10]]: 20 דקות עד 4:00, ועוד 10 = 30 דקות.'] },
  generate: () => {
    const h = randInt(1, 10);
    const m1 = randInt(1, 11) * 5;
    const dur = randInt(2, 11) * 5;
    const total = h * 60 + m1 + dur;
    const h2 = Math.floor(total / 60);
    const m2 = total % 60;
    return {
      kind: 'input',
      text: `ההפסקה מתחילה ב-[[${fmt(h, m1)}]] ונגמרת ב-[[${fmt(h2, m2)}]]. כמה דקות היא נמשכת?`,
      answer: dur,
      hint: h2 > h ? `מ-${fmt(h, m1)} עד ${fmt(h2, 0)} — ${60 - m1} דקות. ועוד ${m2}.` : `${m2} ${MINUS} ${m1}`,
      explain: `${dur} דקות.`,
    };
  },
};

export const measureTopic: Topic = {
  id: 'g3-meas',
  title: 'מדידות וזמן',
  icon: '⚖️',
  levels: [conversions, estimate, clock5, elapsed],
};
