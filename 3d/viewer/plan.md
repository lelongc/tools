 ở ![1783143865622](image/plan/1783143865622.png)

![1783143865622](image/plan/1783143865622.png)

# 🚀 BẢN THIẾT KẾ TRÒ CHƠI (GAME DESIGN DOCUMENT)

**Dự án:** [Tên Dự Kiến: NEON SYNAPSE / BIO-CORE PROTOCOL]
**Thể loại:** 2D Action-Platformer / Metroidvania (Mang linh hồn của Hollow Knight nhưng bối cảnh Sci-fi Bio-Punk)

---

## 1. CỐT TRUYỆN VÀ THẾ GIỚI (LORE & ATMOSPHERE)

**Cảm hứng từ Hollow Knight & Psychological Horror:** Cảm giác cô độc trong một cơ sở ngầm tàn lụi, những câu chuyện được kể qua cảnh vật (Environmental Storytelling) kết hợp với yếu tố kinh dị tâm lý tội phạm.

* **Bối cảnh (The World):** Bạn tỉnh dậy sâu bên trong **"The Macro-Organism"** - một khu phức hợp phòng thí nghiệm y sinh học dưới lòng đất. Nơi đây từng là hy vọng cứu chữa nhân loại, nhưng giờ đã biến thành một nhà tù của sự điên loạn.
* **Nhân vật chính (The Protagonist):** Bạn là một người đàn ông mắc bệnh nan y sắp chết. Nhưng vợ bạn, Tiến sĩ Eleanor, vì không chịu đựng nổi cú sốc mất ĐI TOÀN BỘ gia đình trong một thảm kịch trước đó, đã biến bạn thành **Bio-Probe** (Một cỗ máy sinh học bất tử) để cô ấy không phải cô độc. Bạn mất hoàn toàn trí nhớ lúc đầu.
* **Kẻ thù và Mối đe dọa (The Illusion):** Những sinh vật bạn tiêu diệt thực chất là đội cứu hộ, người thân hoặc nỗ lực của chính hệ thống nhằm giải thoát bạn, nhưng Eleanor đã thao túng thần kinh để bạn nhìn thấy họ như những con quái vật đột biến tởm lợm.
* **Mục tiêu:** Nhặt lại các mảnh ký ức (Memory Fragments), nhận ra sự thật cay đắng, tiến vào "Lõi Trung Tâm" (Central Core) để ngắt nguồn hệ thống, tự kết liễu sự bất tử và giải thoát cho người vợ điên loạn của mình.

---

## 2. CƠ CHẾ GAMEPLAY LÕI: SỰ KHÁC BIỆT (THE "NOT-A-CLONE" FACTOR)

Để tránh bị gọi là "Bản nhái Hollow Knight", chúng ta giữ lại **cấu trúc khám phá (Metroidvania)** nhưng thay đổi hoàn toàn **Nhịp độ chiến đấu (Combat Flow)**. Game của chúng ta sẽ dồn dập, bạo lực và cơ động hơn rất nhiều:

### A. Hệ Thống Nhiệt Năng (Overdrive / Heat System thay cho Soul)

* Ở HK, bạn chém quái để lấy năng lượng xài phép. Ở game này, bạn có một thanh **Overdrive (Quá Tải)**.
* Mỗi khi bạn chém trúng địch, thanh Overdrive sẽ tăng lên. Khi thanh này đạt mức cao (Trên 50%), bạn bước vào trạng thái **"Neon Surge"**: Tốc độ đánh, tốc độ chạy tăng 30%, và đòn chém tạo ra kiếm khí bắn xa.
* **Đánh đổi:** Các kỹ năng siêu mạnh (Laser K, Ground Smash) sẽ **tiêu thụ toàn bộ thanh Overdrive**.
* **Hồi máu (Reboot):** Thay vì đứng yên gồng máu như HK, bạn có thể bấm phím Q để tiêu thụ 50% Overdrive và tạo ra một vụ nổ nhỏ đẩy lùi địch, đồng thời hồi 1 Lõi Máu. Đậm chất hành động không ngắt nhịp!

### B. Chuyển Động Điện Từ (Magnetic Tether & Grapple)

* HK nổi tiếng với trò Pogo (chém xuống nảy lên). Chúng ta VẪN GIỮ Pogo, nhưng bổ sung thêm **Magnetic Tether (Dây Móc Điện Từ)**.
* Bạn có thể phóng dây móc vào tường, trần nhà hoặc **kéo bản thân lao thẳng vào kẻ địch** từ khoảng cách xa. Khả năng không chiến (Aerial Combat) của game sẽ đa dạng hơn HK rất nhiều, tạo ra các pha combo bay lượn trên không trung cực kỳ đẹp mắt.

### C. Cơ Chế Chuyển Dạng (Bio & Cyber Phase)

* Bạn là một thực thể lai. Bằng một nút bấm (Ví dụ phím C), bạn đổi giữa 2 form:
  - **Bio-Form (Màu Xanh Lá - Acid):** Chém chậm, sát thương diện rộng, kháng đòn tốt. Có thể đập vỡ đá.
  - **Cyber-Form (Màu Xanh Dương - Neon):** Chém siêu tốc, lướt nhanh, có thể đi xuyên qua các bức tường laser. Bị nhận thêm sát thương.
* Việc đổi Form liên tục để giải đố và đánh Boss sẽ là điểm nhấn ĐỘC QUYỀN của tựa game này.

### B. Hệ thống Chuyển động (Metroidvania Movement)

* **Tight Controls:** Cảm giác điều khiển phải sắc bén, dừng lại ngay khi thả phím, hitbox cực kỳ chính xác.
* **Pogo Strike (Chém Cắm Xuống):** Khi đang nhảy, ấn `S + J` (Đánh xuống). Nếu chém trúng kẻ địch, gai nhọn, hoặc vật thể nảy, bạn sẽ bị nảy ngược lên không trung. Kỹ năng này cho phép bạn "nhảy lò cò" trên đầu kẻ địch để qua các hồ Acid khổng lồ (Core mechanic không thể thiếu của HK).
* **Kỹ năng mở rộng bản đồ (Abilities):** Bắt đầu game bạn chỉ biết đi và chém. Dần dần khi đánh bại Boss, bạn sẽ nhận được các Mô-đun nâng cấp mở đường:
  1. *Plasma Dash (Tương đương Mothwing Cloak).*
  2. *Magnetic Claws (Bám tường / Mantis Claw).*
  3. *Bio-Drill (Đập đất phá đá / Desolate Dive).*
  4. *Wings (Double Jump / Monarch Wings).*

### C. Cơ chế Trừng Phạt (Death & Penalty)

* **Memory Fragments (Tiền tệ):** Đánh bại kẻ địch rớt ra các mảnh dữ liệu. Dùng để mua Mô-đun (giống Geo).
* **Khi tử nạn:** Bạn hồi sinh tại Trạm Lưu Trữ (Save Terminal) gần nhất. Bạn sẽ đánh rơi toàn bộ số "Memory Fragments" và 1/3 thanh Năng Lượng Tối Đa.
* **Bóng Ma Dữ Liệu (The Echo / Shade):** Tại nơi bạn chết, một bản sao bóng tối của bạn (The Echo) sẽ xuất hiện. Bạn phải quay lại đó, đánh bại chính bản sao của mình để lấy lại tiền và năng lượng.

---

## 3. HỆ THỐNG KỸ NĂNG VÀ COMBAT HIỆN TẠI (Tích hợp)

* **[Phím J] Laser Blade (Nail):** Đòn đánh thường 3 nhịp. Tầm vung kiếm (hitbox) rộng hình vòng cung, chém nhanh, uy lực, có đẩy lùi địch để giữ khoảng cách.
* **[S + J] Pogo Strike:** Đòn đánh từ trên không xuống. Rất cần thiết cho Platforming.
* **[Phím K] Plasma Dash (Skill):** Gồng năng lượng và lướt qua kẻ địch. Nếu trúng địch, bắn ra tia Laser khổng lồ xuyên thấu bản đồ. Sát thương trung bình, nhưng có thể lướt qua đòn đánh của địch (i-frames).
* **[Phím L] Lightning Nova (Spell):** Tiêu hao Core Charge. Gồng và giải phóng một vụ nổ sóng điện từ (EMP) hình tròn, gây sát thương cực lớn xung quanh.
* **[W + I] Rising Blast:** Đánh hất tung kẻ địch lên không (Juggle).
* **[W + J / S + L] Ground Smash (Spell):** Tiêu hao Core Charge. Lao vút lên không và giáng đòn sập đất, tạo ra luồng sóng xung kích màu Cyan tiêu diệt địch 2 bên. Dùng để phá vỡ các mặt sàn mục nát để xuống các khu vực bí mật.

---

## 4. HỆ THỐNG NÂNG CẤP (Tương đương "Charms")

* **System Modules (Mô-đun Hệ Thống):** Bạn có một "Bo mạch chủ" (Motherboard) với số "Khe cắm" (Slots) hạn chế (giống Charm Notches).
* Tại các Trạm Lưu Trữ (Băng ghế/Save point), bạn có thể tháo lắp các Mô-đun để thay đổi lối chơi tùy vào tình huống:
  * *Vampire Code:* Hồi nhiều Core Charge hơn từ đòn đánh. (Chiếm 2 Slots).
  * *Thorns Overload:* Bắn ra tia điện khi bị nhận sát thương. (Chiếm 1 Slot).
  * *Longnail Extension:* Kéo dài tầm chém của vũ khí. (Chiếm 2 Slots).
  * *Dashmaster Chip:* Giảm Cooldown của kỹ năng lướt (K), cho phép lướt nhanh hơn. (Chiếm 2 Slots).

---

## 5. KẾ HOẠCH PHÁT TRIỂN TIẾP THEO (ROADMAP)

### Giai đoạn 1: Hoàn thiện Core Feel (Trải nghiệm Điều khiển)

- Tinh chỉnh `Pogo Strike`: Lập trình logic để khi đòn chém chĩa xuống (S+J) quét trúng hitbox của quái vật hoặc vật thể đặc biệt, `vy` của nhân vật bị ép ngay thành `-600` (Nảy vút lên).
- Hit-stop (Juice): Khi chém trúng quái vật, đóng băng cả hai (player và quái) trong khoảng `0.05s` để đòn đánh có sức nặng. Lùi quái vật về sau một chút (Knockback).

### Giai đoạn 2: Thiết kế Quái vật & AI

- **Swarmer (Crawler):** Quái bò dưới mặt đất, tốc độ chậm. Hành vi: đi tuần tra, đụng tường thì quay lại.
- **Turret (Flyer):** Bay lơ lửng, khi người chơi vào tầm nhìn sẽ bắn đạn theo chu kỳ.
- **Charger (Husk):** Phóng thẳng về phía người chơi với tốc độ cao khi phát hiện mục tiêu. Cần lướt (Dash) để né và chém từ phía sau.

### Giai đoạn 3: Metroidvania Level Design (Thiết kế Màn Chơi Liên Kết)

- Bỏ khái niệm qua màn (Stage 1, Stage 2). Toàn bộ game là 1 màn chơi khổng lồ được chia thành các Room (Phòng).
- Khi đi hết biên (Edge) của một phòng, camera chuyển cảnh sang phòng tiếp theo.
- Tạo những lối đi bị chặn (Blockers) yêu cầu phải có kỹ năng mới để qua:
  * Bức tường đất nứt gãy -> Cần `Ground Smash`.
  * Hố Acid siêu dài -> Cần `Dash` hoặc nhảy `Pogo` trên các con quái bay lơ lửng để qua bờ bên kia.

### Giai đoạn 4: UI & Đánh Bóng (Polish)

- Thay đổi thanh máu thành dạng UI biểu tượng (Lõi năng lượng). Ví dụ: 5 Lõi. Trúng đòn mất 1 Lõi. Rất dễ nhìn và tạo căng thẳng.
- UI Core Charge: Một bình chứa (Vial) bên góc màn hình, dâng nước từ từ khi chém trúng địch, và nhấp nháy khi đủ mana xài phép.

---

## 6. CỐT TRUYỆN: DỰ ÁN SYMBIOSIS (VÒNG LẶP BI KỊCH CỦA TÌNH YÊU)

**Thời lượng dự kiến:** 4 tiếng chơi chính, 5 tiếng khám phá 100%.
**Định hướng:** Dark Sci-fi, Biopunk, Psychological Horror. Tình yêu mù quáng, nỗi đau mất mát và sự giải thoát.

* **Bối cảnh (Aegis Abyss):** Cơ sở nghiên cứu khổng lồ dưới lòng đất. Không còn con người bình thường sống sót, chỉ có các sinh vật đột biến và hệ thống an ninh hóa điên.
* **Nhân vật chính (Zero - Người Chồng):** Bị lai tạp giữa máy (Dạng Cyber) và quái vật sinh học (Dạng Bio). Tỉnh dậy mất trí nhớ, cơ thể không còn nhân dạng con người.
* **Nữ chính Yandere (Tiến sĩ Eleanor / "El" - Người Vợ):** Người vợ thiên tài của Zero. Cô liên lạc với bạn qua chip não bộ. Giọng điệu của cô vô cùng yêu thương, bảo bọc, luôn gọi bạn là "Mình ơi" hoặc "Anh yêu". 

**Các Plot Twist (Nút Thắt Câu Chuyện):**
1. **Bi kịch gia đình:** Qua các mảnh ký ức rải rác, bạn nhận ra Eleanor đã từng mất tất cả: Cha mẹ, người thân, và đặc biệt là **đứa con gái bé bỏng** của hai người trong một thảm họa trên mặt đất. Cú sốc đó khiến tâm trí cô rạn nứt.
2. **Sự bất tử điên rồ:** Chẳng bao lâu sau, bạn (người chồng) cũng mắc bạo bệnh và sắp chết. Hoảng loạn vì sợ mất đi người cuối cùng trên đời, Eleanor đã đưa bạn xuống phòng thí nghiệm bí mật. Cô ta dùng mọi công nghệ cấm (sinh học lai máy móc) để biến bạn thành một cỗ máy quái vật bất tử. Cô sẵn sàng nhốt bạn dưới lòng đất mãi mãi chỉ để "bảo vệ" bạn.
3. **Ảo giác tàn khốc:** Những "quái vật" mà bạn đang xé xác từ đầu game thực chất là Lực lượng Đặc nhiệm Cứu hộ được cử xuống để giải cứu bạn và ngăn chặn Eleanor. Con chip của cô ấy đã hack hệ thống thần kinh của bạn, bóp méo hình ảnh họ thành quái vật để bạn tự tay giết những người đến cứu mình.
4. **Mục đích của hành trình:** Khi nhận ra sự thật, hành trình của bạn không phải là "chạy trốn" nữa, mà là **giải thoát cho vợ mình** khỏi sự điên loạn và kết thúc chuỗi bi kịch đau đớn này.

**Kết cục (Endings):**
- **Bad End (Không tìm đủ mảnh ghép ký ức):** Bạn cam chịu số phận, ngoan ngoãn đi xuống tầng hầm sâu nhất (The Sanctuary). Cánh cửa đóng sầm lại. Bạn chấp nhận làm một con quái vật vô hồn sống trong lồng kính, để Eleanor mãi mãi mỉm cười vuốt ve bạn trong bóng tối.
- **Normal End:** Bạn phá hủy hệ thống, giết chết Eleanor để chấm dứt sự điên loạn. Cơ thể bạn cũng gục ngã vì mất đi năng lượng duy trì từ hệ thống của cô ấy.
- **True End (Khám phá 100% bản đồ & Lấy được món đồ chơi của con gái):** Bạn đối mặt với Eleanor (Final Boss Fight) lúc này đã tiêm virus biến thành quái vật khổng lồ vì tuyệt vọng. Sau khi đánh bại cô, bạn dùng món đồ chơi của con gái để thức tỉnh chút nhân tính cuối cùng trong cô. Eleanor khóc, xin lỗi và tự tay ngắt kết nối sự sống của cả hai. Hai vợ chồng nắm tay nhau ra đi trong đống đổ nát, linh hồn được giải thoát và đoàn tụ cùng con gái.

---

## 7. DANH SÁCH TÀI NGUYÊN (ASSET REQUIREMENTS) CẦN THIẾT

Để tạo hình cốt truyện này và thu hút người chơi (với hình tượng Yandere 2 dạng), dưới đây là danh sách các ảnh/Sprite cần chuẩn bị. Hãy dùng AI hoặc tự vẽ các tài nguyên này:

### A. Nhân Vật Nữ Chính Yandere (Eleanor)
*Để thu hút người chơi (đặc biệt là phái nam), dạng Người (Human Form) cần phải rất xinh đẹp, phong cách anime sắc sảo nhưng ánh mắt có phần vô hồn, ám ảnh. Dạng Quái (Monster Form) thì mang nét kinh dị sinh học (Biopunk/Body Horror).*

1. **Avatar Hội Thoại (Human Form - Dạng người):**
   - *Mô tả:* Chân dung (Portrait) một nữ khoa học gia trẻ tuổi, mặc áo blouse trắng xộc xệch hoặc đồ bó sát công nghệ. Tóc dài rối màu trắng hoặc xanh nhạt. Khuôn mặt anime xinh đẹp, ánh mắt sâu thẳm, có thể có chút máu vương trên má. Nụ cười mỉm dịu dàng nhưng đáng sợ.
   - *Kích thước:* 512x512 hoặc lớn hơn (Hình vuông có nền trong suốt, PNG).
2. **Avatar Hội Thoại (Glitch Form - Khi tức giận):**
   - *Mô tả:* Cùng một góc mặt như trên, nhưng ánh mắt trợn trừng điên loạn, con ngươi thu nhỏ, nụ cười méo mó. Hình ảnh có hiệu ứng giật nhiễu (Glitch) đỏ rực.
3. **Sprite Boss Cuối (Monster Form - Nữ Chúa Biopunk):**
   - *Mô tả:* Sprite khổng lồ (kích thước gấp 4 lần nhân vật chính). Nửa trên vẫn giữ lại khuôn mặt và phần thân trên xinh đẹp của Eleanor (có thể bị rách rưới nứt nẻ lòi cả lõi máy), nhưng từ hông trở xuống là một khối nhầy nhụa xúc tu sinh học màu xanh lục kết hợp với các chi tiết kim loại gỉ sét màu đỏ.
   - *Animation cần:* Idle (Thở dốc), Đập xúc tu (Attack 1), Bắn Laser từ mắt (Attack 2), Chết (Tan chảy).

### B. Môi trường & Giao diện (UI & Backgrounds)
1. **Khung Chat Hội Thoại (Dialogue Box):**
   - *Mô tả:* Một dải nền UI màu đen bán trong suốt, viền màu Cyan neon (phong cách Cyberpunk) hoặc gỉ sét. Để text chạy bên trong.
2. **Background - Khu Lưu Trữ (Memory Fragment Background):**
   - *Mô tả:* Các mảnh giấy hoặc băng ghi âm dính máu.
3. **Background - "The Sanctuary" (Phòng Boss Cuối):**
   - *Mô tả:* Tầng hầm sâu nhất. Trông giống một căn phòng tân hôn điên rồ: Vừa có giường ngủ, nến, vừa có hàng ngàn dây cáp cắm vào tường, bình chứa dung dịch ngâm nội tạng, bệ thờ tôn giáo lai tạp máy móc. Tông màu đỏ tối (Dark Red) và Đen.

### C. Quái vật (Kẻ thù) - Cần 2 phiên bản
*Do tính chất ảo giác, chúng ta cần 2 set quái vật. Khi người chơi chưa biết sự thật, nó là quái vật. Khi UI bị nhiễu sóng (glitch), nó lộ ra hình dạng thật chớp nhoáng.*

1. **Enemy Set 1 (Quái Vật Đột Biến - Ảo Giác):**
   - Dáng đi khom lưng, toàn thân là khối thịt nhầy nhụa hoặc lắp ghép với lưỡi cưa máy. Trông rùng rợn.
2. **Enemy Set 2 (Đội Cứu Hộ - Sự thật):**
   - Sprite chớp nhoáng (Glitch sprite). Hình dáng giống hệt các binh lính đặc nhiệm mặc giáp bảo hộ (Hazmat suit) hoặc giáp SWAT tương lai, cầm súng chĩa vào bạn. Dáng đi của Set 1 sẽ khớp với hình dáng này, tạo cảm giác họ đang giơ súng chống cự chứ không phải vồ lấy bạn.

*(Nếu bạn không có các Sprite này, hãy cho tôi biết, tôi có thể cung cấp đoạn mã để tạo khối vuông giả lập (placeholder) hoặc dùng công cụ sinh ảnh AI `generate_image` nếu hệ thống cho phép).*
