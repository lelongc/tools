# MyDub Extension

## Tổng quan
**MyDub** là một tiện ích mở rộng trên trình duyệt (Chrome Extension) dùng để dịch và lồng tiếng trực tiếp (Real-time Live Stream Translator and Dubber).
Tiện ích này đóng vai trò là **Client**, hoạt động phối hợp với một máy chủ AI cục bộ (Local AI server) đặt trong thư mục `live-dub-local`.

## Tính năng chính
- **Tab Capture**: Bắt âm thanh từ tab đang mở trên trình duyệt.
- **Offscreen / Native Messaging**: Xử lý và gửi luồng âm thanh thời gian thực (PCM) qua WebSocket tới server local.
- **Subtitle & Dubbing**: Nhận lại phụ đề và phát âm thanh lồng tiếng tiếng Việt ngay trên trình duyệt.
