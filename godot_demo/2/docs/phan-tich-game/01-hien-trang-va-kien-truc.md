# 01 — Hiện trạng và kiến trúc

## 1. Bản sắc và vòng chơi

Cluck & Drop là game giải đố phá hủy vật lý theo màn, màn hình dọc. Người chơi điều khiển vị trí gà, kéo để định hướng/vận tốc thả trứng, dùng kỹ năng khi trứng đang bay, rồi tận dụng vật rơi và thuốc nổ để hạ toàn bộ quái.

Vòng chơi hiện có:

```text
Main Menu → Chơi tiếp hoặc Chọn màn → Sinh CampaignLevel
  → Ngắm và thả trứng → Va chạm / kỹ năng / phản ứng dây chuyền
  → Hạ hết quái: cộng điểm trứng dư → ghi sao/điểm → hiện chiến thắng
  → Hết trứng: chờ 3,5 giây → Last Stand nếu đủ điều kiện, hoặc thua
  → Nhận vàng / nhận x3 qua quảng cáo mô phỏng → màn tiếp theo
```

Giải cứu gà con hiện là hoạt động cộng điểm, chưa phải điều kiện thắng độc lập. Cơ chế hoàn thành màn chỉ đếm quái. Điều này cần được giải thích rõ trong mục tiêu màn, vì cốt truyện đặt việc cứu con ở vị trí rất nổi bật.

Nguồn: [GameManager](D:/folder/tools/godot_demo/2/scripts/core/GameManager.gd:82), [RescueCage](D:/folder/tools/godot_demo/2/scripts/destructibles/RescueCage.gd:56), [tài liệu thiết kế](D:/folder/tools/godot_demo/2/GAME_DESIGN_DOCUMENT.md).

## 2. Quy mô thực tế

| Thành phần | Hiện trạng |
|---|---|
| Engine đã dùng để kiểm tra | Godot `4.7.1.stable.official.a13da4feb` |
| Renderer cấu hình | `gl_compatibility` cho desktop và mobile |
| Viewport thiết kế | 540 × 960, `canvas_items`, aspect `expand` |
| Script trong thư mục scripts | 33 file GDScript |
| Scene trong thư mục scenes | 22 file TSCN, gồm cả test |
| Autoload | GameManager, SoundManager, SaveManager, LocalizationManager, AdsManager |
| Chiến dịch | 200 chỉ số màn; 10 world, mỗi world 20 màn |
| Loại trứng chơi | Normal, Bomb, Drill, Frost, Cluster, Acid, Black Hole |
| Danh mục quái khai báo | 28 archetype, gồm 10 tên boss |
| Vật liệu | Wood, Stone, Glass, Steel, Obsidian, Crystal và 5 vật liệu world mới |
| Vật thể tương tác | TNT, Nuke, Boulder, Rescue Cage, Updraft |
| Tiến trình | Có lưu sao, điểm cao, vàng, consumable, ngày/lượt quay và cài đặt |
| Monetization | Bốn placement quảng cáo, hiện là mô phỏng tại máy |

`config/features` còn nhãn Forward Plus trong khi renderer thực tế chọn Compatibility. Đây là điểm nên dọn cho nhất quán cấu hình, chưa có bằng chứng nó gây lỗi render.

Nguồn: [project.godot](D:/folder/tools/godot_demo/2/project.godot:11).

## 3. Trách nhiệm của các module

| Module | Vai trò | Nhận xét kiến trúc |
|---|---|---|
| CampaignLevel | Sinh nền, collider biên, kết cấu, quái, trứng và camera | Một file 1.151 dòng đang chứa cả dữ liệu thiết kế lẫn logic dựng màn. |
| GameManager | Trạng thái màn, trứng, điểm, thắng/thua, chuyển scene | Gọn nhưng các cờ boolean chưa mô tả rõ mọi trạng thái trung gian. |
| ChickenBomber | Bay, ngắm, dự đoán đường bay, thả trứng | Input được polling trong `_process`; cần kiểm chứng tương tác với UI và kỹ năng. |
| Các Egg script | Từng kỹ năng và sát thương | Phần lớn kế thừa trực tiếp RigidBody2D; BaseEgg chưa là nền dùng chung của bảy trứng. |
| DestructibleBlock | Vật liệu, nứt, phá hủy, mất bệ đỡ | Có khóa trước phát bắn và kiểm tra hỗ trợ; một số điều kiện gắn với tọa độ cố định. |
| BunkerMonster | HP, giáp, va chạm, bị đè, biểu cảm | File 1.663 dòng, phần biểu cảm và palette chiếm đáng kể; khó chỉnh chiến đấu độc lập. |
| GameHUD | Hiển thị và điều phối modal/reward | Đang vừa trình bày UI vừa trực tiếp quyết định một số chuyển trạng thái game. |
| SaveManager | Đọc/ghi JSON, tiến trình, wallet, inventory | Có tmp/backup, nhưng chưa có migration bảo toàn dữ liệu và kiểm tra schema đầy đủ. |
| AdsManager | Mô phỏng video, callback, cộng thưởng | Gắn trực tiếp reward vào GameManager/SaveManager; cần giao dịch một lần và phiên màn. |
| ParticleHelper / SoundManager | Hiệu ứng dùng chung, texture cache, audio pool | Đã có tái sử dụng; nên đo trước khi thêm pooling phức tạp. |

Nguồn: [CampaignLevel](D:/folder/tools/godot_demo/2/scripts/core/CampaignLevel.gd:53), [BunkerMonster](D:/folder/tools/godot_demo/2/scripts/enemies/BunkerMonster.gd:149), [ChickenBomber](D:/folder/tools/godot_demo/2/scripts/player/ChickenBomber.gd:129), [BaseEgg](D:/folder/tools/godot_demo/2/scripts/projectiles/BaseEgg.gd:1).

## 4. Những nền tảng nên giữ

### 4.1 Phá hủy có nhiều lớp phản hồi

Các khối có giai đoạn nứt, quái thay đổi biểu cảm theo tình huống, audio va chạm được hạn chế tần suất ở một số điểm, có camera shake, điểm nổi và hiệu ứng riêng cho từng trứng. Đây là phần tạo cảm giác “đánh trúng có kết quả”, phù hợp với thể loại.

Khuyến nghị: bảo toàn cảm giác này trong các đợt sửa logic. Đừng giảm hiệu ứng hoặc thay công thức lực đồng loạt trước khi có số đo và video so sánh.

### 4.2 Chống kết cấu tự sập trước khi bắn

Block, Boulder, Cage và Enemy có những lớp khóa/wake riêng. Bộ test hiện tại kiểm tra tám màn trong một cửa sổ ngắn trước và sau khi đổi chỉ số trứng, và các kiểm tra đó đã đạt.

Giới hạn: không chứng minh mọi kết cấu ổn định lâu dài hoặc sụp đúng sau va chạm. Mục tiêu cải thiện nên là “đứng vững khi chưa tương tác, sụp có lý khi mất hỗ trợ”, không phải khóa cứng ngày càng nhiều vùng tọa độ.

### 4.3 Có bảo vệ vòng đời cơ bản

- Projectile chính có biên tọa độ và thời gian bay tối đa 8 giây.
- GameManager có `current_session_id` để chặn callback chiến thắng của phiên cũ.
- Có xử lý Android Back và lưu khi ứng dụng pause.
- SoundManager có pool 16 player và cache audio; ParticleHelper có cache texture.

Đây là nền tảng tốt. Cần mở rộng tính nhất quán của chúng sang tất cả callback và trạng thái, thay vì xây lại toàn bộ.

Nguồn: [GameManager](D:/folder/tools/godot_demo/2/scripts/core/GameManager.gd:149), [SoundManager](D:/folder/tools/godot_demo/2/scripts/core/SoundManager.gd:7), [ParticleHelper](D:/folder/tools/godot_demo/2/scripts/core/ParticleHelper.gd:54).

## 5. Khoảng cách giữa thiết kế và bản hiện tại

| Ý tưởng/định hướng | Bản hiện tại | Hướng làm rõ |
|---|---|---|
| Chiến dịch phát triển kỹ năng dần | Chọn được toàn bộ màn vì hàm unlock luôn true | Tách chế độ kiểm thử khỏi cấu hình dành cho người chơi. |
| Giải cứu đàn con | Cage cộng 1.000 điểm; thắng vẫn chỉ phụ thuộc quái | Chọn đây là mục tiêu phụ, huy hiệu hay bắt buộc ở một số màn. |
| Nhiều boss khác nhau | Boss khác hình/palette/tên; công thức HP chung và hành vi chiến đấu chủ yếu dùng chung | Thiết kế khác biệt thông qua bố cục và điểm yếu trước khi thêm AI riêng. |
| Rewarded ads / IAP / skin | Ads mô phỏng; chưa thấy luồng mua IAP hoặc dùng vàng/consumable | Xác định MVP; tránh coi placeholder là tính năng phát hành hoàn tất. |
| Toàn bộ công trình rã đông khi trúng | Code hiện đánh thức cục bộ theo va chạm/mất hỗ trợ | Cập nhật GDD cho đúng hành vi muốn giữ. |
| Cinematic intro | LevelController cũ có gọi `play_intro_pan`; CameraShake hiện không có hàm này | Scene campaign hiện không dùng LevelController; dọn hoặc sửa tài liệu về đường chạy cũ. |

Nguồn đường chạy cũ: [LevelController](D:/folder/tools/godot_demo/2/scripts/core/LevelController.gd:20), [CameraShake2D](D:/folder/tools/godot_demo/2/scripts/core/CameraShake2D.gd:14). Không kết luận game hiện tại crash vì đường chạy này chưa được scene chính tham chiếu.

## 6. Hướng kiến trúc đề xuất — chưa triển khai

1. **Tập trung quyền quyết định kết quả màn** vào GameManager hoặc một đối tượng phiên màn. HUD gửi yêu cầu và hiển thị; không tự phát `level_failed` từ timer độc lập.
2. **Tách dữ liệu cân bằng** thành cấu hình world, enemy, material, egg và level override. Giữ nguyên thông số trong lần tách đầu để dễ đối chiếu.
3. **Tách BunkerMonster** thành dữ liệu chỉ số, xử lý sát thương và trình bày biểu cảm khi đã có kiểm tra bảo vệ hành vi.
4. **Chuẩn hóa vòng đời trứng**: đang bay → kỹ năng/va chạm → kết thúc ảnh hưởng gameplay → dọn hiệu ứng. Đăng ký với phiên màn để biết khi nào được xét thua.
5. **Tách reward khỏi UI và quảng cáo**: nhận một kết quả đã xác thực, kiểm tra phiên/giao dịch, ghi thưởng đúng một lần rồi mới cập nhật UI.

Không cần viết lại toàn dự án để đạt các mục tiêu này. Ưu tiên những chỗ đang gây lỗi; tách nhỏ theo từng luồng và giữ baseline so sánh.
