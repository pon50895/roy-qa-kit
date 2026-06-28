# 盲點 / 待補清單（框架尚未涵蓋）

分 A（上線前就會痛）/ B（讓 QA 可持續、可量化，上線後補）。

## A. 上線前要列
1. **In-app webview 當獨立環境**：前端若跑在第三方 App 的 webview（非標準瀏覽器），要單列為環境 —— 該 webview 特有問題（關閉行為、登入態、僅限 App 內開啟）標準 viewport 測不到。
2. **上線前「bypass 移除」go-live gate**：測試環境常有 OTP/captcha/外部登入的 bypass。上 prod 前必須逐項確認**全部關閉**（否則資安洞）。獨立於停止條件的 go-live checklist。
3. **測試資料清理/重置 + PII**：自動 teardown/reset（別累積測試訂單/帳號）；測試資料含個資 → 去識別或環境隔離政策。
4. **環境健康檢查（pre-test gate）**：跑測試前先確認環境活著、token 有效、版本正確，避免測一半才發現 401/版本不符。
5. **Shift-right / prod 監控**：若無 rollback，上線後 prod 的 synthetic smoke + 錯誤監控/告警更關鍵。測試不止於上線。

## B. QA 可持續/可量化（上線後）
6. **缺陷流程**：intake → triage（誰、SLA）→ RCA 根因 → 指標（escape rate / defect density / flaky 率）。
7. **Flaky 處理**：有人工關卡/timing 的測試天生 flaky → quarantine + retry 政策 + flaky 追蹤。
8. **風險登記簿**：專案級 top risks + 緩解 + 殘餘風險（整合視圖，非逐票）。
9. **負向/資安測試深度**：authz 越權、rate limit、injection、WAF 行為。
10. **測試擁有權/維護**：誰維護、命名規範、test 也要 review、避免 test debt。

## 對應做法（框架既有的接口）
- 1/4 → environment.md + fixtures/env.ts 加 health-check。
- 2 → go-live checklist 範本（templates/）。
- 3 → fixtures.md 標記 + reset 腳本 + PII 政策。
- 6/7/8 → report-spec 的 defect/trend 欄位 + RCA 模板。
