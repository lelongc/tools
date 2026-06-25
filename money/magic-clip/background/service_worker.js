importScripts('../libs/dexie.min.js');
importScripts('db.js');
importScripts('sync.js');

console.log('Magic Clip service worker running.');

// --- Licensing System (Pro Validation Engine) ---
let isProCache = false;
let proValidUntil = 0; // The timestamp until which Pro features can be used offline

// Initialize on startup
chrome.storage.sync.get(['isPro', 'proValidUntil', 'licenseKey', 'instanceId'], (data) => {
    isProCache = !!data.isPro;
    proValidUntil = data.proValidUntil || 0;
});

// Listen for sync changes
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
        if (changes.isPro !== undefined) isProCache = !!changes.isPro.newValue;
        if (changes.proValidUntil !== undefined) proValidUntil = changes.proValidUntil.newValue;
    }
});

// Periodic Validation Alarm
chrome.alarms.get('checkSubscription', (alarm) => {
    if (!alarm) chrome.alarms.create('checkSubscription', { periodInMinutes: 720 }); // Every 12h
});
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkSubscription') {
        validateSubscriptionBackground();
    }
});

async function validateSubscriptionBackground() {
    const data = await new Promise(res => chrome.storage.sync.get(['isPro', 'licenseKey', 'instanceId'], res));
    if (!data.isPro || !data.licenseKey) return;
    
    try {
        const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ license_key: data.licenseKey, instance_id: data.instanceId })
        });
        const result = await response.json();
        
        if (result.valid) {
            // Subscription active: Extend lease by 72 hours
            const newValidUntil = Date.now() + (72 * 60 * 60 * 1000);
            proValidUntil = newValidUntil;
            await chrome.storage.sync.set({ proValidUntil: newValidUntil });
        } else {
            // Subscription expired or canceled: Revoke immediately
            isProCache = false;
            proValidUntil = 0;
            await chrome.storage.sync.remove(['isPro', 'proValidUntil', 'licenseKey', 'instanceId']);
            // Delete from Drive to prevent unauthorized restore
            if (typeof deleteLicenseFromDrive === 'function') await deleteLicenseFromDrive();
            chrome.storage.local.set({ driveConnected: false });
        }
    } catch(e) {
        // Network error: Do nothing. If they are offline for > 72h, isProActive() will naturally block them.
    }
}

// Function to check if Pro is currently active (checks lease time)
async function isProActive() {
    if (!isProCache) return false;
    
    if (Date.now() > proValidUntil) {
        // Lease expired, force a background check but return false for now
        validateSubscriptionBackground();
        return false;
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
            proValidUntil = Date.now() + (72 * 60 * 60 * 1000);
            await chrome.storage.sync.set({ isPro: true, proValidUntil, licenseKey: key, instanceId: data.instance.id });
            
            const res = await new Promise(r => chrome.storage.local.get(['driveConnected'], r));
            if (res.driveConnected && typeof saveLicenseToDrive === 'function') {
                await saveLicenseToDrive(key);
            }
            return { ok: true };
        } else if (data.error && data.error.includes('Activation limit')) {
            return { ok: false, error: 'Device limit reached. Please deactivate an old device.' };
        }
        return { ok: false, error: data.error || 'Invalid license key' };
    } catch (e) {
        return { ok: false, error: 'Network error. Please try again.' };
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
            return { collections: await getCollections() };

        case 'getCollectionItems':
            return { items: await getCollectionItems(req.collectionId, req.search || '') };

        case 'createCollection':
            const cid = await createCollection(req.name, await isProActive());
            if (cid === null) return { error: 'Limit reached. Upgrade to Pro.' };
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
                    chrome.tabs.sendMessage(tab.id, { action: 'storageCleared' }).catch(() => {});
                }
            });
            return { ok: true };

        case 'cleanUrl':
            return { cleaned: cleanUrl(req.url) };

        case 'googleLogin':
            const loginRes = await loginToGoogle();
            if (loginRes && loginRes.ok) {
                await chrome.storage.local.set({ driveConnected: true });
                
                const isProNow = await isProActive();
                if (!isProNow && typeof loadLicenseFromDrive === 'function') {
                    const savedKey = await loadLicenseFromDrive();
                    if (savedKey) {
                        const checkRes = await checkLicense(savedKey);
                        if (checkRes.ok) {
                            return { ok: true, licenseLoaded: true };
                        }
                    }
                    // No valid license found in Drive, they are not pro, BUT they are successfully connected!
                    // Return ok: true so the UI transitions to State 2 (Connected, No License)
                    return { ok: true, licenseLoaded: false };
                } else if (isProNow && typeof saveLicenseToDrive === 'function') {
                    chrome.storage.sync.get(['licenseKey'], async (res) => {
                        if (res.licenseKey) {
                            await saveLicenseToDrive(res.licenseKey);
                        }
                    });
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
            if (typeof logoutGoogle === 'function') logoutGoogle();
            return new Promise(resolve => {
                chrome.storage.local.set({ driveConnected: false }, () => resolve({ ok: true }));
            });

        case 'backupToDrive':
            if (!(await isProActive())) return { error: 'Pro feature only' };
            return { ok: await backupToDrive() };

        case 'restoreFromDrive':
            if (!(await isProActive())) return { error: 'Pro feature only' };
            return { ok: await restoreFromDrive() };

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
                chrome.tabs.sendMessage(tabs[0].id, { action: 'togglePanel' }).catch(() => {});
            }
        });
    }
});

function broadcastClipboardUpdated(item) {
    chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { action: 'clipboardUpdated', item }).catch(() => {});
        }
    });
}

// Listen for browser/window activity events
chrome.tabs.onActivated.addListener(() => {
    // Notify active tab to sync
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'triggerSync' }).catch(() => {});
        }
    });
});

chrome.runtime.onStartup.addListener(() => {
    // Nothing needed on startup, the content script handles sync when loaded
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
