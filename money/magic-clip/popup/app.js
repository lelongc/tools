document.addEventListener('DOMContentLoaded', () => {
    const statsDiv = document.getElementById('stats');

    chrome.runtime.sendMessage({ action: 'getRecent', limit: 999 }, res => {
        const total = res && res.items ? res.items.length : 0;
        const images = res && res.items ? res.items.filter(i => i.type === 'image').length : 0;
        const links = res && res.items ? res.items.filter(i => i.type === 'link').length : 0;

        chrome.runtime.sendMessage({ action: 'getCollections' }, colRes => {
            const cols = colRes && colRes.collections ? colRes.collections.length : 0;

            statsDiv.innerHTML = `
                <div class="stat"><span class="stat-label">Clipboard items</span><span class="stat-value">${total}</span></div>
                <div class="stat"><span class="stat-label">Images</span><span class="stat-value">${images}</span></div>
                <div class="stat"><span class="stat-label">Links</span><span class="stat-value">${links}</span></div>
                <div class="stat"><span class="stat-label">Collections</span><span class="stat-value">${cols}</span></div>
            `;
        });
    });
});
