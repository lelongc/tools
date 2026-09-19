# 03 — Độ khó, Trải nghiệm người chơi và Kinh tế Game

Tài liệu này phân tích chuyên sâu về hệ thống gameplay, cân bằng độ khó qua 10 thế giới (200 màn), vai trò chiến thuật của 7 loại trứng, trải nghiệm nghe nhìn/điều khiển và vòng tuần hoàn kinh tế (Coins, Consumables, Quảng cáo mô phỏng, Vòng quay may mắn).

---

## 1. Đường cong độ khó và Cân bằng Chiến dịch (Campaign Progression)

### 1.1 Thống kê tổng quan 200 Màn chơi

Dựa trên kết quả đo đạc thực tế từ mã nguồn sinh màn (`CampaignLevel.gd`):

| Thế giới | Chủ đề & Vật liệu | Quái/Màn | Tổng HP Quái | Khối cản | Tảng đá | TNT / Nuke | Lồng con | Số trứng cấp | Tỷ lệ Đạn/Quái |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **W1** | Nông trại (Gỗ / Đá) | 1 – 9 | 13.070 | 590 | 35 | 19 / 0 | 3 | 129 | 0,97 |
| **W2** | Mỏ đá (Đá / Thép) | 3 – 9 | 43.739 | 690 | 39 | 40 / 0 | 0 | 128 | 0,86 |
| **W3** | Nhà máy khói độc (Thép / Obsidian) | 3 – 9 | 49.544 | 636 | 18 | 39 / 20 | 0 | 147 | 0,97 |
| **W4** | Hoàng cung dung nham (Obsidian / Thép) | 4 – 10 | 111.575 | 805 | 60 | 19 / 40 | 0 | 147 | 0,88 |
| **W5** | Thánh địa pha lê (Crystal / Kính) | 6 – 9 | 99.643 | 780 | 52 | 40 / 40 | 5 | 143 | 0,89 |
| **W6** | Hầm titan công nghệ (Cyber Alloy / Thép) | 4 – 8 | 73.905 | 633 | 35 | 40 / 20 | 5 | 143 | 0,98 |
| **W7** | Rừng rêu đầm lầy (Swamp Wood / Đá) | 4 – 9 | 80.802 | 659 | 33 | 40 / 20 | 5 | 143 | 0,92 |
| **W8** | Hầm băng vĩnh cửu (Permafrost / Crystal) | 4 – 8 | 87.838 | 645 | 51 | 40 / 20 | 5 | 143 | 0,99 |
| **W9** | Vực sâu rồng lửa (Magma Brick / Obsidian) | 7 – 9 | 120.313 | 795 | 55 | 40 / 60 | 5 | 155 | 0,89 |
| **W10** | Thánh điện tinh tú (Celestial Stone / Crystal) | 7 – 10 | 153.428 | 843 | 55 | 40 / 40 | 5 | 184 | 0,96 |
| **TỔNG** | **10 Thế Giới Độc Bản** | **1 – 10** | **833.857** | **7.076** | **438** | **357 / 220** | **33** | **1.442** | **0,92 (TB)** |

### 1.2 Nhận xét và Các điểm gãy độ khó (Difficulty Spikes)

1. **Bước nhảy HP đột biến tại World 4 (Hoàng cung dung nham)**:
   - Từ World 3 (49.544 HP) nhảy vọt lên World 4 (111.575 HP) — tăng gấp **2,25 lần**. Nguyên nhân do quái vật World 4 (`imperial_boar`, `lava_golem`) có lượng máu cơ bản rất cao (600 và 550 HP), kết hợp với việc xuất hiện vật liệu Obsidian (950 HP/khối).
   - *Khuyến nghị*: World 4 cung cấp 40 quả Nuke và 40 quả Black Hole để bù đắp, tuy nhiên người chơi mới dễ bị "ngợp" nếu chưa thành thạo kỹ năng kích nổ Hố đen trên không. Cần thêm gợi ý đường bay hoặc tăng nhẹ bán kính kích nổ của Nuke tại các màn 61–65.
2. **Hiện tượng "Thắt cổ chai" số lượng trứng (Egg Scarcity)**:
   - Tỷ lệ đạn/quái trung bình là **0,92 quả trứng trên 1 quái vật**. Điều này đồng nghĩa: người chơi **bắt buộc** phải tận dụng phản ứng dây chuyền (sập tháp, đè đá, nổ thùng TNT) mới có thể thắng màn. Nếu bắn trượt hoặc chỉ tiêu diệt 1 quái/1 trứng thì chắc chắn sẽ hết trứng và thua cuộc.
   - Đây là thiết kế chuẩn xác của dòng game giải đố vật lý (Physics Destruction Puzzle), nhưng cần giữ đúng tôn chỉ này trong thiết kế hầm ngục: mọi con quái ở vị trí hiểm hóc đều phải có một "điểm tử huyệt" kiến trúc (trụ yếu, dây neo, tảng đá chực lăn) để người chơi khai thác.
3. **Phân bố Lồng cứu gà con (Rescue Cage)**:
   - Lồng gà con hoàn toàn vắng bóng ở World 2, World 3, World 4 (0 lồng), sau đó xuất hiện đều đặn 5 lồng/thế giới ở World 5, 6, 7, 8, 9, 10.
   - *Khuyến nghị*: Bổ sung 2–3 lồng cứu gà con vào World 2 và World 3 để tạo sự nhất quán trong cốt truyện "gà mẹ giải cứu đàn con" xuyên suốt hành trình.

---

## 2. Phân tích Vai trò Chiến thuật của 7 Loại Trứng

### 2.1 Ma trận Vũ khí & Vật liệu

| Loại trứng | Cơ chế kích hoạt | Sát thương | Hiệu ứng đặc biệt | Ưu thế chiến thuật | Nhược điểm / Hạn chế |
|---|---|:---:|---|---|---|
| **Normal Egg** | Va chạm | 120 | Bật nảy 4 lần, gây chấn động | Mở màn thăm dò, phá gỗ mỏng, kích hoạt TNT gần | Vô dụng trước Thép/Obsidian |
| **Bomb Egg** | Va chạm / Chạm tay | 350 | Nổ diện rộng bán kính 150px, đẩy văng mảnh vụn | Phá vỡ cụm công trình, thổi bay hàng loạt quái | Sát thương giảm dần theo khoảng cách tâm nổ |
| **Drill Egg** | Chạm tay trên không | 180 + Xuyên | Tăng tốc phản lực $1.400\text{px/s}$, xuyên thủng tối đa 5 lớp | Bắn tỉa quái trốn sâu trong boong-ke, xuyên dầm thép | Quỹ đạo thẳng tắp, dễ lệch nếu căn sai góc |
| **Frost Egg** | Va chạm / Chạm tay | 80 + Hóa băng | Bán kính 190px, biến khối thành Kính ($25\text{ HP}$) | Vô hiệu hóa khối Obsidian/Thép siêu cứng | *Nghịch lý cơ chế*: Gây 80 sát thương ngay lập tức nên phá hủy luôn thay vì để lại trạng thái giòn |
| **Cluster Egg** | Chạm tay trên không | $3 \times 120$ | Tách thành 3 gà con bay tỏa góc $25^\circ$ | Rải thảm diện rộng, dọn các tháp canh lẻ trên cao | Thiếu lực xuyên phá công trình kiên cố |
| **Acid Egg** | Va chạm / Chạm tay | $220\text{/s}$ (1,8s) | Tạo vũng axit 135px ăn mòn liên tục (tổng ~396 dmg) | Làm tan chảy các tầng trụ chịu lực dày đặc | Tác dụng theo thời gian (DoT), cần 1,8s mới phát huy hết lực |
| **Black Hole** | Va chạm / Chạm tay | 400 + Hút | Lực hút $1.200\text{px/s}$ trong 1,2s, nổ Supernova | Gom toàn bộ quái và khối vụn vào tâm nổ | Tầm ảnh hưởng cực lớn, có thể làm văng tảng đá về hướng ngoài ý muốn |

### 2.2 Nghịch lý Cơ chế Trứng Băng (The Frost Egg Paradox)

Trong `FrostEgg.gd`:
```gdscript
# Biến các khối đá/gỗ thành băng giòn dễ vỡ
if "material_type" in col:
    col.material_type = "glass"
    col.current_health = min(col.current_health, 25.0)

if col.has_method("take_damage"):
    col.take_damage(80.0, global_position)
```
- **Vấn đề**: Khi trứng nổ, khối được hạ máu xuống `25.0` nhưng ngay trong frame đó lại nhận `80.0` sát thương. Do $80.0 > 25.0$, **100% các khối bị trúng sóng băng đều vỡ vụn ngay lập tức**, biến Frost Egg thành một quả "Siêu Bom Nổ Chậm" thay vì công cụ làm đông cứng và làm giòn kết cấu.
- **Hướng cải thiện**:
  - Giảm sát thương nổ ban đầu của sóng băng xuống `15.0 – 20.0` (không đủ phá hủy ngay khối có HP 25).
  - Khối bị đóng băng chuyển sang màu lam tuyết óng ánh và nhận hiệu ứng "Brittle": chịu gấp 3 lần sát thương từ các vụ va đập của tảng đá hoặc đạn thường tiếp theo.
  - Quái vật trong bán kính đóng băng bị "Tê liệt" (Stunned) trong 3 giây, đóng băng toàn bộ hoạt ảnh mắt và mồ hôi.

---

## 3. Hệ thống Trùm Thế Giới (World Bosses)

Game khai báo 10 Boss đại diện cho 10 Thế giới tại các màn 20, 40, 60, 80, 100, 120, 140, 160, 180, 200:

| Màn | Tên Trùm | HP Cơ bản | Khối lượng | Bán kính va chạm | Đặc điểm ngoại quan |
|:---:|---|:---:|:---:|:---:|---|
| **20** | `boss_baron_pig` | 1.800 | 16.0 | 26px | Heo Nam Tước đội mũ phớt, đeo kính một tròng monocle giật nảy |
| **40** | `boss_iron_crusher` | 2.000 | 16.0 | 26px | Giáp nghiền sắt thép gai góc màu xám kim loại |
| **60** | `boss_toxic_alchemist` | 2.200 | 16.0 | 26px | Giả kim thuật sư độc dược xanh chuối phát sáng |
| **80** | `boss_magma_emperor` | 2.400 | 16.0 | 26px | Hoàng đế dung nham đỏ rực than hồng |
| **100** | `boss_crystal_overlord` | 2.600 | 16.0 | 26px | Chúa tể tinh thể tím thạch anh phản chiếu ánh sáng |
| **120** | `boss_cyber_mech` | 2.800 | 16.0 | 26px | Robot cơ giáp công nghệ cao neon xanh cyan |
| **140** | `boss_swamp_hydra` | 3.000 | 16.0 | 26px | Thủy quái đầm lầy rêu phong cổ xưa |
| **160** | `boss_frost_colossus` | 3.200 | 16.0 | 26px | Khổng lồ băng giá tuyết trắng tinh khiết |
| **180** | `boss_dragon_warlord` | 3.400 | 16.0 | 26px | Chiến tướng rồng lửa sừng nhọn uy mãnh |
| **200** | `boss_singularity_prime` | 3.600 | 16.0 | 26px | Thực thể hố đen vũ trụ tối thượng |

### Nhận xét & Hướng cải tiến Trùm
- **Hiện trạng**: Boss hiện tại hoạt động như một "Bao cát HP khổng lồ" (HP từ 1.800 đến 3.600, khối lượng 16.0). Trùm chưa có chiêu thức phản xạ, khiên chắn năng lượng hay khả năng tương tác lại người chơi.
- **Đề xuất nâng cấp**:
  1. *Khiên chắn giai đoạn (Shield Phase)*: Trùm có giáp bảo vệ, chỉ vỡ khi người chơi kích nổ đúng loại thùng (ví dụ Nuke phá khiên của Boss 120 Cyber Mech).
  2. *Đòn rung chuyển hầm*: Khi mất 50% máu, Boss dộng đất khiến trần hang rơi nhẹ một vài viên gạch đá nhỏ, tạo cơ hội cho người chơi tận dụng mảnh rơi để đè bẹp các tháp phụ.

---

## 4. Vòng tuần hoàn Kinh tế (Game Economy & Monetization)

### 4.1 Luồng tài nguyên hiện có
```text
[Vượt màn]  ──> +50 / 80 / 120 Vàng
[Xem Ad x3] ──> +150 / 240 / 360 Vàng
[Vòng quay] ──> +50 đến +1000 Vàng / +1 Trứng đặc biệt (Bomb/Acid/Drill)
       │
       ▼
[Ví người chơi: SaveManager.save_data["coins"]]  (HIỆN CHƯA CÓ CHỖ TIÊU!)
```

### 4.2 Các điểm khiếm khuyết trong kinh tế
1. **Thiếu hoàn toàn Shop / Điểm tiêu Vàng (Currency Sink)**:
   - Người chơi tích lũy hàng nghìn vàng từ chiến dịch và vòng quay nhưng không có cửa hàng để mua trứng dự phòng, mua skin mũ cho gà, hay nâng cấp bệ phóng.
2. **Kho vật phẩm tiêu hao (Consumables) bị cô lập**:
   - `SaveManager` lưu trữ số lượng trứng dự trữ (`"consumables": {"bomb": 1, "drill": 0, "acid": 0}`), nhưng trong `GameHUD.gd` không có giao diện cho phép người chơi gọi thêm trứng tiêu hao này vào trận đấu khi gặp màn quá khó.

### 4.3 Đề xuất thiết kế Tính năng "Khay Trứng Tiếp Viện" (In-Game Booster Tray)
- Thêm một thanh nhỏ ở góc dưới màn hình (`BoosterTray`):
  - Nút **+1 Bom**: Tiêu 150 Vàng hoặc 1 quả Bomb từ kho tiêu hao để nạp ngay 1 quả Bomb Egg vào lượt bắn hiện tại.
  - Nút **+1 Khoan**: Tiêu 120 Vàng hoặc 1 quả Drill từ kho tiêu hao.
  - Nút **Tia ngắm laser chuẩn xác**: Tiêu 80 Vàng để kéo dài đường cong dự đoán quỹ đạo thêm 100%.
- Giải quyết triệt để 2 bài toán:
  1. Cho người chơi lý do tích cực để cày vàng và xem video nhận x3 vàng.
  2. Cung cấp lối thoát công bằng cho người chơi khi kẹt màn khó mà không cần sửa giảm độ khó gốc của màn chơi.

---

## 5. Trải nghiệm Người dùng (UX), Điều khiển và Camera

1. **Khung nhìn Camera (Dynamic Camera Framing)**:
   - Camera thu phóng linh hoạt theo công thức:
     $$\text{zoom} = \text{clamp}\left(\frac{540}{\text{cavern\_width} + 60}, 0.38, 1.0\right)$$
   - Ở các màn rộng lớn (World 9–10, rộng 1.100px), camera lùi xa (zoom ~0.46) giúp người chơi bao quát toàn bộ cụm 3 tháp chiến lũy mà không cần cuộn màn hình thủ công.
2. **Phản hồi lực ngắm bắn (Slingshot Drag Feel)**:
   - Thân gà biến dạng nén lò xo nhịp nhàng theo lực kéo `visual_root.scale = Vector2((1.0 + tension) * sign_x, 1.0 - tension * 0.6)`.
   - Đường cong dự đoán bay tính toán chính xác trọng lực $750\text{px/s}^2$, hiển thị chấm bi mờ dần về cuối quỹ đạo, tạo cảm giác trực quan chuẩn mực Angry Birds.
3. **Phản hồi xúc giác & Rung màn hình (Camera Shake Trauma)**:
   - Hệ thống Trauma phân rã theo lũy thừa 2:
     $$\text{offset} = \text{max\_offset} \times \text{trauma}^2 \times \sin(\text{noise})$$
   - Vụ nổ bom lớn tạo chấn động đã tai đã mắt, nhưng các va đập cạ xát nhẹ của khối đổ nát không kích hoạt rung camera, giữ cho mắt người chơi luôn thoải mái, không bị chóng mặt khi công trình sập từ từ.
