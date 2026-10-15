// 共用的小元件
import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { fx } from '../core/fx';
import { sfx } from '../core/sfx';
import { useSave } from '../core/store';
import { canSpeak, speak, useVoices } from '../core/tts';
import type { CourseMeta, Item, LangId } from '../core/types';
import { cx } from '../core/util';
import { clozeFilled, headOf, isVocab, sayOf } from '../engine/exercises';
import { furiPlain, furiSegs, isKanaStr, toHiragana, toKatakana } from '../engine/furigana';
import { romajiOf } from '../engine/romaji';

/** 連勝火焰的等級：越久越大、顏色越特別（7 天、30 天變藍、100 天變紫） */
export function flameTier(streak: number): string {
  return streak >= 100 ? 'f4' : streak >= 30 ? 'f3' : streak >= 7 ? 'f2' : streak >= 3 ? 'f1' : '';
}

/** 金幣從某處飛進導覽列的錢包（看不到錢包時就只在原地爆開） */
export function flyCoins(from: { x: number; y: number }, amount: number) {
  const target = document.querySelector('[data-coin-target]');
  const ok = fx.coinsTo(from, target, Math.ceil(amount / 4), () => {
    sfx.tick();
    fx.bump(target);
  });
  if (!ok) fx.burst(from.x, from.y, { count: 16, shapes: ['circle', 'star'], colors: ['#ffe066', '#fbbf24', '#fff3b0'] });
}

/** 把「漢字[よみ]」標註轉成振假名顯示 */
export function Ruby({ s }: { s: string }) {
  return (
    <>
      {furiSegs(s).map((g, i) =>
        g.r ? (
          <ruby key={i}>
            {g.t}
            <rt>{g.r}</rt>
          </ruby>
        ) : (
          <Fragment key={i}>{g.t}</Fragment>
        ),
      )}
    </>
  );
}

/** 帶語言標記的文字：瀏覽器會依 lang 選用正確的日文／韓文字型 */
export function Tx({ s, lang, className }: { s: string; lang: LangId | 'zh'; className?: string }) {
  if (lang === 'zh') return <span className={className}>{s}</span>;
  return (
    <span lang={lang} className={className}>
      {lang === 'ja' ? <Ruby s={s} /> : s}
    </span>
  );
}

export function SpeakBtn({ text, lang, size, slow }: { text: string; lang: LangId; size?: 'sm' | 'lg'; slow?: boolean }) {
  useVoices();
  const ok = canSpeak(lang);
  return (
    <button
      type="button"
      className={cx('speak', size, slow && 'slow', !ok && 'off')}
      title={ok ? (slow ? '慢速播放' : '播放發音') : '這個瀏覽器沒有這個語言的語音，建議使用 Chrome 或 Edge'}
      aria-label={slow ? '慢速播放' : '播放發音'}
      onClick={(e) => {
        e.stopPropagation();
        speak(text, lang, { rate: slow ? 0.6 : 1 });
      }}
    >
      {slow ? '🐢' : '🔊'}
    </button>
  );
}

export function Bar({ v, color, className }: { v: number; color?: string; className?: string }) {
  return (
    <div className={cx('bar', className)}>
      <i style={{ width: `${Math.max(0, Math.min(1, v)) * 100}%`, background: color }} />
    </div>
  );
}

export function Stars({ n, max = 3, className }: { n: number; max?: number; className?: string }) {
  return (
    <span className={cx('stars', className)} aria-label={`${n} 顆星`}>
      {Array.from({ length: max }, (_, i) => (
        <i key={i} className={i < n ? 'on' : ''} style={{ animationDelay: `${0.25 + i * 0.22}s` }}>
          ★
        </i>
      ))}
    </span>
  );
}

export function Coin({ n, className }: { n?: number | string; className?: string }) {
  return (
    <span className={cx('coins', className)}>
      <i className="coin" />
      {n !== undefined && <b>{n}</b>}
    </span>
  );
}

export function LangBadge({ course, size }: { course: CourseMeta; size?: 'sm' | 'lg' }) {
  return (
    <span className={cx('lang-badge', size)} style={{ '--lang': course.color } as CSSProperties} lang={course.id}>
      {course.glyph}
    </span>
  );
}

export function Modal({ children, onClose, className }: { children: ReactNode; onClose?: () => void; className?: string }) {
  useEffect(() => {
    if (!onClose) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="modal-back" onClick={onClose}>
      <div className={cx('modal', className)} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/** 數字從 0 跳到目標值 */
export function useCountUp(target: number, ms = 800): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

/** 克漏字題目：把 ___ 畫成空格，作答後填入答案 */
export function ClozeText({ q, lang, fill }: { q: string; lang: LangId; fill?: string | null }) {
  const [before, after = ''] = q.split('___');
  return (
    <span className="cloze" lang={lang}>
      <Tx s={before} lang={lang} />
      <span className={cx('blank', fill && 'filled')}>{fill ? <Tx s={fill} lang={lang} /> : ' '}</span>
      <Tx s={after} lang={lang} />
    </span>
  );
}

/** 一個項目的完整解說：教學卡、作答回饋、圖鑑共用 */
export function ItemCard({ item, lang, big }: { item: Item; lang: LangId; big?: boolean }) {
  const { romaji } = useSave().settings;

  if (item.kind === 'sentence') {
    return (
      <div className={cx('item-card', big && 'big')}>
        <div className="ic-head">
          <Tx className="ic-sentence" s={item.furi ?? item.s} lang={lang} />
          <SpeakBtn text={item.s} lang={lang} />
        </div>
        <div className="ic-meaning">{item.t}</div>
        {item.note && <p className="ic-note">{item.note}</p>}
      </div>
    );
  }

  if (item.kind === 'cloze') {
    const full = clozeFilled(item);
    return (
      <div className="item-card">
        <div className="ic-head">
          <span className="ic-sentence">
            <ClozeText q={item.q} lang={lang} fill={item.opts[item.a]} />
          </span>
          <SpeakBtn text={furiPlain(full).replace(/（[^）]*）/g, '')} lang={lang} />
        </div>
        {item.t && <div className="ic-meaning">{item.t}</div>}
      </div>
    );
  }

  if (item.kind === 'qa') {
    return (
      <div className="item-card">
        <div className="ic-qa">
          <span>問</span>
          <Tx s={item.q} lang={lang} />
          <SpeakBtn text={item.q} lang={lang} size="sm" />
        </div>
        <div className="ic-qa">
          <span>答</span>
          <Tx s={item.opts[item.a]} lang={lang} />
          <SpeakBtn text={item.opts[item.a]} lang={lang} size="sm" />
        </div>
        {item.t && <div className="ic-meaning">{item.t}</div>}
      </div>
    );
  }

  if (!isVocab(item)) return null;
  let sub: string | undefined;
  if (item.kind === 'char') sub = item.rm;
  else if (lang === 'ja') sub = romaji ? romajiOf(item) : undefined;
  else if (lang === 'ko') sub = romaji ? item.rm : undefined;

  return (
    <div className={cx('item-card', big && 'big', item.kind)}>
      <div className="ic-head">
        <Tx className="ic-word" s={headOf(item)} lang={lang} />
        <SpeakBtn text={sayOf(item, lang)} lang={lang} />
      </div>
      {sub && <div className="ic-rm">{sub}</div>}
      {lang === 'ja' && item.kind === 'char' && isKanaStr(item.w) && (
        <div className="ic-pair">
          {/[ぁ-ゖ]/.test(item.w) ? '片假名' : '平假名'}
          <b lang="ja">{/[ぁ-ゖ]/.test(item.w) ? toKatakana(item.w) : toHiragana(item.w)}</b>
        </div>
      )}
      {item.kind !== 'char' && (
        <div className="ic-meaning">
          {item.pos && <em>{item.pos}</em>}
          {item.m}
        </div>
      )}
      {item.note && (
        <p className="ic-note">
          <Ruby s={item.note} />
        </p>
      )}
      {item.ex && (
        <div className="ic-ex">
          <div>
            <Tx s={item.ex.furi ?? item.ex.s} lang={lang} />
            <SpeakBtn text={item.ex.s} lang={lang} size="sm" />
          </div>
          <small>{item.ex.t}</small>
        </div>
      )}
    </div>
  );
}

export function Empty({ icon, title, children }: { icon: string; title: string; children?: ReactNode }) {
  return (
    <div className="empty card">
      <div className="empty-icon">{icon}</div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
