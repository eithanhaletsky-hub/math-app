import { describe, expect, it } from 'vitest';
import { badges } from '../src/content/badges';
import { checkBadges } from '../src/engine/badges';
import { finishLevel, getProgress, recordAnswer, resetProgress } from '../src/storage/progress';

describe('badges', () => {
  it('have unique ids', () => {
    const ids = badges.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('awards each badge once', () => {
    resetProgress();
    expect(checkBadges()).toEqual([]);
    for (let i = 0; i < 10; i++) recordAnswer('g1-count', 'first', 1000);
    const fresh = checkBadges();
    expect(fresh).toContain('first');
    expect(fresh).toContain('streak5');
    expect(fresh).toContain('streak10');
    expect(checkBadges()).toEqual([]);
    finishLevel('g1-count-1', 1, 3);
    expect(checkBadges()).toEqual(expect.arrayContaining(['stars3', 'perfect']));
    expect(Object.keys(getProgress().badges).length).toBeGreaterThanOrEqual(5);
    resetProgress();
    expect(getProgress().badges).toEqual({});
  });
});
