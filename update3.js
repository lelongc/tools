const fs = require('fs');
const path = 'd:/folder/tools/content/background/background.js';
let code = fs.readFileSync(path, 'utf8');

const searchBlock = /let processedArticle = draftArticles\.join\('\\n\\n'\);\s*\/\/\s*4\.\s*Phân phối hình ảnh thông minh/g;

const replaceBlock = `let processedArticle = draftArticles.join('\\n\\n');

  // --- TẠO BÍ KÍP ÔN THI ĐỂ NHỚ CÔ ĐỌNG ---
  try {
    const examCheatSheet = await generateExamCheatSheet(finalTranscript, keys.geminiApiKey);
    if (examCheatSheet) {
      processedArticle += '\\n\\n---\\n\\n' + examCheatSheet;
    }
  } catch(err) {
    console.error("Lỗi khi tạo Cheat Sheet", err);
  }

  // 4. Phân phối hình ảnh thông minh`;

if (code.match(searchBlock)) {
  code = code.replace(searchBlock, replaceBlock);
  fs.writeFileSync(path, code);
  console.log("Regex Replace successful!");
} else {
  console.log("Regex did not match!");
}
