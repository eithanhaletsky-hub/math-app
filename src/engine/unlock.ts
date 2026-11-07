import type { Level, Topic, World } from '../content/types';
import type { ProgressState } from '../storage/progress';

/** All levels of a world in path order. */
export function worldLevels(world: World): { level: Level; topic: Topic }[] {
  return world.topics.flatMap((topic) => topic.levels.map((level) => ({ level, topic })));
}

/**
 * A level is open when it is the first in its world, or the level before it has
 * at least one star. Every world's first level is always open, so the child can
 * jump between grades freely.
 */
export function isUnlocked(world: World, levelId: string, p: ProgressState): boolean {
  const list = worldLevels(world);
  const i = list.findIndex((x) => x.level.id === levelId);
  if (i <= 0) return i === 0;
  return (p.levels[list[i - 1].level.id]?.stars ?? 0) > 0;
}

export function worldStars(world: World, p: ProgressState): { got: number; total: number } {
  const list = worldLevels(world);
  const got = list.reduce((sum, x) => sum + (p.levels[x.level.id]?.stars ?? 0), 0);
  return { got, total: list.length * 3 };
}

export function isWorldComplete(world: World, p: ProgressState): boolean {
  const list = worldLevels(world);
  return list.length > 0 && list.every((x) => (p.levels[x.level.id]?.stars ?? 0) > 0);
}

/** The level the child should play next in this world (first not yet passed). */
export function nextLevelId(world: World, p: ProgressState): string | null {
  const list = worldLevels(world);
  const next = list.find((x) => (p.levels[x.level.id]?.stars ?? 0) === 0);
  return next ? next.level.id : null;
}
