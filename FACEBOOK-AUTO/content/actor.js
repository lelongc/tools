function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(config) {
  const min = config.delayMin ? config.delayMin * 1000 : 2000;
  const max = config.delayMax ? config.delayMax * 1000 : 5000;
  return sleep(rand(min, max));
}

// Hàm mô phỏng gõ phím như người thật
async function simulateTyping(element, text, typingSpeed = 50) {
  element.focus();
  
  // Facebook DraftEditor implementation
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', text);
  
  const pasteEvent = new ClipboardEvent('paste', {
    clipboardData: dataTransfer,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(pasteEvent);
  
  // Fallback if paste doesn't trigger UI update
  element.dispatchEvent(new Event('input', { bubbles: true }));
  await sleep(500);
}


function base64ToFile(base64Data, filename) {
  const arr = base64Data.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'filterGroups') {
    handleFilterGroups(request.config).then(sendResponse);
    return true;
  }
  
  if (request.action === 'postToGroup') {
    handlePostToGroup(request.config).then(sendResponse);
    return true;
  }
});

async function handleFilterGroups(config) {
  try {
    // Đợi trang load
    await sleep(2000);

    // 1. Tìm và click "Nhóm của tôi"
    let myGroupFilterBtn = null;
    const labels = Array.from(document.querySelectorAll('span[dir="auto"], span'));
    for (const label of labels) {
      const text = label.innerText.trim();
      if (text === "Nhóm của tôi" || text === "My groups") {
        const checkbox = label.closest('div[role="checkbox"]') || label.closest('input[role="switch"]') || document.querySelector('input[role="switch"][aria-label*="Nhóm của tôi"]');
        if (checkbox) {
          myGroupFilterBtn = checkbox;
          break;
        }
      }
    }

    if (!myGroupFilterBtn) {
        myGroupFilterBtn = document.querySelector('input[role="switch"][aria-label*="Nhóm của tôi"], input[role="switch"][aria-label*="My groups"]');
    }

    if (myGroupFilterBtn) {
      // In Facebook, sometimes role="switch" is an input where checked property works
      const isChecked = myGroupFilterBtn.getAttribute('aria-checked') === 'true' || myGroupFilterBtn.checked;
      if (!isChecked) {
        myGroupFilterBtn.click();
        await randomDelay(config);
      }
    }

    // 2. Lấy danh sách nhóm
    const groupLinks = Array.from(document.querySelectorAll('a[role="presentation"]'))
      .map(a => a.href)
      .filter(href => href.includes('/groups/') && !href.includes('/search/'));

    return { success: true, groups: [...new Set(groupLinks)] };

  } catch (error) {
    console.error("Lỗi khi lọc nhóm:", error);
    return { success: false, error: error.message };
  }
}

async function handlePostToGroup(config) {
  try {
    await sleep(3000); // Đợi load trang nhóm

    // CLICK "Bạn viết gì đi" hoặc "Write something..."
    const triggers = [
      "Bạn viết gì đi...", "Write something...", "Tạo bài viết công khai...",
      "Bạn viết gì đi", "Write something", "Create a public post..."
    ];
    
    let postTrigger = null;
    const spans = Array.from(document.querySelectorAll('span'));
    for (let span of spans) {
      if (triggers.includes(span.innerText.trim())) {
        // Tìm element có thể click
        postTrigger = span.closest('div[role="button"]') || span;
        break;
      }
    }

    if (!postTrigger) {
      console.log("Không tìm thấy khung đăng bài, bỏ qua nhóm này.");
      return { success: false, reason: 'no_post_box' };
    }

    postTrigger.click();
    await randomDelay(config);

    // XỬ LÝ UP ẢNH NẾU CÓ
    if (config.imageBase64) {
      console.log("Đang thêm ảnh...");
      let fileInput = null;
      const fileInputs = Array.from(document.querySelectorAll('input[type="file"][accept*="image"]'));
      if (fileInputs.length > 0) {
         fileInput = fileInputs[fileInputs.length - 1]; // Lấy input cuối cùng (thường là trong Modal hiện tại)
      }

      if (!fileInput) {
        // Cố gắng bấm nút bật Ảnh/Video
        let photoBtn = null;
        let btns = Array.from(document.querySelectorAll('div[role="button"]'));
        for (let btn of btns) {
           let txt = btn.innerText.trim();
           let aria = btn.getAttribute('aria-label') || '';
           if (txt.includes('Ảnh/video') || txt.includes('Photo/video') || 
               aria.includes('Ảnh') || aria.includes('Photo')) {
               photoBtn = btn; break;
           }
        }
        if (!photoBtn) {
           let spans = Array.from(document.querySelectorAll('span[dir="auto"]')).filter(s => s.innerText.includes('Ảnh/video') || s.innerText.includes('Photo'));
           if (spans.length > 0) photoBtn = spans[0].closest('div[role="button"]') || spans[0];
        }

        if (photoBtn) {
          photoBtn.click();
          await sleep(1500);
          const newInputs = Array.from(document.querySelectorAll('input[type="file"][accept*="image"]'));
          if (newInputs.length > 0) fileInput = newInputs[newInputs.length - 1];
        }
      }

      if (fileInput) {
        const file = base64ToFile(config.imageBase64, 'image.jpg');
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        await sleep(2000); // Chờ ảnh upload
      } else {
        console.log("Không tìm thấy chỗ upload ảnh!");
      }
    }

    // ĐIỀN NỘI DUNG VÀO KHUNG SOẠN THẢO
    const editorSelectors = [
      'div[role="dialog"] div[role="textbox"][contenteditable="true"]',
      'form div[role="textbox"][contenteditable="true"]',
      'div[role="textbox"][contenteditable="true"]'
    ];
    
    let editor = null;
    for (let selector of editorSelectors) {
      const candidates = Array.from(document.querySelectorAll(selector));
      // Tránh việc chọn nhầm khung bình luận trong DOM, khung Modal Post thường nằm ở cuối hoặc trong dialog
      if (candidates.length > 0) {
        editor = candidates[candidates.length - 1]; // Lấy phần tử vừa render ra sau cùng
        break;
      }
    }

    if (editor) {
      await simulateTyping(editor, config.postContent, config.typingSpeed);
      await randomDelay(config);
    } else {
      console.log("Không tìm thấy trình soạn thảo.");
      return { success: false, reason: 'no_editor' };
    }

    // ĐĂNG CHÉO (NẾU CÓ)
    if (config.isCrossPostBatch && config.batchSize > 1) {
      console.log("Đang cố gắng tick thêm nhóm chéo...");
      let addGroupBtn = null;
      const addTexts = ["Thêm nhóm", "Add group", "Thêm", "Add"];
      
      let spans = Array.from(document.querySelectorAll('span[dir="auto"], span'));
      for (let span of spans) {
        if (addTexts.includes(span.innerText.trim())) {
          addGroupBtn = span.closest('div[role="button"]') || span;
          break;
        }
      }

      if (addGroupBtn) {
        addGroupBtn.click();
        await sleep(2000); // Chờ list nhóm hiện lên

        let checkboxes = Array.from(document.querySelectorAll('div[role="dialog"] div[role="checkbox"]'));
        if (checkboxes.length === 0) {
            checkboxes = Array.from(document.querySelectorAll('div[role="checkbox"], input[type="checkbox"]'))
               .filter(c => c.closest('div[role="dialog"]'));
        }

        const eligibleCheckboxes = checkboxes.filter(cb => {
            const isChecked = cb.getAttribute('aria-checked') === 'true' || cb.checked;
            const isDisabled = cb.getAttribute('aria-disabled') === 'true' || cb.disabled;
            return !isChecked && !isDisabled;
        });

        const start = config.checkedOffset || 0;
        const limit = config.batchSize - 1; // Số lượng nhóm chéo

        console.log(`Đang check từ vị trí ${start}, tối đa ${limit} nhóm. Có ${eligibleCheckboxes.length} nhóm khả dụng.`);
        let clickedCount = 0;
        for (let i = start; i < eligibleCheckboxes.length && clickedCount < limit; i++) {
           eligibleCheckboxes[i].click();
           clickedCount++;
           await sleep(rand(400, 900)); // Delay click
        }

        // Bấm Xong
        const doneTexts = ["Xong", "Done"];
        let doneBtn = null;
        let allBtns = Array.from(document.querySelectorAll('div[role="button"], span'));
        for (let btn of allBtns) {
           if (doneTexts.includes(btn.innerText.trim())) {
              if (btn.tagName === 'SPAN') {
                 doneBtn = btn.closest('div[role="button"]') || btn;
              } else {
                 doneBtn = btn;
              }
              if (doneBtn.getBoundingClientRect().height > 0) break;
           }
        }
        
        if (doneBtn) {
           doneBtn.click();
           await sleep(1500);
        }
      } else {
         console.log("Không tìm thấy nút Thêm nhóm để đăng chéo.");
      }
    }

    // CLICK NÚT ĐĂNG
    let submitBtn = null;
    const submitLabels = ["Đăng", "Post"];
    const allButtons = Array.from(document.querySelectorAll('div[role="button"]'));
    for (const btn of allButtons) {
      if (submitLabels.includes(btn.innerText.trim()) && btn.getAttribute('aria-disabled') !== 'true') {
        submitBtn = btn;
        break;
      }
    }

    if (submitBtn) {
      submitBtn.click();
      await sleep(3000); // Chờ nó submit
      return { success: true };
    } else {
      return { success: false, reason: 'no_submit_btn' };
    }

  } catch (error) {
    console.error("Lỗi khi đăng bài:", error);
    return { success: false, reason: 'error', error: error.message };
  }
}
