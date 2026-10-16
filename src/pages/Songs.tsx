// 聽日文歌學日語：排行榜歌單、官方 MV、自己貼上的歌詞（只存在自己的存檔）、對時、點一句從那句開始唱。
import { useEffect, useRef, useState, type FormEvent, type MutableRefObject } from 'react';
import { GuideTip } from '../components/Guide';
import { Empty, Ruby, SpeakBtn } from '../components/ui';
import { YouTubePlayer, type YTHandle } from '../components/YouTube';
import { CHART_DATE, CHART_NAME, CLASSIC_BY_ID, CLASSICS, SONG_BY_ID, SONGS, type Song } from '../content/songs';
import type { Save } from '../core/save';
import { activeLine, fmtSec, parseLyrics, syncedCount, youtubeIdOf, type SongLine } from '../core/songs';
import { addCustomSong, removeCustomSong, saveLyrics, useSave } from '../core/store';
import { cx } from '../core/util';
import { furiPlain } from '../engine/furigana';
import { href, nav } from '../router';

const songPath = (id: string) => `/l/ja/song/${encodeURIComponent(id)}`;
const thumb = (yt: string) => `https://i.ytimg.com/vi/${yt}/mqdefault.jpg`;

/** 歌單裡的歌，或使用者自己加的歌 */
function findSong(s: Save, id: string): Song | null {
  const chart = SONG_BY_ID.get(id);
  if (chart) return chart;
  const mine = s.customSongs.find((c) => c.id === id);
  return mine ? { id: mine.id, title: mine.title, artist: mine.artist, zh: '', yt: mine.yt, rank: 0 } : null;
}

/** 這首歌目前的歌詞：自己存的（含對時）優先，經典歌曲沒存過就用網站附的歌詞 */
function lyricsOf(s: Save, id: string): SongLine[] {
  const mine = s.songs[id]?.lines;
  if (mine?.length) return mine;
  return CLASSIC_BY_ID.get(id)?.lines.map((l) => ({ ...l })) ?? [];
}

function LyricsStatus({ s, id }: { s: Save; id: string }) {
  const ly = s.songs[id];
  if (!ly?.lines.length) return <small className="muted">{CLASSIC_BY_ID.has(id) ? '✓ 附歌詞與翻譯' : '還沒有歌詞'}</small>;
  const synced = syncedCount(ly.lines);
  return (
    <small className={cx('song-status', synced === ly.lines.length && 'done')}>
      {synced === ly.lines.length ? `✓ 已對時（${ly.lines.length} 句）` : `已有歌詞 ${ly.lines.length} 句・對時 ${synced}`}
    </small>
  );
}

/** 語言頁的「日文歌」分頁 */
export function SongsTab({ s }: { s: Save }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const yt = youtubeIdOf(url);
  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!yt) return;
    const id = addCustomSong({ title, artist, yt });
    nav(songPath(id));
  };
  return (
    <>
      <GuideTip id="tab:songs" title="聽日文歌學日語" icon="🎵">
        <ul>
          <li>排行榜的歌：點進去打開官方 MV，再按「📄 官方授權歌詞」到 Uta-Net 複製歌詞貼上。流行歌的歌詞有版權，網站是公開的，不能直接放進來；貼上的歌詞只存在你的瀏覽器（有開雲端同步的話，也會存進你自己的私人 Gist）。</li>
          <li>中文翻譯按「🌐 自動翻譯」一鍵產生：Chrome 用瀏覽器內建的翻譯（在裝置上翻譯），其他瀏覽器用免費的 MyMemory 翻譯服務。</li>
          <li>經典童謠・唱歌的歌詞已是公有領域，網站直接附上日文、讀音與中文翻譯，打開就能學。</li>
          <li>按「對時」跟著歌一句一句按，之後點任一句歌詞就會從那一句開始唱。</li>
        </ul>
      </GuideTip>
      <section className="panel">
        <header className="panel-head">
          <h2>排行榜歌單</h2>
          <small className="muted">
            {CHART_NAME}・{CHART_DATE}
          </small>
        </header>
        <div className="song-grid">
          {SONGS.map((song) => (
            <a key={song.id} className="song-card card" href={href(songPath(song.id))}>
              <span className="song-thumb">
                <img src={thumb(song.yt)} alt="" loading="lazy" />
                <b className="song-rank">#{song.rank}</b>
              </span>
              <span className="song-info">
                <b lang="ja">{song.title}</b>
                <small lang="ja">{song.artist}</small>
                <small className="muted">{song.zh}</small>
                <LyricsStatus s={s} id={song.id} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="panel">
        <header className="panel-head">
          <h2>經典童謠・唱歌</h2>
          <small className="muted">歌詞已是公有領域：附日文歌詞、讀音、中文翻譯與文法說明</small>
        </header>
        <div className="song-grid">
          {CLASSICS.map((song) => (
            <a key={song.id} className="song-card card" href={href(songPath(song.id))}>
              <span className="song-thumb">
                <img src={thumb(song.yt)} alt="" loading="lazy" />
                <b className="song-rank classic">名曲</b>
              </span>
              <span className="song-info">
                <b lang="ja">{song.title}</b>
                <small lang="ja">{song.artist}</small>
                <small className="muted">{song.zh}</small>
                <LyricsStatus s={s} id={song.id} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="panel">
        <header className="panel-head">
          <h2>我的歌</h2>
          <small className="muted">貼上任何 YouTube 影片的網址，就能用同樣的方式學</small>
        </header>
        {s.customSongs.length > 0 && (
          <div className="song-grid">
            {s.customSongs.map((c) => (
              <a key={c.id} className="song-card card" href={href(songPath(c.id))}>
                <span className="song-thumb">
                  <img src={thumb(c.yt)} alt="" loading="lazy" />
                </span>
                <span className="song-info">
                  <b lang="ja">{c.title}</b>
                  <small lang="ja">{c.artist}</small>
                  <LyricsStatus s={s} id={c.id} />
                </span>
              </a>
            ))}
          </div>
        )}
        <form className="card song-add" onSubmit={add}>
          <label>
            YouTube 網址
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" inputMode="url" />
          </label>
          <label>
            歌名
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：マリーゴールド" lang="ja" />
          </label>
          <label>
            歌手
            <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="例如：あいみょん" lang="ja" />
          </label>
          <button type="submit" className="btn primary" disabled={!yt}>
            ＋ 加入
          </button>
          {url && !yt && <small className="muted">看不出影片 id，請貼完整的 YouTube 網址。</small>}
        </form>
      </section>
    </>
  );
}

// ───────── 一首歌 ─────────

/** Chrome 內建的翻譯（Translator API，在裝置上翻譯，不會上傳） */
function translatorApi(): any {
  return typeof window !== 'undefined' ? (window as any).Translator : undefined;
}

/** 沒有內建翻譯的瀏覽器：用免費的 MyMemory 翻譯服務，一句一句翻 */
async function myMemory(texts: string[], onProgress: (msg: string) => void): Promise<string[]> {
  const out: string[] = [];
  for (let i = 0; i < texts.length; i++) {
    onProgress(`翻譯中 ${i + 1} / ${texts.length}（MyMemory）`);
    const q = texts[i].slice(0, 450);
    if (!q.trim()) {
      out.push('');
      continue;
    }
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=ja|zh-TW`);
    if (!r.ok) throw new Error(`翻譯服務沒有回應（${r.status}）`);
    const j = (await r.json()) as { responseData?: { translatedText?: string }; quotaFinished?: boolean };
    if (j.quotaFinished) throw new Error('今天的免費翻譯額度用完了，明天再試，或改用 Google 翻譯。');
    out.push(j.responseData?.translatedText ?? '');
  }
  return out;
}

/** 在 Google 翻譯打開（自己複製結果貼回來） */
export const googleTranslateUrl = (text: string) => `https://translate.google.com/?sl=ja&tl=zh-TW&op=translate&text=${encodeURIComponent(text.slice(0, 1800))}`;

/** 一鍵翻譯：先用 Chrome 內建的翻譯（在裝置上翻譯），不支援或失敗時改用 MyMemory */
async function translateAll(texts: string[], onProgress: (msg: string) => void): Promise<string[]> {
  if (translatorApi()) {
    try {
      return await chromeTranslate(texts, onProgress);
    } catch {
      // 例如沒有日文翻繁中的模型：改用線上服務
    }
  }
  return myMemory(texts, onProgress);
}

async function chromeTranslate(texts: string[], onProgress: (msg: string) => void): Promise<string[]> {
  const T = translatorApi();
  let target = 'zh-Hant';
  let avail = await T.availability({ sourceLanguage: 'ja', targetLanguage: target });
  if (avail === 'unavailable') {
    target = 'zh';
    avail = await T.availability({ sourceLanguage: 'ja', targetLanguage: target });
  }
  if (avail === 'unavailable') throw new Error('這個瀏覽器不支援日文翻中文。');
  const tr = await T.create({
    sourceLanguage: 'ja',
    targetLanguage: target,
    monitor(m: EventTarget) {
      m.addEventListener('downloadprogress', (e) => onProgress(`下載翻譯模型 ${Math.round(((e as unknown as { loaded: number }).loaded ?? 0) * 100)}%`));
    },
  });
  const out: string[] = [];
  for (let i = 0; i < texts.length; i++) {
    onProgress(`翻譯中 ${i + 1} / ${texts.length}`);
    out.push(await tr.translate(texts[i]));
  }
  return out;
}

export function SongPage({ id }: { id: string }) {
  const s = useSave();
  const song = findSong(s, id);
  const lyrics = lyricsOf(s, id);
  const classic = CLASSIC_BY_ID.get(id);
  const [mode, setMode] = useState<'play' | 'sync' | 'edit'>(lyrics.length ? 'play' : 'edit');
  const [cc, setCc] = useState(false);
  const player = useRef<YTHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [showZh, setShowZh] = useState(true);

  // 播放中每 0.2 秒更新時間，用來標出正在唱的那一句
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setTime(player.current?.time() ?? 0), 200);
    return () => clearInterval(t);
  }, [playing]);

  if (!song) {
    return (
      <div className="page narrow">
        <Empty icon="🎵" title="找不到這首歌">
          <a className="btn primary" href={href('/l/ja/songs')}>
            回歌單
          </a>
        </Empty>
      </div>
    );
  }

  const mine = id.startsWith('my-');
  return (
    <div className="page narrow song-page">
      <a className="back-link" href={href('/l/ja/songs')}>
        ← 日文歌單
      </a>
      <header className="song-head">
        <div className="grow">
          <h1 lang="ja">{song.title}</h1>
          <p className="muted" lang="ja">
            {song.artist}
            {song.zh && <span lang="zh">｜{song.zh}</span>}
            {song.rank > 0 && <span className="chip">榜上第 {song.rank} 名</span>}
          </p>
          {song.note && (
            <p className="song-note">
              <Ruby s={song.note} />
            </p>
          )}
          {classic && <p className="muted small">{classic.credit}・歌詞已是公有領域，影片為 YouTube 上可嵌入的演唱版本。</p>}
          <div className="song-links">
            {song.lyricsUrl && (
              <a className="btn small" href={song.lyricsUrl} target="_blank" rel="noreferrer">
                📄 官方授權歌詞（Uta-Net）↗
              </a>
            )}
            <label className="lyrics-toggle">
              <input type="checkbox" checked={cc} onChange={(e) => setCc(e.target.checked)} /> 顯示影片字幕（有提供時）
            </label>
          </div>
        </div>
        {mine && (
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              if (confirm('要從「我的歌」移除這首歌和它的歌詞嗎？')) {
                removeCustomSong(id);
                nav('/l/ja/songs');
              }
            }}
          >
            移除
          </button>
        )}
      </header>

      <div className="song-player">
        <YouTubePlayer
          videoId={song.yt}
          cc={cc}
          onReady={(h) => {
            player.current = h;
            setReady(true);
          }}
          onPlaying={(p) => {
            setPlaying(p);
            setTime(player.current?.time() ?? 0);
          }}
        />
      </div>

      <div className="seg song-modes" role="tablist">
        {(
          [
            ['play', '🎤 歌詞'],
            ['sync', '⏱️ 對時'],
            ['edit', '✏️ 貼歌詞'],
          ] as const
        ).map(([m, label]) => (
          <button key={m} type="button" className={cx(mode === m && 'on')} onClick={() => setMode(m)} disabled={m !== 'edit' && !lyrics.length}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'play' && <PlayView id={id} lines={lyrics} time={time} playing={playing} showZh={showZh} setShowZh={setShowZh} player={player} ready={ready} onSync={() => setMode('sync')} />}
      {mode === 'sync' && <SyncView id={id} lines={lyrics} player={player} ready={ready} onDone={() => setMode('play')} />}
      {mode === 'edit' && <EditView id={id} song={song} lines={lyrics} onDone={() => setMode('play')} />}
    </div>
  );
}

function PlayView({
  id,
  lines,
  time,
  playing,
  showZh,
  setShowZh,
  player,
  ready,
  onSync,
}: {
  id: string;
  lines: SongLine[];
  time: number;
  playing: boolean;
  showZh: boolean;
  setShowZh: (v: boolean) => void;
  player: MutableRefObject<YTHandle | null>;
  ready: boolean;
  onSync: () => void;
}) {
  const active = activeLine(lines, time);
  const list = useRef<HTMLOListElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const synced = syncedCount(lines);
  const missingZh = lines.filter((l) => !l.zh).length;

  // 正在唱的那一句自動捲到畫面中間
  useEffect(() => {
    if (!playing || active < 0) return;
    list.current?.children[active]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [active, playing]);

  const translate = async () => {
    try {
      const zh = await translateAll(
        lines.map((l) => furiPlain(l.ja)),
        setBusy,
      );
      saveLyrics(
        id,
        lines.map((l, i) => ({ ...l, zh: l.zh || zh[i] })),
      );
      setBusy(null);
    } catch (e) {
      setBusy(`翻譯失敗：${(e as Error).message}`);
    }
  };

  return (
    <section className="card lyrics">
      <div className="lyrics-tools">
        {synced < lines.length ? (
          <button type="button" className="btn small primary" onClick={onSync}>
            ⏱️ 對時（{synced}/{lines.length}）
          </button>
        ) : (
          <span className="chip">✓ 已對時，點任一句從那裡開始唱</span>
        )}
        <label className="lyrics-toggle">
          <input type="checkbox" checked={showZh} onChange={(e) => setShowZh(e.target.checked)} /> 顯示中文
        </label>
        {missingZh > 0 && (
          <button type="button" className="btn small" onClick={translate} disabled={!!busy}>
            🌐 自動翻譯補上中文
          </button>
        )}
        {missingZh > 0 && (
          <a className="link-btn" href={googleTranslateUrl(lines.map((l) => furiPlain(l.ja)).join('\n'))} target="_blank" rel="noreferrer">
            用 Google 翻譯開啟 ↗
          </a>
        )}
      </div>
      {busy && <p className="muted small">{busy}</p>}
      {missingZh > 0 && !busy && (
        <p className="muted small">
          {translatorApi() ? '用 Chrome 內建的翻譯，在你的裝置上翻譯，不會上傳。' : '會把歌詞一句一句送到免費的 MyMemory 翻譯服務。'}
          翻得不順的地方，可以在「貼歌詞」自己改；或用 Google 翻譯開啟，把結果貼回中文欄。
        </p>
      )}
      <ol className="lyric-list" ref={list}>
        {lines.map((l, i) => (
          <li key={i} className={cx('lyric', i === active && 'on', l.t === undefined && 'unsynced')}>
            <button
              type="button"
              className="lyric-main"
              disabled={!ready}
              onClick={() => {
                if (l.t !== undefined) player.current?.seek(Math.max(0, l.t - 0.2));
                else onSync();
              }}
              title={l.t !== undefined ? `從 ${fmtSec(l.t)} 開始唱` : '這一句還沒對時'}
            >
              <span className="lyric-time">{l.t !== undefined ? fmtSec(l.t) : '--:--'}</span>
              <span className="lyric-text">
                <span lang="ja" className="lyric-ja">
                  <Ruby s={l.ja} />
                </span>
                {showZh && l.zh && <small className="lyric-zh">{l.zh}</small>}
              </span>
            </button>
            <SpeakBtn text={furiPlain(l.ja)} lang="ja" size="sm" slow />
          </li>
        ))}
      </ol>
    </section>
  );
}

function SyncView({ id, lines, player, ready, onDone }: { id: string; lines: SongLine[]; player: MutableRefObject<YTHandle | null>; ready: boolean; onDone: () => void }) {
  const [times, setTimes] = useState<(number | undefined)[]>(() => lines.map((l) => l.t));
  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);

  const start = () => {
    setTimes(lines.map(() => undefined));
    setIdx(0);
    setStarted(true);
    player.current?.seek(0);
  };
  const stamp = () => {
    if (!started || idx >= lines.length) return;
    // 按下去的反應時間大約 0.3 秒，往前修正
    const t = Math.max(0, (player.current?.time() ?? 0) - 0.3);
    setTimes((ts) => ts.map((x, i) => (i === idx ? Math.round(t * 10) / 10 : x)));
    setIdx(idx + 1);
  };
  const back = () => {
    if (idx === 0) return;
    const prev = idx - 1;
    const t = times[prev];
    setTimes((ts) => ts.map((x, i) => (i === prev ? undefined : x)));
    setIdx(prev);
    if (t !== undefined) player.current?.seek(Math.max(0, t - 2));
  };
  const save = () => {
    saveLyrics(
      id,
      lines.map((l, i) => ({ ...l, t: times[i] })),
    );
    onDone();
  };

  const live = useRef({ stamp });
  live.current = { stamp };
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target as HTMLElement)?.closest?.('input, textarea')) {
        e.preventDefault();
        live.current.stamp();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const cur = lines[idx];
  return (
    <section className="card sync">
      <p className="muted">按「開始」影片會從頭播放。每一句開始唱的時候按「▶ 這一句」（電腦可以按空白鍵）。按錯了就按「上一句」重來。</p>
      {!started ? (
        <button type="button" className="btn primary wide" disabled={!ready} onClick={start}>
          {ready ? '開始對時' : '播放器載入中…'}
        </button>
      ) : (
        <>
          <div className="sync-now">
            <small className="muted">{idx < lines.length ? `下一句（${idx + 1} / ${lines.length}）` : '全部對好了！'}</small>
            {cur && (
              <b lang="ja">
                <Ruby s={cur.ja} />
              </b>
            )}
            {lines[idx + 1] && (
              <small className="muted" lang="ja">
                接著：
                <Ruby s={lines[idx + 1].ja} />
              </small>
            )}
          </div>
          <div className="sync-btns">
            <button type="button" className="btn" onClick={back} disabled={idx === 0}>
              ← 上一句
            </button>
            <button type="button" className="btn primary big-btn" onClick={stamp} disabled={idx >= lines.length}>
              ▶ 這一句
            </button>
          </div>
        </>
      )}
      <div className="modal-actions">
        <button type="button" className="btn ghost" onClick={onDone}>
          取消
        </button>
        <button type="button" className="btn primary" onClick={save} disabled={!started}>
          儲存對時
        </button>
      </div>
    </section>
  );
}

function EditView({ id, song, lines, onDone }: { id: string; song: Song; lines: SongLine[]; onDone: () => void }) {
  const [ja, setJa] = useState(() => lines.map((l) => l.ja).join('\n'));
  const [zh, setZh] = useState(() => (lines.some((l) => l.zh) ? lines.map((l) => l.zh ?? '').join('\n') : ''));
  const parsed = parseLyrics(ja, zh, lines);
  const search = song.lyricsUrl ?? `https://www.uta-net.com/search/?target=sn&type=in&keyword=${encodeURIComponent(song.title)}`;
  return (
    <section className="card lyric-edit">
      <p className="muted">
        流行歌的歌詞有版權，網站是公開的，所以不能直接放進來。請打開官方授權的歌詞頁（Uta-Net 有 JASRAC 授權），複製日文歌詞貼在下面；中文翻譯可以留空，之後按「🌐 自動翻譯」。
        <a href={search} target="_blank" rel="noreferrer">
          {song.lyricsUrl ? '打開這首歌的官方授權歌詞 ↗' : '在 Uta-Net 搜尋這首歌 ↗'}
        </a>
      </p>
      <p className="muted small">歌詞只存在你的瀏覽器；開了雲端同步的話，也會存進你自己的私人 Gist，不會給別人看。想看讀音可以把漢字寫成「漢字[よみ]」，例如「夜[よる]」。</p>
      <label className="lyric-field">
        日文歌詞（一行一句）
        <textarea value={ja} onChange={(e) => setJa(e.target.value)} rows={12} lang="ja" placeholder="把日文歌詞貼在這裡" />
      </label>
      <label className="lyric-field">
        中文翻譯（選填，一行對一行）
        <textarea value={zh} onChange={(e) => setZh(e.target.value)} rows={8} placeholder="一行對應上面的一句；也可以先留空，之後用瀏覽器翻譯補上" />
      </label>
      <p className="muted small">
        共 {parsed.length} 句{parsed.some((l) => l.t !== undefined) && `，其中 ${syncedCount(parsed)} 句保留原本的對時`}。
      </p>
      <div className="modal-actions">
        {lines.length > 0 && (
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              if (confirm('要刪掉這首歌的歌詞和對時嗎？')) {
                saveLyrics(id, []);
                setJa('');
                setZh('');
              }
            }}
          >
            刪除歌詞
          </button>
        )}
        <button
          type="button"
          className="btn primary"
          disabled={!parsed.length}
          onClick={() => {
            saveLyrics(id, parsed);
            onDone();
          }}
        >
          儲存歌詞
        </button>
      </div>
    </section>
  );
}
