// 專案沒有裝 @types/node：只宣告 vite.config.ts 用到的 Node 功能（測試用到的在 tests/node-fs.d.ts）。
declare module 'node:child_process' {
  export function spawn(command: string, args: string[], options?: { stdio?: 'inherit' }): { on(event: 'exit', listener: (code: number | null) => void): unknown };
}
declare const process: { execPath: string; env: Record<string, string | undefined> };
