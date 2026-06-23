chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === 'offscreenSyncClipboard') {
        readClipboard().then(sendResponse);
        return true;
    }
});

async function readClipboard() {
    return new Promise(resolve => {
        let imgBlob = null;
        let txt = null;

        const handler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const items = e.clipboardData.items;
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.startsWith('image/')) {
                        imgBlob = items[i].getAsFile();
                    } else if (items[i].type === 'text/plain') {
                        txt = e.clipboardData.getData('text/plain');
                    }
                }
            }
        };

        const input = document.createElement('div');
        input.contentEditable = true;
        input.addEventListener('paste', handler, { once: true });
        document.body.appendChild(input);
        input.focus();

        try {
            document.execCommand('paste');
        } catch(e) {
            console.error('Offscreen paste error:', e);
        } finally {
            input.remove();
        }

        if (imgBlob) {
            const reader = new FileReader();
            reader.onload = () => resolve({ type: 'image', content: reader.result, mime: imgBlob.type });
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(imgBlob);
        } else if (txt) {
            resolve({ type: 'text', content: txt });
        } else {
            resolve(null);
        }
    });
}
