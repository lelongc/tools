# 🎨 ĐẶC TẢ MỸ THUẬT, GIAO DIỆN, VFX & ÂM THANH (ART & AUDIO SPEC)
# RUNIC SLICE: TACTICAL BACKPACK SURVIVOR

---

## 🎨 1. BẢNG MÀU CHỦ ĐẠO (COLOR PALETTE & VISUAL TONE)

Trò chơi áp dụng phong cách **Gothic Steampunk Arcane** với độ tương phản cao để đảm bảo mọi viên đạn, con số sát thương và ô lưới Balo đều nổi bật rõ ràng trên màn hình điện thoại lẫn màn hình PC:

```
┌─────────────────┬───────────┬────────────────────────────────────────────────────────┐
│ Tên Màu         │ Mã HEX    │ Ứng Dụng Trong Game                                    │
├─────────────────┼───────────┼────────────────────────────────────────────────────────┤
│ Void Abyss Dark │ #0d0f18   │ Màu nền đấu trường ngục tối & khung Balo ngoài         │
│ Runic Cyan      │ #00f0ff   │ Năng lượng cổ ngữ, vệt lướt Dash, đạn ma thuật         │
│ Magma Orange    │ #ff5722   │ Lửa nham thạch, bom nổ, sát thương thiêu đốt           │
│ Frost Ice Blue  │ #80d8ff   │ Băng giá, làm chậm, tinh thể đông lạnh                 │
│ Electric Purple │ #d500f9   │ Sấm sét hư không, tia năng lượng, Boss tối thượng      │
│ Pure Gold       │ #ffd700   │ Runic Shards, Rương báu vật, viền vật phẩm Huyền Thoại │
│ Health Crimson  │ #ff1744   │ Máu nhân vật, vệt máu quái, số nhảy Bạo Kích (Crit)   │
│ Grid Emerald    │ #00e676   │ Ô lưới hợp lệ khi kéo thả đồ (Valid Snap)              │
│ Grid Crimson    │ #f50057   │ Ô lưới bị chặn hoặc đè vật phẩm (Invalid Drop)         │
└─────────────────┴───────────┴────────────────────────────────────────────────────────┘
```

---

## 💥 2. HỆ THỐNG "JUICE" & CẢM GIÁC ĐÃ TAY (GAME FEEL & HAPTICS)

Để người chơi không thể dứt ra sau 30 giây trải nghiệm, game áp dụng 4 kỹ thuật Juice đỉnh cao:

### A. Rung Lắc Màn Hình Theo Hàm Đa Thức (Polynomial Trauma Screen Shake)
* Không dùng rung ngẫu nhiên thô kệch. Áp dụng công thức $Trauma^2$ với suy giảm tuyến tính:
  ```gdscript
  func add_trauma(amount: float) -> void:
      trauma = min(trauma + amount, 1.0)

  func _process(delta: float) -> void:
      if trauma > 0:
          trauma = max(trauma - delta * 1.5, 0.0)
          var shake = trauma * trauma
          camera.offset = Vector2(
              randf_range(-1, 1) * max_offset.x * shake,
              randf_range(-1, 1) * max_offset.y * shake
          )
  ```

### B. Ngừng Khung Hình Cực Ngắn Khi Đánh Trúng (Micro Hit-Stop)
* Khi người chơi chém trúng một đòn Bạo Kích (Crit) hoặc tiêu diệt một cụm quái lớn, tốc độ động cơ game chậm lại tức thì trong $0.05\text{ giây}$:
  ```gdscript
  static func hit_stop(duration_sec: float = 0.05):
      Engine.time_scale = 0.05
      await get_tree().create_timer(duration_sec * 0.05).timeout
      Engine.time_scale = 1.0
  ```
* $\Rightarrow$ Tạo ra cảm giác lực chém "đậm đặc, nặng tay" như trong các tựa game chặt chém đỉnh cao (*Hades, Dead Cells*).

### C. Số Sát Thương Nhảy Búng (Bouncy Floating Combat Text)
* Mỗi phát bắn trúng tạo ra một nhãn sát thương nhảy lên theo quỹ đạo parabol và mờ dần trong $0.6\text{ giây}$.
* Đòn thường: Chữ màu trắng, kích thước $14\text{pt}$.
* Đòn Crit: Chữ màu đỏ viền vàng, kích thước $22\text{pt}$, nảy mạnh kèm hiệu ứng nổ tia sao nhỏ.

---

## 🎵 3. BỘ TỔNG HỢP ÂM THANH THỦ TỤC (PROCEDURAL SOUND SYNTHESIZER)

Nhằm đảm bảo dự án hoàn toàn tự vận hành, không bị phụ thuộc vào file MP3/WAV bên ngoài dễ gãy liên kết, `SoundManager.gd` tự động tổng hợp sóng âm (*Synthesized PCM Audio*) qua các bus âm thanh chuyên dụng:

1. **Tiếng Balo Snap (Click Giòn Tan):** Sóng sin tần số cao $1200\text{Hz}$ giảm nhanh về $400\text{Hz}$ trong $0.04\text{s}$ tạo cảm giác khớp ô đồ đạc cực đã tai.
2. **Tiếng Chém Kiếm (Whoosh Slash):** Tiếng ồn trắng (White noise) được lọc qua bộ lọc thông dải (*Band-pass filter*) quét từ $3000\text{Hz} \rightarrow 500\text{Hz}$.
3. **Tiếng Bắn Nỏ (Twang & Thud):** Sóng tam giác ngắn mô phỏng dây nỏ bật ra kèm tiếng va đập gỗ.
4. **Tiếng Nhặt Vàng / Runic Shards:** Chuỗi 3 nốt nhạc cao dần ($C_6 \rightarrow E_6 \rightarrow G_6$) tạo cảm giác hưng phấn kích hoạt Dopamine tức thì.
5. **Tiếng Quái Nổ (Boom):** Sóng vuông tần số thấp $80\text{Hz}$ bão hòa (Saturated distortion) tạo độ nặng nề chấn động.
