# Cẩm Nang Xuất Bản Tiện Ích Lên Chrome Web Store & Cấu Hình Web

Tài liệu này tổng hợp toàn bộ các bước thực chiến để đưa tiện ích NeoClip lên Cửa hàng Chrome trực tuyến (Chrome Web Store) thành công 100%, vượt qua mọi vòng kiểm duyệt gắt gao của Google.

---

## PHẦN 1: ĐÓNG GÓI TIỆN ÍCH (BUILD)

Mã nguồn bạn đang code là bản chưa nén. Để nộp cho Google, bạn phải đóng gói nó:
1. Mở Terminal tại thư mục `magic-clip`.
2. Chạy lệnh: `node build.js`
3. Script sẽ tự động gom các file cần thiết (bao gồm cả thư mục `popup`), làm rối mã nguồn (obfuscate) và tạo ra file **`neoclip-release.zip`**.

> [!WARNING] Lỗi "Status code: 15"
> Tuyệt đối KHÔNG tự cài đặt file `.zip` này vào Chrome ở chế độ "Load unpacked" trên máy cá nhân để test. Nếu bạn làm vậy, Chrome sẽ báo lỗi `Service worker registration failed. Status code: 15`. File `.zip` này ĐÃ MÃ HÓA, chỉ được dùng với 1 mục đích duy nhất là Nộp Lên Cửa Hàng (Web Store).

---

## PHẦN 2: KHAI BÁO THÔNG TIN CỬA HÀNG (STORE LISTING)

Truy cập [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/), tạo mục mới và tải file `neoclip-release.zip` lên. 

Ở tab **Trang thông tin trên Cửa hàng Play**, điền chính xác như sau:
* **Mô tả (Description):** (Copy tiếng Anh để tối ưu SEO)
  > NeoClip is the ultimate smart clipboard manager for your browser. Never lose a copied link, text, or image again. 
  > Whether you are a researcher, developer, designer, or student, NeoClip automatically tracks your clipboard history directly in your browser without requiring any heavy desktop software. 
  > 
  > Key Features:
  > 🚀 Infinite History: Automatically save everything you copy (text, links, and images).
  > 🔍 Smart Filters & Search: Instantly find items you copied days ago.
  > 📁 Custom Collections: Organize your snippets into folders for easy access.
  > 🖼️ Image Text Extraction (OCR): Click any copied image to extract text from it or search it via Google Lens.
  > ☁️ Private Cloud Sync: Back up your clipboard securely using your own Google Drive.
  > ⚡ Lightning Fast: Use keyboard shortcuts (Alt+V) to open your clipboard anywhere.
  > 
  > Your privacy is our priority. NeoClip stores your data locally and only syncs it to your personal Google Drive if you enable the Pro sync feature. We do not have servers and cannot see your copied data.
  > 
  > Install for free today and level up your productivity!

* **Loại (Category):** Chọn `Năng suất` (Productivity) -> `Công cụ` (Tools).
* **Ngôn ngữ (Language):** `English (United States)`
* **Nội dung đồ họa:** 
  * Biểu tượng (128x128): Tải file `icon-128.png`.
  * Ảnh chụp màn hình (1280x800): Chụp ảnh màn hình và pad chuẩn tỷ lệ, không được có kênh nền trong suốt (Alpha). Lưu dưới dạng JPEG.
  * Ô quảng cáo nhỏ & Marquee: Tải các file đã được thiết kế chuẩn kích thước.
* **Các URL:** 
  * URL Chính thức / URL Trang chủ / URL Hỗ trợ: Tất cả đều điền `https://neoclip-app.me/`. (Không dùng mailto: cho URL hỗ trợ).

---

## PHẦN 3: GIẢI TRÌNH QUYỀN RIÊNG TƯ (PRIVACY PRACTICES)

Chuyển sang tab **Quyền riêng tư**. Đây là khâu quan trọng nhất để không bị từ chối.

1. **Mục đích sử dụng (Single Purpose):**
   > NeoClip is a smart clipboard manager that allows users to save, organize, and search their copied text, links, and images locally, with optional Google Drive sync.

2. **Lý do yêu cầu quyền (Permissions):**
   * `activeTab`: Required to detect when the user is on an active webpage to format copied content efficiently without heavy background processes.
   * `alarms`: Required to run a background timer to automatically backup the user's clipboard history to their Google Drive.
   * `clipboardRead`: Required to read the text and images that the user copies so it can be saved to their clipboard history.
   * `clipboardWrite`: Required to write the user's saved items back into the system clipboard when they click the "Copy" button.
   * `identity`: Required to authenticate the user securely via Google OAuth to enable the Google Drive Sync feature.
   * `offscreen`: Required to process image blobs and OCR data in the background without interrupting the user's active browsing session.
   * `storage`: Required to store user preferences and their clipboard history items locally so they persist across browser sessions.
   * `Quyền từ phía máy chủ (<all_urls>)`: Required to inject the floating clipboard UI and capture 'copy' events on any webpage the user visits so the extension functions globally.

3. **Mã từ xa (Remote Code):** Chọn **Không, tôi không sử dụng mã từ xa**.

4. **Sử dụng dữ liệu (Data Usage):**
   * Tích chọn 3 ô: `Thông tin xác thực`, `Hoạt động của người dùng`, `Nội dung trang web`.
   * Tích chọn CẢ 3 ô vuông cam kết (không bán dữ liệu, v.v...).

5. **Chính sách Quyền riêng tư:** Điền `https://neoclip-app.me/privacy.html`

> [!NOTE] Cảnh báo Đánh giá chuyên sâu (In-depth review)
> Khi lưu, Google sẽ hiện cảnh báo: "Quá trình xuất bản sẽ bị chậm trễ do yêu cầu một loạt quyền từ phía máy chủ". Đây là việc hết sức bình thường đối với các app xin quyền `<all_urls>`. App sẽ được đưa vào hàng đợi để người thật kiểm duyệt thủ công (thường mất 2 - 7 ngày). Cứ tự tin bấm **Gửi để xem xét**.

---

## PHẦN 4: CẤU HÌNH CLOUD SAU KHI NỘP (RẤT QUAN TRỌNG)

Khi trạng thái chuyển thành **Đang chờ xem xét**, App của bạn sẽ được cấp một **ID vĩnh viễn** (Ví dụ: `ijegbgpdkmonepejbcocheciieeojbal`).

### 1. Sửa lỗi đăng nhập Google Drive (Redirect URI)
Để tính năng Google Drive Sync hoạt động trên bản chính thức, bạn phải báo cho Google biết cái ID này:
1. Vào Google Cloud Console > APIs & Services > Credentials.
2. Mở Web Application Client ID của bạn.
3. Thêm URL này vào mục **Authorized redirect URIs**: 
   `https://[ID-CỦA-BẠN].chromiumapp.org/`
   *(Ví dụ: `https://ijegbgpdkmonepejbcocheciieeojbal.chromiumapp.org/`)*
4. Bấm Save. (Lưu ý: Không cần sửa code ở Client, `sync.js` sẽ tự động lấy ID này).

### 2. Sửa lỗi `Upload to Drive failed`
1. Vào Google Cloud Console, ô tìm kiếm gõ **Google Drive API**.
2. Chọn kết quả và bấm nút **Enable (Bật)**.
3. Nếu không bật cái này, API sẽ từ chối mọi nỗ lực upload file JSON backup của extension.
