#!/usr/bin/env node
// 優先度解析：自動規則 + 手動覆寫。用法: node scripts/priority.mjs items.json
// items.json: [{ id, severity:"P0..P3", blocksRelease, criticalPath, hasWorkaround, security, dataIntegrity, externalDependency, priorityOverride:{value,reason,by} }]
import fs from 'node:fs';

export function autoPriority(it){
  const s = it.severity;
  if (s==='P0' || it.security || it.dataIntegrity || (it.blocksRelease && !it.hasWorkaround)) return 'P0';
  if (s==='P1' || it.criticalPath || (s==='P0' && it.hasWorkaround)) return 'P1';
  if (s==='P2' || (it.externalDependency && !it.criticalPath)) return 'P2';
  return 'P3';
}
export function resolve(it){
  const auto = autoPriority(it);
  if (it.priorityOverride?.value){
    return { id:it.id, auto, final:it.priorityOverride.value, source:'override', reason:it.priorityOverride.reason||'' };
  }
  return { id:it.id, auto, final:auto, source:'auto', reason:'' };
}

if (process.argv[2]){
  const items = JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const out = items.map(resolve);
  console.table(out);
  fs.writeFileSync('test-results/priority.json', JSON.stringify(out,null,2));
  console.log('→ test-results/priority.json');
}
