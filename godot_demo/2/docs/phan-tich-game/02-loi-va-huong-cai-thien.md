# 02 — Lỗi và hướng cải thiện kỹ thuật

Đây là danh sách đề xuất công việc, **không phải danh sách thay đổi đã áp dụng**. Các kiểm tra R chạy trong bản sao tách riêng save; source gốc không được sửa.

## Bảng ưu tiên

| ID | Ưu tiên | Bằng chứng | Vấn đề |
|---|---|---|---|
| BUG-01 | P1 | R | Không mở khóa nút nhận thưởng quảng cáo mô phỏng |
| BUG-02 | P1 | R | Pause nhưng bộ đếm thua vẫn chạy |
| BUG-03 | P1 | R | Last Stand có thể phát cả thắng và thua |
| BUG-04 | P1 | R, tình huống cách ly | Xét thua khi trứng còn sống |
| BUG-05 | P2 | R, tình huống ngoài biên | Hố đen nổ lặp trước khi bị xóa |
| BUG-06 | P2 | R | Điểm UI và snapshot đã lưu khác nhau |
| BUG-07 | P2 | R, tình huống cách ly | Khối không có nền vẫn đông cứng ở vùng y thấp |
| BUG-08 | P2 | T | Nút chọn màn sau thắng gọi hai chuyển scene |
| SAVE-01 | P1 trước cập nhật phát hành | T | Save phiên bản cũ bị reset toàn bộ |
| SAVE-02 | P2 | T | Quy trình tmp/backup chưa bảo đảm phục hồi trước mọi lỗi ghi |
| SAVE-03 | P2 | T | Dữ liệu JSON chưa được kiểm tra schema/nested types |
| BUILD-01 | P1 trước phát hành | T | Preset còn tên/package của game khác và chưa ký Android |

## BUG-01 — Nút nhận thưởng quảng cáo không mở khóa

**Nguồn:** [AdsManager, dựng nút](D:/folder/tools/godot_demo/2/scripts/core/AdsManager.gd:141), [tìm nút](D:/folder/tools/godot_demo/2/scripts/core/AdsManager.gd:173), [mở khóa](D:/folder/tools/godot_demo/2/scripts/core/AdsManager.gd:216).

`HBoxContainer.new()` không được đặt tên `HBox`, nhưng đoạn cập nhật tìm `Center/Card/VBox/HBox/BtnClaim`. Trong kiểm tra, node thật có đoạn tên `@HBoxContainer@4`; đường dẫn code tìm trả `null`. Nút được tạo với `disabled = true` và vẫn bị khóa sau 3,25 giây.

**Ảnh hưởng:** người chơi không thể hoàn tất nhận thưởng qua UI mô phỏng cho Last Stand, x3 vàng, VIP trial hoặc lượt quay thêm. Không liên quan đến tải quảng cáo từ mạng vì chưa có SDK thật.

**Kế hoạch cải thiện:** giữ tham chiếu trực tiếp tới các control cần điều khiển, hoặc đặt tên ổn định và kiểm tra tồn tại khi tạo overlay. Tách trạng thái chờ, đủ thời gian, đã nhận, đã hủy. Hủy tween cũ khi đóng overlay.

**Nghiệm thu:** cả bốn placement mở nút sau thời gian yêu cầu; bấm một lần chỉ trả một thưởng; skip không trả thưởng; đóng/mở lại không bị tween cũ mở nút sớm.

## BUG-02 — Thua trong lúc đang pause

**Nguồn:** [GameManager process mode](D:/folder/tools/godot_demo/2/scripts/core/GameManager.gd:28), [bộ đếm](D:/folder/tools/godot_demo/2/scripts/core/GameManager.gd:99), [HUD pause](D:/folder/tools/godot_demo/2/scripts/ui/GameHUD.gd:135).

GameManager chạy `PROCESS_MODE_ALWAYS`. Sau khi hết trứng, `_process` vẫn trừ timer khi SceneTree đã pause. Kiểm tra màn 1, một quái, hết trứng, pause 3,7 giây: `level_failed` phát và `is_level_active` thành false.

**Kế hoạch cải thiện:** giữ khả năng nhận Back khi pause nhưng ngừng thời gian gameplay. Tách thời gian UI/quảng cáo khỏi thời gian giải đố; định nghĩa rõ pause có dừng Last Stand hay không.

**Nghiệm thu:** pause ở các mốc còn 3 giây, 0,1 giây, trong chuỗi nổ; chờ 10 giây thực rồi resume phải giữ nguyên thời gian gameplay còn lại. Không phát thắng/thua chỉ vì người chơi đang mở menu.

## BUG-03 — Thắng và thua cùng xuất hiện trong Last Stand

**Nguồn:** [GameManager Last Stand](D:/folder/tools/godot_demo/2/scripts/core/GameManager.gd:112), [HUD timeout](D:/folder/tools/godot_demo/2/scripts/ui/GameHUD.gd:261), [HUD thắng](D:/folder/tools/godot_demo/2/scripts/ui/GameHUD.gd:295).

Last Stand hiện modal nhưng game vẫn active. Quái cuối có thể chết do vật đè trong lúc modal chờ. Sau đó thắng được phát, nhưng timer của Last Stand chưa bị hủy và modal cũ chưa bị đóng. Timeout tiếp tục phát thua.

**Đã tái hiện:** mở Last Stand ở màn 6, đăng ký hạ quái cuối rồi chờ; nhận một sự kiện thắng và một sự kiện thua, cả `victory_modal.visible` và `fail_modal.visible` đều true.

**Kế hoạch cải thiện:** chỉ một nơi được chuyển trạng thái kết thúc. Mọi callback phải kiểm tra phiên màn và trạng thái hiện tại. Khi chuyển thắng/thua, đóng modal không tương thích, hủy timer, vô hiệu hóa callback cứu thua cũ.

**Nghiệm thu:** mỗi phiên có tối đa một kết quả cuối; thử quái chết ngay trước timeout, đúng lúc timeout, khi ad đang mở và ngay sau skip.

## BUG-04 — Cửa sổ 3,5 giây không theo dõi hoạt động còn lại

**Nguồn:** [GameManager](D:/folder/tools/godot_demo/2/scripts/core/GameManager.gd:99), [thả trứng](D:/folder/tools/godot_demo/2/scripts/player/ChickenBomber.gd:240), [tuổi thọ trứng](D:/folder/tools/godot_demo/2/scripts/projectiles/NormalEgg.gd:73).

Countdown bắt đầu ngay khi bắn quả cuối, không đợi nó va chạm/kết thúc. Trứng có thể tồn tại đến 8 giây; còn có gió đẩy, bị đè liên tục, TNT và kỹ năng kéo dài.

**Đã tái hiện có kiểm soát:** giữ một Normal Egg trên không bằng `gravity_scale = 0` trong fixture; sau 3,7 giây game báo thua dù trứng vẫn tồn tại và chưa vỡ. Đây chứng minh điều kiện xét thua bỏ qua trứng sống; chưa đo tần suất xảy ra trong các màn chơi bình thường.

**Kế hoạch cải thiện:** theo dõi số tác nhân còn ảnh hưởng gameplay: projectile, kỹ năng đang hoạt động, fuse thuốc nổ và vật đang chuyển động đáng kể. Chỉ kết luận thua sau khoảng yên ổn; vẫn có timeout tối đa để tránh chờ vô hạn.

**Nghiệm thu:** không thua trước một tác động hợp lệ đang diễn ra; mọi trường hợp kẹt vẫn kết thúc trong thời hạn đã chọn. Không giải quyết bằng cách tăng cứng 3,5 lên một số lớn hơn rồi coi như hoàn tất.

## BUG-05 — Hố đen ngoài biên nổ lặp

**Nguồn:** [BlackHoleEgg kiểm tra biên](D:/folder/tools/godot_demo/2/scripts/projectiles/BlackHoleEgg.gd:61), [supernova](D:/folder/tools/godot_demo/2/scripts/projectiles/BlackHoleEgg.gd:97).

`_supernova_blast()` đặt `is_broken = true`, `is_singularity = false` rồi chờ 0,4 giây trước khi xóa. `_physics_process()` không chặn `is_broken`; nếu vẫn ở ngoài biên thì frame tiếp theo lại gọi supernova.

**Đã tái hiện:** hố đen ở x = 2.200, mục tiêu giả nằm trong bán kính. Mục tiêu nhận **24 lần damage, tổng 9.600**, thay vì một lần 400. Số lần có thể đổi theo tick/timing; đây không phải công thức damage được thiết kế.

**Kế hoạch cải thiện:** trạng thái kết thúc chỉ vào một lần; ngừng physics xử lý gameplay ngay khi nổ; tách thời gian tồn tại VFX khỏi logic gây sát thương.

**Nghiệm thu:** ra biên, hết tuổi thọ, va chạm và kích hoạt tay đều chỉ phát một supernova cho một quả trứng, kể cả các sự kiện đến cùng frame.

## BUG-06 — Điểm chiến thắng chưa dùng một snapshot nhất quán

**Nguồn:** [GameManager cộng điểm](D:/folder/tools/godot_demo/2/scripts/core/GameManager.gd:78), [lưu và phát kết quả](D:/folder/tools/godot_demo/2/scripts/core/GameManager.gd:123).

Game ghi sao/điểm ngay khi quái cuối chết, chờ 1,2 giây rồi phát `current_score` hiện tại. Vật bị phá hoặc cage được cứu trong thời gian đó vẫn có thể cộng điểm. Sao và thưởng được quyết định trước, điểm hiển thị lại lấy sau.

**Đã tái hiện với bảng điểm mới trống:** lúc ghi là 2.000; cộng thêm 75 trong thời gian chờ; UI nhận 2.075 trong khi điểm đã lưu cho màn là 2.000. Lần kiểm tra đầu có high score cũ nên không được dùng làm bằng chứng; số ở đây lấy từ kiểm tra đã xóa điểm trong save cách ly.

**Kế hoạch cải thiện:** chọn một chính sách: đợi chuỗi vật lý kết thúc rồi đóng băng kết quả, hoặc đóng băng kết quả ngay và ngừng tính điểm gameplay. UI, save, sao, vàng phải cùng đọc một kết quả phiên.

**Nghiệm thu:** điểm của lượt chơi trong UI bằng điểm snapshot của lượt đó; high score vẫn lấy max với các lượt trước. Không nhầm quy tắc high score với yêu cầu UI luôn bằng high score.

## BUG-07 — Ngưỡng nền cố định khiến vật mất hỗ trợ vẫn đứng yên

**Nguồn:** [DestructibleBlock](D:/folder/tools/godot_demo/2/scripts/destructibles/DestructibleBlock.gd:311), [RollingBoulder](D:/folder/tools/godot_demo/2/scripts/destructibles/RollingBoulder.gd:73), [đáy màn](D:/folder/tools/godot_demo/2/scripts/core/CampaignLevel.gd:130).

Nếu đáy block hoặc đáy boulder đạt y ≥ 800, kiểm tra hỗ trợ trả về ngay. Trong khi đáy world thay đổi từ 840 đến 932. Vùng phía trên sàn thật có thể bị coi là nền vĩnh viễn.

**Đã tái hiện có kiểm soát:** block thép ở y = 810, không có collider hỗ trợ, đã qua thời gian khởi tạo và đã bắn: vẫn `awake = false`, `freeze = true` sau kiểm tra hỗ trợ.

**Kế hoạch cải thiện:** kiểm tra collider sàn/hỗ trợ thật hoặc sử dụng thông tin đáy của phiên màn, tránh suy luận chỉ từ y toàn cục. Xem cả mất trụ, cầu dài và vật đỡ đang rơi.

**Nghiệm thu:** vật không được đỡ sẽ rơi ở cả y = 780, 810 và 900; vật tiếp xúc sàn thật vẫn ổn định; không làm mất peacetime lock.

## BUG-08 — Nút chọn màn sau thắng yêu cầu chuyển scene hai lần

**Nguồn:** [kết nối Victory Levels](D:/folder/tools/godot_demo/2/scripts/ui/GameHUD.gd:89), [claim thường](D:/folder/tools/godot_demo/2/scripts/ui/GameHUD.gd:376).

Callback gọi `_on_claim_normal_and_next()`, bên trong cộng vàng và gọi `next_level()`, rồi lại gọi `go_to_level_select()`. Luồng hai chuyển scene được xác nhận từ mã; chưa kết luận có crash trên UI thực tế.

**Kế hoạch cải thiện:** tách nhận thưởng khỏi điều hướng; đích đến phải được chọn trước, chỉ gửi một yêu cầu đổi scene. Thêm cờ giao dịch thưởng đã nhận để chặn double tap.

**Nghiệm thu:** Next, Chọn màn, Back đều cộng đúng một lần và đi đúng một đích; không tải màn kế tiếp chỉ để ngay lập tức rời nó.

## SAVE-01 — Reset toàn bộ save cũ

**Nguồn:** [SaveManager](D:/folder/tools/godot_demo/2/scripts/core/SaveManager.gd:27).

Save có `version < 7` sẽ gọi `reset_save()`. Có thể phù hợp giai đoạn prototype, nhưng nếu dùng khi cập nhật bản đã có người chơi thì mất sao, điểm, vàng và inventory.

**Kế hoạch:** migration theo phiên bản, bổ sung field còn thiếu mà giữ dữ liệu hợp lệ; sao lưu trước nâng cấp; không sửa save của người dùng trong đợt lập kế hoạch này.

**Nghiệm thu:** bộ mẫu save từ các schema cũ nâng cấp được, không giảm tiến trình; trường hợp không hỗ trợ phải được xử lý rõ ràng, không âm thầm reset.

## SAVE-02 — Ghi tmp/backup cần hoàn thiện

**Nguồn:** [ghi save](D:/folder/tools/godot_demo/2/scripts/core/SaveManager.gd:58), [phục hồi](D:/folder/tools/godot_demo/2/scripts/core/SaveManager.gd:83).

Hiện ghi tmp, copy main sang backup, xóa main, rename tmp. Đây chưa phải thao tác thay thế nguyên tử chỉ vì comment gọi là “Atomic promote”. Kết quả copy/remove/rename chưa được kiểm tra. Khi phục hồi từ backup, gọi `save_game()` có thể copy main đang hỏng đè lên backup tốt trước khi khôi phục xong. Loader chưa xét tmp còn nguyên vẹn sau một lần ghi bị gián đoạn.

**Kế hoạch:** định nghĩa main/tmp/backup nào là bản hợp lệ, kiểm tra mã lỗi, chỉ quay vòng backup khi nguồn đã được xác thực; chọn cách thay file phù hợp nền tảng. Tách thưởng thành giao dịch để không lưu số lượt quay trước rồi mất phần thưởng nếu bị kill giữa hai lần ghi.

**Nghiệm thu:** mô phỏng dừng ở từng bước ghi; khởi động lại luôn lấy được một snapshot hợp lệ đã commit; không nhân đôi thưởng và không tự phá bản backup tốt.

## SAVE-03 — JSON đúng cú pháp chưa đủ là save hợp lệ

**Nguồn:** [load/apply dictionary](D:/folder/tools/godot_demo/2/scripts/core/SaveManager.gd:83).

Code chỉ kiểm tra top-level Dictionary rồi thêm các key thiếu. Chưa kiểm tra nested dictionary, kiểu version/coins/stars, miền giá trị level hoặc consumable. Chưa tái hiện bằng save người dùng; đây là thiếu sót xác thực dữ liệu.

**Kế hoạch:** validator và migration chung, giới hạn giá trị hợp lý, giữ bản hỏng để chẩn đoán và fallback có kiểm soát. Tránh sửa dữ liệu không rõ nguồn bằng cách mặc định reset toàn bộ.

## BUILD-01 — Nhận diện gói xuất chưa khớp game

**Nguồn:** [export_presets.cfg](D:/folder/tools/godot_demo/2/export_presets.cfg:11).

Android còn `LongNeckRush3D.aab`, `com.gamehyper.longneckrush3d`, tên “Long Neck Rush 3D”, `package/signed=false`; Windows cũng dùng tên LongNeckRush3D. Preset Web có nhúng YouTube game API nhưng chưa thấy cầu nối API trong mã gameplay đã rà.

**Kế hoạch:** chốt nền tảng MVP và nhận diện package đúng trước export; xác nhận yêu cầu build/signing và SDK đích tại thời điểm phát hành. Chỉ nhãn “YouTube Playables” trong preset chưa chứng minh đã tích hợp hoàn chỉnh.

## Những điểm chưa được coi là lỗi xác nhận

- Một tap vừa kích hoạt kỹ năng vừa bắt đầu ngắm quả kế tiếp: hai đường input có cơ sở xung đột, nhưng phép thử mouse headless chưa tái hiện được. Cần kiểm tra trên điện thoại/chuột thật.
- Quá nhiều hiệu ứng/query gây tụt FPS: chưa có profiler trên thiết bị mục tiêu.
- Hit-stop dùng `Engine.time_scale` có thể chồng nhau: cần stress test trước khi kết luận độ dài hit-stop sai.
- Các giới hạn số kết quả query 8/16/32/64 có thể bỏ sót vật trong vùng đông; chưa đo số collider tại từng vụ nổ.
- Thiếu file biểu cảm `5_eyes_defeated_black_eye.svg` của fox guard có loader mềm; chưa chứng minh làm crash. Kiểm tra hình thay thế và sửa tham chiếu trong đợt polish.
