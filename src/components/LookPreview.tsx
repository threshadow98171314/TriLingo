// 外觀商品的預覽圖：商店與「我的」頁共用
import type { CSSProperties } from 'react';
import { ItemIcon } from '../art/items';
import { MascotArt } from '../art/mascot';
import { BURSTS, SKINS, type Burst, type Cosmetic } from '../core/shop';
import { useSave } from '../core/store';
import { cx } from '../core/util';
import { Avatar, Pet } from './Avatar';

/** 外觀的預覽圖 */
export function CosmeticPreview({ c, size = 64 }: { c: Cosmetic; size?: number }) {
  const s = useSave();
  switch (c.kind) {
    case 'frame':
      return (
        <span className="frame-preview" style={{ width: size, height: size }}>
          <Avatar id={s.avatar} frame={c.id} size={size * 0.72} />
        </span>
      );
    case 'skin': {
      const sk = SKINS.find((x) => x.id === c.id);
      return (
        <span className="skin-swatch" style={{ width: size, height: size, '--a': sk?.a, '--b': sk?.b } as CSSProperties}>
          <i />
          <i />
        </span>
      );
    }
    case 'burst':
      return <BurstIcon b={BURSTS.find((x) => x.id === c.id)} size={size} />;
    case 'title':
      return <ItemIcon id="title" size={size} />;
    case 'outfit':
      return <MascotArt outfit={c.id} size={size} />;
    case 'pet':
      return (
        <span className="pet-preview">
          <Pet id={c.id} size={size * 0.85} />
        </span>
      );
    case 'name':
      return <span className={cx('name-sample', `name-fx-${c.id}`)}>{s.name || '學習者'}</span>;
    case 'bg':
      return <span className={cx('bg-swatch pbg', `pbg-${c.id}`)} />;
    case 'sound':
      return <ItemIcon id="burst" size={size * 0.85} />;
    case 'ambient':
      return <AmbientPreview c={c} size={size} />;
    case 'totop':
      return (
        <span className="totop-prev" style={{ width: size, height: size }}>
          <b>{c.icon}</b>
        </span>
      );
  }
}

/** 飄落特效的小預覽：幾個圖案在框框裡慢慢飄 */
export function AmbientPreview({ c, size = 64 }: { c: Cosmetic; size?: number }) {
  const icon = c.icon ?? '';
  // 用畫的（銀杏、泡泡、雨滴…）只放空的 <i>，由 CSS 畫出來；其他直接放文字或 emoji
  const drawn = /^[a-z]+$/.test(icon);
  const chars = drawn ? ['', '', '', ''] : [...icon];
  const rise = ['heart', 'bubble', 'note', 'lantern', 'firefly'].includes(c.id);
  return (
    <span className={cx('amb-prev', `amb-${c.id}`, rise && 'rise')} style={{ width: size, height: size }}>
      {[...chars, ...chars].slice(0, drawn ? 4 : 5).map((ch, i) => (
        <i key={i} style={{ '--i': i } as CSSProperties}>
          {ch}
        </i>
      ))}
    </span>
  );
}

export function BurstIcon({ b, size }: { b?: Burst; size: number }) {
  const glyph = b?.glyphs?.[0];
  return (
    <span className="burst-icon" style={{ width: size, height: size, '--c1': b?.colors?.[0] ?? '#ffd34d', '--c2': b?.colors?.[1] ?? '#ff9fbf' } as CSSProperties}>
      {glyph ? <b>{glyph}</b> : <ItemIcon id="burst" size={size * 0.8} />}
    </span>
  );
}
