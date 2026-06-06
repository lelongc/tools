let popupWindowId = null;

// Toggle widget in the active tab when clicking extension icon
chrome.action.onClicked.addListener(async (tab) => {
    if (popupWindowId !== null) {
        try {
            const win = await chrome.windows.get(popupWindowId);
            if (win) {
                // Focus existing window
                chrome.windows.update(popupWindowId, { focused: true });
                return;
            }
        } catch (e) {
            // Window doesn't exist anymore
            popupWindowId = null;
        }
    }

    // Get current window bounds to position popup
    let left = 0;
    let top = 0;
    try {
        const currentWin = await chrome.windows.get(tab.windowId);
        // Position on the right edge
        left = currentWin.left + currentWin.width - 450;
        top = currentWin.top;
        if (left < 0) left = 0;
    } catch(e) {}

    // Create new popup window
    chrome.windows.create({
        url: 'app.html',
        type: 'popup',
        width: 450,
        height: 800,
        left: Math.round(left),
        top: Math.round(top),
        focused: true
    }, (win) => {
        popupWindowId = win.id;
    });
});

chrome.windows.onRemoved.addListener((windowId) => {
    if (windowId === popupWindowId) {
        popupWindowId = null;
    }
});

// Add rule to bypass iframe restrictions for our sidebar
chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: [{
            id: 1,
            priority: 1,
            action: {
                type: 'modifyHeaders',
                responseHeaders: [
                    { header: 'X-Frame-Options', operation: 'remove' },
                    { header: 'Content-Security-Policy', operation: 'remove' }
                ]
            },
            condition: {
                initiatorDomains: [chrome.runtime.id],
                resourceTypes: ['sub_frame']
            }
        }]
    });
});
