document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-current-tab-btn');
    const linksContainer = document.getElementById('links-container');
    const template = document.getElementById('link-item-template');
    
    // Viewer elements
    const viewerContainer = document.getElementById('viewer-container');
    const iframe = document.getElementById('content-viewer');
    const viewerTitle = document.getElementById('viewer-title');
    const closeViewerBtn = document.getElementById('close-viewer-btn');
    const openNewTabBtn = document.getElementById('open-new-tab-btn');
    const fallbackOpenTabBtn = document.getElementById('fallback-open-tab-btn');

    let currentViewerUrl = '';

    // Load saved links
    loadLinks();

    // Event Listeners
    addBtn.addEventListener('click', saveCurrentTab);
    
    closeViewerBtn.addEventListener('click', () => {
        viewerContainer.classList.remove('active');
        setTimeout(() => {
            viewerContainer.classList.add('viewer-hidden');
            iframe.src = '';
        }, 300); // match transition duration
    });

    openNewTabBtn.addEventListener('click', () => {
        if (currentViewerUrl) {
            chrome.tabs.create({ url: currentViewerUrl });
        }
    });

    fallbackOpenTabBtn.addEventListener('click', () => {
        if (currentViewerUrl) {
            chrome.tabs.create({ url: currentViewerUrl });
        }
    });

    function loadLinks() {
        chrome.storage.local.get(['savedLinks'], (result) => {
            const links = result.savedLinks || [];
            renderLinks(links);
        });
    }

    function saveCurrentTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            const tab = tabs[0];
            
            // Avoid saving chrome:// or edge:// URLs
            if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
                alert('Cannot save browser internal pages.');
                return;
            }

            chrome.storage.local.get(['savedLinks'], (result) => {
                const links = result.savedLinks || [];
                
                // Check if already exists
                if (links.some(l => l.url === tab.url)) {
                    return; // Already saved
                }

                const newLink = {
                    title: tab.title || tab.url,
                    url: tab.url,
                    favicon: tab.favIconUrl || ''
                };

                links.unshift(newLink);
                chrome.storage.local.set({ savedLinks: links }, () => {
                    loadLinks();
                });
            });
        });
    }

    function removeLink(urlToRemove) {
        chrome.storage.local.get(['savedLinks'], (result) => {
            let links = result.savedLinks || [];
            links = links.filter(l => l.url !== urlToRemove);
            chrome.storage.local.set({ savedLinks: links }, () => {
                loadLinks();
            });
        });
    }

    function openViewer(url, title) {
        currentViewerUrl = url;
        viewerTitle.textContent = title;
        iframe.src = url;
        
        viewerContainer.classList.remove('viewer-hidden');
        // Small delay to allow display:block to apply before animating transform
        requestAnimationFrame(() => {
            viewerContainer.classList.add('active');
        });
        
        // We no longer show the error message by default since we're stripping X-Frame-Options
        document.getElementById('iframe-error-msg').classList.add('hidden');
    }

    function renderLinks(links) {
        linksContainer.innerHTML = '';
        
        if (links.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.style.padding = '16px';
            emptyState.style.textAlign = 'center';
            emptyState.style.color = 'var(--text-secondary)';
            emptyState.style.fontSize = '0.9rem';
            emptyState.textContent = 'No links saved yet. Click the + button to add the current tab.';
            linksContainer.appendChild(emptyState);
            return;
        }

        links.forEach(link => {
            const clone = template.content.cloneNode(true);
            const item = clone.querySelector('.link-item');
            const favicon = clone.querySelector('.favicon');
            const title = clone.querySelector('.link-title');
            const url = clone.querySelector('.link-url');
            const removeBtn = clone.querySelector('.remove-btn');
            const openTabBtn = clone.querySelector('.open-tab-btn');

            title.textContent = link.title;
            url.textContent = link.url;
            
            if (link.favicon) {
                favicon.src = link.favicon;
            } else {
                // Fallback generic icon
                favicon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%235f6368" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
            }

            // Click item to open in viewer
            item.addEventListener('click', (e) => {
                if (e.target.closest('button')) return; // Ignore button clicks
                openViewer(link.url, link.title);
            });

            // Open tab btn
            openTabBtn.addEventListener('click', () => {
                chrome.tabs.create({ url: link.url });
            });

            // Remove btn
            removeBtn.addEventListener('click', () => {
                removeLink(link.url);
            });

            linksContainer.appendChild(clone);
        });
    }
});
