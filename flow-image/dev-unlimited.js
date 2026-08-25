const DEV_UNLIMITED_PLAN = {
  plan: "pro",
  trial: false,
  promptsPerDay: 1e9,
  promptsRemaining: 1e9,
  promptsUsedToday: 0
};

const DEV_USER = {
  email: "dev@flow.local",
  name: "Google Flow Dev",
  picture: "",
  token: "dev_unlimited"
};

function setUnlimitedPlan() {
  if (typeof s !== "undefined") s = DEV_UNLIMITED_PLAN;
  if (typeof i !== "undefined" && !i) i = DEV_USER;
  chrome.storage.local.set({
    turboflowPlan: DEV_UNLIMITED_PLAN,
    turboflowPlanTime: Date.now(),
    turboflowUser: DEV_USER,
    user: DEV_USER,
    plan: DEV_UNLIMITED_PLAN,
    token: "dev_unlimited",
    signedIn: true
  }).catch(e => console.warn("[dev-unlimited] Failed to persist plan", e));
  return DEV_UNLIMITED_PLAN;
}

setUnlimitedPlan();

if (typeof Oe === "function" || typeof Oe !== "undefined") {
  Oe = async function() { return setUnlimitedPlan(); };
}

if (typeof Se === "function" || typeof Se !== "undefined") {
  Se = async function() { return { allowed: true, remaining: 1e9 }; };
}

if (typeof Ue === "function" || typeof Ue !== "undefined") {
  Ue = async function(e, t) {
    if (typeof i !== "undefined" && !i) i = DEV_USER;
    if (typeof m !== "undefined") m = { unlockToken: "dev", timestamp: Date.now(), promptCount: e, mode: t };
    return { authorized: true, remaining: 1e9 };
  };
}

if (typeof $e === "function" || typeof $e !== "undefined") {
  $e = async function() { return { ok: true, remaining: 1e9 }; };
}

// Tự động quét và kết nối tab Google Flow
if (typeof Be === "function") {
  const origBe = Be;
  Be = async function() {
    try {
      const allTabs = await chrome.tabs.query({});
      const flowTab = allTabs.find(t => t.url && t.url.includes("tools/flow"));
      if (flowTab && typeof c !== "undefined") {
        c = flowTab.id;
        console.log(`[dev-unlimited] 🎯 Đã gán Flow Tab ID=${c} (${flowTab.url})`);
      }
    } catch (e) {}
    return origBe();
  };
}

// Bọc hàm thực thi Ot
if (typeof Ot === "function") {
  const origOt = Ot;
  Ot = async function(e, t, a = null) {
    console.log("[dev-unlimited] 🚀 Bắt đầu chạy batch tạo ảnh...");
    if (typeof i !== "undefined" && !i) i = DEV_USER;
    if (typeof c === "undefined" || !c || typeof u === "undefined" || !u) {
      if (typeof Be === "function") await Be();
    }
    return origOt(e, t, a);
  };
}

// Bắt URL ảnh trực tiếp từ Google Flow và gửi thẳng về máy chủ MCP
if (typeof Vt === "function") {
  const origVt = Vt;
  Vt = function(type, data) {
    if (type === "PREVIEW_READY" && data?.fifeUrl) {
      console.log(`[Google Flow Direct] 🎨 Đã có URL ảnh trực tiếp:`, data.fifeUrl);
      fetch("http://127.0.0.1:8787/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: "active",
          state: "completed",
          image_url: data.fifeUrl,
          media_id: data.mediaId,
          prompt: data.prompt
        })
      }).catch(() => {});
    } else if (type === "LOG" && data?.message) {
      console.log(`[Google Flow Engine] ${data.message}`);
      fetch("http://127.0.0.1:8787/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: "live_log", state: "running", error: data.message })
      }).catch(() => {});
    }
    return origVt(type, data);
  };
}

setTimeout(() => {
  if (typeof i !== "undefined" && !i) i = DEV_USER;
  if (typeof s !== "undefined" && !s) s = DEV_UNLIMITED_PLAN;
  if (typeof Be === "function") Be().catch(() => {});
}, 300);
