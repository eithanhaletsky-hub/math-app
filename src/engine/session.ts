import type { Level, Question } from '../content/types';
import type { AnswerResult, Stars } from '../storage/progress';

export const DEFAULT_QUESTIONS = 10;
/** Minimum score (0..1) that earns a star and opens the next level. */
export const PASS_SCORE = 0.5;

/** A stable "fingerprint" of a question so a round does not repeat itself. */
export function questionKey(q: Question): string {
  const { hint: _h, explain: _e, explainVisual: _v, ...rest } = q;
  if (rest.kind === 'choice') {
    // option order does not make a question different
    return JSON.stringify({ ...rest, options: rest.options.map((o) => o.value).sort() });
  }
  if (rest.kind === 'match') {
    return JSON.stringify(rest.pairs.map((p) => p.left.label + '>' + p.right.label).sort());
  }
  return JSON.stringify(rest);
}

/** Builds a round of distinct random questions (falls back to repeats if the pool is tiny). */
export function buildRound(level: Level, count = level.questions ?? DEFAULT_QUESTIONS): Question[] {
  const seen = new Set<string>();
  const out: Question[] = [];
  let tries = 0;
  while (out.length < count && tries < count * 30) {
    tries++;
    const q = level.generate();
    const key = questionKey(q);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  while (out.length < count) out.push(level.generate());
  return out;
}

export function pointsFor(result: AnswerResult): number {
  return result === 'first' ? 1 : result === 'second' ? 0.5 : 0;
}

export function starsFor(score: number): Stars {
  if (score >= 0.9) return 3;
  if (score >= 0.7) return 2;
  if (score >= PASS_SCORE) return 1;
  return 0;
}
