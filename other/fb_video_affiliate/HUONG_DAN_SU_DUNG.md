# Hướng Dẫn Sử Dụng: ReelsAffiliate AI Hub ⚡
**Đăng Reels Facebook Tự Động & Bán Hàng Shopee Affiliate với Gemini 3.5 Flash-Lite**

---

## 🎯 1. Giới Thiệu
Dự án được thiết kế chuyên biệt để giải quyết bài toán:
- Tự động hóa sản xuất nội dung video ngắn (Facebook Reels, TikTok).
- Nộp kịch bản và video vào **Google Gemini 3.5 Flash-Lite** (hoặc **Gemini 3.1 Flash Lite**):
  - Tự động giật tít (Hook 3s đầu giữ chân người xem).
  - Tự động viết Caption chuẩn chính sách y tế Meta (tránh từ cấm).
  - Tự động sinh bộ thẻ Hashtags chuẩn SEO thuật toán.
  - **Tự động quét "Kho Sản Phẩm Shopee" để chọn 3 - 5 link phù hợp nhất**.
  - Soạn thảo sẵn **Bình luận ghim (First Comment)** kêu gọi mua hàng tự nhiên.
- **Tự động đăng Video lên Facebook Reels & tự động thả Comment chứa link Shopee**.
- **Tự động lưu kịch bản vào Kho Lịch Sử** để sau này tái sử dụng đa nền tảng.

---

## 🚀 2. Cách Khởi Động Công Cụ

Có 2 cách đơn giản:

### Cách 1: Click Đúp Chuột
- Click đúp vào file [`run.bat`](file:///d:/folder/tools/other/fb_video_affiliate/run.bat).
- Trình duyệt sẽ tự động mở địa chỉ: `http://127.0.0.1:8000`.

### Cách 2: Chạy Bằng Lệnh Terminal
Mở terminal/powershell tại thư mục này và chạy:
```powershell
python app.py
```
Sau đó truy cập trình duyệt: `http://localhost:8000`.

---

## 🛠️ 3. Quy Trình 4 Bước Đăng Video & Bán Hàng Shopee

### Bước 1: Chọn Kênh & Nạp Kịch Bản
- Tại tab **Studio Tạo Bài Đăng**:
  - Chọn kênh: *🌿 Kênh Sức Khỏe & Chăm Sóc Đời Sống*.
  - Kéo thả file video MP4 của bạn (từ `D:\fb\bán hàng` hoặc bất kỳ đâu).
  - Nhập kịch bản thoại (bạn có thể bấm nút **"⚡ Nạp Kịch Bản Mẫu Tắm Đêm (30s)"** để test ngay).

### Bước 2: Bấm Nút Phân Tích AI
- Bấm nút **"⚡ Gemini Flash: Phân Tích & Khớp 5 Link Shopee"**.
- Chỉ sau **1 - 2 giây**, Gemini sẽ:
  - Sinh Tiêu đề giật tít, Caption, Hashtags.
  - Tự lục trong kho và chọn 4 - 5 món đồ liên quan nhất (*Đèn sưởi, Tinh dầu tràm, Máy sấy tóc ion, Máy đo huyết áp*).
  - Soạn sẵn đoạn bình luận ghim mượt mà.

### Bước 3: Kiểm Tra & Chỉnh Sửa
- Bạn có thể sửa nhanh Tiêu đề, Caption hoặc bình luận nếu muốn.
- Nếu chủ đề mới mà trong kho chưa có, AI sẽ hiện bảng cảnh báo: *"Gợi ý bổ sung sản phẩm mới vào kho"* kèm từ khóa tìm kiếm trên Shopee.

### Bước 4: Đăng Lên Facebook
- Bấm nút **"🚀 ĐĂNG LÊN FACEBOOK REELS & GHIM LINK SHOPEE"**.
- Hệ thống sẽ đẩy video lên Reels và tự động thả bình luận Shopee ngay dưới video.
- Bài viết và kịch bản lập tức được lưu vào **Tab 3: Kho Kịch Bản & Lịch Sử**.

---

## 🛒 4. Quản Lý "Kho Link Shopee" (Tab 2)
- Mỗi link Shopee rút gọn (`https://s.shopee.vn/...`) bạn chỉ cần lấy 1 lần.
- Đã nạp sẵn **7 sản phẩm sức khỏe mẫu bán chạy nhất** cho các chủ đề: *Tắm đêm, huyết áp, cảm lạnh, xương khớp, mất ngủ*.
- Bạn có thể bấm **"➕ Thêm Sản Phẩm Mới"** bất cứ lúc nào. Càng có nhiều sản phẩm, AI càng tự động hóa thông minh!

---

## ⚙️ 5. Cấu Hình Facebook Thật (Khi Bạn Sẵn Sàng)
Mặc định hệ thống đang bật **Chế Độ Mô Phỏng (Test Mode)** để bạn thoải mái bấm thử nghiệm mà không cần token Facebook.

Khi bạn muốn đăng trực tiếp lên Fanpage Facebook thật:
1. Vào tab **⚙️ Cài Đặt**.
2. Tắt công tắc **"Chế Độ Mô Phỏng"**.
3. Điền **Page ID** của Fanpage.
4. Điền **Page Access Token vĩnh viễn** của Page (Token có quyền `publish_video`, `pages_manage_posts`).
5. Bấm **"💾 Lưu Cấu Hình"**.
