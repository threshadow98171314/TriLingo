// 特效引擎：一張全螢幕 canvas 畫所有粒子（彩帶、星星、花瓣、落葉、雪花、金幣…），
// 另外提供幾個 DOM 特效（浮動文字、大橫幅、畫面震動、閃光、彩虹模式）。
// 沒有粒子時動畫迴圈會完全停止；設定關閉特效或系統要求「減少動態效果」時一律不播。

type Shape = 'rect' | 'circle' | 'star' | 'spark' | 'glyph' | 'petal' | 'coin' | 'snow' | 'glow';

interface Particle {
  x: number;
  y: number;
  /** 速度（px／毫秒） */
  vx: number;
  vy: number;
  /** 重力（px／毫秒²） */
  g: number;
  /** 每 16 毫秒保留的速度比例 */
  drag: number;
  rot: number;
  vr: number;
  size: number;
  life: number;
  /** 小於 0 表示還在等待出場 */
  age: number;
  color: string;
  shape: Shape;
  glyph?: string;
  /** 左右飄動的幅度與頻率（花瓣、雪花） */
  sway?: number;
  swayFreq?: number;
  phase?: number;
  /** 翻轉速度（花瓣、金幣的立體感） */
  flip?: number;
  fadeIn?: number;
  /** 飛向目標（金幣飛進錢包） */
  target?: { x: number; y: number };
  onArrive?: () => void;
  onDeath?: (p: Particle) => void;
}

export type AmbientKind = 'leaf' | 'sakura' | 'snow' | 'halloween' | 'firefly';

const PALETTE = ['#8f7cff', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#ff8a1f', '#ffffff'];
const GOLD = ['#ffe066', '#fbbf24', '#f59e0b', '#fff3b0'];
const MAX_PARTICLES = 700;

let enabled = true;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let W = 0;
let H = 0;
let dpr = 1;
let raf = 0;
let last = 0;
const parts: Particle[] = [];
let ambient: { kind: AmbientKind; acc: number } | null = null;

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];

function reducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** 目前能不能播特效 */
export function fxOn(): boolean {
  return enabled && typeof document !== 'undefined' && !reducedMotion();
}

export function setFxEnabled(on: boolean) {
  enabled = on;
  if (!fxOn()) {
    parts.length = 0;
    ambient = null;
    ctx?.clearRect(0, 0, W, H);
  }
}

function resize() {
  if (!canvas) return;
  dpr = Math.min(2, window.devicePixelRatio || 1);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function ensureCanvas(): boolean {
  if (!fxOn()) return false;
  if (canvas) return true;
  canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
  return !!ctx;
}

function start() {
  if (raf) return;
  last = performance.now();
  raf = requestAnimationFrame(loop);
}

function add(p: Partial<Particle> & Pick<Particle, 'x' | 'y' | 'shape'>) {
  if (parts.length >= MAX_PARTICLES) return;
  parts.push({
    vx: 0,
    vy: 0,
    g: 0,
    drag: 1,
    rot: 0,
    vr: 0,
    size: 6,
    life: 1000,
    age: 0,
    color: '#fff',
    ...p,
  });
}

// emoji 每一格都 fillText 很耗效能：先畫到小 canvas 上快取
const glyphCache = new Map<string, HTMLCanvasElement>();
function glyphImage(g: string): HTMLCanvasElement {
  let c = glyphCache.get(g);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d')!;
  x.font = '48px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(g, 32, 36);
  glyphCache.set(g, c);
  return c;
}

function starPath(c: CanvasRenderingContext2D, r: number) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.45 : r;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  c.closePath();
}

function draw(c: CanvasRenderingContext2D, p: Particle) {
  const t = p.age;
  let alpha = 1;
  if (p.fadeIn) alpha = Math.min(1, t / p.fadeIn);
  if (t > p.life * 0.75) alpha *= Math.max(0, (p.life - t) / (p.life * 0.25));
  if (alpha <= 0) return;
  const x = p.x + (p.sway ? Math.sin((p.phase ?? 0) + t * (p.swayFreq ?? 0.002)) * p.sway : 0);
  const s = p.size;
  c.save();
  c.globalAlpha = alpha;
  if (p.shape === 'spark') {
    c.strokeStyle = p.color;
    c.lineWidth = Math.max(1, s / 3);
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(x, p.y);
    c.lineTo(x - p.vx * 28, p.y - p.vy * 28);
    c.stroke();
    c.restore();
    return;
  }
  c.translate(x, p.y);
  c.rotate(p.rot);
  switch (p.shape) {
    case 'rect':
      c.fillStyle = p.color;
      c.fillRect(-s / 2, -s * 0.32, s, s * 0.64);
      break;
    case 'circle':
      c.fillStyle = p.color;
      c.beginPath();
      c.arc(0, 0, s / 2, 0, Math.PI * 2);
      c.fill();
      break;
    case 'glow': {
      c.globalCompositeOperation = 'lighter';
      const gr = c.createRadialGradient(0, 0, 0, 0, 0, s);
      gr.addColorStop(0, p.color);
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = gr;
      c.beginPath();
      c.arc(0, 0, s, 0, Math.PI * 2);
      c.fill();
      break;
    }
    case 'star':
      c.fillStyle = p.color;
      starPath(c, s / 2);
      c.fill();
      break;
    case 'snow':
      c.fillStyle = 'rgba(255,255,255,0.92)';
      c.beginPath();
      c.arc(0, 0, s / 2, 0, Math.PI * 2);
      c.fill();
      break;
    case 'petal': {
      // 櫻花瓣：上下翻轉營造飄落的立體感
      c.scale(1, 0.35 + Math.abs(Math.sin(t * (p.flip ?? 0.004))) * 0.65);
      c.fillStyle = p.color;
      c.beginPath();
      c.moveTo(0, -s / 2);
      c.bezierCurveTo(s / 2, -s / 2, s / 2, s / 3, 0, s / 2);
      c.bezierCurveTo(-s / 2, s / 3, -s / 2, -s / 2, 0, -s / 2);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,0.35)';
      c.beginPath();
      c.ellipse(-s * 0.1, -s * 0.12, s * 0.12, s * 0.22, 0, 0, Math.PI * 2);
      c.fill();
      break;
    }
    case 'coin': {
      // 金幣：左右壓扁模擬旋轉
      c.scale(Math.max(0.15, Math.abs(Math.cos(t * (p.flip ?? 0.012)))), 1);
      const gr = c.createRadialGradient(-s * 0.15, -s * 0.2, s * 0.05, 0, 0, s / 2);
      gr.addColorStop(0, '#fff6c2');
      gr.addColorStop(0.55, '#f7c531');
      gr.addColorStop(1, '#c98a00');
      c.fillStyle = gr;
      c.beginPath();
      c.arc(0, 0, s / 2, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = 'rgba(160,100,0,0.7)';
      c.lineWidth = Math.max(1, s / 10);
      c.beginPath();
      c.arc(0, 0, s * 0.33, 0, Math.PI * 2);
      c.stroke();
      break;
    }
    case 'glyph':
      c.drawImage(glyphImage(p.glyph ?? '⭐'), -s / 2, -s / 2, s, s);
      break;
  }
  c.restore();
}

function spawnAmbient(dt: number) {
  if (!ambient) return;
  const rate = { leaf: 0.5, sakura: 0.9, snow: 2.2, halloween: 0.6, firefly: 0.8 }[ambient.kind];
  // 背景粒子數量設上限，避免長時間開著越積越多
  const live = parts.filter((p) => p.life > 9000).length;
  ambient.acc += (dt / 1000) * rate;
  while (ambient.acc >= 1) {
    ambient.acc -= 1;
    if (live > 28) continue;
    const k = ambient.kind;
    if (k === 'firefly') {
      add({
        shape: 'glow',
        x: rand(0, W),
        y: rand(H * 0.3, H),
        vx: rand(-0.01, 0.01),
        vy: rand(-0.015, -0.004),
        size: rand(5, 9),
        color: pick(['rgba(214,255,120,0.9)', 'rgba(255,240,140,0.9)']),
        life: 10000,
        fadeIn: 1500,
        sway: rand(10, 30),
        swayFreq: rand(0.0008, 0.0016),
        phase: rand(0, 6),
      });
      continue;
    }
    const base = { x: rand(-20, W + 20), y: -30, life: 16000, fadeIn: 600, phase: rand(0, 6), vr: rand(-0.002, 0.002), rot: rand(0, 6) };
    if (k === 'snow') add({ ...base, shape: 'snow', vy: rand(0.025, 0.06), size: rand(2, 5), sway: rand(10, 30), swayFreq: rand(0.001, 0.002) });
    else if (k === 'sakura')
      add({ ...base, shape: 'petal', vy: rand(0.03, 0.06), vx: rand(0.005, 0.025), size: rand(9, 14), color: pick(['#ffc6d9', '#ffb3cc', '#ffd9e6']), sway: rand(20, 45), swayFreq: rand(0.0012, 0.0024), flip: rand(0.002, 0.005) });
    else {
      const glyphs = k === 'halloween' && Math.random() < 0.4 ? ['🎃', '🦇'] : ['🍁', '🍂'];
      add({ ...base, shape: 'glyph', glyph: pick(glyphs), vy: rand(0.03, 0.055), size: rand(16, 24), sway: rand(25, 50), swayFreq: rand(0.0008, 0.0016) });
    }
  }
}

function loop(now: number) {
  raf = 0;
  if (!ctx || !fxOn()) {
    parts.length = 0;
    return;
  }
  const dt = Math.min(50, now - last);
  last = now;
  spawnAmbient(dt);
  ctx.clearRect(0, 0, W, H);
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.age += dt;
    if (p.age < 0) continue;
    if (p.target) {
      // 飛向目標：越飛越用力被吸過去
      const dx = p.target.x - p.x;
      const dy = p.target.y - p.y;
      const k = 0.00002 * dt * (1 + p.age / 120);
      p.vx = (p.vx + dx * k) * Math.pow(0.88, dt / 16);
      p.vy = (p.vy + dy * k) * Math.pow(0.88, dt / 16);
      if (Math.hypot(dx, dy) < 18 || p.age > p.life) {
        parts.splice(i, 1);
        p.onArrive?.();
        continue;
      }
    } else {
      p.vy += p.g * dt;
      if (p.drag !== 1) {
        const d = Math.pow(p.drag, dt / 16);
        p.vx *= d;
        p.vy *= d;
      }
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    const gone = p.age > p.life || (p.life > 9000 && (p.y > H + 60 || p.y < -80));
    if (gone) {
      parts.splice(i, 1);
      p.onDeath?.(p);
      continue;
    }
    draw(ctx, p);
  }
  if (parts.length || ambient) raf = requestAnimationFrame(loop);
  else ctx.clearRect(0, 0, W, H);
}

// ───────── 粒子特效 ─────────

export interface BurstOptions {
  count?: number;
  colors?: string[];
  shapes?: Shape[];
  glyphs?: string[];
  speed?: number;
  size?: [number, number];
  life?: [number, number];
  gravity?: number;
}

/** 從一個點爆開 */
function burst(x: number, y: number, o: BurstOptions = {}) {
  if (!ensureCanvas()) return;
  const n = o.count ?? 18;
  const shapes = o.shapes ?? (o.glyphs ? ['glyph'] : ['star', 'circle', 'spark']);
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2);
    const sp = (o.speed ?? 0.3) * rand(0.4, 1);
    const shape = pick(shapes);
    add({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 0.05,
      g: o.gravity ?? 0.0006,
      drag: 0.96,
      size: rand(...(o.size ?? [4, 9])) * (shape === 'glyph' ? 2.6 : 1),
      life: rand(...(o.life ?? [550, 950])),
      color: pick(o.colors ?? PALETTE),
      shape,
      glyph: o.glyphs ? pick(o.glyphs) : undefined,
      rot: rand(0, 6),
      vr: rand(-0.01, 0.01),
    });
  }
  start();
}

function centerOf(el: Element | null | undefined): { x: number; y: number } | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!r.width && !r.height) return null;
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** 兩側噴出彩帶 */
function confetti(count = 120) {
  if (!ensureCanvas()) return;
  for (let i = 0; i < count; i++) {
    const left = i % 2 === 0;
    const a = (left ? -Math.PI / 3 : (-2 * Math.PI) / 3) + rand(-0.45, 0.45);
    const sp = rand(0.55, 1.15);
    add({
      x: left ? W * 0.12 : W * 0.88,
      y: H * 0.62,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      g: 0.0013,
      drag: 0.985,
      size: rand(7, 12),
      life: rand(1800, 2600),
      color: pick(PALETTE),
      shape: Math.random() < 0.8 ? 'rect' : 'star',
      rot: rand(0, 6),
      vr: rand(-0.02, 0.02),
    });
  }
  start();
}

/** 煙火：火箭往上飛，到頂點炸開 */
function fireworks(shells = 4, colors: string[] = PALETTE) {
  if (!ensureCanvas()) return;
  for (let i = 0; i < shells; i++) {
    const x = rand(W * 0.15, W * 0.85);
    const peak = rand(H * 0.12, H * 0.4);
    const life = rand(650, 900);
    add({
      x,
      y: H + 10,
      vx: rand(-0.04, 0.04),
      vy: -(H + 10 - peak) / life,
      size: 4,
      life,
      age: -i * 380,
      color: '#fff6c2',
      shape: 'spark',
      onDeath: (p) => {
        const c = pick(colors);
        burst(p.x, p.y, { count: 46, colors: [c, c, '#ffffff'], shapes: ['circle', 'glow'], speed: 0.42, size: [3, 6], life: [900, 1400], gravity: 0.00025 });
      },
    });
  }
  start();
}

export type RainKind = 'sakura' | 'leaf' | 'snow' | 'heart' | 'coin' | 'star' | 'cat' | 'emoji';

/** 從畫面上方（愛心從下方）下一場雨 */
function rain(kind: RainKind, o: { count?: number; glyphs?: string[]; duration?: number } = {}) {
  if (!ensureCanvas()) return;
  const n = o.count ?? 70;
  const spread = o.duration ?? 2200;
  for (let i = 0; i < n; i++) {
    const age = -rand(0, spread);
    if (kind === 'heart') {
      add({ shape: 'glyph', glyph: pick(o.glyphs ?? ['💗', '💖', '💕']), x: rand(0, W), y: H + 30, vy: -rand(0.12, 0.22), size: rand(20, 34), life: 5200, age, sway: rand(15, 40), swayFreq: rand(0.002, 0.004), phase: rand(0, 6), fadeIn: 200 });
      continue;
    }
    const base = { x: rand(0, W), y: -40, life: 6000, age, phase: rand(0, 6), rot: rand(0, 6), vr: rand(-0.004, 0.004), fadeIn: 150 };
    if (kind === 'sakura') add({ ...base, shape: 'petal', vy: rand(0.08, 0.16), vx: rand(0.01, 0.05), size: rand(10, 16), color: pick(['#ffc6d9', '#ffb3cc', '#ffd9e6', '#ff9fbf']), sway: rand(25, 55), swayFreq: rand(0.0015, 0.003), flip: rand(0.003, 0.006) });
    else if (kind === 'snow') add({ ...base, shape: 'snow', vy: rand(0.06, 0.12), size: rand(3, 7), sway: rand(10, 30), swayFreq: rand(0.001, 0.002) });
    else if (kind === 'coin') add({ ...base, shape: 'coin', vy: rand(0.15, 0.3), g: 0.0004, size: rand(16, 24), flip: rand(0.008, 0.016), life: 3500 });
    else if (kind === 'star') add({ ...base, shape: 'star', vy: rand(0.12, 0.25), g: 0.0002, size: rand(8, 16), color: pick(GOLD), life: 4000 });
    else {
      const glyphs = o.glyphs ?? (kind === 'leaf' ? ['🍁', '🍂'] : kind === 'cat' ? ['🐱', '😺', '😸', '😻'] : ['⭐']);
      add({ ...base, shape: 'glyph', glyph: pick(glyphs), vy: rand(0.1, 0.2), size: rand(22, 34), sway: rand(20, 45), swayFreq: rand(0.0015, 0.003), life: 5000 });
    }
  }
  start();
}

/** 金幣從某處飛進目標（例如導覽列的錢包），每一枚抵達時呼叫 onEach */
function coinsTo(from: Element | { x: number; y: number } | null, to: Element | null, count: number, onEach?: () => void) {
  const a = from instanceof Element ? centerOf(from) : from;
  const b = centerOf(to);
  if (!a || !b || !ensureCanvas()) return false;
  const n = Math.max(3, Math.min(14, count));
  for (let i = 0; i < n; i++) {
    const ang = rand(0, Math.PI * 2);
    add({
      shape: 'coin',
      x: a.x,
      y: a.y,
      vx: Math.cos(ang) * rand(0.15, 0.35),
      vy: Math.sin(ang) * rand(0.15, 0.35) - 0.2,
      size: rand(14, 18),
      life: 2200,
      age: -i * 45,
      flip: rand(0.01, 0.02),
      target: b,
      onArrive: onEach,
    });
  }
  start();
  return true;
}

let ambientKind: AmbientKind | null = null;
/** 背景持續飄落的季節粒子；null 表示關閉 */
function setAmbient(kind: AmbientKind | null) {
  if (kind === ambientKind && (!kind || ambient)) return;
  ambientKind = kind;
  if (!kind) {
    ambient = null;
    // 讓已經在畫面上的背景粒子自然消失：縮短壽命
    for (const p of parts) if (p.life > 9000) p.life = Math.min(p.life, p.age + 1500);
    return;
  }
  if (!ensureCanvas()) return;
  ambient = { kind, acc: 0.6 };
  start();
}

// ───────── DOM 特效 ─────────

function layer(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  let el = document.getElementById('fx-layer');
  if (!el) {
    el = document.createElement('div');
    el.id = 'fx-layer';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }
  return el;
}

/** 從某處往上飄的文字（例如「+1 XP」） */
function floatText(x: number, y: number, text: string, cls = '') {
  if (!fxOn()) return;
  const el = document.createElement('div');
  el.className = `fx-float ${cls}`;
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  layer()?.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

/** 畫面中央的大字橫幅（連擊、幸運星、秘技…） */
function banner(title: string, sub = '', tone: 'combo' | 'gold' | 'rainbow' | 'love' = 'combo') {
  if (!fxOn()) return;
  const root = layer();
  root?.querySelector('.fx-banner')?.remove();
  const el = document.createElement('div');
  el.className = `fx-banner tone-${tone}`;
  const b = document.createElement('b');
  b.textContent = title;
  el.appendChild(b);
  if (sub) {
    const s = document.createElement('small');
    s.textContent = sub;
    el.appendChild(s);
  }
  root?.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function restartClass(el: Element, cls: string, ms: number) {
  el.classList.remove(cls);
  void (el as HTMLElement).offsetWidth; // 重新觸發 CSS 動畫
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}

/** 畫面震動：1 輕微（答錯）、2 明顯 */
function shake(level: 1 | 2 = 1) {
  if (!fxOn()) return;
  const root = document.getElementById('root');
  if (root) restartClass(root, `fx-shake-${level}`, 500);
}

function flash(color = 'rgba(255,255,255,0.55)') {
  if (!fxOn()) return;
  const el = document.createElement('div');
  el.className = 'fx-flash';
  el.style.background = color;
  layer()?.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

/** 彩虹模式：整個畫面色相輪轉 */
function rainbow(ms = 15000) {
  if (!fxOn()) return;
  const html = document.documentElement;
  html.classList.add('fx-rainbow');
  setTimeout(() => html.classList.remove('fx-rainbow'), ms);
}

/** 讓元素跳一下（例如金幣數字） */
function bump(el: Element | null, cls = 'fx-bump') {
  if (el && fxOn()) restartClass(el, cls, 450);
}

export const fx = {
  burst,
  burstAt(el: Element | null | undefined, o?: BurstOptions) {
    const c = centerOf(el);
    if (c) burst(c.x, c.y, o);
  },
  confetti,
  fireworks,
  rain,
  coinsTo,
  setAmbient,
  floatText,
  floatAt(el: Element | null | undefined, text: string, cls?: string) {
    const c = centerOf(el);
    if (c) floatText(c.x, c.y - 10, text, cls);
  },
  banner,
  shake,
  flash,
  rainbow,
  bump,
};

/** 依日期決定背景的季節特效 */
export function seasonOf(d: Date): AmbientKind | null {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (m === 10 && day >= 25) return 'halloween';
  if (m === 10 || m === 11) return 'leaf';
  if (m === 12 || m === 1 || m === 2) return 'snow';
  if ((m === 3 && day >= 15) || (m === 4 && day <= 15)) return 'sakura';
  if (m === 7 || m === 8) return 'firefly';
  return null;
}

export const SEASON_LABEL: Record<AmbientKind, string> = {
  leaf: '秋天的落葉',
  halloween: '萬聖節',
  snow: '冬天的雪花',
  sakura: '春天的櫻花',
  firefly: '夏夜的螢火蟲',
};
