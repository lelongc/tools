document.addEventListener('DOMContentLoaded', () => {
    const statItems = document.getElementById('stat-items');
    const statCols = document.getElementById('stat-cols');

    // Fetch Stats
    chrome.runtime.sendMessage({ action: 'getRecent', limit: 999 }, res => {
        const total = res && res.items ? res.items.length : 0;
        if (statItems) statItems.textContent = total;
    });
    chrome.runtime.sendMessage({ action: 'getCollections' }, colRes => {
        const cols = colRes && colRes.collections ? colRes.collections.length : 0;
        if (statCols) statCols.textContent = cols;
    });

    // Handle Pro/License Status
    const proUnlocked = document.getElementById('pro-unlocked');
    const proLocked = document.getElementById('pro-locked');
    const btnVerify = document.getElementById('btn-verify-license');
    const licenseInput = document.getElementById('license-input');
    
    // Sync UI elements
    const btnLogin = document.getElementById('btn-sync-login');
    const btnBackup = document.getElementById('btn-sync-now');
    const btnRestore = document.getElementById('btn-sync-restore');
    const syncStatus = document.getElementById('sync-status');

    function setSyncStatus(msg, isError = false) {
        if (syncStatus) {
            syncStatus.textContent = msg;
            syncStatus.style.color = isError ? 'var(--danger)' : 'var(--success)';
        }
    }

    function checkProStatus() {
        chrome.runtime.sendMessage({ action: 'getProStatus' }, res => {
            if (res && res.isPro) {
                if (proUnlocked) proUnlocked.style.display = 'block';
                if (proLocked) proLocked.style.display = 'none';
            } else {
                if (proUnlocked) proUnlocked.style.display = 'none';
                if (proLocked) proLocked.style.display = 'block';
            }
        });
    }

    checkProStatus();

    if (btnVerify) {
        btnVerify.addEventListener('click', () => {
            const key = licenseInput ? licenseInput.value.trim() : '';
            if (!key) return;

            btnVerify.textContent = '...';
            btnVerify.disabled = true;

            chrome.runtime.sendMessage({ action: 'verifyLicense', key }, (resp) => {
                btnVerify.textContent = 'Verify';
                btnVerify.disabled = false;

                if (resp && resp.ok) {
                    checkProStatus();
                } else {
                    alert(resp.error || 'Invalid license key');
                }
            });
        });
    }

    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            btnLogin.textContent = 'Logging in...';
            btnLogin.disabled = true;
            chrome.runtime.sendMessage({ action: 'googleLogin' }, res => {
                if (res && res.ok) {
                    btnLogin.style.display = 'none';
                    if (btnBackup) btnBackup.style.display = 'block';
                    if (btnRestore) btnRestore.style.display = 'block';
                    setSyncStatus('Logged in successfully!');
                } else {
                    btnLogin.textContent = 'Login to Google';
                    btnLogin.disabled = false;
                    setSyncStatus('Error: ' + (res.error || 'Unknown error'), true);
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
                if (res && res.ok) {
                    setSyncStatus('Backup complete!');
                } else {
                    setSyncStatus('Backup failed: ' + (res ? res.error : 'Unknown'), true);
                }
            });
        });
    }

    if (btnRestore) {
        btnRestore.addEventListener('click', () => {
            btnRestore.disabled = true;
            setSyncStatus('Restoring...');
            chrome.runtime.sendMessage({ action: 'restoreFromDrive' }, res => {
                btnRestore.disabled = false;
                if (res && res.ok) {
                    setSyncStatus('Restore complete!');
                } else {
                    setSyncStatus('Restore failed: ' + (res ? res.error : 'Unknown'), true);
                }
            });
        });
    }

    // Handle Setting: Toggle Bubble
    const toggleBubble = document.getElementById('toggle-bubble');
    if (toggleBubble) {
        chrome.storage.local.get(['hideBubble'], (res) => {
            toggleBubble.checked = !res.hideBubble;
        });
        toggleBubble.addEventListener('change', (e) => {
            chrome.storage.local.set({ hideBubble: !e.target.checked });
        });
    }

    // Handle Setting: Toggle Dark Mode
    const toggleTheme = document.getElementById('toggle-theme');
    if (toggleTheme) {
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
    }

    // Handle Setting: Clear Storage
    const clearStorageBtn = document.getElementById('clear-storage');
    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete ALL clipboard history and collections? This cannot be undone.')) {
                chrome.runtime.sendMessage({ action: 'clearStorage' }, () => {
                    if (statItems) statItems.textContent = '0';
                    if (statCols) statCols.textContent = '0';
                    alert('Storage cleared successfully!');
                });
            }
        });
    }

    // Listen for storage changes to sync checkboxes and body themes dynamically
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
            if (changes.theme && toggleTheme) {
                const isDark = changes.theme.newValue === 'dark';
                toggleTheme.checked = isDark;
                if (isDark) {
                    document.body.classList.add('dark');
                } else {
                    document.body.classList.remove('dark');
                }
            }
            if (changes.hideBubble && toggleBubble) {
                toggleBubble.checked = !changes.hideBubble.newValue;
            }
        }
    });
});
