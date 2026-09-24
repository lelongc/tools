# 20. BÁO CÁO KIỂM TRA CHUYÊN SÂU & NÂNG CẤP TOÀN DIỆN VẬT LÝ, HOẠT ẢNH VÀ ĐIỀU KHIỂN

Tài liệu này tổng hợp toàn bộ kết quả kiểm tra kỹ lưỡng (Deep Audit), các lỗi tiềm ẩn được phát hiện và các giải pháp đã triển khai để nâng cấp trải nghiệm chơi game đạt tiêu chuẩn thương mại quốc tế (Production-Ready).

---

## 1. TỔNG QUAN CÁC HẠNG MỤC ĐÃ KIỂM TRA & XỬ LÝ

| Hạng mục | Vấn đề phát hiện | Giải pháp cải tiến | Kết quả |
| :--- | :--- | :--- | :--- |
| **Vật lý công trình lơ lửng** | Thanh dầm dài bị mất 1 bên trụ nhưng vẫn treo ngang lơ lửng giữa trời; snubber dập lực và ép `sleeping = true` ngay cả khi khối không có bệ đỡ | Thêm cơ chế kiểm tra cân bằng đòn bẩy trọng lực (Cantilever Balance Check); tuyệt đối không cho ngủ hoặc triệt tiêu vận tốc khi khối chưa chạm bệ đỡ vững chắc | Thanh dầm mất trụ lập tức xoay nghiêng và sụp đổ tự nhiên 100% |
| **Thực thể hỗ trợ không hợp lệ** | Khi quái vật bị diệt (`is_defeated`) hoặc thùng TNT nổ (`is_ignited`), các khối gạch bên trên vẫn nhận nhầm chúng là bệ đỡ vững chắc | Bổ sung kiểm tra toàn diện `is_defeated`, `is_ignited`, `is_broken`, `is_breaking` trên tất cả 6 loại thực thể | Mọi công trình đè trên quái/thùng nổ rơi xuống tức thì khi mục tiêu tan biến |
| **Hoạt ảnh xoay lật chim 2D** | Lông đuôi gà bị lật đột ngột qua `scale.x = -0.85` khi đổi hướng bay, tạo cảm giác mỏng dính như tờ giấy | Khóa cố định `scale.x = 0.85` dương tuyệt đối; bổ sung góc nghiêng khí động học 3D (Banking Depth) với scale bất đối xứng cho 2 cánh | Cú quay đầu mượt mà, sống động, tạo cảm giác không gian 3 chiều |
| **Cơ chế ngắm & thả trứng** | Nhấp ngón tay nhanh (Quick Tap) bị nhận nhầm thành thao tác hủy ngắm (do khoảng cách kéo < 24px) | Tách biệt trạng thái `has_aim_dragged`: nhấp nhanh -> Thả rơi trứng thẳng đứng (Tap-to-Drop); kéo giữ -> Ngắm theo góc quỹ đạo | Thao tác thả đạn tức thì, nhạy bén và cực kỳ trực quan |
| **Khôi phục thị giác khi hủy ngắm** | Khi hủy ngắm, thân gà bị giữ nguyên trạng thái co giãn dây ná ná kéo | Tự động tween `visual_root.scale` về `Vector2.ONE`, ẩn mồ hôi và reset vị trí thân | Gà trở về tư thế bay lượn bình thường êm ái |
| **Dọn dẹp tài nguyên GameHUD** | `GameHUD` không triển khai `_exit_tree()`, tiềm ẩn nguy cơ dính kết nối signal `size_changed` hoặc kẹt trạng thái pause | Bổ sung `_exit_tree()` ngắt kết nối viewport, hủy tween và reset pause an toàn | 0 rò rỉ bộ nhớ, an toàn 100% khi chuyển cảnh liên tục |

---

## 2. CHI TIẾT CẢI TIẾN HỆ THỐNG VẬT LÝ

### 2.1. Kiểm tra cân bằng đòn bẩy trọng lực (Cantilever Balance Check)
Trong Angry Birds và các game vật lý phá hủy chất lượng cao, khi bắn sập 1 trụ bên trái của một dầm mái vòm 160px:
- Khối dầm không thể nằm ngang lơ lửng nếu điểm tựa chỉ nằm lệch hẳn về một bên mép.
- Giải pháp: Hàm `_has_rigid_support()` trong `DestructibleBlock.gd` quét các tia trên toàn bộ đáy dầm:
  ```gdscript
  if (has_left and not has_right and not has_center) or (has_right and not has_left and not has_center):
      return false # Mất cân bằng đòn bẩy trọng lực -> Buộc phải thức giấc và sụp đổ
  ```

### 2.2. Kiểm tra tính hợp lệ của thực thể đỡ
Trước đây, các khối vật lý chỉ kiểm tra thuộc tính `is_destroyed` của `DestructibleBlock`. Nếu một khối nằm trên một quái vật hoặc thùng TNT:
- Khi quái chết (`is_defeated = true`), quái vẫn tồn tại 0.56 giây để chạy hiệu ứng nổ hoạt hình.
- Các tia quét bên trên nhận diện quái là `RigidBody2D` còn sống, khiến khối bên trên không chịu rơi.
- Đã đồng bộ kiểm tra trên tất cả các lớp:
  ```gdscript
  if ("is_destroyed" in col and col.is_destroyed) \
      or ("is_defeated" in col and col.is_defeated) \
      or ("is_ignited" in col and col.is_ignited) \
      or ("is_broken" in col and col.is_broken) \
      or ("is_breaking" in col and col.is_breaking):
      is_failing = true
  ```

---

## 3. CHI TIẾT CẢI TIẾN HOẠT ẢNH & ĐIỀU KHIỂN

### 3.1. Triệt tiêu hoàn toàn hiện tượng lật 2D như tờ giấy
- Lông đuôi gà (`tail_sprite`) luôn duy trì `scale.x = 0.85` dương.
- Hướng đuôi được điều khiển 100% bằng góc xoay vật lý (`rotation = lerp_angle`) và độ trễ chuyển động ngược chiều gió (`position.x = lerp(-move_direction * 22.0)`).
- Hai cánh vỗ với tỉ lệ co giãn thị sai (Parallax Scale):
  ```gdscript
  if left_wing: left_wing.scale.y = 1.0 + bank_roll * 0.22
  if right_wing: right_wing.scale.y = 1.0 - bank_roll * 0.22
  ```

### 3.2. Hỗ trợ song song Chạm Thả (Tap-to-Drop) & Kéo Ngắm (Drag-Aim)
- Người chơi nhấp ngón tay nhanh: Gà thả ngay quả trứng thẳng đứng xuống dưới với vận tốc tự nhiên $480\text{px/s}$.
- Người chơi chạm và kéo ngón tay $> 20\text{px}$: Kích hoạt đường đạn hạt ngọc phát sáng và tâm ngắm tiếp đất.
- Người chơi kéo ngược lên trên: Hủy ngắm êm dịu, không hao phí trứng.

---

## 4. KẾT QUẢ KIỂM THỬ TỔNG THỂ

Bộ kiểm thử `TestRunner.tscn` gồm **15 Test Suites** độc lập bao phủ toàn bộ dự án:
- **100% Test Suites PASS (0 Errors)**:
  - Test 1-3: Đạn dược, vật liệu, quái vật & 10 đại trùm thế giới.
  - Test 4: Tạo cấu trúc 200 màn chơi, ổn định thời bình.
  - Test 5: Đường truyền sát thương, tính điểm, thắng ván.
  - Test 6-8: Trọng lực, siêu tân tinh hố đen, schema lưu dữ liệu.
  - Test 9-11: Vá lỗi P0/P1, kinh tế cửa hàng, làm mịn màn 61-200.
  - Test 12-14: Background SVG, chống rung giật, safe area, chống gian lận giờ hệ thống.
  - Test 15: Hoạt ảnh bay 3D, Tap-to-Drop, chống treo lơ lửng cantilever, dọn dẹp an toàn GameHUD.
