#!/usr/bin/env node
// 去識別/機密 gate：掃到就 exit 1（pre-commit / CI 用）。可在 qa.config.scanPatterns 擴充。
import { execSync } from 'node:child_process';
const PATTERNS = [
  // 通用機密
  'eyJ[A-Za-z0-9_-]{10}',                 // JWT
  '(secret|password|passwd|api[_-]?key|token)\\s*[:=]\\s*["\']?[A-Za-z0-9+/]{8}',
  'AKIA[0-9A-Z]{16}',                     // AWS
  'Bearer\\s+[A-Za-z0-9._-]{20}',
  '-----BEGIN [A-Z ]*PRIVATE KEY-----',
  // PII（依專案在 qa.config 擴充）
  '\\b[A-Z][0-9]{9}\\b',                  // 身分證類 ID
  // 專案識別詞（範例占位，套用時於 qa.config.scanWords 填入專案名/代號）
];
let words = [];
try { words = (await import('../qa.config.json',{assert:{type:'json'}})).default.scanWords || []; } catch {}
const all = PATTERNS.concat(words.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
const files = execSync('git ls-files', {encoding:'utf8'}).split('\n').filter(f=>f && !f.endsWith('.example') && f!=='scripts/scan.mjs');
let hits=0;
for (const f of files){
  let txt=''; try{ txt=execSync(`cat "${f}"`,{encoding:'utf8'}); }catch{ continue; }
  for (const p of all){ const re=new RegExp(p,'g'); const m=txt.match(re);
    if (m){ hits+=m.length; console.error(`✗ ${f}: ${[...new Set(m)].slice(0,3).join(', ')}`); } }
}
if (hits){ console.error(`\n機密/識別詞掃描失敗：${hits} 處。移除後再 commit。`); process.exit(1); }
console.log('✅ scan 通過：無機密/PII/識別詞');
