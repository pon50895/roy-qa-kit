# e2e-qa-framework — 通用 E2E/QA 框架

Playwright Test 為核心，把「方法 + 分類 + 矩陣 + 嚴重度/優先度 + 多環境 + 報告」做成**通用、config 驅動、可套到任何專案**。

## 核心理念（docs/）
- `methodology.md` — 測試 Loop(7步) + 停止條件 + pre-flight gate（會自我修正）
- `taxonomy.md` — 6 測試類型(@type/@value+edge/@logic/@file/@sanity/@integration) × 維度(@auth/@visual/@mock/@live/狀態)
- `severity-priority.md` — P0~P3 定義 + 優先度自動規則 + 手動覆寫
- `strategy.md` — 要測哪些 / 怎麼測 / 哪一次測（觸發→套件→環境）
- `templates/` — 測試案例 / 追蹤矩陣RTM / 功能矩陣 / 週報briefing 範本

## 輸入來源（兩個都要）
- **Ticket board**(Jira CSV) → 追蹤矩陣 RTM（該做什麼）
- **程式/功能清單**(features.json) → 功能矩陣（有什麼可測）
> 交叉抓缺口：有票沒測、有功能沒票。

## 套到新專案（init）
```bash
npm install && npx playwright install chromium
cp qa.config.example.json qa.config.json     # 填專案名/環境/觸發
cp .env.example .env.uat                      # 填該環境 URL/帳密
node scripts/init.mjs <jira_board.csv> <features.json>   # 生 RTM + 功能矩陣骨架
npm run login                                 # 取 token（captcha 人工）
ENV=uat npm test && npm run export            # 跑 → HTML + CSV + XLSX
```

## 嚴重度/優先度
```bash
node scripts/priority.mjs items.json          # 自動算 + 手動覆寫，輸出 final priority
```

## 半自動關卡（誠實標、非缺陷）
captcha / OTP bypass / 真帳號 → 標清楚哪些環境驗不到（見各專案 environment.md）。
