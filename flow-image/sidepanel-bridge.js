(()=>{
  console.log("[sidepanel-bridge] ⚡ TurboFlow Sidepanel Bridge sẵn sàng nhận lệnh từ Spark!");
  const BRIDGE_URL = "http://127.0.0.1:8787";
  let isExecuting = false;

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

  // Khởi động vòng lặp kiểm tra
  setTimeout(pollNext, 1000);
})();
