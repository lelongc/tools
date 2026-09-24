# Hồ sơ Phân tích Kỹ thuật và Kế hoạch Nâng cấp Toàn diện

**Tên dự án:** Cluck & Drop: Bunker Buster  
**Phiên bản Engine:** Godot `4.7.1-stable` (Renderer: `GL Compatibility`, Viewport: $540 \times 960$)  
**Thời gian cập nhật:** 24/09/2026  
**Trạng thái hiện tại:** Đã hoàn tất 100% các bản vá P0/P1/P2/P3, hoạt ảnh gà nạp đạn, 30 SVG 10 thế giới, rung haptics, hạt khí quyển ambient, hệ thống animation gà đa tầng và dọn dẹp triệt để các lỗi tiềm ẩn (14/14 Bộ Test Tự Động Vượt Qua Tuyệt Đối).

---

## Danh Mục Toàn Bộ Tài Liệu Phân Tích & Kế Hoạch (Đọc theo thứ tự)

### Nhóm 1: Nền Tảng Kỹ Thuật & Lịch Sử Nâng Cấp
1. [10 — Đại Kiểm Tra Hoạt Ảnh Gà, Background 10 Thế Giới, Quy Mô Địa Hình & Các Điểm Bất Hợp Lý](10-dai-kiem-tra-hoat-anh-ga-background-the-gioi-va-cac-diem-bat-hop-ly.md): **Báo cáo Chuyên sâu về Nâng Cấp Hoạt Ảnh Gà & Bối Cảnh**: Khắc phục giỏ rỗng (`LoadedEgg`), phản lực giật nảy $-18\text{px}$, 30 Vector SVG theo thế giới, thuật toán Modular Tiling $540\text{px}$ chống vỡ hình, Dynamic Cinematic Camera 3 pha và bộ dập rung lắc vi mô (Micro-Velocity Snubber).
2. [11 — Đại Phân Tích Toàn Diện: Rà Soát Lỗi, Điểm Bất Hợp Lý & Kế Hoạch Tối Ưu Hóa Game](11-tong-hop-phan-tich-loi-va-ke-hoach-cai-thien-toan-dien.md): **Bách Khoa Toàn Thư Master**: Đại bảng tổng hợp toàn bộ 28 lỗi và điểm cải thiện (từ P0 đến P3), nguyên nhân gốc rễ, mã nguồn phân tích, hoạt ảnh gà nạp đạn, bối cảnh 10 thế giới, quy mô hầm ngầm $1430\text{px}$, chuẩn hóa di động CH Play và lộ trình phát triển tiếp theo.

### Nhóm 2: Thiết Kế Mỹ Thuật, Cân Bằng Màn Chơi & Chiến Lược Phát Hành
3. [12 — Đại Phẫu Giao Diện (UI/UX) & Nâng Cấp Texture, Đồ Họa, Hiệu Ứng Hình Ảnh (VFX & Shaders)](12-dai-phau-giao-dien-ui-ux-va-nang-cap-texture-do-hoa.md): **Đại Phẫu Trực Quan & Thẩm Mỹ**:
   - Phân tích công thái học UI/UX trên MainMenu, LevelSelect, GameHUD và các Modal.
   - Loại bỏ rủi ro nút `BtnReset` trên sảnh chính, xây dựng `SettingsModal.tscn` 2 bước an toàn.
   - Nạp Vector SVG độ nét cao, 10 loại vật liệu khối và 2 cấp độ nứt vỡ chân thực.
   - 11 biểu cảm quái vật Memeable (mắt dõi theo đạn, toát mồ hôi hoảng sợ, cười cợt khi bắn trượt).
   - Hiệu ứng ánh sáng động (`PointLight2D`) và chữ hành động truyện tranh (`Comic Action Popups`).
4. [13 — Chuyên Sâu Cân Bằng Độ Khó, Thiết Kế 200 Màn Chơi Chiến Dịch & 10 Đại Trùm (World Bosses)](13-chuyen-sau-can-bang-do-kho-thiet-ke-200-man-va-dai-trum.md): **Thiết Kế Màn Chơi & Cân Bằng Chiến Thuật**:
   - Bảng thống kê chi tiết 200 màn chơi trải dài 10 Thế Giới (1.574 quái vật, 7.076 khối vật liệu, 438 tảng đá lăn, 577 thùng nổ).
   - Ma trận tương quan sát thương 7 loại trứng vs 10 loại vật liệu khối boong-ke.
   - Khắc phục "Nghịch lý 3 Sao" bằng công thức tính điểm Hybrid ($\ge 90\%$ công trình nát thưởng 3 sao).
   - Thiết kế cơ chế độc đáo cho 10 Trận Chiến Đại Trùm Thế Giới (từ Baron Pig đến Singularity Prime).
5. [14 — Chiến Lược Toàn Diện Đưa Game Lên YOUTUBE: Nền Tảng YouTube Playables & Cơ Chế Viral Video Triệu View](14-chien-luoc-dua-game-len-youtube-viral-content-va-playables.md): **Chiến Lược YouTube Kép**:
   - **YouTube Playables**: HTML5 WebAssembly, tích hợp SDK `YT.playables` (`gameReady`, `sendScore`, `onPause`, `onResume`), ngân sách tải $< 5\text{s}$, dung lượng nhẹ.
   - **Viral Shorts / TikTok / Reels**: Tâm lý học phá hủy vật lý ASMR, Bullet-Time Slow-Mo điểm nổ, Instant Replay và Thumbnail Photo Finish.
6. [15 — Cẩm Nang Toàn Diện Chuẩn Hóa Kỹ Thuật & Chiến Lược Phát Hành Lên CH PLAY (Google Play Store 2026)](15-chuan-hoa-va-ke-hoach-phat-hanh-chplay-google-play-store.md): **Cẩm Nang Phát Hành CH Play 2026**:
   - Tiêu chuẩn kỹ thuật: Target SDK 34/35 (Android 14/15), 64-bit `arm64-v8a`, AAB, Keystore SHA-256.
   - Tối ưu phần cứng: Khóa 60 FPS, RAM $< 180\text{MB}$, Auto-Pause vòng đời Android, Back Button 2 lần, Safe Area.
   - Chính sách Google Play Families Policy (3+), COPPA, Data Safety Form, 4 vị trí Rewarded Ads tự nguyện.

### Nhóm 3: Đại Phẫu Hiệu Năng, Lỗi Tiềm Ẩn, Bảo Mật & Đảm Bảo Chất Lượng (MỚI)
7. [16 — Đại Phẫu Hiệu Năng & Tối Ưu Hóa Mobile Toàn Diện (Chuyên Sâu Godot 4)](16-dai-phau-hieu-nang-va-toi-uu-hoa-mobile-toan-dien.md): **Bóc Tách Khung Hình & Bộ Nhớ**:
   - Phân tích hiện tượng khựng khung hình (Jank Spikes) do cấp phát động 90 Nodes/Tweens trong 1 frame khi nổ lớn.
   - Nút thắt Draw Calls trên renderer GL Compatibility & kỹ thuật Sprite Sheet / Texture Atlas.
   - Kiến trúc **Zero-Allocation Object Pooling** (`FlyingShardPool`, Particle & Popup recycling).
   - Màn hình tần số quét cao 90Hz / 120Hz vs 60Hz physics ticks: kích hoạt `physics_interpolation`.
   - Giảm tiêu hao pin và quá nhiệt (Thermal Throttling) bằng Staggered Raycasts và `low_processor_usage_mode`.
   - Lộ trình giảm kích thước gói cài đặt APK/AAB & WebAssembly (từ 58.5MB xuống 27.3MB).
8. [17 — Phẫu Thuật Lỗi Tiềm Ẩn, Tình Huống Biên (Edge Cases) & Bảo Mật Hệ Thống Lưu Trữ (Save Game)](17-phau-thuat-loi-tiem-an-edge-cases-va-bao-mat-save-game.md): **Trị Lỗi Tận Gốc & Chống Gian Lận**:
   - Lỗi vật lý xuyên thấu (CCD Tunneling) ở `RollingBoulder` và `ClusterChick` qua sàn gỗ mỏng.
   - Xung đột đa chạm (Multi-touch race conditions) và giật vệt ngắm gà trên màn hình cảm ứng di động.
   - Xung đột Tap-in-Flight khóa ngắm trước quả trứng tiếp theo và giải pháp phân luồng input.
   - Lỗ hổng khuyết thiếu Safe Area trên `MainMenu.tscn`, `LevelSelect.tscn`, `SettingsModal.tscn`.
   - Quá tải âm thanh kỹ thuật số (Audio Headroom Clamping & Hard Clipping) khi nổ dây chuyền 15 khối.
   - Lỗ hổng can thiệp file save JSON Plaintext và trò gian lận chỉnh giờ máy (Time-Travel Exploit) ở Vòng Quay May Mắn.
   - Quy tắc WebAudio User Gesture Autoplay và callback Mute/Pause trên YouTube Playables.
   - Lỗi kẹt vòm vật lý (Arch Wedging Stalemate) và bộ đếm phán quyết thông minh ($2.8\text{s}$).
9. [18 — Ma Trận Kiểm Thử Chất Lượng (QA), Bảo Hiểm Phát Hành CH Play & Lộ Trình Nâng Cấp 2026](18-kiem-thu-chat-luong-qa-tuan-thu-chplay-va-lo-trinh-phat-trien.md): **Bảo Hiểm Chất Lượng Sản Phẩm & LiveOps**:
   - Ma trận tương thích phần cứng thiết bị di động (Ultra Low Helio G35, Mid-Range Snapdragon 680, Màn hình gập Fold).
   - Kiểm thử tự động hỗn loạn (Automated Monkey Stress Testing) 10.000 thao tác giả lập không crash.
   - Kế hoạch vượt ải chính sách bắt buộc 14 ngày/20 Tester của Google Play Console cho tài khoản mới 2026.
   - Quản trị chỉ số sinh tồn Google Play Core Vitals (Crash Rate $< 0.25\%$, ANR Rate $< 0.47\%$).
   - Kiến trúc đồng bộ đám mây Hybrid Cloud Save v2 theo quy tắc Non-Destructive Union Merge.
   - Lộ trình tính năng LiveOps mở rộng: Điểm danh 7 ngày, Thử thách vô tận Endless Bunker, Trình tạo màn chơi cộng đồng (Community Bunker Builder) chia sẻ mã Base64.

---

## Tóm Lược Trạng Thái Hệ Thống & Kiểm Thử Tự Động

```
================================================================
>>> ALL 14 TEST SUITES PASSED SUCCESSFULLY! (0 ERRORS, 0 WARNINGS) <<<
================================================================
```
- **0 Lỗi logic, 0 Cảnh báo rò rỉ bộ nhớ ObjectDB, Return Code 0**.
- Hệ sinh thái dự án đã hoàn thiện trọn vẹn **9 bộ tài liệu kỹ thuật đỉnh cao** (từ Tài liệu 10 đến Tài liệu 18), phủ kín $100\%$ các khía cạnh: engine, mỹ thuật, cân bằng, hiệu năng, lỗi tiềm ẩn, bảo mật, YouTube Playables và CH Play Store 2026.
