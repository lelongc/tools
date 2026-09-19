# 02 — Báo cáo Lỗi và Tiến độ Xử lý Kỹ thuật

Tài liệu này theo dõi chi tiết từng lỗi kỹ thuật, tình huống tái hiện, giải pháp đã áp dụng và kết quả nghiệm thu thực tế qua bộ kiểm thử tự động `TestRunner.tscn`.

---

## Bảng Trạng thái Tổng hợp

| ID | Ưu tiên | Hiện tượng / Vấn đề | Trạng thái | Giải pháp đã áp dụng & Kiểm chứng |
|---|:---:|---|:---:|---|
| **BUG-01** | P1 | Không mở khóa nút nhận thưởng quảng cáo mô phỏng | **ĐÃ XỬ LÝ** | Đặt `hbox.name = "HBox"`, cache tham chiếu trực tiếp `mock_btn_claim`/`mock_btn_skip`, quản lý tween hủy an toàn |
| **BUG-02** | P1 | Game đang Pause nhưng bộ đếm thua vẫn chạy | **ĐÃ XỬ LÝ** | Bổ sung `if get_tree().paused: return` trong `GameManager._process()` |
| **BUG-03** | P1 | Last Stand có thể phát đồng thời cả thắng và thua | **ĐÃ XỬ LÝ** | Cross-guard trong HUD, hủy tween Last Stand khi thắng, tập trung phán quyết vào `GameManager.fail_level()` |
| **BUG-04** | P1 | Bị xử thua sớm khi trứng còn bay hoặc đá còn rơi | **ĐÃ XỬ LÝ** | Hàm `has_active_gameplay_elements()` theo dõi Projectiles, Explosives cháy dở và Destructibles vận tốc $> 60\text{px/s}$ |
| **BUG-05** | P2 | Hố đen bay ngoài biên nổ lặp 24 lần gây 9.600 sát thương | **ĐÃ XỬ LÝ** | Bổ sung `if is_broken: return`, dừng physics process và `freeze = true` ngay khi nổ supernova |
| **BUG-06** | P2 | Điểm số hiển thị trên UI lệch so với điểm đã lưu | **ĐÃ XỬ LÝ** | Đóng băng điểm tại thời điểm kết thúc thành `snapshot_final_score`, UI và SaveManager cùng đọc một nguồn |
| **BUG-07** | P2 | Ngưỡng cố định khiến khối ở hầm sâu không có trụ vẫn đứng yên | **ĐÃ XỬ LÝ** | Thay ngưỡng 800 bằng `GameManager.current_floor_y - 4.0` theo từng thế giới |
| **BUG-08** | P2 | Nút chọn màn sau chiến thắng kích hoạt chuyển scene 2 lần | **ĐÃ XỬ LÝ** | Tách riêng hàm điều hướng, bổ sung cờ `victory_claimed` chống nhấn đúp |
| **SAVE-01** | P1 | Save phiên bản cũ bị xóa sạch (reset) | **ĐÃ XỬ LÝ** | Thay `reset_save()` bằng `_migrate_save_version()` bảo toàn toàn bộ sao, điểm, vàng và consumable |
| **SAVE-02** | P2 | Quy trình tmp/backup chưa bảo đảm phục hồi an toàn | **ĐÃ XỬ LÝ** | Thêm cơ chế kiểm tra file tồn tại, ghi file tạm `.tmp`, sao lưu `.bak` và cơ chế phục hồi tự động |
| **SAVE-03** | P2 | Dữ liệu JSON chưa kiểm tra schema/nested types | **ĐÃ XỬ LÝ** | Hàm `_apply_loaded_dict()` làm sạch và ép kiểu dữ liệu Dictionary/Integer cho toàn bộ trường dữ liệu |
| **BUILD-01**| P1 | Preset còn tên/package của game khác | **ĐÃ XỬ LÝ** | Cập nhật `export_presets.cfg` thành `com.cluckanddrop.bunkerbuster` và tên game chuẩn |

---

## Chi tiết Giải pháp Kỹ thuật cho từng Lỗi

### BUG-01 — Mở khóa nút nhận thưởng quảng cáo mô phỏng
- **Nguyên nhân gốc**: `HBoxContainer.new()` không được đặt tên rõ ràng, Godot tự gán tên `@HBoxContainer@4`. Lệnh `get_node("Center/Card/VBox/HBox/BtnClaim")` trả về `null`, khiến nút bị kẹt ở trạng thái `disabled = true`.
- **Giải pháp trong [AdsManager.gd](file:///d:/folder/tools/godot_demo/2/scripts/core/AdsManager.gd)**:
  - Khai báo biến cache trực tiếp: `var mock_btn_claim: Button = null` và `var mock_btn_skip: Button = null`.
  - Gán tường minh `hbox.name = "HBox"` khi dựng cây giao diện.
  - Quản lý vòng đời `mock_tween`: tự động kill tween cũ trước khi tạo tween mới, đảm bảo nút đếm ngược đúng 3 giây và mở khóa tin cậy.
- **Nghiệm thu**: Cả 4 placement (Last Stand, x3 Vàng, Thử VIP, Quay thêm) đều mở khóa chính xác sau 3 giây; skip không cộng thưởng; không bị race condition.

---

### BUG-02 — Đếm ngược thua trong lúc Pause
- **Nguyên nhân gốc**: `GameManager` chạy ở chế độ `PROCESS_MODE_ALWAYS`. Bộ đếm `settle_timer` trong `_process(delta)` tiếp tục trừ dần thời gian ngay cả khi `get_tree().paused == true`.
- **Giải pháp trong [GameManager.gd](file:///d:/folder/tools/godot_demo/2/scripts/core/GameManager.gd)**:
  - Thêm điều kiện chặn ở đầu hàm `_process()`:
    ```gdscript
    if get_tree().paused:
        return
    ```
- **Nghiệm thu**: Khi mở menu Pause hoặc popup xem quảng cáo mô phỏng trong lúc hết trứng, thời gian chờ lắng đọng được giữ nguyên tuyệt đối, không kích hoạt thua oan.

---

### BUG-03 — Trùng lặp Modal Thắng và Thua trong Last Stand
- **Nguyên nhân gốc**: Khi modal Last Stand hiển thị (chờ 5 giây), quái vật cuối cùng có thể chết do dư chấn của vật thể rơi. Sự kiện chiến thắng được phát ra nhưng `last_stand_tween` không bị hủy, dẫn đến timeout tiếp tục phát sự kiện thua.
- **Giải pháp trong [GameHUD.gd](file:///d:/folder/tools/godot_demo/2/scripts/ui/GameHUD.gd) & [GameManager.gd](file:///d:/folder/tools/godot_demo/2/scripts/core/GameManager.gd)**:
  - Khi nhận `level_completed`: Hủy ngay `last_stand_tween`, đóng modal Last Stand và modal Thua:
    ```gdscript
    if last_stand_tween and last_stand_tween.is_valid():
        last_stand_tween.kill()
    if last_stand_modal: last_stand_modal.visible = false
    if fail_modal: fail_modal.visible = false
    ```
  - Trong `_on_last_stand_timeout()`: Kiểm tra nếu `victory_modal.visible` thì lập tức `return`.
  - Chuyển quyền quyết định thua về `GameManager.fail_level()`, kiểm tra `remaining_enemies == 0` trước khi phát `level_failed`.
- **Nghiệm thu**: Trong mọi tình huống quái chết sát giờ, không bao giờ xuất hiện hai modal cùng lúc trên màn hình.

---

### BUG-04 — Xét thua sớm khi trứng hoặc vật thể đang hoạt động
- **Nguyên nhân gốc**: Bộ đếm 3,5 giây bắt đầu đếm ngược ngay khi quả trứng cuối rời tay gà, bỏ qua thời gian trứng đang bay trên không (có thể lên tới 8 giây) hoặc các tảng đá đang lăn về phía quái.
- **Giải pháp trong [GameManager.gd](file:///d:/folder/tools/godot_demo/2/scripts/core/GameManager.gd)**:
  - Bổ sung hàm kiểm tra động cơ học `has_active_gameplay_elements()`:
    1. Trứng còn sống trên không: Quét nhóm `"Projectiles"`, kiểm tra `not is_broken` hoặc `not is_breaking`.
    2. Thuốc nổ đang cháy kíp nổ: Quét nhóm `"Explosives"`, kiểm tra `is_ignited == true`.
    3. Khối cản và tảng đá đang rơi: Quét nhóm `"Destructibles"`, kiểm tra `linear_velocity.length() > 60.0`.
  - Nếu còn bất kỳ tác nhân nào đang hoạt động, `settle_timer` được duy trì liên tục ở mức $1.5\text{s}$ (với giới hạn an toàn tối đa $9.0\text{s}$ chống treo máy).
- **Nghiệm thu**: Đạn bay lơ lửng hoặc chuỗi sập đổ kéo dài không bị cắt ngang giữa chừng; màn chơi chỉ kết thúc khi chiến trường đã hoàn toàn tĩnh lặng.

---

### BUG-05 — Hố đen nổ lặp Supernova ngoài biên
- **Nguyên nhân gốc**: Khi bay ra ngoài biên (`pos.y > 1400` hoặc `abs(pos.x) > 2000`), hàm `_supernova_blast()` được gọi và kích hoạt delay 0,4 giây trước khi xóa node. Tuy nhiên `_physics_process()` không kiểm tra biến `is_broken`, dẫn đến hàm `_supernova_blast()` bị gọi lại liên tục ở từng frame kế tiếp (24 lần nổ, gây 9.600 sát thương).
- **Giải pháp trong [BlackHoleEgg.gd](file:///d:/folder/tools/godot_demo/2/scripts/projectiles/BlackHoleEgg.gd)**:
  - Thêm chốt chặn ở đầu `_physics_process()`: `if is_broken: return`.
  - Trong `_supernova_blast()`: Thiết lập ngay `is_broken = true`, `is_singularity = false` và `set_deferred("freeze", true)` trong frame đầu tiên.
- **Nghiệm thu**: Mỗi quả trứng hố đen chỉ phát ra duy nhất 1 đợt nổ supernova gây 400 sát thương chuẩn, hoàn toàn triệt tiêu sát thương lặp.

---

### BUG-06 — Đồng bộ Snapshot Điểm số Tuyệt đối
- **Nguyên nhân gốc**: Điểm số được lưu vào `SaveManager` ngay khi quái cuối chết, nhưng lại trì hoãn 1,2 giây mới phát sự kiện hiển thị UI. Các mảnh vỡ tiếp tục rơi trong 1,2 giây đó cộng thêm điểm vào `current_score`, khiến điểm trên bảng kết quả cao hơn điểm đã lưu vào hồ sơ người chơi.
- **Giải pháp trong [GameManager.gd](file:///d:/folder/tools/godot_demo/2/scripts/core/GameManager.gd)**:
  - Chụp ảnh điểm số nguyên tử:
    ```gdscript
    var snapshot_final_score = current_score
    sm.record_level_result(current_level, stars, snapshot_final_score)
    level_completed.emit(stars, snapshot_final_score, base_coins)
    ```
- **Nghiệm thu**: Điểm số hiển thị trên UI chiến thắng luôn trùng khớp 100% với số điểm ghi nhận trong save file và bảng xếp hạng sao.

---

### BUG-07 — Ngưỡng nền Động theo từng Thế giới (Dynamic Bedrock Floor)
- **Nguyên nhân gốc**: `DestructibleBlock.gd` và `RollingBoulder.gd` so sánh cứng `y + hh >= 800.0` để kết luận khối đang tựa vào lòng đất. Tuy nhiên, các hang động sâu (từ World 2 đến World 10) có mặt sàn thực tế từ 840 đến 932px, khiến các khối nằm lơ lửng ở $y = 810$ bị chẩn đoán nhầm là đang tiếp đất và đông cứng vĩnh viễn dù mất trụ đỡ.
- **Giải pháp**:
  - Lưu trữ sàn thực tế vào `GameManager.current_floor_y`.
  - Thay ngưỡng cứng bằng điều kiện động:
    ```gdscript
    var floor_y = GameManager.current_floor_y if has_node("/root/GameManager") else 840.0
    if (global_position.y + hh) >= (floor_y - 4.0):
        return
    ```
- **Nghiệm thu**: Các khối ở độ cao $y = 810$ trong hang sâu tự động kích hoạt trọng lực rơi khi mất trụ đỡ; các khối chạm đất thực tế ở $y = 900$ vẫn vững như bàn thạch.

---

### BUG-08 — Khử chuyển Scene kép sau Chiến thắng
- **Nguyên nhân gốc**: Trong `GameHUD.gd`, nút chọn màn sau khi thắng gọi `_on_claim_normal_and_next()` (bên trong gọi `next_level()`), sau đó lại gọi tiếp `go_to_level_select()`, gây xung đột tải 2 scene liên tiếp.
- **Giải pháp trong [GameHUD.gd](file:///d:/folder/tools/godot_demo/2/scripts/ui/GameHUD.gd)**:
  - Tách riêng hàm `_on_victory_levels_pressed()`: cộng vàng một lần duy nhất và điều hướng trực tiếp sang `go_to_level_select()`.
  - Thêm cờ bảo vệ `victory_claimed: bool = false` để chặn triệt để tình trạng nhấn nhanh 2 ngón tay cùng lúc.
- **Nghiệm thu**: Chỉ có duy nhất một yêu cầu đổi scene được gửi đi; scene chuyển tiếp mượt mà, không bị lag giật hay nhấp nháy màn hình.

---

## Các Điểm Cần Theo Dõi & Danh mục Lỗ hổng Mới Phát hiện

1. **Audio Bus Limiter & Cấu hình Di động**:
   - ĐÃ XỬ LÝ: Đã tạo `default_bus_layout.tres` với bộ hạn chế biên độ âm thanh Peak Limiter trần $-0.2\text{ dBFS}$ trên bus Master, khóa $60\text{ FPS}$ và kích hoạt Auto-Pause khi nhận cuộc gọi. Chi tiết tại [07 — Chuẩn hóa Mobile và CH Play](D:/folder/tools/godot_demo/2/docs/phan-tich-game/07-chuan-hoa-mobile-va-chplay.md).
2. **Đại Kiểm Kê 18 Lỗ hổng Vật lý, Gameplay & Kinh tế Cần Cải Thiện**:
   - Báo cáo kiểm kê chi tiết về các lỗi trọng yếu như quái vật văng khỏi bản đồ bất tử (`PHY-01`), khối rơi ngoài biên kẹt timer 9s (`PHY-02`), nghịch lý Trứng Băng tự hủy khối (`BAL-01`), rò rỉ Tween khi dính Axit (`PHY-03`) và giải pháp Khay Tiếp Viện (`ECO-01`) đã được kiểm kê tại [08 — Đại Kiểm Kê Lỗi và Đề Xuất Toàn Diện](D:/folder/tools/godot_demo/2/docs/phan-tich-game/08-dai-kiem-ke-loi-va-de-xuat-toan-dien.md).
3. **Bách khoa Toàn tập Đại phẫu 36 Lỗi & Đề xuất Cải thiện Toàn diện Toàn bộ Dự án**:
   - Báo cáo đại phẫu sâu nhất kiểm kê toàn bộ **36 lỗi và lỗ hổng kỹ thuật** chia theo 9 hệ thống từ P0 đến P3 (kèm nguyên nhân gốc rễ, ảnh hưởng game loop, code mẫu khắc phục và sơ đồ Gantt triển khai) được lưu tại [09 — Đại Phẫu Toàn Bộ Lỗi, Lỗ Hổng Kỹ Thuật và Kế Hoạch Cải Thiện Toàn Diện](D:/folder/tools/godot_demo/2/docs/phan-tich-game/09-dai-phau-toan-bo-loi-va-de-xuat-nang-cap.md).

