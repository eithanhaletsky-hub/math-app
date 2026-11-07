import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { findLevel } from '../content/worlds';
import type { Question } from '../content/types';
import { buildRound, pointsFor, starsFor } from '../engine/session';
import { isUnlocked, worldLevels } from '../engine/unlock';
import { finishLevel, getProgress, recordAnswer, type AnswerResult, type Stars as StarCount } from '../storage/progress';
import { go } from '../app/router';
import { TopBar } from '../components/TopBar';
import { Mascot, MascotSays, type Mood } from '../components/Mascot';
import { MathText, RichText } from '../components/RichText';
import { VisualView } from '../components/visuals/VisualView';
import { ExerciseView } from '../components/exercises/ExerciseView';
import { Confetti } from '../components/Confetti';
import { Stars } from '../components/Stars';
import { sound } from '../ui/sound';
import { checkBadges } from '../engine/badges';
import { findBadge } from '../content/badges';
import { BadgeIcon } from '../components/BadgeToaster';
import { pushBadgeToasts } from '../ui/toasts';
import { AFTER_FAIL, ENCOURAGE, PRAISE, PRAISE_SECOND, resultLine, say } from '../ui/phrases';

type Status = 'answering' | 'hint' | 'right' | 'failed';

export function LevelScreen({ levelId }: { levelId: string }) {
  const ref = findLevel(levelId);
  if (!ref) {
    return (
      <div className="screen center">
        <MascotSays mood="oops">לא מצאתי את השלב הזה.</MascotSays>
        <button className="btn" onClick={() => go('/')}>
          למפה
        </button>
      </div>
    );
  }
  return <LevelGame key={levelId} levelId={levelId} />;
}

function LevelGame({ levelId }: { levelId: string }) {
  const { world, topic, level } = findLevel(levelId)!;
  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>('intro');
  const [round, setRound] = useState(0);
  const questions = useMemo<Question[]>(() => buildRound(level), [level, round]);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>('answering');
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [line, setLine] = useState('');
  const [burst, setBurst] = useState(0);
  const [final, setFinal] = useState<{ score: number; stars: StarCount } | null>(null);
  const [roundBadges, setRoundBadges] = useState<string[]>([]);
  const shownAt = useRef(Date.now());

  const q = questions[index];
  const list = worldLevels(world);
  const pos = list.findIndex((x) => x.level.id === level.id);
  const nextRef = list[pos + 1];
  const locked = !isUnlocked(world, level.id, getProgress());

  useEffect(() => {
    shownAt.current = Date.now();
  }, [index, phase]);

  const awardNow = useCallback(() => {
    const fresh = checkBadges();
    if (fresh.length) {
      pushBadgeToasts(fresh);
      setRoundBadges((b) => [...b, ...fresh]);
      setTimeout(() => sound.badge(), 350);
    }
  }, []);

  const finishQuestion = useCallback(
    (result: AnswerResult) => {
      recordAnswer(topic.id, result, Date.now() - shownAt.current);
      setResults((r) => [...r, result]);
      awardNow();
    },
    [topic.id, awardNow],
  );

  const onSubmit = useCallback(
    (correct: boolean) => {
      if (status === 'right' || status === 'failed') return;
      if (correct) {
        const first = status === 'answering';
        setStatus('right');
        setLine(say(first ? PRAISE : PRAISE_SECOND));
        setBurst((b) => b + 1);
        sound.correct();
        finishQuestion(first ? 'first' : 'second');
      } else if (status === 'answering') {
        setStatus('hint');
        setLine(say(ENCOURAGE));
        sound.wrong();
      } else {
        setStatus('failed');
        setLine(say(AFTER_FAIL));
        sound.wrong();
        finishQuestion('failed');
      }
    },
    [status, finishQuestion],
  );

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setStatus('answering');
      setLine('');
      return;
    }
    const all = results;
    const score = all.reduce((s, r) => s + pointsFor(r), 0) / questions.length;
    const stars = starsFor(score);
    finishLevel(level.id, score, stars);
    awardNow();
    setFinal({ score, stars });
    setPhase('done');
    if (stars > 0) sound.win();
  };

  const restart = () => {
    setRound((r) => r + 1);
    setIndex(0);
    setStatus('answering');
    setResults([]);
    setLine('');
    setFinal(null);
    setRoundBadges([]);
    setPhase('play');
  };

  const themeStyle = {
    '--accent': world.theme.accent,
    '--accent-dark': world.theme.accentDark,
    '--soft': world.theme.soft,
    background: world.theme.bg,
  } as React.CSSProperties;

  const back = () => go(`/world/${world.id}`);

  // ----- intro -----
  if (phase === 'intro') {
    return (
      <div className="screen level" style={themeStyle}>
        <TopBar title={`${topic.icon} ${topic.title}`} onBack={back} />
        <main className="card intro">
          <h2 className="intro__title">{level.title}</h2>
          {locked && <p className="note">💡 השלב הזה עוד נעול במסלול, אבל אפשר לנסות אותו.</p>}
          <div className="intro__body">
            <Mascot mood="wave" size={96} />
            <div className="bubble bubble--big">
              {level.intro.lines.map((l, i) => (
                <p key={i}>
                  <RichText text={l} />
                </p>
              ))}
            </div>
          </div>
          {level.intro.expr && (
            <div className="expr">
              <MathText>{level.intro.expr}</MathText>
            </div>
          )}
          {level.intro.visual && (
            <div className="visual">
              <VisualView v={level.intro.visual} />
            </div>
          )}
          <button className="btn btn--go btn--big" onClick={() => setPhase('play')}>
            בוא נתרגל! ⭐
          </button>
        </main>
      </div>
    );
  }

  // ----- results -----
  if (phase === 'done' && final) {
    const firstTry = results.filter((r) => r === 'first').length;
    return (
      <div className="screen level" style={themeStyle}>
        {final.stars > 0 && <Confetti pieces={90} />}
        <TopBar title={`${topic.icon} ${topic.title}`} onBack={back} />
        <main className="card results">
          <h2>{level.title}</h2>
          <Stars count={final.stars} size="lg" />
          <MascotSays mood={final.stars > 0 ? 'cheer' : 'think'}>{resultLine(final.stars)}</MascotSays>
          <p className="results__detail">
            ענית נכון בניסיון הראשון על <MathText>{`${firstTry}`}</MathText> מתוך <MathText>{`${questions.length}`}</MathText> שאלות.
          </p>
          {roundBadges.length > 0 && (
            <div className="results__badges">
              <p>תגים חדשים בסבב הזה:</p>
              <div className="results__badge-list">
                {roundBadges.map((id) => {
                  const b = findBadge(id);
                  return b ? (
                    <span key={id} className="results__badge">
                      <BadgeIcon icon={b.icon} earned />
                      {b.title}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
          <div className="results__actions">
            {final.stars > 0 && nextRef && (
              <button className="btn btn--go btn--big" onClick={() => go(`/play/${nextRef.level.id}`)}>
                לשלב הבא ←
              </button>
            )}
            <button className="btn" onClick={restart}>
              🔄 שוב
            </button>
            <button className="btn btn--soft" onClick={back}>
              🗺️ למסלול
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ----- play -----
  const done = status === 'right' || status === 'failed';
  const mood: Mood = status === 'right' ? 'cheer' : status === 'hint' ? 'think' : status === 'failed' ? 'oops' : 'happy';

  return (
    <div className="screen level" style={themeStyle}>
      {burst > 0 && status === 'right' && <Confetti key={burst} pieces={28} />}
      <TopBar title={`${topic.icon} ${level.title}`} onBack={back} backLabel="יציאה מהשלב">
        <div className="progress-dots" aria-label={`שאלה ${index + 1} מתוך ${questions.length}`}>
          {questions.map((_, i) => (
            <span
              key={i}
              className={`dot ${i < results.length ? `dot--${results[i]}` : ''} ${i === index ? 'dot--current' : ''}`}
            />
          ))}
        </div>
      </TopBar>
      <main className="card question" key={index}>
        <p className="question__text">
          <RichText text={q.text} />
        </p>
        {q.expr && (
          <div className="expr">
            <MathText>{q.expr}</MathText>
          </div>
        )}
        {q.visual && (
          <div className="visual">
            <VisualView v={q.visual} />
          </div>
        )}
        <ExerciseView q={q} locked={done} reveal={status === 'failed'} onSubmit={onSubmit} />
      </main>

      <div className={`feedback feedback--${status}`} aria-live="polite">
        <Mascot mood={mood} size={72} />
        <div className="feedback__body">
          {status === 'answering' && <p className="feedback__idle">אני כאן אם תצטרך 🙂</p>}
          {status !== 'answering' && <p className="feedback__line">{line}</p>}
          {status === 'hint' && (
            <p className="feedback__hint">
              <RichText text={q.hint} />
            </p>
          )}
          {status === 'failed' && (
            <>
              <p className="feedback__hint">
                <RichText text={q.explain} />
              </p>
              {q.explainVisual && (
                <div className="visual visual--small">
                  <VisualView v={q.explainVisual} />
                </div>
              )}
            </>
          )}
        </div>
        {done && (
          <button className="btn btn--go feedback__next" onClick={next} autoFocus>
            {index + 1 < questions.length ? 'הבא ←' : 'סיום 🏁'}
          </button>
        )}
      </div>
    </div>
  );
}
