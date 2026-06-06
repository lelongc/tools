document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-current-tab-btn');
    const linksContainer = document.getElementById('links-container');
    const template = document.getElementById('link-item-template');
    
    // Viewer elements
    const viewerContainer = document.getElementById('viewer-container');
    const iframeWrapper = document.getElementById('iframe-wrapper');
    const viewerTitle = document.getElementById('viewer-title');
    const minimizeBtn = document.getElementById('minimize-btn');
    const closeIframeBtn = document.getElementById('close-iframe-btn');
    const removeBtn = document.getElementById('remove-btn');
    const openNewTabBtn = document.getElementById('open-new-tab-btn');

    let currentViewerUrl = '';
    const iframePool = {}; // url -> iframe element

    // Load saved links
    loadLinks();

    // Event Listeners
    addBtn.addEventListener('click', saveCurrentTab);
    
    minimizeBtn.addEventListener('click', () => {
        hideViewer();
    });

    closeIframeBtn.addEventListener('click', () => {
        if (currentViewerUrl && iframePool[currentViewerUrl]) {
            iframePool[currentViewerUrl].remove();
            delete iframePool[currentViewerUrl];
        }
        hideViewer();
    });

    openNewTabBtn.addEventListener('click', () => {
        if (currentViewerUrl) {
            chrome.tabs.create({ url: currentViewerUrl });
        }
    });

    removeBtn.addEventListener('click', () => {
        if (currentViewerUrl) {
            removeLink(currentViewerUrl);
            hideViewer();
        }
    });

    function hideViewer() {
        viewerContainer.classList.add('viewer-hidden');
        // Clear active states
        document.querySelectorAll('.link-item').forEach(item => item.classList.remove('active'));
        
        // Shrink the popup window
        chrome.windows.getCurrent((win) => {
            chrome.windows.update(win.id, { width: 60 }); 
        });
    }

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
            
            if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
                alert('Cannot save browser internal pages.');
                return;
            }

            chrome.storage.local.get(['savedLinks'], (result) => {
                const links = result.savedLinks || [];
                
                if (links.some(l => l.url === tab.url)) {
                    openViewer(tab.url, tab.title || tab.url);
                    return; 
                }

                const newLink = {
                    title: tab.title || tab.url,
                    url: tab.url,
                    favicon: tab.favIconUrl || ''
                };

                links.unshift(newLink);
                chrome.storage.local.set({ savedLinks: links }, () => {
                    loadLinks();
                    openViewer(newLink.url, newLink.title);
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
                
                // Remove iframe from pool if exists
                if (iframePool[urlToRemove]) {
                    iframePool[urlToRemove].remove();
                    delete iframePool[urlToRemove];
                }
            });
        });
    }

    function openViewer(url, title) {
        currentViewerUrl = url;
        viewerTitle.textContent = title;
        
        // Hide all iframes
        Object.values(iframePool).forEach(ifr => ifr.classList.remove('active'));

        // Check if iframe exists in pool
        if (iframePool[url]) {
            iframePool[url].classList.add('active');
        } else {
            // Create new iframe
            const newIframe = document.createElement('iframe');
            newIframe.className = 'dynamic-iframe active';
            newIframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups';
            newIframe.src = url;
            iframeWrapper.appendChild(newIframe);
            iframePool[url] = newIframe;
        }
        
        viewerContainer.classList.remove('viewer-hidden');
        
        // Expand the popup window
        chrome.windows.getCurrent((win) => {
            chrome.windows.update(win.id, { width: 450 }); 
        });
        
        // Update active state in list
        document.querySelectorAll('.link-item').forEach(item => {
            if (item.dataset.url === url) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function renderLinks(links) {
        linksContainer.innerHTML = '';
        
        links.forEach(link => {
            const clone = template.content.cloneNode(true);
            const item = clone.querySelector('.link-item');
            const favicon = clone.querySelector('.favicon');

            item.title = link.title + '\n' + link.url;
            item.dataset.url = link.url;
            
            if (link.favicon) {
                favicon.src = link.favicon;
            } else {
                favicon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%235f6368" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg>';
            }

            if (link.url === currentViewerUrl && !viewerContainer.classList.contains('viewer-hidden')) {
                item.classList.add('active');
            }

            item.addEventListener('click', () => {
                // If clicking the already active one, toggle it off (minimize)
                if (item.classList.contains('active')) {
                    hideViewer();
                } else {
                    openViewer(link.url, link.title);
                }
            });

            linksContainer.appendChild(clone);
        });
    }
});
