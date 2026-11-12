# TriLingo 三語道場：給 Claude 的專案說明

- 和使用者溝通一律使用繁體中文（台灣用語）；做事過程中的說明與推理也用繁體中文呈現。
- 技術：Vite + React + TypeScript 的純前端網站，沒有後端。部署在 GitHub Pages（repo：`threshadow98171314/TriLingo`，網址 <https://threshadow98171314.github.io/TriLingo/>）。

## 每次更新網站後都要推送（使用者的要求）

1. `npm test` 與 `npm run build` 都通過。
2. `git add -A`，提交訊息用繁體中文描述這次改了什麼。
3. `git push`：推到 `main` 會觸發 `.github/workflows/deploy.yml` 自動部署。
4. 用 `gh run watch` 確認部署成功，必要時打開線上網址檢查。

本機的 `.claude/settings.local.json` 有一個 Stop hook，結束回覆時若還有未提交或未推送的變更會提醒。修改還沒完成時（例如在等使用者回覆）不要推送半成品，說明原因即可。

## 課程內容

- 內容在 `src/content/`，用 `dsl.ts` 的工具撰寫；寫法見 README「新增內容」。
- 題目按關卡分「包」、用到才下載：各關卡有哪些包、在哪些檔案寫在 `parts.ts`（新檔案要在這裡加一行）。「今天」頁、學習路線只用大綱 `OUTLINE`（`gen/outline-*.json`，由 `npm run outline` 從題目自動產生，隨主程式載入）。
  - App 程式不要直接 import 題目檔、`all.ts` 或 `outline-build.ts`（會把題目打包回主程式）。
  - 需要題目的畫面用 `<CourseGate need={…}>` 包起來（`{ units }`／`{ stages }`／`'active'`＝學過的字／`'next'`＝下一堂新課／`'all'`／`'mocks'`／`'concepts'`／`'wordle'`，可以用陣列合併），裡面再用 `courseIndex`、`loadedCourse`、`requireExtra` 取用；只看進度的地方（解鎖、星星、下一課）傳大綱給 `core/progress.ts` 就好。
  - `src/content/gen/` 是產生的檔案，不要手改；改了題目要讓它重新產生（`npm test`、`npm run build` 會自動跑，開發伺服器開著時也會自動更新），並一起提交。
  - 頁面元件在 `App.tsx` 用 `lazy` 載入；語言頁的分頁在 `pages/tabs/`。
- 導覽列分成今天／學習／練功／查詢／我的五個區域（`core/nav.ts`）：新增頁面時要讓 `sectionOf` 認得它的網址（導覽列才會亮對），換語言時去哪一頁寫在 `switchLangPath`，並補 `tests/nav.test.ts`。目前的語言存在這台裝置（`core/currentLang.ts`）。
- 學習進度以「單元 id＋原文」當 key 儲存：已上線項目的原文不要改，否則該字的進度會歸零。
- 新增內容後一定要跑 `npm test`，`tests/content.test.ts` 會抓 id 重複、振假名漏標、選項重複等筆誤。

## 版面（使用者的要求：不要跑版）

- 改了畫面就要在預覽裡用手機寬度（375px）和桌機寬度各看一次，確認沒有跑版：元素沒有歪掉、重疊、被撐大或超出畫面。
- 上方導覽列東西很多（Logo、語言按鈕、五個區域、雙倍 XP 倒數、雲端同步、說明、連勝、金幣、頭像）：改了它要從 320px 到 1080px 都量一次，包含有雙倍 XP、有雲端同步、金幣五位數的情況（收起規則在 `styles.css` 搜尋「上方列在手機、平板」）。
- 常見陷阱：`<button>` 有預設內距（放圖示、頭像時要歸零）；emoji 的寬度不一，放進固定大小的圓形按鈕要設寬高並置中；並排的圖示按鈕要同一個大小。

## 其他

- 雲端同步把存檔放在使用者 GitHub 帳號的私人 Gist；合併規則在 `src/core/merge.ts`，改存檔結構時要同步更新 `save.ts` 的 `migrate` 與合併規則，並補測試（`tests/sync.test.ts`）。
- 預覽工具曾經從舊的暫存資料夾啟動伺服器。如果頁面不是最新程式碼，先確認監聽埠的程序路徑是 `D:\dev\TriLingo`。
