// 外觀商品的預覽圖與分類選擇器：商店與個人頁共用
import type { CSSProperties } from 'react';
import { ItemIcon } from '../art/items';
import { MascotArt } from '../art/mascot';
import { BURSTS, SKINS, type Burst, type Cosmetic, type CosmeticKind } from '../core/shop';
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

// ───────── 外觀分類選擇器 ─────────

export type LookKind = CosmeticKind | 'avatar';

/** 外觀的分類：依「名片 → 夥伴 → 特效 → 聲音與主題」排 */
export const LOOK_KINDS: { id: LookKind; icon: string; name: string }[] = [
  { id: 'avatar', icon: '🐣', name: '頭像' },
  { id: 'frame', icon: '🖼️', name: '頭像框' },
  { id: 'title', icon: '🎖️', name: '稱號' },
  { id: 'name', icon: '✒️', name: '名牌特效' },
  { id: 'bg', icon: '🌄', name: '名片背景' },
  { id: 'pet', icon: '🐹', name: '學習夥伴' },
  { id: 'outfit', icon: '🎩', name: '喵師父裝扮' },
  { id: 'ambient', icon: '🍁', name: '飄落特效' },
  { id: 'totop', icon: '🚀', name: '回頂特效' },
  { id: 'burst', icon: '✨', name: '答對特效' },
  { id: 'sound', icon: '🔔', name: '答對音效' },
  { id: 'skin', icon: '🎨', name: '主題色' },
];

export const isLookKind = (k: string | null | undefined): k is LookKind => LOOK_KINDS.some((x) => x.id === k);

/** 所有分類一次排出來（會換行，不用左右滑），點一下只顯示那一類 */
export function KindPicker({ value, onPick, count }: { value: LookKind; onPick: (k: LookKind) => void; count: (k: LookKind) => string }) {
  return (
    <div className="kind-picker" role="tablist" aria-label="外觀分類">
      {LOOK_KINDS.map((k) => (
        <button key={k.id} type="button" role="tab" aria-selected={value === k.id} className={cx('kind-btn', value === k.id && 'on')} onClick={() => onPick(k.id)}>
          <span className="kind-icon" aria-hidden>
            {k.icon}
          </span>
          <span className="kind-name">{k.name}</span>
          <small>{count(k.id)}</small>
        </button>
      ))}
    </div>
  );
}
