# 權限 / 授權測試框架（RBAC + 越權）

核心原則：**授權在後端強制，不是 UI 隱藏**。所有權限測試**直打 API**（繞過前端），確認後端真的擋。

## 1. 權限矩陣（單一真相）
角色 × 資源 × 動作 → 允許/拒絕。資料驅動測試的來源。
```
roles:     [admin, manager, operator, viewer, anonymous]
resources: [orders, reports, members, settings, ...]
actions:   [read, create, update, delete, export]
matrix[role][resource.action] = allow | deny
```
見 `docs/templates/permission-matrix.json`。

## 2. 必測的授權攻擊面
| 類型 | 測什麼 | 預期 |
|---|---|---|
| **未認證** | 無 token 打受保護端點 | 401 |
| **垂直越權** | 低權角色打高權動作（如 viewer 刪除） | 403 |
| **水平越權 / IDOR** | A 的 token 存取 B 的資源（換 id） | 403/404，不可讀到別人 |
| **Token 竄改/過期** | 改 payload / 過期 / 別角色 token | 拒 |
| **強制瀏覽** | 直打 API 繞過 UI 隱藏 | 後端仍擋 |
| **權限提升** | 改自己角色/權限欄位 | 拒 |

## 3. 資料驅動做法
- 一張矩陣 → 自動展開「每個 (角色 × 端點)」一個測試：
  - allow 格 → 該角色登入後打 → 期望 2xx。
  - deny 格 → 期望 403/401。
- IDOR：兩個同階使用者，A 的 token 取 B 的資源 id → 期望擋。
- 見 `tests/_example/permission.api.spec.ts`。

## 4. 與其他的關係
- 屬 `@auth` + `@integration` + 負向/資安。
- 結果進 RTM（每個權限規則 = 一條可追蹤）+ report 的缺陷/風險段。
- 嚴重度通常 **P0**（越權 = 資安），priority rule 的 `security` 旗標命中即 P0。

## 5. 反模式提醒
- 只測「有權限的能進」→ 漏了「沒權限的被擋」（最重要的那半）。
- 只看 UI 按鈕有沒有藏 → 後端沒擋等於沒擋（必直打 API）。
