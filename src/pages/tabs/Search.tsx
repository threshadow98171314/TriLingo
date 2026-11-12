// 查詢的「搜尋」分頁：用中文意思、原文或讀音找字（整個課程，學過、還沒學的都找得到），也找觀念文章。
// 結果連到學習路線上的那個單元；輸入的字記在網址上，從結果按「上一頁」回來時還在。
import { useMemo, useState } from 'react';
import { SpeakBtn } from '../../components/ui';
import { requireExtra, unitRef } from '../../content';
import { mastery, MASTERY_LABEL } from '../../core/logic';
import { hitOf, norm, searchWords, type SearchEntry, type SearchHit } from '../../core/search';
import type { Save } from '../../core/save';
import type { LangId } from '../../core/types';
import { cx } from '../../core/util';
import { href, replaceUrl, useRoute } from '../../router';

const HINTS: Record<LangId, string[]> = {
  en: ['會議', 'schedule', '預約', 'refund'],
  ja: ['吃', 'たべる', '駅', '先生'],
  ko: ['吃', '먹다', '學校', '사랑'],
};
const PLACEHOLDER: Record<LangId, string> = {
  en: '輸入中文或英文',
  ja: '輸入中文、日文或假名讀音',
  ko: '輸入中文或韓文',
};

/** 一次最多列幾個字 */
const LIMIT = 50;
/** 「最近學的字」列幾個 */
const RECENT = 8;

/** 結果連到學習路線上的那個單元（單字庫連到那一組），打開時會展開它 */
function unitLink(lang: LangId, id: string): string | null {
  const ref = unitRef(id);
  if (!ref) return null;
  const base = ref.unit.bank ? `/l/${lang}/bank/${ref.stage.id}` : `/l/${lang}/s/${ref.stage.id}`;
  return `${base}?u=${encodeURIComponent(ref.unit.id)}`;
}

function HitRow({ lang, hit, s }: { lang: LangId; hit: SearchHit; s: Save }) {
  const m = mastery(s.items[hit.id]);
  const ref = unitRef(hit.id);
  const to = unitLink(lang, hit.id);
  const body = (
    <>
      <span className="search-word">
        <b lang={lang}>{hit.word}</b>
        {hit.reading && <small lang="ja">{hit.reading}</small>}
      </span>
      <span className="search-meaning">{hit.meaning}</span>
      {ref && (
        <small className="muted search-where">
          {ref.stage.short} › {ref.unit.title}
        </small>
      )}
    </>
  );
  return (
    <li className="search-hit">
      <span className={cx('chip', m ? `m${m}` : 'search-new')}>{m ? MASTERY_LABEL[m] : '未學'}</span>
      {to ? (
        <a className="search-main" href={href(to)}>
          {body}
        </a>
      ) : (
        <span className="search-main">{body}</span>
      )}
      <SpeakBtn text={hit.reading || hit.word} lang={lang} size="sm" />
    </li>
  );
}

export function SearchTab({ lang, s }: { lang: LangId; s: Save }) {
  const entries = requireExtra('search', lang);
  const concepts = requireExtra('concepts', lang);
  const route = useRoute();
  const [q, setQ] = useState(() => route.query.get('q') ?? '');

  const change = (v: string) => {
    setQ(v);
    replaceUrl(`/l/${lang}/search${v.trim() ? `?q=${encodeURIComponent(v.trim())}` : ''}`);
  };

  const { hits, total } = useMemo(() => searchWords(entries, q, LIMIT), [entries, q]);
  const nq = norm(q);
  const conceptHits = nq ? concepts.filter((c) => norm(`${c.title} ${c.summary}`).includes(nq)).slice(0, 6) : [];

  // 還沒輸入：列出最近學的字
  const recent = useMemo(() => {
    if (nq) return [];
    const byId = new Map<string, SearchEntry>(entries.map((e) => [e[0], e]));
    return Object.entries(s.items)
      .filter(([id]) => byId.has(id))
      .sort(([, a], [, b]) => b.t - a.t)
      .slice(0, RECENT)
      .map(([id]) => hitOf(byId.get(id)!));
  }, [entries, s.items, nq]);

  return (
    <>
      <section className="card search-box">
        <label className="search-field">
          <span aria-hidden>🔎</span>
          <input type="search" value={q} onChange={(e) => change(e.target.value)} placeholder={PLACEHOLDER[lang]} aria-label="搜尋單字" enterKeyHint="search" autoComplete="off" />
          {q && (
            <button type="button" className="search-clear" aria-label="清除" onClick={() => change('')}>
              ✕
            </button>
          )}
        </label>
        {!nq && (
          <div className="search-hints">
            <small className="muted">試試看：</small>
            {HINTS[lang].map((h) => (
              <button key={h} type="button" className="chip" lang={/[a-z]/i.test(h) || /[぀-ヿ가-힯]/.test(h) ? lang : undefined} onClick={() => change(h)}>
                {h}
              </button>
            ))}
          </div>
        )}
      </section>

      {nq && conceptHits.length > 0 && (
        <section className="card search-concepts">
          <h3 className="group-label">💡 觀念講堂</h3>
          {conceptHits.map((c) => (
            <a key={c.id} className="search-concept" href={href(`/l/${lang}/concept/${c.id}`)}>
              <span aria-hidden>{c.icon}</span>
              <span className="grow">
                <b>{c.title}</b>
                <small className="muted">{c.summary}</small>
              </span>
              <span aria-hidden>›</span>
            </a>
          ))}
        </section>
      )}

      {nq ? (
        hits.length ? (
          <section className="card search-results">
            <h3 className="group-label">
              單字・片語 <small>{total > hits.length ? `前 ${hits.length} 個（共 ${total} 個，多輸入幾個字可以縮小範圍）` : `${total} 個`}</small>
            </h3>
            <ul>
              {hits.map((h) => (
                <HitRow key={h.id} lang={lang} hit={h} s={s} />
              ))}
            </ul>
          </section>
        ) : (
          conceptHits.length === 0 && (
            <section className="card search-empty">
              <span aria-hidden>🤔</span>
              <p className="muted">找不到「{q.trim()}」。換個說法試試看，例如只輸入一部分的字，或用中文意思找。</p>
            </section>
          )
        )
      ) : (
        recent.length > 0 && (
          <section className="card search-results">
            <h3 className="group-label">最近學的字</h3>
            <ul>
              {recent.map((h) => (
                <HitRow key={h.id} lang={lang} hit={h} s={s} />
              ))}
            </ul>
          </section>
        )
      )}
    </>
  );
}
