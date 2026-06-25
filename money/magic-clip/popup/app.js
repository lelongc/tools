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
    const syncStateLogin = document.getElementById('sync-state-login');
    const syncStateLocked = document.getElementById('sync-state-locked');
    const syncStatePro = document.getElementById('sync-state-pro');
    const proBadge = document.getElementById('pro-badge');
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

    function updateUIState() {
        if (syncStatus) {
            syncStatus.textContent = 'Checking status...';
            syncStatus.style.color = 'var(--text-light)';
        }

        chrome.runtime.sendMessage({ action: 'checkGoogleLogin' }, resLogin => {
            const isConnected = resLogin && resLogin.ok;
            chrome.runtime.sendMessage({ action: 'getProStatus' }, resPro => {
                const isPro = resPro && resPro.isPro;
                if (syncStatus) syncStatus.textContent = '';
                if (proBadge) proBadge.style.display = isPro ? 'block' : 'none';

                if (!isConnected) {
                    if (syncStateLogin) syncStateLogin.style.display = 'block';
                    if (syncStateLocked) syncStateLocked.style.display = 'none';
                    if (syncStatePro) syncStatePro.style.display = 'none';
                } else if (isConnected && !isPro) {
                    if (syncStateLogin) syncStateLogin.style.display = 'none';
                    if (syncStateLocked) syncStateLocked.style.display = 'block';
                    if (syncStatePro) syncStatePro.style.display = 'none';
                } else if (isConnected && isPro) {
                    if (syncStateLogin) syncStateLogin.style.display = 'none';
                    if (syncStateLocked) syncStateLocked.style.display = 'none';
                    if (syncStatePro) syncStatePro.style.display = 'block';
                }
            });
        });
    }

    updateUIState();

    if (btnVerify) {
        btnVerify.addEventListener('click', () => {
            const key = licenseInput ? licenseInput.value.trim() : '';
            if (!key) return;

            btnVerify.textContent = '...';
            btnVerify.disabled = true;

            chrome.runtime.sendMessage({ action: 'verifyLicense', key }, (resp) => {
                btnVerify.textContent = 'Unlock NeoClip Pro';
                btnVerify.disabled = false;

                if (resp && resp.ok) {
                    updateUIState();
                } else {
                    alert(resp.error || 'Invalid license key');
                }
            });
        });
        
        if (licenseInput) {
            licenseInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') btnVerify.click();
            });
        }
    }

    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            btnLogin.textContent = 'Connecting...';
            btnLogin.disabled = true;
            chrome.runtime.sendMessage({ action: 'googleLogin' }, res => {
                btnLogin.textContent = 'Connect Google Drive';
                btnLogin.disabled = false;
                if (res && res.ok) {
                    updateUIState();
                } else {
                    setSyncStatus('Error: ' + (res.error || 'Unknown error'), true);
                }
            });
        });
    }

    const btnDisconnect1 = document.getElementById('btn-disconnect-drive-1');
    const btnDisconnect2 = document.getElementById('btn-disconnect-drive-2');

    function handleDisconnect(e) {
        e.preventDefault();
        chrome.runtime.sendMessage({ action: 'disconnectDrive' }, () => {
            updateUIState();
        });
    }

    if (btnDisconnect1) btnDisconnect1.addEventListener('click', handleDisconnect);
    if (btnDisconnect2) btnDisconnect2.addEventListener('click', handleDisconnect);

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
