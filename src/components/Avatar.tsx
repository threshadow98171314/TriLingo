// 頭像（可愛插畫）加上頭像框
import { AvatarArt } from '../art/avatars';
import { FrameArt } from '../art/items';
import { PREMIUM_AVATARS } from '../core/shop';
import { cx } from '../core/util';

export function Avatar({ id, frame, size = 36, className }: { id: string; frame?: string; size?: number | string; className?: string }) {
  return (
    <span className={cx('avatar-art', PREMIUM_AVATARS.includes(id) && 'premium', className)} style={{ width: size, height: size }}>
      <AvatarArt id={id} size="100%" />
      {frame && <FrameArt id={frame} />}
    </span>
  );
}

/** 學習夥伴：上課時陪在旁邊，答對跳一下、答錯一起難過、連擊 5 題轉一圈 */
export function Pet({ id, mood, size = 34 }: { id: string; mood?: 'hop' | 'sad' | 'cheer' | null; size?: number }) {
  return (
    <span className={cx('pet', mood)} title="學習夥伴" aria-hidden>
      <AvatarArt id={id} size={size} />
    </span>
  );
}
