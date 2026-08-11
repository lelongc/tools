# PHÂN TÍCH CHUYÊN SÂU FILE `1.SCRIBE` VÀ GIẢI PHÁP TỰ ĐỘNG HÓA VIDEOSCRIBE BẰNG AI (GEMINI + PYTHON)

---

## I. TỔNG QUAN VỀ YÊU CẦU & MỤC TIÊU DỰ ÁN

### 1. Vấn Đề Hiện Tại của Người Dùng
- **Phần mềm đang sử dụng:** Sparkol VideoScribe PRO Edition v3.7.3103 (Cài tại `C:\Program Files\Sparkol\Sparkol VideoScribe`).
- **Nỗi đau (Pain Points):**
  1. **Tìm kiếm tài nguyên (SVG/PNG) thủ công:** Phải mất nhiều giờ tìm kiếm từng hình vẽ vector SVG phù hợp với từng câu thoại.
  2. **Căn chỉnh thời gian (Timing) thủ công cực kỳ tốn sức:** Phải chỉnh thủ công từng khoảng thời gian vẽ (`animateTime`), khoảng dừng (`pauseTime`), và chuyển cảnh (`transitionTime`) cho hơn 100-150 hình vẽ/văn bản sao cho khớp khớp từng li từng tí với giọng đọc Audio.
  3. **Bố trí Không gian & Camera thủ công:** Phải kéo thả từng hình trên Canvas, xoay, chỉnh kích thước, đặt góc Camera cho từng phân cảnh.

### 2. Ý Tưởng & Mục Tiêu Hệ Thống Tự Động Hóa (Cập nhật quy trình Human-in-the-Loop)
- **Đầu vào:** File âm thanh MP3 (Giọng đọc hoàn hảo) + Text kịch bản gốc.
- **Xử lý AI Đa Tầng (Gemini 3.1 Flash-Lite / 3.1 Pro / 3.6 Flash):**
  - Tool tự động bóc tách âm thanh để lấy mốc thời gian (Whisper).
  - Tự động gọi API Gemini **nhiều lần** (mỗi lần một phân cảnh nhỏ) để phân tích sâu nội dung, xuất ra hàng loạt **Prompt chi tiết** mô tả hình ảnh cần vẽ/tìm.
  - Tự động tạo một thư mục `assets/` và xuất ra 1 file danh sách yêu cầu (VD: `scene_01_needs_image_of_a_clock.txt`).
- **Sự Tham Gia Của Người Dùng (Human-in-the-loop):**
  - Tool sẽ tạm dừng và báo: *"Vui lòng thả các ảnh SVG hoặc PNG vào thư mục `assets/` tương ứng với các Prompt"*. (Hoặc Tool có thể tự động crawl ảnh SVG free nếu tìm thấy).
  - Người dùng đọc Prompt, thả ảnh tương ứng vào thư mục.
- **Đóng Gói Tự Động:**
  - Tool quét lại thư mục `assets/`, check xem đã đủ ảnh cho mọi cảnh chưa.
  - Tự động tính toán lại toàn bộ thông số tọa độ, thời gian vẽ (`targetTime`), chuyển cảnh (`transitionTime`).
  - Gói thành 1 file `Output.zip` chứa file `project.scribe` chuẩn.
  - **Đầu ra mong muốn:** Mở file `.scribe` trong VideoScribe, mọi thứ đã khớp y xì đúc, chỉ việc bấm xuất Video!

---

## II. PHÂN TÍCH CHI TIẾT FILE DỰ ÁN `1.SCRIBE`

Qua phân tích trực tiếp bằng mã nguồn Python trên file `1.scribe`, em ghi nhận các phát hiện kỹ thuật quan trọng như sau:

### 1. Bản Chất Cấu Trúc File `.scribe`
File `.scribe` của VideoScribe **thực chất là một file nén chuẩn PK-ZIP (Zip Archive)**. Cấu trúc bên trong gồm:
```text
1.scribe (Zip Archive)
├── voiceover.mp3           (File âm thanh giọng đọc chính)
├── drawing.xml             (File XML chứa toàn bộ dữ liệu dự án)
├── Amita.vsttf             (File Font chữ nén dạng Vector)
└── thumb.png               (Ảnh thu nhỏ xem trước của dự án)
```
> 💡 **KẾT LUẬN CỰC KỲ QUAN TRỌNG:** Vì file `.scribe` thực chất chỉ là file nén ZIP chứa file văn bản `drawing.xml` và `voiceover.mp3`, chúng ta **HOÀN TOÀN CÓ THỂ DÙNG PYTHON ĐỂ TỰ ĐỘNG SINH RA FILE `.SCRIBE` MỚI 100%**!

### 2. Cấu Trúc Kỹ Thuật Bên Trong File `drawing.xml`
File `drawing.xml` là "trái tim" của dự án VideoScribe. Thẻ gốc là `<drawing>` chứa danh sách các thẻ phần tử `<element>`.

| Thuộc tính (Attribute) | Loại dữ liệu | Ý nghĩa & Vai trò |
| :--- | :--- | :--- |
| `elementType` | String | Loại phần tử: `"drawing"` (ảnh SVG) hoặc `"split_text"` (văn bản) |
| `drawingXML` | SVG String | **Đoạn mã Vector SVG đầy đủ** của hình vẽ (chứa thẻ `<svg>`, `<path d="...">`) |
| **`targetTime`** | Integer (ms) | **Thời gian tay vẽ hình** (tính bằng mili-giây, VD: `2000` = 2s) |
| **`pauseTime`** | Integer (ms) | **Thời gian tạm dừng** sau khi vẽ xong (VD: `500` = 0.5s) |
| **`transitionTime`**| Integer (ms) | **Thời gian Camera di chuyển** sang hình tiếp theo (VD: `500` = 0.5s) |
| `currentPosX` / `PosY` | Float | Tọa độ tâm X, Y của hình trên Canvas vô tận |
| **`cameraPositionX`** | Float | Tọa độ X tâm góc nhìn Camera khi vẽ hình này |
| **`cameraScale`** | Float | Tỷ lệ Zoom của Camera (VD: `1.186`) |

---

## III. ĐÁNH GIÁ TÍNH KHẢ THI (FEASIBILITY)

### ❓ Yêu cầu tạo luồng "Tự động Prompt -> Chờ User thả ảnh -> Tự động sinh file .scribe" có khả thi không?
👉 **CÂU TRẢ LỜI LÀ: CỰC KỲ KHẢ THI VÀ LÀ MỘT QUY TRÌNH HOÀN HẢO!**

Đây là một quy trình **Semi-Automated (Bán Tự Động)** đỉnh cao vì:
1. Nó giải quyết 100% nỗi đau mất thời gian căn chỉnh Timing và Animation (máy làm thay).
2. Nó giải quyết 100% việc nghĩ ra ý tưởng hình ảnh (AI Gemini nghĩ thay).
3. Nó giữ lại **sự tự do sáng tạo cao nhất cho anh** (anh tự chọn ảnh SVG đẹp nhất, ưng ý nhất theo Prompt thay vì máy tự chọn một cái ảnh xấu hoắc).
4. Khả năng tương thích là tuyệt đối: File đẻ ra là `.scribe` thuần chủng, anh mở lên trên app PC để tinh chỉnh thêm một chút màu sắc hay vị trí nếu thích rồi hẵng xuất ra MP4.

---

## IV. LỘ TRÌNH VÀ CÁC BƯỚC THỰC THI (CODE PYTHON TRÊN COLAB)

Tool sẽ được viết dưới dạng 1 file Notebook (`.ipynb`) trên Colab, chia làm các Cell (bước) rõ ràng để anh dễ kiểm soát:

### Cell 1: Setup & Bóc Tách mốc thời gian (Whisper)
- Tải file âm thanh `voiceover.mp3`.
- Chạy mô hình Whisper `base` để lấy danh sách từ và thời gian (Start/End).

### Cell 2: Gemini AI chia Scene & Sinh Prompt (Vòng lặp)
- Chia kịch bản thành các câu/đoạn (vd: 5-8 giây mỗi Scene).
- Viết vòng lặp gọi AI Gemini **3.1-flash-lite** (hoặc model tùy chọn). Ở mỗi vòng lặp, gửi 1 Scene cho AI kèm ngữ cảnh toàn bài, yêu cầu AI trả về:
  1. Mô tả chi tiết hình ảnh cần thiết (Visual Concept).
  2. Dòng Text cần hiện (nếu có).
- Tool sẽ in ra màn hình Colab một cái bảng đẹp đẽ:
  `Scene 1 (0:00 - 0:05): Prompt: "A drawing of a mechanical steel watch..."` -> Yêu cầu file `scene_01.svg`

### Cell 3: Kiểm tra ảnh (Human-in-the-loop)
- Tool quét thư mục `assets/` xem anh đã up đủ file `scene_01.svg`, `scene_02.png`, v.v. chưa.
- Nếu thiếu, nó báo đỏ. Nếu đủ, nó báo xanh và cho phép chạy tiếp.

### Cell 4: Engine Sinh File `.scribe` (Scribe Builder)
- Tự động lấy file âm thanh `voiceover.mp3`.
- Đọc từng ảnh SVG trong `assets/` và nhúng thành mã `<drawingXML>`.
- **Phép thuật toán học:**
  - `targetTime` = (End_Time - Start_Time) của đoạn hội thoại đó * 0.7
  - Tự động tính toán vị trí tọa độ `(X, Y)` để các hình vẽ rải rác đan xen nhau đẹp mắt (Ví dụ: xếp theo hình zigzag hoặc cuộn xuống dưới).
- Lưu thành `project.scribe`.
- Nén tất cả vào `Final_Output.zip` để anh tải về.

### KẾT LUẬN CUỐI CÙNG
Em sẽ ngay lập tức thiết kế **một bản Implementation Plan** và sau đó viết toàn bộ đoạn mã nguồn Python này để anh test ngay trên Colab. Hướng đi này của anh thực sự rất thông minh và sẽ thay đổi hoàn toàn cục diện làm VideoScribe!
