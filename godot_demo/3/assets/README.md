# 🎨 HƯỚNG DẪN THAY THẾ MODEL 3D, TEXTURE & ÂM THANH (PLUG-AND-PLAY)

Tựa game **"CLUCK & SPLAT 3D: CONGA WHIP MAYHEM"** được xây dựng với hệ thống **3D Procedural Mesh & Vật lý Ragdoll**. Tựa game có thể chạy mượt mà ngay bây giờ mà không cần file ngoài, đồng thời hỗ trợ cơ chế cắm-và-chạy (Plug & Play) để bạn thả Model 3D từ Blender (`.glb`), Texture và Âm thanh vào bất cứ lúc nào:

---

## 1. Thư mục Model 3D (`assets/models/`)
Bạn có thể xuất từ Blender định dạng `.glb` hoặc `.gltf`:
- `chicken_p1.glb`: Model chú gà Đỏ Neon (P1).
- `chicken_p2.glb`: Model chú gà Xanh Neon (P2).
- `chicken_p3.glb`: Model chú gà Vàng Neon (P3).
- `chicken_p4.glb`: Model chú gà Xanh Lá Neon (P4).
- `mannequin.glb`: Model hình nhân ma-nơ-canh trắng (khớp nối lò xo).
- `score_vault.glb`: Model đài nạp điểm trung tâm.
- `trampoline.glb`: Model bục nhún lò xo góc đài.

*(Nếu chưa có file, game sẽ tự động vẽ Model 3D Procedural hoạt hình siêu ngộ nghĩnh, mắt googly eyes lắc lư và phát sáng neon)*.

---

## 2. Thư mục Âm Thanh & Nhạc Nền (`assets/audio/`)
Hỗ trợ định dạng `.wav`, `.mp3`, `.ogg`:
- `attach.wav`: Tiếng hút 'phập' khi dính hình nhân vào đuôi roi.
- `dash.wav`: Tiếng gió rít vút khi lướt bẻ lái quất roi.
- `whip_hit.wav`: Tiếng roi quất đôm đốp trúng người đối thủ.
- `bank_score.wav`: Tiếng chuông vàng leng keng nạp điểm bùng nổ combo.
- `steal.wav`: Tiếng 'xoẹt' khi cắt đứt và cướp đuôi đối thủ.
- `boing.wav`: Tiếng lò xo bục nhún bật tung nhân vật lên trời.
- `bonk.wav`: Tiếng va đập choáng váng sao bay quanh đầu.
- `cheer.wav`: Tiếng reo hò vinh danh Vua Quất Roi.
- `bgm.ogg`: Nhạc nền tiệc tùng arcade sôi động.

*(Nếu chưa có file âm thanh bên ngoài, game sẽ tự động tạo âm thanh bằng bộ tổng hợp synth toán học nội tại chất lượng cao 60FPS)*.
