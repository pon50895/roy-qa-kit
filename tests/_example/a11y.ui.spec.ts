import { test, expect } from '@playwright/test';
// @a11y 無障礙：@axe-core/playwright 掃 WCAG。需 `npm i -D @axe-core/playwright`。
// import AxeBuilder from '@axe-core/playwright';
test('@a11y 頁面無重大無障礙違規（範例）', async ({ page }) => {
  // await page.goto(process.env.BASE_WEB + '/');
  // const r = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze();
  // expect(r.violations.filter(v => ['critical','serious'].includes(v.impact))).toEqual([]);
  test.skip(true, '範例：取消註解 + 裝 @axe-core/playwright 後啟用');
});
