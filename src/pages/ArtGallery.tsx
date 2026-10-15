// 插畫一覽（沒有連結的隱藏頁，開發時檢查畫風用）：#/art
import { AVATAR_ART_IDS, AVATAR_NAME, AvatarArt } from '../art/avatars';
import { ITEM_ICON_IDS, ItemIcon } from '../art/items';
import { MascotArt } from '../art/mascot';
import { PICTURES, PictureArt } from '../art/pictures';
import { pictureName } from '../engine/pictures';
import { RARITY_NAME, STICKERS, StickerArt } from '../art/stickers';
import { BuildingArt, StampArt } from '../art/town';
import { Avatar } from '../components/Avatar';
import { FRAMES, OUTFITS } from '../core/shop';

export function ArtGallery() {
  return (
    <div className="page art-gallery">
      <h1>插畫一覽</h1>
      <h2>圖片題（{PICTURES.length}）</h2>
      <div className="art-grid">
        {PICTURES.filter((p) => !p.id.includes(':')).map((p) => (
          <figure key={p.id}>
            <PictureArt id={p.id} size={84} />
            <figcaption>{pictureName(p.id)}</figcaption>
          </figure>
        ))}
      </div>
      <h2>小鎮建築</h2>
      <div className="art-grid">
        {['konbini', 'post', 'station', 'bank', 'hospital', 'pharmacy', 'police', 'cafe', 'restaurant', 'supermarket', 'hotel', 'school', 'library', 'park', 'office', 'shrine', 'jjimjil', 'airport'].map((id) => (
          <figure key={id}>
            <BuildingArt id={id} size={96} />
            <figcaption>{id}</figcaption>
          </figure>
        ))}
        <figure>
          <StampArt size={64} />
          <figcaption>stamp</figcaption>
        </figure>
      </div>
      <h2>頭像</h2>
      <div className="art-grid">
        {AVATAR_ART_IDS.map((id) => (
          <figure key={id}>
            <AvatarArt id={id} size={84} />
            <figcaption>{AVATAR_NAME[id] ?? id}</figcaption>
          </figure>
        ))}
      </div>
      <h2>頭像框</h2>
      <div className="art-grid">
        {FRAMES.map((f) => (
          <figure key={f.id}>
            <Avatar id="🐱" frame={f.id} size={64} />
            <figcaption>{f.name}</figcaption>
          </figure>
        ))}
      </div>
      <h2>貼紙</h2>
      <div className="art-grid">
        {STICKERS.map((s) => (
          <figure key={s.id}>
            <StickerArt id={s.id} size={84} />
            <figcaption>
              {s.name}・{RARITY_NAME[s.rarity]}
            </figcaption>
          </figure>
        ))}
      </div>
      <h2>喵師父裝扮</h2>
      <div className="art-grid">
        <figure>
          <MascotArt size={84} />
          <figcaption>原本的樣子</figcaption>
        </figure>
        <figure>
          <MascotArt size={84} gold />
          <figcaption>金色</figcaption>
        </figure>
        {OUTFITS.map((o) => (
          <figure key={o.id}>
            <MascotArt size={84} outfit={o.id} />
            <figcaption>{o.name}</figcaption>
          </figure>
        ))}
      </div>
      <h2>道具</h2>
      <div className="art-grid">
        {ITEM_ICON_IDS.map((id) => (
          <figure key={id}>
            <ItemIcon id={id} size={84} />
            <figcaption>{id}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
