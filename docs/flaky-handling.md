# Flaky 測試處理

flaky = 同碼同環境時過時不過。含人工關卡(captcha/OTP)、timing、順序相依、外部依賴的測試特別容易。

## 偵測
- 重跑確認：同測試連跑 N 次，有過有不過 = flaky。
- CI 標記：用 retry 後「retry 才過」的標 flaky。

## 處理
1. **隔離(quarantine)**：標 `@flaky`，從「綠燈 gate」剔除（不擋發布），但仍跑、仍記錄。
2. **找根因**：timing(改等待策略/避免 sleep)、順序相依(測試獨立、各自建料)、外部不穩(改 @mock)、人工關卡(標半自動、不進 CI)。
3. **修或重寫**，修好移除 @flaky。
4. **追蹤**：flaky 清單 + flaky rate 進 report，居高不下要正視（測試債）。

## 原則
- 不用「無腦 retry」蓋過 flaky（retries:0 預設）—— retry 會把真 bug 也藏掉。
- flaky 不該擋發布，但要可見、要收斂。
