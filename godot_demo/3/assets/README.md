# 🎨 HƯỚNG DẪN THAY THẾ MODEL 3D, TEXTURE & ÂM THANH (PLUG-AND-PLAY)

Tựa game **"PARTY SUMO RAGDOLL 3D"** được xây dựng với hệ thống **3D Procedural Mesh & Vật lý Ragdoll / Sumo Ring Out**. Game chạy mượt mà ngay bây giờ mà không cần file ngoài, đồng thời hỗ trợ cơ chế cắm-và-chạy (Plug & Play) để bạn thả Model 3D từ Blender (`.glb`), Texture và Âm thanh vào bất cứ lúc nào:

---

## 1. Thư mục Model 3D (`assets/models/`)
Bạn có thể xuất từ Blender định dạng `.glb` hoặc `.gltf`:
- `sumo_player.glb`: Model đấu thủ hạt đậu mập mạp (Party Animals / Fall Guys bean style).
- `sumo_p1.glb`, `sumo_p2.glb`, `sumo_p3.glb`, `sumo_p4.glb`: Skin riêng theo 4 đội màu.
- `boxing_glove.glb`: Găng tay đấm lò xo khổng lồ.
- `sweeper_beam.glb`: Thanh gạt xoay tròn ở giữa võ đài.
- `bouncy_donut.glb`: Bánh Donut bumper nảy tưng tưng.

*(Nếu chưa có file bên ngoài, game sẽ tự động dựng Model 3D Procedural hoạt hình hạt đậu lắc lư với đôi mắt googly eyes to tròn và găng đấm lò xo)*.

---

## 2. Thư mục Âm Thanh & Nhạc Nền (`assets/audio/`)
Hỗ trợ định dạng `.wav`, `.mp3`, `.ogg`:
- `punch_heavy.wav`: Tiếng đấm bóp nổ vang dội.
- `hammer_bonk.wav`: Tiếng búa tạ cao su kêu chít chít + cộp.
- `yeet_throw.wav`: Tiếng nhấc bổng quẳng đối thủ đi xa (YEET!).
- `ring_out.wav`: Tiếng rơi khỏi võ đài tấu hài.
- `stun_dizzy.wav`: Tiếng choáng váng sao bay quanh đầu.
- `trampoline_bounce.wav`: Tiếng bục nhún lò xo tưng tưng.
- `cheer.wav`: Tiếng reo hò vinh danh Vua Sumo.
- `bgm.ogg`: Nhạc tiệc tùng võ đài sôi động.

*(Nếu chưa có file âm thanh bên ngoài, game sẽ tự động tạo âm thanh bằng bộ tổng hợp synth toán học nội tại chất lượng cao 60FPS)*.
