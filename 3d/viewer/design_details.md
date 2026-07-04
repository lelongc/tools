# CHI TIẾT THIẾT KẾ: KỸ NĂNG - MÀN CHƠI - GIAO DIỆN
**Tài liệu Mở rộng (Game Design Deep Dive)**

Tài liệu này đi sâu vào **triết lý thiết kế (Design Philosophy)** và **thông số kỹ thuật** để đảm bảo game chơi mượt, cuốn hút và đạt chuẩn chuyên nghiệp.

---

## PHẦN 1: THIẾT KẾ KỸ NĂNG & CẢM GIÁC CHIẾN ĐẤU (COMBAT & SKILL DESIGN)

Triết lý: *Nhanh, Uy lực, Rủi ro cao - Phần thưởng lớn.* Không có đòn đánh nào là vô dụng.

### 1. Nguyên tắc Hit-Stop & Screen Shake (The "Juice")
- **Hit-Stop (Dừng khung hình):** Bất cứ khi nào đòn đánh (kể cả đánh thường) trúng mục tiêu, toàn bộ game (trừ hiệu ứng hạt) sẽ bị đóng băng (Time scale = 0) trong khoảng **0.05 giây**. Nếu trúng đòn chí mạng hoặc Skill lớn, đóng băng **0.1 giây**. Điều này tạo cảm giác vũ khí thực sự "cắt" vào vật thể cứng, giống hệt Hollow Knight hay Dead Cells.
- **Screen Shake (Rung màn hình):** Chỉ áp dụng nhẹ với đòn thường. Rung mạnh theo trục dọc (Y) với đòn Ground Smash, rung mạnh theo trục ngang (X) với Dash Laser.

### 2. Chi tiết các Kỹ năng Cốt lõi
* **Đánh Thường (Laser Blade - Phím J):**
  - Hitbox: Hình bán nguyệt, bao phủ góc 180 độ phía trước nhân vật, với ra một chút phía sau lưng (để đánh trúng quái bám đuôi sát sàn sạt).
  - Khung hình (Frame Data): Ra đòn siêu nhanh (0.1s), Gây sát thương (0.15s), Thu hồi vung kiếm (0.2s). 
  - Tính năng: Bạn có thể vừa đi vừa chém, hoặc vừa nhảy vừa chém mà không bị khựng lại (Movement fluidity).

* **Pogo Strike (Chém Xuống - S + J trên không):**
  - Hitbox: Bán nguyệt hướng xuống dưới. Rộng hơn hitbox của chân nhân vật để dễ trúng.
  - Tương tác: Khi va chạm với Hitbox của quái hoặc vật thể đàn hồi, lập tức gán Vận tốc Y của nhân vật `vy = -600` (Nảy vút lên). Hồi lại trạng thái "Dash" và "Double Jump" để người chơi có thể tiếp tục combo trên không, không bao giờ chạm đất.

* **Reboot (Hồi Máu Phản Công - Bấm Q):**
  - Yêu cầu: Tiêu hao 50% thanh Overdrive.
  - Hiệu ứng: Nhân vật phát sáng chói lóa trong 0.2 giây. Hồi 1 Lõi Máu. Tỏa ra luồng sóng xung kích đẩy lùi (Knockback) mọi quái vật xung quanh trong bán kính 200px để tạo khoảng trống an toàn.

* **Magnetic Grapple (Dây Móc Điện Từ - Cần Mở Khóa):**
  - Aiming: Tự động khóa mục tiêu (Auto-aim) vào kẻ địch hoặc điểm neo (Grapple Point) gần nhất phía trước.
  - Phản hồi: Khi móc trúng, nhân vật biến thành vệt sáng lao vút tới mục tiêu với tốc độ x3, đòn chém kế tiếp ngay sau đó sẽ tự động thành **Chém Bạo Kích (Crit Strike)**.

---

## PHẦN 2: THIẾT KẾ MÀN CHƠI (METROIDVANIA LEVEL DESIGN)

Triết lý: *Tò mò được đền đáp, Sai lầm bị trừng phạt, Không bao giờ bị lạc lối vô vọng.*

### 1. Cấu trúc Vòng Lặp (The Level Loop)
Thiết kế màn chơi Metroidvania luôn tuân theo quy tắc: **Tease -> Gate -> Reward -> Return**.
- **Tease (Nhử mồi):** Bạn cho người chơi thấy một vật phẩm hoặc đường đi hấp dẫn, nhưng nằm sau một rào cản (ví dụ: một bức tường nứt cản đường).
- **Gate (Chặn lại):** Người chơi không thể qua được lúc này, bắt buộc phải đi hướng khác. Họ sẽ ghi nhớ vị trí này trong đầu (hoặc trên Map).
- **Reward (Phần thưởng):** Sau một chặng đường dài đánh Boss, người chơi nhận được kỹ năng mới (ví dụ: Ground Smash đập đất).
- **Return (Quay lại):** Người chơi mừng rỡ quay lại bức tường nứt ban nãy, dùng Ground Smash phá vỡ nó, mở ra khu vực hoàn toàn mới hoặc Lối Tắt (Shortcut) về khu vực cũ.

### 2. Thiết kế Căn Phòng (Room Design)
- **Safe Room (Phòng Lưu Trữ):** Chỉ có một Trạm Save (Terminal), không có quái. Nhạc nền (BGM) trầm xuống, êm dịu. Ánh sáng ấm (Cam/Vàng) trái ngược với ánh sáng lạnh (Xanh/Đỏ) của khu vực bên ngoài. Nơi để thay thế Mô-đun.
- **Gauntlet Room (Phòng Tử Chiến):** Vừa bước vào, cửa hai đầu đóng sập lại. Chừng nào chưa diệt hết 3 đợt (Waves) quái vật, cửa sẽ không mở.
- **Platforming Room:** Quái vật cực yếu hoặc không có. Thử thách chính là Vực Acid, Gai nhọn, Laser xoay và các Điểm Neo. Người chơi phải kết hợp `Dash`, `Grapple`, và `Pogo Strike` liên tục. Chạm gai bị trừ 1 máu và dịch chuyển về đầu căn phòng.

### 3. Nguyên tắc Đặt Checkpoint
- Đặt Checkpoint ở rất gần trước phòng Boss (Để người chơi không phải ức chế đi bộ lại 5 phút mỗi lần chết, khuyến khích thử thách nhiều lần).
- Khoảng cách Checkpoint sẽ rất thưa thớt ở các khu vực khám phá thông thường (Để tạo cảm giác rủi ro, sợ hãi, sinh tồn khi máu đang cạn dần).

---

## PHẦN 3: THIẾT KẾ GIAO DIỆN (UI & UX DESIGN)

Triết lý: *Tối giản, Sang trọng (Premium), Hòa nhập vào thế giới game (Diegetic).*

### 1. HUD Chính (Heads-Up Display)
Góc trên cùng bên trái màn hình:
* **Máu (Health Cores):** Không dùng thanh ngang (Bar). Dùng các **Biểu tượng Lõi Điện Tử (Hexagons)**. Sáng đèn (Neon Cyan) là còn máu, Vỡ nát (Tối xỉn mờ) là mất máu. Khi còn đúng 1 máu, viền màn hình sẽ đập nhịp đỏ nhẹ (Vignette cảnh báo tử vong).
* **Overdrive Bar (Thanh Nhiệt/Mana):** Một đường chỉ Neon cong lượn ngay sát bên dưới các Lõi Máu. Khi thanh này vượt mức 50%, nó bắt đầu tỏa sáng rực rỡ và sủi các hạt tia lửa điện liti ra xung quanh, báo hiệu trạng thái bùa lợi *Neon Surge* đã kích hoạt.
* **Currency (Memory Fragments):** Hiển thị số lượng (Ví dụ: 3,450) ở góc trên bên phải. Khi đánh quái rớt tiền, UI số tiền sẽ nhấp nháy và nhảy cuộn lên (Roll up animation) chứ không cộng ngay lập tức, tạo cảm giác "thu thập" thích mắt.

### 2. Phản hồi sát thương (Damage Feedback)
- **Không lạm dụng Số Sát Thương (Damage Text):** Một con game hành động màn hình ngang điện ảnh không nên hiện quá nhiều số rác màn hình (Trừ phi bạo kích - Crit).
- **Flash Trắng:** Khi quái trúng đòn, sprite của quái chớp nháy trắng (White Flash) đúng 1 khung hình.
- **Báo hiệu máu yếu:** Khi máu quái dưới 20%, quái bắt đầu bốc khói đen hoặc tóe tia lửa điện chập chờn (Dấu hiệu trực quan thay cho thanh máu). Quái vật nhỏ KHÔNG CÓ thanh máu trên đầu.
- **Thanh Máu Boss:** Đặt chình ình ở giữa cạnh dưới màn hình, to, dài, phong cách Boss của Dark Souls/Hollow Knight để tạo áp lực khổng lồ.

### 3. Các Bảng Menu (In-Game Menus)
- Cảm giác **Glitchy & Cyberpunk**: Khi mở Inventory hoặc Map, màn hình xé rách nhẹ bằng hiệu ứng Chromatic Aberration 0.1s, đi kèm âm thanh nhiễu sóng tĩnh điện (Static Noise).
- Mọi Menu đều là **Trong suốt (Glassmorphism)** với background phía sau bị làm mờ cực mạnh (Heavy Blur), giữ cho người chơi không bị thoát ly khỏi bầu không khí đang căng thẳng của game.
