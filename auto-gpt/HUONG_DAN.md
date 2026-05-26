# Hướng Dẫn Chạy Dự Án Auto-GPT ChatGPT Register

Dự án này hỗ trợ tự động hóa đăng ký tài khoản ChatGPT miễn phí bằng trình duyệt tự động (Undetected ChromeDriver) kết hợp với hòm thư tạm Cloudflare Temp Email.

## 📋 Yêu Cầu Hệ Thống

1. **Python**: Khuyên dùng phiên bản từ 3.10 trở lên.
2. **Trình duyệt Google Chrome**: Đã cài đặt trên máy.
3. **uv**: Công cụ quản lý package Python cực nhanh (thay thế cho pip).
   - Cách cài đặt `uv` nhanh:
     ```powershell
     pip install uv
     ```

## ⚙️ Cấu Hình (config.yaml)

Trước khi chạy, hãy đảm bảo bạn đã tạo file `config.yaml` dựa trên `config.example.yaml` và chỉnh sửa các thông số sau:

- `worker_url`: Đường dẫn API của Cloudflare Temp Email Worker của bạn (ví dụ: `https://temp-email-api.lelong190110.workers.dev`).
- `domain`: Tên miền của bạn liên kết với Cloudflare Temp Email (ví dụ: `drashop.online`).
- `admin_password`: Mật khẩu bảo mật quản trị viên cấu hình trong Cloudflare Worker.

## 🚀 Cách Chạy Dự Án

Chúng ta có hai chế độ chạy: qua giao diện Web thân thiện hoặc qua giao diện Terminal (dòng lệnh).

### Cách 1: Chạy qua giao diện Web (Khuyên dùng)

1. Mở cửa sổ terminal/powershell tại thư mục `auto-gpt` và chạy lệnh sau:
   ```powershell
   uv run server.py
   ```
2. Sau khi server khởi động thành công, hãy truy cập vào địa chỉ sau trên trình duyệt của bạn:
   ```
   http://localhost:5000
   ```
3. Tại giao diện Web:
   - Nhập số lượng tài khoản muốn đăng ký.
   - Nhấn **Start** để bắt đầu chạy tự động.
   - Bạn có thể xem trực tiếp màn hình trình duyệt đang tự động hoạt động thông qua luồng phát trực tiếp (Live Stream) trên trang web và theo dõi log hành động ở thời gian thực.

### Cách 2: Chạy trực tiếp qua dòng lệnh (Batch Register)

1. Mở file `config.yaml`, sửa `total_accounts` dưới mục `registration` thành số lượng tài khoản bạn muốn đăng ký.
2. Chạy lệnh:
   ```powershell
   uv run main.py
   ```
3. Trình duyệt Chrome sẽ tự động mở lên và thực hiện toàn bộ quy trình đăng ký.

## 🛠️ Luồng Hoạt Động Tự Động

1. **Khởi tạo hòm thư tạm**: Gọi Cloudflare Temp Email API tạo hòm thư ngẫu nhiên.
2. **Khởi động Trình duyệt**: Mở trình duyệt giả lập hành vi người dùng thật để vượt Cloudflare.
3. **Điền thông tin đăng ký**: Nhập email tạm vào ChatGPT.
4. **Nhận OTP**: Hệ thống liên tục quét hòm thư để lấy mã OTP, tự động dọn dẹp các mã OTP cũ của các lượt đăng ký trước.
5. **Điền OTP**: Điền mã xác minh 6 số vào trang web.
6. **Đặt mật khẩu & Tên tuổi**: Điền mật khẩu ngẫu nhiên an toàn và điền tên tuổi ngẫu nhiên.
7. **Đăng ký Plus Trial & Hủy gia hạn** (Tùy chọn cấu hình trong code).
8. **Lưu kết quả**: Tài khoản đăng ký thành công sẽ lưu tại file `registered_accounts.txt` theo định dạng `Email----Password----Thời gian----Trạng thái`.
