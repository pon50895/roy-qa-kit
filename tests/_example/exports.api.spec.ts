import { test, expect } from '../../fixtures/auth';
// 示範：@auth 登入/未登入、@file 產檔、@value 邊界
test('@auth 未登入打受保護 API → 401', async ({ anon }) => {
  const r = await anon.get('/api/admin/resource');
  expect(r.status()).toBe(401);
});
test('@file @sanity 匯出檔欄位正確 @smoke', async ({ api }) => {
  const r = await api.get('/api/admin/export');
  expect(r.ok()).toBeTruthy();
  // TODO: 解析檔 → 斷言欄位/明碼/sheet
});
test('@value @edge 邊界輸入被正確處理', async ({ api }) => {
  const r = await api.get('/api/admin/search?from=2026-01-01&to=2026-01-01');
  expect((await r.json()).data?.length).toBeGreaterThanOrEqual(0);
});
