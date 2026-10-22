
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://127.0.0.1:4173';
const assets = JSON.parse(open('./assets.json'));

export const options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '30s', target: 25 },
        { duration: '30s', target: 50 },
        { duration: '30s', target: 100 },
        { duration: '30s', target: 0 },
    ],

    batch: 6,
    batchPerHost: 6,

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000'],
        checks: ['rate>0.99'],
    },
};

export default function () {

    // 1. Request HTML
    const page = http.get(`${BASE_URL}/signup`);

    const pageOK = check(page, {
        'HTML status is 200': r => r.status === 200,
    });

    if (!pageOK) {
        sleep(2);
        return;
    }

    // 2. Request CSS, JS, images and other captured assets
    const requests = assets.map(path => [
        'GET',
        `${BASE_URL}${path}`,
        null,
    ]);

    const responses = http.batch(requests);

    // 3. Validate all asset responses
    check(responses, {
        'All assets loaded': results =>
            results.every(r => r.status === 200),
    });

    sleep(2);
}
