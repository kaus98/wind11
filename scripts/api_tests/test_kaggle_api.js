(async () => {
    try {
        const res = await fetch('https://www.kaggle.com/api/v1/users/kaus98');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log(data);
    } catch (e) {
        console.error('Fetch failed:', e);
    }
})();
