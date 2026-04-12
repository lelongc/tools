// background.js — Click Tracker Service Worker
console.log("[ClickTracker] 🚀 Service Worker đang chạy (Version: DATA_URL_SAFE)");

// Khởi tạo storage mặc định
chrome.runtime.onInstalled.addListener(() => {
  console.log("[ClickTracker] Extension đã được cài đặt/cập nhật.");
  chrome.storage.local.set({
    isRecording: false,
    events: [],
    startTime: null
  });
});

// Lắng nghe messages từ content script và popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  // ===== BẮT ĐẦU GHI =====
  if (msg.action === "START_RECORDING") {
    const startTime = Date.now();
    chrome.storage.local.set({
      isRecording: true,
      events: [],
      startTime: startTime
    }, () => {
      // Thông báo tất cả content scripts
      broadcastToAllTabs({ action: "RECORDING_STATE", isRecording: true });
      sendResponse({ status: "started" });
    });
    return true;
  }

  // ===== DỪNG GHI =====
  else if (msg.action === "STOP_RECORDING") {
    chrome.storage.local.set({ isRecording: false }, () => {
      broadcastToAllTabs({ action: "RECORDING_STATE", isRecording: false });
      sendResponse({ status: "stopped" });
    });
    return true;
  }

  // ===== NHẬN EVENT TỪ CONTENT SCRIPT =====
  else if (msg.action === "TRACK_EVENT") {
    // Luôn check storage thay vì biến in-memory
    chrome.storage.local.get(["isRecording", "events"], (res) => {
      if (!res.isRecording) return;

      const events = res.events || [];
      events.push(msg.event);
      chrome.storage.local.set({ events: events }, () => {
        // Forward tới popup (nếu đang mở)
        try {
          chrome.runtime.sendMessage({
            action: "NEW_EVENT_LOG",
            event: msg.event,
            totalCount: events.length
          });
        } catch (e) { /* popup đóng, bỏ qua */ }
      });
    });
    // Không cần sendResponse cho event tracking
    return false;
  }

  // ===== XUẤT JSON =====
  else if (msg.action === "EXPORT_JSON") {
    chrome.storage.local.get(["events", "startTime"], (res) => {
      const output = buildExportJSON(res.events || [], res.startTime);
      const jsonStr = JSON.stringify(output, null, 2);
      const dataUrl = "data:application/json;charset=utf-8," + encodeURIComponent(jsonStr);
      const filename = `recording_${formatDateForFile()}.json`;

      chrome.downloads.download({ url: dataUrl, filename: filename, saveAs: true });
    });
    sendResponse({ status: "exporting" });
    return false;
  }

  // ===== XUẤT TEXT =====
  else if (msg.action === "EXPORT_TEXT") {
    chrome.storage.local.get(["events", "startTime"], (res) => {
      const text = buildExportText(res.events || [], res.startTime);
      const dataUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
      const filename = `recording_${formatDateForFile()}.txt`;

      chrome.downloads.download({ url: dataUrl, filename: filename, saveAs: true });
    });
    sendResponse({ status: "exporting" });
    return false;
  }

  // ===== XÓA LOG =====
  else if (msg.action === "CLEAR_EVENTS") {
    chrome.storage.local.set({ events: [], startTime: null }, () => {
      sendResponse({ status: "cleared" });
    });
    return true;
  }

  // ===== LẤY TRẠNG THÁI =====
  else if (msg.action === "GET_STATE") {
    chrome.storage.local.get(["isRecording", "events", "startTime"], (res) => {
      sendResponse({
        isRecording: res.isRecording || false,
        eventCount: (res.events || []).length,
        startTime: res.startTime,
        events: res.events || []
      });
    });
    return true;
  }

  return false;
});

// Gửi message đến tất cả các tab
function broadcastToAllTabs(message) {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id && tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("edge://")) {
        chrome.tabs.sendMessage(tab.id, message).catch(() => {});
      }
    }
  });
}

function formatDateForFile() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}_${String(d.getHours()).padStart(2,"0")}-${String(d.getMinutes()).padStart(2,"0")}`;
}

// ===== BUILD JSON OUTPUT =====
function buildExportJSON(events, startTime) {
  const endTime = events.length > 0 ? events[events.length - 1].timestamp : Date.now();
  const durationMs = endTime - (startTime || endTime);
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);

  const typeCounts = {};
  events.forEach(e => { typeCounts[e.type] = (typeCounts[e.type] || 0) + 1; });

  const uniqueUrls = [...new Set(events.map(e => e.url).filter(Boolean))];

  return {
    _description: "File ghi lại thao tác người dùng trên trình duyệt. Dùng để phân tích workflow và xây dựng bot tự động hóa.",
    _format_version: "1.0",
    _instructions_for_ai: "Mỗi event trong mảng 'events' đại diện một thao tác của người dùng. Dùng 'element.bestSelector' làm CSS selector chính khi build bot. 'timeSincePrevMs' cho biết khoảng delay giữa các bước (đơn vị ms). 'element.textContent' chứa nội dung text hiển thị. Với event type='input', field 'value' chứa nội dung người dùng đã gõ vào. Với type='click', field 'mouse' chứa tọa độ click.",
    meta: {
      startTime: startTime ? new Date(startTime).toISOString() : null,
      endTime: new Date(endTime).toISOString(),
      duration: `${minutes}m${seconds}s`,
      durationMs: durationMs,
      totalEvents: events.length,
      eventBreakdown: typeCounts,
      pagesVisited: uniqueUrls
    },
    events: events
  };
}

// ===== BUILD TEXT OUTPUT =====
function buildExportText(events, startTime) {
  const endTime = events.length > 0 ? events[events.length - 1].timestamp : Date.now();
  const durationMs = endTime - (startTime || endTime);
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);

  let lines = [];
  lines.push("═══════════════════════════════════════════════════════════");
  lines.push("  CLICK TRACKER — BẢN GHI THAO TÁC NGƯỜI DÙNG");
  lines.push("═══════════════════════════════════════════════════════════");
  lines.push("");
  lines.push(`Bắt đầu  : ${startTime ? new Date(startTime).toLocaleString("vi-VN") : "N/A"}`);
  lines.push(`Kết thúc : ${new Date(endTime).toLocaleString("vi-VN")}`);
  lines.push(`Thời lượng: ${minutes}m${seconds}s`);
  lines.push(`Tổng thao tác: ${events.length}`);
  lines.push("");
  lines.push("───────────────────────────────────────────────────────────");
  lines.push("");

  const icons = { click: "🖱️", input: "⌨️", file: "📎", scroll: "📜", focus: "🎯", blur: "💤", navigation: "🌐" };

  events.forEach((ev, i) => {
    const icon = icons[ev.type] || "❓";
    const time = ev.timeFormatted || "??:??:??";
    const wait = ev.timeSincePrevMs ? ` (+${ev.timeSincePrevMs}ms)` : "";

    lines.push(`[${String(i + 1).padStart(3, "0")}] ${icon} ${time}${wait}`);
    lines.push(`      Loại    : ${ev.type.toUpperCase()}`);
    lines.push(`      URL     : ${ev.url || "N/A"}`);

    if (ev.element) {
      lines.push(`      Element : <${ev.element.tag}> id="${ev.element.id || ""}" role="${ev.element.role || ""}"`);
      lines.push(`      Text    : "${(ev.element.textContent || "").substring(0, 80)}"`);
      lines.push(`      AriaLbl : "${ev.element.ariaLabel || ""}"`);
      lines.push(`      Selector: ${ev.element.bestSelector || "N/A"}`);
      lines.push(`      XPath   : ${ev.element.xpath || "N/A"}`);
    }

    if (ev.type === "input" && ev.value) {
      lines.push(`      Nội dung gõ: "${ev.value}"`);
    }
    if (ev.type === "file" && ev.files) {
      ev.files.forEach(f => lines.push(`      File: ${f.name} (${f.size} bytes, ${f.type})`));
    }
    if (ev.type === "scroll") {
      lines.push(`      Cuộn: scrollTop=${ev.scrollTop}, scrollLeft=${ev.scrollLeft}`);
    }
    if (ev.type === "navigation") {
      lines.push(`      Từ: ${ev.fromUrl}`);
      lines.push(`      Đến: ${ev.toUrl}`);
    }

    lines.push("");
  });

  lines.push("═══════════════════════════════════════════════════════════");
  lines.push("  KẾT THÚC BẢN GHI");
  lines.push("═══════════════════════════════════════════════════════════");

  return lines.join("\n");
}
