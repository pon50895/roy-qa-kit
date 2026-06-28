#!/usr/bin/env node
// 外部資安 gate：SCA(npm audit) + 安全標頭快檢 + ZAP hook。上線前跑。
import { execSync } from 'node:child_process';
import 'dotenv/config';
let fail = 0;

console.log('== SCA: npm audit ==');
try { execSync('npm audit --audit-level=high', { stdio:'inherit' }); }
catch { console.error('✗ 有 high/critical 套件漏洞'); fail++; }

console.log('\n== 安全標頭快檢 ==');
const url = process.env.BASE_WEB || process.env.BASE_API;
if (url){
  try {
    const res = await fetch(url);
    const need = ['x-content-type-options','strict-transport-security'];
    for (const h of need) if (!res.headers.get(h)){ console.error(`✗ 缺標頭 ${h}`); fail++; }
    if (!res.headers.get('x-frame-options') && !(res.headers.get('content-security-policy')||'').includes('frame-ancestors'))
      { console.error('✗ 缺 X-Frame-Options / CSP frame-ancestors'); fail++; }
    if (!fail) console.log('✅ 標頭 OK');
  } catch(e){ console.error('標頭檢查失敗:', e.message); }
}

console.log('\n== DAST: OWASP ZAP (hook) ==');
console.log('  範例: docker run -t zaproxy/zap-stable zap-baseline.py -t', url||'<URL>');
console.log('  (CI 串 ZAP baseline，high alert 即 fail)');

process.exit(fail ? 1 : 0);
