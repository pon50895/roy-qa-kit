import fs from 'node:fs';
const J = JSON.parse(fs.readFileSync('test-results/results.json','utf8'));
const rows=[['檔案','標題','tags','狀態','耗時ms','錯誤']];
(function walk(ss){ for(const s of ss||[]){
  for(const sp of s.specs||[]) for(const t of sp.tests||[]){ const r=t.results?.[0]||{};
    rows.push([s.file||'',sp.title,(sp.title.match(/@[\w-]+/g)||[]).join(' '),r.status||t.status||'',r.duration||'',(r.error?.message||'').replace(/\n/g,' ').slice(0,120)]); }
  walk(s.suites);} })(J.suites);
fs.mkdirSync('test-results',{recursive:true});
fs.writeFileSync('test-results/results.csv','﻿'+rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n'));
console.log('→ test-results/results.csv',rows.length-1,'列');
