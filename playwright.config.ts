import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
const ENV = process.env.ENV || 'uat';
dotenv.config({ path: `.env.${ENV}` });
dotenv.config();   // fallback .env

const VP = { mobile:{width:390,height:844}, ipad:{width:820,height:1180}, pc:{width:1280,height:800} };

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,                       // 含人工關卡，先不重試避免假象
  reporter: [['html',{open:'never'}], ['list'], ['json',{outputFile:'test-results/results.json'}]],
  use: { screenshot:'only-on-failure', trace:'on-first-retry', video:'retain-on-failure', ignoreHTTPSErrors:true },
  projects: [
    { name:'api',  testMatch:/.*\.api\.spec\.ts/ },
    { name:'mobile', testMatch:/.*\.ui\.spec\.ts/, use:{ viewport:VP.mobile } },
    { name:'ipad',   testMatch:/.*\.ui\.spec\.ts/, use:{ viewport:VP.ipad } },
    { name:'pc',     testMatch:/.*\.ui\.spec\.ts/, use:{ viewport:VP.pc } },
  ],
});
