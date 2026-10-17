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
- 題目按語言分開打包、用到時才下載：關卡大綱在 `meta.ts`（隨主程式載入），各關卡的單元在 `en.ts`／`ja.ts`／`ko.ts` 的 `UNITS`。App 程式不要直接 import 這些語言檔或 `all.ts`（會把題目打包回主程式），要用 `content/index.ts` 的 `useCourse`／`loadCourse`／`requireCourse`；上課、遊戲頁外層有 `CourseGate` 等待下載。
- 學習進度以「單元 id＋原文」當 key 儲存：已上線項目的原文不要改，否則該字的進度會歸零。
- 新增內容後一定要跑 `npm test`，`tests/content.test.ts` 會抓 id 重複、振假名漏標、選項重複等筆誤。

## 版面（使用者的要求：不要跑版）

- 改了畫面就要在預覽裡用手機寬度（375px）和桌機寬度各看一次，確認沒有跑版：元素沒有歪掉、重疊、被撐大或超出畫面。
- 常見陷阱：`<button>` 有預設內距（放圖示、頭像時要歸零）；emoji 的寬度不一，放進固定大小的圓形按鈕要設寬高並置中；並排的圖示按鈕要同一個大小。

## 其他

- 雲端同步把存檔放在使用者 GitHub 帳號的私人 Gist；合併規則在 `src/core/merge.ts`，改存檔結構時要同步更新 `save.ts` 的 `migrate` 與合併規則，並補測試（`tests/sync.test.ts`）。
- 預覽工具曾經從舊的暫存資料夾啟動伺服器。如果頁面不是最新程式碼，先確認監聽埠的程序路徑是 `D:\dev\TriLingo`。
