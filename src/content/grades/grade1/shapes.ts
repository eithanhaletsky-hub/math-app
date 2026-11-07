import type { Level, ShapeName, Topic } from '../../types';
import { pick, shuffle } from '../../lib/random';

const SHAPES: { shape: ShapeName; name: string; sides: number }[] = [
  { shape: 'triangle', name: 'משולש', sides: 3 },
  { shape: 'square', name: 'ריבוע', sides: 4 },
  { shape: 'rectangle', name: 'מלבן', sides: 4 },
  { shape: 'circle', name: 'עיגול', sides: 0 },
];

/**
 * A square is also a rectangle, so never show both as options in the same
 * question — otherwise there would be two correct answers.
 */
function optionShapes(target: ShapeName) {
  return shuffle(
    SHAPES.filter((s) => !(target === 'square' && s.shape === 'rectangle') && !(target === 'rectangle' && s.shape === 'square')),
  );
}

const COLORS =['#ff6b6b', '#4dabf7', '#51cf66', '#fcc419', '#cc5de8', '#ff922b'];

const nameShape: Level = {
  id: 'g1-shapes-1',
  title: 'איך קוראים לצורה?',
  intro: {
    lines: ['למשולש יש 3 צלעות. לריבוע ולמלבן יש 4.', 'לעיגול אין פינות בכלל.'],
    visual: { type: 'shape', shape: 'triangle' },
  },
  generate: () => {
    const s = pick(SHAPES);
    return {
      kind: 'choice',
      text: 'איך קוראים לצורה הזאת?',
      visual: { type: 'shape', shape: s.shape, color: pick(COLORS) },
      options: optionShapes(s.shape).map((x) => ({ value: x.shape, label: x.name })),
      answer: s.shape,
      hint:
        s.sides === 0
          ? 'יש לה פינות? אם אין — חשוב על צורה עגולה.'
          : 'ספור את הצלעות (הקווים הישרים). כמה יש?',
      explain:
        s.shape === 'square'
          ? 'זה ריבוע: 4 צלעות, וכולן שוות באורכן.'
          : s.shape === 'rectangle'
            ? 'זה מלבן: 4 צלעות — שתיים ארוכות ושתיים קצרות.'
            : s.shape === 'triangle'
              ? 'זה משולש: 3 צלעות ו-3 פינות.'
              : 'זה עיגול: אין לו צלעות ופינות.',
    };
  },
};

const findShape: Level = {
  id: 'g1-shapes-2',
  title: 'מצא את הצורה',
  intro: {
    lines: ['צורה יכולה להיות גדולה או קטנה, בכל צבע.', 'מה שקובע הוא מספר הצלעות והפינות.'],
    visual: { type: 'shape', shape: 'rectangle' },
  },
  generate: () => {
    const target = pick(SHAPES);
    return {
      kind: 'choice',
      text: `איזו צורה היא **${target.name}**?`,
      options: optionShapes(target.shape).map((x) => ({
        value: x.shape,
        label: x.name,
        visual: { type: 'shape', shape: x.shape, color: pick(COLORS) },
      })),
      optionsLayout: 'grid',
      answer: target.shape,
      hint: target.sides ? `ל${target.name} יש ${target.sides} צלעות.` : 'חפש צורה עגולה בלי פינות.',
      explain: `זה ה${target.name}.`,
      explainVisual: { type: 'shape', shape: target.shape },
    };
  },
};

const MORE = [
  ...SHAPES.filter((s) => s.sides > 0),
  { shape: 'pentagon' as const, name: 'מחומש', sides: 5 },
  { shape: 'hexagon' as const, name: 'משושה', sides: 6 },
];

const countSides: Level = {
  id: 'g1-shapes-3',
  title: 'סופרים צלעות',
  intro: {
    lines: ['צלע היא קו ישר בצורה.', 'פינה היא המקום שבו שתי צלעות נפגשות.'],
    visual: { type: 'shape', shape: 'pentagon' },
  },
  generate: () => {
    const s = pick(MORE);
    const corners = Math.random() < 0.5;
    return {
      kind: 'choice',
      text: corners ? 'כמה פינות יש לצורה?' : 'כמה צלעות יש לצורה?',
      visual: { type: 'shape', shape: s.shape, color: pick(COLORS) },
      options: [3, 4, 5, 6].map((n) => ({ value: String(n), label: String(n) })),
      answer: String(s.sides),
      hint: 'התחל מפינה אחת, וספור סביב הצורה עד שתחזור אליה.',
      explain: `ל${s.name} יש ${s.sides} צלעות ו-${s.sides} פינות.`,
    };
  },
};

export const shapesTopic: Topic = {
  id: 'g1-shapes',
  title: 'צורות',
  icon: '🔺',
  levels: [nameShape, findShape, countSides],
};
