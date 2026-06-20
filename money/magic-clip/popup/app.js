document.addEventListener('DOMContentLoaded', () => {
    const statsDiv = document.getElementById('stats');

    chrome.runtime.sendMessage({ action: 'getRecent', limit: 999 }, res => {
        const total = res && res.items ? res.items.length : 0;
        const images = res && res.items ? res.items.filter(i => i.type === 'image').length : 0;
        const links = res && res.items ? res.items.filter(i => i.type === 'link').length : 0;

        chrome.runtime.sendMessage({ action: 'getCollections' }, colRes => {
            const cols = colRes && colRes.collections ? colRes.collections.length : 0;

            statsDiv.innerHTML = `
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${total}</span>
                        <span class="stat-label">Items</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon cyan">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${images}</span>
                        <span class="stat-label">Images</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon amber">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${links}</span>
                        <span class="stat-label">Links</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon emerald">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                    </div>
                    <div class="stat-info">
                        <span class="stat-value">${cols}</span>
                        <span class="stat-label">Collections</span>
                    </div>
                </div>
            `;
        });
    });

    // Handle Setting: Toggle Bubble
    const toggleBubble = document.getElementById('toggle-bubble');
    chrome.storage.local.get(['hideBubble'], (res) => {
        toggleBubble.checked = !res.hideBubble;
    });
    toggleBubble.addEventListener('change', (e) => {
        chrome.storage.local.set({ hideBubble: !e.target.checked });
    });
});
