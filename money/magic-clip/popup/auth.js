const CLIENT_ID = '637586583741-204un9j40rq8bm9e8517evmdiaoak933.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

document.addEventListener('DOMContentLoaded', () => {
    const redirectUri = chrome.identity.getRedirectURL();
    const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', SCOPES);

    chrome.identity.launchWebAuthFlow({
        url: authUrl.href,
        interactive: true
    }, (redirectUrl) => {
        if (chrome.runtime.lastError || !redirectUrl) {
            const errMsg = chrome.runtime.lastError ? chrome.runtime.lastError.message : 'Login failed.';
            console.error('Google Universal Auth Error:', errMsg);
            let displayError = errMsg;
            if (errMsg && (errMsg.includes('OAuth2 request failed') || errMsg.includes('Authorization page could not be loaded'))) {
                displayError = `Vui lòng thêm link này vào ô "Authorized redirect URIs" trên Google Cloud: ${redirectUri}`;
            }
            alert('Google Login Failed: ' + displayError);
            chrome.runtime.sendMessage({ action: 'authCompleted', ok: false, error: displayError });
            window.close();
        } else {
            const hash = new URL(redirectUrl).hash.substring(1);
            const params = new URLSearchParams(hash);
            const token = params.get('access_token');
            const expiresIn = parseInt(params.get('expires_in'), 10) || 3600;

            if (token) {
                chrome.runtime.sendMessage({ 
                    action: 'authCompleted', 
                    ok: true, 
                    token: token, 
                    expiresIn: expiresIn 
                }, () => {
                    window.close();
                });
            } else {
                alert('Failed to extract token.');
                chrome.runtime.sendMessage({ action: 'authCompleted', ok: false, error: 'No token' });
                window.close();
            }
        }
    });
});
