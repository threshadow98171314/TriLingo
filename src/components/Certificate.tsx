// 結業證書：完成一整條學習路線後，用 canvas 畫一張證書，可以下載成圖片或直接分享。
import { useEffect, useRef, useState } from 'react';
import { META } from '../content';
import { slashDate } from '../core/date';
import { pathUnits } from '../core/progress';
import type { LangId, StageOutline } from '../core/types';
import { Modal } from './ui';

const W = 1200;
const H = 848;
const SERIF = '"Noto Serif TC", "Noto Serif JP", "Songti TC", "PMingLiU", serif';
const SANS = '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';

/** YYYY-MM-DD → 2026 年 11 月 13 日 */
const zhDate = (day: string) => {
  const [y, m, d] = day.split('-').map(Number);
  return `${y} 年 ${m} 月 ${d} 日`;
};

/** 文字太寬就縮小字級，最小縮到 min */
function fitText(ctx: CanvasRenderingContext2D, text: string, font: (px: number) => string, px: number, maxW: number, min = 24) {
  let size = px;
  ctx.font = font(size);
  while (size > min && ctx.measureText(text).width > maxW) {
    size -= 2;
    ctx.font = font(size);
  }
}

export interface CertInfo {
  lang: LangId;
  stage: StageOutline;
  name: string;
  /** 完成日期 YYYY-MM-DD */
  date: string;
}

/** 畫出證書（淺色紙張，深色主題下也一樣，存成圖片才好看） */
export function drawCertificate(ctx: CanvasRenderingContext2D, { lang, stage, name, date }: CertInfo) {
  const meta = META[lang];
  const units = pathUnits(stage);
  const lessons = units.reduce((a, u) => a + u.lessons.length, 0);
  const c = stage.color;

  // 紙張
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#fffdf6');
  bg.addColorStop(1, '#f4ead3');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 外框：關卡的顏色＋金色細框
  ctx.lineWidth = 18;
  ctx.strokeStyle = c;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#c9a227';
  ctx.strokeRect(52, 52, W - 104, H - 104);
  // 四個角的小方塊
  ctx.fillStyle = '#c9a227';
  for (const [x, y] of [
    [52, 52],
    [W - 52, 52],
    [52, H - 52],
    [W - 52, H - 52],
  ])
    ctx.fillRect(x - 9, y - 9, 18, 18);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#7a6a4a';
  ctx.font = `600 26px ${SANS}`;
  ctx.fillText('TriLingo 三語道場', W / 2, 130);

  ctx.fillStyle = '#2b2416';
  ctx.font = `800 88px ${SERIF}`;
  ctx.fillText('結 業 證 書', W / 2, 238);
  ctx.fillStyle = '#9a8a66';
  ctx.font = `600 24px ${SANS}`;
  ctx.fillText('CERTIFICATE OF COMPLETION', W / 2, 284);

  ctx.fillStyle = '#5b4e33';
  ctx.font = `500 30px ${SANS}`;
  ctx.fillText('茲證明', W / 2, 360);

  // 名字＋底線
  ctx.fillStyle = '#1f1a10';
  fitText(ctx, name, (px) => `800 ${px}px ${SERIF}`, 72, W - 360, 36);
  ctx.fillText(name, W / 2, 448);
  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 260, 474);
  ctx.lineTo(W / 2 + 260, 474);
  ctx.stroke();

  ctx.fillStyle = '#3a3122';
  const line1 = `完成了${meta.name}「${stage.title}」的學習路線`;
  fitText(ctx, line1, (px) => `600 ${px}px ${SANS}`, 36, W - 260);
  ctx.fillText(line1, W / 2, 548);
  ctx.fillStyle = '#7a6a4a';
  ctx.font = `500 26px ${SANS}`;
  ctx.fillText(`共 ${units.length} 個單元・${lessons} 堂課（含單元測驗），特此證明。`, W / 2, 598);

  // 日期（左下）
  ctx.textAlign = 'left';
  ctx.fillStyle = '#5b4e33';
  ctx.font = `600 26px ${SANS}`;
  ctx.fillText(zhDate(date), 140, H - 132);
  ctx.fillStyle = '#9a8a66';
  ctx.font = `500 20px ${SANS}`;
  ctx.fillText(stage.subtitle, 140, H - 100);

  // 印章（右下）：關卡顏色的圓＋語言的字
  const sx = W - 220;
  const sy = H - 170;
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(-0.12);
  ctx.globalAlpha = 0.88;
  ctx.strokeStyle = c;
  ctx.fillStyle = c;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 78, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 66, 0, Math.PI * 2);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 52px ${SANS}`;
  ctx.fillText(meta.glyph, 0, -12);
  fitText(ctx, stage.short, (px) => `800 ${px}px ${SANS}`, 24, 110, 14);
  ctx.fillText(stage.short, 0, 38);
  ctx.restore();
}

/** 證書的檔名：TriLingo-日文-N5-結業證書.png */
const fileName = (info: CertInfo) => `TriLingo-${META[info.lang].name}-${info.stage.short.replace(/\s+/g, '')}-結業證書.png`;

export function CertificateModal({ info, onClose }: { info: CertInfo; onClose: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [msg, setMsg] = useState('');
  const canShare = typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare;

  useEffect(() => {
    const draw = () => {
      const ctx = ref.current?.getContext('2d');
      if (ctx) drawCertificate(ctx, info);
    };
    draw();
    // 字型下載好之後再畫一次，字才會是正確的字型
    document.fonts?.ready.then(draw).catch(() => {});
  }, [info]);

  const blob = () =>
    new Promise<Blob | null>((ok) => {
      const c = ref.current;
      if (c) c.toBlob(ok, 'image/png');
      else ok(null);
    });

  const download = async () => {
    const b = await blob();
    if (!b) return;
    const url = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName(info);
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMsg('已經存成圖片了。');
  };

  const share = async () => {
    const b = await blob();
    if (!b) return;
    const file = new File([b], fileName(info), { type: 'image/png' });
    if (!navigator.canShare?.({ files: [file] })) return download();
    try {
      await navigator.share({ files: [file], title: `${META[info.lang].name} ${info.stage.short} 結業證書` });
    } catch {
      // 使用者取消分享
    }
  };

  return (
    <Modal className="cert-modal" onClose={onClose}>
      <h2>🎓 {info.stage.short} 結業證書</h2>
      <canvas ref={ref} width={W} height={H} className="cert-canvas" role="img" aria-label={`${info.name} 完成${META[info.lang].name}「${info.stage.title}」的結業證書，${slashDate(info.date)}`} />
      {msg && <p className="muted cert-msg">{msg}</p>}
      <div className="modal-actions">
        <button type="button" className="btn" onClick={onClose}>
          關閉
        </button>
        {canShare && (
          <button type="button" className="btn" onClick={share}>
            📤 分享
          </button>
        )}
        <button type="button" className="btn primary" onClick={download}>
          ⬇️ 存成圖片
        </button>
      </div>
    </Modal>
  );
}
