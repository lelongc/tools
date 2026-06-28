importScripts('../libs/dexie.min.js');
importScripts('db.js');
importScripts('sync.js');

console.log('Magic Clip service worker running.');

// --- Licensing System (Pro Validation Engine) ---
let isProCache = false;
let proValidUntil = 0; // The timestamp until which Pro features can be used offline
let lastApiCheck = 0; // Tracks the last time we pinged Lemon Squeezy (persisted in storage)

// =========================================================================
// [BẢO MẬT] ĐIỀN STORE ID CỦA BẠN VÀO ĐÂY ĐỂ VÁ LỖ HỔNG XÁC THỰC CHÉO
// Bạn có thể lấy Store ID trong Settings của Dashboard Lemon Squeezy.
// =========================================================================
const VALID_STORE_ID = 416715; // Store ID của NeoClip Studio (#416715)

// Initialize on startup
chrome.storage.local.remove('isConnectingDrive'); // Clear any stuck connecting states
chrome.storage.local.get(['isPro', 'proValidUntil', 'licenseKey', 'instanceId', 'autoBackupInterval', 'lastApiCheck'], (data) => {
    isProCache = !!data.isPro;
    proValidUntil = data.proValidUntil || 0;
    lastApiCheck = data.lastApiCheck || 0; // Khôi phục từ storage để không bị reset khi SW ngủ

    // Set up autoBackup alarm on startup if active
    const interval = data.autoBackupInterval !== undefined ? parseInt(data.autoBackupInterval) : 0;
    updateAutoBackupAlarm(interval, !!data.isPro);
});

// Helper to update auto-backup alarm schedule
function updateAutoBackupAlarm(interval, isPro) {
    if (!isPro || !interval || interval <= 0) {
        chrome.alarms.clear('autoBackup');
        console.log('Auto-backup is disabled.');
        return;
    }
    
    chrome.alarms.get('autoBackup', (alarm) => {
        if (alarm && alarm.periodInMinutes === interval) {
            // Alarm already exists with the correct interval, do nothing
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
                const interval = data.autoBackupInterval !== undefined ? parseInt(data.autoBackupInterval) : 0;
                updateAutoBackupAlarm(interval, isProCache);
            });
        }
        if (changes.proValidUntil !== undefined) proValidUntil = changes.proValidUntil.newValue;
        if (changes.autoBackupInterval !== undefined) {
            const newInterval = changes.autoBackupInterval.newValue !== undefined ? parseInt(changes.autoBackupInterval.newValue) : 0;
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
    chrome.storage.local.set({ lastApiCheck }); // Lưu vào storage để persist qua SW restart
    try {
        const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ license_key: data.licenseKey, instance_id: data.instanceId })
        });

        // Protection against 500s or gateway timeouts
        if (!response.ok && response.status >= 500) return;

        const result = await response.json();

        // Bảo mật: Kiểm tra Store ID để ngăn chặn giả mạo license chéo
        if (result.valid === true && result.meta && result.meta.store_id !== VALID_STORE_ID) {
            console.error('Bảo mật: License key thuộc về Store khác! Hủy kích hoạt.');
            result.valid = false;
        }

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
    // Chỉ gọi API nếu subscription ĐÃ hết hạn
    // Nếu chưa hết hạn → cho dùng ngay, không cần chờ API
    if (now > proValidUntil) {
        // Hết hạn rồi, kiểm tra online xem có gia hạn không
        if (navigator.onLine) {
            await validateSubscriptionBackground();
            if (!isProCache) return false;
        } else {
            return false; // Offline + hết hạn = không cho dùng
        }
    } else if (now - lastApiCheck > 60 * 60 * 1000 && navigator.onLine) {
        // Chưa hết hạn nhưng lâu không check → check ngầm, KHÔNG block
        validateSubscriptionBackground(); // fire-and-forget, không await
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

        // Bảo mật: Kiểm tra Store ID để ngăn chặn giả mạo license chéo
        if (data.activated && data.meta && data.meta.store_id !== VALID_STORE_ID) {
            return { ok: false, error: 'License key không hợp lệ cho ứng dụng này (Sai Store).' };
        }

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

        // Bảo mật: Kiểm tra Store ID để ngăn chặn giả mạo license chéo
        if (result.valid === true && result.meta && result.meta.store_id !== VALID_STORE_ID) {
            return { ok: false };
        }

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

        case 'getStats':
            return await getStats();

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
            // Đã sửa: KHÔNG logoutGoogle() và không revoke license Pro.
            // Chức năng này chỉ nhằm mục đích wipe data.
            chrome.tabs.query({}, tabs => {
                for (const tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, { action: 'storageCleared' }).catch(() => { });
                }
            });
            return { ok: true, deletedCloud };

        case 'cleanUrl':
            return { cleaned: cleanUrl(req.url) };

        case 'googleLogin':
            return new Promise((resolve) => {
                // Set status asynchronously (fire-and-forget, no await!)
                chrome.storage.local.set({ isConnectingDrive: true });

                launchGoogleAuthDialog().then(async (loginRes) => {
                    await chrome.storage.local.set({ isConnectingDrive: false });

                    if (loginRes && !loginRes.error) {
                        await chrome.storage.local.set({ driveConnected: true });

                        const isProNow = await isProActive();
                        let licenseLoaded = false;
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
                                        const checkRes = await checkLicense(driveLicense.licenseKey);
                                        if (checkRes.ok) {
                                            restored = true;
                                        }
                                    }
                                    if (restored) {
                                        await syncWithDrive(true);
                                        licenseLoaded = true;
                                    }
                                }
                            }
                            resolve({ ok: true, licenseLoaded });
                        } else {
                            if (isProNow && typeof saveLicenseToDrive === 'function') {
                                const res = await new Promise(r => chrome.storage.local.get(['licenseKey', 'instanceId'], r));
                                if (res.licenseKey) {
                                    await saveLicenseToDrive(res.licenseKey, res.instanceId);
                                }
                                await syncWithDrive(true);
                            }
                            resolve({ ok: true, licenseLoaded: false });
                        }
                    } else {
                        resolve({ ok: false, error: loginRes ? loginRes.error : 'Unknown login error' });
                    }
                }).catch(err => {
                    chrome.storage.local.set({ isConnectingDrive: false });
                    resolve({ ok: false, error: err.message || err.toString() });
                });
            });

        case 'checkGoogleLogin':
            return new Promise(resolve => {
                chrome.storage.local.get(['driveConnected', 'isConnectingDrive'], res => {
                    resolve({ ok: !!res.driveConnected, isConnectingDrive: !!res.isConnectingDrive });
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

        case 'authCompleted':
            if (req.ok) {
                const tokenExpiresAt = Date.now() + (req.expiresIn * 1000) - 60000;
                await chrome.storage.local.set({
                    googleAccessToken: req.token,
                    googleTokenExpiresAt: tokenExpiresAt,
                    driveConnected: true,
                    isConnectingDrive: false
                });

                const isProNow = await isProActive();
                if (!isProNow && typeof loadLicenseFromDrive === 'function') {
                    const driveLicense = await loadLicenseFromDrive();
                    if (driveLicense && driveLicense.licenseKey) {
                        const { isPro } = await new Promise(r => chrome.storage.local.get(['isPro'], r));
                        if (!isPro) {
                            let restored = false;
                            if (driveLicense.instanceId) {
                                const restoreRes = await restoreLicense(driveLicense.licenseKey, driveLicense.instanceId);
                                if (restoreRes.ok) restored = true;
                            }
                            if (!restored) {
                                const checkRes = await checkLicense(driveLicense.licenseKey);
                                if (checkRes.ok) restored = true;
                            }
                            if (restored) {
                                await syncWithDrive(true);
                            }
                        }
                    }
                } else if (isProNow && typeof saveLicenseToDrive === 'function') {
                    const res = await new Promise(r => chrome.storage.local.get(['licenseKey', 'instanceId'], r));
                    if (res.licenseKey) {
                        await saveLicenseToDrive(res.licenseKey, res.instanceId);
                    }
                    await syncWithDrive(true);
                }
            } else {
                await chrome.storage.local.set({ isConnectingDrive: false });
            }
            return { ok: true };

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
