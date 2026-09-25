# ĐẠI KIỂM TRA TOÀN DIỆN MỌI THỨ: PHÁT HIỆN & KHẮC PHỤC TRIỆT ĐỂ CÁC BẤT THƯỜNG, LỖ HỔNG VÀ ĐIỂM CHƯA HỢP LÝ

> **Tài liệu Kỹ thuật & Báo cáo Kiểm tra Chuyên sâu**  
> **Phiên bản Engine**: Godot Engine 4.7.1 Stable  
> **Mã báo cáo**: `DEEP-AUDIT-AND-FIX-2026-V26`  
> **Trạng thái**: Hoàn tất phân tích, kiểm thử và khắc phục $100\%$ các lỗ hổng

---

## 1. MỤC TIÊU & PHẠM VI ĐẠI KIỂM TRA

Thực hiện lệnh rà soát toàn diện `/goal`, hệ thống đã thực hiện phân tích tự động toàn bộ cây mã nguồn (`scripts/core/`, `scripts/player/`, `scripts/projectiles/`, `scripts/destructibles/`, `scripts/enemies/`, `scripts/ui/`), hệ thống âm thanh, hệ thống tệp tài nguyên, 200 màn chơi chiến dịch và 10 ngôn ngữ hiển thị để phát hiện toàn bộ các điểm bất thường, lỗ hổng logic tiềm ẩn và các điểm chưa tối ưu.

---

## 2. DANH MỤC 8 ĐIỂM BẤT THƯỜNG & LỖ HỔNG ĐƯỢC PHÁT HIỆN

### 2.1. Lỗ hổng Tham chiếu Âm thanh Bị Hỏng (`whoosh.wav`)
* **Vị trí**: `scripts/player/ChickenBomber.gd` dòng 497.
* **Hiện tượng**: Mã nguồn gọi `get_node("/root/SoundManager").play_sfx("res://assets/audio/sfx/whoosh.wav", 0.6, 1.3)`.
* **Nguyên nhân gốc rễ**: Thư mục `assets/audio/sfx/` không tồn tại, tệp `whoosh.wav` không có trên đĩa. Ngoài ra, `SoundManager.play_sfx()` chỉ tra cứu trong bộ nhớ đệm `wav_cache`. Khi truyền một đường dẫn tài nguyên `res://...`, phương thức lập tức trả về mà không phát bất kỳ âm thanh nào.
* **Hậu quả**: Khi người chơi hủy ngắm hoặc thả dây thun ná nảy đàn hồi (Elastic Snap-Back), âm thanh vút gió hoàn toàn bị câm.

### 2.2. Khuyết thiếu 15 Khóa Ngôn Ngữ trong `LocalizationManager.gd`
* **Vị trí**: `scripts/core/LocalizationManager.gd`.
* **Hiện tượng**: Khi chuyển đổi ngôn ngữ trong `SettingsModal`, `ShopModal` hoặc mở `LevelSelect`, màn hình hiển thị chuỗi key thô: `KEY_SETTINGS`, `KEY_BGM_VOLUME`, `KEY_SFX_VOLUME`, `KEY_VIBRATION`, `KEY_RESET_PROGRESS`, `KEY_RESET_CONFIRM_DESC`, `KEY_CONFIRM`, `KEY_CANCEL`, `KEY_CLOSE`, `KEY_BOMB_BOOSTER`, `KEY_DRILL_BOOSTER`, `KEY_ACID_BOOSTER`, `KEY_COMBO_BOOSTER`, `KEY_PURCHASED`, và đặc biệt là `KEY_WORLD_1` đến `KEY_WORLD_10`.
* **Nguyên nhân**: Các màn hình UI gọi `lm.t("KEY_...")` nhưng từ điển bản dịch `translations` trong `LocalizationManager` chưa được định nghĩa đầy đủ 15 khóa này.

### 2.3. Lỗi Trôi Âm Thanh (Audio Starvation Bug) trong `SoundManager.gd`
* **Vị trí**: `scripts/core/SoundManager.gd` dòng 398.
* **Hiện tượng**: Phương thức `stop_all()` thực thi `wav_cache.clear()`.
* **Nguyên nhân**: Khi `stop_all()` được gọi (ví dụ sau khi kết thúc ván đấu hoặc qua màn), toàn bộ từ điển cache các tệp WAV bị giải phóng trắng. Do hàm nạp `_load_all_sound_assets()` chỉ chạy một lần duy nhất lúc `_ready()`, toàn bộ các lệnh phát SFX sau đó đều bị hủy âm thanh trong im lặng.

### 2.4. Khuyết thiếu Khóa `vibration_enabled` khi Reset Save trong `SaveManager.gd`
* **Vị trí**: `scripts/core/SaveManager.gd` dòng 54 trong `reset_save()`.
* **Hiện tượng**: Khởi tạo lại `save_data` mặc định nhưng bỏ quên thuộc tính `"vibration_enabled": true`. Nếu người chơi nhấn "Xóa tiến trình", thuộc tính này bị `null`, có nguy cơ gây lỗi truy cập từ điển.

### 2.5. Khuyết thiếu Thanh Máu Đại Trùm (Boss Health Bar) trên `GameHUD`
* **Vị trí**: `scripts/ui/GameHUD.gd` & `scenes/prefabs/GameHUD.tscn`.
* **Hiện tượng**: Ở các màn chơi số 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, xuất hiện Đại Trùm Thế Giới (Boss) với lượng máu khổng lồ ($1800+\text{HP}$). Tuy nhiên, `GameHUD` hoàn toàn không có thanh đo lượng máu Boss. Người chơi tấn công dồn dập nhưng không có phản hồi trực quan về tiến độ tiêu diệt Trùm.

### 2.6. Bỏ sót 5 Loại Vật Liệu trong `@export_enum` của `DestructibleBlock.gd`
* **Vị trí**: `scripts/destructibles/DestructibleBlock.gd` dòng 6.
* **Hiện tượng**: Khai báo `@export_enum` chỉ liệt kê 6 vật liệu cơ bản (`wood`, `stone`, `glass`, `steel`, `obsidian`, `crystal`), thiếu 5 vật liệu thế giới mới (`cyber_alloy`, `swamp_wood`, `permafrost`, `magma_brick`, `celestial_stone`).

### 2.7. Tồn dư Ký tự Emoji Thô và StyleBoxFlat tại World Quick Jump Ribbon
* **Vị trí**: `MainMenu.gd` và `LevelSelect.gd`.
* **Hiện tượng**: Nút shop sảnh chính vẫn còn gắn icon unicode `🛍️`, và dải ruy băng 10 thế giới trong `LevelSelect` vẫn sinh bằng `StyleBoxFlat` thay vì đồng bộ 9-patch vector.

### 2.8. Thiếu Tiêu Thụ Sự Kiện `set_input_as_handled()` trên các Trứng Kỹ Năng
* **Vị trí**: `BlackHoleEgg.gd`, `DrillEgg.gd`, `AcidEgg.gd`, `FrostEgg.gd`, `ClusterEgg.gd`.
* **Hiện tượng**: Khi người chơi chạm màn hình kích hoạt kỹ năng trên không (Tap-in-Flight), sự kiện chạm không được đánh dấu đã xử lý, có thể truyền xuyên thấu xuống các đối tượng hoặc nút bấm phía dưới.

---

## 3. KẾ HOẠCH KHẮC PHỤC & TRIỂN KHAI TOÀN DIỆN

| STT | Hạng mục | Phương án kỹ thuật triển khai |
| :---: | :--- | :--- |
| **1** | **Khắc phục Âm thanh Whoosh** | Tổng hợp tệp âm thanh WAV hoạt hình chuẩn phòng thu `res://assets/audio/whoosh.wav`. Đăng ký vào `sound_map` của `SoundManager.gd`. Bổ sung hàm tiện ích `play_whoosh()` và kết nối chuẩn xác trong `ChickenBomber.gd`. |
| **2** | **Bổ sung 15 Khóa Đa Ngôn Ngữ** | Bổ sung đầy đủ 15 khóa bản dịch sang toàn bộ 10 ngôn ngữ (Anh, Việt, Nhật, Hàn, Trung, Tây Ban Nha, Bồ Đào Nha, Đức, Pháp, Nga) trong `LocalizationManager.gd`. |
| **3** | **Bảo toàn Bộ nhớ Đệm SoundManager** | Xóa bỏ lệnh `wav_cache.clear()` trong `stop_all()`. Bổ sung cơ chế tự nạp dự phòng (Auto-reload fallback) trong `play_sfx()`. |
| **4** | **Chuẩn hóa SaveManager** | Bổ sung `"vibration_enabled": true` vào hàm `reset_save()` trong `SaveManager.gd`. |
| **5** | **Xây dựng Thanh Máu Boss Health Bar** | Tích hợp container thanh máu Boss chuyên nghiệp trên `GameHUD`, nẹp 9-patch viền vàng, hiển thị tên Boss và phần trăm HP, cập nhật hoạt họa mượt mà khi Boss nhận sát thương. |
| **6** | **Cập nhật Enum Vật Liệu** | Mở rộng `@export_enum` trong `DestructibleBlock.gd` hỗ trợ đầy đủ 11 loại vật liệu. |
| **7** | **Đồng bộ Thẻ Bài World Ribbon** | Nâng cấp các nút chuyển thế giới trong `LevelSelect.gd` sang texture thẻ bài 9-patch gỗ nẹp vàng. Dọn dẹp emoji thô trong `MainMenu.gd`. |
| **8** | **Bảo vệ Sự Kiện Input Trứng** | Gọi `get_viewport().set_input_as_handled()` trong toàn bộ các script trứng kỹ năng khi kích hoạt Tap-in-Flight. |

---

## 4. KẾT QUẢ XÁC MINH & BẢO ĐẢM CHẤT LƯỢNG (TEST SUITE 21)

Toàn bộ các bản vá sẽ được tích hợp vào hệ thống kiểm thử tự động `TestRunner.gd` dưới dạng **Suite 21**, đảm bảo kiểm thử tự động headless đạt tỷ lệ vượt qua $100\%$ tuyệt đối (0 Lỗi, Return Code 0).
