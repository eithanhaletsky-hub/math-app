import { useMemo } from 'react';
import { worlds } from '../content/worlds';
import { worldStars } from '../engine/unlock';
import { useProgress } from '../storage/progress';
import { isPersistent } from '../storage/safeStorage';
import { go } from '../app/router';
import { MascotSays } from '../components/Mascot';
import { MuteButton } from '../components/TopBar';
import { GREETINGS, say } from '../ui/phrases';

export function MapScreen() {
  const p = useProgress();
  const greeting = useMemo(() => say(GREETINGS), []);
  const totalStars = worlds.reduce((s, w) => s + worldStars(w, p).got, 0);

  return (
    <div className="screen map">
      <header className="topbar">
        <div className="topbar__start">
          <h1 className="topbar__title map__title">עולמות המתמטיקה</h1>
        </div>
        <div className="topbar__end">
          <span className="pill" aria-label={`${totalStars} כוכבים`}>
            ★ <bdi>{totalStars}</bdi>
          </span>
          <button className="icon-btn" onClick={() => go('/badges')} aria-label="התגים שלי" title="התגים שלי">
            🏅
          </button>
          <MuteButton />
        </div>
      </header>

      <div className="map__hello">
        <MascotSays mood="wave" size={96}>
          {greeting}
        </MascotSays>
      </div>

      {!isPersistent() && (
        <p className="note note--warn">
          הדפדפן הזה לא מאפשר שמירה, אז ההתקדמות תישמר רק עד שתסגור את הדף.
        </p>
      )}

      <div className="worlds">
        {worlds.map((w, i) => {
          const ready = w.topics.length > 0;
          const { got, total } = worldStars(w, p);
          return (
            <button
              key={w.id}
              className={`world-card ${ready ? '' : 'world-card--soon'}`}
              style={{ background: w.theme.bg, '--accent': w.theme.accent, animationDelay: `${i * 0.06}s` } as React.CSSProperties}
              onClick={() => ready && go(`/world/${w.id}`)}
              disabled={!ready}
            >
              <span className="world-card__icon" aria-hidden="true">
                {w.icon}
              </span>
              <span className="world-card__grade">{w.grade}</span>
              <span className="world-card__name">{w.name}</span>
              {ready ? (
                <span className="world-card__stars">
                  ★ <bdi dir="ltr">{`${got} / ${total}`}</bdi>
                </span>
              ) : (
                <span className="world-card__soon">בקרוב…</span>
              )}
            </button>
          );
        })}
      </div>

      <footer className="map__footer">
        <button className="map__parents" onClick={() => go('/parents')}>
          🔒 אזור הורים
        </button>
      </footer>
    </div>
  );
}
