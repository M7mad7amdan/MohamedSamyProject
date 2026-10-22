
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 25 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 75 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
],

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000'],
        checks: ['rate>0.99'],
    },
};

export default function () {
    const response = http.get(
        'http://127.0.0.1:4173/signup',
        { timeout: '10s' }
    );

    check(response, {
        'status is 200': (r) => r.status === 200,

        'response under 1s': (r) =>
            r.status === 200 &&
            r.timings.duration < 1000,
    });

    sleep(1);
}
