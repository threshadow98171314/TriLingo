// 充電站：每次打開都不一樣的小知識（知識補充站）和三種語言的諺語（一句話學三語），放在「我的」頁。
import { useState, type CSSProperties } from 'react';
import { META, META_LIST } from '../content';
import { PROVERBS } from '../content/proverbs';
import { randomTip, TIPS } from '../content/tips';
import { furiKana } from '../engine/furigana';
import { LangBadge, Ruby, SpeakBtn, Tx } from './ui';

/** 一句話學三語：三種語言的諺語，每次打開都隨機換一組 */
export function ProverbCard() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 997));
  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>一句話學三語</h2>
        <button type="button" className="btn small ghost" onClick={() => setSeed((n) => n + 1)}>
          換一組
        </button>
      </header>
      <div className="proverb-grid">
        {META_LIST.map((c, i) => {
          const list = PROVERBS[c.id];
          const p = list[(seed + i * 7) % list.length];
          return (
            <div key={c.id} className="proverb" style={{ '--lang': c.color } as CSSProperties}>
              <div className="proverb-top">
                <LangBadge course={c} size="sm" />
                <span className="speak-pair">
                  <SpeakBtn text={c.id === 'ja' ? furiKana(p.text) : p.text} lang={c.id} size="sm" />
                  <SpeakBtn text={c.id === 'ja' ? furiKana(p.text) : p.text} lang={c.id} size="sm" slow />
                </span>
              </div>
              <p className="proverb-text">
                <Tx s={p.text} lang={c.id} />
              </p>
              {p.rm && <small className="muted proverb-rm">{p.rm}</small>}
              <p className="proverb-zh">{p.zh}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** 知識補充站：每次打開都隨機一則，盡量不重複最近看過的 */
export function TipCard() {
  const [i, setI] = useState(() => randomTip());
  const tip = TIPS[i];
  const meta = tip.lang === 'all' ? null : META[tip.lang];
  return (
    <section className="card panel tip-card" style={meta ? ({ '--lang': meta.color } as CSSProperties) : undefined}>
      <header className="panel-head">
        <h2>💡 知識補充站</h2>
        <button type="button" className="btn small ghost" onClick={() => setI(randomTip(undefined, i))}>
          再來一則
        </button>
      </header>
      <article className="tip" key={i}>
        <div className="tip-tags">
          {meta && <LangBadge course={meta} size="sm" />}
          <span className="chip">{tip.cat}</span>
        </div>
        <h3>
          <Ruby s={tip.title} />
        </h3>
        <p>
          <Ruby s={tip.body} />
        </p>
      </article>
    </section>
  );
}
