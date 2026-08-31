# 🩸 THE BLEEDING COMB: OBSCURE RESURRECTION
## BẢN HỒ SƠ THIẾT KẾ GAME TOÀN TẬP (GAME DESIGN DOCUMENT - GDD)
> **Thể loại:** 2D Dark Fantasy Action Metroidvania / Psychological Roguelite  
> **Nền tảng mục tiêu:** PC (Steam, Itch.io), Mobile (Google Play, Apple App Store), Console (Nintendo Switch)  
> **Thời lượng trải nghiệm:** 8 – 12 giờ chơi cốt truyện + 4 giờ khám phá Secret Endings / New Game+  
> **Phong cách đồ họa:** 16-Bit Crimson Gothic Pixel Art, Rich 4-Layer Parallax, Living Interactive Ecosystem  
> **Engine phát triển:** Godot Engine 4.x (Tối ưu hóa đa nền tảng PC & Mobile mượt mà 60 FPS)

---

```
                                  [THE BLEEDING COMB]
                                          │
    ┌──────────────────────┬──────────────┴──────────────┬──────────────────────┐
    ▼                      ▼                             ▼                      ▼
[CỐT TRUYỆN ĐIỆN ẢNH]  [RETURN BY DEATH]         [COMBAT & MIND FREEZE]  [5 BIOMES & PUZZLES]
- 4 Chương kịch tính   - Mất ký ức khi chết       - Ngưng đọng 0.3s-0.8s  - Đố bằng Tiếng Gáy
- 3 Cú bẻ lái chấn động - Đấu lại Boss biến dạng  - Pogo đạp cựa 4 hướng  - Nấm đàn hồi, bẫy tơ
- 3 Kết thúc bi tráng  - Hồn vợ là sinh mệnh     - Dash bóng mờ lướt gió - Checkpoint Ghế Đá
```

---

## 💎 PHẦN 1: ĐÁNH GIÁ TÍNH KHẢ THI THƯƠNG MẠI (COMMERCIAL FEASIBILITY)

### 1. Tại sao con game này HOÀN TOÀN KHẢ THI và CÓ TIỀM NĂNG THÀNH CÔNG RẤT CAO?
1. **Sự Kết Hợp Độc Lạ (Unique Hook & Viral Potential):**
   * Người chơi đã quá quen với hiệp sĩ côn trùng (*Hollow Knight*), thợ săn quỷ (*Blasphemous*), hoặc cô gái tóc đỏ (*Celeste*).
   * **Hình tượng Chiến Kê Lão Tướng (Gallus)** với đôi cựa sắt gỉ máu, bảo vệ bạn đời và con cái mang lại sự tò mò cực lớn. Trên các nền tảng mạng xã hội (TikTok, Reddit r/gaming, Twitter/X, YouTube), một đoạn clip chú gà tung cú đá cựa Pogo trên đầu Boss khổng lồ kèm hiệu ứng tua ngược thời gian sẽ tạo hiệu ứng lan truyền (viral) tự nhiên cực mạnh mà không tốn nhiều chi phí marketing.
2. **Cơ Chế Khắc Nghiệt Nhưng Đầy Tính Thử Thách (High Replayability):**
   * Cơ chế **"Ngưng đọng tâm trí khi máu dưới 25%"** và **"Đấu lại Boss cũ biến dạng để chuộc ký ức"** tạo nên độ khó gây nghiện tương tự dòng game *Souls-like* và *Roguelite*, kích thích các Streamer và Game thủ Hardcore thi đấu phá đảo (Speedrun / No-Hit Run).
3. **Mô Hình Bán Hàng Đa Nền Tảng (Cross-Platform Monetization):**
   * **Steam & Itch.io (PC):** Định giá **$9.99 – $14.99** (Phù hợp chuẩn game Indie quốc tế). Tham gia sự kiện *Steam Next Fest* với bản Demo 1 Chapter.
   * **Apple App Store & Google Play (Mobile):** 
     * *Mô hình 1:* Trả phí trực tiếp **$4.99 – $6.99** (Premium Indie tương tự *Dead Cells*, *Huntdown*).
     * *Mô hình 2 (Freemium thông minh):* Cho chơi miễn phí Chương 1 ➔ Mở khóa trọn bộ game vĩnh viễn với $4.99 In-App Purchase (IAP).
   * **Nintendo Switch:** Định giá **$14.99** (Thị trường Metroidvania trên Switch cực kỳ màu mỡ).

---

## 📜 PHẦN 2: CỐT TRUYỆN ĐẦY ĐỦ & LOGIC 4 CHƯƠNG (NARRATIVE DESIGN)

### 🕯️ Nhân Vật Chính & Nhân Vật Phụ
* **Gallus (Chiến Kê Lão Tướng):** Một chiến binh gà mang vết sẹo chém đứt nửa chiếc mào đỏ, đôi cựa sắt gỉ sét đã gác kiếm sau nhiều năm đẫm máu để lui về sống ẩn dật.
* **Sari (Bạn Đời Của Gallus):** Nàng gà mái mù màu dịu dàng, sở hữu tiếng gáy ru êm đềm có thể xoa dịu mọi vết thương tâm hồn.
* **3 Quả Trứng Lông Vũ Thiêng (The 3 Soul Eggs):** Kết tinh tình yêu chuẩn bị nở, tia hy vọng duy nhất của tổ ấm.
* **Thực Thể Ký Sinh Thời Gian (The Chrono Parasite / Con Quỷ Mộng Du):** Một thực thể hắc ám xâm nhập vào tâm trí kẻ quẫn bách, thao túng ký ức và nuôi dưỡng sự điên loạn bằng cảm giác tội lỗi.

---

### 📖 Diễn Biến 4 Chương Kịch Bản Chi Tiết:

#### 🌅 CHƯƠNG 1: ẢO ẢNH RỰC LỬA & TIẾNG GÁY ĐẦU TIÊN
* **Mở đầu:** Gallus tỉnh dậy giữa đống tro tàn của tổ ấm tại Nông Trang Hoang Phế. Người vợ Sari đã chết thảm trong vũng máu, 3 quả trứng biến mất.
* Một giọng nói vang lên trong đầu Gallus: *"Cầm lấy cựa kiếm... Đi lên Đỉnh Tháp Nguyệt Thực, tiêu diệt Giáo Hội Mặt Trời Giả Dối để đòi lại đàn con..."*
* Trong ngực Gallus, ngọn lửa linh hồn mà Sari để lại trao cho Gallus quyền năng **Tiếng Gáy Đảo Ngược Thời Gian** mỗi khi gục ngã.
* Gallus chém giết vượt qua Hang Động Nấm Dạ Quang, hạ gục Boss 1: **Đao Phủ Bọ Hung Tội Lỗi**. Trước khi chết, con Boss rơi nước mắt nói: *"Ngươi... vẫn chưa nhận ra sao? Hãy dừng lại đi..."*

#### 🪶 CHƯƠNG 2: MẢNH LÔNG VŨ RÁCH RƯỚI & SỰ NGHI NGỜ
* Gallus tiến vào Lâu Đài Tơ Vàng và Đầm Lầy Axit. Mỗi lần chết, Gallus thấy bức tranh gia đình trong tâm trí bị xé rách một góc, tiếng hát ru của Sari ngày càng yếu ớt.
* Để lấy lại ký ức, Gallus buộc phải quay lại đánh với các ảo ảnh biến dạng của chính khu vực cũ. Ở đó, các quái vật bắt đầu van xin Gallus bằng giọng nói của những người hàng xóm cũ.
* Hạ gục Boss 2: **Đại Phán Quan Cú Mèo**. Kẻ này hé lộ trước khi chết: *"Kẻ thù của ngươi không ở trên tháp... Kẻ giết chết gia đình ngươi đang cầm thanh cựa kiếm kia kìa!"*

#### 🩸 CHƯƠNG 3: TẤM MÀN SỰ THẬT & CÚ SỐC TỘI ÁC
* Gallus đặt chân đến Xưởng Rèn Dung Nham và Vườn Hoa Pha Lê, đánh bại Boss 3: **Hiệp Sĩ Mào Sắt Khóc Than**.
* Khi chiếc mặt nạ sắt vỡ vụn, bên trong không phải quái vật, mà là hình ảnh phản chiếu của chính Gallus thời trẻ.
* **CÚ BẺ LÁI KINH HOÀNG LỘ DIỆN:**
  1. *Không hề có Giáo Hội hay quỷ dữ nào cướp trứng cả.*
  2. Mùa đông năm ấy, Nạn Dịch Bào Tử Đen ập đến khiến Sari ngã bệnh và đàn con trong trứng bị đông cứng. Vì quá tuyệt vọng tìm thức ăn và thuốc cứu gia đình, Gallus đã ăn phải nấm độc ký sinh biến chất.
  3. Trong cơn mộng du phát điên cuồng sát, **CHÍNH ĐÔI CỰA SẮT CỦA GALLUS ĐÃ DẪM NÁT 3 QUẢ TRỨNG VÀ TÀN SÁT CẢ NÔNG TRANG!**
  4. Sari chứng kiến tất cả nhưng không hề oán hận chồng. Trước khi trút hơi thở cuối cùng, vì biết Gallus yêu gia đình hơn sinh mạng và sẽ chết vì tan nát cõi lòng nếu biết sự thật, **Sari đã dùng chút sinh mệnh cuối cùng thêu dệt nên "Ảo Ảnh Kẻ Thù Bắt Cóc Trứng"** để cho chồng một lý do để tiếp tục sống!
  5. Toàn bộ dàn quái vật mà Gallus giết dọc đường thực chất là những người hàng xóm vô tội đang cố gắng ngăn cản một con gà điên loạn!

#### 🌌 CHƯƠNG 4: ĐỈNH THÁP NGUYỆT THỰC & BẢN ÁN CHUỘC TỘI
* Gallus bước lên Đỉnh Tháp Nguyệt Thực — nơi thực chất là đỉnh của ngọn đồi tro tàn hoang vắng.
* Trùm Cuối không ai khác chính là **Bản Ngã Điên Loạn Của Gallus (The Phantom of Guilt)** cùng Con Quỷ Ký Sinh.
* Gallus phải chiến đấu với chính bóng ma tội lỗi và sự dằn vặt của bản thân.

---

### 🎭 3 CÁI KẾT CỦA TRÒ CHƠI (THE 3 ENDINGS):

| Kết Thúc | Điều Kiện Mở Khóa | Nội Dung & Ý Nghĩa Nhân Văn |
| :--- | :--- | :--- |
| **1. KẾT THÚC ĐIÊN LOẠN (Bad Ending - The Hollow Monster)** | Chết quá nhiều lần, để linh hồn của Sari cháy rụi và mất hết toàn bộ Mảnh Ký Ức. | Gallus hoàn toàn mất trí, quên mất vợ con mình là ai. Chú gà biến thành một con quái thú bất tử rỗng tuếch, vĩnh viễn lang thang trên đống đổ nát chém giết bất kỳ ai đến gần. |
| **2. KẾT THÚC CHỐI BỎ (Neutral Ending - The Endless Loop)** | Đánh bại Trùm Cuối nhưng tiếp tục dùng Tiếng Gáy đảo ngược thời gian vì không dám đối diện sự thật. | Gallus lại hồi sinh trong căn nhà rực lửa ở Chương 1, tiếp tục vòng lặp tự dằn vặt vô tận không lối thoát, tự lừa dối mình rằng các con vẫn còn sống ở trên đỉnh tháp. |
| **3. KẾT THÚC CHUỘC TỘI ĐÍCH THỰC (True Ending - The Lullaby of Dawn)** | Nhặt đủ 100% Mảnh Lông Vũ Ký Ức, đánh bại Bản Ngã Tội Lỗi ở trạng thái Máu Dưới 25% (Mind Freeze) và **TỪ BỎ QUYỀN NĂNG HỒI SINH**. | Gallus ôm lấy linh hồn của Sari, nói lời xin lỗi nghẹn ngào. Gallus cất tiếng gáy cuối cùng để thanh tẩy mảnh đất, rồi thanh thản nhắm mắt trút hơi thở cuối cùng. Linh hồn Gallus đoàn tụ cùng Sari và 3 chú gà con lông vàng trên cánh đồng cỏ xanh bất tận, ánh bình minh thực sự ló rạng sau đêm dài tăm tối. |

---

## ⚙️ PHẦN 3: HỆ THỐNG CƠ CHẾ GAMEPLAY ĐỘC BẢN (GAME SYSTEMS)

### 1. 🕯️ Cơ Chế "Linh Hồn Người Vợ & Mất Ký Ức" (The Soul Flame & Memory Loss)
* **Thanh Ký Ức (Memory Shards):** Người chơi bắt đầu với **12 Mảnh Ký Ức Lông Vũ**.
* Mỗi khi bị kẻ thù hạ gục:
  * 1 Mảnh Ký Ức vỡ vụn, ngọn lửa linh hồn của Sari yếu đi.
  * Bức tranh gia đình trong giao diện Menu mờ đi một phần, giọng ru ngắt quãng.
  * **Nếu mất cả 12 mảnh:** Chế độ *Hollow Madness* kích hoạt ➔ Game Over vĩnh viễn.

### 2. 🪞 Cơ Chế "Trận Đấu Ký Ức Biến Dạng" (Distorted Echo Rematch)
* Để khôi phục Mảnh Ký Ức bị mất, Gallus có thể đi ngược về phòng Boss cũ đã hạ gục.
* Phòng Boss cũ sẽ biến thành **Vùng Ký Ức Vỡ Vụn (Nightmare Realm)**:
  * Boss cũ tái sinh với tạo hình quái dị hơn, đòn đánh nhanh hơn 20%.
  * Giọng nói của Boss biến thành giọng thì thầm của Sari hoặc tiếng khóc của đàn con.
  * Đánh bại Boss biến dạng này sẽ hàn gắn lại Mảnh Ký Ức đã mất!

### 3. ⏱️ Cơ Chế "Ngưng Đọng Tâm Trí Khi Thập Tử Nhất Sinh" (Near-Death Mind Freeze)
* **Kích hoạt:** Khi lượng máu của Gallus **dưới 25% (Thanh máu mào gà nhấp nháy đỏ rực)**.
* **Cơ chế:** Khi Boss vung đòn đánh chí mạng, bản năng sinh tồn cực hạn kích hoạt ➔ **Màn hình chuyển sang tone đen trắng, thời gian trong tâm trí ngưng đọng 0.3 giây**.
* **Hệ thống Ghi Nhớ Vết Sẹo (Scar Mastery):**
  * Mỗi lần bạn chết bởi **chính đòn đánh đó của con Boss đó**, Gallus khắc ghi nỗi đau thể xác sâu hơn.
  * Thời gian ngưng đọng tâm trí tăng dần:
    $$\text{Lần chết 1:}~0.30\text{s} \quad\longrightarrow\quad \text{Lần chết 3:}~0.55\text{s} \quad\longrightarrow\quad \text{Lần chết 5+:}~0.80\text{s}$$
  * Trong khoảnh khắc ngưng đọng, người chơi có thể lách người Dash né đòn hoặc tung cú **Pogo Đạp Cựa** ngược đầu Boss để lật ngược thế cờ!

---

## 🗺️ PHẦN 4: HỆ THỐNG CHIẾN ĐẤU, GIẢI ĐỐ & 5 VÙNG ĐẤT

### ⚔️ Bộ Kỹ Năng Của Gallus:
1. **Cựa Kiếm 4 Hướng (4-Way Talon Slash):** Chém Ngang (Front), Chém Ngước Lên (Up), Chém Bổ Xuống (Down Pogo).
2. **Pogo Đạp Cựa (Talon Pogo Bounce):** Chém xuống đầu kẻ thù, nấm đàn hồi hoặc cọc gai để bật nảy người lên cao và làm mới lại lượt Nhảy 2 Bước / Lướt Gió.
3. **Lướt Bóng Mờ (Phantom Dash):** Lướt nhanh về phía trước, có 0.2s bất tử (I-frames) né đòn.
4. **Móng Vuốt Bám Tường (Claw Wall Climb):** Bám chặt và nhảy bật tường ở các vách đá dựng đứng.
5. **Tiếng Gáy Bình Minh (Dawn Crow Shockwave):** Sử dụng năng lượng tơ lụa để phát ra sóng âm gáy đẩy lùi kẻ thù và phá hủy các vật cản phù văn.

---

### 🧩 Hệ Thống Câu Đố Môi Trường (Metroidvania Puzzles):
* **Đố bằng Tiếng Gáy Phù Văn (Chrono Echo Resonators):** Cất tiếng gáy đúng tần số để kích hoạt các trụ đá cổ mở cổng thời gian.
* **Chuỗi Pogo Vượt Bãi Gai (Spike Pogo Gauntlet):** Nhảy Pogo liên hoàn trên các cây nấm đàn hồi và đầu bọ gai bay để vượt qua vực thẳm mà không được chạm chân xuống đất.
* **Cửa Khóa Ký Ức (Memory Sealed Gates):** Chỉ mở ra khi Gallus tìm lại đủ số Mảnh Lông Vũ tương ứng của khu vực đó.

---

### 🗺️ 5 VÙNG ĐẤT & DÀN BOSS CHÍNH:

```
[1. HANG NẤM DẠ QUANG] ➔ [2. LÂU ĐÀI TƠ VÀNG] ➔ [3. LÒ RÈN DUNG NHAM]
                                                         │
                                  ┌──────────────────────┘
                                  ▼
                    [4. VƯỜN HOA PHA LÊ ÁNH TRĂNG] ➔ [5. ĐỈNH THÁP NGUYỆT THỰC]
```

1. **Vùng 1: Hang Động Rêu Nấm Dạ Quang (Bioluminescent Moss Grotto)**
   * *Boss:* **Đao Phủ Bọ Hung Tội Lỗi (The Penitent Scarab)** — Mang xích sắt tự hành xác, dộng đất tạo sóng chấn động.
2. **Vùng 2: Lâu Đài Tơ Vàng & Tháp Chuông (Gilded Silk Spire Citadel)**
   * *Boss:* **Đại Phán Quan Cú Mèo (Inquisitor Noctua)** — Bay lượn ném lông vũ dao găm, phóng tia tơ lụa trói chân.
3. **Vùng 3: Xưởng Rèn Dung Nham & Xích Sắt (Magma Forge Smeltery)**
   * *Boss:* **Vua Rận Dung Nham (The Molten Forge King)** — Quai búa tạ khổng lồ, tạo sóng nham thạch trào dâng.
4. **Vùng 4: Vườn Hoa Pha Lê & Hồ Ánh Trăng (Crystalline Arboretum & Moonlit Spring)**
   * *Boss:* **Hiệp Sĩ Mào Sắt Khóc Than (The Weeping Ironcomb Vanguard)** — Sử dụng chính bộ cước và đòn Pogo của Gallus.
5. **Vùng 5: Đỉnh Tháp Nguyệt Thực & Vực Tro Tàn (The Zenith of Eclipse)**
   * *Boss Cuối:* **Bản Ngã Tội Lỗi & Con Quỷ Ký Sinh (The Phantom of Guilt & Chrono Parasite)** — Biến hình 3 Phase, thao túng thời gian và ảo ảnh.

---

## 🚀 PHẦN 5: LỘ TRÌNH PHÁT TRIỂN & XUẤT BẢN THƯƠNG MẠI

| Giai Đoạn | Mục Tiêu | Đầu Ra Sản Phẩm |
| :--- | :--- | :--- |
| **Giai đoạn 1 (Tháng 1-2)** | Hoàn thiện Vertical Slice (Demo 1 Màn: Hang Nấm Dạ Quang + Boss 1 + Cơ chế Mind Freeze). | Phát hành Demo miễn phí trên **Itch.io** & **Steam**, thu hút Wishlist từ cộng đồng. |
| **Giai đoạn 2 (Tháng 3-4)** | Hoàn thiện 5 Màn chơi, 5 Boss, Hệ thống Ký Ức Biến Dạng và 3 Nhánh Kết Thúc. | Bản thử nghiệm Beta kín (Closed Beta) lấy feedback cân bằng độ khó. |
| **Giai đoạn 3 (Tháng 5-6)** | Tối ưu hóa hiệu năng, đóng gói bản PC (Steam) và bản Mobile (Google Play & App Store). | Phát hành chính thức trên toàn cầu, chạy chiến dịch truyền thông Trailer & Streamer. |

---

> 📜 *Tài liệu được tạo và lưu trữ chính thức tại `d:\folder\tools\godot_demo\2\GAME_DESIGN_DOCUMENT.md`.*
