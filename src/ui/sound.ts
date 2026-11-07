import { getProgress } from '../storage/progress';

/** Short sounds made in code (no audio files). Silent if muted or unsupported. */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (getProgress().settings.muted) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18) {
  const a = audio();
  if (!a) return;
  try {
    const t = a.currentTime + start;
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(a.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  } catch {
    /* ignore */
  }
}

export const sound = {
  tap: () => tone(660, 0, 0.06, 'triangle', 0.08),
  correct: () => {
    tone(784, 0, 0.12, 'triangle');
    tone(1047, 0.1, 0.18, 'triangle');
  },
  wrong: () => {
    tone(330, 0, 0.14, 'sine', 0.12);
    tone(262, 0.12, 0.2, 'sine', 0.12);
  },
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.22, 'triangle'));
    tone(1319, 0.5, 0.4, 'triangle');
  },
  badge: () => {
    [880, 1109, 1319].forEach((f, i) => tone(f, i * 0.09, 0.25, 'sine', 0.15));
  },
};
