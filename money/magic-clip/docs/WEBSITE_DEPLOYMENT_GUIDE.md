# Hướng Dẫn Triển Khai Website & Tên Miền (Cho Extension)

Tài liệu này ghi chú lại toàn bộ quy trình từ A-Z để thiết lập một trang Landing Page chuyên nghiệp, tốc độ cao và bảo mật tuyệt đối cho một Extension mới (hoặc bất kỳ dự án nào) sử dụng GitHub Pages và Cloudflare. Chi phí: **$0**.

---

## 1. Mua tên miền miễn phí (Namecheap)
Nếu bạn có tài khoản GitHub Education (Student Developer Pack):
1. Truy cập Namecheap (hoặc nc.me).
2. Tìm và đăng ký một tên miền `.me` miễn phí 1 năm.
3. Thanh toán với giá $0. Tên miền sẽ xuất hiện trong bảng điều khiển Namecheap.

## 2. Thiết lập Cloudflare (Quản lý DNS & Bảo mật)
Thay vì dùng Namecheap quản lý DNS (chậm và ít tính năng), chúng ta dùng Cloudflare làm cầu nối.

### Bước 2.1: Thêm Website vào Cloudflare
1. Đăng nhập [Cloudflare](https://dash.cloudflare.com/), bấm **Add a Site**.
2. Nhập tên miền (vd: `neoclip-app.me`).
3. Chọn gói **Free ($0)**.
4. Cloudflare sẽ quét các bản ghi DNS cũ (có thể giữ hoặc xóa các bản ghi MX/TXT liên quan đến email rác).
5. Cloudflare sẽ cấp cho bạn 2 cái **Nameservers** (vd: `galilea.ns.cloudflare.com` và `skip.ns.cloudflare.com`).

### Bước 2.2: Trỏ Nameservers từ Namecheap sang Cloudflare
1. Đăng nhập Namecheap, vào **Domain List** > **Manage** tên miền vừa mua.
2. Tại mục **Nameservers**, chọn **Custom DNS**.
3. Dán 2 cái Nameservers của Cloudflare vào.
4. Bấm dấu tick xanh 🟢 để lưu. Chờ 10-30 phút để mạng internet toàn cầu cập nhật. Trạng thái trên Cloudflare sẽ chuyển từ `Pending` sang `Active`.

---

## 3. Lưu trữ Web tĩnh trên GitHub Pages
GitHub Pages là nơi lý tưởng để lưu trữ trang web tĩnh (HTML/CSS/JS) hoàn toàn miễn phí.

### Bước 3.1: Tạo kho chứa (Repository)
1. Tạo (hoặc tận dụng) một Public Repository trên GitHub (vd: `lelongc/neoclip`).
2. Tải toàn bộ source code của thư mục `website` lên nhánh `main` của kho chứa này.

*Lưu ý: Để code web nằm gọn gàng, chúng ta đã tách hẳn web ra khỏi source code của extension (magic-clip), chỉ dùng repo `neoclip` cũ để chứa web.*

### Bước 3.2: Kích hoạt GitHub Pages
1. Vào mục **Settings** của kho chứa trên GitHub > chọn **Pages**.
2. Tại phần **Build and deployment**: 
   - Source: `Deploy from a branch`
   - Branch: `main` > `/(root)` > **Save**.
3. Tại phần **Custom domain**, nhập tên miền của bạn (vd: `neoclip-app.me`) > **Save**.
   *(Lưu ý: Nếu bị báo lỗi Domain already taken, hãy sang các kho cũ gỡ tên miền đó ra trước).*

### Bước 3.3: Trỏ DNS từ Cloudflare về GitHub
Tại mục **DNS** của Cloudflare, đảm bảo có các bản ghi sau (đám mây bật màu Cam - Proxied):
- 4 bản ghi `A` trỏ về IP của GitHub:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- 1 bản ghi `CNAME` cho `www` trỏ về `tên-miền-của-bạn` (vd: `neoclip-app.me` hoặc `lelongc.github.io`).

---

## 4. Tối ưu Bảo Mật & Tốc Độ (Cloudflare)
Đây là các cấu hình "Trùm cuối" để web tải siêu tốc và chống hacker:

1. **Security > Settings**: 
   - `Security Level`: **Medium** *(Tuyệt đối không dùng "I'm under attack mode" vì sẽ chặn cả khách hàng thật).*
2. **Security > Bots**:
   - `Bot Fight Mode`: **BẬT** (Chặn bot rác cào dữ liệu).
3. **SSL/TLS > Edge Certificates**:
   - `Always Use HTTPS`: **BẬT** (Bắt buộc dùng ổ khóa xanh).
   - `Automatic HTTPS Rewrites`: **BẬT**.
4. **Speed > Optimization > Content Optimization**:
   - `Brotli`: **BẬT** (Nén siêu tốc).
   - `Auto Minify`: Tích chọn **HTML, CSS, JS** (Thu gọn code).
5. **Scrape Shield**:
   - `Email Address Obfuscation`: **BẬT** (Chống bot quét trộm email).
   - `Hotlink Protection`: **BẬT** (Ngăn web khác xài chùa băng thông ảnh).

---

## 5. Quy trình Cập nhật Website Nhanh
Để không phải upload thủ công mỗi lần sửa giao diện web, một Script tự động đã được tạo sẵn: `deploy_website.ps1`.

**Cách dùng:**
1. Sửa code trong thư mục `d:\folder\tools\money\magic-clip\website`.
2. Mở Terminal (PowerShell), chạy file script:
   ```powershell
   .\deploy_website.ps1
   ```
3. Script sẽ tự động: clone kho `neoclip` tạm, chép đè file mới, commit và push lên GitHub. GitHub Pages sẽ tự build lại web trong vòng vài phút.
