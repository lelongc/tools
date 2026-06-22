# Live Translation & Dubbing Suite

Thư mục này là nơi lưu trữ tập trung các dự án liên quan đến việc tạo phụ đề và lồng tiếng trực tiếp cho luồng âm thanh trên trình duyệt.

## Các thành phần trong bộ công cụ:

1. **[my-dub-extension](./my-dub-extension/README.md)**
   - **Vai trò:** Chrome Extension (Client) bắt âm thanh từ tab trình duyệt và gửi đi xử lý.
   - **Đặc điểm:** Hoạt động qua WebSocket để gửi dữ liệu âm thanh tới server cục bộ (Local Server) xử lý nhận diện và lồng tiếng.

2. **[live-dub-local](./live-dub-local/README.md)**
   - **Vai trò:** Máy chủ AI cục bộ (Local Server).
   - **Đặc điểm:** Viết bằng Python, dùng mô hình `faster_whisper` để nhận dạng giọng nói, Google Translator để dịch và Edge TTS để phát âm thanh tiếng Việt. Hoạt động phối hợp với `my-dub-extension`.

3. **[live-dub](./live-dub/README.md)**
   - **Vai trò:** Chrome Extension DubTab (Phiên bản nâng cao).
   - **Đặc điểm:** Hoạt động độc lập bằng cách kết nối với các dịch vụ đám mây (Cloud) như Firebase, SonicCaption. Cung cấp UI đầy đủ với lịch sử, không cần chạy Local Server.

4. **[live-cap](./live-cap/README.md)**
   - **Vai trò:** Chrome Extension tạo phụ đề trực tiếp.
   - **Đặc điểm:** Chỉ tập trung vào tạo phụ đề (Live Captions) sử dụng tốc độ xử lý nhanh của **Groq API**. Hiển thị phụ đề đè lên trực tiếp màn hình trình duyệt.
