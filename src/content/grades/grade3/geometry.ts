import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { MINUS } from '../../lib/things';

const perimeterPolygon: Level = {
  id: 'g3-geo-1',
  title: 'היקף',
  intro: {
    lines: ['**היקף** = האורך של כל הקו מסביב לצורה.', 'מחברים את אורכי כל הצלעות.'],
    visual: { type: 'polygon', sides: [3, 4, 5], unit: 'ס"מ' },
  },
  generate: () => {
    const n = pick([3, 4, 5, 6]);
    const sides = Array.from({ length: n }, () => randInt(2, 12));
    const sum = sides.reduce((a, b) => a + b, 0);
    return {
      kind: 'input',
      text: 'מה ההיקף של המצולע (בס"מ)?',
      visual: { type: 'polygon', sides, unit: 'ס"מ' },
      answer: sum,
      hint: `חבר את כל ${n} הצלעות. אל תדלג על אף אחת!`,
      explain: `${sides.join(' + ')} = ${sum} ס"מ`,
    };
  },
};

const perimeterRect: Level = {
  id: 'g3-geo-2',
  title: 'היקף מלבן וריבוע',
  intro: {
    lines: ['במלבן יש שני זוגות של צלעות שוות.', 'היקף = אורך + רוחב + אורך + רוחב. בריבוע: 4 × צלע.'],
    visual: { type: 'rect', w: 6, h: 3, unit: 'ס"מ' },
  },
  generate: () => {
    const square = Math.random() < 0.3;
    const w = randInt(2, 15);
    const h = square ? w : randInt(1, 10);
    if (Math.random() < 0.7) {
      return {
        kind: 'input',
        text: `מה ההיקף של ה${square ? 'ריבוע' : 'מלבן'} (בס"מ)?`,
        visual: { type: 'rect', w, h, unit: 'ס"מ' },
        answer: 2 * (w + h),
        hint: square ? `לריבוע 4 צלעות שוות: 4 × ${w}.` : `יש 2 צלעות של ${w} ו-2 צלעות של ${h}.`,
        explain: square ? `4 × ${w} = ${4 * w} ס"מ` : `${w} + ${h} + ${w} + ${h} = ${2 * (w + h)} ס"מ`,
      };
    }
    // missing side
    const P = 2 * (w + h);
    return {
      kind: 'input',
      text: `היקף המלבן הוא ${P} ס"מ. מה אורך הצלע החסרה?`,
      visual: { type: 'rect', w, h, unit: 'ס"מ', hideH: true },
      answer: h,
      hint: `שתי הצלעות הארוכות: ${w} + ${w} = ${2 * w}. כמה נשאר לשתי האחרות?`,
      explain: `${P} ${MINUS} ${2 * w} = ${P - 2 * w}, ולכל צלע: ${P - 2 * w} : 2 = ${h}.`,
    };
  },
};

const rightAngle: Level = {
  id: 'g3-geo-3',
  title: 'זווית ישרה',
  intro: {
    lines: ['זווית ישרה — כמו פינה של דף.', 'זווית **חדה** — קטנה ממנה. זווית **קהה** — גדולה ממנה.'],
    visual: { type: 'angle', deg: 90 },
  },
  generate: () => {
    const kind = pick(['acute', 'right', 'obtuse'] as const);
    const deg = kind === 'right' ? 90 : kind === 'acute' ? randInt(25, 70) : randInt(110, 160);
    return {
      kind: 'choice',
      text: 'איזו זווית זו?',
      visual: { type: 'angle', deg, rotate: pick([0, 0, 15, -10, 30]) },
      options: [
        { value: 'acute', label: 'חדה' },
        { value: 'right', label: 'ישרה' },
        { value: 'obtuse', label: 'קהה' },
      ],
      answer: kind,
      hint: 'דמיין פינה של דף בתוך הזווית. האם היא בדיוק מתאימה? צרה יותר? רחבה יותר?',
      explain: kind === 'right' ? 'זו זווית ישרה — בדיוק כמו פינת דף.' : kind === 'acute' ? 'זו זווית חדה — צרה מפינת דף.' : 'זו זווית קהה — רחבה מפינת דף.',
    };
  },
};

const findRight: Level = {
  id: 'g3-geo-4',
  title: 'מצא את הזווית הישרה',
  intro: { lines: ['בריבוע ובמלבן כל 4 הזוויות ישרות.'] , visual: { type: 'rect', w: 5, h: 3 } },
  generate: () => {
    const degs = shuffle([90, randInt(30, 65), randInt(115, 150), randInt(68, 80)]);
    return {
      kind: 'choice',
      text: 'איזו מהזוויות היא **ישרה**?',
      options: degs.map((d, i) => ({ value: String(d), label: `זווית ${i + 1}`, visual: { type: 'angle', deg: d } })),
      optionsLayout: 'grid',
      answer: '90',
      hint: 'זווית ישרה נראית כמו האות L.',
      explain: 'הזווית הישרה היא זו שנראית כמו פינת דף.',
      explainVisual: { type: 'angle', deg: 90 },
    };
  },
};

export const geometryTopic: Topic = {
  id: 'g3-geo',
  title: 'היקף וזוויות',
  icon: '📐',
  levels: [perimeterPolygon, perimeterRect, rightAngle, findRight],
};
