#!/usr/bin/env node
// 跑測試前的環境健康檢查：站點活著? token 有效? 版本對? 不過就別跑測試(省得測一半發現 401)。
import 'dotenv/config';
let bad = 0;
async function ping(name, url){
  if(!url){ console.log(`- ${name}: (未設)`); return; }
  try { const r = await fetch(url); console.log(`${r.ok?'✅':'✗'} ${name} ${r.status} ${url}`); if(!r.ok) bad++; }
  catch(e){ console.error(`✗ ${name} 連不上 ${url}: ${e.message}`); bad++; }
}
await ping('API', process.env.BASE_API);
await ping('WEB', process.env.BASE_WEB);
// token 有效性（若有）
if (process.env.API_TOKEN){
  try {
    const r = await fetch(`${process.env.BASE_API}/api/health`, { headers:{ Authorization:`Bearer ${process.env.API_TOKEN}` }});
    console.log(`${r.status===401?'✗':'✅'} token ${r.status===401?'已過期，請 npm run login':'有效'}`);
    if(r.status===401) bad++;
  } catch {}
}
process.exit(bad ? 1 : 0);
