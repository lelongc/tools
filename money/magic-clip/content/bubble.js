/* ============================================
   MAGIC CLIP - PREMIUM UI LOGIC
   No popups, inline elements, smooth transitions
   ============================================ */

(function () {
    if (document.getElementById('mc-host')) return;

    // ---- Icons ----
    const ICONS = {
        copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
        view: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
        folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
        ocr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
        del: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
        close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
        search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
        link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
        image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
    };

    // ---- Host & Shadow DOM ----
    const host = document.createElement('div');
    host.id = 'mc-host';
    Object.assign(host.style, {
        position: 'fixed', bottom: '24px', right: '24px',
        zIndex: '2147483647', fontFamily: 'inherit'
    });
    const shadow = host.attachShadow({ mode: 'open' });

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('content/bubble.css');
    shadow.appendChild(link);

    // ---- Bubble ----
    const bubble = document.createElement('div');
    bubble.id = 'mc-bubble';
    bubble.innerHTML = ICONS.clipboard;
    
    // ---- Toast Notification ----
    const toast = document.createElement('div');
    toast.id = 'mc-toast';
    
    function showToast(msg, isError = false) {
        toast.textContent = msg;
        toast.className = isError ? 'error show' : 'show';
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    // ---- Panel Shell ----
    const panel = document.createElement('div');
    panel.id = 'mc-panel';

    panel.innerHTML = `
        <div id="screen-main" class="screen">
            <div class="p-header">
                <span class="p-title">${ICONS.clipboard} Magic Clip</span>
                <button class="btn-icon" id="btn-close">${ICONS.close}</button>
            </div>
            <div class="p-search">
                <div class="search-box">
                    ${ICONS.search}
                    <input type="text" id="search-input" placeholder="Search clipboard..." />
                </div>
            </div>
            <div class="p-tabs">
                <div class="segment-control">
                    <button class="p-tab active" data-tab="recent">Recent</button>
                    <button class="p-tab" data-tab="collections">Collections</button>
                </div>
            </div>
            <div class="p-body" id="main-body"></div>
        </div>

        <div id="screen-view" class="screen">
            <div class="p-header">
                <span class="p-title"><button class="btn-icon" id="btn-view-back">${ICONS.back}</button> Detail</span>
            </div>
            <div class="p-body" id="view-body"></div>
            <div class="view-footer" id="view-footer"></div>
        </div>
    `;

    shadow.appendChild(toast);
    shadow.appendChild(panel);
    shadow.appendChild(bubble);
    document.body.appendChild(host);

    // ---- State ----
    let currentTab = 'recent';
    let currentCollectionId = null;
    let collectionsCache = [];

    // ---- Drag ----
    let dragging = false, dragMoved = false;
    let startX, startY, offX = 0, offY = 0;

    bubble.addEventListener('mousedown', e => {
        startX = e.clientX - offX; startY = e.clientY - offY;
        dragging = true; dragMoved = false;
    });
    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        if (Math.abs(dx - offX) > 3 || Math.abs(dy - offY) > 3) dragMoved = true;
        offX = dx; offY = dy;
        host.style.transform = `translate(${offX}px, ${offY}px)`;
    });
    document.addEventListener('mouseup', () => { dragging = false; });

    // ---- Toggle Panel ----
    bubble.addEventListener('click', async () => {
        if (dragMoved) return;
        const open = panel.classList.toggle('open');
        if (open) {
            await syncClipboard();
            showTab(currentTab);
            // Pre-fetch collections for dropdowns
            chrome.runtime.sendMessage({ action: 'getCollections' }, res => {
                if (res && res.collections) collectionsCache = res.collections;
            });
        }
    });

    shadow.getElementById('btn-close').addEventListener('click', () => panel.classList.remove('open'));

    // ---- View Back ----
    shadow.getElementById('btn-view-back').addEventListener('click', () => {
        panel.classList.remove('view-mode');
    });

    // ---- Tabs ----
    shadow.querySelectorAll('.p-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            currentTab = tab.dataset.tab;
            currentCollectionId = null;
            shadow.querySelectorAll('.p-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showTab(currentTab);
        });
    });

    // ---- Search ----
    let searchTimeout;
    shadow.getElementById('search-input').addEventListener('input', e => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (currentTab === 'recent') loadRecent(e.target.value);
        }, 200);
    });

    function showTab(tab) {
        const searchBox = shadow.querySelector('.p-search');
        if (tab === 'recent') {
            searchBox.style.display = 'block';
            loadRecent();
        } else {
            searchBox.style.display = 'none';
            if (currentCollectionId) loadCollectionItems(currentCollectionId);
            else loadCollections();
        }
    }

    // ---- Render Recent ----
    function loadRecent(search = '') {
        const body = shadow.getElementById('main-body');
        body.innerHTML = '<div class="p-empty">Loading...</div>';
        chrome.runtime.sendMessage({ action: 'getRecent', limit: 50, search }, res => {
            body.innerHTML = '';
            if (!res || !res.items || res.items.length === 0) {
                body.innerHTML = '<div class="p-empty">Clipboard is empty.</div>';
                return;
            }
            res.items.forEach(item => body.appendChild(buildCard(item, false)));
        });
    }

    // ---- Render Collections ----
    function loadCollections() {
        const body = shadow.getElementById('main-body');
        body.innerHTML = '<div class="p-empty">Loading...</div>';
        chrome.runtime.sendMessage({ action: 'getCollections' }, res => {
            body.innerHTML = '';
            collectionsCache = res.collections || [];

            // Inline Add Form
            const addWrap = el('div', 'inline-input-wrap');
            const input = el('input', 'inline-input');
            input.placeholder = "New collection name...";
            const btn = el('button', 'inline-btn', 'Add');
            addWrap.append(input, btn);
            body.appendChild(addWrap);

            const handleAdd = () => {
                if (!input.value.trim()) return;
                btn.disabled = true;
                chrome.runtime.sendMessage({ action: 'createCollection', name: input.value.trim() }, () => {
                    loadCollections();
                });
            };
            btn.addEventListener('click', handleAdd);
            input.addEventListener('keypress', e => e.key === 'Enter' && handleAdd());

            if (collectionsCache.length === 0) {
                body.appendChild(el('div', 'p-empty', 'No collections yet.'));
                return;
            }

            collectionsCache.forEach(col => {
                const row = el('div', 'col-row');
                
                // Normal view
                const infoWrap = el('div', 'col-info');
                infoWrap.innerHTML = `
                    <div class="col-icon">${ICONS.folder}</div>
                    <span class="col-name">${esc(col.name)}</span>
                    <span class="col-count">${col.itemCount || 0}</span>
                `;
                const actWrap = el('div', 'col-actions');
                const editBtn = el('button', 'btn-icon'); editBtn.innerHTML = ICONS.edit;
                const delBtn = el('button', 'btn-icon'); delBtn.innerHTML = ICONS.del;
                actWrap.append(editBtn, delBtn);
                
                row.append(infoWrap, actWrap);

                // Edit view
                const editMode = el('div', 'col-edit-mode');
                editMode.style.display = 'none';
                const editInput = el('input', 'inline-input'); editInput.value = col.name;
                const saveEditBtn = el('button', 'inline-btn', 'Save');
                const cancelEditBtn = el('button', 'btn-icon'); cancelEditBtn.innerHTML = ICONS.close;
                editMode.append(editInput, saveEditBtn, cancelEditBtn);
                row.appendChild(editMode);

                // Events
                infoWrap.addEventListener('click', () => {
                    currentCollectionId = col.id;
                    loadCollectionItems(col.id);
                });

                editBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    infoWrap.style.display = 'none'; actWrap.style.display = 'none';
                    editMode.style.display = 'flex'; editInput.focus();
                });
                cancelEditBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    infoWrap.style.display = 'flex'; actWrap.style.display = 'flex';
                    editMode.style.display = 'none';
                });
                const saveEdit = (e) => {
                    e.stopPropagation();
                    if(editInput.value.trim()){
                        chrome.runtime.sendMessage({action: 'renameCollection', id: col.id, name: editInput.value.trim()}, () => loadCollections());
                    }
                };
                saveEditBtn.addEventListener('click', saveEdit);
                editInput.addEventListener('keypress', e => e.key === 'Enter' && saveEdit(e));

                delBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    // Inline confirm
                    row.innerHTML = `<span style="font-size:12px;color:var(--mc-red)">Delete?</span>`;
                    const y = el('button', 'inline-btn', 'Yes'); y.style.background = 'var(--mc-red)';
                    const n = el('button', 'inline-btn', 'No'); n.style.background = 'var(--mc-text-light)';
                    const c = el('div', 'col-actions'); c.append(y, n);
                    row.appendChild(c);

                    y.addEventListener('click', () => {
                        chrome.runtime.sendMessage({action: 'deleteCollection', id: col.id}, () => loadCollections());
                    });
                    n.addEventListener('click', () => loadCollections());
                });

                body.appendChild(row);
            });
        });
    }

    // ---- Render Collection Items ----
    function loadCollectionItems(colId) {
        const body = shadow.getElementById('main-body');
        body.innerHTML = '<div class="p-empty">Loading...</div>';
        const colName = collectionsCache.find(c => c.id === colId)?.name || 'Collection';

        chrome.runtime.sendMessage({ action: 'getCollectionItems', collectionId: colId }, res => {
            body.innerHTML = '';
            
            const head = el('div', 'inline-input-wrap');
            head.style.alignItems = 'center'; head.style.justifyContent = 'space-between';
            const backBtn = el('button', 'btn-icon'); backBtn.innerHTML = ICONS.back;
            backBtn.addEventListener('click', () => { currentCollectionId = null; loadCollections(); });
            const title = el('span', '', esc(colName)); title.style.fontWeight = '600';
            head.append(backBtn, title, el('div', '','')); // empty div for spacing
            body.appendChild(head);

            if (!res || !res.items || res.items.length === 0) {
                body.appendChild(el('div', 'p-empty', 'Empty collection.'));
                return;
            }
            res.items.forEach(item => body.appendChild(buildCard(item, true)));
        });
    }

    // ---- Build Card ----
    function buildCard(item, inCollection) {
        const card = el('div', 'card');

        // Text / Image
        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.content; img.className = 'card-img';
            card.appendChild(img);
        } else {
            const txt = el('div', 'card-text', esc(item.content));
            card.appendChild(txt);
        }

        // Meta
        const meta = el('div', 'card-meta');
        meta.appendChild(el('span', 'card-time', timeAgo(item.timestamp)));
        if (item.type === 'link') {
            const badge = el('span', 'card-badge badge-link');
            badge.innerHTML = `<span class="badge-badge">${ICONS.link}</span> Link`;
            meta.appendChild(badge);
        } else if (item.type === 'image') {
            const badge = el('span', 'card-badge badge-img');
            badge.innerHTML = `<span class="badge-badge">${ICONS.image}</span> Image`;
            meta.appendChild(badge);
        }
        card.appendChild(meta);

        // Actions
        const actions = el('div', 'card-actions');

        const viewBtn = el('button', 'action-btn'); viewBtn.innerHTML = ICONS.view + ' View';
        viewBtn.addEventListener('click', () => showPreview(item, inCollection));
        actions.appendChild(viewBtn);

        const copyBtn = el('button', 'action-btn btn-primary'); copyBtn.innerHTML = ICONS.copy + ' Copy';
        copyBtn.addEventListener('click', () => copyItem(item, copyBtn));
        actions.appendChild(copyBtn);

        if (item.type === 'image') {
            const ocrBtn = el('button', 'action-btn'); ocrBtn.innerHTML = ICONS.ocr + ' Aa';
            ocrBtn.title = "Extract Text";
            ocrBtn.addEventListener('click', () => runOCR(item, ocrBtn));
            actions.appendChild(ocrBtn);
        }

        if (!inCollection) {
            // Dropdown wrap
            const dropWrap = el('div', 'dropdown-wrap');
            const saveBtn = el('button', 'action-btn'); saveBtn.innerHTML = ICONS.folder + ' Save';
            saveBtn.style.width = '100%';
            
            const dropMenu = el('div', 'dropdown-menu');
            saveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close others
                shadow.querySelectorAll('.dropdown-menu').forEach(m => m !== dropMenu && m.classList.remove('show'));
                dropMenu.classList.toggle('show');
                
                // Populate
                dropMenu.innerHTML = '';
                if(collectionsCache.length === 0){
                    dropMenu.innerHTML = '<div class="drop-empty">No collections</div>';
                } else {
                    collectionsCache.forEach(c => {
                        const b = el('button', 'drop-item', esc(c.name));
                        b.addEventListener('click', (ev) => {
                            ev.stopPropagation();
                            dropMenu.classList.remove('show');
                            chrome.runtime.sendMessage({ action: 'moveToCollection', itemId: item.id, collectionId: c.id }, () => {
                                showToast('Saved to ' + c.name);
                                loadRecent(shadow.getElementById('search-input').value);
                            });
                        });
                        dropMenu.appendChild(b);
                    });
                }
            });
            
            dropWrap.append(saveBtn, dropMenu);
            actions.appendChild(dropWrap);
        }

        if (inCollection) {
            const delBtn = el('button', 'action-btn btn-danger'); delBtn.innerHTML = ICONS.del + ' Del';
            delBtn.addEventListener('click', () => {
                chrome.runtime.sendMessage({ action: 'deleteItem', itemId: item.id }, () => card.remove());
            });
            actions.appendChild(delBtn);
        }

        card.appendChild(actions);
        return card;
    }

    // Hide dropdowns on outside click
    document.addEventListener('click', () => {
        if(shadow.querySelectorAll) {
            shadow.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
        }
    });

    // ---- Copy logic ----
    function copyItem(item, btn) {
        if (item.type === 'image') {
            fetch(item.content)
                .then(r => r.blob())
                .then(blob => navigator.clipboard.write([new ClipboardItem({ [item.mime || 'image/png']: blob })]))
                .then(() => flashBtn(btn, 'Copied!'))
                .catch(() => showToast('Failed to copy image', true));
        } else {
            let text = item.content;
            if (item.type === 'link') {
                try {
                    const u = new URL(text.trim());
                    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','ref','affiliate'].forEach(k => u.searchParams.delete(k));
                    text = u.toString();
                } catch {}
            }
            navigator.clipboard.writeText(text).then(() => flashBtn(btn, 'Copied!'));
        }
    }

    function flashBtn(btn, text) {
        const orig = btn.innerHTML;
        btn.innerHTML = ICONS.check + ' ' + text;
        setTimeout(() => { btn.innerHTML = orig; }, 1000);
    }

    // ---- Inline Preview ----
    function showPreview(item, inCollection) {
        const vBody = shadow.getElementById('view-body');
        const vFoot = shadow.getElementById('view-footer');
        vBody.innerHTML = ''; vFoot.innerHTML = '';

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.content; img.className = 'view-img';
            vBody.appendChild(img);
        } else {
            const txt = el('div', 'view-text'); txt.textContent = item.content;
            vBody.appendChild(txt);
        }

        const cp = el('button', 'action-btn btn-primary'); cp.innerHTML = ICONS.copy + ' Copy';
        cp.addEventListener('click', () => copyItem(item, cp));
        vFoot.appendChild(cp);

        // Slide over
        panel.classList.add('view-mode');
    }

    // ---- OCR ----
    let tesseractLoaded = false;
    function loadTesseract() {
        return new Promise((res, rej) => {
            if (tesseractLoaded || typeof window.Tesseract !== 'undefined') { tesseractLoaded = true; return res(); }
            const s = document.createElement('script');
            s.src = chrome.runtime.getURL('libs/tesseract.min.js');
            s.onload = () => { tesseractLoaded = true; res(); };
            s.onerror = rej;
            document.head.appendChild(s);
        });
    }

    async function runOCR(item, btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '...';
        try {
            await loadTesseract();
            const worker = await Tesseract.createWorker({
                workerPath: chrome.runtime.getURL('libs/worker.min.js'),
                corePath: chrome.runtime.getURL('libs/tesseract-core.wasm.js'),
                langPath: chrome.runtime.getURL('libs'),
                logger: m => { if (m.status === 'recognizing text') btn.textContent = Math.round(m.progress*100)+'%'; }
            });
            await worker.loadLanguage('eng+vie');
            await worker.initialize('eng+vie');
            const resp = await fetch(item.content);
            const blob = await resp.blob();
            const { data: { text } } = await worker.recognize(blob);
            await worker.terminate();

            if (text && text.trim()) {
                navigator.clipboard.writeText(text.trim());
                chrome.runtime.sendMessage({ action: 'saveItem', item: { type: 'text', content: text.trim() } }, () => {
                    if (currentTab === 'recent') loadRecent();
                });
                flashBtn(btn, 'Done');
                showToast('Text copied to clipboard');
            } else {
                btn.innerHTML = orig;
                showToast('No text detected', true);
            }
        } catch (err) {
            btn.innerHTML = orig;
            showToast('OCR failed', true);
        }
    }

    // ---- OS Clipboard Sync ----
    async function syncClipboard() {
        try {
            const items = await navigator.clipboard.read();
            for (const ci of items) {
                const imgType = ci.types.find(t => t.startsWith('image/'));
                if (imgType) {
                    const blob = await ci.getType(imgType);
                    const b64 = await new Promise(r => { const rd = new FileReader(); rd.onloadend=()=>r(rd.result); rd.readAsDataURL(blob); });
                    chrome.runtime.sendMessage({ action: 'saveItem', item: { type: 'image', content: b64, mime: imgType } });
                    return;
                }
                const txtType = ci.types.find(t => t === 'text/plain');
                if (txtType) {
                    const blob = await ci.getType(txtType);
                    const txt = await blob.text();
                    if(txt.trim()) chrome.runtime.sendMessage({ action: 'saveItem', item: { type: 'text', content: txt.trim() } });
                    return;
                }
            }
        } catch {}
    }

    // ---- Copy Event ----
    document.addEventListener('copy', () => {
        setTimeout(() => {
            const text = document.getSelection()?.toString();
            if (text && text.trim()) {
                chrome.runtime.sendMessage({ action: 'saveItem', item: { type: 'text', content: text.trim() } });
                bubble.classList.add('mc-bounce');
                setTimeout(() => bubble.classList.remove('mc-bounce'), 300);
            }
        }, 50);
    });

    document.addEventListener('copy', async () => {
        try {
            const items = await navigator.clipboard.read();
            for(const ci of items){
                const imgType = ci.types.find(t=>t.startsWith('image/'));
                if(imgType){
                    const blob = await ci.getType(imgType);
                    const b64 = await new Promise(r => { const rd = new FileReader(); rd.onloadend=()=>r(rd.result); rd.readAsDataURL(blob); });
                    chrome.runtime.sendMessage({ action: 'saveItem', item: { type: 'image', content: b64, mime: imgType } });
                }
            }
        }catch{}
    }, 200);

    // Helpers
    function el(tag, cls, text) { const e = document.createElement(tag); if(cls) e.className=cls; if(text!==undefined) e.textContent=text; return e; }
    function esc(s) { return s?s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'):''; }
    function timeAgo(ts) {
        const s = Math.floor((Date.now()-ts)/1000);
        if(s<60) return 'just now'; const m=Math.floor(s/60);
        if(m<60) return `${m}m ago`; const h=Math.floor(m/60);
        if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`;
    }
})();
