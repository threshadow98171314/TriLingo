// 設定：每日目標、聲音、顯示輔助、主題、存檔管理
import { useRef, useState, type ReactNode } from 'react';
import { Modal } from '../components/ui';
import { connect, disconnect, syncNow, useCloud } from '../core/cloud';
import { META_LIST } from '../content';
import { nowMs, today } from '../core/date';
import { tapCount, triggerEgg } from '../core/eggs';
import { fx, seasonOf, SEASON_LABEL } from '../core/fx';
import { sfx } from '../core/sfx';
import { exportSave, importSave, resetSave, updateSettings, useSave } from '../core/store';
import { speak, useVoices, voicesFor } from '../core/tts';
import type { LangId } from '../core/types';
import { cx } from '../core/util';

const GOALS: [number, string][] = [
  [20, '輕鬆'],
  [50, '標準'],
  [100, '認真'],
  [200, '硬派'],
];

const SAMPLE: Record<LangId, string> = {
  en: 'The meeting starts at ten.',
  ja: 'こんにちは。日本語を勉強しています。',
  ko: '안녕하세요. 한국어를 공부해요.',
};

function Row({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div className="set-row">
      <div className="grow">
        <b>{title}</b>
        {desc && <small className="muted">{desc}</small>}
      </div>
      <div className="set-ctl">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={cx('toggle', on && 'on')} onClick={() => onChange(!on)}>
      <i />
    </button>
  );
}

function CloudPanel() {
  const cloud = useCloud();
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const connected = cloud.login !== null;

  const link = async () => {
    setBusy(true);
    const r = await connect(token);
    setBusy(false);
    setNote(r.message);
    if (r.ok) setToken('');
  };

  const statusText: Record<string, string> = {
    syncing: '同步中…',
    ok: cloud.lastSync ? `已同步（${new Date(cloud.lastSync).toLocaleString('zh-TW', { hour12: false })}）` : '已連結',
    offline: cloud.message,
    error: cloud.message,
    off: '',
  };

  return (
    <section className="card panel">
      <header className="panel-head">
        <h2>雲端同步</h2>
        <small className="muted">筆電、手機共用同一份進度</small>
      </header>
      {connected ? (
        <>
          <Row title={`已連結 GitHub：${cloud.login}`} desc={statusText[cloud.status]}>
            <button type="button" className="btn small" disabled={cloud.status === 'syncing'} onClick={() => void syncNow()}>
              立即同步
            </button>
          </Row>
          <p className="muted cloud-tip">開啟 App、切回這個分頁、或學習告一段落時都會自動同步。另一台裝置也連結同一個 GitHub 帳號，進度就會合併在一起。</p>
          <div className="set-actions">
            <button
              type="button"
              className="btn danger"
              onClick={() => {
                disconnect();
                setNote('已中斷這台裝置的連結。雲端上的存檔還在，之後可以再連結。');
              }}
            >
              中斷這台裝置的連結
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="muted cloud-tip">進度會存在你 GitHub 帳號裡的一個私人 Gist。每台裝置第一次使用時設定一次：</p>
          <ol className="cloud-steps">
            <li>
              <a href="https://github.com/settings/tokens/new?scopes=gist&description=TriLingo%20sync" target="_blank" rel="noreferrer">
                點這裡建立 GitHub 權杖
              </a>
              ：已經幫你只勾選「gist」權限；Expiration 建議選長一點（例如一年）。
            </li>
            <li>按最下方的「Generate token」，複製產生的權杖（ghp_ 開頭）。</li>
            <li>貼到下面，按「連結」。手機、筆電可以用同一個權杖。</li>
          </ol>
          <form
            className="cloud-form"
            onSubmit={(e) => {
              e.preventDefault();
              void link();
            }}
          >
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="貼上 GitHub 權杖"
              autoComplete="off"
              spellCheck={false}
              aria-label="GitHub 權杖"
            />
            <button type="submit" className="btn primary" disabled={busy || !token.trim()}>
              {busy ? '連結中…' : '連結'}
            </button>
          </form>
          <p className="muted cloud-tip">權杖只存在這台裝置的瀏覽器，匯出存檔時不會包含在內。</p>
        </>
      )}
      {note && <p className="set-msg">{note}</p>}
    </section>
  );
}

export function SettingsPage() {
  const s = useSave();
  const set = s.settings;
  useVoices();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const season = seasonOf(new Date(nowMs()));

  const download = () => {
    const blob = new Blob([exportSave()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `trilingo-save-${today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg('已下載存檔。');
  };

  const upload = async (f: File | undefined) => {
    if (!f) return;
    const ok = importSave(await f.text());
    setMsg(ok ? '匯入成功，進度已還原。' : '匯入失敗：這不是 TriLingo 的存檔。');
    if (file.current) file.current.value = '';
  };

  return (
    <div className="page narrow">
      <section className="card panel">
        <header className="panel-head">
          <h2>每日目標</h2>
          <small className="muted">三種語言合計，每天要拿到多少 XP</small>
        </header>
        <div className="seg">
          {GOALS.map(([n, label]) => (
            <button key={n} type="button" className={cx(set.dailyGoal === n && 'on')} onClick={() => updateSettings({ dailyGoal: n })}>
              <b>{n} XP</b>
              <small>{label}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="card panel">
        <header className="panel-head">
          <h2>練習</h2>
        </header>
        <Row
          title="日文打字題"
          desc="看中文或聽發音，用日文輸入法打出答案，假名、漢字都可以。需要先在手機或電腦加入日文鍵盤；關掉的話會改用排字卡。"
        >
          <Toggle on={set.jaTyping} label="日文打字題" onChange={(v) => updateSettings({ jaTyping: v })} />
        </Row>
      </section>

      <section className="card panel">
        <header className="panel-head">
          <h2>聲音</h2>
        </header>
        <Row title="音效" desc="答對、答錯、升段的提示音">
          <Toggle
            on={set.sfx}
            label="音效"
            onChange={(v) => {
              updateSettings({ sfx: v });
              if (v) sfx.correct();
            }}
          />
        </Row>
        <Row title="自動朗讀" desc="作答後自動唸出正確答案">
          <Toggle on={set.autoSpeak} label="自動朗讀" onChange={(v) => updateSettings({ autoSpeak: v })} />
        </Row>
        <Row title="語速" desc={`目前 ${set.ttsRate.toFixed(1)} 倍`}>
          <input
            type="range"
            min="0.6"
            max="1.2"
            step="0.1"
            value={set.ttsRate}
            aria-label="語速"
            onChange={(e) => updateSettings({ ttsRate: Number(e.target.value) })}
          />
        </Row>
        {META_LIST.map((c) => {
          const list = voicesFor(c.id);
          return (
            <Row key={c.id} title={`${c.name}語音`} desc={list.length ? undefined : '這個瀏覽器沒有這個語言的語音，聽力題會自動略過。建議使用 Chrome 或 Edge。'}>
              {list.length > 0 && (
                <>
                  <select
                    value={set.voices[c.id] ?? ''}
                    aria-label={`${c.name}語音`}
                    onChange={(e) => updateSettings({ voices: { ...set.voices, [c.id]: e.target.value || undefined } })}
                  >
                    <option value="">自動選擇</option>
                    {list.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="btn small" onClick={() => speak(SAMPLE[c.id], c.id)}>
                    試聽
                  </button>
                </>
              )}
            </Row>
          );
        })}
      </section>

      <section className="card panel">
        <header className="panel-head">
          <h2>顯示</h2>
        </header>
        <Row title="羅馬拼音" desc="在日文、韓文單字下方顯示拼音。字母熟了之後建議關掉。">
          <Toggle on={set.romaji} label="羅馬拼音" onChange={(v) => updateSettings({ romaji: v })} />
        </Row>
        <Row title="振假名" desc="在日文漢字上方標示讀音">
          <Toggle on={set.furigana} label="振假名" onChange={(v) => updateSettings({ furigana: v })} />
        </Row>
        <Row title="特效" desc="答對的星光、連擊橫幅、煙火、畫面震動。系統開啟「減少動態效果」時會自動關閉。">
          <Toggle
            on={set.fx}
            label="特效"
            onChange={(v) => {
              updateSettings({ fx: v });
              if (v) setTimeout(() => fx.confetti(60), 50);
            }}
          />
        </Row>
        <Row title="季節特效" desc={season ? `首頁背景會飄${SEASON_LABEL[season]}` : '首頁背景隨季節飄落的落葉、櫻花、雪花'}>
          <Toggle on={set.seasonal} label="季節特效" onChange={(v) => updateSettings({ seasonal: v })} />
        </Row>
        <Row title="主題">
          <div className="seg small">
            {(['dark', 'light', 'auto'] as const).map((t) => (
              <button key={t} type="button" className={cx(set.theme === t && 'on')} onClick={() => updateSettings({ theme: t })}>
                {t === 'dark' ? '深色' : t === 'light' ? '淺色' : '跟隨系統'}
              </button>
            ))}
          </div>
        </Row>
      </section>

      <CloudPanel />

      <section className="card panel">
        <header className="panel-head">
          <h2>存檔</h2>
          <small className="muted">進度存在這個瀏覽器裡。換裝置或清除瀏覽資料前，記得先匯出。</small>
        </header>
        <div className="set-actions">
          <button type="button" className="btn" onClick={download}>
            匯出存檔
          </button>
          <button type="button" className="btn" onClick={() => file.current?.click()}>
            匯入存檔
          </button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => void upload(e.target.files?.[0])} />
          <button type="button" className="btn danger" onClick={() => setConfirmReset(true)}>
            重置所有進度
          </button>
        </div>
        {msg && <p className="set-msg">{msg}</p>}
      </section>

      <p className="muted about">
        <button
          type="button"
          className="about-version"
          onClick={() => {
            if (tapCount('dev', 7, 3000)) triggerEgg('dev');
          }}
        >
          TriLingo 三語道場 v{__APP_VERSION__}
        </button>
      </p>

      {confirmReset && (
        <Modal onClose={() => setConfirmReset(false)}>
          <h2>確定要重置嗎？</h2>
          <p className="muted">三種語言的段位、學過的字、連勝、金幣和成就都會清除，而且無法復原。建議先匯出存檔。</p>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={() => setConfirmReset(false)}>
              取消
            </button>
            <button
              type="button"
              className="btn danger"
              onClick={() => {
                resetSave();
                setConfirmReset(false);
                setMsg('已重置所有進度。');
              }}
            >
              全部清除
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
