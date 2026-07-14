# e2e-qa-framework — 通用 E2E/QA 框架

![Playwright](https://img.shields.io/badge/Playwright-Test-2EAD33?logo=playwright) ![License](https://img.shields.io/badge/license-MIT-blue)

以 Playwright Test 為核心，把「方法 + 分類 + 矩陣 + 嚴重度/優先度 + 多環境 + 報告」做成**通用、config 驅動、可套到任何專案**的 QA 框架。

---

## 快速開始

### 需求
- Node 18+、`git`
- Python 3（僅匯出 XLSX 報表時用）

### 1. 30 秒試跑（零設定，先看它動起來）
```bash
git clone https://github.com/pon50895/roy-qa-kit.git && cd roy-qa-kit
npm install && npx playwright install chromium
cp qa.config.example.json qa.config.json      # 用預設值即可先跑
npm run test:smoke                             # 跑內建範例測試（tests/_example）
npm run report                                 # 開 HTML 報告
```
跑得起來、看得到報告，代表環境 OK。接著再接你的專案。

### 2. 接上你的專案（init）
init 會吃**兩個輸入檔生出矩陣骨架，兩個都是選填**（沒給就跳過那半）：

| 輸入檔 | 是什麼 | 格式 / 範例 | 沒給的話 |
|---|---|---|---|
| `jira_board.csv` | Jira 看板匯出 CSV | 需含欄位「議題索引鍵 / 摘要 / 狀態」（或英文 Key/Summary/Status）。範例：[`fixtures/jira_board.example.csv`](fixtures/jira_board.example.csv) | 跳過 RTM 生成 |
| `features.json` | 功能名稱清單 | JSON 字串陣列，例：`["登入","序號兌換","報告上傳"]`。範例：[`features.example.json`](features.example.json) | 跳過功能矩陣生成 |

```bash
cp .env.example .env.uat        # 填該環境的 URL / 帳密
# 用附的範例先體驗（或換成你自己的兩個檔）：
node scripts/init.mjs fixtures/jira_board.example.csv features.example.json
#   → docs/traceability-matrix.md（RTM 骨架）
#   → docs/feature-matrix.md（功能矩陣骨架）

npm run login                   # 取 token（captcha 由人工過）
ENV=uat npm test && npm run export   # 跑測試 → 產 HTML + CSV + XLSX
```

### 產出物
- `docs/traceability-matrix.md` — 追蹤矩陣 RTM（票 ↔ 案例 ↔ 狀態 ↔ 證據）
- `docs/feature-matrix.md` — 功能矩陣（功能 × 類型/維度）
- `playwright-report/` — 互動式 HTML 報告（`npm run report`）
- 匯出的 CSV / XLSX（`npm run export`）

---

## 核心理念（docs/）
- `methodology.md` — 測試 Loop(7步) + 停止條件 + pre-flight gate（會自我修正）
- `taxonomy.md` — 6 測試類型(@type/@value+edge/@logic/@file/@sanity/@integration) × 維度(@auth/@visual/@mock/@live/狀態)
- `severity-priority.md` — P0~P3 定義 + 優先度自動規則 + 手動覆寫
- `strategy.md` — 要測哪些 / 怎麼測 / 哪一次測（觸發→套件→環境）
- `templates/` — 測試案例 / 追蹤矩陣RTM / 功能矩陣 / 週報briefing 範本

## 輸入來源（互補，建議兩個都給）
- **Ticket board**(Jira CSV) → 追蹤矩陣 RTM（**該做**什麼）
- **功能清單**(features.json) → 功能矩陣（**有什麼**可測）
> 兩者交叉抓缺口：有票沒測、有功能沒票。

## 嚴重度 / 優先度
```bash
node scripts/priority.mjs items.json          # 自動算 + 手動覆寫，輸出 final priority
```
P0 阻擋上線/資料錯/資安 · P1 核心有 workaround · P2 後台/優化 · P3 美化。

## 半自動關卡（誠實標、非缺陷）
captcha / OTP bypass / 真帳號登入 → **自動化不得代解，需人工過**；把「哪些環境驗不到」標清楚（見各專案 `environment.md`）。若要全自動，請該環境提供測試 bypass（如 `MOCK_CAPTCHA`）。

## 常見問題
- **`browserType.launch` 找不到瀏覽器** → `npx playwright install chromium`
- **還沒有 Jira CSV / features.json** → 兩者皆選填，可先只跑 `npm run test:smoke`
- **XLSX 匯出失敗** → 需 `python3`（HTML/CSV 不需要）
- **login 卡 captcha** → 由人工輸入；自動化環境請開 `MOCK_CAPTCHA`
