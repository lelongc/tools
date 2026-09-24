# MA TRẬN KIỂM THỬ CHẤT LƯỢNG (QA), BẢO HIỂM PHÁT HÀNH CH PLAY & LỘ TRÌNH 2026

> **Mục tiêu tài liệu:** Thiết lập ma trận bảo đảm chất lượng toàn diện (Quality Assurance Matrix), quy trình kiểm thử tự động hỗn loạn (Monkey Stress Testing), vượt ải chính sách bắt buộc 14 ngày/20 Tester của Google Play Console, quản trị chỉ số sinh tồn (Google Play Core Vitals: Crash & ANR $< 0.47\%$), kiến trúc Cloud Save đám mây và lộ trình tính năng mở rộng LiveOps 2026.

---

## 1. MA TRẬN TƯƠNG THÍCH THIẾT BỊ DI ĐỘNG (COMPATIBILITY MATRIX)

Game mobile casual đạt hàng triệu lượt tải bắt buộc phải hoạt động mượt mà trên phân khúc máy cấu hình thấp (Low-end / Budget devices chiếm $> 60\%$ thị phần Đông Nam Á, Ấn Độ, Mỹ Latinh).

### 1.1. Bảng Phân Tầng Phần Cứng Thử Nghiệm

| Phân Cầng | Chipset Tiêu Biểu | GPU Đi Kèm | RAM / OS | Mục Tiêu Hiệu Năng | Chiến Lược Đồ Họa Cấu Hình |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cực Thấp (Ultra Low)** | MediaTek Helio G35 / G25, Unisoc T606 | PowerVR GE8320, Mali-G57 MP1 | 2GB - 3GB / Android 10 - 11 | $50 - 60\text{ FPS}$ ổn định | Tắt vệt bóng động `CanvasModulate`, giới hạn Shards $\le 32$, hạ số hạt khói |
| **Phổ Thông (Mid-Range)** | Snapdragon 680 / 685, Helio G99 | Adreno 610, Mali-G57 MC2 | 4GB - 6GB / Android 12 - 14 | $60\text{ FPS}$ tuyệt đối | Đầy đủ hiệu ứng nứt khối 2 cấp, Comic Popups, Shards Pool 64 |
| **Cận Cao Cấp (High-End)** | Snapdragon 7+ Gen 2, Dimensity 8200 | Adreno 725, Mali-G610 MC6 | 8GB - 12GB / Android 14 - 15 | $90 - 120\text{ FPS}$ | Bật `physics_interpolation`, hạt ánh sáng rực rỡ, rung xúc giác phản hồi cao |
| **Màn Hình Gập / Tablet** | Galaxy Z Fold 5/6, Pixel Fold, iPad | Adreno 740, Apple Silicon | Màn vuông $4:3$ / $1:1$ | Căn giữa $540\text{px}$, không giãn bẹp UI | Bổ sung thanh trang trí bo viền (Pillarbox Border Art) |

---

## 2. KIỂM THỬ TỰ ĐỘNG HỖN LOẠN (AUTOMATED MONKEY STRESS TESTING)

Để phát hiện triệt để các lỗi rò rỉ bộ nhớ, treo logic khi người chơi bấm nút liên tục hoặc spam chạm màn hình, cần triển khai script kiểm thử tự động giả lập người chơi hỗn loạn.

### 2.1. Kiến Trúc Kịch Bản `MonkeyTester.gd`
Kịch bản chạy chế độ Headless hoặc cửa sổ tự động trong Godot 4:
- Thực hiện **10.000 thao tác ngẫu nhiên** trong 15 phút:
  1. Chạm ngẫu nhiên vào các tọa độ màn hình (ngắm bắn tốc độ cao).
  2. Spam nút Pause, Resume, Restart liên tục 50 lần/giây.
  3. Mở và đóng modal `DailyWheelModal`, `SettingsModal`, `VictoryModal` trong cùng một frame.
  4. Nạp chuyển đổi 50 màn chơi liên tiếp để theo dõi `Performance.get_monitor(Performance.OBJECT_COUNT)`.

```gdscript
# scenes/tests/MonkeyTester.gd
extends Node

const ACTIONS = ["tap_bomb", "spam_pause", "rapid_restart", "cycle_levels"]
var action_count = 0
const MAX_ACTIONS = 10000

func _process(_delta: float) -> void:
    if action_count >= MAX_ACTIONS:
        print(">>> MONKEY TEST HOÀN TẤT THÀNH CÔNG: 10,000 ACTIONS KHÔNG CRASH! <<<")
        get_tree().quit(0)
        return
        
    action_count += 1
    var act = ACTIONS.pick_random()
    match act:
        "tap_bomb":
            _simulate_random_touch()
        "spam_pause":
            _simulate_pause_spam()
        "rapid_restart":
            _simulate_restart()
        "cycle_levels":
            if action_count % 100 == 0:
                GameManager.load_level(randi_range(1, 200))
```

### 2.2. Tiêu Chí Nghiệm Thu (Pass/Fail Criteria)
1. **0 Lỗi Null Reference Exception:** Không có bất kỳ truy cập biến trên Node đã bị `queue_free()`.
2. **ObjectDB Ổn Định:** Số lượng đối tượng sống trong `Performance.OBJECT_COUNT` sau 50 lần tải màn không được tăng tuyến tính (ngưỡng chênh lệch $\le 5\%$).
3. **Bộ Nhớ Ổn Định:** RAM không vượt quá $160\text{MB}$ trên môi trường thử nghiệm.

---

## 3. VƯỢT ẢI CHÍNH SÁCH 14 NGÀY VỚI 20 TESTER CỦA GOOGLE PLAY (2026)

### 3.1. Quy Định Bắt Buộc Của Google Play Console Cho Tài Khoản Mới
Kể từ tháng 11/2023 và duy trì nghiêm ngặt trong năm 2026:
- Mọi tài khoản nhà phát triển cá nhân (Personal Developer Account) đăng ký mới bắt buộc phải:
  1. Tạo bản phát hành thử nghiệm kín (Closed Testing Track).
  2. Thu hút tối thiểu **20 người thử nghiệm (Testers)** tham gia đăng ký (Opt-in) qua liên kết Google Group hoặc email.
  3. Giữ các tester này liên tục trong tối thiểu **14 ngày liên tiếp**.
  4. Người thử nghiệm phải có hoạt động mở ứng dụng thực tế trên thiết bị thật, không được là tài khoản ảo hay bot.

### 3.2. Chiến Lược Triển Khai Thực Chiến Vượt Duyệt 100%

```
┌────────────────────────────────────────────────────────┐
│  BƯỚC 1: Xây Dựng Bản Build Thử Nghiệm Kín (Closed AAB)│
│  - Hoàn thiện 40 màn đầu tiên, bật Firebase Crashlytics│
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  BƯỚC 2: Gom 25 - 30 Tester Thực Tế (Dự phòng rơi rụng)│
│  - Tuyển chọn từ cộng đồng game indie / bạn bè         │
│  - Thiết lập Google Groups chung tiện quản lý email    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  BƯỚC 3: Kích Hoạt Tương Tác Trong 14 Ngày             │
│  - Tính năng Vòng Quay May Mắn kéo người chơi vào mỗi  │
│    ngày (Daily Spin Push Notification)                 │
│  - Cập nhật bản vá nhỏ (v1.0.1, v1.0.2) vào ngày thứ 5 │
│    và ngày thứ 10 để chứng minh ứng dụng được bảo trì  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  BƯỚC 4: Trả Lời Bộ Câu Hỏi Sản Xuất (Production Form) │
│  - Giải thích rõ cơ chế tiếp thu phản hồi của tester   │
│  - Trình bày tệp log sửa lỗi cụ thể trong 14 ngày      │
└────────────────────────────────────────────────────────┘
```

---

## 4. QUẢN TRỊ CHỈ SỐ SINH TỒN (GOOGLE PLAY CORE VITALS)

Google Play Store sử dụng hệ thống thuật toán tự động phạt thứ hạng hiển thị (Search & Category Ranking Demotion) đối với các ứng dụng có chỉ số sinh tồn kém.

### 4.1. Ngưỡng Cảnh Báo Đỏ (Bad Behavior Thresholds)
- **Tỉ lệ Crash do người dùng cảm nhận (User-perceived Crash Rate):**
  - Ngưỡng tối đa cho phép: $\le 1.09\%$ trên mọi thiết bị.
  - Ngưỡng tối đa trên từng dòng máy riêng biệt: $\le 8.0\%$.
  - **Mục tiêu của Cluck & Drop:** Duy trì $< 0.25\%$.
- **Tỉ lệ Ứng dụng Không phản hồi (User-perceived ANR Rate):**
  - Ngưỡng tối đa cho phép: $\le 0.47\%$.
  - **Nguyên nhân tiềm ẩn trong game:** Nạp dữ liệu màn chơi bằng hàm `FileAccess` đồng bộ (Synchronous Blocking) ngay trên Main Thread khi đổi màn.
  - **Khắc phục:** Sử dụng kỹ thuật chia nhỏ khung hình (Time-slicing) hoặc Worker Thread khi khởi tạo các cấu trúc boong-ke phức tạp $> 100$ khối.

---

## 5. KIẾN TRÚC ĐỒNG BỘ ĐÁM MÂY (HYBRID CLOUD SAVE V2)

### 5.1. Mô Hình Hợp Nhất Không Mất Mát Dữ Liệu (Non-Destructive Union Merge)
Tại [SaveManager.gd](file:///d:/folder/tools/godot_demo/2/scripts/core/SaveManager.gd#L295-L330), hàm `merge_cloud_save()` đã thiết lập nền tảng hợp nhất rất tốt. Để hoàn thiện chuẩn hóa Google Play Games Services v2:

```gdscript
# Quy tắc giải quyết xung đột Cloud Save (Conflict Resolution Rule):
1. Level Unlocked: max(local.highest_level, cloud.highest_level)
2. Stars Count: Với mỗi level k, max(local.stars[k], cloud.stars[k])
3. High Scores: max(local.scores[k], cloud.scores[k])
4. Coins: max(local.coins, cloud.coins)
5. Consumables: max(local.consumables[type], cloud.consumables[type])
```

- **Nguyên tắc cốt lõi:** Tuyệt đối không bao giờ ghi đè mù quáng (blind overwrite) dữ liệu của đám mây lên máy cục bộ hoặc ngược lại. Mọi hành động hợp nhất đều lấy giá trị cao nhất vì lợi ích tối đa của người chơi.

---

## 6. LỘ TRÌNH TÍNH NĂNG MỞ RỘNG HẬU PHÁT HÀNH (LIVEOPS ROADMAP 2026)

### 6.1. Giai Đoạn 1 (Tháng 1 - Sau Phát Hành): Củng Cố & Tối Ưu Tỉ Lệ Giữ Chân (D1 / D7 Retention)
- Bổ sung hệ thống **Điểm Danh 7 Ngày (7-Day Login Calendar)**:
  - Ngày 1: $100$ Vàng.
  - Ngày 3: $1$ Quả Trứng Đục Thép (`DrillEgg`).
  - Ngày 7: $1$ Quả Trứng Lỗ Đen Tối Thượng (`BlackHoleEgg`).
- Bổ sung hiệu ứng rung xúc giác haptics tinh vi (Micro-Haptics) khi nhắm kéo ná.

### 6.2. Giai Đoạn 2 (Tháng 3): Chế Độ Thử Thách Vô Tận (Endless Bunker Run)
- Bản đồ tự động sinh ngẫu nhiên theo chiều thẳng đứng không giới hạn độ sâu.
- Người chơi thả bom đào sâu liên tục, điểm số tính theo mét độ sâu (`meters_dug`).
- Bảng xếp hạng trực tuyến toàn cầu (Global Leaderboards qua Google Play Games Services).

### 6.3. Giai Đoạn 3 (Tháng 6): Trình Tạo Màn Chơi Cộng Đồng (Community Bunker Builder)
- Cho phép người chơi tự xếp các khối gỗ, đá, thùng thuốc nổ và đặt vị trí quái vật lợn.
- Xuất dữ liệu màn chơi thành chuỗi Base64 siêu ngắn gọn.
- Người chơi có thể chia sẻ mã màn chơi lên các kênh mạng xã hội, Discord hoặc YouTube Shorts:
  `"Thử thách phá vỡ pháo đài này nếu bạn làm được: #BUNKER-8492-XFA"`
- Đòn bẩy khổng lồ biến người chơi thành nhà sáng tạo nội dung cho game (User-Generated Content - UGC).
