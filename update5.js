const fs = require('fs');
const path = 'd:/folder/tools/content/background/background.js';
let code = fs.readFileSync(path, 'utf8');

// 1. Thay đổi vòng lặp processCapturedSession
const searchLoop = `  let draftArticles = [];
  for (let i = 0; i < chunks.length; i++) {
    // Thêm một chút delay nhẹ giữa các request để an toàn
    if (i > 0) await new Promise(r => setTimeout(r, 1000));
    const chunkDraft = await generateDeepChunk(chunks[i], i, chunks.length, keys.geminiApiKey);
    draftArticles.push(chunkDraft);
  }`;

const replaceLoop = `  let draftArticles = [];
  let previousChunkText = "";
  for (let i = 0; i < chunks.length; i++) {
    // Thêm một chút delay nhẹ giữa các request để an toàn
    if (i > 0) await new Promise(r => setTimeout(r, 1000));
    const chunkDraft = await generateDeepChunk(chunks[i], i, chunks.length, previousChunkText, keys.geminiApiKey);
    draftArticles.push(chunkDraft);
    previousChunkText = chunks[i];
  }`;

code = code.replace(searchLoop, replaceLoop);

// 2. Thay đổi function signature generateDeepChunk
const searchFunc = `async function generateDeepChunk(chunkText, index, total, apiKey) {`;
const replaceFunc = `async function generateDeepChunk(chunkText, index, total, previousChunkText, apiKey) {`;
code = code.replace(searchFunc, replaceFunc);

// 3. Thay đổi prompt của generateDeepChunk
const searchPrompt = `const prompt = \`Bạn là một chuyên gia phân tích và giải thích chi tiết.
Đây là phần thứ \${index + 1}/\${total} của một đoạn transcript bài học:
"\${chunkText}"

YÊU CẦU BẮT BUỘC ĐỂ KHÔNG BỊ PHẠT:`;

const replacePrompt = `const prompt = \`Bạn là một chuyên gia phân tích và giải thích chi tiết.
Đây là phần thứ \${index + 1}/\${total} của một đoạn transcript bài học:
"\${chunkText}"

\${previousChunkText ? \\\`NGỮ CẢNH: Đoạn transcript của PHẦN NGAY TRƯỚC ĐÓ là: "\${previousChunkText}"\\nLƯU Ý CỰC KỲ QUAN TRỌNG: Các khái niệm xuất hiện trong PHẦN NGAY TRƯỚC ĐÓ đã được giải thích rất kỹ rồi. TUYỆT ĐỐI KHÔNG giải thích lại định nghĩa cơ bản của chúng nữa. Chỉ tập trung giải thích những kiến thức MỚI hoặc diễn biến cốt truyện mới trong phần hiện tại này để tránh lặp ý.\\\` : ''}

YÊU CẦU BẮT BUỘC ĐỂ KHÔNG BỊ PHẠT:`;

code = code.replace(searchPrompt, replacePrompt);

fs.writeFileSync(path, code);
console.log("Update 5 success!");
