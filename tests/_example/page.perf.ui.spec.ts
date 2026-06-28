import { test, expect } from '@playwright/test';
// @perf 前端效能：載入時間 + 資源大小 + Web Vitals（通用）。對 BASE_WEB。
const WEB = process.env.BASE_WEB || '';
const BUDGET = { loadMs: 4000, jsBytes: 1_500_000, lcpMs: 2500 };

test('@perf 首頁載入符合預算', async ({ page }) => {
  test.skip(!WEB, '需前端站點');
  const t0 = Date.now();
  await page.goto(WEB, { waitUntil: 'load' });
  expect(Date.now()-t0, '載入時間').toBeLessThan(BUDGET.loadMs);
  // 資源(JS)大小
  const jsBytes = await page.evaluate(() =>
    performance.getEntriesByType('resource')
      .filter((r:any)=>r.name.endsWith('.js'))
      .reduce((s:number,r:any)=>s+(r.transferSize||0),0));
  expect(jsBytes, 'JS bytes').toBeLessThan(BUDGET.jsBytes);
  // LCP（簡化）
  const lcp = await page.evaluate(() => new Promise<number>(res=>{
    new PerformanceObserver(l=>{ const e=l.getEntries(); res((e[e.length-1] as any).startTime); })
      .observe({type:'largest-contentful-paint',buffered:true}); setTimeout(()=>res(0),3000);
  }));
  if (lcp) expect(lcp, 'LCP').toBeLessThan(BUDGET.lcpMs);
});
