// 產生網站圖示：public/ 裡的 favicon.svg、favicon.ico、icon-*.png、apple-touch-icon.png
// 圖案是喵師父的頭（照 src/art/mascot.tsx 的 MascotBody 攤平）放在紫藍漸層的圓角方塊上。
// 改了圖案之後執行 `npm run icons`：用電腦上的 Chrome／Edge（無頭模式）把 SVG 畫成各種尺寸的 PNG。
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const OUT = resolve(import.meta.dirname, '../public');

const EDGE = '#b9a9b8';
const FUR = '#ffffff';
const PATCH = '#a7adc2';
const RED = '#e8484f';
const RED_D = '#a82a32';
const INK = '#4a3535';
const PINK = '#ffb3c1';
const BLUSH = '#ff8fa6';
const line = (c, w) => `stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

/** 喵師父的頭，座標 0–100 */
const CAT = [
  `<path d="M20 47 L22 12 L46 30 Z" fill="${FUR}" ${line(EDGE, 3)}/>`,
  `<path d="M26 39 L27 22 L38 31 Z" fill="${PINK}"/>`,
  `<path d="M80 47 L78 12 L54 30 Z" fill="${PATCH}" ${line(EDGE, 3)}/>`,
  `<path d="M74 39 L73 22 L62 31 Z" fill="${PINK}"/>`,
  `<ellipse cx="50" cy="58" rx="34" ry="30" fill="${FUR}" ${line(EDGE, 3)}/>`,
  `<path d="M62 29.5 C74 32 82 41 83 51 C74 46 66 39 62 29.5 Z" fill="${PATCH}"/>`,
  `<path d="M17 45 Q50 35 83 45 L83 52.5 Q50 43 17 52.5 Z" fill="${RED}" ${line(RED_D, 2)}/>`,
  `<path d="M82 47 L94 40 L92 51 Z" fill="${RED}" ${line(RED_D, 1.8)}/>`,
  `<path d="M82 50 L93 57 L86 60 Z" fill="${RED}" ${line(RED_D, 1.8)}/>`,
  `<circle cx="50" cy="44" r="7.2" fill="#fff" ${line(RED_D, 1.6)}/>`,
  `<text x="50" y="47.6" text-anchor="middle" font-size="9.5" font-weight="900" fill="${RED_D}" font-family="'Noto Sans TC','Microsoft JhengHei','PingFang TC',sans-serif">道</text>`,
  `<ellipse cx="39" cy="60" rx="3.61" ry="4.2" fill="${INK}"/><circle cx="40.34" cy="58.24" r="1.51" fill="#fff"/>`,
  `<ellipse cx="61" cy="60" rx="3.61" ry="4.2" fill="${INK}"/><circle cx="62.34" cy="58.24" r="1.51" fill="#fff"/>`,
  `<g fill="${BLUSH}" opacity=".6"><ellipse cx="28" cy="68" rx="5" ry="3"/><ellipse cx="72" cy="68" rx="5" ry="3"/></g>`,
  `<path d="M47.4 65.4 H52.6 L50 68 Z" fill="${BLUSH}"/>`,
  `<path d="M45.8 69 Q47.9 72.15 50 69 Q52.1 72.15 54.2 69" fill="none" ${line(INK, 2.2)}/>`,
  `<g fill="none" ${line(EDGE, 1.6)}><path d="M12 62 L25 65"/><path d="M13 71 L25 69"/><path d="M88 62 L75 65"/><path d="M87 71 L75 69"/></g>`,
].join('');

/**
 * 整張圖示，畫在 100×100 裡。
 * round：圓角方塊、四角透明（分頁、桌面捷徑）；false 則鋪滿（手機會自己裁成圓形或圓角）。
 * s：貓的大小。鋪滿的版本要縮小，讓貓待在手機裁切的安全範圍內。
 */
function icon({ round = true, s = 0.94 } = {}) {
  const bg = round ? '<rect width="100" height="100" rx="22" fill="url(#g)"/>' : '<rect width="100" height="100" fill="url(#g)"/>';
  // 臉的中心放在 (50, 52)：耳朵比下巴高，往下挪一點看起來才置中
  const tx = (50 - 50 * s).toFixed(2);
  const ty = (52 - 50 * s).toFixed(2);
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">',
    '<defs>',
    '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8f7cff"/><stop offset=".55" stop-color="#6d5cf5"/><stop offset="1" stop-color="#2bb3e6"/></linearGradient>',
    '<radialGradient id="h" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>',
    '</defs>',
    bg,
    `<circle cx="50" cy="55" r="${(44 * Math.max(s, 0.85)).toFixed(1)}" fill="url(#h)"/>`,
    `<g transform="translate(${tx} ${ty}) scale(${s})">${CAT}</g>`,
    '</svg>',
  ].join('');
}

const ROUND = icon();
const FULL = icon({ round: false, s: 0.9 });
const MASKABLE = icon({ round: false, s: 0.8 });

/** 要輸出的 PNG：[檔名, SVG, 邊長] */
const PNGS = [
  ['icon-192.png', ROUND, 192],
  ['icon-512.png', ROUND, 512],
  ['icon-maskable-512.png', MASKABLE, 512],
  ['apple-touch-icon.png', FULL, 180],
  ['ico-16.png', ROUND, 16],
  ['ico-32.png', ROUND, 32],
  ['ico-48.png', ROUND, 48],
];

function findBrowser() {
  const pf = [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean);
  const list = [
    process.env.CHROME,
    ...pf.flatMap((d) => [join(d, 'Google/Chrome/Application/chrome.exe'), join(d, 'Microsoft/Edge/Application/msedge.exe')]),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  const hit = list.find((p) => p && existsSync(p));
  if (!hit) throw new Error('找不到 Chrome 或 Edge，請用環境變數 CHROME 指定瀏覽器路徑');
  return hit;
}

/** 在無頭瀏覽器裡把 SVG 畫到 canvas，再把 PNG 的 data URL 印在頁面上 */
function rasterize() {
  const tmp = mkdtempSync(join(tmpdir(), 'trilingo-icons-'));
  try {
    const page = join(tmp, 'draw.html');
    const jobs = JSON.stringify(PNGS);
    writeFileSync(
      page,
      `<!doctype html><meta charset="utf-8"><pre id="out"></pre><script type="module">
const out = {};
for (const [name, svg, n] of ${jobs}) {
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  await img.decode();
  const c = document.createElement('canvas');
  c.width = c.height = n;
  c.getContext('2d').drawImage(img, 0, 0, n, n);
  out[name] = c.toDataURL('image/png');
}
document.getElementById('out').textContent = JSON.stringify(out);
</script>`,
    );
    const html = execFileSync(
      findBrowser(),
      ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${join(tmp, 'profile')}`, '--virtual-time-budget=15000', '--dump-dom', pathToFileURL(page).href],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    );
    const m = html.match(/<pre id="out">(\{.*?\})<\/pre>/s);
    if (!m) throw new Error('瀏覽器沒有畫出圖示');
    const data = JSON.parse(m[1]);
    return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, Buffer.from(v.split(',')[1], 'base64')]));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** 把幾張 PNG 包成 .ico（Windows Vista 之後與所有瀏覽器都支援 PNG 格式的 ico） */
function toIco(pngs) {
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach(([n, buf], i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(n >= 256 ? 0 : n, e);
    head.writeUInt8(n >= 256 ? 0 : n, e + 1);
    head.writeUInt8(0, e + 2);
    head.writeUInt8(0, e + 3);
    head.writeUInt16LE(1, e + 4);
    head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(buf.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });
  return Buffer.concat([head, ...pngs.map(([, buf]) => buf)]);
}

const png = rasterize();
writeFileSync(join(OUT, 'favicon.svg'), ROUND + '\n');
for (const [name] of PNGS) if (!name.startsWith('ico-')) writeFileSync(join(OUT, name), png[name]);
writeFileSync(
  join(OUT, 'favicon.ico'),
  toIco([16, 32, 48].map((n) => [n, png[`ico-${n}.png`]])),
);
console.log('已輸出：favicon.svg、favicon.ico、' + PNGS.filter(([n]) => !n.startsWith('ico-')).map(([n]) => n).join('、'));
