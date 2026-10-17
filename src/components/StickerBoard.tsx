// 貼紙板：把收集到的貼紙貼上去布置。拖曳移動，選取後可以放大縮小、旋轉、移到最上層、拿下來；
// 鍵盤也能操作（方向鍵移動、＋－大小、[ ] 旋轉、Delete 拿下來）。布置存在存檔裡，會跟著雲端同步。
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { STICKER_BY_ID, STICKERS, StickerArt } from '../art/stickers';
import { BOARD_LIMITS, type BoardItem } from '../core/save';
import { setBoard, useSave } from '../core/store';
import { cx } from '../core/util';
import { href } from '../router';

export const BOARD_BGS: [string, string][] = [
  ['cork', '軟木板'],
  ['notebook', '筆記本'],
  ['chalk', '黑板'],
  ['sky', '藍天'],
  ['night', '星空'],
  ['washi', '和紙'],
  ['grass', '草地'],
  ['pink', '粉紅格紋'],
];

/** 貼紙中心留在板子內側一點，至少露出一半，拖到邊邊也拿得回來 */
const clamp01 = (v: number) => Math.min(0.96, Math.max(0.04, v));
const round3 = (v: number) => Math.round(v * 1000) / 1000;

export function StickerBoard() {
  const s = useSave();
  const [items, setItems] = useState<BoardItem[]>(s.board.items);
  const [sel, setSel] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);
  const board = useRef<HTMLDivElement>(null);
  const latest = useRef(items);
  latest.current = items;
  const drag = useRef<{ k: number; dx: number; dy: number; moved: boolean } | null>(null);

  // 存檔變了（例如雲端同步拉下別台裝置的布置）就跟著更新；拖曳中不打斷
  useEffect(() => {
    if (!drag.current) setItems(s.board.items);
  }, [s.board.at]);

  // 連續快速點擊時，用最新的布置計算（不要用這次畫面的舊值）
  const save = (next: BoardItem[]) => {
    latest.current = next;
    setItems(next);
    setBoard({ items: next });
  };
  const used = (id: string, list = items) => list.filter((i) => i.id === id).length;
  const owned = STICKERS.filter((x) => (s.stickers[x.id] ?? 0) > 0);
  const full = items.length >= BOARD_LIMITS.max;
  const cur = items.find((i) => i.k === sel);

  const add = (id: string) => {
    const list = latest.current;
    if (list.length >= BOARD_LIMITS.max || used(id, list) >= (s.stickers[id] ?? 0)) return;
    const k = Math.max(0, ...list.map((i) => i.k)) + 1;
    const n = list.length;
    // 新貼紙依序排在板子上（5 欄 × 3 列），免得疊在一起
    const it: BoardItem = { k, id, x: 0.13 + (n % 5) * 0.185, y: 0.2 + (Math.floor(n / 5) % 3) * 0.3, s: 0.2, r: Math.round((Math.random() - 0.5) * 24) };
    save([...list, it]);
    setSel(k);
  };

  const at = (e: { clientX: number; clientY: number }) => {
    const r = board.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };
  const down = (e: PointerEvent<HTMLDivElement>, it: BoardItem) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // 合成的事件沒有真的指標可以抓
    }
    e.currentTarget.focus({ preventScroll: true });
    const p = at(e);
    drag.current = { k: it.k, dx: p.x - it.x, dy: p.y - it.y, moved: false };
    setSel(it.k);
    setClearing(false);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const p = at(e);
    d.moved = true;
    setItems((list) => list.map((i) => (i.k === d.k ? { ...i, x: round3(clamp01(p.x - d.dx)), y: round3(clamp01(p.y - d.dy)) } : i)));
  };
  const up = () => {
    const d = drag.current;
    drag.current = null;
    if (d?.moved) setBoard({ items: latest.current });
  };

  const edit = (f: (i: BoardItem) => BoardItem) => cur && save(items.map((i) => (i.k === cur.k ? f(i) : i)));
  const resize = (d: number) => edit((i) => ({ ...i, s: round3(Math.min(BOARD_LIMITS.maxSize, Math.max(BOARD_LIMITS.minSize, i.s + d))) }));
  const rotate = (d: number) => edit((i) => ({ ...i, r: i.r + d }));
  const nudge = (dx: number, dy: number) => edit((i) => ({ ...i, x: round3(clamp01(i.x + dx)), y: round3(clamp01(i.y + dy)) }));
  const front = () => cur && save([...items.filter((i) => i.k !== cur.k), cur]);
  const remove = () => {
    if (!cur) return;
    save(items.filter((i) => i.k !== cur.k));
    setSel(null);
  };

  const keys = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 0.05 : 0.01;
    const map: Record<string, () => void> = {
      ArrowLeft: () => nudge(-step, 0),
      ArrowRight: () => nudge(step, 0),
      ArrowUp: () => nudge(0, -step),
      ArrowDown: () => nudge(0, step),
      '+': () => resize(0.03),
      '=': () => resize(0.03),
      '-': () => resize(-0.03),
      '[': () => rotate(-15),
      ']': () => rotate(15),
      Delete: remove,
      Backspace: remove,
    };
    const f = map[e.key];
    if (f) {
      e.preventDefault();
      f();
    }
  };

  return (
    <div className="board-wrap">
      <section className="card panel">
        <header className="panel-head">
          <h2>貼紙板</h2>
          <small className="muted">
            {items.length} / {BOARD_LIMITS.max} 張・拖曳移動，點一下選取後可以放大縮小、旋轉
          </small>
        </header>
        <div
          ref={board}
          className={cx('board', `board-bg-${s.board.bg}`)}
          onPointerDown={() => {
            setSel(null);
            setClearing(false);
          }}
        >
          {items.map((it, i) => (
            <div
              key={it.k}
              className={cx('board-item', sel === it.k && 'sel')}
              style={{ left: `${it.x * 100}%`, top: `${it.y * 100}%`, width: `${it.s * 100}%`, transform: `translate(-50%, -50%) rotate(${it.r}deg)`, zIndex: i + 1 }}
              role="button"
              tabIndex={0}
              aria-label={`${STICKER_BY_ID.get(it.id)?.name ?? ''}（方向鍵移動、＋－調整大小、[ ] 旋轉、Delete 拿下來）`}
              onPointerDown={(e) => down(e, it)}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
              onFocus={() => setSel(it.k)}
              onKeyDown={keys}
            >
              <StickerArt id={it.id} size="100%" />
            </div>
          ))}
          {!items.length && <p className="board-empty">點下面「貼紙收藏」裡的貼紙貼上來，再拖曳到喜歡的位置</p>}
        </div>

        <div className="board-tools" aria-label="調整選取的貼紙">
          <button type="button" onClick={() => resize(-0.03)} disabled={!cur} title="縮小" aria-label="縮小">
            －
          </button>
          <button type="button" onClick={() => resize(0.03)} disabled={!cur} title="放大" aria-label="放大">
            ＋
          </button>
          <button type="button" onClick={() => rotate(-15)} disabled={!cur} title="向左轉" aria-label="向左轉">
            ↺
          </button>
          <button type="button" onClick={() => rotate(15)} disabled={!cur} title="向右轉" aria-label="向右轉">
            ↻
          </button>
          <button type="button" onClick={front} disabled={!cur} title="移到最上層" aria-label="移到最上層">
            ⤒
          </button>
          <button type="button" className="danger" onClick={remove} disabled={!cur} title="拿下來" aria-label="拿下來">
            🗑
          </button>
          <span className="board-tip muted">{cur ? `選取中：${STICKER_BY_ID.get(cur.id)?.name ?? ''}` : '先點一張貼紙'}</span>
        </div>

        <div className="board-bgs" role="radiogroup" aria-label="板子背景">
          {BOARD_BGS.map(([id, name]) => (
            <button key={id} type="button" role="radio" aria-checked={s.board.bg === id} className={cx('board-bg-pick', s.board.bg === id && 'on')} onClick={() => setBoard({ bg: id })}>
              <i className={`board-bg-${id}`} />
              <small>{name}</small>
            </button>
          ))}
        </div>
        {items.length > 0 && (
          <button
            type="button"
            className={cx('link-btn board-clear', clearing && 'warn')}
            onClick={() => {
              if (!clearing) return setClearing(true);
              save([]);
              setSel(null);
              setClearing(false);
            }}
          >
            {clearing ? '再按一次：全部拿下來' : '清空貼紙板'}
          </button>
        )}
      </section>

      <section className="card panel">
        <header className="panel-head">
          <h2>貼紙收藏</h2>
          <small className="muted">
            {owned.length} 種・同一種貼紙最多貼擁有的張數・<a href={href('/shop?tab=gacha')}>去轉扭蛋</a>
          </small>
        </header>
        {owned.length ? (
          <div className="board-tray">
            {owned.map((x) => {
              const left = (s.stickers[x.id] ?? 0) - used(x.id);
              return (
                <button key={x.id} type="button" className={cx('album-slot got', `r-${x.rarity}`)} disabled={left <= 0 || full} onClick={() => add(x.id)} title={left > 0 ? `貼上「${x.name}」` : '都貼上去了'}>
                  <StickerArt id={x.id} size={56} />
                  <small>{x.name}</small>
                  <i className="album-count">{left}</i>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="muted">
            還沒有貼紙，先到 <a href={href('/shop?tab=gacha')}>商店的扭蛋機</a> 抽幾張吧！
          </p>
        )}
      </section>
    </div>
  );
}
