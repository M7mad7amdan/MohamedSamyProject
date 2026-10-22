
const fs = require('node:fs');

const har = JSON.parse(
    fs.readFileSync('tests/signup.har', 'utf8')
);

const entries = har.log?.entries || [];

const assets = [...new Set(
    entries
        .filter(entry => {
            const request = entry.request;
            const url = new URL(request.url);

            const isLocal =
                ['localhost', '127.0.0.1'].includes(url.hostname);

            const isAsset =
                /\.(js|css|webp|png|jpg|jpeg|svg|woff2?|ico)(\?.*)?$/i
                    .test(url.pathname + url.search);

            return (
                request.method === 'GET' &&
                isLocal &&
                isAsset &&
                entry.response.status >= 200 &&
                entry.response.status < 400
            );
        })
        .map(entry => {
            const url = new URL(entry.request.url);
            return url.pathname + url.search;
        })
)];

fs.writeFileSync(
    'tests/assets.json',
    JSON.stringify(assets, null, 2)
);

console.log('Total HAR requests:', entries.length);
console.log('Found assets:', assets.length);
console.log(assets);
