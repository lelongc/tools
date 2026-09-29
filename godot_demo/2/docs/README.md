# 📚 HỆ THỐNG TÀI LIỆU DỰ ÁN CLUCK & DROP: BUNKER BUSTER
## GODOT 4.7.1 STABLE (CHIẾN DỊCH BẢO VỆ TỔ GÀ - 200 MÀN CHƠI)

> **Mã dự án:** `CLUCK-DROP-BUNKER-BUSTER-2026`  
> **Phiên bản Engine:** Godot 4.7.1 Stable (Official 64-bit)  
> **Nền tảng mục tiêu:** Android (Google Play Store 2026), iOS (App Store), Web (YouTube Playables)  
> **Độ phân giải chuẩn:** Dọc $540 \times 960$ (Tỷ lệ 9:16 linh hoạt mở rộng `canvas_items` / `expand`)  
> **Tình trạng kiểm thử:** **30/30 Bộ Test Suite Vượt Qua Tuyệt Đối (0 Lỗi, 100% Pass, 0 Warning)**

---

## 🗺️ MỤC LỤC TÀI LIỆU TOÀN DIỆN

Hệ thống tài liệu được tái cấu trúc tinh gọn, trực diện, phân tích toàn diện hiện trạng mã nguồn và xác định các hạng mục cải tiến chuẩn sản xuất:

1. [**01 - Tổng Quan Kiến Trúc Dự Án & Tiến Độ Hiện Tại**](01-tong-quan-kien-truc-du-an-va-tien-do-hien-tai.md)
   - Sơ đồ kiến trúc tổng thể (Autoloads, Core Level, Entities, UI).
   - Hệ sinh thái 10 Thế Giới, 200 màn chơi và 10 Đại Trùm.
   - Thống kê kho vũ khí 7 loại trứng và 11 loại vật liệu công trình.
   - Kết quả nghiệm thu 30 bộ kiểm thử tự động.

2. [**02 - Đại Kiểm Toán & Danh Mục Các Điểm Cần Cải Thiện Toàn Diện**](02-dai-kiem-toan-va-danh-muc-cac-diem-can-cai-thien-toan-dien.md)
   - **Trục 1:** Công thái học cảm ứng & Điều khiển ngắm bắn trên di động.
   - **Trục 2:** Vật lý phá hủy, Chống kẹt vòm & Bảo toàn động năng.
   - **Trục 3:** Cân bằng 200 màn, Cơ chế bẫy phòng Đại Trùm & Kinh tế trứng.
   - **Trục 4:** Mỹ thuật giao diện 2D, Cảm giác sung sướng (Juice) & Tiếp cận.
   - **Trục 5:** Thiết kế âm thanh hoạt hình & Nhạc nền môi trường thế giới.
   - **Trục 6:** Hiệu năng phần cứng, Tản nhiệt, Tiết kiệm pin & Bộ nhớ.
   - **Trục 7:** Tiêu chuẩn phát hành CH Play 2026, YouTube Playables & LiveOps.
   - *Bảng tổng hợp chi tiết 20 điểm cải thiện đột phá.*

3. [**03 - Ma Trận Ưu Tiên & Lộ Trình Thực Thi Chi Tiết**](03-ma-tran-uu-tien-va-lo-trinh-thuc-thi-chi-tiet.md)
   - Ma trận phân loại ưu tiên $P0 \to P3$ (Độ khó vs Tác động).
   - Biểu đồ phân bổ 4 góc phần tư Quadrant Chart.
   - Kế hoạch thực thi 4 giai đoạn cụ thể theo từng file mã nguồn.
   - Bộ tiêu chí nghiệm thu chất lượng (QA Acceptance Criteria).

---

## 🚀 HƯỚNG DẪN TRẢI NGHIỆM VÀ KIỂM THỬ NHANH

* **Khởi chạy Game (Desktop OpenGL3):**
  Nhấp đúp chuột vào file [`Play_Game.bat`](../Play_Game.bat) ở thư mục gốc để mở game tức thì bằng Godot 4.7.1.
* **Chạy bộ kiểm thử tự động toàn diện:**
  ```powershell
  & "D:\app\godot\Godot_v4.7.1-stable_win64.exe" --headless --path "d:\folder\tools\godot_demo\2" "res://scenes/tests/TestRunner.tscn"
  ```
