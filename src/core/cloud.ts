// 雲端同步：把存檔放在使用者自己 GitHub 帳號的私人 Gist 裡，筆電、手機共用同一份進度。
// 不需要另外架後端；權杖只存在這台裝置的瀏覽器，不會跟著匯出的存檔外流。
//
// 流程：讀取雲端 → 與本機合併（mergeSaves，進度只增不減）→ 有差異就寫回本機與雲端。
import { useSyncExternalStore } from 'react';
import { mergeSaves } from './merge';
import { migrate, type Save } from './save';
import { getSave, onCommit, replaceSave } from './store';

const KEY = 'trilingo.cloud.v1';
const FILE = 'trilingo-save.json';
const API = 'https://api.github.com';
/** 存檔變動後等多久才上傳（上課時每答一題都會變動，等安靜下來再傳） */
const DEBOUNCE_MS = 4000;

interface Config {
  token: string;
  login: string;
  gistId: string | null;
  lastSync: number;
}

export type CloudStatus = 'off' | 'syncing' | 'ok' | 'offline' | 'error';

export interface CloudState {
  status: CloudStatus;
  login: string | null;
  lastSync: number;
  message: string;
}

function readConfig(): Config | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Config) : null;
  } catch {
    return null;
  }
}

function writeConfig(c: Config | null) {
  try {
    if (c) localStorage.setItem(KEY, JSON.stringify(c));
    else localStorage.removeItem(KEY);
  } catch {
    /* 無痕模式等情況：只在這次開啟期間有效 */
  }
}

let config = readConfig();
let state: CloudState = { status: config ? 'ok' : 'off', login: config?.login ?? null, lastSync: config?.lastSync ?? 0, message: '' };
const subs = new Set<() => void>();

function setState(patch: Partial<CloudState>) {
  state = { ...state, ...patch };
  subs.forEach((f) => f());
}

export function useCloud(): CloudState {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => state,
  );
}

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function gh<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new HttpError(res.status, `GitHub 回應 ${res.status}`);
  return (await res.json()) as T;
}

interface GistFile {
  content?: string;
  truncated?: boolean;
  raw_url?: string;
}
interface Gist {
  id: string;
  files: Record<string, GistFile | undefined>;
}

/** 讀取雲端存檔；Gist 不存在回傳 undefined，存在但沒有存檔回傳 null */
async function readRemote(c: Config): Promise<Save | null | undefined> {
  if (!c.gistId) return undefined;
  let gist: Gist;
  try {
    gist = await gh<Gist>(c.token, `/gists/${c.gistId}`);
  } catch (e) {
    if (e instanceof HttpError && e.status === 404) return undefined;
    throw e;
  }
  const f = gist.files[FILE];
  if (!f) return null;
  // 檔案太大時 API 只給部分內容，要另外抓完整檔案
  const text = f.truncated && f.raw_url ? await (await fetch(f.raw_url, { cache: 'no-store' })).text() : (f.content ?? '');
  return text ? migrate(JSON.parse(text), Date.now()) : null;
}

async function writeRemote(c: Config, save: Save): Promise<string> {
  const payload = {
    description: 'TriLingo 三語道場的學習進度（由 App 自動同步，請勿手動修改）',
    files: { [FILE]: { content: JSON.stringify(save) } },
  };
  if (c.gistId) {
    await gh<Gist>(c.token, `/gists/${c.gistId}`, { method: 'PATCH', body: JSON.stringify(payload) });
    return c.gistId;
  }
  // 私人 Gist：不會出現在公開列表，只有知道網址的人看得到
  const created = await gh<Gist>(c.token, '/gists', { method: 'POST', body: JSON.stringify({ ...payload, public: false }) });
  return created.id;
}

/** key 排序後的序列化：判斷兩份存檔內容是否相同（不受欄位順序影響） */
function canon(x: unknown): string {
  if (Array.isArray(x)) return `[${x.map(canon).join(',')}]`;
  if (x && typeof x === 'object') {
    return `{${Object.keys(x)
      .filter((k) => (x as Record<string, unknown>)[k] !== undefined)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canon((x as Record<string, unknown>)[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(x);
}

let running: Promise<void> | null = null;
let again = false;
let timer: ReturnType<typeof setTimeout> | undefined;
/** 套用雲端資料時本機也會觸發存檔變動，這段期間不要再排一次同步 */
let applying = false;

async function syncOnce() {
  const c = config;
  if (!c) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    setState({ status: 'offline', message: '目前離線，連上網路後會自動同步' });
    return;
  }
  setState({ status: 'syncing', message: '' });
  try {
    const remote = await readRemote(c);
    if (remote === undefined) c.gistId = null;
    const local = getSave();
    const merged = remote ? mergeSaves(local, remote) : local;
    if (canon(merged) !== canon(local)) {
      applying = true;
      try {
        replaceSave(merged);
      } finally {
        applying = false;
      }
    }
    const latest = getSave();
    if (!remote || canon(latest) !== canon(remote)) c.gistId = await writeRemote(c, latest);
    c.lastSync = Date.now();
    if (config === c) writeConfig(c);
    setState({ status: 'ok', lastSync: c.lastSync, message: '' });
  } catch (e) {
    if (e instanceof HttpError && e.status === 401) {
      setState({ status: 'error', message: '權杖無效或已過期，請重新連結' });
    } else if (e instanceof HttpError && e.status === 403) {
      setState({ status: 'error', message: '權杖沒有 Gist 權限，或請求太頻繁，請稍後再試' });
    } else if (e instanceof HttpError) {
      setState({ status: 'error', message: e.message });
    } else {
      setState({ status: 'offline', message: '連不上 GitHub，稍後會再試一次' });
    }
  }
}

/** 立即同步；同步進行中又被呼叫時，結束後再補跑一次 */
export function syncNow(): Promise<void> {
  clearTimeout(timer);
  if (running) {
    again = true;
    return running;
  }
  running = (async () => {
    do {
      again = false;
      await syncOnce();
    } while (again);
  })().finally(() => {
    running = null;
  });
  return running;
}

function scheduleSync() {
  if (!config || applying) return;
  clearTimeout(timer);
  timer = setTimeout(() => void syncNow(), DEBOUNCE_MS);
}

/** 用 GitHub 權杖連結雲端；會沿用帳號裡既有的 TriLingo 存檔 */
export async function connect(token: string): Promise<{ ok: boolean; message: string }> {
  const t = token.trim();
  if (!t) return { ok: false, message: '請先貼上權杖' };
  setState({ status: 'syncing', message: '' });
  try {
    const user = await gh<{ login: string }>(t, '/user');
    // 找看看帳號裡是不是已經有存檔（例如另一台裝置先連結過）
    let gistId: string | null = null;
    for (let page = 1; page <= 5 && !gistId; page++) {
      const list = await gh<Gist[]>(t, `/gists?per_page=100&page=${page}`);
      gistId = list.find((g) => g.files[FILE])?.id ?? null;
      if (list.length < 100) break;
    }
    config = { token: t, login: user.login, gistId, lastSync: 0 };
    writeConfig(config);
    setState({ login: user.login });
    await syncNow();
    if (state.status === 'error') return { ok: false, message: state.message };
    return { ok: true, message: gistId ? '已連結，並合併了雲端上的進度' : '已連結，進度已上傳到雲端' };
  } catch (e) {
    const message =
      e instanceof HttpError && e.status === 401 ? '權杖無效，請確認有完整貼上' : e instanceof HttpError ? `連結失敗：${e.message}` : '連不上 GitHub，請檢查網路';
    setState({ status: config ? 'error' : 'off', message });
    return { ok: false, message };
  }
}

/** 中斷連結：只移除這台裝置上的權杖，雲端存檔保留 */
export function disconnect() {
  clearTimeout(timer);
  config = null;
  writeConfig(null);
  setState({ status: 'off', login: null, lastSync: 0, message: '' });
}

export function initCloud() {
  onCommit(scheduleSync);
  if (typeof window === 'undefined') return;
  document.addEventListener('visibilitychange', () => {
    if (config && !document.hidden) void syncNow();
  });
  window.addEventListener('online', () => {
    if (config) void syncNow();
  });
  if (config) void syncNow();
}
