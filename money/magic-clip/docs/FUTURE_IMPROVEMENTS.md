# Danh Sách Cải Thiện & Nâng Cấp Tương Lai (NeoClip v3.1+)

Tài liệu này lưu trữ các ý tưởng và các tính năng cần được ưu tiên phát triển trong tương lai để giúp NeoClip hoàn thiện hơn về mặt trải nghiệm người dùng (UX) và kỹ thuật.

---

## 1. Trải nghiệm người dùng (Onboarding UX)
- **Trang Welcome (Welcome Page):**
  - **Vấn đề:** Người dùng cài đặt xong thường không biết cách mở app nếu không biết phím tắt.
  - **Giải pháp:** Tạo file `welcome.html`. Sử dụng hàm `chrome.runtime.onInstalled.addListener` trong `service_worker.js` để tự động bật tab này ngay sau khi người dùng cài đặt thành công.
  - **Nội dung trang Welcome:** Cảm ơn người dùng, hướng dẫn cách ghim (Pin) extension lên thanh công cụ của trình duyệt, và giới thiệu phím tắt `Alt + V` (hoặc `Option + V` trên Mac).

## 2. Hỗ trợ khách hàng & Thu thập Feedback
- **Nút Báo lỗi / Góp ý (Report Bug / Feedback):**
  - **Vấn đề:** Tránh việc người dùng gặp lỗi (như lỗi kết nối Google Drive) không có nơi phản ánh và lên thẳng Chrome Web Store vote 1-sao.
  - **Giải pháp:** Bổ sung một nút hoặc link nhỏ ở góc trang Settings, dẫn tới một Google Form hoặc email hỗ trợ (`mailto:worklelong@gmail.com`). 

## 3. Tối ưu hóa Code & Tự động hóa (DevOps)
- **Làm sạch Git Repository:**
  - Thêm thư mục `.build/`, `temp_unzip/`, và file `neoclip-release.zip` vào `.gitignore` để không push rác lên GitHub.
- **GitHub Actions (CI/CD):**
  - Thiết lập Workflow tự động: Mỗi khi push code lên nhánh `main` hoặc tạo Tag mới, GitHub Actions sẽ tự động chạy lệnh `node build.js` và đính kèm file zip vào mục Releases. Giúp tiết kiệm thời gian đóng gói thủ công.

## 4. Marketing & Tăng trưởng (Growth)
- **ProductHunt Launch:** Chuẩn bị tài liệu, ảnh chụp màn hình, video demo và bài viết để ra mắt NeoClip trên ProductHunt.
- **Reddit:** Lên danh sách các cộng đồng phù hợp (`r/productivity`, `r/chrome_extensions`, `r/macapps`) để chia sẻ ứng dụng theo hướng thảo luận, nhận góp ý từ cộng đồng early-adopters.
- **Quảng bá chéo (Cross-promotion):** Viết blog hoặc tạo short videos (TikTok/Reels) về cách NeoClip giúp tăng năng suất làm việc (đặc biệt tính năng OCR).
