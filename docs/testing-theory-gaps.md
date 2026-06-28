# 對照 ISTQB / 業界 — 我們有的 vs 缺的（補強路線）

## 測試設計技術（ISTQB CTFL Ch.4）
| 技術 | 我們 | 補 |
|---|---|---|
| equivalence partitioning | @value | |
| boundary value analysis | @edge | |
| state transition | @logic(狀態) | |
| decision table | ⬜ | ★ 多條件組合(保單/序號×年齡×本人/法代→OTP對象) |
| pairwise/combinatorial | ⬜ | viewport×env×path 減量 |
| use case | @integration | |
| experience-based(error guessing/探索) | ⬜ | charter-based exploratory，補盲區 |
| white-box(statement/branch) | ➖ | 無原碼，請 RD 自測 |

## 測試層級 / 金字塔
現況：**全 E2E（ice-cream-cone 反模式）**。
- ★ **Contract testing**：外部 API 的 AES+狀態碼+欄位契約 → 契約變即抓。最高 ROI。
- unit/component：無原碼，RD 補。
- 邏輯下推到 @mock（已在做）。

## 品質特性（ISO 25010）— 目前幾乎只 functional
缺：performance/load(k6/JMeter)、accessibility(axe)、compatibility(跨瀏覽器/裝置)、reliability(錯誤恢復/重試)、usability。security 已有(ZAP=160/SAST=161)。

## 流程 / 管理
有：entry/exit(停止條件)、risk-based(severity/priority)、test data mgmt(fixtures)、requirements coverage(RTM)。
缺：defect lifecycle + RCA 根因 + 指標(defect density / escape rate / flaky 率)、test management 整合(Jira Xray/Zephyr)、trend/歷史。

## 工具補強
contract: Pact / schema 驗 ‖ mock: MSW / Playwright route ‖ perf: k6 ‖ a11y: @axe-core/playwright ‖ visual: Playwright snapshot ‖ BDD(可選): Gherkin。

## 本專案優先序
1) Contract test 外部 API  2) 決策表(OTP對象/狀態)  3) a11y(axe)  4) defect 指標+RCA 模板  5) 金字塔下推 @mock。
