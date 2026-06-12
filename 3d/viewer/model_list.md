# Danh sách 3D Model cần thiết cho PSX Horror Game
> Tải free trên itch.io, Kenney.nl, OpenGameArt, Sketchfab (CC0/CC-BY)
> Format: **GLTF/GLB** (Three.js load trực tiếp) hoặc FBX/OBJ (cần convert)
> Polygon count: **≤500 triangles mỗi model** cho phong cách PS1 retro (low-poly)
> Texture: ≤ 512x512, pixelated, desaturated colors

---

## Cấu trúc thư mục
```
assets/models/
├── furniture/          # Đồ nội thất
├── props/              # Đồ vật nhỏ, trang trí
├── doors/              # Cửa các loại
├── lighting/           # Đèn, nến
├── kitchen/            # Đồ bếp
├── bathroom/           # Đồ phòng tắm
├── bedroom/            # Đồ phòng ngủ
├── horror/             # Props kinh dị
├── characters/         # Nhân vật, sinh vật
├── environment/        # Tường, sàn, cấu trúc
├── interactive/        # Đồ vật tương tác
└── audio/              # File âm thanh (ogg/mp3)
```

---

## 1. NỘI THẤT CƠ BẢN (furniture/)

| # | Tên Model | File Name | Thay thế function | Ghi chú |
|---|-----------|-----------|-------------------|---------|
| 1 | Bàn gỗ cũ | `table_old.glb` | `createTable()` | Bàn gỗ mục nát, có thể có ngăn kéo |
| 2 | Ghế gỗ | `chair_wooden.glb` | `createChair()` | Ghế có lưng tựa, kiểu cổ |
| 3 | Giường đơn | `bed_single.glb` | `createBed()` | Giường sắt cũ, nệm bẩn |
| 4 | Giường đôi | `bed_double.glb` | (mới) | Giường lớn cho phòng chính |
| 5 | Sofa cũ | `sofa_old.glb` | `createSofa()` | Sofa vải rách, đổi màu |
| 6 | Tủ quần áo | `wardrobe.glb` | `createWardrobe()` | Tủ gỗ lớn, cửa có thể mở |
| 7 | Tủ đầu giường | `nightstand.glb` | `createNightstand()` | Có ngăn kéo |
| 8 | Tủ ngăn kéo | `dresser.glb` | `createDresser()` | 3-4 ngăn, gỗ cũ |
| 9 | Kệ sách | `bookshelf.glb` | `createBookshelf()` | Sách bụi bặm, vài quyển rơi |
| 10 | Bàn cà phê | `coffee_table.glb` | `createCoffeeTable()` | Bàn thấp phòng khách |
| 11 | Ghế bành | `armchair.glb` | (mới) | Ghế bành cũ kỹ, vải rách |
| 12 | Ghế rocking | `rocking_chair.glb` | (mới - scare event) | Tự đung đưa! |
| 13 | Bàn làm việc | `desk.glb` | (mới) | Có ngăn kéo, giấy tờ |
| 14 | Tủ cabinet | `cabinet.glb` | `createCabinet()` | Tủ kính, bên trong có đồ |

## 2. NHÀ BẾP (kitchen/)

| # | Tên Model | File Name | Thay thế function | Ghi chú |
|---|-----------|-----------|-------------------|---------|
| 15 | Tủ lạnh | `fridge.glb` | `createFridge()` | Tủ lạnh cũ, gỉ sét, cửa hở |
| 16 | Bếp gas/lò nướng | `stove.glb` | `createStove()` | Bếp cũ, có vết cháy |
| 17 | Bồn rửa bếp | `kitchen_sink.glb` | (mới) | Bồn inox gỉ, nước nhỏ giọt |
| 18 | Quầy bếp | `kitchen_counter.glb` | `createKitchenCounter()` | Mặt bàn bếp dài |
| 19 | Lò vi sóng | `microwave.glb` | (mới) | Cũ kỹ, cửa hở |
| 20 | Nồi/chảo | `pots_pans.glb` | (mới) | Treo tường hoặc trên bếp |
| 21 | Bát đĩa | `dishes.glb` | (mới) | Bẩn, chồng chất |
| 22 | Thùng rác | `trash_can_kitchen.glb` | `createTrashCan()` | Rác tràn ra ngoài |

## 3. PHÒNG TẮM (bathroom/)

| # | Tên Model | File Name | Thay thế function | Ghi chú |
|---|-----------|-----------|-------------------|---------|
| 23 | Bồn tắm | `bathtub.glb` | `createBathtub()` | Bồn tắm sắt cũ, vết gỉ/máu |
| 24 | Toilet | `toilet.glb` | `createToilet()` | Bồn cầu bẩn |
| 25 | Bồn rửa mặt | `sink.glb` | `createSink()` | Gương vỡ phía trên |
| 26 | Gương | `mirror.glb` | `createMirror()` | Gương nứt, phản chiếu kỳ lạ |
| 27 | Tủ thuốc | `medicine_cabinet.glb` | (mới) | Treo tường, cửa kính vỡ |
| 28 | Vòi sen | `shower_head.glb` | (mới) | Nước nhỏ giọt |
| 29 | Rèm tắm | `shower_curtain.glb` | (mới) | Rèm nhựa bẩn, che khuất |

## 4. PHÒNG NGỦ (bedroom/)

| # | Tên Model | File Name | Thay thế function | Ghi chú |
|---|-----------|-----------|-------------------|---------|
| 30 | Nôi em bé | `baby_crib.glb` | (mới - Nursery) | Nôi cũ, đồ chơi rơi |
| 31 | Gấu bông rách | `teddy_bear.glb` | (mới - Nursery) | Gấu bông một mắt |
| 32 | Đồ chơi trẻ em | `toy_blocks.glb` | (mới - Nursery) | Khối gỗ xếp hình |
| 33 | Tấm thảm | `rug.glb` | `createRug()` | Thảm cũ, vết bẩn |
| 34 | Gối + chăn | `pillow_blanket.glb` | (mới) | Chăn nhăn nhúm, gối bẩn |
| 35 | Đồng hồ báo thức | `alarm_clock.glb` | (mới) | Đồng hồ cơ học cũ |

## 5. CỬA CÁC LOẠI (doors/)

| # | Tên Model | File Name | Thay thế function | Ghi chú |
|---|-----------|-----------|-------------------|---------|
| 36 | Cửa gỗ thường | `door_wooden.glb` | `createDoor()` | Cửa gỗ cũ, bản lề rỉ |
| 37 | Cửa đóng ván | `door_boarded.glb` | (mới) | Cửa bị đóng ván ngang chặn |
| 38 | Cửa sắt | `door_metal.glb` | (mới) | Cửa sắt nặng, khóa nhiều |
| 39 | Cửa kính vỡ | `door_glass_broken.glb` | (mới) | Kính vỡ, nhìn qua được |
| 40 | Cửa sổ đóng ván | `window_boarded.glb` | `createBoardedWindow()` | Ánh sáng lọt qua khe hở |
| 41 | Cổng sắt | `gate_iron.glb` | (mới) | Cổng sắt lớn, khóa xích |

## 6. ĐÈN VÀ ÁNH SÁNG (lighting/)

| # | Tên Model | File Name | Thay thế function | Ghi chú |
|---|-----------|-----------|-------------------|---------|
| 42 | Đèn trần | `ceiling_light.glb` | (mới) | Bóng đèn trần cũ, flicker |
| 43 | Đèn bàn | `table_lamp.glb` | `createLamp()` | Đèn bàn vải, ánh sáng ấm |
| 44 | Đèn sàn | `floor_lamp.glb` | (mới) | Đèn đứng sàn nhà |
| 45 | Nến + đế nến | `candle.glb` | (mới) | Nến tan chảy, ánh sáng nhấp nháy |
| 46 | Chandelier | `chandelier.glb` | (mới) | Đèn trần lớn, kiểu cổ |
| 47 | Đèn tường | `wall_sconce.glb` | (mới) | Đèn gắn tường, gỉ sét |
| 48 | Đèn pin | `flashlight.glb` | (mới - inventory) | Item player có thể dùng |

## 7. ĐỒ VẬT TRANG TRÍ & PROPS (props/)

| # | Tên Model | File Name | Ghi chú |
|---|-----------|-----------|---------|
| 49 | Đồng hồ quả lắc | `grandfather_clock.glb` | Thay `createClock()`, tiếng tick-tock |
| 50 | Tranh treo tường | `painting_frame.glb` | Thay `createPainting()`, nhiều kích cỡ |
| 51 | TV cũ (CRT) | `tv_crt.glb` | Thay `createTV()`, static noise |
| 52 | Radio cũ | `radio_old.glb` | Phát tiếng lạ khi tương tác |
| 53 | Điện thoại bàn | `telephone.glb` | Rung/kêu khi trigger |
| 54 | Máy đánh chữ | `typewriter.glb` | Tự gõ chữ — scare event |
| 55 | Hộp nhạc | `music_box.glb` | Phát giai điệu rùng rợn |
| 56 | Lọ hoa/cây chết | `dead_plant.glb` | Thay `createDeadPlant()` |
| 57 | Bình nước/chai | `bottles.glb` | Chai lọ trên bàn/kệ |
| 58 | Sách mở | `open_book.glb` | Đặt trên bàn, đọc lore |
| 59 | Giấy tờ rải | `scattered_papers.glb` | Rơi trên sàn/bàn |
| 60 | Hộp các-tông | `cardboard_box.glb` | Hộp chồng trong kho |
| 61 | Tường gạch vỡ | `broken_wall.glb` | Tường nứt/vỡ |
| 62 | Ống nước | `pipes.glb` | Ống gỉ trên tường/trần |
| 63 | Dây xích | `chains.glb` | Treo tường/trần |
| 64 | Thùng sắt | `metal_barrel.glb` | Thùng sắt gỉ |
| 65 | Cầu thang | `staircase.glb` | Thay `createStairs()` |

## 8. ĐỒ VẬT KINH DỊ (horror/)

| # | Tên Model | File Name | Ghi chú |
|---|-----------|-----------|---------|
| 66 | Lồng sắt | `cage.glb` | Thay `createCage()`, lồng lớn nhốt người |
| 67 | Búp bê cũ | `creepy_doll.glb` | Búp bê mắt theo dõi player |
| 68 | Hộp sọ | `skull.glb` | Đặt trên kệ/bàn |
| 69 | Xương | `bones.glb` | Rải trên sàn |
| 70 | Bàn tay giả | `severed_hand.glb` | Props shock |
| 71 | Vết máu trên sàn | `blood_pool.glb` | Decal trên sàn |
| 72 | Viết chữ trên tường | `wall_writing.glb` | Chữ viết bằng máu/sơn |
| 73 | Mạng nhện | `cobweb.glb` | Dán góc tường/trần |
| 74 | Quan tài | `coffin.glb` | Quan tài gỗ cũ |
| 75 | Tượng bí ẩn | `mysterious_statue.glb` | Tượng đá nhìn theo player |
| 76 | Bàn thờ/đền | `occult_altar.glb` | Nến, ký hiệu lạ |
| 77 | Ouija board | `ouija_board.glb` | Bàn cầu cơ |
| 78 | Gương cổ | `antique_mirror.glb` | Gương lớn — phản chiếu sai |
| 79 | Bức ảnh gia đình | `family_photo.glb` | Ảnh bị xé/cháy |
| 80 | Cross/Thập giá | `cross.glb` | Treo ngược trên tường |

## 9. NHÂN VẬT & SINH VẬT (characters/)

| # | Tên Model | File Name | Thay thế function | Ghi chú |
|---|-----------|-----------|-------------------|---------|
| 81 | Con mèo (player) | `cat_player.glb` | `createCat()` | Mèo low-poly với animations: idle, walk, run, jump, sit |
| 82 | Ghost/Bóng ma | `ghost_entity.glb` | (mới) | Hình người mờ đục, hover trên mặt đất |
| 83 | Owner (ông chủ nhà) | `owner_npc.glb` | `createOwner()` | Người già ngồi/đứng, biểu cảm rùng rợn |
| 84 | Shadow figure | `shadow_figure.glb` | (mới) | Bóng đen hình người, không chi tiết, chỉ silhouette |
| 85 | Con nhện lớn | `spider_large.glb` | (mới) | Nhện bò trên tường |
| 86 | Chuột | `rat.glb` | (mới) | Chạy ngang sàn khi player đến gần |

## 10. ĐỒ VẬT TƯƠNG TÁC (interactive/)

| # | Tên Model | File Name | Ghi chú |
|---|-----------|-----------|---------|
| 87 | Chìa khóa gỉ | `rusty_key.glb` | Thay `createRustyKey()` — key item |
| 88 | Chìa khóa vàng | `golden_key.glb` | Key item khác |
| 89 | Mảnh giấy/note | `torn_note.glb` | Thay `createTornNote()` — clue item |
| 90 | Công tắc điện | `light_switch.glb` | Trên tường, bật/tắt đèn |
| 91 | Keypad/bảng số | `keypad.glb` | Nhập code để mở cửa |
| 92 | Cầu chì | `fuse_box.glb` | Hộp cầu chì trên tường |
| 93 | Cầu chì (item) | `fuse.glb` | Item nhặt được, lắp vào fuse box |
| 94 | Rương/hộp treasure | `chest.glb` | Rương gỗ/sắt, mở ra chứa item |
| 95 | Nhật ký | `diary.glb` | Cuốn nhật ký — đọc lore dài |
| 96 | Lọ thuốc | `medicine_bottle.glb` | Consumable, hồi stamina |
| 97 | Pin đèn pin | `battery.glb` | Consumable cho đèn pin |
| 98 | Cassette tape | `cassette.glb` | Phát audio lore |
| 99 | Huy hiệu/locket | `locket.glb` | Combine item |
| 100 | Bản đồ nhà | `house_map.glb` | Cho player xem layout nhà |

## 11. MÔI TRƯỜNG & CẤU TRÚC (environment/)

| # | Tên Model | File Name | Ghi chú |
|---|-----------|-----------|---------|
| 101 | Tường module (thẳng) | `wall_straight.glb` | Module tường thẳng 1 mét |
| 102 | Tường module (góc) | `wall_corner.glb` | Module góc L |
| 103 | Tường module (cửa) | `wall_doorway.glb` | Tường có lỗ cửa |
| 104 | Tường module (cửa sổ) | `wall_window.glb` | Tường có lỗ cửa sổ |
| 105 | Sàn gỗ (tile) | `floor_wood_tile.glb` | Sàn gỗ cũ |
| 106 | Sàn gạch (tile) | `floor_tile.glb` | Gạch men bẩn |
| 107 | Trần nhà (tile) | `ceiling_tile.glb` | Trần vữa bong tróc |
| 108 | Cột nhà | `pillar.glb` | Cột chống, gỗ hoặc bê tông |
| 109 | Lan can/rào | `railing.glb` | Lan can cầu thang |
| 110 | Mái che/awning | `awning.glb` | Mái che hành lang |

---

## TỪ KHÓA TÌM KIẾM TRÊN ITCH.IO

Dùng các từ khóa này để tìm nhanh trên itch.io:

### Pack tổng hợp (ưu tiên tải trước):
- `low poly horror props pack`
- `PSX horror 3D assets`
- `retro horror furniture pack`
- `low poly interior furniture`
- `PS1 style 3D models`
- `horror game asset pack 3D`

### Tìm theo loại cụ thể:
- `low poly furniture GLB` — đồ nội thất
- `horror props 3D free` — props kinh dị
- `low poly character cat` — nhân vật mèo
- `ghost 3D model low poly` — bóng ma
- `old house interior 3D` — nội thất nhà cũ
- `horror door 3D model` — cửa
- `retro CRT TV 3D` — TV cũ
- `abandoned house 3D` — nhà bỏ hoang

### Trang web khác có model free:
- **Kenney.nl** — Kenney Furniture Kit, Kenney Horror Kit
- **OpenGameArt.org** — tìm "low poly horror"
- **Sketchfab** (filter: downloadable, CC0) — tìm "PS1 horror"
- **Quaternius.com** — Ultimate Furniture Pack (free, low-poly)
- **Kay Lousberg** — free low-poly packs

---

## ƯU TIÊN TẢI

### Đợt 1 (Quan trọng nhất — thay thế BoxGeometry ngay):
1. ~~Pack nội thất tổng hợp~~ (giường, bàn, ghế, tủ, sofa) — models 1-14
2. Pack cửa — models 36-41
3. Con mèo player — model 81
4. Đồ bếp cơ bản — models 15-22
5. Đồ phòng tắm — models 23-29

### Đợt 2 (Gameplay props):
6. Chìa khóa, note, công tắc — models 87-100
7. Đèn các loại — models 42-48
8. Props trang trí — models 49-65

### Đợt 3 (Horror & Polish):
9. Props kinh dị — models 66-80
10. Nhân vật/sinh vật — models 82-86
11. Module tường — models 101-110

---

## GHI CHÚ KỸ THUẬT

### Format file:
- **Ưu tiên:** `.glb` (binary GLTF, nhỏ gọn, load nhanh)
- **Chấp nhận:** `.gltf` + texture riêng
- **Cần convert:** `.fbx`, `.obj` → dùng Blender export ra `.glb`

### Quy chuẩn khi import:
- Scale: 1 unit = 1 mét
- Origin: đáy model (bottom center)
- Hướng: mặt trước quay về trục -Z (Three.js convention)
- Texture: ≤ 512x512, dùng nearest filter cho phong cách PSX
- Tổng triangle count mỗi model: ≤ 500 tri (PSX retro)

### Naming convention:
- Tên file: `snake_case.glb`
- Không dấu, không space, không ký tự đặc biệt
- Prefix theo category: không cần vì đã chia thư mục

### Fallback:
- Nếu chưa có model file → game vẫn dùng BoxGeometry cũ
- Thay thế từng model một, không cần có đủ mới chạy được
