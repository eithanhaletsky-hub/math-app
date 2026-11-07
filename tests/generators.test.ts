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
  const calc = (a: number, op: string, b: number) =>
    op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b;
  let m = /^(\d+) ([+−×:]) (\d+) = \?$/.exec(expr);
  if (m) return calc(Number(m[1]), m[2], Number(m[3]));
  // missing number: "a + ? = c", "? + b = c", "a − ? = c"
  m = /^(\d+) ([+−]) \? = (\d+)$/.exec(expr);
  if (m) return m[2] === '+' ? Number(m[3]) - Number(m[1]) : Number(m[1]) - Number(m[3]);
  m = /^\? ([+−]) (\d+) = (\d+)$/.exec(expr);
  if (m) return m[1] === '+' ? Number(m[3]) - Number(m[2]) : Number(m[3]) + Number(m[2]);
  return null;
}

/** Evaluates "a + b" / "a − b" labels (used in match questions). */
function evalLabel(label: string): number | null {
  const m = /^(\d+) ([+−]) (\d+)$/.exec(label);
  if (!m) return null;
  return m[2] === '+' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3]);
}

describe('content', () => {
  const levels = worlds.flatMap((w) => w.topics.flatMap((t) => t.levels.map((l) => ({ w, t, l }))));

  it('has unique level ids', () => {
    const ids = levels.map((x) => x.l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const { w, t, l } of levels) {
    it(`${t.title} › ${l.title} generates valid questions`, () => {
      for (let i = 0; i < RUNS; i++) {
        const q = l.generate();
        checkQuestion(q, l.id);
        if (q.kind === 'input' && q.expr) {
          const v = evalExpr(q.expr);
          if (v !== null) expect(q.answer, `${l.id}: ${q.expr}`).toBe(v);
        }
        if (q.kind === 'input' && q.visual?.type === 'vertical') {
          const [a, b] = q.visual.rows;
          expect(q.answer, `${l.id}: vertical ${a} ${q.visual.op} ${b}`).toBe(q.visual.op === '+' ? a + b : a - b);
        }
        if (q.kind === 'match') {
          for (const p of q.pairs) {
            const v = evalLabel(p.left.label);
            if (v !== null) expect(Number(p.right.label), `${l.id}: ${p.left.label}`).toBe(v);
          }
        }
        if (w.id === 1 && q.kind === 'input') expect(q.answer, `${l.id}: answer ≤ 100 in grade 1`).toBeLessThanOrEqual(100);
      }
      expect(buildRound(l).length).toBe(l.questions ?? 10);
    });
  }
});
