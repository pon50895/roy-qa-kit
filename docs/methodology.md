# 測試 SOP — 有效 Loop / 停止條件 / 框架（2026-06-28）

目的：讓測試**可重複、可留證、會自我修正**，避免「看 source / 抽樣 / 拿舊資料」造成的失準。

---

## 一、測試 Loop（每張票 7 步 + 每批 RETRO）

```
1 定義達標   AC 寫成「可觀察行為 + 正例 + 反例」，不是「程式碼有那段」
2 選乾淨料   配 fixture（未用代碼/未燒路徑A/新帳號），標新鮮度；驗修正必用修正後新建的料
3 走行為     真的跑 end-to-end / 打 API，不抽樣不讀 source
4 三層驗     code層(有沒有那段) / data層(欄位值對不對) / behavior層(跑一遍對不對) — P0/P1 三層都碰
5 反例攻擊   填錯/漏填/回退/重複/重進 → 試著弄壞它，壞不掉才算過
6 留證據     每個判定配可重現 artifact（API回應/截圖/DOM dump）
7 判定       PASS / FAIL / 無法判定（寫原因：需新帳號? 需prod?）
        ↓ 每批結束
8 RETRO     本輪哪裡差點失準? → 寫進「失準清單」當下輪 pre-flight gate
```

### Pre-flight Gate（標 PASS 前必過，源自實際失準教訓）
- [ ] 只看了 source/抽樣？→ 去走行為
- [ ] 測了反例嗎？→ 沒有不准標 PASS
- [ ] 這是修正前的舊資料/已測帳號嗎？→ 換乾淨料
- [ ] code/data/behavior 碰了幾層？
- [ ] 在 UAT 是不是被 bypass 假過（OTP/captcha/lineId）？→ 標需 prod

---

## 二、停止條件（兩層，避免無限重測）

### 單張票 — 三選一達成就停
- **PASS**：正例 + 反例都過 + 有證據 → 標達標、停。
- **FAIL**：開 bug 卡（重現步驟 + 證據 + 嚴重度）→ 停（轉 RD）。
- **無法判定**：寫清楚原因（需新帳號 / 需 prod）+ unblock 計畫 + 負責人 → 停（轉「待乾淨重驗」清單）。

> 一張票走到三者之一就**停手**，不反覆刷。

### 整輪 / Release — 收斂出 briefing 的條件
- 所有 **P0 = 0 open**（無阻擋上線）。
- 所有 **P1 = PASS 或已排修**（有卡 + 時程）。
- 每個「無法判定」都有 unblock 計畫。
- 上線前 gate（資安掃描 TICKET-XXX/161）= done 或明確展延。
- 達標率 + 未結清單可一頁交代。

> 全滿足 = 這輪測試收斂，可出 release/週報 briefing。

---

## 三、測試案例格式（固定模板）

```
TC-<票>: <一句話>
 fixture : <乾淨資料 + 新鮮度>
 環境    : UAT可驗 / 需prod / 需新帳號
 正例    : 步驟 → 預期
 反例    : 步驟 → 預期        ← 必填，沒反例不算案例
 三層    : code? data? behavior?
 證據    : <檔名>
 判定    : PASS / FAIL / 無法判定(原因)
```

案例庫見 `測試案例表_20260628.md`。

---

## 四、測試框架建議

**主框架：Playwright Test（`@playwright/test`，repo 已裝）** —— 改用「**測試執行器**」而非裸 playwright：
- **fixtures**：把 admin 登入 / 前端Web session 寫成 fixture，一次登入多測共用，不每測重登。
- **expect 斷言**：精準 PASS/FAIL，取代手眼判讀。
- **自動取證**：失敗時自動 screenshot / video / **trace**（可回放），證據免手動。
- **HTML report**：一次跑一份報告，可貼可存。
- **retries + 平行 + tag**（`@p0 @smoke`）：跑子集、抗 flaky。

**搭配：**
- Admin API → Playwright `request` fixture（同一套）。
- 報告 PDF 驗證 → pikepdf / PyMuPDF helper（驗加密/頁寬/QR），由測試呼叫。
- **半自動關卡**：captcha（人工辨識/手輸）、OTP（UAT bypass）→ 標清楚為環境限制，不能全自動。

**目錄建議**
```
e2e/
  fixtures/      登入、前端Web session、測試資料
  tests/
    admin/       *.spec.ts  (API + 後台)
    liff/        *.spec.ts  (代碼/路徑A流程)
    report/      *.spec.ts  (PDF pipeline)
  helpers/       pdf.py, evidence/
```

---

## 五、週五 Briefing 節奏
- 每週五產一份 briefing（給群組回報），格式見 `briefing_週報範本.md`。
- 來源：本 SOP 的停止條件 + `測試案例表` 判定 + 最新 Jira 看板匯出。
- 分 前端Web(7/8 必上) / Admin(可後補) / 外部依賴 / 資安 gate。
