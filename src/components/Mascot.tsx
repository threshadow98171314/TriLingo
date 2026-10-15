// 吉祥物「喵師父」：點一下換一句話，連點會說出秘密，偶爾會變成金色的。
import { useRef, useState, type FormEvent } from 'react';
import { META_LIST } from '../content';
import { MASCOT_CONFUSED, MASCOT_GOLD, MASCOT_SECRET, mascotLines } from '../content/mascot';
import { nowMs, today } from '../core/date';
import { tapCount, triggerEgg, whisper } from '../core/eggs';
import { fx } from '../core/fx';
import { quickStats } from '../core/progress';
import { rankOf } from '../core/ranks';
import { sfx } from '../core/sfx';
import { useSave } from '../core/store';
import { cx, sum } from '../core/util';

const GOLD = ['#ffe066', '#fbbf24', '#fff3b0', '#ffffff'];

export function Mascot() {
  const s = useSave();
  const t = today();
  const now = new Date(nowMs());
  const nearest =
    META_LIST.map((c) => ({ lang: c.name, r: rankOf(s.xp[c.id]) }))
      .filter((x) => x.r.next !== null)
      .sort((a, b) => a.r.toNext - b.r.toNext)
      .map((x) => ({ lang: x.lang, name: x.r.nextName!, toNext: x.r.toNext }))[0] ?? null;
  const lines = mascotLines({
    hour: now.getHours(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    streak: s.streak.count,
    lit: s.streak.last === t && s.streak.count > 0,
    due: META_LIST.reduce((n, c) => n + quickStats(s, c.id).due, 0),
    todayXp: s.days[t] ? sum(s.days[t].xp) : 0,
    goal: s.settings.dailyGoal,
    nearest,
  });

  const [line, setLine] = useState(lines[0]);
  const [mood, setMood] = useState<'normal' | 'gold' | 'secret'>('normal');
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const cat = useRef<HTMLButtonElement>(null);

  const tap = () => {
    sfx.meow();
    fx.bump(cat.current, 'fx-hop');
    if (Math.random() < 0.02) {
      setMood('gold');
      setLine(MASCOT_GOLD);
      fx.burstAt(cat.current, { count: 36, colors: GOLD, shapes: ['star', 'glow'], speed: 0.4 });
      triggerEgg('goldcat');
      return;
    }
    if (tapCount('mascot', 5, 3000)) {
      setMood('secret');
      setLine(MASCOT_SECRET);
      triggerEgg('mascot');
      return;
    }
    let next = line;
    for (let i = 0; i < 6 && next === line; i++) next = lines[Math.floor(Math.random() * lines.length)];
    setLine(next);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const ok = whisper(text);
    setLine(ok ? '喵！你知道暗號！' : MASCOT_CONFUSED[Math.floor(Math.random() * MASCOT_CONFUSED.length)]);
    setText('');
    if (ok) setOpen(false);
  };

  return (
    <section className={cx('mascot card', mood)}>
      <button ref={cat} type="button" className="mascot-cat" onClick={tap} aria-label="摸摸喵師父">
        <span className="mascot-face">🐱</span>
        <span className="mascot-band">道</span>
      </button>
      <div className="grow">
        <p className="mascot-name">喵師父</p>
        <p className="mascot-bubble" key={line}>
          {line}
        </p>
        {open && (
          <form className="mascot-whisper" onSubmit={submit}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="對喵師父說悄悄話…" maxLength={24} autoFocus aria-label="悄悄話" />
            <button type="submit" className="btn small primary">
              說
            </button>
          </form>
        )}
      </div>
      <button type="button" className="mascot-ear" onClick={() => setOpen(!open)} title="悄悄話" aria-label="對喵師父說悄悄話">
        💬
      </button>
    </section>
  );
}
