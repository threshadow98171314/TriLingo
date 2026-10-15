// 使用說明：所有功能的簡單說明，用可以展開的問答呈現。
import type { ReactNode } from 'react';
import { markGuide, resetGuides, useSave } from '../core/store';
import { TIERS } from '../core/ranks';
import { href, nav } from '../router';

function Q({ q, children, open }: { q: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="help-q" open={open}>
      <summary>{q}</summary>
      <div className="help-a">{children}</div>
    </details>
  );
}

export function HelpPage() {
  const s = useSave();
  return (
    <div className="page narrow help">
      <section className="card panel">
        <header className="panel-head">
          <h2>使用說明</h2>
          <small className="muted">點標題展開說明</small>
        </header>
        <div className="help-actions">
          <button
            type="button"
            className="btn small"
            onClick={() => {
              resetGuides();
              nav('/');
            }}
          >
            🔁 重看新手導覽與所有提示
          </button>
          {!s.guide.welcome && (
            <button type="button" className="btn small" onClick={() => markGuide('welcome')}>
              關閉導覽
            </button>
          )}
        </div>
      </section>

      <section className="card panel">
        <h3 className="group-label">開始學習</h3>
        <Q q="第一次用，要從哪裡開始？" open>
          <p>
            回到首頁，在想學的語言卡片按「▶ 開始第一課」。日文、韓文建議先上「五十音」「韓文字母」；已經會的話，可以直接挑戰各單元的「單元測驗」跳級。
          </p>
        </Q>
        <Q q="學習路線怎麼走？">
          <p>每個語言分成好幾關（例如日文 N5、N4…），每關有好幾個單元，每個單元有 2～5 堂課和一個單元測驗。</p>
          <ul>
            <li>課要依序上：🔒 表示要先完成前一課。</li>
            <li>👑 單元測驗隨時都能挑戰，答對 80% 就算完成整個單元，並解鎖下一個單元。</li>
            <li>每堂課依答對率拿 1～3 顆星，想拿滿可以重練。</li>
          </ul>
        </Q>
        <Q q="上課時有哪些題型？">
          <ul>
            <li>教學卡：新單字、新句子先看一次，按 🔊 聽發音。</li>
            <li>選擇題：看字選意思、看意思選字、聽發音選意思。</li>
            <li>拼字、句子重組：點字卡排出答案。</li>
            <li>日文打字題：用日文輸入法打出答案，假名、漢字都可以。</li>
            <li>克漏字、聽問題選回應（多益 Part 2 形式）、漢字讀音題（日檢題型）。</li>
          </ul>
          <p>答錯的題目會在這一堂的最後再考一次（單元測驗不會），也會排進複習。</p>
        </Q>
        <Q q="在外面不方便聽或打字怎麼辦？">
          <p>聽力題旁邊有「🔇 現在不方便聽」：接下來一小時聽力題會改成看文字作答。打字題有「⌨️ 現在不方便打字」：這一堂改出選擇題。設定頁也可以整個關掉日文打字題。</p>
        </Q>
      </section>

      <section className="card panel">
        <h3 className="group-label">每天的習慣</h3>
        <Q q="連勝、每日目標是什麼？">
          <p>每天拿到「每日目標」的 XP（三種語言合計，預設 50 XP，可以在設定改）就會延續連勝 🔥。忘記學習的那天，商店買的「連勝保護」會自動幫你保住連勝。</p>
        </Q>
        <Q q="每日任務和寶箱">
          <p>每天有 3 個任務，完成後按金幣按鈕領取；三個都領完可以打開每日寶箱。過關時也有機會掉落寶箱，極少數是黃金寶箱。</p>
        </Q>
        <Q q="複習（待複習）是什麼？">
          <p>學過的字會依照「間隔複習」排程：答對越多次，下次複習的間隔越長（1 天、3 天、一週、兩週…）；答錯會提早回來。首頁和語言頁會顯示「待複習」的數量，每天先清空最有效。</p>
        </Q>
        <Q q="金幣可以做什麼？">
          <p>在商店換道具（連勝保護、雙倍 XP 藥水、連擊護符、幸運草、時光沙漏）、外觀（頭像、頭像框、主題色、答對特效、稱號、喵師父裝扮），或是轉扭蛋收集貼紙。每天還有一件「神秘商品」，可能是只在那裡出現的稀有外觀。金幣來自任務、寶箱、成就、升段、彩蛋。</p>
        </Q>
      </section>

      <section className="card panel">
        <h3 className="group-label">段位與成就</h3>
        <Q q="段位怎麼算？">
          <p>
            每種語言各自累積 XP、各自升段：
            {TIERS.map((t) => t.name).join(' → ')}。聖哲以外的每個段位再分 III → II → I 三階。
          </p>
        </Q>
        <Q q="成就、隱藏成就、彩蛋">
          <p>成就頁可以看到所有成就和進度；隱藏成就解鎖前只看得到提示。網站裡還藏了 20 個彩蛋，提示在「成就 → 彩蛋收藏冊」。</p>
        </Q>
      </section>

      <section className="card panel">
        <h3 className="group-label">遊樂場與模擬考</h3>
        <Q q="遊樂場有哪些遊戲？">
          <p>都是用你已經學過的字出題，學越多解鎖越多：今日複習、填字遊戲、每日填字、配對消消樂、限時快答、聽力特訓、真假快判、記憶翻牌，日文還有打字特訓與平假名／片假名配對。</p>
        </Q>
        <Q q="模擬考怎麼用？">
          <p>語言頁的「模擬考」分頁有仿照正式考試的計時測驗（多益、日檢、TOPIK）。可以跳題、標記，時間到自動交卷；交卷後看各大題成績和逐題解析。建議上完對應的關卡再考，每次都會重新抽題。</p>
        </Q>
      </section>

      <section className="card panel">
        <h3 className="group-label">設定與常見問題</h3>
        <Q q="筆電和手機的進度怎麼同步？">
          <p>
            到 <a href={href('/settings')}>設定 → 雲端同步</a>，貼上一個只有 gist 權限的 GitHub 權杖。兩台裝置各連結一次之後，就會自動同步。
          </p>
        </Q>
        <Q q="為什麼沒有聲音？">
          <p>朗讀用的是瀏覽器內建的語音，有哪些語言的語音取決於瀏覽器。Chrome、Edge 內建英、日、韓語音；如果某個語言沒有語音，聽力題會自動改成其他題型，模擬考的聽力會改成顯示文字。也可以到設定挑選語音、調整語速。</p>
        </Q>
        <Q q="進度存在哪裡？會不見嗎？">
          <p>進度存在這台裝置的瀏覽器裡；連結雲端同步之後，也會備份到你自己的 GitHub 私人 Gist。清除瀏覽器資料之前，建議先連結雲端或在設定匯出存檔。</p>
        </Q>
        <Q q="手機可以像 App 一樣用嗎？">
          <p>可以。用手機瀏覽器打開網站，選「加到主畫面」，之後就能從主畫面直接開啟。</p>
        </Q>
      </section>
    </div>
  );
}
