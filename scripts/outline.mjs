// 產生 src/content/gen/ 裡的檔案（內容見 src/content/outline-build.ts）：課程大綱、依關卡拆開的補充例句表、
// 猜詞的每日候選字。App 靠大綱畫出首頁和學習路線，題目等上課時才下載，所以新增或修改題目後要跟著更新。
// `npm test`、`npm run build` 會先自動跑一次；開發伺服器（npm run dev）開著的時候，改題目檔也會自動更新。
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(root, 'src/content/gen');

/** gen/ 底下現有的檔案（相對路徑，用 / 分隔） */
function existing(dir = OUT) {
  let out = [];
  let names = [];
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const n of names) {
    const p = resolve(dir, n);
    if (statSync(p).isDirectory()) out = out.concat(existing(p));
    else out.push(relative(OUT, p).replace(/\\/g, '/'));
  }
  return out;
}

/** 用 Vite 載入題目（TypeScript 寫的），算出各檔案的內容，只寫入有變動的檔案、刪掉用不到的。回傳變動了哪些檔案 */
export async function writeOutlines(server) {
  const { outlineFiles } = await server.ssrLoadModule('/src/content/outline-build.ts');
  const files = outlineFiles();
  const changed = [];
  for (const [name, text] of Object.entries(files)) {
    const file = resolve(OUT, name);
    let old = null;
    try {
      old = readFileSync(file, 'utf8');
    } catch {
      // 第一次產生
    }
    if (old !== null && old.replace(/\r\n/g, '\n') === text) continue;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
    changed.push(name);
  }
  for (const name of existing()) {
    if (name in files || !name.endsWith('.json')) continue;
    rmSync(resolve(OUT, name));
    changed.push(`${name}（刪除）`);
  }
  return changed;
}

// 直接執行：node scripts/outline.mjs
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await createServer({
    root,
    configFile: false,
    logLevel: 'error',
    // 只用來載入模組：不開 WebSocket（開發伺服器開著時才不會搶同一個連接埠）、不監看檔案
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const changed = await writeOutlines(server);
    console.log(changed.length ? `大綱已更新：${changed.join('、')}` : '大綱沒有變動');
  } finally {
    await server.close();
  }
}
