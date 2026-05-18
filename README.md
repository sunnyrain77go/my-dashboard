# Judy's Dashboard

個人 AI 助理 Dashboard，整合 Google Calendar、Google Tasks、天氣、投資提醒、冰箱庫存。

## 功能

| 功能 | 資料來源 |
|---|---|
| 今日 / 未來 7 天行程 | Google Sheets `Calendar` 分頁 |
| 待辦事項（含到期日） | Google Sheets `TODO` 分頁 |
| 冰箱庫存 | Google Sheets `Fridge` 分頁 |
| 天氣 + 攜帶提醒 | Open-Meteo（免費，台北） |
| 心情標語 | 內建輪換 |
| AI 摘要 / 對話 | Gemini 1.5 Flash |
| 期貨換月提醒 | 自動計算第三個星期三 |

## Google Sheet 結構

同一個 Sheet，三個分頁：

### Calendar 分頁
| 日曆名稱 | 行程標題 | 開始時間 | 結束時間 | 行程描述 | 日曆事件ID |
|---|---|---|---|---|---|

> 由 Google Apps Script 自動同步 Google Calendar

### TODO 分頁
| 事項 | 標籤 | 狀態 | 到期日 | 備註 |
|---|---|---|---|---|

- 標籤：工作 / 採買 / 健康 / 投資 / 其他
- 狀態：待辦 / 完成
- 到期日格式：`2026/5/20`

### Fridge 分頁
| 品項 | 狀態 |
|---|---|

- 狀態：充足 / 快用完 / 已用完

## 部署步驟

### 1. Fork / Clone 這個 Repo

### 2. 設定 GitHub Secret
- Repo → Settings → Secrets and variables → Actions
- 新增 Secret：`GEMINI_API_KEY` = 你的 Gemini API Key
  （取得方式：[Google AI Studio](https://aistudio.google.com/app/apikey)）

### 3. 修改 config.js
```js
const CONFIG = {
  GEMINI_KEY: '%%GEMINI_API_KEY%%',   // 不要動，由 Actions 注入
  SHEET_ID:   '你的 Google Sheet ID', // ← 改這個
  USER_NAME:  'Judy',                  // ← 改成你的名字
};
```

### 4. 確認 Google Sheet 公開
- Google Sheet → 右上角「共用」
- 改為「知道連結的任何人」→「檢視者」

### 5. 開啟 GitHub Pages
- Repo → Settings → Pages
- Source 選「GitHub Actions」
- Push 到 main branch 即自動 deploy

## 注意事項

- Gemini API Key 透過 GitHub Actions 在 build 時注入，不會出現在原始碼裡
- deploy 後的 `config.js` 在瀏覽器開發者工具仍可看到 Key（靜態網頁的限制）
- 待辦勾選狀態存在瀏覽器 localStorage，清除瀏覽器資料會重置
