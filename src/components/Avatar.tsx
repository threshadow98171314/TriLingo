// 頭像（可愛插畫）加上頭像框
import { AvatarArt } from '../art/avatars';
import { FrameArt } from '../art/items';
import { cx } from '../core/util';

export function Avatar({ id, frame, size = 36, className }: { id: string; frame?: string; size?: number | string; className?: string }) {
  return (
    <span className={cx('avatar-art', className)} style={{ width: size, height: size }}>
      <AvatarArt id={id} size="100%" />
      {frame && <FrameArt id={frame} />}
    </span>
  );
}
