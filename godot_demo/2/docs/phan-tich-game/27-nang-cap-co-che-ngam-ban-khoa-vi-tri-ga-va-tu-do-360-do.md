# 27. NÂNG CẤP CƠ CHẾ NGẮM BẮN: KHÓA CỐ ĐỊNH VỊ TRÍ GÀ & TỰ DO HƯỚNG BẮN 360 ĐỘ

> **Tài liệu Kỹ thuật & Báo cáo Cải tiến Gameplay**  
> **Phiên bản Engine**: Godot Engine 4.7.1 Stable  
> **Mã báo cáo**: `AIM-ERGONOMICS-AND-360-TRAJECTORY-2026-V27`  
> **Trạng thái**: Hoàn tất phân tích, kiểm thử và áp dụng $100\%$ (29/29 Test Suites PASS)

---

## 1. YÊU CẦU & VẤN ĐỀ TRẢI NGHIỆM

Người chơi phản ánh cơ chế ngắm bắn hiện tại có hai điểm bất hợp lý lớn:
1. **Gà bị dịch chuyển khi kéo ngắm**: Khi bấm giữ và kéo ngón tay trên màn hình để căn đường đạn, thân chú gà bị kéo trượt ngang theo ngón tay (`target_chicken_x`), khiến vị trí phóng đạn bị thay đổi liên tục, gây khó chịu và mất phương hướng.
2. **Hướng bắn bị gượng gạo, không tự do và dễ biến mất**: Đường đạn trước đây bị ép buộc rơi thẳng đứng với vận tốc $V_y$ cố định từ $420$ đến $920\text{ px/s}$, không thể bắn ngang hoặc bắn bổng. Kéo ngón tay hơi hướng lên thì tia quỹ đạo bị biến mất do điều kiện hủy quá nhạy (`drag_delta.y < -75.0`).

---

## 2. GIẢI PHÁP ĐÃ TRIỂN KHAI

### 2.1. Khóa Cứng Vị Trí Gà Tại Chỗ Khi Ngắm Bắn ([ChickenBomber.gd](file:///d:/folder/tools/godot_demo/2/scripts/player/ChickenBomber.gd))
* Khi người chơi chạm giữ để ngắm (`is_aiming = true`):
  * Tọa độ của gà được neo giữ cố định tuyệt đối: `position.x = aim_anchor_x`.
  * Trong cả hai hàm `_process_aiming_hover` và `_handle_aim_input`, chú gà lơ lửng đập cánh tại đúng tọa độ đó, triệt tiêu $100\%$ hiện tượng trượt ngang theo ngón tay.
  * Chỉ khi nhả tay bắn đạn hoặc hủy ngắm, chú gà mới tiếp tục hành trình bay tuần tra bình thường.

### 2.2. Cho Phép Kéo Hướng Bắn Tự Do Toàn Diện 360 Độ
* **Bảo toàn vector hướng thực tế**:
  * Sử dụng trực tiếp vector kéo của ngón tay: `var drag_dir = drag_delta.normalized()`.
  * Tỷ lệ lực kéo ná: `tension_ratio = clamp((drag_dist - 14.0) / 160.0, 0.0, 1.0)`.
  * Vận tốc phóng: `launch_speed = lerp(450.0, 960.0, tension_ratio)`.
  * Vector vận tốc: `aim_vector = drag_dir * launch_speed`.
* **Hỗ trợ mọi góc độ**: Người chơi có thể kéo bắn chúc thẳng đứng, bắn chéo góc thấp, bắn ngang hoặc bắn bổng parabol qua các bức tường cao một cách mượt mà.
* **Xóa bỏ lỗi mất tia quỹ đạo**: Loại bỏ điều kiện hủy cứng nhắc `drag_delta.y < -75.0`. Giờ đây kéo hướng lên trên là ngắm bắn góc cao, không còn làm mất tia đạn.
* **Cơ chế hủy an toàn thông minh**: Chỉ hủy khi người chơi kéo trả ngón tay về lại điểm xuất phát (`drag_dist < 14.0px`) sau khi đã kéo, hoặc vuốt vào vùng thanh menu TopBar (`y < 65.0px`).

### 2.3. Đồng Bộ Hoá Hoạt Ảnh Biểu Cảm & Thước Đo Cung Lực
* **Mắt gà liếc theo 360 độ**: `_update_eye_direction(dir)` hỗ trợ cả hướng nhìn lên trên (`clamp(dir.y * 3.0, -3.0, 4.0)`).
* **Rung lắc và giọt mồ hôi**: Tính toán `tension_ratio` dựa trên độ dài lực kéo tổng quát, hoạt động chính xác ở mọi góc bắn.
* **Thước đo cung lực động ([TrajectoryOverlay.gd](file:///d:/folder/tools/godot_demo/2/scripts/player/TrajectoryOverlay.gd))**: Vòng cung đo lực ná tự động xoay theo góc xuất phát của đường đạn (`center_a = (local_points[1] - local_points[0]).angle()`).

---

## 3. KẾT QUẢ KIỂM THỬ

* Đã chạy toàn bộ **29 Bộ kiểm thử tự động** trên Godot Engine headless:
  ```text
  >>> ALL TESTS PASSED SUCCESSFULLY! (0 ERRORS) <<<
  ```
* Không xảy ra bất kỳ xung đột nào với các tính năng cũ, đảm bảo game chạy mượt mà, cảm giác điều khiển chắc chắn, chính xác và thỏa mãn.
