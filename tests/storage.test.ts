import { describe, expect, it } from 'vitest';
import { emptyState, finishLevel, getProgress, parseState, recordAnswer, resetProgress } from '../src/storage/progress';
import { starsFor } from '../src/engine/session';

describe('progress storage', () => {
  it('works without localStorage (tests run with no window)', () => {
    recordAnswer('t1', 'first', 1000);
    recordAnswer('t1', 'first', 1000);
    recordAnswer('t1', 'failed', 1000);
    const s = getProgress();
    expect(s.topics.t1.answered).toBe(3);
    expect(s.bestStreak).toBe(2);
    expect(s.streak).toBe(0);
    finishLevel('L1', 0.8, 2);
    finishLevel('L1', 0.4, 0);
    expect(getProgress().levels.L1.stars).toBe(2);
    resetProgress();
    expect(getProgress().levels).toEqual({});
  });

  it('survives broken saved data', () => {
    expect(parseState('not json')).toEqual(emptyState());
    expect(parseState('[1,2]')).toEqual(emptyState());
    const s = parseState(JSON.stringify({ levels: { a: { stars: 9 } }, parentPin: 'abc', settings: { muted: true } }));
    expect(s.levels.a.stars).toBe(3);
    expect(s.parentPin).toBeNull();
    expect(s.settings.muted).toBe(true);
  });

  it('gives stars by accuracy', () => {
    expect(starsFor(1)).toBe(3);
    expect(starsFor(0.9)).toBe(3);
    expect(starsFor(0.75)).toBe(2);
    expect(starsFor(0.5)).toBe(1);
    expect(starsFor(0.45)).toBe(0);
  });
});
