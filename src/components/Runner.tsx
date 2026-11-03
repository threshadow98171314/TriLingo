// 進度條跑者：商店買的角色沿著上課的進度條往前跑。答對跳一下、答錯晃一下（用 key 重新觸發動畫）。
import type { CSSProperties } from 'react';
import { RUNNERS } from '../core/shop';
import { cx } from '../core/util';

export function Runner({ id, at, mood, demo }: { id: string; at: number; mood?: 'ok' | 'bad' | null; demo?: boolean }) {
  const r = RUNNERS.find((x) => x.id === id);
  if (!r) return null;
  // 兩端留一點空間，跑者才不會蓋到旁邊的按鈕
  const left = `${(0.04 + Math.max(0, Math.min(1, at)) * 0.92) * 100}%`;
  return (
    <span className={cx('runner', `run-${r.move}`, `runner-${r.id}`, demo && 'demo')} style={demo ? undefined : ({ left } as CSSProperties)} aria-hidden>
      <span key={mood ?? 'idle'} className={cx('runner-mood', mood && `mood-${mood}`)}>
        <i>{r.icon}</i>
      </span>
    </span>
  );
}
