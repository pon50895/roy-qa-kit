# 測試維護 / 擁有權

## 命名規範
- 檔：`<功能>.<層>.spec.ts`（api/ui）；`*.perf.ui.spec.ts`、`*.api.spec.ts`。
- 測試標題：`@tag... <角色/條件> <動作> <預期>`，一看就懂測什麼。
- tag：類型(@type/@logic/@file…) + 維度(@auth/@visual/@mock/@live) + 專項(@security/@perf/@a11y/@contract) + @smoke/@p0/@flaky。

## 擁有權 / Review
- 每塊功能的測試有 owner（對應 feature-matrix）。
- **測試碼也要 code review**（測試錯 = 假綠燈，比沒測更危險）。
- 測試本身也驗：非平凡邏輯留一個會失敗的反例（測試的測試）。

## 測試債
- 跳過(skip)/quarantine 的要記原因 + 何時還。
- 過時(stale)測試（對不上現況）要更新或刪，別放著假綠燈。
- 定期清：孤兒測試、重複、無斷言的空殼。
