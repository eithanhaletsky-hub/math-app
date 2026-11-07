import type { Level, ShapeName, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';

const countSquares: Level = {
  id: 'g4-geo-1',
  title: 'מהו שטח?',
  intro: {
    lines: ['**שטח** = כמה משבצות מכסות את הצורה.', 'מלבן של 4 שורות ו-6 עמודות: [[4 × 6 = 24]] משבצות.'],
    visual: { type: 'rect', w: 6, h: 4, grid: true },
  },
  generate: () => {
    const w = randInt(2, 9);
    const h = randInt(2, 6);
    return {
      kind: 'input',
      text: 'כמה משבצות יש במלבן? (זה השטח שלו)',
      visual: { type: 'rect', w, h, grid: true },
      answer: w * h,
      hint: `ספור משבצות בשורה אחת (${w}), ואז כמה שורות יש (${h}).`,
      explain: `${h} שורות × ${w} משבצות = ${w * h}`,
    };
  },
};

const rectArea: Level = {
  id: 'g4-geo-2',
  title: 'שטח מלבן',
  intro: {
    lines: ['שטח מלבן = אורך × רוחב.', 'יחידת השטח: סמ"ר (סנטימטר רבוע) — ריבוע שכל צלע שלו 1 ס"מ.'],
    visual: { type: 'rect', w: 7, h: 3, unit: 'ס"מ' },
  },
  generate: () => {
    const w = randInt(3, 15);
    const h = randInt(2, 10);
    if (Math.random() < 0.65) {
      return {
        kind: 'input',
        text: 'מה השטח של המלבן (בסמ"ר)?',
        visual: { type: 'rect', w, h, unit: 'ס"מ' },
        answer: w * h,
        hint: `שטח = אורך × רוחב = ${w} × ${h}.`,
        explain: `${w} × ${h} = ${w * h} סמ"ר`,
      };
    }
    return {
      kind: 'input',
      text: `שטח המלבן ${w * h} סמ"ר. מה אורך הצלע החסרה (בס"מ)?`,
      visual: { type: 'rect', w, h, unit: 'ס"מ', hideH: true },
      answer: h,
      hint: `${w} × ? = ${w * h}. כלומר ${w * h} : ${w}.`,
      explain: `${w * h} : ${w} = ${h} ס"מ`,
    };
  },
};

const areaVsPerimeter: Level = {
  id: 'g4-geo-3',
  title: 'שטח או היקף?',
  intro: {
    lines: ['**היקף** — הקו מסביב (מחברים צלעות).', '**שטח** — מה שבפנים (אורך × רוחב).'],
    visual: { type: 'rect', w: 5, h: 3, unit: 'ס"מ', grid: true },
  },
  generate: () => {
    const w = randInt(2, 12);
    const h = randInt(2, 8);
    const area = Math.random() < 0.5;
    if (Math.random() < 0.4) {
      const sit = pick([
        { t: 'כמה גדר צריך כדי להקיף גינה?', a: 'perimeter' },
        { t: 'כמה דשא צריך כדי לכסות גינה?', a: 'area' },
        { t: 'כמה שטיח צריך לרצפת החדר?', a: 'area' },
        { t: 'כמה סרט צריך כדי לקשט את המסגרת של תמונה?', a: 'perimeter' },
        { t: 'כמה אריחים צריך לקיר?', a: 'area' },
      ]);
      return {
        kind: 'choice',
        text: sit.t,
        options: [
          { value: 'area', label: 'שטח' },
          { value: 'perimeter', label: 'היקף' },
        ],
        answer: sit.a,
        hint: 'מסביב — היקף. מכסים את הפנים — שטח.',
        explain: sit.a === 'area' ? 'מכסים את כל הפנים — שטח.' : 'הולכים מסביב — היקף.',
      };
    }
    return {
      kind: 'input',
      text: area ? 'מה **השטח** (בסמ"ר)?' : 'מה **ההיקף** (בס"מ)?',
      visual: { type: 'rect', w, h, unit: 'ס"מ' },
      answer: area ? w * h : 2 * (w + h),
      hint: area ? `שטח = ${w} × ${h}` : `היקף = ${w} + ${h} + ${w} + ${h}`,
      explain: area ? `${w} × ${h} = ${w * h} סמ"ר` : `${2 * (w + h)} ס"מ`,
    };
  },
};

const compoundArea: Level = {
  id: 'g4-geo-4',
  title: 'שטח של צורה מורכבת',
  intro: {
    lines: ['צורה מורכבת מפרקים לשני מלבנים,', 'מחשבים את השטח של כל אחד — ומחברים.'],
  },
  generate: () => {
    const w1 = randInt(3, 9);
    const h1 = randInt(2, 6);
    const w2 = randInt(2, 8);
    const h2 = randInt(2, 6);
    return {
      kind: 'input',
      text: `צורה בנויה ממלבן של ${w1} × ${h1} ס"מ וממלבן של ${w2} × ${h2} ס"מ שצמודים זה לזה. מה השטח של כל הצורה (בסמ"ר)?`,
      answer: w1 * h1 + w2 * h2,
      hint: `${w1} × ${h1} = ? ו-${w2} × ${h2} = ? — ואז חבר.`,
      explain: `${w1 * h1} + ${w2 * h2} = ${w1 * h1 + w2 * h2} סמ"ר`,
    };
  },
};

const angleTypes: Level = {
  id: 'g4-geo-5',
  title: 'סוגי זוויות',
  intro: {
    lines: ['חדה: פחות מ-90°. ישרה: בדיוק 90°. קהה: בין 90° ל-180°.', 'שטוחה: בדיוק 180° — קו ישר.'],
    visual: { type: 'angle', deg: 120 },
  },
  generate: () => {
    if (Math.random() < 0.5) {
      const kind = pick(['acute', 'right', 'obtuse', 'straight'] as const);
      const deg = kind === 'right' ? 90 : kind === 'straight' ? 180 : kind === 'acute' ? randInt(20, 75) : randInt(105, 165);
      return {
        kind: 'choice',
        text: 'איזו זווית זו?',
        visual: { type: 'angle', deg, rotate: kind === 'straight' ? 0 : pick([0, 10, 20]) },
        options: [
          { value: 'acute', label: 'חדה' },
          { value: 'right', label: 'ישרה' },
          { value: 'obtuse', label: 'קהה' },
          { value: 'straight', label: 'שטוחה' },
        ],
        answer: kind,
        hint: 'השווה לפינה של דף (90°) ולקו ישר (180°).',
        explain: { acute: 'חדה — קטנה מ-90°.', right: 'ישרה — 90°.', obtuse: 'קהה — בין 90° ל-180°.', straight: 'שטוחה — 180°.' }[kind],
      };
    }
    const deg = pick([30, 45, 60, 90, 120, 135, 150]);
    const opts = shuffle([...new Set([deg, 180 - deg === deg ? 45 : 180 - deg, deg === 90 ? 60 : 90, deg + 30 > 170 ? deg - 30 : deg + 30])]);
    return {
      kind: 'choice',
      text: 'בערך כמה מעלות יש בזווית?',
      visual: { type: 'angle', deg },
      options: opts.map((d) => ({ value: String(d), label: `${d}°` })),
      answer: String(deg),
      hint: 'קודם החלט: חדה, ישרה או קהה? זה כבר מצמצם את האפשרויות.',
      explain: `הזווית בת ${deg}°.`,
    };
  },
};

const TRIANGLES: { shape: ShapeName; bySides: string; byAngles: string }[] = [
  { shape: 'triEquilateral', bySides: 'שווה צלעות', byAngles: 'חד-זווית' },
  { shape: 'triIsosceles', bySides: 'שווה שוקיים', byAngles: 'חד-זווית' },
  { shape: 'triRight', bySides: 'שונה צלעות', byAngles: 'ישר-זווית' },
  { shape: 'triObtuse', bySides: 'שונה צלעות', byAngles: 'קהה-זווית' },
  { shape: 'triScalene', bySides: 'שונה צלעות', byAngles: 'חד-זווית' },
];

const triangles: Level = {
  id: 'g4-geo-6',
  title: 'סוגי משולשים',
  intro: {
    lines: ['לפי הצלעות: שווה צלעות (3 שוות), שווה שוקיים (2 שוות), שונה צלעות.', 'לפי הזוויות: חד-זווית, ישר-זווית, קהה-זווית.'],
    visual: { type: 'shape', shape: 'triRight' },
  },
  generate: () => {
    const byAngles = Math.random() < 0.5;
    if (byAngles) {
      const t = pick(TRIANGLES);
      return {
        kind: 'choice',
        text: 'איזה משולש זה, לפי הזוויות?',
        visual: { type: 'shape', shape: t.shape, color: '#ffd8a8' },
        options: ['חד-זווית', 'ישר-זווית', 'קהה-זווית'].map((x) => ({ value: x, label: x })),
        answer: t.byAngles,
        hint: 'חפש את הזווית הגדולה ביותר במשולש: ישרה? קהה? או שכולן חדות?',
        explain: `זה משולש ${t.byAngles}.`,
      };
    }
    const kind = pick(['eq', 'iso', 'sca'] as const);
    const a = randInt(3, 9);
    const sides: number[] = kind === 'eq' ? [a, a, a] : kind === 'iso' ? shuffle([a, a, a + randInt(1, 4)]) : shuffle([a, a + 1, a + randInt(2, 5)]);
    const ans = kind === 'eq' ? 'שווה צלעות' : kind === 'iso' ? 'שווה שוקיים' : 'שונה צלעות';
    return {
      kind: 'choice',
      text: 'איזה משולש זה, לפי אורכי הצלעות?',
      visual: { type: 'polygon', sides, unit: 'ס"מ' },
      options: ['שווה צלעות', 'שווה שוקיים', 'שונה צלעות'].map((x) => ({ value: x, label: x })),
      answer: ans,
      hint: 'כמה צלעות שוות באורכן?',
      explain: `${sides.join(', ')} — ${ans}.`,
    };
  },
};

const QUADS: { shape: ShapeName; name: string; why: string }[] = [
  { shape: 'square', name: 'ריבוע', why: '4 צלעות שוות ו-4 זוויות ישרות.' },
  { shape: 'rectangle', name: 'מלבן', why: '4 זוויות ישרות, הצלעות הנגדיות שוות.' },
  { shape: 'rhombus', name: 'מעוין', why: '4 צלעות שוות, אבל הזוויות לא ישרות.' },
  { shape: 'parallelogram', name: 'מקבילית', why: 'שני זוגות של צלעות מקבילות.' },
  { shape: 'trapezoid', name: 'טרפז', why: 'רק זוג אחד של צלעות מקבילות.' },
];

const quads: Level = {
  id: 'g4-geo-7',
  title: 'מרובעים',
  intro: {
    lines: ['ריבוע, מלבן, מעוין, מקבילית, טרפז — כולם מרובעים!', 'מה שמבדיל ביניהם: צלעות שוות, זוויות ישרות וצלעות מקבילות.'],
    visual: { type: 'shape', shape: 'parallelogram' },
  },
  generate: () => {
    const q = pick(QUADS);
    // a square is also a rectangle/rhombus/parallelogram — don't offer the "also true" names
    const exclude: Record<string, string[]> = {
      square: ['מלבן', 'מעוין', 'מקבילית'],
      rectangle: ['מקבילית'],
      rhombus: ['מקבילית'],
    };
    const opts = QUADS.map((x) => x.name).filter((nm) => nm === q.name || !(exclude[q.shape] ?? []).includes(nm));
    return {
      kind: 'choice',
      text: 'איך קוראים למרובע הזה?',
      visual: { type: 'shape', shape: q.shape, color: pick(['#a5d8ff', '#b2f2bb', '#ffec99', '#eebefa']) },
      options: shuffle(opts).map((x) => ({ value: x, label: x })),
      answer: q.name,
      hint: 'בדוק: האם כל הצלעות שוות? האם יש זוויות ישרות? כמה זוגות של צלעות מקבילות?',
      explain: `${q.name}: ${q.why}`,
    };
  },
};

const lines: Level = {
  id: 'g4-geo-8',
  title: 'ישרים מקבילים ומאונכים',
  intro: {
    lines: [
      '**מקבילים** — לעולם לא נפגשים, כמו פסי רכבת.',
      '**מאונכים** — נפגשים בזווית ישרה, כמו האות ⊥.',
      '**נחתכים** — נפגשים, אבל לא בזווית ישרה.',
    ],
    visual: { type: 'lines', kind: 'perpendicular' },
  },
  generate: () => {
    const kind = pick(['parallel', 'perpendicular', 'crossing'] as const);
    return {
      kind: 'choice',
      text: 'איך הישרים האלה?',
      visual: { type: 'lines', kind, rotate: pick([0, 20, -25, 40]) },
      options: [
        { value: 'parallel', label: 'מקבילים' },
        { value: 'perpendicular', label: 'מאונכים' },
        { value: 'crossing', label: 'נחתכים' },
      ],
      answer: kind,
      hint: 'האם הם נפגשים? אם כן — בזווית ישרה?',
      explain: { parallel: 'מקבילים — הם לא נפגשים.', perpendicular: 'מאונכים — נפגשים בזווית ישרה.', crossing: 'נחתכים, אבל לא בזווית ישרה.' }[kind],
    };
  },
};

export const geometryTopic: Topic = {
  id: 'g4-geo',
  title: 'שטח, זוויות ומצולעים',
  icon: '📐',
  levels: [countSquares, rectArea, areaVsPerimeter, compoundArea, angleTypes, triangles, quads, lines],
};
