// 回到頂端：頁面往下捲一段距離才出現；按下去播放商店買的「回頂特效」，同時捲回最上面
import { useEffect, useRef, useState } from 'react';
import { fx } from '../core/fx';
import { useSave } from '../core/store';
import { cx } from '../core/util';

const SHOW_AT = 500;

export function ToTop() {
  const s = useSave();
  const [show, setShow] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setShow(window.scrollY > SHOW_AT);
    // 換頁時頁面會回到頂端，也要重新判斷
    const later = () => requestAnimationFrame(on);
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('hashchange', later);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('hashchange', later);
    };
  }, []);

  const go = () => {
    // 特效關閉（或系統要求減少動態效果）時直接跳回頂端
    const played = fx.toTop(btn.current, s.equip.totop);
    window.scrollTo({ top: 0, behavior: played ? 'smooth' : 'auto' });
  };

  return (
    <button
      ref={btn}
      type="button"
      className={cx('to-top', show && 'show')}
      onClick={go}
      aria-label="回到頂端"
      title="回到頂端"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <path d="M12 5l-7 7m7-7l7 7M12 5v14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
