import { useState } from 'react';
import { worlds } from '../content/worlds';
import { badges } from '../content/badges';
import { worldLevels, worldStars } from '../engine/unlock';
import { resetProgress, setMuted, useProgress, type ProgressState, type TopicStats } from '../storage/progress';
import { isPersistent } from '../storage/safeStorage';
import { go } from '../app/router';
import { TopBar } from '../components/TopBar';

/** Topics with enough answers and a low first-try rate count as "hard". */
const MIN_ANSWERS = 8;
const WEAK_RATE = 0.7;

export function formatTime(ms: number): string {
  const min = Math.round(ms / 60000);
  if (min < 1) return ms > 0 ? 'פחות מדקה' : '—';
  if (min < 60) return `${min} דק'`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} ש' ${m} דק'` : `${h} ש'`;
}

function rate(t: TopicStats | undefined): number | null {
  if (!t || t.answered === 0) return null;
  return t.correctFirst / t.answered;
}

function pct(r: number | null): string {
  return r === null ? '—' : `${Math.round(r * 100)}%`;
}

function rateClass(r: number | null, answered: number): string {
  if (r === null || answered < 5) return '';
  if (r >= 0.8) return 'rate--good';
  if (r >= 0.6) return 'rate--ok';
  return 'rate--low';
}

function lastDays(p: ProgressState, n = 7) {
  const out: { key: string; label: string; ms: number }[] = [];
  const names = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const pad = (x: number) => String(x).padStart(2, '0');
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    out.push({ key, label: i === 0 ? 'היום' : names[d.getDay()], ms: p.days[key] ?? 0 });
  }
  return out;
}

export function ParentsDashboard({ onLock, onChangePin }: { onLock: () => void; onChangePin: () => void }) {
  const p = useProgress();
  const [confirmReset, setConfirmReset] = useState(0);

  const totalFirst = Object.values(p.topics).reduce((s, t) => s + t.correctFirst, 0);
  const totalAnswered = Object.values(p.topics).reduce((s, t) => s + t.answered, 0);
  const starsGot = worlds.reduce((s, w) => s + worldStars(w, p).got, 0);
  const starsTotal = worlds.reduce((s, w) => s + worldStars(w, p).total, 0);
  const badgesGot = badges.filter((b) => p.badges[b.id]).length;
  const daysCount = Object.values(p.days).filter((ms) => ms > 0).length;

  const allTopics = worlds.flatMap((w) => w.topics.map((t) => ({ w, t, s: p.topics[t.id] })));
  const weak = allTopics
    .filter((x) => x.s && x.s.answered >= MIN_ANSWERS && (rate(x.s) ?? 1) < WEAK_RATE)
    .sort((a, b) => (rate(a.s) ?? 0) - (rate(b.s) ?? 0))
    .slice(0, 4);

  const days = lastDays(p);
  const maxDay = Math.max(...days.map((d) => d.ms), 60000);

  return (
    <div className="screen parents">
      <TopBar title="👪 אזור הורים" onBack={onLock} backLabel="יציאה ונעילה" />

      <main className="parents__body">
        {/* ---- summary ---- */}
        <section className="tiles">
          <Tile label="זמן תרגול" value={formatTime(p.practiceMs)} />
          <Tile label="שאלות שנענו" value={String(totalAnswered)} />
          <Tile label="הצלחה בניסיון ראשון" value={pct(totalAnswered ? totalFirst / totalAnswered : null)} />
          <Tile label="כוכבים" value={`${starsGot} / ${starsTotal}`} />
          <Tile label="תגים" value={`${badgesGot} / ${badges.length}`} />
          <Tile label="ימי תרגול" value={String(daysCount)} />
          <Tile label="רצף שיא" value={String(p.bestStreak)} />
        </section>

        {/* ---- last 7 days ---- */}
        <section className="panel">
          <h2>דקות תרגול ב-7 הימים האחרונים</h2>
          <div className="daychart" role="table" aria-label="דקות תרגול לפי יום">
            {days.map((d) => {
              const min = Math.round(d.ms / 60000);
              return (
                <div key={d.key} className="daychart__col" role="row" title={`${d.label}: ${formatTime(d.ms)}`}>
                  <span className="daychart__val" role="cell">
                    {min > 0 ? min : ''}
                  </span>
                  <div className="daychart__track">
                    <div className="daychart__bar" style={{ height: `${(d.ms / maxDay) * 100}%` }} />
                  </div>
                  <span className="daychart__label" role="rowheader">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---- hard topics ---- */}
        <section className="panel">
          <h2>נושאים שכדאי לחזק</h2>
          {weak.length === 0 ? (
            <p className="muted">
              {totalAnswered < 20
                ? 'עוד מוקדם לדעת — צריך עוד קצת תרגול כדי לזהות נושאים קשים.'
                : 'אין כרגע נושא שנראה קשה במיוחד. 👏'}
            </p>
          ) : (
            <ul className="weak-list">
              {weak.map(({ w, t, s }) => (
                <li key={t.id}>
                  <span>
                    {t.icon} <strong>{t.title}</strong> <span className="muted">({w.grade})</span>
                  </span>
                  <span className="rate rate--low">{pct(rate(s))}</span>
                  <button className="btn btn--soft btn--small" onClick={() => go(`/world/${w.id}`)}>
                    לתרגול
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="muted small">
            "הצלחה" = תשובה נכונה כבר בניסיון הראשון. נושא נחשב קשה כשההצלחה מתחת ל-{Math.round(WEAK_RATE * 100)}% (אחרי לפחות {MIN_ANSWERS} שאלות).
          </p>
        </section>

        {/* ---- per topic ---- */}
        {worlds
          .filter((w) => w.topics.length > 0)
          .map((w) => {
            const ws = worldStars(w, p);
            const passed = worldLevels(w).filter((x) => (p.levels[x.level.id]?.stars ?? 0) > 0).length;
            return (
              <section key={w.id} className="panel">
                <h2>
                  {w.icon} {w.grade} · {w.name}
                </h2>
                <p className="muted small">
                  שלבים שעברו: <bdi>{passed}</bdi> מתוך <bdi>{worldLevels(w).length}</bdi> · כוכבים: <bdi>{ws.got}</bdi> מתוך <bdi>{ws.total}</bdi>
                </p>
                <div className="table-wrap">
                  <table className="topic-table">
                    <thead>
                      <tr>
                        <th>נושא</th>
                        <th>שלבים</th>
                        <th>שאלות</th>
                        <th>הצלחה</th>
                        <th>זמן</th>
                      </tr>
                    </thead>
                    <tbody>
                      {w.topics.map((t) => {
                        const s = p.topics[t.id];
                        const done = t.levels.filter((l) => (p.levels[l.id]?.stars ?? 0) > 0).length;
                        const r = rate(s);
                        return (
                          <tr key={t.id}>
                            <td>
                              {t.icon} {t.title}
                            </td>
                            <td>
                              <bdi>{`${done}/${t.levels.length}`}</bdi>
                            </td>
                            <td>{s?.answered ?? 0}</td>
                            <td>
                              <span className={`rate ${rateClass(r, s?.answered ?? 0)}`}>{pct(r)}</span>
                            </td>
                            <td>{formatTime(s?.timeMs ?? 0)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}

        {/* ---- settings ---- */}
        <section className="panel">
          <h2>הגדרות</h2>
          <div className="settings">
            <label className="setting">
              <input type="checkbox" checked={!p.settings.muted} onChange={(e) => setMuted(!e.target.checked)} />
              צלילים במשחק
            </label>
            <button className="btn btn--soft" onClick={onChangePin}>
              🔑 שינוי קוד הורים
            </button>
            {confirmReset === 0 ? (
              <button className="btn btn--danger" onClick={() => setConfirmReset(1)}>
                🗑️ איפוס כל ההתקדמות
              </button>
            ) : (
              <div className="confirm">
                <p>
                  <strong>בטוחים?</strong> כל הכוכבים, התגים והסטטיסטיקות יימחקו מהמכשיר הזה, ואי אפשר לשחזר אותם.
                </p>
                <div className="results__actions">
                  <button
                    className="btn btn--danger"
                    onClick={() => {
                      resetProgress();
                      setConfirmReset(0);
                    }}
                  >
                    כן, למחוק הכול
                  </button>
                  <button className="btn btn--soft" onClick={() => setConfirmReset(0)}>
                    ביטול
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="muted small">
            {isPersistent()
              ? 'ההתקדמות נשמרת בדפדפן של המכשיר הזה בלבד. במכשיר אחר תתחיל התקדמות נפרדת.'
              : '⚠️ הדפדפן הזה חוסם שמירה — ההתקדמות תימחק כשסוגרים את הדף.'}
          </p>
        </section>

        <button className="btn btn--go" onClick={onLock}>
          🔒 נעילה וחזרה למשחק
        </button>
      </main>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="tile">
      <div className="tile__value">
        {/* "6 / 150" must read left-to-right; values with Hebrew words stay right-to-left */}
        <bdi dir={/[֐-׿]/.test(value) ? 'rtl' : 'ltr'}>{value}</bdi>
      </div>
      <div className="tile__label">{label}</div>
    </div>
  );
}
