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
        case 'saveItem':
            const id = await saveItem(req.item);
            if (sender && sender.tab) {
                chrome.tabs.sendMessage(sender.tab.id, { action: 'clipboardUpdated' }).catch(() => {});
            }
            return { ok: true, id };

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

        case 'cleanUrl':
            return { cleaned: cleanUrl(req.url) };

        default:
            return { error: 'Unknown action' };
    }
}
