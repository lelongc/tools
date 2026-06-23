chrome.runtime.onMessage.addListener((req, sender, respond) => {
    if (req.target === 'offscreen' && req.action === 'readClipboard') {
        readClipboard().then(respond);
        return true; // async
    }
});

async function readClipboard() {
    try {
        // FIRST TRY: Async Clipboard API (standard, supports images)
        const items = await navigator.clipboard.read();
        for (const item of items) {
            const imgType = item.types.find(t => t.startsWith('image/'));
            if (imgType) {
                const blob = await item.getType(imgType);
                const b64 = await compressImage(blob);
                return { type: 'image', content: b64, mime: 'image/jpeg' };
            }
        }
        for (const item of items) {
            const txtType = item.types.find(t => t === 'text/plain');
            if (txtType) {
                const blob = await item.getType(txtType);
                const txt = await blob.text();
                if (txt && txt.trim()) {
                    return { type: 'text', content: txt.trim() };
                }
            }
        }
    } catch (e) {
        console.warn('Async clipboard read failed in offscreen, trying fallback:', e);
    }

    // SECOND TRY: Fallback paste event handler via contenteditable focus
    return new Promise(resolve => {
        const target = document.getElementById('paste-target');
        if (!target) {
            resolve(null);
            return;
        }
        target.innerHTML = '';
        
        const handler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            let imgBlob = null;
            let txt = null;
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.startsWith('image/')) {
                    imgBlob = items[i].getAsFile();
                } else if (items[i].type === 'text/plain') {
                    txt = e.clipboardData.getData('text/plain');
                }
            }
            
            if (imgBlob) {
                compressImage(imgBlob).then(b64 => {
                    resolve({ type: 'image', content: b64, mime: 'image/jpeg' });
                }).catch(() => resolve(null));
            } else if (txt && txt.trim()) {
                resolve({ type: 'text', content: txt.trim() });
            } else {
                resolve(null);
            }
        };
        
        document.addEventListener('paste', handler, { once: true });
        target.focus();
        
        try {
            const success = document.execCommand('paste');
            if (!success) {
                document.removeEventListener('paste', handler);
                resolve(null);
            }
        } catch (e) {
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
