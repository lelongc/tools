let isRecording = false;
let activeTabId = null;
let nativePort = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getState") {
    sendResponse({ isRecording });
  } else if (message.type === "startCapture") {
    activeTabId = message.tabId;
    startCapture(activeTabId, message.sourceLang);
  } else if (message.type === "stopCapture") {
    stopCapture();
  } else if (message.type === "subtitle") {
    // Forward subtitle to content script
    if (activeTabId) {
      chrome.tabs.sendMessage(activeTabId, { type: "subtitle", text: message.text }).catch(() => {});
    }
  }
  return true;
});

async function startCapture(tabId, sourceLang) {
  if (isRecording) return;
  isRecording = true;
  
  // Inject content script for subtitle UI
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"]
    });
  } catch(e) {}
  
  chrome.tabCapture.getMediaStreamId({ targetTabId: tabId }, async (streamId) => {
    if (!streamId) {
      isRecording = false;
      chrome.tabs.sendMessage(tabId, { type: "subtitle", text: "Lỗi: Không lấy được luồng âm thanh từ Tab này!" }).catch(() => {});
      return;
    }
    
    try {
      nativePort = chrome.runtime.connectNative('com.mydub.server');
      nativePort.onDisconnect.addListener(() => {
        nativePort = null;
        let errMsg = chrome.runtime.lastError ? chrome.runtime.lastError.message : "Native port disconnected";
        chrome.tabs.sendMessage(tabId, { type: "subtitle", text: "Lỗi Native Messaging: " + errMsg }).catch(() => {});
      });
    } catch(e) {
      chrome.tabs.sendMessage(tabId, { type: "subtitle", text: "Lỗi: Không thể khởi chạy Server tự động." }).catch(() => {});
    }

    chrome.tabs.sendMessage(tabId, { type: "subtitle", text: "Đã lấy luồng âm thanh, đang khởi động hệ thống..." }).catch(() => {});
    await setupOffscreenDocument('offscreen.html');
    chrome.runtime.sendMessage({
      type: "start-recording",
      target: "offscreen",
      streamId: streamId,
      sourceLang: sourceLang || "en"
    });
  });
}

async function stopCapture() {
  isRecording = false;
  if (nativePort) {
    nativePort.disconnect();
    nativePort = null;
  }
  chrome.runtime.sendMessage({
    type: "stop-recording",
    target: "offscreen"
  });
  if (activeTabId) {
    chrome.tabs.sendMessage(activeTabId, { type: "stop" }).catch(() => {});
  }
}

let creating;
async function setupOffscreenDocument(path) {
  const offscreenUrl = chrome.runtime.getURL(path);
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl]
  });

  if (existingContexts.length > 0) {
    return;
  }

  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ['USER_MEDIA'],
      justification: 'Recording tab audio'
    });
    await creating;
    creating = null;
  }
}
