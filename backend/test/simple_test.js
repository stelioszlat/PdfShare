import http from 'k6/http';

import { check, sleep } from 'k6';

export const options = {
//   iterations: 10,
//   duration: '10s',
  vus: 10,
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ], // not allowed with iterations and duration
};

export default function () {
    const res = http.get('https://quickpizza.grafana.com');
    check(res, { 'status was 200': (r) => r.status == 200 });
  
    sleep(1);
}