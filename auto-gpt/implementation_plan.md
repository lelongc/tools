# 📋 Hướng Dẫn Chạy & Chuẩn Bị Tạo Tài Khoản ChatGPT Tự Động (GPT Auto Register)

Tài liệu này hướng dẫn chi tiết các bước chuẩn bị và cách khởi chạy công cụ tự động đăng ký tài khoản ChatGPT miễn phí hàng loạt.

---

## 1. Các Dịch Vụ Đã Được Thiết Lập Sẵn
Hệ thống email nhận mã xác thực đã được tự động cài đặt hoàn chỉnh:
*   **Database Cloudflare D1**: Tên database `vmail` đã được tạo và khởi tạo bảng.
*   **Cloudflare Worker**: Đã deploy lên địa chỉ [https://temp-email-api.lelong190110.workers.dev](https://temp-email-api.lelong190110.workers.dev) (với mật khẩu admin: `AdminSecurePassword123`).
*   **Định tuyến Email (Email Routing)**: Toàn bộ email gửi đến `@drashop.online` sẽ được chuyển hướng trực tiếp tới Worker xử lý.
*   **File cấu hình**: File `config.yaml` đã được điền chính xác thông số email.

---

## 2. Các Bước Chuẩn Bị Trên Máy Của Bạn (Bắt buộc)

Trước khi chạy tool, bạn cần đảm bảo các điều kiện sau trên máy tính của mình:

### 2.1. Cài đặt Trình duyệt Google Chrome (Bắt buộc)
Công cụ sử dụng Selenium để điều khiển Chrome thật, do đó máy bạn bắt buộc phải cài đặt **Google Chrome**.
*   *Lưu ý*: Hãy chắc chắn rằng Chrome của bạn đã được cập nhật lên phiên bản mới nhất.

### 2.2. Kiểm tra proxy/mạng (Quan trọng khi chạy thực tế)
*   Do OpenAI kiểm duyệt IP rất gắt gao khi đăng ký, nếu bạn tạo nhiều tài khoản trên cùng một địa chỉ IP (mạng nhà), OpenAI sẽ chặn (hiển thị lỗi hoặc yêu cầu giải captcha liên tục).
*   **Khuyên dùng**: Nên sử dụng Dcom 3G/4G phát mạng và thực hiện đổi IP sau mỗi lần đăng ký thành công, hoặc cấu hình thêm Proxy trong file `config.yaml` (nếu code dự án hỗ trợ).

---

## 3. Hướng Dẫn Khởi Chạy Công Cụ

Do Windows PowerShell mặc định không hỗ trợ tốt hiển thị các emoji/ký tự Unicode đặc biệt từ Python, chúng ta cần chạy lệnh kèm theo biến môi trường thiết lập định dạng UTF-8.

### Cách 1: Chạy qua Giao diện Web (Khuyên dùng)
Giao diện Web cho phép bạn xem trực tiếp màn hình trình duyệt đang tự động đăng ký (realtime feed), theo dõi nhật ký logs và quản lý danh sách tài khoản dễ dàng.

Mở terminal tại thư mục dự án `D:\folder\tools\auto-gpt` và chạy lệnh sau:
```powershell
$env:PYTHONIOENCODING="utf-8"; $env:PYTHONUNBUFFERED="1"; uv run server.py
```

*   **Sử dụng**: Sau khi chạy lệnh, mở trình duyệt truy cập: **[http://localhost:5000](http://localhost:5000)**.
*   Nhấn nút **Start** trên giao diện để công cụ bắt đầu tự động hóa.

### Cách 2: Chạy trực tiếp qua giao diện dòng lệnh (CLI)
Nếu bạn muốn chạy trực tiếp và theo dõi logs trên màn hình terminal:

Mở terminal tại thư mục dự án `D:\folder\tools\auto-gpt` và chạy lệnh:
```powershell
$env:PYTHONIOENCODING="utf-8"; $env:PYTHONUNBUFFERED="1"; uv run main.py
```

---

## 4. Quản Lý Tài Khoản Sau Khi Đăng Ký
*   Tài khoản đăng ký thành công sẽ được tự động lưu vào file: `D:\folder\tools\auto-gpt\registered_accounts.txt` dưới định dạng:
    ```text
    email----mật_khẩu----thời_gian----trạng_thái
    ```
*   Trạng thái thông thường của tài khoản miễn phí sau khi tạo xong là `已注册` (Đã đăng ký).
