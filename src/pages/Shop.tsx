// 商店：今日神秘商品、道具、外觀（頭像、頭像框、主題色、答對特效、稱號、喵師父裝扮）、扭蛋與貼紙簿
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AVATAR_NAME } from '../art/avatars';
import { ItemIcon } from '../art/items';
import { GachaArt } from '../art/machines';
import { RARITY_NAME, STICKER_BY_ID, STICKERS, StickerArt, type Sticker } from '../art/stickers';
import { Avatar } from '../components/Avatar';
import { CosmeticPreview, isLookKind, KindPicker, LOOK_KINDS, type LookKind } from '../components/LookPreview';
import { useBoostLeft } from '../components/Layout';
import { Bar, Coin, Modal } from '../components/ui';
import { nowMs } from '../core/date';
import { fx, type AmbientKind } from '../core/fx';
import { FREE_AVATARS } from '../core/save';
import {
  AVATAR_COST,
  BURSTS,
  CONSUMABLE_BY_ID,
  ANIM_GACHA10_COST,
  ANIM_GACHA_COST,
  ANIM_ODDS,
  COSMETICS,
  CONSUMABLES,
  cosmeticKey,
  cosmeticOf,
  GACHA10_COST,
  GACHA_COST,
  KIND_NAME,
  LOOK_GACHA_COST,
  LOOK_ODDS,
  MYSTERY_SLOTS,
  PREMIUM_AVATAR_COST,
  PREMIUM_AVATARS,
  RARITY_ODDS,
  SHOP_AVATARS,
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
  pullLook,
  revealMystery,
  setProfile,
  useSave,
  type GachaPull,
  type LookPull,
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

const itemName = (id: string) => CONSUMABLE_BY_ID.get(id as never)?.name ?? id;

function offerTitle(o: MysteryOffer): { name: string; desc: string } {
  switch (o.kind) {
    case 'avatar':
      return { name: `${AVATAR_NAME[o.id] ?? ''}頭像`, desc: '會動的高級頭像，今日特價。' };
    case 'cosmetic': {
      const c = cosmeticOf(o.key);
      return { name: `${KIND_NAME[c?.kind ?? 'frame']}：${c?.name ?? ''}`, desc: c?.rare ? `限定外觀！${c.desc}` : `今日七折。${c?.desc ?? ''}` };
    }
    case 'lucky': {
      const c = cosmeticOf(o.key);
      return { name: `外觀福袋（${KIND_NAME[c?.kind ?? 'frame']}）`, desc: `裡面是一件你還沒有的${KIND_NAME[c?.kind ?? 'frame']}，原價 ${o.was}，買了才揭曉！` };
    }
    case 'sticker':
      return { name: '保底超稀有貼紙', desc: '開出來一定是「超稀有」以上的扭蛋貼紙。' };
    case 'gacha10':
      return { name: '十連抽特價券', desc: '直接抽十次貼紙扭蛋，保底一張稀有以上。' };
    case 'coins':
      return { name: '金幣福袋', desc: `花 ${o.cost} 金幣，開出 ${o.min}～${o.max} 金幣。賭賭看運氣！` };
    case 'boost60':
      return { name: '超大瓶雙倍藥水', desc: '60 分鐘雙倍 XP，今日特價。' };
    case 'freeze2':
      return { name: '連勝保護兩入組', desc: '一次補兩個連勝保護。' };
    case 'pack':
      return { name: '道具福袋', desc: o.items.map(([id, n]) => `${itemName(id)} ×${n}`).join('、') + '（超過上限的部分不會給）。' };
  }
}

function OfferArt({ o, size = 84 }: { o: MysteryOffer; size?: number }) {
  if (o.kind === 'avatar') return <Avatar id={o.id} size={size} />;
  if (o.kind === 'cosmetic') {
    const c = cosmeticOf(o.key);
    if (c) return <CosmeticPreview c={c} size={size} />;
  }
  const icon = o.kind === 'sticker' || o.kind === 'gacha10' ? 'gacha' : o.kind === 'coins' ? 'coins' : o.kind === 'boost60' ? 'boost60' : o.kind === 'freeze2' ? 'freeze' : o.kind === 'pack' ? 'clover' : 'mystery';
  return <ItemIcon id={icon} size={size} />;
}

function resultText(r: MysteryResult): string {
  switch (r.kind) {
    case 'avatar':
      return '新頭像已經換上了！';
    case 'cosmetic':
      return '已經換上了，可以在「外觀」裡切換。';
    case 'lucky': {
      const c = cosmeticOf(r.key);
      return `開出${KIND_NAME[c?.kind ?? 'frame']}「${c?.name ?? ''}」！已經換上了。`;
    }
    case 'sticker': {
      const st = STICKER_BY_ID.get(r.id);
      return `抽到【${RARITY_NAME[st?.rarity ?? 'N']}】${st?.name ?? ''}！${r.fresh ? '第一次收集到！' : `重複了，換回 ${r.refund} 金幣。`}`;
    }
    case 'gacha10':
      return `抽到 ${r.pulls.filter((p) => p.fresh).length} 張新貼紙！`;
    case 'coins':
      return `開出 ${r.n} 金幣！`;
    case 'boost60':
      return '雙倍 XP 開始生效，衝啊！';
    case 'freeze2':
      return '連勝保護 +2。';
    case 'pack':
      return r.items.length ? `得到 ${r.items.map(([id, n]) => `${itemName(id)} ×${n}`).join('、')}。` : '道具都滿了。';
  }
}

/** 特價標示：原價（劃線）＋省多少，避免看起來像同一件商品有兩個價錢 */
function SaleTag({ was, cost }: { was: number; cost: number }) {
  return (
    <span className="sale-tag">
      <span className="sale-was">
        原價 <s>{was}</s>
      </span>
      <span className="sale-off">省 {was - cost}</span>
    </span>
  );
}

function MysteryCard() {
  const s = useSave();
  const left = useUntilMidnight();
  const box = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<Record<number, MysteryResult>>({});
  const [pulls, setPulls] = useState<GachaPull[] | null>(null);
  const t = today();
  const m = s.mystery.day === t ? s.mystery : null;
  const offers = m?.offers ?? [];

  const reveal = () => {
    sfx.combo(1);
    revealMystery();
    fx.burstAt(box.current, { count: 40, shapes: ['star', 'glow'], colors: ['#ffe066', '#c4a8ff', '#ff9fbf'], speed: 0.45 });
  };
  const buy = (slot: number, el: HTMLElement | null) => {
    const r = buyMystery(slot);
    if (!ok(!!r)) return;
    setResults((x) => ({ ...x, [slot]: r! }));
    if (r!.kind === 'gacha10') setPulls(r!.pulls);
    fx.burstAt(el, { count: 30, shapes: ['star', 'circle'], speed: 0.4 });
  };

  if (offers.length < MYSTERY_SLOTS.length) {
    return (
      <section className="card mystery3 closed">
        <div className="mystery-art wobble" ref={box}>
          <ItemIcon id="mystery" size={84} />
        </div>
        <div className="grow">
          <h2>今日神秘商品</h2>
          <p className="muted">每天三件特別的商品：只在這裡賣的限定外觀（會動的頭像框、夥伴、背景…）、打折外觀與外觀福袋、扭蛋與道具補給……打開才知道！</p>
          <button type="button" className="btn primary" onClick={reveal}>
            🎁 揭曉今天的 3 件商品
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="card mystery3" ref={box}>
      <header className="mystery3-head">
        <h2>🎁 今日神秘商品</h2>
        <small className="muted">還剩 {hm(left)}・每格一天限買一次</small>
      </header>
      <div className="mystery3-grid">
        {offers.slice(0, MYSTERY_SLOTS.length).map((offer, slot) => {
          const { name, desc } = offerTitle(offer);
          const bought = m?.bought?.includes(slot);
          const blocked = bought ? null : mysteryBlocked(s, offer);
          const was = 'was' in offer && offer.was > offer.cost ? offer.was : undefined;
          const r = results[slot];
          return (
            <div key={slot} className={cx('moffer', `slot-${slot}`, bought && 'done')} data-slot={slot}>
              <span className="moffer-tag">{MYSTERY_SLOTS[slot]}</span>
              <div className="moffer-art">
                <OfferArt o={offer} />
              </div>
              <b>{name}</b>
              <small className="muted">{desc}</small>
              {bought ? (
                <small className="mystery-done">✓ 已購買{r ? `：${resultText(r)}` : ''}</small>
              ) : (
                <div className="mystery-buy">
                  {was && !blocked && <SaleTag was={was} cost={offer.cost} />}
                  <button
                    type="button"
                    className="btn gold small"
                    disabled={!!blocked || s.coins < offer.cost}
                    onClick={(e) => buy(slot, (e.currentTarget as HTMLElement).closest('.moffer'))}
                  >
                    {blocked ?? (
                      <>
                        {was ? '特價 ' : ''}
                        <Coin n={offer.cost} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {pulls && <PullResult pulls={pulls} onClose={() => setPulls(null)} />}
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
  const [note, setNote] = useState('');
  const tryLook = () => {
    const done = c.kind === 'ambient' ? fx.previewAmbient(c.id as AmbientKind, 8000) : fx.toTop(card.current?.querySelector('.look-art') ?? card.current, c.id);
    setNote(done ? (c.kind === 'ambient' ? '背景正在試看 8 秒' : '') : '特效已關閉（設定或系統的減少動態效果）');
    if (!done || c.kind === 'ambient') setTimeout(() => setNote(''), 3000);
  };
  // 試用按鈕：答對特效、回頂特效「試放」，飄落特效「試看」，音效「試聽」
  const tryBtn: [string, () => void] | null =
    c.kind === 'burst' ? ['✨ 試放', tryBurst] : c.kind === 'sound' ? ['🔊 試聽', () => sfx.preview(c.id)] : c.kind === 'ambient' ? ['👀 試看', tryLook] : c.kind === 'totop' ? ['🚀 試放', tryLook] : null;
  return (
    <div ref={card} className={cx('look card', owned && 'owned', on && 'on', c.rare && 'rare', c.anim && 'anim')}>
      <div className="look-badges">
        {c.anim && <span className="chip anim">✨ 動態</span>}
        {c.rare && <span className="chip">限定</span>}
        {on && <span className="chip ok">使用中</span>}
      </div>
      <div className="look-art">
        <CosmeticPreview c={c} size={c.kind === 'frame' ? 86 : 64} />
      </div>
      <b className={cx('look-name', c.kind === 'title' && c.fx && `title-fx-${c.fx}`)}>{c.kind === 'title' ? `「${c.name}」` : c.name}</b>
      <small className="muted look-desc">{note || c.desc}</small>
      <div className="look-actions">
        {tryBtn && (
          <button type="button" className="btn small ghost try-btn" onClick={tryBtn[1]}>
            {tryBtn[0]}
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

/** 每一類的說明 */
export const KIND_DESC: Record<CosmeticKind, string> = {
  frame: '框住你的頭像，名片和上方導覽列都看得到。標「✨ 動態」的會動！',
  title: '顯示在名片的名字下面，限定稱號有文字特效。',
  name: '名片上的名字特效。',
  bg: '個人頁最上方的名片背景。',
  pet: '上課時陪在進度條旁邊：答對會跳、答錯會一起難過，連擊 5 題還會轉一圈。',
  outfit: '首頁的喵師父會穿上。',
  ambient: '網站背景一直飄落的東西，按「試看」先看 8 秒。沒有裝備時跟著季節（秋天楓葉、冬天雪花…）。',
  totop: '頁面往下捲之後，右下角會出現「回到頂端」按鈕，按下去會播放這個特效。',
  burst: '答對時爆出來的特效。',
  sound: '答對時的聲音，可以先試聽。',
  skin: '換掉整個網站的強調色（按鈕、進度條、連結）。',
};

const ALL_AVATARS = [...FREE_AVATARS, ...SHOP_AVATARS, ...PREMIUM_AVATARS];

function LooksTab() {
  const s = useSave();
  const q = useRoute().query.get('kind');
  const [kind, setKind] = useState<LookKind>(isLookKind(q) ? q : 'avatar');
  useEffect(() => {
    if (isLookKind(q)) setKind(q);
  }, [q]);
  const pick = (k: LookKind) => {
    setKind(k);
    // 換分類不換頁（換頁會捲回最上面），只更新網址
    history.replaceState(null, '', href(`/shop?tab=looks&kind=${k}`));
  };
  const count = (k: LookKind) =>
    k === 'avatar' ? `${s.avatars.length}/${ALL_AVATARS.length}` : `${COSMETICS[k].filter((c) => s.owned.includes(cosmeticKey(k, c.id))).length}/${COSMETICS[k].length}`;
  return (
    <>
      <KindPicker value={kind} onPick={pick} count={count} />
      {kind === 'avatar' ? <AvatarShop /> : <LookSection kind={kind} />}
    </>
  );
}

function AvatarShop() {
  const s = useSave();
  const avatars = [...ALL_AVATARS, ...s.avatars.filter((a) => !ALL_AVATARS.includes(a))];
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>頭像</h2>
        <small className="muted">
          一般 {AVATAR_COST}、高級 {PREMIUM_AVATAR_COST} 金幣（高級頭像會動）
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
  );
}

function LookSection({ kind }: { kind: CosmeticKind }) {
  const s = useSave();
  const list = COSMETICS[kind];
  const mine = list.filter((c) => s.owned.includes(cosmeticKey(kind, c.id))).length;
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>{KIND_NAME[kind]}</h2>
        <small className="muted">
          擁有 {mine} / {list.length}
        </small>
      </header>
      <p className="muted small kind-desc">{KIND_DESC[kind]}</p>
      {s.equip[kind] && (
        <button type="button" className="link-btn kind-reset" onClick={() => equipCosmetic(kind, null)}>
          {kind === 'skin' ? '換回預設的紫色' : kind === 'ambient' ? '取下，改回跟著季節' : `取下目前的${KIND_NAME[kind]}`}
        </button>
      )}
      <div className="looks">
        {list.map((c) => (
          <CosmeticCard key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
}

// ───────── 扭蛋 ─────────

const THEMES: Sticker['theme'][] = ['動態', '日本', '韓國', '英語圈', '台灣', '季節', '學習', '傳說'];

type Machine = 'basic' | 'anim' | 'look';
const MACHINE_IDS: Machine[] = ['basic', 'anim', 'look'];
const rarityIdx = (id: string) => ['N', 'R', 'SR', 'SSR'].indexOf(STICKER_BY_ID.get(id)?.rarity ?? 'N');

function GachaTab() {
  const s = useSave();
  const q = useRoute().query.get('m') as Machine | null;
  const [machine, setMachine] = useState<Machine>(q && MACHINE_IDS.includes(q) ? q : 'basic');
  const [pulls, setPulls] = useState<GachaPull[] | null>(null);
  const [look, setLook] = useState<LookPull | null>(null);
  const [spinning, setSpinning] = useState(false);
  const animTotal = STICKERS.filter((x) => x.anim).length;
  const lookLeft = Object.values(COSMETICS)
    .flat()
    .filter((c) => !s.owned.includes(cosmeticKey(c.kind, c.id))).length;

  const pick = (m: Machine) => {
    if (spinning) return;
    setMachine(m);
    history.replaceState(null, '', href(`/shop?tab=gacha&m=${m}`));
  };
  /** 轉扭蛋的動畫跑完再揭曉；稀有的閃一下 */
  const reveal = (best: number, show: () => void) => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      show();
      sfx.combo(best);
      if (best >= 2) fx.flash(best === 3 ? 'rgba(255,215,90,0.4)' : 'rgba(180,140,255,0.3)');
    }, 900);
  };
  const pull = (n: 1 | 10) => {
    if (spinning || machine === 'look') return;
    const res = pullGacha(n, machine);
    if (!ok(!!res)) return;
    reveal(Math.max(...res!.map((r) => rarityIdx(r.id))), () => setPulls(res));
  };
  const pullOne = () => {
    if (spinning) return;
    const res = pullLook();
    if (!ok(!!res)) return;
    const best = res!.kind === 'sticker' ? rarityIdx(res!.id) : cosmeticOf(res!.key)?.rare ? 3 : 2;
    reveal(best, () => setLook(res));
  };

  const info: Record<Machine, { name: string; title: string; desc: string; odds: string; cost: number; cost10: number }> = {
    basic: {
      name: '貼紙',
      title: '貼紙扭蛋機',
      desc: `日本、韓國、英語圈、台灣、季節與學習主題的貼紙，一共 ${STICKERS.length - animTotal} 張；抽到重複的會換回一些金幣。`,
      odds: `十連抽只要九次的價錢，保底一張稀有以上。機率：${RARITY_ODDS.map(([r, p]) => `${RARITY_NAME[r]} ${(p * 100).toFixed(1).replace(/\.0$/, '')}%`).join('、')}`,
      cost: GACHA_COST,
      cost10: GACHA10_COST,
    },
    anim: {
      name: '動態貼紙',
      title: '動態貼紙扭蛋機',
      desc: `會動的貼紙：揮手、眨眼、冒煙、心跳、搗麻糬……一共 ${animTotal} 張，全部都是稀有以上。`,
      odds: `十連抽保底一張超稀有以上。機率：${ANIM_ODDS.map(([r, p]) => `${RARITY_NAME[r]} ${Math.round(p * 100)}%`).join('、')}`,
      cost: ANIM_GACHA_COST,
      cost10: ANIM_GACHA10_COST,
    },
    look: {
      name: '外觀',
      title: '外觀扭蛋機',
      desc: `抽一件你還沒有的外觀（頭像框、夥伴、特效、稱號……），有機會抽到神秘商品限定的外觀；沒抽中外觀時會得到一張動態貼紙。還有 ${lookLeft} 件外觀沒收集。`,
      odds: `機率：限定外觀 ${Math.round(LOOK_ODDS.rare * 100)}%、一般外觀 ${Math.round(LOOK_ODDS.look * 100)}%、動態貼紙 ${Math.round((1 - LOOK_ODDS.rare - LOOK_ODDS.look) * 100)}%`,
      cost: LOOK_GACHA_COST,
      cost10: 0,
    },
  };
  const cur = info[machine];

  return (
    <>
      <section className="card gacha-hall">
        <div className="machine-row" role="tablist" aria-label="扭蛋機">
          {MACHINE_IDS.map((m) => (
            <button key={m} type="button" role="tab" aria-selected={machine === m} className={cx('machine-card', `mc-${m}`, machine === m && 'on')} onClick={() => pick(m)}>
              <GachaArt variant={m} size={78} spin={spinning && machine === m} />
              <b>{info[m].name}</b>
              <small>
                <Coin n={info[m].cost} />
              </small>
            </button>
          ))}
        </div>
        <div className={cx('machine-detail', `mc-${machine}`)}>
          <h2>{cur.title}</h2>
          <p className="muted">{cur.desc}</p>
          <div className="gacha-btns">
            <button type="button" className="btn gold" disabled={spinning || s.coins < cur.cost} onClick={() => (machine === 'look' ? pullOne() : pull(1))}>
              轉一次 <Coin n={cur.cost} />
            </button>
            {machine !== 'look' && (
              <button type="button" className="btn primary" disabled={spinning || s.coins < cur.cost10} onClick={() => pull(10)}>
                十連抽 <Coin n={cur.cost10} />
              </button>
            )}
          </div>
          <p className="muted small">{cur.odds}</p>
        </div>
      </section>

      {machine === 'look' ? <LookCollection /> : <StickerAlbum key={machine} first={machine === 'anim' ? '動態' : 'all'} />}

      {pulls && <PullResult pulls={pulls} onClose={() => setPulls(null)} />}
      {look?.kind === 'sticker' && <PullResult pulls={[look]} onClose={() => setLook(null)} />}
      {look?.kind === 'cosmetic' && <LookResult k={look.key} onClose={() => setLook(null)} />}
    </>
  );
}

/** 貼紙簿：依主題篩選（不用一次捲過全部 100 張） */
function StickerAlbum({ first }: { first: Sticker['theme'] | 'all' }) {
  const s = useSave();
  const [theme, setTheme] = useState<Sticker['theme'] | 'all'>(first);
  const [detail, setDetail] = useState<Sticker | null>(null);
  const got = (list: Sticker[]) => list.filter((x) => s.stickers[x.id]).length;
  const list = theme === 'all' ? STICKERS : STICKERS.filter((x) => x.theme === theme);
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>貼紙簿</h2>
        <small className="muted">
          已收集 {got(STICKERS)} / {STICKERS.length}・可以到 <a href={href('/me?tab=board')}>個人頁 → 貼紙板</a> 布置
        </small>
      </header>
      <div className="theme-chips" role="tablist" aria-label="貼紙主題">
        {(['all', ...THEMES] as const).map((th) => {
          const l = th === 'all' ? STICKERS : STICKERS.filter((x) => x.theme === th);
          return (
            <button key={th} type="button" role="tab" aria-selected={theme === th} className={cx('theme-chip', theme === th && 'on')} onClick={() => setTheme(th)}>
              {th === 'all' ? '全部' : th === '動態' ? '✨ 動態' : th}
              <small>
                {got(l)}/{l.length}
              </small>
            </button>
          );
        })}
      </div>
      <div className="album">
        {list.map((x) => {
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
            <a className="btn ghost" href={href('/me?tab=board')}>
              貼到貼紙板
            </a>
            <button type="button" className="btn primary" onClick={() => setDetail(null)}>
              關閉
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}

/** 外觀扭蛋機下面：各類外觀收集了多少 */
function LookCollection() {
  const s = useSave();
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>外觀收集</h2>
        <small className="muted">外觀扭蛋只會抽到還沒有的外觀</small>
      </header>
      <div className="look-progress">
        {LOOK_KINDS.filter((k) => k.id !== 'avatar').map((k) => {
          const kind = k.id as CosmeticKind;
          const all = COSMETICS[kind];
          const mine = all.filter((c) => s.owned.includes(cosmeticKey(kind, c.id))).length;
          return (
            <a key={kind} className="look-prog-row" href={href(`/shop?tab=looks&kind=${kind}`)}>
              <span className="kind-icon" aria-hidden>
                {k.icon}
              </span>
              <b>{k.name}</b>
              <Bar v={mine / all.length} />
              <small>
                {mine}/{all.length}
              </small>
            </a>
          );
        })}
      </div>
    </section>
  );
}

/** 外觀扭蛋抽到外觀 */
function LookResult({ k, onClose }: { k: string; onClose: () => void }) {
  const c = cosmeticOf(k);
  if (!c) return null;
  return (
    <Modal className="pull-modal single" onClose={onClose}>
      <h2>{c.rare ? '抽到限定外觀！' : '抽到新外觀！'}</h2>
      <div className="pulls">
        <div className={cx('pull', c.rare ? 'r-SSR' : 'r-SR')}>
          <div className="look-result-art">
            <CosmeticPreview c={c} size={110} />
          </div>
          <span className={cx('rarity', c.rare ? 'r-SSR' : 'r-SR')}>{KIND_NAME[c.kind]}</span>
          <b>{c.kind === 'title' ? `「${c.name}」` : c.name}</b>
          <i className="new-badge">NEW!</i>
          <p className="pull-note">{c.desc}</p>
        </div>
      </div>
      <div className="modal-actions">
        <a className="btn ghost" href={href(`/me?tab=looks&kind=${c.kind}`)} onClick={onClose}>
          到個人頁換上
        </a>
        <button type="button" className="btn primary" onClick={onClose} autoFocus>
          好耶
        </button>
      </div>
    </Modal>
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
