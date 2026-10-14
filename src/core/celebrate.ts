// 慶祝事件佇列：升段、連勝里程碑用全螢幕彈窗；成就、獎勵用右上角的提示。
import { useSyncExternalStore } from 'react';
import type { LangId } from './types';

export type ModalEvent =
  | { type: 'rank'; lang: LangId; from: number; to: number; coins: number }
  | { type: 'streak'; count: number; coins: number };

export interface ToastEvent {
  type: 'toast';
  icon: string;
  title: string;
  text?: string;
}

export type Celebration = ModalEvent | ToastEvent;

interface Snapshot {
  modals: ModalEvent[];
  toasts: (ToastEvent & { id: number })[];
}

let snap: Snapshot = { modals: [], toasts: [] };
const subs = new Set<() => void>();
let nextId = 1;

function set(next: Snapshot) {
  snap = next;
  subs.forEach((f) => f());
}

export function celebrate(c: Celebration) {
  if (c.type === 'toast') {
    const id = nextId++;
    set({ ...snap, toasts: [...snap.toasts, { ...c, id }].slice(-4) });
    setTimeout(() => dismissToast(id), 4200);
  } else {
    set({ ...snap, modals: [...snap.modals, c] });
  }
}

export function dismissToast(id: number) {
  if (snap.toasts.some((t) => t.id === id)) set({ ...snap, toasts: snap.toasts.filter((t) => t.id !== id) });
}

export function dismissModal() {
  set({ ...snap, modals: snap.modals.slice(1) });
}

export function useCelebrations(): Snapshot {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => snap,
  );
}
