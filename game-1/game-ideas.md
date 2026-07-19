# 🎮 GAME DESIGN DOCUMENT: WRONG WAY

> **Pitch:** *"Đua xe đi cảnh 2D cùng bạn bè tới đích — nghe dễ ẹc, cho đến khi phím bấm của bạn bị XÁO TRỘN NGẪU NHIÊN mỗi 10 giây. Não bạn biết phải nhảy, tay bạn bấm nhảy — nhưng nhân vật lại đi lùi và rơi thẳng xuống hố."*


---

## 📊 1. PHÂN TÍCH THỊ TRƯỜNG: TẠI SAO ĐÚNG LÚC NÀY?

### 1.1. Xu hướng "Friendslop" — Kỷ nguyên vàng của Party Game

Năm 2025-2026 đang được các chuyên gia gọi là "kỷ nguyên vàng" (golden age) của indie game, đặc biệt là thể loại **"Friendslop"** — các game co-op/party hỗn loạn, vui nhộn, giá rẻ, dễ rủ bạn bè chơi cùng. Các tựa hit gần đây:

| Game             | Doanh số | Hook chính                      | Điểm mạnh                  |
| ---------------- | --------- | -------------------------------- | ----------------------------- |
| R.E.P.O.         | 18M+ bản | Co-op horror nhặt đồ bán nợ | Physics hài hước + la hét |
| PEAK             | 16M+ bản | Leo núi cùng bạn              | Ragdoll + vật lý            |
| Meccha Chameleon | 15M+ bản | Đổi màu trốn tìm            | Đơn giản, dễ hiểu        |
| Content Warning  | 5M+ bản  | Quay phim ma câu view           | Streamer bait                 |
| Fall Guys        | 50M+ tải | Obstacle course battle royale    | Hỗn loạn + cute             |

### 1.2. Khoảng trống thị trường mà WRONG WAY nhắm vào

**Chưa có game nào biến "xáo phím điều khiển" thành core mechanic cho một tựa game multiplayer chính thức.** Đây là một khoảng trống hoàn hảo:

- **Không phải Among Us clone** (social deduction)
- **Không phải Fall Guys clone** (obstacle course 3D)
- **Không phải R.E.P.O clone** (co-op horror)
- → WRONG WAY tạo ra một **thể loại hoàn toàn mới**: "Control Chaos Party Game"

---

## 🧠 2. CORE DESIGN: TẠI SAO CƠ CHẾ XÁO PHÍM SẼ MANG LẠI TIẾNG CƯỜI?

### 2.1. Tâm lý học đằng sau tiếng cười

Cơ chế xáo phím đánh vào 3 loại hài hước phổ biến nhất trên mạng:

1. **Incongruity (Sự bất ngờ):** Não bạn biết phải nhảy → tay bạn bấm nhảy → nhân vật lại đi lùi. Khoảng cách giữa "kỳ vọng" và "thực tế" tạo ra tiếng cười tức thì.
2. **Schadenfreude (Cười khi người khác thất bại):** Bạn đã mò ra phím nhảy rồi, nhưng bạn bè đang cuống cuồng rơi xuống hố liên tục → bạn cười sảng khoái.
3. **Self-deprecation (Cười chính mình):** Bạn đang dẫn đầu, xáo phím xảy ra, bạn bấm nhầm và tự rơi → bạn bè cười, bạn cũng cười vì nó quá vô lý.

### 2.2. Vòng lặp cảm xúc mỗi 10 giây

```
ĐÈN XANH (10s) ──────────────────────────── XÁO PHÍM! ──────── ĐÈN XANH (10s)
   │                                              │                    │
   ├─ "OK tao biết phím rồi!"                     ├─ "CÁI GÌ?!"       ├─ "OK lại biết rồi!"
   ├─ Chạy nhanh, tự tin                          ├─ Bấm loạn xạ      ├─ Tăng tốc lại
   ├─ Vượt qua chướng ngại                        ├─ Rơi hố / đi lùi  ├─ Vượt tiếp
   └─ Cảm giác: FLOW + tự tin                     └─ Cảm giác: HỖNLOẠN└─ Cảm giác: "ĐÃ!"
```

Mỗi 10 giây = 1 "plot twist" mini → Mỗi ván đua 2-3 phút = 12-18 plot twists → **Mỗi ván = 1 clip TikTok sẵn sàng**.

### 2.3. Tại sao KHÔNG frustrating (ức chế)?

Nhiều game khó sẽ gây ức chế. WRONG WAY tránh được điều này vì:

- **Mọi người cùng bị xáo** → Không ai bị bất lợi riêng → "Thua không phải do mình kém"
- **Checkpoint hồi sinh** → Rơi hố chỉ mất vài giây, không phải chạy lại từ đầu
- **Ván đua ngắn (2-3 phút)** → Thua thì chơi lại ngay, không mất 30 phút
- **Skill vẫn có ý nghĩa** → Người quen phím nhanh hơn sẽ thắng → có depth cho competitive

---

## 🕹️ 3. HỆ THỐNG GAME MODES (5 MODES LÚC LAUNCH)

### Mode 1: 🏃 RACE (Đua Tới Đích) — Mode chính

- **Luật:** 2-8 người chơi xuất phát cùng lúc. Ai tới đích trước thắng.
- **Xáo phím:** Mỗi 10 giây, phím A/D/SPACE bị hoán đổi ngẫu nhiên.
- **Thời gian:** 2-3 phút/ván.
- **Bản đồ:** 8 bản đồ khác nhau (xem mục 4).

### Mode 2: 🧊 FLOOR IS RISING (Sàn Dâng Lên)

- **Luật:** Sàn từ từ dâng lên từ dưới (nước/lava). Người chơi phải leo lên các platform phía trên để sống sót.
- **Xáo phím:** Mỗi 8 giây.
- **Kết thúc:** Người cuối cùng sống sót thắng.
- **Vì sao hay:** Áp lực thời gian + xáo phím = hoảng loạn thuần khiết.

### Mode 3: ⚔️ SUMO ARENA (Đẩy Nhau Ra Ngoài)

- **Luật:** Arena tròn nhỏ dần. Người chơi có thể đẩy nhau ra ngoài rìa.
- **Xáo phím:** Mỗi 7 giây.
- **Kết thúc:** Người cuối cùng còn đứng trên arena thắng.
- **Vì sao hay:** Bạn đang định đẩy bạn bè ra ngoài → xáo phím → bạn tự lao ra ngoài.

### Mode 4: 💣 TAG (Truyền Bom)

- **Luật:** 1 người mang "bom" (đếm ngược 15s). Chạm vào người khác để truyền bom.
- **Xáo phím:** Mỗi 10 giây.
- **Kết thúc:** Bom nổ → người mang bom bị loại. Lặp lại cho đến khi còn 1 người.
- **Vì sao hay:** Bạn đang cầm bom, chạy về phía bạn bè để truyền → xáo phím → chạy ngược hướng → BÙM.

### Mode 5: 🧩 COPYCAT (Bắt Chước Hành Động)

- **Luật:** Một "lãnh đạo" (AI hoặc người chơi random) thực hiện chuỗi hành động (trái, trái, nhảy, phải). Người chơi phải lặp lại đúng chuỗi đó.
- **Xáo phím:** Sau mỗi vòng, phím bị xáo 1 lần.
- **Kết thúc:** Người cuối cùng còn lại thắng.
- **Vì sao hay:** Bạn nhớ đúng chuỗi hành động, nhưng phím đã đảo → não bạn phải "dịch" hành động sang phím mới → cực kỳ hài hước.

---

## 🗺️ 4. THIẾT KẾ BẢN ĐỒ (8 BẢN ĐỒ LÚC LAUNCH)

Mỗi bản đồ có chủ đề riêng, tương tác khác nhau với cơ chế xáo phím:

| # | Tên Map                  | Chủ đề                    | Đặc biệt                                                                              | Độ khó  |
| - | ------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------- | ---------- |
| 1 | **Rooftop Rush**    | Sân thượng nhà cao tầng | Platform đơn giản, gap vừa                                                           | ⭐ Dễ     |
| 2 | **Jungle Bounce**   | Rừng rậm                   | Nhiều Bounce Pad nảy cao                                                               | ⭐⭐       |
| 3 | **Ice Panic**       | Sàn băng                   | Sàn trơn trượt (friction thấp) → khi xáo phím, trượt dài không dừng được | ⭐⭐⭐     |
| 4 | **Wind Tunnel**     | Đường hầm gió           | Gió thổi 1 hướng, phải chống lại gió → xáo phím + gió = thảm họa           | ⭐⭐⭐     |
| 5 | **Conveyor Chaos**  | Nhà máy                    | Băng chuyền di chuyển sàn → platform "chạy" dưới chân bạn                      | ⭐⭐⭐     |
| 6 | **Gravity Flip**    | Vũ trụ                     | Có vùng lật ngược trọng lực (rơi lên trên thay vì xuống)                     | ⭐⭐⭐⭐   |
| 7 | **Shrink Platform** | Neon arena                   | Platform co nhỏ dần theo thời gian                                                    | ⭐⭐⭐⭐   |
| 8 | **The Gauntlet**    | Tổng hợp                   | Kết hợp tất cả: băng + gió + bounce + co nhỏ                                      | ⭐⭐⭐⭐⭐ |

---

## 🎨 5. PHONG CÁCH ĐỒ HỌA: NEON MINIMALIST

### 5.1. Art Direction

- **Nền tối đen** + **viền neon phát sáng** (Cyan, Magenta, Green, Yellow).
- Nhân vật là **hình tròn/blob** đơn giản với hiệu ứng trail sáng khi di chuyển.
- Khi xáo phím: **Màn hình flash đỏ + text "XÁO PHÍM!" hiện to** + hiệu ứng glitch nhẹ.
- Platform và tường có viền neon nhẹ, phong cách Tron/Cyberpunk.

### 5.2. Tại sao Neon Minimalist?

- **Dễ làm:** Không cần artist chuyên nghiệp. Vẽ hình học + neon glow = đẹp.
- **Dễ nhận diện:** Phong cách nổi bật trên thumbnail YouTube/TikTok.
- **Nhẹ:** Chạy mượt trên mọi máy, kể cả điện thoại qua trình duyệt.

---

## 💰 6. CHIẾN LƯỢC KIẾM TIỀN & PHÁT HÀNH

### 6.1. Giá bán & Nền tảng

| Nền tảng                 | Giá                            | Ghi chú                            |
| -------------------------- | ------------------------------- | ----------------------------------- |
| **Steam (PC)**       | $4.99                           | Bản chính thức, Electron wrapper |
| **Itch.io**          | $2.99 hoặc "pay what you want" | Bản sớm, build cộng đồng       |
| **Web (miễn phí)** | Free                            | Demo 2 map + 1 mode để viral      |

### 6.2. Tại sao $4.99?

- Rẻ đủ để **1 người mua 4 bản tặng bạn** mà không đau ví.
- Fall Guys thành công vì free-to-play. Nhưng WRONG WAY là indie nhỏ → **$4.99 x 1M bản = ~$3.5M doanh thu** (sau thuế Steam 30%).
- Không cần microtransaction phức tạp lúc đầu.

### 6.3. DLC & Skin (sau launch 1-2 tháng)

- **Skin Pack:** $1.99/pack — Nhân vật hình quả chuối, khối thạch, UFO, mèo pixel...
- **Map Pack:** $2.99 — Thêm 4 bản đồ mới mỗi quý.
- **Battle Pass (nếu đủ lớn):** Season 1 miễn phí, Season 2+ có premium $3.99.

---

## 📢 7. CHIẾN LƯỢC VIRAL & MARKETING (CHI PHÍ $0)

### 7.1. Tại sao game này tự viral?

Mỗi ván đua tạo ra **ít nhất 3-5 khoảnh khắc clip-worthy** một cách tự nhiên:

- Người chơi đang dẫn đầu → xáo phím → rơi hố → "NOOOO!"
- Người chơi cuối bảng → xáo phím → tình cờ mò đúng phím → vượt lên → "LÊN LÊN LÊN!"
- Cả 4 người cùng rơi hố cùng lúc → tất cả cười sảng khoái

### 7.2. Kế hoạch marketing cụ thể

| Giai đoạn         | Hành động                                                               | Chi phí                                  |
| ------------------- | -------------------------------------------------------------------------- | ----------------------------------------- |
| **Tuần 1-2** | Đăng demo miễn phí lên Itch.io + post r/IndieGaming, r/WebGames       | $0                                        |
| **Tuần 2-4** | Quay clip gameplay hài hước 30s đăng TikTok/YouTube Shorts mỗi ngày | $0                                        |
| **Tuần 4-6** | Gửi key miễn phí cho 20-50 micro-streamers (1K-10K followers)           | $0                                        |
| **Tuần 6-8** | Tham gia Steam Next Fest với bản Demo                                    | $0 (chỉ tốn $100 phí đăng ký Steam) |
| **Launch**    | Phát hành chính thức trên Steam, giá $4.99 | $100 (phí Steam)       |                                           |

### 7.3. Tận dụng "Streamer Bait"

- Game tự động ghi lại **"Highlight Reel"** sau mỗi ván: replay 3 khoảnh khắc hài nhất (rơi hố nhiều nhất, vượt mặt ngoạn mục nhất, v.v.)
- Người chơi có thể **share highlight** trực tiếp lên mạng xã hội với 1 nút bấm.

---

## 🛠️ 8. KIẾN TRÚC KỸ THUẬT

### 8.1. Tech Stack

| Thành phần   | Công nghệ                | Lý do                                             |
| -------------- | -------------------------- | -------------------------------------------------- |
| Game Engine    | **Phaser 3** (HTML5) | Nhẹ, chạy trên trình duyệt, dễ wrap Electron |
| Multiplayer    | **PeerJS (WebRTC)**  | P2P trực tiếp, $0 server cost                    |
| Âm thanh      | **Web Audio API**    | Synth retro, không cần file nhạc                |
| Đóng gói PC | **Electron**         | Wrap web → .exe cho Steam                         |
| Backend        | **Không cần**      | P2P = không server duy trì                       |

### 8.2. Mô hình Host-Authoritative P2P

```
Host (Người tạo phòng)
  ├── Chạy Phaser Physics cho TẤT CẢ nhân vật
  ├── Quản lý bộ đếm xáo phím 10s
  ├── Phát lệnh "trigger_shuffle" đồng bộ cho tất cả
  ├── Kiểm tra rơi hố / chạm đích
  └── Broadcast tọa độ (x, y) cho Clients

Client (Người vào phòng)
  ├── Đọc phím vật lý (A, D, SPACE)
  ├── Áp dụng keyMap đảo cục bộ
  ├── Gửi hành động đã map lên Host
  └── Nhận + render tọa độ từ Host
```

### 8.3. Thuật toán Xáo Phím (Fisher-Yates Shuffle)

```javascript
// Mảng hành động: ['left', 'right', 'jump']
// Mảng phím vật lý: A, D, SPACE

shuffleControls() {
    const actions = ['left', 'right', 'jump'];
    // Fisher-Yates shuffle
    for (let i = actions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [actions[i], actions[j]] = [actions[j], actions[i]];
    }
    // Gán: A → actions[0], D → actions[1], SPACE → actions[2]
    this.keyMap = {
        left: actions[0],   // A bây giờ làm gì?
        right: actions[1],  // D bây giờ làm gì?
        jump: actions[2]    // SPACE bây giờ làm gì?
    };
}
```

---

## 📅 9. LỘ TRÌNH PHÁT TRIỂN

### Phase 1: Prototype (Tuần 1-2) ✅ ĐÃ HOÀN THÀNH

- [X] Lobby UI + PeerJS kết nối P2P
- [X] Game scene side-scroller với trọng lực
- [X] Cơ chế xáo phím cơ bản
- [X] Hồi sinh khi rơi hố

### Phase 2: Game Modes + Maps (Tuần 3-5)

- [ ] Thêm 4 game modes còn lại (Floor is Rising, Sumo, Tag, Copycat)
- [ ] Thiết kế và code 8 bản đồ
- [ ] Thêm hiệu ứng đặc biệt cho mỗi map (băng trơn, gió, bounce pad)
- [ ] Hiệu ứng hình ảnh khi xáo phím (screen shake, glitch, flash)

### Phase 3: Polish & Juice (Tuần 5-7)

- [ ] Hiệu ứng particle khi nhảy, rơi, chạm đích
- [ ] Nhạc nền synthwave + hiệu ứng âm thanh cho mọi hành động
- [ ] Màn hình kết quả với Highlight Reel (replay 3 khoảnh khắc hay nhất)
- [ ] Skin system cơ bản (5-10 skin miễn phí)
- [ ] Thiết kế menu responsive đẹp

### Phase 4: Testing & Launch (Tuần 7-9)

- [ ] Beta test với bạn bè qua web demo
- [ ] Đăng demo lên Itch.io để thu thập feedback
- [ ] Đăng ký Steam Next Fest
- [ ] Wrap Electron + tích hợp Steamworks SDK
- [ ] Quay trailer gameplay + đăng TikTok/Shorts mỗi ngày

### Phase 5: Post-Launch (Tuần 10+)

- [ ] Thu thập feedback → sửa bug nhanh
- [ ] Phát hành Map Pack DLC đầu tiên (4 maps)
- [ ] Phát hành Skin Pack DLC đầu tiên
- [ ] Cân nhắc Mobile port (game đã chạy trên trình duyệt → dễ port)

---

## 🎯 10. MỤC TIÊU CỤ THỂ

| Mốc                      | Mục tiêu                                    | Khi nào     |
| ------------------------- | --------------------------------------------- | ------------ |
| **Prototype**       | Game chạy được, 2 người chơi thử      | ✅ Đã xong |
| **Alpha**           | 5 modes + 8 maps hoàn chỉnh                 | Tuần 5      |
| **Demo**            | Đăng Itch.io, thu 500 lượt chơi          | Tuần 7      |
| **Beta**            | Steam Next Fest, thu 2000 wishlists           | Tuần 8      |
| **Launch**          | Phát hành Steam, bán 1000 bản tuần đầu | Tuần 9      |
| **Viral**           | Clip đạt 1M views trên TikTok              | Tuần 10-12  |
| **Milestone**       | 100K bản bán ra                             | Tháng 3-4   |
| **Mục tiêu lớn** | 1M bản bán ra                               | Tháng 6-12  |
