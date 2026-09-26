# BÁO CÁO KỸ THUẬT: KHẮC PHỤC TRIỆT ĐỂ LỖI ĐỊA HÌNH VÀ CÔNG TRÌNH LƠ LỬNG TRONG KHÔNG TRUNG

> **Phiên bản:** Godot 4.7.1 Stable  
> **Phạm vi tác động:** Toàn bộ 200 màn chơi (10 Thế Giới), Hệ thống kết cấu hầm ngầm (`DestructibleBlock`, `RollingBoulder`, `BunkerMonster`, `TNTBarrel`, `NukeBarrel`, `RescueCage`).  
> **Trạng thái:** Hoàn tất 100% - Đã vượt qua toàn bộ 29 Test Suites (0 Lỗi).

---

## 1. Hiện Tượng Thực Tế & Ảnh Chụp Lỗi (Level 6)

Khi người chơi bắn trứng phá hủy thanh dầm tầng 2 (Center Citadel) hoặc dầm tầng 1 (West Outpost):
- Thanh dầm gỗ nằm ngang biến mất sau vụ nổ, để lại một khoảng trống không khí dày đúng 24px giữa trụ gỗ bên dưới và trụ đá bên trên.
- Tuy nhiên, toàn bộ vòm đá phía trên gồm: **2 Cột trụ đá (Stone Pillars), 1 Dầm đá ngang (Stone Beam), 2 Gờ đá (Curbs), và Tảng đá lăn (Rolling Boulder)** bị **đóng băng 100%, lơ lửng giữa không trung** mà không hề rơi xuống hay thức giấc.
- Hiện tượng tương tự xảy ra ở tháp tiền đồn phía Tây khi dầm chân tháp bị vỡ.

---

## 2. Nguyên Nhân Gốc Rễ (Root Cause Analysis)

Sau khi phân tích ma trận tọa độ, raycast và vòng lặp vật lý, phát hiện 4 lỗ hổng chí mạng liên hoàn:

### Nguyên nhân 1: Chiều sâu Raycast quét đáy quá dài (26.0px) gây "nhảy cóc" qua khe hở
- Trong `_has_rigid_support()` cũ:
  ```gdscript
  var ray_length = 26.0
  ray_query.from = pt # (cách đáy 4px bên trong)
  ray_query.to = pt + Vector2(0, ray_length) # Vượt qua đáy khối tới 22px!
  ```
- Dầm chịu lực trong game có độ dày chuẩn là **24.0px**.
- Hai trụ đá tầng trên có độ rộng 28px và tâm nằm lệch so với trụ gỗ bên dưới, tạo ra vùng chồng lấn ngang 12px.
- Khi dầm gỗ 24px bị nổ biến mất, đáy trụ đá cách đỉnh trụ gỗ bên dưới đúng 24px.
- Tia quét sâu tới 22px cộng với dung sai physics đã **chạm vào đỉnh trụ gỗ bên dưới khoảng trống rỗng**, khiến khối đá nhầm tưởng mình "vẫn đang tiếp xúc vững chắc trên bệ đỡ" và không kích hoạt rơi!

### Nguyên nhân 2: Bẫy phụ thuộc vòng lặp & Thiếu kiểm tra liên kết chạm đất (Bedrock Grounding Chain)
- Khối dầm đá phía trên quét tia xuống gặp 2 trụ đá.
- 2 trụ đá đang ở trạng thái ngủ (`sleeping = true` hoặc `freeze = true`).
- Logic cũ kiểm tra: Nếu vật thể bên dưới là `DestructibleBlock` và chưa bị vỡ (`not is_destroyed`), đồng thời không có vận tốc rơi lớn (`linear_velocity.y <= 10.0`), thì **mặc nhiên coi đó là bệ đỡ hợp lệ**!
- Vì vậy, một khối lơ lửng nằm trên một khối lơ lửng khác sẽ tự coi nhau là bệ đỡ vững chắc, tạo thành một hệ kết cấu vòm treo vĩnh viễn trên bầu trời.

### Nguyên nhân 3: Hộp quét thức giấc lân cận quá nông (Chỉ cao 36px)
- Trong hàm `_wake_up_neighbors()` cũ:
  ```gdscript
  var box_height = max(hh + 18.0, 36.0)
  ```
- Hộp quét chỉ bao phủ 36px phía trên khối bị phá hủy.
- Trong khi đó, một cột trụ chịu lực có chiều cao từ **80px đến 120px**!
- Khi dầm tầng dưới bị vỡ, hộp quét 36px chỉ chạm tới 1/3 phần đáy của trụ, **hoàn toàn không chạm tới thanh dầm đá tầng 3 (cách 92px), gờ đá (cách 116px), hay tảng đá lăn (cách 144px)**.
- Do đó, các khối tầng 3 và tảng đá trên đỉnh vẫn giữ nguyên `freeze = true` (Static Immovable), không bao giờ nhận được lệnh đánh thức!

### Nguyên nhân 4: Bộ dập rung (Settling Snubber) ép khối ngủ cưỡng bức ngay tại Frame 0
- Trong `_physics_process`:
  ```gdscript
  if (micro_jitter_timer > 0.12 or (speed < 3.5 and ang_speed < 0.15)) and (get_contact_count() > 0 or global_position.y >= floor_y - 20.0):
      sleeping = true
  ```
- Khi vừa thức giấc (`is_awake = true`), vận tốc ban đầu là `0.0` (`speed < 3.5` thỏa mãn ngay lập tức).
- Cột trụ đá tiếp xúc với dầm đá bên trên nó (`get_contact_count() > 0` thỏa mãn ngay lập tức).
- Ngay trong Frame đầu tiên (0.016 giây), khối bị ép vào trạng thái `sleeping = true` trước cả khi trọng lực kịp kéo nó di chuyển!

---

## 3. Các Biện Pháp Kỹ Thuật Đã Triển Khai

### 3.1. Chuẩn hóa độ sâu tia quét tiếp xúc bề mặt (Raycast Surface Contact)
- Giảm độ sâu tia quét từ **26.0px xuống đúng 8.0px**:
  - Điểm xuất phát: `to_global(Vector2(x, hh - 2.0))` (2px bên trong khối).
  - Điểm kết thúc: `hh + 6.0` (chỉ thò ra ngoài đáy đúng 6.0px để bắt tiếp xúc bề mặt).
  - Bất kỳ khoảng hở nào lớn hơn 6.0px (bao gồm khoảng trống 24px của dầm bị vỡ) đều được xác định chính xác là **không khí rỗng (Empty Air)**.
- Cập nhật đồng bộ trên: [DestructibleBlock.gd](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/DestructibleBlock.gd), [RollingBoulder.gd](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/RollingBoulder.gd), [BunkerMonster.gd](file:///d:/folder/tools/godot_demo/2/scripts/enemies/BunkerMonster.gd), [TNTBarrel.gd](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/TNTBarrel.gd), [NukeBarrel.gd](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/NukeBarrel.gd), [RescueCage.gd](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/RescueCage.gd).

### 3.2. Thuật toán kiểm tra liên kết chạm đất đa tầng (`_quick_check_grounded`)
- Bổ sung hàm kiểm tra liên kết chạm đất đệ quy có bảo vệ chống lặp (`depth <= 5`, `visited array`):
  ```gdscript
  func _quick_check_grounded(visited: Array = [], depth: int = 0) -> bool:
      if is_destroyed: return false
      var floor_y = GameManager.current_floor_y if has_node("/root/GameManager") else 840.0
      var hh = block_size.y * 0.5
      if (global_position.y + hh) >= (floor_y - 6.0):
          return true # Chạm đất bedrock
      # Quét tia xuống khối bên dưới, kiểm tra xem khối bên dưới có chạm đất hay không
  ```
- Khối B bên dưới chỉ được coi là bệ đỡ hợp lệ nếu chuỗi kết cấu bên dưới nó cuối cùng chạm tới mặt đất `floor_y` hoặc `StaticBody2D`. Nếu khối B lơ lửng mất gốc, `_has_rigid_support()` lập tức trả về `false`.

### 3.3. Quét thức giấc toàn cột kết cấu 550px (`Column Cascade Wake-Up`)
- Mở rộng hộp quét trong `_wake_up_neighbors()` từ 36px lên **550.0px** (bao trùm từ mặt trên của khối bị vỡ lên thẳng trần hang ngầm):
  ```gdscript
  var box_height = 550.0
  var box_width = max(c_size.x + 24.0, 56.0)
  ```
- Khi một thanh dầm hoặc trụ ở tầng dưới bị phá hủy, **toàn bộ các tầng bên trên trong cột dọc (trụ, dầm, gờ đá, tảng đá lăn, quái vật, thùng thuốc nổ)** đều lập tức nhận lệnh `wake_up(true)` và `freeze = false`, xóa bỏ hoàn toàn hiện tượng đóng băng cục bộ.

### 3.4. Loại bỏ bẫy ngủ sớm & Rà soát bệ đỡ liên tục
- Sửa đổi điều kiện cho ngủ trong `_physics_process`:
  - Khối chỉ được phép ngủ khi đã ổn định vận tốc trong ít nhất **0.18 giây** (`micro_jitter_timer > 0.18` thay vì 0.0s).
  - Bắt buộc phải có bệ đỡ chạm đất vững chắc (`(global_position.y >= floor_y - 20.0) or _has_rigid_support()`).
  - Nếu đang ngủ mà bệ đỡ bên dưới sụp đổ, bộ đếm timer (0.12s) sẽ phát hiện và ngay lập tức đánh thức khối: `sleeping = false; freeze = false; set_deferred("freeze", false)`.

---

## 4. Kiểm Thử & Xác Nhận (Verification)

1. **Test 28 (Anti-Floating Dynamic Cascade):**
   - Phá hủy toàn bộ các khối móng nền `y >= 700.0`.
   - Kết quả: 100% các khối tầng trên, tảng đá lăn và quái vật sụp đổ tự nhiên xuống nền hang đá (0 vật thể lơ lửng).
2. **Test 29.6 (Level 6 Intermediate Beam Collapse):**
   - Phá hủy thanh dầm tầng 2 tại `y = 588.0` trong Pháo đài trung tâm Level 6.
   - Kết quả: Toàn bộ vòm đá tầng 3 (2 cột trụ đá, dầm đá, 2 gờ đá) và tảng đá lăn trên đỉnh đều rơi tự do qua khe hở 24px, đáp an toàn và vững chãi lên các trụ gỗ bên dưới mà không hề bị đóng băng hay treo lơ lửng trong không trung.
3. **Toàn bộ 29 Test Suites:**
   - 200 màn chơi trải dài qua 10 Thế Giới được khởi tạo và kiểm tra tính toàn vẹn kết cấu: **PASS 100% (0 Lỗi)**.
