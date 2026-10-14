// 音效：全部用 Web Audio 即時合成，不需要任何音檔。

let ctx: AudioContext | null = null;
let enabled = true;

export function setSfxEnabled(on: boolean) {
  enabled = on;
}

function ac(): AudioContext | null {
  if (!enabled || typeof window === 'undefined') return null;
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'triangle', vol = 0.16, slideTo?: number) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + start;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

const semi = (n: number) => Math.pow(2, n / 12);

export const sfx = {
  tap: () => tone(520, 0, 0.05, 'sine', 0.06),
  /** 連擊越高音越高，到一個八度為止 */
  correct: (combo = 0) => {
    const k = semi(Math.min(combo, 12));
    tone(660 * k, 0, 0.1);
    tone(880 * k, 0.09, 0.16);
  },
  wrong: () => {
    tone(220, 0, 0.16, 'sawtooth', 0.09, 150);
    tone(160, 0.12, 0.22, 'sawtooth', 0.08, 110);
  },
  pop: () => tone(740, 0, 0.07, 'sine', 0.12, 1100),
  coin: () => {
    tone(1320, 0, 0.07, 'square', 0.05);
    tone(1760, 0.06, 0.14, 'square', 0.05);
  },
  complete: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.22)),
  fail: () => [392, 330, 262].forEach((f, i) => tone(f, i * 0.14, 0.26, 'triangle', 0.12)),
  rankUp: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.3, 'triangle', 0.15));
    [1047, 1319, 1568].forEach((f) => tone(f, 0.5, 0.7, 'sine', 0.09));
  },
  tick: () => tone(1000, 0, 0.03, 'square', 0.03),
  /** 連擊里程碑：等級越高號角越長 */
  combo: (level: number) => {
    const notes = [523, 659, 784, 1047, 1319, 1568].slice(0, 3 + Math.min(3, level));
    notes.forEach((f, i) => tone(f, i * 0.07, 0.18, 'square', 0.07));
    tone(notes[notes.length - 1] * 2, notes.length * 0.07, 0.35, 'triangle', 0.08);
  },
  sparkle: () => [1568, 2093, 2637].forEach((f, i) => tone(f, i * 0.05, 0.12, 'sine', 0.05)),
  /** 開寶箱：木箱咚一聲＋叮叮叮 */
  chest: () => {
    tone(140, 0, 0.18, 'triangle', 0.18, 90);
    [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, 0.18 + i * 0.08, 0.2, 'triangle', 0.09));
  },
  /** 發現彩蛋：上行琶音 */
  secret: () => {
    [523, 784, 1047, 1319, 1568, 2093].forEach((f, i) => tone(f, i * 0.06, 0.28, 'sine', 0.08));
    tone(3136, 0.42, 0.5, 'sine', 0.04);
  },
  firework: () => tone(180, 0, 0.35, 'sawtooth', 0.05, 60),
  /** 喵～：音高先升後降的鋸齒波，經過低通濾波比較像貓叫 */
  meow: () => {
    const a = ac();
    if (!a) return;
    const t0 = a.currentTime;
    const osc = a.createOscillator();
    const filter = a.createBiquadFilter();
    const gain = a.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(560, t0);
    osc.frequency.linearRampToValueAtTime(880, t0 + 0.16);
    osc.frequency.linearRampToValueAtTime(620, t0 + 0.5);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t0);
    filter.frequency.linearRampToValueAtTime(2600, t0 + 0.18);
    filter.frequency.linearRampToValueAtTime(900, t0 + 0.5);
    filter.Q.value = 6;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
    osc.connect(filter).connect(gain).connect(a.destination);
    osc.start(t0);
    osc.stop(t0 + 0.6);
  },
};
