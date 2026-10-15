// 新手引導：第一次使用的導覽、各頁面第一次打開的說明卡、題型第一次出現時的小提示。
// 看過的會記在存檔（save.guide），跟著雲端同步，換裝置不會重複跳出。
import { useState, type CSSProperties, type ReactNode } from 'react';
import { META_LIST } from '../content';
import { markGuide, useSave } from '../core/store';
import { cx } from '../core/util';
import type { Exercise } from '../engine/exercises';
import { href, nav } from '../router';
import { LangBadge, Modal } from './ui';

/** 某頁面第一次打開時的說明卡；按「知道了」就不再出現 */
export function GuideTip({ id, icon = '💡', title, children }: { id: string; icon?: string; title: string; children: ReactNode }) {
  const seen = !!useSave().guide[id];
  if (seen) return null;
  return (
    <aside className="guide-tip card" role="note">
      <span className="guide-icon" aria-hidden>
        {icon}
      </span>
      <div className="grow">
        <b>{title}</b>
        <div className="guide-body">{children}</div>
      </div>
      <button type="button" className="btn small" onClick={() => markGuide(id)}>
        知道了
      </button>
    </aside>
  );
}

// ───────── 第一次使用的導覽 ─────────

const SLIDES = [
  {
    icon: '👋',
    title: '歡迎來到三語道場',
    text: '英文、日文、韓文，三種語言一起學。每種語言各自累積 XP、各自升段，從「鐵」一路升到最高的「聖哲」。',
  },
  {
    icon: '📚',
    title: '跟著學習路線上課',
    text: '每堂課 3～5 分鐘：先看教學卡，再做練習。一個單元的課上完、通過「單元測驗」，就會解鎖下一個單元。已經會的內容可以直接考單元測驗跳級。',
  },
  {
    icon: '🔥',
    title: '每天學一點',
    text: '每天拿到「每日目標」的 XP 就能延續連勝。完成每日任務領金幣，三個任務都領完還能開寶箱；金幣可以在商店換連勝保護和雙倍 XP。',
  },
  {
    icon: '🧠',
    title: '複習比學新的更重要',
    text: '學過的字會在快要忘記的時候排進「待複習」。每天先把待複習清空再上新課，記得最牢。',
  },
  {
    icon: '🎮',
    title: '遊樂場與模擬考',
    text: '遊樂場用你學過的字出小遊戲；模擬考是仿照多益、日檢、TOPIK 的計時測驗，用來檢查自己的程度。看不懂的地方，隨時可以按右上角的 ❓ 看使用說明。',
  },
];

export function WelcomeTour() {
  const s = useSave();
  const [i, setI] = useState(0);
  const fresh = Object.keys(s.items).length === 0;
  const last = i === SLIDES.length;
  const done = (to?: string) => {
    markGuide('welcome');
    if (to) nav(to);
  };

  return (
    <Modal className="welcome" onClose={() => done()}>
      {!last ? (
        <div className="welcome-slide" key={i}>
          <div className="welcome-icon">{SLIDES[i].icon}</div>
          <h2>{SLIDES[i].title}</h2>
          <p>{SLIDES[i].text}</p>
        </div>
      ) : (
        <div className="welcome-slide" key="pick">
          <div className="welcome-icon">🚀</div>
          <h2>{fresh ? '想先從哪個語言開始？' : '準備好了！'}</h2>
          <p>{fresh ? '三種語言隨時都能切換，先挑一個最想學的。' : '新功能都在這裡了，繼續你的學習吧。'}</p>
          {fresh && (
            <div className="welcome-langs">
              {META_LIST.map((c) => (
                <button key={c.id} type="button" className="welcome-lang" style={{ '--lang': c.color } as CSSProperties} onClick={() => done(`/l/${c.id}`)}>
                  <LangBadge course={c} />
                  <b>{c.name}</b>
                  <small>{c.goal}</small>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="welcome-dots" aria-hidden>
        {[...SLIDES, null].map((_, k) => (
          <i key={k} className={cx(k === i && 'on')} />
        ))}
      </div>

      <div className="modal-actions">
        {i > 0 ? (
          <button type="button" className="btn" onClick={() => setI(i - 1)}>
            上一步
          </button>
        ) : (
          <button type="button" className="btn ghost" onClick={() => done()}>
            略過
          </button>
        )}
        {!last ? (
          <button type="button" className="btn primary" onClick={() => setI(i + 1)} autoFocus>
            下一步
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={() => done(fresh ? undefined : '/')}>
            {fresh ? '先逛逛' : '開始'}
          </button>
        )}
      </div>
    </Modal>
  );
}

// ───────── 題型第一次出現的小提示 ─────────

/** 這一題屬於哪一種題型（每種題型只提示一次） */
export function exHintOf(ex: Exercise): { id: string; text: string } | null {
  switch (ex.t) {
    case 'teach':
      return { id: 'ex:teach', text: '新內容先看教學卡：按 🔊 聽發音，看懂了就按「繼續」。' };
    case 'note':
      return { id: 'ex:note', text: '文法重點：先看說明和例句，接下來的練習都會用到。' };
    case 'match':
      return { id: 'ex:match', text: '先點左邊、再點右邊，把對應的兩張配成一對。' };
    case 'type':
      return { id: 'ex:type', text: '用英文字母輸入這個字的羅馬拼音，例如 か → ka，按 Enter 送出。' };
    case 'typeja':
      return { id: 'ex:typeja', text: '用日文輸入法打出答案，假名或漢字都可以。想不起來就按「💡 提示」看第一個假名。' };
    case 'tiles':
      return ex.mode === 'spell'
        ? { id: 'ex:spell', text: '依序點下方的字卡拼出答案；點上面已經放好的字卡可以拿回來。' }
        : { id: 'ex:build', text: '照中文的意思，把字卡排成正確的句子；排錯了點上面的字卡可以拿回來。' };
    case 'choice':
      if (ex.mode === 'w2r') return { id: 'ex:w2r', text: '漢字讀音題：選出正確的假名讀音。小心長音、促音（っ）、濁音的差別。' };
      if (ex.mode === 'cloze') return { id: 'ex:cloze', text: '選出最適合填進空格的答案，作答後會顯示解析。' };
      if (ex.mode === 'qa' && ex.reveal.item.kind === 'qa' && ex.reveal.item.ask)
        return ex.audio
          ? { id: 'ex:talk', text: '先看畫面上的問題，再聽對話或獨白找答案。男女用不同的聲音唸；🔊 重聽、🐢 慢速播放。' }
          : { id: 'ex:read', text: '閱讀題：先看最後的問題，再回到文章裡找關鍵字，不用每個字都看懂。' };
      if (ex.mode === 'qa') return { id: 'ex:qa', text: '聽問題（或看問題），選出最自然的回應。' };
      if (ex.audio) return { id: 'ex:listen', text: '聽力題：🔊 重聽、🐢 慢速播放。在不方便出聲的地方，可以按「現在不方便聽」改成看文字。' };
      return null;
  }
}

export function ExHint({ ex }: { ex: Exercise }) {
  const s = useSave();
  const h = exHintOf(ex);
  if (!h || s.guide[h.id]) return null;
  return (
    <p className="ex-hint">
      <span>💡 {h.text}</span>
      <button type="button" aria-label="不再顯示這個提示" onClick={() => markGuide(h.id)}>
        ✕
      </button>
    </p>
  );
}

/** 「?」說明連結 */
export function HelpLink({ to = '/help', children = '❓ 使用說明' }: { to?: string; children?: ReactNode }) {
  return (
    <a className="help-link" href={href(to)}>
      {children}
    </a>
  );
}
