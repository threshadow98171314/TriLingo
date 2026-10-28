// 網站背景：商店買的整頁背景（星空、筆記本、方格紙…），畫在所有內容的最底層。
// 圖案全部用 CSS 畫（shop.css 的 .wall-*），深色、淺色主題各有一套配色。
import { useEffect, useState } from 'react';
import { useSave } from '../core/store';
import { cx } from '../core/util';

let previewId: string | null = null;
let previewTimer = 0;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((f) => f());

function stopPreview() {
  clearTimeout(previewTimer);
  if (!previewId) return;
  previewId = null;
  notify();
}

/** 商店的「試看」：暫時換上這個背景 ms 毫秒 */
export function previewWall(id: string, ms = 8000) {
  clearTimeout(previewTimer);
  previewId = id;
  previewTimer = window.setTimeout(stopPreview, ms);
  notify();
}

/** 整頁背景（沒有裝備、也沒有在試看時不畫，用預設的背景） */
export function WallLayer() {
  const s = useSave();
  const [, rerender] = useState(0);
  useEffect(() => {
    const f = () => rerender((n) => n + 1);
    listeners.add(f);
    return () => {
      listeners.delete(f);
    };
  }, []);
  // 買下或換掉背景時，正在試看的就結束，馬上看到換上的那一款
  const equipped = s.equip.wall;
  useEffect(stopPreview, [equipped]);
  const id = previewId ?? equipped;
  if (!id) return null;
  return (
    <div className={cx('wall-layer', 'wall-art', `wall-${id}`)} aria-hidden>
      <i />
    </div>
  );
}

/** 商店、個人頁的小預覽：把整頁背景縮小來看 */
export function WallSwatch({ id, size }: { id: string; size: number }) {
  return (
    <span className="wall-swatch" style={{ width: size, height: size }}>
      <span className={cx('wall-art', `wall-${id}`)}>
        <i />
      </span>
    </span>
  );
}
