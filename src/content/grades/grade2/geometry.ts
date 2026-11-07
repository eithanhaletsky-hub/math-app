import type { Level, ShapeName, SolidName, Topic } from '../../types';
import { pick, shuffle } from '../../lib/random';

const SOLIDS: { solid: SolidName; name: string; faces: number; rolls: boolean; flat: boolean }[] = [
  { solid: 'cube', name: 'קובייה', faces: 6, rolls: false, flat: true },
  { solid: 'box', name: 'תיבה', faces: 6, rolls: false, flat: true },
  { solid: 'cylinder', name: 'גליל', faces: 3, rolls: true, flat: true },
  { solid: 'cone', name: 'חרוט', faces: 2, rolls: true, flat: true },
  { solid: 'sphere', name: 'כדור', faces: 1, rolls: true, flat: false },
  { solid: 'pyramid', name: 'פירמידה', faces: 5, rolls: false, flat: true },
];
/** A cube is also a box — never offer both, or there would be two right answers. */
const cubeBox = (a: SolidName, b: SolidName) => (a === 'cube' && b === 'box') || (a === 'box' && b === 'cube');

const COLORS = ['#74c0fc', '#ffa8a8', '#8ce99a', '#ffe066', '#d0bfff'];

const nameSolid: Level = {
  id: 'g2-geo-1',
  title: 'גופים',
  intro: {
    lines: ['גוף הוא צורה "תלת-ממדית" — אפשר להחזיק אותו ביד.', 'קובייה, תיבה, גליל, חרוט, כדור ופירמידה.'],
    visual: { type: 'solid', solid: 'cube' },
  },
  generate: () => {
    const s = pick(SOLIDS);
    const others = shuffle(SOLIDS.filter((x) => x.solid !== s.solid && !cubeBox(s.solid, x.solid))).slice(0, 3);
    return {
      kind: 'choice',
      text: 'איך קוראים לגוף הזה?',
      visual: { type: 'solid', solid: s.solid, color: pick(COLORS) },
      options: shuffle([s, ...others]).map((x) => ({ value: x.solid, label: x.name })),
      answer: s.solid,
      hint:
        s.solid === 'cube' || s.solid === 'box'
          ? 'לקובייה כל הפאות ריבועים שווים. לתיבה יש פאות מלבניות.'
          : 'בדוק: יש לו קצה חד? בסיס עגול? פאות ישרות?',
      explain: `זה ${s.name}.`,
    };
  },
};

const findSolid: Level = {
  id: 'g2-geo-2',
  title: 'מצא את הגוף',
  intro: {
    lines: ['כדור, גליל וחרוט יכולים להתגלגל — יש להם צד עגול.', 'קובייה, תיבה ופירמידה לא מתגלגלות.'],
    visual: { type: 'solid', solid: 'cylinder' },
  },
  generate: () => {
    if (Math.random() < 0.5) {
      const s = pick(SOLIDS);
      const others = shuffle(SOLIDS.filter((x) => x.solid !== s.solid && !cubeBox(s.solid, x.solid))).slice(0, 3);
      return {
        kind: 'choice',
        text: `איזה מהם הוא **${s.name}**?`,
        options: shuffle([s, ...others]).map((x) => ({
          value: x.solid,
          label: x.name,
          visual: { type: 'solid', solid: x.solid, color: pick(COLORS) },
        })),
        optionsLayout: 'grid',
        answer: s.solid,
        hint: 'חשוב איך הגוף נראה מהצד ומלמעלה.',
        explain: `זה ה${s.name}.`,
        explainVisual: { type: 'solid', solid: s.solid },
      };
    }
    const roller = pick(SOLIDS.filter((s) => s.rolls));
    const others = shuffle(SOLIDS.filter((s) => !s.rolls)).slice(0, 3);
    return {
      kind: 'choice',
      text: 'איזה גוף יכול **להתגלגל**?',
      options: shuffle([roller, ...others]).map((x) => ({
        value: x.solid,
        label: x.name,
        visual: { type: 'solid', solid: x.solid, color: pick(COLORS) },
      })),
      optionsLayout: 'grid',
      answer: roller.solid,
      hint: 'מה שמתגלגל — יש לו צד עגול.',
      explain: `ה${roller.name} מתגלגל כי יש לו צד עגול.`,
    };
  },
};

const faces: Level = {
  id: 'g2-geo-3',
  title: 'פאות',
  intro: {
    lines: ['פאה = משטח שטוח של גוף.', 'לקובייה 6 פאות ריבועיות — כמו קוביית משחק.'],
    visual: { type: 'solid', solid: 'cube' },
  },
  generate: () => {
    const s = pick(SOLIDS.filter((x) => ['cube', 'box', 'pyramid'].includes(x.solid)));
    return {
      kind: 'choice',
      text: `כמה פאות יש ל${s.name}?`,
      visual: { type: 'solid', solid: s.solid, color: pick(COLORS) },
      options: [4, 5, 6, 8].map((n) => ({ value: String(n), label: String(n) })),
      answer: String(s.faces),
      hint: 'אל תשכח את הפאות שמאחור ולמטה, שלא רואים בציור.',
      explain:
        s.solid === 'pyramid'
          ? 'לפירמידה בסיס ריבועי ו-4 פאות משולשות — ביחד 5.'
          : `ל${s.name} 6 פאות: למעלה, למטה, מקדימה, מאחור, ימין ושמאל.`,
    };
  },
};

const POLYGONS: { shape: ShapeName; name: string; sides: number }[] = [
  { shape: 'triangle', name: 'משולש', sides: 3 },
  { shape: 'rectangle', name: 'מרובע', sides: 4 },
  { shape: 'rhombus', name: 'מרובע', sides: 4 },
  { shape: 'pentagon', name: 'מחומש', sides: 5 },
  { shape: 'hexagon', name: 'משושה', sides: 6 },
];

const polygons: Level = {
  id: 'g2-geo-4',
  title: 'מצולעים',
  intro: {
    lines: ['שם המצולע מספר כמה צלעות יש לו:', 'משולש — 3, מרובע — 4, מחומש — 5, משושה — 6.'],
    visual: { type: 'shape', shape: 'hexagon' },
  },
  generate: () => {
    const s = pick(POLYGONS);
    const names = ['משולש', 'מרובע', 'מחומש', 'משושה'];
    return {
      kind: 'choice',
      text: 'איך קוראים למצולע הזה?',
      visual: { type: 'shape', shape: s.shape, color: pick(COLORS) },
      options: names.map((n) => ({ value: n, label: n })),
      answer: s.name,
      hint: 'ספור את הצלעות.',
      explain: `יש לו ${s.sides} צלעות — ${s.name}.`,
    };
  },
};

export const geometryTopic: Topic = {
  id: 'g2-geo',
  title: 'גופים וצורות',
  icon: '🧊',
  levels: [nameSolid, findSolid, faces, polygons],
};
