# 📜 HƯỚNG DẪN & MẪU CÂU LỆNH (PROMPT TEMPLATES) CHO QUY TRÌNH AUTO-SCRIBE & GOOGLE FLOW AI

Tài liệu này chứa các câu lệnh (Prompt) chuẩn để bạn copy & dán trực tiếp vào khung chat khi làm việc cùng Antigravity (AI IDE).

---

## 📌 PROMPT 1: PHÂN TÍCH KỊCH BẢN TỪ WHISPER (`pending_scenes.json`)

> Dùng khi bạn vừa bấm **"BƯỚC 1: Gửi về Laptop"** trên Colab và muốn AI phân tích kịch bản thành storyboard hoàn chỉnh.

### 📝 Câu lệnh copy:
```markdown
Hãy đọc file `pending_scenes.json` và phân tích kịch bản video Whiteboard Doodle chi tiết:
1. Đọc từng câu thoại và mốc thời gian (start, end, text).
2. Với mỗi câu thoại, tạo ý tưởng hình ảnh trực quan (visual_concept), phong cách hiệu ứng (animation_style: 'draw', 'movein', 'fadein').
3. Tạo từ khóa cốt lõi tiếng Anh ngắn gọn cho tìm kiếm Drive: `svg_search_prompt` (ví dụ: "smartphone pocket", "rolex luxury watch crown").
4. Tạo prompt tiếng Anh chuyên sâu cho Google Flow AI: `flow_prompt` (ví dụ: "Minimalist black and white whiteboard doodle sketch of a glowing smartphone in a jeans pocket, clean black ink pen outline, pure solid white background, isolated on white, no frame, no shadows").
5. Lưu kết quả chuẩn định dạng JSON hoàn chỉnh vào file `last_analyzed_scenes.json`.
```

---

## 📌 PROMPT 2: XUẤT DANH SÁCH PROMPT CHO GOOGLE FLOW (`flow_prompts.txt`)

> Dùng sau khi AI đã phân tích xong Prompt 1. AI sẽ xuất ra một file `.txt` chứa danh sách các prompt theo thứ tự `001`, `002`, `003`... để bạn chỉ việc copy từng dòng dán vào Google Flow (`flow.google`) tạo ảnh.

### 📝 Câu lệnh copy:
```markdown
Hãy đọc file `last_analyzed_scenes.json` và xuất ra file `flow_prompts.txt`:
1. Mỗi dòng là 1 prompt tiếng Anh hoàn chỉnh cho từng bức ảnh theo đúng thứ tự xuất hiện trong kịch bản.
2. Đánh số rõ ràng ở đầu dòng: [001], [002], [003]... kèm tên file gợi ý (ví dụ: 001_smartphone_pocket.png) và prompt chi tiết.
3. Giữa các prompt cách nhau 1 dòng trống để dễ nhìn và dễ copy vào Google Flow.
```

---

## 📌 QUY TRÌNH TẠO ẢNH BẰNG GOOGLE FLOW & ĐỒNG BỘ COLAB:

1. **Tạo ảnh:** Bạn mở [flow.google](https://flow.google) hoặc ImageFX ➔ Copy từng dòng prompt trong `flow_prompts.txt` dán vào tạo ảnh ➔ Tải file PNG về máy.
2. **Lưu file:** Đổi tên các file ảnh tải về thành `001.png`, `002.png`, `003.png`... (hoặc giữ tên có chứa số thứ tự) và đặt vào thư mục:
   📂 `d:\folder\tools\short\longv1\image-temp\`
3. **Kéo về Colab & Đóng gói:** 
   - Đảm bảo `python local_bridge.py` đang chạy trên máy tính.
   - Trên Colab, chọn chế độ **`🚀 3. Lấy Ảnh Google Flow từ Laptop qua Tunnel`**.
   - Bấm **`📥 BƯỚC 2: Kéo Kịch Bản & Tải/Vẽ Ảnh`** ➔ Colab sẽ tự động kéo toàn bộ ảnh từ thư mục `image-temp`, khử viền đen, vector hóa SVG, **tự động lưu vào Google Drive `/MyDrive/image/f/gen/`**, và đóng gói VideoScribe!
