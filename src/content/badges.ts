import type { ProgressState } from '../storage/progress';
import { worlds } from './worlds';
import { isWorldComplete, worldLevels } from '../engine/unlock';

export interface Badge {
  id: string;
  icon: string;
  title: string;
  /** How to earn it (shown on the badges screen). */
  how: string;
  earned: (p: ProgressState) => boolean;
}

const levelsWith3 = (p: ProgressState) => Object.values(p.levels).filter((l) => l.stars === 3).length;
const daysPlayed = (p: ProgressState) => Object.values(p.days).filter((ms) => ms > 0).length;
const worldsPlayed = (p: ProgressState) =>
  worlds.filter((w) => worldLevels(w).some((x) => (p.levels[x.level.id]?.plays ?? 0) > 0)).length;

const general: Badge[] = [
  { id: 'first', icon: '🌱', title: 'צעד ראשון', how: 'עונים נכון על השאלה הראשונה', earned: (p) => p.totalCorrect >= 1 },
  { id: 'streak5', icon: '🔥', title: '5 ברצף', how: '5 תשובות נכונות ברצף בניסיון הראשון', earned: (p) => p.bestStreak >= 5 },
  { id: 'streak10', icon: '⚡', title: '10 ברצף', how: '10 תשובות נכונות ברצף בניסיון הראשון', earned: (p) => p.bestStreak >= 10 },
  { id: 'streak25', icon: '🌟', title: '25 ברצף', how: '25 תשובות נכונות ברצף בניסיון הראשון', earned: (p) => p.bestStreak >= 25 },
  { id: 'correct50', icon: '🎯', title: '50 תשובות', how: '50 תשובות נכונות בסך הכול', earned: (p) => p.totalCorrect >= 50 },
  { id: 'correct200', icon: '🏹', title: '200 תשובות', how: '200 תשובות נכונות בסך הכול', earned: (p) => p.totalCorrect >= 200 },
  { id: 'correct500', icon: '🚀', title: '500 תשובות', how: '500 תשובות נכונות בסך הכול', earned: (p) => p.totalCorrect >= 500 },
  { id: 'stars3', icon: '⭐', title: 'שלושה כוכבים', how: 'מקבלים 3 כוכבים בשלב אחד', earned: (p) => levelsWith3(p) >= 1 },
  { id: 'stars3x10', icon: '✨', title: 'אספן כוכבים', how: '3 כוכבים ב-10 שלבים', earned: (p) => levelsWith3(p) >= 10 },
  { id: 'perfect', icon: '💎', title: 'מושלם!', how: 'מסיימים שלב בלי אף טעות', earned: (p) => p.perfectLevels >= 1 },
  { id: 'perfect5', icon: '👑', title: 'מלך הדיוק', how: '5 שלבים בלי אף טעות', earned: (p) => p.perfectLevels >= 5 },
  { id: 'days3', icon: '📅', title: '3 ימים', how: 'מתרגלים ב-3 ימים שונים', earned: (p) => daysPlayed(p) >= 3 },
  { id: 'days10', icon: '🗓️', title: '10 ימים', how: 'מתרגלים ב-10 ימים שונים', earned: (p) => daysPlayed(p) >= 10 },
  { id: 'explorer', icon: '🧭', title: 'חוקר עולמות', how: 'משחקים בשני עולמות שונים', earned: (p) => worldsPlayed(p) >= 2 },
];

const perWorld: Badge[] = worlds.flatMap((w) => [
  {
    id: `world${w.id}`,
    icon: w.icon,
    title: `סיימתי את ${w.grade}`,
    how: `עוברים את כל השלבים ב${w.name}`,
    earned: (p: ProgressState) => isWorldComplete(w, p),
  },
  {
    id: `world${w.id}-gold`,
    icon: '🏆',
    title: `אלוף ${w.grade}`,
    how: `3 כוכבים בכל השלבים ב${w.name}`,
    earned: (p: ProgressState) => {
      const list = worldLevels(w);
      return list.length > 0 && list.every((x) => p.levels[x.level.id]?.stars === 3);
    },
  },
]);

const grandFinale: Badge = {
  id: 'all-worlds',
  icon: '👑',
  title: 'אלוף המתמטיקה',
  how: 'עוברים את כל השלבים בכל ששת העולמות',
  earned: (p) => worlds.every((w) => isWorldComplete(w, p)),
};

export const badges: Badge[] = [...general, ...perWorld, grandFinale];

export function findBadge(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}
