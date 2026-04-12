// Quản lý việc lập lịch và kích hoạt Macro

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const result = await chrome.storage.local.get('macros');
  const macros = result.macros || [];
  
  const macro = macros.find(m => m.id === alarm.name);
  if (!macro || !macro.enabled) return;
  
  // Khi báo thức nổ, tạo một tab mới với URL gốc của Macro
  chrome.tabs.create({ url: macro.startUrl, active: true }, (tab) => {
    // Chờ tab load xong
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        
        // Bắt đầu tiêm mã phát lại
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content/replayer.js']
        }, () => {
          // Gửi dữ liệu Macro cho bộ Replay
          setTimeout(() => {
            chrome.tabs.sendMessage(tab.id, {
              action: 'REPLAY_MACRO',
              actions: macro.actions
            });
          }, 500); // Đợi DOM fully painted
        });
      }
    });
  });
  
  // Tự động lên lịch cho ngày mai
  scheduleMacro(macro);
});

// Hàm thiết lập hẹn giờ
function scheduleMacro(macro) {
  if (!macro.enabled || !macro.time) return;
  
  const [hours, minutes] = macro.time.split(':').map(Number);
  let target = new Date();
  target.setHours(hours, minutes, 0, 0);
  
  if (target.getTime() <= Date.now()) {
    target.setDate(target.getDate() + 1); // Sang ngày hôm sau
  }
  
  chrome.alarms.create(macro.id, {
    when: target.getTime()
  });
}

function clearMacroAlarm(id) {
  chrome.alarms.clear(id);
}

// Lắng nghe messages từ Popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'SCHEDULE_MACRO') {
    scheduleMacro(msg.macro);
    sendResponse({success: true});
  } else if (msg.action === 'CLEAR_MACRO') {
    clearMacroAlarm(msg.id);
    sendResponse({success: true});
  }
  return true;
});

// Khôi phục các báo thức khi khởi động lại Chrome
chrome.runtime.onStartup.addListener(async () => {
  const result = await chrome.storage.local.get('macros');
  const macros = result.macros || [];
  macros.forEach(macro => {
    if (macro.enabled) scheduleMacro(macro);
  });
});
