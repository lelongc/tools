# Hồ sơ Phân tích Kỹ thuật và Kế hoạch Nâng cấp Toàn diện

**Tên dự án:** Cluck & Drop: Bunker Buster  
**Phiên bản Engine:** Godot `4.7.1-stable` (Renderer: `GL Compatibility`, Viewport: $540 \times 960$)  
**Thời gian lập hồ sơ:** 19/09/2026  
**Trạng thái hiện tại:** Đã khắc phục toàn bộ 8 lỗi kỹ thuật cốt lõi (BUG-01 → BUG-08), củng cố độ bền save/preset và ổn định 100% vật lý hầm ngục qua 3 vòng kiểm thử tự động.

---

## Danh mục Tài liệu Phân tích (Đọc theo thứ tự)

1. [01 — Hiện trạng và Kiến trúc hệ thống](D:/folder/tools/godot_demo/2/docs/phan-tich-game/01-hien-trang-va-kien-truc.md): Tổng quan vòng chơi, quy mô mã nguồn, trách nhiệm từng module, các nền tảng kiến trúc đã được củng cố.
2. [02 — Báo cáo Lỗi và Tiến độ Xử lý Kỹ thuật](D:/folder/tools/godot_demo/2/docs/phan-tich-game/02-loi-va-huong-cai-thien.md): Nhật ký chi tiết về 8 lỗi cốt lõi (BUG-01 → 08), 3 lỗi Save (SAVE-01 → 03), lỗi build (BUILD-01) đã được giải quyết triệt để và các khoản nợ kỹ thuật cần theo dõi.
3. [03 — Độ khó, Trải nghiệm người chơi và Kinh tế Game](D:/folder/tools/godot_demo/2/docs/phan-tich-game/03-do-kho-trai-nghiem-kinh-te.md): Phân tích đường cong độ khó 10 thế giới, vai trò chiến thuật 7 loại trứng, nghịch lý Trứng Băng, vòng lặp tiền tệ và giải pháp khay tiếp viện.
4. [04 — Âm thanh, Hiệu ứng Hình ảnh (VFX) và Cảm giác Game (Juiciness)](D:/folder/tools/godot_demo/2/docs/phan-tich-game/04-am-thanh-va-hieu-ung-vfx.md): Đánh giá 24 sample âm thanh WAV, cơ chế debounce chống chồng âm, hạt CPUParticles2D, 11 trạng thái biểu cảm quái và đề xuất Ambient Atmosphere.
5. [05 — Kiểm kê Chi tiết 200 Màn chơi Chiến dịch](D:/folder/tools/godot_demo/2/docs/phan-tich-game/05-kiem-ke-200-man.md): Bảng số liệu kiểm kê tự động chính xác cho từng màn (1.574 quái vật, 833.857 HP, 7.076 khối vật liệu, 438 tảng đá, 577 thùng nổ, 1.442 quả trứng).
6. [06 — Lộ trình Cải thiện và Kế hoạch Nâng cấp Toàn diện](D:/folder/tools/godot_demo/2/docs/phan-tich-game/06-lo-trinh-cai-thien-va-nang-cap.md): Lộ trình 4 giai đoạn ưu tiên (Kinh tế & Tiếp viện → Chiến thuật đạn → Audio Bus & Hạt môi trường → Đổi mới Đấu Trùm) cùng tiêu chí nghiệm thu 3 lớp.
7. [07 — Chuẩn hóa Kỹ thuật Di động & Tiêu chuẩn Phát hành CH Play](D:/folder/tools/godot_demo/2/docs/phan-tich-game/07-chuan-hoa-mobile-va-chplay.md): Phân tích toàn diện 18 rủi ro và lỗ hổng di động (Keystore ký số, Target SDK 34/35, Vòng đời Android Auto-Pause, Vùng an toàn Tai thỏ DisplayServer, Chuẩn nút chạm 48dp, Chống kẹp rè loa thoại, Kiến trúc AdMob SDK và Tuân thủ GDPR/COPPA).
8. [08 — Đại Kiểm Kê Toàn Diện Lỗi Kỹ Thuật, Gameplay, Vật Lý & Đề Xuất](D:/folder/tools/godot_demo/2/docs/phan-tich-game/08-dai-kiem-ke-loi-va-de-xuat-toan-dien.md): Báo cáo tổng kiểm kê chi tiết toàn bộ các lỗ hổng vật lý quái văng biên bất tử (PHY-01), kẹt timer rơi rác 9s (PHY-02), bão Tween khi trúng Axit (PHY-03), nghịch lý Trứng Băng tự hủy khối (BAL-01), giải pháp Khay Tiếp Viện (ECO-01), Cửa hàng Vàng (ECO-02) và phản hồi xúc giác Haptics (AUD-02).
9. [09 — Đại Phẫu Toàn Bộ Lỗi, Lỗ Hổng Kỹ Thuật và Kế Hoạch Cải Thiện Toàn Diện](D:/folder/tools/godot_demo/2/docs/phan-tich-game/09-dai-phau-toan-bo-loi-va-de-xuat-nang-cap.md): **Bách khoa Toàn tập Đại phẫu 36 Lỗi & Lỗ hổng Kỹ thuật** trên toàn bộ 9 hệ thống dự án (3 lỗi P0 Game-breaking, 12 lỗi P1 Critical, 14 lỗi P2 Polish, 7 lỗi P3 Tech Debt) kèm nguyên nhân gốc rễ, mã nguồn phân tích, code khắc phục đề xuất và sơ đồ Gantt triển khai.
10. [10 — Đại Kiểm Tra Hoạt Ảnh Gà, Background 10 Thế Giới, Quy Mô Địa Hình & Các Điểm Bất Hợp Lý](D:/folder/tools/godot_demo/2/docs/phan-tich-game/10-dai-kiem-tra-hoat-anh-ga-background-the-gioi-va-cac-diem-bat-hop-ly.md): **Báo cáo Chuyên sâu về Nâng Cấp Hoạt Ảnh Gà & Bối Cảnh**: Khắc phục giỏ rỗng (`LoadedEgg`), phản lực giật nảy $-18\text{px}$, 30 Vector SVG theo thế giới, thuật toán Modular Tiling $540\text{px}$ chống vỡ hình, Dynamic Cinematic Camera 3 pha và bộ dập rung lắc vi mô (Micro-Velocity Snubber).
11. [11 — Đại Phân Tích Toàn Diện: Rà Soát Lỗi, Điểm Bất Hợp Lý & Kế Hoạch Tối Ưu Hóa Game](D:/folder/tools/godot_demo/2/docs/phan-tich-game/11-tong-hop-phan-tich-loi-va-ke-hoach-cai-thien-toan-dien.md): **Bách Khoa Toàn Thư Master**: Đại bảng tổng hợp toàn bộ 28 lỗi và điểm cải thiện (từ P0 đến P3), nguyên nhân gốc rễ, mã nguồn phân tích, hoạt ảnh gà nạp đạn, bối cảnh 10 thế giới, quy mô hầm ngầm $1430\text{px}$, chuẩn hóa di động CH Play và lộ trình phát triển tiếp theo.

---

## Tóm lược Phát hiện Chính & Trạng thái Hệ thống

### 1. Những cải tiến đã hoàn tất và kiểm chứng thành công
- **Xử lý dứt điểm 8 lỗi kỹ thuật**:
  - BUG-01 (Mở khóa nút nhận thưởng quảng cáo mô phỏng).
  - BUG-02 (Bảo vệ thời gian gameplay khi Pause).
  - BUG-03 (Khử xung đột hai modal thắng/thua cùng hiện trong Last Stand).
  - BUG-04 (Theo dõi hoạt động còn lại trước khi đếm ngược thua).
  - BUG-05 (Chặn nổ lặp 24 lần của Hố đen ngoài biên).
  - BUG-06 (Đồng bộ snapshot điểm số tuyệt đối giữa UI và Save file).
  - BUG-07 (Thay ngưỡng cố định bằng tọa độ đáy linh hoạt của từng thế giới).
  - BUG-08 (Khử chuyển scene 2 lần từ nút chọn màn).
- **Vật lý vững như bàn thạch**:
  - Không còn sập công trình sớm trong thời gian chuẩn bị (Peacetime Lock $100\%$).
  - Không còn hiện tượng rung giật hay trượt chân móng khi người chơi vừa thả quả trứng đầu tiên (Inside-Out Raycasting + Bedrock Protection).
- **Âm thanh & Biểu cảm**:
  - Giãn cách phát âm va đập vật liệu và nổ bom, triệt tiêu rè vỡ tiếng.
  - Quái vật đã thực sự dõi mắt nhìn theo quả trứng đang bay và có hoạt ảnh toát mồ hôi/hoảng loạn.

### 2. Các trọng tâm cần cải thiện trong các bản cập nhật tới
- **Chuẩn hóa Phát hành Google Play Store & Di động**:
  - Ký số bản phát hành (`keystore/release`), bật Gradle Build để nhúng native SDK.
  - Sửa lỗi logic `SaveManager.gd` đang mở khóa toàn bộ 200 màn chơi về cơ chế mở tuần tự.
  - Ẩn nút `BtnReset` trên sảnh chính để loại bỏ nguy cơ xóa nhầm toàn bộ dữ liệu người chơi.
  - Tự động đệm an toàn `DisplayServer.get_display_safe_area()` cho TopBar (tránh nốt ruồi camera) và Kệ trứng (tránh thanh vuốt Home Android).
  - Khóa 60 FPS (`Engine.max_fps = 60`) chống hao pin và quá nhiệt trên màn hình $120\text{Hz}$.
  - Tạo `default_bus_layout.tres` gắn Peak Limiter để bảo vệ loa ngoài điện thoại khỏi rè vỡ khi nổ bom dây chuyền.
- **Cửa hàng và Tiêu Vàng (Currency Sink)**: Người chơi kiếm được hàng nghìn vàng nhưng chưa có tính năng tiêu dùng; cần bổ sung Khay Trứng Tiếp Viện (`BoosterTray`) trong màn chơi và Cửa hàng (`ShopModal`) ngoài sảnh chính.
- **Tinh chỉnh Chiến thuật Trứng Băng**: Cần giảm sát thương nổ ban đầu của `FrostEgg.gd` để giữ lại lớp băng giòn cho phát bắn tiếp theo, đúng tinh thần giải đố chiến thuật.
- **Bộ hạt Môi trường (Ambient Atmosphere)**: Bổ sung lá rơi, tàn lửa, bông tuyết hoặc bụi sao cho 10 thế giới để nâng tầm thị giác.
