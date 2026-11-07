import { useMemo, useState } from 'react';
import { go } from '../app/router';
import { TopBar } from '../components/TopBar';
import { PinPad } from '../components/PinPad';
import { ParentsDashboard } from './ParentsDashboard';
import { setParentPin, useProgress } from '../storage/progress';
import { randInt } from '../content/lib/random';

/** Unlocked until the page is reloaded (kept in memory only). */
let unlocked = false;

type Step = 'enter' | 'create' | 'confirm' | 'forgot';

export function ParentsScreen() {
  const p = useProgress();
  const [open, setOpen] = useState(unlocked);
  const [step, setStep] = useState<Step>(p.parentPin ? 'enter' : 'create');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState(0);
  const [msg, setMsg] = useState('');

  const unlock = () => {
    unlocked = true;
    setOpen(true);
  };

  const lock = () => {
    unlocked = false;
    go('/');
  };

  if (open) return <ParentsDashboard onLock={lock} onChangePin={() => { setOpen(false); setStep('create'); setMsg(''); }} />;

  const onPin = (pin: string) => {
    if (step === 'enter') {
      if (pin === p.parentPin) unlock();
      else {
        setError((e) => e + 1);
        setMsg('הקוד לא נכון. נסו שוב.');
      }
    } else if (step === 'create') {
      setFirstPin(pin);
      setStep('confirm');
      setMsg('');
    } else if (step === 'confirm') {
      if (pin === firstPin) {
        setParentPin(pin);
        unlock();
      } else {
        setStep('create');
        setError((e) => e + 1);
        setMsg('הקודים לא תאמו. בחרו קוד מחדש.');
      }
    }
  };

  const title =
    step === 'enter' ? 'הקלידו את קוד ההורים' : step === 'create' ? 'בחרו קוד הורים בן 4 ספרות' : step === 'confirm' ? 'הקלידו את הקוד שוב לאישור' : '';

  return (
    <div className="screen parents-gate">
      <TopBar title="👪 אזור הורים" onBack={() => go('/')} backLabel="חזרה למשחק" />
      <main className="card center gate">
        {step === 'forgot' ? (
          <ForgotPin
            onSolved={() => {
              setParentPin(null);
              setStep('create');
              setMsg('הקוד נמחק. בחרו קוד חדש.');
            }}
            onCancel={() => setStep('enter')}
          />
        ) : (
          <>
            <h2>{title}</h2>
            {msg && <p className="gate__msg">{msg}</p>}
            <PinPad key={step} onComplete={onPin} error={error} />
            {step === 'enter' && (
              <button className="link-btn" onClick={() => setStep('forgot')}>
                שכחתי את הקוד
              </button>
            )}
            {step !== 'enter' && <p className="gate__note">הקוד שומר על אזור ההורים מלחיצות בטעות של הילד. הוא נשמר רק במכשיר הזה.</p>}
          </>
        )}
      </main>
    </div>
  );
}

/** Resetting the PIN needs an "adult" multiplication question. */
function ForgotPin({ onSolved, onCancel }: { onSolved: () => void; onCancel: () => void }) {
  const [a, b] = useMemo(() => [randInt(13, 49), randInt(13, 29)], []);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  return (
    <form
      className="forgot"
      onSubmit={(e) => {
        e.preventDefault();
        if (Number(value) === a * b) onSolved();
        else setWrong(true);
      }}
    >
      <h2>איפוס קוד ההורים</h2>
      <p>כדי לוודא שאתם מבוגרים, פתרו את התרגיל:</p>
      <div className="expr">
        <bdi dir="ltr" className="math">{`${a} × ${b} = ?`}</bdi>
      </div>
      <input
        className="text-input"
        inputMode="numeric"
        dir="ltr"
        value={value}
        onChange={(e) => {
          setValue(e.target.value.replace(/\D/g, ''));
          setWrong(false);
        }}
        aria-label="תשובה"
        autoFocus
      />
      {wrong && <p className="gate__msg">לא נכון, נסו שוב.</p>}
      <div className="results__actions">
        <button type="submit" className="btn btn--go">
          אישור
        </button>
        <button type="button" className="btn btn--soft" onClick={onCancel}>
          ביטול
        </button>
      </div>
    </form>
  );
}
