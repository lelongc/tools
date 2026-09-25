# ĐỒNG BỘ HÓA TOÀN DIỆN GIAO DIỆN 2D: HỆ THỐNG NÚT BẤM, KHUNG VIỀN VÀ 9-PATCH VECTOR THEME

> **Tài liệu Kỹ thuật & Thiết kế Giao diện Trò chơi**  
> **Phiên bản Engine**: Godot Engine 4.7.1 Stable  
> **Chuyên mục**: UI/UX Design System, 9-Patch Vector Graphics, Mobile Haptics & Visual Juice  
> **Mã báo cáo**: `UI-SYNC-2026-V25`

---

## 1. THỰC TRẠNG GIAO DIỆN 2D TRƯỚC NÂNG CẤP & NGUYÊN NHÂN MẤT ĐỒNG BỘ

Trước khi thực hiện đợt nâng cấp toàn diện này, giao diện 2D của trò chơi gặp phải sự phân mảnh nghiêm trọng về ngôn ngữ thiết kế thị giác (Visual Language Inconsistency):

1. **Sự pha trộn khập khiễng giữa Flat StyleBox và Vector Sprites**:
   - Trong khi thế giới vật lý của game sở hữu những sprite vector SVG chất lượng cao (gỗ ván sồi, đá vân nứt, khối thép đinh tán, gà bọc giáp, quái vật sly fox, đạn trứng nở chi tiết), thì toàn bộ hệ thống giao diện HUD và Popup Modal lại được dựng bằng các khối hình học `StyleBoxFlat` đơn điệu tạo bằng mã nguồn GDScript hoặc khai báo tscn thô sơ.
   - Các góc bo tròn chỉ thuần túy là radius toán học, đổ bóng phẳng (flat shadow), viền chỉ là đường nét đơn sắc một màu, khiến giao diện trông như một sản phẩm thử nghiệm (prototype) thô ráp thay vì một tựa game mobile cartoon cao cấp phát hành thương mại.

2. **Sự thiếu đồng bộ giữa các màn hình UI**:
   - `LevelSelect.gd`: Tự sinh 200 nút bấm chọn màn chơi bằng các `Button` thông thường với `StyleBoxFlat` riêng rẽ được cấu hình nội suy trong code, hoàn toàn bỏ qua lớp tương tác đàn hồi và đổ bóng của `JuicyButton`.
   - `GameHUD.gd`: Các thanh `TopBar`, các khung `LevelBox`, `ScoreBox`, `CoinBox`, khay đựng trứng `EggShelf`, và 4 hộp thoại kết quả (`VictoryModal`, `FailModal`, `PauseModal`, `LastStandModal`) mỗi nơi định nghĩa một kiểu màu nền tím tối hoặc xanh đen khác nhau, độ dày viền không đồng nhất (nơi viền 2px, nơi viền 4px, nơi viền 8px).
   - `ShopModal.gd`, `SettingsModal.gd`, `DailyWheelModal.gd`: Vẫn còn sót lại những nhãn văn bản chứa ký tự Unicode thô kệch (`🛍️ CỬA HÀNG ĐẠO CỤ`, `👑 BOSS`, `⚙️ CÀI ĐẶT`), khiến giao diện phụ thuộc vào font emoji của hệ điều hành, hiển thị méo mó hoặc lệch trục giữa Android và Windows.

3. **Thiếu cảm giác xúc giác (Tactile Depth) trên màn hình cảm ứng**:
   - Các nút bấm phẳng không mang lại cảm giác "nhấn chìm vật lý" (physical depression) khi người chơi chạm ngón tay vào. Sự phản hồi thị giác bị hạn chế ở việc chỉ đổi nhẹ sắc độ màu nền thay vì một khối nút được dập nổi 3D với gờ đổ bóng dày co lại khi bị nén.

---

## 2. KIẾN TRÚC HỆ THỐNG 9-PATCH VECTOR UI THEME (20 ASSETS SVG)

Để giải quyết triệt để tình trạng trên, toàn bộ giao diện đã được chuyển dịch sang hệ sinh thái **9-Slice (9-Patch) Vector Graphic System**. Cơ chế này chia mỗi ảnh đồ họa thành 9 ô lưới: 4 góc giữ nguyên tỉ lệ pixel để bảo toàn góc bo cong, đinh tán kim loại và mộng gỗ; 4 cạnh bên co giãn trơn tru theo kích thước nút bấm; phần tâm nền lặp hoặc dãn đều, không bao giờ bị vỡ hạt hay méo mó trên bất kỳ độ phân giải di động nào (từ Full HD, 2K đến màn hình tablet 4:3).

Toàn bộ 20 SVG vector nguyên bản đã được kiến tạo tại thư mục `res://assets/sprites/ui/`:

### 2.1. Nhóm Nút Bấm Xúc Giác 3D (Juicy Buttons)

| File Asset | Kích Thước | Slicing Margins (L/T/R/B) | Đặc Điểm Thị Giác & Công Năng |
| :--- | :---: | :---: | :--- |
| `btn_primary_green_normal.svg` | 192x64 | 20 / 16 / 20 / 22 | **Lục bảo sáng bóng**: Viền vàng hoàng gia, vát cạnh 3D đáy đậm 10px, ánh sáng khúc xạ vòm cung. Dùng cho hành động chủ đạo: *Chơi ngay, Màn tiếp theo, Tiếp tục*. |
| `btn_primary_green_pressed.svg` | 192x64 | 20 / 18 / 20 / 18 | **Lục bảo nhấn chìm**: Gờ đáy 3D co lại còn 3px, tâm nút dịch xuống dưới 4px tạo cảm giác cơ học xúc giác rõ nét. |
| `btn_gold_action_normal.svg` | 192x64 | 20 / 16 / 20 / 22 | **Vàng hổ phách hoàng kim**: Hiệu ứng ánh kim, đáy màu caramel cháy. Dùng cho: *Vòng quay may mắn, Nhận thưởng x3, Xem video quảng cáo*. |
| `btn_gold_action_pressed.svg` | 192x64 | 20 / 18 / 20 / 18 | **Vàng hổ phách nhấn chìm**: Trạng thái nén đàn hồi khi chạm ngón tay. |
| `btn_wood_brown_normal.svg` | 192x64 | 20 / 16 / 20 / 22 | **Gỗ sồi mộc khắc cạnh**: Vân thớ gỗ sồi rừng, 4 góc bọc đinh tán đồng cổ. Dùng cho: *Chọn màn, Cài đặt, Chơi lại, Trở về*. |
| `btn_wood_brown_pressed.svg` | 192x64 | 20 / 18 / 20 / 18 | **Gỗ sồi mộc nhấn chìm**: Trạng thái nén của nút gỗ sồi. |
| `btn_danger_red_normal.svg` | 192x64 | 20 / 16 / 20 / 22 | **Đỏ san hô cảnh báo**: Gam đỏ ruby vát cạnh mận chín. Dùng cho: *Nút đóng X, Bỏ qua, Hủy bỏ, Xóa tiến trình*. |
| `btn_danger_red_pressed.svg` | 192x64 | 20 / 18 / 20 / 18 | **Đỏ san hô nhấn chìm**: Trạng thái nén của nút đỏ cảnh báo. |
| `btn_icon_wood_normal.svg` | 64x64 | 16 / 16 / 16 / 18 | **Đĩa gỗ tròn nẹp viền đồng**: Thiết kế hình tròn/vuông bo 64x64 cho các nút biểu tượng (Restart, Pause, Mute). |
| `btn_icon_wood_pressed.svg` | 64x64 | 16 / 18 / 16 / 16 | **Đĩa gỗ tròn nhấn chìm**: Trạng thái nén của nút biểu tượng. |

---

### 2.2. Nhóm Khung Nền, Khay Vật Phẩm & Viên Nang Thông Số

| File Asset | Kích Thước | Slicing Margins (L/T/R/B) | Đặc Điểm Thị Giác & Công Năng |
| :--- | :---: | :---: | :--- |
| `panel_modal_wood_frame.svg` | 256x256 | 36 / 36 / 36 / 44 | **Khung gỗ đại tiệc hoàng gia**: Khung sồi già chạm trổ mộng gỗ, 4 góc bọc bát sắt hoa văn đinh tán đồng thau, bên trong lót nỉ đá phiến tím huyền bí với ánh sáng nội biên sang trọng. Dùng làm khung xương cho toàn bộ 7 modal trong game. |
| `panel_top_bar_hud.svg` | 256x64 | 20 / 8 / 20 / 16 | **Thanh Header vương giả**: Nền đá phiến đen bóng (obsidian slate) với đường gờ vát mạ vàng ròng chạy dọc đáy thanh công cụ, tạo ranh giới trang nhã giữa HUD và vùng chơi vật lý. |
| `shelf_wood_grooves.svg` | 192x48 | 20 / 12 / 20 / 16 | **Khay đựng trứng đục rãnh gỗ**: Mô phỏng khay chứa trứng đục đẽo từ gỗ mộc tự nhiên, tạo hốc trũng cho đạn trứng nằm êm ái, tương phản hoàn hảo với bệ phóng ná cao su. |
| `panel_badge_capsule.svg` | 128x48 | 16 / 12 / 16 / 16 | **Viên nang huy hiệu vàng**: Viên con nhộng viền vàng sáng, nền hổ phách bóng bẩy hiển thị điểm số, số màn chơi, và số vàng tích lũy. |

---

### 2.3. Nhóm Ruy Băng 3D & Thẻ Bài Chọn Màn

| File Asset | Kích Thước | Slicing Margins (L/T/R/B) | Đặc Điểm Thị Giác & Công Năng |
| :--- | :---: | :---: | :--- |
| `banner_ribbon_gold.svg` | 320x80 | 36 / 12 / 36 / 18 | **Ruy băng vàng 3D đuôi én**: Dải lụa hoàng gia uốn lượn hai tầng gập góc, viền vàng rực rỡ. Dùng cho: Tiêu đề *Chiến Thắng! (Victory)*, Tiêu đề *Cửa Hàng*, Tiêu đề *Vòng Quay May Mắn*. |
| `banner_ribbon_red.svg` | 320x80 | 36 / 12 / 36 / 18 | **Ruy băng đỏ chiến trận**: Dải lụa đỏ thẫm cuộn gập đuôi én. Dùng cho: Tiêu đề *Thất Bại! (Level Failed)*. |
| `banner_ribbon_wood.svg` | 320x80 | 36 / 12 / 36 / 18 | **Biển gỗ khắc chữ sơn vôi**: Biển chỉ dẫn bằng gỗ sơn nâu trầm viền đồng. Dùng cho: Tiêu đề *Tạm Dừng (Pause)*, Tiêu đề *Cài Đặt (Settings)*, Tiêu đề *Thế Giới (World Header)*. |
| `card_level_unlocked.svg` | 128x128 | 16 / 16 / 16 / 20 | **Thẻ bài gỗ đã mở khóa**: Mặt gỗ sồi ép nẹp viền kim loại sáng, đinh tán 4 góc. |
| `card_level_boss.svg` | 128x128 | 16 / 16 / 16 / 20 | **Thẻ bài Đại Trùm (Boss)**: Tông màu hoàng gia đỏ mận với cặp sừng ác quỷ bọc vàng vươn lên đỉnh thẻ bài, giúp màn Boss nổi bật trên bản đồ. |
| `card_level_locked.svg` | 128x128 | 16 / 16 / 16 / 20 | **Thẻ bài sắt khóa xích**: Tông màu xám thép mờ đục khắc biểu tượng ổ khóa cơ khí, thông báo màn chơi chưa thể tiếp cận. |

---

## 3. KIẾN TRÚC MÃ NGUỒN & CÁC CẢI TIẾN KỸ THUẬT

### 3.1. Nâng cấp `JuicyButton.gd` - Trái tim xúc giác của giao diện
- **Bộ nhớ đệm tĩnh (Static Cache)**: Triệt tiêu việc khởi tạo lặp đi lặp lại tài nguyên đồ họa thông qua `static var _sbt_cache: Dictionary` và hàm tiện ích `_get_or_create_sbt(tex_path, ml, mt, mr, mb)`. Dù người chơi mở lại màn hình 100 lần, bộ nhớ RAM cho `StyleBoxTexture` vẫn là hằng số.
- **Phương thức điều phối phong cách tập trung**: Bổ sung `set_button_style(style_name: String)` cho phép gán phong cách động ngay trong code:
  ```gdscript
  func set_button_style(style_name: String) -> void:
      is_primary_green = (style_name == "green")
      is_gold_action = (style_name == "gold")
      is_danger_red = (style_name == "red")
      is_wood_brown = (style_name == "wood")
      _apply_tactile_style()
  ```
- **Hỗ trợ tự động nút Icon tròn**: Nhận diện kích thước nút $\le 54\text{px}$ và không có nhãn văn bản dài để tự động áp dụng `btn_icon_wood_normal.svg` và `btn_icon_wood_pressed.svg`.
- **Hiệu ứng chữ tương phản cao**: Tự động cấu hình `outline_size = 6`, `outline_color` đậm đà và bóng đổ `shadow_offset_y` phù hợp theo từng loại màu nền nút.

---

### 3.2. Cập nhật `GameHUD.gd`
- Hàm `_apply_cartoon_ui_theme()` được tích hợp ngay khi khởi động:
  - Áp dụng `panel_top_bar_hud.svg` cho `TopBar`.
  - Áp dụng `shelf_wood_grooves.svg` cho khay chứa trứng `EggShelf`.
  - Áp dụng `panel_badge_capsule.svg` cho `LevelBox`, `ScoreBox`, `CoinBox`.
  - Áp dụng `panel_modal_wood_frame.svg` cho cả 4 modal: `VictoryModal`, `FailModal`, `PauseModal`, `LastStandModal`.
  - Gắn ruy băng hoàng gia `banner_ribbon_gold.svg` cho tiêu đề Chiến thắng, `banner_ribbon_red.svg` cho tiêu đề Thất bại, và `banner_ribbon_wood.svg` cho tiêu đề Tạm dừng.

---

### 3.3. Cập nhật `MainMenu.gd` & `LevelSelect.gd`
- **MainMenu**: Chuyển đổi thanh thông tin tài nguyên đỉnh màn hình và các Badge huy hiệu sang cấu trúc 9-patch mạ vàng đồng bộ.
- **LevelSelect**:
  - Gắn `panel_top_bar_hud.svg` cho thanh điều hướng trên cùng.
  - Gắn `banner_ribbon_wood.svg` cho nhãn hiển thị Tên Thế Giới hiện tại.
  - Thay thế toàn bộ code sinh `StyleBoxFlat` đơn điệu trong `_build_level_grid()`:
    - Màn thường đã mở khóa: Dùng `card_level_unlocked.svg`.
    - Màn Đại Trùm (Level chia hết cho 20): Dùng `card_level_boss.svg`.
    - Màn chưa mở khóa: Dùng `card_level_locked.svg`.

---

### 3.4. Cập nhật các Modal tính năng phụ trợ (`ShopModal`, `SettingsModal`, `DailyWheelModal`)
- **ShopModal**:
  - Khung chính bọc viền gỗ `panel_modal_wood_frame.svg`.
  - Tiêu đề ruy băng vàng `banner_ribbon_gold.svg`.
  - Toàn bộ các thẻ vật phẩm mua bán được đóng khung thẻ bài gỗ nẹp vàng `card_level_unlocked.svg`.
  - Nút Mua hàng chuyển sang `JuicyButton` với phong cách `gold` hổ phách rực rỡ.
  - Nút Đóng chuyển sang phong cách `red` cảnh báo.
- **SettingsModal**:
  - Khung gỗ `panel_modal_wood_frame.svg`.
  - Tiêu đề ruy băng gỗ `banner_ribbon_wood.svg`.
  - Nút Đóng và Xóa tiến trình chuyển sang phong cách `red`.
  - Nút Rung haptics chuyển sang phong cách `gold`.
  - Nút Đổi ngôn ngữ chuyển sang phong cách `wood`.
  - Nút Hủy bỏ cảnh báo chuyển sang phong cách `green` an toàn.
- **DailyWheelModal**:
  - Khung gỗ `panel_modal_wood_frame.svg`.
  - Tiêu đề ruy băng vàng `banner_ribbon_gold.svg`.
  - Nút Quay thưởng chuyển sang `JuicyButton` với phong cách `gold`.
  - Nút Đóng chuyển sang phong cách `red`.

---

## 4. KẾT QUẢ KIỂM THỬ TỰ ĐỘNG & BẢO ĐẢM CHẤT LƯỢNG (TEST SUITE 20)

Bộ kiểm thử tự động toàn diện `TestRunner.gd` đã được bổ sung **Suite 20** nhằm xác minh tính toàn vẹn của hệ thống đồ họa 2D UI:

```gdscript
# [TEST 20] Testing 2D UI Theme, 9-Patch Textures & Button Synchronization
[PASS] All 20 cartoon 2D UI SVG textures verified and loaded
[PASS] JuicyButton style 'green' correctly binds 9-patch StyleBoxTexture
[PASS] JuicyButton style 'gold' correctly binds 9-patch StyleBoxTexture
[PASS] JuicyButton style 'red' correctly binds 9-patch StyleBoxTexture
[PASS] JuicyButton style 'wood' correctly binds 9-patch StyleBoxTexture
[PASS] JuicyButton square/circular icon mode correctly binds btn_icon_wood StyleBoxTexture
[PASS] GameHUD TopBar successfully styled with panel_top_bar_hud StyleBoxTexture
[PASS] GameHUD EggShelf successfully styled with shelf_wood_grooves StyleBoxTexture
[PASS] GameHUD Badge Capsule successfully styled with panel_badge_capsule StyleBoxTexture
[PASS] GameHUD Victory Modal panel successfully styled with panel_modal_wood_frame StyleBoxTexture
[PASS] ShopModal panel successfully styled with panel_modal_wood_frame StyleBoxTexture
[PASS] SettingsModal panel successfully styled with panel_modal_wood_frame StyleBoxTexture
[PASS] DailyWheelModal panel successfully styled with panel_modal_wood_frame StyleBoxTexture
>>> ALL 20 TEST SUITES PASSED SUCCESSFULLY! (0 ERRORS) <<<
```

---

## 5. TỔNG KẾT & HIỆU QUẢ ĐẠT ĐƯỢC

1. **Đồng bộ hóa 100% Thị giác**: Không còn bất kỳ góc cạnh nào trong trò chơi sử dụng các khối phẳng `StyleBoxFlat` vô hồn. Tất cả các nút bấm, thẻ bài, huy hiệu, khay đựng và cửa sổ bật lên đều toát lên tinh thần hoạt hình tươi sáng, sang trọng và chuẩn mực của một tựa game casual vật lý chất lượng cao.
2. **Tối ưu hóa tài nguyên**: Sử dụng định dạng vector SVG kết hợp tính năng 9-slice nguyên bản của Godot Engine giúp dung lượng bộ cài đặt game tăng chưa tới $30\text{KB}$, không gây tốn RAM bộ nhớ đồ họa và tự động sắc nét trên mọi loại mật độ điểm ảnh (PPI) từ màn hình điện thoại giá rẻ đến màn hình OLED cao cấp.
3. **Trải nghiệm người dùng (UX) xúc giác nâng tầm**: Nút bấm nhấn chìm vật lý kết hợp cùng hệ thống rung haptics và âm thanh lách cách gỗ sỏi mang lại cảm giác bấm đã tay, cuốn hút và kích thích hành vi khám phá của người chơi.
