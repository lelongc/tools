# Kế hoạch Đại tu Giao diện và Cơ chế Skill (Tiêu chuẩn Game Steam)

Để đạt được chất lượng của một game PC bán trên Steam (như Hollow Knight, Dead Cells, Ori), game không thể sử dụng cơ chế "mỗi skill một cục cooldown riêng lẻ tẻ" hay "Giao diện scale cứng bằng CSS". Dưới đây là phân tích chi tiết và kế hoạch đại tu toàn diện.

## 1. Phân Tích Hiện Trạng (Tại sao nó chưa ổn?)

### A. Về Giao diện (UI)
- **Lệch/Méo:** Việc dùng `transform: scale(0.65)` là một mẹo chữa cháy (hack). Khi chạy trên các màn hình độ phân giải khác nhau (1080p, 1440p, 4K, hoặc cửa sổ nhỏ), tỷ lệ này sẽ làm vỡ layout, các chữ nằm ngoài viền (như chữ SLASH, DRILL) bị tràn ra khỏi màn hình hoặc đè lên nhau.
- **Bố cục (Layout):** Đặt HUD máu ở Top-Left và Skill ở Bottom-Left làm màn hình bên trái bị quá nặng, trong khi bên phải lại trống (chỉ có minimap). Tiêu chuẩn PC thường đặt Skill ở **Bottom-Right** hoặc **Bottom-Center**.
- **Hiển thị hồi chiêu:** Thanh hồi chiêu dâng từ dưới lên trông không giống game hành động. Thường các game dùng hiệu ứng quét tròn (Radial Sweep) hoặc bóng mờ trôi từ trên xuống (Top-down mask).

### B. Về Cơ chế Kỹ năng (Combat Mechanics)
Hiện tại các skill đang lạm dụng hệ thống Cooldown (thời gian chờ) thay vì Hệ thống Tài nguyên (Mana/Energy).
- **Đánh thường (J - Slash):** Cooldown 0.5s là quá dài cho một game chặt chém 2D. Đánh thường không nên có vòng cooldown trên UI, nó chỉ cần chạy theo tốc độ Animation (Animation lock).
- **Phép thuật (I - Drill/Smash/Blast):** 3 kỹ năng dùng chung phím I nhưng lại có thời gian hồi chiêu tách biệt (1.0s, 1.8s, 1.0s). Người chơi có thể bấm I liên tục kết hợp phím điều hướng để spam cả 3 chiêu cùng lúc -> Game trở nên hỗn loạn.
- **Lướt (K - Dash Strike):** Lướt là kỹ năng cơ động nhất nhưng lại bắt người chơi phải "Gồng" (Charge) và hồi chiêu cực ngắn (0.4s). Điều này làm mất đi tính chiến thuật của việc né đòn.
- **Tuyệt chiêu (L - Nova):** Hồi chiêu 0.8s là quá nhanh cho một chiêu AoE diện rộng.

---

## 2. Kế Hoạch Đại Tu (Đề xuất Mới)

### A. Quy hoạch lại Hệ thống Tài nguyên (Soul / Energy System)
Thay vì đếm giây cho mọi kỹ năng, chúng ta sẽ áp dụng cơ chế **Năng Lượng (Energy)** giống Hollow Knight:
1. **Slash (J):** KHÔNG có cooldown hiển thị. Tốc độ đánh cực nhanh (0.2s/nhát). **Mỗi lần chém trúng quái sẽ hồi lại 10 Năng lượng.**
2. **Dash (K):** Chuyển từ "Gồng để lướt" thành **Lướt tức thời (Instant Dash)** để né đòn. Lướt cung cấp một khung thời gian bất tử ngắn (i-frame). Cooldown: **1.5 giây**. Không tốn năng lượng.
3. **Spells (I - Nhóm Phép thuật):** Bao gồm Bio-Drill, Smash, Rising Blast. KHÔNG có cooldown dài, nhưng **Tiêu hao 30 Năng lượng** cho mỗi lần cast. Hết năng lượng = không thể dùng. Có 1 global cooldown siêu ngắn (0.5s) để tránh double-cast lộn xộn.
4. **Ultimate (L - Lightning Nova):** Là chiêu thức cực mạnh. **Tiêu hao 50 Năng lượng** và có thời gian hồi chiêu là **3.0 giây**.

=> **Lợi ích:** Người chơi buộc phải lao vào chém quái (J) để lấy Năng lượng, sau đó mới có thể xả phép (I) và Ultimate (L). Gameplay sẽ có chiều sâu, nhịp độ công/thủ rõ ràng, cực kỳ bánh cuốn!

### B. Thiết kế lại Giao diện (UI Overhaul)
1. **Bỏ hoàn toàn lệnh `transform: scale`**. Dùng Tailwind classes như `w-12 md:w-16` để tự động co giãn theo kích thước cửa sổ game.
2. **Quy hoạch Vị trí:**
   - **Góc Trái Trên:** Avatar nhân vật + Thanh Máu (Đỏ) + Thanh Năng Lượng (Xanh/Vàng). Thanh Năng Lượng sẽ phân chia các vạch (Ví dụ 1 vạch = 30 Energy) để người chơi biết mình đủ mana tung chiêu I hay chưa.
   - **Góc Phải Dưới:** Khu vực Hotbar hiển thị 4 nút J, K, I, L. Nút J sẽ sáng lên khi đánh trúng (không xoay cooldown). Nút I và L sẽ bị mờ đi (Tối màu) nếu không đủ Năng lượng.
   - **Góc Phải Trên:** Minimap.
3. **Hiệu ứng HUD:** Bo góc sắc sảo hơn (Cyberpunk), chữ rõ ràng không bị tràn viền, hiệu ứng hồi chiêu sẽ là lớp phủ đen mờ trôi từ trên xuống.
