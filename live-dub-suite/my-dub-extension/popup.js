document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const statusDiv = document.getElementById('status');
  const sourceLangSelect = document.getElementById('sourceLang');

  chrome.storage.local.get(['sourceLang'], (result) => {
    if (result.sourceLang) {
      sourceLangSelect.value = result.sourceLang;
    }
  });

  sourceLangSelect.addEventListener('change', () => {
    chrome.storage.local.set({ sourceLang: sourceLangSelect.value });
  });

  // Check state
  chrome.runtime.sendMessage({ type: "getState" }, (response) => {
    if (response && response.isRecording) {
      setStopUI();
    } else {
      setStartUI();
    }
  });

  startBtn.addEventListener('click', () => {
    if (startBtn.classList.contains('stop')) {
      chrome.runtime.sendMessage({ type: "stopCapture" });
      setStartUI();
    } else {
      const lang = sourceLangSelect.value;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        chrome.runtime.sendMessage({ type: "startCapture", tabId: tab.id, sourceLang: lang });
        setStopUI();
      });
    }
  });

  function setStartUI() {
    startBtn.textContent = "Bật Dịch & Lồng Tiếng";
    startBtn.classList.remove('stop');
    statusDiv.textContent = "Sẵn sàng";
  }

  function setStopUI() {
    startBtn.textContent = "Tắt";
    startBtn.classList.add('stop');
    statusDiv.textContent = "Đang chạy...";
  }
});
