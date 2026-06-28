# 資安測試（OWASP 對照）

三層：**自動化檢查(本框架)** + **工具掃描(ZAP/SAST/SCA)** + **人工滲透(上線前)**。

## OWASP 類別 → 測什麼 / 怎麼測
| OWASP 類別 | 測什麼 | 方法 / 工具 |
|---|---|---|
| Broken Access Control | 越權/IDOR/強制瀏覽 | `permission-testing.md`（直打 API） |
| Cryptographic Failures | 敏感資料明碼、PII 外洩、TLS、加密落地 | 回應/錯誤不洩 PII、http→https、檔案加密驗 |
| Injection (SQLi/XSS/cmd) | 惡意輸入被反射/執行 | payload 注入 → 不反射原文、不 500 |
| Security Misconfiguration | 安全標頭、CORS、預設帳密、verbose error | header 檢查、錯誤訊息不洩堆疊 |
| Identification/Auth Failures | 弱密碼、session、暴力破解 | rate limit(429)、token 處理 |
| Vulnerable Components | 套件漏洞 | SCA：`npm audit` / Snyk / Dependabot |
| SSRF / CSRF | 偽造請求 | 視應用補 |
| Security Logging | 日誌/告警 | 監控（shift-right，見 blindspots） |
| Secrets Exposure | repo / client bundle / 回應含金鑰 | `scripts/scan.mjs`(repo) + bundle 掃 |

## 自動化檢查（本框架可跑，見 tests/_example/security.api.spec.ts）
- **安全標頭**：CSP / X-Content-Type-Options / X-Frame-Options(或 frame-ancestors) / HSTS / Referrer-Policy。
- **TLS 強制**：`http://` 應導向 `https://`。
- **Rate limit**：短時間連打 → 期望出現 429。
- **Injection smoke**：送 XSS/SQLi payload → 回應不原樣反射、不 500。
- **敏感資料**：回應/錯誤不含堆疊、金鑰、未隱碼 PII。
- **Client bundle**：抓前端 JS → 不含 token/secret（reuse scan patterns）。

## 工具整合（外部 gate，非 Playwright）
- **DAST**：OWASP ZAP（baseline/full scan）→ 上線前 gate。
- **SAST**：semgrep / SonarQube（原碼掃）。
- **SCA**：`npm audit` / Snyk（相依套件）。
- 整合點：`scripts/security-scan.mjs`（串 npm audit + header 檢查 + ZAP hook）。

## 嚴重度
資安問題 → priority rule 的 `security` 旗標命中 → **P0**。越權/PII 外洩/可注入屬 P0。
