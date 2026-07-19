# 🎮 KẾ HOẠCH Ý TƯỞNG GAME: WRONG WAY (ĐUA XE XÁO PHÍM 2D)

Tài liệu này tập trung khai thác chuyên sâu và chi tiết ý tưởng game **WRONG WAY** - một tựa game đua xe đi cảnh (side-scroller platformer) nhiều người chơi với cơ chế xáo phím liên tục, hướng tới mục tiêu bán 1 triệu bản trên Steam và dễ dàng trở thành hiện tượng mạng xã hội (viral).

---

## 🎯 1. Concept Cốt Lõi: WRONG WAY

> **Pitch 1 câu:** *"Đua xe đi cảnh 2D cùng bạn bè tới đích, nghe có vẻ dễ cho đến khi phím bấm của bạn bị xáo trộn ngẫu nhiên mỗi 10 giây!"*

- **Thể loại:** Multiplayer Party Game / Side-scroller Platformer.
- **Số lượng người chơi:** 2 - 8 người chơi online qua kết nối P2P (WebRTC).
- **Core Loop (Vòng lặp chính):**
    1. Người chơi xuất phát tại vạch xuất phát.
    2. Cố gắng chạy, nhảy, vượt qua các chướng ngại vật (vực sâu, lò xo nảy, chướng ngại vật di động) để về đích đầu tiên.
    3. Cứ sau mỗi **10 giây**, hệ thống tự động **xáo trộn ngẫu nhiên phím điều khiển** (ví dụ: A từ đi Trái có thể thành Nhảy, D thành đi Trái, SPACE thành đi Phải...).
    4. Người chơi phải tự mò lại phím bấm trong khi đang di chuyển để không bị rơi xuống vực. Rơi xuống vực sẽ bị hồi sinh lại tại checkpoint đã vượt qua gần nhất.

---

## 🎭 2. Tại Sao Game Sẽ Viral & Mang Lại Tiếng Cười Cực Lớn?

Cơ chế xáo phím đánh trực tiếp vào **phản xạ vô điều kiện** của người chơi:

1.  **Khoảnh khắc cuống cuồng:** 
    *   Bạn đang chuẩn bị nhảy qua một hố sâu chứa đầy chướng ngại vật, chỉ còn 1 giây nữa là nhảy $\rightarrow$ **XÁO PHÍM!** 
    *   Bạn nhấn Space để nhảy theo thói quen nhưng nhân vật lại đi lùi và rơi thẳng xuống vực.
2.  **Sự ức chế vui nhộn (Funny Frustration):**
    *   Thất bại trong game không phải do game bất công hay do bạn kém kỹ năng, mà vì bộ não của bạn chưa kịp làm quen với sơ đồ phím mới. Sự bất lực này tạo ra tiếng cười sảng khoái thay vì bực dọc.
3.  **Streamer Bait hoàn hảo:**
    *   Các streamer khi chơi cùng nhau sẽ tạo ra các tình huống la hét, bấn loạn khi cố tìm phím: *"Phím nhảy của tao là phím nào?! Là A hả? Không phải! Ối rơi rồi!"*
    *   Khán giả cực kỳ thích xem các khoảnh khắc người chơi tự hủy do nhấn sai phím.

---

## 🕹️ 3. Chi Tiết Thiết Kế Bản Đồ & Chướng Ngại Vật

Bản đồ được thiết kế dạng cuộn ngang (side-scroller) dài 2400px với độ khó tăng dần:

### Các thành phần chính trên đường đua:
-   **Platform (Sàn đất):** Các khoảng đất cứng nằm rải rác ở các độ cao khác nhau.
-   **Gaps (Vực sâu):** Những khoảng trống không có đất. Rơi xuống vực sẽ hồi sinh tại checkpoint.
-   **Bounce Pads (Lò xo nảy):** Đẩy người chơi bay cực cao lên các sàn phía trên. Cần căn đúng nhịp nhảy và hướng di chuyển để hạ cánh an toàn.
-   **Checkpoints:** Các điểm mốc lưu trữ tiến trình. Khi rơi xuống vực, người chơi hồi sinh tại điểm mốc gần nhất đã đi qua để tránh phải chạy lại từ đầu, giảm ức chế quá đà.
-   **Finish Line (Vạch đích):** Cột ánh sáng neon ở cuối bản đồ. Người đầu tiên chạm vào vạch đích sẽ thắng cuộc.

---

## 📦 4. Kế Hoạch Vận Hành & Kiếm Tiền (Monetization & Steam)

1.  **Mô hình bán game:** Bán trực tiếp trên Steam với giá rẻ **$3.99 - $4.99**. Đây là mức giá cực kỳ dễ để một nhóm bạn rủ nhau cùng mua mà không cần suy nghĩ.
2.  **Chi phí vận hành $0:** 
    *   Sử dụng công nghệ WebRTC P2P (PeerJS) kết nối trực tiếp các trình duyệt/máy tính với nhau.
    *   Host (người tạo phòng) sẽ làm máy chủ chạy vật lý.
    *   Không tốn tiền thuê server hàng tháng, giúp game có thể sống vô hạn mà không lo chi phí duy trì.
3.  **Cá nhân hóa (Skins):** Bán các DLC skin nhân vật ngẫu nhiên, vui nhộn (hình quả chuối, khối thạch wobbly, robot mini...) để tăng doanh thu.

---

## 🛠️ 5. Lộ Trình Phát Triển Kỹ Thuật (Phaser 3 + PeerJS)

| Thành phần | Công nghệ | Cách hoạt động |
|---|---|---|
| **Game Engine** | Phaser 3 | Xử lý đồ họa lưới Neon, camera cuộn theo nhân vật, hệ thống vật lý trọng lực Arcade Physics. |
| **P2P Multiplayer** | PeerJS (WebRTC) | Đồng bộ hóa tọa độ `(x, y)` của tất cả người chơi. Host làm trung gian chạy physics và gửi tín hiệu xáo phím `trigger_shuffle` cho toàn bộ clients. |
| **Thuật toán Xáo** | JavaScript | Fisher-Yates Shuffle mảng các hành động `['left', 'right', 'jump']` gán lại cho các phím vật lý. |
| **Đóng gói Steam** | Electron | Bọc toàn bộ code web thành một file `.exe` chạy độc lập, tích hợp Steamworks SDK để quản lý phòng qua danh sách bạn bè trên Steam. |
