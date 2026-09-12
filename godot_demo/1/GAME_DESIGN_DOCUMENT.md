# 🐡 TÀI LIỆU THIẾT KẾ GAME (GAME DESIGN DOCUMENT)
# PUFFY POP: BOUNCY HERO (CÁ NÓC BUNG LỤA: SIÊU NẢY ĐẠI CHIẾN)

---

## 🌊 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

* **Tên Game:** PUFFY POP: BOUNCY HERO *(Cá Nóc Bung Lụa: Siêu Nảy Đại Chiến)*
* **Thể Loại:** Physics-Driven Quirky Casual-Action / Slingshot Pinball Adventure
* **Nền Tảng Đích:** Mobile (Android / iOS) & PC (Steam / Steam Deck) - Màn hình Ngang (Landscape 16:9 / 18:9)
* **Engine:** Godot Engine 4.7.1 (Compatibility Renderer / GL3)
* **Phong Cách Đồ Họa:** 2D Vibrant Tropical Cartoon, Squash & Stretch Physics, Googly Eyes Meme Humor
* **Mô Hình Kinh Doanh:** Free-to-Play + Rewarded Ads + IAP Gói Mở Khóa Skin Cá Nóc Hài Hước trên Mobile; Buy-to-Play $4.99 trên Steam PC.
* **Mục Tiêu Thị Trường:** Đạt **10,000,000+ lượt tải** toàn cầu nhờ tính năng tạo clip ngắn (Shorts / TikTok) hài hước và lối chơi thân thiện với mọi lứa tuổi từ trẻ em đến người già.

---

## 💡 2. CỐT TRUYỆN HÀI HƯỚC & NHÂN VẬT (CHARACTER & STORY)

Lũ Cua Cướp Biển (*Pirate Crab Clan*) do Cua Độc Nhãn (*One-Eyed Captain Claw*) cầm đầu đã chiếm đóng vịnh biển san hô Thiên Đường (*Sunny Coral Bay*) và cướp hết Ngọc Trai Cầu Vồng.

Chú **Cá Nóc Puffy** - một chú cá nóc béo tròn, mắt lồi ngơ ngác nhưng sở hữu năng lực co giãn cơ thể phi thường - quyết định tham gia chiến dịch giải cứu vịnh biển:
* Khi ở trạng thái bình thường, Puffy nhỏ nhắn, bơi lội luồn lách qua các khe đá hẹp.
* Khi gặp nguy hiểm hoặc cần phá hủy vật cản: Puffy **PHỒNG TO ĐÙNG GẤP 3 LẦN**, hóa thành quả bóng nảy gai nhọn siêu đàn hồi, nảy tưng bừng giữa các vách đá và đè bẹp lũ cua cướp biển!
* Khi cần bứt tốc: Puffy **XÌ HƠI PHẢN LỰC**, phóng ra luồng khí bọt nước cực mạnh đẩy vút thân mình đi như một quả ngư lôi!

---

## 🎮 3. CƠ CHẾ CHƠI ĐỘT PHÁ & ĐIỀU KHIỂN (INNOVATIVE GAMEPLAY MECHANICS)

### A. Kéo & Bắn Ná Nước Trực Quan (Slingshot Drag-to-Aim)
* **Thao tác 1 ngón tay / Chuột:** Chạm và kéo lùi Puffy lại phía sau $\rightarrow$ Dây cung bọt nước căng ra.
* **Vạch ngắm dự đoán (Trajectory Arc):** Hiển thị đường chấm bi phát sáng chỉ rõ hướng bay và điểm nảy dự kiến vào tường san hô.
* **Nhả tay:** Puffy phóng vút đi với âm thanh cao su bật "Boing!".

### B. Cơ Chế "Tap-in-Flight" (Kích Hoạt Kỹ Năng Khi Đang Bay)
Khác biệt hoàn toàn với các game bắn góc tĩnh nhàm chán, người chơi được tương tác trực tiếp khi Puffy đang lướt trong không trung:
1. **LẦN CHẠM 1 $\rightarrow$ BÙNG PHỒNG TO (INFLATE!):**
   * Puffy phồng to lập tức từ bán kính $22\text{px}$ lên $65\text{px}$ với âm thanh "FWOOOOMPH!".
   * Độ nảy tăng vọt lên $115\%$ (Bouncy Pinball). Puffy húc vỡ vụn các khối đá san hô, đập tung thùng gỗ và nghiền bẹp lũ cua cướp biển!
2. **LẦN CHẠM 2 $\rightarrow$ XÌ HƠI PHẢN LỰC (JET DEFLATE!):**
   * Puffy xì hơi phát ra tiếng "Pffffrrtt!" hài hước, phụt ra luồng bọt nước đẩy Puffy lao thẳng về phía trước với vận tốc $\times 3$, xuyên thủng mọi hàng rào bẫy!
3. **Squash & Stretch Cực Đại:** Mỗi khi va vào tường đá hoặc nấm san hô, thân mình Puffy bị bẹp méo đàn hồi theo góc va chạm, mắt xoay tít lồi ra cực kỳ buồn cười.

### C. Các Yếu Tố Tương Tác Trên Màn Chơi (Interactive Level Elements)
* **Nấm Xốp Siêu Nảy (Pinball Sponge Bumpers):** Đẩy Puffy nảy bật ra với lực cực đại kèm âm thanh "Boing-boing!", tạo ra những pha nảy liên hoàn pinball mãn nhãn.
* **Bong Bóng Ngọc Trai (Pearl Bubbles):** Thu thập để tích lũy điểm 3 sao và tiền mua skin.
* **Cua Cướp Biển (Pirate Crabs):** Địch thủ chính. Khi bị Puffy phồng to đè trúng sẽ bị hất văng xoay tròn rớt khỏi màn hình.
* **Vòng Xoáy Vàng (Golden Whirlpool):** Đích đến của mỗi màn chơi để giành chiến thắng.

---

## 📈 4. CHIẾN LƯỢC VIRAL $0 TRIỆU ĐÔ (TIKTOK & SHORTS MAGNET)

1. **Hiệu Ứng Hài Hước Trong 3 Giây Đầu (The 3-Second Hook):**
   * Gương mặt ngơ ngác của Puffy biến dạng khi phồng to và tiếng xì hơi "Pffffrtt!" tự nhiên gây cười cực mạnh trên TikTok và YouTube Shorts.
2. **Những Pha Lật Kèo Pinball (Trickshot & Clutch Moments):**
   * Chỉ còn 1 lần phóng cuối cùng, Puffy nảy liên tục qua 10 nấm san hô, diệt sạch 5 con cua và rơi tọt vào vòng xoáy chiến thắng $\rightarrow$ Tạo ra các clip triệu view tự nhiên từ người chơi.
3. **Bộ Sưu Tập Skin "Meme" Hài Hước:**
   * Cá Nóc Donut Rắc Cốm
   * Cá Nóc Bánh Mì Kẹp Thịt (Burger Puff)
   * Cá Nóc Mèo Hoàng Gia
   * Cá Nóc Quả Bóng Đá
