document.addEventListener('DOMContentLoaded', async () => {
  const keywordInput = document.getElementById('keyword');
  const postContentInput = document.getElementById('content');
  const delayMinInput = document.getElementById('minDelay');
  const delayMaxInput = document.getElementById('maxDelay');
  const typingSpeedInput = document.getElementById('typingSpeed');
  const batchSizeInput = document.getElementById('crossPostCount');
  const imageInput = document.getElementById('images');
  const fileListContainer = document.getElementById('file-list');

  const startBtn = document.getElementById('btn-start');
  const stopBtn = document.getElementById('btn-stop');
  const statusEl = document.getElementById('status-text');

  // Load saved settings
  const data = await chrome.storage.local.get([
    'keyword',
    'postContent',
    'delayMin',
    'delayMax',
    'typingSpeed',
    'batchSize'
  ]);
  
  if (data.keyword) keywordInput.value = data.keyword;
  if (data.postContent) postContentInput.value = data.postContent;
  if (data.delayMin) delayMinInput.value = data.delayMin;
  if (data.delayMax) delayMaxInput.value = data.delayMax;
  if (data.typingSpeed) typingSpeedInput.value = data.typingSpeed;
  if (data.batchSize) batchSizeInput.value = data.batchSize;

  // Image handling
  let imageBase64Data = null;

  async function loadSavedImage() {
    try {
      const imgData = await chrome.storage.local.get(['savedImage']);
      if (imgData.savedImage) {
        imageBase64Data = imgData.savedImage;
        fileListContainer.textContent = "1 ảnh đã lưu";
      }
    } catch (e) {
      console.warn("Could not load image", e);
    }
  }

  await loadSavedImage();

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      fileListContainer.textContent = file.name;
      const reader = new FileReader();
      reader.onload = async (event) => {
        imageBase64Data = event.target.result;
        // Optionally save slightly resized version but we'll try to save full for now
        // if it exceeds quota it might fail
        try {
          await chrome.storage.local.set({ savedImage: imageBase64Data });
        } catch (err) {
          console.error("Storage quota error:", err);
          fileListContainer.textContent += " (Lỗi: Ảnh quá lớn để lưu tự động)";
        }
      };
      reader.readAsDataURL(file);
    } else {
      fileListContainer.textContent = "";
      imageBase64Data = null;
      chrome.storage.local.remove('savedImage');
    }
  });


  // Input auto-save
  const inputs = [keywordInput, postContentInput, delayMinInput, delayMaxInput, typingSpeedInput, batchSizeInput];
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      chrome.storage.local.set({
        keyword: keywordInput.value.trim(),
        postContent: postContentInput.value,
        delayMin: parseInt(delayMinInput.value) || 2,
        delayMax: parseInt(delayMaxInput.value) || 5,
        typingSpeed: typingSpeedInput.value || 'normal',
        batchSize: parseInt(batchSizeInput.value) || 10
      });
    });
  });

  // State Updates
  function updateUI(state) {
    statusEl.textContent = state.status || 'Chờ bắt đầu...';
    if (state.isRunning) {
      startBtn.disabled = true;
      stopBtn.disabled = false;
      inputs.forEach(i => i.disabled = true);
      imageInput.disabled = true;
    } else {
      startBtn.disabled = false;
      stopBtn.disabled = true;
      inputs.forEach(i => i.disabled = false);
      imageInput.disabled = false;
    }
  }

  // Get initial state
  chrome.runtime.sendMessage({ action: 'getState' }, (res) => {
    if (res) updateUI(res);
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'stateUpdate') {
      updateUI(request.state);
    }
  });

  startBtn.addEventListener('click', async () => {
    const config = {
      keyword: keywordInput.value.trim(),
      postContent: postContentInput.value,
      delayMin: parseInt(delayMinInput.value) || 2,
      delayMax: parseInt(delayMaxInput.value) || 5,
      typingSpeed: typingSpeedInput.value || 'normal',
      batchSize: parseInt(batchSizeInput.value) || 10,
      imageBase64: imageBase64Data
    };
    
    if (!config.keyword) {
      alert("Vui lòng nhập từ khóa");
      return;
    }

    chrome.runtime.sendMessage({
      action: 'start',
      config: config
    });
  });

  stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stop' });
  });

});
