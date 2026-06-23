importScripts('../libs/dexie.min.js');
importScripts('db.js');

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
                broadcastClipboardUpdated();
            }
            return { ok: true, id: result.id, isNew: result.isNew };

        case 'syncClipboard':
            const isNew = await syncClipboardInBackground();
            return { ok: true, isNew };

        case 'getRecent':
            return { items: await getRecent(req.limit || 50, req.search || '') };

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

// ---- Offscreen Document & Background Clipboard Sync ----
let creatingOffscreen = null;
async function createOffscreenIfNeeded() {
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT']
    });
    if (existingContexts.length > 0) return;

    if (creatingOffscreen) {
        await creatingOffscreen;
        return;
    }

    creatingOffscreen = chrome.offscreen.createDocument({
        url: 'offscreen/offscreen.html',
        reasons: ['CLIPBOARD'],
        justification: 'Read clipboard images safely and robustly in background'
    });
    await creatingOffscreen;
    creatingOffscreen = null;
    // Wait for the script to load completely and register onMessage listener
    await new Promise(resolve => setTimeout(resolve, 250));
}

let syncPromise = null;
async function syncClipboardInBackground() {
    if (syncPromise) return syncPromise;

    syncPromise = (async () => {
        try {
            await createOffscreenIfNeeded();
            const result = await chrome.runtime.sendMessage({
                target: 'offscreen',
                action: 'readClipboard'
            });
            if (result && result.content) {
                const saveRes = await saveItem(result);
                if (saveRes.isNew) {
                    broadcastClipboardUpdated();
                }
                return saveRes.isNew;
            }
        } catch (e) {
            console.error('Background sync failed:', e);
        }
        return false;
    })();

    const isNew = await syncPromise;
    syncPromise = null;
    return isNew;
}

function broadcastClipboardUpdated() {
    chrome.tabs.query({ active: true }, (tabs) => {
        for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { action: 'clipboardUpdated' }).catch(() => {});
        }
    });
}

// Listen for browser/window activity events
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        // Wait 300ms for external app to completely write to clipboard and release lock
        setTimeout(() => {
            syncClipboardInBackground();
        }, 300);
    }
});

chrome.tabs.onActivated.addListener(() => {
    syncClipboardInBackground();
});

chrome.runtime.onStartup.addListener(() => {
    syncClipboardInBackground();
});

