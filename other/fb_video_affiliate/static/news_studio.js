/**
 * Studio Xào Nấu Tin Tức & Google Flow AI
 * News Remix & Image Prompt Generator
 */

let originalNewsImagePath = '';
let finalNewsImagePath = '';
let currentToneStyle = 'objective';

document.addEventListener('DOMContentLoaded', () => {
  initSourcePills();
  initStyleSelector();
  initDropZones();
  initActionButtons();
  initCopyButtons();
  loadConfigStatus();
});

// 1. Tải trạng thái Fanpage từ server
async function loadConfigStatus() {
  const statusEl = document.getElementById('newsPageStatus');
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    const fb = data.facebook || {};
    const activePage = fb.pages?.find(p => p.is_active) || fb.pages?.[0];
    if (activePage) {
      statusEl.textContent = `Fanpage: ${activePage.name} (Đang kết nối)`;
    } else if (fb.simulation_mode) {
      statusEl.textContent = 'Chế độ: Thử nghiệm (Simulation)';
    } else {
      statusEl.textContent = 'Facebook: Đã sẵn sàng';
    }
  } catch (e) {
    statusEl.textContent = 'Chưa kết nối server';
  }
}

// 2. Nút chọn nguồn báo nhanh
function initSourcePills() {
  const pills = document.querySelectorAll('.source-pill');
  const sourceInput = document.getElementById('newsInputSource');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      sourceInput.value = pill.getAttribute('data-src') || '';
    });
  });
}

// 3. Chọn phong cách viết
function initStyleSelector() {
  const styleBtns = document.querySelectorAll('#newsStyleGroup .btn-style-opt');
  styleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      styleBtns.forEach(b => {
        b.classList.remove('active');
        b.style.borderColor = 'rgba(148, 163, 184, 0.3)';
        b.style.background = 'rgba(30, 41, 59, 0.5)';
      });
      btn.classList.add('active');
      btn.style.borderColor = '#fbbf24';
      btn.style.background = 'rgba(245, 158, 11, 0.2)';
      currentToneStyle = btn.getAttribute('data-style') || 'objective';
    });
  });
}

// 4. Kéo thả & Upload ảnh
function initDropZones() {
  // Dropzone 1: Ảnh bản tin gốc
  const dropZone = document.getElementById('newsDropZone');
  const fileInput = document.getElementById('newsFileInput');
  const promptBox = document.getElementById('newsDropPrompt');
  const previewBox = document.getElementById('newsPreviewBox');
  const previewImg = document.getElementById('newsPreviewImg');
  const fileNameSpan = document.getElementById('newsFileName');
  const btnRemove = document.getElementById('btnRemoveNewsPhoto');

  dropZone.addEventListener('click', (e) => {
    if (e.target !== btnRemove) fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      uploadOriginalPhoto(fileInput.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files[0]) {
      uploadOriginalPhoto(dt.files[0]);
    }
  });

  btnRemove.addEventListener('click', (e) => {
    e.stopPropagation();
    originalNewsImagePath = '';
    fileInput.value = '';
    previewBox.style.display = 'none';
    promptBox.style.display = 'block';
  });

  async function uploadOriginalPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    fileNameSpan.textContent = 'Đang tải ' + file.name + '...';
    promptBox.style.display = 'none';
    previewBox.style.display = 'block';

    try {
      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        originalNewsImagePath = data.saved_path;
        previewImg.src = data.url;
        fileNameSpan.textContent = file.name;
      } else {
        alert('Tải ảnh thất bại: ' + (data.detail || 'Lỗi server'));
        previewBox.style.display = 'none';
        promptBox.style.display = 'block';
      }
    } catch (err) {
      alert('Lỗi kết nối khi tải ảnh: ' + err.message);
      previewBox.style.display = 'none';
      promptBox.style.display = 'block';
    }
  }

  // Dropzone 2: Ảnh thành phẩm từ Google Flow
  const finalDropZone = document.getElementById('newsFinalDropZone');
  const finalFileInput = document.getElementById('newsFinalFileInput');
  const finalPrompt = document.getElementById('newsFinalPrompt');
  const finalPreviewBox = document.getElementById('newsFinalPreviewBox');
  const finalPreviewImg = document.getElementById('newsFinalPreviewImg');
  const finalFileName = document.getElementById('newsFinalFileName');
  const btnRemoveFinal = document.getElementById('btnRemoveFinalPhoto');

  finalDropZone.addEventListener('click', (e) => {
    if (e.target !== btnRemoveFinal) finalFileInput.click();
  });

  finalFileInput.addEventListener('change', () => {
    if (finalFileInput.files && finalFileInput.files[0]) {
      uploadFinalPhoto(finalFileInput.files[0]);
    }
  });

  btnRemoveFinal.addEventListener('click', (e) => {
    e.stopPropagation();
    finalNewsImagePath = '';
    finalFileInput.value = '';
    finalPreviewBox.style.display = 'none';
    finalPrompt.style.display = 'block';
  });

  async function uploadFinalPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    finalFileName.textContent = 'Đang tải ' + file.name + '...';
    finalPrompt.style.display = 'none';
    finalPreviewBox.style.display = 'block';

    try {
      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        finalNewsImagePath = data.saved_path;
        finalPreviewImg.src = data.url;
        finalFileName.textContent = file.name;
      } else {
        alert('Tải ảnh thành phẩm thất bại: ' + (data.detail || 'Lỗi server'));
        finalPreviewBox.style.display = 'none';
        finalPrompt.style.display = 'block';
      }
    } catch (err) {
      alert('Lỗi kết nối khi tải ảnh: ' + err.message);
      finalPreviewBox.style.display = 'none';
      finalPrompt.style.display = 'block';
    }
  }
}

// 5. Nút Copy nhanh
function initCopyButtons() {
  setupCopyBtn('btnCopyNewsPrompt', 'outGoogleFlowPrompt', 'Đã copy Prompt Google Flow!');
  setupCopyBtn('btnCopyNewsTitle', 'outNewsTitle', 'Đã copy tiêu đề!');
  setupCopyBtn('btnCopyNewsCaption', 'outNewsCaption', 'Đã copy bài viết!');
  setupCopyBtn('btnCopyVoiceover', 'outVoiceoverScript', 'Đã copy kịch bản đọc!');
}

function setupCopyBtn(btnId, targetId, successMsg) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const el = document.getElementById(targetId);
    if (!el || !el.value) return;
    try {
      await navigator.clipboard.writeText(el.value);
      const originalText = btn.textContent;
      btn.textContent = '✓ ' + successMsg;
      setTimeout(() => { btn.textContent = originalText; }, 2000);
    } catch (e) {
      el.select();
      document.execCommand('copy');
      alert(successMsg);
    }
  });
}

// 6. Xử lý các hành động chính: Chạy Remix & Đăng Facebook
function initActionButtons() {
  const btnRun = document.getElementById('btnRunNewsRemix');
  const btnPublish = document.getElementById('btnPublishNewsNow');
  const emptyState = document.getElementById('newsEmptyState');
  const resultContent = document.getElementById('newsResultContent');
  const statusTag = document.getElementById('newsStatusTag');

  // Nút chạy AI Xào Nấu Tin Tức
  btnRun.addEventListener('click', async () => {
    const rawText = document.getElementById('newsInputText').value.trim();
    const source = document.getElementById('newsInputSource').value.trim();
    const editReq = document.getElementById('newsImageEditReq').value.trim();

    if (!rawText && !originalNewsImagePath) {
      alert('Vui lòng dán nội dung bài báo hoặc tải ảnh gốc lên để AI phân tích!');
      return;
    }

    btnRun.disabled = true;
    btnRun.innerHTML = '<span>⏳</span><span>GEMINI ĐANG ĐỌC BÀI BÁO & SOẠN PROMPT GOOGLE FLOW...</span>';
    statusTag.textContent = 'Đang phân tích...';

    try {
      const res = await fetch('/api/remix-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          news_text: rawText,
          news_source: source || 'Nguồn tổng hợp báo chí',
          image_edit_request: editReq,
          tone_style: currentToneStyle,
          original_image_path: originalNewsImagePath
        })
      });

      const resData = await res.json();
      if (!res.ok || resData.status !== 'success') {
        throw new Error(resData.detail || 'Lỗi xử lý tin tức từ server!');
      }

      const d = resData.data;

      // Điền kết quả
      document.getElementById('outNewsTitle').value = d.news_title || '';
      document.getElementById('outNewsCaption').value = d.news_caption || '';
      document.getElementById('outVoiceoverScript').value = d.voiceover_script || '';
      document.getElementById('outGoogleFlowPrompt').value = d.google_flow_prompt || '';
      document.getElementById('outImageAnalysis').textContent = d.image_analysis ? `🔍 Soi ảnh gốc: ${d.image_analysis}` : '';

      // Render hashtags
      const cloud = document.getElementById('newsHashtagsCloud');
      cloud.innerHTML = '';
      if (Array.isArray(d.news_hashtags)) {
        d.news_hashtags.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'hashtag-badge';
          span.textContent = tag.startsWith('#') ? tag : '#' + tag;
          cloud.appendChild(span);
        });
      }

      // Mở khung kết quả
      emptyState.style.display = 'none';
      resultContent.style.display = 'block';
      statusTag.textContent = 'Đã hoàn thành';
      statusTag.style.color = '#34d399';

      // Tự cuộn nhẹ sang khung kết quả
      resultContent.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      btnRun.disabled = false;
      btnRun.innerHTML = '<span class="btn-icon">⚡</span><span>AI PHÂN TÍCH & XÀO NẤU TIN TỨC + TẠO PROMPT GOOGLE FLOW</span>';
    }
  });

  // Nút đăng ngay lên Fanpage
  btnPublish.addEventListener('click', async () => {
    const caption = document.getElementById('outNewsCaption').value.trim();
    const title = document.getElementById('outNewsTitle').value.trim();
    const resultBox = document.getElementById('newsPublishResult');
    const applyLogo = document.getElementById('chkNewsApplyLogo').checked;

    // Lấy ảnh cần đăng: Ưu tiên ảnh thành phẩm vừa tải từ Google Flow, nếu chưa có thì dùng ảnh gốc
    let photoToPublish = finalNewsImagePath || originalNewsImagePath;

    if (!photoToPublish) {
      alert('Vui lòng nạp ảnh thành phẩm từ Google Flow (hoặc ảnh gốc) vào trước khi đăng lên Fanpage!');
      return;
    }

    if (!caption) {
      alert('Chưa có nội dung bài viết tin tức để đăng!');
      return;
    }

    // Lấy hashtags
    const tagElements = document.querySelectorAll('#newsHashtagsCloud .hashtag-badge');
    const tags = Array.from(tagElements).map(el => el.textContent.trim()).join(' ');
    const fullCaption = tags ? `${caption}\n\n${tags}` : caption;

    btnPublish.disabled = true;
    btnPublish.innerHTML = '<span>⏳</span><span>ĐANG TẨY RỬA METADATA & ĐĂNG BÀI LÊN FANPAGE...</span>';
    resultBox.style.display = 'none';

    try {
      // 1. Nếu người dùng chọn đóng dấu logo bản quyền hoặc tẩy siêu dữ liệu C2PA
      let finalPath = photoToPublish;
      try {
        const transRes = await fetch('/api/transform-remix-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_path: photoToPublish,
            flip_horizontal: false,
            filter_type: 'none',
            apply_logo: applyLogo,
            logo_type: 'badge',
            logo_position: 'bottom-right'
          })
        });
        const transData = await transRes.json();
        if (transRes.ok && transData.status === 'success') {
          finalPath = transData.saved_path;
        }
      } catch (e) {
        console.warn('Bỏ qua bước đóng logo, đăng ảnh gốc:', e);
      }

      // 2. Gửi lệnh đăng bài Facebook
      const pubRes = await fetch('/api/publish-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo_path: finalPath,
          title: title,
          caption: fullCaption,
          pinned_comment: '',
          is_scheduled: false
        })
      });

      const pubData = await pubRes.json();
      if (!pubRes.ok || pubData.status !== 'success') {
        throw new Error(pubData.detail || 'Lỗi khi đăng bài lên Fanpage!');
      }

      resultBox.style.display = 'block';
      resultBox.style.background = 'rgba(16, 185, 129, 0.15)';
      resultBox.style.border = '1px solid #10b981';
      resultBox.style.color = '#34d399';

      const postUrl = pubData.post_url ? `<br><a href="${pubData.post_url}" target="_blank" style="color: #38bdf8; font-weight: bold; text-decoration: underline;">👉 Bấm vào đây để xem bài viết trên Facebook</a>` : '';
      resultBox.innerHTML = `<b>🎉 ĐĂNG BÀI BÁO THÀNH CÔNG!</b><br>${pubData.message || 'Bài viết đã phát sóng trên Fanpage.'}${postUrl}`;

    } catch (err) {
      resultBox.style.display = 'block';
      resultBox.style.background = 'rgba(239, 68, 68, 0.15)';
      resultBox.style.border = '1px solid #ef4444';
      resultBox.style.color = '#f87171';
      resultBox.innerHTML = `<b>❌ ĐĂNG BÀI THẤT BẠI:</b> ${err.message}`;
    } finally {
      btnPublish.disabled = false;
      btnPublish.innerHTML = '<span>🚀</span><span>ĐĂNG BÀI BÁO NÀY LÊN FANPAGE NGAY LẬP TỨC</span>';
    }
  });
}
