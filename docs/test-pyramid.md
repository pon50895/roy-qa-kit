# 測試金字塔（避免 ice-cream-cone 反模式）

由下而上、數量遞減、速度遞減：
```
        /\      E2E（少、慢、貴）— 關鍵路徑、跨端整合
       /--\     整合 / API / Contract（中）— 模組間、外部契約
      /----\    Component / Mock（多、快）— UI/邏輯隔離測
     /------\   Unit（最多、最快）— 純函式/邏輯（需原碼）
```
原則：
- 邏輯/邊界盡量下推到 @mock/unit（快、穩、不燒料）。
- E2E 只留「真的要跨端/跨系統」的關鍵路徑。
- 無原碼時 unit 由開發補；QA 主力在 @mock(component) + contract + 少量 E2E。
