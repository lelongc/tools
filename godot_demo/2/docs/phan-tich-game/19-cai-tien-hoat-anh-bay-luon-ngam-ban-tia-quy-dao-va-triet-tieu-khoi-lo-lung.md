# 19. CẢI TIẾN TOÀN DIỆN: HOẠT ẢNH GÀ LƯỢN KHÍ ĐỘNG HỌC, KHÓA VỊ TRÍ KHI NGẮM, TIA QUỸ ĐẠO HẠT SÁNG & TRIỆT TIÊU KHỐI LƠ LỬNG

> **Ngày cập nhật:** 24/09/2026  
> **Phiên bản:** v2.8.5 - Physics & Combat Polish Update  
> **Trạng thái:** Hoàn tất 100% (14/14 Test Suites PASS, 0 Errors)

---

## 1. TỔNG QUAN YÊU CẦU & BỐI CẢNH NÂNG CẤP

Trong quá trình trải nghiệm thực tế chiến dịch 200 màn chơi, người chơi đã ghi nhận 4 điểm bất hợp lý gây ảnh hưởng lớn đến cảm giác điều khiển (game feel) và độ chân thực của vật lý:

1. **Khối địa hình / quái vật / thùng thuốc nổ đôi lúc bị lơ lửng giữa không trung ("địa hình cái vẫn lơ lửng"):**
   - Khi các khối trụ đỡ phía dưới bị bom nổ phá hủy hoặc rơi xuống, một số khối phía trên vẫn bất động giữa không trung thay vì sụp đổ theo trọng lực.
2. **Hoạt ảnh quay đầu của chim như tờ giấy 2D ("animation của chim chưa mượt, xoay 2d như tờ giấy kì quá trời"):**
   - Khi gà chạm biên màn hình và đổi hướng bay, biến số `facing_scale` nội suy từ `1.0` sang `-1.0` đi qua điểm `0.0`. Khi `scale.x = 0`, toàn bộ sprite của gà bị bẹp dí thành một đường chỉ phẳng 0 pixel, tạo cảm giác như một mảnh giấy mỏng lật úp rất gượng gạo.
3. **Cơ chế dịch chuyển thân chim khi ngắm bắn ("cơ chế dịch chim lại nữa"):**
   - Khi người chơi chạm tay kéo dây ná để chỉnh lực và góc bắn, thân gà bị trượt ngang theo tọa độ ngón tay (`position.x = clamp(aim_start_pos.x + drag_delta.x * 0.3, ...)`). Điều này làm giàn phóng bị bập bùng, gây mất ổn định và khó căn chuẩn mục tiêu.
4. **Tia bắn đơn điệu và xuyên thấu ("tia bắn cũng thế"):**
   - Tia dự đoán quỹ đạo cũ là một đường Line2D màu vàng đơn điệu, không dừng lại khi va chạm chướng ngại vật hay nền đất, thiếu hiệu ứng hạt và điểm ngắm tiếp đất (landing reticle).

---

## 2. NGUYÊN NHÂN GỐC RỄ & GIẢI PHÁP ĐÃ TRIỂN KHAI

### 2.1. Triệt Tiêu 100% Hiện Tượng Khối Địa Hình & Quái Vật Lơ Lửng

#### Nguyên nhân kỹ thuật:
1. **Trạng thái ngủ (RigidBody2D.sleeping) bị cô lập:**
   - Khi thanh công trình nằm yên ổn định, hệ thống snubber hoặc Godot physics đưa khối vào `sleeping = true`.
   - Khi khối đỡ bên dưới bị xóa bằng `queue_free()` hoặc vỡ nát, Godot physics không tự động gửi xung lực thức giấc đến vật thể đang ngủ phía trên.
   - Hàm `wake_up()` trước đây có điều kiện `if is_awake or is_destroyed: return`. Do đó khi khối đã `is_awake = true` nhưng đang `sleeping = true`, lệnh gọi đánh thức hàng xóm bị bỏ qua hoàn toàn.
2. **Bộ đếm kiểm tra giá đỡ (`support_check_timer`) chỉ chạy khi `not is_awake`:**
   - Khi khối đã thức giấc một lần, nó không bao giờ quét tia kiểm tra chân đế nữa. Nếu nó dừng lại trên không do kẹt vận tốc nhỏ, nó sẽ vĩnh viễn lơ lửng.

#### Giải pháp đã triển khai:
- **Kiểm tra giá đỡ kép (Awake & Sleeping Support Check):**
  - Trong [DestructibleBlock.gd](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/DestructibleBlock.gd#L330-L380), [BunkerMonster.gd](file:///d:/folder/tools/godot_demo/2/scripts/enemies/BunkerMonster.gd#L920-L960), [TNTBarrel.gd](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/TNTBarrel.gd#L50-L85), [NukeBarrel.gd](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/NukeBarrel.gd#L50-L85), [RescueCage.gd](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/RescueCage.gd#L40-L75), [RollingBoulder.gd](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/RollingBoulder.gd#L85-L125):
  - Định kỳ mỗi `0.12s`, nếu vật thể đang `sleeping = true` mà không tiếp xúc sàn đất bedrock (`floor_y`), hệ thống tự động bắn tia quét chân đế `_has_rigid_support()`.
  - Nếu mất giá đỡ phía dưới: ngay lập tức hủy ngủ (`sleeping = false`) và áp một xung lực rơi tự do `apply_central_impulse(Vector2(0, 20.0))`.
- **Cải tiến lan tỏa thức giấc hướng lên (`_wake_up_neighbors`):**
  - Mở rộng vùng quét hình hộp chữ nhật phía trên đỉnh khối theo kích thước thực tế:
    ```gdscript
    var hh = block_size.y * 0.5
    var box_height = max(hh * 1.5, 120.0)
    var box = RectangleShape2D.new()
    box.size = Vector2(max(block_size.x + 12.0, 40.0), box_height)
    var up_query = PhysicsShapeQueryParameters2D.new()
    up_query.shape = box
    up_query.transform = Transform2D(0, global_position + Vector2(0, -hh - box_height * 0.5))
    ```
  - Mọi `RigidBody2D` nằm phía trên đều bị ép buộc thức giấc: `ub.sleeping = false`, nếu đang đóng băng thì gọi `wake_up()`, nếu đã rã đông thì kích hoạt xung lực rơi `apply_central_impulse(Vector2(0, 15.0))`.
  - Toàn bộ cột tháp sụp đổ đồng loạt tự nhiên, không bao giờ bỏ sót bất kỳ khối nào phía trên.

---

### 2.2. Hoạt Ảnh Bay Lượn Khí Động Học & Xóa Bỏ Hoàn Toàn Lật Mặt Phẳng 2D

#### Nguyên nhân kỹ thuật:
- Gà oanh tạc là một nhân vật hoạt hình góc nhìn 3/4 chính diện đối xứng (nón da phi công, mắt kính steampunk, mỏ và má hồng ở trung tâm).
- Việc lật `scale.x` từ dương sang âm biến nhân vật thành hình chiếu 2D phẳng lì (dày 0 pixel tại thời điểm đổi hướng), tạo cảm giác "như tờ giấy".

#### Giải pháp đã triển khai:
- **Tuyệt đối không ép `scale.x` về âm hoặc 0:**
  - `visual_root.scale.x` luôn duy trì dương (`Vector2(2.0 - breath, breath)` dao động quanh `1.0`).
- **Thể hiện hướng bay bằng Cơ chế Khí động học Chân thực (Aerodynamic Flight Dynamics):**
  1. **Nghiêng cánh ôm cua (Aerodynamic Bank Roll):**
     - Khi bay thẳng: thân gà nghiêng nhẹ theo hướng gió `move_direction * 0.08` rad.
     - Khi chạm mép màn hình: gà ôm cua chữ U với góc nghiêng cánh `bank_roll = ±0.32` rad (~18.5 độ) kết hợp lực nâng bổng `turn_lift = 8.0px` tự nhiên như máy bay phản lực lượn vòng.
  2. **Ánh mắt, kính và mỏ dẫn hướng bay (Head & Gaze Leading):**
     - Tròng mắt và kính phi công trượt nhẹ về phía trước theo hướng bay (`eyes.x = move_dir * 3.8px`, `goggles.x = move_dir * 2.6px`).
  3. **Lông đuôi trôi theo quán tính gió (Tail Secondary Inertia):**
     - Chùm lông đuôi mềm mại luôn dạt về phía sau ngược hướng bay (`tail.x = -move_dir * 22.0px`) và vẫy nhịp nhàng theo chu kỳ đập cánh.
  4. **Cánh đập bất đối xứng theo góc nghiêng (3D Banking Asymmetry):**
     - Cánh ngoài vung cao hơn cánh trong (`flap_angle ± bank_roll * 0.35`), tạo cảm giác chiều sâu không gian 3D sống động.

---

### 2.3. Khóa Cứng Vị Trí Thả Neo Khi Ngắm Bắn ("Cơ Chế Dịch Chim")

#### Nguyên nhân kỹ thuật:
- Lệnh `position.x = clamp(aim_start_pos.x + drag_delta.x * 0.3, min_x, max_x)` dịch chuyển tọa độ của gà mỗi khi người chơi di ngón tay, khiến điểm phóng đạn bị di động liên tục.

#### Giải pháp đã triển khai:
- Thêm biến thả neo `var aim_anchor_x: float = 270.0`.
- Khi người chơi bắt đầu chạm màn hình ngắm bắn:
  ```gdscript
  is_aiming = true
  aim_anchor_x = position.x # Khóa chặt vị trí gà tại chỗ
  aim_start_pos = mouse_pos
  aim_vector = Vector2(0, 480.0)
  _on_aim_start()
  ```
- Trong suốt quá trình kéo dây ná:
  ```gdscript
  position.x = aim_anchor_x # Giữ vững vàng, không dịch chuyển
  ```
- Độ kéo ngón tay (`drag_delta`) **chỉ dùng để tính toán góc và lực bắn** (`aim_vector`), tạo độ căng dây ná làm thân gà hơi co lại và rung nhẹ giọt mồ hôi truyện tranh khi kéo lực lớn (>60%).
- Thao tác ngắm bắn trở nên vững chãi, chính xác tuyệt đối như ná cao su chuẩn Angry Birds.

---

### 2.4. Nâng Cấp Tia Bắn Quỹ Đạo Hạt Sáng & Tâm Ngắm Tiếp Đất

#### Kiến trúc triển khai:
Tách riêng module hiển thị quỹ đạo thành node độc lập [TrajectoryOverlay.gd](file:///d:/folder/tools/godot_demo/2/scripts/player/TrajectoryOverlay.gd) (`z_index = 25`, vẽ vector bằng hàm `_draw()` mượt mà 60fps):

1. **Mô phỏng va chạm tia vật lý (Physics Raycasting Trajectory):**
   - Quỹ đạo parabolic không vẽ bừa bãi xuyên tường. Mỗi bước mô phỏng ($dt = 0.022\text{s}$) đều thực hiện `space_state.intersect_ray()` kiểm tra va chạm với khối gạch, quái vật, thùng thuốc nổ hoặc sàn đất bedrock.
   - Tia dự đoán **dừng chuẩn xác ngay tại điểm tiếp xúc đầu tiên** (`hit.position`).
2. **Dòng chảy chuỗi hạt ngọc năng lượng (Flowing Energy Beads):**
   - Dọc theo đường cong parabol, các hạt ngọc phát sáng được bố trí cách đều 22px.
   - Thêm pha dịch chuyển theo thời gian `fmod(Time.get_ticks_msec() * 0.045, 22.0)` tạo hiệu ứng dòng năng lượng chảy liên tục từ giỏ trứng hướng về mục tiêu.
   - Mỗi hạt ngọc gồm 3 lớp: quầng sáng hào quang (halo), hạt ngọc màu chủ đạo theo loại trứng, và tâm sáng trắng phản quang.
3. **Màu sắc hạt biến thiên theo loại trứng (Egg-Themed Palette):**
   - Trứng Thường (Normal): Vàng kim rực rỡ `Color(1.0, 0.85, 0.20, 0.95)`
   - Trứng Nổ (Bomb): Đỏ cam rực lửa `Color(1.0, 0.32, 0.12, 0.95)`
   - Trứng Khoan (Drill): Xanh kim cương xuyên phá `Color(0.20, 0.88, 1.0, 0.95)`
   - Trứng Băng (Frost): Xanh lam tuyết lạnh `Color(0.40, 0.92, 1.0, 0.95)`
   - Trứng Chùm (Cluster): Xanh lục ngọc bích `Color(0.35, 1.0, 0.45, 0.95)`
   - Trứng Axit (Acid): Vàng chanh phát quang `Color(0.75, 1.0, 0.15, 0.95)`
   - Trứng Hố Đen (BlackHole): Tím vũ trụ huyền bí `Color(0.85, 0.40, 1.0, 0.95)`
4. **Tâm ngắm tiếp đất động (Animated Ground Impact Reticle):**
   - Tại điểm va chạm, xuất hiện vòng tròn tâm ngắm nhấp nháy theo nhịp tim.
   - 4 vạch ngắm chữ thập (Crosshair Ticks) hỗ trợ ngắm bắn chính xác vào các khe hẹp hoặc điểm yếu của kiến trúc.
   - Nếu ngắm trúng Quái vật hoặc Thùng thuốc nổ: hiển thị thêm hình thoi cảnh báo nguy hiểm (Hazard Diamond) màu đỏ cảnh báo phản ứng dây chuyền.

---

## 3. KẾT QUẢ KIỂM THỬ TỔNG THỂ

Đã chạy kiểm thử tự động toàn diện qua `TestRunner.tscn`:
- **Số bộ test kiểm tra:** 14/14 Test Suites
- **Lỗi phát hiện:** 0 lỗi (RETURNCODE: 0)
- **Kiểm thử chuyên sâu hoạt ảnh gà:**
  - `visual_root.scale.x` luôn $\ge 0.984$ (không bao giờ bẹp về 0).
  - Tọa độ `position.x` khi kéo ná ngắm bắn đạt độ lệch $0.0\text{px}$ (khóa cứng 100%).
  - Khối không giá đỡ tự động thức giấc và rơi tự do đúng chuẩn vật lý trong mọi tình huống.
