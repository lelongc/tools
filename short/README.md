# 🎬 SHORT MAKER — Tạo Video Short Dạy Tiếng Anh Viral

Tự động tạo video Short (dọc 9:16) dạy tiếng Anh với giọng đọc AI, phụ đề sync từng từ, ảnh stock/AI đẹp mắt.

---

## 📁 Cấu trúc thư mục

```
short/
├── short_maker.ipynb    ← Chạy trên Google Colab (tạo kịch bản + giọng + phụ đề)
├── render_web.py        ← Chạy trên máy local (xuất video)
├── template_v2.html     ← Template hiển thị video
├── generate_script.py   ← (Tùy chọn) Chạy local để sinh kịch bản
├── bridge_local.py      ← (Tùy chọn) Cầu nối cho extension TurboFlow
├── config.py            ← Đọc API key từ .env
├── .env                 ← API keys
└── projects/            ← Thư mục chứa các dự án video
```

---

## 🚀 HƯỚNG DẪN NHANH (3 Bước)

### Bước 1: Mở Colab — Sinh kịch bản + giọng đọc + phụ đề

1. Upload file `short_maker.ipynb` lên [Google Colab](https://colab.research.google.com)
2. Chọn Runtime → Change runtime type → **T4 GPU**
3. Chạy **Bước 1** (Cài đặt — chỉ cần chạy 1 lần)
4. Ở **Bước 2**, nhập:
   - **Chủ đề** (ví dụ: `"5 ways to say thank you in English"`)
   - **Groq API key** (lấy miễn phí tại https://console.groq.com/keys)
   - Chọn giọng đọc, tốc độ nói
   - **Nhấn chạy** → Hệ thống tự động:
     - Sinh kịch bản AI (Groq/Llama 3)
     - Tạo giọng đọc AI (Qwen3-TTS)
     - Tạo phụ đề chính xác từng từ (Whisper)
5. Chạy **Bước 3** → Tải file ZIP về máy

### Bước 2: (Tùy chọn) Tạo ảnh AI bằng TurboFlow

1. Cài extension TurboFlow trên Edge (thư mục `flow-image/`)
2. Mở https://labs.google/fx/tools/flow
3. Nhập prompt ảnh → Extension tự tải ảnh về `D:\download\win\turboflow`
4. Khi chạy render, hệ thống **tự động import** ảnh từ thư mục này

> **Nếu không dùng TurboFlow**: Hệ thống sẽ tự tải ảnh stock từ Pexels (miễn phí).

### Bước 3: Render video trên máy local

```powershell
# Giải nén ZIP vào thư mục projects/
# Ví dụ: short/projects/5_ways_to_say_thank_you_in_english/

cd d:\folder\tools\short
python render_web.py 5_ways_to_say_thank_you_in_english
```

Video thành phẩm: `projects/<tên_dự_án>/output_web.mp4`

---

## ⚙️ CẤU HÌNH .env

Tạo file `.env` trong thư mục `short/`:

```env
pexel_api=YOUR_PEXELS_KEY
gemini_api=YOUR_GEMINI_KEY
```

| Key | Mô tả | Lấy ở đâu |
|-----|--------|------------|
| `pexel_api` | Tải ảnh stock tự động | https://www.pexels.com/api/ |
| `gemini_api` | Align phụ đề từng từ (fallback) | https://aistudio.google.com/apikey |

> **Groq API key** chỉ cần nhập trực tiếp trong Colab, không cần lưu vào .env.

---

## 💡 MẸO TỐI ƯU

- **Thay ảnh thủ công**: Thả file `.jpg` vào `projects/<tên>/images/` với tên trùng keyword (vd: `tired.jpg`)
- **Ảnh AI đẹp hơn**: Dùng TurboFlow extension gen ảnh rồi render
- **Tùy chỉnh tiêu đề**: Sửa `"title"` trong `keywords.json`
- **Chạy lại render nhanh**: Nếu đã có `word_timestamps.json` và ảnh, lần render sau sẽ bỏ qua các bước tải
