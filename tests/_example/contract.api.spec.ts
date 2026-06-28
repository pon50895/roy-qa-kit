import { test, expect } from '../../fixtures/auth';
// @contract 外部/內部 API 契約測試：欄位、型別、狀態碼穩定 → 契約一變即紅燈。
// 用法：把「對方承諾的回應形狀」寫成 schema，每次驗。比 E2E 早抓、不燒測試料。
const contract = {                       // ← 契約：外部 API 應回的形狀（範例）
  required: ['id', 'status', 'data'],
  types:   { id: 'string', status: 'string' },
  allowedStatus: ['OK', 'ERROR'],
};
test('@contract 回應符合約定 schema', async ({ api }) => {
  const r = await api.get('/api/contract/sample');
  expect(r.ok()).toBeTruthy();
  const j = await r.json();
  for (const k of contract.required) expect(j).toHaveProperty(k);
  for (const [k, t] of Object.entries(contract.types)) expect(typeof j[k]).toBe(t);
  expect(contract.allowedStatus).toContain(j.status);
});
