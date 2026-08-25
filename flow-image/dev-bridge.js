(()=>{
  if (typeof window !== "undefined") {
    if (window.__flowBridgeActive) return;
    window.__flowBridgeActive = true;
  }

  const BRIDGE_URL = "http://127.0.0.1:8787";
  const POLL_MS = 1500;
  const STATUS_MS = 2000;

  let running = false;
  let currentJobId = null;
  let pollTimer = null;
  let statusTimer = null;
  let lastErrorAt = 0;
  let idleCount = 0;

  function now() { return Date.now(); }

  function logRateLimited(e) {
    const t = now();
    if (t - lastErrorAt > 10000) {
      console.warn("[dev-bridge]", e);
      lastErrorAt = t;
    }
  }

  async function fetchJson(path, opts = {}) {
    const n = {
      method: "GET",
      ...opts,
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) }
    };
    const res = await fetch(BRIDGE_URL + path, n);
    if (res.status === 204) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function postJson(path, data) {
    return fetchJson(path, { method: "POST", body: JSON.stringify(data) });
  }

  async function getSettings() {
    const storage = await chrome.storage.local.get(["flowAutoSettings", "flowAutoMode", "turboflowPlan"]);
    const s = { ...(storage.flowAutoSettings || {}) };
    const mode = storage.flowAutoMode || "image";

    if (s.naming === undefined) s.naming = "prefix";
    if (s.namingPrefix === undefined) s.namingPrefix = "prompt";
    if (s.namingSeparator === undefined) s.namingSeparator = "-";
    if (s.imageCount === undefined) s.imageCount = 1;
    if (s.imageRatio === undefined) s.imageRatio = "IMAGE_ASPECT_RATIO_SQUARE";
    if (s.imageModel === undefined) s.imageModel = "imagen_3";
    if (s.videoRatio === undefined) s.videoRatio = "landscape";
    if (s.videoCount === undefined) s.videoCount = 1;
    if (s.autoDownloadImages === undefined) s.autoDownloadImages = true;
    if (s.autoDownloadVideos === undefined) s.autoDownloadVideos = true;

    return { mode, settings: s };
  }

  async function startJob(job) {
    if (!job || !Array.isArray(job.prompts) || job.prompts.length === 0) return;

    try {
      await chrome.runtime.sendMessage({ type: "CHECK_CONNECTION" });
    } catch {}

    const { mode, settings } = await getSettings();
    const finalSettings = {
      ...settings,
      ...(job.settings || {}),
      mode: job.mode || mode,
      folder: "flow-auto"
    };

    const promptIndexMap = job.prompts.map((_, idx) => idx);
    currentJobId = job.job_id || `job_${now()}`;
    running = true;
    idleCount = 0;

    console.log(`[dev-bridge] 🚀 BẮT ĐẦU TẠO ẢNH: "${job.prompts[0]}" (Job: ${currentJobId})`);

    try {
      await postJson("/status", {
        job_id: currentJobId,
        state: "running",
        meta: { promptCount: job.prompts.length }
      });
    } catch (e) {
      logRateLimited(e.message || e);
    }

    const batchMsg = {
      type: "START_BATCH",
      batchId: currentJobId,
      prompts: job.prompts,
      promptIndexMap,
      settings: finalSettings
    };

    chrome.runtime.sendMessage(batchMsg).then((res) => {
      console.log(`[dev-bridge] 📨 START_BATCH phản hồi:`, res);
    }).catch(async err => {
      console.error(`[dev-bridge] ❌ Gửi START_BATCH lỗi:`, err);
      logRateLimited(err.message || err);
      try {
        await postJson("/status", {
          job_id: currentJobId,
          state: "error",
          error: err.message || String(err)
        });
      } catch {}
      running = false;
      currentJobId = null;
    });

    scheduleStatus();
  }

  async function statusTick() {
    if (!running || !currentJobId) return;

    try {
      const resp = await chrome.runtime.sendMessage({ type: "GET_STATS" });
      const stats = resp?.stats || null;
      const isRunning = !!resp?.isRunning;

      console.log(`[dev-bridge] Đang xử lý: isRunning=${isRunning}, stats:`, stats);

      if (stats) {
        await postJson("/status", {
          job_id: currentJobId,
          state: "running",
          stats,
          isRunning
        });

        // Hoàn tất tải ảnh về
        if (stats.total > 0 && (stats.downloaded + stats.failed) >= stats.total && !isRunning) {
          console.log(`[dev-bridge] ✅ Hoàn tất Job: ${currentJobId}`);
          await postJson("/status", {
            job_id: currentJobId,
            state: "completed",
            stats
          });
          running = false;
          currentJobId = null;
          return;
        }
      }

      if (!isRunning && (!stats || stats.total === 0)) {
        idleCount++;
        if (idleCount > 30) { // 60s
          console.warn(`[dev-bridge] ⚠️ Timeout chờ tạo ảnh...`);
          await postJson("/status", {
            job_id: currentJobId,
            state: "error",
            error: "Google Flow không bắt đầu tạo ảnh sau 60s. Vui lòng kiểm tra tab Google Flow!"
          });
          running = false;
          currentJobId = null;
          return;
        }
      } else {
        idleCount = 0;
      }
    } catch (e) {
      logRateLimited(e.message || e);
    }

    if (running) {
      statusTimer = setTimeout(statusTick, STATUS_MS);
    }
  }

  function scheduleStatus() {
    if (statusTimer) clearTimeout(statusTimer);
    statusTimer = setTimeout(statusTick, STATUS_MS);
  }

  async function pollLoop() {
    try {
      if (!running) {
        const job = await fetchJson("/next");
        if (job) {
          await startJob(job);
        }
      }
    } catch (e) {
      logRateLimited(e.message || e);
    }
    pollTimer = setTimeout(pollLoop, POLL_MS);
  }

  console.log(`[dev-bridge] ⚡ TurboFlow Dev Bridge kết nối vào Cổng 8787 trên tab Google Flow!`);
  pollLoop();
})();
