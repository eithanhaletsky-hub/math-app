import { describe, expect, it } from 'vitest';
import { worlds } from '../src/content/worlds';
import { buildRound } from '../src/engine/session';
import type { Question } from '../src/content/types';

const RUNS = 300;

/** Checks every question is answerable and well-formed. */
function checkQuestion(q: Question, where: string) {
  expect(q.text.length, `${where}: text`).toBeGreaterThan(0);
  expect(q.hint.length, `${where}: hint`).toBeGreaterThan(0);
  expect(q.explain.length, `${where}: explain`).toBeGreaterThan(0);
  switch (q.kind) {
    case 'choice': {
      const values = q.options.map((o) => o.value);
      expect(new Set(values).size, `${where}: unique options ${values}`).toBe(values.length);
      expect(values, `${where}: answer among options`).toContain(q.answer);
      expect(values.length, `${where}: at least 2 options`).toBeGreaterThanOrEqual(2);
      break;
    }
    case 'input':
      expect(Number.isFinite(q.answer), `${where}: finite answer`).toBe(true);
      expect(q.answer, `${where}: non-negative`).toBeGreaterThanOrEqual(0);
      if (!q.decimal) expect(Number.isInteger(q.answer), `${where}: integer`).toBe(true);
      break;
    case 'numberline': {
      expect(q.answer).toBeGreaterThanOrEqual(q.min);
      expect(q.answer).toBeLessThanOrEqual(q.max);
      const steps = (q.answer - q.min) / q.step;
      expect(Math.abs(steps - Math.round(steps)), `${where}: on a tick`).toBeLessThan(1e-9);
      break;
    }
    case 'match': {
      expect(q.pairs.length).toBeGreaterThanOrEqual(2);
      const lefts = q.pairs.map((p) => p.left.label);
      expect(new Set(lefts).size, `${where}: unique lefts`).toBe(lefts.length);
      break;
    }
    case 'fraction':
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThanOrEqual(q.parts);
      break;
    case 'clock':
      expect(q.answer.hour).toBeGreaterThanOrEqual(1);
      expect(q.answer.hour).toBeLessThanOrEqual(12);
      expect(q.answer.minute % q.minuteStep).toBe(0);
      break;
  }
}

/** Evaluates simple "a + b = ?" / "a − b = ?" expressions to double-check answers. */
function evalExpr(expr: string): number | null {
  const m = /^(\d+) ([+−]) (\d+) = \?$/.exec(expr);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[3]);
  return m[2] === '+' ? a + b : a - b;
}

describe('content', () => {
  const levels = worlds.flatMap((w) => w.topics.flatMap((t) => t.levels.map((l) => ({ w, t, l }))));

  it('has unique level ids', () => {
    const ids = levels.map((x) => x.l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const { t, l } of levels) {
    it(`${t.title} › ${l.title} generates valid questions`, () => {
      for (let i = 0; i < RUNS; i++) {
        const q = l.generate();
        checkQuestion(q, l.id);
        if (q.kind === 'input' && q.expr) {
          const v = evalExpr(q.expr);
          if (v !== null) expect(q.answer, `${l.id}: ${q.expr}`).toBe(v);
        }
      }
      expect(buildRound(l).length).toBe(l.questions ?? 10);
    });
  }
});
