// 網站圖示：index.html、manifest 連到的圖示檔都在，尺寸和標示的一樣（圖示由 scripts/icons.mjs 產生）
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** PNG 的寬高寫在檔頭（IHDR）第 16–23 個位元組 */
function pngSize(path: string): string {
  const b = readFileSync(path);
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  expect(String.fromCharCode(b[1], b[2], b[3])).toBe('PNG');
  return `${v.getUint32(16)}x${v.getUint32(20)}`;
}

describe('網站圖示', () => {
  it('index.html 連到所有圖示', () => {
    const html = readFileSync('index.html', 'utf8');
    for (const f of ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'manifest.webmanifest']) expect(html).toContain(`href="./${f}"`);
    expect(readFileSync('public/favicon.svg', 'utf8')).toMatch(/^<svg[^>]+viewBox="0 0 100 100"/);
    expect(pngSize('public/apple-touch-icon.png')).toBe('180x180');
  });

  it('favicon.ico 有 16、32、48 三種大小', () => {
    const b = readFileSync('public/favicon.ico');
    const count = b[4] | (b[5] << 8);
    expect(Array.from({ length: count }, (_, i) => b[6 + 16 * i])).toEqual([16, 32, 48]);
  });

  it('manifest 的圖示都存在，尺寸和標示的一樣', () => {
    const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8')) as { icons: { src: string; sizes: string; purpose: string }[] };
    for (const i of manifest.icons) expect(pngSize(`public/${i.src.replace('./', '')}`)).toBe(i.sizes);
    expect(manifest.icons.filter((i) => i.purpose === 'any').map((i) => i.sizes)).toEqual(['192x192', '512x512']);
    expect(manifest.icons.some((i) => i.purpose === 'maskable')).toBe(true);
  });
});
