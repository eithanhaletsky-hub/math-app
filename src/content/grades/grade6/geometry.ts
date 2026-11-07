import type { Level, Topic } from '../../types';
import { pick, randInt } from '../../lib/random';

const r2 = (x: number) => Math.round(x * 100) / 100;

const radius: Level = {
  id: 'g6-geo-1',
  title: 'רדיוס וקוטר',
  intro: {
    lines: ['**רדיוס** — מהמרכז עד שפת המעגל.', '**קוטר** — מצד לצד דרך המרכז. קוטר = 2 × רדיוס.'],
    visual: { type: 'circle', show: 'd', value: 10, unit: 'ס"מ' },
  },
  generate: () => {
    const r = randInt(2, 25);
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        text: 'הרדיוס מסומן. מה הקוטר (בס"מ)?',
        visual: { type: 'circle', show: 'r', value: r, unit: 'ס"מ' },
        answer: 2 * r,
        hint: 'קוטר = פעמיים רדיוס.',
        explain: `2 × ${r} = ${2 * r} ס"מ`,
      };
    }
    return {
      kind: 'input',
      text: 'הקוטר מסומן. מה הרדיוס (בס"מ)?',
      visual: { type: 'circle', show: 'd', value: 2 * r, unit: 'ס"מ' },
      answer: r,
      hint: 'רדיוס = חצי מהקוטר.',
      explain: `${2 * r} : 2 = ${r} ס"מ`,
    };
  },
};

const circumference: Level = {
  id: 'g6-geo-2',
  title: 'היקף מעגל',
  intro: {
    lines: ['היקף מעגל = קוטר × π. נשתמש ב-[[π ≈ 3.14]].', 'קוטר 10 ס"מ → היקף ≈ [[10 × 3.14 = 31.4]] ס"מ.'],
    visual: { type: 'circle', show: 'd', value: 10, unit: 'ס"מ' },
  },
  generate: () => {
    const d = randInt(1, 20);
    const byRadius = Math.random() < 0.4 && d % 2 === 0;
    return {
      kind: 'input',
      text: 'מה היקף המעגל (בס"מ)? השתמש ב-π = 3.14.',
      visual: byRadius ? { type: 'circle', show: 'r', value: d / 2, unit: 'ס"מ' } : { type: 'circle', show: 'd', value: d, unit: 'ס"מ' },
      answer: r2(d * 3.14),
      decimal: true,
      hint: byRadius ? `קודם הקוטר: 2 × ${d / 2} = ${d}. ואז כפול 3.14.` : `${d} × 3.14`,
      explain: `${d} × 3.14 = ${r2(d * 3.14)} ס"מ`,
    };
  },
};

const circleArea: Level = {
  id: 'g6-geo-3',
  title: 'שטח עיגול',
  intro: {
    lines: ['שטח עיגול = רדיוס × רדיוס × π.', 'רדיוס 3 ס"מ → [[3 × 3 × 3.14 = 28.26]] סמ"ר.'],
    visual: { type: 'circle', show: 'r', value: 3, unit: 'ס"מ' },
  },
  generate: () => {
    const r = randInt(1, 10);
    return {
      kind: 'input',
      text: 'מה שטח העיגול (בסמ"ר)? השתמש ב-π = 3.14.',
      visual: { type: 'circle', show: 'r', value: r, unit: 'ס"מ' },
      answer: r2(r * r * 3.14),
      decimal: true,
      hint: `${r} × ${r} = ${r * r}. ואז כפול 3.14.`,
      explain: `${r * r} × 3.14 = ${r2(r * r * 3.14)} סמ"ר`,
    };
  },
};

const volume: Level = {
  id: 'g6-geo-4',
  title: 'נפח וקיבולת',
  intro: {
    lines: ['נפח תיבה = אורך × רוחב × גובה. נפח קובייה = צלע × צלע × צלע.', '1 ליטר = 1,000 סמ"ק.'],
    visual: { type: 'cuboid', l: 10, w: 10, h: 10, unit: 'ס"מ' },
  },
  generate: () => {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const a = randInt(2, 10);
      return {
        kind: 'input',
        text: `מה הנפח של קובייה שאורך הצלע שלה ${a} ס"מ (בסמ"ק)?`,
        visual: { type: 'cuboid', l: a, w: a, h: a, unit: 'ס"מ' },
        answer: a * a * a,
        hint: `${a} × ${a} × ${a}`,
        explain: `${a} × ${a} × ${a} = ${a ** 3} סמ"ק`,
      };
    }
    if (kind === 1) {
      const l = randInt(2, 12);
      const w = randInt(2, 8);
      const v = l * w * randInt(2, 10);
      const h = v / (l * w);
      return {
        kind: 'input',
        text: `נפח התיבה ${v} סמ"ק. האורך ${l} ס"מ והרוחב ${w} ס"מ. מה הגובה?`,
        answer: h,
        hint: `שטח הבסיס: ${l} × ${w} = ${l * w}. כמה פעמים הוא נכנס בנפח?`,
        explain: `${v} : ${l * w} = ${h} ס"מ`,
      };
    }
    const l = pick([10, 20, 25, 30, 40, 50]);
    const w = pick([10, 20]);
    const h = pick([10, 20, 30]);
    const v = l * w * h;
    return {
      kind: 'input',
      text: `אקווריום בצורת תיבה: ${l} × ${w} × ${h} ס"מ. כמה ליטר מים הוא מכיל?`,
      visual: { type: 'cuboid', l, w, h, unit: 'ס"מ' },
      answer: v / 1000,
      decimal: true,
      hint: `הנפח: ${l} × ${w} × ${h} = ${v} סמ"ק. כל 1,000 סמ"ק = ליטר.`,
      explain: `${v} : 1,000 = ${v / 1000} ליטר`,
    };
  },
};

export const geometryTopic: Topic = {
  id: 'g6-geo',
  title: 'מעגל ונפח',
  icon: '⭕',
  levels: [radius, circumference, circleArea, volume],
};
