# Kế Hoạch Đại Tu Toàn Bộ Hiệu Ứng Kỹ Năng (VFX Overhaul)

## 1. Phân Tích Hiện Trạng

### 1.1 Nguyên Nhân Gốc Rễ Gây Ra "Nền Xanh Dương To Đùng"

Sau khi kiểm tra kỹ code, tôi phát hiện **thủ phạm chính** là dòng:
```javascript
ctx.globalCompositeOperation = 'screen';
```

Chế độ hòa trộn `screen` hoạt động theo nguyên lý: **Mọi pixel có giá trị > 0 sẽ bị sáng lên.** Khi kết hợp với `shadowBlur` (bóng phát sáng) và các `Gradient` có `rgba(0, 255, 255, ...)` (màu xanh ngọc), kết quả là:
- `shadowBlur` vẽ ra một **vùng bóng hình vuông** bao quanh mỗi hình dạng.
- Chế độ `screen` biến vùng bóng đó thành **một khối xanh dương khổng lồ** hiển thị rõ mồn một trên nền game.
- Gradient chưa fade hết về `alpha = 0` cũng góp phần tạo ra viền xanh.

**Quy tắc vàng:** KHÔNG BAO GIỜ dùng `shadowBlur` kết hợp với `globalCompositeOperation = 'screen'`. Đây là nguyên nhân chính gây ra mọi lỗi "nền xanh".

### 1.2 Assets Hiện Tại

| File | Đang Dùng? | Giữ/Xóa |
|------|-----------|----------|
| `ground_block.png` | ✅ world.js | **Giữ** |
| `bounce_pad.png` | ✅ world.js | **Giữ** |
| `ice_block.png` | ✅ world.js | **Giữ** |
| `tileset_pro.png` | ✅ GameScene.js | **Giữ** |
| `laser_beam.png` | ✅ player.js (Skill K) | **Giữ** |
| `lightining1-Sheet.png` | ✅ combat.js (Slash sprite) | **Giữ** |
| `lightining5-Sheet.png` | ✅ combat.js (Impact sprite) | **Giữ** |
| `spark_03.png` | ✅ effects.js | **Giữ** |
| `star_05.png` | ✅ effects.js | **Giữ** |
| `smoke_04.png` | ✅ effects.js | **Giữ** |
| `impact_ice_128.png` | ✅ effects.js | **Giữ** |
| `drill_aura.png` | ❌ Không ai dùng | **XÓA** |
| `explosion_spritesheet.png` | ❌ Không ai dùng | **XÓA** |
| `ground_impact.png` | ❌ Không ai dùng | **XÓA** |
| `hq_crater.png` | ❌ Không ai dùng | **XÓA** |
| `hq_drill.png` | ❌ Không ai dùng | **XÓA** |
| `hq_pillar.png` | ❌ Không ai dùng | **XÓA** |
| `hq_slash.png` | ❌ Không ai dùng | **XÓA** |
| `nova_burst.png` | ❌ Không ai dùng | **XÓA** |
| `slash_spritesheet.png` | ❌ Không ai dùng | **XÓA** |
| `upward_blast.png` | ❌ Không ai dùng | **XÓA** |

→ **Xóa 10 file rác**, tiết kiệm ~5.2MB.

### 1.3 Danh Sách Kỹ Năng & Vấn Đề Hiện Tại

| Skill | Phím | Vấn Đề | Giải Pháp |
|-------|------|---------|-----------|
| **Combo Attack** (1-2-3 hit) | Chuột Trái | Xúc tu + sprite nhỏ → OK | Giữ nguyên |
| **Dash Strike** | U | `shadowBlur` + `screen` → NỀN XANH | Viết lại |
| **Bio-Drill** | I (trung lập) | `shadowBlur` + `screen` → NỀN XANH | Viết lại |
| **Low Sweep** | Chuột Trái (dưới) | `shadowBlur` + `screen` → NỀN XANH | Viết lại |
| **Up Slash** | W + Chuột Trái | `shadowBlur` + `screen` → NỀN XANH | Viết lại |
| **Pogo Slash** | S + Chuột Trái (trên không) | `shadowBlur` + `screen` → NỀN XANH | Viết lại |
| **Rising Blast** | W + I | `shadowBlur` + `screen` → NỀN XANH | Viết lại |
| **Lightning Nova** | L | `screen` → NỀN XANH nhẹ | Viết lại |
| **Ground Smash** | S + I (trên không) | `shadowBlur` + `screen` → NỀN XANH | Viết lại |
| **Charge K / Laser** | K (giữ/thả) | `laserImg` + `screen` → OK | Giữ nguyên |

### 1.4 Xúc Tu (Tentacles) Có Gây Lag Không?

Kiểm tra code `drawHeadSpaceTentacle` (dòng 789-854):
- **10 segments** cho mỗi tentacle, mỗi segment = 1 phép `Math.sin` + 1 phép `lineTo`.
- Tối đa 5 tentacles cùng lúc (combo 3).
- **Kết luận: KHÔNG gây lag.** 50 phép `sin` + 50 phép `lineTo` là cực kỳ nhẹ.
- **Giữ nguyên xúc tu**, chúng tạo nên linh hồn nhân vật.

## 2. Giải Pháp: Multi-Layer Glow (Không `shadowBlur`, Không `screen`)

Thay vì dùng `shadowBlur` để tạo glow, tôi sẽ **vẽ nhiều lớp cùng hình dạng nhưng to/nhỏ khác nhau với alpha giảm dần:**

```javascript
// Lớp 1: Outer glow (lớn, mờ)
ctx.fillStyle = 'rgba(0, 255, 255, 0.15)';
ctx.fill(enlargedPath);
// Lớp 2: Mid glow (trung bình)
ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
ctx.fill(normalPath);
// Lớp 3: Core (sáng chói)
ctx.fillStyle = '#ffffff';
ctx.fill(corePath);
```

## 3. Thiết Kế Hiệu Ứng Mới Cho Từng Skill

### 3.1 Nhát Chém (Low Sweep / Up Slash / Pogo Slash)
- Vẽ bằng `ctx.arc()` → 3 lớp: outer glow (cyan mờ, dày), mid (cyan), core (trắng, mỏng).
- Kích thước phóng to rồi fade theo `prog`.

### 3.2 Dash Strike (U) & Bio-Drill (I)
- Vẽ tam giác/mũi tên bằng `ctx.lineTo` → 3 lớp glow thủ công.
- Thêm 3 vòng khuyên `ellipse` mờ dần.

### 3.3 Rising Blast (W + I)
- 5 cột sáng bằng `ctx.fillRect` → 3 lớp: ngoài rộng mờ, giữa, lõi trắng hẹp.
- Chiều cao tăng nhanh theo `prog`.

### 3.4 Lightning Nova (L)
- Vòng tròn mở rộng bằng `ctx.arc` → 3 lớp stroke (dày→mỏng, mờ→sáng).
- 8 đường sét bằng `ctx.lineTo`.

### 3.5 Ground Smash (S + I trên không)
- Ellipse bẹp bằng `ctx.ellipse` → 3 lớp glow.
- Cột sáng vọt lên bằng `fillRect` → 3 lớp.

### 3.6 Charge K & Laser — Giữ nguyên

## 4. File Thay Đổi

### [MODIFY] player.js
- Dòng 899-1230: Viết lại toàn bộ VFX.
- **Quy tắc bắt buộc:** Không dùng `shadowBlur` hay `globalCompositeOperation = 'screen'` trong bất kỳ skill nào ngoại trừ Laser (dòng 1312).

### [DELETE] 10 file assets không dùng

## 5. Verification
- Mắt thường: Tất cả skill hiển thị hiệu ứng sáng **KHÔNG CÓ nền xanh/khối vuông**.
- FPS: Giữ vững 60.
- Laser: Vẫn hoạt động bình thường.

---
**Tóm tắt:** Xóa 10 ảnh rác + Viết lại 100% VFX skill bằng kỹ thuật Multi-Layer Glow thủ công (Không `shadowBlur`, Không `screen`) → Chấm dứt vĩnh viễn lỗi "nền xanh dương to đùng".
