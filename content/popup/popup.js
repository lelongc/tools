document.getElementById('options-btn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById('extract-btn').addEventListener('click', async () => {
  const statusMsg = document.getElementById('status-msg');
  const loader = document.getElementById('loader');
  
  // Disable button
  document.getElementById('extract-btn').disabled = true;
  loader.classList.remove('hidden');
  statusMsg.textContent = 'Đang bật bảng điều khiển...';
  statusMsg.style.color = '#333';

  // Lấy tab hiện tại
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.includes("youtube.com") && !tab.url.includes("udemy.com")) {
    statusMsg.textContent = 'Vui lòng mở một video trên YouTube hoặc Udemy!';
    statusMsg.style.color = 'red';
    loader.classList.add('hidden');
    document.getElementById('extract-btn').disabled = false;
    return;
  }

  // Gửi lệnh bật UI sang background
  chrome.runtime.sendMessage({
    action: "inject_ui",
    tabId: tab.id
  }, (response) => {
    loader.classList.add('hidden');
    if (response && response.success) {
      statusMsg.textContent = 'Đã bật! Hãy dùng công cụ trên màn hình video.';
      statusMsg.style.color = 'green';
      setTimeout(() => window.close(), 1500); // Tự đóng popup
    } else {
      statusMsg.textContent = 'Lỗi: ' + (response ? response.error : 'Không xác định');
      statusMsg.style.color = 'red';
      document.getElementById('extract-btn').disabled = false;
    }
  });
});
