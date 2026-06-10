// offscreen.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download_blobs_offscreen") {
    handleDownloads(request.payload)
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ error: err.message }));
    return true; // Báo hiệu async
  }
});

async function handleDownloads(payload) {
  const { safeTitle, articleMd, frames } = payload;
  const objectUrlsToRevoke = [];

  try {
    // 1. Tạo Blob cho Markdown
    const mdBlob = new Blob([articleMd], { type: 'text/markdown;charset=utf-8' });
    const mdUrl = URL.createObjectURL(mdBlob);
    objectUrlsToRevoke.push(mdUrl);

    // Tải Markdown
    await new Promise((resolve) => {
      chrome.downloads.download({
        url: mdUrl,
        filename: `learn/${safeTitle}.md`,
        saveAs: false
      }, resolve);
    });

    // 2. Tạo Blob cho Images
    if (frames && frames.length > 0) {
      for (let i = 0; i < frames.length; i++) {
        // frames[i] là một data URI: 'data:image/jpeg;base64,...'
        const res = await fetch(frames[i]);
        const blob = await res.blob();
        const imgUrl = URL.createObjectURL(blob);
        objectUrlsToRevoke.push(imgUrl);

        // Tải Ảnh
        await new Promise((resolve) => {
          chrome.downloads.download({
            url: imgUrl,
            filename: `learn/image/${safeTitle}_anh_${i}.jpg`,
            saveAs: false
          }, resolve);
        });
      }
    }

    // Đóng offscreen document sau khi hoàn tất tải xuống
    setTimeout(() => {
      objectUrlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
      window.close();
    }, 5000); // Chờ 5s để đảm bảo Chrome bắt đầu tải xong mới dọn rác

  } catch (error) {
    console.error("Offscreen download error:", error);
    throw error;
  }
}
