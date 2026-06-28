# 測試執行策略（要測哪些 / 怎麼測 / 哪一次測）

把「分類 × 維度 × 矩陣 × 環境」串成可執行的計畫。三個問題分開答。

---

## 一、要測哪些（selection）— 由「觸發 + RTM狀態 + 風險」決定，不是每次全跑

選擇來源（疊加）：
1. **RTM 狀態**：非 ✅ 的(❌/⚠️/🔵/⬜) 一定在清單。
2. **改了什麼**：RD 動了哪張票/哪塊 → 跑那票 TC + 該功能回歸（feature-matrix 那列）。
3. **風險**：P0/P1 必跑；P2/P3 排程或變動才跑。
4. **tag 篩**：`--grep @p0`、`--grep @file`、`--grep @live`。

> 原則：**變動驅動 + 風險驅動**。沒變的綠燈不必每次重跑（但 release 前全跑一次）。

---

## 二、怎麼測（method）— 類型給方法，環境決定能不能跑

- **方法**：每個 @type/@value/@logic/@file/@sanity/@integration 在 `test-taxonomy.md` 有對應做法；正例 + 反例。
- **環境決定 how**：
  - `@mock`：任意環境、快、無外部依賴 → 大量跑邏輯/UI/邊界。
  - `@live`：只在「有真後端」的環境跑，受該環境限制（UAT bypass、prod 真 OTP、WAF、會燒料）→ 少量精測串接。
  - **env-gate**：跑不到的自動跳，但**寫原因**（不靜默）：
    ```ts
    test.skip(isUAT, 'UAT bypass OTP，185 需 prod 真 OTP');
    test.skip(isProd && !creds, 'prod 帳密未配');
    ```
- **料的新鮮度**：驗修正用未用/新建的 fixture（fixtures.md），驗完標記。

---

## 三、哪一次測（when）— 觸發 → 套件 → 環境

| 觸發時機 | 測什麼（套件） | 環境 | 性質 |
|---|---|---|---|
| **每次 commit / CI** | `@mock` 全部 | 任意（無需後端）| 快、回歸、防退化 |
| **每次部署後** | smoke（關鍵路徑：登入/路徑B/報告上傳）| 該部署 env | `@live` 少量、冒煙 |
| **RD 修一張票 → 審核中** | 該票 TC + 該功能回歸列 | UAT | `@mock`大量 + `@live`少量 |
| **前端Web 前端改動** | `@visual` 三 viewport(mobile/ipad/pc) | UAT | snapshot 比對 |
| **release / 7-8 前 / 每週五** | **全 TC**（所有類型×維度）| UAT（+ prod-only gate 項）| 完整回歸 → 出 briefing |
| **上 prod 後** | `🔵prod-only`（185 真OTP、254 限LINE）| **prod** | `@live` 跑一次 |
| **資安週期** | OWASP ZAP(160)/原碼掃(161) | UAT/prod | 上線前 gate |

指令對照：
```bash
ENV=uat  npm run test:p0          # 風險篩
ENV=uat  playwright test --grep @mock     # CI 快跑
ENV=uat  playwright test tests/liff       # 改 前端Web 跑這塊
ENV=prod playwright test --grep @prod-only  # 上 prod 後
npm test && npm run export        # 全跑 → HTML + CSV + XLSX
```

---

## 串起來：一次「環境測試」怎麼決定
1. **選環境**：`ENV=uat`（或 prod）→ 載 `.env.uat`，URL/帳密/bypass 旗標到位。
2. **選範圍**：看觸發（部署？改票？release？）→ 對 RTM 撈該跑的 TC（tag + 狀態）。
3. **跑**：能在此環境跑的(@mock 全可、@live 看後端、prod-only 自動跳並記原因)。
4. **出報告**：HTML + CSV + XLSX；更新 RTM 狀態 + 證據檔。
5. **缺口**：跑不到的(⚠️需新帳號/🔵需prod) → 進「待乾淨重驗」清單，不當綠燈。

> 一句話：**環境(ENV)決定「能測什麼」，觸發決定「該測什麼」，RTM+tag 決定「具體哪些」，taxonomy 決定「怎麼測」。**
