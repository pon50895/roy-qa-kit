// k6 負載/壓力範例：ramp VU + SLA 門檻。執行: k6 run perf/load-test.example.js
// 安裝: brew install k6  /  https://k6.io
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    load:  { executor:'ramping-vus', startVUs:0, stages:[
      {duration:'30s',target:20},{duration:'1m',target:20},{duration:'30s',target:0}] },
    // spike: { executor:'ramping-vus', startVUs:0, stages:[{duration:'10s',target:100},{duration:'30s',target:100},{duration:'10s',target:0}] },
  },
  thresholds: {                       // SLA：超標 k6 退非 0 → CI fail
    http_req_duration: ['p(95)<800'], // p95 < 800ms
    http_req_failed:   ['rate<0.01'], // 錯誤率 < 1%
  },
};
const BASE = __ENV.BASE_API || 'https://api.example.com';
export default function () {
  const r = http.get(`${BASE}/api/resource`);
  check(r, { 'status 2xx': (x)=> x.status>=200 && x.status<300 });
}
