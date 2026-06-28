# Agent 層通用能力（搭配本框架）

非測試「技術」，是 agent/工具層的能力，補框架的洞。

1. **持久記憶（file memory）**：跨 session 存 測試慣例 / fixture 新鮮度 / 環境限制 / 已驗判定 / 決策。避免重問、重驗、判斷飄移。
2. **Code intelligence MCP（codegraph / codebase-memory）**：**有原碼時** 自動建符號知識圖 → 抓端點/頁面/呼叫者/影響面 → 直接生「功能矩陣」+ 支援 white-box（statement/branch、改 X 影響什麼）。補「程式有哪些」與 white-box 兩個洞；無原碼則退回黑箱偵察(techniques #1)。
3. **Skill 化**：把本框架方法(SOP/taxonomy/gate/templates)包成可呼叫 skill，agent 隨時載入、按 SOP 走。
4. **Subagent / workflow（可選）**：大量票/功能要平行驗時，fan-out 平行跑 + 收斂。

## 對應
- code 層 / 功能矩陣 → codegraph MCP（有原碼）或黑箱偵察（無）。
- 跨 session 一致 → 記憶。
- 方法即時可用 → skill。
