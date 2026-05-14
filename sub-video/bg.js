let activeTabs = new Set();

chrome.action.onClicked.addListener(async (tab) => {
  const newState = !activeTabs.has(tab.id);
  
  if (newState) {
    activeTabs.add(tab.id);
    chrome.action.setBadgeText({ text: 'ON', tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#22c55e', tabId: tab.id });
  } else {
    activeTabs.delete(tab.id);
    chrome.action.setBadgeText({ text: '', tabId: tab.id });
  }

  // Gửi tin nhắn tới TẤT CẢ các frame (bao gồm cả iframe chứa video player)
  try {
    const frames = await chrome.webNavigation.getAllFrames({ tabId: tab.id });
    for (const frame of frames) {
      chrome.tabs.sendMessage(tab.id, { action: 'toggle', state: newState }, { frameId: frame.frameId }).catch(()=>{});
    }
  } catch (e) {
    // Fallback nếu không có webNavigation
    chrome.tabs.sendMessage(tab.id, { action: 'toggle', state: newState }).catch(()=>{});
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'fetch_video' && msg.url) {
    console.log('[BG] Đang tải hộ video:', msg.url);
    fetch(msg.url)
      .then(r => r.arrayBuffer())
      .then(buf => {
        chrome.tabs.sendMessage(sender.tab.id, { action: 'full_audio_ready', buffer: buf });
      })
      .catch(e => console.error('[BG] Lỗi tải hộ:', e));
  }
});
