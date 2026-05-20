# HƯỚNG DẪN SỬ DỤNG TOOL TẠO VIDEO SHORT VIRAL (TIẾNG ANH)

Tài liệu này hướng dẫn chi tiết cách sử dụng bộ công cụ để tạo ra video dạy học tiếng Anh dạng Short (dọc) với phụ đề chạy khớp từng từ và chuyển cảnh mượt mà.

---

## 🏗️ Kiến trúc Hệ thống
1. **`generate_script.py`**: Nhận chủ đề từ bạn, gọi Groq API (LLM) để sinh kịch bản tiếng Anh ngắn (<1 phút), tự động trích xuất các từ khoá hình ảnh (visual keywords) chính và lưu vào thư mục dự án.
2. **Google Colab (hoặc tool ngoài)**: Sử dụng kịch bản để tạo file âm thanh phát âm `audio.mp3` và phụ đề thô `subtitle.srt`.
3. **`render_web.py`**:
   - **Tự động tải ảnh**: Tìm kiếm và tải ảnh chất lượng cao tự động từ Pexels API theo các từ khóa của dự án.
   - **Tự động Align từ (Word-level Sync)**: Sử dụng Gemini API lắng nghe trực tiếp `audio.mp3` để phân tích giây bắt đầu/kết thúc của **từng từ đơn**, lưu vào file `word_timestamps.json`.
   - **Chụp ảnh Frame-by-Frame**: Khởi chạy trình duyệt Playwright headless chạy file mẫu `template_v2.html`, truyền toàn bộ dữ liệu vào và chụp ảnh màn hình với tốc độ 30 hình/giây (FPS).
   - **Đóng gói Video (FFmpeg)**: Ghép toàn bộ các ảnh chụp với file âm thanh `audio.mp3` để tạo video thành phẩm `output_web.mp4` hoàn chỉnh.

---

## 🛠️ Yêu cầu trước khi sử dụng
Đảm bảo bạn đã điền đầy đủ API key trong file `.env` tại thư mục gốc:
```env
gemini_api="KEY_GEMINI_CỦA_BẠN"
pexels_api="KEY_PEXELS_CỦA_BẠN"
groq_api="KEY_GROQ_CỦA_BẠN"
```

---

## 🚀 Quy trình 4 bước tạo Video Short

### Bước 1: Tạo kịch bản & Từ khóa từ AI
Chạy lệnh Python với chủ đề bạn muốn dạy:
```powershell
python generate_script.py "Cách dùng từ Get trong tiếng Anh"
```
*Hệ thống sẽ tự động tạo thư mục dự án tương ứng bên trong thư mục `projects/` (ví dụ: `projects/how_to_use_the_word_get_in_english/`), tạo sẵn kịch bản `script.txt` và danh sách từ khóa `keywords.json`.*

### Bước 2: Tạo Audio phát âm & Phụ đề
1. Mở file `projects/<ten_du_an>/script.txt`.
2. Sử dụng nội dung kịch bản này để chuyển thành giọng nói (TTS) bằng Google Colab hoặc bất kỳ công cụ đọc tiếng Anh nào.
3. Xuất file âm thanh dạng **`audio.mp3`**.
4. Xuất file phụ đề dạng **`subtitle.srt`** (hoặc `subtitles.srt`).
5. Thả cả 2 file `audio.mp3` và `subtitle.srt` vào trực tiếp thư mục dự án của bạn (ví dụ: `projects/how_to_use_the_word_get_in_english/`).

### Bước 3: Xuất Video thành phẩm
Chạy lệnh render với tên thư mục dự án của bạn:
```powershell
python render_web.py how_to_use_the_word_get_in_english
```
*Chương trình sẽ tự động:*
1. Tìm kiếm và tải ảnh stock từ Pexels.
2. Gọi Gemini API để tự động align giọng đọc thành mốc giây chi tiết của từng từ đơn.
3. Xuất video bằng Playwright + FFmpeg siêu mượt mà.

### Bước 4: Kiểm tra thành phẩm
Video thành phẩm sẽ nằm tại đường dẫn:
`projects/<ten_du_an>/output_web.mp4`

---

## 💡 Các lưu ý & Mẹo tối ưu hóa
- **Tránh giật hình/Flicker**: Hệ thống đã được nâng cấp cơ chế **Alternating Dual Buffer (Bộ đệm kép luân phiên)**. Ảnh chẵn luôn được nạp vào slot 1 (`img1`), ảnh lẻ vào slot 2 (`img2`). Khi đổi cảnh, việc nạp file `.src` mới được thực hiện lúc ảnh có độ mờ (opacity) bằng 0, loại bỏ hoàn toàn hiện tượng nhấp nháy hoặc trễ tải ảnh khi chuyển câu!
- **Tùy chỉnh tiêu đề Badge**: Bạn có thể sửa tiêu đề mặc định trên cùng bằng cách mở file `projects/<ten_du_an>/keywords.json` và sửa lại thuộc tính `"title"`.
- **Tùy chỉnh ảnh thủ công**: Nếu không thích ảnh stock do AI tự chọn trên Pexels, bạn chỉ việc tải ảnh mong muốn về, đổi tên giống với tên từ khóa đó (ví dụ: `tired.jpg`) và thả đè vào thư mục `projects/<ten_du_an>/images/`. Khi render lại, hệ thống sẽ ưu tiên sử dụng ảnh có sẵn này thay vì tải mới.
