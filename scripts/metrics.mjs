#!/usr/bin/env node
// 從 test-results/results.json 算指標：pass率 / 各狀態 / flaky(retry才過) / tag 分布。
import fs from 'node:fs';
const J = JSON.parse(fs.readFileSync('test-results/results.json','utf8'));
const m = { total:0, passed:0, failed:0, skipped:0, flaky:0, byTag:{} };
(function walk(ss){ for(const s of ss||[]){
  for(const sp of s.specs||[]) for(const t of sp.tests||[]){
    m.total++; const st=t.status||t.results?.[0]?.status;
    if(t.results?.length>1 && t.results.at(-1).status==='passed') m.flaky++;
    if(st==='passed')m.passed++; else if(st==='skipped')m.skipped++; else m.failed++;
    for(const tag of (sp.title.match(/@[\w-]+/g)||[])) m.byTag[tag]=(m.byTag[tag]||0)+1;
  } walk(s.suites);} })(J.suites);
m.passRate = m.total? (m.passed/m.total*100).toFixed(1)+'%' : '-';
m.flakyRate = m.total? (m.flaky/m.total*100).toFixed(1)+'%' : '-';
console.log(JSON.stringify(m,null,2));
fs.writeFileSync('test-results/metrics.json', JSON.stringify(m,null,2));
