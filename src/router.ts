// 極簡的 hash 路由：網址長得像 #/l/ja/lesson/xxx，純靜態主機也能直接部署。
import { useSyncExternalStore } from 'react';

export interface Route {
  raw: string;
  parts: string[];
  query: URLSearchParams;
}

function parse(hash: string): Route {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, q = ''] = raw.split('?');
  const parts = path
    .split('/')
    .filter(Boolean)
    .map((p) => {
      try {
        return decodeURIComponent(p);
      } catch {
        return p;
      }
    });
  return { raw, parts, query: new URLSearchParams(q) };
}

let current = parse(typeof location === 'undefined' ? '' : location.hash);
const subs = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    current = parse(location.hash);
    window.scrollTo(0, 0);
    subs.forEach((f) => f());
  });
}

export function useRoute(): Route {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => current,
  );
}

export function nav(to: string) {
  location.hash = to;
}

/** 產生連結用的 href */
export const href = (to: string) => `#${to}`;

export const lessonPath = (lang: string, lessonId: string) => `/l/${lang}/lesson/${encodeURIComponent(lessonId)}`;
export const stagePath = (lang: string, stageId: string) => `/l/${lang}/s/${stageId}`;
