// 商店：今日神秘商品、道具、外觀（頭像、頭像框、主題色、答對特效、稱號、喵師父裝扮）、扭蛋與貼紙簿
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AVATAR_NAME, AvatarArt } from '../art/avatars';
import { FramePreview, ItemIcon } from '../art/items';
import { MascotArt } from '../art/mascot';
import { RARITY_NAME, STICKER_BY_ID, STICKERS, StickerArt, type Sticker } from '../art/stickers';
import { Avatar } from '../components/Avatar';
import { useBoostLeft } from '../components/Layout';
import { Coin, Modal } from '../components/ui';
import { nowMs } from '../core/date';
import { fx } from '../core/fx';
import { FREE_AVATARS } from '../core/save';
import {
  AVATAR_COST,
  BURSTS,
  CONSUMABLES,
  cosmeticKey,
  cosmeticOf,
  FRAMES,
  GACHA10_COST,
  GACHA_COST,
  KIND_NAME,
  OUTFITS,
  PREMIUM_AVATAR_COST,
  PREMIUM_AVATARS,
  RARITY_ODDS,
  SHOP_AVATARS,
  SKINS,
  TITLES,
  type Burst,
  type Cosmetic,
  type CosmeticKind,
  type MysteryOffer,
} from '../core/shop';
import { sfx } from '../core/sfx';
import {
  buyAvatar,
  buyConsumable,
  buyCosmetic,
  buyMystery,
  canHold,
  equipCosmetic,
  heldOf,
  mysteryBlocked,
  pullGacha,
  revealMystery,
  setProfile,
  useSave,
  type GachaPull,
  type MysteryResult,
} from '../core/store';
import { cx, fmtTime } from '../core/util';
import { href, useRoute } from '../router';
import { today } from '../core/date';

type Tab = 'items' | 'looks' | 'gacha';
const TABS: [Tab, string][] = [
  ['items', '🎒 道具'],
  ['looks', '🎨 外觀'],
  ['gacha', '🎰 扭蛋'],
];

const ok = (done: boolean) => {
  if (done) sfx.coin();
  else sfx.wrong();
  return done;
};

/** 到午夜還剩多久 */
function useUntilMidnight(): number {
  const [now, setNow] = useState(nowMs());
  useEffect(() => {
    const t = setInterval(() => setNow(nowMs()), 30_000);
    return () => clearInterval(t);
  }, []);
  const d = new Date(now);
  d.setHours(24, 0, 0, 0);
  return d.getTime() - now;
}

const hm = (ms: number) => `${Math.floor(ms / 3_600_000)} 小時 ${Math.floor((ms % 3_600_000) / 60_000)} 分`;

export function ShopPage() {
  const s = useSave();
  const route = useRoute();
  const tab = (route.query.get('tab') as Tab) || 'items';

  return (
    <div className="page narrow shop-page">
      <section className="card shop-head">
        <div className="grow">
          <h1>商店</h1>
          <p className="muted">金幣來自每日任務、寶箱、升段、成就和連勝里程碑。</p>
        </div>
        <Coin n={s.coins} className="big" />
      </section>

      <MysteryCard />

      <div className="seg shop-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <a key={id} role="tab" aria-selected={tab === id} className={cx(tab === id && 'on')} href={href(`/shop?tab=${id}`)}>
            {label}
          </a>
        ))}
      </div>

      {tab === 'items' && <ItemsTab />}
      {tab === 'looks' && <LooksTab />}
      {tab === 'gacha' && <GachaTab />}
    </div>
  );
}

// ───────── 今日神秘商品 ─────────

function offerTitle(o: MysteryOffer): { name: string; desc: string } {
  switch (o.kind) {
    case 'avatar':
      return { name: `${AVATAR_NAME[o.id] ?? ''}頭像`, desc: '高級頭像今日特價。' };
    case 'cosmetic': {
      const c = cosmeticOf(o.key);
      return { name: `${KIND_NAME[c?.kind ?? 'frame']}：${c?.name ?? ''}`, desc: c?.rare ? `稀有外觀！${c.desc}` : `今日七折。${c?.desc ?? ''}` };
    }
    case 'sticker':
      return { name: '保底超稀有貼紙', desc: '開出來一定是「超稀有」以上的扭蛋貼紙。' };
    case 'coins':
      return { name: '金幣福袋', desc: `花 ${o.cost} 金幣，開出 ${o.min}～${o.max} 金幣。賭賭看運氣！` };
    case 'boost60':
      return { name: '超大瓶雙倍藥水', desc: '60 分鐘雙倍 XP，今日特價。' };
    case 'freeze2':
      return { name: '連勝保護兩入組', desc: '一次補兩個連勝保護。' };
  }
}

function OfferArt({ o, size = 84 }: { o: MysteryOffer; size?: number }) {
  if (o.kind === 'avatar') return <AvatarArt id={o.id} size={size} />;
  if (o.kind === 'cosmetic') {
    const c = cosmeticOf(o.key);
    if (c) return <CosmeticPreview c={c} size={size} />;
  }
  const icon = o.kind === 'sticker' ? 'gacha' : o.kind === 'coins' ? 'coins' : o.kind === 'boost60' ? 'boost60' : 'freeze';
  return <ItemIcon id={icon} size={size} />;
}

function resultText(r: MysteryResult): string {
  switch (r.kind) {
    case 'avatar':
      return '新頭像已經換上了！';
    case 'cosmetic':
      return '已經換上了，可以在「外觀」裡切換。';
    case 'sticker': {
      const st = STICKER_BY_ID.get(r.id);
      return `抽到【${RARITY_NAME[st?.rarity ?? 'N']}】${st?.name ?? ''}！${r.fresh ? '第一次收集到！' : `重複了，換回 ${r.refund} 金幣。`}`;
    }
    case 'coins':
      return `開出 ${r.n} 金幣！`;
    case 'boost60':
      return '雙倍 XP 開始生效，衝啊！';
    case 'freeze2':
      return '連勝保護 +2。';
  }
}

function MysteryCard() {
  const s = useSave();
  const left = useUntilMidnight();
  const box = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<MysteryResult | null>(null);
  const t = today();
  const m = s.mystery.day === t ? s.mystery : null;
  const offer = m?.offer;

  const reveal = () => {
    sfx.combo(1);
    revealMystery();
    fx.burstAt(box.current, { count: 40, shapes: ['star', 'glow'], colors: ['#ffe066', '#c4a8ff', '#ff9fbf'], speed: 0.45 });
  };
  const buy = () => {
    const r = buyMystery();
    if (!ok(!!r)) return;
    setResult(r);
    fx.burstAt(box.current, { count: 30, shapes: ['star', 'circle'], speed: 0.4 });
  };

  if (!offer) {
    return (
      <section className="card mystery closed">
        <div className="mystery-art wobble" ref={box}>
          <ItemIcon id="mystery" size={84} />
        </div>
        <div className="grow">
          <h2>今日神秘商品</h2>
          <p className="muted">每天一件特別的商品：稀有外觀、打折的高級頭像、保底貼紙或金幣福袋……打開才知道！</p>
          <button type="button" className="btn primary" onClick={reveal}>
            🎁 揭曉今天的商品
          </button>
        </div>
      </section>
    );
  }

  const { name, desc } = offerTitle(offer);
  const blocked = m?.bought ? null : mysteryBlocked(s, offer);
  const was = 'was' in offer && offer.was > offer.cost ? offer.was : undefined;
  return (
    <section className="card mystery open">
      <div className="mystery-art" ref={box}>
        <OfferArt o={offer} />
      </div>
      <div className="grow">
        <p className="mystery-tag">🎁 今日神秘商品 · 還剩 {hm(left)}</p>
        <h2>{name}</h2>
        <p className="muted">{desc}</p>
        {m?.bought ? (
          <p className="mystery-done">✓ 今天已經買過了{result ? `：${resultText(result)}` : ''}</p>
        ) : (
          <div className="mystery-buy">
            {was && (
              <s className="muted">
                <Coin n={was} />
              </s>
            )}
            <button type="button" className="btn gold" disabled={!!blocked || s.coins < offer.cost} onClick={buy}>
              {blocked ?? <Coin n={offer.cost} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ───────── 道具 ─────────

function ItemsTab() {
  const s = useSave();
  const boost = useBoostLeft();
  return (
    <div className="shop-list">
      {CONSUMABLES.map((c) => {
        const held = heldOf(s, c.id);
        const full = !canHold(s, c.id);
        const isBoost = c.id === 'boost' || c.id === 'boost60';
        return (
          <section key={c.id} className="card shop-item">
            <div className="shop-icon">
              <ItemIcon id={c.id} size={56} />
            </div>
            <div className="grow">
              <h3>
                {c.name} {c.max !== undefined && <span className="chip">持有 {held} / {c.max}</span>}
                {isBoost && boost > 0 && <span className="chip boost">生效中 {fmtTime(boost)}</span>}
              </h3>
              <p className="muted">{c.desc}</p>
            </div>
            <button type="button" className="btn gold" disabled={full || s.coins < c.cost} onClick={() => ok(buyConsumable(c.id))}>
              {full ? '已達上限' : <Coin n={c.cost} />}
            </button>
          </section>
        );
      })}
    </div>
  );
}

// ───────── 外觀 ─────────

/** 外觀的預覽圖 */
function CosmeticPreview({ c, size = 64 }: { c: Cosmetic; size?: number }) {
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
  }
}

function BurstIcon({ b, size }: { b?: Burst; size: number }) {
  const glyph = b?.glyphs?.[0];
  return (
    <span className="burst-icon" style={{ width: size, height: size, '--c1': b?.colors?.[0] ?? '#ffd34d', '--c2': b?.colors?.[1] ?? '#ff9fbf' } as CSSProperties}>
      {glyph ? <b>{glyph}</b> : <ItemIcon id="burst" size={size * 0.8} />}
    </span>
  );
}

function CosmeticCard({ c }: { c: Cosmetic }) {
  const s = useSave();
  const key = cosmeticKey(c.kind, c.id);
  const owned = s.owned.includes(key);
  const on = s.equip[c.kind] === c.id;
  const card = useRef<HTMLDivElement>(null);
  const tryBurst = () => {
    const b = BURSTS.find((x) => x.id === c.id);
    if (b) fx.burstAt(card.current, { count: 22, speed: 0.35, colors: b.colors, shapes: b.shapes, glyphs: b.glyphs });
  };
  return (
    <div ref={card} className={cx('look card', owned && 'owned', on && 'on', c.rare && 'rare')}>
      <div className="look-art">
        <CosmeticPreview c={c} />
      </div>
      <b className="look-name">{c.kind === 'title' ? `「${c.name}」` : c.name}</b>
      <small className="muted look-desc">{c.desc}</small>
      <div className="look-actions">
        {c.kind === 'burst' && (
          <button type="button" className="link-btn" onClick={tryBurst}>
            試放
          </button>
        )}
        {owned ? (
          <button type="button" className={cx('btn small', on ? 'ghost' : 'primary')} onClick={() => equipCosmetic(c.kind, on ? null : c.id)}>
            {on ? '取下' : '換上'}
          </button>
        ) : c.rare ? (
          <span className="chip">神秘商品限定</span>
        ) : (
          <button
            type="button"
            className="btn small gold"
            disabled={s.coins < c.cost}
            onClick={() => {
              if (ok(buyCosmetic(key))) {
                if (c.kind === 'burst') tryBurst();
                else fx.burstAt(card.current, { count: 18, speed: 0.3 });
              }
            }}
          >
            <Coin n={c.cost} />
          </button>
        )}
      </div>
    </div>
  );
}

const LOOK_SECTIONS: [CosmeticKind, string, Cosmetic[]][] = [
  ['frame', '框住你的頭像，個人頁和上方導覽列都看得到。', FRAMES],
  ['skin', '換掉整個網站的強調色（按鈕、進度條、連結）。', SKINS],
  ['burst', '答對時爆出來的特效。', BURSTS],
  ['title', '顯示在個人頁名字下面。', TITLES],
  ['outfit', '首頁的喵師父會穿上。', OUTFITS],
];

function LooksTab() {
  const s = useSave();
  const avatars = [...FREE_AVATARS, ...SHOP_AVATARS, ...PREMIUM_AVATARS, ...s.avatars.filter((a) => ![...FREE_AVATARS, ...SHOP_AVATARS, ...PREMIUM_AVATARS].includes(a))];
  return (
    <>
      <section className="card panel">
        <header className="panel-head">
          <h2>頭像</h2>
          <small className="muted">
            一般 {AVATAR_COST}、高級 {PREMIUM_AVATAR_COST} 金幣
          </small>
        </header>
        <div className="shop-avatars">
          {avatars.map((a) => {
            const owned = s.avatars.includes(a);
            const premium = PREMIUM_AVATARS.includes(a);
            const cost = premium ? PREMIUM_AVATAR_COST : AVATAR_COST;
            const sellable = premium || SHOP_AVATARS.includes(a);
            return (
              <button
                key={a}
                type="button"
                className={cx('shop-avatar', owned && 'owned', s.avatar === a && 'on', premium && 'premium')}
                disabled={!owned && (!sellable || s.coins < cost)}
                title={AVATAR_NAME[a]}
                onClick={() => (owned ? setProfile({ avatar: a }) : ok(buyAvatar(a)))}
              >
                <Avatar id={a} frame={s.avatar === a ? s.equip.frame : undefined} size={52} />
                <small className="avatar-name">{AVATAR_NAME[a] ?? ''}</small>
                {owned ? <small>{s.avatar === a ? '使用中' : '已擁有'}</small> : sellable ? <Coin n={cost} /> : <small>彩蛋限定</small>}
              </button>
            );
          })}
        </div>
      </section>

      {LOOK_SECTIONS.map(([kind, desc, list]) => (
        <section key={kind} className="card panel">
          <header className="panel-head">
            <h2>{KIND_NAME[kind]}</h2>
            <small className="muted">{desc}</small>
          </header>
          {kind === 'skin' && s.equip.skin && (
            <button type="button" className="link-btn" onClick={() => equipCosmetic('skin', null)}>
              換回預設的紫色
            </button>
          )}
          <div className="looks">
            {list.map((c) => (
              <CosmeticCard key={c.id} c={c} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

// ───────── 扭蛋 ─────────

const THEMES: Sticker['theme'][] = ['日本', '韓國', '英語圈', '學習', '傳說'];

function GachaTab() {
  const s = useSave();
  const [pulls, setPulls] = useState<GachaPull[] | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [detail, setDetail] = useState<Sticker | null>(null);
  const machine = useRef<HTMLDivElement>(null);
  const have = STICKERS.filter((x) => s.stickers[x.id]).length;

  const pull = (n: 1 | 10) => {
    if (spinning) return;
    const res = pullGacha(n);
    if (!ok(!!res)) return;
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setPulls(res);
      const best = Math.max(...res!.map((r) => ['N', 'R', 'SR', 'SSR'].indexOf(STICKER_BY_ID.get(r.id)!.rarity)));
      sfx.combo(best);
      if (best >= 2) fx.flash(best === 3 ? 'rgba(255,215,90,0.4)' : 'rgba(180,140,255,0.3)');
    }, 900);
  };

  return (
    <>
      <section className="card gacha">
        <div ref={machine} className={cx('gacha-machine', spinning && 'spin')}>
          <ItemIcon id="gacha" size={150} />
        </div>
        <div className="grow">
          <h2>貼紙扭蛋機</h2>
          <p className="muted">日本、韓國、英語圈和學習主題的可愛貼紙，一共 {STICKERS.length} 張。抽到重複的會換回一些金幣。</p>
          <div className="gacha-btns">
            <button type="button" className="btn gold" disabled={spinning || s.coins < GACHA_COST} onClick={() => pull(1)}>
              轉一次 <Coin n={GACHA_COST} />
            </button>
            <button type="button" className="btn primary" disabled={spinning || s.coins < GACHA10_COST} onClick={() => pull(10)}>
              十連抽 <Coin n={GACHA10_COST} />
            </button>
          </div>
          <p className="muted small">
            十連抽只要九次的價錢，而且保底一張稀有以上。機率：{RARITY_ODDS.map(([r, p]) => `${RARITY_NAME[r]} ${(p * 100).toFixed(1).replace(/\.0$/, '')}%`).join('、')}
          </p>
        </div>
      </section>

      <section className="card panel">
        <header className="panel-head">
          <h2>貼紙簿</h2>
          <small className="muted">
            已收集 {have} / {STICKERS.length}
          </small>
        </header>
        {THEMES.map((th) => (
          <div key={th} className="album-theme">
            <h3>{th}</h3>
            <div className="album">
              {STICKERS.filter((x) => x.theme === th).map((x) => {
                const n = s.stickers[x.id] ?? 0;
                return (
                  <button key={x.id} type="button" className={cx('album-slot', `r-${x.rarity}`, n > 0 && 'got')} onClick={() => n > 0 && setDetail(x)} disabled={!n}>
                    <StickerArt id={x.id} size={64} dim={!n} />
                    <small>{n ? x.name : '？？？'}</small>
                    {n > 1 && <i className="album-count">×{n}</i>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {pulls && <PullResult pulls={pulls} onClose={() => setPulls(null)} />}
      {detail && (
        <Modal className="sticker-modal" onClose={() => setDetail(null)}>
          <div className={cx('sticker-big', `r-${detail.rarity}`)}>
            <StickerArt id={detail.id} size={160} />
          </div>
          <span className={cx('rarity', `r-${detail.rarity}`)}>{RARITY_NAME[detail.rarity]}</span>
          <h2>{detail.name}</h2>
          <p>{detail.note}</p>
          <p className="muted small">擁有 {s.stickers[detail.id]} 張</p>
          <div className="modal-actions">
            <button type="button" className="btn primary" onClick={() => setDetail(null)}>
              關閉
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function PullResult({ pulls, onClose }: { pulls: GachaPull[]; onClose: () => void }) {
  const single = pulls.length === 1;
  return (
    <Modal className={cx('pull-modal', single && 'single')} onClose={onClose}>
      <h2>{single ? '扭蛋開出來了！' : '十連抽結果'}</h2>
      <div className="pulls">
        {pulls.map((p, i) => {
          const st = STICKER_BY_ID.get(p.id)!;
          return (
            <div key={i} className={cx('pull', `r-${st.rarity}`)} style={{ animationDelay: `${i * 0.12}s` } as CSSProperties}>
              <StickerArt id={p.id} size={single ? 150 : 76} />
              <span className={cx('rarity', `r-${st.rarity}`)}>{RARITY_NAME[st.rarity]}</span>
              <b>{st.name}</b>
              {p.fresh ? <i className="new-badge">NEW!</i> : <small className="muted">重複 +{p.refund} 金幣</small>}
              {single && p.fresh && <p className="pull-note">{st.note}</p>}
            </div>
          );
        })}
      </div>
      <div className="modal-actions">
        <button type="button" className="btn primary" onClick={onClose} autoFocus>
          收進貼紙簿
        </button>
      </div>
    </Modal>
  );
}
