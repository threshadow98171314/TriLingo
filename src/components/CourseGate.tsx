// 等某個語言的題目下載完成才顯示內容。
// 下載通常一瞬間就好（之後瀏覽器會快取），所以稍微延遲才出現載入畫面，避免閃一下。
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { META, useCourseState } from '../content';
import type { LangId } from '../core/types';
import { Empty, LangBadge } from './ui';

export function CourseGate({ lang, children, compact }: { lang: LangId; children: ReactNode; compact?: boolean }) {
  const st = useCourseState(lang);
  if (st.course) return <>{children}</>;
  return <CourseLoading lang={lang} failed={st.failed} retry={st.retry} compact={compact} />;
}

export function CourseLoading({ lang, failed, retry, compact }: { lang: LangId; failed: boolean; retry: () => void; compact?: boolean }) {
  const meta = META[lang];
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 180);
    return () => clearTimeout(t);
  }, []);

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
