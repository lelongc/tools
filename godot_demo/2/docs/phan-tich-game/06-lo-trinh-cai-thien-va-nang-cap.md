# 06 — Lộ trình Cải thiện và Kế hoạch Nâng cấp Toàn diện

Tài liệu này tổng hợp toàn bộ các đề xuất cải thiện kỹ thuật, cân bằng lối chơi, thiết kế âm thanh - hình ảnh và hoàn thiện kinh tế game, được sắp xếp theo thứ tự ưu tiên và lộ trình thực thi rõ ràng.

---

## 1. Bảng Phân kỳ Thực hiện (Roadmap Overview)

```text
[ĐỢT 1: ĐÃ HOÀN TẤT] ──> Khắc phục 8 Lỗi cốt lõi (BUG-01 → 08) + Ổn định vật lý hầm + Save migration
          │
          ▼
[GIAI ĐOẠN 1: P1]   ──> Hoàn thiện Kinh tế: Cửa hàng tiêu Vàng + Khay Trứng tiếp viện (Booster Tray)
          │
          ▼
[GIAI ĐOẠN 2: P1]   ──> Tinh chỉnh Chiến thuật Đạn: Khắc phục nghịch lý Trứng Băng + Axit ăn mòn theo vật liệu
          │
          ▼
[GIAI ĐOẠN 3: P2]   ──> Nâng cấp Audio Bus (Limiter chống vỡ tiếng) + Ambient Particles cho 10 Thế giới
          │
          ▼
[GIAI ĐOẠN 4: P2]   ──> Đổi mới Cơ chế Boss: Thêm Khiên giai đoạn & Tương tác rung chuyển hầm
```

---

## 2. Chi tiết các Giai đoạn Cải thiện

### Giai đoạn 1 (Ưu tiên P1): Hoàn thiện Vòng lặp Kinh tế & Khay Tiếp Viện

- **Mục tiêu**: Cho người chơi lý do sử dụng số vàng tích lũy được (hiện đang dư thừa hàng nghìn vàng mà không có chỗ tiêu) và tận dụng kho vật phẩm tiêu hao (`consumables` trong `SaveManager`).
- **Nội dung công việc**:
  1. **Tạo giao diện Khay Trứng Tiếp Viện (`BoosterTray`) trong `GameHUD.tscn`**:
     - Nút gọi thêm 1 quả Bom (`+1 Bomb`): Tiêu hao 1 quả từ kho hoặc trừ 150 Vàng.
     - Nút gọi thêm 1 quả Khoan (`+1 Drill`): Tiêu hao 1 quả từ kho hoặc trừ 120 Vàng.
     - Nút ngắm Laser tăng cường (`+Precision Arc`): Trừ 80 Vàng để kéo dài đường nét ngắm thêm 100%.
  2. **Tạo Cửa hàng (`ShopModal.tscn`) tại Main Menu**:
     - Cho phép mua gói trứng tiêu hao (gói 5 Bom, 5 Khoan, 5 Axit).
     - Mở khóa các skin mũ hoạt hình đáng yêu cho Gà Oanh Tạc (Mũ phi công, Mũ cướp biển, Mũ thám tử, Mũ vương miện) bằng Vàng hoặc Sao chiến dịch.
- **Tiêu chuẩn nghiệm thu (Acceptance Criteria)**:
  - Bấm nút tiếp viện trong màn chơi trừ đúng số vàng/kho trứng và nạp ngay 1 quả trứng tương ứng vào danh sách đạn của gà.
  - Sau khi nạp tiếp viện, `GameManager.check_out_of_eggs()` được cập nhật lại đúng số đạn, hủy đếm ngược thua nếu đang đếm.
  - Toàn bộ giao dịch lưu vào `SaveManager` an toàn, không bị duplicate hoặc mất dữ liệu khi pause game.

---

### Giai đoạn 2 (Ưu tiên P1): Tinh chỉnh Chiến thuật 7 Loại Đạn

- **Mục tiêu**: Xóa bỏ các cơ chế mâu thuẫn, làm nổi bật vai trò chiến thuật của từng loại trứng theo đúng tôn chỉ game giải đố.
- **Nội dung công việc**:
  1. **Khắc phục nghịch lý Trứng Băng (`FrostEgg.gd`)**:
     - Giảm sát thương nổ ban đầu từ $80.0$ xuống $18.0$.
     - Khối bị đóng băng chuyển sang trạng thái "Giòn tan" (Brittle): hiển thị lớp tinh thể lam ngọc, máu giảm về 25 HP.
     - Tạo cơ hội cho phát bắn tiếp theo (đạn thường hoặc đá lăn va quẹt nhẹ) làm vỡ tung công trình.
     - Quái vật trong vùng ảnh hưởng bị đóng băng tê liệt trong 3,0 giây (không thể thở phào hay trêu ngươi).
  2. **Chuyên biệt hóa Sát thương Trứng Axit (`AcidEgg.gd`)**:
     - Đặt hệ số nhân sát thương theo loại vật liệu:
       - Kim loại / Hắc diện thạch / Đá (`steel`, `obsidian`, `cyber_alloy`): Sát thương x1.8 (Axit ăn mòn cực nhanh).
       - Gỗ / Băng / Pha lê (`wood`, `swamp_wood`, `glass`): Sát thương x0.8.
     - Bổ sung hiệu ứng bốc khói axit xanh lá nghi ngút bám quanh các khối đang bị tan chảy.
  3. **Tái cấu trúc thừa kế `BaseEgg.gd`**:
     - Chuyển 7 script trứng kế thừa từ `BaseEgg` thay vì trực tiếp từ `RigidBody2D`.
     - Tập trung toàn bộ logic dùng chung (biên despawn, ccd cast ray, tuổi thọ tối đa 8s, kiểm tra out-of-bounds) về `BaseEgg.gd`.

---

### Giai đoạn 3 (Ưu tiên P2): Kiến trúc Audio Bus & Không gian 10 Thế giới

- **Mục tiêu**: Đưa trải nghiệm nghe - nhìn tiệm cận chất lượng game studio cao cấp.
- **Nội dung công việc**:
  1. **Thiết lập Cấu trúc Audio Bus (`default_bus_layout.tres`)**:
     - Tạo 3 Bus con: `BGM`, `SFX`, `UI`.
     - Thêm hiệu ứng `AudioEffectLimiter` trên bus `SFX` với trần Ceiling $-1.0\text{dB}$ và Threshold $-2.0\text{dB}$. Dù có 10 khối thép cùng va chạm và 3 thùng TNT cùng nổ, âm thanh đầu ra vẫn mượt mà, ấm áp, tuyệt đối không bị rè loa trên thiết bị di động.
     - Thêm `AudioEffectLowPassFilter` trên bus `BGM` kích hoạt tự động khi người chơi mở menu Pause để tạo hiệu ứng âm thanh nền mờ ảo (Muffled BGM).
  2. **Bổ sung Hiệu ứng Bụi Môi trường (Ambient Particles)**:
     - Tạo một node `AmbientAtmosphereFX` tự động đổi kiểu hạt theo `world_id`:
       - World 1: Lá vàng rơi nhẹ.
       - World 4: Tàn lửa than hồng bốc lên từ lòng đất.
       - World 7: Bào tử nấm phát sáng lơ lửng.
       - World 8: Bông tuyết bay là đà.
       - World 10: Bụi sao hoàng kim lấp lánh.

---

### Giai đoạn 4 (Ưu tiên P2): Làm mới Trải nghiệm Đấu Trùm (World Bosses)

- **Mục tiêu**: Biến 10 trận Boss thành các cột mốc thử thách giải đố ấn tượng thay vì chỉ là bia đỡ đạn nhiều máu.
- **Nội dung công việc**:
  1. **Hệ thống Khiên bảo vệ theo đợt (Shield Barrier)**:
     - Boss có khiên năng lượng màu lam/đỏ bao bọc, miễn nhiễm sát thương trực tiếp từ đạn thả.
     - Người chơi phải phá sập các bệ đỡ để tảng đá hoặc thùng TNT rơi trúng điểm tiếp xúc của máy phát khiên để làm quá tải lá chắn, sau đó mới dứt điểm Boss.
  2. **Hoạt ảnh Phẫn nộ & Động đất nhẹ (Enrage Jolt)**:
     - Khi Boss giảm xuống dưới 50% HP: phát hoạt ảnh gầm thét giận dữ, dộng mạnh xuống nền hầm tạo chấn động nhẹ (Camera shake $0.25$), làm lung lay các mối nối của công trình xung quanh.

---

## 3. Quy trình Kiểm thử & Nghiệm thu Kỹ thuật

Mọi thay đổi trong các giai đoạn trên đều phải tuân thủ nghiêm ngặt quy trình kiểm thử 3 lớp:

1. **Kiểm thử tĩnh (Static Asset & Reference Audit)**:
   - Chạy script kiểm tra 100% đường dẫn tài nguyên `res://` không được có tệp thiếu.
2. **Kiểm thử tự động Headless (`TestRunner.tscn`)**:
   - Chạy kiểm tra bộ test tự động qua Godot CLI.
   - Bắt buộc kiểm tra cả 10 Thế giới: 0 lỗi sập công trình sớm trong thời gian tĩnh (Peacetime), 0 lỗi rung chân móng khi vừa thả trứng.
3. **Kiểm thử độ bền lặp lại (Stress Test 3 Iterations)**:
   - Chạy liên tiếp 3 vòng để khẳng định tính ổn định tất định, không có xung đột luồng hoặc rò rỉ bộ nhớ tại thời điểm kết thúc.
