chrome.runtime.onMessage.addListener((req, sender, respond) => {
    if (req.target === 'offscreen') {
        if (req.action === 'readClipboard') {
            readClipboard().then(respond);
            return true; // async
        } else if (req.action === 'startPolling') {
            startPolling();
            respond({ ok: true });
        } else if (req.action === 'stopPolling') {
            stopPolling();
            respond({ ok: true });
        }
    }
});

let pollingInterval = null;

function startPolling() {
    if (pollingInterval) return;
    console.log('NeoClip [Offscreen]: Started clipboard polling...');
    pollingInterval = setInterval(async () => {
        try {
            const item = await readClipboard();
            if (item) {
                chrome.runtime.sendMessage({ action: 'saveItem', item });
            }
        } catch (e) {
            console.error('NeoClip [Offscreen]: Polling error:', e);
        }
    }, 1500);
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        console.log('NeoClip [Offscreen]: Stopped clipboard polling.');
    }
}

let lastReadText = null;
let lastReadImageSize = null;


async function readClipboard() {
    console.log('NeoClip [Offscreen]: readClipboard invoked.');
    try {
        // FIRST TRY: Async Clipboard API (standard, supports images)
        console.log('NeoClip [Offscreen]: Trying navigator.clipboard.read()...');
        const items = await navigator.clipboard.read();
        console.log(`NeoClip [Offscreen]: Async Clipboard read success. Items count: ${items ? items.length : 0}`);
        for (const item of items) {
            console.log('NeoClip [Offscreen]: Async item types:', item.types);
            const imgType = item.types.find(t => t.startsWith('image/'));
            if (imgType) {
                console.log(`NeoClip [Offscreen]: Found image type: ${imgType}`);
                const blob = await item.getType(imgType);
                if (lastReadImageSize === blob.size) return null; // unchanged
                lastReadImageSize = blob.size;
                lastReadText = null;
                const b64 = await compressImage(blob);
                console.log('NeoClip [Offscreen]: Async image compressed successfully.');
                return { type: 'image', content: b64, mime: 'image/jpeg' };
            }
        }
        for (const item of items) {
            const txtType = item.types.find(t => t === 'text/plain');
            if (txtType) {
                console.log(`NeoClip [Offscreen]: Found text type: ${txtType}`);
                const blob = await item.getType(txtType);
                const txt = await blob.text();
                if (txt && txt.trim()) {
                    if (lastReadText === txt.trim()) return null; // unchanged
                    lastReadText = txt.trim();
                    lastReadImageSize = null;
                    console.log(`NeoClip [Offscreen]: Async text read successfully: "${txt.substring(0, 30)}"`);
                    return { type: 'text', content: txt.trim() };
                }
            }
        }
    } catch (e) {
        console.warn('NeoClip [Offscreen]: Async clipboard read failed, trying fallback:', e);
    }

    // SECOND TRY: Fallback paste event handler via contenteditable focus
    console.log('NeoClip [Offscreen]: Trying fallback execCommand paste...');
    return new Promise(resolve => {
        const target = document.getElementById('paste-target');
        if (!target) {
            console.error('NeoClip [Offscreen]: paste-target element not found!');
            resolve(null);
            return;
        }
        target.innerHTML = '';
        
        let handlerCalled = false;
        const handler = (e) => {
            handlerCalled = true;
            e.preventDefault();
            e.stopPropagation();
            let imgBlob = null;
            let txt = null;
            const items = e.clipboardData.items;
            console.log(`NeoClip [Offscreen]: Fallback paste event fired. Items count: ${items ? items.length : 0}`);
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    console.log(`NeoClip [Offscreen]: Item ${i} type: ${items[i].type}, kind: ${items[i].kind}`);
                    if (items[i].type.startsWith('image/')) {
                        imgBlob = items[i].getAsFile();
                        console.log(`NeoClip [Offscreen]: Found image:`, imgBlob);
                    } else if (items[i].type === 'text/plain') {
                        txt = e.clipboardData.getData('text/plain');
                        console.log(`NeoClip [Offscreen]: Found text: "${txt ? txt.substring(0, 30) : ''}"`);
                    }
                }
            }
            
            if (imgBlob) {
                if (lastReadImageSize === imgBlob.size) {
                    resolve(null);
                    return;
                }
                lastReadImageSize = imgBlob.size;
                lastReadText = null;
                compressImage(imgBlob).then(b64 => {
                    resolve({ type: 'image', content: b64, mime: 'image/jpeg' });
                }).catch(() => resolve(null));
            } else if (txt && txt.trim()) {
                if (lastReadText === txt.trim()) {
                    resolve(null);
                    return;
                }
                lastReadText = txt.trim();
                lastReadImageSize = null;
                resolve({ type: 'text', content: txt.trim() });
            } else {
                resolve(null);
            }
        };
        
        document.addEventListener('paste', handler, { once: true });
        target.focus();
        
        try {
            const success = document.execCommand('paste');
            console.log(`NeoClip [Offscreen]: execCommand('paste') success: ${success}`);
            if (!success || !handlerCalled) {
                console.log(`NeoClip [Offscreen]: execCommand failed or handler not called.`);
                document.removeEventListener('paste', handler);
                resolve(null);
            }
        } catch (e) {
            console.error('NeoClip [Offscreen]: execCommand error:', e);
            document.removeEventListener('paste', handler);
            resolve(null);
        }
    });
}

async function compressImage(blob) {
    try {
        const bitmap = await createImageBitmap(blob);
        let width = bitmap.width;
        let height = bitmap.height;
        const MAX_SIZE = 1600;
        if (width > MAX_SIZE || height > MAX_SIZE) {
            if (width > height) {
                height = Math.round((height * MAX_SIZE) / width);
                width = MAX_SIZE;
            } else {
                width = Math.round((width * MAX_SIZE) / height);
                height = MAX_SIZE;
            }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);
        return canvas.toDataURL('image/jpeg', 0.85);
    } catch (e) {
        return new Promise((resolve) => {
            const rd = new FileReader();
            rd.onloadend = () => resolve(rd.result);
            rd.readAsDataURL(blob);
        });
    }
}
