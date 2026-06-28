import { test as base, request, APIRequestContext } from '@playwright/test';
// 通用 API 認證 fixture：token 來自 .env（若有 captcha 由 npm run login 取得）
export const test = base.extend<{ api: APIRequestContext, anon: APIRequestContext }>({
  api: async ({}, use) => {
    const token = process.env.API_TOKEN;
    if (!token) throw new Error('缺 API_TOKEN，請先 npm run login');
    const ctx = await request.newContext({ baseURL: process.env.BASE_API,
      extraHTTPHeaders: { Authorization: `Bearer ${token}` } });
    await use(ctx); await ctx.dispose();
  },
  anon: async ({}, use) => {   // 未登入 context（@auth 反例用）
    const ctx = await request.newContext({ baseURL: process.env.BASE_API });
    await use(ctx); await ctx.dispose();
  },
});
export const expect = test.expect;
