# Bộ Asset 2D Modular Enemy & Boss (Angry Birds Style) - Dành Cho Godot 4

Trọn bộ 8 quái vật, lính gác và Đại Boss tối thượng được thiết kế chuẩn dạng **Modular Cutout Vector (SVG)** sắc nét.

## Danh Mục 8 Nhân Vật / Quái:
1. **01_sly_fox**: Cáo Ranh Mãnh (Quái Thường Thế Giới 1)
   - Thân tròn cam, tai nhọn lông hồng, mắt thường + đồng tử rời, mắt hoảng loạn, mắt choáng X_X, mõm cười khẩy, miệng hét to.
2. **02_fox_guard**: Cáo Lính Gác Đội Nồi Gỗ (Quái Tinh Nhuệ Thế Giới 1)
   - Thân cáo, nón nồi gỗ nẹp sắt, nón gỗ nứt vỡ khi trúng đòn, mắt tự tin nửa nhắm, mắt hoảng loạn, mõm nhe răng, băng dán má.
3. **03_armored_raccoon**: Gấu Mèo Nón Thợ Mỏ (Quái Thế Giới 2 Mỏ Đá)
   - Thân xám đeo mặt nạ đen, nón bảo hộ công trường vàng có đèn pin, nón móp méo nứt, đuôi sọc xám đen, mõm ranh mãnh răng nhọn.
4. **04_mine_wolf**: Sói Hầm Mỏ (Boss Thế Giới 2)
   - Thân sói xám cơ bắp, giáp vai sắt có gai, giáp hàm sắt bảo vệ cằm, mắt vàng rực hung dữ, mõm gầm nhe nanh nhọn.
5. **05_spike_hound**: Chó Săn Gai (Quái Thế Giới 3 Nhà Máy)
   - Thân bulldog nâu béo ú, vòng cổ da đỏ gắn gai nhọn bạc, mắt lồi lệch ngộ nghĩnh, hàm móm dưới chìa 2 răng nanh, lưỡi thè nhỏ dãi.
6. **06_toxic_fox**: Cáo Hóa Học Độc Dược (Quái Tinh Nhuệ Thế Giới 3)
   - Thân xanh axit nhớt, kính bảo hộ steampunk đồng thau phát sáng xanh, bình axit đeo lưng sủi bọt, nụ cười độc địa chảy giọt axit.
7. **07_imperial_boar**: Heo Rừng Hoàng Gia (Quái Tinh Nhuệ Thế Giới 4)
   - Thân heo rừng tím đậm béo tròn, mũ giáp La Mã mạ vàng gắn chổi lông vũ đỏ, cặp răng nanh vàng cong vút, mõm heo hoàng gia, huân chương trứng mạ vàng.
8. **08_baron_pig**: ĐẠI HOÀNG ĐẾ BARON PIG (Boss Tối Thượng Màn 60 - 1500 HP)
   - Thân heo xanh khổng lồ béo tròn, vương miện hoàng gia đính hồng ngọc & lam ngọc, áo choàng nhung đỏ viền lông chồn trắng, kính một tròng dây xích vàng, mắt hợm hĩnh, mắt siêu hoảng sợ, mũi hoàng gia có ria mép vàng uốn cong, mặt bầm tím thảm bại khi thua.

## Cấu trúc Node trong Godot 4:
```text
ModularEnemy (RigidBody2D - gắn script modular_enemy.gd)
 ├── CollisionShape2D (CircleShape2D)
 └── VisualRoot (Node2D - dùng để Squash & Stretch)
      ├── BaseBody (Sprite2D)
      ├── Head (Node2D)
      │    ├── Ears/Horns (Sprite2D)
      │    └── Helmet/Crown (Sprite2D)
      ├── Face (Node2D)
      │    ├── Eyes (Sprite2D)
      │    └── SnoutMouth (Sprite2D)
      └── Accessories (Node2D)
           ├── Armor/Cape (Sprite2D)
           └── Tail/Backpack (Sprite2D)
```
