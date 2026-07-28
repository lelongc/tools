# 🎬 ANIME SHORT VIDEO MAKER (shortv2)

Công cụ tự động tạo video **YouTube Shorts / TikTok / Reels** về **Anime Lore & Facts** (60 giây) với chất lượng cao.

---

## ⚡ Tính năng nổi bật

| Thành phần | Công nghệ / Chi tiết |
|------------|-----------------------|
| **Kịch bản (Script)** | Gemini 3.1 Flash Lite — Tự động sinh kịch bản chuẩn lore anime (150-165 từ), chia 30 scene chi tiết |
| **Ảnh (Images)** | Bing SafeSearch Strict — Tải 30 bức ảnh screenshot anime chính thức HD, lọc sạch 100% |
| **Giọng đọc (Voice)** | **Fenrir** (Gemini 3.1 Flash TTS) — Giọng nam trầm vừa, mượt mà, truyền cảm, nhịp đọc cuốn hút |
| **Phụ đề (Subtitles)** | **Chữ Vàng rực rỡ** (`#FFFF00`), Font Impact 85px, căn **CHÍNH GIỮA MÀN HÌNH**, hiển thị 1-2 từ/lần kiểu viral Shorts |
| **Video Output** | 1080x1920 (9:16 dọc) với hiệu ứng Zoom nhẹ, độ dài chuẩn 60 giây (~17-28 MB) |

---

## 🚀 HƯỚNG DẪN SỬ DỤNG

### Cách 1: Chạy tự động trên Google Colab (Qua Colab MCP Server)

Nếu bạn đã kết nối **Colab MCP**, bạn chỉ cần mở 1 Colab Notebook trống trên trình duyệt và bảo AI:
> *"Tạo video anime short chủ đề Gojo Satoru Six Eyes"*

AI sẽ tự động:
1. Tạo script `anime_short.py` trên Colab.
2. Chạy quy trình 5 bước và tự động tải video `final_short.mp4` về máy bạn!

---

### Cách 2: Chạy thủ công trên Google Colab

1. Mở notebook mới trên [Google Colab](https://colab.research.google.com).
2. Tạo 1 Cell và dán đoạn code sau:

```python
!pip install -q google-genai requests Pillow python-dotenv
!apt-get install -y -qq ffmpeg

!python anime_short.py --topic "Gojo Satoru's true power level in Jujutsu Kaisen" --api-key "GEMINI_API_KEY_CỦA_BẠN" --voice "Fenrir"

from google.colab import files
import os
if os.path.exists("/content/output/final_short.mp4"):
    files.download("/content/output/final_short.mp4")
```

---

### Cách 3: Chạy Local (Trên máy máy tính cá nhân)

```powershell
cd d:\folder\tools\short\shortv2
python anime_short.py --topic "Rimuru's hidden hero power in Tensura" --api-key "YOUR_KEY" --voice "Fenrir"
```

Video hoàn chỉnh sẽ nằm tại: `/content/output/final_short.mp4` (Colab) hoặc `./output/final_short.mp4` (Local).

---

## 🎙️ Bảng Giọng Đọc (Voice Options)

| Giọng | Đặc điểm | Phù hợp với |
|-------|----------|-------------|
| **Fenrir** *(Mặc định)* | Giọng nam trầm vừa, ấm, mượt mà, đọc cuốn | **Tốt nhất cho Anime Lore & Facts** |
| **Charon** | Giọng nam rất trầm, kịch tính, uy quyền | Video bí ẩn, đen tối |
| **Zephyr** | Giọng nam rõ ràng, thanh thoát | Video phân tích, giải thích |
| **Puck** | Giọng trẻ trung, năng động | Video hài hước, top 10 |

---

## 📁 Cấu trúc thư mục

```
shortv2/
├── anime_short.py             # File chạy chính duy nhất (Single-file pipeline)
├── generate_anime_script.py   # Module sinh kịch bản Gemini 3.1 Flash Lite
├── fetch_anime_images.py      # Module tải & crop ảnh 9:16
├── generate_tts.py            # Module tạo giọng đọc Fenrir (Gemini TTS)
├── render_video.py            # Module FFmpeg render video + phụ đề chữ vàng
├── config.py                  # Đọc Gemini API Key từ file .env
├── .env                       # Chứa gemini_api key
├── anime_short.ipynb          # Notebook dự phòng cho Google Colab
└── README.md                  # Tài liệu hướng dẫn
```

---

## 🎯 Gợi ý chủ đề Video hấp dẫn (High Views)

- `Rimuru's hidden hero power in That Time I Got Reincarnated as a Slime`
- `Gojo Satoru's true power level and Six Eyes in Jujutsu Kaisen`
- `Why Itachi Uchiha was the true hero of the Leaf Village in Naruto`
- `The secret history of the Void Century in One Piece`
- `Goku's Ultra Instinct vs Vegeta's Ultra Ego explained`
