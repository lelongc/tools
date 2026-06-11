const fs = require('fs');
const path = 'd:/folder/tools/content/background/background.js';
let code = fs.readFileSync(path, 'utf8');

const searchBlock1 = `  // 4. Chia nhỏ transcript và xử lý chi tiết từng phần
  const chunks = chunkTranscript(finalTranscript);
  const draftArticles = await Promise.all(
    chunks.map((chunk, idx) => 
      generateDetailedChunk(chunk, idx, chunks.length, keys.geminiApiKey)
    )
  );
  
  const fullDraft = draftArticles.join('\\n\\n');

  // 4b. Gọi Gemini API để chèn ảnh và xác định tiêu đề súc tích
  const analysis = await finalizeArticleWithImages(fullDraft, frames, keys.geminiApiKey);`;

const replaceBlock1 = `  // 4. Gọi Gemini API 1 lần duy nhất với toàn bộ dữ liệu (Single-Pass XML Prompting)
  const analysis = await generateUltraDetailedArticle(finalTranscript, frames, title, keys.geminiApiKey);`;

code = code.replace(searchBlock1, replaceBlock1);

const newFunction = `async function generateUltraDetailedArticle(transcript, frames, originalTitle, apiKey) {
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=\${apiKey}\`;
  
  const prompt = \`Bạn là một chuyên gia soạn thảo tài liệu học tập và một hệ thống chuyển biên nguyên bản.
Dưới đây là TOÀN BỘ transcript của một video bài giảng có tựa đề "\${originalTitle}":

"\${transcript}"

\${frames && frames.length > 0 ? \`Tôi cũng cung cấp cho bạn \${frames.length} bức ảnh (frames) được cắt ra từ video này theo thứ tự thời gian. Bạn CẦN chèn các mã ảnh ![Hình minh họa]([IMAGE_0]), ![Hình minh họa]([IMAGE_1])... vào những vị trí thích hợp nhất trong bài viết để minh họa trực quan.\` : \`(Không có ảnh đính kèm)\`}

YÊU CẦU BẮT BUỘC (NẾU VI PHẠM SẼ BỊ PHẠT):
1. CHUYỂN BIÊN CHI TIẾT 100%: Bạn KHÔNG ĐƯỢC tóm tắt. Bạn PHẢI đọc từng câu, từng chữ trong transcript và chuyển đổi thành một bài viết cực kỳ chi tiết, giải thích cặn kẽ mọi khái niệm, ví dụ, logic có trong đó. Nội dung bạn viết ra phải dài tương đương hoặc dài hơn cả video gốc.
2. VÍ DỤ NHỚ ĐỜI: Ở cuối mỗi khái niệm hoặc đoạn phân tích quan trọng, hãy thêm một phần tổng hợp ngắn gọn lấy ví dụ thực tế trực quan sinh động hoặc ẩn dụ (đặt trong hộp Blockquote dạng \\\`> **💡 Ví dụ nhớ đời:** ...\\\`) giúp người học ghi nhớ sâu và lâu nhất.
3. ĐỊNH DẠNG XML: CHỈ TRẢ VỀ ĐÚNG ĐỊNH DẠNG XML DƯỚI ĐÂY (không bọc trong markdown json, không viết thêm lời chào hỏi):

<title>Tiêu đề bài học cốt lõi bằng tiếng Anh (2-4 từ)</title>
<article>
# Nội dung bài viết Markdown chi tiết
...
</article>\`;

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
    if (response.status === 403 || response.status === 401) {
      throw new Error("Lỗi xác thực: API Key của bạn không đúng hoặc đã hết hạn.");
    }
    throw new Error(\`Lỗi gọi Gemini API: Status \${response.status}\`);
  }

  const data = await response.json();
  const rawText = data.candidates[0].content.parts[0].text;
  
  const titleMatch = rawText.match(/<title>([\\s\\S]*?)<\\/title>/i);
  const articleMatch = rawText.match(/<article>([\\s\\S]*?)<\\/article>/i);

  const lesson_title = titleMatch ? titleMatch[1].trim() : originalTitle;
  let article = articleMatch ? articleMatch[1].trim() : rawText;

  // Xóa các block code thừa nếu AI bọc XML
  article = article.replace(/^\\s*\`\`\`xml\\s*/i, '').replace(/\\s*\`\`\`\\s*$/i, '');
  article = article.replace(/^\\s*\`\`\`markdown\\s*/i, '').replace(/\\s*\`\`\`\\s*$/i, '');

  return { lesson_title, article };
}

function generateArticle(title, articleContent, numFrames) {`;

const re = /function chunkTranscript[\s\S]*?function generateArticle\(title, articleContent, numFrames\) \{/m;
code = code.replace(re, newFunction);

fs.writeFileSync(path, code);
console.log("Update success!");
