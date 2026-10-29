// 特效品質：自動模式先看裝置規格判斷，偵測到卡頓之後一段時間內用精簡；手動選擇優先。
import { describe, expect, it } from 'vitest';
import { decideLite, weakDevice } from '../src/core/perf';

const DAY = 86_400_000;

describe('特效品質', () => {
  it('從規格事先判斷比較吃力的裝置', () => {
    expect(weakDevice({ hardwareConcurrency: 8, deviceMemory: 8 })).toBe(false);
    expect(weakDevice({ hardwareConcurrency: 2 })).toBe(true);
    expect(weakDevice({ hardwareConcurrency: 8, deviceMemory: 2 })).toBe(true);
    expect(weakDevice({ hardwareConcurrency: 4, deviceMemory: 4 })).toBe(true);
    // Safari 不提供記憶體大小：只看核心數
    expect(weakDevice({ hardwareConcurrency: 4 })).toBe(false);
    expect(weakDevice({ hardwareConcurrency: 8, connection: { saveData: true } })).toBe(true);
    expect(weakDevice({})).toBe(false);
  });

  it('手動選擇優先；自動模式記得最近 30 天內的卡頓', () => {
    const fast = { hardwareConcurrency: 8, deviceMemory: 8 };
    const now = 1_800_000_000_000;
    expect(decideLite({ mode: 'lite' }, fast, now)).toBe(true);
    expect(decideLite({ mode: 'high' }, { hardwareConcurrency: 2 }, now)).toBe(false);
    expect(decideLite({ mode: 'auto' }, fast, now)).toBe(false);
    expect(decideLite({ mode: 'auto' }, { hardwareConcurrency: 2 }, now)).toBe(true);
    expect(decideLite({ mode: 'auto', slowAt: now - DAY }, fast, now)).toBe(true);
    expect(decideLite({ mode: 'auto', slowAt: now - 40 * DAY }, fast, now)).toBe(false);
  });
});
