// 上方導覽列的語言切換：顯示目前的語言，點開選另一個。
// 在語言的頁面上（學習、練功、查詢）會換成另一個語言的同一個分頁；在「今天」「我的」只換目前的語言。
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { META, META_LIST } from '../content';
import { setCurrentLang, useCurrentLang } from '../core/currentLang';
import { today } from '../core/date';
import { switchLangPath } from '../core/nav';
import { rankOf } from '../core/ranks';
import { useSave } from '../core/store';
import type { LangId } from '../core/types';
import { cx } from '../core/util';
import { nav, type Route } from '../router';
import { LangBadge } from './ui';

export function LangPicker({ route }: { route: Route }) {
  const s = useSave();
  const lang = useCurrentLang();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // 點外面或按 Esc 收起來；換頁時也收起來
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', outside);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('pointerdown', outside);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);
  useEffect(() => setOpen(false), [route.raw]);

  const pick = (l: LangId) => {
    setOpen(false);
    setCurrentLang(l);
    const to = switchLangPath(route.parts, l);
    if (to) nav(to);
  };

  const meta = META[lang];
  const t = today();
  return (
    <div className="lang-pick" ref={box}>
      <button
        type="button"
        className={cx('lang-pick-btn', open && 'open')}
        style={{ '--lang': meta.color } as CSSProperties}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`目前的語言：${meta.name}（點一下切換）`}
        onClick={() => setOpen(!open)}
      >
        <span className="lang-pick-glyph" lang={lang}>
          {meta.glyph}
        </span>
        <span className="lang-pick-name">{meta.name}</span>
        <span className="lang-pick-caret" aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <div className="lang-menu" role="menu" aria-label="切換語言">
          {META_LIST.map((m) => {
            const xp = s.days[t]?.xp[m.id] ?? 0;
            return (
              <button
                key={m.id}
                type="button"
                role="menuitemradio"
                aria-checked={m.id === lang}
                className={cx('lang-menu-item', m.id === lang && 'on')}
                style={{ '--lang': m.color } as CSSProperties}
                onClick={() => pick(m.id)}
              >
                <LangBadge course={m} size="sm" />
                <span className="grow">
                  <b>
                    {m.name} <small lang={m.id}>{m.native}</small>
                  </b>
                  <small>
                    {rankOf(s.xp[m.id]).name}
                    {xp > 0 ? `・今日 +${xp} XP` : ''}
                  </small>
                </span>
                {m.id === lang && (
                  <span className="lang-menu-check" aria-hidden>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
