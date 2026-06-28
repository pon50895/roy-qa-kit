# 測試資料 / PII 政策

## 清理（teardown / reset）
- 每次跑後或定期 reset：清測試建立的資料（訂單/帳號/檔案），別累積污染。
- 無法用 API 刪的 → 提供 DB reset 腳本，上線前必跑。
- fixtures.md 標「已用/未用」，驗修正只拿未用的乾淨料。

## PII / 機密
- 測試資料**不放真實個資**：去識別（假 ID/姓名）或用合成資料。
- 真實環境若必須用真資料 → 環境隔離 + 存取控管 + 不外流（不進 repo、不進報告明碼）。
- 報告/log 中的 PII 要隱碼。
- repo 由 `scripts/scan.mjs` + pre-commit hook 擋 PII/機密；專案識別詞於 qa.config.scanWords 設定。

## 保留 / 稽核
- 測試證據（截圖/檔）保留期 + 清理。
- 資料保留/刪除排程（如產出檔保留 N 天）也要列測試。
