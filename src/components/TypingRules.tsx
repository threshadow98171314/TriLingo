// 打字教學：日文輸入法（羅馬拼音輸入）與韓文鍵盤（兩組式 두벌식）的打法。
// 打字題裡按「怎麼打？」會用精簡版；遊樂場的「打字教室」是完整版。
import { KO_KEYS } from '../engine/typing';
import { cx } from '../core/util';

const JA_RULES: [rule: string, kana: string, keys: string][] = [
  ['促音「っ」：下一個子音按兩次', 'がっこう', 'ga kko u'],
  ['「ん」：按兩次 n 最保險', 'こんにちは', 'ko nn ni chi ha'],
  ['平假名的長音：照字打出來', 'おとうさん', 'o to u sa nn'],
  ['片假名的長音「ー」：按減號鍵', 'コーヒー', 'ko - hi -'],
  ['拗音（小字 ゃゅょ）：子音＋y＋母音', 'きょう', 'kyo u'],
  ['助詞 は／へ／を：照字打', 'わたしは', 'wa ta shi ha'],
  ['「を」：打 wo', 'ほんを', 'ho nn wo'],
  ['「ぢ」「づ」：打 di、du', 'つづく', 'tsu du ku'],
  ['單獨的小字：前面加 x', 'ぁ・っ', 'xa・xtu'],
  ['外來語的組合', 'ティー・ファン', 'thi -・fa nn'],
];

const KO_RULES: [rule: string, word: string, keys: string][] = [
  ['照「子音 → 母音 →（收尾音）」的順序打，輸入法會自動組字', '한', 'ㅎ ㅏ ㄴ（g k s）'],
  ['沒有子音開頭的字，先打 ㅇ', '아', 'ㅇ ㅏ（d k）'],
  ['雙子音 ㄲ ㄸ ㅃ ㅆ ㅉ：按住 Shift', '까', 'Shift＋ㄱ ㅏ（R k）'],
  ['ㅒ、ㅖ：按住 Shift', '예', 'ㅇ Shift＋ㅔ（d P）'],
  ['複合母音：拆成兩個鍵', '와', 'ㅇ ㅗ ㅏ（d h k）'],
  ['雙收尾音：拆成兩個鍵', '읽', 'ㅇ ㅣ ㄹ ㄱ（d l f r）'],
  ['收尾音遇到母音會自動移到下一個字', '아니', 'ㅇ ㅏ ㄴ ㅣ（d k s l）'],
];

const KO_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const KEY_TO_JAMO: Record<string, string> = Object.fromEntries(Object.entries(KO_KEYS).map(([j, k]) => [k, j]));
const VOWELS = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣ';

/** 兩組式韓文鍵盤：每個英文鍵對應的字母（左邊子音、右邊母音） */
export function KoKeyboard() {
  return (
    <div className="ko-kb" aria-label="韓文兩組式鍵盤配置">
      {KO_ROWS.map((row) => (
        <div key={row} className="ko-kb-row">
          {Array.from(row).map((k) => {
            const j = KEY_TO_JAMO[k];
            const sh = KEY_TO_JAMO[k.toUpperCase()];
            return (
              <span key={k} className={cx('ko-key', VOWELS.includes(j) ? 'v' : 'c')}>
                {sh && <small lang="ko">{sh}</small>}
                <b lang="ko">{j}</b>
                <i>{k}</i>
              </span>
            );
          })}
        </div>
      ))}
      <p className="muted small">左手是子音、右手是母音；左上角的小字要按住 Shift。</p>
    </div>
  );
}

export function TypingRules({ lang, compact }: { lang: 'ja' | 'ko'; compact?: boolean }) {
  if (lang === 'ja') {
    return (
      <div className="typing-rules">
        <h2>日文輸入法怎麼打</h2>
        <p className="muted">
          用英文字母打羅馬拼音，會自動變成平假名；按空白鍵可以換成漢字或片假名，按 Enter 確定。打字題只打假名也算對。
        </p>
        <table className="rules-table">
          <tbody>
            {JA_RULES.map(([rule, kana, keys]) => (
              <tr key={rule}>
                <td>{rule}</td>
                <td lang="ja" className="rt-word">
                  {kana}
                </td>
                <td>
                  <kbd>{keys}</kbd>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!compact && (
          <>
            <h3>還沒有日文鍵盤？</h3>
            <ul className="rules-list">
              <li>Windows：設定 → 時間與語言 → 語言與地區 → 新增語言「日本語」，用「Microsoft IME」。按 Alt＋～ 切換英數／日文。</li>
              <li>Mac：系統設定 → 鍵盤 → 輸入方式 → ＋ → 日文「羅馬字」。</li>
              <li>iPhone：設定 → 一般 → 鍵盤 → 新增鍵盤 → 日文 →「Romaji」（初學者建議）或「假名」。</li>
              <li>Android：Gboard → 設定 → 語言 → 新增「日本語」，選 QWERTY 鍵盤。</li>
            </ul>
            <h3>小訣竅</h3>
            <ul className="rules-list">
              <li>打完假名按 F7 會變片假名、F6 變平假名（電腦）。</li>
              <li>聽不出有沒有「っ」時，注意聲音有沒有停頓一拍：きて（來）／きって（郵票）。</li>
              <li>聽不出長音時，注意聲音有沒有拉長：おばさん（阿姨）／おばあさん（奶奶）。</li>
            </ul>
          </>
        )}
      </div>
    );
  }
  return (
    <div className="typing-rules">
      <h2>韓文鍵盤怎麼打</h2>
      <p className="muted">韓文鍵盤（兩組式 두벌식）把子音放在左手、母音放在右手，照順序打字母，輸入法會自動組成一個字。</p>
      <KoKeyboard />
      <table className="rules-table">
        <tbody>
          {KO_RULES.map(([rule, word, keys]) => (
            <tr key={rule}>
              <td>{rule}</td>
              <td lang="ko" className="rt-word">
                {word}
              </td>
              <td>
                <kbd>{keys}</kbd>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!compact && (
        <>
          <h3>還沒有韓文鍵盤？</h3>
          <ul className="rules-list">
            <li>Windows：設定 → 時間與語言 → 語言與地區 → 新增語言「한국어」，用「Microsoft 입력기」。按右 Alt（한/영）切換英文／韓文。</li>
            <li>Mac：系統設定 → 鍵盤 → 輸入方式 → ＋ → 韓文「2-Set Korean」。</li>
            <li>iPhone：設定 → 一般 → 鍵盤 → 新增鍵盤 → 韓文 →「標準」（和電腦鍵盤一樣的兩組式）。</li>
            <li>Android：Gboard → 設定 → 語言 → 新增「한국어」，選「2벌식」。</li>
          </ul>
          <h3>小訣竅</h3>
          <ul className="rules-list">
            <li>詞和詞之間要空一格（띄어쓰기）；打字題裡空格打錯不算錯，但會提醒你。</li>
            <li>平音、激音、硬音要分清楚：가（ㄱ）／카（ㅋ）／까（ㄲ）。</li>
            <li>ㅐ 和 ㅔ 現在的發音幾乎一樣，只能靠記：개（狗）／게（螃蟹）。</li>
          </ul>
        </>
      )}
    </div>
  );
}
