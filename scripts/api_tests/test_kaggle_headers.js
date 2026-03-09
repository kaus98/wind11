(async () => {
    try {
        const res = await fetch('https://www.kaggle.com/kaus98', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Length: ${text.length}`);
        if (text.includes('Kaggle.State.push')) {
            console.log('Success, found Kaggle state!');
        } else {
            console.log('No state found. Snippet:', text.substring(0, 50));
        }
    } catch (e) {
        console.error(e);
    }
})();
