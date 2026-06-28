// Google Drive Sync Engine (Universal Web Auth Flow)
// Supports Edge, Chrome, Coccoc, Brave, etc.

const FILE_NAME = 'neoclip_backup.json';
// TODO: User must provide the NEW Web Application Client ID
const CLIENT_ID = '637586583741-204un9j40rq8bm9e8517evmdiaoak933.apps.googleusercontent.com'; 
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken(interactive = false) {
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return { token: cachedToken };
    }

    // Retrieve from chrome.storage.local if memory is empty (after service worker restarts)
    const storageRes = await new Promise(resolve => {
        chrome.storage.local.get(['googleAccessToken', 'googleTokenExpiresAt'], resolve);
    });

    if (storageRes.googleAccessToken && storageRes.googleTokenExpiresAt && Date.now() < storageRes.googleTokenExpiresAt) {
        cachedToken = storageRes.googleAccessToken;
        tokenExpiresAt = storageRes.googleTokenExpiresAt;
        return { token: cachedToken };
    }

    if (CLIENT_ID === 'YOUR_NEW_WEB_CLIENT_ID_HERE') {
        const redirectUri = chrome.identity.getRedirectURL();
        return { error: `[BƯỚC 1]: Hãy lên Google Cloud tạo Web Application Client ID mới.\n[BƯỚC 2]: Dán link này vào mục "Authorized redirect URIs": ${redirectUri}` };
    }

    const redirectUri = chrome.identity.getRedirectURL();
    const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', SCOPES);

    const options = {
        url: authUrl.href,
        interactive: interactive
    };

    return new Promise((resolve) => {
        chrome.identity.launchWebAuthFlow(options, (redirectUrl) => {
            if (chrome.runtime.lastError || !redirectUrl) {
                const errMsg = chrome.runtime.lastError ? chrome.runtime.lastError.message : 'Login cancelled or failed.';
                console.error('Google Universal Auth Error:', errMsg);
                
                let displayError = errMsg;
                if (errMsg.includes('OAuth2 request failed') || errMsg.includes('Authorization page could not be loaded')) {
                    displayError = `Vui lòng thêm link này vào ô "Authorized redirect URIs" trên Google Cloud: ${redirectUri}`;
                }
                resolve({ error: displayError, redirectUri: redirectUri });
            } else {
                const hash = new URL(redirectUrl).hash.substring(1);
                const params = new URLSearchParams(hash);
                const token = params.get('access_token');
                const expiresIn = parseInt(params.get('expires_in'), 10) || 3600;

                if (token) {
                    cachedToken = token;
                    tokenExpiresAt = Date.now() + (expiresIn * 1000) - 60000;
                    
                    // Save to local storage for persistence across service worker restarts
                    chrome.storage.local.set({
                        googleAccessToken: cachedToken,
                        googleTokenExpiresAt: tokenExpiresAt
                    });
                    
                    resolve({ token: token, redirectUri: redirectUri });
                } else {
                    resolve({ error: 'Failed to extract token from Google.', redirectUri: redirectUri });
                }
            }
        });
    });
}

function launchGoogleAuthDialog() {
    const redirectUri = chrome.identity.getRedirectURL();
    const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', SCOPES);

    const options = {
        url: authUrl.href,
        interactive: true
    };

    return new Promise((resolve) => {
        chrome.identity.launchWebAuthFlow(options, (redirectUrl) => {
            if (chrome.runtime.lastError || !redirectUrl) {
                const errMsg = chrome.runtime.lastError ? chrome.runtime.lastError.message : 'Login cancelled or failed.';
                console.error('Google Universal Auth Error:', errMsg);
                
                let displayError = errMsg;
                if (errMsg && (errMsg.includes('OAuth2 request failed') || errMsg.includes('Authorization page could not be loaded'))) {
                    displayError = `Vui lòng thêm link này vào ô "Authorized redirect URIs" trên Google Cloud: ${redirectUri}`;
                }
                resolve({ error: displayError });
            } else {
                const hash = new URL(redirectUrl).hash.substring(1);
                const params = new URLSearchParams(hash);
                const token = params.get('access_token');
                const expiresIn = parseInt(params.get('expires_in'), 10) || 3600;

                if (token) {
                    cachedToken = token;
                    tokenExpiresAt = Date.now() + (expiresIn * 1000) - 60000;
                    
                    chrome.storage.local.set({
                        googleAccessToken: cachedToken,
                        googleTokenExpiresAt: tokenExpiresAt
                    }, () => {
                        resolve({ token: token });
                    });
                } else {
                    resolve({ error: 'Failed to extract token from Google.' });
                }
            }
        });
    });
}

async function loginToGoogle() {
    const res = await launchGoogleAuthDialog();
    if (res.error) {
        return { ok: false, error: res.error };
    }
    return { ok: true };
}

function logoutGoogle() {
    cachedToken = null;
    tokenExpiresAt = 0;
    chrome.storage.local.remove(['googleAccessToken', 'googleTokenExpiresAt']);
}

async function getSyncFileId(token) {
    try {
        const res = await fetch('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&pageSize=100', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data && data.files) {
            const file = data.files.find(f => f.name === FILE_NAME);
            return file ? file.id : null;
        }
    } catch (e) {
        console.error('getSyncFileId error:', e);
    }
    return null;
}

async function syncWithDrive(interactive = false) {
    // 1. Throttle check for non-interactive (silent) syncs to prevent API spamming
    if (!interactive) {
        const lastSyncRes = await new Promise(resolve => {
            chrome.storage.local.get(['lastBackupTime'], resolve);
        });
        const lastSync = lastSyncRes.lastBackupTime || 0;
        const MIN_SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
        if (Date.now() - lastSync < MIN_SYNC_INTERVAL) {
            console.log('Silent sync skipped to prevent Google API spam (last sync was less than 5 minutes ago).');
            return { ok: true, skipped: true };
        }
    }

    let authRes = await getAccessToken(false); // Try silent auth first
    if (authRes.error && interactive) {
        authRes = await getAccessToken(true); // Fallback to interactive ONLY if interactive is true
    }
    if (authRes.error) return { ok: false, error: authRes.error };
    const token = authRes.token;

    try {
        const fileId = await getSyncFileId(token);
        
        // ============================================
        // STEP 1: Download remote data from Drive
        // ============================================
        let remoteHistory = [];
        let remoteCollections = [];
        let remoteTombstones = [];  // DECLARED AT FUNCTION SCOPE

        if (fileId) {
            try {
                // Add a cache-buster query param to prevent getting stale edge-cached files
                const downloadRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&t=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (downloadRes.ok) {
                    const remoteData = await downloadRes.json();
                    remoteHistory = remoteData.history || [];
                    remoteCollections = remoteData.collections || [];
                    remoteTombstones = remoteData.tombstones || [];

                    // Apply remote settings if they are newer
                    if (remoteData.settings) {
                        const localSet = await new Promise(r => chrome.storage.local.get(['settingsTimestamp'], r));
                        const remoteTs = remoteData.settings.settingsTimestamp || 0;
                        const localTs = localSet.settingsTimestamp || 0;
                        if (remoteTs > localTs) {
                            await new Promise(r => chrome.storage.local.set(remoteData.settings, r));
                            console.log('Applied newer settings from Drive.');
                        }
                    }
                }
            } catch (e) {
                console.warn('Could not read existing backup, proceeding with merge:', e);
            }
        }

        // ============================================
        // STEP 2: Read local data
        // ============================================
        const localHistory = await db.history.toArray();
        const localCollections = await db.collections.toArray();

        // Load settings to apply retention policy during sync
        const settings = await new Promise(resolve => {
            chrome.storage.local.get(['historyLimit', 'historyExpiry', 'isPro'], resolve);
        });
        const expiryDays = settings.historyExpiry || 0;
        const cutoff = expiryDays > 0 ? Date.now() - (expiryDays * 24 * 60 * 60 * 1000) : 0;

        // ============================================
        // STEP 3: Merge ALL tombstones (local + remote)
        // This happens OUTSIDE Dexie transaction, using chrome.storage.local
        // ============================================
        const localTombstones = await _getTombstones();
        const mergedTombMap = new Map();

        // Add local tombstones
        for (const t of localTombstones) {
            mergedTombMap.set(t.hash, t);
        }
        // Merge remote tombstones
        for (const t of remoteTombstones) {
            const existing = mergedTombMap.get(t.hash);
            if (!existing || t.timestamp > existing.timestamp) {
                mergedTombMap.set(t.hash, t);
            }
        }

        const allTombstones = Array.from(mergedTombMap.values());
        const tombHashes = new Set(allTombstones.map(t => t.hash));

        // Persist merged tombstones back to chrome.storage.local
        await _setTombstones(allTombstones);

        console.log(`[Sync] Tombstones: ${localTombstones.length} local + ${remoteTombstones.length} remote = ${allTombstones.length} merged`);

        // ============================================
        // STEP 4: Apply tombstones to local DB (delete matching items)
        // Simple individual deletes, NO complex Dexie transaction needed
        // ============================================
        
        // Delete tombstoned collections
        for (const lCol of localCollections) {
            const hash = hashCode("COLLECTION:" + lCol.name.toLowerCase());
            const tomb = mergedTombMap.get(hash);
            if (tomb) {
                if (lCol.createdAt && tomb.timestamp && lCol.createdAt > tomb.timestamp) {
                    console.log(`[Sync] Revived collection "${lCol.name}" overrides older tombstone.`);
                    mergedTombMap.delete(hash);
                } else {
                    console.log(`[Sync] Deleting tombstoned collection: "${lCol.name}"`);
                    await db.collections.delete(lCol.id);
                }
            }
        }

        // Delete tombstoned history items
        for (let i = localHistory.length - 1; i >= 0; i--) {
            const lItem = localHistory[i];
            const hash = hashCode(lItem.type + lItem.content);
            const tomb = mergedTombMap.get(hash);
            if (tomb) {
                if (lItem.timestamp && tomb.timestamp && lItem.timestamp > tomb.timestamp) {
                    console.log(`[Sync] Revived item overrides older tombstone: id=${lItem.id}`);
                    mergedTombMap.delete(hash);
                } else {
                    console.log(`[Sync] Deleting tombstoned item: id=${lItem.id} type=${lItem.type}`);
                    await db.history.delete(lItem.id);
                    localHistory.splice(i, 1);
                }
            }
        }

        // Refresh local collections after deletions
        const currentLocalCollections = await db.collections.toArray();

        // ============================================
        // STEP 5: Merge remote data into local (add new items)
        // ============================================
        const colIdMap = {}; // Maps remote collection ID -> local collection ID
        const mergedCollections = [...currentLocalCollections];

        // Merge Collections
        for (const rCol of remoteCollections) {
            const hash = hashCode("COLLECTION:" + rCol.name.toLowerCase());
            const tomb = mergedTombMap.get(hash);
            
            if (tomb && (!rCol.createdAt || rCol.createdAt <= tomb.timestamp)) {
                continue; // Skip if tombstoned and not revived
            }
            if (tomb && rCol.createdAt && rCol.createdAt > tomb.timestamp) {
                console.log(`[Sync] Remote revived collection overrides tombstone: "${rCol.name}"`);
                mergedTombMap.delete(hash);
            }

            const existing = currentLocalCollections.find(lCol => lCol.name.toLowerCase() === rCol.name.toLowerCase());
            if (existing) {
                colIdMap[rCol.id] = existing.id;
            } else {
                const newId = await db.collections.add({ name: rCol.name, createdAt: rCol.createdAt });
                colIdMap[rCol.id] = newId;
                mergedCollections.push({ id: newId, name: rCol.name, createdAt: rCol.createdAt });
            }
        }

        // Merge History (no duplicates by content + type, skip tombstoned/expired)
        for (const rItem of remoteHistory) {
            const hash = hashCode(rItem.type + rItem.content);
            const tomb = mergedTombMap.get(hash);
            
            if (tomb && (!rItem.timestamp || rItem.timestamp <= tomb.timestamp)) {
                continue; // Skip tombstoned
            }
            if (tomb && rItem.timestamp && rItem.timestamp > tomb.timestamp) {
                console.log(`[Sync] Remote revived item overrides tombstone: ${rItem.type}`);
                mergedTombMap.delete(hash);
            }

            // If it is older than cutoff and not pinned in a collection, skip merging it!
            if (cutoff > 0 && rItem.timestamp < cutoff && (!rItem.collectionId || rItem.collectionId === 0)) {
                continue;
            }

            const existing = localHistory.find(lItem => 
                lItem.type === rItem.type && 
                lItem.content === rItem.content
            );
            
            const mappedColId = rItem.collectionId ? (colIdMap[rItem.collectionId] || 0) : 0;
            
            if (!existing) {
                await db.history.add({
                    type: rItem.type,
                    content: rItem.content,
                    timestamp: rItem.timestamp,
                    collectionId: mappedColId
                });
            } else {
                // Cập nhật trạng thái Collection nếu bị thay đổi (từ remote)
                if (existing.collectionId !== mappedColId && mappedColId !== 0) {
                    await db.history.update(existing.id, { collectionId: mappedColId });
                    existing.collectionId = mappedColId;
                }
            }
        }

        // Rescue orphaned items (items pointing to a deleted collection)
        const validColIds = new Set(mergedCollections.map(c => c.id));
        const allItems = await db.history.toArray();
        for (const item of allItems) {
            if (item.collectionId > 0 && !validColIds.has(item.collectionId)) {
                await db.history.update(item.id, { collectionId: 0 });
                console.log(`[Sync] Rescued orphaned item to Recent: ${item.id}`);
            }
        }

        // Also clean up local expired history items during sync
        if (cutoff > 0) {
            await db.history.where('timestamp').below(cutoff).filter(i => i.collectionId === 0).delete();
        }

        // Update tombstones in local storage if any were revived
        await _setTombstones(Array.from(mergedTombMap.values()));

        // ============================================
        // STEP 6: Upload final merged data to Drive
        // ============================================
        const finalLocalHistory = await db.history.toArray();
        const finalLocalCollections = await db.collections.toArray();
        const finalTombstones = await _getTombstones();

        // Sort history by timestamp descending
        finalLocalHistory.sort((a, b) => b.timestamp - a.timestamp);

        // Upload ALL data to Drive (không cắt bớt theo limit)
        // Việc giới hạn hiển thị chỉ áp dụng ở tầng UI, Drive lưu toàn bộ để bảo toàn dữ liệu

        const localSettingsToSync = await new Promise(r => chrome.storage.local.get(['historyLimit', 'historyExpiry', 'autoBackupInterval', 'settingsTimestamp'], r));

        const backupData = JSON.stringify({ 
            history: finalLocalHistory, 
            collections: finalLocalCollections, 
            settings: localSettingsToSync,
            tombstones: finalTombstones,
            timestamp: Date.now() 
        });

        console.log(`[Sync] Uploading: ${finalLocalHistory.length} items, ${finalLocalCollections.length} collections, ${finalTombstones.length} tombstones`);

        const metadata = {
            name: FILE_NAME,
            parents: fileId ? undefined : ['appDataFolder']
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([backupData], { type: 'application/json' }));

        let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        let method = 'POST';

        if (fileId) {
            url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
            method = 'PATCH';
        }

        const res = await fetch(url, {
            method: method,
            headers: { Authorization: `Bearer ${token}` },
            body: form
        });

        if (!res.ok) throw new Error('Upload to Drive failed');

        // Update last sync time
        const now = Date.now();
        await chrome.storage.local.set({ lastBackupTime: now });

        // Notify content scripts / popup tabs to refresh UI
        chrome.runtime.sendMessage({ action: 'syncCompleted' }).catch(() => {});
        chrome.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, { action: 'storageCleared' }).catch(() => {});
            }
        });

        return { ok: true, timestamp: now };

    } catch (e) {
        console.error('syncWithDrive Error:', e);
        return { ok: false, error: e.message || 'Unknown error' };
    }
}

async function deleteBackupFromDrive() {
    let authRes = await getAccessToken(false);
    if (authRes.error) {
        authRes = await getAccessToken(true);
    }
    if (authRes.error) return false;
    const token = authRes.token;

    try {
        const fileId = await getSyncFileId(token);
        if (!fileId) return true; // Already deleted

        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok && res.status !== 404) throw new Error('Delete backup file failed');
        return true;
    } catch (e) {
        console.error('deleteBackupFromDrive Error:', e);
        return false;
    }
}


const LICENSE_FILE_NAME = 'neoclip_license.json';

async function getLicenseFileId(token) {
    try {
        const res = await fetch('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&pageSize=100', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data && data.files) {
            const file = data.files.find(f => f.name === LICENSE_FILE_NAME);
            return file ? file.id : null;
        }
    } catch (e) {
        console.error('getLicenseFileId error:', e);
    }
    return null;
}

async function saveLicenseToDrive(key, instanceId) {
    const authRes = await getAccessToken(false);
    if (authRes.error) return false;
    const token = authRes.token;

    try {
        const fileId = await getLicenseFileId(token);
        const metadata = { 
            name: LICENSE_FILE_NAME, 
            mimeType: 'application/json', 
            parents: fileId ? undefined : ['appDataFolder'] 
        };
        const payload = { licenseKey: key };
        if (instanceId) payload.instanceId = instanceId;
        const fileContent = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', fileContent);

        let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        let method = 'POST';
        if (fileId) {
            url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
            method = 'PATCH';
        }

        const res = await fetch(url, { method: method, headers: { Authorization: `Bearer ${token}` }, body: form });
        if (!res.ok) throw new Error('License upload failed');
        return true;
    } catch (e) {
        console.error('License Backup Error:', e);
        return false;
    }
}

async function loadLicenseFromDrive() {
    const authRes = await getAccessToken(false);
    if (authRes.error) return null;
    const token = authRes.token;

    try {
        const fileId = await getLicenseFileId(token);
        if (!fileId) return null;

        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('License download failed');
        const data = await res.json();
        return { licenseKey: data.licenseKey || null, instanceId: data.instanceId || null };
    } catch (e) {
        console.error('License Restore Error:', e);
        return null;
    }
}

async function deleteLicenseFromDrive() {
    const authRes = await getAccessToken(false);
    if (authRes.error) return false;
    const token = authRes.token;

    try {
        const fileId = await getLicenseFileId(token);
        if (!fileId) return true; // Already gone

        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('License delete failed');
        return true;
    } catch (e) {
        console.error('License Delete Error:', e);
        return false;
    }
}
