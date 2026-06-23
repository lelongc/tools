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
    const authRes = await getAccessToken(true);
    if (authRes.error) return false;
    const token = authRes.token;

    try {
        const history = await db.history.toArray();
        const collections = await db.collections.toArray();
        const backupData = JSON.stringify({ history, collections, timestamp: Date.now() });

        const fileId = await getSyncFileId(token);
        
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
    const authRes = await getAccessToken(true);
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
