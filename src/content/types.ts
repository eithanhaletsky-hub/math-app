/**
 * Content model. Everything the child learns is described with these types.
 * UI components read these objects; content files never import UI code.
 *
 * Text markup (rendered by RichText):
 *   [[3 + 4 = ?]]  → math shown left-to-right, isolated inside the Hebrew sentence
 *   inside [[ ]], "3/4" is shown as a stacked fraction
 *   **word**       → bold
 */

export type ShapeName =
  | 'triangle'
  | 'square'
  | 'rectangle'
  | 'circle'
  | 'pentagon'
  | 'hexagon'
  | 'oval'
  | 'rhombus';

export type SolidName = 'cube' | 'box' | 'cylinder' | 'cone' | 'sphere' | 'pyramid';

export type Visual =
  /** Emoji objects in groups. `crossed` marks the last N objects as taken away. */
  | { type: 'objects'; emoji: string; groups: number[]; crossed?: number; tappable?: boolean }
  | { type: 'tenframe'; filled: number; frames?: 1 | 2 }
  | {
      type: 'numberline';
      min: number;
      max: number;
      step?: number;
      labelEvery?: number;
      highlight?: number[];
      jumps?: { from: number; to: number }[];
      hideLabels?: number[];
    }
  | { type: 'hundred'; highlight?: number[]; hidden?: number[]; from?: number }
  | { type: 'blocks'; hundreds?: number; tens: number; ones: number }
  | { type: 'clock'; hour: number; minute: number }
  | { type: 'shape'; shape: ShapeName; color?: string }
  /** Object on a cm ruler. `start` lets the object begin somewhere other than 0. */
  | { type: 'ruler'; length: number; emoji?: string; max?: number; start?: number }
  /** Column (vertical) addition / subtraction layout. */
  | { type: 'vertical'; rows: number[]; op: '+' | '−'; result?: number | null }
  /** Coins and notes, values in shekels (0.1, 0.5, 1, 2, 5, 10, 20, 50, 100, 200). */
  | { type: 'money'; items: number[] }
  | { type: 'solid'; solid: SolidName; color?: string }
  /** rows × cols grid (multiplication as an array). */
  | { type: 'array'; rows: number; cols: number; emoji?: string }
  /** Number bond: whole on top, two parts below. null = "?" */
  | { type: 'bond'; whole: number | null; parts: [number | null, number | null] }
  | { type: 'fraction'; shape: 'circle' | 'bar'; parts: number; filled: number }
  /** Horizontal bars to compare lengths. `units` draws unit boxes inside each bar. */
  | { type: 'bars'; items: { label: string; length: number; color: string }[]; units?: boolean }
  /** A row of items with a "?" (for patterns / sequences). */
  | { type: 'sequence'; items: string[] };

export interface Option {
  value: string;
  label: string;
  visual?: Visual;
}

export interface MatchItem {
  label: string;
  visual?: Visual;
}

interface QuestionBase {
  /** Short instruction / question in Hebrew (may use RichText markup). */
  text: string;
  /** Big math expression shown under the text, left-to-right (e.g. "7 + 5 = ?"). */
  expr?: string;
  visual?: Visual;
  /** Shown after the first wrong answer. Friendly, short, never just "wrong". */
  hint: string;
  /** Shown after the second wrong answer. Must include the correct answer. */
  explain: string;
  explainVisual?: Visual;
}

export type Question = QuestionBase &
  (
    | { kind: 'choice'; options: Option[]; answer: string; optionsLayout?: 'row' | 'grid' }
    | { kind: 'input'; answer: number; decimal?: boolean }
    | {
        kind: 'numberline';
        min: number;
        max: number;
        step: number;
        labelEvery: number;
        answer: number;
      }
    | { kind: 'match'; pairs: { left: MatchItem; right: MatchItem }[] }
    | { kind: 'fraction'; shape: 'circle' | 'bar'; parts: number; answer: number }
    | { kind: 'clock'; answer: { hour: number; minute: number }; minuteStep: number }
  );

export type QuestionKind = Question['kind'];

export interface Intro {
  /** 1–3 short lines. */
  lines: string[];
  expr?: string;
  visual?: Visual;
}

export interface Level {
  id: string;
  title: string;
  intro: Intro;
  /** Returns a fresh random question every call. */
  generate: () => Question;
  /** How many questions per round (default 10). */
  questions?: number;
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  levels: Level[];
}

export interface WorldTheme {
  /** CSS background for the world screen. */
  bg: string;
  accent: string;
  accentDark: string;
  soft: string;
}

export interface World {
  id: number;
  grade: string;
  name: string;
  icon: string;
  theme: WorldTheme;
  topics: Topic[];
}
