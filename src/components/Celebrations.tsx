// 慶祝畫面：升段、連勝里程碑（全螢幕）與成就提示（右上角）。
import { useEffect } from 'react';
import { COURSES } from '../content';
import { dismissModal, dismissToast, useCelebrations, type ModalEvent } from '../core/celebrate';
import { fx } from '../core/fx';
import { stepName, tierOfStep, TIERS } from '../core/ranks';
import { sfx } from '../core/sfx';
import { RankEmblem } from './RankEmblem';
import { Coin, Modal } from './ui';

function RankUp({ e }: { e: Extract<ModalEvent, { type: 'rank' }> }) {
  const course = COURSES[e.lang];
  const tierUp = tierOfStep(e.to) > tierOfStep(e.from);
  const t = TIERS[tierOfStep(e.to)];
  return (
    <>
      <p className="eyebrow">{course.name}段位</p>
      <h1 className="rankup-title">{tierUp ? '晉升新段位！' : '升階！'}</h1>
      <div className="rankup-stage" style={{ color: t.c[0] }}>
        <div className="rankup-glow" />
        <RankEmblem step={e.to} size={176} className="rankup-emblem" />
      </div>
      <div className="rankup-names">
        <span>{stepName(e.from)}</span>
        <i>→</i>
        <b style={{ color: t.c[0] }}>{stepName(e.to)}</b>
      </div>
      <p className="rankup-reward">
        升段獎勵 <Coin n={`+${e.coins}`} />
      </p>
    </>
  );
}

function StreakUp({ e }: { e: Extract<ModalEvent, { type: 'streak' }> }) {
  return (
    <>
      <p className="eyebrow">連勝里程碑</p>
      <div className="streak-big">🔥</div>
      <h1 className="rankup-title">連續學習 {e.count} 天！</h1>
      <p className="muted">每天一點點，累積起來就是別人追不上的距離。</p>
      <p className="rankup-reward">
        里程碑獎勵 <Coin n={`+${e.coins}`} />
      </p>
    </>
  );
}

export function CelebrationHost() {
  const { modals, toasts } = useCelebrations();
  const modal = modals[0];

  useEffect(() => {
    if (!modal) return;
    sfx.rankUp();
    if (modal.type === 'rank' && tierOfStep(modal.to) > tierOfStep(modal.from)) {
      // 晉升新段位：用該段位的顏色放煙火
      const c = TIERS[tierOfStep(modal.to)].c;
      fx.fireworks(6, [c[0], c[1], '#ffffff']);
      fx.flash('rgba(255,255,255,0.4)');
    } else if (modal.type === 'streak') {
      fx.rain('emoji', { glyphs: ['🔥'], count: 30 });
    } else {
      fx.confetti(140);
    }
    // 徽章出場時在周圍爆出光點
    const t = setTimeout(() => fx.burstAt(document.querySelector('.rankup-emblem'), { count: 30, shapes: ['star', 'glow'], speed: 0.45 }), 650);
    return () => clearTimeout(t);
  }, [modal]);

  return (
    <>
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <button key={t.id} type="button" className="toast" onClick={() => dismissToast(t.id)}>
            <span className="toast-icon">{t.icon}</span>
            <span>
              <b>{t.title}</b>
              {t.text && <small>{t.text}</small>}
            </span>
          </button>
        ))}
      </div>
      {modal && (
        <Modal className="rankup" onClose={dismissModal}>
          {modal.type === 'rank' ? <RankUp e={modal} /> : <StreakUp e={modal} />}
          <button type="button" className="btn primary wide" autoFocus onClick={dismissModal}>
            太棒了
          </button>
        </Modal>
      )}
    </>
  );
}
