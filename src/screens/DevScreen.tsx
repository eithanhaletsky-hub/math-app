import { useState } from 'react';
import type { Question } from '../content/types';
import { ExerciseView } from '../components/exercises/ExerciseView';
import { RichText } from '../components/RichText';
import { VisualView } from '../components/visuals/VisualView';
import { Mascot } from '../components/Mascot';
import { TopBar } from '../components/TopBar';
import { go } from '../app/router';

/** Hidden gallery (#/dev) to try every exercise type and visual. Not linked from the UI. */
const SAMPLES: Question[] = [
  {
    kind: 'fraction',
    text: 'צבע [[3/4]] מהעיגול.',
    shape: 'circle',
    parts: 4,
    answer: 3,
    hint: '',
    explain: '',
  },
  { kind: 'fraction', text: 'צבע [[2/5]] מהמלבן.', shape: 'bar', parts: 5, answer: 2, hint: '', explain: '' },
  {
    kind: 'clock',
    text: 'הזז את המחוגים ל-[[4:30]].',
    answer: { hour: 4, minute: 30 },
    minuteStep: 5,
    hint: '',
    explain: '',
  },
  { kind: 'numberline', text: 'סמן [[0.7]]', min: 0, max: 1, step: 0.1, labelEvery: 0.5, answer: 0.7, hint: '', explain: '' },
  { kind: 'input', text: 'הקלד [[2.5]]', answer: 2.5, decimal: true, hint: '', explain: '' },
];

export function DevScreen() {
  const [log, setLog] = useState<string[]>([]);
  return (
    <div className="screen" style={{ background: '#f8f9fa' }}>
      <TopBar title="גלריית רכיבים" onBack={() => go('/')} />
      <main className="dev">
        <div className="dev__row">
          {(['happy', 'cheer', 'think', 'oops', 'wave'] as const).map((m) => (
            <Mascot key={m} mood={m} size={80} />
          ))}
        </div>
        <div className="card visual">
          <VisualView v={{ type: 'blocks', hundreds: 2, tens: 3, ones: 4 }} />
        </div>
        <div className="card visual">
          <VisualView v={{ type: 'hundred', highlight: [23, 33, 43], hidden: [57] }} />
        </div>
        <div className="card visual">
          <VisualView v={{ type: 'ruler', length: 7 }} />
        </div>
        {SAMPLES.map((q, i) => (
          <div key={i} className="card question">
            <p className="question__text">
              <RichText text={q.text} />
            </p>
            <ExerciseView q={q} locked={false} reveal={false} onSubmit={(ok) => setLog((l) => [`#${i}: ${ok}`, ...l])} />
          </div>
        ))}
        <pre dir="ltr">{log.join('\n')}</pre>
      </main>
    </div>
  );
}
