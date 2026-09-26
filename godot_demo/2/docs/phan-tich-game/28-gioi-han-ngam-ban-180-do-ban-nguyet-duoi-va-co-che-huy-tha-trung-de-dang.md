# Tối Ưu Hóa Cơ Chế Kéo Thả Trứng: Giới Hạn Bán Nguyệt 180 Độ & Hủy Thả Trứng Tiện Lợi

## 1. Bối cảnh & Yêu cầu người dùng
Trước đây, cơ chế kéo ngắm ná hỗ trợ 360 độ tự do. Tuy nhiên trong thực tế trải nghiệm:
- Gà bay lượn ở tầng cao của bầu trời, mục tiêu là các công trình boong ke và quái vật nằm bên dưới mặt đất. Việc ném ngược trứng lên trời không phù hợp với logic vật lý thực chiến và luồng game.
- Khi cho phép kéo ngắm 360 độ, thao tác kéo ngược lên trên lại trở thành "ngắm bắn lên trời" thay vì hủy bắn, khiến người chơi rất khó hủy đợt thả trứng khi muốn chờ gà bay tới vị trí đẹp hơn.
- Yêu cầu đặt ra:
  1. **Không ném được lên trời**: Góc bắn bị giới hạn chặt chẽ trong bán nguyệt 180 độ hướng xuống dưới (từ ngang trái qua thẳng đứng xuống đến ngang phải).
  2. **Dễ dàng hủy thả trứng**: Kéo ngón tay ngược lên trên (hướng lên bầu trời / thanh menu) hoặc kéo trả về điểm xuất phát sẽ hủy ngay lập tức, giấu đường đạn và không thả trứng khi thả tay.

---

## 2. Chi tiết Giải pháp Kỹ thuật

### 2.1. Khóa góc bắn trong Bán nguyệt 180 độ hướng xuống (`[0.04, PI - 0.04]` rad)
Trong hệ tọa độ 2D của Godot:
- `0.0` rad: Hướng thẳng sang Phải (`Vector2(1, 0)`).
- `PI / 2` rad: Hướng thẳng đứng Xuống Dưới (`Vector2(0, 1)`).
- `PI` rad: Hướng thẳng sang Trái (`Vector2(-1, 0)`).
- Các góc âm (`< 0.0`): Hướng chĩa ngược lên Bầu Trời (`Vector2(x, -y)`).

Khi người chơi kéo ngón tay:
```gdscript
var raw_angle = drag_delta.angle()
var clamped_angle: float
if raw_angle < 0.0:
    # Nếu ngón tay lệch nhẹ lên trên đường chân trời: kẹp sát trục ngang tương ứng trái / phải
    if raw_angle > -PI * 0.5:
        clamped_angle = 0.04 # Kẹp sát mép ngang sang phải
    else:
        clamped_angle = PI - 0.04 # Kẹp sát mép ngang sang trái
else:
    clamped_angle = clamp(raw_angle, 0.04, PI - 0.04)

var aim_dir = Vector2(cos(clamped_angle), sin(clamped_angle))
```
*Kết quả*: Vận tốc dọc trục Y (`aim_vector.y`) luôn luôn dương (`>= sin(0.04) * speed > 0`). Quả trứng chỉ bay theo các quỹ đạo chúc xuống dưới, tuyệt đối không bay ngược lên trần màn hình.

---

### 2.2. Nhận diện thao tác Hủy Thả Trứng trực quan và linh hoạt
Khi người chơi đang kéo giữ để ngắm mà muốn hủy:
1. **Kéo ngược lên trời**:
   - `drag_delta.y < -45.0` (kéo lên trên 45px).
   - Hoặc kéo thẳng đứng lên trên `drag_delta.y < -25.0 and abs(drag_delta.x) < 35.0`.
2. **Kéo về điểm xuất phát**:
   - `drag_dist < 18.0` sau khi đã bắt đầu kéo.
3. **Kéo vào vùng trần HUD / TopBar**:
   - `screen_mouse_pos.y < 80.0`.

Khi rơi vào bất kỳ điều kiện nào ở trên:
- `is_cancelling = true`
- Đường mô phỏng quỹ đạo và thước đo lực ná biến mất ngay lập tức (`trajectory_overlay.visible = false`).
- Khi nhấc ngón tay lên: Kính phi công trượt êm ái về trán gà (`_on_aim_end(false)`), gà tiếp tục bay tuần tra bình thường, **không có quả trứng nào bị tiêu hao**.

---

## 3. Kết quả Kiểm thử
- Toàn bộ 29 bộ kiểm thử trong `scenes/tests/TestRunner.tscn` đã được thực thi và vượt qua 100% (0 lỗi).
- Cơ chế thả nhanh chạm nhẹ (Tap-to-Drop) vẫn hoạt động tức thì khi không kéo.
- Thao tác kéo ngắm mượt mà, định vị chính xác và hủy thao tác cực kỳ tự nhiên.
