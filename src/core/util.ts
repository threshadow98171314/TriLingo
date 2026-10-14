export const sum = (v: Record<string, number> | number[]): number =>
  (Array.isArray(v) ? v : Object.values(v)).reduce((a, b) => a + b, 0);

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const cx = (...a: (string | false | null | undefined | 0)[]) => a.filter(Boolean).join(' ');

/** 平均切成每組約 size 個（各組大小最多差 1） */
export function chunkEven<T>(arr: T[], size: number): T[][] {
  if (!arr.length) return [];
  const k = Math.ceil(arr.length / size);
  const out: T[][] = [];
  let i = 0;
  for (let j = 0; j < k; j++) {
    const n = Math.ceil((arr.length - i) / (k - j));
    out.push(arr.slice(i, i + n));
    i += n;
  }
  return out;
}

export function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
