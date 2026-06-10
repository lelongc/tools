// Map lưu trữ ánh xạ giữa Blob URL và tên tệp tin mong muốn
const blobUrlToFilename = new Map();

// Bắt sự kiện xác định tên tệp để định hướng lưu vào thư mục learn/
chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  if (blobUrlToFilename.has(item.url)) {
    const filename = blobUrlToFilename.get(item.url);
    suggest({ filename: filename, conflictAction: 'overwrite' });
    blobUrlToFilename.delete(item.url);
  } else {
    suggest();
  }
});

// Helper function để đảm bảo Offscreen Document tồn tại
async function setupOffscreenDocument(path) {
  // Kiểm tra xem offscreen đã tồn tại chưa
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL(path)]
  });

  if (existingContexts.length > 0) {
    return;
  }

  // Tạo offscreen document mới
  await chrome.offscreen.createDocument({
    url: path,
    reasons: ['BLOBS'],
    justification: 'Cần tạo Blob URL để giữ đúng tên file khi tải xuống'
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start_process") {
    // Không dùng nữa, chuyển sang inject_ui
  } else if (request.action === "inject_ui") {
    chrome.scripting.executeScript({
      target: { tabId: request.tabId },
      files: ['content_scripts/content.js']
    }).then(() => {
      chrome.tabs.sendMessage(request.tabId, { action: "inject_ui" });
      sendResponse({ success: true });
    }).catch(err => sendResponse({ error: err.message }));
    return true;
  } else if (request.action === "process_captured_session") {
    processCapturedSession(request)
      .then(result => sendResponse({ success: true, result }))
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});

async function processCapturedSession(sessionData) {
  const { frames, url, title, transcript } = sessionData;

  // 1. Lấy API Keys
  const keys = await chrome.storage.local.get(['geminiApiKey']);
  if (!keys.geminiApiKey) {
    throw new Error("Thiếu Gemini API Key. Vui lòng vào Cài Đặt (Options) để thêm.");
  }

  let finalTranscript = transcript;
  if (!finalTranscript || finalTranscript.length < 50) {
    throw new Error("Không lấy được nội dung chữ. Vui lòng kiểm tra lại phụ đề.");
  }

  // 4. Gọi Gemini API để phân tích và chèn ảnh
  const analysis = await callGeminiAPI(finalTranscript, frames, keys.geminiApiKey);

  // Lấy tiêu đề tinh gọn từ AI hoặc dùng tiêu đề web làm dự phòng
  const finalTitle = analysis.lesson_title && analysis.lesson_title.length > 3 ? analysis.lesson_title : title;
  
  // Đổi tên file sang chuẩn tiếng Anh: Xóa dấu tiếng Việt, chuyển sang lowercase, thay ký tự đặc biệt bằng _
  const safeTitle = finalTitle
    .normalize('NFD') // Tách dấu ra khỏi chữ
    .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu
    .replace(/đ/gi, 'd') // Thay chữ đ
    .replace(/[^a-zA-Z0-9]+/g, '_') // Thay những gì không phải chữ tiếng Anh/số thành dấu _
    .replace(/^_|_$/g, '') // Xóa dấu _ thừa ở đầu và cuối
    .toLowerCase() || 'video_notes';

  // Thay thế placeholder của AI thành đường dẫn ảnh thực tế
  let processedArticle = analysis.article;
  if (processedArticle) {
    processedArticle = processedArticle.replace(/\[IMAGE_(\d+)\]/g, `./image/${safeTitle}_anh_$1.jpg`);
  }

  // 5. Tổng hợp thành Markdown bài viết
  const articleMd = generateArticle(finalTitle, processedArticle, frames ? frames.length : 0);

  // 6. Chuyển tiếp dữ liệu qua Offscreen Document để tạo Blob URLs
  try {
    await setupOffscreenDocument('offscreen/offscreen.html');
    const response = await chrome.runtime.sendMessage({
      action: "create_blob_urls",
      payload: {
        articleMd: articleMd,
        frames: frames || []
      }
    });

    if (response && response.success && response.urls) {
      const urls = response.urls;
      // urls[0] là Markdown, các urls còn lại là ảnh
      
      const mdFilename = `learn/${safeTitle}.md`;
      blobUrlToFilename.set(urls[0], mdFilename);
      chrome.downloads.download({
        url: urls[0],
        saveAs: false
      });

      if (frames && frames.length > 0) {
        for (let i = 0; i < frames.length; i++) {
          const imgFilename = `learn/image/${safeTitle}_anh_${i}.jpg`;
          blobUrlToFilename.set(urls[i + 1], imgFilename);
          chrome.downloads.download({
            url: urls[i + 1],
            saveAs: false
          });
        }
      }

      // Đợi 10 giây để Chrome kịp tải, sau đó dọn dẹp offscreen và Map
      setTimeout(() => {
        chrome.runtime.sendMessage({
          action: "cleanup_and_close",
          urls: urls
        });
        urls.forEach(url => blobUrlToFilename.delete(url));
      }, 10000);

    } else {
      throw new Error(response.error || "Không thể tạo Blob URL từ Offscreen.");
    }
  } catch (err) {
    console.error("Lỗi khi gọi offscreen:", err);
    throw err;
  }

  return "Done";
}

async function callGeminiAPI(text, frames, apiKey) {
  // Tăng giới hạn đọc text lên 100,000 ký tự để AI có thể đọc sạch toàn bộ phụ đề của video dài
  const promptText = text.substring(0, 100000);
  // Chuyển sang gemini-3.1-flash-lite: Đây là model MIỄN PHÍ mạnh nhất hiện tại theo bảng giá mới nhất của Google.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;

  const prompt = `Tôi có một đoạn nội dung (transcript/text) của một video học tập sau:
"${promptText}"

Tôi cũng đã cung cấp cho bạn ${frames ? frames.length : 0} bức ảnh (frames) được cắt ra từ video ở các mốc thời gian khác nhau (xếp theo thứ tự thời gian).

YÊU CẦU QUAN TRỌNG: Hãy đóng vai một chuyên gia tận tâm. Viết một bài viết MANG TÍNH CHẤT GHI CHÚ BÀI HỌC (Study Notes) CỰC KỲ CHI TIẾT.
- Dựa vào nội dung, hãy tự suy ra một Tiêu Đề Bài Học (lesson_title) BẰNG TIẾNG ANH thật ngắn gọn, súc tích (khoảng 3-10 từ) phản ánh chính xác chủ đề đang được giảng dạy. Đừng dùng tên chung chung của cả khóa học.
- KHÔNG TÓM TẮT QUA LOA. Bắt buộc phải trích xuất và giải thích SÂU mọi khái niệm, thuật ngữ kỹ thuật, giao thức, định nghĩa và ví dụ được nhắc đến trong video.
- Mục tiêu là người đọc KHÔNG CẦN XEM VIDEO vẫn nắm được 100% kiến thức.
- Trình bày bài viết thật đẹp bằng Markdown: dùng Heading (h2, h3), In đậm các từ khóa, gạch đầu dòng, và chia đoạn hợp lý. Không cần viết Heading 1 cho tiêu đề bài học vì hệ thống sẽ tự thêm.
- QUAN TRỌNG NHẤT: Xuyên suốt bài viết, hãy chèn các bức ảnh vào ĐÚNG đoạn văn bản mà bức ảnh đó đang minh họa. 
Sử dụng cú pháp Markdown với URL giữ chỗ (placeholder) như sau: \`![Hình minh họa]([IMAGE_0])\`, \`![Hình minh họa]([IMAGE_1])\`, ... (ứng với ảnh đầu tiên là IMAGE_0).

Trả về kết quả BẮT BUỘC ở định dạng JSON chuẩn xác (hãy dùng \\n để xuống dòng trong chuỗi JSON):
{
  "lesson_title": "Tiêu đề bài học cốt lõi",
  "article": "Nội dung bài giải thích bằng Markdown CÓ CHỨA mã chèn ảnh..."
}`;

  // Chuẩn bị payload (bao gồm text và nhiều hình ảnh multimodal)
  const parts = [{ text: prompt }];

  if (frames && frames.length > 0) {
    frames.forEach((frameBase64) => {
      const base64Data = frameBase64.split(',')[1];
      if (base64Data) {
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        });
      }
    });
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: parts }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Gemini Error:", errorBody);
    if (response.status === 503) {
      throw new Error("Lỗi 503: Máy chủ Google Gemini đang bị quá tải tạm thời (Service Unavailable). Vui lòng đợi vài phút rồi thử lại.");
    } else if (response.status === 403 || response.status === 401) {
      throw new Error("Lỗi xác thực: API Key của bạn không đúng hoặc đã hết hạn.");
    } else if (response.status === 404) {
      throw new Error("Lỗi 404: Model AI không tồn tại. Vui lòng kiểm tra lại tên model trong code.");
    }
    throw new Error(`Lỗi gọi Gemini API (${response.status}): Vui lòng thử lại sau.`);
  }

  const data = await response.json();
  const rawResponse = data.candidates[0].content.parts[0].text;

  // Lọc để lấy JSON
  const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error(e);
    }
  }

  // Fallback
  return { lesson_title: "Bài học Video", article: "Đã có lỗi khi AI phân tích tóm tắt.", keyword: "Illustration" };
}



function generateArticle(title, articleContent, numFrames) {
  let md = `# ${title}\n\n`;
  md += `${articleContent}\n\n`;

  if (numFrames > 0) {
    md += `\n---\n*Ghi chú: ${numFrames} hình ảnh minh họa (.jpg) đã được tải về và lưu tự động vào thư mục con \`image/\` cùng cấp với file này. Để ảnh hiển thị tự động, hãy đảm bảo bạn sao chép cả thư mục \`image/\` nếu bạn muốn di chuyển file markdown sang nơi khác!*\n`;
  }

  return md;
}
