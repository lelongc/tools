# 💻 KIẾN TRÚC KỸ THUẬT & TỐI ƯU HÓA GODOT 4.7.1 (CROSS-PLATFORM TECH SPEC)
# RUNIC SLICE: TACTICAL BACKPACK SURVIVOR

---

## 🏛️ 1. MÔ HÌNH KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

Dự án áp dụng mô hình hướng dữ liệu (*Data-Driven Resource Pattern*) kết hợp kiến trúc dịch vụ quản lý toàn cục (*Autoload Service Singletons*):

```
                                  ┌───────────────────────────────┐
                                  │       GODOT ENGINE 4.7.1      │
                                  └───────────────┬───────────────┘
                                                  │
         ┌───────────────────┬────────────────────┼───────────────────┬───────────────────┐
         ▼                   ▼                    ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  GameManager    │ │  SoundManager   │ │   SaveManager   │ │   ObjectPool    │ │  InputManager   │
│ (Trạng thái Game│ │ (Bộ tổng hợp âm │ │(Lưu trữ nguyên  │ │(Hệ thống tái sinh│ │(Thống nhất input│
│  & Tiến độ wave)│ │  thanh thủ tục) │ │ tử chống crash) │ │ đạn/quái 0-lag) │ │ Touch/WASD/Pad) │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 🚀 2. HỆ THỐNG TÁI SINH ĐỐI TƯỢNG 0-CẤP PHÁT (ZERO-ALLOCATION OBJECT POOLING)

Trên các thiết bị di động tầm trung và Steam Deck khi chạy ở chế độ tiết kiệm pin, việc gọi `instantiate()` và `queue_free()` hàng trăm lần mỗi giây sẽ kích hoạt bộ thu gom rác (Garbage Collector Spike), gây hiện tượng tụt khung hình (*Micro-stutter*).

### Thiết Kế Mảng Tĩnh (Pre-allocated Static Pools):
* **ProjectilePool:** Khởi tạo sẵn **500 Node đạn** ngay khi tải Game Arena.
* **EnemyPool:** Khởi tạo sẵn **250 Node quái**.
* **DamageNumberPool:** Khởi tạo sẵn **120 Node nhãn chữ**.
* **VFXPool:** Khởi tạo sẵn **60 Bộ hạt nổ**.

### Cơ Chế Kích Hoạt & Thu Hồi:
```gdscript
# scripts/core/ObjectPool.gd
extends Node

var bullet_pool: Array[Node2D] = []
var active_bullets: Array[Node2D] = []

func spawn_bullet(pos: Vector2, dir: Vector2, dmg: float, elem: String) -> Node2D:
    var bullet: Node2D
    if bullet_pool.is_empty():
        # Dự phòng khẩn cấp nếu đạn vượt ngưỡng 500
        bullet = bullet_scene.instantiate()
        add_child(bullet)
    else:
        bullet = bullet_pool.pop_back()
        
    bullet.position = pos
    bullet.initialize(dir, dmg, elem)
    bullet.show()
    bullet.set_process(true)
    active_bullets.append(bullet)
    return bullet

func recycle_bullet(bullet: Node2D) -> void:
    bullet.hide()
    bullet.set_process(false)
    active_bullets.erase(bullet)
    bullet_pool.append(bullet)
```

---

## 💾 3. LƯU TRỮ NGUYÊN TỬ CHỐNG HỎNG FILE (FAULT-TOLERANT ATOMIC SAVE)

Tuân thủ nghiêm ngặt kỹ thuật trong `godot-mobile-hardening`: Khi hệ điều hành Android hoặc iOS đóng ứng dụng chạy ngầm do thiếu RAM, file lưu không bao giờ bị ghi dở dang hoặc trắng xóa.

```gdscript
# scripts/core/SaveManager.gd
const SAVE_FILE = "user://runic_save.json"
const TEMP_FILE = "user://runic_save.json.tmp"
const BACKUP_FILE = "user://runic_save.json.bak"

func save_data_atomic(data: Dictionary) -> void:
    # 1. Ghi ra file tạm thời
    var file = FileAccess.open(TEMP_FILE, FileAccess.WRITE)
    if file:
        file.store_string(JSON.stringify(data, "\t"))
        file.flush()
        file.close()
        
        # 2. Tạo bản sao lưu dự phòng an toàn
        if FileAccess.file_exists(SAVE_FILE):
            DirAccess.copy_absolute(SAVE_FILE, BACKUP_FILE)
            
        # 3. Đổi tên nguyên tử (Atomic Replace)
        DirAccess.rename_absolute(TEMP_FILE, SAVE_FILE)

# Lắng nghe sự kiện từ HĐH khi người dùng gạt app hoặc bấm phím Back
func _notification(what: int) -> void:
    match what:
        NOTIFICATION_APPLICATION_PAUSED, NOTIFICATION_WM_CLOSE_REQUEST, NOTIFICATION_WM_GO_BACK_REQUEST:
            save_current_progress()
```

---

## 📱 4. XỬ LÝ NÚT BACK CỨNG TRÊN ANDROID (`NOTIFICATION_WM_GO_BACK_REQUEST`)
* Trong trận đấu $\rightarrow$ Bật Menu Tạm Dừng (*Pause Modal*).
* Trong Xưởng Balo $\rightarrow$ Không thoát game, chỉ hiển thị thông báo "Hãy nhấn Bắt Đầu Wave".
* Trong Menu Cài Đặt hoặc Bảng Chi Tiết Đồ $\rightarrow$ Đóng popup tương ứng.
* Tại Menu Chính $\rightarrow$ Hiển thị hộp thoại xác nhận thoát game.
