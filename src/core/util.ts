export const sum = (v: Record<string, number> | number[]): number =>
  (Array.isArray(v) ? v : Object.values(v)).reduce((a, b) => a + b, 0);

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const CJK = /[぀-ヿ㐀-鿿가-힯]/;
const ALNUM = /[A-Za-z0-9%]/;

/** 接起幾段文字：英數字和中日韓文字相接的地方加一個空白（「完成 N5」「完成五十音」「2027/3/5 前」「目標：N5」） */
export const zhJoin = (...parts: string[]): string =>
  parts.reduce((out, p) => {
    if (!out || !p) return out + p;
    const a = out[out.length - 1];
    const b = p[0];
    return (ALNUM.test(a) && (CJK.test(b) || ALNUM.test(b))) || (CJK.test(a) && ALNUM.test(b)) ? `${out} ${p}` : out + p;
  }, '');

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
