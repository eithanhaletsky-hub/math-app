import { findWorld } from '../content/worlds';
import { isUnlocked, nextLevelId, worldStars } from '../engine/unlock';
import { useProgress } from '../storage/progress';
import { go } from '../app/router';
import { TopBar } from '../components/TopBar';
import { Mascot } from '../components/Mascot';
import { Stars } from '../components/Stars';

/** Zig-zag offsets for the path nodes (in % of the path width). */
const WAVE = [0, 22, 34, 22, 0, -22, -34, -22];

export function WorldScreen({ worldId }: { worldId: number }) {
  const world = findWorld(worldId);
  const p = useProgress();
  if (!world) {
    return (
      <div className="screen center">
        <button className="btn" onClick={() => go('/')}>
          למפת העולמות
        </button>
      </div>
    );
  }
  const current = nextLevelId(world, p);
  const { got, total } = worldStars(world, p);
  let n = 0;

  return (
    <div
      className="screen world"
      style={
        {
          background: world.theme.bg,
          '--accent': world.theme.accent,
          '--accent-dark': world.theme.accentDark,
          '--soft': world.theme.soft,
        } as React.CSSProperties
      }
    >
      <TopBar title={`${world.icon} ${world.grade} · ${world.name}`} onBack={() => go('/')} backLabel="למפת העולמות">
        <span className="pill">
          ★ <bdi dir="ltr">{`${got} / ${total}`}</bdi>
        </span>
      </TopBar>

      <main className="path">
        {world.topics.map((topic) => (
          <section key={topic.id} className="path__topic">
            <h2 className="path__topic-title">
              <span aria-hidden="true">{topic.icon}</span> {topic.title}
            </h2>
            <div className="path__nodes">
              {topic.levels.map((level) => {
                const i = n++;
                const open = isUnlocked(world, level.id, p);
                const stars = p.levels[level.id]?.stars ?? 0;
                const isCurrent = level.id === current;
                return (
                  <div key={level.id} className="path__node-wrap" style={{ transform: `translateX(${WAVE[i % WAVE.length]}%)` }}>
                    {isCurrent && (
                      <div className="path__pipi" aria-hidden="true">
                        <Mascot mood="happy" size={54} />
                      </div>
                    )}
                    <button
                      className={`node ${open ? '' : 'node--locked'} ${stars > 0 ? 'node--done' : ''} ${isCurrent ? 'node--current' : ''}`}
                      onClick={() => open && go(`/play/${level.id}`)}
                      disabled={!open}
                      aria-label={`${level.title}${open ? '' : ' (נעול)'}`}
                    >
                      {open ? <bdi>{i + 1}</bdi> : '🔒'}
                    </button>
                    <span className="node__title">{level.title}</span>
                    {stars > 0 && <Stars count={stars} size="sm" />}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        {current === null && (
          <div className="card center world__done">
            <Mascot mood="cheer" />
            <p>סיימת את כל השלבים בעולם הזה! 🎉</p>
          </div>
        )}
      </main>
    </div>
  );
}
