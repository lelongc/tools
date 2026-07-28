# 🎬 SHORT MAKER — Tạo Video Short Dạy Tiếng Anh Viral

Tự động tạo video YouTube Shorts dạy tiếng Anh viral — từ nhập chủ đề → video hoàn chỉnh.

---

## 🚀 CÁCH DÙNG

Hệ thống hiện tại có 2 phiên bản làm video:
1. **Bản V1 (`short_maker.ipynb`)**: Kể chuyện tiếng Anh có kèm ảnh chuyển tiếp.
2. **Bản V2 (`short_maker_v2.ipynb`)**: Học từ vựng với lưới Grid Poster 4x4 (16 ô, highlight từ vựng).

### Bước 1: Chạy Bridge ở local (Bắt buộc cho V2)

Mở terminal tại `d:\folder\tools\short`:

```powershell
python bridge_local.py
```

Hệ thống sẽ:
- Tự tải + chạy **cloudflared** tunnel
- In ra **Tunnel URL** (dạng `https://xxx.trycloudflare.com`)
- Copy URL này

> **Lưu ý**: Bản V2 bắt buộc dùng Bridge và TurboFlow để tạo ảnh Grid, không dùng Pexels.

### Bước 2: Mở TurboFlow trên Edge

1. Cài extension TurboFlow (thư mục `flow-image/`)
2. Mở https://labs.google/fx/tools/flow trên Edge
3. Mở extension TurboFlow để kết nối vào Bridge.

### Bước 3: Chạy Colab

1. Upload notebook muốn dùng (`short_maker.ipynb` hoặc `short_maker_v2.ipynb`) và file HTML template tương ứng (như `template_grid.html` nếu là V2) lên [Google Colab](https://colab.research.google.com).
2. Tải thêm file file âm thanh `.wav` (giọng mẫu Voice Clone) lên Colab.
3. Chọn Runtime → Change runtime type → **T4 GPU**.
4. Chạy **Cell 1** (cài đặt, chạy 1 lần duy nhất).
5. **Cell 2**: Nhập thông tin cấu hình:
   - Chủ đề từ vựng (Topic)
   - Gemini API Key
   - Bridge URL (paste từ Bước 1)
   - Tên file giọng mẫu `.wav`
6. **Cell 3**: Nhấn chạy → Tự động:
   - Sinh từ vựng (Gemini)
   - Tải file `prompts.txt` xuống máy tính. Copy dòng nhắc trong file này, dán vào TurboFlow extension (để **Prefix** mode với tên topic) → bấm Start.
   - Khi có ảnh, Colab tự bắt tín hiệu, tải về.
   - Tạo giọng đọc bằng AI (Qwen3-TTS), đối với bản V2, bot sẽ đọc 2 lần một từ sau đó mới đọc câu mô tả.
   - Tạo phụ đề (Whisper).
   - Render video có hiệu ứng (Playwright + FFmpeg).
7. **Cell 4**: Tải video `.mp4` hoàn chỉnh về máy.

---

## 📁 File cần thiết

| File | Chức năng | Chạy ở đâu |
|------|-----------|-------------|
| `short_maker_v2.ipynb` | Notebook bản V2 (Vocabulary Grid) | Google Colab |
| `template_grid.html` | Template hiển thị hiệu ứng bản V2 | Upload lên Colab |
| `short_maker.ipynb` | Notebook bản V1 (Storytelling) | Google Colab |
| `bridge_local.py` | Cầu nối Colab ↔ TurboFlow | Local (terminal) |
| `flow-image/` | Extension TurboFlow | Edge browser |

## ⚙️ API Keys cần có

| Key | Lấy ở đâu | Bắt buộc |
|-----|-----------|----------|
| Gemini API | https://aistudio.google.com/app/apikey | ✅ Có (miễn phí) |
