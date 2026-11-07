import { badges } from '../content/badges';
import { useProgress } from '../storage/progress';
import { go } from '../app/router';
import { TopBar } from '../components/TopBar';
import { MascotSays } from '../components/Mascot';
import { BadgeIcon } from '../components/BadgeToaster';

export function BadgesScreen() {
  const p = useProgress();
  const got = badges.filter((b) => p.badges[b.id]).length;
  const line =
    got === 0
      ? 'עוד אין תגים — בוא נשחק ונאסוף את הראשון!'
      : got === badges.length
        ? 'וואו! אספת את כל התגים!'
        : got === 1
          ? 'אספת את התג הראשון שלך. כל הכבוד!'
          : `אספת ${got} תגים. כל הכבוד!`;

  return (
    <div className="screen badges-screen">
      <TopBar title="🏅 התגים שלי" onBack={() => go('/')} backLabel="למפת העולמות">
        <span className="pill">
          <bdi dir="ltr">{`${got} / ${badges.length}`}</bdi>
        </span>
      </TopBar>
      <div className="map__hello">
        <MascotSays mood={got > 0 ? 'cheer' : 'happy'} size={86}>
          {line}
        </MascotSays>
      </div>
      <main className="badge-grid">
        {badges.map((b) => {
          const earned = Boolean(p.badges[b.id]);
          return (
            <div key={b.id} className={`badge-card ${earned ? 'badge-card--earned' : ''}`}>
              <BadgeIcon icon={b.icon} earned={earned} size="lg" />
              <div className="badge-card__title">{b.title}</div>
              <div className="badge-card__how">{earned ? new Date(p.badges[b.id]).toLocaleDateString('he-IL') : b.how}</div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
