// 觀念講堂：文法觀念、解題技巧、使用習慣的短文，附例句與語音，文末小測驗。
import { useState, type CSSProperties } from 'react';
import type { ResultData } from '../components/Result';
import { Session } from '../components/Session';
import { Empty, Ruby, SpeakBtn, Stars, Tx } from '../components/ui';
import { META, requireCourse } from '../content';
import { starsOf } from '../core/progress';
import type { Save } from '../core/save';
import { finishConcept, type SessionStats } from '../core/store';
import { useVoices } from '../core/tts';
import type { Concept, LangId } from '../core/types';
import { cx } from '../core/util';
import { clozeEx } from '../engine/exercises';
import { href } from '../router';
import { ctxOf, statLines } from './Practice';

export const conceptPath = (lang: LangId, id: string) => `/l/${lang}/concept/${encodeURIComponent(id)}`;

/** 語言頁的「觀念」分頁：依分類列出所有文章 */
export function ConceptsTab({ lang, s }: { lang: LangId; s: Save }) {
  const list = requireCourse(lang).concepts;
  if (!list.length) {
    return (
      <Empty icon="💡" title="觀念文章準備中">
        <p className="muted">這個語言的觀念講堂還在撰寫中。</p>
      </Empty>
    );
  }
  const cats = [...new Set(list.map((c) => c.cat))];
  const done = list.filter((c) => starsOf(s, c.id) > 0).length;
  return (
    <>
      <p className="muted concept-count">
        已讀完 {done} / {list.length} 篇。每篇最後都有小測驗，答完會記下星星。
      </p>
      {cats.map((cat) => (
        <section key={cat} className="panel">
          <header className="panel-head">
            <h2>{cat}</h2>
          </header>
          <div className="concept-list">
            {list
              .filter((c) => c.cat === cat)
              .map((c) => {
                const st = starsOf(s, c.id);
                return (
                  <a key={c.id} className={cx('concept-card card', st > 0 && 'done')} href={href(conceptPath(lang, c.id))}>
                    <span className="concept-icon">{c.icon}</span>
                    <div className="grow">
                      <b>{c.title}</b>
                      <small className="muted">{c.summary}</small>
                    </div>
                    <div className="concept-side">
                      {c.level && <span className="chip">{c.level}</span>}
                      {st > 0 && <Stars n={st} className="small" />}
                    </div>
                  </a>
                );
              })}
          </div>
        </section>
      ))}
    </>
  );
}

function findConcept(lang: LangId, id: string): { c: Concept; prev?: Concept; next?: Concept } | null {
  const list = requireCourse(lang).concepts;
  const i = list.findIndex((x) => x.id === id);
  if (i < 0) return null;
  return { c: list[i], prev: list[i - 1], next: list[i + 1] };
}

/** 一篇觀念文章 */
export function ConceptPage({ lang, id }: { lang: LangId; id: string }) {
  useVoices();
  const found = findConcept(lang, id);
  if (!found) {
    return (
      <div className="page narrow">
        <Empty icon="🧭" title="找不到這篇文章">
          <a className="btn primary" href={href(`/l/${lang}/concepts`)}>
            回觀念講堂
          </a>
        </Empty>
      </div>
    );
  }
  const { c, prev, next } = found;
  const tl = (s: string) => <Ruby s={s} />;
  return (
    <div className="page narrow concept-page" style={{ '--lang': META[lang].color } as CSSProperties}>
      <a className="back-link" href={href(`/l/${lang}/concepts`)}>
        ← 觀念講堂
      </a>
      <header className="card concept-head">
        <span className="concept-big-icon">{c.icon}</span>
        <div className="grow">
          <small className="muted">
            {c.cat}
            {c.level && `・建議程度：${c.level}`}
          </small>
          <h1>{tl(c.title)}</h1>
          <p className="muted">{tl(c.summary)}</p>
        </div>
      </header>

      {c.sections.map((sec, i) => (
        <section key={i} className="card concept-sec">
          <h2>{tl(sec.h)}</h2>
          {sec.body.map((p, k) => (
            <p key={k}>{tl(p)}</p>
          ))}
          {sec.table && (
            <div className="concept-table-wrap">
              <table className="concept-table">
                <thead>
                  <tr>
                    {sec.table[0].map((h, k) => (
                      <th key={k}>{tl(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sec.table.slice(1).map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, k) => (
                        <td key={k} lang={k === 0 ? lang : undefined}>
                          {tl(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!!sec.examples?.length && (
            <div className="concept-ex">
              {sec.examples.map((e, k) => (
                <div key={k} className="concept-ex-row">
                  <div className="grow">
                    <Tx s={e.furi ?? e.s} lang={lang} />
                    <small className="muted">{e.t}</small>
                  </div>
                  <SpeakBtn text={e.s} lang={lang} size="sm" />
                </div>
              ))}
            </div>
          )}
          {sec.tip && <p className="concept-tip">💡 {tl(sec.tip)}</p>}
        </section>
      ))}

      {c.quiz.length > 0 && (
        <section className="card concept-quiz">
          <div className="grow">
            <h2>小測驗</h2>
            <p className="muted">{c.quiz.length} 題，用剛剛的觀念解題。答錯的題目會再出一次，最後會記下星星。</p>
          </div>
          <a className="btn primary" href={href(`${conceptPath(lang, c.id)}/quiz`)}>
            開始小測驗
          </a>
        </section>
      )}

      <nav className="concept-nav">
        {prev ? (
          <a className="btn ghost" href={href(conceptPath(lang, prev.id))}>
            ← {prev.title.replace(/\[[^\]]*\]/g, '')}
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a className="btn ghost" href={href(conceptPath(lang, next.id))}>
            {next.title.replace(/\[[^\]]*\]/g, '')} →
          </a>
        )}
      </nav>
    </div>
  );
}

/** 文章的小測驗 */
export function ConceptQuizPage({ lang, id }: { lang: LangId; id: string }) {
  useVoices();
  const found = findConcept(lang, id);
  const [run, setRun] = useState(0);
  const back = conceptPath(lang, id);
  if (!found || !found.c.quiz.length) {
    return (
      <div className="page narrow">
        <Empty icon="🧭" title="這篇文章沒有小測驗">
          <a className="btn primary" href={href(back)}>
            回文章
          </a>
        </Empty>
      </div>
    );
  }
  const { c, next } = found;
  const ctx = ctxOf(lang);
  const exercises = c.quiz.map((q) => clozeEx(q, ctx));
  const onFinish = (stats: SessionStats): ResultData => ({
    emoji: c.icon,
    headline: stats.correct === stats.graded ? '觀念完全掌握！' : '小測驗完成！',
    sub: stats.correct === stats.graded ? '全部答對，這個觀念你已經會了。' : '答錯的題目可以回去對照文章再看一次。',
    outcome: finishConcept({ lang, id: c.id, stats }),
    lines: statLines(stats),
    back: next ? conceptPath(lang, next.id) : `/l/${lang}/concepts`,
    backLabel: next ? `下一篇：${next.title.replace(/\[[^\]]*\]/g, '')}` : '回觀念講堂',
    again: { label: '再考一次', run: () => setRun(run + 1) },
  });
  return <Session key={run} lang={lang} title={`小測驗：${c.title.replace(/\[[^\]]*\]/g, '')}`} exercises={exercises} mode="game" exitTo={back} record={false} onFinish={onFinish} />;
}
