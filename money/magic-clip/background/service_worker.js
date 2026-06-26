importScripts('../libs/dexie.min.js');
importScripts('db.js');
importScripts('sync.js');

console.log('Magic Clip service worker running.');

// --- Licensing System (Pro Validation Engine) ---
let isProCache = false;
let proValidUntil = 0; // The timestamp until which Pro features can be used offline
let lastApiCheck = 0; // Tracks the last time we pinged Lemon Squeezy

// Initialize on startup
chrome.storage.local.get(['isPro', 'proValidUntil', 'licenseKey', 'instanceId', 'autoBackupInterval'], (data) => {
    isProCache = !!data.isPro;
    proValidUntil = data.proValidUntil || 0;

    // Set up autoBackup alarm on startup if active
    const interval = data.autoBackupInterval !== undefined ? parseInt(data.autoBackupInterval) : 60;
    updateAutoBackupAlarm(interval, !!data.isPro);
});

// Helper to update auto-backup alarm schedule
function updateAutoBackupAlarm(interval, isPro) {
    chrome.alarms.clear('autoBackup', () => {
        if (!isPro || !interval || interval <= 0) {
            console.log('Auto-backup is disabled.');
            return;
        }
        chrome.alarms.create('autoBackup', { periodInMinutes: interval });
        console.log(`Auto-backup alarm set for every ${interval} minutes.`);
    });
}

// Listen for local changes
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
        if (changes.isPro !== undefined) {
            isProCache = !!changes.isPro.newValue;
            chrome.storage.local.get(['autoBackupInterval'], (data) => {
                const interval = data.autoBackupInterval !== undefined ? parseInt(data.autoBackupInterval) : 60;
                updateAutoBackupAlarm(interval, isProCache);
            });
        }
        if (changes.proValidUntil !== undefined) proValidUntil = changes.proValidUntil.newValue;
        if (changes.autoBackupInterval !== undefined) {
            const newInterval = changes.autoBackupInterval.newValue !== undefined ? parseInt(changes.autoBackupInterval.newValue) : 60;
            chrome.storage.local.get(['isPro'], (data) => {
                updateAutoBackupAlarm(newInterval, !!data.isPro);
            });
        }
    }
});

// Periodic Validation & Auto-Backup Alarm
chrome.alarms.get('checkSubscription', (alarm) => {
    if (!alarm) chrome.alarms.create('checkSubscription', { periodInMinutes: 60 }); // Every 1h
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkSubscription') {
        validateSubscriptionBackground();
    } else if (alarm.name === 'autoBackup') {
        handleAutoBackupAlarm();
    }
});

async function handleAutoBackupAlarm() {
    const isPro = await isProActive();
    if (!isPro) return;
    const res = await new Promise(r => chrome.storage.local.get(['driveConnected'], r));
    if (res.driveConnected) {
        console.log('Periodic auto-sync starting...');
        const result = await syncWithDrive(false);
        console.log('Periodic auto-sync status:', result && result.ok ? 'SUCCESS' : 'FAILED');
    }
}

async function validateSubscriptionBackground() {
    const data = await new Promise(res => chrome.storage.local.get(['isPro', 'licenseKey', 'instanceId'], res));
    if (!data.isPro || !data.licenseKey) return;

    lastApiCheck = Date.now();
    try {
        const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ license_key: data.licenseKey, instance_id: data.instanceId })
        });

        // Protection against 500s or gateway timeouts
        if (!response.ok && response.status >= 500) return;

        const result = await response.json();

        if (result.valid === true) {
            // Subscription active: Set exactly to expiration date
            let newValidUntil = Date.now() + (10 * 365 * 24 * 60 * 60 * 1000); // Default to +10 years
            if (result.license_key && result.license_key.expires_at) {
                newValidUntil = new Date(result.license_key.expires_at).getTime();
            }
            proValidUntil = newValidUntil;
            await chrome.storage.local.set({ proValidUntil: newValidUntil });
        } else if (result.valid === false || result.error) {
            // Subscription expired or canceled: Revoke immediately
            isProCache = false;
            proValidUntil = 0;
            await chrome.storage.local.remove(['isPro', 'proValidUntil', 'licenseKey', 'instanceId']);
            // Delete license from Drive to prevent unauthorized restore
            if (typeof deleteLicenseFromDrive === 'function') await deleteLicenseFromDrive();
            // Auto-reset historyLimit to Free tier
            chrome.storage.local.set({ historyLimit: 50 });
            // NOTE: We intentionally keep driveConnected intact so the user
            // can re-enter a new key without having to log in again.
        }
    } catch (e) {
        // Network error: Do nothing. If they are offline for > 72h, isProActive() will naturally block them.
    }
}

// Function to check if Pro is currently active (checks lease time)
async function isProActive() {
    if (!isProCache) return false;

    const now = Date.now();
    // Check if exact expiration passed, OR if it's been > 1 hour since last API check
    if (now > proValidUntil || (now - lastApiCheck > 60 * 60 * 1000)) {
        if (navigator.onLine) {
            await validateSubscriptionBackground();
            if (!isProCache) return false;
        } else if (now > proValidUntil) {
            return false;
        }
    }
    return true;
}

async function checkLicense(key) {
    if (!key) return { ok: false, error: 'Empty key' };

    try {
        const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ license_key: key, instance_name: 'Chrome on ' + navigator.userAgent.split(' ')[0] })
        });
        const data = await response.json();

        if (data.activated) {
            isProCache = true;
            // Parse exact expiration date from Lemon Squeezy, or 10 years for Lifetime
            if (data.license_key && data.license_key.expires_at) {
                proValidUntil = new Date(data.license_key.expires_at).getTime();
            } else {
                proValidUntil = Date.now() + (10 * 365 * 24 * 60 * 60 * 1000); // 10 years fallback for lifetime
            }

            await chrome.storage.local.set({ isPro: true, proValidUntil, licenseKey: key, instanceId: data.instance.id });

            const res = await new Promise(r => chrome.storage.local.get(['driveConnected'], r));
            if (res.driveConnected && typeof saveLicenseToDrive === 'function') {
                await saveLicenseToDrive(key, data.instance.id);
            }
            return { ok: true };
        } else if (data.error && data.error.includes('Activation limit')) {
            return { ok: false, error: 'Device limit reached. Please deactivate an old device on Lemon Squeezy.' };
        }
        return { ok: false, error: data.error || 'Invalid license key' };
    } catch (e) {
        return { ok: false, error: 'Network error. Please try again.' };
    }
}

async function restoreLicense(key, instanceId) {
    if (!key || !instanceId) return { ok: false };

    try {
        const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ license_key: key, instance_id: instanceId })
        });
        const result = await response.json();

        if (result.valid === true) {
            isProCache = true;
            let newValidUntil = Date.now() + (10 * 365 * 24 * 60 * 60 * 1000);
            if (result.license_key && result.license_key.expires_at) {
                newValidUntil = new Date(result.license_key.expires_at).getTime();
            }
            proValidUntil = newValidUntil;
            await chrome.storage.local.set({ isPro: true, proValidUntil, licenseKey: key, instanceId: instanceId });
            return { ok: true };
        }
        return { ok: false };
    } catch (e) {
        return { ok: false };
    }
}

chrome.runtime.onMessage.addListener((req, sender, respond) => {
    handleMessage(req, sender).then(respond).catch(err => {
        console.error('SW error:', err);
        respond({ error: err.toString() });
    });
    return true; // async
});

async function handleMessage(req, sender) {
    switch (req.action) {
        case 'openLens':
            chrome.tabs.create({ url: chrome.runtime.getURL('lens/lens.html') });
            return { ok: true };

        case 'saveItem':
            const result = await saveItem(req.item, await isProActive());
            if (result.isNew) {
                broadcastClipboardUpdated(req.item);
            }
            return { ok: true, id: result.id, isNew: result.isNew };

        case 'syncClipboard':
            try {
                await setupOffscreenDocument();
                const data = await chrome.runtime.sendMessage({ action: 'offscreenSyncClipboard' });
                if (data) {
                    const result = await saveItem(data, await isProActive());
                    if (result.isNew) broadcastClipboardUpdated(data);
                    return { ok: true, isNew: result.isNew };
                }
            } catch (e) {
                console.error('Offscreen sync failed:', e);
            }
            return { ok: true, isNew: false };

        case 'getRecent':
            return { items: await getRecent(req.limit || 50, req.search || '', req.typeFilter || 'all') };

        case 'getCollections':
            return { collections: await getCollections(await isProActive()) };

        case 'getCollectionItems':
            // Check if this collection is locked for Free users
            const isPro_ci = await isProActive();
            if (!isPro_ci) {
                const allCols = await getCollections(false);
                const targetCol = allCols.find(c => c.id === req.collectionId);
                if (targetCol && targetCol.locked) {
                    return { error: 'Upgrade to Pro to access this collection. Your data is safe — nothing is deleted.', locked: true };
                }
            }
            return { items: await getCollectionItems(req.collectionId, req.search || '') };

        case 'createCollection':
            const cid = await createCollection(req.name, await isProActive());
            if (cid === null) return { error: 'Free limit (3 collections) reached. Upgrade to Pro!' };
            return { ok: true, id: cid };

        case 'renameCollection':
            await renameCollection(req.id, req.name);
            return { ok: true };

        case 'deleteCollection':
            await deleteCollection(req.id);
            return { ok: true };

        case 'moveToCollection':
            await moveToCollection(req.itemId, req.collectionId);
            return { ok: true };

        case 'deleteItem':
            await deleteItem(req.itemId);
            return { ok: true };

        case 'clearStorage':
            await clearStorage();
            chrome.tabs.query({}, tabs => {
                for (const tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, { action: 'storageCleared' }).catch(() => { });
                }
            });
            return { ok: true };

        case 'clearStorageAndCloud':
            await clearStorage();
            let deletedCloud = false;
            try {
                deletedCloud = await deleteBackupFromDrive();
            } catch (e) {
                console.error('Failed to delete backup from Drive:', e);
            }
            if (typeof logoutGoogle === 'function') logoutGoogle();
            await new Promise(resolve => {
                chrome.storage.local.remove(['isPro', 'proValidUntil', 'licenseKey', 'instanceId'], () => {
                    chrome.storage.local.set({ driveConnected: false, historyLimit: 50 }, () => resolve());
                });
            });
            chrome.tabs.query({}, tabs => {
                for (const tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, { action: 'storageCleared' }).catch(() => { });
                }
            });
            return { ok: true, deletedCloud };

        case 'cleanUrl':
            return { cleaned: cleanUrl(req.url) };

        case 'googleLogin':
            const loginRes = await loginToGoogle();
            if (loginRes && loginRes.ok) {
                await chrome.storage.local.set({ driveConnected: true });

                const isProNow = await isProActive();
                if (!isProNow && typeof loadLicenseFromDrive === 'function') {
                    const driveLicense = await loadLicenseFromDrive();
                    if (driveLicense && driveLicense.licenseKey) {
                        const { isPro } = await new Promise(r => chrome.storage.local.get(['isPro'], r));
                        if (!isPro) {
                            let restored = false;
                            if (driveLicense.instanceId) {
                                const restoreRes = await restoreLicense(driveLicense.licenseKey, driveLicense.instanceId);
                                if (restoreRes.ok) {
                                    restored = true;
                                }
                            }
                            if (!restored) {
                                // Fallback to activating the key again
                                const checkRes = await checkLicense(driveLicense.licenseKey);
                                if (checkRes.ok) {
                                    restored = true;
                                }
                            }
                            if (restored) {
                                // Restored Pro, now sync data immediately!
                                await syncWithDrive(true);
                                return { ok: true, licenseLoaded: true };
                            }
                        }
                    }
                    // No valid license found in Drive, they are not pro, BUT they are successfully connected!
                    // Return ok: true so the UI transitions to State 2 (Connected, No License)
                    return { ok: true, licenseLoaded: false };
                } else if (isProNow && typeof saveLicenseToDrive === 'function') {
                    chrome.storage.local.get(['licenseKey', 'instanceId'], async (res) => {
                        if (res.licenseKey) {
                            await saveLicenseToDrive(res.licenseKey, res.instanceId);
                        }
                    });
                    // Already Pro, sync data immediately!
                    await syncWithDrive(true);
                }
            }
            return loginRes;

        case 'checkGoogleLogin':
            return new Promise(resolve => {
                chrome.storage.local.get(['driveConnected'], res => {
                    resolve({ ok: !!res.driveConnected });
                });
            });

        case 'disconnectDrive':
            return new Promise(resolve => {
                if (typeof logoutGoogle === 'function') logoutGoogle();
                isProCache = false;
                proValidUntil = 0;
                chrome.storage.local.remove(['isPro', 'proValidUntil', 'licenseKey', 'instanceId'], () => {
                    chrome.storage.local.set({ driveConnected: false, historyLimit: 50 }, () => resolve({ ok: true }));
                });
            });

        case 'syncWithDrive':
        case 'backupToDrive':
        case 'restoreFromDrive':
            if (!(await isProActive())) return { error: 'Pro feature only' };
            return await syncWithDrive(true);

        case 'syncWithDriveSilent':
            if (!(await isProActive())) return { error: 'Pro feature only' };
            return await syncWithDrive(false);

        case 'verifyLicense':
            return await checkLicense(req.key);

        case 'getProStatus':
            return { isPro: await isProActive() };

        default:
            return { error: 'Unknown action' };
    }
}

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-panel') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'togglePanel' }).catch(() => { });
            }
        });
    }
});

function broadcastClipboardUpdated(item) {
    chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { action: 'clipboardUpdated', item }).catch(() => { });
        }
    });
}

// Listen for browser/window activity events
chrome.tabs.onActivated.addListener(() => {
    // Notify active tab to sync
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'triggerSync' }).catch(() => { });
        }
    });
});

chrome.runtime.onStartup.addListener(async () => {
    const isPro = await isProActive();
    if (!isPro) return;
    const res = await new Promise(r => chrome.storage.local.get(['driveConnected'], r));
    if (res.driveConnected) {
        console.log('Browser startup auto-sync starting...');
        const result = await syncWithDrive(false);
        console.log('Browser startup auto-sync status:', result && result.ok ? 'SUCCESS' : 'FAILED');
    }
});

let creatingOffscreen;
async function setupOffscreenDocument() {
    if (await chrome.offscreen.hasDocument()) return;
    if (creatingOffscreen) {
        await creatingOffscreen;
        return;
    }
    creatingOffscreen = chrome.offscreen.createDocument({
        url: 'background/offscreen.html',
        reasons: ['CLIPBOARD'],
        justification: 'Read clipboard in background without stealing focus'
    });
    await creatingOffscreen;
    creatingOffscreen = null;
}
