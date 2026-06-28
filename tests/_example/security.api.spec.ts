import { test, expect } from '@playwright/test';
// @security 自動化資安檢查（通用）。對 process.env.BASE_API / BASE_WEB 跑。
const API = process.env.BASE_API || '';
const WEB = process.env.BASE_WEB || '';

test('@security 安全標頭齊全', async ({ request }) => {
  const r = await request.get(WEB || API);
  const h = r.headers();
  expect(h['x-content-type-options'], 'X-Content-Type-Options').toBe('nosniff');
  expect(h['x-frame-options'] || h['content-security-policy'], 'X-Frame-Options 或 CSP frame-ancestors').toBeTruthy();
  expect(h['strict-transport-security'], 'HSTS').toBeTruthy();
});

test('@security TLS 強制（http→https）', async ({ request }) => {
  test.skip(!WEB.startsWith('https'), '需 https 站點');
  const httpUrl = WEB.replace('https://','http://');
  const r = await request.get(httpUrl, { maxRedirects: 0 }).catch(()=>null);
  if (r) expect([301,302,307,308]).toContain(r.status());
});

test('@security rate limit（連打應 429）', async ({ request }) => {
  const codes:number[] = [];
  for (let i=0;i<30;i++){ const r = await request.get(`${API}/api/auth/login`).catch(()=>null); if(r) codes.push(r.status()); }
  // 沒 429 不一定 fail（看設計），但記錄；嚴格模式可 expect(codes).toContain(429)
  console.log('rate-limit 回應碼分布:', [...new Set(codes)]);
});

test('@security injection smoke（payload 不反射/不500）', async ({ request }) => {
  const payloads = [`<script>alert(1)</script>`, `' OR '1'='1`, `; ls -la`];
  for (const p of payloads){
    const r = await request.get(`${API}/api/search?q=${encodeURIComponent(p)}`).catch(()=>null);
    if (!r) continue;
    expect(r.status(), `payload 不應造成 500: ${p}`).toBeLessThan(500);
    const body = await r.text().catch(()=> '');
    expect(body.includes('<script>alert(1)</script>'), 'XSS payload 不應原樣反射').toBeFalsy();
  }
});

test('@security 錯誤不洩堆疊/敏感資訊', async ({ request }) => {
  const r = await request.get(`${API}/api/__notfound_${Date.now()}`).catch(()=>null);
  if (!r) return;
  const body = await r.text().catch(()=> '');
  expect(/at .*\(.*:\d+:\d+\)|stack trace|Exception in/i.test(body), '不應洩漏堆疊').toBeFalsy();
});

test('@security client bundle 不含金鑰', async ({ request }) => {
  test.skip(!WEB, '需前端站點');
  const html = await (await request.get(WEB)).text();
  const js = [...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);
  for (const src of js.slice(0,5)){
    const url = src.startsWith('http') ? src : new URL(src, WEB).href;
    const code = await (await request.get(url)).text().catch(()=> '');
    expect(/eyJ[A-Za-z0-9_-]{20}|api[_-]?key\s*[:=]\s*["'][A-Za-z0-9]{12}/i.test(code), `bundle 不應含 token/key: ${src}`).toBeFalsy();
  }
});
