// YouTube 播放器（IFrame Player API），用 youtube-nocookie.com 嵌入。
import { useEffect, useRef } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let api: Promise<any> | null = null;

/** 第一次用到才載入 YouTube 的播放器程式 */
function loadApi(): Promise<any> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (api) return api;
  api = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    document.head.appendChild(s);
  });
  return api;
}

export interface YTHandle {
  /** 跳到某一秒並播放 */
  seek(t: number): void;
  play(): void;
  pause(): void;
  /** 目前播放到第幾秒 */
  time(): number;
}

export function YouTubePlayer({ videoId, onReady, onPlaying }: { videoId: string; onReady?: (h: YTHandle) => void; onPlaying?: (playing: boolean) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const cb = useRef({ onReady, onPlaying });
  cb.current = { onReady, onPlaying };

  useEffect(() => {
    let player: any;
    let cancelled = false;
    const box = host.current;
    loadApi().then((YT) => {
      if (cancelled || !box) return;
      const el = document.createElement('div');
      box.appendChild(el);
      player = new YT.Player(el, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () =>
            cb.current.onReady?.({
              seek: (t) => {
                player.seekTo(t, true);
                player.playVideo();
              },
              play: () => player.playVideo(),
              pause: () => player.pauseVideo(),
              time: () => player.getCurrentTime?.() ?? 0,
            }),
          onStateChange: (e: { data: number }) => cb.current.onPlaying?.(e.data === 1),
        },
      });
    });
    return () => {
      cancelled = true;
      player?.destroy?.();
      if (box) box.innerHTML = '';
    };
  }, [videoId]);

  return (
    <div className="yt-wrap">
      <div ref={host} className="yt-host" />
    </div>
  );
}
