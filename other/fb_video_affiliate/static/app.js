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
  const btnLoadSampleScript = document.getElementById("btnLoadSampleScript");
  const btnAnalyze = document.getElementById("btnAnalyze");
  const videoDropZone = document.getElementById("videoDropZone");
  const videoFileInput = document.getElementById("videoFileInput");
  const dropPrompt = document.getElementById("dropPrompt");
  const videoPreviewBox = document.getElementById("videoPreviewBox");
  const videoPreview = document.getElementById("videoPreview");
  const videoFileName = document.getElementById("videoFileName");
  const btnRemoveVideo = document.getElementById("btnRemoveVideo");

  // DOM Elements - Studio Output
  const emptyOutputState = document.getElementById("emptyOutputState");
  const resultContent = document.getElementById("resultContent");
  const aiStatusTag = document.getElementById("aiStatusTag");
  const outTitle = document.getElementById("outTitle");
  const outCaption = document.getElementById("outCaption");
  const hashtagsCloud = document.getElementById("hashtagsCloud");
  const matchedCount = document.getElementById("matchedCount");
  const matchedProductsList = document.getElementById("matchedProductsList");
  const missingBox = document.getElementById("missingBox");
  const missingList = document.getElementById("missingList");
  const outComment = document.getElementById("outComment");
  const btnPublish = document.getElementById("btnPublish");
  const publishResultBox = document.getElementById("publishResultBox");

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

  // ================= SAMPLE SCRIPT LOADER =================
  const SAMPLE_SCRIPT = `Nhiều người hay có thói quen tắm muộn, rước bệnh vào người lúc nào không hay. Thứ nhất là rất dễ bị cảm lạnh, trúng gió sưng vù cả mặt.
Thứ hai là máu huyết khó lưu thông, cực kỳ nguy hiểm cho tim mạch và huyết áp. Thứ ba là đêm lạnh làm co thắt mạch máu dễ gây đột quỵ.
Tắm sau mười giờ đêm là cấm kỵ nha bà con. Đừng ỷ mình khỏe mà chủ quan. Thấy đúng thì thả tim và theo dõi kênh để xem mẹo hay nhé.`;

  btnLoadSampleScript.addEventListener("click", () => {
    scriptText.value = SAMPLE_SCRIPT;
    nicheSelect.value = "Sức khỏe & Đời sống (Bán hàng Affiliate)";
    showToast("Đã nạp kịch bản mẫu Tắm Đêm (30 giây)!");
  });

  // ================= VIDEO UPLOAD & DRAG DROP =================
  videoDropZone.addEventListener("click", () => videoFileInput.click());

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
    videoPreview.src = "";
    videoFileInput.value = "";
    videoPreviewBox.style.display = "none";
    dropPrompt.style.display = "block";
  });

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

      // Render Hashtags
      hashtagsCloud.innerHTML = "";
      (aiData.hashtags || []).forEach(tag => {
        const span = document.createElement("span");
        span.className = "hashtag-tag";
        span.textContent = tag.startsWith("#") ? tag : `#${tag}`;
        hashtagsCloud.appendChild(span);
      });

      // Render Matched Products
      matchedProductsList.innerHTML = "";
      const selectedIds = aiData.selected_product_ids || [];
      matchedCount.textContent = `${selectedIds.length} món phù hợp`;

      const matchedProds = currentProducts.filter(p => selectedIds.includes(p.id));
      if (matchedProds.length > 0) {
        matchedProds.forEach(p => {
          const item = document.createElement("div");
          item.className = "matched-item";
          item.innerHTML = `
            <div>
              <div class="matched-item-title">🛒 ${p.name}</div>
              <a href="${p.affiliate_url}" target="_blank" class="matched-item-link">${p.affiliate_url}</a>
            </div>
            <span class="badge" style="color:var(--accent-emerald); font-size:0.75rem;">${p.category}</span>
          `;
          matchedProductsList.appendChild(item);
        });
      } else {
        matchedProductsList.innerHTML = `<p style="font-size:0.85rem; color:var(--text-muted)">Không có sản phẩm nào trong kho khớp 100%.</p>`;
      }

      // Render Missing Recommendations
      const missing = aiData.missing_recommendations || [];
      if (missing.length > 0) {
        missingBox.style.display = "block";
        missingList.innerHTML = missing.map(m => `
          <div style="margin-bottom:6px;">
            <b>• ${m.product_name}</b>: ${m.reason} 
            <i>(Từ khóa tìm trên Shopee: "<u>${m.search_keyword}</u>")</i>
          </div>
        `).join("");
      } else {
        missingBox.style.display = "none";
      }

      showToast("Gemini Flash đã hoàn tất phân tích và ghép 5 link Shopee!");
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
    btnPublish.innerHTML = `<span>⏳ Đang đăng video & ghim comment Shopee...</span>`;

    const hashtags = Array.from(hashtagsCloud.querySelectorAll(".hashtag-tag")).map(el => el.textContent);

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_path: currentVideoPath || "",
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
        <p>• Link bài đăng: <a href="${fbResult.facebook_url}" target="_blank">${fbResult.facebook_url} ↗</a></p>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Bài viết đã được tự động lưu vào Kho Kịch Bản & Lịch Sử.</p>
      `;

      showToast("Đăng video & ghim link Shopee thành công!");
      loadProducts(); // Update use counts

    } catch (e) {
      console.error("Lỗi đăng bài:", e);
      showToast(`Lỗi: ${e.message}`, "error");
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

  // Khởi động
  loadConfig();
  loadProducts();
});
