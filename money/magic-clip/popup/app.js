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

    // Handle Setting: Toggle Dark Mode
    const toggleTheme = document.getElementById('toggle-theme');
    chrome.storage.local.get(['theme'], (res) => {
        let isDark = res.theme === 'dark';
        if (res.theme === undefined) {
            isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        toggleTheme.checked = isDark;
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    });

    toggleTheme.addEventListener('change', (e) => {
        const nextDark = e.target.checked;
        chrome.storage.local.set({ theme: nextDark ? 'dark' : 'light' });
        if (nextDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    });

    // Handle Setting: Google Drive Sync
    const btnLogin = document.getElementById('btn-sync-login');
    const btnBackup = document.getElementById('btn-sync-now');
    const btnRestore = document.getElementById('btn-sync-restore');
    const syncStatus = document.getElementById('sync-status');

    function setSyncStatus(msg, isError = false) {
        syncStatus.style.display = 'block';
        syncStatus.textContent = msg;
        syncStatus.style.color = isError ? '#ef4444' : '#10b981';
    }

    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            btnLogin.textContent = 'Logging in...';
            btnLogin.disabled = true;
            chrome.runtime.sendMessage({ action: 'googleLogin' }, res => {
                if (res && res.ok) {
                    btnLogin.style.display = 'none';
                    btnBackup.style.display = 'block';
                    btnRestore.style.display = 'block';
                    setSyncStatus('Logged in successfully!');
                } else {
                    btnLogin.textContent = 'Login to Google';
                    btnLogin.disabled = false;
                    setSyncStatus('Login failed. Ensure API Key is configured.', true);
                }
            });
        });
    }

    if (btnBackup) {
        btnBackup.addEventListener('click', () => {
            btnBackup.disabled = true;
            setSyncStatus('Backing up...');
            chrome.runtime.sendMessage({ action: 'backupToDrive' }, res => {
                btnBackup.disabled = false;
                setSyncStatus('Backup complete!');
            });
        });
    }

    if (btnRestore) {
        btnRestore.addEventListener('click', () => {
            btnRestore.disabled = true;
            setSyncStatus('Restoring...');
            chrome.runtime.sendMessage({ action: 'restoreFromDrive' }, res => {
                btnRestore.disabled = false;
                setSyncStatus('Restore complete!');
            });
        });
    }

    // Handle Setting: Clear Storage
    const clearStorageBtn = document.getElementById('clear-storage');
    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete ALL clipboard history and collections? This cannot be undone.')) {
                chrome.runtime.sendMessage({ action: 'clearStorage' }, () => {
                    // Update UI stats to 0
                    const statValues = document.querySelectorAll('.stat-value');
                    statValues.forEach(el => el.textContent = '0');
                    alert('Storage cleared successfully!');
                });
            }
        });
    }

    // Listen for storage changes to sync checkboxes and body themes dynamically
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
            if (changes.theme) {
                const isDark = changes.theme.newValue === 'dark';
                toggleTheme.checked = isDark;
                if (isDark) {
                    document.body.classList.add('dark');
                } else {
                    document.body.classList.remove('dark');
                }
            }
            if (changes.hideBubble) {
                toggleBubble.checked = !changes.hideBubble.newValue;
            }
        }
    });
});
