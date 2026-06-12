# Kế hoạch phát triển game PSX Horror thành bản chơi được 2-3 giờ

## 1. Mục tiêu sản phẩm
- Biến prototype hiện tại thành một game kinh dị có vòng lặp chơi rõ ràng, có mở đầu, giữa và kết thúc.
- Không chỉ thêm đồ vật, mà mỗi đồ vật phải phục vụ một mục đích gameplay, puzzle, lore hoặc scare event.
- Ưu tiên số 1 là trải nghiệm chơi trọn vẹn; tối ưu hiệu năng và editor mode là mức số 2.
- **MỚI: Chuyển từ procedural BoxGeometry sang dùng GLTF/GLB model** cho mọi đồ nội thất, nhân vật và props. Điều này giúp chất lượng hình ảnh tăng lên nhiều lần so với các hộp vuông hiện tại.

## 2. Cách dùng kế hoạch này
- Làm từ trên xuống dưới.
- Mỗi phần có kịch bản nhỏ, đầu ra rõ ràng và tiêu chí xong.
- Không mở rộng content trước khi core loop hoạt động.
- Nếu một bước bị kẹt, lùi về bước trước gần nhất và đơn giản hóa nó.

## 3. Pha 0: Dọn nền và chuẩn hóa code

### 3.0.1 Tách nhóm logic
- Tách rõ `gameplay`, `interaction`, `ui`, `save`, `audio`, `enemy`, `editor`.
- Không để một file làm quá nhiều việc trong cùng một hàm.
- Đưa các biến global đang dùng chung vào một object state nếu cần.
- **MỚI:** Tạo file `models.js` riêng chứa hàm loadModel() wrapper. Mọi create function sẽ gọi loadModel() thay vì tạo BoxGeometry thủ công.

### 3.0.2 Chuẩn hóa data model
- Chốt schema cho object, item, objective, door, note, trigger.
- Mỗi đối tượng có id rõ ràng và trạng thái riêng.
- Lưu version cho save data để sau này còn nâng cấp được.

### 3.0.3 Dọn UI cơ bản
- Giữ layout play mode và creator mode tách biệt.
- Tạo sẵn cho HUD: objective, prompt, inventory, hint, dialog.
- Làm cho UI có thể bật/tắt từng phần thay vì để tràm tùng lên màn hình.

### 3.0.4 Hệ thống GLTF Model Loader (MỚI)
- Viết hàm `loadGLTFModel(path, scale, callback)` dùng `GLTFLoader` từ Three.js.
- Tạo file manifest `model_registry.json` liệt kê tất cả model, path, scale mặc định, và metadata.
- Mỗi create function (createBed, createChair, createTable...) sẽ:
  1. Kiểm tra nếu model file tồn tại → load GLTF
  2. Nếu không có model → fallback về BoxGeometry cũ (giữ backward compatible)
- Như vậy bạn có thể thay thế từng model một mà game vẫn chạy bình thường.

### 3.0.5 Kết quả cần đạt
- Không còn code rộn ràng khó đọc.
- Có một nơi trung tâm chứa state game.
- Có một cấu trúc để thêm objective và interaction mới.
- Có pipeline load 3D model từ file.

## 4. Pha 1: Core loop tối thiểu

### 4.1 Objective system
- Tạo danh sách objective theo thứ tự.
- Hiển thị objective hiện tại và objective tiếp theo.
- Cho phép update objective bằng sự kiện, không bằng hardcode lung tung.
- Thêm thông báo khi objective mới được mở khóa.

### 4.2 Interaction system
- Dùng 1 cơ chế chung cho nhìn, bấm, nhặt, mở, đọc, kích hoạt.
- Hiển thị prompt ngắn gọn khi player nhìn vào object hợp lệ.
- Tách interaction theo loại: item, door, note, switch, trigger.
- **MỚI:** Thêm interaction cho drawer (ngăn kéo), cabinet (tủ), container (hộp/rương) — loại mở ra và có item bên trong.

### 4.3 Inventory system
- Phân loại item thành key item, clue item, consumable, lore item.
- Cho phép nhặt, bỏ, dùng, xem mô tả.
- Inventory UI chỉ cần gọn và nhanh, không cần quá đẹp ngay từ đầu.
- **MỚI:** Thêm combine system đơn giản — ghép 2 item thành 1 (ví dụ: key + locket = secret key).

### 4.4 Gate progression
- Mở một cửa đầu tiên bằng key item.
- Một công tắc hoặc keypad để chặn đường tiếp theo.
- Một đoạn backtracking ngắn để tạo cảm giác map đang sống.
- **MỚI:** Mỗi khu vực có "event trigger" — khi player bước vào lần đầu, kích hoạt một sự kiện (đèn tắt, cửa đóng, âm thanh lạ).

### 4.5 Kết quả cần đạt
- Người chơi có thể bắt đầu, nhặt item, mở khóa, đi qua một gate và thấy objective đổi.
- Game có một vòng lặp rõ ràng thay vì chỉ đi tham quan.

## 5. Pha 2: Map và level design

### 5.1 Chia map thành khu vực
- Khu vực 1: Intro room — dạy objective đầu tiên.
- Khu vực 2: Corridor — dạy tension và guidance.
- Khu vực 3: Key room — chứa item quan trọng.
- Khu vực 4: Safe room — cho player nghỉ và đọc clue.
- Khu vực 5: Threat zone — có scare hoặc haunt.
- Khu vực 6: Final room — puzzle cuối và ending.

### 5.2 Mỗi room phải có vai trò
- Clue room: chứa thông tin.
- Gate room: chặn đường.
- Reward room: cho item hoặc lore.
- Scare room: tạo áp lực.
- Transition room: chuyển đoạn và giữ nhiệt.

### 5.3 Backtracking có ý nghĩa
- Cho quay lại nhưng phải có sự thay đổi.
- Có thể tắt đèn, đóng cửa, đổi vật thể, xuất hiện sự kiện mới.
- Không để backtracking chỉ là đi lại cho tốn thời gian.

### 5.4 Dàn đồ vật theo mục đích
- Mỗi đồ vật lớn phải có một vai trò rõ.
- Nếu đồ vật không phục vụ gameplay, lore, hoặc atmosphere thì cắt bớt.
- Có thể dùng đồ vật để che khuất, đưa hướng nhìn, tạo điểm check interaction.

### 5.5 Kết quả cần đạt
- Map có cấu trúc rõ, player không bị lạc vô nghĩa.
- Mỗi khu vực có mục đích và có lý do để tồn tại.

## 6. Pha 3: Puzzle và progression chi tiết

### 6.1 Puzzle 1 — Mở cửa đầu
- Tìm key từ phòng đầu.
- Đọc clue ngắn nếu key không nằm rõ ràng.
- Mở cửa và kích hoạt sự kiện đầu tiên.

### 6.2 Puzzle 2 — Điện, công tắc, hoặc cầu chì
- Tìm nguồn điện hoặc công tắc.
- Kích hoạt đèn, mở cửa, hoặc mở máy.
- Dùng effect âm thanh và flicker để báo hiệu đã thay đổi trạng thái map.

### 6.3 Puzzle 3 — Code lock hoặc symbol lock
- Đặt clue ở 2-3 nơi khác nhau.
- Ghép clue từ note, tranh, đoạn mờ.
- Khi đúng code, mở khu vực tiếp theo.

### 6.4 Puzzle 4 — Mảnh mối lore
- Đặt note, ảnh, và vật chứng theo chủ đề.
- Ghép thông tin để hiểu story.
- Dùng lore để khiến ending có nghĩa hơn.

### 6.5 Puzzle 5 — Final gate
- Có 1 điều kiện cuối, như final key, final code hoặc final item.
- Dẫn tới ending room.
- Kết thúc rõ ràng, có cảm giác giải thoát hoặc thất bại.

### 6.6 Kết quả cần đạt
- Puzzle không quá khó, nhưng đủ để tạo nhịp.
- Mỗi puzzle có clue rõ và có vị trí hợp lý.

## 7. Pha 4: Horror systems

### 7.1 Audio trước, visual sau
- Thêm ambient loop cho từng khu vực.
- Thêm footsteps, door creak, pickup, ui click, ghost cue.
- Cho âm thanh thay đổi theo nguy cơ và theo khu vực.
- **MỚI: Danh sách audio cần thiết:**
  - `ambient_main.ogg` — drone nền tối tăm, loop
  - `ambient_basement.ogg` — tiếng nước nhỏ giọt, rì rào
  - `footstep_wood_1.ogg` đến `footstep_wood_4.ogg` — bước chân trên gỗ
  - `footstep_tile_1.ogg` đến `footstep_tile_3.ogg` — bước chân trên gạch
  - `door_creak_open.ogg`, `door_creak_close.ogg`
  - `door_locked.ogg` — tiếng xoay tay nắm cửa khóa
  - `item_pickup.ogg` — tiếng nhặt đồ
  - `key_jingle.ogg` — tiếng chìa khóa
  - `switch_click.ogg` — tiếng công tắc
  - `heartbeat_slow.ogg`, `heartbeat_fast.ogg`
  - `ghost_whisper_1.ogg` đến `ghost_whisper_3.ogg`
  - `jump_scare_sting.ogg` — stinger ngắn
  - `clock_tick.ogg` — tiếng đồng hồ
  - `cat_meow.ogg`, `cat_purr.ogg`, `cat_hiss.ogg`
  - `glass_break.ogg`, `wood_crack.ogg`
  - `thunder_distant.ogg`, `rain_loop.ogg`
  - `music_box.ogg` — hộp nhạc rùng rợn

### 7.2 Light và atmosphere
- Dùng flicker light tại điểm quan trọng.
- Dùng fog, vignette, dark corner để giảm tầm nhìn.
- Nếu có night vision, phải có hạn chế rõ.
- **MỚI:** Thêm point light có màu khác nhau cho từng khu vực (xanh lá cho phòng tắm, vàng ấm cho phòng khách, đỏ tối cho tầng hầm).

### 7.3 Threat/ghost system
- Chỉ cần 1 entity đơn giản cũng đủ nếu được làm đúng.
- Entity xuất hiện khi player ở lâu, sai hướng, hoặc nhặt item quan trọng.
- Entity có thể chỉ đi quanh khu vực trước khi truy sát.
- **MỚI:** Ghost có 3 phase:
  1. **Passive:** Chỉ xuất hiện dưới dạng bóng mờ ở xa, biến mất khi player nhìn thẳng.
  2. **Stalking:** Theo player ở khoảng cách xa, chỉ di chuyển khi player quay lưng.
  3. **Aggressive:** Truy đuổi trực tiếp, player phải chạy hoặc trốn.

### 7.4 Scripted scares
- Cửa đóng, gương đổi, đèn tắt, sound jump, shadow movement.
- Mỗi scare phải phục vụ hướng dẫn hoặc tăng tension.
- Không làm jump scare lan tray khắp map.
- **MỚI: Danh sách scripted scare events:**
  1. Đèn hành lang tắt hết khi bước qua (có âm thanh rẹt rẹt)
  2. Gương trong phòng tắm phản chiếu một bóng đen phía sau player
  3. TV phòng khách tự bật lên hiện static noise
  4. Cửa tủ mở ra khi đi ngang qua
  5. Tiếng khóc trẻ em vọng từ phòng nursery
  6. Ghế rocking tự đung đưa
  7. Tranh trên tường đổi hình (mắt nhắm → mắt mở)
  8. Phone/radio phát ra tiếng nói lộn xộn
  9. Footsteps phía sau khi đi trong hành lang tối
  10. Cửa sổ vỡ kèm tiếng sấm

### 7.5 Kết quả cần đạt
- Game không còn cảm giác vắng lặng.
- Người chơi cảm thấy map có gì đó đang diễn ra.

## 8. Pha 5: UI/UX và điều khiển

### 8.1 HUD tối giản
- Objective hiện tại.
- Prompt tương tác.
- Inventory.
- Fear/stamina nếu cần.

### 8.2 Hướng dẫn ban đầu
- Start screen có controls cơ bản.
- Intro ngắn, vào thẳng vào game nếu có thể.
- Dạy người chơi bằng tình huống, không bằng text dài.

### 8.3 Hint system
- Nếu đứng lâu ở một khu vực thì hiện gợi ý.
- Hint chỉ gợi mở, không nói thẳng lời giải.
- Có thể tắt hint cho người chơi thích tự tìm.

### 8.4 Pause menu (MỚI)
- Bấm ESC → hiện menu pause với các lựa chọn:
  - Continue
  - Settings (âm lượng, độ nhạy chuột, chế độ hiển thị)
  - Save game
  - Load game
  - Quit

### 8.5 Kết quả cần đạt
- UI không cần đoán mà vẫn hiểu.
- Player không bị thao tác quá nhiều thứ cùng lúc.

## 9. Pha 6: Nội dung để đạt mục tiêu 2-3 giờ

### 9.1 Khung thời lượng
- 15 phút đầu: làm quen và tìm objective đầu.
- 30-45 phút giữa: khám phá, puzzle, backtracking.
- 30 phút tiếp: sự kiện kinh dị, mở khóa khu vực mới.
- 30-45 phút cuối: final puzzle và ending.

### 9.2 Số lượng content cần có
- 6-8 room có ý nghĩa.
- 3-5 item quan trọng.
- 5-10 note hoặc clue.
- 2-3 puzzle chính.
- 1 final encounter hoặc threat system.

### 9.3 Kịch bản dùng
- Player (con mèo) tỉnh dậy trong phòng kín.
- Tìm key để thoát ra hành lang chính.
- Tiến vào khu vực có điện và note.
- Xuất hiện threat lần đầu.
- Mở được khu vực tầng trên hoặc hầm.
- Lấy final key và thoát.

### 9.4 Kết quả cần đạt
- Người chơi có thể chơi 2-3 giờ mà vẫn thấy có mục tiêu và có kết thúc.
- Content đủ nhiều để không bị lặp lại, nhưng không quá nhã đủ để làm.

## 10. Pha 7: Tối ưu hiệu năng

### 10.1 Texture pipeline
- Giảm base64 trong save nếu có thể.
- Dùng file texture riêng và lưu reference.
- Resize và compress trước khi ship.
- **MỚI:** Tất cả GLTF model nên dùng texture riêng thay vì embed trong file. Texture nên ≤ 512x512 cho phong cách PSX.

### 10.2 Scene optimization
- Frustum culling cho object tĩnh.
- Tắt shadow ở object không cần.
- Dùng group hoặc merge object tĩnh nếu hợp lý.
- **MỚI:** Instance mesh cho các object lặp lại (tường, ghế, hộp) — giảm draw call đáng kể.

### 10.3 Logic optimization
- Giảm DOM query trong vòng lặp render.
- Tách update theo module.
- Cache object interactable, door, item, note.

### 10.4 Save optimization
- Chia save thành state runtime và content data.
- Có versioning để tránh hỏng save.
- Chỉ save khi cần, không save liên tục.

### 10.5 GLTF Model optimization (MỚI)
- Dùng `gltf-pipeline` hoặc `glTF-Transform` để nén model (draco compression).
- Giới hạn polygon count: mỗi prop ≤ 500 triangles cho phong cách PSX retro.
- Load model async với loading screen.

### 10.6 Kết quả cần đạt
- FPS ổn định hơn khi map lớn dần lên.
- File save không phồng quá to.

## 11. Pha 8: Hoàn thiện và polish

### 11.1 Polish gameplay
- Chỉnh tốc độ di chuyển, camera, collision, jump, stamina.
- Giảm bug vùng va chạm.
- Làm lại interaction cho mềm và ổn định.

### 11.2 Polish nghệ nhìn
- Thêm ambience theo từng zone.
- Chỉnh màu, độ sáng, fog, shadow.
- Thêm transition khi vào/ra khu vực quan trọng.
- **MỚI:** Post-processing effects:
  - CRT scanline filter (phong cách PS1)
  - Film grain
  - Vignette tối viền
  - Color grading lạnh/ấm theo khu vực

### 11.3 Polish nội dung
- Đọc lại toàn bộ clue để đảm bảo logic.
- Sửa các room bị thừa.
- Đảm bảo ending có câu chuyện và cảm giác kết thúc.

### 11.4 Kết quả cần đạt
- Game có cảm giác hoàn chỉnh, không còn lắt cắt giữa các phần.

## 12. Thứ tự làm từng bước nhỏ

### Bước 1: Dọn code và chốt schema
- Tách state, object, save, interaction.

### Bước 2: Tạo GLTF loader và model pipeline
- Viết hàm load model.
- Thay thế từng create function bằng model thật.

### Bước 3: Làm objective và prompt
- Cho player biết mình cần làm gì.

### Bước 4: Làm inventory và item pickup
- Tạo item và lưu item.

### Bước 5: Làm cửa khóa và gate progression
- Mở khóa khu vực tiếp theo.

### Bước 6: Làm note và clue
- Hiển thị lore và gợi ý puzzle.

### Bước 7: Làm puzzle 1 và 2
- Mở cửa, bật điện, đi tiếp.

### Bước 8: Thêm audio và ambience
- Tạo không khí kinh dị.

### Bước 9: Thêm threat/ghost đơn giản
- Tạo áp lực và script scare.

### Bước 10: Mở rộng map thành 6-8 room
- Hoàn chỉnh line di chuyển.

### Bước 11: Làm final puzzle và ending
- Có kết thúc rõ ràng.

### Bước 12: Tối ưu performance
- Giảm texture to, shadow nặng, DOM thừa.

### Bước 13: Playtest và sửa bug
- Chạy thử từ đầu tới cuối.
- Ghi bug, sửa bug, chạy lại.

## 13. Tiêu chí hoàn thành từng pha
- Pha 0 xong khi code dễ đọc và dễ sửa, model loader hoạt động.
- Pha 1 xong khi có core loop có thể chơi.
- Pha 2 xong khi map có nhịp và có vai trò rõ.
- Pha 3 xong khi puzzle đẩy được game tiến lên.
- Pha 4 xong khi game có không khí kinh dị thật sự.
- Pha 5 xong khi UI không cần nêu và không làm rối.
- Pha 6 xong khi có playthrough 2-3 giờ.
- Pha 7 xong khi game vẫn ổn định khi content tăng.
- Pha 8 xong khi game có cảm giác final, không còn prototype.

## 14. Ghi chú cho codebase hiện tại
- `psx.js`: nên tách editor code, gameplay code và interaction code thành các khối rõ ràng. Hiện tại file đã 3185 dòng — quá lớn cho một file duy nhất.
- `psx.html`: cần thêm HUD cho objective, inventory và prompt.
- `server.py`: phục vụ save/load và texture files theo file bình thường, tránh save quá to.
- `compress.py`: giữ vai trò pre-process asset, không nên phụ thuộc runtime vào Base64 quá nhiều.
- **MỚI:** Tất cả model GLTF/GLB sẽ được đặt trong `assets/models/` theo cấu trúc rõ ràng.

## 15. Kết luận ngắn
- Không nên chỉ thêm đồ vật.
- Hãy làm theo từng pha nhỏ: core loop → map → puzzle → horror → UI → optimization → polish.
- Khi 8 pha này hoạt động, game mới sự thật là đi từ prototype sang bản chơi được hoàn chỉnh.
- **Việc chuyển sang model GLTF là bước đột phá lớn nhất** — từ các hộp vuông xấu xí sang đồ nội thất có hồn, giúp game nhìn chuyên nghiệp hơn 10 lần.
