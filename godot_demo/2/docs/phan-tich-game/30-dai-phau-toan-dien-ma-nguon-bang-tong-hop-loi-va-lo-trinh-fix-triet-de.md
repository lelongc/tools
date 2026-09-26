# 📋 ĐẠI PHẪU TOÀN DIỆN MÃ NGUỒN (AUDIT TOÀN DỰ ÁN)
## BẢNG TỔNG HỢP CHI TIẾT TẤT CẢ CÁC LỖI, BẤT HỢP LÝ & LỘ TRÌNH ĐIỀU CHỈNH TOÀN DIỆN

> **Ngày thực hiện:** 26/09/2026  
> **Dự án:** Chicken Bomber: Egg Defense 2D (Godot 4 Mobile)  
> **Mục tiêu:** Rà soát kỹ lưỡng 100% mã nguồn dự án, mổ xẻ từng hệ thống (Điều khiển ngắm bắn, Vật lý công trình sập đổ, Phát sinh 200 màn chơi & 10 Thế giới, Trứng dị biến & Kỹ năng, Giao diện UI/UX Mobile, Âm thanh & Tối ưu hóa), chỉ ra nguyên nhân gốc rễ và đưa ra giải pháp kỹ thuật cụ thể.

---

## 📑 MỤC LỤC
1. [HỆ THỐNG 1: ĐIỀU KHIỂN & CƠ CHẾ NGẮM BẮN (ChickenBomber.gd & TrajectoryOverlay.gd)](#hệ-thống-1-điều-khiển--cơ-chế-ngắm-bắn)
2. [HỆ THỐNG 2: VẬT LÝ, KẾT CẤU CÔNG TRÌNH & CHỐNG LƠ LỬNG (DestructibleBlock.gd & RollingBoulder.gd)](#hệ-thống-2-vật-lý-kết-cấu-công-trình--chống-lơ-lửng)
3. [HỆ THỐNG 3: QUÁI VẬT BÙNG NỔ & CƠ CHẾ ĐÈ ĐÈP (BunkerMonster.gd)](#hệ-thống-3-quái-vật-bùng-nổ--cơ-chế-đè-đẹp)
4. [HỆ THỐNG 4: THUỐC NỔ, ĐỊA HÌNH & HIỆU ỨNG THẾ GIỚI (CampaignLevel.gd, TNTBarrel.gd & UpdraftVent.gd)](#hệ-thống-4-thuốc-nổ-địa-hình--hiệu-ứng-thế-giới)
5. [HỆ THỐNG 5: TRỨNG VẬT LÝ & KỸ NĂNG CHẠM GIỮA KHÔNG TRUNG (BaseEgg.gd & Các Loại Trứng Con)](#hệ-thống-5-trứng-vật-lý--kỹ-năng-chạm-giữa-không-trung)
6. [HỆ THỐNG 6: GIAO DIỆN UI/UX, ĐIỀU HƯỚNG & CÔNG THÁI HỌC MOBILE (GameHUD.gd, JuicyButton.gd, Modals)](#hệ-thống-6-giao-diện-uiux-điều-hướng--công-thái-học-mobile)
7. [HỆ THỐNG 7: VÒNG ĐỜI HỆ ĐIỀU HÀNH, NÚT BACK ANDROID & LƯU TRỮ NGUYÊN TỬ (SaveManager.gd & GameManager.gd)](#hệ-thống-7-vòng-đời-hệ-điều-hành-nút-back-android--lưu-trữ-nguyên-tử)
8. [BẢNG MA TRẬN MỨC ĐỘ ƯU TIÊN VÀ LỘ TRÌNH THỰC HIỆN](#bảng-ma-trận-mức-độ-ưu-tiên-và-lộ-trình-thực-hiện)

---

## HỆ THỐNG 1: ĐIỀU KHIỂN & CƠ CHẾ NGẮM BẮN
**Các tệp liên quan:** [`scripts/player/ChickenBomber.gd`](file:///d:/folder/tools/godot_demo/2/scripts/player/ChickenBomber.gd), [`scripts/player/TrajectoryOverlay.gd`](file:///d:/folder/tools/godot_demo/2/scripts/player/TrajectoryOverlay.gd)

### 1.1. Lỗi giật lật 180 độ đột ngột khi ngón tay lướt qua trục ngang (Discontinuity Flip)
* **Hiện trạng & Triệu chứng:**
  Khi người chơi kéo ngón tay ngắm bắn, nếu ngón tay nhấc nhẹ lên trên trục ngang (`raw_angle < 0.0`), đoạn mã tại dòng 432-438 thực thi:
  ```gdscript
  if raw_angle < 0.0:
      if raw_angle > -PI * 0.5:
          clamped_angle = 0.04 # Kẹp sát mép phải (~2.3 độ)
      else:
          clamped_angle = PI - 0.04 # Kẹp sát mép trái (~177.7 độ)
  ```
  Nếu ngón tay di chuyển từ `-89°` sang `-91°` (chỉ lệch đúng 2 độ qua trục thẳng đứng hướng lên), góc bắn ngay lập tức bị lật ngược từ cực phải sang cực trái (chênh lệch `175.4°`). Tia quỹ đạo giật bắn sang phía đối diện màn hình khiến người chơi có cảm giác điều khiển bị "loạn", giật cục.
* **Nguyên nhân gốc rễ:**
  Thuật toán phân đôi bán cầu trên tại `-PI * 0.5` là một bước nhảy gián đoạn bậc 1 (step discontinuity).
* **Giải pháp điều chỉnh hợp lý:**
  1. Loại bỏ hoàn toàn cú nhảy góc tại `-PI * 0.5`. Thay vào đó, áp dụng hàm nội suy góc mượt hoặc vùng chết hủy bắn tự nhiên (Natural Deadzone).
  2. Khi ngón tay kéo ngược lên trên bầu trời (`drag_delta.y < -15.0`), chuyển ngay sang trạng thái hiển thị "Hủy thao tác" (Cancel Stance) với hiệu ứng co dây ná mềm mại, thay vì ép gà bắn ngang song song mặt đất.

---

### 1.2. Giới hạn bay của Gà bị lệch so với độ rộng thực tế của Hang động (Cavern Bounds Sync)
* **Hiện trạng & Triệu chứng:**
  Trong [`ChickenBomber.gd`](file:///d:/folder/tools/godot_demo/2/scripts/player/ChickenBomber.gd) (dòng 9-10):
  ```gdscript
  @export var min_x: float = 55.0
  @export var max_x: float = 485.0
  ```
  Ở Thế giới 1 (Farm Cavern giai đoạn đầu), hang rộng 540px thì gà bay hợp lý. Tuy nhiên, từ Thế giới 2 đến Thế giới 10, hang động đã được nâng cấp độ rộng lên tới `1360px` (`cavern_half_width` lên tới 650px). Mặc dù `CampaignLevel.gd` có gán lại `chicken.min_x` và `chicken.max_x`, nhưng nếu gà được nạp lại độc lập hoặc trong các kịch bản test/replay, gà có nguy cơ chỉ lượn quanh quẩn ở trung tâm 485px, không thể bay bao quát toàn bộ pháo đài rộng lớn ở hai bên cánh.
* **Giải pháp điều chỉnh:**
  Ràng buộc biên độ bay của Gà trực tiếp với thông số toàn cảnh `GameManager.cavern_left_x` và `GameManager.cavern_right_x`, tự động cập nhật mỗi khi chuyển đổi màn chơi hoặc thay đổi kích thước thế giới.

---

### 1.3. Mô phỏng bước tia quỹ đạo chưa đủ mịn ở vận tốc cao (Trajectory Raycast Tunneling)
* **Hiện trạng & Triệu chứng:**
  Trong hàm `_draw_trajectory()` (dòng 553):
  `var dt = 0.022`
  Khi người chơi kéo căng ná tối đa (vận tốc đạt `960 px/s`), quãng đường di chuyển giữa 2 bước mô phỏng là `960 * 0.022 = 21.12 px`. Các thanh gỗ mỏng (độ dày 20px) hoặc các góc cạnh nhỏ của khối gạch có thể bị bước mô phỏng "nhảy cóc" qua (tunneling), dẫn đến tâm ngắm va chạm (Impact Reticle) hiển thị lệch vị trí so với điểm va chạm vật lý thực tế của quả trứng khi bay.
* **Giải pháp điều chỉnh:**
  Giảm bước thời gian xuống `dt = 0.014` kết hợp tăng số lượng bước lặp từ 76 lên 96 bước, hoặc sử dụng cơ chế kiểm tra đa điểm con (sub-stepping) khi vận tốc lớn hơn `600 px/s`.

---

## HỆ THỐNG 2: VẬT LÝ, KẾT CẤU CÔNG TRÌNH & CHỐNG LƠ LỬNG
**Các tệp liên quan:** [`scripts/destructibles/DestructibleBlock.gd`](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/DestructibleBlock.gd), [`scripts/destructibles/RollingBoulder.gd`](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/RollingBoulder.gd)

### 2.1. Hiện tượng hãm lực nhân tạo trong không trung (Mid-Air Damping Drag)
* **Hiện trạng & Triệu chứng:**
  Tại dòng 326-328 của [`DestructibleBlock.gd`](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/DestructibleBlock.gd):
  ```gdscript
  if speed < 32.0 and ang_speed < 1.4 and linear_velocity.y <= 35.0:
      linear_velocity *= 0.88
      angular_velocity *= 0.82
  ```
  Khi một khối gạch bị hất tung lên cao hoặc đẩy ngang bởi một vụ nổ, tại đỉnh đường cong quỹ đạo (nơi vận tốc rơi tự do `linear_velocity.y ≈ 0` và tốc độ tổng quát `< 32.0`), khối gạch bị dập tắt 12% vận tốc mỗi khung hình (`linear_velocity *= 0.88`). Điều này khiến khối gạch trông như bị "kẹt trong vũng bùn trên không" trong một phần tư giây trước khi trọng lực kéo nó tăng tốc vượt ngưỡng 35 px/s.
* **Nguyên nhân gốc rễ:**
  Điều kiện dập rung (`Anti-Jitter Snubber`) chưa kiểm tra xem khối gạch có đang tiếp xúc với bề mặt khác hay đang lơ lửng giữa không trung.
* **Giải pháp điều chỉnh:**
  Chỉ áp dụng `linear_velocity *= 0.88` khi khối gạch đang có tiếp xúc vật lý (`get_contact_count() > 0`) hoặc đang tựa trên một khối khác. Nếu không có tiếp xúc, phải thả tự do 100% theo gia tốc trọng lực tự nhiên.

---

### 2.2. Chi phí cấp phát bộ nhớ (GC Spike) từ hiệu ứng mảnh vỡ không dùng Object Pool
* **Hiện trạng & Triệu chứng:**
  Trong hàm `_spawn_flying_shards()` (dòng 720-749) và `_spawn_debris_dust_cloud()` (dòng 685-718):
  Mỗi khi một khối gạch bị vỡ vụn, mã nguồn khởi tạo từ 3 đến 6 nút `Sprite2D` mới độc lập kèm theo các `Tween` riêng biệt, sau đó gọi `queue_free()` sau 0.5 giây. Khi kích nổ một thùng thuốc nổ TNT hoặc Nuke khiến 15 khối gạch phát nổ dây chuyền trong cùng 1 giây, có tới 70-90 nút `Sprite2D` và hàng chục `Tween` được tạo ra rồi hủy liên tục. Trên các thiết bị Android tầm trung, hiện tượng thu gom rác (Garbage Collection) sẽ gây ra giật khung hình (frame drop) rõ rệt.
* **Giải pháp điều chỉnh:**
  Chuyển đổi toàn bộ hiệu ứng mảnh vụn sang `CPUParticles2D` (đã có sẵn `FractureFX` trong scene) bằng cách sử dụng kết cấu atlas hạt (Texture Sheet), hoặc xây dựng một mảng tĩnh chứa sẵn 16 Sprite mảnh vụn tái sử dụng (Node Pool).

---

### 2.3. Quét đệ quy kiểm tra nền móng có thể gây nghẽn CPU khi sập đổ hàng loạt (Recursive Ground Check Overhead)
* **Hiện trạng & Triệu chứng:**
  Hàm `_quick_check_grounded()` (dòng 370-410) sử dụng đệ quy độ sâu tới 5 tầng với 7 tia quét đáy cho mỗi khối:
  `var ratios = [-0.85, -0.70, -0.35, 0.0, 0.35, 0.70, 0.85]`
  Trong một pháo đài 4 tầng gồm 40 khối gạch, nếu khối tầng đáy bị phá hủy, hàng loạt khối phía trên sẽ đồng thời gọi đệ quy để tìm nền đất. Số lượng tia quét vật lý (`intersect_ray`) có thể vượt quá 150 tia trong một khung hình vật lý đơn lẻ.
* **Giải pháp điều chỉnh:**
  Thêm bộ nhớ đệm (cache) trạng thái nền móng theo nhịp vật lý: nếu khối đỡ bên dưới đã được xác nhận là vững chắc trong khung hình hiện tại (`Engine.get_physics_frames()`), khối bên trên tái sử dụng kết quả ngay lập tức mà không cần bắn thêm tia quét.

---

## HỆ THỐNG 3: QUÁI VẬT BÙNG NỔ & CƠ CHẾ ĐÈ ĐÈP
**Các tệp liên quan:** [`scripts/enemies/BunkerMonster.gd`](file:///d:/folder/tools/godot_demo/2/scripts/enemies/BunkerMonster.gd)

### 3.1. Thiếu sót định nghĩa phương thức `wake_up` đồng nhất
* **Hiện trạng & Triệu chứng:**
  Trong [`DestructibleBlock.gd`](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/DestructibleBlock.gd) (dòng 541), khi một khối thức giấc hoặc bị phá hủy, nó gọi:
  ```gdscript
  if ub.has_method("wake_up"):
      ub.wake_up(true)
  else:
      ub.freeze = false
      ub.set_deferred("freeze", false)
  ```
  Trong [`BunkerMonster.gd`](file:///d:/folder/tools/godot_demo/2/scripts/enemies/BunkerMonster.gd) (dòng 893), phương thức `wake_up(force: bool = false)` có tồn tại, nhưng chữ ký tham số và logic kiểm soát tĩnh lặng lúc đầu trận đôi khi bỏ qua việc đánh thức các thuộc tính physics liên quan nếu quái đang ở trạng thái `PINNED_UNDER_DEBRIS`.
* **Giải pháp điều chỉnh:**
  Chuẩn hóa giao diện (interface) `wake_up(force: bool)` đồng bộ trên tất cả các lớp RigidBody2D trong dự án (`DestructibleBlock`, `BunkerMonster`, `TNTBarrel`, `RollingBoulder`, `RescueCage`).

---

### 3.2. Sát thương nghiến đè liên tục (Continuous Crush) khi quái bị kẹt dưới khối nặng
* **Hiện trạng & Triệu chứng:**
  Tại hàm `_handle_continuous_crushing()` (dòng 995-1036):
  Logic phân biệt 2 trường hợp:
  1. Vật đè đang chuyển động/rung lắc (`b_speed > 8.0`): Gây sát thương DPS tỷ lệ theo tốc độ và khối lượng.
  2. Vật đè nằm tĩnh (`b_mass >= 1.6`): Gây sát thương tĩnh `24.0 * b_mass * delta`.
  Tuy nhiên, khi một khối gạch đã ngủ (`sleeping = true`) và quái vật cũng chuyển sang trạng thái ngủ, tín hiệu va chạm giữa hai vật thể ngủ có thể bị engine vật lý ngắt báo cáo để tiết kiệm tài nguyên. Điều này khiến quái vật dù bị đè dưới 3 tảng đá khổng lồ nhưng không bị trừ hết máu cho đến khi có một vụ nổ khác kích hoạt lại va chạm.
* **Giải pháp điều chỉnh:**
  Khi phát hiện quái vật đang bị vật nặng đè lên (`is_currently_pinned = true`), đặt `can_sleep = false` cho quái vật và duy trì bộ đếm nhịp sát thương áp lực tĩnh cho đến khi quái bị tiêu diệt hoàn toàn.

---

## HỆ THỐNG 4: THUỐC NỔ, ĐỊA HÌNH & HIỆU ỨNG THẾ GIỚI
**Các tệp liên quan:** [`scripts/core/CampaignLevel.gd`](file:///d:/folder/tools/godot_demo/2/scripts/core/CampaignLevel.gd), [`scripts/destructibles/TNTBarrel.gd`](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/TNTBarrel.gd), [`scripts/destructibles/UpdraftVent.gd`](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/UpdraftVent.gd)

### 4.1. Ống phản lực khí lưu gây bẫy lơ lửng vô tận (Updraft Equilibrium Hover Trap)
* **Hiện trạng & Triệu chứng:**
  Trong [`UpdraftVent.gd`](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/UpdraftVent.gd) (dòng 30-37):
  ```gdscript
  func _physics_process(_delta: float) -> void:
      for i in range(overlapping_bodies.size() - 1, -1, -1):
          var body = overlapping_bodies[i]
          ...
          elif not body.freeze:
              body.apply_central_force(Vector2(0, -wind_force))
  ```
  Lực đẩy `wind_force` cố định ở mức `1400.0`. Với các vật thể có khối lượng xấp xỉ `1.43 kg` (như trứng thường hoặc mảnh vụn trung bình), lực đẩy hướng lên triệt tiêu hoàn toàn gia tốc trọng lực `980 px/s²` (`1400 / 1.43 ≈ 980`). Vật thể sẽ bị "treo" lơ lửng bất động ở lưng chừng ống gió, không rơi xuống mà cũng không bay thoát ra khỏi vùng quạt gió, làm kéo dài thời gian kết thúc màn chơi vô ích.
* **Giải pháp điều chỉnh:**
  1. Thêm độ nhiễu loạn ngẫu nhiên theo trục X (`randf_range(-180.0, 180.0)`) để thổi bạt vật thể văng ra khỏi miệng ống gió.
  2. Áp dụng giới hạn trần vận tốc bay lên và suy giảm lực đẩy theo độ cao của vùng quạt gió (Gradient Force: 100% lực ở đáy, giảm dần về 20% ở miệng thoát trên cùng).

---

### 4.2. Lộ viền xám ngoài không gian nền khi góc quay Camera thu phóng cực đại (Camera Zoom Boundary Margin)
* **Hiện trạng & Triệu chứng:**
  Tại [`CampaignLevel.gd`](file:///d:/folder/tools/godot_demo/2/scripts/core/CampaignLevel.gd) (dòng 279):
  `var target_zoom_val = clamp(540.0 / (cav_width + 60.0), 0.38, 1.0)`
  Trên các dòng điện thoại màn hình dài (tỷ lệ 20:9 hoặc 21:9), khi zoom hạ xuống `0.38`, chiều cao khung nhìn camera thực tế mở rộng lên tới hơn `2500 px`. Đỉnh bầu trời và đáy hầm đất của các đa giác `bg_sky` (`-800px`) và `bg_dirt` (`floor_y + 800px`) có thể chạm mép hoặc để lộ khoảng đen/xám trống ngoài bản đồ.
* **Giải pháp điều chỉnh:**
  Mở rộng tọa độ các đa giác nền:
  - Bầu trời: Từ `-800px` mở rộng lên `-2000px`.
  - Đất ngầm: Từ `floor_y + 800px` mở rộng xuống `floor_y + 2000px`.
  - Hai bên sườn: Mở rộng thêm `±2500px` ngoài vách hang.

---

## HỆ THỐNG 5: TRỨNG VẬT LÝ & KỸ NĂNG CHẠM GIỮA KHÔNG TRUNG
**Các tệp liên quan:** [`scripts/projectiles/BaseEgg.gd`](file:///d:/folder/tools/godot_demo/2/scripts/projectiles/BaseEgg.gd), [`BombEgg.gd`](file:///d:/folder/tools/godot_demo/2/scripts/projectiles/BombEgg.gd), [`DrillEgg.gd`](file:///d:/folder/tools/godot_demo/2/scripts/projectiles/DrillEgg.gd), [`ClusterEgg.gd`](file:///d:/folder/tools/godot_demo/2/scripts/projectiles/ClusterEgg.gd), [`BlackHoleEgg.gd`](file:///d:/folder/tools/godot_demo/2/scripts/projectiles/BlackHoleEgg.gd)

### 5.1. Nhận diện vùng bấm kích hoạt kỹ năng giữa không trung dễ bị chạm nhầm (Tap-in-Flight False Trigger)
* **Hiện trạng & Triệu chứng:**
  Hàm lọc sự kiện `BaseEgg.is_valid_airborne_tap(event)` (dòng 54-63):
  ```gdscript
  if pos.y < 110.0 or (pos.y > 870.0 and pos.x > 350.0):
      return false
  ```
  Tọa độ `y < 110.0` và `y > 870.0` được hardcode theo độ phân giải chuẩn `540x960`. Khi chạy trên màn hình máy tính bảng hoặc điện thoại gập với tỷ lệ 4:3 hoặc 16:10, thanh TopBar hoặc khay trứng có thể nằm ngoài các dải tọa độ này. Người chơi khi chạm vào các nút chức năng giao diện có thể vô tình kích hoạt nổ bom hoặc kích hoạt tên lửa khoan khi quả trứng đang bay.
* **Giải pháp điều chỉnh:**
  Đặt thuộc tính `mouse_filter = Control.MOUSE_FILTER_STOP` trên tất cả các thùng chứa giao diện của CanvasLayer HUD, và trong `_unhandled_input()` của quả trứng chỉ phản hồi khi sự kiện chạm không bị giao diện người dùng nuốt (`event.is_echo() == false` và không trúng Control nào).

---

### 5.2. Hố đen Vũ trụ không suy giảm lực đẩy sau nổ (BlackHole Supernova Impulse Attenuation)
* **Hiện trạng & Triệu chứng:**
  Trong [`BlackHoleEgg.gd`](file:///d:/folder/tools/godot_demo/2/scripts/projectiles/BlackHoleEgg.gd) (dòng 139):
  Khi hố đen sụp đổ thành siêu tân tinh (Supernova), toàn bộ các khối nằm trong bán kính 240px đều chịu một xung lực đẩy cố định `dir * 1400.0`. Khối nằm ở rìa ngoài rìa (239px) nhận lực xô ngang bằng với khối nằm sát tâm hố đen, phá vỡ cảm giác vật lý lan tỏa sóng xung kích.
* **Giải pháp điều chỉnh:**
  Tính toán hệ số suy giảm khoảng cách:
  `var falloff = 1.0 - clamp(dist / vortex_radius, 0.0, 0.85)`
  `col.apply_central_impulse(dir * (1400.0 * falloff))`

---

## HỆ THỐNG 6: GIAO DIỆN UI/UX, ĐIỀU HƯỚNG & CÔNG THÁI HỌC MOBILE
**Các tệp liên quan:** [`scripts/ui/GameHUD.gd`](file:///d:/folder/tools/godot_demo/2/scripts/ui/GameHUD.gd), [`scripts/ui/JuicyButton.gd`](file:///d:/folder/tools/godot_demo/2/scripts/ui/JuicyButton.gd), [`ShopModal.gd`](file:///d:/folder/tools/godot_demo/2/scripts/ui/ShopModal.gd), [`SettingsModal.gd`](file:///d:/folder/tools/godot_demo/2/scripts/ui/SettingsModal.gd)

### 6.1. Thiếu xử lý sự kiện Back Android trên các cửa sổ phụ (Modal Back Trap)
* **Hiện trạng & Triệu chứng:**
  Trong [`ShopModal.gd`](file:///d:/folder/tools/godot_demo/2/scripts/ui/ShopModal.gd), không có phương thức `_notification(what)` lắng nghe `NOTIFICATION_WM_GO_BACK_REQUEST`. Mặc dù `MainMenu.gd` có gọi `shop_modal_instance.queue_free()`, nhưng thao tác này hủy ngang đối tượng mà không chạy hoạt họa đóng đàn hồi (`_on_close_pressed`), đồng thời nếu mở Shop từ các màn hình khác thì nút Back của điện thoại hoàn toàn tê liệt.
* **Giải pháp điều chỉnh:**
  Tích hợp phương thức chuẩn `_notification(what)` và `_unhandled_input(event)` trên toàn bộ các Modal (`ShopModal`, `DailyWheelModal`, `SettingsModal`) để tự đóng mượt mà bằng phím Escape hoặc nút Back của hệ điều hành.

---

### 6.2. Nút bấm phẳng (Flat Button) thiếu độ dày phản hồi khi bấm nhanh (Debounce & Tactile Feel)
* **Hiện trạng & Triệu chứng:**
  Trong [`JuicyButton.gd`](file:///d:/folder/tools/godot_demo/2/scripts/ui/JuicyButton.gd), bộ lọc chống bấm nhầm (Debounce) tại dòng 173 (`PRESS_DEBOUNCE_MS = 250`) hoạt động tốt, tuy nhiên ở các nút chuyển đổi màn chơi trong `LevelSelect.gd`, các sự kiện `button_down` và `button_up` sử dụng animation tween độc lập mà không đồng bộ với `JuicyButton`.
* **Giải pháp điều chỉnh:**
  Kế thừa hoặc chuyển toàn bộ các thẻ màn chơi (Level Cards) và nút điều hướng thế giới sang sử dụng kiến trúc chuẩn của `JuicyButton`.

---

## HỆ THỐNG 7: VÒNG ĐỜI HỆ ĐIỀU HÀNH, NÚT BACK ANDROID & LƯU TRỮ NGUYÊN TỬ
**Các tệp liên quan:** [`scripts/core/SaveManager.gd`](file:///d:/folder/tools/godot_demo/2/scripts/core/SaveManager.gd), [`scripts/core/GameManager.gd`](file:///d:/folder/tools/godot_demo/2/scripts/core/GameManager.gd)

### 7.1. Cải tiến độ an toàn tối đa của cơ chế ghi tệp nguyên tử (Crash-Safe Atomic Write)
* **Hiện trạng & Triệu chứng:**
  Trong [`SaveManager.gd`](file:///d:/folder/tools/godot_demo/2/scripts/core/SaveManager.gd) (dòng 96-98):
  Mã nguồn thực hiện:
  ```gdscript
  if dir.file_exists(SAVE_PATH):
      dir.remove(SAVE_PATH)
  var err = dir.rename(TEMP_PATH, SAVE_PATH)
  ```
  Nếu hệ điều hành Android kill tiến trình do cạn pin đúng vào mili-giây nằm giữa `dir.remove(SAVE_PATH)` và `dir.rename(TEMP_PATH, SAVE_PATH)`, tệp `savegame.json` sẽ bị biến mất. Mặc dù hệ thống đã có cơ chế tự phục hồi từ `.bak`, nhưng việc xóa tệp trước khi đổi tên là không cần thiết trên hầu hết các nền tảng POSIX.
* **Giải pháp điều chỉnh:**
  Kiểm tra tính toàn vẹn của tệp `.tmp` trước khi sao chép sang `.bak`, và nếu lệnh đổi tên gặp lỗi thì tự động khôi phục ngay lập tức từ bản ghi nhớ trong bộ nhớ RAM (`save_data`).

---

## BẢNG MA TRẬN MỨC ĐỘ ƯU TIÊN VÀ LỘ TRÌNH THỰC HIỆN

| Mã số | Hạng mục cần điều chỉnh | Mức độ | Tệp nguồn cần can thiệp | Trạng thái đề xuất |
| :--- | :--- | :---: | :--- | :---: |
| **FIX-01** | Triệt tiêu giật lật 180° khi kéo ngón tay gần trục ngang; làm mượt vùng hủy bắn | **Cực cao** | `ChickenBomber.gd` | Sẵn sàng triển khai |
| **FIX-02** | Đồng bộ hóa sải cánh bay của Gà theo độ rộng mở rộng của Hang động (World 2-10) | **Cực cao** | `ChickenBomber.gd`, `CampaignLevel.gd` | Sẵn sàng triển khai |
| **FIX-03** | Khử lực hãm nhân tạo trên không (`linear_velocity *= 0.88`) khi khối gạch rơi tự do | **Cao** | `DestructibleBlock.gd` | Sẵn sàng triển khai |
| **FIX-04** | Xử lý triệt để bẫy lơ lửng vô tận trong ống phản lực khí lưu (`UpdraftVent.gd`) | **Cao** | `UpdraftVent.gd` | Sẵn sàng triển khai |
| **FIX-05** | Tăng độ mịn bước mô phỏng quỹ đạo đạn (`dt = 0.014`), chống lọt tia va chạm | **Trung bình** | `ChickenBomber.gd` | Sẵn sàng triển khai |
| **FIX-06** | Mở rộng đa giác nền bầu trời & lòng đất chống lộ viền trống khi camera thu nhỏ | **Trung bình** | `CampaignLevel.gd` | Sẵn sàng triển khai |
| **FIX-07** | Chuẩn hóa toàn diện xử lý nút Back Android & phím Escape trên toàn bộ các Modal | **Trung bình** | `ShopModal.gd`, `DailyWheelModal.gd` | Sẵn sàng triển khai |
| **FIX-08** | Tối ưu hóa mảnh vỡ bay và bụi khói, hạn chế tạo Node mới tránh giật lag mobile | **Đánh bóng** | `DestructibleBlock.gd` | Sẵn sàng triển khai |
| **FIX-09** | Thêm hệ số suy giảm lực nổ siêu tân tinh hố đen theo khoảng cách vật lý | **Đánh bóng** | `BlackHoleEgg.gd` | Sẵn sàng triển khai |
| **FIX-10** | Đồng bộ hiển thị âm lượng giữa thanh trượt cài đặt và trạng thái lưu trữ | **Đánh bóng** | `SettingsModal.gd`, `SoundManager.gd` | Sẵn sàng triển khai |

---
*Tài liệu được lập bởi Antigravity AI - Bộ phận Kiểm toán & Kỹ thuật Game Godot 4.*
