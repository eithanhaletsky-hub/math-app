import type { Level, Topic } from '../../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { MINUS } from '../../lib/things';

const mean: Level = {
  id: 'g6-stat-1',
  title: 'ממוצע',
  intro: {
    lines: ['**ממוצע** = סכום כל הנתונים : מספר הנתונים.', 'ציונים 70, 80, 90: [[(70 + 80 + 90) : 3 = 80]].'],
  },
  generate: () => {
    const n = randInt(3, 5);
    const avg = randInt(5, 90);
    // build numbers around the average that sum exactly to n × avg
    const vals = Array.from({ length: n - 1 }, () => avg + randInt(-5, 5));
    vals.push(avg * n - vals.reduce((a, b) => a + b, 0));
    if (vals.some((v) => v < 0)) return mean.generate();
    const list = shuffle(vals);
    const sum = avg * n;
    return {
      kind: 'input',
      text: `מה הממוצע של: [[${list.join(', ')}]]?`,
      answer: avg,
      hint: `חבר את כל ${n} המספרים, וחלק ב-${n}.`,
      explain: `${list.join(' + ')} = ${sum}, ${sum} : ${n} = ${avg}`,
    };
  },
};

const median: Level = {
  id: 'g6-stat-2',
  title: 'חציון',
  intro: {
    lines: ['**חציון** — המספר האמצעי, אחרי שמסדרים מהקטן לגדול.', '5, 2, 9, 4, 7 → 2, 4, **5**, 7, 9 → החציון 5.'],
  },
  generate: () => {
    const n = pick([5, 7]);
    const vals = Array.from({ length: n }, () => randInt(1, 50));
    const sorted = [...vals].sort((a, b) => a - b);
    const med = sorted[(n - 1) / 2];
    return {
      kind: 'input',
      text: `מה החציון של: [[${vals.join(', ')}]]?`,
      answer: med,
      hint: `קודם סדר מהקטן לגדול. ואז מצא את המספר ה-${(n + 1) / 2} (האמצעי).`,
      explain: `מסודר: [[${sorted.join(', ')}]]. האמצעי: ${med}.`,
    };
  },
};

const mode: Level = {
  id: 'g6-stat-3',
  title: 'שכיח וטווח',
  intro: {
    lines: ['**שכיח** — הנתון שמופיע הכי הרבה פעמים.', '**טווח** — הגדול ביותר פחות הקטן ביותר.'],
  },
  generate: () => {
    if (Math.random() < 0.5) {
      const m = randInt(1, 20);
      const others = shuffle(Array.from({ length: 20 }, (_, i) => i + 1).filter((x) => x !== m)).slice(0, 4);
      const vals = shuffle([m, m, m, ...others]);
      return {
        kind: 'input',
        text: `מה השכיח של: [[${vals.join(', ')}]]?`,
        answer: m,
        hint: 'איזה מספר חוזר הכי הרבה פעמים?',
        explain: `${m} מופיע 3 פעמים — הוא השכיח.`,
      };
    }
    const vals = Array.from({ length: 6 }, () => randInt(1, 60));
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    return {
      kind: 'input',
      text: `מה הטווח של: [[${vals.join(', ')}]]?`,
      answer: max - min,
      hint: 'מצא את הגדול ביותר ואת הקטן ביותר, וחסר.',
      explain: `${max} ${MINUS} ${min} = ${max - min}`,
    };
  },
};

const missingForMean: Level = {
  id: 'g6-stat-4',
  title: 'חסר נתון לממוצע',
  intro: { lines: ['אם הממוצע של 4 מבחנים הוא 80 — הסכום שלהם 320.', 'כך אפשר למצוא ציון חסר.'] },
  generate: () => {
    const n = 4;
    const avg = randInt(6, 9) * 10;
    const known = Array.from({ length: n - 1 }, () => avg + randInt(-15, 15));
    const missing = avg * n - known.reduce((a, b) => a + b, 0);
    if (missing < 0 || missing > 100) return missingForMean.generate();
    return {
      kind: 'input',
      text: `הממוצע של 4 מבחנים הוא ${avg}. שלושה ציונים הם ${known.join(', ')}. מה הציון הרביעי?`,
      answer: missing,
      hint: `הסכום של כל 4: ${n} × ${avg} = ${n * avg}. חסר מזה את שלושת הציונים.`,
      explain: `${n * avg} ${MINUS} ${known.reduce((a, b) => a + b, 0)} = ${missing}`,
    };
  },
};

export const statisticsTopic: Topic = {
  id: 'g6-stat',
  title: 'סטטיסטיקה',
  icon: '📊',
  levels: [mean, median, mode, missingForMean],
};
