# 🎮 STEAM COMMERCIAL RELEASE: 3D LOW-POLY ASSET SPECIFICATION (WRONG WAY)

> **Mục tiêu thương mại (Steam Launch Goal):** Xây dựng kho tài nguyên 3D Low-Poly phong phú, tối ưu hóa hiệu năng, màu sắc Pastel/Chibi wowed ấn tượng để sẵn sàng phát hành thương mại trên nền tảng Steam cho thể loại **Party Game / Control Chaos Multi-Player**.

---

## 🎨 1. QUY CHUẨN THIẾT KẾ ĐỒ HỌA (ART & TECHNICAL GUIDELINES)

- **Phong cách đồ họa (Art Style):** Low-Poly Stylized / Mochi Pastel Chibi (tương tự *Fall Guys*, *Gang Beasts*, *Party Animals*).
- **Tối ưu hóa đa giác (Poly Count Limit):**
  - **Nhân vật (Character):** 300 - 800 Triangles / Primitives (Ultra Lightweight).
  - **Vật thể môi trường (Props):** 100 - 500 Triangles.
  - **Bẫy & Cơ cấu quay (Hazards/Obstacles):** 200 - 600 Triangles.
- **Vật liệu & Texture (Shading & Materials):**
  - Textures: 1024x1024 / 2048x2048 PNG Palette Mapping hoặc Vertex Colors.
  - Toon Shading (Diffuse Toon + Specular Toon) để tạo viền khối 2.5D nổi bật trong Godot 4.

---

## 🐶 2. DANH SÁCH NHÂN VẬT 3D (PLAYABLE CHARACTER ROSTER & ACCESSORIES)

### 2.1. Nhân vật gốc (Base Mochi Animal Characters)
| ID | Tên nhân vật | Mô tả đặc điểm 3D | Mã màu chủ đạo |
| :--- | :--- | :--- | :--- |
| `pinky_bear` | **Gấu Hồng (Pinky Bear)** | Thân tròn mochi, tai tròn, mõm kem, mắt hạt huyền | `#FFC6FF` (Hồng dâu) |
| `froggo` | **Ếch Xanh (Froggo)** | Mắt lồi trên đỉnh đầu, bụng vàng pastel, má hồng | `#B5EAD7` (Xanh Mint) |
| `bunny` | **Thỏ Kem (Bunny)** | Tai dài đứng, bụng hồng đào, mũi trái tim | `#FFFFF5` (Trắng kem) |
| `neko_cat` | **Mèo Tím/Mint (Neko Cat)** | Mảng màu tím lavender + xanh mint 2 bên tai, ria 3 sọc | `#FFFDF0` & `#CDB4DB` |
| `shiba_dog` | **Chó Shiba (Shiba Inu)** | Tai tam giác, lông cam kem, má phúng phính | `#F4A261` (Cam đất) |
| `panda` | **Gấu Trúc (Cute Panda)** | Quầng mắt đen tròn, thân trắng đen pastel | `#333333` & `#FFFFFF` |
| `penguin` | **Chim Cánh Cụt (Penguin)** | Bụng trắng, mỏ cam, cánh tròn nén | `#4EA8DE` (Xanh lam) |
| `axolotl` | **Kỳ Nhông Khủng Long (Axolotl)**| Mang xòe 3 nhánh hồng 2 bên má | `#FFB7B2` (Hồng phấn) |
| `piggy` | **Heo Hồng (Pink Piggy)** | Mũi hình elip 2 lỗ, đuôi xoắn low-poly | `#FFACC7` (Hồng tươi) |
| `ducky` | **Vịt Vàng (Rubber Ducky)** | Mỏ dẹt cam, thân hình tròn nén | `#FFD166` (Vàng tươi) |

### 2.2. Phụ kiện & Mũ đội (Hats & Customization Accessories)
- **Mũ & Trang phục (Hats):** `hat_crown` (Vương miện vàng), `hat_chef` (Mũ đầu bếp), `hat_duck_floatie` (Phao vịt), `hat_wizard` (Mũ phù thủy), `hat_cat_ears` (Mũ tai mèo neon), `hat_viking` (Mũ sừng Viking).
- **Phụ kiện mắt/lưng:** `acc_glasses_party` (Kính râm quẩy), `acc_backpack_rocket` (Balo tên lửa), `acc_cape_hero` (Áo tạo hình).

---

## 🏞️ 3. DANH SÁCH BẢN ĐỒ & MÔ HÌNH MÔI TRƯỜNG (BIOME & ENVIRONMENT PROPS)

### 3.1. Chủ đề 1: Làng Quê Low-Poly (Low-Poly Village & Meadow)
- `low_poly_house`: Nhà gỗ mái gạch nung Terracotta.
- `low_poly_windmill`: Tháp cối xay gió có cánh quạt.
- `low_poly_well`: Giếng nước đá mái che gỗ.
- `low_poly_tree`: Cây thông xếp tầng.
- `low_poly_rock`: Khối đá tảng góc cạnh.
- `low_poly_fence`: Hàng rào gỗ lối đi.
- `low_poly_lamp`: Cột đèn đường thắp sáng.
- `low_poly_barrel`: Thùng gỗ đai sắt.
- `low_poly_crate`: Hòm gỗ nguyên khối.
- `low_poly_signpost`: Biển gỗ chỉ hướng.
- `low_poly_bush`: Bụi cây tròn xanh.
- `prop_haybales`: Cuộn rơm hình trụ vàng.
- `prop_bridge_wood`: Cầu gỗ vòm qua sông.

### 3.2. Chủ đề 2: Đảo Băng Cực (Arctic & Ice Panic)
- `prop_ice_berg`: Tảng băng trôi khổng lồ.
- `prop_igloo`: Nhà băng tròn Igloo.
- `prop_snowman`: Người tuyết Low-Poly mũi cà rốt.
- `prop_ice_spikes`: Cụm chông băng sắc nhọn.
- `prop_pine_snow`: Cây thông phủ tuyết trắng.

### 3.3. Chủ đề 3: Đền Cổ & Rừng Nhiệt Đới (Jungle & Ancient Temple)
- `prop_temple_pillar`: Cột đá cổ khắc hoa văn Aztec.
- `prop_totem_pole`: Cột Totem gỗ 3 tầng mặt cười.
- `prop_torch_stand`: Cốc đuốc lửa phập phồng.
- `prop_rope_bridge`: Cầu treo dây thừng đung đưa.
- `prop_palm_tree`: Cây dừa Low-Poly quả tròn.

### 3.4. Chủ đề 4: Thành Phố Neon Cyberpunk (Neon Cyber City)
- `prop_vending_machine`: Máy bán hàng tự động neon.
- `prop_neon_signboard`: Bảng hiệu đèn neon chạy chữ.
- `prop_traffic_barrier`: Rào chắn công trình phát sáng.
- `prop_cyber_dumpster`: Thùng rác công nghệ góc cạnh.

---

## ⚙️ 4. BẪY & CHƯỚNG NGẠI VẬT DÀNH CHO CÁC GAME MODE (HAZARDS & OBSTACLES)

### 4.1. Bẫy cho Mode RACE & FLOOR IS RISING
- `hazard_hammer_rotator`: Gậy búa đập quay tròn 360 độ hất người chơi.
- `hazard_bumper_pad`: Đệm nẩy pháo cao su đẩy văng khi va chạm.
- `hazard_conveyor_belt`: Băng chuyền cuộn cuộn ép đi ngược hướng.
- `hazard_falling_platform`: Ô sàn nứt sập sau 1 giây đứng lên.
- `hazard_pendulum_axe`: Quả lắc rìu đung đưa qua lại.
- `hazard_spinning_roller`: Trục lăn gai tròn cản đường.

### 4.2. Vật phẩm cho Mode TAG, SUMO & COPYCAT
- `mode_tag_bomb`: Quả bom quả cầu đen ngòi nổ phát sáng đỏ (Mode TAG).
- `mode_race_finish_arch`: Cổng đích Đua xe có cờ ca-rô (Mode RACE).
- `mode_race_start_gate`: Cổng xuất phát đếm ngược 3-2-1.
- `mode_sumo_ring_border`: Vòng đai năng lượng SUMO thu nhỏ dần.
- `mode_copycat_screen`: Màn hình LED hiển thị nốt phím hành động (Mode COPYCAT).

---

## 💣 5. VŨ KHÍ & ITEM HỖN LOẠN (CHAOS PICKUPS & POWER-UPS)

- `item_glue_bomb`: Quả cầu keo dính làm chậm đối thủ 3 giây.
- `item_banana_peel`: Vỏ chuối vàng khiến người giẫm phải trượt ngã ragdoll.
- `item_boxing_glove`: Găng tay đấm lò xo văng xa.
- `item_magnet`: Nam châm hút người chơi xung quanh lại gần.
- `item_freeze_gun`: Khẩu súng băng làm đóng băng đối thủ thành khối đá.

---

## 📈 6. KẾ HOẠCH TRIỂN KHAI THEO LỘ TRÌNH PHÁT HÀNH STEAM

```
[GIAI ĐOẠN 1: CORE DEMO]  ───> [GIAI ĐOẠN 2: CONTENT EXPANSION] ───> [GIAI ĐOẠN 3: STEAM LAUNCH]
- 4 Character Mochi cơ bản      - 6 Character mới + Hệ thống Mũ       - 10 Character Full
- 11 Prop Làng Quê             - 3 Bộ Biome (Ice, Jungle, Cyber)     - Full 5 Biomes Map
- 4 Props Hazard chính          - 10 Bẫy Hazard hoàn chỉnh            - Full System Cosmetics
```
