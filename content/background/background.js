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

  // 1. Chia chunk siêu nhỏ (2500 ký tự)
  const chunks = chunkTranscript(finalTranscript, 2500);

  // 2. Lấy tiêu đề từ chunk đầu
  const finalTitle = await generateTitle(chunks[0], title, keys.geminiApiKey);
  
  // Đổi tên file sang chuẩn tiếng Anh
  const safeTitle = finalTitle
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase() || 'video_notes';

  // 3. Phân tích từng đoạn siêu sâu (chạy tuần tự để tránh Rate Limit của free API)
  let draftArticles = [];
  for (let i = 0; i < chunks.length; i++) {
    // Thêm một chút delay nhẹ giữa các request để an toàn
    if (i > 0) await new Promise(r => setTimeout(r, 1000));
    const chunkDraft = await generateDeepChunk(chunks[i], i, chunks.length, keys.geminiApiKey);
    draftArticles.push(chunkDraft);
  }

  let processedArticle = draftArticles.join('\n\n');

  // --- TẠO BÍ KÍP ÔN THI ĐỂ NHỚ CÔ ĐỌNG ---
  try {
    const examCheatSheet = await generateExamCheatSheet(finalTranscript, keys.geminiApiKey);
    if (examCheatSheet) {
      processedArticle += '\n\n---\n\n' + examCheatSheet;
    }
  } catch(err) {
    console.error("Lỗi khi tạo Cheat Sheet", err);
  }

  // 4. Phân phối hình ảnh cực chuẩn bằng AI Chỉ Điểm
  if (frames && frames.length > 0) {
    // Đánh số dòng bài viết
    const lines = processedArticle.split('\n');
    const numberedArticle = lines.map((l, i) => `[${i}] ${l}`).join('\n');
    
    try {
      const placements = await generateImagePlacements(numberedArticle, frames, keys.geminiApiKey);
      
      // Sắp xếp placement theo thứ tự giảm dần của lineNumber để chèn không làm lệch index
      placements.sort((a, b) => b.lineNumber - a.lineNumber);
      
      const placedImages = new Set();
      for (const p of placements) {
        const lineIdx = p.lineNumber;
        const imgIdx = p.imageIndex;
        if (lineIdx >= 0 && lineIdx < lines.length && imgIdx >= 0 && imgIdx < frames.length) {
          const imgStr = `\n![Hình minh họa](./image/${safeTitle}_anh_${imgIdx}.jpg)\n`;
          lines.splice(lineIdx + 1, 0, imgStr);
          placedImages.add(imgIdx);
        }
      }

      // Xây dựng lại văn bản
      processedArticle = lines.join('\n');

      // Chèn các ảnh còn thừa xuống cuối bài
      if (placedImages.size < frames.length) {
        processedArticle += '\n\n### Hình ảnh minh họa thêm:\n';
        for (let i = 0; i < frames.length; i++) {
          if (!placedImages.has(i)) {
            processedArticle += `\n![Hình minh họa](./image/${safeTitle}_anh_${i}.jpg)`;
          }
        }
      }
    } catch(err) {
      console.error("Lỗi khi định vị ảnh, dùng phương pháp chèn dồn xuống cuối", err);
      processedArticle += '\n\n### Hình ảnh minh họa:\n';
      for (let i = 0; i < frames.length; i++) {
        processedArticle += `\n![Hình minh họa](./image/${safeTitle}_anh_${i}.jpg)`;
      }
    }
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

function chunkTranscript(text, maxLength = 2500) {
  const chunks = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    if (text.length - startIndex <= maxLength) {
      chunks.push(text.substring(startIndex));
      break;
    }
    
    let endIndex = startIndex + maxLength;
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

async function generateTitle(textSample, defaultTitle, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
  const prompt = `Dựa vào đoạn nội dung bài học sau: "${textSample.substring(0, 1000)}"
Hãy đặt một Tiêu Đề Bài Học bằng tiếng Anh CỰC KỲ NGẮN GỌN (2-4 từ), tập trung chính xác vào chủ đề cốt lõi. Trả về đúng tiêu đề, không giải thích gì thêm.`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!response.ok) return defaultTitle;
    const data = await response.json();
    const title = data.candidates[0].content.parts[0].text.trim().replace(/["'*]/g, '');
    return title.length > 3 ? title : defaultTitle;
  } catch(e) {
    return defaultTitle;
  }
}

async function generateDeepChunk(chunkText, index, total, previousChunkText, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
  const prompt = `Bạn là một chuyên gia phân tích và giải thích chi tiết.
Đây là phần thứ ${index + 1}/${total} của một đoạn transcript bài học:
"${chunkText}"

YÊU CẦU BẮT BUỘC ĐỂ KHÔNG BỊ PHẠT:
1. ĐỪNG VIẾT CÂU MỞ BÀI HAY KẾT LUẬN (vì đây chỉ là một mảnh ghép).
2. KÍNH LÚP PHÂN TÍCH: Hãy bám sát từng câu, từng ý trong đoạn transcript trên và biến nó thành một bài giảng giải thích cặn kẽ mọi khái niệm. Viết thật dài và thật sâu sắc. Không được bỏ sót ý nào.
3. BỎ QUA HÌNH ẢNH: Bạn KHÔNG CẦN chèn hình ảnh, hệ thống sẽ tự động ghép ảnh ở bước sau.
4. VÍ DỤ NHỚ ĐỜI: Nếu đoạn này chứa một khái niệm quan trọng, hãy rắc vào một "Ví dụ nhớ đời" (ẩn dụ thực tế) bọc trong hộp quote: \`> **💡 Ví dụ nhớ đời:** ...\`
5. Trả về kết quả trực tiếp bằng Markdown thuần túy, KHÔNG tạo XML, JSON hay bất kỳ gì thừa thãi.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  if (!response.ok) {
    if (response.status === 403 || response.status === 401) {
      throw new Error("Lỗi xác thực: API Key của bạn không đúng hoặc đã hết hạn.");
    }
    throw new Error(`Lỗi gọi Gemini API ở phần ${index + 1}: Status ${response.status}`);
  }

  const data = await response.json();
  let article = data.candidates[0].content.parts[0].text;
  article = article.replace(/^\s*```markdown\s*/i, '').replace(/\s*```\s*$/i, '');
  return article.trim();
}

function generateArticle(title, articleContent, numFrames) {
  let md = `# ${title}\n\n`;
  md += `${articleContent}\n\n`;

  if (numFrames > 0) {
    md += `\n---\n*Ghi chú: ${numFrames} hình ảnh minh họa (.jpg) đã được tải về và lưu tự động vào thư mục con \`image/\` cùng cấp với file này. Để ảnh hiển thị tự động, hãy đảm bảo bạn sao chép cả thư mục \`image/\` nếu bạn muốn di chuyển file markdown sang nơi khác!*\n`;
  }

  return md;
}

async function generateExamCheatSheet(transcript, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
  const prompt = `Bạn là một chuyên gia ôn thi đại học. Dựa vào toàn bộ transcript bài giảng sau, hãy tạo ra một phần TỔNG KẾT ÔN THI (Cheat Sheet) cực kỳ cô đọng, dễ nhớ, nhằm giúp người học có thể lướt nhanh để thi.

Transcript:
"${transcript}"

YÊU CẦU:
- Bắt đầu bằng Heading: "## 🎯 Bí Kíp Ôn Thi Tốc Độ"
- Trình bày dạng gạch đầu dòng ngắn gọn, in đậm các từ khóa, khái niệm cốt lõi.
- Tuyệt đối không viết giải thích dài dòng. Chỉ đúc kết tinh hoa, công thức, mẹo ghi nhớ.
- Trả về Markdown thuần, không bọc JSON.`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!response.ok) return '';
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/^\s*```markdown\s*/i, '').replace(/\s*```\s*$/i, '');
    return text.trim();
  } catch(e) {
    return '';
  }
}

async function generateImagePlacements(numberedArticle, frames, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
  const prompt = `Tôi có một bài viết giải thích chi tiết (đã được đánh số dòng) và ${frames.length} bức ảnh được cung cấp đính kèm theo thứ tự.
Nhiệm vụ của bạn là làm "Người chỉ điểm": Hãy đọc văn bản và quan sát kỹ các bức ảnh. Chọn một dòng thích hợp nhất để chèn bức ảnh đó vào ngay bên dưới dòng đó. Mỗi bức ảnh chỉ nên gắn với 1 vị trí dòng duy nhất để minh họa tốt nhất cho nội dung.

Dưới đây là bài viết đã đánh số dòng:
${numberedArticle}

YÊU CẦU:
Trích xuất ĐÚNG định dạng JSON sau (không viết thêm lời chào hỏi, định dạng MẢNG CÁC OBJECT):
[
  {"imageIndex": 0, "lineNumber": 25},
  {"imageIndex": 1, "lineNumber": 45}
]`;

  const parts = [{ text: prompt }];
  frames.forEach((frameBase64) => {
    const base64Data = frameBase64.split(',')[1];
    if (base64Data) {
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: base64Data }
      });
    }
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: parts }] })
  });

  if (!response.ok) throw new Error("API Lỗi: " + response.status);
  const data = await response.json();
  let text = data.candidates[0].content.parts[0].text;
  text = text.replace(/^\s*```json\s*/i, '').replace(/\s*```\s*$/i, '');
  return JSON.parse(text);
}
