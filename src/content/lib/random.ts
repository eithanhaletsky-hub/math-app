import type { Option } from '../types';

/** Random integer in [min, max] inclusive. */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** `count` distinct values from [min, max]. */
export function distinctInts(count: number, min: number, max: number): number[] {
  const all: number[] = [];
  for (let i = min; i <= max; i++) all.push(i);
  return shuffle(all).slice(0, count);
}

/**
 * Number options: the answer plus nearby wrong values (the kind of mistakes
 * children really make, like ±1 or ±10), shuffled.
 */
export function numberOptions(
  answer: number,
  opts: { count?: number; min?: number; max?: number; near?: number[] } = {},
): Option[] {
  const { count = 4, min = 0, max = Number.MAX_SAFE_INTEGER } = opts;
  const near = opts.near ?? [1, -1, 2, -2, 10, -10, 3, -3];
  const set = new Set<number>([answer]);
  for (const d of shuffle(near)) {
    if (set.size >= count) break;
    const v = answer + d;
    if (v >= min && v <= max) set.add(v);
  }
  let guard = 0;
  while (set.size < count && guard++ < 100) {
    const v = randInt(Math.max(min, answer - 10), Math.min(max, answer + 10));
    set.add(v);
  }
  return shuffle([...set]).map((v) => ({ value: String(v), label: String(v) }));
}

/** Options sorted from small to big (nicer for young kids). */
export function sortedNumberOptions(answer: number, opts: Parameters<typeof numberOptions>[1] = {}): Option[] {
  return numberOptions(answer, opts).sort((a, b) => Number(a.value) - Number(b.value));
}
