// tracker.js — Content Script: Ghi lại mọi thao tác DOM
// Inject vào mọi trang web

let isRecording = false;
let lastEventTime = 0;
let inputBuffer = "";
let inputTimer = null;
let inputTarget = null;
let scrollTimer = null;
let lastUrl = window.location.href;
let listenersAttached = false;
let urlWatcherStarted = false;

// ===== KHỞI TẠO =====
// Khi content script load, kiểm tra state recording hiện tại
(function init() {
  try {
    chrome.runtime.sendMessage({ action: "GET_STATE" }, (res) => {
      if (chrome.runtime.lastError) {
        console.log("[ClickTracker] Chưa kết nối được background:", chrome.runtime.lastError.message);
        return;
      }
      if (res && res.isRecording) {
        isRecording = true;
        lastEventTime = Date.now();
        attachListeners();
        console.log("[ClickTracker] ✅ Đang ghi (khôi phục state).");
      } else {
        console.log("[ClickTracker] ⏸ Chưa ghi. Bấm 'Bắt đầu ghi' ở popup.");
      }
    });
  } catch (e) {
    console.log("[ClickTracker] Init error:", e);
  }
})();

// Nhận lệnh bật/tắt từ background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "RECORDING_STATE") {
    isRecording = msg.isRecording;
    console.log("[ClickTracker] Recording state:", isRecording);
    if (isRecording) {
      lastEventTime = Date.now();
      attachListeners();
    } else {
      detachListeners();
    }
  }
});

// ===== GẮN / GỠ LISTENER =====
function attachListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  document.addEventListener("click", handleClick, true);
  document.addEventListener("input", handleInput, true);
  document.addEventListener("change", handleChange, true);
  document.addEventListener("scroll", handleScroll, true);
  document.addEventListener("focusin", handleFocus, true);

  if (!urlWatcherStarted) {
    urlWatcherStarted = true;
    startUrlWatcher();
  }

  console.log("[ClickTracker] ✅ Listeners đã gắn.");
}

function detachListeners() {
  if (!listenersAttached) return;
  listenersAttached = false;

  document.removeEventListener("click", handleClick, true);
  document.removeEventListener("input", handleInput, true);
  document.removeEventListener("change", handleChange, true);
  document.removeEventListener("scroll", handleScroll, true);
  document.removeEventListener("focusin", handleFocus, true);

  console.log("[ClickTracker] ⏹ Listeners đã gỡ.");
}

// ===== XÂY DỰNG THÔNG TIN ELEMENT =====
function buildElementInfo(el) {
  if (!el || !el.tagName) return null;

  let rect = { x: 0, y: 0, width: 0, height: 0 };
  try {
    const r = el.getBoundingClientRect();
    rect = { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
  } catch (e) {}

  return {
    tag: el.tagName || "",
    id: el.id || "",
    className: (typeof el.className === "string") ? el.className.substring(0, 200) : "",
    role: el.getAttribute("role") || "",
    ariaLabel: el.getAttribute("aria-label") || "",
    textContent: (el.innerText || el.textContent || "").trim().substring(0, 120),
    href: el.href || el.getAttribute("href") || "",
    type: el.type || "",
    name: el.name || "",
    placeholder: el.placeholder || el.getAttribute("placeholder") || "",
    contentEditable: el.contentEditable || "",
    bestSelector: buildBestSelector(el),
    xpath: buildXPath(el),
    rect: rect
  };
}

// Tạo CSS selector ngắn nhất — AI dùng trực tiếp này
function buildBestSelector(el) {
  if (!el || !el.tagName) return "";
  try {
    // 1. ID
    if (el.id) return `#${CSS.escape(el.id)}`;

    const tag = el.tagName.toLowerCase();

    // 2. aria-label
    const ariaLabel = el.getAttribute("aria-label");
    if (ariaLabel && ariaLabel.length < 80) {
      const role = el.getAttribute("role");
      if (role) return `${tag}[role="${role}"][aria-label="${CSS.escape(ariaLabel)}"]`;
      return `${tag}[aria-label="${CSS.escape(ariaLabel)}"]`;
    }

    // 3. role + data-testid
    const role = el.getAttribute("role");
    if (role) {
      const dtid = el.getAttribute("data-testid");
      if (dtid) return `[role="${role}"][data-testid="${dtid}"]`;
    }

    // 4. name
    if (el.name) return `${tag}[name="${CSS.escape(el.name)}"]`;

    // 5. placeholder
    const ph = el.getAttribute("placeholder");
    if (ph) return `${tag}[placeholder="${CSS.escape(ph)}"]`;

    // 6. type + class-based combo
    if (role) return `${tag}[role="${role}"]`;

    // 7. Fallback: path
    const parts = [];
    let cur = el;
    let depth = 0;
    while (cur && cur !== document.body && depth < 4) {
      let seg = cur.tagName.toLowerCase();
      if (cur.id) { parts.unshift(`#${CSS.escape(cur.id)}`); break; }
      const r = cur.getAttribute("role");
      if (r) seg += `[role="${r}"]`;
      parts.unshift(seg);
      cur = cur.parentElement;
      depth++;
    }
    return parts.join(" > ") || tag;
  } catch (e) {
    return el.tagName ? el.tagName.toLowerCase() : "";
  }
}

// Tạo XPath
function buildXPath(el) {
  if (!el || !el.tagName) return "";
  try {
    const parts = [];
    let cur = el;
    while (cur && cur.nodeType === Node.ELEMENT_NODE) {
      let idx = 1;
      let sib = cur.previousElementSibling;
      while (sib) {
        if (sib.tagName === cur.tagName) idx++;
        sib = sib.previousElementSibling;
      }
      parts.unshift(`${cur.tagName.toLowerCase()}[${idx}]`);
      cur = cur.parentElement;
    }
    return "/" + parts.join("/");
  } catch (e) {
    return "";
  }
}

// ===== GỬI EVENT =====
function sendEvent(eventData) {
  if (!isRecording) return;

  const now = Date.now();
  eventData.timestamp = now;
  eventData.timeFormatted = new Date(now).toLocaleTimeString("vi-VN", { hour12: false });
  eventData.timeSincePrevMs = lastEventTime ? (now - lastEventTime) : 0;
  eventData.url = window.location.href;
  lastEventTime = now;

  try {
    // Kiểm tra xem extension còn hợp lệ không trước khi gửi
    if (!chrome.runtime?.id) {
      console.warn("[ClickTracker] ❌ Extension đã bị reload/disable. Vui lòng F5 trang này để tiếp tục ghi.");
      return;
    }
    chrome.runtime.sendMessage({ action: "TRACK_EVENT", event: eventData }, (res) => {
      if (chrome.runtime.lastError) {
        // Lần đầu bị mất kết nối sẽ log ra
        console.warn("[ClickTracker] Lỗi gửi event (có thể do reload extension):", chrome.runtime.lastError.message);
      }
    });
  } catch (e) {
    console.log("[ClickTracker] Lỗi gửi event exception:", e);
  }

  // Highlight
  if (eventData.type === "click" && eventData.element && eventData.element.rect) {
    flashHighlight(eventData.element.rect);
  }
}

// ===== HIGHLIGHT =====
function flashHighlight(rect) {
  if (!rect || !rect.width) return;
  try {
    const div = document.createElement("div");
    div.className = "ct-highlight-flash";
    div.style.left = (rect.x + window.scrollX) + "px";
    div.style.top = (rect.y + window.scrollY) + "px";
    div.style.width = rect.width + "px";
    div.style.height = rect.height + "px";
    document.documentElement.appendChild(div);
    setTimeout(() => { try { div.remove(); } catch(e) {} }, 800);
  } catch (e) {}
}

// ===== HANDLER: CLICK =====
function handleClick(e) {
  if (!isRecording) return;
  const el = e.target;
  if (el && el.classList && el.classList.contains("ct-highlight-flash")) return;

  sendEvent({
    type: "click",
    element: buildElementInfo(el),
    mouse: { clientX: e.clientX, clientY: e.clientY }
  });
}

// ===== HANDLER: INPUT (Debounced) =====
function handleInput(e) {
  if (!isRecording) return;
  const el = e.target;

  if (inputTimer) clearTimeout(inputTimer);
  inputTarget = el;
  inputBuffer = el.value || el.innerText || el.textContent || "";

  inputTimer = setTimeout(() => {
    if (inputTarget && inputBuffer) {
      sendEvent({
        type: "input",
        element: buildElementInfo(inputTarget),
        value: inputBuffer.trim().substring(0, 500)
      });
    }
    inputBuffer = "";
    inputTarget = null;
    inputTimer = null;
  }, 600);
}

// ===== HANDLER: FILE SELECT =====
function handleChange(e) {
  if (!isRecording) return;
  const el = e.target;
  if (el.type === "file" && el.files && el.files.length > 0) {
    const filesInfo = Array.from(el.files).map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: new Date(f.lastModified).toISOString()
    }));

    sendEvent({
      type: "file",
      element: buildElementInfo(el),
      files: filesInfo,
      fileCount: el.files.length
    });
  }
}

// ===== HANDLER: SCROLL (Debounced) =====
function handleScroll(e) {
  if (!isRecording) return;
  if (scrollTimer) clearTimeout(scrollTimer);

  scrollTimer = setTimeout(() => {
    sendEvent({
      type: "scroll",
      scrollTop: Math.round(window.scrollY || document.documentElement.scrollTop || 0),
      scrollLeft: Math.round(window.scrollX || document.documentElement.scrollLeft || 0),
      viewportHeight: window.innerHeight,
      documentHeight: document.documentElement.scrollHeight
    });
    scrollTimer = null;
  }, 400);
}

// ===== HANDLER: FOCUS =====
function handleFocus(e) {
  if (!isRecording) return;
  const el = e.target;
  if (!el) return;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || el.contentEditable === "true" || el.getAttribute("role") === "textbox") {
    sendEvent({
      type: "focus",
      element: buildElementInfo(el)
    });
  }
}

// ===== URL WATCHER =====
function startUrlWatcher() {
  setInterval(() => {
    if (!isRecording) return;
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      sendEvent({
        type: "navigation",
        fromUrl: lastUrl,
        toUrl: currentUrl
      });
      lastUrl = currentUrl;
    }
  }, 1000);
}
