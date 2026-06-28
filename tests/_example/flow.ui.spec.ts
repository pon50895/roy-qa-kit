import { test, expect } from '@playwright/test';
import { otpBypass } from '../../fixtures/env';
// 示範：@visual(三viewport由 config projects 跑)、@logic、@mock、環境 gate
test('@logic @mock 表單漏一欄 → 送出鈕鎖住', async ({ page }) => {
  await page.route('**/api/**', r => r.fulfill({ json:{ ok:true } })); // @mock 外部
  // await page.goto(process.env.BASE_WEB+'/form'); 填 N-1 欄 → expect 鈕 disabled
});
test('@live @logic OTP 錯誤訊息', async () => {
  test.skip(otpBypass, 'OTP 被 bypass，此測需真 OTP 環境(prod)');
  // 真 OTP 輸錯 → expect 顯示對應中文錯誤
});
