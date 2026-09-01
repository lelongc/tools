# TÀI LIỆU THIẾT KẾ GAME (GAME DESIGN DOCUMENT)
# 🐔 CLUCK & DROP: BUNKER BUSTER (GÀ THẢ TRƯNG PHÁ SẬP HẦM NGỤC)

---

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

* **Tên Game:** Cluck & Drop: Bunker Buster (Chiến Dịch Bão Lòng Đất)
* **Thể Loại:** 2D Physics Destruction Puzzle / Reverse Vertical Slingshot
* **Nền Tảng:** Mobile (Android / iOS) - Màn hình dọc (Portrait 9:16 - 540x960 / 720x1280)
* **Engine:** Godot Engine 4.7.1 (Compatibility Renderer)
* **Phong Cách Đồ Họa:** 2D Glossy Cartoon Vector, Bold Outlines, Rich Juicy Particle Physics (Phong cách Angry Birds & Cut The Rope)
* **Mô Hình Kinh Doanh:** Free-to-Play + Rewarded Video Ads (Xem ad nhận Siêu Bom Nuke, x3 Vàng) + IAP (Gói Remove Ads $1.99, Mua Skin Gà/Trứng).

---

## 2. CỐT TRUYỆN HÀI HƯỚC & ĐỘC LẠ (STORY & THEME)

Lũ Cáo Trộm Trứng (*Sly Fox Bandit*) do Heo Trùm Bá Tước (*Baron Pig*) cầm đầu đã đào sâu xuống lòng đất, xây dựng một hệ thống hầm ngục boong-ke kiên cố (Bunker) và bắt cóc đàn gà con giam vào lồng sắt.

Gà Mẹ Clucky (*Clucky The Mother Hen*) trang bị trực thăng chong chóng tre mini Steampunk, bay lượn trên bầu trời cao và thực hiện **Chiến Dịch Nã Trứng Phục Thù**:
Thả các quả trứng dị biến từ trên trời xuống, đục thủng mái hầm, tạo ra các chuỗi sụp đổ phản ứng dây chuyền Domino hoành tráng để đè bẹp hang ổ kẻ thù và giải cứu đàn con!

---

## 3. CƠ CHẾ CHƠI ĐỘT PHÁ (INNOVATIVE GAMEPLAY MECHANICS)

### A. Cơ Chế Thả Trứng Trọng Lực & Ngắm Bắn (Gravity Slingshot Aiming)
* Người chơi chạm/kéo ngón tay trên màn hình:
  * Gà Mẹ lướt theo vị trí X.
  * Kéo tay xuống tạo lực căng nén lò xo (Gà Mẹ phồng bẹp người theo lực kéo).
  * Vạch ngắm quỹ đạo chấm bi thời gian thực chỉ rõ điểm rơi dự đoán.
  * Mắt Gà Mẹ liếc nhìn theo góc ngắm.
* Nhả tay: Gà Mẹ "rặn đẻ" phóng quả trứng lao thẳng xuống hầm ngục.

### B. Cơ Chế "Tap-in-Flight" (Kích Hoạt Kỹ Năng Khi Đang Bay)
Khác biệt hoàn toàn với các game thả bom thụ động, người chơi có thể **chạm màn hình 1 lần nữa khi trứng đang rơi** để kích hoạt kỹ năng đặc biệt:
1. 🥚 **Trứng Thường (Heavy Egg):** Chạm để hóa **Trứng Kim Cương Siêu Nặng** rơi thẳng tắp đè gãy mọi dầm gỗ và kính.
2. 💣 **Trứng Thuốc Nổ (Bomb Egg):** Chạm để **Kích nổ sớm trên không (Air Burst)** tạo mưa mảnh vỡ quét sạch lính canh ở tầng trên.
3. 🔩 **Trứng Mũi Khoan (Drill Egg):** Chạm để kích hoạt **Tên Lửa Phản Lực Siêu Thanh** tăng tốc gấp đôi xuyên thủng cả mái đá dày.

### C. Vật Lý Sụp Hầm & Phản Ứng Dây Chuyền (Bunker Physics Destruction)
* **Gỗ (Wood):** Nhẹ, dễ gãy, chịu lực kém.
* **Đá (Stone):** Rất nặng, cứng, rơi từ trên cao xuống tạo sát thương nghiền nát cực khủng.
* **Kính (Glass):** Giòn tan, vỡ vụn phát ra tiếng leng keng.
* **Thùng TNT:** Phát nổ liên hoàn khi bị đè trúng hoặc ăn đòn, tạo sóng xung kích hất tung cả căn hầm.
* **Khóa Cố Định Khởi Đầu (Zero-Gap Static Freeze):** Khi mới vào màn, toàn bộ công trình đứng vững 100%. Khi trúng phát đòn đầu tiên, toàn bộ kết cấu lập tức rã đông vật lý (`wake_up()`) sụp đổ cực kỳ thỏa mãn!

---

## 4. DANH MỤC TOÀN BỘ ASSET TRONG GAME ASSET STUDIO (17 ITEMS)

Toàn bộ 17 Asset đã được đăng ký chi tiết trong `d:\folder\tools\game_asset_studio\game_projects.json` bao gồm:
1. **Gà Mẹ Phi Công Clucky** (`asset_clucky_pilot`)
2. **Trực Thăng Chong Chóng Tre Mini** (`asset_flying_chopper`)
3. **Trứng Thường Nặng Ký** (`asset_egg_heavy_normal`)
4. **Trứng Thuốc Nổ Đỏ** (`asset_egg_tnt_bomb`)
5. **Trứng Mũi Khoan Xuyên Thấu** (`asset_egg_drill_steel`)
6. **Trứng Gà Con Náo Loạn** (`asset_egg_cluster_chicks`)
7. **Trứng Axit Nham Thạch** (`asset_egg_acid_lava`)
8. **Cáo Trộm Trứng Xảo Quyệt** (`asset_enemy_sly_fox`)
9. **Gấu Mèo Thợ Mỏ Đội Mũ Sắt** (`asset_enemy_armored_raccoon`)
10. **Heo Trùm Bá Tước Hầm Ngục** (`asset_enemy_boss_baron_pig`)
11. **Thanh Xà Gỗ Chịu Lực** (`asset_block_wood_plank`)
12. **Tảng Đá Bê Tông Kiên Cố** (`asset_block_stone_slab`)
13. **Cột Kính Pha Lê Giòn Tan** (`asset_block_glass_pillar`)
14. **Thùng Thuốc Nổ TNT** (`asset_block_tnt_barrel`)
15. **Bối Cảnh Hang Đất Nông Trại** (`asset_bg_farm_cross_section`)
16. **Bộ Hiệu Ứng Nổ Lửa & Sóng Xung Kích** (`asset_vfx_explosion_pack`)
17. **Bộ Huy Chương 3 Sao Chiến Thắng** (`asset_ui_star_victory_badge`)
