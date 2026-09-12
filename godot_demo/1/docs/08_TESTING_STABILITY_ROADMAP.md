# 🧪 KẾ HOẠCH KIỂM THỬ TỰ ĐỘNG & LỘ TRÌNH SẢN XUẤT (TESTING & ROADMAP)
# RUNIC SLICE: TACTICAL BACKPACK SURVIVOR

---

## 🤖 1. MA TRẬN KIỂM THỬ TỰ ĐỘNG (AUTOMATED QA SUITE)

Để đảm bảo dự án không gặp bất kỳ lỗi crash hay hồi quy logic nào, toàn bộ hệ thống được bảo vệ bằng kịch bản kiểm thử tự động `scenes/tests/test_game_stability.gd`, có thể chạy không cần giao diện đồ họa (*Headless Mode*):

```powershell
& "D:\app\godot\Godot_v4.7.1-stable_win64.exe" --path "d:\folder\tools\godot_demo\1" --headless -s "res://scenes/tests/test_game_stability.gd"
```

### Các Bài Kiểm Tra Cụ Thể (Unit & Stress Test Cases):
1. **TEST_01: Nạp Tài Nguyên Vật Phẩm (Resource Integrity):**
   * Tự động quét và nạp toàn bộ danh mục `.tres` trong thư mục `resources/items/`.
   * Kiểm tra tính hợp lệ của `grid_shape`, `base_damage`, `cooldown_sec`.
2. **TEST_02: Thuật Toán Lưới Balo (Grid Placement & Bounds):**
   * Đặt vật phẩm $2 \times 2$ vào vị trí hợp lệ $\rightarrow$ Kỳ vọng `true`.
   * Đặt vật phẩm lấn ra ngoài rìa $8 \times 8$ $\rightarrow$ Kỳ vọng `false`.
   * Đặt 2 vật phẩm chồng lấn lên nhau $\rightarrow$ Kỳ vọng `false`.
   * Xoay vật phẩm $90^\circ$ và kiểm tra ma trận đảo chiều.
3. **TEST_03: Đánh Giá Kích Hoạt Lân Cận (Adjacency Synergy Logic):**
   * Đặt Ngọc Lửa bên cạnh Kiếm Rỉ Sét $\rightarrow$ Xác nhận thuộc tính kiếm chuyển thành "fire" và sát thương tăng đúng $+35\%$.
   * Đặt Dây Đồng Dẫn Điện nối giữa Ngọc Lửa và Nỏ Săn $\rightarrow$ Xác nhận Nỏ nhận được thuộc tính Lửa qua dây dẫn.
4. **TEST_04: Ứng Suất Tái Sinh Đối Tượng (Object Pool Stress Test):**
   * Triệu hồi đồng loạt $500$ viên đạn và $200$ quái vật trong $1$ frame.
   * Thu hồi toàn bộ về Pool.
   * Lặp lại $100$ lần liên tục để kiểm tra không bị Memory Leak hoặc rò rỉ Node.
5. **TEST_05: Lưu Trữ Nguyên Tử (Atomic Save / Load Integrity):**
   * Ghi dữ liệu mẫu vào `user://runic_save.json`.
   * Tải lại và so sánh giá trị băm (Hash Checksum).
   * Cố tình làm hỏng file chính và xác nhận hệ thống tự phục hồi thành công từ file backup `.bak`.

---

## ⏱️ 2. CHỈ TIÊU HIỆU NĂNG PHẦN CỨNG (PERFORMANCE BUDGET)

| Thiết Bị | Khung Hình Mục Tiêu | Số Quái Tối Đa Trên Màn Hình | Mức Chiếm Dụng RAM |
| :--- | :--- | :--- | :--- |
| **PC Core i5 / GTX 1050 (Low-end)** | $144\text{ FPS}$ cố định | $500\text{ quái}$ | $< 350\text{ MB}$ |
| **Steam Deck (15W / 800p)** | $60\text{ FPS}$ mượt mà | $400\text{ quái}$ | $< 300\text{ MB}$ (Pin $> 4.5$ giờ) |
| **iPhone 11 / Galaxy S20 (Mobile)** | $60\text{ FPS}$ không nóng máy | $250\text{ quái}$ | $< 220\text{ MB}$ |
| **Android Giá Rẻ (RAM 3GB)** | $60\text{ FPS}$ ổn định | $180\text{ quái}$ | $< 180\text{ MB}$ |

---

## 🗓️ 3. LỘ TRÌNH TRIỂN KHAI TOÀN DIỆN (DEVELOPMENT ROADMAP)

* **GIAI ĐOẠN 1: NỀN TẢNG CỐT LÕI (CORE FOUNDATION - Tuần 1 - 2):**
  * Thiết lập dự án Godot 4.7.1, Autoloads, InputManager, SoundManager thủ tục.
  * Xây dựng GridManager và thuật toán kiểm tra kề Adjacency.
  * Tạo bộ asset đồ họa vector SVG và textures tự trị.
* **GIAI ĐOẠN 2: GAMEPLAY LOOP & ARENA (Tuần 3 - 4):**
  * Hoàn thiện Player với Dash I-Frames, quái vật AI bầy đàn, Object Pooling 0-allocation.
  * Tích hợp giao diện kéo thả Balo Runic Forge với Snap-to-grid và xoay 90 độ.
  * Hoàn thiện 15+ Custom Resources và hiệu ứng nguyên tố.
* **GIAI ĐOẠN 3: ĐÁNH BÓNG & TRẢI NGHIỆM ĐA NỀN TẢNG (Tuần 5 - 6):**
  * Tích hợp Trauma Screen Shake, Micro Hit-stop, số sát thương nảy búng.
  * Cần gạt ảo Mobile Touch và điều khiển Bàn phím/Chuột/Gamepad PC.
  * Kiểm thử toàn bộ hệ thống bằng test suite tự động.
* **GIAI ĐOẠN 4: GO-TO-MARKET & LAUNCH TOÀN CẦU (Tuần 7 - 8):**
  * Tham gia Steam Next Fest với Demo 5 Wave.
  * Phát hành bản chính thức PC trên Steam ($8.99) và Mobile (F2P).
  * Chạy chiến dịch TikTok Seed Sharing bùng nổ doanh thu triệu đô.
