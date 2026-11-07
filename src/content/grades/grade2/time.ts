import type { Level, Option, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';

const fmt = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;

function timeOptions(h: number, m: number, step: number): Option[] {
  const set = new Map<string, string>();
  const add = (hh: number, mm: number) => {
    const H = ((hh - 1 + 12) % 12) + 1;
    set.set(fmt(H, mm), fmt(H, mm));
  };
  add(h, m);
  const tries = shuffle([
    [h + 1, m], // classic: reading the hour hand that already passed
    [h - 1, m],
    [h, (m + 30) % 60],
    [h, (m + step) % 60],
    [m / 5 || 12, h * 5 === 60 ? 0 : (h * 5) % 60], // swapped hands
  ]);
  for (const [hh, mm] of tries) {
    if (set.size >= 4) break;
    add(hh, mm);
  }
  return shuffle([...set.keys()]).map((k) => ({ value: k, label: k }));
}

function readLevel(id: string, title: string, minutes: number[], lines: string[], hint: string): Level {
  return {
    id,
    title,
    intro: { lines, visual: { type: 'clock', hour: 2, minute: minutes[minutes.length - 1] } },
    generate: () => {
      const h = randInt(1, 12);
      const m = pick(minutes);
      return {
        kind: 'choice',
        text: 'מה השעה?',
        visual: { type: 'clock', hour: h, minute: m },
        options: timeOptions(h, m, minutes.length > 2 ? 15 : 30),
        answer: fmt(h, m),
        hint,
        explain: `המחוג הקצר אחרי ${h}, והארוך על ${m === 0 ? '12' : m / 5}. השעה ${fmt(h, m)}.`,
      };
    },
  };
}

function setLevel(id: string, title: string, minutes: number[], step: number, lines: string[]): Level {
  return {
    id,
    title,
    intro: { lines, visual: { type: 'clock', hour: 5, minute: minutes[minutes.length - 1] } },
    generate: () => {
      const h = randInt(1, 12);
      const m = pick(minutes);
      return {
        kind: 'clock',
        text: `הזז את המחוגים כך שהשעון יראה [[${fmt(h, m)}]].`,
        answer: { hour: h, minute: m },
        minuteStep: step,
        hint: `קודם המחוג הארוך: ${m === 0 ? 'על 12' : `על ${m / 5}`}. אחר כך המחוג הקצר: על ${h}.`,
        explain: `בשעה ${fmt(h, m)} הארוך מצביע על ${m === 0 ? 12 : m / 5} והקצר על ${h}${m ? ' (קצת אחריו)' : ''}.`,
        explainVisual: { type: 'clock', hour: h, minute: m },
      };
    },
  };
}

const readHalf = readLevel(
  'g2-time-1',
  'חצי שעה',
  [0, 30],
  ['כשהמחוג הארוך על 6 — עברה חצי שעה: [[2:30]] ("שתיים וחצי").', 'המחוג הקצר נמצא אז באמצע, בין 2 ל-3.'],
  'המחוג הארוך על 6? זו חצי שעה. המחוג הקצר בין שני מספרים — השעה היא המספר שהוא **כבר עבר**.',
);
const setHalf = setLevel('g2-time-2', 'מכוונים חצי שעה', [0, 30], 30, [
  'גרור את המחוג הארוך (כחול) ל-12 או ל-6.',
  'ואת המחוג הקצר (אדום) לשעה.',
]);
const readQuarter = readLevel(
  'g2-time-3',
  'רבע שעה',
  [0, 15, 30, 45],
  ['ארוך על 3 = רבע שעה אחרי: [[4:15]] ("ארבע ורבע").', 'ארוך על 9 = 45 דקות: [[4:45]] ("רבע לחמש").'],
  'ארוך על 3 — 15 דקות. על 6 — 30. על 9 — 45.',
);
const setQuarter = setLevel('g2-time-4', 'מכוונים רבע שעה', [0, 15, 30, 45], 15, [
  'המחוג הארוך: 3 = 15 דקות, 6 = 30, 9 = 45.',
  'כל מספר בשעון = 5 דקות.',
]);

const durations: Level = {
  id: 'g2-time-5',
  title: 'כמה זמן עבר?',
  intro: {
    lines: ['בשעה יש 60 דקות. חצי שעה = 30 דקות. רבע שעה = 15 דקות.'],
  },
  generate: () => {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const h = randInt(1, 3);
      return {
        kind: 'input',
        text: `כמה דקות יש ב-${h === 1 ? 'שעה אחת' : h === 2 ? 'שעתיים' : '3 שעות'}?`,
        answer: h * 60,
        hint: 'בכל שעה 60 דקות.',
        explain: `${h} × 60 = ${h * 60} דקות.`,
      };
    }
    const start = randInt(1, 9);
    const dur = pick([30, 60, 90, 120]);
    const endH = start + Math.floor(dur / 60);
    const endM = dur % 60;
    return {
      kind: 'choice',
      text: `החוג מתחיל ב-[[${fmt(start, 0)}]] ונגמר ב-[[${fmt(endH, endM)}]]. כמה זמן הוא נמשך?`,
      options: [
        { value: '30', label: 'חצי שעה' },
        { value: '60', label: 'שעה' },
        { value: '90', label: 'שעה וחצי' },
        { value: '120', label: 'שעתיים' },
      ],
      answer: String(dur),
      hint: `ספור שעות שלמות מ-${start}:00, ואז בדוק אם נשארה עוד חצי שעה.`,
      explain: `מ-${fmt(start, 0)} עד ${fmt(endH, endM)} עברו ${dur} דקות.`,
    };
  },
};

const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

const months: Level = {
  id: 'g2-time-6',
  title: 'חודשי השנה',
  intro: {
    lines: ['בשנה יש 12 חודשים, מינואר עד דצמבר.', 'בשבוע 7 ימים, ובחודש בערך 30 ימים.'],
  },
  generate: () => {
    const kind = randInt(0, 2);
    if (kind === 2) {
      const q = pick([
        { t: 'כמה חודשים יש בשנה?', a: 12, o: [7, 10, 12, 30] },
        { t: 'כמה ימים יש בשבוע?', a: 7, o: [5, 7, 10, 12] },
        { t: 'כמה ימים יש בערך בחודש?', a: 30, o: [7, 12, 30, 100] },
      ]);
      return {
        kind: 'choice',
        text: q.t,
        options: q.o.map((n) => ({ value: String(n), label: String(n) })),
        answer: String(q.a),
        hint: 'שבוע < חודש < שנה.',
        explain: `התשובה: ${q.a}.`,
      };
    }
    const i = randInt(0, 11);
    const ans = kind === 0 ? (i + 1) % 12 : (i + 11) % 12;
    const set = new Set([ans, (ans + 1) % 12, (ans + 11) % 12, (ans + 2) % 12]);
    return {
      kind: 'choice',
      text: kind === 0 ? `איזה חודש בא **אחרי** ${MONTHS[i]}?` : `איזה חודש בא **לפני** ${MONTHS[i]}?`,
      options: [...set].map((m) => ({ value: String(m), label: MONTHS[m] })),
      answer: String(ans),
      hint: 'אמור את החודשים לפי הסדר: ינואר, פברואר, מרץ…',
      explain: `${kind === 0 ? 'אחרי' : 'לפני'} ${MONTHS[i]} בא ${MONTHS[ans]}.`,
    };
  },
};

export const timeTopic: Topic = {
  id: 'g2-time',
  title: 'זמן',
  icon: '⏰',
  levels: [readHalf, setHalf, readQuarter, setQuarter, durations, months],
};
