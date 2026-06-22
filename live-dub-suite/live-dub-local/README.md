# Live Dub Local Server

## Tổng quan
Đây là máy chủ AI cục bộ (Local AI Server) được viết bằng Python. Dự án này hoạt động như một backend xử lý âm thanh cho tiện ích `my-dub-extension`.

## Kiến trúc & Hoạt động
- **WebSocket Server**: Nhận luồng âm thanh `Float32Array` trực tiếp từ tiện ích mở rộng ở cổng `8765`.
- **Speech-to-Text (STT)**: Sử dụng mô hình `faster_whisper` (bản tiny) để nhận dạng giọng nói từ âm thanh gốc.
- **Translation**: Sử dụng `deep_translator` (Google Translator) để dịch phụ đề sang tiếng Việt.
- **Text-to-Speech (TTS)**: Sử dụng `edge_tts` để tạo giọng đọc AI tiếng Việt (giọng `vi-VN-HoaiMyNeural`).
- **Playback**: Sử dụng `pygame` để phát trực tiếp âm thanh đã lồng tiếng.
