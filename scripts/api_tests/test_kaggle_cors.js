(async () => {
    try {
        const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.kaggle.com/kaus98'));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const html = data.contents;

        // Search for Kaggle's embedded JSON payload (usually window.Kaggle.State)
        const match = html.match(/Kaggle\.State\.push\(({.*?})\);/s);
        if (match) {
            console.log("Found Kaggle State!");
            // We won't parse the whole thing here, just verifying we get HTML instead of 403.
        } else {
            console.log("Got HTML, but couldn't find Kaggle.State push. Snippet:");
            console.log(html.substring(0, 500));
        }
    } catch (e) {
        console.error('Fetch failed:', e);
    }
})();
