/* ==========================================================================
   Frontend Application Logic - FB Reels & Shopee Affiliate Hub
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Global States
  let currentConfig = {};
  let currentProducts = [];
  let currentVideoPath = "";
  let lastAnalysisResult = null;

  // DOM Elements - Tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // DOM Elements - Studio Input
  const nicheSelect = document.getElementById("nicheSelect");
  const modelSelect = document.getElementById("modelSelect");
  const scriptText = document.getElementById("scriptText");
  const btnGenRandomScript = document.getElementById("btnGenRandomScript");
  const btnAnalyze = document.getElementById("btnAnalyze");
  const videoDropZone = document.getElementById("videoDropZone");
  const videoFileInput = document.getElementById("videoFileInput");
  const dropPrompt = document.getElementById("dropPrompt");
  const videoPreviewBox = document.getElementById("videoPreviewBox");
  const videoPreview = document.getElementById("videoPreview");
  const videoFileName = document.getElementById("videoFileName");
  const btnRemoveVideo = document.getElementById("btnRemoveVideo");

  // DOM Elements - Thumbnail Studio (Chuẩn Văn Cao)
  const thumbStudioCard = document.getElementById("thumbStudioCard");
  const thumbCanvas = document.getElementById("thumbCanvas");
  const thumbCurrentTimeText = document.getElementById("thumbCurrentTimeText");
  const thumbTotalTimeText = document.getElementById("thumbTotalTimeText");
  const thumbFrameScrubber = document.getElementById("thumbFrameScrubber");
  const btnSnapCurrentFrame = document.getElementById("btnSnapCurrentFrame");
  const thumbTextLine1 = document.getElementById("thumbTextLine1");
  const thumbTextLine2 = document.getElementById("thumbTextLine2");
  const thumbPosY = document.getElementById("thumbPosY");
  const valPosY = document.getElementById("valPosY");
  const thumbFontSize = document.getElementById("thumbFontSize");
  const valFontSize = document.getElementById("valFontSize");
  const thumbBoxColor = document.getElementById("thumbBoxColor");
  const btnDownloadThumb = document.getElementById("btnDownloadThumb");
  const btnApplyThumbAsCover = document.getElementById("btnApplyThumbAsCover");
  let currentThumbnailPath = "";

  // DOM Elements - Studio Output
  const emptyOutputState = document.getElementById("emptyOutputState");
  const resultContent = document.getElementById("resultContent");
  const aiStatusTag = document.getElementById("aiStatusTag");
  const outTitle = document.getElementById("outTitle");
  const viralTitlesBox = document.getElementById("viralTitlesBox");
  const viralTitlesList = document.getElementById("viralTitlesList");
  const seoFilenameBox = document.getElementById("seoFilenameBox");
  const seoFilenameText = document.getElementById("seoFilenameText");
  const btnCopyFilename = document.getElementById("btnCopyFilename");
  const outCaption = document.getElementById("outCaption");
  const hashtagsCloud = document.getElementById("hashtagsCloud");
  const matchedCount = document.getElementById("matchedCount");
  const matchedProductsList = document.getElementById("matchedProductsList");
  const missingBox = document.getElementById("missingBox");
  const missingList = document.getElementById("missingList");
  const outComment = document.getElementById("outComment");
  const btnPublish = document.getElementById("btnPublish");
  const publishResultBox = document.getElementById("publishResultBox");
  const btnToggleAddMore = document.getElementById("btnToggleAddMore");
  const selectAddMoreProd = document.getElementById("selectAddMoreProd");
  const btnConfirmAddMore = document.getElementById("btnConfirmAddMore");

  // DOM Elements - Products Tab
  const productsGrid = document.getElementById("productsGrid");
  const prodCountBadge = document.getElementById("prodCountBadge");
  const btnOpenAddProduct = document.getElementById("btnOpenAddProduct");
  const btnResetSampleProds = document.getElementById("btnResetSampleProds");

  // DOM Elements - Modal
  const productModal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const productForm = document.getElementById("productForm");
  const prodIdInput = document.getElementById("prodId");
  const prodNameInput = document.getElementById("prodName");
  const prodUrlInput = document.getElementById("prodUrl");
  const prodCategoryInput = document.getElementById("prodCategory");
  const prodKeywordsInput = document.getElementById("prodKeywords");
  const prodNotesInput = document.getElementById("prodNotes");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const btnCancelModal = document.getElementById("btnCancelModal");

  // DOM Elements - History & Settings
  const historyList = document.getElementById("historyList");
  const settingsForm = document.getElementById("settingsForm");
  const cfgGeminiKey = document.getElementById("cfgGeminiKey");
  const cfgDefaultModel = document.getElementById("cfgDefaultModel");
  const cfgSimulationMode = document.getElementById("cfgSimulationMode");
  const cfgPageId = document.getElementById("cfgPageId");
  const cfgPageToken = document.getElementById("cfgPageToken");
  const currentModelBadge = document.getElementById("currentModelBadge");
  const fbModeText = document.getElementById("fbModeText");

  // ================= TABS SWITCHING =================
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) targetPane.classList.add("active");

      if (targetTab === "products") loadProducts();
      if (targetTab === "history") loadHistory();
      if (targetTab === "settings") loadConfigToSettings();
    });
  });

  // ================= TOAST NOTIFICATION =================
  function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === "success" ? "✅" : "⚠️"}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ================= LOAD INITIAL DATA =================
  async function loadConfig() {
    try {
      const res = await fetch("/api/config");
      currentConfig = await res.json();
      currentModelBadge.textContent = currentConfig.default_model || "Gemini 3.5 Flash-Lite";
      if (modelSelect) modelSelect.value = currentConfig.default_model || "gemini-3.5-flash-lite";
      
      const isSim = currentConfig.facebook?.simulation_mode;
      fbModeText.textContent = isSim ? "Mô Phỏng (Test)" : "Facebook Trực Tiếp";
      const dot = document.querySelector("#fbStatusBadge .status-dot");
      if (dot) {
        dot.className = `status-dot ${isSim ? "yellow" : "green"}`;
      }
      loadConfigToSettings();
    } catch (e) {
      console.error("Lỗi tải config:", e);
    }
  }

  function loadConfigToSettings() {
    if (!currentConfig) return;
    cfgGeminiKey.value = currentConfig.gemini_api_key || "";
    cfgDefaultModel.value = currentConfig.default_model || "gemini-3.5-flash-lite";
    cfgSimulationMode.checked = !!currentConfig.facebook?.simulation_mode;
    cfgPageId.value = currentConfig.facebook?.page_id || "";
    cfgPageToken.value = currentConfig.facebook?.page_access_token || "";
  }

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      currentProducts = await res.json();
      prodCountBadge.textContent = currentProducts.length;
      renderProductsGrid();
    } catch (e) {
      console.error("Lỗi tải sản phẩm:", e);
    }
  }

  async function loadHistory() {
    try {
      const res = await fetch("/api/history");
      const history = await res.json();
      renderHistoryList(history);
    } catch (e) {
      console.error("Lỗi tải lịch sử:", e);
    }
  }

  // ================= RENDER PRODUCTS (TAB 2) =================
  function renderProductsGrid() {
    if (!productsGrid) return;
    productsGrid.innerHTML = "";
    if (currentProducts.length === 0) {
      productsGrid.innerHTML = `<div class="empty-state"><p>Kho chưa có sản phẩm nào. Bấm 'Thêm Sản Phẩm Mới' hoặc 'Khôi Phục 7 Món Mẫu' để bắt đầu!</p></div>`;
      return;
    }

    currentProducts.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      const kwBadges = (p.keywords || []).map(k => `<span class="product-kw-badge">#${k}</span>`).join("");
      card.innerHTML = `
        <div>
          <div class="product-header">
            <span class="product-category">${p.category || "Sức khỏe"}</span>
            <span class="badge" style="font-size:0.75rem;">Đã dùng: <b>${p.use_count || 0}</b></span>
          </div>
          <h3>${p.name}</h3>
          <a href="${p.affiliate_url}" target="_blank" class="product-url">${p.affiliate_url}</a>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:10px;">${p.notes || "Không có ghi chú"}</p>
          <div class="product-keywords">${kwBadges}</div>
        </div>
        <div class="product-footer">
          <span>Ngày tạo: ${p.created_at || "2026-10-02"}</span>
          <div class="product-actions">
            <button class="btn-xs btn-secondary btn-edit-prod" data-id="${p.id}">Sửa</button>
            <button class="btn-xs btn-danger btn-del-prod" data-id="${p.id}">Xóa</button>
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
    });

    // Attach event listeners for Edit & Delete
    document.querySelectorAll(".btn-edit-prod").forEach(b => {
      b.addEventListener("click", () => openEditProduct(b.getAttribute("data-id")));
    });
    document.querySelectorAll(".btn-del-prod").forEach(b => {
      b.addEventListener("click", () => deleteProduct(b.getAttribute("data-id")));
    });
  }

  // ================= RENDER HISTORY (TAB 3) =================
  function renderHistoryList(history) {
    if (!historyList) return;
    historyList.innerHTML = "";
    if (history.length === 0) {
      historyList.innerHTML = `<div class="empty-state"><p>Chưa có video nào được đăng. Hãy vào tab 'Studio' để tạo bài đăng đầu tiên!</p></div>`;
      return;
    }

    history.forEach(item => {
      const card = document.createElement("div");
      card.className = "history-card";
      card.innerHTML = `
        <div class="history-card-header">
          <span>${item.niche || "Sức khỏe"} • ${item.timestamp}</span>
          <span class="badge" style="color:var(--accent-emerald)">${item.facebook_result?.mode === "simulation" ? "Mô Phỏng" : "Đã Đăng FB"}</span>
        </div>
        <h3>${item.title}</h3>
        <div class="history-script"><b>Kịch bản gốc:</b> ${item.script ? item.script.slice(0, 180) + '...' : 'Không có'}</div>
        <div class="history-card-footer">
          <span style="font-size:0.82rem; color:var(--text-muted)">Đã gắn ${item.selected_product_ids?.length || 0} link Shopee</span>
          <a href="${item.facebook_result?.facebook_url || '#'}" target="_blank" class="btn-xs btn-secondary">Xem Bài Viết ↗</a>
        </div>
      `;
      historyList.appendChild(card);
    });
  }

  // ================= AI SCRIPT GENERATOR (VĂN CAO STYLE) =================
  if (btnGenRandomScript) {
    btnGenRandomScript.addEventListener("click", async () => {
      btnGenRandomScript.disabled = true;
      btnGenRandomScript.textContent = "⏳ Đang sáng tạo kịch bản 30s mới...";
      try {
        const res = await fetch("/api/generate-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model_name: modelSelect?.value || "gemini-3.5-flash-lite"
          })
        });
        const data = await res.json();
        if (data.status === "success" && data.script) {
          scriptText.value = data.script;
          nicheSelect.value = "Sức khỏe & Đời sống (Bán hàng Affiliate)";
          if (data.thumbnail_banner) {
            if (thumbTextLine1 && data.thumbnail_banner.line1) thumbTextLine1.value = data.thumbnail_banner.line1;
            if (thumbTextLine2 && data.thumbnail_banner.line2) thumbTextLine2.value = data.thumbnail_banner.line2;
            renderThumbnailCanvas();
          }
          showToast("Gemini đã tạo xong 1 kịch bản sức khỏe 30s mới!");
        } else {
          throw new Error(data.detail || "Không tạo được kịch bản");
        }
      } catch (e) {
        console.error("Lỗi sinh kịch bản:", e);
        showToast("Lỗi khi sinh kịch bản: " + e.message, "error");
      } finally {
        btnGenRandomScript.disabled = false;
        btnGenRandomScript.textContent = "🎲 AI Sinh Kịch Bản Sức Khỏe Mới (30s)";
      }
    });
  }

  // ================= VIDEO UPLOAD & DRAG DROP =================
  if (dropPrompt) {
    dropPrompt.addEventListener("click", () => videoFileInput.click());
  }
  if (videoPreviewBox) {
    videoPreviewBox.addEventListener("click", (e) => e.stopPropagation());
  }
  if (thumbStudioCard) {
    thumbStudioCard.addEventListener("click", (e) => e.stopPropagation());
  }

  videoDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    videoDropZone.classList.add("dragover");
  });

  videoDropZone.addEventListener("dragleave", () => {
    videoDropZone.classList.remove("dragover");
  });

  videoDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    videoDropZone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleVideoFile(e.dataTransfer.files[0]);
    }
  });

  videoFileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleVideoFile(e.target.files[0]);
    }
  });

  async function handleVideoFile(file) {
    if (!file.type.startsWith("video/")) {
      showToast("Vui lòng chọn file video hợp lệ (.mp4, .mov...)!", "error");
      return;
    }

    dropPrompt.style.display = "none";
    videoPreviewBox.style.display = "block";
    if (thumbStudioCard) thumbStudioCard.style.display = "block";
    videoPreview.src = URL.createObjectURL(file);
    videoFileName.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;

    // Upload to server
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.status === "success") {
        currentVideoPath = data.saved_path;
        showToast(`Đã nhận video: ${file.name}`);
      }
    } catch (e) {
      console.error("Lỗi tải video:", e);
    }
  }

  btnRemoveVideo.addEventListener("click", (e) => {
    e.stopPropagation();
    currentVideoPath = "";
    currentThumbnailPath = "";
    videoPreview.src = "";
    videoFileInput.value = "";
    videoPreviewBox.style.display = "none";
    if (thumbStudioCard) thumbStudioCard.style.display = "none";
    dropPrompt.style.display = "block";
  });

  // ================= THUMBNAIL STUDIO & BANNER GENERATOR =================
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00.0";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms}`;
  }

  function renderThumbnailCanvas() {
    if (!thumbCanvas) return;
    const ctx = thumbCanvas.getContext("2d");
    const cw = thumbCanvas.width;
    const ch = thumbCanvas.height;

    ctx.clearRect(0, 0, cw, ch);

    // 1. Draw video frame or stylish fallback
    if (videoPreview && videoPreview.readyState >= 2 && videoPreview.videoWidth > 0) {
      const vw = videoPreview.videoWidth;
      const vh = videoPreview.videoHeight;
      const vAspect = vw / vh;
      const cAspect = cw / ch;
      let sx = 0, sy = 0, sw = vw, sh = vh;
      if (vAspect > cAspect) {
        sw = vh * cAspect;
        sx = (vw - sw) / 2;
      } else {
        sh = vw / cAspect;
        sy = (vh - sh) / 2;
      }
      ctx.drawImage(videoPreview, sx, sy, sw, sh, 0, 0, cw, ch);
    } else {
      // Dark emerald gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, "#064e3b");
      grad.addColorStop(0.5, "#047857");
      grad.addColorStop(1, "#022c22");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);
    }

    // 2. Options
    const line1 = (thumbTextLine1?.value || "TÁC DỤNG CỦA CÂY BẦU").trim().toUpperCase();
    const line2 = (thumbTextLine2?.value || "ĐỐI VỚI BỆNH TIỂU ĐƯỜNG").trim().toUpperCase();
    const posYRatio = parseInt(thumbPosY?.value || 18) / 100;
    const fontSize = parseInt(thumbFontSize?.value || 46);
    const boxColor = thumbBoxColor?.value || "#dc2626";

    if (valPosY) valPosY.textContent = `${thumbPosY.value}%`;
    if (valFontSize) valFontSize.textContent = `${fontSize}px`;

    // 3. Draw Red Box Banner
    ctx.save();
    ctx.font = `900 ${fontSize}px 'Montserrat', Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const m1 = ctx.measureText(line1);
    const m2 = ctx.measureText(line2);
    const maxTextW = Math.max(m1.width, m2.width);
    const boxW = Math.min(cw - 40, maxTextW + 70);
    const lineGap = fontSize * 1.25;
    const boxH = lineGap + fontSize + 36;
    const boxX = (cw - boxW) / 2;
    const boxY = ch * posYRatio;

    // Soft drop shadow under the red box
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;

    ctx.fillStyle = boxColor;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(boxX, boxY, boxW, boxH, 14);
    } else {
      ctx.rect(boxX, boxY, boxW, boxH);
    }
    ctx.fill();
    ctx.restore();

    // 4. Draw Stroked Text
    ctx.save();
    ctx.font = `900 ${fontSize}px 'Montserrat', Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const cX = cw / 2;
    const textY1 = boxY + 22 + fontSize / 2;
    const textY2 = textY1 + lineGap;
    const strokeW = Math.max(4, Math.round(fontSize * 0.1));

    // Line 1: Yellow
    ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.lineWidth = strokeW;
    ctx.strokeStyle = "#000000";
    ctx.strokeText(line1, cX, textY1);

    ctx.fillStyle = "#fde047";
    ctx.fillText(line1, cX, textY1);

    // Line 2: White
    ctx.lineWidth = strokeW;
    ctx.strokeStyle = "#000000";
    ctx.strokeText(line2, cX, textY2);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(line2, cX, textY2);
    ctx.restore();
  }

  // Hook Video Events to Thumbnail Canvas
  videoPreview.addEventListener("loadedmetadata", () => {
    if (thumbFrameScrubber) {
      thumbFrameScrubber.max = videoPreview.duration || 30;
      thumbFrameScrubber.value = Math.min(1.5, (videoPreview.duration || 30) / 2);
    }
    if (thumbTotalTimeText) {
      thumbTotalTimeText.textContent = formatTime(videoPreview.duration || 30);
    }
    videoPreview.currentTime = Math.min(1.5, (videoPreview.duration || 30) / 2);
  });

  videoPreview.addEventListener("seeked", () => {
    if (thumbCurrentTimeText) {
      thumbCurrentTimeText.textContent = formatTime(videoPreview.currentTime);
    }
    renderThumbnailCanvas();
  });

  if (thumbFrameScrubber) {
    thumbFrameScrubber.addEventListener("input", (e) => {
      videoPreview.currentTime = parseFloat(e.target.value);
    });
  }

  if (btnSnapCurrentFrame) {
    btnSnapCurrentFrame.addEventListener("click", () => {
      if (thumbFrameScrubber) thumbFrameScrubber.value = videoPreview.currentTime;
      if (thumbCurrentTimeText) thumbCurrentTimeText.textContent = formatTime(videoPreview.currentTime);
      renderThumbnailCanvas();
      showToast("Đã chụp frame tại " + formatTime(videoPreview.currentTime));
    });
  }

  // Reactive inputs for instant redraw
  [thumbTextLine1, thumbTextLine2, thumbPosY, thumbFontSize, thumbBoxColor].forEach(el => {
    if (el) {
      el.addEventListener("input", renderThumbnailCanvas);
      el.addEventListener("change", renderThumbnailCanvas);
    }
  });

  // Action: Tải ảnh bìa PNG
  if (btnDownloadThumb) {
    btnDownloadThumb.addEventListener("click", () => {
      if (!thumbCanvas) return;
      thumbCanvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const line1 = (thumbTextLine1?.value || "thumbnail").replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "_").toLowerCase();
        a.download = `bia_reels_${line1 || "meosongkhoe"}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Đã tải ảnh bìa PNG chuẩn nét, khử AI thành công!");
      }, "image/png");
    });
  }

  // Action: Gắn làm bìa cho video
  if (btnApplyThumbAsCover) {
    btnApplyThumbAsCover.addEventListener("click", async () => {
      if (!thumbCanvas) return;
      btnApplyThumbAsCover.disabled = true;
      btnApplyThumbAsCover.innerHTML = "<span>⏳ Đang lưu bìa...</span>";
      try {
        const dataUrl = thumbCanvas.toDataURL("image/png");
        const res = await fetch("/api/save-thumbnail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_base64: dataUrl })
        });
        const d = await res.json();
        if (d.status === "success") {
          currentThumbnailPath = d.saved_path;
          btnApplyThumbAsCover.classList.add("btn-success");
          btnApplyThumbAsCover.innerHTML = "<span>✅ Đã Gắn Bìa Cho Video</span>";
          showToast("Đã gắn ảnh bìa này vào tiến trình đăng Facebook Reels!");
        } else {
          throw new Error(d.detail || "Không thể lưu");
        }
      } catch (err) {
        showToast("Lỗi lưu ảnh bìa: " + err.message, "error");
        btnApplyThumbAsCover.disabled = false;
        btnApplyThumbAsCover.innerHTML = "<span>✨ Gắn Bìa Này Cho Video</span>";
      }
    });
  }

  // ================= GEMINI AI ANALYSIS =================
  btnAnalyze.addEventListener("click", async () => {
    const script = scriptText.value.trim();
    if (!script) {
      showToast("Vui lòng nhập kịch bản thoại video trước!", "error");
      scriptText.focus();
      return;
    }

    btnAnalyze.disabled = true;
    btnAnalyze.innerHTML = `<span>⏳ Đang gọi Gemini Flash phân tích...</span>`;
    aiStatusTag.textContent = "AI đang xử lý...";

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: script,
          niche: nicheSelect.value,
          model_name: modelSelect.value,
          video_filename: videoFileName.textContent || ""
        })
      });

      const responseData = await res.json();
      if (responseData.status !== "success") {
        throw new Error(responseData.detail || "Lỗi không xác định từ Gemini");
      }

      const aiData = responseData.data;
      lastAnalysisResult = aiData;

      // Populate UI
      emptyOutputState.style.display = "none";
      resultContent.style.display = "block";
      aiStatusTag.textContent = `Thành công với ${modelSelect.value}`;

      outTitle.value = aiData.hook_title || "";
      outCaption.value = aiData.reels_caption || "";
      outComment.value = aiData.pinned_comment || "";

      // Render 4 Tiêu Đề Kích View (Click để đổi ngay)
      if (viralTitlesBox && viralTitlesList) {
        viralTitlesList.innerHTML = "";
        const titles = aiData.viral_video_titles || [];
        if (titles.length > 0) {
          viralTitlesBox.style.display = "block";
          titles.forEach((t, idx) => {
            const div = document.createElement("div");
            div.className = `viral-title-item ${idx === 0 ? "active" : ""}`;
            div.innerHTML = `
              <span class="viral-tag-badge">${t.tag || "Gợi ý"}</span>
              <span class="viral-title-text">${t.title}</span>
            `;
            div.addEventListener("click", () => {
              document.querySelectorAll(".viral-title-item").forEach(el => el.classList.remove("active"));
              div.classList.add("active");
              outTitle.value = t.title;
              showToast(`Đã đổi sang: ${t.tag}`);
            });
            viralTitlesList.appendChild(div);
          });
        } else {
          viralTitlesBox.style.display = "none";
        }
      }

      // Render Tên File Video Chuẩn SEO Meta
      if (seoFilenameBox && seoFilenameText) {
        if (aiData.seo_video_filename) {
          seoFilenameBox.style.display = "flex";
          seoFilenameText.textContent = aiData.seo_video_filename;
        } else {
          seoFilenameBox.style.display = "none";
        }
      }

      // Populate Thumbnail Banner from AI Hook/Script
      if (aiData.thumbnail_banner) {
        if (thumbTextLine1 && aiData.thumbnail_banner.line1) thumbTextLine1.value = aiData.thumbnail_banner.line1;
        if (thumbTextLine2 && aiData.thumbnail_banner.line2) thumbTextLine2.value = aiData.thumbnail_banner.line2;
        renderThumbnailCanvas();
      } else if (aiData.hook_title) {
        // Fallback: smart split hook_title into 2 lines
        const clean = aiData.hook_title.replace(/[🚨⚠️💡📌]/g, "").trim();
        const parts = clean.split(/[:\-\–]/);
        if (parts.length >= 2) {
          if (thumbTextLine1) thumbTextLine1.value = parts[0].trim().toUpperCase();
          if (thumbTextLine2) thumbTextLine2.value = parts[1].trim().toUpperCase();
        } else {
          const words = clean.split(/\s+/);
          const mid = Math.ceil(words.length / 2);
          if (thumbTextLine1) thumbTextLine1.value = words.slice(0, mid).join(" ").toUpperCase();
          if (thumbTextLine2) thumbTextLine2.value = words.slice(mid).join(" ").toUpperCase();
        }
        renderThumbnailCanvas();
      }

      // Render Hashtags
      hashtagsCloud.innerHTML = "";
      (aiData.hashtags || []).forEach(tag => {
        const span = document.createElement("span");
        span.className = "hashtag-tag";
        span.textContent = tag.startsWith("#") ? tag : `#${tag}`;
        hashtagsCloud.appendChild(span);
      });

      // Render Matched Products & AI 5 Recommendations
      renderStudioProducts();

      showToast("Gemini Flash đã hoàn tất phân tích và chuẩn bị link Shopee!");
      publishResultBox.style.display = "none";

    } catch (e) {
      console.error("Lỗi phân tích:", e);
      showToast(`Lỗi: ${e.message}`, "error");
      aiStatusTag.textContent = "Thất bại";
    } finally {
      btnAnalyze.disabled = false;
      btnAnalyze.innerHTML = `<span class="btn-icon">⚡</span><span>Gemini Flash: Phân Tích & Khớp 5 Link Shopee</span>`;
    }
  });

  // ================= STUDIO PRODUCTS MANAGEMENT (INLINE EDIT & AI RECOMMENDATIONS) =================
  function renderStudioProducts() {
    if (!lastAnalysisResult) return;
    const selectedIds = lastAnalysisResult.selected_product_ids || [];
    const matchedProds = currentProducts.filter(p => selectedIds.includes(p.id));
    matchedCount.textContent = `${matchedProds.length} món đã chọn`;

    // 1. Render Matched Products
    matchedProductsList.innerHTML = "";
    if (matchedProds.length > 0) {
      matchedProds.forEach(p => {
        const item = document.createElement("div");
        item.className = "matched-item";
        item.innerHTML = `
          <div class="matched-item-header">
            <div class="matched-item-title-wrap">
              <span class="matched-item-title">🛒 ${p.name}</span>
              <span class="matched-item-badge">${p.category || 'Sức khỏe'}</span>
            </div>
            <button type="button" class="btn-remove-matched" data-id="${p.id}" title="Bỏ sản phẩm này khỏi video hiện tại">✖ Bỏ khỏi video</button>
          </div>
          <div class="matched-item-hint">🔗 Link Affiliate Shopee (Sửa trực tiếp bên dưới để lưu vào kho & bình luận):</div>
          <div class="matched-item-edit-row">
            <input type="text" class="form-control form-control-sm matched-aff-input" id="aff_input_${p.id}" value="${p.affiliate_url || ''}" placeholder="https://s.shopee.vn/...">
            <button type="button" class="btn-xs btn-success btn-save-matched-aff" data-id="${p.id}">💾 Lưu Kho & Comment</button>
            <a href="${p.affiliate_url || '#'}" target="_blank" class="btn-xs btn-secondary matched-test-link" id="test_link_${p.id}">↗ Mở Thử</a>
          </div>
          <div class="matched-item-status" id="status_${p.id}" style="display:none; font-size:0.75rem; color:#34d399; margin-top:2px;"></div>
        `;
        matchedProductsList.appendChild(item);
      });

      // Event listener: Lưu link đã sửa trực tiếp vào kho & bình luận
      matchedProductsList.querySelectorAll(".btn-save-matched-aff").forEach(btn => {
        btn.addEventListener("click", async () => {
          const prodId = btn.getAttribute("data-id");
          const prod = currentProducts.find(p => p.id === prodId);
          if (!prod) return;
          const inputEl = document.getElementById(`aff_input_${prodId}`);
          const statusEl = document.getElementById(`status_${prodId}`);
          const testLinkEl = document.getElementById(`test_link_${prodId}`);
          const newUrl = inputEl ? inputEl.value.trim() : "";
          if (!newUrl) {
            showToast("Vui lòng nhập link Shopee Affiliate hợp lệ!", "error");
            return;
          }

          const oldUrl = prod.affiliate_url;
          btn.disabled = true;
          btn.textContent = "⏳ Đang lưu...";

          try {
            const payload = {
              name: prod.name,
              affiliate_url: newUrl,
              category: prod.category,
              keywords: prod.keywords || [],
              notes: prod.notes || ""
            };
            const res = await fetch(`/api/products/${prodId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.status === "success") {
              prod.affiliate_url = newUrl;
              if (testLinkEl) testLinkEl.href = newUrl;
              
              // Đồng bộ cập nhật link trong ô Bình Luận Ghim (outComment)
              if (outComment && outComment.value) {
                if (oldUrl && outComment.value.includes(oldUrl)) {
                  outComment.value = outComment.value.replaceAll(oldUrl, newUrl);
                } else if (outComment.value.includes(prod.name)) {
                  const lines = outComment.value.split("\n");
                  const updatedLines = lines.map(line => {
                    if (line.includes(prod.name)) {
                      return `- ${prod.name}: ${newUrl}`;
                    }
                    return line;
                  });
                  outComment.value = updatedLines.join("\n");
                } else {
                  outComment.value = outComment.value.trim() + `\n- ${prod.name}: ${newUrl}\n`;
                }
              }

              if (statusEl) {
                statusEl.style.display = "block";
                statusEl.textContent = `✅ Đã lưu vào kho và đồng bộ vào bình luận ghim!`;
              }
              showToast(`Đã cập nhật link Affiliate cho "${prod.name}" vào kho!`);
              renderProductsGrid(); // Cập nhật Tab 2
            } else {
              throw new Error(data.detail || "Không thể cập nhật");
            }
          } catch (err) {
            showToast("Lỗi lưu link: " + err.message, "error");
          } finally {
            btn.disabled = false;
            btn.textContent = "💾 Lưu Kho & Comment";
          }
        });
      });

      // Event listener: Bỏ chọn sản phẩm khỏi video
      matchedProductsList.querySelectorAll(".btn-remove-matched").forEach(btn => {
        btn.addEventListener("click", () => {
          const prodId = btn.getAttribute("data-id");
          const prod = currentProducts.find(p => p.id === prodId);
          lastAnalysisResult.selected_product_ids = lastAnalysisResult.selected_product_ids.filter(id => id !== prodId);
          
          // Xóa dòng liên quan khỏi comment nếu có
          if (prod && outComment && outComment.value) {
            const lines = outComment.value.split("\n");
            const filteredLines = lines.filter(l => !(l.includes(prod.name) || (prod.affiliate_url && l.includes(prod.affiliate_url))));
            outComment.value = filteredLines.join("\n");
          }
          renderStudioProducts();
          showToast(`Đã bỏ "${prod ? prod.name : 'sản phẩm'}" khỏi video này (vẫn giữ nguyên trong kho).`);
        });
      });

    } else {
      matchedProductsList.innerHTML = `<p style="font-size:0.85rem; color:var(--text-muted); padding: 8px 0;">Chưa có sản phẩm nào trong kho được chọn cho video này.</p>`;
    }

    // 2. Render Missing Recommendations (AI Gợi Ý 3-5 Sản Phẩm Bán Chạy)
    const missing = lastAnalysisResult.missing_recommendations || [];
    if (missing.length > 0) {
      missingBox.style.display = "block";
      missingList.innerHTML = "";
      missing.forEach((m, idx) => {
        const item = document.createElement("div");
        item.className = "suggested-item";
        item.innerHTML = `
          <div class="suggested-item-header">
            <span class="suggested-name">📦 ${m.product_name}</span>
            <span class="suggested-cat-badge">${m.category || 'Gợi ý bán chạy'}</span>
          </div>
          <div class="suggested-reason">🎯 <b>Nhu cầu khán giả:</b> ${m.reason}</div>
          <div class="suggested-meta-row">
            <span class="suggested-keyword">🔍 Từ khóa Shopee: <b>"${m.search_keyword}"</b></span>
            <a href="https://shopee.vn/search?keyword=${encodeURIComponent(m.search_keyword)}" target="_blank" class="btn-xs btn-secondary">
              <span>🔍 Mở Shopee Tìm Sản Phẩm Này ↗</span>
            </a>
          </div>
          <div class="suggested-action-row">
            <input type="text" class="suggested-url-input" id="sug_url_${idx}" placeholder="Dán link Shopee Affiliate của bạn vào đây (https://s.shopee.vn/... hoặc https://shope.ee/...)">
            <button type="button" class="btn-save-suggested" data-idx="${idx}">
              <span>💾 Lưu Vào Kho & Ghép Link</span>
            </button>
          </div>
        `;
        missingList.appendChild(item);
      });

      // Handlers cho nút Lưu sản phẩm gợi ý vào kho
      missingList.querySelectorAll(".btn-save-suggested").forEach(btn => {
        btn.addEventListener("click", async () => {
          const idx = parseInt(btn.getAttribute("data-idx"));
          const m = missing[idx];
          if (!m) return;

          const inputEl = document.getElementById(`sug_url_${idx}`);
          const affUrl = inputEl ? inputEl.value.trim() : "";
          if (!affUrl) {
            showToast("Vui lòng dán link Shopee Affiliate của bạn trước khi bấm lưu!", "error");
            if (inputEl) inputEl.focus();
            return;
          }

          btn.disabled = true;
          btn.innerHTML = "<span>⏳ Đang lưu kho...</span>";

          try {
            const payload = {
              name: m.product_name,
              affiliate_url: affUrl,
              category: m.category || "Gợi ý kịch bản",
              keywords: [m.search_keyword].filter(Boolean),
              notes: `Gợi ý theo kịch bản: ${m.reason}`
            };

            const res = await fetch("/api/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.status === "success" && data.product) {
              const newProd = data.product;
              // Thêm vào currentProducts
              currentProducts.unshift(newProd);
              prodCountBadge.textContent = currentProducts.length;

              // Thêm vào selected_product_ids
              if (!lastAnalysisResult.selected_product_ids) lastAnalysisResult.selected_product_ids = [];
              lastAnalysisResult.selected_product_ids.push(newProd.id);

              // Xóa mục này khỏi danh sách gợi ý
              lastAnalysisResult.missing_recommendations.splice(idx, 1);

              // Bổ sung vào Bình luận ghim (outComment)
              if (outComment) {
                const newLine = `- ${newProd.name}: ${affUrl}`;
                const commentVal = outComment.value.trim();
                if (commentVal.includes("Chúc bà con") || commentVal.includes("Bà con cần") || commentVal.includes("Lưu lại")) {
                  const parts = commentVal.split("\n\n");
                  if (parts.length >= 2) {
                    parts.splice(parts.length - 1, 0, newLine);
                    outComment.value = parts.join("\n\n");
                  } else {
                    outComment.value = commentVal + "\n" + newLine;
                  }
                } else {
                  outComment.value = commentVal ? commentVal + "\n" + newLine : newLine;
                }
              }

              // Render lại Studio & Kho Tab 2
              renderStudioProducts();
              renderProductsGrid();

              showToast(`Đã lưu "${newProd.name}" vào kho vĩnh viễn và chèn vào bình luận ghim!`);
            } else {
              throw new Error(data.detail || "Không thể lưu sản phẩm");
            }
          } catch (err) {
            console.error("Lỗi lưu gợi ý:", err);
            showToast("Lỗi lưu sản phẩm: " + err.message, "error");
            btn.disabled = false;
            btn.innerHTML = "<span>💾 Lưu Vào Kho & Ghép Link</span>";
          }
        });
      });

    } else {
      missingBox.style.display = "none";
    }

    // Cập nhật dropdown chọn thêm sản phẩm khác trong kho
    updateAddMoreDropdown();
  }

  function updateAddMoreDropdown() {
    if (!selectAddMoreProd) return;
    const selectedIds = lastAnalysisResult?.selected_product_ids || [];
    const available = currentProducts.filter(p => !selectedIds.includes(p.id));
    
    selectAddMoreProd.innerHTML = `<option value="">-- Chọn sản phẩm khác từ kho (${available.length} món) --</option>`;
    available.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `[${p.category || 'Khác'}] ${p.name}`;
      selectAddMoreProd.appendChild(opt);
    });
  }

  // Toggle & Confirm Thêm sản phẩm từ kho vào video
  if (btnToggleAddMore) {
    btnToggleAddMore.addEventListener("click", () => {
      const isHidden = selectAddMoreProd.style.display === "none";
      selectAddMoreProd.style.display = isHidden ? "inline-block" : "none";
      btnConfirmAddMore.style.display = isHidden ? "inline-block" : "none";
      btnToggleAddMore.textContent = isHidden ? "✖ Đóng Lại" : "➕ Chọn Thêm Sản Phẩm Khác Trong Kho";
      if (isHidden) updateAddMoreDropdown();
    });
  }

  if (btnConfirmAddMore) {
    btnConfirmAddMore.addEventListener("click", () => {
      const prodId = selectAddMoreProd.value;
      if (!prodId) {
        showToast("Vui lòng chọn 1 sản phẩm từ danh sách!", "error");
        return;
      }
      const prod = currentProducts.find(p => p.id === prodId);
      if (!prod) return;

      if (!lastAnalysisResult) lastAnalysisResult = { selected_product_ids: [] };
      if (!lastAnalysisResult.selected_product_ids) lastAnalysisResult.selected_product_ids = [];
      
      if (!lastAnalysisResult.selected_product_ids.includes(prodId)) {
        lastAnalysisResult.selected_product_ids.push(prodId);
        
        // Bổ sung vào comment
        if (outComment) {
          const newLine = `- ${prod.name}: ${prod.affiliate_url}`;
          outComment.value = outComment.value.trim() ? outComment.value.trim() + "\n" + newLine : newLine;
        }

        renderStudioProducts();
        showToast(`Đã ghép "${prod.name}" vào video!`);
      }
    });
  }

  // ================= COPY BUTTONS =================
  document.querySelectorAll(".btn-copy").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        navigator.clipboard.writeText(targetEl.value);
        showToast("Đã sao chép vào bộ nhớ tạm!");
      }
    });
  });

  // ================= PUBLISH TO FACEBOOK =================
  btnPublish.addEventListener("click", async () => {
    const title = outTitle.value.trim();
    const caption = outCaption.value.trim();
    const comment = outComment.value.trim();

    if (!title || !caption) {
      showToast("Vui lòng chạy phân tích để có Tiêu đề & Caption trước!", "error");
      return;
    }

    btnPublish.disabled = true;
    btnPublish.innerHTML = `<span>⏳ Đang chuẩn bị đăng video & bình luận...</span>`;

    // Tự động xuất và lưu ảnh bìa từ Thumbnail Canvas nếu đang mở Thumbnail Studio
    let thumbPathToSend = currentThumbnailPath || "";
    if (thumbCanvas && thumbStudioCard && thumbStudioCard.style.display !== "none") {
      try {
        btnPublish.innerHTML = `<span>⏳ Đang xuất ảnh bìa tùy chỉnh từ Thumbnail Studio...</span>`;
        const dataUrl = thumbCanvas.toDataURL("image/png");
        const resThumb = await fetch("/api/save-thumbnail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_base64: dataUrl })
        });
        const dThumb = await resThumb.json();
        if (dThumb.status === "success" && dThumb.saved_path) {
          thumbPathToSend = dThumb.saved_path;
          currentThumbnailPath = dThumb.saved_path;
        }
      } catch (errThumb) {
        console.warn("Không thể tự động xuất ảnh bìa canvas:", errThumb);
      }
    }

    btnPublish.innerHTML = `<span>⏳ Đang đăng video & ghim bình luận lên Facebook...</span>`;

    const hashtags = Array.from(hashtagsCloud.querySelectorAll(".hashtag-tag")).map(el => el.textContent);

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_path: currentVideoPath || "",
          thumbnail_path: thumbPathToSend,
          title: title,
          caption: caption,
          hashtags: hashtags,
          pinned_comment: comment,
          selected_product_ids: lastAnalysisResult?.selected_product_ids || [],
          script: scriptText.value.trim(),
          niche: nicheSelect.value
        })
      });

      const data = await res.json();
      if (data.status !== "success") {
        throw new Error(data.detail || "Lỗi đăng bài");
      }

      const fbResult = data.result;
      publishResultBox.style.display = "block";
      publishResultBox.innerHTML = `
        <h4>🎉 ${fbResult.message}</h4>
        <p>• Mã Video Reels: <code>${fbResult.video_id}</code></p>
        <p>• Mã Bình Luận Shopee: <code>${fbResult.comment_id || 'N/A'}</code></p>
        ${fbResult.thumbnail_applied ? `<p>• Ảnh bìa tùy chỉnh: <span style="color:var(--accent-primary); font-weight:600;">✅ Đã gán ảnh bìa thiết lập từ tool lên Facebook Reels</span></p>` : ''}
        <p>• Link bài đăng: <a href="${fbResult.facebook_url}" target="_blank">${fbResult.facebook_url} ↗</a></p>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Bài viết đã được tự động lưu vào Kho Kịch Bản & Lịch Sử.</p>
      `;

      showToast("Đăng video & ghim link Shopee thành công!");
      loadProducts(); // Update use counts

    } catch (e) {
      console.error("Lỗi đăng bài:", e);
      showToast(`Lỗi: ${e.message}`, "error");
      publishResultBox.style.display = "block";
      publishResultBox.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); padding: 14px 16px; border-radius: 8px; color: #fca5a5;">
          <h4 style="color: #f87171; margin-bottom: 6px;">❌ Đăng Lên Facebook Thất Bại</h4>
          <p style="font-size: 0.88rem; line-height: 1.5; margin: 0;">${e.message}</p>
        </div>
      `;
    } finally {
      btnPublish.disabled = false;
      btnPublish.innerHTML = `<span>🚀 ĐĂNG LÊN FACEBOOK REELS & GHIM LINK SHOPEE</span>`;
    }
  });

  // ================= MODAL PRODUCT CRUD =================
  btnOpenAddProduct.addEventListener("click", () => {
    modalTitle.textContent = "Thêm Sản Phẩm Shopee Mới";
    productForm.reset();
    prodIdInput.value = "";
    productModal.style.display = "flex";
  });

  function openEditProduct(id) {
    const prod = currentProducts.find(p => p.id === id);
    if (!prod) return;
    modalTitle.textContent = "Chỉnh Sửa Sản Phẩm Shopee";
    prodIdInput.value = prod.id;
    prodNameInput.value = prod.name;
    prodUrlInput.value = prod.affiliate_url;
    prodCategoryInput.value = prod.category;
    prodKeywordsInput.value = (prod.keywords || []).join(", ");
    prodNotesInput.value = prod.notes || "";
    productModal.style.display = "flex";
  }

  function closeModal() {
    productModal.style.display = "none";
  }

  btnCloseModal.addEventListener("click", closeModal);
  btnCancelModal.addEventListener("click", closeModal);

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = prodIdInput.value;
    const payload = {
      name: prodNameInput.value.trim(),
      affiliate_url: prodUrlInput.value.trim(),
      category: prodCategoryInput.value.trim(),
      keywords: prodKeywordsInput.value.split(",").map(k => k.trim()).filter(Boolean),
      notes: prodNotesInput.value.trim()
    };

    try {
      const url = id ? `/api/products/${id}` : "/api/products";
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === "success") {
        showToast(id ? "Đã cập nhật sản phẩm!" : "Đã thêm sản phẩm vào kho!");
        closeModal();
        loadProducts();
      }
    } catch (e) {
      console.error("Lỗi lưu sản phẩm:", e);
      showToast("Lỗi khi lưu sản phẩm", "error");
    }
  });

  async function deleteProduct(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi kho?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        showToast("Đã xóa sản phẩm khỏi kho");
        loadProducts();
      }
    } catch (e) {
      console.error("Lỗi xóa:", e);
      showToast("Lỗi khi xóa sản phẩm", "error");
    }
  }

  btnResetSampleProds.addEventListener("click", async () => {
    if (!confirm("Bạn có muốn nạp lại danh sách 7 sản phẩm sức khỏe mẫu?")) return;
    // Tải lại bằng cách refresh trang hoặc giữ nguyên
    showToast("Đã làm mới danh mục sản phẩm!");
    loadProducts();
  });

  // ================= SETTINGS FORM =================
  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      gemini_api_key: cfgGeminiKey.value.trim(),
      default_model: cfgDefaultModel.value,
      simulation_mode: cfgSimulationMode.checked,
      page_id: cfgPageId.value.trim(),
      page_access_token: cfgPageToken.value.trim()
    };

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === "success") {
        showToast("Đã lưu cấu hình thành công!");
        loadConfig();
      }
    } catch (e) {
      console.error("Lỗi lưu cấu hình:", e);
      showToast("Lỗi lưu cấu hình", "error");
    }
  });

  // Copy SEO Filename
  if (btnCopyFilename) {
    btnCopyFilename.addEventListener("click", () => {
      if (seoFilenameText) {
        navigator.clipboard.writeText(seoFilenameText.textContent.trim());
        showToast("Đã sao chép tên file chuẩn SEO!");
      }
    });
  }

  // Khởi động
  loadConfig();
  loadProducts();
});
