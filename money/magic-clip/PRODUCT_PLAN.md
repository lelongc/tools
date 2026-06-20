# Bản Đồ Phát Triển Sản Phẩm (Product Roadmap): Magic Clip

**Mục tiêu:** Xây dựng một Chrome Extension quản lý Clipboard siêu việt, thẩm mỹ cao (Aesthetic), nhắm tới thị trường đại chúng (Mass Market: Dân văn phòng, Sinh viên, MMO). Sản phẩm phải đủ "Wow" và đủ chuyên nghiệp để người dùng sẵn sàng rút ví trả $1/tháng hoặc $10/năm.

---

## 1. Tính Năng Cốt Lõi (Core Features) & Điểm Chạm "WOW"

Để đạt chuẩn thương mại (Professional & Salable), Magic Clip không chỉ là "chỗ lưu copy", mà phải là một **Trợ lý sao chép ma thuật**.

### 💎 Điểm WOW 1: Trải Nghiệm Bong Bóng (Glassmorphism Floating Bubble)
- **Thiết kế Kính mờ (Glassmorphism):** Giao diện bán trong suốt, đổ bóng mềm mại, nhìn như một widget của iOS/MacOS.
- **Kéo và Thả (Drag & Drop):** Rê chuột vào bong bóng để mở khay lịch sử. Nắm một đoạn văn bản/link từ khay nháp và ném vào một Nhóm (Folder) để lưu trữ.
- **Auto-inject (Dán tự động):** Khi click vào 1 mục trong bong bóng, tự động điền (paste) thẳng vào ô input bạn đang gõ thay vì phải ấn Ctrl+V.

### 💎 Điểm WOW 2: OCR Tàng Hình (Copy Ảnh ➡️ Dán Chữ)
- Tích hợp `Tesseract.js` chạy ẩn qua Web Worker.
- Khi người dùng copy 1 bức ảnh (hóa đơn, PDF, số tài khoản), bong bóng hiện nút "Phân tích chữ".
- **Không Server, Không Tốn Tiền:** Thuật toán chạy 100% bằng CPU của máy khách. Nhanh, bảo mật và miễn phí duy trì.

### 💎 Điểm WOW 3: Smart Paste (Dán Thông Minh)
- **Clean Link:** Tự động gọt bỏ rác (`?utm_source=...`) khi copy link Shopee/Tiktok.
- **Multi-Paste (Gộp khối):** Bôi đen copy 5 đoạn nhỏ lẻ ở 5 nơi, bấm nút "Gộp", hệ thống nối lại thành 1 văn bản dài để bạn dán 1 lần duy nhất.
- **Trích xuất thông minh:** Chỉ lọc lấy Email hoặc Số điện thoại từ một đống văn bản lộn xộn.

### 💎 Điểm WOW 4: Đồng Bộ Bảo Mật Tuyệt Đối (Google Drive Sync)
- **Zero-knowledge:** Extension KHÔNG có máy chủ riêng. Mọi dữ liệu được mã hóa và lưu trực tiếp vào Google Drive cá nhân của khách hàng.
- Đồng bộ mượt mà giữa máy tính ở Công ty và máy tính ở Nhà.

---

## 2. Chiến Lược Kinh Doanh (Monetization Strategy)

Mô hình **Freemium** (Dùng thử miễn phí + Bán gói Pro)

| Tính năng | Bản Free (Phễu hút khách) | Bản PRO ($1/tháng hoặc $10/năm) |
| :--- | :--- | :--- |
| **Lịch sử lưu trữ** | 30 mục gần nhất | Vô hạn (Unlimited) |
| **Gom nhóm (Folders)** | Tối đa 2 nhóm | Vô hạn |
| **Quét ảnh ra chữ (OCR)** | 3 lần/ngày | Vô hạn |
| **Smart Paste & Clean Link**| ❌ Khóa | ✅ Mở khóa hoàn toàn |
| **Đồng bộ Google Drive** | ❌ Khóa | ✅ Mở khóa hoàn toàn |
| **Tìm kiếm lịch sử cũ** | ❌ Khóa | ✅ Tìm kiếm siêu tốc |

---

## 3. Kiến Trúc Kỹ Thuật (Architecture Blueprint)

Để đạt độ "Chuyên nghiệp", code không được chắp vá mà phải có kiến trúc rõ ràng:

1. **`background/service_worker.js` (Bộ não trung tâm):**
   - Quản lý State, lắng nghe sự kiện System Copy.
   - Giao tiếp với Google Drive API (OAuth2) cho tính năng Sync.
2. **`content/bubble.js` & `UI Components` (Giao diện người dùng):**
   - Inject iframe để hoàn toàn cách ly CSS của chúng ta khỏi CSS của trang web gốc (để không bao giờ bị vỡ giao diện).
   - Xử lý logic Drag-and-drop mượt mà (60fps).
3. **`libs/tesseract_worker.js` (Phân hệ AI Offline):**
   - Load file ngôn ngữ `vie.traineddata.gz` và `eng.traineddata.gz` vào IndexedDB để cache.
   - Xử lý OCR ở luồng phụ (Offscreen/Worker) để không làm đơ trình duyệt.
4. **`storage/db.js` (Cơ sở dữ liệu):**
   - Dùng `IndexedDB` thay vì `chrome.storage.local` để lưu ảnh và lượng text lớn vĩnh viễn không bị đầy.

---

## 4. Lộ Trình Triển Khai (Roadmap 4 Giai Đoạn)

- [ ] **Giai đoạn 1: Core Engine & Bubble UI (Tuần 1)**
  - Nâng cấp giao diện Bong bóng bằng Iframe (chống vỡ CSS).
  - Hoàn thiện UI kéo thả (Drag & Drop) và cấu trúc quản lý Folder.
- [ ] **Giai đoạn 2: Tích hợp OCR & Smart Paste (Tuần 2)**
  - Gắn Tesseract.js, thêm nút "Quét ảnh" khi dữ liệu copy là file hình ảnh.
  - Thêm chức năng "Clean Link Shopee/Tiktok".
- [ ] **Giai đoạn 3: Database & Tối ưu (Tuần 3)**
  - Chuyển hệ thống lưu trữ sang IndexedDB.
  - Tích hợp tìm kiếm (Search) tốc độ cao.
- [ ] **Giai đoạn 4: Google Drive Sync & Payment (Tuần 4)**
  - Code luồng đăng nhập Google OAuth.
  - Đẩy file backup JSON lên Drive.
  - Tích hợp cổng thanh toán (Lemon Squeezy/Paddle).
