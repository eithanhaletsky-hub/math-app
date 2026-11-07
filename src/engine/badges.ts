import { badges } from '../content/badges';
import { awardBadges, getProgress } from '../storage/progress';

/** Awards every badge whose rule is now met. Returns the ids that are new. */
export function checkBadges(): string[] {
  const p = getProgress();
  const fresh = badges.filter((b) => !p.badges[b.id] && b.earned(p)).map((b) => b.id);
  if (fresh.length) awardBadges(fresh);
  return fresh;
}
