const urls = [
    'https://kaggle-rest-api.vercel.app/api?username=kaus98',
    'https://kaggle-readme-stats.vercel.app/api?username=kaus98',
    'https://kaggle-api.vercel.app/api?username=kaus98'
];

(async () => {
    for (const url of urls) {
        console.log(`Testing ${url}...`);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            console.log(`Status: ${res.status}`);
            const text = await res.text();
            console.log(`Content length: ${text.length}`);
            console.log(`Snippet: ${text.substring(0, 100)}\n`);
        } catch (e) {
            console.error(`Failed: ${e.message}\n`);
        }
    }
})();
