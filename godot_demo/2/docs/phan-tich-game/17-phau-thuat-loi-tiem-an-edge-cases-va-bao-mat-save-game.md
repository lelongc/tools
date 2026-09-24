# PHẪU THUẬT LỖI TIỀM ẨN, TÌNH HUỐNG BIÊN (EDGE CASES) & BẢO MẬT SAVE GAME

> **Mục tiêu tài liệu:** Bóc tách sâu các lỗi tiềm ẩn nguy hiểm (latent bugs), tình huống biên (edge cases) trong mô phỏng vật lý 2D, xung đột đa chạm cảm ứng trên màn hình di động, sai lệch vùng hiển thị khuyết tật (Notch/Cutout), hiện tượng rè méo âm thanh khi nổ lớn, lỗ hổng gian lận dữ liệu người chơi (Save Game Tampering & Time-Travel Cheat), cùng các yêu cầu kỹ thuật đặc thù của YouTube Playables.

---

## 1. LỖI VẬT LÝ XUYÊN THẤU (CCD TUNNELING & HIGH-VELOCITY GHOSTING)

### 1.1. Hiện Trạng & Cơ Chế Phát Sinh Lỗi
Trong Godot 4 Physics 2D (Default Server), việc phát hiện va chạm mặc định được xử lý theo phương pháp **Rời rạc (Discrete Collision Detection)**:
$$\Delta x = v \cdot \Delta t$$
Với tần số vật lý cố định $\text{physics\_ticks\_per\_second} = 60\text{ Hz} \implies \Delta t \approx 0.01667\text{s}$.

- **Tại [RollingBoulder.gd](file:///d:/folder/tools/godot_demo/2/scripts/destructibles/RollingBoulder.gd#L45-L51):**
  - Tảng đá lăn có khối lượng lớn (`mass = 8.0`). Khi lăn xuống dốc đứng ở các Màn 41-60 (Thế giới Magma) hoặc bị hất văng bởi sóng xung kích của `NukeBarrel`, vận tốc dài của đá đạt:
    $$v_{\text{boulder}} \ge 1200\text{ px/s} \implies \Delta x \approx 1200 \times 0.01667 = 20.0\text{ px/frame}$$
  - Trong khi đó, các tấm ván gỗ mỏng (`wood_block_plank`) hoặc thanh thép đỡ sàn boong-ke chỉ có độ dày $12\text{px} - 16\text{px}$.
  - **Hiện tượng Xuyên Thấu (Tunneling):** Ở Frame $N$, tảng đá nằm phía trên tấm ván $8\text{px}$. Ở Frame $N+1$, tảng đá dịch chuyển $20\text{px}$, vượt hẳn sang phía dưới tấm ván mà không có bất kỳ thời điểm nào CollisionShape của đá giao cắt với CollisionShape của tấm ván.
  - **Hậu quả:** Tảng đá "lọt hầm" xuyên qua sàn gỗ mà không nghiền nát gỗ hay kích hoạt tín hiệu va chạm `_on_impact`, khiến quái vật bên dưới không bị tiêu diệt và phá vỡ logic giải đố.

- **Tại [ClusterChick.gd](file:///d:/folder/tools/godot_demo/2/scripts/projectiles/ClusterChick.gd#L14-L20):**
  - Khi trứng chùm phát nổ trên không, 3 gà con được bắn ra với vận tốc ban đầu $550\text{ px/s}$.
  - Gà con có bán kính va chạm cực nhỏ ($r \approx 8\text{px}$). Do chưa cấu hình `continuous_cd`, gà con thường xuyên xuyên qua các khe giữa hai khối vật liệu xếp liền nhau thay vì va chạm nảy lại.

### 1.2. Giải Pháp Triệt Để
1. Cấu hình Continuous Collision Detection (CCD) theo dạng **Cast Shape** cho `RollingBoulder`:
   ```gdscript
   # scripts/destructibles/RollingBoulder.gd
   continuous_cd = RigidBody2D.CCD_MODE_CAST_SHAPE # Quét toàn bộ thể tích hình tròn trong suốt quãng đường bay
   ```
2. Cấu hình CCD dạng **Cast Ray** cho `ClusterChick`:
   ```gdscript
   # scripts/projectiles/ClusterChick.gd
   continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
   ```
3. Bổ sung trần vận tốc an toàn (Terminal Velocity Clamping) trong `_integrate_forces()` cho các vật thể có khối lượng lớn để ngăn hiện tượng gia tốc tích lũy do va chạm liên hoàn (Physics Explosion Glitch).

---

## 2. XUNG ĐỘT ĐA CHẠM & TRƯỢT TỌA ĐỘ TRÊN THIẾT BỊ DI ĐỘNG (MULTI-TOUCH RACE CONDITIONS)

### 2.1. Phân Tích Lỗi Nhảy Tọa Độ Ngắm Bắn
Tại [ChickenBomber.gd](file:///d:/folder/tools/godot_demo/2/scripts/player/ChickenBomber.gd#L170-L240):
- Phương thức ngắm bắn hiện tại sử dụng cơ chế polling trong `_process()`:
  ```gdscript
  if Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
      var mouse_pos = get_global_mouse_position()
  ```
- **Lỗ hổng trên màn hình cảm ứng di động (Android / Web Mobile):**
  - Godot kích hoạt cờ `emulate_mouse_from_touch = true` theo mặc định.
  - Khi người chơi dùng Ngón tay 1 kéo ngắm đạn, nếu ngón tay cái bên tay kia vô tình tì vào mép màn hình (hoặc người chơi đổi ngón chạm), hệ điều hành gửi 2 sự kiện touch đồng thời (`touch_index = 0` và `touch_index = 1`).
  - Trình giả lập chuột của Godot sẽ **nhảy giật (jitter)** liên tục giữa tọa độ ngón 1 và ngón 2.
  - Khoảng cách delta $\Delta_{\text{drag}} = \text{mouse\_pos} - \text{aim\_start\_pos}$ bị đảo lộn đột ngột, dẫn đến:
    1. Véctơ ngắm `aim_vector` bị xoay ngược $180^\circ$ hoặc giật cực đại sang hai biên màn hình.
    2. Điều kiện hủy bắn `drag_delta.y < -25.0` bị kích hoạt nhầm, khiến người chơi bị trượt mất phát bắn dù đang giữ tay chuẩn bị thả.

### 2.2. Xung Đột Giữa Ngắm Bắn Và Kích Hoạt Kỹ Năng Trên Không (Tap-in-Flight Lockout)
Tại dòng 187 của `ChickenBomber.gd`:
```gdscript
if has_airborne_unboosted_egg():
    drop_cooldown = 0.25
    return
```
- Khi quả trứng thứ nhất đang bay và chưa kích hoạt kỹ năng (ví dụ `NormalEgg` chưa hóa kim cương hoặc `BombEgg` chưa nổ), nếu người chơi muốn **kéo giữ sớm quả trứng tiếp theo** trong giỏ để chuẩn bị bắn phát thứ hai:
- `ChickenBomber` phát hiện có trứng đang bay nên lập tức `return` và đặt `drop_cooldown = 0.25`, triệt tiêu hoàn toàn khả năng ngắm trước của người chơi.
- Người chơi có cảm giác điều khiển bị đơ cứng (unresponsive controls) trong khoảng $1.5\text{s} - 2.5\text{s}$ cho đến khi quả trứng đầu chạm đất và vỡ hẳn.

### 2.3. Giải Pháp Chuẩn Hóa Kiến Trúc Input
Chuyển đổi hoàn toàn cơ chế nhận tín hiệu ngắm từ Polling (`_process`) sang **Sự Kiện Hướng Đối Tượng (`_unhandled_input`)**:
1. Chỉ ghi nhận duy nhất `touch_index == 0` (chạm đầu tiên) cho việc điều khiển ná bắn, bỏ qua mọi ngón chạm thứ cấp (`touch_index > 0`).
2. Tách biệt hoàn toàn kênh chạm kích hoạt kỹ năng trên không (chạm vào nửa dưới màn hình hoặc chạm nhanh không kéo) với thao tác kéo ngắm của gà ở nửa trên màn hình.

---

## 3. TRÀN VIỀN & CẮT GỌT GIAO DIỆN TRÊN MÀN HÌNH KHUYẾT TẬT (NOTCH, HOLE-PUNCH & GESTURE BAR)

### 3.1. Điểm Khuyết Thiếu Vùng An Toàn (Safe Area Gap)
Mặc dù [GameHUD.gd](file:///d:/folder/tools/godot_demo/2/scripts/ui/GameHUD.gd#L193-L220) đã triển khai hàm `_apply_safe_area()`, nhưng toàn bộ các màn hình giao diện quan trọng khác trong game hiện **chưa có bất kỳ dòng mã xử lý Safe Area nào**:
- [MainMenu.gd](file:///d:/folder/tools/godot_demo/2/scripts/ui/MainMenu.gd): Thanh thông tin người chơi ở đỉnh và nút cài đặt bị che khuất bởi camera nốt ruồi (hole-punch) hoặc cụm cảm biến FaceID trên iPhone/iPad và dòng máy gập Galaxy Fold.
- [LevelSelect.gd](file:///d:/folder/tools/godot_demo/2/scripts/ui/LevelSelect.gd): Nút quay lại (`BtnBack`) có tọa độ cứng `offset_top = 16.0`. Trên các máy tỉ lệ $20:9$ có tai thỏ sâu (khoảng $44\text{px} - 52\text{px}$), nút `BtnBack` bị che lấp $100\%$, người chơi không thể bấm quay lại Sảnh chính bằng cảm ứng!
- `SettingsModal.tscn` & `DailyWheelModal.tscn`: Nút đóng (`BtnClose`) nằm sát góc phải trên cùng bị cắt vào góc bo tròn màn hình (Display Rounded Corner Inset).

### 3.2. Mô Hình Đồng Bộ Vùng An Toàn Đa Màn Hình
Tạo hàm tiện ích chuẩn trong `GameManager` hoặc Singleton để mọi CanvasLayer có thể lắng nghe tự động:

```gdscript
# scripts/core/SafeAreaAdapter.gd
class_name SafeAreaAdapter

static func apply_to_control(top_control: Control, bottom_control: Control = null) -> void:
    var safe_rect = DisplayServer.get_display_safe_area()
    var win_size = DisplayServer.window_get_size()
    if win_size.y <= 0: return

    var vp_size = Engine.get_main_loop().root.get_viewport().get_visible_rect().size
    var scale_y = vp_size.y / float(win_size.y)
    var top_inset = float(safe_rect.position.y) * scale_y
    var bottom_inset = float(win_size.y - (safe_rect.position.y + safe_rect.size.y)) * scale_y

    if top_control:
        top_control.offset_top = max(top_control.offset_top, top_inset + 8.0)
    if bottom_control:
        bottom_control.offset_bottom = min(bottom_control.offset_bottom, -(bottom_inset + 8.0))
```

---

## 4. QUÁ TẢI ÂM THANH & HIỆN TƯỢNG MÉO RÈ LOA KỸ THUẬT SỐ (AUDIO HEADROOM & CLIPPING)

### 4.1. Bản Chất Kỹ Thuật Của Lỗi "Vỡ Loa / Nổ Bụp" (Digital Audio Clipping)
Tại [SoundManager.gd](file:///d:/folder/tools/godot_demo/2/scripts/core/SoundManager.gd#L165-L176):
- Khi một thùng nổ `NukeBarrel` hoặc quả trứng `BlackHoleEgg` phát nổ, $10 - 20$ khối vật liệu bị phá hủy trong cùng 1 frame.
- Mỗi khối khi bị hủy sẽ gọi:
  ```gdscript
  SoundManager.play_sfx("wood_break")
  ```
- **Hệ quả vật lý âm thanh:**
  1. **Phase Cancellation & Comb Filtering:** Hàng chục mẫu âm thanh có chung dạng sóng được kích hoạt gần như đồng thời mà không có độ lệch pha tự nhiên, gây ra hiện tượng lọc lược (comb filtering) khiến âm thanh trở nên chói gắt, rỗng ruột.
  2. **Vượt Ngưỡng Trần Âm Kỹ Thuật Số ($0\text{ dBFS}$):** Tổng mức áp suất âm thanh (SPL) của 15 nguồn phát đồng thời trên Bus SFX tăng:
     $$\Delta L = 10 \log_{10}(15) \approx +11.76\text{ dB}$$
     Tín hiệu âm thanh vượt quá trần $0\text{ dBFS}$ của bộ chuyển đổi DAC trên điện thoại, dẫn đến hiện tượng Hard Clipping (Cắt cụt sóng âm), phát ra tiếng rè "rách loa" cực kỳ chói tai.
  3. **Rò rỉ số lượng Player:** Hàm `_get_available_player()` tự động tạo thêm instance `AudioStreamPlayer.new()` nếu vượt quá 16 slot ban đầu, làm tăng gánh nặng xử lý của AudioServer.

### 4.2. Giải Pháp Quản Lý Giọng (Voice Limiter & Staggered Concurrency)
Thiết lập bộ điều phối âm thanh thông minh trong `SoundManager`:
1. **Concurrency Cap Per Sound Key:** Mỗi loại âm thanh (như `wood_break`, `stone_break`) chỉ được phép phát tối đa **2 kênh đồng thời** trong cửa sổ thời gian $60\text{ms}$. Mọi lệnh gọi thứ 3 trở đi trong khoảng thời gian này sẽ tự động bị bỏ qua (Drop).
2. **Audio Limiter Bus Effect:** Bổ sung hiệu ứng `AudioEffectLimiter` trên bus `SFX` và `Master` trong cấu hình Default Audio Bus Layout (`ceiling_db = -0.5`, `threshold_db = -2.0`, `soft_clip_db = -1.0`) để đảm bảo dù có bao nhiêu vụ nổ xảy ra, âm thanh tổng thể không bao giờ chạm ngưỡng vỡ loa.

---

## 5. BẢO MẬT DỮ LIỆU LƯU TRỮ & CHỐNG GIAN LẬN (SAVE GAME SECURITY & ANTI-CHEAT)

### 5.1. Lỗ Hổng Lưu Trữ Dạng Văn Bản Thuần (Plaintext JSON)
Hiện tại, [SaveManager.gd](file:///d:/folder/tools/godot_demo/2/scripts/core/SaveManager.gd#L6-L8) ghi dữ liệu trực tiếp vào:
`user://savegame.json`
- **Mức độ rủi ro:** Trên các thiết bị Android đã Root, thiết bị cài ứng dụng quản lý file (như MT Manager, ZArchiver), hoặc các trình giả lập Android trên PC (Bluestacks, LDPlayer), người chơi có thể dễ dàng mở file `savegame.json` bằng text editor và sửa:
  ```json
  "coins": 99999999,
  "highest_unlocked_level": 200,
  "consumables": {"bomb": 999, "drill": 999, "acid": 999}
  ```
- **Hệ lụy thương mại:** Phá hủy hoàn toàn nền kinh tế trong game, triệt tiêu động lực xem quảng cáo nhận thưởng (Rewarded Ads) và doanh thu mua gói IAP.

### 5.2. Lỗ Hổng Gian Lận Chỉnh Đồng Hồ Máy (Time-Travel Exploit)
Tại [SaveManager.gd](file:///d:/folder/tools/godot_demo/2/scripts/core/SaveManager.gd#L254-L264):
```gdscript
func _get_today_string() -> String:
    var dt = Time.get_date_dict_from_system()
    return "%04d-%02d-%02d" % [dt.year, dt.month, dt.day]

func _check_and_reset_daily_spins() -> void:
    var today = _get_today_string()
    if save_data.get("daily_spins_date", "") != today:
        save_data["daily_spins_date"] = today
        save_data["daily_spins_count"] = 0
```
- **Phương thức gian lận:** Người chơi vào Cài đặt Android -> Ngày & Giờ -> Tắt "Thời gian tự động" -> Chỉnh ngày tiến lên 1 ngày.
- **Hệ quả:** Game coi đó là một ngày mới, cấp ngay 1 lượt quay miễn phí và 4 lượt quay video. Người chơi có thể lặp lại thao tác này 50 lần liên tục để nhận vô hạn tài nguyên trong vòng 5 phút!
- **Lỗi nghiêm trọng hơn:** Khi người chơi chỉnh ngày quay ngược lại thời gian thực, chuỗi ngày kiểm tra tiếp tục khác biệt (`today != daily_spins_date`), tiếp tục kích hoạt lượt quay mới thay vì khóa lại!

### 5.3. Kiến Trúc Bảo Vệ Hai Lớp (HMAC-SHA256 & Monotonic Clock)
1. **Mã Hóa File Save Hoặc Kèm Chữ Ký Kiểm Tra Tính Toàn Vẹn (HMAC-SHA256):**
   - Lưu trữ một trường bí mật `"checksum"` được tính toán từ nội dung file kết hợp chuỗi khóa muối bí mật (Salt Secret Key):
     $$\text{Checksum} = \text{SHA256}(\text{JSON\_Payload} + \text{PROJECT\_SECRET\_SALT})$$
   - Khi `load_game()` chạy, nếu phát hiện `checksum` không khớp với nội dung file (chứng tỏ file đã bị can thiệp bên ngoài), game sẽ từ chối nạp, khôi phục từ bản lưu trữ đám mây hoặc reset về trạng thái an toàn.
   - Sử dụng API mã hóa tích hợp sẵn của Godot 4:
     ```gdscript
     FileAccess.open_encrypted_with_pass(SAVE_PATH, FileAccess.WRITE, SECURITY_PASSPHRASE)
     ```
2. **Chống Gian Lận Đảo Ngược Thời Gian (Monotonic Timestamp Defense):**
   - Lưu trữ thêm trường `last_played_unix_timestamp` trong save data.
   - Mỗi lần game khởi chạy hoặc tương tác với Vòng quay May mắn:
     $$\text{current\_time} = \text{Time.get\_unix\_time\_from\_system()}$$
     Nếu $\text{current\_time} < \text{last\_played\_unix\_timestamp} - 300\text{s}$ (cho phép sai số 5 phút):
     $\implies$ **Phát hiện gian lận tua lùi đồng hồ!** Lập tức vô hiệu hóa Vòng quay May mắn cho đến khi thời gian thực vượt qua mốc thời gian gian lận.

---

## 6. CHUẨN HÓA VÒNG ĐỜI & SDK YOUTUBE PLAYABLES (WEBAUDIO & LIFECYCLE)

### 6.1. Quy Tắc WebAudio User Gesture Autoplay
- Trên nền tảng trình duyệt Web hiện đại (Chrome, Safari, Firefox) và môi trường nhúng iframe của YouTube:
  - Trình duyệt **chặn 100% việc tự động phát âm thanh** (`AudioContext` ở trạng thái `suspended`) trước khi người chơi thực hiện thao tác tương tác người dùng đầu tiên (User Gesture: Click, Tap, Keypress).
- **Hiện tượng lỗi trong game:**
  - Nếu `SoundManager` gọi `play_bgm()` ngay trong `_ready()`, console sẽ báo lỗi:
    `The AudioContext was not allowed to start. It must be resumed after a user gesture.`
  - Nhạc nền bị câm vĩnh viễn dù người chơi đã bắt đầu chơi màn 1.
- **Giải pháp:** Bổ sung hook lắng nghe tương tác đầu tiên:
  ```gdscript
  func _input(event: InputEvent) -> void:
      if event is InputEventMouseButton or event is InputEventScreenTouch:
          if AudioServer.is_bus_mute(0) == false:
              # Resume WebAudio context qua JavaScriptBridge nếu chạy trên nền Web
              if OS.has_feature("web"):
                  JavaScriptBridge.eval("if (window.AudioContext && Tone && Tone.context.state !== 'running') { Tone.context.resume(); }")
  ```

### 6.2. Thiếu Các Callback Bắt Buộc Của YouTube Playables SDK
Để đạt chuẩn kiểm duyệt của Google/YouTube Playables, dự án bắt buộc phải hỗ trợ đầy đủ các callback sau:
1. `onAudioEnabledChange(callback)`: YouTube có nút Mute toàn cục trên thanh player video. Game phải kết nối và tắt tiếng toàn bộ Master Bus khi người dùng bấm Mute trên giao diện YouTube.
2. `onPause(callback)` / `onResume(callback)`: Khi người dùng chuyển tab trình duyệt hoặc xem quảng cáo của YouTube, game phải tự động tạm dừng logic vật lý và dập tắt âm thanh nền.

---

## 7. THẾ BẾ TẮC VẬT LÝ (PHYSICS JAM / WEDGE STALEMATE) & CƠ CHẾ PHÁN QUYẾT

### 7.1. Hiện Tượng Kẹt Vòm Khối Xếp Chồng (Arch Wedging Stalemate)
Trong một số màn chơi có kiến trúc tháp đá hoặc gạch vòm hẹp:
- Khi bom phát nổ, hai khối đá hoặc dầm thép văng ra và tình cờ nêm chặt vào nhau tạo thành hình **Vòm Tam Giác Tự Khóa (Self-Locking Arch)**.
- Quái vật bên dưới bị kẹt trong vòm nhưng không chịu đủ lực sát thương để chết.
- Người chơi đã dùng hết toàn bộ số trứng trong giỏ (`available_eggs.size()`).
- Lúc này, cả hai khối vật lý đều có vận tốc tiệm cận 0 (`linear_velocity.length() < 2.0`), không còn chuyển động nào xảy ra trong màn chơi.
- **Lỗi kẹt game (Soft-lock):** Màn chơi không kết thúc, người chơi phải ngồi chờ vô vọng mà không có màn hình Victory hay Fail nào xuất hiện, buộc phải bấm Pause để chơi lại từ đầu.

### 7.2. Giải Pháp Bộ Phán Quyết Thông Minh (Smart Settlement Arbiter)
Bổ sung bộ đếm thời gian lắng đọng vật lý (Physics Settle Timeout) trong `GameManager`:
```gdscript
# scripts/core/GameManager.gd
var _settle_check_timer: float = 0.0
const SETTLE_WAIT_TIME: float = 2.8 # 2.8s sau khi viên đạn cuối dừng chuyển động

func _monitor_endgame_stalemate(delta: float) -> void:
    if not is_level_active or current_egg_index < available_eggs.size():
        return
    
    # Kiểm tra xem còn đạn nào đang bay trên trời không
    var projectiles = get_tree().get_nodes_in_group("Projectiles")
    if not projectiles.is_empty():
        _settle_check_timer = 0.0
        return
        
    # Kiểm tra xem có khối vật lý nào đang chuyển động mạnh không
    var is_physics_busy = false
    for b in get_tree().get_nodes_in_group("Destructibles"):
        if b is RigidBody2D and not b.freeze and b.linear_velocity.length() > 25.0:
            is_physics_busy = true
            break
            
    if is_physics_busy:
        _settle_check_timer = 0.0
    else:
        _settle_check_timer += delta
        if _settle_check_timer >= SETTLE_WAIT_TIME:
            # Vật lý đã ổn định hoàn toàn -> Tiến hành phán quyết ván đấu ngay lập tức
            _conclude_level_evaluation()
```

---

## 8. BẢNG KẾ HOẠCH KHẮC PHỤC LỖI TIỀM ẨN CHI TIẾT (ACTIONABLE REMEDIATION MATRIX)

| Mã Lỗi | Tên Lỗi Tiềm Ẩn | Mức Độ | Tệp Nguồn Cần Can Thiệp | Giải Pháp Kỹ Thuật Đề Xuất |
| :--- | :--- | :---: | :--- | :--- |
| **BUG-LAT-01** | `RollingBoulder` xuyên thấu vật liệu mỏng khi lăn dốc cao | **P1 (Cao)** | `scripts/destructibles/RollingBoulder.gd` | Bật `continuous_cd = RigidBody2D.CCD_MODE_CAST_SHAPE` |
| **BUG-LAT-02** | `ClusterChick` xuyên sàn hầm do thiếu CCD | **P1 (Cao)** | `scripts/projectiles/ClusterChick.gd` | Bật `continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY` |
| **BUG-LAT-03** | Xung đột đa chạm làm nhảy gián đoạn vệt ngắm gà | **P1 (Cao)** | `scripts/player/ChickenBomber.gd` | Lọc sự kiện cảm ứng theo `event.index == 0`, bỏ polling chuột toàn cục |
| **BUG-LAT-04** | Tap-in-Flight khóa ngắm trước quả trứng tiếp theo | **P2 (Trung bình)**| `scripts/player/ChickenBomber.gd` | Tách phân luồng thao tác kéo ngắm ở nửa trên và chạm kích hoạt ở nửa dưới |
| **BUG-LAT-05** | Thiếu Safe Area trên MainMenu, LevelSelect, Settings | **P1 (Cao)** | `scripts/ui/MainMenu.gd`, `LevelSelect.gd` | Tạo `SafeAreaAdapter` áp dụng đồng bộ `DisplayServer.get_display_safe_area()` |
| **BUG-LAT-06** | Méo rè âm thanh (Clipping) khi nổ dây chuyền nhiều khối | **P1 (Cao)** | `scripts/core/SoundManager.gd` | Thêm giới hạn phát đồng thời (Max 2 voice/key/60ms) và Limiter Bus |
| **BUG-LAT-07** | Can thiệp file lưu trữ JSON bằng phần mềm thứ ba | **P1 (Cao)** | `scripts/core/SaveManager.gd` | Bổ sung chữ ký HMAC-SHA256 Checksum hoặc mã hóa file bằng Passphrase |
| **BUG-LAT-08** | Lỗ hổng tua ngày máy nhận vô hạn lượt quay Vòng Quay | **P1 (Cao)** | `scripts/core/SaveManager.gd` | Lưu `last_played_unix_timestamp` và kiểm tra chống tua lùi thời gian |
| **BUG-LAT-09** | Chặn âm thanh WebAudio Autoplay trên YouTube Playables | **P1 (Cao)** | `scripts/core/SoundManager.gd` | Đăng ký callback mở khóa âm thanh tại User Gesture chạm đầu tiên |
| **BUG-LAT-10** | Thiếu API Mute & Pause của YouTube Playables SDK | **P1 (Cao)** | `scripts/core/GameManager.gd` | Bổ sung `onAudioEnabledChange`, `onPause`, `onResume` qua `JavaScriptBridge` |
| **BUG-LAT-11** | Soft-lock kẹt vòm vật lý khi hết trứng | **P2 (Trung bình)**| `scripts/core/GameManager.gd` | Bổ sung bộ đếm Settle Timeout $2.8\text{s}$ tự động kích hoạt phán quyết |
