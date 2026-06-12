const fs = require('fs');
const path = 'd:/folder/tools/content/background/background.js';
let code = fs.readFileSync(path, 'utf8');

// 1. Replace the old image distribution block (lines 105-129)
const searchImageBlock = /  \/\/ 4\. Phân phối hình ảnh thông minh[\s\S]*?  \/\/ 5\. Tổng hợp thành Markdown bài viết/;
const replaceImageBlock = `  // 4. Phân phối hình ảnh cực chuẩn bằng AI Chỉ Điểm
  if (frames && frames.length > 0) {
    // Đánh số dòng bài viết
    const lines = processedArticle.split('\\n');
    const numberedArticle = lines.map((l, i) => \`[\${i}] \${l}\`).join('\\n');
    
    try {
      const placements = await generateImagePlacements(numberedArticle, frames, keys.geminiApiKey);
      
      // Sắp xếp placement theo thứ tự giảm dần của lineNumber để chèn không làm lệch index
      placements.sort((a, b) => b.lineNumber - a.lineNumber);
      
      const placedImages = new Set();
      for (const p of placements) {
        const lineIdx = p.lineNumber;
        const imgIdx = p.imageIndex;
        if (lineIdx >= 0 && lineIdx < lines.length && imgIdx >= 0 && imgIdx < frames.length) {
          const imgStr = \`\\n![Hình minh họa](./image/\${safeTitle}_anh_\${imgIdx}.jpg)\\n\`;
          lines.splice(lineIdx + 1, 0, imgStr);
          placedImages.add(imgIdx);
        }
      }

      // Xây dựng lại văn bản
      processedArticle = lines.join('\\n');

      // Chèn các ảnh còn thừa xuống cuối bài
      if (placedImages.size < frames.length) {
        processedArticle += '\\n\\n### Hình ảnh minh họa thêm:\\n';
        for (let i = 0; i < frames.length; i++) {
          if (!placedImages.has(i)) {
            processedArticle += \`\\n![Hình minh họa](./image/\${safeTitle}_anh_\${i}.jpg)\`;
          }
        }
      }
    } catch(err) {
      console.error("Lỗi khi định vị ảnh, dùng phương pháp chèn dồn xuống cuối", err);
      processedArticle += '\\n\\n### Hình ảnh minh họa:\\n';
      for (let i = 0; i < frames.length; i++) {
        processedArticle += \`\\n![Hình minh họa](./image/\${safeTitle}_anh_\${i}.jpg)\`;
      }
    }
  }

  // 5. Tổng hợp thành Markdown bài viết`;
code = code.replace(searchImageBlock, replaceImageBlock);

// 2. Remove [CHÈN_ẢNH_MINH_HỌA] instruction from generateDeepChunk
const searchInstruction = `3. CHÈN ẢNH: Nếu bạn thấy đoạn transcript đang mô tả một giao diện, một sơ đồ, hoặc một khái niệm trực quan cần hình ảnh minh họa, hãy chèn ĐÚNG chuỗi \\\`[CHÈN_ẢNH_MINH_HỌA]\\\` vào vị trí đó. (Ví dụ: "Như bạn thấy trên màn hình [CHÈN_ẢNH_MINH_HỌA], chúng ta click vào..."). Đừng chèn bừa bãi nếu không thực sự cần.`;
code = code.replace(searchInstruction, `3. BỎ QUA HÌNH ẢNH: Bạn KHÔNG CẦN chèn hình ảnh, hệ thống sẽ tự động ghép ảnh ở bước sau.`);

// 3. Inject generateImagePlacements function at the end
const newFunction = `
async function generateImagePlacements(numberedArticle, frames, apiKey) {
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=\${apiKey}\`;
  const prompt = \`Tôi có một bài viết giải thích chi tiết (đã được đánh số dòng) và \${frames.length} bức ảnh được cung cấp đính kèm theo thứ tự.
Nhiệm vụ của bạn là làm "Người chỉ điểm": Hãy đọc văn bản và quan sát kỹ các bức ảnh. Chọn một dòng thích hợp nhất để chèn bức ảnh đó vào ngay bên dưới dòng đó. Mỗi bức ảnh chỉ nên gắn với 1 vị trí dòng duy nhất để minh họa tốt nhất cho nội dung.

Dưới đây là bài viết đã đánh số dòng:
\${numberedArticle}

YÊU CẦU:
Trích xuất ĐÚNG định dạng JSON sau (không viết thêm lời chào hỏi, định dạng MẢNG CÁC OBJECT):
[
  {"imageIndex": 0, "lineNumber": 25},
  {"imageIndex": 1, "lineNumber": 45}
]\`;

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
  text = text.replace(/^\\s*\`\`\`json\\s*/i, '').replace(/\\s*\`\`\`\\s*$/i, '');
  return JSON.parse(text);
}
`;

code = code + newFunction;

fs.writeFileSync(path, code);
console.log("Update 4 success!");
