// Lưu cài đặt vào Chrome Storage
function saveOptions() {
  const geminiApiKey = document.getElementById('geminiApiKey').value;
  const googleSearchApiKey = document.getElementById('googleSearchApiKey').value;
  const googleSearchCx = document.getElementById('googleSearchCx').value;

  chrome.storage.local.set({
    geminiApiKey: geminiApiKey,
    googleSearchApiKey: googleSearchApiKey,
    googleSearchCx: googleSearchCx
  }, () => {
    // Thông báo lưu thành công
    const status = document.getElementById('status');
    status.textContent = 'Đã lưu cài đặt thành công!';
    setTimeout(() => {
      status.textContent = '';
    }, 3000);
  });
}

// Khôi phục trạng thái từ Chrome Storage
function restoreOptions() {
  chrome.storage.local.get({
    geminiApiKey: '',
    googleSearchApiKey: '',
    googleSearchCx: ''
  }, (items) => {
    document.getElementById('geminiApiKey').value = items.geminiApiKey;
    document.getElementById('googleSearchApiKey').value = items.googleSearchApiKey;
    document.getElementById('googleSearchCx').value = items.googleSearchCx;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveBtn').addEventListener('click', saveOptions);
