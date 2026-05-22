# 🎬 SHORT MAKER — Tạo Video Short Dạy Tiếng Anh Viral

Tự động tạo video YouTube Shorts dạy tiếng Anh viral — từ nhập chủ đề → video hoàn chỉnh.

---

## 🚀 CÁCH DÙNG (3 Bước)

### Bước 1: Chạy Bridge ở local

Mở terminal tại `d:\folder\tools\short`:

```powershell
python bridge_local.py
```

Hệ thống sẽ:
- Tự tải + chạy **cloudflared** tunnel
- In ra **Tunnel URL** (dạng `https://xxx.trycloudflare.com`)
- Copy URL này

> Nếu muốn dùng ảnh Pexels stock thay vì ảnh AI → **bỏ qua bước này**.

### Bước 2: Mở TurboFlow trên Edge

1. Cài extension TurboFlow (thư mục `flow-image/`)
2. Mở https://labs.google/fx/tools/flow trên Edge
3. Extension tự kết nối bridge

### Bước 3: Chạy Colab

1. Upload `short_maker.ipynb` lên [Google Colab](https://colab.research.google.com)
2. Chọn **T4 GPU** runtime
3. Chạy **Cell 1** (cài đặt, 1 lần)
4. **Cell 2**: Nhập chủ đề + API keys + paste Tunnel URL
5. **Cell 3**: Nhấn chạy → Tự động:
   - Sinh kịch bản AI (Groq)
   - Tạo giọng đọc (Qwen3-TTS)
   - Tạo phụ đề sync từng từ (Whisper)
   - Tải file `prompts.txt` xuống máy tính của bạn.
   - Nhập/paste file này vào extension TurboFlow (Edge), đặt File naming là **prompt** (khuyên dùng, file được lưu theo tên prompt) hoặc **custom prefix** (Prefix là tên slug của dự án), và bấm Start.
   - Colab tự phát hiện và tải các ảnh hoàn thiện về.
   - Render video hoàn chỉnh (Playwright + FFmpeg)
6. **Cell 4**: Tải video `.mp4` về máy

---

## 📁 File cần thiết

| File | Chức năng | Chạy ở đâu |
|------|-----------|-------------|
| `short_maker.ipynb` | Notebook all-in-one | Google Colab |
| `bridge_local.py` | Cầu nối Colab ↔ TurboFlow | Local (terminal) |
| `flow-image/` | Extension TurboFlow | Edge browser |

### File tùy chọn (render local):

| File | Chức năng |
|------|-----------|
| `render_web.py` | Render video trên máy local |
| `template_v2.html` | Template hiển thị video |
| `generate_script.py` | Sinh kịch bản local |
| `config.py` + `.env` | API keys cho local |

---

## ⚙️ API Keys cần có

| Key | Lấy ở đâu | Bắt buộc |
|-----|-----------|----------|
| Groq API | https://console.groq.com/keys | ✅ Có (miễn phí) |
| Pexels API | https://www.pexels.com/api/ | Nếu không dùng TurboFlow |

> Không cần lưu vào `.env` — nhập trực tiếp trong Colab.
