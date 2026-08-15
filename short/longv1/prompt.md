# 📜 HƯỚNG DẪN QUY TRÌNH & MẪU CÂU LỆNH (PROMPT TEMPLATES)

### Tích Hợp Toàn Diện: Colab ➔ Antigravity IDE ➔ Flow Image Extension ➔ VideoScribe

Tài liệu này chuẩn hóa **100% cấu trúc dữ liệu** giữa `pending_scenes.json`, `last_analyzed_scenes.json` (theo mẫu chuẩn `template-last.json`) và `flow_prompts.txt`.

---

## 📌 PROMPT 1: PHÂN TÍCH KỊCH BẢN TỪ WHISPER ➔ `last_analyzed_scenes.json`

> **Khi nào dùng:** Sau khi bạn bấm **"📤 BƯỚC 1: Whisper Bóc Tách & Gửi Về Laptop"** trên Colab để gửi `pending_scenes.json` về máy tính.

### 📝 Câu lệnh copy vào AI IDE:

```markdown
Hãy đọc file `pending_scenes.json` và phân tích kịch bản video Whiteboard Doodle, sau đó lưu kết quả vào `last_analyzed_scenes.json` theo đúng cấu trúc chuẩn của `template-last.json`:

Yêu cầu cấu trúc JSON:
1. File đầu ra `last_analyzed_scenes.json` phải là một mảng JSON (Array) hợp lệ 100%, không chứa comment hay lỗi cú pháp.
2. Mỗi phần tử trong mảng là một cảnh (Scene Object) gồm đúng các trường sau:
   - `sentence_id` (Integer): Số thứ tự câu từ pending_scenes.json (1, 2, 3...).
   - `start` (Float): Thời gian bắt đầu (giây).
   - `end` (Float): Thời gian kết thúc (giây).
   - `speech_text` (String): Lời thoại gốc tiếng Anh từ pending_scenes.json.
   - `images` (Array): Danh sách các hình ảnh xuất hiện trong câu thoại này (1 hoặc 2 ảnh tùy độ dài câu).
     + Mỗi Object trong `images` gồm đúng 3 trường:
       * `visual_concept` (String): Mô tả ý tưởng hình ảnh trực quan bằng tiếng Việt.
       * `svg_search_prompt` (String): Từ khóa cốt lõi tiếng Anh ngắn gọn (2-4 từ, ví dụ: "smartphone pocket", "atomic clock satellite", "rolex luxury watch crown") để tìm Drive / đặt tên file.
       * `animation_style` (String): Hiệu ứng xuất hiện trong VideoScribe, chỉ được chọn một trong 3 giá trị: "draw", "movein", hoặc "fadein".

Ví dụ mẫu cấu trúc 1 cảnh chuẩn:
[
  {
    "sentence_id": 1,
    "start": 0.0,
    "end": 3.72,
    "speech_text": "You have a supercomputer in your pocket.",
    "images": [
      {
        "visual_concept": "Điện thoại thông minh công nghệ cao trong túi quần",
        "svg_search_prompt": "smartphone pocket",
        "animation_style": "draw"
      }
    ]
  }
]
```

---

## 📌 PROMPT 2: XUẤT DANH SÁCH PROMPT CHO FLOW IMAGE ➔ `flow_prompts.txt`

> **Khi nào dùng:** Sau khi AI hoàn thành Prompt 1. AI sẽ đọc `last_analyzed_scenes.json` và xuất ra file text để tiện ích TurboFlow (Flow Image) tự động tạo ảnh và tự đặt tên file chính xác.

### 📝 Câu lệnh copy vào AI IDE:

```markdown
Hãy đọc file `last_analyzed_scenes.json` và xuất ra file `flow_prompts.txt` theo đúng định dạng chuẩn:

Yêu cầu định dạng:
1. Đếm tuần tự toàn bộ các ảnh trong mảng `images` của từng cảnh từ đầu đến cuối và đánh số thứ tự 3 chữ số: `001`, `002`, `003`...
2. Mỗi ảnh là một khối gồm đúng 2 dòng:
   - Dòng 1: Tiêu đề dạng: `[001] (File: 001_slug_search_prompt.png)`
     (Ví dụ: từ khóa "smartphone pocket" -> `[001] (File: 001_smartphone_pocket.png)`)
   - Dòng 2: Câu prompt tiếng Anh chuyên sâu cho Google Flow AI theo công thức:
     "Minimalist black and white whiteboard doodle sketch of [MÔ TẢ CHI TIẾT DỰA VÀO VISUAL_CONCEPT VÀ SPEECH_TEXT], clean black ink pen outline, hollow lines, simple 2D vector icon style, pure solid white background, isolated on white, no frame, no shadows"
3. Giữa mỗi khối cách nhau đúng 1 dòng trống.

Ví dụ định dạng mẫu chuẩn:
[001] (File: 001_smartphone_pocket.png)
Minimalist black and white whiteboard doodle sketch of a glowing futuristic smartphone in a pocket, clean black ink pen outline, hollow lines, simple 2D vector icon style, pure solid white background, isolated on white, no frame, no shadows

[002] (File: 002_atomic_clock_satellite.png)
Minimalist whiteboard line art sketch of a precision atomic clock synchronizing with orbital satellites, clean black outline drawing, simple technical diagram style, pure solid white background, isolated on white, no frame, no shading
```

---

## 🚀 QUY TRÌNH VẬN HÀNH 4 BƯỚC TỰ ĐỘNG:

```
[ Colab: Bóc tách Whisper ] ➔ [ Laptop: AI Phân tích kịch bản & Xuất flow_prompts.txt ]
                             ➔ [ Google Flow + Extension: Tạo & Tải ảnh vào image-temp/ ]
                             ➔ [ Colab: 1-Click Kéo cả Kịch bản + Ảnh về đóng gói .scribe ]
```

### 1️⃣ Bước 1: Tạo Prompt Kịch Bản

- Trên Colab: Bấm **BƯỚC 1** để gửi câu thoại về máy tính.
- Trong khung chat Antigravity: Chạy **Prompt 1** ➔ rồi chạy **Prompt 2** để nhận file `flow_prompts.txt`.

### 2️⃣ Bước 2: Tạo Ảnh Tự Động Với Tiện Ích Flow Image

- Mở tab **Google Flow** (`flow.google`) trên Chrome.
- Mở bảng tiện ích **TurboFlow (Flow Image)** bên phải.
- Bấm nút **Import .txt** ➔ Chọn file `flow_prompts.txt` (hoặc dán trực tiếp nội dung).
- Tiện ích sẽ tự động tạo ảnh và tự đặt tên file chuẩn (ví dụ: `001_smartphone_pocket.png`, `002_atomic_clock_satellite.png`...).
- Lưu các file ảnh vừa tải về vào thư mục:
  📂 `d:\folder\tools\short\longv1\image-temp\`

### 3️⃣ Bước 3: Colab Kéo Kịch Bản & Ảnh Tự Động Qua Tunnel (1-Click)

- Đảm bảo terminal đang chạy: `python local_bridge.py`
- Trên giao diện Web Colab:
  - Chọn chế độ: **`🚀 1. Lấy Ảnh Google Flow từ Laptop qua Tunnel (image-temp/ ➔ Lưu Drive f/gen)`**
  - Bấm nút: **`📥 BƯỚC 2: Kéo Kịch Bản & Tải/Vẽ Ảnh (Xem Trước)`**
- 👉 **Colab sẽ tự động làm toàn bộ:**
  - Kéo file kịch bản `last_analyzed_scenes.json` về.
  - Kéo toàn bộ ảnh từ thư mục `image-temp/` trên máy tính về.
  - Tẩy trắng nền 100%, khử sạch viền đen mép ảnh và vector hóa sang SVG.
  - **Tự động lưu toàn bộ file SVG vào Google Drive thư mục `/MyDrive/image/f/gen/`** để lưu trữ lâu dài.
  - Hiển thị bảng xem trước hình ảnh trực quan từng cảnh!

### 4️⃣ Bước 4: Đóng Gói VideoScribe Hoàn Chỉnh

- Xem trước bảng ảnh, nếu ưng ý ➔ Bấm **`📦 BƯỚC 3: ĐÃ ƯNG Ý ➔ BẤM ĐÓNG GÓI & TẢI FILE SCRIBE`**.
- File `.scribe` mới (kèm âm thanh gốc chất lượng cao 44.1kHz, canvas sạch không dính cache cũ) sẽ sẵn sàng để tải về máy! 🎬
