// 「我的」頁：名片（頭像、暱稱、稱號、夥伴、背景）、外觀切換（商店買的東西都在這裡換）、學習紀錄
import { useState, type CSSProperties, type ReactNode } from 'react';
import { AVATAR_NAME } from '../art/avatars';
import { STICKERS } from '../art/stickers';
import { Avatar, Pet } from '../components/Avatar';
import { RankEmblem, RankLine } from '../components/RankEmblem';
import { Coin, LangBadge } from '../components/ui';
import { META_LIST } from '../content';
import { ACHIEVEMENTS } from '../core/achievements';
import { lastDays, nowMs, today } from '../core/date';
import { fx, seasonOf, SEASON_LABEL } from '../core/fx';
import { rankOf, TIERS } from '../core/ranks';
import type { Save } from '../core/save';
import { BURSTS, COSMETICS, cosmeticKey, KIND_NAME, TITLES, type Cosmetic, type CosmeticKind } from '../core/shop';
import { sfx } from '../core/sfx';
import { equipCosmetic, setProfile, useSave } from '../core/store';
import { cx, sum } from '../core/util';
import { href, useRoute } from '../router';
import { CosmeticPreview } from '../components/LookPreview';

type Tab = 'looks' | 'stats';
const TABS: [Tab, string][] = [
  ['looks', '👕 外觀切換'],
  ['stats', '📊 學習紀錄'],
];

export function MePage() {
  const route = useRoute();
  const tab = (route.query.get('tab') as Tab) || 'looks';
  return (
    <div className="page me-page">
      <ProfileCard />
      <div className="seg shop-tabs me-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <a key={id} role="tab" aria-selected={tab === id} className={cx(tab === id && 'on')} href={href(`/me?tab=${id}`)}>
            {label}
          </a>
        ))}
      </div>
      {tab === 'looks' && <Wardrobe />}
      {tab === 'stats' && <StatsTab />}
    </div>
  );
}

// ───────── 名片 ─────────

function ProfileCard() {
  const s = useSave();
  const [name, setName] = useState(s.name);
  const [editing, setEditing] = useState(false);
  const title = TITLES.find((t) => t.id === s.equip.title);
  const achGot = ACHIEVEMENTS.filter((a) => s.ach[a.id]).length;
  const stickerCount = STICKERS.filter((x) => s.stickers[x.id]).length;
  return (
    <section className={cx('card profile-head', s.equip.bg && `pbg pbg-${s.equip.bg}`)}>
      <Avatar id={s.avatar} frame={s.equip.frame} size={84} className="profile-avatar" />
      <div className="grow">
        {s.equip.name && !editing ? (
          <button type="button" className={cx('name-show', `name-fx-${s.equip.name}`)} onClick={() => setEditing(true)} title="點一下修改暱稱">
            {name || '學習者'}
          </button>
        ) : (
          <input
            className="name-input"
            value={name}
            maxLength={16}
            aria-label="暱稱"
            autoFocus={editing}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              setProfile({ name });
              setEditing(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
          />
        )}
        {title && <p className={cx('profile-title', title.fx && `title-fx-${title.fx}`)}>「{title.name}」</p>}
        {s.equip.pet && (
          <p className="profile-pet">
            <Pet id={s.equip.pet} size={30} /> <small className="muted">學習夥伴陪你一起上課</small>
          </p>
        )}
        <div className="me-chips">
          <a className="chip" href={href('/profile')}>
            🏆 成就 {achGot} / {ACHIEVEMENTS.length}
          </a>
          <a className="chip" href={href('/shop?tab=gacha')}>
            🎴 貼紙 {stickerCount} / {STICKERS.length}
          </a>
          <span className="chip">
            <Coin n={s.coins} />
          </span>
        </div>
      </div>
    </section>
  );
}

// ───────── 外觀切換 ─────────

/** 每一類「不裝備」時的樣子 */
const NONE_LABEL: Record<CosmeticKind, string> = {
  frame: '不用框',
  pet: '不帶夥伴',
  name: '一般名牌',
  bg: '預設背景',
  title: '不顯示',
  ambient: '跟著季節',
  totop: '預設星光',
  burst: '預設特效',
  sound: '預設音效',
  skin: '預設紫色',
  outfit: '不穿',
};

const KIND_HINT: Record<CosmeticKind, string> = {
  frame: '名片和上方導覽列的頭像外框',
  pet: '上課時陪在進度條旁邊',
  name: '名片上的名字特效',
  bg: '名片的背景',
  title: '名字下面的稱號',
  ambient: '網站背景一直飄落的東西',
  totop: '按「回到頂端」時的特效',
  burst: '答對時爆出來的特效',
  sound: '答對時的聲音',
  skin: '整個網站的強調色',
  outfit: '首頁喵師父的裝扮',
};

const ORDER: CosmeticKind[] = ['frame', 'pet', 'name', 'bg', 'title', 'ambient', 'totop', 'burst', 'sound', 'skin', 'outfit'];

function Tile({ on, onClick, label, children, className }: { on: boolean; onClick: (el: HTMLElement) => void; label: string; children: ReactNode; className?: string }) {
  return (
    <button type="button" className={cx('ward-tile', on && 'on', className)} aria-pressed={on} onClick={(e) => onClick(e.currentTarget)} title={label}>
      <span className="ward-art">{children}</span>
      <small>{label}</small>
      {on && (
        <i className="ward-check" aria-hidden>
          ✓
        </i>
      )}
    </button>
  );
}

function Wardrobe() {
  const s = useSave();
  const jump = (id: string) => document.getElementById(`ward-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const season = seasonOf(new Date(nowMs()));

  /** 換上之後順便示範一下（特效、音效） */
  const demo = (c: Cosmetic, el: HTMLElement) => {
    if (c.kind === 'burst') {
      const b = BURSTS.find((x) => x.id === c.id);
      if (b) fx.burstAt(el, { count: 22, speed: 0.35, colors: b.colors, shapes: b.shapes, glyphs: b.glyphs });
    } else if (c.kind === 'sound') sfx.preview(c.id);
    else if (c.kind === 'totop') fx.toTop(el, c.id);
  };

  return (
    <>
      <nav className="looks-nav" aria-label="外觀分類">
        <button type="button" onClick={() => jump('avatar')}>
          頭像
        </button>
        {ORDER.map((kind) => (
          <button key={kind} type="button" onClick={() => jump(kind)}>
            {KIND_NAME[kind]}
          </button>
        ))}
      </nav>

      <section className="card panel anchor" id="ward-avatar">
        <header className="panel-head">
          <h2>頭像</h2>
          <small className="muted">
            擁有 {s.avatars.length} 個・<a href={href('/shop?tab=looks&kind=avatar')}>到商店買更多</a>
          </small>
        </header>
        <div className="ward-grid">
          {s.avatars.map((a) => (
            <Tile key={a} on={a === s.avatar} label={AVATAR_NAME[a] ?? a} onClick={() => setProfile({ avatar: a })}>
              <Avatar id={a} size={44} />
            </Tile>
          ))}
        </div>
      </section>

      {ORDER.map((kind) => {
        const all = COSMETICS[kind];
        const mine = all.filter((c) => s.owned.includes(cosmeticKey(kind, c.id)));
        const none = kind === 'ambient' && season ? `跟著季節（${SEASON_LABEL[season]?.replace(/^.*的/, '')}）` : NONE_LABEL[kind];
        return (
          <section key={kind} className="card panel anchor" id={`ward-${kind}`}>
            <header className="panel-head">
              <h2>{KIND_NAME[kind]}</h2>
              <small className="muted">
                {KIND_HINT[kind]}・擁有 {mine.length} / {all.length}・<a href={href(`/shop?tab=looks&kind=${kind}`)}>到商店看看</a>
              </small>
            </header>
            <div className="ward-grid">
              <Tile on={!s.equip[kind]} label={none} className="none" onClick={() => equipCosmetic(kind, null)}>
                <span className="ward-none" aria-hidden>
                  {kind === 'ambient' ? '🍂' : '∅'}
                </span>
              </Tile>
              {mine.map((c) => (
                <Tile
                  key={c.id}
                  on={s.equip[kind] === c.id}
                  label={kind === 'title' ? `「${c.name}」` : c.name}
                  className={cx(c.anim && 'anim', c.rare && 'rare')}
                  onClick={(el) => {
                    const on = s.equip[kind] === c.id;
                    equipCosmetic(kind, on ? null : c.id);
                    if (!on) demo(c, el);
                  }}
                >
                  <CosmeticPreview c={c} size={48} />
                </Tile>
              ))}
              {!mine.length && (
                <a className="ward-empty muted" href={href(`/shop?tab=looks&kind=${kind}`)}>
                  還沒有{KIND_NAME[kind]}，去商店逛逛 →
                </a>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

// ───────── 學習紀錄 ─────────

const WEEKS = 18;

function Heatmap({ s }: { s: Save }) {
  const t = today();
  const [y, m, d] = t.split('-').map(Number);
  const weekday = new Date(y, m - 1, d).getDay();
  // 最後一欄是本週，今天之後的格子留白
  const days = lastDays((WEEKS - 1) * 7 + weekday + 1, t);
  const cols: string[][] = [];
  for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7));
  const level = (xp: number) => (xp === 0 ? 0 : xp < 30 ? 1 : xp < 80 ? 2 : xp < 150 ? 3 : 4);
  const active = days.filter((x) => s.days[x] && sum(s.days[x].xp) > 0).length;

  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>學習熱力圖</h2>
        <small className="muted">
          最近 {WEEKS} 週有 {active} 天學習
        </small>
      </header>
      <div className="heat-scroll">
        <div className="heat">
          {cols.map((col, ci) => (
            <div key={ci} className="heat-col">
              {col.map((day) => {
                const log = s.days[day];
                const xp = log ? sum(log.xp) : 0;
                return (
                  <i
                    key={day}
                    className={cx(`h${level(xp)}`, log?.frozen && xp === 0 && 'frozen', day === t && 'today')}
                    title={`${day}：${xp} XP${log?.frozen && xp === 0 ? '（連勝保護）' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="heat-legend muted">
        少
        {[0, 1, 2, 3, 4].map((l) => (
          <i key={l} className={`h${l}`} />
        ))}
        多<i className="frozen" /> 連勝保護
      </div>
    </section>
  );
}

function Ladder({ s }: { s: Save }) {
  const at = META_LIST.map((c) => ({ c, tier: rankOf(s.xp[c.id]).tier }));
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>段位階梯</h2>
        <small className="muted">三種語言各自累積 XP、各自升段；聖哲以外每段再分 III → II → I</small>
      </header>
      <ol className="ladder">
        {TIERS.map((t, i) => {
          const here = at.filter((x) => x.tier === i);
          const reached = at.some((x) => x.tier >= i);
          return (
            <li key={t.id} className={cx(reached && 'reached')} style={{ '--rank': t.c[0] } as CSSProperties}>
              <RankEmblem step={Math.min(i * 3 + 2, 27)} size={54} />
              <b>{t.name}</b>
              <small>{t.min.toLocaleString()} XP</small>
              <span className="ladder-langs">
                {here.map((x) => (
                  <LangBadge key={x.c.id} course={x.c} size="sm" />
                ))}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function StatsTab() {
  const s = useSave();
  const totalXp = sum(s.xp);
  const acc = s.stats.answers ? Math.round((s.stats.correct / s.stats.answers) * 100) : 0;
  const bestMock = Math.max(0, ...Object.values(s.mocks).map((m) => m.best));
  const stats: [string, string][] = [
    ['總 XP', totalXp.toLocaleString()],
    ['學會的字詞', String(Object.keys(s.items).length)],
    ['完成課程', String(s.stats.lessons)],
    ['答對率', `${acc}%`],
    ['最長連勝', `${s.streak.best} 天`],
    ['最高連擊', String(s.stats.maxCombo)],
    ['模擬考最佳', bestMock ? `${bestMock}%` : '—'],
    ['累計金幣', s.coinsEarned.toLocaleString()],
  ];
  return (
    <>
      <section className="rank-trio">
        {META_LIST.map((c) => (
          <div key={c.id} className="card rank-card" style={{ '--lang': c.color } as CSSProperties}>
            <header>
              <LangBadge course={c} size="sm" />
              <b>{c.name}</b>
            </header>
            <RankLine xp={s.xp[c.id]} size={56} />
          </div>
        ))}
      </section>
      <section className="stat-grid">
        {stats.map(([k, v]) => (
          <div key={k} className="card stat-tile">
            <b>{v}</b>
            <small className="muted">{k}</small>
          </div>
        ))}
      </section>
      <Heatmap s={s} />
      <Ladder s={s} />
    </>
  );
}
