// popup.js — Click Tracker Popup Controller

document.addEventListener("DOMContentLoaded", () => {
  const btnRecord = document.getElementById("btn-record");
  const btnStop = document.getElementById("btn-stop");
  const btnExportJSON = document.getElementById("btn-export-json");
  const btnExportText = document.getElementById("btn-export-text");
  const btnClear = document.getElementById("btn-clear");
  const recIndicator = document.getElementById("rec-indicator");
  const logBox = document.getElementById("log-box");
  const logBadge = document.getElementById("log-badge");
  const eventCountEl = document.getElementById("event-count");
  const durationEl = document.getElementById("duration");
  const clickCountEl = document.getElementById("click-count");
  const inputCountEl = document.getElementById("input-count");

  let isRecording = false;
  let startTime = null;
  let durationInterval = null;
  let clickCount = 0;
  let inputCount = 0;

  const icons = {
    click: "🖱️",
    input: "⌨️",
    file: "📎",
    scroll: "📜",
    focus: "🎯",
    navigation: "🌐"
  };

  // ===== KHỞI TẠO — Lấy state hiện tại =====
  chrome.runtime.sendMessage({ action: "GET_STATE" }, (res) => {
    if (chrome.runtime.lastError || !res) return;

    if (res.isRecording) {
      switchToRecordingUI();
      startTime = res.startTime;
      startDurationTimer();
    }

    // Render log từ events đã ghi
    eventCountEl.textContent = res.eventCount || 0;
    logBadge.textContent = res.eventCount || 0;

    if (res.events && res.events.length > 0) {
      logBox.innerHTML = "";
      // Chỉ hiển thị 50 event gần nhất để không lag
      const recentEvents = res.events.slice(-50);
      recentEvents.forEach(ev => addLogEntry(ev, false));

      // Đếm thống kê
      res.events.forEach(ev => {
        if (ev.type === "click") clickCount++;
        if (ev.type === "input") inputCount++;
      });
      clickCountEl.textContent = clickCount;
      inputCountEl.textContent = inputCount;

      logBox.scrollTop = logBox.scrollHeight;
    }
  });

  // ===== BẮT ĐẦU GHI =====
  btnRecord.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "START_RECORDING" }, () => {
      switchToRecordingUI();
      startTime = Date.now();
      startDurationTimer();
      logBox.innerHTML = "";
      clickCount = 0;
      inputCount = 0;
      eventCountEl.textContent = "0";
      clickCountEl.textContent = "0";
      inputCountEl.textContent = "0";
      logBadge.textContent = "0";
      addSystemLog("✅ Đã bắt đầu ghi. Chuyển qua tab trình duyệt và thao tác bình thường.");
    });
  });

  // ===== DỪNG GHI =====
  btnStop.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "STOP_RECORDING" }, () => {
      switchToStoppedUI();
      stopDurationTimer();
      addSystemLog("⏹ Đã dừng ghi. Bạn có thể xuất file JSON hoặc Text.");
    });
  });

  // ===== XUẤT FILE =====
  btnExportJSON.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "EXPORT_JSON" });
    addSystemLog("💾 Đang xuất file JSON...");
  });

  btnExportText.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "EXPORT_TEXT" });
    addSystemLog("📋 Đang xuất file Text...");
  });

  // ===== XÓA LOG =====
  btnClear.addEventListener("click", () => {
    if (confirm("Xóa toàn bộ log đã ghi?")) {
      chrome.runtime.sendMessage({ action: "CLEAR_EVENTS" });
      logBox.innerHTML = "";
      eventCountEl.textContent = "0";
      clickCountEl.textContent = "0";
      inputCountEl.textContent = "0";
      logBadge.textContent = "0";
      clickCount = 0;
      inputCount = 0;
      addSystemLog("🗑️ Đã xóa toàn bộ log.");
    }
  });

  // ===== NHẬN EVENT MỚI TỪ BACKGROUND =====
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "NEW_EVENT_LOG") {
      eventCountEl.textContent = msg.totalCount;
      logBadge.textContent = msg.totalCount;

      if (msg.event.type === "click") {
        clickCount++;
        clickCountEl.textContent = clickCount;
      }
      if (msg.event.type === "input") {
        inputCount++;
        inputCountEl.textContent = inputCount;
      }

      addLogEntry(msg.event, true);
    }
  });

  // ===== HELPER: Thêm dòng log =====
  function addLogEntry(ev, autoScroll) {
    // Ẩn log-empty nếu còn
    const emptyEl = logBox.querySelector(".log-empty");
    if (emptyEl) emptyEl.remove();

    const div = document.createElement("div");
    div.className = `log-entry log-${ev.type}`;

    const icon = icons[ev.type] || "❓";
    const time = ev.timeFormatted || "";

    let desc = "";
    switch (ev.type) {
      case "click":
        const tag = ev.element?.tag || "?";
        const role = ev.element?.role ? `[role=${ev.element.role}]` : "";
        const text = ev.element?.textContent ? ` "${ev.element.textContent.substring(0, 30)}"` : "";
        desc = `<${tag}>${role}${text}`;
        break;
      case "input":
        desc = `"${(ev.value || "").substring(0, 40)}"`;
        break;
      case "file":
        desc = ev.files ? ev.files.map(f => f.name).join(", ") : "file";
        break;
      case "scroll":
        desc = `scrollTop=${ev.scrollTop}`;
        break;
      case "focus":
        desc = `<${ev.element?.tag || "?"}>`;
        break;
      case "navigation":
        const toUrl = ev.toUrl || "";
        desc = toUrl.length > 50 ? toUrl.substring(0, 50) + "…" : toUrl;
        break;
    }

    const waitStr = ev.timeSincePrevMs > 0 ? ` +${ev.timeSincePrevMs}ms` : "";
    div.textContent = `${icon} ${time}${waitStr} — ${desc}`;
    div.title = ev.element?.bestSelector || "";

    logBox.appendChild(div);
    if (autoScroll) logBox.scrollTop = logBox.scrollHeight;
  }

  function addSystemLog(text) {
    const emptyEl = logBox.querySelector(".log-empty");
    if (emptyEl) emptyEl.remove();

    const div = document.createElement("div");
    div.style.color = "#7d8590";
    div.style.fontStyle = "italic";
    div.style.padding = "4px 6px";
    div.style.fontSize = "10px";
    div.textContent = text;
    logBox.appendChild(div);
    logBox.scrollTop = logBox.scrollHeight;
  }

  // ===== UI STATE =====
  function switchToRecordingUI() {
    isRecording = true;
    btnRecord.classList.add("hidden");
    btnStop.classList.remove("hidden");
    recIndicator.classList.add("active");
  }

  function switchToStoppedUI() {
    isRecording = false;
    btnStop.classList.add("hidden");
    btnRecord.classList.remove("hidden");
    recIndicator.classList.remove("active");
  }

  // ===== DURATION TIMER =====
  function startDurationTimer() {
    stopDurationTimer();
    durationInterval = setInterval(() => {
      if (!startTime) return;
      const elapsed = Date.now() - startTime;
      const min = Math.floor(elapsed / 60000);
      const sec = Math.floor((elapsed % 60000) / 1000);
      durationEl.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }, 1000);
  }

  function stopDurationTimer() {
    if (durationInterval) {
      clearInterval(durationInterval);
      durationInterval = null;
    }
  }
});
