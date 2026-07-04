# 📋 KỊCH BẢN SẢN XUẤT CHI TIẾT — DỰ ÁN SYMBIOSIS

> Tài liệu này là bản "shooting script" để bắt tay vào code từng phần.
> Mỗi Room (phòng) = 1 màn hình game. Mỗi Room có: layout bản đồ, quái, thoại, vật phẩm, asset cần.

---

## MỤC LỤC

1. [Nhân vật và Thiết kế](#1-nhân-vật-và-thiết-kế)
2. [Danh sách Quái vật (Toàn game)](#2-danh-sách-quái-vật-toàn-game)
3. [ACT 1 — Khu Cách Ly (The Quarantine) ~60 phút](#3-act-1--khu-cách-ly-the-quarantine)
4. [ACT 2 — Vườn Sinh Học (The Overgrowth) ~75 phút](#4-act-2--vườn-sinh-học-the-overgrowth)
5. [ACT 3 — Lưu Trữ Ký Ức (The Archives) ~75 phút](#5-act-3--lưu-trữ-ký-ức-the-archives)
6. [ACT 4 — Lõi Trung Tâm (The Core) ~60 phút](#6-act-4--lõi-trung-tâm-the-core)
7. [Hệ thống Ending](#7-hệ-thống-ending)
8. [Tổng hợp Asset cần chuẩn bị](#8-tổng-hợp-asset-cần-chuẩn-bị)

---

## 1. Nhân vật và Thiết kế

### 1A. Zero (Người chồng / Nhân vật chính)
| Thuộc tính | Mô tả |
|---|---|
| Tên thật | Chưa biết (hé lộ ở ACT 3) |
| Trạng thái | Mất trí nhớ hoàn toàn, bị nhốt trong cơ thể Bio-Probe |
| Dạng Cyber | Xanh dương neon, nhanh nhẹn, bắn laser, lướt xuyên laser |
| Dạng Bio | Xanh lá acid, chậm nhưng mạnh, khoan đất, kháng đòn |
| Sprite cần | `player_cyber_idle.png`, `player_cyber_run.png`, `player_bio_idle.png`, `player_bio_run.png` (hoặc dùng code vẽ như hiện tại) |

### 1B. Dr. Eleanor (Người vợ / Yandere / Antagonist)
| Thuộc tính | Mô tả |
|---|---|
| Tuổi | ~28-30 |
| Ngoại hình | Tóc dài trắng/bạc, mắt xanh lơ, áo blouse trắng xộc xệch, vết máu vương trên má |
| Tính cách | Ngọt ngào → Chiếm hữu → Điên loạn → Tuyệt vọng (biến đổi qua từng ACT) |
| Sprite cần | `el_avatar_normal.png` (dịu dàng), `el_avatar_worried.png` (lo lắng), `el_avatar_angry.png` (tức giận, mắt trợn), `el_avatar_crying.png` (khóc, ACT 4), `el_avatar_glitch.png` (nhiễu sóng, điên) |

### 1C. Lily (Con gái - đã chết)
| Thuộc tính | Mô tả |
|---|---|
| Vai trò | Không xuất hiện trực tiếp, chỉ qua ảnh trên màn hình, đồ chơi rải rác, giọng nói echo |
| Asset cần | `lily_photo.png` (ảnh gia đình cũ, bị rách), `lily_toy.png` (con gấu bông nhỏ - vật phẩm quan trọng cho True End) |

---

## 2. Danh sách Quái vật (Toàn game)

> **LƯU Ý QUAN TRỌNG:**
> Mỗi loại quái có 2 HÌNH DẠNG:
> - **Ảo giác (Illusion):** Hình quái vật ghê rợn mà Zero nhìn thấy ban đầu.
> - **Sự thật (Truth):** Hình dạng thật (đội cứu hộ, nhân viên) chớp nhoáng xuất hiện khi bị Glitch.

### Quái thường (Regular Enemies)

| ID | Tên Ảo Giác | Tên Sự Thật | HP | Hành vi | Xuất hiện | Asset cần |
|---|---|---|---|---|---|---|
| E01 | Crawler (Khối thịt bò) | Nhân viên bò lê bị thương | 2 | Tuần tra trái-phải, đụng tường quay lại | ACT 1-4 | `enemy_crawler.png`, `enemy_crawler_truth.png` |
| E02 | Spitter (Bọ phun acid) | Lính cầm súng phun | 3 | Đứng yên, phun đạn acid mỗi 2s khi thấy player | ACT 1-3 | `enemy_spitter.png`, `enemy_spitter_truth.png` |
| E03 | Floater (Mắt bay) | Drone trinh sát | 2 | Bay lơ lửng, theo dõi player, bắn laser nhỏ | ACT 2-4 | `enemy_floater.png`, `enemy_floater_truth.png` |
| E04 | Charger (Sừng húc) | Lính bọc giáp xông vào | 4 | Phát hiện player - lao thẳng tới với tốc độ cao | ACT 2-4 | `enemy_charger.png`, `enemy_charger_truth.png` |
| E05 | Leech Vine (Dây leo hút máu) | Dây cáp điện | 3 | Treo trên trần, vươn xuống khi player đi qua | ACT 2 only | `enemy_vine.png` |
| E06 | Cyborg Guard (Giáp đỏ) | Đặc nhiệm Alpha | 6 | Tuần tra, có khiên chắn phía trước, phải đánh lưng | ACT 3-4 | `enemy_cyborg.png`, `enemy_cyborg_truth.png` |
| E07 | Mimic Terminal | Trạm máy tính bẫy | 5 | Giả dạng Save Terminal, tấn công khi player tới gần | ACT 3 only | `enemy_mimic.png` |

### Mini-Boss (1 mỗi ACT)

| ID | Tên | ACT | HP | Phần thưởng | Mô tả |
|---|---|---|---|---|---|
| MB01 | Warden (Cai ngục) | 1 | 20 | Mở khóa Dash (phím U) | Robot an ninh khổng lồ cầm dùi cui điện. Đập đất tạo sóng xung kích. |
| MB02 | Mother Vine (Mẹ Dây Leo) | 2 | 25 | Mở khóa Bio-Drill (phím K dạng Bio) | Khối thực vật khổng lồ bám trần nhà, phun acid và vươn dây leo. |
| MB03 | Archive Keeper (Thủ thư) | 3 | 30 | Mở khóa Double Jump | Robot thư viện bay, bắn laser theo pattern phức tạp, triệu hồi Floater. |

### Final Boss — Eleanor (ACT 4)

| Phase | Tên | HP | Mô tả | Pattern |
|---|---|---|---|---|
| Phase 1 | Eleanor Hologram | 0 (bất tử) | Ảo ảnh hologram của Eleanor mặc váy trắng, bay lơ lửng. Không thể đánh. Phải phá 4 cột năng lượng xung quanh. | 4 cột bắn laser xoay. Eleanor triệu hồi Crawler + Floater. Phá hết 4 cột chuyển Phase 2. |
| Phase 2 | Bio-Mech Eleanor | 50 | Nửa trên: khuôn mặt Eleanor khóc lóc. Nửa dưới: khối xúc tu sinh học + kim loại khổng lồ. | Đập xúc tu (né bằng Dash), Bắn laser mắt (nhảy qua), Triệu hồi acid rain (chạy tránh), Gào thét gây Glitch màn hình (giảm tầm nhìn). |
| Phase 3 (True End only) | Eleanor Lõi Trần | 20 | Lõi não bộ của Eleanor lộ ra, bọc trong bình thủy tinh. Cô van xin, khóc. | Không tấn công. Player phải phá bình thủy tinh. Nếu có đồ chơi Lily cutscene đặc biệt. |

---

## 3. ACT 1 — Khu Cách Ly (The Quarantine) ~60 phút

**Tone màu:** Trắng bệnh viện, xám lạnh, xanh lơ mờ nhạt.
**Nhạc nền:** Tiếng máy thở đều đều, ambient rùng rợn, tiếng nước nhỏ giọt.
**Eleanor mood:** Dịu dàng, lo lắng, yêu thương. Dùng avatar `el_avatar_normal.png`.

### Room 1-1: Phòng Tỉnh Giấc (Tutorial - Di chuyển)
- **Layout:** Phòng nhỏ 2 màn hình. Giường bệnh vỡ nát ở giữa. Đèn neon nhấp nháy.
- **Quái:** Không có.
- **Sự kiện:**
  - Màn hình đen, fade in chậm. Zero nằm trên giường.
  - **Eleanor (thoại tự động):** *"...Anh ơi? Anh nghe em nói không? Đừng sợ. Hệ thống thần kinh đang khởi động lại... Cử động thử đi anh."*
  - Player học di chuyển (A/D), nhảy (Space).
  - **Eleanor:** *"Tốt lắm. Cơ thể mới đang phản hồi tốt. Anh thật tuyệt vời."*
- **Asset cần:** `bg_quarantine_room.png`, `prop_broken_bed.png`

### Room 1-2: Hành Lang Vỡ (Tutorial - Chiến đấu)
- **Layout:** Hành lang dài, có 2 Crawler chặn đường.
- **Quái:** 2x Crawler (E01)
- **Sự kiện:**
  - **Eleanor:** *"Cẩn thận anh! Có sinh vật đột biến phía trước. Hãy dùng cánh tay để tự vệ - nhấn J để chém."*
  - Player học chiến đấu cơ bản (J).
  - Sau khi giết quái: **Eleanor:** *"Giỏi lắm anh yêu! Xé xác chúng ra! ...À, ý em là, anh tự vệ rất tốt."* (Câu nói bộc lộ bản chất yandere nhẹ, player chưa nhận ra)
- **Memory Fragment #1:** Nằm trên kệ cao. Nội dung: *"Nhật ký ngày 1: Cơ thể anh ấy đang suy yếu... Tôi không thể để anh ấy chết. Tôi sẽ không chấp nhận điều đó. KHÔNG BAO GIỜ."*

### Room 1-3: Phòng Thí Nghiệm Bỏ Hoang
- **Layout:** Phòng rộng 3 màn hình. Có bồn chứa dung dịch vỡ, kính vỡ trên sàn.
- **Quái:** 3x Crawler, 1x Spitter (E02)
- **Sự kiện:**
  - Trên tường có ảnh gia đình cũ bị rách (Environmental storytelling - player thấy nhưng chưa hiểu).
  - **Eleanor:** *"Khu vực này từng là nơi em làm việc... Trước khi mọi thứ sụp đổ. Đừng nhìn vào những bức ảnh đó, anh. Chúng không quan trọng nữa."*
- **Asset cần:** `prop_broken_tank.png`, `prop_family_photo_torn.png`

### Room 1-4: Trạm Lưu Trữ Đầu Tiên (Save Point)
- **Layout:** Phòng nhỏ an toàn. Có terminal phát sáng xanh lơ.
- **Quái:** Không có.
- **Sự kiện:**
  - **Eleanor:** *"Đây là Trạm Lưu Trữ. Anh có thể nghỉ ngơi ở đây. Em sẽ luôn ở bên cạnh anh... Luôn luôn."*
  - Tutorial: Cách save game, hồi máu.
- **Asset cần:** `prop_save_terminal.png`

### Room 1-5 tới 1-8: Hành Lang Cách Ly (Combat Rooms)
- **Layout:** 4 phòng liên tiếp, mỗi phòng tăng dần độ khó.
- **Quái:** Crawler + Spitter phối hợp. Room 1-8 có 1 Floater (E03) đầu tiên.
- **Sự kiện (Room 1-6):**
  - **Eleanor (khi player bị trúng đòn):** *"Anh bị thương rồi! Đau không anh? Em xin lỗi... Em đã nên thiết kế cơ thể anh tốt hơn... Em sẽ bù đắp cho anh."*
- **Sự kiện (Room 1-7):**
  - **Eleanor (khi player đứng yên quá 15 giây):** *"Anh ơi? Sao anh dừng lại? Đừng suy nghĩ nhiều... Cứ đi tiếp đi anh. Em đang chờ anh mà."*
- **Memory Fragment #2 (Room 1-8, ẩn):** Nằm trong ngách bí mật trên cao. Nội dung: *"Nhật ký ngày 47: Ba mẹ anh ấy gọi điện nói tôi bị tâm thần. Họ muốn mang anh ấy đi khỏi tôi. Tôi sẽ KHÔNG cho phép điều đó xảy ra."*

### Room 1-9: Phòng Boss — Warden (Mini-Boss ACT 1)
- **Layout:** Arena hình chữ nhật rộng, có 3 platform treo lơ lửng.
- **Boss:** Warden (MB01) - Robot an ninh cầm dùi cui.
- **Pattern:**
  1. Chạy về phía player, vung dùi cui 3 nhát (né bằng nhảy).
  2. Đập đất tạo sóng xung kích chạy trên sàn (nhảy lên platform né).
  3. Khi HP duới 50%: Bật shield, player phải đánh lưng.
- **Thoại trước Boss:**
  - **Eleanor:** *"Cái robot đó... Nó là hệ thống an ninh cũ, đã hóa điên. Tiêu diệt nó đi anh. Đừng để nó ngăn cản chúng ta."*
- **Thoại sau Boss:**
  - **Eleanor:** *"Anh thật mạnh mẽ! Em đã chọn đúng người... À, ý em là, anh xứng đáng được sống. Hệ thống Dash đã được kích hoạt - bấm U để lướt."*
- **Phần thưởng:** Mở khóa Dash (phím U).
- **Asset cần:** `boss_warden.png` (spritesheet: idle, attack, stun, die)

---

## 4. ACT 2 — Vườn Sinh Học (The Overgrowth) ~75 phút

**Tone màu:** Xanh lá sẫm, đen, rêu phong, acid vàng-xanh.
**Nhạc nền:** Tiếng côn trùng kêu, nước sục sôi, ambient organic u ám.
**Eleanor mood:** Bắt đầu chiếm hữu, ghen tuông. Xen kẽ `el_avatar_normal.png` và `el_avatar_worried.png`.

### Room 2-1: Cổng Vào Vườn Sinh Học
- **Layout:** Cánh cửa kim loại mở ra, bên trong là rừng cây nhân tạo bị đột biến.
- **Quái:** Không có (chỉ ambience).
- **Sự kiện:**
  - **Eleanor:** *"Khu này... là nơi em nuôi trồng các tế bào sinh học. Đẹp phải không anh? Mọi thứ ở đây đều sống nhờ tình yêu của em dành cho anh."*
  - Dây leo nhỏ bám tường bắt đầu di chuyển nhẹ (animation).
- **Asset cần:** `bg_biodome.png`, `tileset_bio.png`, `prop_mutant_tree.png`

### Room 2-2 tới 2-5: Rừng Acid (Platforming Focus)
- **Layout:** Nhiều platform nhỏ treo trên hồ acid. Cần Dash để qua.
- **Quái:** Crawler trên platform, Spitter bắn từ xa, Leech Vine (E05) treo trần.
- **Sự kiện (Room 2-3):**
  - **Eleanor (lần đầu thấy hồ acid):** *"Cẩn thận acid! Cơ thể Bio-Probe của anh có thể chịu được... nhưng em không muốn anh đau."*
- **Sự kiện (Room 2-4, khi player đi lạc vào ngách ẩn):**
  - **Eleanor (giọng lạnh đi):** *"Anh ơi, chỗ đó không có gì đâu. Quay lại đường chính đi. ...Anh đang nghe em nói chứ?"*
- **Memory Fragment #3 (Room 2-5, sau bức tường phá được bằng Dash):** Nội dung: *"Bản ghi âm: [Tiếng khóc nấc] Lily... con gái bé bỏng của mẹ... Tại sao bọn họ lại cướp con khỏi mẹ? Tại sao? Tai nạn đó... không phải tai nạn. Họ CỐ TÌNH giết con."*
  - **Eleanor (ngay lập tức, giọng hoảng hốt):** *"ĐỪNG! Đừng đọc cái đó! Đó là... dữ liệu bị hỏng. Xóa nó đi anh. Xin anh."*

### Room 2-6: Hang Động Ký Sinh
- **Layout:** Phòng rộng, tối. Dây leo bám kín tường. Bọc trứng nằm rải rác.
- **Quái:** 4x Crawler (từ trứng nở ra khi player đi qua), 2x Leech Vine.
- **Sự kiện (Glitch nhẹ lần đầu):**
  - Khi giết Crawler cuối cùng: Màn hình giật 0.3s. Trong khoảnh khắc đó, hình Crawler biến thành một người mặc đồ bảo hộ y tế đang giơ tay cầu xin (chớp nhoáng, player khó nhận ra).
  - **Eleanor (nhanh chóng):** *"Lỗi hiển thị nhỏ thôi anh. Đừng lo. Chip thần kinh đang tự sửa."*

### Room 2-7: Trạm Lưu Trữ #2
- **Sự kiện:**
  - **Eleanor:** *"Nghỉ ngơi đi anh. Em sẽ hát cho anh nghe... [Tiếng ngâm nhỏ, bị nhiễu sóng giữa chừng]"*

### Room 2-8 tới 2-10: Đầm Lầy Độc (Combat Escalation)
- **Layout:** Địa hình phức tạp hơn. Có moving platform trên acid. Charger (E04) xuất hiện lần đầu.
- **Quái:** Charger + Floater + Spitter combo.
- **Sự kiện (Room 2-9, khi player dùng skill bạo lực liên tục):**
  - **Eleanor (giọng phấn khích bệnh hoạn):** *"Đúng rồi anh! Nghiền nát chúng! Xé chúng ra từng mảnh! ...Em yêu cách anh chiến đấu."*
- **Memory Fragment #4 (Room 2-10):** Nội dung: *"Email nội bộ - [ĐÃ XÓA]: 'Hội đồng đạo đức đã từ chối Dự Án Symbiosis. Tiến sĩ Eleanor bị cấm tiếp cận phòng thí nghiệm. Mẫu vật Subject Zero phải bị tiêu hủy ngay lập tức.' - Đính kèm: Lệnh tiêu hủy ký bởi... [DỮ LIỆU BỊ XÓA BỞI ADMIN_ELEANOR]"*

### Room 2-11: Phòng Boss — Mother Vine (Mini-Boss ACT 2)
- **Boss:** Mother Vine (MB02) - Khối thực vật khổng lồ bám trần.
- **Pattern:**
  1. Vươn 3 dây leo đập xuống sàn (né sang 2 bên).
  2. Phun acid từ trung tâm (Dash xuyên qua).
  3. Triệu hồi 2 Leech Vine phụ.
  4. HP duới 30%: Toàn phòng mưa acid, phải trèo lên platform trên cao để đánh lõi.
- **Thoại trước Boss:**
  - **Eleanor:** *"Sinh vật này... em từng nuôi nó. Nó rất đẹp khi còn nhỏ. Giống như... [im lặng 3 giây] ...Tiêu diệt nó đi."*
- **Thoại sau Boss:**
  - **Eleanor:** *"Anh có nhớ gì không? Về cây cối? Về... khu vườn nhà mình? [Giọng run] Thôi, không quan trọng. Hệ thống Bio-Drill đã kích hoạt. Bấm giữ K để khoan xuyên đất."*
- **Phần thưởng:** Mở khóa Bio-Drill (K ở dạng Bio - dùng để phá sàn mục).
- **Asset cần:** `boss_mother_vine.png` (spritesheet)

---

## 5. ACT 3 — Lưu Trữ Ký Ức (The Archives) ~75 phút

**Tone màu:** Tím neon, đỏ rực, đen tuyền. Hiệu ứng Glitch liên tục.
**Nhạc nền:** Tiếng tĩnh điện, tiếng trẻ con cười vọng xa (creepy), bass trầm rung.
**Eleanor mood:** Hoảng loạn, gắt gỏng, thao túng. Avatar chuyển sang `el_avatar_angry.png` và `el_avatar_glitch.png`.

> **CẢNH BÁO:** ĐÂY LÀ ĐIỂM NÚT THẮT CỐT TRUYỆN.
> Từ đây trở đi, game chuyển tone hoàn toàn từ "Action sci-fi" sang "Psychological horror". UI bắt đầu bị nhiễu, tên quái vật thay đổi.

### Room 3-1: Cổng Kho Lưu Trữ
- **Layout:** Hành lang dài với hàng tá màn hình máy tính hai bên tường, tất cả đều hiện static.
- **Quái:** Không có.
- **Sự kiện:**
  - Khi bước vào: Tất cả màn hình đồng loạt bật sáng, hiện ảnh gia đình cũ (ảnh Zero, Eleanor, Lily, ông bà, anh chị em - tất cả đều tươi cười). Rồi lần lượt tắt đi, chỉ còn ảnh của Eleanor ôm Lily.
  - **Eleanor (giọng run):** *"Anh... đừng vào khu này. Xin anh. Dữ liệu trong đây bị hỏng hết rồi. Không có gì đáng xem đâu. Quay lại đi..."*
  - Player không thể quay lại (cửa khóa sau lưng).

### Room 3-2 tới 3-4: Server Room (Combat + Puzzle)
- **Layout:** Phòng chứa server cao chất ngất. Cần nhảy giữa các tủ server. Laser đỏ chắn ngang (cần dạng Cyber để xuyên qua).
- **Quái:** Cyborg Guard (E06) xuất hiện lần đầu. Mimic Terminal (E07) lần đầu.
- **Sự kiện (Room 3-2):**
  - **GLITCH EVENT LỚN:** Khi giết Cyborg Guard đầu tiên, toàn màn hình giật mạnh 2 giây. Trong lúc giật, hình quái biến thành lính đặc nhiệm mặc giáp SWAT, trên mũ có chữ "RESCUE TEAM ALPHA". Rồi trở lại hình quái.
  - HUD thay đổi: Tên quái từ "Sinh vật đột biến" nhấp nháy thành "...Đặc nhiệm...?" rồi trở lại.
  - **Eleanor (gào lên):** *"CÁI ĐÓ LÀ LỖI! LỖI HIỂN THỊ! ĐỪNG TIN VÀO NÓ! Bọn quái vật đang cố LỪA ANH!"*
- **Memory Fragment #5 (Room 3-3):** Nội dung: *"Bản tin khẩn [Ngày XX/XX]: Đội cứu hộ Delta mất liên lạc sau khi tiến vào tầng B7 của cơ sở Aegis. Nghi ngờ bị Tiến sĩ Eleanor thao túng hệ thống phòng thủ. Cử thêm đội Alpha xuống... [Kết thúc bản tin]"*
  - **Eleanor (giọng nghẹn ngào, cố giữ bình tĩnh):** *"Anh... bản tin đó là giả. Bọn họ tạo ra nó để gây hoang mang. Em không bao giờ làm hại ai cả. Em chỉ muốn bảo vệ anh thôi mà..."*

### Room 3-5: Phòng Ký Ức Gia Đình (Narrative Room - Không chiến đấu)
- **Layout:** Một căn phòng tái hiện phòng khách của gia đình Zero. Sofa, TV cũ, khung ảnh. Nhưng tất cả đều bằng kim loại và dây cáp. Một bản sao méo mó.
- **Quái:** Không có.
- **Sự kiện:**
  - TV tự bật: Chiếu video gia đình cũ (có thể là ảnh tĩnh slide show). Zero thấy chính mình (con người) đang bế Lily, cười đùa bên Eleanor. Bên cạnh là bố mẹ, anh chị em.
  - **Memory Fragment #6 (bắt buộc):** Nội dung: *"[Bản ghi âm cá nhân - Eleanor]: Ngày thảm họa đó... dịch bệnh rò rỉ từ phòng thí nghiệm của tôi. Tôi đã giết tất cả. Ba mẹ anh, ba mẹ tôi, anh chị em... và Lily. Con gái bé bỏng của chúng tôi chết trong vòng tay tôi. Tất cả là lỗi của tôi. TẤT CẢ. Tôi không thể tha thứ cho bản thân... nhưng tôi cũng không thể để mất thêm anh ấy. Anh ấy là người cuối cùng của tôi."*
  - **Eleanor (khóc nấc, giọng vỡ):** *"ĐỪNG NGHE! XIN ANH ĐỪNG NGHE! Em... em không muốn vậy... Lỗi không phải của em... Tại dịch bệnh! Tại họ không nghe lời em! Em chỉ muốn... chỉ muốn không ai rời xa em nữa..."*
  - GLITCH toàn màn hình 5 giây. Khi hết glitch: Toàn bộ UI thay đổi vĩnh viễn. Tên quái trong HUD giờ hiện tên thật ("Đặc nhiệm Alpha", "Đội cứu hộ").

### Room 3-6 tới 3-8: Maze of Regret (Mê cung Hối Hận)
- **Layout:** Mê cung phức tạp. Một số tường giả (đi xuyên được). Eleanor liên tục cố gắng hướng dẫn SAI ĐƯỜNG.
- **Quái:** Cyborg Guard + Floater. Enemy names giờ hiện là tên đội cứu hộ.
- **Sự kiện (Room 3-6):**
  - **Eleanor (cố lấy lại quyền kiểm soát):** *"Rẽ trái anh! PHẢI rẽ trái!"* - Nếu rẽ trái: bẫy. Nếu rẽ phải: đúng đường + Memory Fragment.
- **Memory Fragment #7 (Room 3-7, nếu đi ngược lời Eleanor):** Nội dung: *"Nhật ký kĩ thuật: Chip thần kinh NX-7 có khả năng bóp méo thị giác vật chủ. Hình ảnh thật sẽ bị thay thế bằng hình ảnh do Operator nạp vào. Cảnh báo: Sử dụng kéo dài sẽ gây tổn thương não vĩnh viễn cho vật chủ."*
  - **Eleanor (im lặng 5 giây... rồi thì thầm):** *"...Em làm vậy vì em yêu anh."*

### Room 3-9: Phòng Boss — Archive Keeper (Mini-Boss ACT 3)
- **Boss:** Archive Keeper (MB03) - Robot thư viện bay.
- **Pattern:**
  1. Bắn 3 tia laser song song (nhảy giữa khe).
  2. Triệu hồi 3 Floater cùng lúc.
  3. Tạo shield, chỉ phá được bằng Bio-Drill.
  4. HP duới 30%: Bay lên cao, ném sách laser xuống (random pattern).
- **Thoại sau Boss:**
  - Không có thoại Eleanor. Im lặng hoàn toàn. Chỉ có tiếng tĩnh điện.
  - **Text hiện trên màn hình (kiểu terminal):** *"> DOUBLE_JUMP.exe installed. Neural link... unstable. Subject Zero memory recovery: 78%."*
- **Phần thưởng:** Mở khóa Double Jump.
- **Asset cần:** `boss_archive_keeper.png` (spritesheet)

---

## 6. ACT 4 — Lõi Trung Tâm (The Core) ~60 phút

**Tone màu:** Đỏ máu, đen đặc. Nhịp tim chạy liên tục trên BG.
**Nhạc nền:** Tiếng nhịp tim, dây đàn cello kéo dài, tiếng thở dốc.
**Eleanor mood:** Tuyệt vọng, van xin, rồi điên cuồng. Avatar: `el_avatar_crying.png` rồi `el_avatar_glitch.png`.

### Room 4-1: Hành Lang Máu
- **Layout:** Hành lang hẹp, tường đỏ rực, dây cáp dẫn về phía trước giống mạch máu.
- **Quái:** Không có.
- **Sự kiện:**
  - **Eleanor (giọng yếu ớt, khóc):** *"Anh... anh thật sự muốn đến đó sao? Nếu anh ngắt Lõi... cả hai chúng ta đều sẽ chết. Anh hiểu chứ? Em đã cho anh sự bất tử... Anh đang muốn vứt bỏ nó?"*
  - Nếu player tiếp tục đi: **Eleanor:** *"...Được rồi. Anh muốn đi thì đi. Nhưng em sẽ không để anh đi một mình."*

### Room 4-2 tới 4-4: Heart Chambers (Các buồng Tim)
- **Layout:** 3 phòng hình trái tim, tường co bóp theo nhịp. Platform di chuyển theo nhịp tim.
- **Quái:** Crawler + Cyborg Guard (tên hiện: "Đội cứu hộ cuối cùng"). Đây là kẻ thù cuối cùng. Mọi sprite quái giờ đều chớp nhoáng giữa hình quái và hình người thật.
- **Memory Fragment #8 (Room 4-3, ẩn sau tường phá bằng Bio-Drill):** Nội dung: *"[Tin nhắn thoại - Số điện thoại của Zero]: 'Eleanor... anh biết em đang đau lòng. Anh cũng vậy. Nhưng Lily đã ra đi rồi. Ba mẹ cũng vậy. Anh sắp chết vì bệnh... Hãy để anh đi thanh thản. Đừng làm gì dại dột... Em hứa với anh đi.' [Kết thúc tin nhắn]"*
  - **Eleanor (gào thét):** *"ANH ĐÃ HỨA SẼ Ở BÊN EM! ANH NÓI ANH YÊU EM! TẠI SAO... tại sao anh muốn bỏ em lại một mình?!"*
- **Vật phẩm ẩn — Đồ chơi Lily (Room 4-4):** `lily_toy.png` - Con gấu bông nhỏ nằm trên một bệ thờ. Rất khó tìm (cần Double Jump + Dash + phá tường ẩn). Vật phẩm này quyết định True Ending.

### Room 4-5: Trạm Lưu Trữ Cuối Cùng
- **Sự kiện:**
  - **Eleanor (thì thầm):** *"Đây là cơ hội cuối cùng anh quay lại... Nếu anh bước qua cánh cửa kia... chúng ta sẽ không bao giờ trở lại được nữa."*
  - Save point cuối cùng trước Final Boss.

### Room 4-6: The Sanctuary — Final Boss Arena
- **Layout:** Phòng khổng lồ 5 màn hình rộng. Ở giữa là Lõi Trung Tâm: Một khối máy tính hình trái tim khổng lồ, bên trong có bình thủy tinh chứa thân xác thật của Eleanor.
- **Boss:** Eleanor (3 Phases - xem mục 2)

**PHASE 1 — Hologram Eleanor:**
- Eleanor hologram bay lơ lửng phía trên. Bất tử. 4 cột năng lượng xung quanh bắn laser xoay.
- **Eleanor:** *"Em đã xây dựng tất cả chỉ cho anh. Căn phòng này, cơ thể mới của anh, sự bất tử... TẤT CẢ CHỈ VÌ TÌNH YÊU CỦA EM!"*
- Player phá 4 cột, Hologram vỡ, chuyển Phase 2.

**PHASE 2 — Bio-Mech Eleanor:**
- Thân xác trong bình vỡ ra. Eleanor biến thành quái vật nửa người nửa máy.
- **Eleanor (giọng méo mó, vừa khóc vừa cười):** *"Nếu anh không ở lại với em... thì em sẽ BẮT anh ở lại!"*
- Attack patterns: Đập xúc tu, laser mắt, mưa acid, gào thét gây Glitch.
- **Eleanor (khi HP duới 25%):** *"Anh có nhớ không... ngày cưới của chúng ta? Anh nói... anh sẽ không bao giờ rời xa em... [khóc] Anh nói dối..."*

**PHASE 3 (chỉ khi có Đồ chơi Lily):**
- Eleanor gục xuống. Lõi não bộ lộ ra trong bình thủy tinh.
- **Eleanor (giọng người, trong trẻo, không méo mó nữa):** *"Anh ơi... em mệt lắm rồi... Em nhớ Lily... Em nhớ ba mẹ... Em chỉ muốn gặp lại mọi người thôi..."*
- Player đặt con gấu bông Lily lên bàn tay Eleanor, kích hoạt Cutscene.

---

## 7. Hệ thống Ending

### Bad End — "Vòng Lặp Vĩnh Cửu"
**Điều kiện:** Nhặt duới 5 Memory Fragments.
**Diễn biến:** Sau khi đánh bại Phase 2, Eleanor dùng sức còn lại xóa trí nhớ Zero. Màn hình fade to black. Game restart từ Room 1-1. Zero lại tỉnh dậy. Eleanor lại nói: *"Anh ơi? Anh nghe em nói không?"* Vòng lặp bất tận.
**Text cuối:** *"Tình yêu là nhà tù hoàn hảo nhất. Không có tường, không có khóa. Chỉ có hai trái tim bị xích lại với nhau... mãi mãi."*

### Normal End — "Sự Giải Thoát Tàn Nhẫn"
**Điều kiện:** Nhặt 5 Fragments trở lên, KHÔNG có đồ chơi Lily.
**Diễn biến:** Zero phá bình thủy tinh. Eleanor nhìn anh bằng ánh mắt vừa căm thù vừa yêu thương. *"Anh đã giết em... cũng như em đã giết tất cả mọi người."* Hệ thống sập. Zero sống sót nhưng mắc kẹt dưới lòng đất trong hình hài quái vật, cô độc vĩnh viễn.
**Text cuối:** *"Sự thật đã giải thoát anh khỏi sự điên loạn. Nhưng không ai giải thoát anh khỏi bóng tối."*

### True End — "Requiem (Lễ Cầu Hồn)"
**Điều kiện:** Nhặt 5 Fragments trở lên + Có đồ chơi Lily + KHÔNG bấm Q (hồi máu) trong suốt trận Final Boss.
**Diễn biến:** Zero đặt con gấu bông lên tay Eleanor. Cô ấy khóc, mỉm cười, nói: *"Lily... con gái... mẹ xin lỗi..."* Cô tự tay rút phích cắm hệ thống. Lõi trung tâm sáng rực rỡ, tái tạo hình ảnh hologram của toàn bộ gia đình: Bố mẹ, anh chị em, Lily bé nhỏ. Tất cả đang đứng chờ. Zero và Eleanor nắm tay nhau bước vào ánh sáng. Cơ sở nổ tung. Ánh sáng tắt.
**Text cuối:** *"Có những người yêu nhau đến phát điên. Có những người chết đi chỉ để được ở bên nhau. Đây là câu chuyện tình của họ."*

---

## 8. Tổng hợp Asset cần chuẩn bị

### Backgrounds (Parallax, mỗi cái 3 layer: far, mid, near)
| # | Tên file | Mô tả | ACT |
|---|---|---|---|
| 1 | `bg_quarantine.png` | Phòng thí nghiệm trắng, đèn neon nhấp nháy, giường bệnh | 1 |
| 2 | `bg_biodome.png` | Rừng cây đột biến, dây leo thịt, bồn acid | 2 |
| 3 | `bg_archive.png` | Server room tím/đỏ, hàng tá màn hình nhấp nháy | 3 |
| 4 | `bg_core.png` | Lõi trái tim khổng lồ, dây cáp như mạch máu, đỏ đen | 4 |

### Tilesets (Nền đất/sàn cho từng ACT)
| # | Tên file | Mô tả | ACT |
|---|---|---|---|
| 1 | `tileset_quarantine.png` | Gạch men trắng nứt, sàn kim loại | 1 |
| 2 | `tileset_bio.png` | Đất rêu phong, sàn acid ăn mòn | 2 |
| 3 | `tileset_tech.png` | Sàn lưới điện, nền tím neon | 3 |
| 4 | `tileset_core.png` | Thịt đỏ + kim loại rỉ sét | 4 |

### Eleanor Avatars (Cho hệ thống Dialogue)
| # | Tên file | Mô tả | Khi dùng |
|---|---|---|---|
| 1 | `el_avatar_normal.png` | Dịu dàng, mỉm cười | ACT 1-2 |
| 2 | `el_avatar_worried.png` | Lo lắng, mắt buồn | ACT 2 |
| 3 | `el_avatar_angry.png` | Tức giận, mắt trợn | ACT 3 |
| 4 | `el_avatar_crying.png` | Khóc, mascara chảy | ACT 4 |
| 5 | `el_avatar_glitch.png` | Nhiễu sóng, méo mó | ACT 3-4 |

### Enemy Sprites (Spritesheet: idle 4 frame, attack 4 frame, die 4 frame)
| # | Tên file | Mô tả |
|---|---|---|
| 1 | `enemy_crawler.png` + `_truth.png` | Khối thịt bò / Nhân viên bị thương |
| 2 | `enemy_spitter.png` + `_truth.png` | Bọ phun acid / Lính cầm súng |
| 3 | `enemy_floater.png` + `_truth.png` | Mắt bay / Drone trinh sát |
| 4 | `enemy_charger.png` + `_truth.png` | Sừng húc / Lính giáp xông vào |
| 5 | `enemy_vine.png` | Dây leo hút máu (chỉ ACT 2) |
| 6 | `enemy_cyborg.png` + `_truth.png` | Giáp đỏ / Đặc nhiệm Alpha |
| 7 | `enemy_mimic.png` | Trạm máy tính giả (chỉ ACT 3) |

### Boss Sprites (Spritesheet lớn)
| # | Tên file | Mô tả |
|---|---|---|
| 1 | `boss_warden.png` | Robot an ninh cầm dùi cui (ACT 1) |
| 2 | `boss_mother_vine.png` | Thực vật khổng lồ bám trần (ACT 2) |
| 3 | `boss_archive_keeper.png` | Robot thư viện bay (ACT 3) |
| 4 | `boss_eleanor_hologram.png` | Eleanor váy trắng bay (ACT 4 P1) |
| 5 | `boss_eleanor_biomech.png` | Quái vật nửa người nửa máy (ACT 4 P2) |

### Props và Vật phẩm
| # | Tên file | Mô tả |
|---|---|---|
| 1 | `prop_save_terminal.png` | Trạm lưu trữ (save point) |
| 2 | `prop_broken_bed.png` | Giường bệnh vỡ |
| 3 | `prop_broken_tank.png` | Bồn chứa dung dịch vỡ |
| 4 | `prop_family_photo_torn.png` | Ảnh gia đình bị rách |
| 5 | `prop_memory_fragment.png` | Mảnh ký ức (khối dữ liệu neon) |
| 6 | `lily_photo.png` | Ảnh Lily (con gái) |
| 7 | `lily_toy.png` | Con gấu bông (vật phẩm True End) |

### Âm thanh và Nhạc nền
| # | Tên file | Mô tả |
|---|---|---|
| 1 | `bgm_quarantine.mp3` | Ambient rùng rợn + máy thở |
| 2 | `bgm_biodome.mp3` | Côn trùng + nước sôi + organic |
| 3 | `bgm_archive.mp3` | Tĩnh điện + trẻ con cười + bass |
| 4 | `bgm_core.mp3` | Nhịp tim + cello + thở dốc |
| 5 | `bgm_boss.mp3` | Epic orchestral + tiếng khóc |
| 6 | `sfx_glitch.mp3` | Hiệu ứng giật màn hình |
| 7 | `sfx_memory_pickup.mp3` | Nhặt mảnh ký ức |
| 8 | `sfx_eleanor_laugh.mp3` | Tiếng cười Eleanor |
| 9 | `sfx_eleanor_cry.mp3` | Tiếng khóc Eleanor |
