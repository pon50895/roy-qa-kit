import { test, expect } from '@playwright/test';
import { ctxFor } from '../../fixtures/roles';
import matrix from '../../docs/templates/permission-matrix.json' assert { type: 'json' };
// @auth @integration RBAC：矩陣展開「每個 角色 × 端點」→ allow 期望 2xx、deny 期望 401/403。
for (const ep of matrix.endpoints) {
  for (const role of matrix.roles) {
    const allowed = ep.allow.includes(role);
    test(`@auth ${role} ${allowed?'可':'不可'} ${ep.name} [${ep.method} ${ep.path}]`, async () => {
      const api = await ctxFor(role);
      const path = ep.path.replace('{id}','1');
      const r = await api.fetch(path, { method: ep.method });
      if (allowed) expect(r.status(), `${role} 應可 ${ep.name}`).toBeLessThan(400);
      else expect([401,403], `${role} 應被擋`).toContain(r.status());
      await api.dispose();
    });
  }
}
// IDOR（水平越權）：A 的 token 取 B 的資源 → 應擋
test('@auth IDOR：他人資源不可讀', async () => {
  const api = await ctxFor('operator');     // 一般使用者 A
  const r = await api.get('/api/resource/999');  // 假設 999 屬於別人
  expect([403,404]).toContain(r.status());
  await api.dispose();
});
