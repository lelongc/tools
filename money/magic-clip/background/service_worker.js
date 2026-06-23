importScripts('../libs/dexie.min.js');
importScripts('db.js');
importScripts('sync.js');

console.log('Magic Clip service worker running.');

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
            const result = await saveItem(req.item);
            if (result.isNew) {
                broadcastClipboardUpdated(req.item);
            }
            return { ok: true, id: result.id, isNew: result.isNew };

        case 'syncClipboard':
            const isNew = await syncClipboardInBackground();
            return { ok: true, isNew };

        case 'getRecent':
            return { items: await getRecent(req.limit || 50, req.search || '', req.typeFilter || 'all') };

        case 'getCollections':
            return { collections: await getCollections() };

        case 'getCollectionItems':
            return { items: await getCollectionItems(req.collectionId) };

        case 'createCollection':
            const cid = await createCollection(req.name);
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
            return { ok: await loginToGoogle() };

        case 'backupToDrive':
            return { ok: await backupToDrive() };

        case 'restoreFromDrive':
            return { ok: await restoreFromDrive() };

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

