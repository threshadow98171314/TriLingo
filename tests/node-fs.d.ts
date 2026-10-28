// 測試在 Node 上跑，可以讀檔；專案沒有裝 @types/node，只宣告用到的這一個函式。
declare module 'node:fs' {
  export function readFileSync(path: string, encoding: 'utf8'): string;
  /** 不給編碼時讀成位元組（檢查圖示檔用） */
  export function readFileSync(path: string): Uint8Array;
}
