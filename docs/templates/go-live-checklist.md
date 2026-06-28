# 上線 Go-Live 檢核表（獨立於測試停止條件）

上 prod 前逐項打勾。**重點：把測試環境的 bypass 全關掉。**

## 安全 / bypass 移除（最容易漏、最致命）
- [ ] OTP bypass 關閉（prod 用真 OTP）
- [ ] captcha 啟用
- [ ] 測試用登入 bypass（如 lineId 直登）關閉，走真實認證
- [ ] 測試後門 / debug 端點移除
- [ ] 預設帳密改掉、測試帳號停用

## 設定 / 機密
- [ ] 正式域名 + 憑證(TLS)生效；URL 全切正式
- [ ] 機密走環境變數/Vault，不在 repo/log/明碼
- [ ] CORS / 安全標頭 設定到位
- [ ] 第三方串接切正式金鑰/端點

## 資料
- [ ] 測試資料清除（測試訂單/帳號/檔案）
- [ ] 正式資料 migration 套用且驗證
- [ ] 備份 / 保留政策到位

## 韌性 / 監控
- [ ] 退場機制（rollback）就緒；若無 → 明確記錄並加強 prod 監控
- [ ] prod 監控 + 告警上線（見 prod-monitoring.md）
- [ ] 上線後 smoke（關鍵路徑）排好

## 驗證
- [ ] 停止條件達標（P0=0、P1 清）
- [ ] 資安掃描(DAST/SAST/SCA)無 high/critical
- [ ] prod-only 測試（需真環境的）跑過
