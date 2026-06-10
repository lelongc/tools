// offscreen.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "create_blob_urls") {
    createBlobUrls(request.payload)
      .then((urls) => sendResponse({ success: true, urls }))
      .catch((err) => sendResponse({ error: err.message }));
    return true; // Báo hiệu async
  } else if (request.action === "cleanup_and_close") {
    request.urls.forEach((url) => URL.revokeObjectURL(url));
    window.close();
  }
});

async function createBlobUrls(payload) {
  const { articleMd, frames } = payload;
  const urls = [];

  try {
    // 1. Tạo Blob cho Markdown
    const mdBlob = new Blob([articleMd], { type: 'text/markdown;charset=utf-8' });
    urls.push(URL.createObjectURL(mdBlob));

    // 2. Tạo Blob cho Images
    if (frames && frames.length > 0) {
      for (let i = 0; i < frames.length; i++) {
        // frames[i] là một data URI
        const res = await fetch(frames[i]);
        const blob = await res.blob();
        urls.push(URL.createObjectURL(blob));
      }
    }

    return urls;
  } catch (error) {
    console.error("Lỗi khi tạo Blob URLs trong Offscreen:", error);
    throw error;
  }
}
