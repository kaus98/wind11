(async () => {
    try {
        const res = await fetch('https://api.github.com/users/kaus98/events/public');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        console.log(`Total events fetched: ${data.length}`);

        const pushEvents = data.filter(e => e.type === 'PushEvent');
        console.log(`Push events found: ${pushEvents.length}`);

        const validPushes = pushEvents.filter(e => e.payload && e.payload.commits && e.payload.commits.length > 0);
        console.log(`Valid pushes with commits: ${validPushes.length}`);

        if (data.length > 0 && validPushes.length === 0) {
            console.log('--- Sample Event Types Received ---');
            const types = [...new Set(data.map(e => e.type))];
            console.log(types);
        }
    } catch (e) {
        console.error('Fetch failed:', e);
    }
})();
