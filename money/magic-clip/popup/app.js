document.addEventListener('DOMContentLoaded', () => {
    const statItems = document.getElementById('stat-items');
    const statCols = document.getElementById('stat-cols');

    function loadStats() {
        chrome.runtime.sendMessage({ action: 'getRecent', limit: 99999 }, res => {
            const total = res && res.items ? res.items.length : 0;
            if (statItems) statItems.textContent = total;
        });
        chrome.runtime.sendMessage({ action: 'getCollections' }, colRes => {
            const cols = colRes && colRes.collections ? colRes.collections.length : 0;
            if (statCols) statCols.textContent = cols;
        });
    }
    
    // Initial load
    loadStats();

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
    const settingBackup = document.getElementById('setting-backup');

    function setSyncStatus(msg, isError = false) {
        if (syncStatus) {
            syncStatus.textContent = msg;
            syncStatus.style.color = isError ? 'var(--danger)' : 'var(--success)';
        }
    }

    function hideAllStates() {
        if (syncStateLogin) syncStateLogin.style.display = 'none';
        if (syncStateLocked) syncStateLocked.style.display = 'none';
        if (syncStatePro) syncStatePro.style.display = 'none';
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

                hideAllStates();

                if (!isConnected) {
                    // State 1: Free, No Drive. Since Drive isn't connected, we don't care about isPro.
                    if (syncStateLogin) syncStateLogin.style.display = 'block';
                } else if (isConnected && !isPro) {
                    // State 2: Drive Connected, No License
                    if (syncStateLocked) syncStateLocked.style.display = 'block';
                } else if (isConnected && isPro) {
                    // State 3: Pro + Drive Connected
                    if (syncStatePro) syncStatePro.style.display = 'block';
                }

                // Auto-reset historyLimit and autoBackupInterval when not Pro
                if (!isPro) {
                    if (settingLimit) {
                        const currentVal = parseInt(settingLimit.value);
                        if (currentVal > 50) {
                            settingLimit.value = "50";
                            chrome.storage.local.set({ historyLimit: 50 });
                        }
                    }
                    if (settingBackup) {
                        const currentBackup = parseInt(settingBackup.value);
                        if (currentBackup > 0) {
                            settingBackup.value = "0";
                            chrome.storage.local.set({ autoBackupInterval: 0 });
                        }
                    }
                }
            });
        });
    }

    updateUIState();

    // Verify license handler (reusable)
    function handleVerifyLicense(inputEl, btnEl) {
        const key = inputEl ? inputEl.value.trim() : '';
        if (!key) return;

        btnEl.textContent = '...';
        btnEl.disabled = true;

        chrome.runtime.sendMessage({ action: 'verifyLicense', key }, (resp) => {
            if (resp && resp.ok) {
                btnEl.textContent = 'Success!';
                showToast('Welcome to NeoClip Pro!');
                setTimeout(() => updateUIState(), 1000);
            } else {
                btnEl.textContent = 'Unlock NeoClip Pro';
                btnEl.disabled = false;
                showToast(resp.error || 'Invalid license key', true);
            }
        });
    }

    // State 2 verify button
    if (btnVerify) {
        btnVerify.addEventListener('click', () => handleVerifyLicense(licenseInput, btnVerify));
        if (licenseInput) {
            licenseInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') btnVerify.click();
            });
        }
    }

    // Google login handler (reusable)
    function handleGoogleLogin(btnEl) {
        btnEl.textContent = 'Connecting...';
        btnEl.disabled = true;
        chrome.runtime.sendMessage({ action: 'googleLogin' }, res => {
            btnEl.textContent = 'Connect Google Drive';
            btnEl.disabled = false;
            if (res && res.ok) {
                if (res.licenseLoaded) {
                    showToast('NeoClip Pro restored from Google Drive!');
                }
                updateUIState();
            } else {
                setSyncStatus('Error: ' + (res.error || 'Unknown error'), true);
            }
        });
    }

    // State 1 connect button
    if (btnLogin) {
        btnLogin.addEventListener('click', () => handleGoogleLogin(btnLogin));
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
                    loadStats(); // Update stats in realtime
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

    function showToast(msg, isError = false) {
        const container = document.getElementById('toast-container');
        const text = document.getElementById('toast-message');
        if (container && text) {
            text.textContent = msg;
            container.style.background = isError ? 'var(--danger)' : 'var(--success)';
            container.style.opacity = '1';
            setTimeout(() => { container.style.opacity = '0'; }, 3000);
        }
    }

    // Handle Retention & Auto-Backup Settings
    const settingLimit = document.getElementById('setting-limit');
    const settingExpiry = document.getElementById('setting-expiry');

    if (settingLimit && settingExpiry && settingBackup) {
        chrome.storage.local.get(['historyLimit', 'historyExpiry', 'autoBackupInterval'], (res) => {
            settingLimit.value = res.historyLimit || "50";
            settingExpiry.value = res.historyExpiry || "0";
            settingBackup.value = res.autoBackupInterval !== undefined ? String(res.autoBackupInterval) : "60";
        });

        settingLimit.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            chrome.runtime.sendMessage({ action: 'getProStatus' }, res => {
                const isPro = res && res.isPro;
                if (!isPro && val > 50) {
                    showToast('Free version is limited to 50 clips and 3 collections. Please upgrade to Pro!', true);
                    e.target.value = "50";
                    chrome.storage.local.set({ historyLimit: 50 });
                } else {
                    chrome.storage.local.set({ historyLimit: val });
                }
            });
        });

        settingExpiry.addEventListener('change', (e) => {
            chrome.storage.local.set({ historyExpiry: parseInt(e.target.value) });
        });

        settingBackup.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            chrome.runtime.sendMessage({ action: 'getProStatus' }, res => {
                const isPro = res && res.isPro;
                if (!isPro && val > 0) {
                    showToast('Auto-Backup is a Pro feature. Please upgrade to Pro!', true);
                    e.target.value = "0";
                    chrome.storage.local.set({ autoBackupInterval: 0 });
                } else {
                    chrome.storage.local.set({ autoBackupInterval: val });
                }
            });
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

    // Handle Setting: Clear Storage (Inline Double-Confirmation UX)
    const clearStorageBtn = document.getElementById('clear-storage');
    let clearConfirmActive = false;
    let clearConfirmTimeout = null;

    if (clearStorageBtn) {
        const labelEl = clearStorageBtn.querySelector('.setting-label');
        const descEl = clearStorageBtn.querySelector('.setting-desc');
        const originalLabel = labelEl.textContent;
        const originalDesc = descEl.textContent;

        clearStorageBtn.addEventListener('click', () => {
            if (!clearConfirmActive) {
                // First click: activate confirmation state
                clearConfirmActive = true;
                labelEl.textContent = 'Confirm Delete?';
                descEl.textContent = 'Click again within 3s to delete ALL data';
                descEl.style.color = 'var(--danger)';
                
                // Clear any existing timeout
                if (clearConfirmTimeout) clearTimeout(clearConfirmTimeout);
                
                // Reset after 3 seconds if not clicked again
                clearConfirmTimeout = setTimeout(() => {
                    resetClearState();
                }, 3000);
            } else {
                // Second click: perform deletion
                clearConfirmActive = false;
                if (clearConfirmTimeout) clearTimeout(clearConfirmTimeout);
                
                chrome.runtime.sendMessage({ action: 'clearStorage' }, () => {
                    if (statItems) statItems.textContent = '0';
                    if (statCols) statCols.textContent = '0';
                    showToast('Storage cleared successfully!');
                    resetClearState();
                });
            }
        });

        // Reset if mouse leaves the button (extra safety)
        clearStorageBtn.addEventListener('mouseleave', () => {
            if (clearConfirmActive) {
                if (clearConfirmTimeout) clearTimeout(clearConfirmTimeout);
                clearConfirmTimeout = setTimeout(() => {
                    resetClearState();
                }, 1000); // 1s grace period when mouse leaves
            }
        });

        function resetClearState() {
            clearConfirmActive = false;
            labelEl.textContent = originalLabel;
            descEl.textContent = originalDesc;
            descEl.style.color = 'var(--text-light)';
        }
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
