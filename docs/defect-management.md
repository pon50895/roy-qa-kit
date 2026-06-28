# 缺陷管理（生命週期 + 指標）

## 生命週期
intake（回報）→ triage（分級/指派，定 SLA）→ in-progress（修）→ verify（重驗，含反例）→ close。
拒收/重複/無法重現 也是合法終態，要寫原因。

## 缺陷必填欄位
id / 標題 / 現象 / 重現步驟 / 環境+版本 / 證據 / severity / priority(auto+override) / 指派 / 狀態 / RCA(見 templates/rca.md) / 關聯票。

## triage SLA（範例，依專案調）
- P0：當日；P1：48h；P2：本迭代；P3：backlog。

## 指標（從 report/缺陷資料算）
| 指標 | 定義 | 看什麼 |
|---|---|---|
| Defect density | 缺陷數 / 規模(功能/KLOC) | 哪塊品質差 |
| Escape rate | 上線後才發現 / 總缺陷 | 測試有效性 |
| Reopen rate | 重開 / 已關 | 修不乾淨 |
| MTTR | 平均修復時間 | 反應速度 |
| Flaky rate | flaky / 總測試 | 測試穩定度 |
| 趨勢 | 各項隨時間 | 變好或變差 |

> 目標不是零缺陷，是「逃逸率低 + 趨勢向好 + 高 severity 收斂」。
