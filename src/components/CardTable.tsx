// 撲克牌桌的共用元件：一張牌、扇形手牌、對手座位。
import type { CSSProperties, ReactNode } from 'react';
import { cardKey, isRed, RANK_LABEL, SEAT_AVATAR, SEATS, SUIT_SYMBOL, type Card } from '../engine/cards';
import { cx } from '../core/util';
import { Avatar } from './Avatar';

export function PlayingCard({
  c,
  sel,
  hint,
  dim,
  small,
  shake,
  onClick,
}: {
  c: Card;
  sel?: boolean;
  /** 可以出的牌（發光提示） */
  hint?: boolean;
  dim?: boolean;
  small?: boolean;
  shake?: boolean;
  onClick?: () => void;
}) {
  const cls = cx('pcard', isRed(c) ? 'red' : 'black', sel && 'sel', hint && 'hint', dim && 'dim', small && 'small', shake && 'shake');
  const inner = (
    <>
      <span className="pc-corner">
        <b>{RANK_LABEL[c.r]}</b>
        <i>{SUIT_SYMBOL[c.s]}</i>
      </span>
      <span className="pc-suit" aria-hidden>
        {SUIT_SYMBOL[c.s]}
      </span>
    </>
  );
  const label = `${SUIT_SYMBOL[c.s]}${RANK_LABEL[c.r]}`;
  return onClick ? (
    <button type="button" className={cls} onClick={onClick} aria-label={label} aria-pressed={sel}>
      {inner}
    </button>
  ) : (
    <span className={cls} role="img" aria-label={label}>
      {inner}
    </span>
  );
}

/** 手牌：張數多的時候自動重疊排成一列（手機上也不會超出畫面） */
export function Hand({
  cards,
  selected,
  playable,
  shake,
  onPick,
}: {
  cards: Card[];
  selected?: Set<string>;
  /** 有給的話：可以出的牌發光、其他變暗 */
  playable?: Set<string>;
  shake?: string | null;
  onPick?: (c: Card) => void;
}) {
  return (
    <div className="hand" style={{ '--n': Math.max(cards.length, 1) } as CSSProperties}>
      {cards.map((c) => {
        const k = cardKey(c);
        return (
          <PlayingCard
            key={k}
            c={c}
            sel={selected?.has(k)}
            hint={playable?.has(k)}
            dim={playable ? !playable.has(k) : false}
            shake={shake === k}
            onClick={onPick ? () => onPick(c) : undefined}
          />
        );
      })}
    </div>
  );
}

/** 三位電腦對手：頭像、名字、剩幾張牌、最近的動作 */
export function Seats({ counts, turn, note, sub }: { counts: number[]; turn: number; note?: (p: number) => ReactNode; sub?: (p: number) => ReactNode }) {
  return (
    <div className="seats">
      {[1, 2, 3].map((p) => (
        <div key={p} className={cx('seat', turn === p && 'on')}>
          <Avatar id={SEAT_AVATAR[p]} size={30} />
          <div className="seat-info">
            <b>{SEATS[p]}</b>
            <small>
              🂠 {counts[p]}
              {sub?.(p)}
            </small>
          </div>
          {note?.(p) && <span className="seat-note">{note(p)}</span>}
          {turn === p && <span className="seat-think" aria-label="思考中" />}
        </div>
      ))}
    </div>
  );
}
