import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';

const hourLabel = (h: number) => `${h}:00`;

function hourOptions(h: number) {
  const set = new Set<number>([h]);
  const near = shuffle([1, -1, 6, 2, -2]);
  for (const d of near) {
    if (set.size >= 4) break;
    set.add(((h - 1 + d + 12) % 12) + 1);
  }
  return shuffle([...set]).map((v) => ({ value: String(v), label: hourLabel(v) }));
}

const readHour: Level = {
  id: 'g1-clock-1',
  title: 'קוראים שעה שלמה',
  intro: {
    lines: ['המחוג **הארוך** מראה על 12 — זו שעה שלמה.', 'המחוג **הקצר** מראה איזו שעה.'],
    visual: { type: 'clock', hour: 3, minute: 0 },
  },
  generate: () => {
    const h = randInt(1, 12);
    return {
      kind: 'choice',
      text: 'מה השעה?',
      visual: { type: 'clock', hour: h, minute: 0 },
      options: hourOptions(h),
      answer: String(h),
      hint: 'הסתכל על המחוג הקצר. לאיזה מספר הוא מצביע?',
      explain: `המחוג הקצר מצביע על ${h}, והארוך על 12. השעה ${h}:00.`,
    };
  },
};

const setHour: Level = {
  id: 'g1-clock-2',
  title: 'מזיזים את המחוג',
  intro: {
    lines: ['גרור את המחוג הקצר אל המספר של השעה.', 'המחוג הארוך נשאר על 12.'],
    visual: { type: 'clock', hour: 8, minute: 0 },
  },
  generate: () => {
    const h = randInt(1, 12);
    return {
      kind: 'clock',
      text: `הזז את המחוג הקצר כך שהשעון יראה [[${hourLabel(h)}]].`,
      answer: { hour: h, minute: 0 },
      minuteStep: 60,
      hint: `המחוג הקצר צריך להצביע על המספר ${h}.`,
      explain: `בשעה ${h}:00 המחוג הקצר על ${h} והארוך על 12.`,
      explainVisual: { type: 'clock', hour: h, minute: 0 },
    };
  },
};

const ACTIVITIES = [
  { text: 'קמים בבוקר', h: 7 },
  { text: 'מתחילים את יום הלימודים', h: 8 },
  { text: 'אוכלים ארוחת צהריים', h: 1 },
  { text: 'הולכים לחוג', h: 4 },
  { text: 'אוכלים ארוחת ערב', h: 7 },
  { text: 'הולכים לישון', h: 8 },
];

const hourLater: Level = {
  id: 'g1-clock-3',
  title: 'עוד שעה',
  intro: {
    lines: ['בכל שעה המחוג הקצר זז מספר אחד קדימה.', 'אחרי 12 חוזרים ל-1.'],
    visual: { type: 'clock', hour: 4, minute: 0 },
  },
  generate: () => {
    const a = pick(ACTIVITIES);
    const later = randInt(1, 3);
    const h = ((a.h - 1 + later) % 12) + 1;
    const word = later === 1 ? 'שעה' : later === 2 ? 'שעתיים' : '3 שעות';
    return {
      kind: 'choice',
      text: `השעה ${a.h}:00 — ${a.text}. מה תהיה השעה בעוד ${word}?`,
      visual: { type: 'clock', hour: a.h, minute: 0 },
      options: hourOptions(h),
      answer: String(h),
      hint: `ספור ${later === 1 ? 'מספר אחד' : `${later} מספרים`} קדימה על השעון, החל מ-${a.h}.`,
      explain: `מ-${a.h}:00 עוד ${word} זה ${h}:00.`,
      explainVisual: { type: 'clock', hour: h, minute: 0 },
    };
  },
};

export const clockTopic: Topic = {
  id: 'g1-clock',
  title: 'השעון',
  icon: '🕐',
  levels: [readHour, setHour, hourLater],
};
