# Let's Play：接續開發提示

請把這個 Expo demo 專案，從目前的舊 UI 做成下面描述的新版本。開始前先讀完本文件和 `README.md`。

## 產品

一個給「三分鐘熱度、選擇困難、需要新鮮感」的人玩的休閒遊戲 App。

| 特質 | 設計回應 |
| --- | --- |
| 三分鐘熱度 | 每局 3 分鐘內結束，列表標示預估時間，打開就能玩，結束後一鍵換下一款 |
| 選擇困難 | 「幫我選」直接決定一款，優先挑沒玩過的；可保留「就決定是你了！」這句文案 |
| 需要新鮮感 | Gemini 持續出新題、避開近期題目、標示還沒玩過的遊戲 |

## 需求

1. **登入／註冊**：版面參考 bilibili（吉祥物、輸入密碼時遮眼、登入與註冊按鈕並排），但吉祥物和視覺都要原創，不可使用 bilibili 的名稱、角色或素材。
2. **認證**：只用 Supabase email + 密碼。不做簡訊驗證、第三方登入，也不接任何寄信服務。訪客可以先逛。
3. **首頁**：上半部放兩種遊戲類型（益智遊戲、挑戰遊戲），同時要能進入「我的收藏」和「聊天室」。
4. **遊戲**：益智、挑戰各 10 款，共 20 款，清單在 `src/games/catalog.js`。
5. **出題**：題目由 Gemini 生成。不適合 AI 出題的遊戲（數獨、迷宮、2048 等）用程式在本機生成。
6. **收藏與聊天室**：資料存 Supabase；聊天室用 Realtime 即時更新，登入後才能發言。
7. **中英雙語**：保留，預設繁體中文。

## 限制

- 這是 demo，所有程式都放在這個 Expo 專案內，不架後端、不寫 Edge Function，也不要過度設計。
- Gemini 由 App 直接呼叫，金鑰放 `.env.local` 的 `EXPO_PUBLIC_GEMINI_API_KEY`。不可寫進程式或提交到 git。此金鑰會被打包進 App，上線前必須改走後端。
- 沒有金鑰或呼叫失敗時要退回內建題庫，遊戲不能卡住。
- 所有 AI 回傳內容都要先驗證才顯示。
- 不要重建 `src/legacy/` 的舊畫面。除非使用者要求，也不要刪除它們。

## 設計

使用 `apple-design` 和 `apple-fluid-motion` 兩個 skill，並遵守：

- **主視覺**：有厚度的遊戲方塊，按下會下沉，選取時停在半下沉狀態（`Tile`，在 `src/components/ui.js`）。
- **導覽**：底部分頁（首頁、收藏、聊天室、我的），Android 實體返回鍵要能回上一層。
- **顏色**：使用 `src/theme/tokens.js`，支援淺色與深色，文字對比至少 4.5:1。狀態不可只靠顏色表達。
- **動效**：用彈簧動畫，從目前畫面上的值開始，可中途打斷；只有手勢帶動量時才加回彈。要支援「減少動態效果」。
- **回饋**：在畫面內顯示（`Banner`），不要用 `Alert.alert`，它打斷遊戲，在 web 上也沒有作用。
- **版面**：觸控目標至少 44pt，依可用寬度調整，放大字體後不破版。用 `react-native-safe-area-context`，不要用 RN 的 `SafeAreaView`。
- 切換到新 UI 時，把 `app.json` 的 `userInterfaceStyle` 改成 `automatic`。

## 目前狀態

- 技術：Expo SDK 55、React Native 0.83、React 19.2、`@supabase/supabase-js`。
- 分支：`main` 的 `a4df767` 是基準還原點，開發在 `redesign` 分支（`c9cce0e`）。
- 畫面上跑的仍是舊 UI：`src/App.js` 和 `src/screens/`，只有 5 款益智遊戲可玩，其餘是「即將推出」。

已寫好、但尚未接上畫面、也沒實際執行過的檔案：

| 檔案 | 內容 |
| --- | --- |
| `src/components/ui.js` | 新 UI 元件與彈簧動畫 |
| `src/theme/tokens.js` | 顏色與字級 |
| `src/state/store.js` | 登入狀態、收藏、遊玩紀錄、語言、挑選遊戲 |
| `src/games/catalog.js` | 20 款遊戲目錄、內建題庫、Gemini 出題與驗證 |
| `src/lib/gemini.js` | Gemini 呼叫 |

## Supabase

- 連線設定在 `src/lib/supabase.js`（publishable key）。
- `favorites`、`plays`、`chat_messages` 的建表 SQL 在 `supabase/schema.sql`，由使用者貼到 SQL Editor 執行。開始前先確認是否已建立，檢查時回傳 200 代表已存在、404 代表還沒建。
- `profiles` 表已存在，含 `id`、`nickname` 欄位，目前未使用；暱稱存在帳號的 user metadata。
- 註冊要能立即登入，使用者需在後台關閉 **Confirm email**。上次檢查時仍是開啟（`mailer_autoconfirm: false`）。
- 沒有 secret key，也沒有 Supabase CLI，所以無法從這裡建表或改設定。

## Gemini

- 模型：`gemini-3.5-flash-lite`。
- 端點：`POST https://generativelanguage.googleapis.com/v1beta/interactions`
- 標頭：`x-goog-api-key`、`Api-Revision: 2026-05-20`
- JSON 輸出：`response_format: { type: 'text', mime_type: 'application/json', schema }`
- 回應文字位置：`steps[]` 中 `type` 為 `model_output` 的項目 → `content[]` → `text`

**尚未驗證**：目前沒有金鑰，以上都還沒實際呼叫過，web 上的 CORS 也沒確認。拿到金鑰後要先測這一段。

## 工作步驟

1. 接上 `StoreProvider`、`SafeAreaProvider` 和底部分頁，取代舊路由。
2. 做登入／註冊頁，取代未使用的 `src/legacy/AuthScreen.js`。
3. 做首頁、「幫我選」、遊戲列表、收藏頁。
4. 做共用遊戲框架：倒數、結果畫面（再來一局、換一款、收藏）、載入與題目來源標示。
5. 實作 20 款遊戲，舊有 5 款改用新 UI。
6. 做聊天室，以及「我的」頁（語言、登出）。
7. 測試後，每完成一個階段就提交一次。

## 驗證

- 用 `npx expo start --port 8081` 啟動，並在 web 上實際操作每條流程；Chrome 擴充功能連不上時，改用無頭 Chrome 透過 CDP 操作。截圖要親自看過。
- Android 模擬器上的 Expo Go 為 SDK 55，專案也已升到 SDK 55，但尚未確認能成功開啟，也要測。
- 不要用 agent 在正式 Supabase 專案建立帳號或輸入密碼。需要登入的流程請使用者自己測試。
- 回報時要明確區分「實際測過」和「只寫好沒測」。

## Git

- 在 `redesign` 分支上開發，不要直接提交到 `main`。
- `*.apk`、`.env*`（`.env.example` 除外）不可提交。
- 提交訊息結尾加上工具要求的 attribution。
