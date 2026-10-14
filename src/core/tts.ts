// 語音朗讀：使用瀏覽器內建的 Web Speech API。
// 有哪些語言的語音取決於瀏覽器與作業系統（Chrome、Edge 內建線上的日語、韓語語音）。
import { useSyncExternalStore } from 'react';
import type { LangId } from './types';

const BCP: Record<LangId, string> = { en: 'en-US', ja: 'ja-JP', ko: 'ko-KR' };

let voices: SpeechSynthesisVoice[] = [];
let version = 0;
const subs = new Set<() => void>();

const synth = (): SpeechSynthesis | null =>
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

function refresh() {
  voices = synth()?.getVoices() ?? [];
  version++;
  subs.forEach((f) => f());
}

const s0 = synth();
if (s0) {
  refresh();
  s0.addEventListener?.('voiceschanged', refresh);
}

const norm = (l: string) => l.toLowerCase().replace('_', '-');

export function voicesFor(lang: LangId): SpeechSynthesisVoice[] {
  return voices.filter((v) => norm(v.lang).startsWith(lang));
}

function score(v: SpeechSynthesisVoice, lang: LangId): number {
  let s = 0;
  if (norm(v.lang) === BCP[lang].toLowerCase()) s += 2;
  if (/natural/i.test(v.name)) s += 4;
  if (/google/i.test(v.name)) s += 3;
  if (/online/i.test(v.name)) s += 1;
  return s;
}

export function bestVoice(lang: LangId, preferred?: string): SpeechSynthesisVoice | null {
  const list = voicesFor(lang);
  if (!list.length) return null;
  return list.find((v) => v.name === preferred) ?? list.slice().sort((a, b) => score(b, lang) - score(a, lang))[0];
}

export function canSpeak(lang: LangId): boolean {
  return voicesFor(lang).length > 0;
}

let prefs: { rate: number; voices: Partial<Record<LangId, string>> } = { rate: 1, voices: {} };

/** 由存檔的設定同步過來（避免 tts 反過來依賴 store） */
export function setTtsPrefs(p: typeof prefs) {
  prefs = p;
}

export function speak(text: string, lang: LangId, o: { rate?: number } = {}): boolean {
  const s = synth();
  if (!s || !text) return false;
  const voice = bestVoice(lang, prefs.voices[lang]);
  if (!voice) return false;
  try {
    s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = (o.rate ?? 1) * prefs.rate;
    s.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking() {
  synth()?.cancel();
}

/** 語音清單是非同步載入的；用這個 hook 讓畫面在載入後重新渲染 */
export function useVoices(): number {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => version,
  );
}
