const urls = [
    'https://corsproxy.io/?url=' + encodeURIComponent('https://www.kaggle.com/kaus98'),
    'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent('https://www.kaggle.com/kaus98')
];

(async () => {
    for (const url of urls) {
        console.log(`Testing ${url}...`);
        try {
            const res = await fetch(url);
            console.log(`Status: ${res.status}`);
            const text = await res.text();
            console.log(`Content length: ${text.length}`);
            const match = text.match(/Kaggle\.State\.push\(([\s\S]*?)\);/);
            if (match) {
                console.log("Success! Found Kaggle state data.");
            } else {
                console.log("No Kaggle state found.");
            }
        } catch (e) {
            console.error(`Failed: ${e.message}\n`);
        }
    }
})();
