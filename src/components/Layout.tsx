// 上方導覽列與手機版底部導覽
import { useEffect, useState } from 'react';
import { useCloud } from '../core/cloud';
import { nowMs, today } from '../core/date';
import { tapCount, triggerEgg } from '../core/eggs';
import { useSave } from '../core/store';
import { cx, fmtTime } from '../core/util';
import { href, type Route } from '../router';
import { Avatar } from './Avatar';
import { Coin, flameTier } from './ui';

const NAV = [
  { to: '/', icon: '🏠', label: '首頁', match: (p: string[]) => p.length === 0 || p[0] === 'l' },
  { to: '/profile', icon: '🏆', label: '成就', match: (p: string[]) => p[0] === 'profile' },
  { to: '/shop', icon: '🛒', label: '商店', match: (p: string[]) => p[0] === 'shop' },
  { to: '/settings', icon: '⚙️', label: '設定', match: (p: string[]) => p[0] === 'settings' },
];

/** 雙倍 XP 剩餘秒數（每秒更新） */
export function useBoostLeft(): number {
  const until = useSave().boostUntil;
  const [, tick] = useState(0);
  const left = Math.max(0, Math.ceil((until - nowMs()) / 1000));
  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [left > 0]);
  return left;
}

export function TopBar({ route }: { route: Route }) {
  const s = useSave();
  const boost = useBoostLeft();
  const cloud = useCloud();
  const lit = s.streak.count > 0 && s.streak.last === today();
  const cloudTitle: Record<string, string> = {
    syncing: '雲端同步中…',
    ok: '雲端已同步',
    offline: cloud.message || '目前離線',
    error: cloud.message || '同步失敗',
  };
  return (
    <header className="topbar">
      <div className="topbar-in">
        <a
          className={cx('brand', today().endsWith('-04-01') && 'april')}
          href={href('/')}
          onClick={() => {
            if (tapCount('logo', 7, 2500)) triggerEgg('logo');
          }}
        >
          <span className="logo" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          {/* 愚人節：Logo 文字倒過來 */}
          <b>{today().endsWith('-04-01') ? 'LingoTri' : 'TriLingo'}</b>
          <span>三語道場</span>
        </a>
        <nav className="topnav">
          {NAV.map((n) => (
            <a key={n.to} href={href(n.to)} className={cx(n.match(route.parts) && 'on')}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="top-stats">
          {boost > 0 && (
            <span className="stat boost" title="雙倍 XP 生效中">
              ⚡×2 {fmtTime(boost)}
            </span>
          )}
          {cloud.login && (
            <a className={cx('stat icon cloud', cloud.status)} href={href('/settings')} title={cloudTitle[cloud.status]} aria-label={cloudTitle[cloud.status]}>
              {cloud.status === 'error' || cloud.status === 'offline' ? '⚠️' : '☁️'}
            </a>
          )}
          <a className={cx('stat icon help', route.parts[0] === 'help' && 'on')} href={href('/help')} title="使用說明" aria-label="使用說明">
            ❓
          </a>
          <span className={cx('stat streak', lit && 'lit', flameTier(s.streak.count))} title={lit ? '今天已完成學習' : '今天還沒學習'}>
            🔥 {s.streak.count}
          </span>
          <a className="stat" href={href('/shop')} title="金幣" data-coin-target>
            <Coin n={s.coins} />
          </a>
          <a className="avatar" href={href('/profile')} title={s.name}>
            <Avatar id={s.avatar} frame={s.equip.frame} size={30} />
          </a>
        </div>
      </div>
    </header>
  );
}

export function BottomNav({ route }: { route: Route }) {
  return (
    <nav className="bottomnav">
      {NAV.map((n) => (
        <a key={n.to} href={href(n.to)} className={cx(n.match(route.parts) && 'on')}>
          <span>{n.icon}</span>
          {n.label}
        </a>
      ))}
    </nav>
  );
}
