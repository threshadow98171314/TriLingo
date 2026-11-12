// 等這個畫面需要的題目下載完成才顯示內容。題目是一包一包分開的（見 content/parts.ts），
// need 說明需要哪些：
// - "active"（預設）：學過的字所在的那幾包。複習、遊樂場這些用學過的字出題的畫面用這個。
// - { units }／{ stages }／"all"／"mocks"／"concepts"：見 content/index.ts 的 Need。
// 頁面的程式也是用到才下載（React.lazy），CourseGate 裡面順便等程式下載完成。
// 下載通常一瞬間就好（之後瀏覽器會快取），所以稍微延遲才出現載入畫面，避免閃一下。
import { Suspense, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { META, useContent, type Need } from '../content';
import { activeNeed } from '../core/progress';
import { getSave } from '../core/store';
import type { LangId } from '../core/types';
import { Empty, LangBadge } from './ui';

export type GateNeed = Need | 'active' | (Need | 'active')[];

function resolve(lang: LangId, need: GateNeed): Need {
  if (need === 'active') return activeNeed(getSave(), lang);
  if (Array.isArray(need)) return need.map((n) => resolve(lang, n));
  return need;
}

export function CourseGate({ lang, need = 'active', children, compact }: { lang: LangId; need?: GateNeed; children: ReactNode; compact?: boolean }) {
  // 進到這個畫面時決定要哪些題目。之後就算存檔變了（例如雲端同步帶進別的進度）也不重新擋住畫面，
  // 否則玩到一半的遊戲會被載入畫面蓋掉
  const key = `${lang}|${JSON.stringify(need)}`;
  const [gate, setGate] = useState(() => ({ key, need: resolve(lang, need), shown: false }));
  let cur = gate;
  if (cur.key !== key) {
    cur = { key, need: resolve(lang, need), shown: false };
    setGate(cur);
  }
  const st = useContent(lang, cur.need);
  if (st.ready && !cur.shown) {
    cur = { ...cur, shown: true };
    setGate(cur);
  }
  if (!cur.shown) return <CourseLoading lang={lang} failed={st.failed} retry={st.retry} compact={compact} />;
  return <Suspense fallback={<CourseLoading lang={lang} failed={false} retry={st.retry} compact={compact} />}>{children}</Suspense>;
}

/** 等頁面的程式下載（和語言無關的頁面：商店、設定…） */
export function PageLoading() {
  const show = useDelayed();
  return (
    <div className="page narrow course-loading" aria-busy="true">
      {show && (
        <div className="loading-box">
          <div className="loading-bar">
            <i />
          </div>
        </div>
      )}
    </div>
  );
}

/** 稍微延遲才變成 true：下載很快的時候不要閃一下載入畫面 */
function useDelayed(ms = 180): boolean {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return show;
}

export function CourseLoading({ lang, failed, retry, compact }: { lang: LangId; failed: boolean; retry: () => void; compact?: boolean }) {
  const meta = META[lang];
  const show = useDelayed();

  if (failed) {
    return (
      <div className={compact ? 'course-loading' : 'page narrow'} style={{ '--lang': meta.color } as CSSProperties}>
        <Empty icon="📡" title={`${meta.name}課程下載失敗`}>
          <p className="muted">可能是網路不穩，或是網站剛好更新了。先確認網路，再試一次；還是不行的話請重新整理頁面。</p>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={() => location.reload()}>
              重新整理
            </button>
            <button type="button" className="btn primary" onClick={retry}>
              再試一次
            </button>
          </div>
        </Empty>
      </div>
    );
  }

  return (
    <div className={compact ? 'course-loading' : 'page narrow course-loading'} style={{ '--lang': meta.color } as CSSProperties} aria-busy="true">
      {show && (
        <div className="loading-box">
          <LangBadge course={meta} size="lg" />
          <p>正在準備{meta.name}課程…</p>
          <div className="loading-bar">
            <i />
          </div>
        </div>
      )}
    </div>
  );
}
