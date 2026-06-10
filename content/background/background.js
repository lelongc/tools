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

  // 4. Chia nhỏ transcript và xử lý chi tiết từng phần
  const chunks = chunkTranscript(finalTranscript);
  const draftArticles = await Promise.all(
    chunks.map((chunk, idx) => 
      generateDetailedChunk(chunk, idx, chunks.length, keys.geminiApiKey)
    )
  );
  
  const fullDraft = draftArticles.join('\n\n');

  // 4b. Gọi Gemini API để chèn ảnh và xác định tiêu đề súc tích
  const analysis = await finalizeArticleWithImages(fullDraft, frames, keys.geminiApiKey);

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

function chunkTranscript(text, maxLength = 5000) {
  const chunks = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    if (text.length - startIndex <= maxLength) {
      chunks.push(text.substring(startIndex));
      break;
    }
    
    let endIndex = startIndex + maxLength;
    // Tìm dấu chấm gần nhất hoặc khoảng trắng gần nhất để ngắt câu đẹp
    let lastDot = text.lastIndexOf('. ', endIndex);
    if (lastDot > startIndex + maxLength * 0.7) {
      endIndex = lastDot + 1;
    } else {
      let lastSpace = text.lastIndexOf(' ', endIndex);
      if (lastSpace > startIndex + maxLength * 0.7) {
        endIndex = lastSpace;
      }
    }
    
    chunks.push(text.substring(startIndex, endIndex).trim());
    startIndex = endIndex;
  }
  
  return chunks;
}

async function generateDetailedChunk(chunkText, index, total, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
  const prompt = `Bạn là một chuyên gia soạn thảo tài liệu học tập. Đây là phần thứ ${index + 1}/${total} của transcript video bài học:
"${chunkText}"

YÊU CẦU: Hãy chuyển đoạn transcript này thành một phần ghi chú học tập (Study Notes) CỰC KỲ CHI TIẾT và sâu sắc.
- Trình bày rõ ràng bằng Markdown (dùng headings h3, gạch đầu dòng, in đậm thuật ngữ).
- Giải thích cặn kẽ mọi khái niệm kỹ thuật, định nghĩa, giao thức, ví dụ hay phân tích được đề cập.
- KHÔNG ĐƯỢC TÓM TẮT SƠ SÀI. Mục tiêu là viết lại đầy đủ 100% nội dung kiến thức được nói đến trong phần này, giống như một bài viết giải thích chi tiết để người đọc nắm bắt đầy đủ.
- ĐẶC BIỆT: Ở cuối mỗi khái niệm hoặc kiến thức quan trọng được giải thích, hãy thêm một phần tổng hợp ngắn gọn lấy **ví dụ thực tế trực quan sinh động hoặc ẩn dụ thú vị** (đặt trong hộp Blockquote dạng \`> **💡 Ví dụ nhớ đời:** ...\`) giúp người học ghi nhớ sâu và lâu nhất.
- Trả về phần ghi chú chi tiết bằng Markdown trực tiếp (không cần chào hỏi, không cần định dạng JSON).`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Gemini Error on Chunk ${index + 1}:`, errorBody);
    if (response.status === 403 || response.status === 401) {
      throw new Error("Lỗi xác thực: API Key của bạn không đúng hoặc đã hết hạn.");
    }
    throw new Error(`Lỗi gọi Gemini API khi phân tích phần ${index + 1}: Status ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function finalizeArticleWithImages(fullDraft, frames, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
  const prompt = `Tôi có một bài ghi chú học tập chi tiết được biên soạn từ video như sau:
"${fullDraft}"

Tôi cũng cung cấp cho bạn ${frames ? frames.length : 0} bức ảnh (frames) được cắt ra từ video này theo thứ tự thời gian.

YÊU CẦU:
1. Hãy đọc kỹ bài ghi chú văn bản và tự động chèn các bức ảnh này vào những vị trí thích hợp nhất trong bài viết để minh họa trực quan cho nội dung.
Sử dụng cú pháp Markdown: \`![Hình minh họa]([IMAGE_0])\`, \`![Hình minh họa]([IMAGE_1])\`, ... (ảnh đầu tiên là IMAGE_0, ảnh thứ hai là IMAGE_1, v.v.). Hãy phân bố ảnh đều và hợp lý xuyên suốt bài viết dựa theo mạch nội dung.
2. Dựa vào nội dung bài học, hãy đặt một Tiêu Đề Bài Học (lesson_title) bằng tiếng Anh CỰC KỲ NGẮN GỌN và SÚC TÍCH (chỉ khoảng 2-4 từ), tập trung chính xác và duy nhất vào chủ đề cốt lõi của bài học (ví dụ: "Transport Layer", "TCP Handshake", "Routing Basics"). Tuyệt đối không dài dòng, không chứa tên khóa học chung chung.

Trả về kết quả ở định dạng JSON chuẩn xác (hãy dùng \\n để xuống dòng trong chuỗi JSON của key "article"):
{
  "lesson_title": "Tiêu đề cốt lõi cực ngắn",
  "article": "Nội dung bài viết hoàn chỉnh bằng Markdown đã được chèn các mã ảnh [IMAGE_x]..."
}`;

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
    console.error("Gemini Error on Finalization:", errorBody);
    if (response.status === 403 || response.status === 401) {
      throw new Error("Lỗi xác thực: API Key của bạn không đúng hoặc đã hết hạn.");
    }
    throw new Error(`Lỗi gọi Gemini API khi chèn ảnh và tạo tiêu đề: Status ${response.status}`);
  }

  const data = await response.json();
  const rawResponse = data.candidates[0].content.parts[0].text;

  const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error(e);
    }
  }
  throw new Error("Không thể phân tích kết quả JSON trả về từ AI.");
}



function generateArticle(title, articleContent, numFrames) {
  let md = `# ${title}\n\n`;
  md += `${articleContent}\n\n`;

  if (numFrames > 0) {
    md += `\n---\n*Ghi chú: ${numFrames} hình ảnh minh họa (.jpg) đã được tải về và lưu tự động vào thư mục con \`image/\` cùng cấp với file này. Để ảnh hiển thị tự động, hãy đảm bảo bạn sao chép cả thư mục \`image/\` nếu bạn muốn di chuyển file markdown sang nơi khác!*\n`;
  }

  return md;
}
