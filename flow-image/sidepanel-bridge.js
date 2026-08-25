(()=>{
  console.log("[sidepanel-bridge] ⚡ TurboFlow Sidepanel Bridge & Auto-Login Active!");
  const BRIDGE_URL = "http://127.0.0.1:8787";
  let isExecuting = false;

  // 1. Tự động bypass Auth và duy trì đăng nhập Vô hạn
  function ensureUnlocked() {
    try {
      chrome.storage.local.set({
        user: { id: "dev_unlimited_user", email: "developer@flow.local", name: "Dev Unlimited", picture: "" },
        plan: { id: "pro", name: "Pro Plan", status: "active", is_unlimited: true, remaining: 999999 },
        token: "dev_token_unlimited"
      });
    } catch(e) {}

    const authScreen = document.getElementById("auth-screen");
    const loadingScreen = document.getElementById("loading-screen");
    const mainApp = document.getElementById("main-app");
    
    if (authScreen) authScreen.style.setProperty("display", "none", "important");
    if (loadingScreen) loadingScreen.style.setProperty("display", "none", "important");
    if (mainApp) mainApp.style.setProperty("display", "block", "important");

    // Tự động bấm Re-check nếu bị ngắt kết nối với Tab Google Flow
    const badge = document.getElementById("status-badge");
    const recheckBtn = document.getElementById("btn-recheck");
    if (badge && (badge.innerText.includes("Disconnected") || badge.classList.contains("badge-disconnected"))) {
      if (recheckBtn) recheckBtn.click();
    }
  }

  setInterval(ensureUnlocked, 1000);
  ensureUnlocked();

  // 2. Vòng lặp nhận việc từ Spark
  async function pollNext() {
    if (isExecuting) {
      setTimeout(pollNext, 2000);
      return;
    }

    try {
      const res = await fetch(BRIDGE_URL + "/next");
      if (res.status === 200) {
        const job = await res.json();
        if (job && Array.isArray(job.prompts) && job.prompts.length > 0) {
          console.log("[sidepanel-bridge] 🚀 Nhận lệnh từ Spark:", job.prompts[0]);
          isExecuting = true;

          const textarea = document.getElementById("prompt-input");
          const btnStart = document.getElementById("btn-start");

          if (textarea && btnStart) {
            textarea.value = job.prompts.join("\n");
            textarea.dispatchEvent(new Event("input", { bubbles: true }));
            textarea.dispatchEvent(new Event("change", { bubbles: true }));

            // Thông báo bắt đầu
            await fetch(BRIDGE_URL + "/status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                job_id: job.job_id,
                state: "running",
                meta: { promptCount: job.prompts.length }
              })
            }).catch(() => {});

            setTimeout(() => {
              console.log("[sidepanel-bridge] 🎯 Tự động kích hoạt nút Start Batch...");
              btnStart.click();

              // Giải phóng để nhận lệnh tiếp theo sau 10 giây
              setTimeout(() => { isExecuting = false; }, 10000);
            }, 800);
          } else {
            isExecuting = false;
          }
        }
      }
    } catch (e) {}

    setTimeout(pollNext, 1500);
  }

  setTimeout(pollNext, 1000);
})();
