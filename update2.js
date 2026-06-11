const fs = require('fs');
const path = 'd:/folder/tools/content/background/background.js';
let code = fs.readFileSync(path, 'utf8');

const newLogic = `async function processCapturedSession(sessionData) {
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
    .replace(/[\\u0300-\\u036f]/g, '')
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

  let processedArticle = draftArticles.join('\\n\\n');

  // 4. Phân phối hình ảnh thông minh
  // AI đã được dặn đặt thẻ [CHÈN_ẢNH_MINH_HỌA] vào chỗ cần thiết
  if (frames && frames.length > 0) {
    let frameIndex = 0;
    // Thay thế từng chữ [CHÈN_ẢNH_MINH_HỌA] bằng ảnh thực tế cho đến khi hết ảnh
    processedArticle = processedArticle.replace(/\\[CHÈN_ẢNH_MINH_HỌA\\]/g, () => {
      if (frameIndex < frames.length) {
        const imgPath = \`![Hình minh họa](./image/\${safeTitle}_anh_\${frameIndex}.jpg)\`;
        frameIndex++;
        return imgPath;
      }
      return ''; // Xóa đi nếu đã hết ảnh
    });

    // Nếu thay xong mà vẫn còn dư ảnh, chèn nốt ảnh thừa vào cuối bài
    if (frameIndex < frames.length) {
      processedArticle += '\\n\\n### Hình ảnh minh họa thêm:\\n';
      for (; frameIndex < frames.length; frameIndex++) {
        processedArticle += \`\\n![Hình minh họa](./image/\${safeTitle}_anh_\${frameIndex}.jpg)\`;
      }
    }
  } else {
    // Xóa hết các tag nếu người dùng không chụp ảnh nào
    processedArticle = processedArticle.replace(/\\[CHÈN_ẢNH_MINH_HỌA\\]/g, '');
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
      
      const mdFilename = \`learn/\${safeTitle}.md\`;
      blobUrlToFilename.set(urls[0], mdFilename);
      chrome.downloads.download({
        url: urls[0],
        saveAs: false
      });

      if (frames && frames.length > 0) {
        for (let i = 0; i < frames.length; i++) {
          const imgFilename = \`learn/image/\${safeTitle}_anh_\${i}.jpg\`;
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
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=\${apiKey}\`;
  const prompt = \`Dựa vào đoạn nội dung bài học sau: "\${textSample.substring(0, 1000)}"
Hãy đặt một Tiêu Đề Bài Học bằng tiếng Anh CỰC KỲ NGẮN GỌN (2-4 từ), tập trung chính xác vào chủ đề cốt lõi. Trả về đúng tiêu đề, không giải thích gì thêm.\`;
  
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

async function generateDeepChunk(chunkText, index, total, apiKey) {
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=\${apiKey}\`;
  const prompt = \`Bạn là một chuyên gia phân tích và giải thích chi tiết.
Đây là phần thứ \${index + 1}/\${total} của một đoạn transcript bài học:
"\${chunkText}"

YÊU CẦU BẮT BUỘC ĐỂ KHÔNG BỊ PHẠT:
1. ĐỪNG VIẾT CÂU MỞ BÀI HAY KẾT LUẬN (vì đây chỉ là một mảnh ghép).
2. KÍNH LÚP PHÂN TÍCH: Hãy bám sát từng câu, từng ý trong đoạn transcript trên và biến nó thành một bài giảng giải thích cặn kẽ mọi khái niệm. Viết thật dài và thật sâu sắc. Không được bỏ sót ý nào.
3. CHÈN ẢNH: Nếu bạn thấy đoạn transcript đang mô tả một giao diện, một sơ đồ, hoặc một khái niệm trực quan cần hình ảnh minh họa, hãy chèn ĐÚNG chuỗi \\\`[CHÈN_ẢNH_MINH_HỌA]\\\` vào vị trí đó. (Ví dụ: "Như bạn thấy trên màn hình [CHÈN_ẢNH_MINH_HỌA], chúng ta click vào..."). Đừng chèn bừa bãi nếu không thực sự cần.
4. VÍ DỤ NHỚ ĐỜI: Nếu đoạn này chứa một khái niệm quan trọng, hãy rắc vào một "Ví dụ nhớ đời" (ẩn dụ thực tế) bọc trong hộp quote: \\\`> **💡 Ví dụ nhớ đời:** ...\\\`
5. Trả về kết quả trực tiếp bằng Markdown thuần túy, KHÔNG tạo XML, JSON hay bất kỳ gì thừa thãi.\`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  if (!response.ok) {
    if (response.status === 403 || response.status === 401) {
      throw new Error("Lỗi xác thực: API Key của bạn không đúng hoặc đã hết hạn.");
    }
    throw new Error(\`Lỗi gọi Gemini API ở phần \${index + 1}: Status \${response.status}\`);
  }

  const data = await response.json();
  let article = data.candidates[0].content.parts[0].text;
  article = article.replace(/^\\s*\`\`\`markdown\\s*/i, '').replace(/\\s*\`\`\`\\s*$/i, '');
  return article.trim();
}

function generateArticle(title, articleContent, numFrames) {
  let md = \`# \${title}\\n\\n\`;
  md += \`\${articleContent}\\n\\n\`;

  if (numFrames > 0) {
    md += \`\\n---\\n*Ghi chú: \${numFrames} hình ảnh minh họa (.jpg) đã được tải về và lưu tự động vào thư mục con \\\`image/\\\` cùng cấp với file này. Để ảnh hiển thị tự động, hãy đảm bảo bạn sao chép cả thư mục \\\`image/\\\` nếu bạn muốn di chuyển file markdown sang nơi khác!*\\n\`;
  }

  return md;
}
`;

const re = /async function processCapturedSession\(sessionData\) \{[\s\S]*$/;
code = code.replace(re, newLogic);

fs.writeFileSync(path, code);
console.log("Update success!");
