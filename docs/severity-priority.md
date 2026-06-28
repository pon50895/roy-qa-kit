# 嚴重程度 Severity + 優先度 Priority（自動 + 手動）

分兩個概念，別混：
- **Severity（嚴重程度）= 影響多大**（客觀，看後果）。
- **Priority（優先度）= 多快處理**（決策，看時程/風險/可繞過）。

---

## 一、Severity 定義（P0–P3，依「影響」）

| 級別 | 定義（後果） | 典型例 |
|---|---|---|
| **P0** | 阻擋上線 / 核心流程走不通 / 資料錯誤遺失 / 重大資安漏洞 | 主流程 deadlock、付款錯、權限提升 |
| **P1** | 影響核心正確性或體驗，有 workaround 但上線前要清 | 錯誤訊息缺失、必填漏擋、狀態回寫錯 |
| **P2** | 次要 / 後台 / 優化，不影響主上線 | 報表多一欄、後台搜尋小 bug |
| **P3** | 美化 / 便利 / 文案 | 顏色、字級、提示語 |

---

## 二、Priority = 自動算 + 手動覆寫

### 自動規則（rule engine，可在 qa.config 調權重）
輸入旗標：`severity`, `blocksRelease`, `criticalPath`, `hasWorkaround`, `security`, `dataIntegrity`, `externalDependency`。

預設推導（由高到低，命中即定）：
1. **P0** ← `severity=P0` 或 `security` 或 `dataIntegrity` 或 (`blocksRelease` 且 !`hasWorkaround`)
2. **P1** ← `severity=P1` 或 `criticalPath` 或 (`severity=P0` 但 `hasWorkaround`)
3. **P2** ← `severity=P2` 或 (`externalDependency` 且 !`criticalPath`)
4. **P3** ← 其餘

> `externalDependency`（等第三方）通常**降一階**可排程性、但若同時 `criticalPath` 不降（例：等新壽 API 但卡主流程）。

### 手動覆寫（永遠贏，但要理由）
每張票可設 `priorityOverride: { value, reason, by, at }`。覆寫存證、可回溯。
> 例：自動算 P2，但 PM 拍板上線前必做 → override P1 + reason。

### 輸出
`priority.mjs` 吃一份 items JSON → 印每張 auto/final + 來源（auto 或 override）。

---

## 三、跟測試/RTM 的關係
- **Severity** 寫在 bug/票上，影響「要不要這輪測 + 停止條件」。
- **Priority** 決定測試**順序與觸發**（P0/P1 每次必跑、P2/P3 變動才跑）— 對應 `test-strategy.md`。
- 停止條件用 Priority：`P0=0 open、P1=PASS或已排修` 才收斂出 briefing。
