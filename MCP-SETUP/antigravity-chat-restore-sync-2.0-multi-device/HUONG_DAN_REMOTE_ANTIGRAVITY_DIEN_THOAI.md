# 📱 HƯỚNG DẪN ĐIỀU KHIỂN & CHAT VỚI ANTIGRAVITY TỪ XA TRÊN ĐIỆN THOẠI (4G / QUÁN CAFE)

Tài liệu này hướng dẫn bạn cách kết nối từ xa để **chat trực tiếp với Antigravity (Gemini Agent)** và điều khiển toàn bộ IDE trên máy tính ở nhà từ **Điện thoại (iPhone/Android), iPad hoặc Laptop mang theo ra quán Cafe**.

---

## ❓ Vì sao dùng Chrome Remote Desktop thay vì VS Code Tunnel?

* **VS Code Tunnel (`vscode.dev`)**: Chỉ mở trình duyệt với giao diện VS Code tiêu chuẩn của Microsoft (chỉ có Copilot), **không tải được bộ máy AI Agent Antigravity của Google**.
* **Google Chrome Remote Desktop (Khuyên dùng 100%)**: 
  - Do Google phát triển, hoàn toàn miễn phí, bảo mật đa lớp qua tài khoản Google.
  - Hiển thị trực tiếp **chính xác 100% giao diện Antigravity IDE** trên điện thoại.
  - Bạn có thể chat với Antigravity, xem AI viết code, chạy lệnh, tạo file và duyệt project y như đang ngồi trước màn hình máy tính.
  - Hoạt động mượt mà ở bất cứ đâu: Quán cafe, trên xe, dùng 4G/5G hoặc Wi-Fi khác mạng.

---

## 🚀 HƯỚNG DẪN THIẾT LẬP 1 LẦN DUY NHẤT (MẤT 2 PHÚT)

### 💻 Bước 1: Thiết lập trên Máy tính ở nhà
1. Mở trình duyệt Chrome trên máy tính và truy cập vào trang:
   👉 **[remotedesktop.google.com/access](https://remotedesktop.google.com/access)**
2. Tại mục **"Thiết lập quyền truy cập từ xa" (Set up remote access)**, bấm vào nút **Tải xuống / Bật (Turn on)**.
3. Đặt **Tên cho máy tính** của bạn (ví dụ: `PC-Antigravity`).
4. Nhập **Mã PIN bảo mật 6 số** (ví dụ: `123456`) ➔ Bấm **Bắt đầu (Start)**.

---

### 📱 Bước 2: Cài đặt ứng dụng trên Điện thoại
1. Mở kho ứng dụng trên điện thoại:
   - **iPhone / iPad**: Vào App Store ➔ Tìm và tải **Chrome Remote Desktop**.
   - **Android**: Vào Google Play ➔ Tìm và tải **Chrome Remote Desktop**.
2. Mở ứng dụng lên và **đăng nhập bằng tài khoản Google** giống với tài khoản trên máy tính.

---

### 🎮 Bước 3: Kết nối và Ra lệnh cho Antigravity
1. Mở app Chrome Remote Desktop trên điện thoại ➔ Bạn sẽ thấy tên máy tính `PC-Antigravity` hiển thị trạng thái **Online (Trực tuyến)**.
2. Nhấp vào tên máy tính ➔ Nhập **mã PIN 6 số** đã tạo ở Bước 1.
3. **Màn hình Antigravity IDE sẽ hiện ra ngay lập tức!**
   - Bạn chỉ cần nhấp vào khung chat và bắt đầu gõ lệnh trò chuyện với Antigravity như bình thường.

---

## 💡 Mẹo sử dụng tiện lợi trên Điện thoại:

1. **Chế độ vuốt chạm (Touch Mode)**:
   - Trong app trên điện thoại, vuốt từ cạnh màn hình vào để mở Menu ➔ Chọn biểu tượng **Ngón tay (Touch mode)** để chạm bấm các nút, icon trên IDE như lướt web trên điện thoại.
2. **Gõ phím & Tiếng Việt**:
   - Bấm vào biểu tượng **Bàn phím** trên thanh menu của app để bật bàn phím gõ chữ và chat bình thường.
3. **Giữ máy tính không bị ngủ (Sleep)**:
   - Khi ra ngoài, đảm bảo máy tính ở nhà đang bật nguồn và không vào chế độ Sleep (Vào Windows Settings ➔ Power & Sleep ➔ chọn *When plugged in, turn off after: Never*).

---

## 💾 CÔNG CỤ SAO LƯU & KHÔI PHỤC (Dự phòng)

Trong thư mục này còn có sẵn 2 công cụ quản lý dữ liệu:
* **Sao lưu toàn bộ chat**: Chạy `python backup_antigravity.py` ➔ Tạo file `.zip` nén toàn bộ database và lịch sử hội thoại.
* **Khôi phục sang máy khác**: Chạy `python restore_antigravity.py <file.zip>`
