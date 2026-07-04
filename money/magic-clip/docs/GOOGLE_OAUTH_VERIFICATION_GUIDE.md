# Hướng Dẫn Xác Minh Google OAuth App (OAuth App Verification)

Tài liệu này ghi chú lại kinh nghiệm xương máu và quy trình chính xác để vượt qua khâu kiểm duyệt **OAuth App Verification** của Google, giúp loại bỏ màn hình cảnh báo đỏ "Unverified App" khi người dùng đăng nhập bằng Google Drive.

---

## 1. Vấn đề thường gặp: Bị Google từ chối vì dùng tên miền "xài ké"
Khi bạn submit yêu cầu xác minh (OAuth Consent Screen), Google sẽ kiểm tra URL Trang chủ (Homepage) và Chính sách bảo mật (Privacy Policy).

**Nguyên nhân bị từ chối:**
Nếu bạn sử dụng các nền tảng lưu trữ bên thứ ba cung cấp tên miền phụ miễn phí như `vercel.app`, `github.io`, `webflow.io`... Google (The Third Party Data Safety Team) sẽ **từ chối ngay lập tức** vì bạn không thể chứng minh quyền sở hữu tuyệt đối với tên miền phụ đó (thông qua Google Search Console).

**Nội dung email từ chối của Google:**
> "Your application homepage and privacy policy must be hosted on a verified domain that you own. Your homepage and privacy policy should not be hosted on a third-party hosting platform where you can't verify that you own your subdomain. For example: Google Sites, Facebook, Instagram, Twitter, Vercel."

---

## 2. Cách giải quyết triệt để (Quy trình 3 bước)

Để vượt qua, bạn **bắt buộc phải có một tên miền riêng chính chủ** (VD: `.com`, `.me`, `.vn`).

### Bước 1: Trỏ tên miền riêng và Xác minh với Google Search Console
1. Trỏ tên miền riêng của bạn về trang web (VD: Dùng Cloudflare trỏ về GitHub Pages).
2. Đăng nhập vào [Google Search Console](https://search.google.com/search-console).
3. Thêm tài sản (Domain) và xác minh chủ quyền (thường bằng cách thêm bản ghi TXT vào Cloudflare DNS).
4. *(Tùy chọn nhưng nên làm)*: Tạo file `sitemap.xml` và `robots.txt` đẩy lên web, sau đó submit sitemap vào Google Search Console để web index nhanh hơn.

### Bước 2: Cập nhật thông tin trong Google Cloud Console
1. Truy cập [Google Cloud Console > APIs & Services > OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent).
2. Sửa ứng dụng (Edit App) và thay thế toàn bộ link cũ bằng link tên miền chính chủ:
   - **Homepage URL:** `https://your-domain.com/`
   - **Privacy Policy URL:** `https://your-domain.com/privacy.html`
   - **Terms of Service URL:** `https://your-domain.com/terms.html`
3. Ở mục **Authorized domains**, xóa các tên miền bên thứ ba (như `vercel.app`) và thêm tên miền của bạn (`your-domain.com`).
4. Lưu và nhấn **Submit for verification**.

### Bước 3: Gửi Email kháng cáo cho Google
Ngay sau khi bấm Submit, hãy mở lại email từ chối ban đầu của Google, nhấn **Reply (Trả lời)** và gửi nội dung mẫu sau:

> **Tiêu đề:** Re: OAuth Verification Request
> 
> Hi Third-Party Data Safety Team,
> 
> I have moved my application's homepage, privacy policy, and terms of service to my own custom domain (your-domain.com), which I have successfully verified via Google Search Console. 
> 
> I have also updated the URLs and authorized domains directly in the Google Cloud Console and re-submitted for verification.
> 
> Please review my application.
> 
> Thank you!

---

## 3. Kết quả mong đợi
Nếu làm đúng các bước trên, trong vòng 2-3 ngày làm việc, Google sẽ phản hồi bằng một email phê duyệt:
> **"We've approved your OAuth App Verification request for project [Project ID] for brand verification."**

**Lưu ý sau khi được duyệt:**
- KHÔNG thay đổi các URL trong OAuth Consent Screen. Nếu thay đổi, bạn sẽ phải submit xác minh lại từ đầu.
- Đảm bảo tài khoản Owner của Project Cloud Console luôn active để nhận các thông báo bảo mật từ Google.
