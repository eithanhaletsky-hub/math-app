/** Things to count, with Hebrew plural names. */
export const COUNTABLES = [
  { emoji: '🍎', plural: 'תפוחים' },
  { emoji: '⭐', plural: 'כוכבים' },
  { emoji: '🐟', plural: 'דגים' },
  { emoji: '🎈', plural: 'בלונים' },
  { emoji: '🌸', plural: 'פרחים' },
  { emoji: '🚗', plural: 'מכוניות' },
  { emoji: '🐥', plural: 'אפרוחים' },
  { emoji: '🍓', plural: 'תותים' },
  { emoji: '⚽', plural: 'כדורים' },
  { emoji: '🦋', plural: 'פרפרים' },
  { emoji: '🍪', plural: 'עוגיות' },
  { emoji: '🐸', plural: 'צפרדעים' },
] as const;

export interface Person {
  name: string;
  female: boolean;
}

/** Characters for word problems (girls and boys). */
export const PEOPLE: readonly Person[] = [
  { name: 'נועה', female: true },
  { name: 'איתי', female: false },
  { name: 'מאיה', female: true },
  { name: 'עומר', female: false },
  { name: 'תמר', female: true },
  { name: 'יונתן', female: false },
  { name: 'שירה', female: true },
  { name: 'אורי', female: false },
  { name: 'ליה', female: true },
  { name: 'דניאל', female: false },
  { name: 'הילה', female: true },
  { name: 'רון', female: false },
];

/** Picks the right verb form: g(p, 'אכל', 'אכלה'). */
export function g(p: Person, male: string, female: string): string {
  return p.female ? female : male;
}
