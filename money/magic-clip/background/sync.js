// Google Drive Sync Engine
// Uses the drive.appdata scope to save a hidden JSON file
const FILE_NAME = 'neoclip_backup.json';

async function getAccessToken(interactive = false) {
    return new Promise((resolve) => {
        chrome.identity.getAuthToken({ interactive }, function(token) {
            if (chrome.runtime.lastError || !token) {
                console.error('Google Auth Error:', chrome.runtime.lastError);
                resolve(null);
            } else {
                resolve(token);
            }
        });
    });
}

async function loginToGoogle() {
    const token = await getAccessToken(true);
    return !!token;
}

async function getSyncFileId(token) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${FILE_NAME}'`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.files && data.files.length > 0) {
        return data.files[0].id;
    }
    return null;
}

async function backupToDrive() {
    const token = await getAccessToken(true);
    if (!token) return false;

    try {
        // 1. Gather Data
        const history = await db.history.toArray();
        const collections = await db.collections.toArray();
        const backupData = JSON.stringify({ history, collections, timestamp: Date.now() });

        // 2. Prepare Upload
        const fileId = await getSyncFileId(token);
        
        const metadata = {
            name: FILE_NAME,
            parents: fileId ? undefined : ['appDataFolder']
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([backupData], { type: 'application/json' }));

        // 3. Upload (POST if new, PATCH if exists)
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
    const token = await getAccessToken(true);
    if (!token) return false;

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
        
        // Restore to DB
        await db.transaction('rw', db.history, db.collections, async () => {
            await db.history.clear();
            await db.collections.clear();
            
            if (data.history && data.history.length > 0) {
                await db.history.bulkAdd(data.history);
            }
            if (data.collections && data.collections.length > 0) {
                await db.collections.bulkAdd(data.collections);
            }
        });
        
        // Notify tabs
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
