let activeTabs = new Set();

chrome.action.onClicked.addListener((tab) => {
  if (activeTabs.has(tab.id)) {
    activeTabs.delete(tab.id);
    chrome.tabs.sendMessage(tab.id, { action: 'toggle', state: false }).catch(()=>{});
    chrome.action.setBadgeText({ text: '', tabId: tab.id });
  } else {
    activeTabs.add(tab.id);
    chrome.tabs.sendMessage(tab.id, { action: 'toggle', state: true }).catch(()=>{});
    chrome.action.setBadgeText({ text: 'ON', tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#22c55e', tabId: tab.id });
  }
});
