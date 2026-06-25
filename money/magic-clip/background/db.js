importScripts('../libs/dexie.min.js');

const db = new Dexie('MagicClipDB');

// Old version 1 schema
db.version(1).stores({
    history: '++id, type, timestamp, folderId',
    folders: '++id, name, createdAt'
});

// New version 2 schema (Renamed folders to collections)
db.version(2).stores({
    history: '++id, type, timestamp, collectionId', // changed folderId to collectionId
    collections: '++id, name, createdAt',
    folders: null // drop old table
});

db.open().catch(err => console.error('DB open failed:', err));

// --- History ---
let lastSavedContent = null;
let lastSavedType = null;

async function saveItem(item, isPro = false) {
    // Auto-detect links first so type comparisons match the final saved item
    if (item.type === 'text' && isUrl(item.content)) {
        item.type = 'link';
    }

    if (lastSavedContent === item.content && lastSavedType === item.type) {
        return { id: null, isNew: false };
    }

    // Deduplicate: skip if identical to most recent
    const latest = await db.history.orderBy('timestamp').reverse().first();
    if (latest && latest.content === item.content && latest.type === item.type) {
        lastSavedContent = item.content;
        lastSavedType = item.type;
        return { id: latest.id, isNew: false };
    }
    item.timestamp = Date.now();
    item.collectionId = item.collectionId || 0; // use 0 for null to make indexing easier

    // Get Retention Settings
    const settings = await new Promise(resolve => {
        chrome.storage.local.get(['historyLimit', 'historyExpiry'], resolve);
    });
    
    // Auto-Clear Expired Items
    const expiryDays = settings.historyExpiry || 0;
    if (expiryDays > 0) {
        const expiryMs = expiryDays * 24 * 60 * 60 * 1000;
        const cutoff = Date.now() - expiryMs;
        // Delete items older than cutoff that are NOT in a collection (collectionId == 0)
        await db.history.where('timestamp').below(cutoff).filter(i => i.collectionId === 0).delete();
    }

    // Cap at limits
    let limit = settings.historyLimit || 500;
    if (!isPro && limit > 500) limit = 500; // Enforce Free limit fallback

    const count = await db.history.count();
    if (count >= limit) {
        // Delete oldest items until we are below limit (usually just 1, but we use a loop just in case)
        const toDelete = count - limit + 1;
        const oldItems = await db.history.orderBy('timestamp').limit(toDelete).toArray();
        for (const old of oldItems) {
            await db.history.delete(old.id);
        }
    }
    const newId = await db.history.add(item);
    lastSavedContent = item.content;
    lastSavedType = item.type;
    return { id: newId, isNew: true };
}

async function getRecent(limit = 50, search = '', typeFilter = 'all') {
    let items;
    if (search || typeFilter !== 'all') {
        const lower = search.toLowerCase();
        // SEARCH FIX: Scan everything to find text matches and apply type filters
        items = await db.history.orderBy('timestamp').reverse().toArray();
        
        items = items.filter(i => {
            // Apply type filter
            if (typeFilter !== 'all') {
                if (typeFilter === 'links' && i.type !== 'link') return false;
                if (typeFilter === 'images' && i.type !== 'image') return false;
                if (typeFilter === 'text' && i.type !== 'text') return false;
            }
            // Apply search filter
            if (search) {
                if (i.type === 'image') return false;
                if (!i.content || typeof i.content !== 'string') return false;
                if (!i.content.toLowerCase().includes(lower)) return false;
            }
            return true;
        });
        return items.slice(0, limit);
    }
    // High Performance: Only load the exact number of items needed into RAM
    items = await db.history.orderBy('timestamp').reverse().limit(limit).toArray();
    return items;
}

async function getCollectionItems(collectionId, search = '') {
    let items = await db.history.where('collectionId').equals(collectionId).reverse().sortBy('timestamp');
    if (search) {
        const lower = search.toLowerCase();
        items = items.filter(i => {
            if (i.type === 'image') return false;
            if (!i.content || typeof i.content !== 'string') return false;
            return i.content.toLowerCase().includes(lower);
        });
    }
    return items;
}

async function deleteItem(id) {
    return await db.history.delete(id);
}

async function moveToCollection(itemId, collectionId) {
    return await db.history.update(itemId, { collectionId: collectionId });
}

// --- Collections ---
async function getCollections() {
    const cols = await db.collections.toArray();
    // Count items per collection
    for (const col of cols) {
        col.itemCount = await db.history.where('collectionId').equals(col.id).count();
    }
    return cols;
}

async function createCollection(name, isPro = false) {
    if (!isPro) {
        const count = await db.collections.count();
        if (count >= 3) return null;
    }
    return await db.collections.add({ name, createdAt: Date.now() });
}

async function renameCollection(id, name) {
    return await db.collections.update(id, { name });
}

async function deleteCollection(id) {
    // Also remove all items in this collection
    await db.history.where('collectionId').equals(id).delete();
    return await db.collections.delete(id);
}

async function clearStorage() {
    await db.history.clear();
    await db.collections.clear();
}

// --- Helpers ---
function isUrl(str) {
    try {
        const url = new URL(str.trim());
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function cleanUrl(url) {
    try {
        const u = new URL(url.trim());
        const trash = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','ref','affiliate'];
        trash.forEach(k => u.searchParams.delete(k));
        return u.toString();
    } catch {
        return url;
    }
}
