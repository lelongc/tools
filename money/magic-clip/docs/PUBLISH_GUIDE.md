# Hướng Dẫn Đóng Gói Và Phát Hành NeoClip Lên Production 🚀

Tài liệu này hướng dẫn chi tiết từng bước từ khâu đóng gói mã nguồn, cấu hình API Production, phát hành tiện ích lên Chrome Web Store / Edge Add-ons, cho đến việc deploy website bán hàng và thiết lập cổng thanh toán Lemon Squeezy chính thức.

---

## MỤC LỤC
1. [Đóng gói Tiện ích mở rộng (Packaging)](#1-đóng-gói-tiện-ích-mở-rộng-packaging)
2. [Cấu hình Google Cloud Console (OAuth Client ID cho Production)](#2-cấu-hình-google-cloud-console-oauth-client-id-cho-production)
3. [Phát hành lên Chrome Web Store](#3-phát-hành-lên-chrome-web-store)
4. [Phát hành lên Microsoft Edge Add-ons](#4-phát-hành-lên-microsoft-edge-add-ons)
5. [Deploy Website bán hàng lên Vercel / GitHub Pages](#5-deploy-website-bán-hàng-lên-vercel--github-pages)
6. [Cấu hình cổng thanh toán Lemon Squeezy (Production Mode)](#6-cấu-hình-cổng-thanh-toán-lemon-squeezy-production-mode)

---

## 1. Đóng gói Tiện ích mở rộng (Packaging)

Trước khi tải mã nguồn lên các chợ ứng dụng, bạn bắt buộc phải nén và mã hóa (obfuscate/minify) mã nguồn để bảo mật logic bản quyền và giảm dung lượng tải.

### Các bước thực hiện:
1. Mở terminal tại thư mục gốc của dự án (`d:/folder/tools/money/magic-clip`).
2. Chạy lệnh đóng gói:
   ```bash
   node build.js
   ```
3. **Cơ chế hoạt động của `build.js`:**
   * Dọn dẹp thư mục tạm `.build` cũ nếu có.
   * Sao chép toàn bộ thư mục cần thiết (`background`, `content`, `icons`, `lens`, `libs`, `popup`, `manifest.json`).
   * Sử dụng thư viện `Terser` để **Minify** (thu gọn code, xóa comment, xóa lệnh console.log) và **Mangle** (làm rối tên biến cục bộ) đối với tất cả các file JavaScript để tránh bị xem trộm và bẻ khóa mã nguồn (cracking).
   * Chạy lệnh PowerShell `Compress-Archive` để nén thư mục `.build` thành tệp tin **`neoclip-release.zip`**.
   * Xóa thư mục tạm `.build`.
4. **Kết quả:** File zip đóng gói cuối cùng sẽ nằm tại đường dẫn: [neoclip-release.zip](file:///d:/folder/tools/money/magic-clip/neoclip-release.zip). Đây là file duy nhất bạn sẽ dùng để upload lên Chrome Web Store và Edge Add-ons.

---

## 2. Cấu hình Google Cloud Console (Thiết lập Đăng nhập & Đồng bộ)

Tính năng đồng bộ đám mây (Cloud Sync) yêu cầu kết nối với tài khoản Google Drive của người dùng thông qua Google OAuth 2.0. Giao diện Google Cloud Console hiện tại đã được cập nhật.

### Bước 1: Tạo Thông tin xác thực (Credentials)
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/) và tạo một dự án mới (ví dụ `NeoClip`).
2. Đi đến mục **APIs & Services** -> **Credentials**.
3. Bấm **Create Credentials** -> Chọn **OAuth client ID**.
4. Chọn loại ứng dụng là **Web application**.
5. Đặt tên là `NeoClip Production`.
6. Tại mục **Authorized redirect URIs**, lấy URL của extension trên máy của bạn (chạy `chrome.identity.getRedirectURL()` trong Console, ví dụ: `https://<extension-id>.chromiumapp.org/`).
7. Dán link này vào, bấm **Create** và copy dãy **Client ID** được sinh ra.

### Bước 2: Cấu hình Màn hình xin quyền (OAuth Consent Screen) - Data Access
1. Chuyển sang tab **Data Access**.
2. Thêm quyền (Scope) vào mục **Non-sensitive scopes**: Chọn `.../auth/drive.appdata`.
3. *(Quyền này cho phép ứng dụng chỉ tạo, xem và xóa dữ liệu cấu hình của riêng nó trong một thư mục ẩn trên Google Drive, không đụng chạm đến các file cá nhân khác của người dùng).*

### Bước 3: Cấu hình Thương hiệu (Branding)
1. Chuyển sang tab **Branding**.
2. Điền **App name**: NeoClip.
3. Điền **User support email**: lelong190110@gmail.com.
4. Khai báo 3 đường link chính sách (đã được lưu trữ trên Vercel):
   * **Application home page**: `https://neoclip.vercel.app/`
   * **Application privacy policy link**: `https://neoclip.vercel.app/privacy.html`
   * **Application terms of service link**: `https://neoclip.vercel.app/terms.html`
5. Tại mục **Authorized domains**, thêm chính xác tên miền: `neoclip.vercel.app`.

### Bước 4: Xác minh Tên miền (Domain Verification)
Hệ thống có thể báo lỗi "Not registered to you" do chưa nhận diện được chủ sở hữu tên miền Vercel. Bạn cần:
1. Mở **Google Search Console** bằng tài khoản lelong190110@gmail.com.
2. Thêm tài sản mới bằng phương pháp **Tiền tố URL (URL prefix)** với link `https://neoclip.vercel.app/`.
3. Chọn phương pháp xác minh bằng **Thẻ HTML (HTML tag)**.
4. Copy đoạn mã `<meta name="google-site-verification" content="..." />`.
5. Dán đoạn mã này vào thẻ `<head>` trong file code `index.html` của website NeoClip và Deploy bản cập nhật lên Vercel.
6. Quay lại Search Console bấm **Xác minh thành công**.
7. Trở lại Google Cloud Console (mục Verification Center), chọn **I have fixed the issues** và gửi yêu cầu xác minh lại để hoàn tất.

### Bước 5: Thêm người dùng thử nghiệm (Test Users)
Trong thời gian ứng dụng đang ở trạng thái **Testing** (chưa được Google phê duyệt chính thức), chỉ những email được bạn cấp quyền mới có thể đăng nhập Google Drive thông qua extension:
1. Tại trang **OAuth consent screen**, kéo xuống tìm mục **Test users** (hoặc chuyển sang tab **Audience** tùy phiên bản giao diện).
2. Bấm nút **+ Add Users**.
3. Nhập chính xác các địa chỉ email của những người sẽ tham gia test extension (ví dụ: email cá nhân của bạn, email tester).
4. Bấm **Save** để lưu lại.
*(Lưu ý: Bạn có thể thêm tối đa 100 test users. Khi cài đặt extension, những người dùng này có thể sẽ thấy màn hình cảnh báo "Google hasn’t verified this app" - đây là điều bình thường, họ chỉ cần bấm **Continue/Advanced** để tiếp tục).*

### Bước 6: Dán Client ID vào Code
1. Mở file [sync.js](file:///d:/folder/tools/money/magic-clip/background/sync.js) trong dự án.
2. Tìm biến `CLIENT_ID` ở dòng số 6 và thay bằng Client ID Production của bạn:
   ```javascript
   const CLIENT_ID = 'Dãy_Client_ID_Production_Của_Bạn_Tại_Đây';
   ```
3. Sau khi cập nhật, hãy chạy lại lệnh đóng gói `node build.js` để tệp ZIP nhận ID mới này.

---

## 3. Phát hành lên Chrome Web Store

### Bước 1: Khai báo Hồ sơ Nhà xuất bản (Publisher Profile)
Mục tiêu của phần này là đăng ký danh tính để được phép thu tiền người dùng hợp pháp.
1. Truy cập [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole/).
2. Đăng nhập bằng tài khoản Google của bạn và thanh toán $5 phí đăng ký (nếu chưa có).
3. Điền **Tên hiển thị của nhà xuất bản** (Long Lê hoặc NeoClip).
4. Thêm **Địa chỉ email liên hệ** (lelong190110@gmail.com).
5. Tại mục Khai báo tình trạng thương mại, tích chọn **"Đây là tài khoản thương mại"** (bắt buộc đối với extension có thu phí).
6. Tích chọn ô đồng ý tuân thủ các quy tắc của trang web.

### Bước 2: Xác minh Hồ sơ Thanh toán (Google Pay)
1. Bấm vào đường link **Quản lý** hoặc **Hồ sơ thanh toán trên Google** tại mục Xác minh tài khoản.
2. Thiết lập tên trùng khớp 100% với tên trên Căn cước công dân.
3. Điền chính xác địa chỉ theo đúng giấy tờ chứng minh: *Đội 1, Thôn Thượng, An Vĩ, Khoái Châu, Hưng Yên* (Mã bưu chính: 170000).
4. Tải lên ảnh chụp mặt trước và mặt sau của Thẻ Căn cước (để xác minh danh tính).
5. Tải lên file PDF **Sao kê ngân hàng điện tử MBBank** (để xác minh địa chỉ).

### Bước 2: Tạo Item mới và Upload
1. Bấm nút **Add new item** (Thêm mục mới).
2. Kéo thả tệp [neoclip-release.zip](file:///d:/folder/tools/money/magic-clip/neoclip-release.zip) vào ô tải lên.

### Bước 3: Điền thông tin Store Listing
1. **Description (Mô tả):** Mô tả chi tiết các tính năng chính của NeoClip (Lịch sử clipboard, bộ sưu tập, đồng bộ Google Drive, lấy chữ từ ảnh).
2. **Icons:** Tải lên tệp icon kích thước `128x128` pixel.
3. **Screenshots:** Tải lên tối thiểu 1 ảnh chụp màn hình kích thước chuẩn `1280x800` hoặc `640x400` pixel.
4. **Promo tiles:** Chuẩn bị ảnh quảng bá kích thước `440x280` pixel.

### Bước 4: Khai báo Quyền riêng tư (Privacy & Permissions Justification)
Trình duyệt sẽ yêu cầu giải trình lý do sử dụng các quyền trong `manifest.json`. Dưới đây là nội dung mẫu để bạn điền nhằm giúp kiểm duyệt nhanh hơn:
* `storage`: "Used to store extension settings and dark/light mode preferences locally."
* `clipboardRead`: "Required to capture clipboard content when the user performs a copy operation inside the browser."
* `clipboardWrite`: "Required to restore saved text/images back to the system clipboard when the user clicks the copy button."
* `identity`: "Used to securely authenticate the user's Google Account to access their private Google Drive AppData folder."
* `offscreen`: "Required to create an offscreen document to monitor clipboard copy events in the background without stealing window focus."
* `alarms`: "Used to trigger periodic background sync intervals to backup clipboard data to Google Drive."
* `activeTab`: "Required to inject user interface helper bubbles and panel elements into the currently active tab."

Bấm **Submit for review** để gửi đi. Thời gian kiểm duyệt thông thường từ **24h đến 72h**.

---

## 4. Phát hành lên Microsoft Edge Add-ons

Microsoft Edge sử dụng cùng mã nguồn nhân Chromium nên bạn có thể sử dụng nguyên bản tệp ZIP của Chrome.

### Các bước thực hiện:
1. Truy cập [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/microsoftedge).
2. Đăng ký tài khoản nhà phát triển Edge (Hoàn toàn **Miễn phí**).
3. Bấm **Create new extension** -> Chọn upload tệp [neoclip-release.zip](file:///d:/folder/tools/money/magic-clip/neoclip-release.zip).
4. Khai báo các thông tin mô tả, ảnh chụp màn hình tương tự như Chrome Web Store.
5. Bấm gửi phê duyệt. Thời gian duyệt của Microsoft thường là **1 - 3 ngày**.

---

## 5. Deploy Website bán hàng lên Vercel / GitHub Pages

Thư mục `website/` trong dự án chứa toàn bộ mã nguồn của trang giới thiệu sản phẩm và cổng thanh toán.

### Tùy chọn 1: Deploy lên Vercel (Khuyên dùng - Rất nhanh và miễn phí)
1. Đăng ký tài khoản [Vercel](https://vercel.com/) miễn phí bằng tài khoản GitHub của bạn.
2. Cài đặt Vercel CLI trên máy tính:
   ```bash
   npm install -g vercel
   ```
3. Mở terminal tại thư mục website (`d:/folder/tools/money/magic-clip/website`).
4. Chạy lệnh:
   ```bash
   vercel
   ```
5. Làm theo hướng dẫn trên màn hình (Chọn tạo dự án mới, giữ cấu hình mặc định). 
6. Trang web của bạn sẽ được deploy và cung cấp một tên miền con miễn phí dạng `neoclip.vercel.app`.
7. Bạn có thể trỏ domain cá nhân của mình vào Vercel dễ dàng trong mục **Settings -> Domains** trên Dashboard của Vercel.

---

## 6. Cấu hình cổng thanh toán Lemon Squeezy (Production Mode)

Khi đã sẵn sàng bán hàng thực tế:

### Bước 1: Kích hoạt cửa hàng (Go Live)
1. Đăng nhập vào [Lemon Squeezy](https://www.lemonsqueezy.com/).
2. Chuyển nút gạt ở góc trên cùng từ **Test Mode** sang **Live Mode** (Bạn cần khai báo thông tin cá nhân/doanh nghiệp và tài khoản ngân hàng để nhận tiền).

### Bước 2: Tạo sản phẩm chính thức
1. Tạo 3 biến thể sản phẩm tương ứng với 3 mức giá đã hiển thị trên website:
   * **Pro Monthly:** Giá `$2.99 / tháng` (Subscription).
   * **Pro Yearly:** Giá `$19.99 / năm` (Subscription).
   * **Lifetime:** Giá `$49.00 / mua đứt` (Single Payment).
2. Bật tính năng **Generate License Keys** (Tự động sinh mã Key kích hoạt) trong phần cấu hình sản phẩm của Lemon Squeezy.

### Bước 3: Lấy link thanh toán thực tế (Live Checkout URL)
1. Lấy Checkout Link chính thức của từng sản phẩm.
2. Mở file [index.html](file:///d:/folder/tools/money/magic-clip/website/index.html).
3. Cập nhật các thẻ liên kết `href` mua hàng bằng Checkout Link chính thức mới:
   * Nút mua Monthly (Dòng ~145):
     ```html
     href="https://neoclip.lemonsqueezy.com/checkout/buy/id-thực-tế-gói-tháng"
     ```
   * Nút mua Yearly (Dòng ~157):
     ```html
     href="https://neoclip.lemonsqueezy.com/checkout/buy/id-thực-tế-gói-năm"
     ```
   * Nút mua Lifetime (Dòng ~168):
     ```html
     href="https://neoclip.lemonsqueezy.com/checkout/buy/id-thực-tế-gói-lifetime"
     ```
4. Đẩy (push) thay đổi của file `index.html` lên Vercel để cập nhật website bán hàng chính thức.
