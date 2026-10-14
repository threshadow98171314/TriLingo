const DAY = 86400000;

// 測試連勝、複習排程用：localStorage['trilingo.debugDayOffset'] = 天數，可把「今天」往後推
function offsetDays(): number {
  try {
    return Number(localStorage.getItem('trilingo.debugDayOffset') || 0) || 0;
  } catch {
    return 0;
  }
}

export function nowMs(): number {
  return Date.now() + offsetDays() * DAY;
}

export function dateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 以使用者本地時區計算的今天（YYYY-MM-DD） */
export function today(): string {
  return dateStr(new Date(nowMs()));
}

export function dayNum(s: string): number {
  const [y, m, d] = s.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY);
}

export function addDays(s: string, n: number): string {
  const [y, m, d] = s.split('-').map(Number);
  return dateStr(new Date(y, m - 1, d + n));
}

export function diffDays(a: string, b: string): number {
  return dayNum(b) - dayNum(a);
}

export function lastDays(n: number, end: string = today()): string[] {
  return Array.from({ length: n }, (_, i) => addDays(end, i - n + 1));
}
