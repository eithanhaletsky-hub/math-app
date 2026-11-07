import type { Level, Topic } from '../../types';
import { randInt } from '../../lib/random';
import { MINUS } from '../../lib/things';

const triangleArea: Level = {
  id: 'g5-geo-1',
  title: 'שטח משולש',
  intro: {
    lines: ['משולש הוא חצי ממלבן.', 'שטח משולש = (בסיס × גובה) : 2. הגובה — הקו המקווקו, מאונך לבסיס.'],
    visual: { type: 'baseHeight', shape: 'triangle', base: 8, height: 5, unit: 'ס"מ' },
  },
  generate: () => {
    const b = randInt(2, 14);
    let h = randInt(2, 12);
    if ((b * h) % 2) h += 1;
    return {
      kind: 'input',
      text: 'מה שטח המשולש (בסמ"ר)?',
      visual: { type: 'baseHeight', shape: 'triangle', base: b, height: h, unit: 'ס"מ' },
      answer: (b * h) / 2,
      hint: `בסיס × גובה = ${b} × ${h}. ואז לחלק ב-2.`,
      explain: `(${b} × ${h}) : 2 = ${b * h} : 2 = ${(b * h) / 2} סמ"ר`,
    };
  },
};

const parallelogramArea: Level = {
  id: 'g5-geo-2',
  title: 'שטח מקבילית',
  intro: {
    lines: ['אם "חותכים" משולש מצד אחד ומזיזים לצד השני — מקבלים מלבן!', 'שטח מקבילית = בסיס × גובה.'],
    visual: { type: 'baseHeight', shape: 'parallelogram', base: 7, height: 4, unit: 'ס"מ' },
  },
  generate: () => {
    const b = randInt(3, 15);
    const h = randInt(2, 10);
    return {
      kind: 'input',
      text: 'מה שטח המקבילית (בסמ"ר)?',
      visual: { type: 'baseHeight', shape: 'parallelogram', base: b, height: h, unit: 'ס"מ' },
      answer: b * h,
      hint: `בסיס × גובה (לא הצלע המשופעת!): ${b} × ${h}.`,
      explain: `${b} × ${h} = ${b * h} סמ"ר`,
    };
  },
};

const trapezoidArea: Level = {
  id: 'g5-geo-3',
  title: 'שטח טרפז',
  intro: {
    lines: ['שטח טרפז = (בסיס עליון + בסיס תחתון) × גובה : 2.', '[[(4 + 8) × 5 : 2 = 30]]'],
    visual: { type: 'baseHeight', shape: 'trapezoid', base: 8, top: 4, height: 5, unit: 'ס"מ' },
  },
  generate: () => {
    const top = randInt(2, 8);
    const base = top + randInt(2, 8);
    let h = randInt(2, 10);
    if (((top + base) * h) % 2) h += 1;
    return {
      kind: 'input',
      text: 'מה שטח הטרפז (בסמ"ר)?',
      visual: { type: 'baseHeight', shape: 'trapezoid', base, top, height: h, unit: 'ס"מ' },
      answer: ((top + base) * h) / 2,
      hint: `חבר את הבסיסים (${top} + ${base}), כפול בגובה ${h}, וחלק ב-2.`,
      explain: `(${top} + ${base}) × ${h} : 2 = ${((top + base) * h) / 2} סמ"ר`,
    };
  },
};

const angleSum: Level = {
  id: 'g5-geo-4',
  title: 'סכום הזוויות במשולש',
  intro: {
    lines: ['בכל משולש, סכום שלוש הזוויות הוא **180°**.', 'אם יודעים שתי זוויות — מוצאים את השלישית: 180 פחות הסכום שלהן.'],
    visual: { type: 'shape', shape: 'triScalene' },
  },
  generate: () => {
    const a = randInt(20, 100);
    const b = randInt(20, 160 - a - 10);
    const c = 180 - a - b;
    if (Math.random() < 0.3) {
      const k = randInt(15, 75);
      return {
        kind: 'input',
        text: `במשולש ישר-זווית, אחת הזוויות החדות היא ${k}°. מה הזווית החדה השנייה?`,
        answer: 90 - k,
        hint: 'זווית אחת היא 90°. שתי האחרות ביחד — עוד 90°.',
        explain: `180 ${MINUS} 90 ${MINUS} ${k} = ${90 - k}°`,
      };
    }
    return {
      kind: 'input',
      text: `במשולש יש זווית של ${a}° וזווית של ${b}°. כמה מעלות בזווית השלישית?`,
      answer: c,
      hint: `סכום הזוויות 180°. חשב 180 ${MINUS} ${a} ${MINUS} ${b}.`,
      explain: `180 ${MINUS} ${a} ${MINUS} ${b} = ${c}°`,
    };
  },
};

const volume: Level = {
  id: 'g5-geo-5',
  title: 'נפח תיבה',
  intro: {
    lines: ['**נפח** — כמה קוביות של 1 סמ"ק ממלאות את התיבה.', 'נפח תיבה = אורך × רוחב × גובה.'],
    visual: { type: 'cuboid', l: 5, w: 3, h: 2, unit: 'ס"מ' },
  },
  generate: () => {
    const l = randInt(2, 10);
    const w = randInt(2, 6);
    const h = randInt(1, 6);
    return {
      kind: 'input',
      text: 'מה נפח התיבה (בסמ"ק)?',
      visual: { type: 'cuboid', l, w, h, unit: 'ס"מ' },
      answer: l * w * h,
      hint: `קודם שכבה אחת: ${l} × ${w} = ${l * w}. ואז כפול ${h} שכבות.`,
      explain: `${l} × ${w} × ${h} = ${l * w * h} סמ"ק`,
    };
  },
};

export const geometryTopic: Topic = {
  id: 'g5-geo',
  title: 'שטחים, זוויות ונפח',
  icon: '📐',
  levels: [triangleArea, parallelogramArea, trapezoidArea, angleSum, volume],
};
