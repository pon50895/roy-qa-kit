# 測試報告規格（資訊 / 資料 / 結構）

## 結構（10 段）
1. Meta：專案 / 時間 / 環境+版本(前端/後台 build) / 觸發 / 範圍 / 執行人 / 工具
2. Summary 儀表板：total/pass/fail/blocked/skipped、pass率、P0/P1 open 數、與上次比、上線就緒判定
3. 覆蓋：需求覆蓋(RTM 有測/總 %)、功能矩陣、類型/維度分布
4. 逐筆結果：見下方 schema
5. 缺陷：open by severity/priority、重現、證據、RCA、age
6. 缺口/風險：未測、無法判定(需prod/新帳號)、環境 bypass 限制
7. 停止條件檢核：P0=0? P1 done? → verdict
8. 證據索引：artifact 連結
9. 趨勢/歷史：pass率走勢、flaky 清單、escape
10. 下一步行動

## 逐筆資料 schema
```json
{
  "id": "TC-xxx", "ticket": "TICKET-XXX", "title": "",
  "type_tags": ["@logic","@value"], "dim_tags": ["@live","@visual"],
  "severity": "P0|P1|P2|P3",
  "priority": { "auto": "", "final": "", "source": "auto|override", "reason": "" },
  "env": "uat|prod", "status": "passed|failed|blocked|skipped|undetermined",
  "duration_ms": 0, "evidence": ["path/x.png"], "error": "", "rca": ""
}
```

## Run 層 schema
```json
{ "project":"","ranAt":"","env":"","versions":{"web":"","admin":""},
  "trigger":"commit|deploy|ticketFix|release|prodOnly",
  "summary":{"total":0,"passed":0,"failed":0,"blocked":0,"skipped":0,"undetermined":0,
             "p0_open":0,"p1_open":0,"requirement_coverage":"x/y"},
  "release_ready": false, "items":[ /* 逐筆 */ ] }
```

## 輸出（皆從同一 run schema 產）
- **HTML**：Playwright 內建互動報告（trace/截圖/video）。
- **CSV**：逐筆資料（Excel 可開，BOM）。
- **XLSX**：results + summary 兩 sheet（管理用）。
- **Briefing**：群組精簡（templates/briefing.md）。
