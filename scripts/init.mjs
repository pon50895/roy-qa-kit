#!/usr/bin/env node
// init：吃 (1) Jira 看板匯出 CSV → 生追蹤矩陣 RTM 骨架；(2) 功能清單 JSON → 生功能矩陣骨架。
// 用法: node scripts/init.mjs <jira_board.csv> [features.json]
import fs from 'node:fs';

const csvPath = process.argv[2];
const featPath = process.argv[3];

function parseCSV(text){            // 簡易 CSV（處理引號/換行）
  const rows=[]; let row=[], cur='', q=false;
  for(let i=0;i<text.length;i++){ const c=text[i];
    if(q){ if(c==='"'){ if(text[i+1]==='"'){cur+='"';i++} else q=false } else cur+=c }
    else { if(c==='"')q=true; else if(c===',') {row.push(cur);cur=''} 
           else if(c==='\n'){row.push(cur);rows.push(row);row=[];cur=''} 
           else if(c!=='\r') cur+=c } }
  if(cur||row.length){row.push(cur);rows.push(row)}
  return rows;
}

if(csvPath && fs.existsSync(csvPath)){
  const rows=parseCSV(fs.readFileSync(csvPath,'utf8'));
  const head=rows[0].map(h=>h.replace(/^﻿/,'').replace(/"/g,''));
  const idx=n=>head.findIndex(h=>h.includes(n));
  const cK=idx('索引鍵')>=0?idx('索引鍵'):idx('Key');
  const cS=idx('摘要')>=0?idx('摘要'):idx('Summary');
  const cSt=idx('狀態')>=0?idx('狀態'):idx('Status');
  let md='# 追蹤矩陣 RTM（init 生成，待填 TC/證據）\n\n圖例：✅PASS ❌FAIL ⚠️無法判定 🔵環境擋 ⬜未測\n\n| 票 | 摘要 | board狀態 | 對應TC | tag | 測試狀態 | 證據 |\n|---|---|---|---|---|---|---|\n';
  let n=0;
  for(const r of rows.slice(1)){ if(!r[cK]) continue;
    md+=`| ${r[cK]} | ${(r[cS]||'').slice(0,40)} | ${r[cSt]||''} | | | ⬜ | |\n`; n++; }
  fs.mkdirSync('docs',{recursive:true});
  fs.writeFileSync('docs/traceability-matrix.md', md);
  console.log(`→ docs/traceability-matrix.md（${n} 張票）`);
} else console.log('（未給 Jira CSV，跳過 RTM 生成）');

if(featPath && fs.existsSync(featPath)){
  const feats=JSON.parse(fs.readFileSync(featPath,'utf8'));  // ["功能A","功能B",...]
  const types=['@type','@value/@edge','@logic','@file','@sanity','@integration'];
  let md='# 功能矩陣（init 生成，打格 ✅/⬜/➖/⚠️）\n\n| 功能 | '+types.join(' | ')+' |\n|---|'+types.map(()=>'---').join('|')+'|\n';
  for(const f of feats) md+=`| ${f} | `+types.map(()=>'⬜').join(' | ')+' |\n';
  md+='\n## 維度\n| 功能 | @auth | @visual | @mock | @live |\n|---|---|---|---|---|\n';
  for(const f of feats) md+=`| ${f} | ⬜ | ⬜ | ⬜ | ⬜ |\n`;
  fs.writeFileSync('docs/feature-matrix.md', md);
  console.log(`→ docs/feature-matrix.md（${feats.length} 功能）`);
} else console.log('（未給 features.json，跳過功能矩陣生成）');
