# Hồ sơ Phân tích Kỹ thuật và Kế hoạch Nâng cấp Toàn diện

**Tên dự án:** Cluck & Drop: Bunker Buster  
**Phiên bản Engine:** Godot `4.7.1-stable` (Renderer: `GL Compatibility`, Viewport: $540 \times 960$)  
**Thời gian cập nhật:** 24/09/2026  
**Trạng thái hiện tại:** Đã hoàn tất 100% các bản vá P0/P1/P2/P3, hoạt ảnh gà nạp đạn, 30 SVG 10 thế giới, rung haptics, hạt khí quyển ambient và dọn dẹp rò rỉ bộ nhớ (12/12 Bộ Test Tự Động Vượt Qua Tuyệt Đối).

---

## Danh Mục Toàn Bộ Tài Liệu Phân Tích & Kế Hoạch (Đọc theo thứ tự)

### Nhóm Tài Liệu Nền Tảng & Lịch Sử Nâng Cấp:
1. [10 — Đại Kiểm Tra Hoạt Ảnh Gà, Background 10 Thế Giới, Quy Mô Địa Hình & Các Điểm Bất Hợp Lý](10-dai-kiem-tra-hoat-anh-ga-background-the-gioi-va-cac-diem-bat-hop-ly.md): **Báo cáo Chuyên sâu về Nâng Cấp Hoạt Ảnh Gà & Bối Cảnh**: Khắc phục giỏ rỗng (`LoadedEgg`), phản lực giật nảy $-18\text{px}$, 30 Vector SVG theo thế giới, thuật toán Modular Tiling $540\text{px}$ chống vỡ hình, Dynamic Cinematic Camera 3 pha và bộ dập rung lắc vi mô (Micro-Velocity Snubber).
2. [11 — Đại Phân Tích Toàn Diện: Rà Soát Lỗi, Điểm Bất Hợp Lý & Kế Hoạch Tối Ưu Hóa Game](11-tong-hop-phan-tich-loi-va-ke-hoach-cai-thien-toan-dien.md): **Bách Khoa Toàn Thư Master**: Đại bảng tổng hợp toàn bộ 28 lỗi và điểm cải thiện (từ P0 đến P3), nguyên nhân gốc rễ, mã nguồn phân tích, hoạt ảnh gà nạp đạn, bối cảnh 10 thế giới, quy mô hầm ngầm $1430\text{px}$, chuẩn hóa di động CH Play và lộ trình phát triển tiếp theo.

### Nhóm Tài Liệu Đột Phá Mới (UI/UX, Texture, 200 Màn, YouTube & CH Play):
3. [12 — Đại Phẫu Giao Diện (UI/UX) & Nâng Cấp Texture, Đồ Họa, Hiệu Ứng Hình Ảnh (VFX & Shaders)](12-dai-phau-giao-dien-ui-ux-va-nang-cap-texture-do-hoa.md): **Đại Phẫu Trực Quan & Thẩm Mỹ**:
   - Phân tích công thái học UI/UX trên MainMenu, LevelSelect, GameHUD và các Modal.
   - Loại bỏ rủi ro nút `BtnReset` trên sảnh chính, đề xuất thiết kế `SettingsModal.tscn`.
   - Phân tích cơ chế nạp Vector SVG độ nét cao không vỡ hạt, 10 loại vật liệu khối và 2 cấp độ nứt vỡ.
   - 11 biểu cảm quái vật Memeable (mắt dõi theo đạn, toát mồ hôi hoảng sợ, cười đắc ý khi người chơi bắn trượt).
   - Đề xuất bổ sung hiệu ứng ánh sáng động (CanvasModulate / PointLight2D) và chữ hành động truyện tranh (Comic Action Popups: "BOOM!", "SQUASH!").
4. [13 — Chuyên Sâu Cân Bằng Độ Khó, Thiết Kế 200 Màn Chơi Chiến Dịch & 10 Đại Trùm (World Bosses)](13-chuyen-sau-can-bang-do-kho-thiet-ke-200-man-va-dai-trum.md): **Thiết Kế Màn Chơi & Cân Bằng Chiến Thuật**:
   - Bảng thống kê chi tiết 200 màn chơi trải dài 10 Thế Giới (1.574 quái vật, 7.076 khối vật liệu, 438 tảng đá lăn, 577 thùng nổ).
   - Ma trận tương quan sát thương 7 loại trứng vs 10 loại vật liệu khối boong-ke.
   - Phân tích và khắc phục "Nghịch lý 3 Sao" bằng công thức tính điểm Hybrid (phá hủy $\ge 90\%$ công trình tự động thưởng 3 sao).
   - Thiết kế cơ chế độc đáo cho 10 Trận Chiến Đại Trùm Thế Giới (World Bosses từ Màn 20 Baron Pig đến Màn 200 Singularity Prime).
   - Phân tích bẫy môi trường (Tảng đá lăn, Quạt gió Updraft, Thùng Nuke và Lồng gà con cứu hộ).
5. [14 — Chiến Lược Toàn Diện Đưa Game Lên YOUTUBE: Nền Tảng YouTube Playables & Cơ Chế Viral Video Triệu View](14-chien-luoc-dua-game-len-youtube-viral-content-va-playables.md): **Chiến Lược YouTube Kép**:
   - **Trụ cột 1 (YouTube Playables)**: Tích hợp HTML5 WebAssembly, chuẩn SDK `YouTube Game API v1` (`init`, `gameReady`, `sendScore`, `onPause`, `onResume`), ngân sách tải trang $< 5\text{s}$, kích thước build siêu nhẹ $< 5\text{MB}$.
   - **Trụ cột 2 (Viral Shorts / TikTok / Reels)**: Tâm lý học người xem video phá hủy vật lý thỏa mãn (Satisfying ASMR Destruction), Slow-Motion Bullet-Time tại điểm nổ đỉnh cao, Comic Action Popups, Biểu cảm quái vật Memeable.
   - Tính năng độc quyền cho Creator: Chế độ xem lại pha nổ đẹp (Instant Replay) và công cụ chụp Thumbnail sắc nét không dính UI (Photo Finish).
   - Bộ 10 kịch bản video Shorts triệu view và công thức đặt tiêu đề giật tít thu hút người xem.
6. [15 — Cẩm Nang Toàn Diện Chuẩn Hóa Kỹ Thuật & Chiến Lược Phát Hành Lên CH PLAY (Google Play Store 2026)](15-chuan-hoa-va-ke-hoach-phat-hanh-chplay-google-play-store.md): **Cẩm Nang Phát Hành CH Play 2026**:
   - Tiêu chuẩn kỹ thuật bắt buộc: Target SDK 34/35 (Android 14/15), 64-bit `arm64-v8a`, định dạng Android App Bundle (`.aab`), Keystore SHA-256 release signing.
   - Tối ưu phần cứng: Khóa 60 FPS chống nóng pin, tối ưu RAM $< 180\text{MB}$, quản lý vòng đời Android Auto-Pause, xử lý phím Back vật lý 2 lần, Safe Area tai thỏ DisplayServer.
   - Tuân thủ pháp lý: Google Play Families Policy (3+ / Everyone), COPPA, Tuyên bố An toàn Dữ liệu (Data Safety Form), chuẩn quảng cáo Google Better Ads Standards.
   - Kiến trúc kiếm tiền: 4 vị trí Rewarded Ads tự nguyện, kế hoạch gói In-App Purchase (IAP No Ads, Starter Pack).
   - Bộ tài sản Store Listing & Kế hoạch ASO: Icon $512 \times 512$, Feature Graphic $1024 \times 500$, bộ 6 ảnh chụp màn hình $9:16$ có chữ hook, bài mô tả chuẩn SEO tiếng Việt và tiếng Anh.
   - Quy trình 7 bước đóng gói và phát hành ứng dụng lên Google Play Console.

---

## Tóm Lược Trạng Thái Hệ Thống & Kiểm Thử Tự Động

```
================================================================
>>> ALL 12 TEST SUITES PASSED SUCCESSFULLY! (0 ERRORS, 0 WARNINGS) <<<
================================================================
```
- **0 Lỗi logic, 0 Cảnh báo rò rỉ bộ nhớ ObjectDB, Return Code 0**.
- Hệ sinh thái dự án đã sẵn sàng $100\%$ về mặt tài liệu kiến trúc, kỹ thuật engine và mỹ thuật để triển khai hoàn thiện và đưa lên **YouTube Playables** cùng **Google Play Store (CH Play)**.
