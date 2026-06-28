# Prod 監控 / Shift-right（測試不止於上線）

無退場機制(rollback)時更關鍵 —— 上線後靠監控即時抓問題。

## 上線後 smoke（synthetic monitoring）
- 關鍵路徑（登入/核心交易/產檔）定時自動跑（可重用 @smoke 測試）。
- 失敗即告警。

## 監控 / 告警
- 錯誤率 / 5xx / 延遲(p95) 儀表板 + 閾值告警。
- 關鍵業務指標（成功率、轉化、佇列長度）。
- log 異常 / exception 追蹤。

## 與測試的連結
- @smoke 套件 = synthetic monitor 的來源。
- prod 抓到的問題 → 回灌缺陷 + 補測試（escape → 新案例），降逃逸率。
