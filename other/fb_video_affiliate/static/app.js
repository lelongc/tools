/* ==========================================================================
   Frontend Application Logic - FB Reels & Shopee Affiliate Hub
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Global States
  let currentConfig = {};
  let currentProducts = [];
  let currentPages = [];
  let activePageId = "";
  let currentVideoPath = "";
  let lastAnalysisResult = null;
  let currentPhotoPath = "";
  let lastPhotoAnalysisResult = null;
  let isPhotoScheduleMode = false;
  let selectedPhotoGoldenSlot = "";
  let editingPageId = null;

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
  const btnPublish = document.getElementById("btnPublish");
  const btnPublishIcon = document.getElementById("btnPublishIcon");
  const btnPublishText = document.getElementById("btnPublishText");
  const publishResultBox = document.getElementById("publishResultBox");
  const btnToggleAddMore = document.getElementById("btnToggleAddMore");
  const selectAddMoreProd = document.getElementById("selectAddMoreProd");
  const btnConfirmAddMore = document.getElementById("btnConfirmAddMore");

  // DOM Elements - Scheduler
  const btnModeImmediate = document.getElementById("btnModeImmediate");
  const btnModeSchedule = document.getElementById("btnModeSchedule");
  const scheduleSettingsBox = document.getElementById("scheduleSettingsBox");
  const presetSlotButtons = document.querySelectorAll(".btn-preset-slot");
  const inputScheduleTime = document.getElementById("inputScheduleTime");
  const scheduleSummaryAlert = document.getElementById("scheduleSummaryAlert");
  const scheduleTargetText = document.getElementById("scheduleTargetText");
  const chkMetaCloudSchedule = document.getElementById("chkMetaCloudSchedule");
  const scheduledCountBadge = document.getElementById("scheduledCountBadge");
  const scheduledQueueList = document.getElementById("scheduledQueueList");
  const btnRefreshSchedule = document.getElementById("btnRefreshSchedule");

  let isScheduleMode = false;
  let selectedGoldenLabel = "";

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
  const currentModelBadge = document.getElementById("currentModelBadge");
  const fbModeText = document.getElementById("fbModeText");

  // DOM Elements - Multi-Fanpage Management
  const headerActivePageSelect = document.getElementById("headerActivePageSelect");
  const pagesTableBody = document.getElementById("pagesTableBody");
  const cfgActivePageBadge = document.getElementById("cfgActivePageBadge");
  const newCfgPageId = document.getElementById("newCfgPageId");
  const newCfgPageName = document.getElementById("newCfgPageName");
  const newCfgPageToken = document.getElementById("newCfgPageToken");
  const btnVerifyPageToken = document.getElementById("btnVerifyPageToken");
  const btnSavePage = document.getElementById("btnSavePage");
  const btnCancelEditPage = document.getElementById("btnCancelEditPage");
  const pageVerifyAlert = document.getElementById("pageVerifyAlert");
  const pageFormTitle = document.getElementById("pageFormTitle");

  // DOM Elements - Studio Switcher (Reels vs Photo)
  const btnTypeReels = document.getElementById("btnTypeReels");
  const btnTypePhoto = document.getElementById("btnTypePhoto");
  const reelsStudioView = document.getElementById("reelsStudioView");
  const photoStudioView = document.getElementById("photoStudioView");

  // DOM Elements - Photo Studio
  const photoDropZone = document.getElementById("photoDropZone");
  const photoFileInput = document.getElementById("photoFileInput");
  const photoDropPrompt = document.getElementById("photoDropPrompt");
  const photoPreviewBox = document.getElementById("photoPreviewBox");
  const photoPreviewImg = document.getElementById("photoPreviewImg");
  const photoFileName = document.getElementById("photoFileName");
  const btnRemovePhoto = document.getElementById("btnRemovePhoto");
  const photoPromptInput = document.getElementById("photoPromptInput");
  const btnAnalyzePhoto = document.getElementById("btnAnalyzePhoto");
  const photoStatusTag = document.getElementById("photoStatusTag");
  const photoEmptyState = document.getElementById("photoEmptyState");
  const photoResultContent = document.getElementById("photoResultContent");
  const outPhotoTitle = document.getElementById("outPhotoTitle");
  const outPhotoCaption = document.getElementById("outPhotoCaption");
  const photoHashtagsCloud = document.getElementById("photoHashtagsCloud");
  const outPhotoComment = document.getElementById("outPhotoComment");
  const btnPhotoModeImmediate = document.getElementById("btnPhotoModeImmediate");
  const btnPhotoModeSchedule = document.getElementById("btnPhotoModeSchedule");
  const photoScheduleSettingsBox = document.getElementById("photoScheduleSettingsBox");
  const photoPresetSlotButtons = document.querySelectorAll(".btn-photo-slot");
  const inputPhotoScheduleTime = document.getElementById("inputPhotoScheduleTime");
  const chkPhotoMetaCloudSchedule = document.getElementById("chkPhotoMetaCloudSchedule");
  const btnPublishPhoto = document.getElementById("btnPublishPhoto");
  const btnPublishPhotoIcon = document.getElementById("btnPublishPhotoIcon");
  const btnPublishPhotoText = document.getElementById("btnPublishPhotoText");
  const photoPublishResultBox = document.getElementById("photoPublishResultBox");

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
      if (targetTab === "schedule") loadScheduledTasks();
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
    if (cfgGeminiKey) cfgGeminiKey.value = currentConfig.gemini_api_key || "";
    if (cfgDefaultModel) cfgDefaultModel.value = currentConfig.default_model || "gemini-3.5-flash-lite";
    if (cfgSimulationMode) cfgSimulationMode.checked = !!currentConfig.facebook?.simulation_mode;
    loadPages();
  }

  // ================= MULTI-FANPAGE MANAGEMENT =================
  async function loadPages() {
    try {
      const res = await fetch("/api/facebook/pages");
      const data = await res.json();
      currentPages = data.pages || [];
      activePageId = data.active_page_id || "";

      // 1. Render Header Selector
      if (headerActivePageSelect) {
        headerActivePageSelect.innerHTML = "";
        if (currentPages.length === 0) {
          headerActivePageSelect.innerHTML = `<option value="">(Chưa có Fanpage)</option>`;
        } else {
          currentPages.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = `${p.name || 'Fanpage'} (${p.id.slice(-6)})`;
            if (p.is_active || p.id === activePageId) {
              opt.selected = true;
            }
            headerActivePageSelect.appendChild(opt);
          });
        }
      }

      // 2. Render Settings Active Badge
      if (cfgActivePageBadge) {
        const activePage = currentPages.find(p => p.is_active || p.id === activePageId);
        if (activePage) {
          cfgActivePageBadge.textContent = `Trang Đang Chọn: ${activePage.name} (${activePage.id})`;
          cfgActivePageBadge.style.color = "var(--accent-emerald)";
        } else {
          cfgActivePageBadge.textContent = "Chưa chọn trang";
          cfgActivePageBadge.style.color = "var(--text-muted)";
        }
      }

      // 3. Render Settings Table
      renderPagesTable();
    } catch (err) {
      console.error("Lỗi tải danh sách Fanpage:", err);
    }
  }

  function renderPagesTable() {
    if (!pagesTableBody) return;
    pagesTableBody.innerHTML = "";

    if (currentPages.length === 0) {
      pagesTableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center; color:var(--text-muted); padding: 18px;">
            Chưa có Fanpage nào được kết nối. Hãy thêm Page ID và Token ở bên dưới!
          </td>
        </tr>
      `;
      return;
    }

    currentPages.forEach(p => {
      const tr = document.createElement("tr");
      const isActive = p.is_active || p.id === activePageId;
      tr.innerHTML = `
        <td>
          <span class="page-status-badge ${isActive ? 'active' : 'inactive'}">
            ${isActive ? '● Đang Dùng' : '○ Phụ'}
          </span>
        </td>
        <td><b>${p.name || 'Fanpage'}</b></td>
        <td><code>${p.id}</code></td>
        <td style="text-align: center;">
          ${!isActive ? `<button type="button" class="btn-table-action btn-select" data-id="${p.id}">Kích Hoạt</button>` : ''}
          <button type="button" class="btn-table-action btn-edit-page" data-id="${p.id}">Sửa</button>
          <button type="button" class="btn-table-action btn-del" data-id="${p.id}">Xóa</button>
        </td>
      `;
      pagesTableBody.appendChild(tr);
    });

    // Attach row events
    pagesTableBody.querySelectorAll(".btn-select").forEach(b => {
      b.addEventListener("click", () => switchActivePage(b.getAttribute("data-id")));
    });
    pagesTableBody.querySelectorAll(".btn-edit-page").forEach(b => {
      b.addEventListener("click", () => editPage(b.getAttribute("data-id")));
    });
    pagesTableBody.querySelectorAll(".btn-del").forEach(b => {
      b.addEventListener("click", () => deletePage(b.getAttribute("data-id")));
    });
  }

  // Chuyển trang hoạt động
  async function switchActivePage(pageId) {
    try {
      const res = await fetch(`/api/facebook/pages/${pageId}/activate`, { method: "POST" });
      const d = await res.json();
      if (d.status === "success") {
        showToast(`Đã chuyển sang trang: ${d.active_page_name || pageId}`);
        loadPages();
      } else {
        throw new Error(d.detail || "Không thể kích hoạt trang");
      }
    } catch (e) {
      showToast("Lỗi chuyển trang: " + e.message, "error");
    }
  }

  // Header select event
  if (headerActivePageSelect) {
    headerActivePageSelect.addEventListener("change", () => {
      const selectedId = headerActivePageSelect.value;
      if (selectedId && selectedId !== activePageId) {
        switchActivePage(selectedId);
      }
    });
  }

  // Kiểm tra token qua Graph API
  if (btnVerifyPageToken) {
    btnVerifyPageToken.addEventListener("click", async () => {
      const pId = newCfgPageId.value.trim();
      const pTok = newCfgPageToken.value.trim();
      if (!pId || !pTok) {
        showToast("Vui lòng nhập Page ID và Page Access Token trước!", "error");
        return;
      }
      btnVerifyPageToken.disabled = true;
      btnVerifyPageToken.innerHTML = `<span>⏳ Đang kiểm tra với Meta Graph API...</span>`;
      pageVerifyAlert.style.display = "none";

      try {
        const res = await fetch("/api/facebook/pages/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page_id: pId, access_token: pTok })
        });
        const d = await res.json();
        pageVerifyAlert.style.display = "block";
        if (d.valid) {
          const pgName = d.name || d.page_name || "Fanpage";
          const pgId = d.id || d.page_id || pId;
          pageVerifyAlert.className = "alert-box alert-success";
          pageVerifyAlert.innerHTML = `✅ Kết nối thành công! Tên Trang: <b>${pgName}</b> (ID: ${pgId})`;
          if (!newCfgPageName.value.trim()) {
            newCfgPageName.value = pgName;
          }
          showToast(`Xác thực thành công Fanpage: ${pgName}!`);
        } else {
          pageVerifyAlert.className = "alert-box alert-error";
          pageVerifyAlert.innerHTML = `❌ Token không hợp lệ hoặc thiếu quyền: ${d.message || d.error}`;
          showToast("Xác thực thất bại", "error");
        }
      } catch (err) {
        pageVerifyAlert.style.display = "block";
        pageVerifyAlert.className = "alert-box alert-error";
        pageVerifyAlert.innerHTML = `❌ Lỗi kết nối: ${err.message}`;
      } finally {
        btnVerifyPageToken.disabled = false;
        btnVerifyPageToken.innerHTML = `<span>🔍 Kiểm Tra Token & Lấy Tên Tự Động</span>`;
      }
    });
  }

  // Lưu Fanpage
  if (btnSavePage) {
    btnSavePage.addEventListener("click", async () => {
      const pId = newCfgPageId.value.trim();
      const pName = newCfgPageName.value.trim();
      const pTok = newCfgPageToken.value.trim();

      if (!pId) {
        showToast("Vui lòng nhập Facebook Page ID!", "error");
        newCfgPageId.focus();
        return;
      }
      if (!pTok) {
        showToast("Vui lòng nhập Page Access Token!", "error");
        newCfgPageToken.focus();
        return;
      }

      btnSavePage.disabled = true;
      btnSavePage.innerHTML = `<span>⏳ Đang lưu Fanpage...</span>`;

      try {
        const res = await fetch("/api/facebook/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: pId,
            name: pName,
            access_token: pTok,
            is_active: currentPages.length === 0
          })
        });
        const d = await res.json();
        if (d.status === "success") {
          showToast(`Đã lưu Fanpage "${pName || pId}" thành công!`);
          cancelEditPage();
          loadPages();
        } else {
          throw new Error(d.detail || "Lỗi lưu Fanpage");
        }
      } catch (err) {
        showToast("Lỗi lưu Fanpage: " + err.message, "error");
      } finally {
        btnSavePage.disabled = false;
        btnSavePage.innerHTML = `<span>💾 Lưu Fanpage Này</span>`;
      }
    });
  }

  function editPage(pageId) {
    const p = currentPages.find(item => item.id === pageId);
    if (!p) return;
    editingPageId = pageId;
    newCfgPageId.value = p.id;
    newCfgPageName.value = p.name || "";
    newCfgPageToken.value = "";
    newCfgPageToken.placeholder = "Nhập token mới hoặc để trống nếu không đổi";
    if (pageFormTitle) pageFormTitle.textContent = `✏️ Chỉnh Sửa Fanpage: ${p.name || p.id}`;
    if (btnCancelEditPage) btnCancelEditPage.style.display = "inline-flex";
    if (pageVerifyAlert) pageVerifyAlert.style.display = "none";
    newCfgPageId.focus();
  }

  function cancelEditPage() {
    editingPageId = null;
    newCfgPageId.value = "";
    newCfgPageName.value = "";
    newCfgPageToken.value = "";
    newCfgPageToken.placeholder = "EAAxxxxxxxxx...";
    if (pageFormTitle) pageFormTitle.textContent = "➕ Thêm / Sửa Trang Facebook";
    if (btnCancelEditPage) btnCancelEditPage.style.display = "none";
    if (pageVerifyAlert) pageVerifyAlert.style.display = "none";
  }

  if (btnCancelEditPage) {
    btnCancelEditPage.addEventListener("click", cancelEditPage);
  }

  async function deletePage(pageId) {
    const p = currentPages.find(item => item.id === pageId);
    const pName = p ? p.name : pageId;
    if (!confirm(`Bạn có chắc chắn muốn xóa Fanpage "${pName}" khỏi danh sách quản lý?`)) return;

    try {
      const res = await fetch(`/api/facebook/pages/${pageId}`, { method: "DELETE" });
      const d = await res.json();
      if (d.status === "success") {
        showToast(`Đã xóa Fanpage "${pName}" khỏi danh sách!`);
        if (editingPageId === pageId) cancelEditPage();
        loadPages();
      } else {
        throw new Error(d.detail || "Lỗi xóa");
      }
    } catch (err) {
      showToast("Lỗi xóa Fanpage: " + err.message, "error");
    }
  }

  // ================= STUDIO SWITCHER (REELS vs PHOTO) =================
  if (btnTypeReels && btnTypePhoto) {
    btnTypeReels.addEventListener("click", () => {
      btnTypeReels.classList.add("active");
      btnTypePhoto.classList.remove("active");
      if (reelsStudioView) reelsStudioView.style.display = "grid";
      if (photoStudioView) photoStudioView.style.display = "none";
    });

    btnTypePhoto.addEventListener("click", () => {
      btnTypePhoto.classList.add("active");
      btnTypeReels.classList.remove("active");
      if (reelsStudioView) reelsStudioView.style.display = "none";
      if (photoStudioView) photoStudioView.style.display = "grid";
    });
  }

  // ================= PHOTO STUDIO IMPLEMENTATION =================
  // 1. Drag & Drop Upload Photo
  if (photoDropZone && photoFileInput) {
    photoDropZone.addEventListener("click", (e) => {
      if (e.target.id !== "btnRemovePhoto") {
        photoFileInput.click();
      }
    });

    photoFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) handlePhotoUpload(file);
    });

    photoDropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      photoDropZone.classList.add("drag-over");
    });

    photoDropZone.addEventListener("dragleave", () => {
      photoDropZone.classList.remove("drag-over");
    });

    photoDropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      photoDropZone.classList.remove("drag-over");
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handlePhotoUpload(file);
      } else {
        showToast("Vui lòng tải lên file hình ảnh (JPG, PNG, WEBP)!", "error");
      }
    });
  }

  async function handlePhotoUpload(file) {
    const formData = new FormData();
    formData.append("file", file);

    if (photoFileName) photoFileName.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    if (photoDropPrompt) photoDropPrompt.style.display = "none";
    if (photoPreviewBox) photoPreviewBox.style.display = "block";

    // Client-side instant preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (photoPreviewImg) photoPreviewImg.src = e.target.result;
    };
    reader.readAsDataURL(file);

    try {
      const res = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData
      });
      const d = await res.json();
      if (d.status === "success") {
        currentPhotoPath = d.saved_path;
        showToast(`Đã nhận ảnh: ${file.name}`);
      } else {
        throw new Error(d.detail || "Không thể tải ảnh");
      }
    } catch (err) {
      console.error("Lỗi tải ảnh:", err);
      showToast("Lỗi tải ảnh: " + err.message, "error");
    }
  }

  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener("click", (e) => {
      e.stopPropagation();
      currentPhotoPath = "";
      if (photoFileInput) photoFileInput.value = "";
      if (photoPreviewImg) photoPreviewImg.src = "";
      if (photoPreviewBox) photoPreviewBox.style.display = "none";
      if (photoDropPrompt) photoDropPrompt.style.display = "block";
    });
  }

  // 2. AI Analyze Photo Prompt
  if (btnAnalyzePhoto) {
    btnAnalyzePhoto.addEventListener("click", async () => {
      const promptVal = photoPromptInput ? photoPromptInput.value.trim() : "";
      
      btnAnalyzePhoto.disabled = true;
      btnAnalyzePhoto.innerHTML = `<span>⏳ Gemini Flash đang viết bài & khớp link Shopee...</span>`;
      if (photoStatusTag) photoStatusTag.textContent = "AI đang xử lý...";

      try {
        const res = await fetch("/api/analyze-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photo_path: currentPhotoPath || "",
            prompt: promptVal,
            niche: "Sức khỏe"
          })
        });

        const d = await res.json();
        if (d.status !== "success") {
          throw new Error(d.detail || "Lỗi AI phân tích");
        }

        const data = d.data;
        lastPhotoAnalysisResult = data;

        if (photoEmptyState) photoEmptyState.style.display = "none";
        if (photoResultContent) photoResultContent.style.display = "block";
        if (photoStatusTag) photoStatusTag.textContent = "Đã tạo nội dung";

        if (outPhotoTitle) outPhotoTitle.value = data.title || "";
        if (outPhotoCaption) outPhotoCaption.value = data.caption || "";
        if (outPhotoComment) outPhotoComment.value = data.pinned_comment || "";

        if (photoHashtagsCloud) {
          photoHashtagsCloud.innerHTML = "";
          (data.hashtags || []).forEach(tag => {
            const span = document.createElement("span");
            span.className = "hashtag-tag";
            span.textContent = tag.startsWith("#") ? tag : `#${tag}`;
            photoHashtagsCloud.appendChild(span);
          });
        }

        showToast("Gemini đã viết xong bài viết ảnh và khớp link Shopee!");
      } catch (err) {
        console.error("Lỗi phân tích bài viết ảnh:", err);
        showToast("Lỗi AI: " + err.message, "error");
      } finally {
        btnAnalyzePhoto.disabled = false;
        btnAnalyzePhoto.innerHTML = `<span>✨ AI Tạo Caption & Khớp Link Shopee</span>`;
      }
    });
  }

  // 3. Photo Schedule Mode Controls
  if (btnPhotoModeImmediate && btnPhotoModeSchedule) {
    btnPhotoModeImmediate.addEventListener("click", () => {
      isPhotoScheduleMode = false;
      btnPhotoModeImmediate.classList.add("active");
      btnPhotoModeSchedule.classList.remove("active");
      if (photoScheduleSettingsBox) photoScheduleSettingsBox.style.display = "none";
      if (btnPublishPhotoText) btnPublishPhotoText.textContent = "ĐĂNG BÀI VIẾT ẢNH & GHIM LINK SHOPEE";
      if (btnPublishPhotoIcon) btnPublishPhotoIcon.textContent = "🚀";
    });

    btnPhotoModeSchedule.addEventListener("click", () => {
      isPhotoScheduleMode = true;
      btnPhotoModeSchedule.classList.add("active");
      btnPhotoModeImmediate.classList.remove("active");
      if (photoScheduleSettingsBox) photoScheduleSettingsBox.style.display = "block";
      if (btnPublishPhotoText) btnPublishPhotoText.textContent = "LÊN LỊCH ĐĂNG BÀI VIẾT ẢNH";
      if (btnPublishPhotoIcon) btnPublishPhotoIcon.textContent = "⏰";

      // Mặc định chọn slot đầu tiên nếu chưa chọn
      if (inputPhotoScheduleTime && !inputPhotoScheduleTime.value) {
        const firstSlot = document.querySelector(".btn-photo-slot");
        if (firstSlot) firstSlot.click();
      }
    });
  }

  photoPresetSlotButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      photoPresetSlotButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const slot = btn.getAttribute("data-slot"); // ví dụ "19:00"
      if (!slot) return;
      const [h, m] = slot.split(":").map(Number);

      const now = new Date();
      let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
      if (target.getTime() <= now.getTime() + 600000) { // Nếu đã qua hoặc còn dưới 10 phút, sang ngày mai
        target.setDate(target.getDate() + 1);
      }

      const pad = (n) => String(n).padStart(2, "0");
      const isoStr = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
      if (inputPhotoScheduleTime) inputPhotoScheduleTime.value = isoStr;
      selectedPhotoGoldenSlot = btn.querySelector(".slot-desc")?.textContent || slot;

      if (btnPublishPhotoText) {
        btnPublishPhotoText.textContent = `LÊN LỊCH ĐĂNG ẢNH VÀO ${slot} (${pad(target.getDate())}/${pad(target.getMonth() + 1)})`;
      }
      showToast(`Đã chọn khung giờ: ${slot}`);
    });
  });

  // 4. Publish Photo Action
  if (btnPublishPhoto) {
    btnPublishPhoto.addEventListener("click", async () => {
      const caption = outPhotoCaption ? outPhotoCaption.value.trim() : "";
      const title = outPhotoTitle ? outPhotoTitle.value.trim() : "";
      const comment = outPhotoComment ? outPhotoComment.value.trim() : "";

      if (!caption) {
        showToast("Vui lòng nhập nội dung bài viết ảnh (Caption) trước!", "error");
        if (outPhotoCaption) outPhotoCaption.focus();
        return;
      }

      if (isPhotoScheduleMode) {
        if (!inputPhotoScheduleTime || !inputPhotoScheduleTime.value) {
          showToast("Vui lòng chọn thời gian hẹn giờ phát sóng bài viết ảnh!", "error");
          return;
        }
        const schedTime = new Date(inputPhotoScheduleTime.value).getTime();
        if (schedTime <= Date.now() + 45000) {
          showToast("Thời gian hẹn giờ phải lớn hơn thời điểm hiện tại ít nhất 1 phút!", "error");
          return;
        }
      }

      btnPublishPhoto.disabled = true;
      btnPublishPhoto.innerHTML = isPhotoScheduleMode ? 
        `<span>⏳ Đang ghi nhận lịch hẹn đăng ảnh...</span>` : 
        `<span>⏳ Đang đăng bài viết ảnh & ghim bình luận lên Facebook...</span>`;

      const hashtags = photoHashtagsCloud ? 
        Array.from(photoHashtagsCloud.querySelectorAll(".hashtag-tag")).map(el => el.textContent) : [];

      const targetPageId = headerActivePageSelect ? headerActivePageSelect.value : "";

      try {
        const payload = {
          photo_path: currentPhotoPath || "",
          title: title,
          caption: caption,
          hashtags: hashtags,
          pinned_comment: comment,
          selected_product_ids: lastPhotoAnalysisResult?.selected_product_ids || [],
          target_page_id: targetPageId,
          is_scheduled: isPhotoScheduleMode,
          scheduled_time: isPhotoScheduleMode ? inputPhotoScheduleTime.value : "",
          meta_cloud_schedule: isPhotoScheduleMode && chkPhotoMetaCloudSchedule ? chkPhotoMetaCloudSchedule.checked : false,
          golden_slot_label: isPhotoScheduleMode ? selectedPhotoGoldenSlot : ""
        };

        const res = await fetch("/api/publish-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok || data.status === "error") {
          throw new Error(data.detail || "Lỗi đăng bài viết ảnh");
        }

        if (photoPublishResultBox) {
          photoPublishResultBox.style.display = "block";
          if (data.status === "scheduled") {
            const task = data.task || {};
            photoPublishResultBox.innerHTML = `
              <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); padding: 16px; border-radius: 8px;">
                <h4 style="color:#6ee7b7; margin-bottom: 8px;">⏰ Đã Lên Lịch Đăng Bài Viết Ảnh Thành Công!</h4>
                <p>• Thời gian phát sóng: <b style="color:#38bdf8;">${task.target_time_str || inputPhotoScheduleTime.value}</b></p>
                <p>• Chế độ: <b>${data.mode === 'cloud' ? '☁️ Meta Cloud Server (Tự phát sóng)' : '💻 Local Scheduler (Tự động)'}</b></p>
                <p>• Tiêu đề: <code>${title || 'Bài Viết Ảnh'}</code></p>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-top:8px;">
                  Hệ thống đã lưu vào hàng đợi. Theo dõi tại tab <b>"Hàng Đợi Hẹn Giờ"</b>.
                </p>
              </div>
            `;
            showToast("Đã lên lịch đăng bài viết ảnh thành công!");
            loadScheduledTasks();
          } else {
            const fbResult = data.result || {};
            photoPublishResultBox.innerHTML = `
              <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); padding: 16px; border-radius: 8px;">
                <h4 style="color:#6ee7b7; margin-bottom: 8px;">🎉 ${fbResult.message || 'Đăng ảnh thành công!'}</h4>
                <p>• Mã Bài Viết: <code>${fbResult.post_id || fbResult.photo_id}</code></p>
                <p>• Mã Bình Luận Shopee: <code>${fbResult.comment_id || 'N/A'}</code></p>
                <p>• Link bài đăng: <a href="${fbResult.facebook_url}" target="_blank" style="color:#38bdf8;">${fbResult.facebook_url} ↗</a></p>
              </div>
            `;
            showToast("Đã đăng bài viết ảnh & ghim link Shopee thành công!");
            loadProducts();
          }
        }
      } catch (err) {
        console.error("Lỗi đăng ảnh:", err);
        showToast("Lỗi: " + err.message, "error");
        if (photoPublishResultBox) {
          photoPublishResultBox.style.display = "block";
          photoPublishResultBox.innerHTML = `
            <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); padding: 14px 16px; border-radius: 8px; color: #fca5a5;">
              <h4>❌ Không Thể Đăng Bài Viết Ảnh</h4>
              <p>${err.message}</p>
            </div>
          `;
        }
      } finally {
        btnPublishPhoto.disabled = false;
        if (isPhotoScheduleMode) {
          btnPublishPhoto.innerHTML = `<span>⏰ LÊN LỊCH ĐĂNG BÀI VIẾT ẢNH</span>`;
        } else {
          btnPublishPhoto.innerHTML = `<span>🚀 ĐĂNG BÀI VIẾT ẢNH & GHIM LINK SHOPEE</span>`;
        }
      }
    });
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
      const isPhoto = item.post_type === "photo";
      const typeBadge = isPhoto ? 
        `<span class="badge" style="background:rgba(56,189,248,0.15); color:#38bdf8;">🖼️ Bài Viết Ảnh</span>` : 
        `<span class="badge" style="background:rgba(168,85,247,0.15); color:#c084fc;">🎬 Video Reels</span>`;

      card.innerHTML = `
        <div class="history-card-header">
          <div style="display:flex; align-items:center; gap:8px;">
            ${typeBadge}
            <span>${item.niche || "Sức khỏe"} • ${item.timestamp}</span>
          </div>
          <span class="badge" style="color:var(--accent-emerald)">${item.facebook_result?.mode === "simulation" ? "Mô Phỏng" : "Đã Đăng FB"}</span>
        </div>
        <h3>${item.title || (isPhoto ? 'Bài Viết Ảnh Sức Khỏe' : 'Video Reels Sức Khỏe')}</h3>
        <div class="history-script"><b>${isPhoto ? 'Nội dung caption:' : 'Kịch bản gốc:'}</b> ${isPhoto ? (item.caption ? item.caption.slice(0, 180) + '...' : '') : (item.script ? item.script.slice(0, 180) + '...' : 'Không có')}</div>
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

  // ================= SCHEDULER & GOLDEN HOURS LOGIC =================
  function formatRemainingTime(seconds) {
    if (seconds <= 0) return "Đến giờ đăng";
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `Còn ${hours}h ${mins}m`;
    if (mins > 0) return `Còn ${mins} phút ${secs}s`;
    return `Còn ${secs} giây`;
  }

  function setPresetTime(hour, minute, label) {
    const now = new Date();
    const target = new Date();
    target.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);

    // Meta Graph API yêu cầu tối thiểu 15 phút, nếu giờ hôm nay còn dưới 15 phút hoặc đã qua thì hẹn sang ngày mai
    if (target.getTime() <= now.getTime() + 15 * 60 * 1000) {
      target.setDate(target.getDate() + 1);
    }

    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, "0");
    const dd = String(target.getDate()).padStart(2, "0");
    const hh = String(target.getHours()).padStart(2, "0");
    const min = String(target.getMinutes()).padStart(2, "0");

    const isoStr = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    if (inputScheduleTime) {
      inputScheduleTime.value = isoStr;
    }

    selectedGoldenLabel = label || "";
    updateScheduleAlertAndButton(target, label);
  }

  function updateScheduleAlertAndButton(dateObj, label = "") {
    if (!dateObj || isNaN(dateObj.getTime())) {
      if (scheduleSummaryAlert) scheduleSummaryAlert.style.display = "none";
      if (btnPublishText) btnPublishText.textContent = "LÊN LỊCH ĐĂNG VIDEO REELS";
      return;
    }

    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dayName = days[dateObj.getDay()];
    const dateStr = `${dayName}, ${String(dateObj.getDate()).padStart(2, "0")}/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${dateObj.getFullYear()}`;
    const timeStr = `${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

    if (scheduleSummaryAlert && scheduleTargetText) {
      scheduleSummaryAlert.style.display = "block";
      scheduleTargetText.textContent = `${timeStr} - ${dateStr} ${label ? `(${label})` : ""}`;
    }

    if (btnPublishText) {
      btnPublishText.textContent = `LÊN LỊCH ĐĂNG VÀO ${timeStr} (${dateStr})`;
    }
    if (btnPublishIcon) {
      btnPublishIcon.textContent = "⏰";
    }
  }

  if (btnModeImmediate) {
    btnModeImmediate.addEventListener("click", () => {
      isScheduleMode = false;
      btnModeImmediate.classList.add("active");
      if (btnModeSchedule) btnModeSchedule.classList.remove("active");
      if (scheduleSettingsBox) scheduleSettingsBox.style.display = "none";
      if (btnPublishText) btnPublishText.textContent = "ĐĂNG LÊN FACEBOOK REELS & GHIM LINK SHOPEE";
      if (btnPublishIcon) btnPublishIcon.textContent = "🚀";
    });
  }

  if (btnModeSchedule) {
    btnModeSchedule.addEventListener("click", () => {
      isScheduleMode = true;
      btnModeSchedule.classList.add("active");
      if (btnModeImmediate) btnModeImmediate.classList.remove("active");
      if (scheduleSettingsBox) scheduleSettingsBox.style.display = "flex";
      
      // Nếu chưa chọn giờ thì tự động chọn khung giờ mặc định
      if (inputScheduleTime && !inputScheduleTime.value) {
        const firstPreset = document.querySelector(".btn-preset-slot");
        if (firstPreset) firstPreset.click();
      } else if (inputScheduleTime && inputScheduleTime.value) {
        const d = new Date(inputScheduleTime.value);
        updateScheduleAlertAndButton(d, selectedGoldenLabel);
      }
    });
  }

  presetSlotButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      presetSlotButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const h = btn.getAttribute("data-hour");
      const m = btn.getAttribute("data-minute");
      const label = btn.getAttribute("data-label");
      setPresetTime(h, m, label);
      showToast(`Đã chọn khung giờ: ${label}`);
    });
  });

  if (inputScheduleTime) {
    inputScheduleTime.addEventListener("change", () => {
      presetSlotButtons.forEach(b => b.classList.remove("active"));
      selectedGoldenLabel = "Giờ tự chọn";
      if (inputScheduleTime.value) {
        const d = new Date(inputScheduleTime.value);
        updateScheduleAlertAndButton(d, selectedGoldenLabel);
      }
    });
  }

  // ================= PUBLISH TO FACEBOOK =================
  btnPublish.addEventListener("click", async () => {
    const title = outTitle.value.trim();
    const caption = outCaption.value.trim();
    const comment = outComment.value.trim();

    if (!title || !caption) {
      showToast("Vui lòng chạy phân tích để có Tiêu đề & Caption trước!", "error");
      return;
    }

    if (isScheduleMode) {
      if (!inputScheduleTime || !inputScheduleTime.value) {
        showToast("Vui lòng chọn thời gian hẹn giờ đăng bài!", "error");
        if (inputScheduleTime) inputScheduleTime.focus();
        return;
      }
      const schedDate = new Date(inputScheduleTime.value);
      if (schedDate.getTime() <= Date.now() + 45000) {
        showToast("Thời gian hẹn giờ phải lớn hơn thời điểm hiện tại ít nhất 1 phút!", "error");
        return;
      }
    }

    btnPublish.disabled = true;
    btnPublish.innerHTML = `<span>⏳ Đang chuẩn bị dữ liệu video & bìa...</span>`;

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

    btnPublish.innerHTML = isScheduleMode ? 
      `<span>⏳ Đang ghi nhận lịch hẹn đăng...</span>` : 
      `<span>⏳ Đang đăng video & ghim bình luận lên Facebook...</span>`;

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
          niche: nicheSelect.value,
          target_page_id: headerActivePageSelect ? headerActivePageSelect.value : "",
          is_scheduled: isScheduleMode,
          scheduled_time: isScheduleMode ? inputScheduleTime.value : "",
          meta_cloud_schedule: isScheduleMode ? chkMetaCloudSchedule.checked : false,
          golden_slot_label: isScheduleMode ? selectedGoldenLabel : ""
        })
      });

      const data = await res.json();
      if (!res.ok || data.status === "error") {
        throw new Error(data.detail || "Lỗi đăng bài");
      }

      if (data.status === "scheduled") {
        publishResultBox.style.display = "block";
        const task = data.task || {};
        publishResultBox.innerHTML = `
          <h4>⏰ Đã Lên Lịch Đăng Video Thành Công!</h4>
          <p>• Thời gian phát sóng: <b style="color:#38bdf8;">${task.target_time_str || inputScheduleTime.value}</b></p>
          ${task.golden_slot_label ? `<p>• Khung giờ vàng: <span class="badge" style="background:rgba(245,158,11,0.2); color:#fbbf24;">${task.golden_slot_label}</span></p>` : ''}
          <p>• Chế độ: <b>${data.mode === 'cloud' ? '☁️ Meta Cloud Server' : '💻 Local Scheduler (Tự động ghim bình luận Shopee)'}</b></p>
          <p>• Tiêu đề: <code>${title}</code></p>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-top:8px;">
            Hệ thống đã lưu vào hàng đợi. Bạn có thể theo dõi đếm ngược hoặc hủy lịch tại tab <b>"Hàng Đợi Hẹn Giờ"</b>.
          </p>
        `;
        showToast(`Đã lên lịch đăng video vào lúc ${task.target_time_str || inputScheduleTime.value}!`);
        loadScheduledTasks();
      } else {
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
      }

    } catch (e) {
      console.error("Lỗi đăng bài:", e);
      showToast(`Lỗi: ${e.message}`, "error");
      publishResultBox.style.display = "block";
      publishResultBox.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); padding: 14px 16px; border-radius: 8px; color: #fca5a5;">
          <h4 style="color: #f87171; margin-bottom: 6px;">❌ Đăng / Hẹn Giờ Thất Bại</h4>
          <p style="font-size: 0.88rem; line-height: 1.5; margin: 0;">${e.message}</p>
        </div>
      `;
    } finally {
      btnPublish.disabled = false;
      if (isScheduleMode) {
        if (inputScheduleTime && inputScheduleTime.value) {
          const d = new Date(inputScheduleTime.value);
          updateScheduleAlertAndButton(d, selectedGoldenLabel);
        } else {
          btnPublish.innerHTML = `<span>⏰ LÊN LỊCH ĐĂNG VIDEO REELS</span>`;
        }
      } else {
        btnPublish.innerHTML = `<span>🚀 ĐĂNG LÊN FACEBOOK REELS & GHIM LINK SHOPEE</span>`;
      }
    }
  });

  // ================= SCHEDULED TASKS QUEUE RENDERER =================
  async function loadScheduledTasks() {
    try {
      const res = await fetch("/api/schedule/tasks");
      const tasks = await res.json();

      const pendingTasks = tasks.filter(t => t.status === "pending");
      if (scheduledCountBadge) {
        scheduledCountBadge.textContent = pendingTasks.length;
      }

      if (!scheduledQueueList) return;
      scheduledQueueList.innerHTML = "";

      if (tasks.length === 0) {
        scheduledQueueList.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">⏰</div>
            <h3>Chưa Có Bài Viết Nào Được Hẹn Giờ</h3>
            <p>Chọn tab <b>"Studio Tạo Bài Đăng"</b> ➔ Chọn <b>"Hẹn Giờ Đăng"</b> và chọn khung giờ vàng sức khỏe để tự động hóa hoàn toàn.</p>
          </div>
        `;
        return;
      }

      tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "scheduled-task-card";

        const isPending = task.status === "pending";
        const isCloud = Boolean(task.meta_cloud_schedule);
        const remaining = task.remaining_seconds || 0;

        let statusBadge = "";
        if (task.status === "pending") {
          statusBadge = `<span class="task-countdown-badge">⏳ ${formatRemainingTime(remaining)}</span>`;
        } else if (task.status === "publishing") {
          statusBadge = `<span class="task-countdown-badge" style="background:rgba(59,130,246,0.2); color:#60a5fa;">🚀 Đang tiến hành đăng...</span>`;
        } else if (task.status === "completed") {
          statusBadge = `<span class="task-countdown-badge" style="background:rgba(16,185,129,0.2); color:#34d399;">✅ Đã hoàn thành</span>`;
        } else if (task.status === "failed") {
          statusBadge = `<span class="task-countdown-badge" style="background:rgba(239,68,68,0.2); color:#f87171;">❌ Thất bại: ${task.error_message || 'Lỗi'}</span>`;
        }

        const isPhoto = task.post_type === "photo";
        let thumbSrc = "";
        if (task.thumbnail_path) {
          const norm = task.thumbnail_path.replace(/\\/g, "/");
          const idx = norm.indexOf("uploads/");
          thumbSrc = idx !== -1 ? `/${norm.substring(idx)}` : `/${norm}`;
        } else if (task.photo_path) {
          const norm = task.photo_path.replace(/\\/g, "/");
          const idx = norm.indexOf("uploads/");
          thumbSrc = idx !== -1 ? `/${norm.substring(idx)}` : `/${norm}`;
        }
        const thumbHtml = thumbSrc ? 
          `<img src="${thumbSrc}" class="task-thumb-img" alt="Thumbnail" onerror="this.style.display='none'">` : 
          `<span class="task-thumb-placeholder">${isPhoto ? '🖼️' : '🎬'}</span>`;

        card.innerHTML = `
          <div class="task-thumb-wrap">
            ${thumbHtml}
          </div>
          <div class="task-info-wrap">
            <div class="task-title" title="${task.title || (isPhoto ? 'Bài Viết Ảnh' : 'Video Reels')}">
              <span class="badge" style="font-size:0.75rem; background:${isPhoto ? 'rgba(56,189,248,0.2)' : 'rgba(168,85,247,0.2)'}; color:${isPhoto ? '#38bdf8' : '#c084fc'}; margin-right: 6px;">
                ${isPhoto ? '🖼️ Ảnh' : '🎬 Reels'}
              </span>
              ${task.title || (isPhoto ? 'Bài Viết Ảnh Sức Khỏe' : 'Video Reels Sức Khỏe')}
            </div>
            <div class="task-meta-row">
              <span class="task-time-badge">🎯 Giờ hẹn: ${task.target_time_str}</span>
              ${task.golden_slot_label ? `<span class="badge" style="background:rgba(245,158,11,0.15); color:#fbbf24;">${task.golden_slot_label}</span>` : ''}
              ${statusBadge}
              <span class="task-mode-badge">${isCloud ? '☁️ Meta Cloud' : '💻 Local (Auto Pinned Comment)'}</span>
            </div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:3px;">
              🔗 Đã ghép ${task.selected_product_ids ? task.selected_product_ids.length : 0} link Shopee Affiliate trong bình luận ghim
            </div>
          </div>
          <div class="task-actions-wrap">
            ${isPending ? `
              <button type="button" class="btn-xs btn-primary btn-publish-now-sched" data-id="${task.id}" data-is-photo="${isPhoto}" title="Đăng ngay lập tức">⚡ Đăng Ngay</button>
              <button type="button" class="btn-xs btn-secondary btn-cancel-sched" data-id="${task.id}" title="Hủy tác vụ hẹn giờ này" style="color:#f87171;">🗑️ Hủy</button>
            ` : ''}
            ${task.facebook_result?.facebook_url ? `
              <a href="${task.facebook_result.facebook_url}" target="_blank" class="btn-xs btn-secondary">↗ Xem Bài Viết</a>
            ` : ''}
          </div>
        `;

        scheduledQueueList.appendChild(card);
      });

      // Actions event listeners
      scheduledQueueList.querySelectorAll(".btn-publish-now-sched").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-id");
          const isPhoto = btn.getAttribute("data-is-photo") === "true";
          if (!confirm(`Bạn có muốn đăng ngay lập tức ${isPhoto ? 'bài viết ảnh' : 'video Reels'} này lên Facebook không?`)) return;
          btn.disabled = true;
          btn.textContent = "⏳ Đang đăng...";
          try {
            const res = await fetch(`/api/schedule/tasks/${id}/publish-now`, { method: "POST" });
            const d = await res.json();
            if (d.status === "success") {
              showToast("Đã tự động đăng video lên Facebook Reels thành công!");
              loadScheduledTasks();
            } else {
              throw new Error(d.detail || "Không thể đăng");
            }
          } catch (err) {
            showToast("Lỗi đăng ngay: " + err.message, "error");
            btn.disabled = false;
            btn.textContent = "⚡ Đăng Ngay";
          }
        });
      });

      scheduledQueueList.querySelectorAll(".btn-cancel-sched").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-id");
          if (!confirm("Bạn có chắc chắn muốn hủy lịch đăng video này?")) return;
          try {
            const res = await fetch(`/api/schedule/tasks/${id}`, { method: "DELETE" });
            const d = await res.json();
            if (d.status === "success") {
              showToast("Đã hủy lịch đăng thành công!");
              loadScheduledTasks();
            }
          } catch (err) {
            showToast("Lỗi hủy lịch: " + err.message, "error");
          }
        });
      });

    } catch (err) {
      console.error("Lỗi tải danh sách hẹn giờ:", err);
    }
  }

  if (btnRefreshSchedule) {
    btnRefreshSchedule.addEventListener("click", () => {
      loadScheduledTasks();
      showToast("Đã làm mới danh sách hẹn giờ!");
    });
  }

  // Tự động quét cập nhật countdown mỗi 20 giây khi tab Hàng Đợi đang mở
  setInterval(() => {
    const schedulePane = document.getElementById("tab-schedule");
    if (schedulePane && schedulePane.classList.contains("active")) {
      loadScheduledTasks();
    }
  }, 20000);

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
      simulation_mode: cfgSimulationMode.checked
    };

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === "success") {
        showToast("Đã lưu cấu hình chung (Gemini & Mode) thành công!");
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
  loadScheduledTasks();
  loadPages();
});
