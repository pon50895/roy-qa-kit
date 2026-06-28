# 效能 / 負載 測試

**拆兩塊,放不同地方**：
- **前端效能** → Playwright/Lighthouse（放本框架，tests/*.perf.ui.spec.ts）。
- **負載/壓力/浸泡** → k6/JMeter（獨立 gate，perf/*.js）。Playwright 不適合做負載。

## 類型
| 類型 | 目的 | 工具 |
|---|---|---|
| Load 負載 | 預期並發下達 SLA(延遲/吞吐/錯誤率) | k6 |
| Stress 壓力 | 超載找崩潰點、是否優雅降級 | k6 |
| Spike 尖峰 | 突發暴量(活動開放) | k6 |
| Soak 浸泡 | 長時間持續，記憶體/資源洩漏 | k6 |
| 前端效能 | Web Vitals(LCP/CLS)、載入、bundle | Playwright/Lighthouse |
| 容量/Volume | 大資料量處理 | k6 + 資料準備 |

## 先定 SLA / 預算（沒門檻測不出好壞）
- API：p95 latency < Xms、錯誤率 < Y%、目標 RPS。
- 前端：LCP < 2.5s、bundle < Zkb、首頁載入 < Ws。
- 達標即綠，超標即缺陷（priority 視影響）。

## 何時跑（不是每次 commit）
- 前端效能：UI 改動 / release 前。
- 負載/壓力：release 前、或改了會吃資源的功能（如批次/檔案處理）後。
- 結果進 report 的「非功能」段 + 趨勢(看有沒有退化)。

## 風險導向（先壓高風險點，不做整牆）
挑「並發重工」「突發暴量」「長流程」三類先壓，不必全 API 壓測。
