// 打字教室：日文輸入法、韓文鍵盤的打法說明，加上幾個字可以當場試打。
import { useState } from 'react';
import { KeyGuideView } from '../components/ExerciseViews';
import { TypingRules } from '../components/TypingRules';
import { META } from '../content';
import type { LangId } from '../core/types';
import { cx } from '../core/util';
import { furiPlain } from '../engine/furigana';
import { checkTyped, diagnose } from '../engine/typing';
import { href } from '../router';

/** 試打用的字：每個都用到一種容易打錯的打法 */
const TRY: Record<'ja' | 'ko', { answer: string; zh: string }[]> = {
  ja: [
    { answer: '学校[がっこう]', zh: '學校（促音）' },
    { answer: 'コーヒー', zh: '咖啡（長音ー）' },
    { answer: '先生[せんせい]', zh: '老師（ん、長音）' },
    { answer: '今日[きょう]', zh: '今天（拗音）' },
    { answer: '切手[きって]を買[か]う', zh: '買郵票（促音、を）' },
    { answer: 'パーティー', zh: '派對（外來語）' },
  ],
  ko: [
    { answer: '한국', zh: '韓國（收尾音）' },
    { answer: '아이', zh: '小孩（ㅇ 開頭）' },
    { answer: '까치', zh: '喜鵲（雙子音 Shift）' },
    { answer: '과자', zh: '餅乾（複合母音）' },
    { answer: '읽어요', zh: '讀（雙收尾音）' },
    { answer: '감사합니다', zh: '謝謝' },
  ],
};

function TryRow({ lang, answer, zh }: { lang: 'ja' | 'ko'; answer: string; zh: string }) {
  const [v, setV] = useState('');
  const [state, setState] = useState<'idle' | 'ok' | 'bad'>('idle');
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const plain = lang === 'ja' ? furiPlain(answer) : answer;
  const check = () => {
    if (!v.trim()) return;
    const ok = checkTyped(lang, v, answer).ok;
    setState(ok ? 'ok' : 'bad');
    setMsg(ok ? null : diagnose(lang, v, answer));
    if (!ok) setShow(true);
  };
  return (
    <div className={cx('try-row card', state)}>
      <div className="try-head">
        <b lang={lang}>{plain}</b>
        <small className="muted">{zh}</small>
        <button type="button" className="link-btn" onClick={() => setShow(!show)}>
          {show ? '收起打法' : '看打法'}
        </button>
      </div>
      <form
        className="try-form"
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <input
          className={cx('type-input', lang, state === 'ok' && 'right', state === 'bad' && 'wrong')}
          value={v}
          onChange={(e) => {
            setV(e.target.value);
            setState('idle');
          }}
          lang={lang}
          placeholder="在這裡試打看看"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label={`試打：${plain}`}
        />
        <button type="submit" className="btn small primary" disabled={!v.trim()}>
          檢查
        </button>
      </form>
      {state === 'ok' && <p className="try-ok">✔ 打對了！</p>}
      {state === 'bad' && <p className="try-bad">✘ {msg ?? '還不對，看看下面的打法。'}</p>}
      {show && <KeyGuideView lang={lang} answer={answer} />}
    </div>
  );
}

export function TypingGuidePage({ lang }: { lang: LangId }) {
  const course = META[lang];
  if (lang !== 'ja' && lang !== 'ko') {
    return (
      <div className="page narrow">
        <p className="muted">英文直接用一般鍵盤打字就可以了。</p>
      </div>
    );
  }
  return (
    <div className="page narrow typing-guide">
      <a className="back-link" href={href(`/l/${lang}/arcade`)}>
        ← {course.name}遊樂場
      </a>
      <section className="card">
        <TypingRules lang={lang} />
      </section>
      <section className="panel">
        <header className="panel-head">
          <h2>當場試打</h2>
          <small className="muted">每個字都用到一種容易打錯的打法</small>
        </header>
        <div className="try-list">
          {TRY[lang].map((t) => (
            <TryRow key={t.answer} lang={lang} answer={t.answer} zh={t.zh} />
          ))}
        </div>
        <a className="btn primary wide" href={href(`/l/${lang}/play/typing`)}>
          ⌨️ 開始打字特訓
        </a>
      </section>
    </div>
  );
}
