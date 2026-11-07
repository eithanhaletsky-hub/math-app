import { useSyncExternalStore } from 'react';
import { readItem, writeItem } from './safeStorage';

const KEY = 'math-worlds:progress';
const VERSION = 1;
/** One question can add at most this much to "practice time" (ignores idle tabs). */
const MAX_MS_PER_QUESTION = 90_000;

export type Stars = 0 | 1 | 2 | 3;
export type AnswerResult = 'first' | 'second' | 'failed';

export interface LevelProgress {
  stars: Stars;
  bestScore: number; // 0..1
  plays: number;
}

export interface TopicStats {
  answered: number;
  correctFirst: number;
  correctSecond: number;
  failed: number;
  timeMs: number;
  lastPlayed: number;
}

export interface ProgressState {
  version: number;
  levels: Record<string, LevelProgress>;
  topics: Record<string, TopicStats>;
  /** badge id → time earned */
  badges: Record<string, number>;
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  perfectLevels: number;
  practiceMs: number;
  /** "YYYY-MM-DD" → ms practiced that day */
  days: Record<string, number>;
  settings: { muted: boolean };
  parentPin: string | null;
}

export function emptyState(): ProgressState {
  return {
    version: VERSION,
    levels: {},
    topics: {},
    badges: {},
    streak: 0,
    bestStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    perfectLevels: 0,
    practiceMs: 0,
    days: {},
    settings: { muted: false },
    parentPin: null,
  };
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function num(v: unknown, d = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : d;
}

/** Parse saved data defensively: anything broken falls back to defaults. */
export function parseState(raw: string | null): ProgressState {
  const base = emptyState();
  if (!raw) return base;
  try {
    const d: unknown = JSON.parse(raw);
    if (!isObj(d)) return base;
    const s: ProgressState = { ...base };
    if (isObj(d.levels)) {
      for (const [k, v] of Object.entries(d.levels)) {
        if (!isObj(v)) continue;
        const stars = Math.max(0, Math.min(3, Math.round(num(v.stars)))) as Stars;
        s.levels[k] = { stars, bestScore: num(v.bestScore), plays: num(v.plays) };
      }
    }
    if (isObj(d.topics)) {
      for (const [k, v] of Object.entries(d.topics)) {
        if (!isObj(v)) continue;
        s.topics[k] = {
          answered: num(v.answered),
          correctFirst: num(v.correctFirst),
          correctSecond: num(v.correctSecond),
          failed: num(v.failed),
          timeMs: num(v.timeMs),
          lastPlayed: num(v.lastPlayed),
        };
      }
    }
    if (isObj(d.badges)) {
      for (const [k, v] of Object.entries(d.badges)) s.badges[k] = num(v, Date.now());
    }
    if (isObj(d.days)) {
      for (const [k, v] of Object.entries(d.days)) s.days[k] = num(v);
    }
    s.streak = num(d.streak);
    s.bestStreak = num(d.bestStreak);
    s.totalAnswered = num(d.totalAnswered);
    s.totalCorrect = num(d.totalCorrect);
    s.perfectLevels = num(d.perfectLevels);
    s.practiceMs = num(d.practiceMs);
    s.settings = { muted: isObj(d.settings) && d.settings.muted === true };
    s.parentPin = typeof d.parentPin === 'string' && /^\d{4}$/.test(d.parentPin) ? d.parentPin : null;
    return s;
  } catch {
    return base;
  }
}

// ---------- store ----------

let state: ProgressState = parseState(readItem(KEY));
const listeners = new Set<() => void>();

function commit(next: ProgressState) {
  state = next;
  writeItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function getProgress(): ProgressState {
  return state;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getProgress, getProgress);
}

function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ---------- actions ----------

export function recordAnswer(topicId: string, result: AnswerResult, ms: number): void {
  const t = Math.max(0, Math.min(ms, MAX_MS_PER_QUESTION));
  const prev = state.topics[topicId] ?? {
    answered: 0,
    correctFirst: 0,
    correctSecond: 0,
    failed: 0,
    timeMs: 0,
    lastPlayed: 0,
  };
  const streak = result === 'first' ? state.streak + 1 : 0;
  const day = today();
  commit({
    ...state,
    topics: {
      ...state.topics,
      [topicId]: {
        answered: prev.answered + 1,
        correctFirst: prev.correctFirst + (result === 'first' ? 1 : 0),
        correctSecond: prev.correctSecond + (result === 'second' ? 1 : 0),
        failed: prev.failed + (result === 'failed' ? 1 : 0),
        timeMs: prev.timeMs + t,
        lastPlayed: Date.now(),
      },
    },
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
    totalAnswered: state.totalAnswered + 1,
    totalCorrect: state.totalCorrect + (result === 'failed' ? 0 : 1),
    practiceMs: state.practiceMs + t,
    days: { ...state.days, [day]: (state.days[day] ?? 0) + t },
  });
}

export function finishLevel(levelId: string, score: number, stars: Stars): void {
  const prev = state.levels[levelId] ?? { stars: 0, bestScore: 0, plays: 0 };
  commit({
    ...state,
    levels: {
      ...state.levels,
      [levelId]: {
        stars: Math.max(prev.stars, stars) as Stars,
        bestScore: Math.max(prev.bestScore, score),
        plays: prev.plays + 1,
      },
    },
    perfectLevels: state.perfectLevels + (score >= 1 ? 1 : 0),
  });
}

export function awardBadges(ids: string[]): void {
  const fresh = ids.filter((id) => !state.badges[id]);
  if (fresh.length === 0) return;
  const badges = { ...state.badges };
  for (const id of fresh) badges[id] = Date.now();
  commit({ ...state, badges });
}

export function setMuted(muted: boolean): void {
  commit({ ...state, settings: { ...state.settings, muted } });
}

export function setParentPin(pin: string): void {
  commit({ ...state, parentPin: pin });
}

/** Clears learning progress. Keeps the parent PIN and sound setting. */
export function resetProgress(): void {
  commit({ ...emptyState(), settings: state.settings, parentPin: state.parentPin });
}
