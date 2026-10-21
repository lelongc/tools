/**
 * ShortsRevoice AI Studio - Frontend Logic
 * Supports video player synchronization, Gemini Multimodal Audio analysis,
 * Edge-TTS batch synthesis, browser mic recording with auto silence-trim & tempo-fit,
 * and native CapCut PC draft project generation.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Global State
  const state = {
    videoFile: null,
    videoPath: "",
    audioPath: "",
    videoDuration: 0,
    segments: [],
    voiceMode: "tts",
    mediaRecorder: null,
    recordingChunks: [],
    recordingSegmentId: null,
    currentConfig: {}
  };

  // DOM Elements
  const dropzone = document.getElementById("dropzone");
  const videoFileInput = document.getElementById("videoFileInput");
  const videoContainer = document.getElementById("videoContainer");
  const mainVideoPlayer = document.getElementById("mainVideoPlayer");
  const videoControlsBar = document.getElementById("videoControlsBar");
  const btnPlayPause = document.getElementById("btnPlayPause");
  const videoTimelineScrubber = document.getElementById("videoTimelineScrubber");
  const currentTimeDisplay = document.getElementById("currentTimeDisplay");
  const totalTimeDisplay = document.getElementById("totalTimeDisplay");
  const videoDurationBadge = document.getElementById("videoDurationBadge");

  const nicheSelect = document.getElementById("nicheSelect");
  const styleSelect = document.getElementById("styleSelect");
  const btnAnalyzeAI = document.getElementById("btnAnalyzeAI");
  const btnAnalyzeText = document.getElementById("btnAnalyzeText");
  const originalVolumeSlider = document.getElementById("originalVolumeSlider");
  const origVolVal = document.getElementById("origVolVal");

  const videoMetaBox = document.getElementById("videoMetaBox");
  const suggestedTitleInput = document.getElementById("suggestedTitleInput");
  const suggestedSummaryText = document.getElementById("suggestedSummaryText");
  const totalSegmentsCount = document.getElementById("totalSegmentsCount");

  const voiceTabs = document.querySelectorAll(".voice-tab");
  const subBarTTS = document.getElementById("subBarTTS");
  const subBarMic = document.getElementById("subBarMic");
  const subBarFull = document.getElementById("subBarFull");
  const voiceSelect = document.getElementById("voiceSelect");
  const btnGenerateAllTTS = document.getElementById("btnGenerateAllTTS");

  const fullAudioFileInput = document.getElementById("fullAudioFileInput");
  const btnProcessFullAudio = document.getElementById("btnProcessFullAudio");

  const segmentsContainer = document.getElementById("segmentsContainer");
  const emptySegmentsState = document.getElementById("emptySegmentsState");
  const exportFooter = document.getElementById("exportFooter");
  const btnExportCapCut = document.getElementById("btnExportCapCut");
  const btnRenderVideo = document.getElementById("btnRenderVideo");
  const btnDownloadSRT = document.getElementById("btnDownloadSRT");
  const exportStatusBox = document.getElementById("exportStatusBox");
  const exportMsg = document.getElementById("exportMsg");
  const exportLinks = document.getElementById("exportLinks");

  const btnOpenSettings = document.getElementById("btnOpenSettings");
  const settingsModal = document.getElementById("settingsModal");
  const btnCloseSettings = document.getElementById("btnCloseSettings");
  const btnCancelSettings = document.getElementById("btnCancelSettings");
  const btnSaveSettings = document.getElementById("btnSaveSettings");
  const cfgGeminiKey = document.getElementById("cfgGeminiKey");
  const cfgCapCutDraft = document.getElementById("cfgCapCutDraft");
  const cfgModel = document.getElementById("cfgModel");
  const toastContainer = document.getElementById("toastContainer");

  // Load Config
  fetchConfig();

  // ==========================================================================
  // Toast Notifications
  // ==========================================================================
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "❌";
    if (type === "warning") icon = "⚠️";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec - Math.floor(sec)) * 10);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms}`;
  }

  // ==========================================================================
  // Config
  // ==========================================================================
  async function fetchConfig() {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      state.currentConfig = data;
      if (cfgGeminiKey) cfgGeminiKey.value = data.gemini_api_key || "";
      if (cfgCapCutDraft) cfgCapCutDraft.value = data.capcut_draft_path || "D:/YT/vid/CapCut Drafts";
      if (cfgModel) cfgModel.value = data.default_model || "gemini-3.5-flash-lite";
      const modelText = document.getElementById("aiModelText");
      if (modelText) modelText.textContent = data.default_model || "Gemini 3.5 Flash-Lite";
    } catch (e) {
      console.warn("Lỗi tải config:", e);
    }
  }

  btnOpenSettings.addEventListener("click", () => {
    settingsModal.style.display = "flex";
  });

  const hideSettings = () => { settingsModal.style.display = "none"; };
  btnCloseSettings.addEventListener("click", hideSettings);
  btnCancelSettings.addEventListener("click", hideSettings);

  btnSaveSettings.addEventListener("click", async () => {
    const update = {
      gemini_api_key: cfgGeminiKey.value.trim(),
      capcut_draft_path: cfgCapCutDraft.value.trim(),
      default_model: cfgModel.value
    };
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update)
      });
      const data = await res.json();
      state.currentConfig = data.config;
      showToast("Đã lưu cài đặt thành công!", "success");
      hideSettings();
      fetchConfig();
    } catch (e) {
      showToast("Lỗi khi lưu cài đặt: " + e.message, "error");
    }
  });

  // ==========================================================================
  // Video Upload & Handling
  // ==========================================================================
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoSelect(e.dataTransfer.files[0]);
    }
  });

  videoFileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoSelect(e.target.files[0]);
    }
  });

  async function handleVideoSelect(file) {
    state.videoFile = file;
    dropzone.style.display = "none";
    mainVideoPlayer.style.display = "block";
    videoControlsBar.style.display = "flex";

    const localUrl = URL.createObjectURL(file);
    mainVideoPlayer.src = localUrl;

    btnAnalyzeAI.disabled = true;
    btnAnalyzeText.textContent = "Đang nạp video & tách âm thanh...";

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.status === "success") {
        state.videoPath = data.video_path;
        state.audioPath = data.audio_path;
        state.videoDuration = data.media_info.duration || 0;
        
        videoDurationBadge.textContent = `${formatTime(state.videoDuration)}`;
        totalTimeDisplay.textContent = formatTime(state.videoDuration);
        videoTimelineScrubber.max = state.videoDuration;

        btnAnalyzeAI.disabled = false;
        btnAnalyzeText.textContent = "1-Click: Gemini Nghe Audio & Xào Nấu Kịch Bản";
        showToast("Đã nạp video thành công! Bạn có thể bấm xào nấu ngay.", "success");
      } else {
        throw new Error(data.detail || "Lỗi upload");
      }
    } catch (e) {
      showToast("Lỗi nạp video: " + e.message, "error");
      btnAnalyzeText.textContent = "Lỗi nạp video";
    }
  }

  // Video Controls
  btnPlayPause.addEventListener("click", () => {
    if (mainVideoPlayer.paused) {
      mainVideoPlayer.play();
      btnPlayPause.textContent = "⏸";
    } else {
      mainVideoPlayer.pause();
      btnPlayPause.textContent = "▶";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      btnPlayPause.click();
    }
  });

  mainVideoPlayer.addEventListener("timeupdate", () => {
    const cur = mainVideoPlayer.currentTime;
    videoTimelineScrubber.value = cur;
    currentTimeDisplay.textContent = formatTime(cur);

    // Highlight active segment
    const cards = document.querySelectorAll(".segment-card");
    cards.forEach(c => {
      const start = parseFloat(c.dataset.start);
      const end = parseFloat(c.dataset.end);
      if (cur >= start && cur <= end) {
        c.classList.add("active-playback");
      } else {
        c.classList.remove("active-playback");
      }
    });
  });

  videoTimelineScrubber.addEventListener("input", (e) => {
    mainVideoPlayer.currentTime = parseFloat(e.target.value);
  });

  originalVolumeSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    origVolVal.textContent = `${val}%`;
    mainVideoPlayer.volume = val / 100;
  });

  // ==========================================================================
  // AI Analysis & Remix (Gemini Multimodal Audio)
  // ==========================================================================
  btnAnalyzeAI.addEventListener("click", async () => {
    if (!state.audioPath) {
      showToast("Chưa có file âm thanh của video!", "error");
      return;
    }

    btnAnalyzeAI.disabled = true;
    btnAnalyzeText.textContent = "Gemini đang nghe và xào nấu kịch bản...";
    showToast("Đang gửi audio sang Gemini Flash. Vui lòng chờ 10-25s...", "info");

    try {
      const res = await fetch("/api/analyze-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio_path: state.audioPath,
          niche: nicheSelect.value,
          style: styleSelect.value
        })
      });
      const data = await res.json();
      if (data.status === "success" && data.data) {
        const result = data.data;
        state.segments = result.segments || [];

        // Hiển thị Meta
        videoMetaBox.style.display = "flex";
        suggestedTitleInput.value = result.video_title || "Video Kịch Bản Xào Nấu";
        suggestedSummaryText.textContent = result.summary || "";
        totalSegmentsCount.textContent = `${state.segments.length} câu`;

        renderSegments();
        exportFooter.style.display = "flex";
        showToast("Xào nấu thành công! Bạn có thể chỉnh sửa từng câu bên dưới.", "success");
      } else {
        throw new Error(data.detail || "Không nhận được kịch bản từ AI");
      }
    } catch (e) {
      showToast("Lỗi phân tích: " + e.message, "error");
    } finally {
      btnAnalyzeAI.disabled = false;
      btnAnalyzeText.textContent = "1-Click: Gemini Nghe Audio & Xào Nấu Kịch Bản";
    }
  });

  // ==========================================================================
  // Render Segments List
  // ==========================================================================
  function renderSegments() {
    segmentsContainer.innerHTML = "";
    if (!state.segments.length) {
      emptySegmentsState.style.display = "flex";
      segmentsContainer.appendChild(emptySegmentsState);
      return;
    }

    state.segments.forEach((seg, idx) => {
      const duration = (seg.end - seg.start).toFixed(1);
      const card = document.createElement("div");
      card.className = "segment-card";
      card.dataset.id = seg.id;
      card.dataset.start = seg.start;
      card.dataset.end = seg.end;

      const words = countWords(seg.remix_text || "");
      const wps = (words / Math.max(1, duration)).toFixed(1);
      let speedClass = "speed-green";
      let speedHint = "Vừa vặn";
      if (wps > 3.6) {
        speedClass = "speed-yellow";
        speedHint = "Hơi nhanh";
      }
      if (wps > 4.4) {
        speedClass = "speed-red";
        speedHint = "Quá dài";
      }

      card.innerHTML = `
        <div class="segment-top-row">
          <button type="button" class="time-badge-btn" title="Nhấp để nhảy video đến giây này">
            ⏱️ ${formatTime(seg.start)} - ${formatTime(seg.end)} (${duration}s)
          </button>
          <span class="segment-action-hint">${seg.action || "Phân cảnh"}</span>
          <span class="segment-speed-badge ${speedClass}" id="speedBadge_${seg.id}">
            ${words} từ (${wps} từ/s - ${speedHint})
          </span>
        </div>

        <div class="segment-orig-text">
          <strong>Lời gốc:</strong> ${seg.original_text || "(không có lời thoại)"}
        </div>

        <textarea class="segment-remix-input" data-id="${seg.id}" placeholder="Nhập lời thoại xào nấu...">${seg.remix_text || ""}</textarea>

        <div class="segment-bottom-row">
          <div class="seg-actions-left">
            <button type="button" class="btn-seg-action btn-remix-single" data-id="${seg.id}" title="AI viết lại câu này">
              ✨ Viết lại
            </button>
            <button type="button" class="btn-seg-action btn-play-voice" data-id="${seg.id}" title="Nghe thử câu này">
              ▶ Nghe thử
            </button>
            <button type="button" class="btn-seg-action btn-seg-mic" data-id="${seg.id}" title="Bấm để ghi âm giọng của bạn">
              🎙️ Thu âm
            </button>
          </div>
          
          <div class="seg-status-pill" id="statusPill_${seg.id}">
            ${seg.audio_path ? `✓ Đã có voice (${seg.actual_audio_duration ? seg.actual_audio_duration.toFixed(1) + 's' : ''})` : ""}
          </div>
        </div>
      `;

      // Event: Seek Video on time click
      card.querySelector(".time-badge-btn").addEventListener("click", () => {
        mainVideoPlayer.currentTime = seg.start;
        mainVideoPlayer.play();
        btnPlayPause.textContent = "⏸";
      });

      // Event: Text edit
      const textarea = card.querySelector(".segment-remix-input");
      textarea.addEventListener("input", (e) => {
        seg.remix_text = e.target.value;
        updateSpeedBadge(seg, card);
      });

      // Event: Single Remix
      card.querySelector(".btn-remix-single").addEventListener("click", () => handleSingleRemix(seg, textarea, card));

      // Event: Play Voice
      card.querySelector(".btn-play-voice").addEventListener("click", () => handlePlayVoice(seg));

      // Event: Record Mic
      card.querySelector(".btn-seg-mic").addEventListener("click", (e) => handleRecordMic(seg, e.currentTarget));

      segmentsContainer.appendChild(card);
    });
  }

  function countWords(str) {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  }

  function updateSpeedBadge(seg, card) {
    const duration = Math.max(1, seg.end - seg.start);
    const words = countWords(seg.remix_text || "");
    const wps = (words / duration).toFixed(1);
    const badge = card.querySelector(`#speedBadge_${seg.id}`);
    if (!badge) return;

    badge.className = "segment-speed-badge";
    if (wps <= 3.6) {
      badge.classList.add("speed-green");
      badge.textContent = `${words} từ (${wps} từ/s - Vừa vặn)`;
    } else if (wps <= 4.4) {
      badge.classList.add("speed-yellow");
      badge.textContent = `${words} từ (${wps} từ/s - Hơi nhanh)`;
    } else {
      badge.classList.add("speed-red");
      badge.textContent = `${words} từ (${wps} từ/s - Quá dài)`;
    }
  }

  // ==========================================================================
  // Single Line AI Rewrite
  // ==========================================================================
  async function handleSingleRemix(seg, textarea, card) {
    const duration = Math.max(1, seg.end - seg.start);
    showToast(`Đang viết lại câu ${seg.id}...`, "info");
    try {
      const res = await fetch("/api/remix-segment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_text: seg.original_text,
          action: seg.action || "",
          duration: duration,
          style: styleSelect.value
        })
      });
      const data = await res.json();
      if (data.status === "success" && data.remix_text) {
        seg.remix_text = data.remix_text;
        textarea.value = data.remix_text;
        updateSpeedBadge(seg, card);
        showToast(`Đã viết lại câu ${seg.id}!`, "success");
      }
    } catch (e) {
      showToast("Lỗi viết lại: " + e.message, "error");
    }
  }

  // ==========================================================================
  // Voice Generation & Playback
  // ==========================================================================
  async function handlePlayVoice(seg) {
    // Nếu đã có file audio -> phát ngay
    if (seg.audio_url) {
      const audio = new Audio(seg.audio_url);
      audio.play();
      return;
    }

    // Nếu chưa có, sinh tự động bằng TTS
    showToast(`Đang tạo giọng đọc câu ${seg.id}...`, "info");
    const duration = Math.max(1, seg.end - seg.start);
    const text = seg.remix_text || seg.original_text || "";

    const formData = new FormData();
    formData.append("segment_id", seg.id);
    formData.append("text", text);
    formData.append("target_duration", duration);
    formData.append("voice", voiceSelect.value);

    try {
      const res = await fetch("/api/generate-tts-segment", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.status === "success") {
        seg.audio_url = data.audio_url;
        seg.audio_path = data.audio_path;
        seg.actual_audio_duration = data.duration;
        
        const pill = document.getElementById(`statusPill_${seg.id}`);
        if (pill) pill.textContent = `✓ Đã có voice (${data.duration.toFixed(1)}s)`;

        const audio = new Audio(data.audio_url);
        audio.play();
      }
    } catch (e) {
      showToast("Lỗi tạo giọng đọc: " + e.message, "error");
    }
  }

  // Sinh toàn bộ TTS
  btnGenerateAllTTS.addEventListener("click", async () => {
    if (!state.segments.length) {
      showToast("Chưa có kịch bản để sinh giọng đọc!", "error");
      return;
    }

    btnGenerateAllTTS.disabled = true;
    btnGenerateAllTTS.textContent = "⏳ Đang sinh toàn bộ...";
    showToast("Đang sinh giọng đọc AI cho toàn bộ kịch bản...", "info");

    try {
      const res = await fetch("/api/generate-tts-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segments: state.segments,
          voice: voiceSelect.value
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        state.segments = data.segments;
        renderSegments();
        showToast("Đã sinh toàn bộ giọng đọc thành công!", "success");
      }
    } catch (e) {
      showToast("Lỗi sinh giọng đọc: " + e.message, "error");
    } finally {
      btnGenerateAllTTS.disabled = false;
      btnGenerateAllTTS.textContent = "⚡ Sinh Toàn Bộ Giọng Đọc";
    }
  });

  // ==========================================================================
  // Studio Mic Recording (Per-Segment)
  // ==========================================================================
  async function handleRecordMic(seg, micBtn) {
    // Nếu đang ghi âm câu này -> Dừng và upload
    if (state.recordingSegmentId === seg.id && state.mediaRecorder && state.mediaRecorder.state === "recording") {
      state.mediaRecorder.stop();
      micBtn.classList.remove("recording");
      micBtn.textContent = "⏳ Đang cắt...";
      state.recordingSegmentId = null;
      return;
    }

    // Nếu đang ghi âm câu khác, báo lỗi
    if (state.recordingSegmentId !== null) {
      showToast("Đang có một câu khác đang thu âm!", "warning");
      return;
    }

    // Bắt đầu ghi âm
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.recordingChunks = [];
      state.mediaRecorder = new MediaRecorder(stream);
      state.recordingSegmentId = seg.id;

      state.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) state.recordingChunks.push(e.data);
      };

      state.mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(state.recordingChunks, { type: "audio/webm" });
        await uploadRecordedSegment(seg, blob, micBtn);
      };

      state.mediaRecorder.start();
      micBtn.classList.add("recording");
      micBtn.textContent = "⏹ Dừng lại";
      showToast(`Đang thu âm câu ${seg.id}... Hãy đọc to rõ ràng!`, "info");

      // Đồng thời cho video chạy từ mốc này để người dùng vừa nhìn video vừa đọc!
      mainVideoPlayer.currentTime = seg.start;
      mainVideoPlayer.play();
      btnPlayPause.textContent = "⏸";

    } catch (err) {
      showToast("Không thể truy cập Microphone: " + err.message, "error");
    }
  }

  async function uploadRecordedSegment(seg, blob, micBtn) {
    const duration = Math.max(1, seg.end - seg.start);
    const formData = new FormData();
    formData.append("segment_id", seg.id);
    formData.append("target_duration", duration);
    formData.append("file", blob, `rec_seg_${seg.id}.webm`);

    try {
      const res = await fetch("/api/upload-recording-segment", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.status === "success") {
        seg.audio_url = data.audio_url;
        seg.audio_path = data.audio_path;
        seg.actual_audio_duration = data.final_duration;
        seg.tempo_ratio = data.tempo_ratio;

        const pill = document.getElementById(`statusPill_${seg.id}`);
        if (pill) {
          pill.textContent = `✓ Giọng thật (${data.final_duration.toFixed(1)}s - nhịp ${data.tempo_ratio}x)`;
        }
        showToast(`Đã cắt khoảng lặng & ép khớp câu ${seg.id} thành công!`, "success");
      }
    } catch (e) {
      showToast("Lỗi xử lý file thu âm: " + e.message, "error");
    } finally {
      micBtn.classList.remove("recording");
      micBtn.textContent = "🎙️ Thu âm";
    }
  }

  // ==========================================================================
  // Voice Mode Tabs Switch
  // ==========================================================================
  voiceTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      voiceTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.voiceMode = tab.dataset.mode;

      subBarTTS.style.display = state.voiceMode === "tts" ? "flex" : "none";
      subBarMic.style.display = state.voiceMode === "mic" ? "flex" : "none";
      subBarFull.style.display = state.voiceMode === "full" ? "flex" : "none";
    });
  });

  // Full Recording Handling
  fullAudioFileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      btnProcessFullAudio.disabled = false;
      showToast(`Đã chọn file: ${e.target.files[0].name}`, "info");
    }
  });

  btnProcessFullAudio.addEventListener("click", async () => {
    const file = fullAudioFileInput.files[0];
    if (!file || !state.segments.length) return;

    btnProcessFullAudio.disabled = true;
    btnProcessFullAudio.textContent = "✂️ Đang phân tích & cắt câu...";
    showToast("Đang dò tìm khoảng lặng và chia nhỏ thành từng câu...", "info");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("segments_json", JSON.stringify(state.segments));

    try {
      const res = await fetch("/api/upload-full-recording", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.status === "success") {
        state.segments = data.segments;
        renderSegments();
        showToast("Đã cắt tỉa và căn chỉnh toàn bộ kịch bản!", "success");
      }
    } catch (e) {
      showToast("Lỗi xử lý file thu: " + e.message, "error");
    } finally {
      btnProcessFullAudio.disabled = false;
      btnProcessFullAudio.textContent = "✂️ Cắt Khoảng Lặng & Tự Động Ép Khớp";
    }
  });

  // ==========================================================================
  // Export Center (CapCut & MP4)
  // ==========================================================================
  btnExportCapCut.addEventListener("click", async () => {
    if (!state.segments.length || !state.videoPath) {
      showToast("Chưa có video hoặc kịch bản để xuất!", "error");
      return;
    }

    btnExportCapCut.disabled = true;
    exportStatusBox.style.display = "block";
    exportMsg.innerHTML = "⏳ Đang tạo dự án CapCut Draft và cấu hình Timeline...";

    const origVol = parseFloat(originalVolumeSlider.value) / 100;

    try {
      const res = await fetch("/api/export-capcut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: suggestedTitleInput.value.trim() || `Remix_${Date.now()}`,
          video_path: state.videoPath,
          segments: state.segments,
          original_video_volume: origVol
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        exportMsg.innerHTML = `
          🎉 <strong>ĐÃ TẠO DỰ ÁN CAPCUT THÀNH CÔNG!</strong><br>
          📁 <strong>Thư mục dự án:</strong> <code>${data.draft_folder}</code><br>
          👉 <em>Bây giờ bạn chỉ cần mở ứng dụng <strong>CapCut PC</strong> trên máy lên: Dự án <strong>"${data.draft_name}"</strong> đã nằm sẵn ngay trang chủ, timeline có đầy đủ Video + Lồng tiếng từng câu + Phụ đề!</em>
        `;
        showToast("Đã đẩy vào CapCut PC thành công!", "success");
      } else {
        throw new Error(data.detail || "Lỗi tạo CapCut draft");
      }
    } catch (e) {
      exportMsg.innerHTML = `❌ Lỗi: ${e.message}`;
      showToast("Lỗi xuất CapCut: " + e.message, "error");
    } finally {
      btnExportCapCut.disabled = false;
    }
  });

  btnRenderVideo.addEventListener("click", async () => {
    if (!state.segments.length || !state.videoPath) {
      showToast("Chưa có video hoặc kịch bản để render!", "error");
      return;
    }

    btnRenderVideo.disabled = true;
    exportStatusBox.style.display = "block";
    exportMsg.innerHTML = "⚡ FFmpeg đang mix âm thanh và render video hoàn chỉnh...";

    const origVol = parseFloat(originalVolumeSlider.value) / 100;

    try {
      const res = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_path: state.videoPath,
          segments: state.segments,
          original_audio_volume: origVol,
          voice_volume: 1.0
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        exportMsg.innerHTML = `
          ✅ <strong>RENDER HOÀN TẤT!</strong><br>
          <div style="margin-top: 8px;">
            <a href="${data.video_url}" target="_blank" class="btn btn-primary btn-sm">▶ Xem & Tải Video MP4</a>
            <a href="${data.srt_url}" download class="btn btn-outline btn-sm">📥 Tải Phụ Đề (.SRT)</a>
          </div>
        `;
        showToast("Render video hoàn tất!", "success");
      } else {
        throw new Error(data.detail || "Lỗi render");
      }
    } catch (e) {
      exportMsg.innerHTML = `❌ Lỗi render: ${e.message}`;
      showToast("Lỗi render: " + e.message, "error");
    } finally {
      btnRenderVideo.disabled = false;
    }
  });

  btnDownloadSRT.addEventListener("click", () => {
    if (!state.segments.length) {
      showToast("Chưa có kịch bản để tải phụ đề!", "error");
      return;
    }
    // Tạo file SRT client-side
    function fmt(sec) {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      const ms = Math.floor((sec - Math.floor(sec)) * 1000);
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
    }

    let srtText = "";
    state.segments.forEach((seg, i) => {
      const text = seg.remix_text || seg.original_text || "";
      if (text) {
        srtText += `${i + 1}\n${fmt(seg.start)} --> ${fmt(seg.end)}\n${text}\n\n`;
      }
    });

    const blob = new Blob([srtText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kịch_bản_${Date.now()}.srt`;
    a.click();
    showToast("Đã tải file phụ đề SRT!", "success");
  });
});
