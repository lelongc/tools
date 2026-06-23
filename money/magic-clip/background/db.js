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

async function saveItem(item) {
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

    // Cap at 500 items
    const count = await db.history.count();
    if (count >= 500) {
        const oldest = await db.history.orderBy('timestamp').first();
        if (oldest) await db.history.delete(oldest.id);
    }
    const newId = await db.history.add(item);
    lastSavedContent = item.content;
    lastSavedType = item.type;
    return { id: newId, isNew: true };
}

async function getRecent(limit = 50, search = '') {
    let items;
    if (search) {
        const lower = search.toLowerCase();
        // SEARCH FIX: Scan everything, including items inside collections
        items = await db.history.orderBy('timestamp').reverse().toArray();
        items = items.filter(i => i.type !== 'image' && i.content.toLowerCase().includes(lower));
        return items.slice(0, limit);
    }
    items = await db.history.orderBy('timestamp').reverse().toArray();
    // Do not filter out items saved to collections, let them stay in Recent timeline
    return items.slice(0, limit);
}

async function getCollectionItems(collectionId) {
    return await db.history.where('collectionId').equals(collectionId).reverse().sortBy('timestamp');
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

async function createCollection(name) {
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
