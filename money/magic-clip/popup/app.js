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
    const btnSyncNow = document.getElementById('btn-sync-now');
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

    function updateLastSyncTimeDisplay() {
        chrome.storage.local.get(['lastBackupTime'], (sData) => {
            const lastSyncTimeEl = document.getElementById('last-sync-time');
            if (lastSyncTimeEl) {
                if (sData.lastBackupTime) {
                    lastSyncTimeEl.textContent = 'Last sync: ' + formatTimeAgo(sData.lastBackupTime);
                } else {
                    lastSyncTimeEl.textContent = 'Never synced';
                }
            }
        });
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

                const licenseArea = document.getElementById('license-area');
                if (licenseArea) {
                    if (isConnected && isPro) {
                        licenseArea.classList.add('pro');
                    } else {
                        licenseArea.classList.remove('pro');
                    }
                }

                if (!isConnected) {
                    // State 1: Free, No Drive. Since Drive isn't connected, we don't care about isPro.
                    if (syncStateLogin) syncStateLogin.style.display = 'block';
                } else if (isConnected && !isPro) {
                    // State 2: Drive Connected, No License
                    if (syncStateLocked) syncStateLocked.style.display = 'block';
                } else if (isConnected && isPro) {
                    // State 3: Pro + Drive Connected
                    if (syncStatePro) {
                        syncStatePro.style.display = 'block';
                        updateLastSyncTimeDisplay();
                        
                        if (!window.hasAutoSyncedThisSession) {
                            window.hasAutoSyncedThisSession = true;
                            chrome.runtime.sendMessage({ action: 'syncWithDriveSilent' }, () => {
                                loadStats();
                                updateLastSyncTimeDisplay();
                            });
                        }
                    }
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
                setTimeout(() => {
                    updateUIState();
                    loadStats();
                }, 1000);
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
                loadStats();
            } else {
                const errMsg = res ? res.error : '';
                if (errMsg && (errMsg.includes('did not approve') || errMsg.includes('cancelled') || errMsg.includes('canceled') || errMsg.includes('cancel'))) {
                    setSyncStatus(''); // Clear status gently on cancel
                } else {
                    setSyncStatus('Error: ' + (errMsg || 'Unknown error'), true);
                }
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
        showConfirmModal(
            'Disconnect Sync?',
            'This will stop automatic backups and log you out. Your cloud data on Google Drive remains safe and untouched.',
            [
                {
                    text: 'Disconnect Sync',
                    className: 'btn',
                    style: { background: 'var(--danger)', color: 'white' },
                    onClick: () => {
                        chrome.runtime.sendMessage({ action: 'disconnectDrive' }, () => {
                            updateUIState();
                            showToast('Disconnected from Google Drive.');
                        });
                    }
                },
                {
                    text: 'Cancel',
                    className: 'btn btn-secondary',
                    style: { color: 'var(--text-light)' },
                    onClick: () => {}
                }
            ]
        );
    }

    if (btnDisconnect1) btnDisconnect1.addEventListener('click', handleDisconnect);
    if (btnDisconnect2) btnDisconnect2.addEventListener('click', handleDisconnect);

    if (btnSyncNow) {
        btnSyncNow.addEventListener('click', () => {
            btnSyncNow.disabled = true;
            setSyncStatus('Syncing...');
            chrome.runtime.sendMessage({ action: 'syncWithDrive' }, res => {
                btnSyncNow.disabled = false;
                if (res && res.ok) {
                    setSyncStatus('Sync successful!');
                    loadStats(); // Update stats in realtime
                    updateUIState();
                } else {
                    const errMsg = res ? res.error : '';
                    if (errMsg && (errMsg.includes('did not approve') || errMsg.includes('cancelled') || errMsg.includes('canceled') || errMsg.includes('cancel'))) {
                        setSyncStatus(''); // Clear status gently on cancel
                    } else {
                        setSyncStatus('Sync failed: ' + (errMsg || 'Unknown'), true);
                    }
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

    function updateSettingAndSync(key, value) {
        const data = { settingsTimestamp: Date.now() };
        data[key] = value;
        chrome.storage.local.set(data, () => {
            chrome.runtime.sendMessage({ action: 'checkGoogleLogin' }, res => {
                if (res && res.ok) {
                    showToast('Syncing settings...');
                    chrome.runtime.sendMessage({ action: 'syncWithDriveSilent' });
                }
            });
        });
    }

    if (settingLimit && settingExpiry && settingBackup) {
        chrome.storage.local.get(['historyLimit', 'historyExpiry', 'autoBackupInterval'], (res) => {
            settingLimit.value = res.historyLimit || "50";
            settingExpiry.value = res.historyExpiry || "0";
            settingBackup.value = res.autoBackupInterval !== undefined ? String(res.autoBackupInterval) : "0";
        });

        settingLimit.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            chrome.runtime.sendMessage({ action: 'getProStatus' }, res => {
                const isPro = res && res.isPro;
                if (!isPro && val > 50) {
                    showToast('Free version is limited to 50 clips and 3 collections. Please upgrade to Pro!', true);
                    e.target.value = "50";
                    updateSettingAndSync('historyLimit', 50);
                } else {
                    updateSettingAndSync('historyLimit', val);
                }
            });
        });

        settingExpiry.addEventListener('change', (e) => {
            updateSettingAndSync('historyExpiry', parseInt(e.target.value));
        });

        settingBackup.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            chrome.runtime.sendMessage({ action: 'getProStatus' }, res => {
                const isPro = res && res.isPro;
                if (!isPro && val > 0) {
                    showToast('Auto-Backup is a Pro feature. Please upgrade to Pro!', true);
                    e.target.value = "0";
                    updateSettingAndSync('autoBackupInterval', 0);
                } else {
                    updateSettingAndSync('autoBackupInterval', val);
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

    // Modal confirmation helper
    const confirmModal = document.getElementById('confirm-modal');
    const confirmModalBox = document.getElementById('confirm-modal-box');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    function showConfirmModal(title, desc, buttons) {
        if (!confirmModal || !confirmModalBox || !modalTitle || !modalDesc) return;
        
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        
        const container = document.getElementById('modal-buttons-container');
        if (container) {
            container.innerHTML = '';
            buttons.forEach(btnConfig => {
                const btn = document.createElement('button');
                btn.className = btnConfig.className || 'btn';
                btn.textContent = btnConfig.text;
                btn.style.width = '100%';
                btn.style.padding = '8px';
                btn.style.fontSize = '11px';
                btn.style.fontWeight = '600';
                btn.style.borderRadius = '6px';
                btn.style.cursor = 'pointer';
                if (btnConfig.style) {
                    Object.assign(btn.style, btnConfig.style);
                }
                btn.addEventListener('click', () => {
                    btnConfig.onClick();
                    hideModal();
                });
                container.appendChild(btn);
            });
        }
        
        confirmModal.onclick = (e) => {
            if (e.target === confirmModal) hideModal();
        };
        
        confirmModal.style.opacity = '1';
        confirmModal.style.pointerEvents = 'auto';
        confirmModalBox.style.transform = 'scale(1)';
    }

    function hideModal() {
        if (confirmModal && confirmModalBox) {
            confirmModal.style.opacity = '0';
            confirmModal.style.pointerEvents = 'none';
            confirmModalBox.style.transform = 'scale(0.9)';
        }
    }

    function formatTimeAgo(timestamp) {
        if (!timestamp) return 'Never';
        const diff = Date.now() - timestamp;
        if (diff < 60000) return 'Just now';
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return mins + 'm ago';
        const hours = Math.floor(mins / 60);
        if (hours < 24) return hours + 'h ago';
        return new Date(timestamp).toLocaleDateString();
    }

    // Handle Setting: Clear Storage (Custom Modal Confirmation)
    const clearStorageBtn = document.getElementById('clear-storage');
    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', () => {
            showConfirmModal(
                'Clear Clipboard Data',
                'Choose how you want to clear your data. This action is permanent.',
                [
                    {
                        text: 'Delete Local Data Only',
                        className: 'btn btn-secondary',
                        style: { color: 'var(--danger)', border: '1px solid var(--danger)', background: 'transparent' },
                        onClick: () => {
                            chrome.runtime.sendMessage({ action: 'clearStorage' }, () => {
                                if (statItems) statItems.textContent = '0';
                                if (statCols) statCols.textContent = '0';
                                showToast('Local storage cleared!');
                            });
                        }
                    },
                    {
                        text: 'Wipe Local & Google Drive Backup',
                        className: 'btn',
                        style: { background: 'var(--danger)', color: 'white' },
                        onClick: () => {
                            chrome.runtime.sendMessage({ action: 'clearStorageAndCloud' }, (res) => {
                                if (statItems) statItems.textContent = '0';
                                if (statCols) statCols.textContent = '0';
                                showToast('Local storage & Cloud backup wiped!');
                                updateUIState();
                            });
                        }
                    },
                    {
                        text: 'Cancel',
                        className: 'btn btn-secondary',
                        style: { color: 'var(--text-light)' },
                        onClick: () => {}
                    }
                ]
            );
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
            
            // Sync setting dropdowns if they change from a background sync
            if (changes.historyLimit && settingLimit) settingLimit.value = changes.historyLimit.newValue;
            if (changes.historyExpiry && settingExpiry) settingExpiry.value = changes.historyExpiry.newValue;
            if (changes.autoBackupInterval && settingBackup) settingBackup.value = changes.autoBackupInterval.newValue;
        }
    });
});
