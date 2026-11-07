import { useSyncExternalStore } from 'react';

/** A tiny queue of "new badge" pop-ups shown on top of any screen. */
let queue: string[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function pushBadgeToasts(ids: string[]) {
  if (!ids.length) return;
  queue = [...queue, ...ids];
  emit();
}

export function popBadgeToast() {
  queue = queue.slice(1);
  emit();
}

export function useBadgeToasts(): string[] {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => queue,
  );
}
