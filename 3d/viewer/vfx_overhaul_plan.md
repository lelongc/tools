# Kế Hoạch Đại Tu VFX Toàn Diện — Đợt 2 (Tất Cả Skill)

## Tổng Quan

Sau đợt 1 (đã sửa lỗi nền xanh), tất cả skill đều đang dùng vector thuần canvas nhưng vẫn "phèn" — thiếu chi tiết, thiếu sức sống. Đợt này sẽ nâng cấp **toàn bộ 9 skill** lên mức chất lượng game 2D thực thụ.

---

## Phân Tích Hiện Trạng Từng Skill

| # | Skill | Phím | Hiện trạng | Đánh giá |
|---|-------|------|-----------|----------|
| 1 | **Combo Attack** | Click×3 | Xúc tu + sprite nhỏ | ⭐⭐⭐ OK |
| 2 | **Dash Strike** | U | Hình nón bezier + 3 vòng | ⭐⭐ Phèn — chỉ là hình lục giác trơn |
| 3 | **Bio-Drill** | I (đứng yên) | Tam giác nhọn 180px + 4 vòng | ⭐ Tệ — quá dài, kì cục |
| 4 | **Low Sweep** | S + Click | 1 vệt lưỡi liềm bezier | ⭐ Tệ — hèn, không có cảm giác mạnh |
| 5 | **Up Slash** | W + Click | 1 vệt lưỡi liềm lên trên | ⭐⭐ Phèn — giống Low Sweep quá |
| 6 | **Pogo Slash** | S + Click (trên không) | 1 vệt lưỡi liềm xuống | ⭐⭐ Phèn — giống Low Sweep quá |
| 7 | **Rising Blast** | W + I | 5 cột rect + 5 beam rect | ⭐⭐ Phèn — cột vuông vức không tự nhiên |
| 8 | **Lightning Nova** | L | Vòng tròn + 8 tia thẳng | ⭐⭐ Phèn — tia thẳng không giống sét |
| 9 | **Ground Smash** | S + I (trên không) | Ellipse + cột rect | ⭐ Tệ — nhạt nhẽo |
| 10 | **Laser Beam** | K (giữ/thả) | `laser_beam.png` 670KB stretched | ⭐⭐ Lag — ảnh quá nặng, viết lại vector |

---

## Chiến Lược Chung

### Nguyên tắc bắt buộc:
1. **KHÔNG dùng `shadowBlur`** — đã chứng minh gây nền xanh.
2. **KHÔNG dùng `globalCompositeOperation = 'screen'`** trên vector — chỉ dùng cho sprite nền đen.
3. **Multi-Layer Glow** cho mọi thứ — 3 lớp (outer mờ → mid → core trắng).
4. **Particle burst** bằng `addParticle()` có sẵn để thêm sức sống.
5. **Tạo sprite sheet nhỏ gọn** (nền đen, dưới 5KB) cho 2-3 skill cần chi tiết phức tạp.

---

## Thiết Kế Chi Tiết Từng Skill

### 1. Combo Attack (Click×3) — GIỮ NGUYÊN ✅
Xúc tu + sprite lightning đã hoạt động tốt. Không sửa.

---

### 2. Dash Strike (U) — "Mũi Tên Xuyên Không"
**Vấn đề:** Hình nón bezier trơn tuột, thiếu tốc độ cảm.

**Giải pháp:**
- Giữ shape nón bezier nhưng thêm **vệt sau lưng (afterimage trail)**: 5 bản copy mờ dần phía sau.
- Thêm **speed lines**: 8-10 đường thẳng ngang lướt nhanh qua nhân vật.
- Particle burst `addParticle()` tại mũi nhọn.
- Giảm kích thước nón từ 220px → 150px cho gọn hơn.

---

### 3. Bio-Drill (I đứng yên) — "Khoan Xoắn Ốc Năng Lượng"
**Vấn đề:** Tam giác nhọn dài 180px kì cục, không giống khoan.

**Giải pháp:**
- Rút ngắn còn **80px**.
- Vẽ **spiral helix**: 3 đường sin xoắn quanh trục ngang, quay nhanh (t * 25).
- Mỗi spiral = 3 lớp glow (mờ → sáng → trắng).
- Đầu mũi khoan: 1 hình tam giác nhỏ 20px (thay vì 180px).
- Tia lửa: `addParticle()` bắn ra từ mũi.
- Giảm vòng từ 4 → 2 vòng, rộng hơn.

---

### 4. Low Sweep (S + Click) — "Quét Chân Sóng Xung Kích"
**Vấn đề:** Chỉ 1 vệt bezier xoay ngang, không có cảm giác đập xuống đất.

**Giải pháp:**
- Tạo sprite sheet `sweep_fx.png` (6 frame 64×64, nền đen): vệt năng lượng quét ngang dọc mặt đất.
- Thêm **dust particles**: 8 hạt bụi/đá bắn lên từ chân bằng `addParticle()`.
- Thêm **ground crack line**: 1 đường nứt ngang trên mặt đất bằng vector (3 đoạn zigzag).
- Giữ crescent nhưng thu nhỏ và thêm motion blur (3 bản copy mờ dần).

---

### 5. Up Slash (W + Click) — "Chém Ngược Trời"
**Vấn đề:** Giống hệt Low Sweep, chỉ xoay góc.

**Giải pháp:**
- Giữ crescent nhưng thêm **vertical energy trail**: 1 vệt sáng dọc từ dưới lên.
- Thêm **rising sparks**: 6 hạt lửa bắn lên trời bằng `addParticle()`.
- Crescent mỏng hơn, sắc bén hơn (giảm drawSize từ 250 → 180, tăng tốc scale).

---

### 6. Pogo Slash (S + Click trên không) — "Chém Dẫm Xuống"
**Vấn đề:** Giống hệt Low Sweep.

**Giải pháp:**
- Giữ crescent hướng xuống nhưng thêm **downward energy streak**.
- Thêm **impact ring** khi chạm đất: 1 vòng ellipse nhanh.
- Particle bắn xuống + sang 2 bên.

---

### 7. Rising Blast (W + I) — "Cột Sét Trời"
**Vấn đề:** 5 cột fillRect vuông vức, không tự nhiên.

**Giải pháp:**
- Đổi từ `fillRect` vuông → **cột sét zigzag** bằng `lineTo` (mỗi cột = 8-10 đoạn zigzag random).
- Mỗi cột sét = 3 lớp stroke (dày mờ → trung → mỏng trắng).
- Đáy mỗi cột: thêm 1 vòng tròn nhỏ sáng (impact point).
- Particle burst tại đáy mỗi cột.

---

### 8. Lightning Nova (L) — "Bão Sét Tỏa Tròn"
**Vấn đề:** 8 tia thẳng đơ, không giống sét.

**Giải pháp:**
- Đổi 8 tia thẳng → **8 tia sét zigzag** (mỗi tia = 5-6 đoạn gãy ngẫu nhiên).
- Vòng tròn tỏa rộng: đổi từ filled circle → **shockwave ring** (stroke, không fill) dày → mỏng.
- Thêm **electric arcs** nhỏ nối giữa các tia sét (3-4 arc ngẫu nhiên).
- Particle burst tại đầu mỗi tia.

---

### 9. Ground Smash (S + I trên không) — "Thiên Thạch Đập Đất"
**Vấn đề:** Ellipse + rect pillar nhạt nhẽo.

**Giải pháp:**
- Tạo sprite sheet `smash_fx.png` (8 frame 64×64, nền đen): vụ nổ impact crater.
- Thêm **debris particles**: 12 mảnh vụn bắn tỏa ra bằng `addParticle()`.
- Thêm **screen shake** mạnh hơn (đã có nhẹ, tăng lên).
- Giữ pillar năng lượng nhưng đổi thành **zigzag lightning pillar** (giống Rising Blast).
- Thêm **ground cracks**: 4 đường nứt tỏa ra từ tâm.

---

### 10. Laser Beam (K) — "Tia Hủy Diệt" (SỬA LAG)
**Vấn đề:** `laser_beam.png` nặng 670KB, mỗi frame stretch ảnh lớn → lag.

**Giải pháp — Viết lại 100% bằng vector, XÓA ảnh:**
- **Thân tia**: 3 lớp `fillRect` (ngoài: cyan mờ rộng, giữa: cyan, lõi: trắng hẹp).
- **Rìa tia**: Thêm **noise jitter** bằng cách vẽ 2 đường path lượn sóng sin 2 bên (mô phỏng plasma).
- **Muzzle flash**: Giữ radialGradient hiện tại (đã đẹp).
- **Đầu tia**: Thêm impact burst tại điểm cuối beam.
- **Electric sparks**: Random particles dọc thân tia bằng `addParticle()`.
- **XÓA** `assets/laser_beam.png` (670KB) → tiết kiệm bộ nhớ, hết lag.

---

## File Thay Đổi

### [DELETE] `assets/laser_beam.png` (670KB — nguyên nhân lag)

### [NEW] `assets/sweep_fx.png` (~3KB)
- 6 frame 64×64, nền đen, hiệu ứng quét ngang.

### [NEW] `assets/smash_fx.png` (~4KB)  
- 8 frame 64×64, nền đen, hiệu ứng vụ nổ crater.

### [MODIFY] [player.js](file:///d:/folder/tools/3d/viewer/js/player.js)
- Dòng 5-6: Xóa import `laserImg`.
- Dòng 910-961: Viết lại Dash Strike (thêm afterimage + speed lines).
- Dòng 962-1015: Viết lại Bio-Drill (spiral helix ngắn gọn).
- Dòng 1016-1063: Viết lại Slash animations (thêm trail + particle cho Low/Up/Pogo).
- Dòng 1074-1161: Viết lại Rising Blast (zigzag lightning thay rect).
- Dòng 1163-1210: Viết lại Lightning Nova (zigzag bolts + electric arcs).
- Dòng 1211-1290: Viết lại Ground Smash (sprite + debris + cracks).
- Dòng 1344-1400: Viết lại Laser Beam (100% vector, xóa drawImage).

---

## Helper Function Mới

### `drawLightningBolt(ctx, x1, y1, x2, y2, segments, jitter)`
Hàm dùng chung cho Rising Blast, Lightning Nova, và các hiệu ứng sét:
- Vẽ 1 tia sét zigzag từ (x1,y1) → (x2,y2).
- `segments` đoạn, mỗi đoạn lệch ngẫu nhiên `jitter` px.
- Tự vẽ 3 lớp (outer glow → mid → core).

---

## Verification
- **Mắt thường**: Tất cả skill phải trông "ngầu", không hèn, không phèn.
- **Không nền xanh**: Đã cam kết từ đợt 1.
- **FPS ≥ 60**: Đặc biệt Laser phải mượt hơn trước (xóa ảnh 670KB).
- **Particle**: Mọi skill phải có particle bắn ra kèm theo.
