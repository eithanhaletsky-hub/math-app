import { useEffect } from 'react';
import { findBadge } from '../content/badges';
import { popBadgeToast, useBadgeToasts } from '../ui/toasts';

/** Shows "new badge!" pop-ups one at a time, on top of any screen. */
export function BadgeToaster() {
  const queue = useBadgeToasts();
  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(popBadgeToast, 3200);
    return () => clearTimeout(t);
  }, [current, queue.length]);

  const badge = current ? findBadge(current) : undefined;
  if (!badge) return null;
  return (
    <button key={current} className="badge-toast" onClick={popBadgeToast} aria-live="assertive">
      <span className="badge-toast__icon">{badge.icon}</span>
      <span>
        <span className="badge-toast__kicker">תג חדש!</span>
        <span className="badge-toast__title">{badge.title}</span>
      </span>
    </button>
  );
}

export function BadgeIcon({ icon, earned, size = 'md' }: { icon: string; earned: boolean; size?: 'md' | 'lg' }) {
  return <span className={`badge-icon badge-icon--${size} ${earned ? 'badge-icon--earned' : ''}`}>{earned ? icon : '?'}</span>;
}
