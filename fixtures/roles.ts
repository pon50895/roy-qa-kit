import { request, APIRequestContext } from '@playwright/test';
// 多角色 token：.env 放各角色 token（TOKEN_admin / TOKEN_viewer …），由 login 腳本各自取得。
export async function ctxFor(role: string): Promise<APIRequestContext> {
  const token = role === 'anonymous' ? '' : process.env[`TOKEN_${role}`];
  return request.newContext({
    baseURL: process.env.BASE_API,
    extraHTTPHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
