/* ============================================
   NEOCLIP - PREMIUM UI LOGIC
   No popups, inline elements, smooth transitions
   ============================================ */

(function () {
    if (document.getElementById('mc-host')) return;

    // Guard against extension context invalidation (after reload)
    if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
        const originalSendMessage = chrome.runtime.sendMessage;
        chrome.runtime.sendMessage = function (...args) {
            try {
                if (!chrome.runtime || !chrome.runtime.id) return;
                originalSendMessage.apply(chrome.runtime, args);
            } catch (e) {
                console.warn('NeoClip: Extension context invalidated. Please refresh the page (F5) to reload the script.');
            }
        };
    }

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
        image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
        zoomIn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
        zoomOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
        reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
        lens: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="3"/><path d="M11 8v6M8 11h6"/></svg>',
        logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><rect x="4" y="4" width="16" height="18" rx="2"/><path d="M9 12h6M9 16h4"/></svg>',
        sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
        moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
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

    // ---- Clipboard Cache ----
    let lastSyncedText = null;
    let lastSyncedImageSize = null;

    // ---- Bubble ----
    const bubble = document.createElement('div');
    bubble.id = 'mc-bubble';
    bubble.innerHTML = ICONS.logo;

    // Load hideBubble setting
    let isBubbleHidden = false;
    chrome.storage.local.get(['hideBubble'], res => {
        isBubbleHidden = !!res.hideBubble;
        if (res.hideBubble) bubble.style.display = 'none';
    });
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
            if (changes.hideBubble) {
                isBubbleHidden = !!changes.hideBubble.newValue;
                bubble.style.display = changes.hideBubble.newValue ? 'none' : 'flex';
                if (!isBubbleHidden) {
                    // Restore position when turned back on instead of resetting to corner
                    host.style.left = savedBubbleLeft;
                    host.style.top = savedBubbleTop;
                    host.style.right = savedBubbleRight;
                    host.style.bottom = savedBubbleBottom;
                    updatePanelPlacement();
                }
            }
            if (changes.theme) {
                applyTheme(changes.theme.newValue === 'dark');
            }
        } else if (area === 'sync') {
            // Settings UI has been moved to popup.
        }
    });

    // ---- Panel Shell ----
    const panel = document.createElement('div');
    panel.id = 'mc-panel';

    panel.innerHTML = `
        <div id="screen-main" class="screen">
            <div class="p-header">
                <span class="p-title">${ICONS.clipboard} NeoClip</span>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <button class="btn-icon" id="btn-theme" title="Toggle Theme"></button>
                    <button class="btn-icon" id="btn-close">${ICONS.close}</button>
                </div>
            </div>
            <div class="p-search">
                <div class="search-box">
                    ${ICONS.search}
                    <input type="text" id="search-input" placeholder="Search clipboard..." />
                    <button id="btn-search" style="position: absolute; right: 4px; background: var(--mc-primary); color: white; border: none; border-radius: 6px; padding: 4px 10px; font-size: 11px; cursor: pointer; font-weight: 500;">Search</button>
                </div>
                <div class="p-filters" id="search-filters">
                    <div class="p-filter-chip active" data-filter="all">All</div>
                    <div class="p-filter-chip" data-filter="text">Text</div>
                    <div class="p-filter-chip" data-filter="links">Links</div>
                    <div class="p-filter-chip" data-filter="images">Images</div>
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

    shadow.appendChild(panel);
    shadow.appendChild(bubble);
    document.body.appendChild(host);

    // ---- Theme Toggle (Light/Dark Mode) ----
    let darkTheme = false;
    const btnTheme = shadow.getElementById('btn-theme');
    
    function applyTheme(isDark) {
        darkTheme = isDark;
        if (isDark) {
            host.classList.add('dark');
            if (btnTheme) btnTheme.innerHTML = ICONS.sun;
        } else {
            host.classList.remove('dark');
            if (btnTheme) btnTheme.innerHTML = ICONS.moon;
        }
    }

    // Load persisted or system default theme
    chrome.storage.local.get(['theme'], res => {
        let isDark = res.theme === 'dark';
        if (res.theme === undefined) {
            isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        applyTheme(isDark);
    });

    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            const nextDark = !darkTheme;
            applyTheme(nextDark);
            chrome.storage.local.set({ theme: nextDark ? 'dark' : 'light' });
        });
    }

    // ---- Toast Notification ----
    const toast = document.createElement('div');
    toast.id = 'mc-toast';
    shadow.appendChild(toast);
    
    function showToast(msg, isError = false) {
        toast.textContent = msg;
        toast.className = isError ? 'error show' : 'show';
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ---- State ----
    let currentTab = 'recent';
    let currentCollectionId = null;
    let collectionsCache = [];
    let currentFilter = 'all';
    let isDragging = false;
    let savedBubbleLeft = 'auto';
    let savedBubbleTop = 'auto';
    let savedBubbleRight = '24px';
    let savedBubbleBottom = '24px';
    let lastActiveElement = null; // for direct paste
    let ignoreSyncUntil = 0; // prevent self-copy from triggering refresh

    // Global listener to track the last active input element on the page
    document.addEventListener('focusin', (e) => {
        const target = e.composedPath()[0] || e.target;
        if (target && target.id !== 'mc-legacy-paste-target' && !e.composedPath().includes(host) && (
            target.tagName === 'INPUT' || 
            target.tagName === 'TEXTAREA' || 
            target.isContentEditable
        )) {
            lastActiveElement = target;
        }
    });

    // Drag Bubble
    let isDown = false, startX, startY, startMouseX, startMouseY;
    bubble.addEventListener('mousedown', e => {
        if (e.button !== 0) return; // Only left click
        isDown = true; isDragging = false;
        startMouseX = e.clientX;
        startMouseY = e.clientY;
        startX = e.clientX - host.offsetLeft;
        startY = e.clientY - host.offsetTop;
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    });

    function onMouseMove(e) {
        if (!isDragging) {
            const dx = e.clientX - startMouseX;
            const dy = e.clientY - startMouseY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                isDragging = true;
            } else {
                return; // Ignore micro movements during click
            }
        }
        let newX = e.clientX - startX;
        let newY = e.clientY - startY;

        // clamp to window
        newX = Math.max(0, Math.min(newX, window.innerWidth - 50));
        newY = Math.max(0, Math.min(newY, window.innerHeight - 50));

        host.style.left = newX + 'px';
        host.style.top = newY + 'px';
        host.style.right = 'auto';
        host.style.bottom = 'auto';

        // Real-time panel adjustment during drag
        if (panel.classList.contains('open')) {
            updatePanelPlacement();
        }
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        isDown = false;
        
        // Prevent click if we dragged
        if (isDragging) {
            setTimeout(() => isDragging = false, 50);
            
            // Save position
            savedBubbleLeft = host.style.left;
            savedBubbleTop = host.style.top;
            savedBubbleRight = 'auto';
            savedBubbleBottom = 'auto';
        } else {
            lastActiveElement = document.activeElement;
            togglePanel();
        }
    }

    // Hint bar listener
    const hintBar = shadow.getElementById('win-v-hint');
    if (hintBar) {
        hintBar.addEventListener('click', () => {
            showToast('Press Win + V on your keyboard and click your image to instantly save it to NeoClip! 🚀', false);
        });
    }

    // Panel Toggle/ Prevent active element from losing focus when clicking non-input elements inside panel
    panel.addEventListener('mousedown', e => {
        const target = e.composedPath()[0];
        if (target && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // Toggle Panel
    let isToggling = false;
    async function togglePanel() {
        if (isToggling) return;
        isToggling = true;
        
        updatePanelPlacement();
        const open = panel.classList.toggle('open');
        if (open) {
            shadow.getElementById('search-input').value = ''; // Reset search on open
            await syncClipboard();
            showTab(currentTab);
            // Pre-fetch collections for dropdowns
            chrome.runtime.sendMessage({ action: 'getCollections' }, res => {
                if (res && res.collections) collectionsCache = res.collections;
            });
        }

        // Prevent rapid toggling (debounce)
        setTimeout(() => isToggling = false, 350);
    }
    // bubble click listener removed to prevent native click firing after a drag


    function updatePanelPlacement() {
        if (isBubbleHidden && lastActiveElement && typeof lastActiveElement.getBoundingClientRect === 'function') {
            const rect = lastActiveElement.getBoundingClientRect();
            const panelWidth = 370;
            const panelHeight = 520;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            host.style.right = 'auto';
            host.style.bottom = 'auto';

            // Calculate vertical position (prefer below element, otherwise above)
            let topPos = rect.bottom + 8;
            if (rect.bottom + panelHeight + 20 > viewportHeight) {
                topPos = rect.top - panelHeight - 8;
            }
            topPos = Math.max(8, Math.min(topPos, viewportHeight - panelHeight - 8));

            // Calculate horizontal position (align to left, fallback align to right)
            let leftPos = rect.left;
            if (leftPos + panelWidth > viewportWidth) {
                leftPos = rect.right - panelWidth;
            }
            leftPos = Math.max(8, Math.min(leftPos, viewportWidth - panelWidth - 8));

            host.style.top = topPos + 'px';
            host.style.left = leftPos + 'px';

            panel.style.top = '0';
            panel.style.bottom = 'auto';
            panel.style.left = '0';
            panel.style.right = 'auto';
        } else {
            const rect = host.getBoundingClientRect();
            const isLeft = rect.left < window.innerWidth / 2;
            const isTop = rect.top < window.innerHeight / 2;
            
            panel.style.top = isTop ? '60px' : 'auto';
            panel.style.bottom = isTop ? 'auto' : '60px';
            panel.style.left = isLeft ? '0' : 'auto';
            panel.style.right = isLeft ? 'auto' : '0';
        }
    }

    // ---- Panel Close ----
    function closePanel() {
        panel.classList.remove('open');
    }

    shadow.getElementById('btn-close').addEventListener('click', () => {
        closePanel();
    });

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

    // ---- Search & Filters ----
    let searchTimeout;
    const searchInput = shadow.getElementById('search-input');
    searchInput.addEventListener('input', e => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const term = e.target.value;
            if (currentTab === 'recent') {
                loadRecent(term, true);
            } else if (currentTab === 'collections') {
                if (currentCollectionId) {
                    loadCollectionItems(currentCollectionId, term, true);
                } else {
                    loadCollections(term); // Filter collection list
                }
            }
        }, 200);
    });
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    
    const btnSearch = shadow.getElementById('btn-search');
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            performSearch();
        });
    }

    function performSearch() {
        clearTimeout(searchTimeout);
        const term = searchInput.value;
        if (currentTab === 'recent') {
            loadRecent(term, true);
        } else if (currentTab === 'collections') {
            if (currentCollectionId) {
                loadCollectionItems(currentCollectionId, term, true);
            } else {
                loadCollections(term);
            }
        }
    }

    shadow.querySelectorAll('.p-filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            shadow.querySelectorAll('.p-filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            if (currentTab === 'recent') loadRecent(searchInput.value);
        });
    });

    function showTab(tab) {
        const searchBox = shadow.querySelector('.p-search');
        if (tab === 'recent') {
            searchBox.style.display = 'block';
            loadRecent();
        } else if (tab === 'collections') {
            searchBox.style.display = 'block'; // Keep search visible!
            searchInput.value = ''; // Reset search input
            if (currentCollectionId) loadCollectionItems(currentCollectionId);
            else loadCollections(searchInput.value);
        }
    }

    // ---- Render Recent ----
    function loadRecent(search = '', isRefresh = false) {
        const body = shadow.getElementById('main-body');
        const scrollPos = body.scrollTop;
        if (!isRefresh) body.innerHTML = '<div class="p-empty">Loading...</div>';
        
        chrome.storage.local.get(['historyLimit'], sData => {
            const limit = sData.historyLimit || 50;
            chrome.runtime.sendMessage({ action: 'getRecent', limit, search, typeFilter: currentFilter }, res => {
                body.innerHTML = '';
                if (!res || !res.items || res.items.length === 0) {
                    body.innerHTML = '<div class="p-empty">Clipboard is empty.</div>';
                    return;
                }
                res.items.forEach(item => body.appendChild(buildCard(item, false)));
                if (isRefresh) body.scrollTop = scrollPos;
            });
        });
    }

    // ---- Render Collections ----
    function loadCollections(search = '') {
        const body = shadow.getElementById('main-body');
        if (!search) body.innerHTML = '<div class="p-empty">Loading...</div>';
        chrome.runtime.sendMessage({ action: 'getCollections' }, res => {
            body.innerHTML = '';
            collectionsCache = res.collections || [];

            if (search) {
                const lower = search.toLowerCase();
                collectionsCache = collectionsCache.filter(c => c.name.toLowerCase().includes(lower));
            }

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
                chrome.runtime.sendMessage({ action: 'createCollection', name: input.value.trim() }, (res) => {
                    if (res && res.error) {
                        showToast(res.error, true);
                        btn.disabled = false;
                    } else {
                        loadCollections(searchInput.value);
                    }
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
                
                if (col.locked) {
                    // Locked collection: show 🔒 and gray out
                    row.style.opacity = '0.5';
                    const infoWrap = el('div', 'col-info');
                    infoWrap.innerHTML = `
                        <div class="col-icon">🔒</div>
                        <span class="col-name">${esc(col.name)}</span>
                        <span class="col-count">${col.itemCount || 0}</span>
                    `;
                    infoWrap.addEventListener('click', () => {
                        showToast('Upgrade to Pro to access this collection. Your data is safe!', true);
                    });
                    row.appendChild(infoWrap);
                    body.appendChild(row);
                    return; // skip edit/delete for locked collections
                }

                // Normal view (unlocked)
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
                        chrome.runtime.sendMessage({action: 'renameCollection', id: col.id, name: editInput.value.trim()}, () => loadCollections(searchInput.value));
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
                        chrome.runtime.sendMessage({action: 'deleteCollection', id: col.id}, () => loadCollections(searchInput.value));
                    });
                    n.addEventListener('click', () => loadCollections(searchInput.value));
                });

                body.appendChild(row);
            });
        });
    }

    // ---- Render Collection Items ----
    function loadCollectionItems(colId, search = '', isRefresh = false) {
        const body = shadow.getElementById('main-body');
        const scrollPos = body.scrollTop;
        if (!isRefresh) body.innerHTML = '<div class="p-empty">Loading...</div>';
        const colName = collectionsCache.find(c => c.id === colId)?.name || 'Collection';

        chrome.runtime.sendMessage({ action: 'getCollectionItems', collectionId: colId, search }, res => {
            body.innerHTML = '';
            
            const head = el('div', 'inline-input-wrap');
            head.style.alignItems = 'center'; head.style.justifyContent = 'space-between';
            const backBtn = el('button', 'btn-icon'); backBtn.innerHTML = ICONS.back;
            backBtn.addEventListener('click', () => { currentCollectionId = null; loadCollections(); });
            const title = el('span', '', esc(colName)); title.style.fontWeight = '600';
            head.append(backBtn, title, el('div', '','')); // empty div for spacing
            body.appendChild(head);

            if (!res || !res.items || res.items.length === 0) {
                if (search) {
                    body.appendChild(el('div', 'p-empty', 'No items found matching your search.'));
                } else {
                    body.appendChild(el('div', 'p-empty', 'Empty collection.'));
                }
                return;
            }
            res.items.forEach(item => body.appendChild(buildCard(item, true)));
            if (isRefresh) body.scrollTop = scrollPos;
        });
    }

    // ---- Build Card ----
    function buildCard(item, inCollection) {
        const card = el('div', 'card');
        const cardBody = el('div', 'card-body');

        // Text / Image
        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.content; img.className = 'card-img';
            cardBody.appendChild(img);
        } else {
            const txt = el('div', 'card-text', esc(item.content));
            cardBody.appendChild(txt);
        }
        
        card.appendChild(cardBody);

        // Bottom section containing Meta and Actions
        const bottom = el('div', 'card-bottom');

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
        bottom.appendChild(meta);

        // Actions
        const actions = el('div', 'card-actions');

        const viewBtn = el('button', 'action-btn icon-only'); 
        viewBtn.innerHTML = ICONS.view;
        viewBtn.title = "View details";
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPreview(item, inCollection);
        });
        actions.appendChild(viewBtn);

        const copyBtn = el('button', 'action-btn btn-primary'); 
        copyBtn.innerHTML = ICONS.copy + ' Copy';
        copyBtn.title = "Copy to clipboard";
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyItem(item, copyBtn, false);
        });
        actions.appendChild(copyBtn);

        if (item.type === 'image') {
            const lensBtn = el('button', 'action-btn icon-only btn-lens'); 
            lensBtn.innerHTML = ICONS.lens;
            lensBtn.title = "Open in Google Lens";
            lensBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openInGoogleLens(item.content);
            });
            actions.appendChild(lensBtn);
        }

        if (!inCollection) {
            // Dropdown wrap
            const dropWrap = el('div', 'dropdown-wrap');
            const saveBtn = el('button', 'action-btn icon-only'); 
            saveBtn.innerHTML = ICONS.folder;
            saveBtn.title = "Save to collection";
            
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
                                loadRecent(shadow.getElementById('search-input').value, true);
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
            const delBtn = el('button', 'action-btn icon-only btn-danger'); 
            delBtn.innerHTML = ICONS.del;
            delBtn.title = "Delete item";
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                chrome.runtime.sendMessage({ action: 'deleteItem', itemId: item.id }, () => card.remove());
            });
            actions.appendChild(delBtn);
        }

        bottom.appendChild(actions);
        card.appendChild(bottom);

        // Explicitly only bind paste to the card body (avoids common ancestor click bugs when hand shakes)
        cardBody.addEventListener('click', (e) => {
            copyItem(item, copyBtn, true);
        });

        return card;
    }

    // Hide dropdowns on outside click and close panel if clicked outside
    document.addEventListener('mousedown', (e) => {
        const path = e.composedPath();
        const isInsideWrap = path.some(el => el.classList && el.classList.contains('dropdown-wrap'));
        
        if (!isInsideWrap && shadow.querySelectorAll) {
            shadow.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
        }
        if (panel.classList.contains('open') && !e.composedPath().includes(host)) {
            closePanel();
        }
    });

    // ---- Copy logic ----
    function copyItem(item, btnElement, shouldPaste = false) {
        ignoreSyncUntil = Date.now() + 1500; // Ignore clipboard changes caused by us

        if (item.type === 'text' || item.type === 'link') {
            lastSyncedText = item.content.trim();
            lastSyncedImageSize = null;
        } else if (item.type === 'image') {
            lastSyncedText = null;
            const b64Data = item.content.split(',')[1] || item.content;
            lastSyncedImageSize = Math.round((b64Data.length * 3) / 4);
        }

        const originalText = btnElement.innerHTML;
        const isIconOnly = btnElement.classList.contains('icon-only');
        btnElement.innerHTML = isIconOnly ? ICONS.check : ICONS.check + ' Copied';
        btnElement.style.background = 'rgba(16,185,129,0.1)';
        btnElement.style.color = 'var(--mc-green)';
        btnElement.style.borderColor = 'rgba(16,185,129,0.3)';

        if (shouldPaste) closePanel();

        const handlePasteAttempt = () => {
            if (shouldPaste) {
                if (lastActiveElement) {
                    lastActiveElement.focus();
                    try {
                        // Attempt to use native OS paste using default clipboard
                        if (document.execCommand('paste')) return; 
                    } catch (e) {}
                }
                // Fallback if native paste is blocked
                const isMac = navigator.userAgent.toLowerCase().includes('mac');
                showToast(`Copied! Press ${isMac ? 'Cmd' : 'Ctrl'}+V to paste`);
            }
        };

        // Write to system clipboard and then try to paste
        if (item.type === 'text' || item.type === 'link') {
            navigator.clipboard.writeText(item.content).then(handlePasteAttempt).catch(()=>{});
        } else if (item.type === 'image') {
            fetch(item.content).then(r => r.blob()).then(blob => {
                navigator.clipboard.write([
                    new ClipboardItem({ [item.mime || 'image/png']: blob })
                ]).then(handlePasteAttempt).catch(()=>{});
            });
        }

        setTimeout(() => {
            btnElement.innerHTML = originalText;
            btnElement.style.color = '';
            btnElement.style.background = '';
            btnElement.style.borderColor = '';
        }, 1500);
    }

    // ---- Open In Google Lens (100% Free client-side upload) ----
    async function openInGoogleLens(b64Data) {
        try {
            await chrome.storage.local.set({ lensImage: b64Data });
            chrome.runtime.sendMessage({ action: 'openLens' });
        } catch (e) {
            showToast('Failed to open Google Lens', true);
        }
    }

    // ---- Inline Preview ----
    function showPreview(item, inCollection) {
        const vBody = shadow.getElementById('view-body');
        const vFoot = shadow.getElementById('view-footer');
        vBody.innerHTML = ''; vFoot.innerHTML = '';

        if (item.type === 'image') {
            const container = el('div', 'lens-container');
            const wrapper = el('div', 'lens-wrapper');
            const img = document.createElement('img');
            img.src = item.content; img.className = 'view-img';
            
            const overlay = el('div', 'lens-overlay');
            wrapper.append(img, overlay);
            container.appendChild(wrapper);

            // Floating Zoom controls
            const zCtrl = el('div', 'zoom-controls');
            const zIn = el('button', 'zoom-btn'); zIn.innerHTML = ICONS.zoomIn; zIn.title = "Zoom In";
            const zOut = el('button', 'zoom-btn'); zOut.innerHTML = ICONS.zoomOut; zOut.title = "Zoom Out";
            const zRst = el('button', 'zoom-btn'); zRst.innerHTML = ICONS.reset; zRst.title = "Reset";
            zCtrl.append(zIn, zOut, zRst);
            container.appendChild(zCtrl);
            
            vBody.appendChild(container);

            // Zoom & Pan State
            let scale = 1.0;
            let panX = 0, panY = 0;
            let isMouseDown = false;
            let startX, startY;

            // Accurate Aspect Ratio display calculation
            img.onload = () => {
                const natW = img.naturalWidth;
                const natH = img.naturalHeight;
                const containerW = container.clientWidth || 320;
                const containerH = 320;

                const ratio = natW / natH;
                let displayW, displayH;
                if (containerW / containerH > ratio) {
                    displayH = containerH;
                    displayW = containerH * ratio;
                } else {
                    displayW = containerW;
                    displayH = containerW / ratio;
                }

                // Explicitly lock wrapper to exact rendered image size
                wrapper.style.width = displayW + 'px';
                wrapper.style.height = displayH + 'px';
                img.style.width = '100%';
                img.style.height = '100%';
            };

            const updateTransform = () => {
                wrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
                if (scale > 1.0) {
                    container.classList.add('zoomed');
                } else {
                    container.classList.remove('zoomed');
                    panX = 0; panY = 0;
                    wrapper.style.transform = `translate(0px, 0px) scale(1)`;
                }
            };

            zIn.addEventListener('click', (e) => { e.stopPropagation(); scale = Math.min(3.5, scale + 0.5); updateTransform(); });
            zOut.addEventListener('click', (e) => { e.stopPropagation(); scale = Math.max(1.0, scale - 0.5); updateTransform(); });
            zRst.addEventListener('click', (e) => { e.stopPropagation(); scale = 1.0; updateTransform(); });

            // Handle Drag/Pan on Container
            container.addEventListener('mousedown', (e) => {
                if (scale <= 1.0) return;
                
                isMouseDown = true;
                startX = e.clientX - panX;
                startY = e.clientY - panY;
                e.preventDefault(); // prevent selection while panning
            });

            const onMouseMove = (e) => {
                if (!isMouseDown || scale <= 1.0) return;
                panX = e.clientX - startX;
                panY = e.clientY - startY;

                // Restrict pan boundary to prevent pulling image off screen
                const maxPan = 400;
                panX = Math.max(-maxPan, Math.min(maxPan, panX));
                panY = Math.max(-maxPan, Math.min(maxPan, panY));

                wrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
            };

            const onMouseUp = () => { isMouseDown = false; };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);

            // Clean up window listeners when view closes
            shadow.getElementById('btn-view-back').addEventListener('click', () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            }, { once: true });

            const lensBtn = el('button', 'action-btn btn-lens'); lensBtn.innerHTML = ICONS.lens + ' Google Lens';
            lensBtn.addEventListener('click', () => openInGoogleLens(item.content));
            vFoot.appendChild(lensBtn);
        } else {
            const txt = el('div', 'view-text'); txt.textContent = item.content;
            vBody.appendChild(txt);
        }

        const cp = el('button', 'action-btn'); cp.innerHTML = ICONS.copy + ' Copy';
        cp.addEventListener('click', () => copyItem(item, cp));
        vFoot.appendChild(cp);

        panel.classList.add('view-mode');
    }

    // ---- OS Clipboard Sync ----

    let syncPromise = null;
    let syncPromiseHasGesture = false;
    function syncClipboard() {
        if (Date.now() < ignoreSyncUntil) {
            console.log('NeoClip [Sync]: Sync ignored (triggered by own copy).');
            return Promise.resolve(false);
        }
        
        const currentHasGesture = !!(navigator.userActivation && navigator.userActivation.isActive);
        if (syncPromise) {
            if (syncPromiseHasGesture || !currentHasGesture) {
                return syncPromise;
            }
        }

        syncPromiseHasGesture = currentHasGesture;
        syncPromise = (async () => {
            try {
                console.log('NeoClip [Sync]: Requesting background offscreen sync...');
                const res = await new Promise(r => {
                    try {
                        chrome.runtime.sendMessage({ action: 'syncClipboard' }, r);
                    } catch (e) {
                        r(null);
                    }
                });
                console.log('NeoClip [Sync]: Background sync result:', res);
                return res && res.isNew;
            } catch (err) {
                console.error('NeoClip [Sync]: syncPromise error:', err);
                return false;
            }
        })().finally(() => {
            syncPromise = null;
            syncPromiseHasGesture = false;
        });

        return syncPromise;
    }

    function triggerBubbleBounce() {
        bubble.classList.add('mc-bounce');
        bubble.classList.add('mc-pulse');
        setTimeout(() => {
            bubble.classList.remove('mc-bounce');
            bubble.classList.remove('mc-pulse');
        }, 800);
    }

    // ---- Copy Event (Robust delayed reader) ----
    document.addEventListener('copy', () => {
        setTimeout(async () => {
            const isNew = await syncClipboard();
            if (isNew) {
                triggerBubbleBounce();
            }
        }, 150);
    });

    // ---- Real-time listeners ----
    chrome.runtime.onMessage.addListener((req) => {
        if (req.action === 'clipboardUpdated') {
            if (req.item) {
                if (req.item.type === 'image') {
                    const b64Data = req.item.content.split(',')[1] || req.item.content;
                    lastSyncedImageSize = Math.round((b64Data.length * 3) / 4);
                    lastSyncedText = null;
                } else {
                    lastSyncedText = req.item.content.trim();
                    lastSyncedImageSize = null;
                }
            }
            if (!panel.classList.contains('open')) {
                triggerBubbleBounce();
            } else if (currentTab === 'recent') {
                loadRecent(shadow.getElementById('search-input').value, true);
            }
        }
        if (req.action === 'togglePanel') {
            lastActiveElement = document.activeElement;
            togglePanel();
        }
        if (req.action === 'storageCleared') {
            if (panel.classList.contains('open')) {
                showTab('recent'); // Forces a fresh reload of empty data
            }
        }
    });

    window.addEventListener('focus', () => {
        // Delay to allow external apps (like Snipping Tool) to finish writing and release OS clipboard lock
        setTimeout(async () => {
            const isNew = await syncClipboard();
            if (isNew && !panel.classList.contains('open')) {
                triggerBubbleBounce();
            } else if (panel.classList.contains('open') && currentTab === 'recent') {
                loadRecent(shadow.getElementById('search-input').value, true);
            }
        }, 300);
    });

    // Auto-sync on first user interaction with the page (fixes missing clipboard when no focus event fires on new tabs)
    const firstInteractionSync = async () => {
        const isNew = await syncClipboard();
        if (isNew) {
            if (!panel.classList.contains('open')) {
                triggerBubbleBounce();
            } else if (currentTab === 'recent') {
                loadRecent(shadow.getElementById('search-input').value, true);
            }
        }
    };
    document.addEventListener('click', firstInteractionSync, { once: true, capture: true });
    document.addEventListener('keydown', firstInteractionSync, { once: true, capture: true });

    // Note: The physical paste listener was removed because it caused confusion where pressing Ctrl+V would also add the pasted content back into NeoClip. 
    // We now rely solely on the focus/polling mechanisms to capture copies.

    // Helpers
    function el(tag, cls, text) { const e = document.createElement(tag); if(cls) e.className=cls; if(text!==undefined) e.textContent=text; return e; }
    function esc(s) { return s?s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'):''; }
    function timeAgo(ts) {
        const s = Math.floor((Date.now()-ts)/1000);
        if(s<60) return 'just now'; const m=Math.floor(s/60);
        if(m<60) return `${m}m ago`; const h=Math.floor(m/60);
        if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`;
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
            // Fallback to uncompressed if bitmap fails
            return new Promise((resolve) => {
                const rd = new FileReader();
                rd.onloadend = () => resolve(rd.result);
                rd.readAsDataURL(blob);
            });
        }
    }

    // ---- Active Tab Focus Polling ----
    setInterval(async () => {
        try {
            if (document.hasFocus() && Date.now() >= ignoreSyncUntil) {
                const isNew = await syncClipboard();
                if (isNew) {
                    if (!panel.classList.contains('open')) {
                        triggerBubbleBounce();
                    } else if (currentTab === 'recent') {
                        loadRecent(shadow.getElementById('search-input').value, true);
                    }
                }
            }
        } catch (e) {
            console.error('NeoClip: Focus polling error:', e);
        }
    }, 1500);
})();
