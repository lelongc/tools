let currentState = {
  isRunning: false,
  status: 'Idle',
  config: null,
  groups: [],
  currentBatchIndex: 0,
  currentGroupIndex: 0, // Vị trí trong mẻ
  // checkedOffset: lưu offset nếu dùng cơ chế đăng chéo FB
  checkedOffset: 0
};

// Listen for messages from Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getState') {
    sendResponse(currentState);
    return true;
  }
  
  if (request.action === 'start') {
    startBot(request.config);
    sendResponse({ success: true });
    return true;
  }

  if (request.action === 'stop') {
    stopBot();
    sendResponse({ success: true });
    return true;
  }
});

function broadcastState() {
  chrome.runtime.sendMessage({ action: 'stateUpdate', state: currentState }).catch(() => {});
}

async function startBot(config) {
  if (currentState.isRunning) return;

  currentState = {
    isRunning: true,
    status: 'Đang tìm kiếm...',
    config: config,
    groups: [],
    currentBatchIndex: 0,
    currentGroupIndex: 0,
    checkedOffset: 0
  };
  broadcastState();

  try {
    // 1. Mở tab tìm kiếm
    const searchUrl = `https://www.facebook.com/search/top?q=${encodeURIComponent(config.keyword)}`;
    const tab = await chrome.tabs.create({ url: searchUrl });

    // 2. Chờ tab load và gửi lệnh quét nhóm
    currentState.status = 'Đang quét danh sách nhóm...';
    broadcastState();
    
    // Inject scripts manual explicitly just in case caching issues although it should be on by default in manifest
    // await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content/actor.js'] });
    
    // Dùng setTimeout/Listeners đợi tab load, nhưng Mv3 dùng tab.onUpdated
    waitForTabLoad(tab.id, async () => {
      chrome.tabs.sendMessage(tab.id, { action: 'filterGroups', config }, async (response) => {
        if (!response || !response.success || response.groups.length === 0) {
          currentState.status = 'Không tìm thấy nhóm nào. Dừng.';
          stopBot();
          return;
        }

        currentState.groups = response.groups;
        currentState.status = `Tìm thấy ${currentState.groups.length} nhóm. Bắt đầu đăng...`;
        broadcastState();

        // Bắt đầu chu trình đăng
        await processBatch(tab.id);
      });
    });

  } catch (error) {
    currentState.status = `Lỗi: ${error.message}`;
    stopBot();
  }
}

function stopBot() {
  currentState.isRunning = false;
  if (!currentState.status.includes('Lỗi')) {
    currentState.status = 'Đã dừng.';
  }
  broadcastState();
}

// Logic chờ tab load (rất cơ bản, có thể cần robust hơn)
function waitForTabLoad(tabId, callback) {
  chrome.tabs.onUpdated.addListener(function listener(tId, info) {
    if (tId === tabId && info.status === 'complete') {
      chrome.tabs.onUpdated.removeListener(listener);
      // Đợi thêm tí cho DOM FB render
      setTimeout(callback, 3000);
    }
  });
}

async function processBatch(tabId) {
  if (!currentState.isRunning) return;

  const totalGroups = currentState.groups.length;
  // Cơ chế đơn giản: ta chạy lần lượt qua mảng nhóm và coi nó là group gốc.
  // Group gốc sẽ chứa "Đăng chéo".
  // Nếu bot không chéo được, nó sẽ quay lại làm group tiếp theo.

  if (currentState.currentGroupIndex >= totalGroups) {
    currentState.status = 'Hoàn thành đăng tất cả nhóm.';
    stopBot();
    return;
  }

  const currentUrl = currentState.groups[currentState.currentGroupIndex];
  currentState.status = `Đang vào nhóm: ${currentState.currentGroupIndex + 1}/${totalGroups}`;
  broadcastState();

  // Mở/Chuyển tab group
  chrome.tabs.update(tabId, { url: currentUrl });
  
  waitForTabLoad(tabId, () => {
    // Inject content config
    const actorConfig = {
      ...currentState.config,
      isCrossPostBatch: currentState.config.batchSize > 1,
      checkedOffset: currentState.checkedOffset
    };

    chrome.tabs.sendMessage(tabId, { action: 'postToGroup', config: actorConfig }, async (response) => {
      if (!currentState.isRunning) return;

      if (!response || !response.success) {
        console.log(`Bỏ qua nhóm ${currentUrl}: ${response ? response.reason : 'No response'}`);
      } else {
        console.log(`Đã đăng thành công trên nhóm ${currentUrl}`);
        // Nếu có batch size, update offset
        if (currentState.config.batchSize > 1) {
           currentState.checkedOffset += (currentState.config.batchSize - 1);
        }
      }

      // Next group
      currentState.currentGroupIndex++;
      
      // Delay giữa các đợt đăng để tránh spam
      currentState.status = 'Nghỉ ngơi chống block...';
      broadcastState();
      
      const restTimeMs = (Math.floor(Math.random() * 5) + 5) * 1000; // 5-10s cho an toàn
      setTimeout(() => {
        processBatch(tabId);
      }, restTimeMs);
    });
  });
}
