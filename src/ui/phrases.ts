import { pick } from '../content/lib/random';

/** What Pipi says. Short, warm, varied. (Masculine forms — the player is a boy.) */

export const PRAISE = ['כל הכבוד!', 'מעולה!', 'יופי של תשובה!', 'בדיוק!', 'אלוף!', 'נהדר!', 'וואו, צדקת!', 'מצוין!'];
export const PRAISE_SECOND = ['יפה! הצלחת בניסיון השני.', 'הנה, מצאת את זה!', 'יופי, תיקנת!'];
export const ENCOURAGE = ['כמעט! הנה רמז:', 'עוד ניסיון קטן. רמז:', 'לא נורא, ננסה שוב. רמז:'];
export const AFTER_FAIL = ['לא נורא! ככה זה עובד:', 'בוא נראה ביחד:', 'זה היה קשה. הנה ההסבר:'];
export const GREETINGS = ['היי! אני פיפי. לאן נצא היום?', 'שלום! בוא נשחק עם מספרים!', 'טוב לראות אותך! בחר עולם.'];

export const say = (list: string[]) => pick(list);

export function resultLine(stars: number): string {
  if (stars === 3) return 'מושלם! קיבלת 3 כוכבים!';
  if (stars === 2) return 'עבודה טובה מאוד!';
  if (stars === 1) return 'עברת את השלב! אפשר לנסות שוב בשביל עוד כוכבים.';
  return 'כמעט! בוא ננסה שוב — כל פעם זה נהיה קל יותר.';
}
