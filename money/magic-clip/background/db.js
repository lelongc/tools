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

// Version 3: Added tombstones table (kept for schema compatibility, but we use chrome.storage.local now)
db.version(3).stores({
    history: '++id, type, timestamp, collectionId',
    collections: '++id, name, createdAt',
    tombstones: '++id, hash, timestamp'
});

db.open().catch(err => console.error('DB open failed:', err));

// Fast string hashing for tombstones
function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}

// ==========================================
// Tombstone helpers (chrome.storage.local ONLY)
// ==========================================
const TOMBSTONE_KEY = 'syncTombstones';
const MAX_TOMBSTONES = 2000;

async function _getTombstones() {
    const data = await new Promise(r => chrome.storage.local.get([TOMBSTONE_KEY], r));
    return data[TOMBSTONE_KEY] || [];
}

async function _setTombstones(arr) {
    // Trim oldest if exceeding limit
    if (arr.length > MAX_TOMBSTONES) {
        arr.sort((a, b) => a.timestamp - b.timestamp);
        arr = arr.slice(arr.length - MAX_TOMBSTONES);
    }
    await new Promise(r => chrome.storage.local.set({ [TOMBSTONE_KEY]: arr }, r));
}

async function addTombstone(hash) {
    try {
        const arr = await _getTombstones();
        // Avoid duplicates
        if (!arr.some(t => t.hash === hash)) {
            arr.push({ hash, timestamp: Date.now() });
            await _setTombstones(arr);
        }
    } catch (e) {
        console.error('addTombstone error:', e);
    }
}

async function removeTombstone(hash) {
    try {
        const arr = await _getTombstones();
        const initialLength = arr.length;
        const filtered = arr.filter(t => t.hash !== hash);
        if (filtered.length < initialLength) {
            await _setTombstones(filtered);
        }
    } catch (e) {
        console.error('removeTombstone error:', e);
    }
}

async function addTombstones(hashes) {
    try {
        const arr = await _getTombstones();
        const existing = new Set(arr.map(t => t.hash));
        const now = Date.now();
        for (const hash of hashes) {
            if (!existing.has(hash)) {
                arr.push({ hash, timestamp: now });
                existing.add(hash);
            }
        }
        await _setTombstones(arr);
    } catch (e) {
        console.error('addTombstones error:', e);
    }
}

async function clearTombstones() {
    await new Promise(r => chrome.storage.local.remove([TOMBSTONE_KEY], r));
}

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
    let limit = settings.historyLimit || 50;
    if (!isPro && limit > 50) limit = 50; // Enforce Free limit fallback

    const count = await db.history.count();
    if (count >= limit) {
        // SOFT-LOCK DATA PRESERVATION:
        // Even if count is 2000 and limit is 50 (due to Pro expiring),
        // we NEVER mass-delete their old data. We only delete exactly ONE oldest item 
        // to make room for the new item. This turns the history into a rolling queue
        // that stays at 2000 items, protecting their data until they manually delete.
        const oldItems = await db.history.orderBy('timestamp').limit(1).toArray();
        if (oldItems.length > 0) {
            await db.history.delete(oldItems[0].id);
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
            // Ẩn items đã thuộc collection khỏi tab Recent
            if (i.collectionId && i.collectionId !== 0) return false;
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
    // High Performance: Only load items NOT in a collection
    items = await db.history.orderBy('timestamp').reverse().toArray();
    items = items.filter(i => !i.collectionId || i.collectionId === 0);
    return items.slice(0, limit);
}

async function getStats() {
    return {
        totalItems: await db.history.count(),
        totalCollections: await db.collections.count()
    };
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
    const item = await db.history.get(id);
    if (item) {
        const hash = hashCode(item.type + item.content);
        await addTombstone(hash);
    }
    return await db.history.delete(id);
}

async function moveToCollection(itemId, collectionId) {
    return await db.history.update(itemId, { collectionId: collectionId, modifiedAt: Date.now() });
}

// --- Collections ---
async function getCollections(isPro = false) {
    const cols = await db.collections.orderBy('createdAt').toArray();
    // Count items per collection
    for (let i = 0; i < cols.length; i++) {
        cols[i].itemCount = await db.history.where('collectionId').equals(cols[i].id).count();
        // Soft-lock: Free users can only access the first 3 collections
        cols[i].locked = (!isPro && i >= 3);
    }
    return cols;
}

async function createCollection(name, isPro = false) {
    if (!isPro) {
        const count = await db.collections.count();
        if (count >= 3) return null;
    }
    await removeTombstone(hashCode("COLLECTION:" + name.toLowerCase()));
    return await db.collections.add({ name, createdAt: Date.now() });
}

async function renameCollection(id, name) {
    const col = await db.collections.get(id);
    if (col && col.name !== name) {
        await addTombstone(hashCode("COLLECTION:" + col.name.toLowerCase()));
        await removeTombstone(hashCode("COLLECTION:" + name.toLowerCase()));
        return await db.collections.update(id, { name });
    }
    return 0;
}

async function deleteCollection(id) {
    const col = await db.collections.get(id);
    const hashesToAdd = [];

    if (col) {
        hashesToAdd.push(hashCode("COLLECTION:" + col.name.toLowerCase()));
    }

    // Remove all items in this collection and tombstone them
    const items = await db.history.where('collectionId').equals(id).toArray();
    for (const item of items) {
        hashesToAdd.push(hashCode(item.type + item.content));
    }

    // Save all tombstones at once
    if (hashesToAdd.length > 0) {
        await addTombstones(hashesToAdd);
    }

    await db.history.where('collectionId').equals(id).delete();
    return await db.collections.delete(id);
}

async function clearStorage() {
    await db.history.clear();
    await db.collections.clear();
    if (db.tombstones) await db.tombstones.clear();
    await clearTombstones();
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
        const trash = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref', 'affiliate'];
        trash.forEach(k => u.searchParams.delete(k));
        return u.toString();
    } catch {
        return url;
    }
}
