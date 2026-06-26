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

    return new Promise((resolve) => {
        chrome.identity.launchWebAuthFlow({
            url: authUrl.href,
            interactive: interactive
        }, (redirectUrl) => {
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
                    resolve({ token: token, redirectUri: redirectUri });
                } else {
                    resolve({ error: 'Failed to extract token from Google.', redirectUri: redirectUri });
                }
            }
        });
    });
}

async function loginToGoogle() {
    const res = await getAccessToken(true);
    if (res.error) {
        return { ok: false, error: res.error };
    }
    return { ok: true };
}

function logoutGoogle() {
    // Only clear local cache. Do not revoke the token on Google's end, 
    // so relogging in doesn't prompt the consent screen again.
    cachedToken = null;
    tokenExpiresAt = 0;
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

async function backupToDrive() {
    let authRes = await getAccessToken(false); // Try silent auth first
    if (authRes.error) {
        authRes = await getAccessToken(true); // Fallback to interactive if silent fails
    }
    if (authRes.error) return false;
    const token = authRes.token;

    try {
        const fileId = await getSyncFileId(token);
        
        // 1. Read existing remote data if any, to merge instead of overwrite
        let remoteHistory = [];
        let remoteCollections = [];
        if (fileId) {
            try {
                const downloadRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (downloadRes.ok) {
                    const remoteData = await downloadRes.json();
                    remoteHistory = remoteData.history || [];
                    remoteCollections = remoteData.collections || [];
                }
            } catch (e) {
                console.warn('Could not read existing backup for merging, proceeding with override:', e);
            }
        }

        // 2. Read local data
        const localHistory = await db.history.toArray();
        const localCollections = await db.collections.toArray();

        // 3. Merge Collections (by name, keeping local as priority)
        const mergedCollections = [...localCollections];
        for (const rCol of remoteCollections) {
            if (!mergedCollections.some(lCol => lCol.name.toLowerCase() === rCol.name.toLowerCase())) {
                mergedCollections.push(rCol);
            }
        }

        // 4. Merge History (by content + type)
        const mergedHistory = [...localHistory];
        for (const rItem of remoteHistory) {
            const exists = mergedHistory.some(lItem => 
                lItem.type === rItem.type && 
                lItem.content === rItem.content
            );
            if (!exists) {
                mergedHistory.push(rItem);
            }
        }

        // Sort by timestamp descending
        mergedHistory.sort((a, b) => b.timestamp - a.timestamp);

        // Cap merged history at history limit
        const settings = await new Promise(resolve => {
            chrome.storage.local.get(['historyLimit', 'isPro'], resolve);
        });
        let limit = settings.historyLimit || 50;
        if (!settings.isPro && limit > 50) limit = 50;
        
        const cappedHistory = mergedHistory.slice(0, limit);

        const backupData = JSON.stringify({ 
            history: cappedHistory, 
            collections: mergedCollections, 
            timestamp: Date.now() 
        });

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

        if (!res.ok) throw new Error('Upload failed');
        return true;

    } catch (e) {
        console.error('Backup Error:', e);
        return false;
    }
}

async function restoreFromDrive() {
    let authRes = await getAccessToken(false); // Try silent auth first
    if (authRes.error) {
        authRes = await getAccessToken(true); // Fallback to interactive if silent fails
    }
    if (authRes.error) return false;
    const token = authRes.token;

    try {
        const fileId = await getSyncFileId(token);
        if (!fileId) {
            console.error('No backup found.');
            return false;
        }

        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Download failed');
        
        const data = await res.json();
        const backupHistory = data.history || [];
        const backupCollections = data.collections || [];

        await db.transaction('rw', db.history, db.collections, async () => {
            // 1. Merge Collections & Map IDs
            const localCollections = await db.collections.toArray();
            const colIdMap = {}; // Maps remote collection ID -> local collection ID

            for (const rCol of backupCollections) {
                const existing = localCollections.find(lCol => lCol.name.toLowerCase() === rCol.name.toLowerCase());
                if (existing) {
                    colIdMap[rCol.id] = existing.id;
                } else {
                    const newId = await db.collections.add({ name: rCol.name, createdAt: rCol.createdAt });
                    colIdMap[rCol.id] = newId;
                }
            }

            // 2. Merge History (no duplicates by content + type)
            const localHistory = await db.history.toArray();
            for (const rItem of backupHistory) {
                const existing = localHistory.find(lItem => 
                    lItem.type === rItem.type && 
                    lItem.content === rItem.content
                );
                
                if (!existing) {
                    const mappedColId = rItem.collectionId ? (colIdMap[rItem.collectionId] || 0) : 0;
                    await db.history.add({
                        type: rItem.type,
                        content: rItem.content,
                        timestamp: rItem.timestamp,
                        collectionId: mappedColId
                    });
                }
            }
        });
        
        chrome.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, { action: 'storageCleared' }).catch(() => {});
            }
        });
        
        return true;
    } catch (e) {
        console.error('Restore Error:', e);
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
