/**
 * localStorage wrapper that never throws.
 * If storage is blocked (private mode, disabled cookies, old browser, tests),
 * data is kept in memory for the current visit and the site keeps working.
 */

let available: boolean | null = null;
const memory = new Map<string, string>();

function canUse(): boolean {
  if (available !== null) return available;
  try {
    const ls = window.localStorage;
    const probe = '__math_probe__';
    ls.setItem(probe, probe);
    ls.removeItem(probe);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

export function readItem(key: string): string | null {
  if (canUse()) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      /* fall through to memory */
    }
  }
  return memory.get(key) ?? null;
}

export function writeItem(key: string, value: string): void {
  memory.set(key, value);
  if (canUse()) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* quota full or blocked: memory copy is still used */
    }
  }
}

export function removeItem(key: string): void {
  memory.delete(key);
  if (canUse()) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

/** True when progress will survive closing the browser. */
export function isPersistent(): boolean {
  return canUse();
}
