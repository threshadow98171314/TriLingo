// 特效引擎：一張全螢幕 canvas 畫所有粒子（彩帶、星星、花瓣、落葉、雪花、金幣…），
// 另外提供幾個 DOM 特效（浮動文字、大橫幅、畫面震動、閃光、彩虹模式）。
// 沒有粒子時動畫迴圈會完全停止；設定關閉特效或系統要求「減少動態效果」時一律不播。

type Shape = 'rect' | 'circle' | 'star' | 'spark' | 'glyph' | 'petal' | 'coin' | 'snow' | 'glow' | 'fan' | 'bubble' | 'text' | 'lantern' | 'plane';

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
  /** 最後多少比例的壽命用來淡出（預設 0.25） */
  fadeOut?: number;
  /** 一閃一閃的頻率（星星、天燈） */
  twinkle?: number;
  /** 線條拖尾的長度倍數（雨滴、流星） */
  tail?: number;
  /** 依照進度 k（0→1）決定位置，用來畫固定路線的飛行特效 */
  path?: (k: number) => { x: number; y: number; rot?: number };
  /** 每一格都會呼叫（飛行特效的拖尾） */
  onTick?: (p: Particle, dt: number) => void;
  /** 飛向目標（金幣飛進錢包） */
  target?: { x: number; y: number };
  onArrive?: () => void;
  onDeath?: (p: Particle) => void;
}

export type AmbientKind =
  | 'leaf'
  | 'sakura'
  | 'snow'
  | 'halloween'
  | 'firefly'
  | 'ginkgo'
  | 'star'
  | 'heart'
  | 'bubble'
  | 'note'
  | 'letter'
  | 'clover'
  | 'sweets'
  | 'rain'
  | 'lantern'
  | 'coin'
  | 'meteor';

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
  const out = p.fadeOut ?? 0.25;
  if (out > 0 && t > p.life * (1 - out)) alpha *= Math.max(0, (p.life - t) / (p.life * out));
  if (p.twinkle) alpha *= 0.4 + 0.6 * Math.abs(Math.sin((p.phase ?? 0) + t * p.twinkle));
  if (alpha <= 0) return;
  const x = p.x + (p.sway ? Math.sin((p.phase ?? 0) + t * (p.swayFreq ?? 0.002)) * p.sway : 0);
  const s = p.size;
  c.save();
  c.globalAlpha = alpha;
  if (p.shape === 'spark') {
    const k = p.tail ?? 28;
    const tx = x - p.vx * k;
    const ty = p.y - p.vy * k;
    if (k >= 60) {
      // 長拖尾（流星）：頭亮尾淡
      const gr = c.createLinearGradient(x, p.y, tx, ty);
      gr.addColorStop(0, p.color);
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      c.strokeStyle = gr;
    } else c.strokeStyle = p.color;
    c.lineWidth = Math.max(1, s / 3);
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(x, p.y);
    c.lineTo(tx, ty);
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
    case 'text':
      // 有顏色的文字（音符、假名、韓文字母）
      c.fillStyle = p.color;
      c.font = `800 ${Math.round(s)}px "Noto Sans JP","Noto Sans KR","Segoe UI",system-ui,sans-serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(p.glyph ?? '♪', 0, 0);
      break;
    case 'fan': {
      // 銀杏葉：兩片扇形，中間有缺口，下面一根葉柄
      c.scale(1, 0.4 + Math.abs(Math.sin(t * (p.flip ?? 0.003))) * 0.6);
      c.fillStyle = p.color;
      const r = s * 0.62;
      for (const [a, b] of [
        [-Math.PI * 0.88, -Math.PI * 0.53],
        [-Math.PI * 0.47, -Math.PI * 0.12],
      ]) {
        c.beginPath();
        c.moveTo(0, s * 0.18);
        c.arc(0, s * 0.18, r, a, b);
        c.closePath();
        c.fill();
      }
      c.strokeStyle = p.color;
      c.lineWidth = Math.max(1, s / 12);
      c.beginPath();
      c.moveTo(0, s * 0.18);
      c.lineTo(s * 0.04, s * 0.55);
      c.stroke();
      break;
    }
    case 'bubble': {
      c.fillStyle = 'rgba(255,255,255,0.12)';
      c.strokeStyle = p.color;
      c.lineWidth = Math.max(1, s / 14);
      c.beginPath();
      c.arc(0, 0, s / 2, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.85)';
      c.lineWidth = Math.max(1, s / 10);
      c.beginPath();
      c.arc(0, 0, s * 0.32, Math.PI * 1.1, Math.PI * 1.45);
      c.stroke();
      break;
    }
    case 'lantern': {
      // 天燈：暖色光暈 + 上寬下窄的燈身
      const halo = c.createRadialGradient(0, 0, 0, 0, 0, s * 1.5);
      halo.addColorStop(0, 'rgba(255,190,90,0.45)');
      halo.addColorStop(1, 'rgba(255,190,90,0)');
      c.fillStyle = halo;
      c.beginPath();
      c.arc(0, 0, s * 1.5, 0, Math.PI * 2);
      c.fill();
      const body = c.createLinearGradient(0, -s * 0.55, 0, s * 0.55);
      body.addColorStop(0, '#ffe08a');
      body.addColorStop(1, '#ff8a3d');
      c.fillStyle = body;
      c.beginPath();
      c.moveTo(-s * 0.42, -s * 0.55);
      c.lineTo(s * 0.42, -s * 0.55);
      c.lineTo(s * 0.3, s * 0.5);
      c.lineTo(-s * 0.3, s * 0.5);
      c.closePath();
      c.fill();
      c.fillStyle = '#fff3b0';
      c.beginPath();
      c.ellipse(0, s * 0.5, s * 0.22, s * 0.07, 0, 0, Math.PI * 2);
      c.fill();
      break;
    }
    case 'plane': {
      // 紙飛機（機頭朝上）
      c.fillStyle = '#ffffff';
      c.strokeStyle = '#7c8db5';
      c.lineWidth = Math.max(1, s / 18);
      c.beginPath();
      c.moveTo(0, -s / 2);
      c.lineTo(s * 0.42, s * 0.45);
      c.lineTo(0, s * 0.22);
      c.lineTo(-s * 0.42, s * 0.45);
      c.closePath();
      c.fill();
      c.stroke();
      c.beginPath();
      c.moveTo(0, -s / 2);
      c.lineTo(0, s * 0.22);
      c.stroke();
      break;
    }
  }
  c.restore();
}

/** 背景粒子每秒產生幾個 */
const AMBIENT_RATE: Record<AmbientKind, number> = {
  leaf: 0.5,
  sakura: 0.9,
  snow: 2.2,
  halloween: 0.6,
  firefly: 0.8,
  ginkgo: 0.6,
  star: 1.1,
  heart: 0.5,
  bubble: 0.7,
  note: 0.6,
  letter: 0.7,
  clover: 0.45,
  sweets: 0.45,
  rain: 16,
  lantern: 0.3,
  coin: 0.5,
  meteor: 0.6,
};

export const AMBIENT_KINDS = Object.keys(AMBIENT_RATE) as AmbientKind[];

/** 產生一個背景粒子；warm 表示直接撒在畫面中（剛換特效時馬上看得到） */
function spawnAmbientOne(k: AmbientKind, warm = false) {
  // 背景粒子一律 life > 9000：用來和一般特效區分、飄出畫面就移除
  const fall = { x: rand(-20, W + 20), y: warm ? rand(0, H * 0.8) : -30, life: 16000, fadeIn: 600, phase: rand(0, 6), vr: rand(-0.002, 0.002), rot: rand(0, 6) };
  const rise = { ...fall, y: warm ? rand(H * 0.25, H) : H + 30, vr: 0, rot: rand(-0.25, 0.25) };
  const glyphFall = (glyphs: string[], size: [number, number] = [16, 24]) =>
    add({ ...fall, shape: 'glyph', glyph: pick(glyphs), vy: rand(0.03, 0.055), size: rand(...size), sway: rand(25, 50), swayFreq: rand(0.0008, 0.0016) });
  switch (k) {
    case 'firefly':
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
      return;
    case 'snow':
      add({ ...fall, shape: 'snow', vy: rand(0.025, 0.06), size: rand(2, 5), sway: rand(10, 30), swayFreq: rand(0.001, 0.002) });
      return;
    case 'sakura':
      add({ ...fall, shape: 'petal', vy: rand(0.03, 0.06), vx: rand(0.005, 0.025), size: rand(9, 14), color: pick(['#ffc6d9', '#ffb3cc', '#ffd9e6']), sway: rand(20, 45), swayFreq: rand(0.0012, 0.0024), flip: rand(0.002, 0.005) });
      return;
    case 'ginkgo':
      add({ ...fall, shape: 'fan', vy: rand(0.03, 0.055), vx: rand(-0.008, 0.012), size: rand(13, 19), color: pick(['#f6c445', '#f2b632', '#ffd862', '#e9a923']), sway: rand(25, 50), swayFreq: rand(0.001, 0.002), flip: rand(0.002, 0.004) });
      return;
    case 'star':
      // 星空：星星在各處亮起、慢慢往下飄、一閃一閃
      add({ ...fall, shape: 'star', x: rand(0, W), y: rand(0, H * 0.9), vy: rand(0.006, 0.016), size: rand(6, 13), color: pick([...GOLD, '#ffffff', '#c4b5ff']), life: rand(9500, 14000), fadeIn: 1500, twinkle: rand(0.0015, 0.004), vr: rand(-0.0008, 0.0008) });
      return;
    case 'heart':
      add({ ...rise, shape: 'glyph', glyph: pick(['💗', '💖', '💕', '💓']), vy: -rand(0.025, 0.045), size: rand(14, 22), sway: rand(15, 35), swayFreq: rand(0.001, 0.002) });
      return;
    case 'bubble':
      add({ ...rise, shape: 'bubble', vy: -rand(0.02, 0.045), size: rand(10, 26), color: pick(['#8fd0ff', '#b9a6ff', '#8fe8d6', '#ffb8d8']), sway: rand(10, 30), swayFreq: rand(0.0012, 0.0024), rot: 0 });
      return;
    case 'note':
      add({ ...rise, shape: 'text', glyph: pick(['♪', '♫', '♩', '♬']), color: pick(PALETTE.slice(0, 6)), vy: -rand(0.02, 0.04), size: rand(16, 26), sway: rand(20, 40), swayFreq: rand(0.0015, 0.003), vr: rand(-0.0005, 0.0005) });
      return;
    case 'letter':
      add({
        ...fall,
        shape: 'text',
        glyph: pick(['あ', 'い', 'う', 'え', 'お', 'カ', 'キ', 'ク', '가', '나', '다', '한', '글', 'A', 'B', 'C', 'a', 'b', 'z']),
        color: pick(['#ff7a7a', '#6ab8ff', '#8fdc6b', '#c4a8ff', '#ffb35c']),
        vy: rand(0.025, 0.05),
        size: rand(16, 26),
        sway: rand(15, 35),
        swayFreq: rand(0.001, 0.002),
        rot: rand(-0.5, 0.5),
        vr: rand(-0.0008, 0.0008),
      });
      return;
    case 'clover':
      glyphFall(['🍀', '🍀', '☘️']);
      return;
    case 'sweets':
      glyphFall(['🍬', '🍭', '🍩', '🍡', '🍪', '🧁'], [16, 22]);
      return;
    case 'rain':
      add({ ...fall, y: warm ? rand(0, H) : -20, shape: 'spark', vy: rand(0.5, 0.75), vx: 0.05, size: rand(2.5, 4), color: pick(['rgba(120,165,255,0.5)', 'rgba(150,185,255,0.45)']), fadeIn: 0, tail: 34, rot: 0, vr: 0 });
      return;
    case 'lantern':
      add({ ...rise, shape: 'lantern', life: 45000, fadeIn: 2000, vy: -rand(0.012, 0.024), vx: rand(-0.003, 0.008), size: rand(13, 22), sway: rand(6, 16), swayFreq: rand(0.0006, 0.0012), twinkle: rand(0.0008, 0.0016), rot: rand(-0.08, 0.08) });
      return;
    case 'coin':
      add({ ...fall, shape: 'coin', vy: rand(0.03, 0.05), size: rand(12, 18), flip: rand(0.004, 0.008), rot: 0, vr: 0, sway: rand(10, 25), swayFreq: rand(0.001, 0.002) });
      return;
    case 'meteor':
      // 流星劃過，旁邊有小星星閃爍
      if (Math.random() < 0.45)
        add({ shape: 'spark', x: rand(W * 0.35, W + 120), y: warm ? rand(0, H * 0.4) : rand(-40, H * 0.3), vx: -rand(0.35, 0.55), vy: rand(0.16, 0.26), size: rand(2.5, 4), color: '#fff6c2', tail: 150, life: 9500, fadeOut: 0.1 });
      else add({ shape: 'star', x: rand(0, W), y: rand(0, H * 0.7), size: rand(4, 8), color: pick(['#ffffff', '#fff3b0', '#c4b5ff']), life: rand(9500, 12000), fadeIn: 1200, twinkle: rand(0.002, 0.005), phase: rand(0, 6) });
      return;
    case 'halloween':
      glyphFall(Math.random() < 0.4 ? ['🎃', '🦇'] : ['🍁', '🍂']);
      return;
    case 'leaf':
      glyphFall(['🍁', '🍂']);
  }
}

function spawnAmbient(dt: number) {
  if (!ambient) return;
  // 背景粒子數量設上限，避免長時間開著越積越多（雨滴落得快，上限放寬）
  const live = parts.filter((p) => p.life > 9000).length;
  const cap = ambient.kind === 'rain' ? 70 : 28;
  ambient.acc += (dt / 1000) * AMBIENT_RATE[ambient.kind];
  while (ambient.acc >= 1) {
    ambient.acc -= 1;
    if (live <= cap) spawnAmbientOne(ambient.kind);
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
    if (p.path) {
      const q = p.path(Math.min(1, p.age / p.life));
      p.x = q.x;
      p.y = q.y;
      if (q.rot !== undefined) p.rot = q.rot;
      p.onTick?.(p, dt);
      if (p.age > p.life) {
        parts.splice(i, 1);
        p.onDeath?.(p);
        continue;
      }
      draw(ctx, p);
      continue;
    }
    p.onTick?.(p, dt);
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

/** 頁面要的背景特效（季節或商店買的）、商店「試看」中的特效、目前正在飄的特效 */
let wantedAmbient: AmbientKind | null = null;
let previewAmbientKind: AmbientKind | null = null;
let previewTimer = 0;
let ambientKind: AmbientKind | null = null;

function applyAmbient() {
  const kind = previewAmbientKind ?? wantedAmbient;
  if (kind === ambientKind && (!kind || ambient)) return;
  const changed = kind !== ambientKind;
  ambientKind = kind;
  // 關閉或換成別的：讓已經在畫面上的背景粒子自然消失（縮短壽命）
  if (changed) for (const p of parts) if (p.life > 9000) p.life = Math.min(p.life, p.age + 1500);
  if (!kind) {
    ambient = null;
    return;
  }
  if (!ensureCanvas()) return;
  ambient = { kind, acc: 0.6 };
  const warm = kind === 'rain' ? 30 : kind === 'meteor' ? 4 : 6;
  for (let i = 0; i < warm; i++) spawnAmbientOne(kind, true);
  start();
}

/** 背景持續飄落的粒子；null 表示關閉 */
function setAmbient(kind: AmbientKind | null) {
  wantedAmbient = kind;
  applyAmbient();
}

/** 商店的「試看」：暫時換成另一種背景特效，幾秒後換回來 */
function previewAmbient(kind: AmbientKind, ms = 8000): boolean {
  if (!fxOn()) return false;
  clearTimeout(previewTimer);
  previewAmbientKind = kind;
  applyAmbient();
  previewTimer = window.setTimeout(() => {
    previewAmbientKind = null;
    applyAmbient();
  }, ms);
  return true;
}

// ───────── 回到頂端的飛行特效 ─────────

export const TOTOP_KINDS = ['rocket', 'balloon', 'plane', 'cat', 'broom', 'cloud', 'train', 'ufo', 'rainbow', 'fireworks', 'unicorn', 'dragon'] as const;
export type ToTopKind = (typeof TOTOP_KINDS)[number];

const ease = {
  in: (k: number) => k * k,
  out: (k: number) => 1 - (1 - k) * (1 - k),
  inOut: (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const RAINBOW = ['#ff6b6b', '#ffa94d', '#ffe066', '#69db7c', '#4dabf7', '#9775fa'];

/** 拖尾：每隔 every 毫秒在飛行物後面撒一個粒子 */
function trail(every: number, make: (p: Particle, n: number) => void): (p: Particle, dt: number) => void {
  let acc = 0;
  let n = 0;
  return (p, dt) => {
    acc += dt;
    while (acc >= every) {
      acc -= every;
      make(p, n++);
    }
  };
}

/**
 * 從按鈕的位置飛到畫面最上方的特效（id 是商店買的「回頂特效」，沒有就用預設的星光）。
 * 只負責畫，捲動由呼叫的人做。
 */
function toTop(from: Element | { x: number; y: number } | null, id?: string) {
  const a = from instanceof Element ? centerOf(from) : from;
  if (!a || !ensureCanvas()) return false;
  const { x: x0, y: y0 } = a;
  const flyer = (o: Partial<Particle> & Pick<Particle, 'path' | 'life'>) => add({ x: x0, y: y0, shape: 'glyph', size: 40, fadeOut: 0.06, ...o });
  const puff = (p: Particle, colors: string[], o: Partial<Particle> = {}) =>
    add({ x: p.x + rand(-6, 6), y: p.y + rand(-4, 4), vx: rand(-0.04, 0.04), vy: rand(0.03, 0.12), shape: 'circle', size: rand(5, 10), life: rand(380, 620), color: pick(colors), drag: 0.97, ...o });
  const pop = (x: number, y: number, o: BurstOptions = {}) => burst(x, y, { count: 26, speed: 0.38, ...o });
  switch (id as ToTopKind | undefined) {
    case 'rocket':
      flyer({
        glyph: '🚀',
        life: 900,
        size: 44,
        path: (k) => ({ x: x0, y: lerp(y0, -80, ease.in(k)), rot: -Math.PI / 4 }),
        onTick: trail(14, (p) => puff(p, ['#ffb347', '#ff7a3d', '#ffe066', '#cfd6e6'], { y: p.y + 24 })),
        onDeath: () => pop(x0, 30, { colors: ['#ffe066', '#ff9a3d', '#ffffff'], shapes: ['star', 'spark'] }),
      });
      break;
    case 'balloon':
      flyer({
        glyph: '🎈',
        life: 1500,
        size: 46,
        path: (k) => ({ x: x0 + Math.sin(k * 9) * 18 - (x0 - W / 2) * 0.4 * k, y: lerp(y0, 56, ease.out(k)), rot: Math.sin(k * 9) * 0.15 }),
        onDeath: (p) => {
          pop(p.x, p.y, { count: 34, shapes: ['rect', 'circle'], speed: 0.45 });
          flash('rgba(255,255,255,0.25)');
        },
      });
      break;
    case 'plane':
      // 紙飛機：繞一個圈再衝上去
      flyer({
        shape: 'plane',
        life: 1300,
        size: 34,
        path: (k) => {
          const loop = Math.min(1, k / 0.55);
          const ang = loop * Math.PI * 2;
          const r = 46;
          const cx = x0 - r;
          const lx = cx + Math.cos(ang) * r;
          const ly = y0 - Math.sin(ang) * r - loop * 30;
          if (k < 0.55) return { x: lx, y: ly, rot: -ang };
          const q = ease.in((k - 0.55) / 0.45);
          return { x: lerp(lx, W * 0.5, q), y: lerp(ly, -60, q), rot: Math.atan2(W * 0.5 - lx, ly + 60) };
        },
        onTick: trail(24, (p) => add({ x: p.x, y: p.y, shape: 'circle', size: 3, life: 600, color: 'rgba(140,160,210,0.8)' })),
      });
      break;
    case 'cat':
      // 喵師父：一路往上跳，留下肉球腳印
      flyer({
        glyph: '🐱',
        life: 1400,
        size: 42,
        path: (k) => {
          const hop = Math.abs(Math.sin(k * Math.PI * 4));
          return { x: x0 + Math.sin(k * Math.PI * 4) * 26, y: lerp(y0, -70, k) - hop * 28, rot: Math.sin(k * Math.PI * 8) * 0.2 };
        },
        onTick: trail(130, (p, n) => add({ x: p.x + (n % 2 ? 10 : -10), y: p.y + 26, shape: 'glyph', glyph: '🐾', size: 20, life: 1100, rot: rand(-0.3, 0.3) })),
      });
      break;
    case 'broom':
      flyer({
        glyph: '🧹',
        life: 1200,
        size: 44,
        path: (k) => ({ x: x0 - Math.sin(k * Math.PI) * W * 0.35, y: lerp(y0, -70, ease.inOut(k)), rot: -0.6 }),
        onTick: trail(18, (p) => add({ x: p.x + 14, y: p.y + 10, vx: rand(-0.05, 0.05), vy: rand(0.02, 0.1), shape: 'star', size: rand(5, 10), life: 700, color: pick(['#ffe066', '#c4a8ff', '#ffffff']), vr: 0.01 })),
      });
      break;
    case 'cloud':
      // 筋斗雲：咻一聲飛上去，留下一串雲朵
      flyer({
        glyph: '☁️',
        life: 800,
        size: 52,
        path: (k) => ({ x: x0 + Math.sin(k * Math.PI) * 40, y: lerp(y0, -80, ease.in(k)), rot: 0 }),
        onTick: trail(16, (p) => puff(p, ['#ffffff', '#eef3ff', '#dfe8ff'], { size: rand(10, 18), life: 700, vy: rand(0.01, 0.05) })),
      });
      break;
    case 'train':
      // 新幹線：從下面直直往上衝，旁邊有速度線
      flyer({
        glyph: '🚄',
        life: 700,
        size: 48,
        path: (k) => ({ x: x0, y: lerp(y0 + 40, -100, ease.in(k)), rot: Math.PI / 2 }),
        onTick: trail(12, (p) => add({ x: p.x + rand(-26, 26), y: p.y + 30, vy: 0.6, shape: 'spark', size: 2, life: 260, color: 'rgba(120,140,200,0.7)', tail: 40 })),
      });
      break;
    case 'ufo':
      // 幽浮：降到畫面上方，用光束把你吸上去，再飛走
      flyer({
        x: W / 2,
        y: -60,
        glyph: '🛸',
        life: 1800,
        size: 50,
        path: (k) => {
          const x = W / 2 + Math.sin(k * 10) * 14;
          if (k < 0.25) return { x, y: lerp(-60, 70, ease.out(k / 0.25)), rot: 0 };
          if (k < 0.75) return { x, y: 70, rot: Math.sin(k * 20) * 0.06 };
          const q = ease.in((k - 0.75) / 0.25);
          return { x: lerp(x, W + 80, q), y: lerp(70, -40, q), rot: 0.3 };
        },
        onTick: trail(16, (p) => {
          if (p.age < 1800 * 0.25 || p.age > 1800 * 0.75) return;
          add({ x: p.x + rand(-34, 34), y: rand(p.y + 30, H), vy: -rand(0.4, 0.8), shape: 'glow', size: rand(4, 8), life: 700, color: pick(['rgba(160,255,190,0.8)', 'rgba(190,240,255,0.8)']) });
        }),
      });
      break;
    case 'rainbow':
      // 彩虹流星：彎彎的弧線，拖著七彩的尾巴
      flyer({
        shape: 'star',
        color: '#ffffff',
        life: 1000,
        size: 22,
        path: (k) => ({ x: lerp(x0, W * 0.2, ease.inOut(k)), y: lerp(y0, -40, ease.inOut(k)) - Math.sin(k * Math.PI) * 60, rot: k * 8 }),
        onTick: trail(12, (p, n) => add({ x: p.x, y: p.y, shape: 'circle', size: 9, life: 650, color: RAINBOW[n % RAINBOW.length], vy: 0.02 })),
      });
      break;
    case 'fireworks':
      fireworks(3);
      burst(x0, y0, { count: 18, shapes: ['spark'], speed: 0.5 });
      break;
    case 'unicorn':
      flyer({
        glyph: '🦄',
        life: 1300,
        size: 46,
        path: (k) => ({ x: lerp(x0, W * 0.5, ease.inOut(k)) + Math.sin(k * Math.PI * 2) * 40, y: lerp(y0, -80, ease.inOut(k)), rot: -0.3 }),
        onTick: trail(14, (p, n) => {
          add({ x: p.x + 16, y: p.y + 12, shape: 'circle', size: 10, life: 800, color: RAINBOW[n % RAINBOW.length], vy: 0.03 });
          if (n % 3 === 0) add({ x: p.x + rand(-20, 20), y: p.y + rand(0, 30), shape: 'star', size: rand(6, 10), life: 900, color: '#fff3b0', vr: 0.01, vy: 0.05 });
        }),
        onDeath: () => rain('star', { count: 24, duration: 600 }),
      });
      break;
    case 'dragon':
      // 金龍升天：S 形往上飛，撒下金幣與星星
      flyer({
        glyph: '🐉',
        life: 1700,
        size: 56,
        path: (k) => ({ x: x0 + Math.sin(k * Math.PI * 3) * Math.min(120, W * 0.28) - (x0 - W / 2) * k, y: lerp(y0, -90, ease.inOut(k)), rot: Math.cos(k * Math.PI * 3) * 0.35 }),
        onTick: trail(20, (p, n) => {
          add({ x: p.x, y: p.y + 20, vx: rand(-0.08, 0.08), vy: rand(0.05, 0.15), g: 0.0005, shape: n % 2 ? 'coin' : 'star', size: rand(10, 14), life: 900, color: pick(GOLD), flip: 0.015 });
        }),
        onDeath: () => {
          banner('金龍升天！', '', 'gold');
          rain('coin', { count: 26, duration: 900 });
        },
      });
      break;
    default:
      // 預設：一串星光往上衝
      flyer({
        shape: 'star',
        color: '#ffe066',
        life: 650,
        size: 18,
        path: (k) => ({ x: x0, y: lerp(y0, -40, ease.in(k)), rot: k * 10 }),
        onTick: trail(16, (p) => add({ x: p.x + rand(-4, 4), y: p.y + 10, shape: 'spark', vx: rand(-0.03, 0.03), vy: 0.15, size: 3, life: 320, color: pick(['#ffe066', '#ffffff', '#c4a8ff']) })),
      });
  }
  start();
  return true;
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
  previewAmbient,
  toTop,
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

export const SEASON_LABEL: Partial<Record<AmbientKind, string>> = {
  leaf: '秋天的落葉',
  halloween: '萬聖節',
  snow: '冬天的雪花',
  sakura: '春天的櫻花',
  firefly: '夏夜的螢火蟲',
};
