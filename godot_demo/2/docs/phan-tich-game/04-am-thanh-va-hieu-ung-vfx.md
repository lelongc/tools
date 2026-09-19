# 04 — Âm thanh, Hiệu ứng Hình ảnh (VFX) và Cảm giác Game (Juiciness)

Tài liệu này đánh giá toàn diện hạ tầng âm thanh (Sound Pipeline), hệ thống hiệu ứng hạt (VFX), đồ họa động (Motion Graphics) và phản hồi xúc giác (Game Feel) của **Cluck & Drop: Bunker Buster**.

---

## 1. Hạ tầng và Thiết kế Âm thanh (Audio Architecture)

### 1.1 Danh mục 24 Tệp Âm thanh WAV Hiện có

Hệ thống được nạp sẵn qua `SoundManager.gd` với 24 sample chuẩn hoạt hình (WAV format, sample rate 22.050Hz / 44.100Hz):

| Nhóm | Tên khóa (Key) | Mục đích sử dụng | Gain (dB) | Pitch min-max | Cơ chế chống chồng âm (Debounce) |
|---|---|---|:---:|:---:|:---:|
| **Gà & Trứng** | `chicken_cluck` | Tiếng cục tác khi đẻ trứng | +1.5 | 0.95 – 1.05 | Mỗi lần thả trứng |
| | `egg_bounce` | Trứng va đập đàn hồi trên bề mặt cứng | 0.0 | 0.92 – 1.08 | Cooldown $0.06\text{s}$ |
| | `egg_crack` | Vỏ trứng nứt toác khi chịu lực | +1.8 | 0.95 – 1.05 | Cooldown $0.06\text{s}$ |
| | `chick_chirp` | Gà con chiếp chiếp khi được giải cứu | +0.5 | 0.92 – 1.10 | Cooldown $0.06\text{s}$ |
| **Phá hủy** | `wood_break` | Gỗ gãy vụn, nẹp vỡ | +1.2 | 0.93 – 1.07 | Cooldown $0.05\text{s}$ |
| | `stone_break` | Gạch đá vỡ nát, sụp đổ | +2.2 | 0.92 – 1.06 | Cooldown $0.05\text{s}$ |
| | `glass_break` | Kính băng rạn nứt giòn tan | +0.8 | 0.94 – 1.06 | Cooldown $0.05\text{s}$ |
| | `steel_clang` | Dầm thép va chạm leng keng đanh thép | +1.8 | 0.95 – 1.05 | Cooldown $0.05\text{s}$ |
| | `crystal_shatter` | Pha lê vỡ lấp lánh cao vút | +1.8 | 0.95 – 1.05 | Cooldown $0.05\text{s}$ |
| | `obsidian_crack` | Đá hắc diện thạch nứt trầm đục | +2.5 | 0.94 – 1.06 | Cooldown $0.05\text{s}$ |
| **Kỹ năng đạn** | `explosion_cartoon` | Vụ nổ bom comic đanh thép | +3.5 | 0.92 – 1.06 | Cooldown $0.08\text{s}$ |
| | `drill_engine` | Tiếng động cơ khoan phản lực rít gió | +1.8 | 0.95 – 1.05 | Mỗi lần kích hoạt |
| | `frost_freeze` | Sóng lạnh băng giá đóng băng tức thì | +1.5 | 0.95 – 1.05 | Mỗi lần kích hoạt |
| | `acid_sizzle` | Axit sôi sùng sục ăn mòn kết cấu | +0.8 | 0.95 – 1.05 | Mỗi lần kích hoạt |
| | `blackhole_vortex` | Tiếng rít hút trọng lực hố đen vũ trụ | +2.5 | 0.95 – 1.05 | Mỗi lần kích hoạt |
| **Quái vật** | `monster_ouch` | Quái vật kêu "Ui da" khi bị đè nghiến | +1.2 | 0.92 – 1.08 | Cooldown $0.08\text{s}$ |
| | `monster_defeat` | Quái vật bị bẹp dí nổ bung | +2.5 | 0.93 – 1.07 | Cooldown $0.10\text{s}$ |
| **Giao diện & UI** | `button_click` | Tiếng click nút bấm nảy bổng | +0.5 | 0.96 – 1.04 | Trực tiếp theo tương tác |
| | `wheel_tick` | Tiếng khấc quay vòng quay may mắn | -1.0 | 0.95 – 1.05 | Theo góc quay bánh xe |
| | `coin_pickup` | Tiếng nhặt tiền vàng vui nhộn | +1.5 | 0.96 – 1.04 | Mỗi lần cộng thưởng |
| | `star_chime` | Chuông sao ngân vang (Thang C6-E6-G6) | +1.8 | 1.00 / 1.22 / 1.44 | Giãn cách $0.32\text{s}$ giữa các sao |
| | `victory_fanfare` | Khúc khải hoàn chiến thắng | +3.0 | 1.00 cố định | Ngừng toàn bộ SFX nền |
| | `level_fail` | Âm thanh kèn trượt buồn bã khi thua | +2.5 | 1.00 cố định | Ngừng toàn bộ SFX nền |
| **Nhạc nền** | `cartoon_bunker_bgm`| Nhạc nền hoạt hình vui nhộn nhịp điệu | -8.0 | 1.00 | Tự động lặp lại vĩnh viễn |

### 1.2 Điểm mạnh đã đạt được
1. **Âm thanh hoạt hình đa kênh (Audio Pool 16 kênh)**:
   - Sử dụng mảng 16 `AudioStreamPlayer` giúp các âm thanh va chạm, nổ bom và tiếng quái kêu cùng phát ra đồng thời mượt mà, không bị ngắt cụt âm thanh trước đó.
2. **Biến thiên cao độ ngẫu nhiên (Pitch Randomization)**:
   - Mỗi lần phát SFX đều biến thiên cao độ từ $0.92$ đến $1.08$, tạo cảm giác tự nhiên, sống động như phim hoạt hình, không bị hiệu ứng "tiếng súng máy" nhàm chán khi nhiều khối cùng vỡ.
3. **Bộ tổng hợp âm dự phòng (Fallback Synthesizer)**:
   - Tích hợp bộ tổng hợp sóng sin / vuông / nhiễu trắng (`play_synth_tone`) với bộ nhớ đệm byte, đảm bảo ngay cả khi thiếu tệp âm thanh thì hệ thống vẫn phát ra âm thanh phản hồi cho người chơi.

### 1.3 Các thiếu sót & Hướng cải tiến Âm thanh
1. **Thiếu Hệ thống Bus Âm thanh (AudioBusLayout)**:
   - Hiện tại toàn bộ âm thanh (BGM, SFX, UI) đều gắn chung vào bus `Master` (index 0).
   - *Đề xuất*: Thiết lập 3 Bus con trong Godot:
     - `Master` -> `BGM`: có bộ lọc High-Pass và Compressor nhẹ.
     - `Master` -> `SFX`: có bộ giới hạn biên độ (Peak Limiter ở $-1\text{dB}$) để khi 10 quả bom nổ cùng lúc không bao giờ xảy ra hiện tượng méo tiếng (Clipping/Distortion).
     - `Master` -> `UI`: âm lượng cố định, không bị ảnh hưởng bởi hiệu ứng pause trong game.
2. **Thiếu một số hiệu ứng âm thanh cốt lõi**:
   - Tiếng kéo căng ná / dây cao su khi ngắm bắn (`slingshot_stretch`).
   - Tiếng gầm hú riêng biệt cho từng World Boss khi xuất hiện.
   - Tiếng rít gió của cột khí đẩy ngược (`updraft_whoosh`).
   - Tiếng nổ đặc thù của thùng Nuke hạt nhân (hiện Nuke dùng chung âm thanh với TNT thường).

---

## 2. Hệ thống Hiệu ứng Hình ảnh (Visual Effects & Particles)

### 2.1 Kiến trúc Hạt CPUParticles2D Tối ưu Mobile

Toàn bộ hệ thống hạt sử dụng `CPUParticles2D` kết hợp kết cấu vector SVG đã được tối ưu hóa kích thước texture ($64\times 64$ hoặc $128\times 128$), đảm bảo chạy mượt mà $60\text{ FPS}$ trên cả các dòng điện thoại cấu hình yếu (OpenGL ES 3 / GL Compatibility).

| Hiệu ứng | Kịch bản kích hoạt | Texture sử dụng | Màu sắc chủ đạo | Thời gian tồn tại |
|---|---|---|---|:---:|
| **Trứng vỡ (Egg Splat)** | Đạn đập vỡ khi hết lượt nảy | `vfx_egg_splat_yolk` + `particle_shard_chip` | Trắng sữa + Vàng lòng đỏ | $0.45\text{s}$ |
| **Nổ bom (Fireball Burst)** | Bom kích nổ | `vfx_fireball_cartoon` + `smoke_puff_cartoon` | Đỏ cam lửa than | $0.65\text{s}$ |
| **Tia lửa khoan (Drill Sparks)** | Đạn khoan xoay xuyên khối | `particle_drill_spark` + `vfx_metal_cutting_chip` | Vàng điện + Bạc kim loại | $0.40\text{s}$ |
| **Băng tuyết (Freezing Fog)** | Trứng băng phát nổ | `vfx_freezing_fog_cloud` + `particle_frost_crystal` | Lam tuyết lấp lánh | $0.50\text{s}$ |
| **Khói độc (Toxic Fumes)** | Trứng axit ăn mòn | `vfx_toxic_fume_smoke` + `particle_acid_drop` | Xanh chuối huỳnh quang | $0.60\text{s}$ |
| **Vòng xoáy (Void Vortex)** | Hố đen hút vật chất | `vfx_gravity_distortion_ring` + `vfx_cosmic_star_dust` | Tím thạch anh + Đen vũ trụ | $1.20\text{s}$ |
| **Quái tan biến (Monster Poof)** | Quái vật bị tiêu diệt | `smoke_puff_cartoon` + `particle_spark_star` + `particle_feather` | Bụi đất + Sao vàng xoay váng đầu + Lông thú | $0.38\text{s}$ |
| **Pháo hoa cứu con (Confetti)** | Phá vỡ lồng cứu gà con | `particle_confetti_ribbon` | Cầu vồng rực rỡ | $0.80\text{s}$ |

### 2.2 Đồ họa Chữ Điểm Bay Comic Punchy (`ComicScorePopup.gd`)

- Khi tiêu diệt quái vật hoặc phá vỡ lồng gà, điểm số hiện lên dưới dạng chữ Comic phóng to giật nảy:
  ```gdscript
  tween.tween_property(label, "scale", Vector2(1.35, 1.35), 0.12).set_trans(Tween.TRANS_BACK)
  tween.tween_property(label, "position:y", pos.y - 45.0, 0.45)
  tween.tween_property(label, "modulate:a", 0.0, 0.25).set_delay(0.20)
  ```
- Màu sắc phân cấp rõ rệt:
  - Điểm thường ($800 – 1.400$): Vàng tươi viền đen.
  - Điểm tinh anh ($2.000 – 4.500$): Cam san hô viền đỏ đậm.
  - Điểm Boss & Cứu lồng ($10.000+$): Tím ngọc phát sáng viền vàng kim.

### 2.3 Phân tích Hoạt họa Biểu cảm Nhân vật (Character Expressions)

Bộ quái vật `BunkerMonster.gd` sở hữu hệ thống hoạt ảnh biểu cảm độc bản với 11 trạng thái:
1. `IDLE`: Thở phập phồng, đảo mắt ngẫu nhiên, huýt sáo hoặc ngủ gật hiện bóng bóng `Zzz`.
2. `ALERT_AIMING`: Co rúm người, trợn mắt tí hon (pinprick), hiện dấu chấm than đỏ `!`.
3. `PANIC_FALLING`: Rung bần bật tần số cao ($20\text{Hz}$), toát giọt mồ hôi xanh lơ khổng lồ.
4. `PINNED_UNDER_DEBRIS`: Bị đè bẹp dí bám sát nền đất, đầu hiện sao quay vòng chóng mặt.
5. `SURVIVED_RELIEF`: Thở phào nhẹ nhõm "Hên quá chưa chết!", ngực phập phồng chậm rãi.
6. `SMUG_MOCKING`: Nhún nhảy lắc lư, thè lưỡi trêu ngươi người chơi.
7. `CRITICAL_INJURED`: Mắt bầm tím, răng sứt mẻ, thở dốc nặng nhọc khi HP $< 45\%$.
8. `FURIOUS_ARMOR_LOSS`: Văng mũ sắt, nổi gân máu chữ thập đỏ giận dữ.
9. `VICTORY_TAUNT`: Cười toe toét, chùm sao ăn mừng nổ quanh đầu khi người chơi thua.
10. `SHOCKED_BY_NEIGHBOR`: Hoảng hốt nhảy dựng lên khi thấy đồng đội bên cạnh bị đè bẹp.
11. `DEFEATED`: Bật nảy lên cao, phồng to căng tròn như quả bóng bay rồi nổ "BÙM" thành bụi đất và sao váng đầu.

---

## 3. Không gian & Bầu không khí 10 Thế giới (Atmospheric Polish)

Hiện tại, 10 thế giới đã có sự phân biệt rõ về màu nền trời, màu lòng đất và kết cấu khối. Tuy nhiên, các thế giới vẫn thiếu các hạt bụi môi trường lơ lửng (Ambient Atmospheric Dust):

| Thế giới | Hiện trạng | Đề xuất Bổ sung Hiệu ứng Môi trường (Ambient Particles) |
|---|---|---|
| **W1 — Farm Cavern** | Trời xanh mây trắng tĩnh | Vài chiếc lá vàng và sợi rơm bay là đà theo gió |
| **W2 — Stone Quarry** | Bầu trời hoàng hôn cam | Bụi đá lơ lửng mờ ảo dưới ánh chiều tà |
| **W3 — Steampunk** | Trần hang xám khói độc | Những cụm khói hơi nước xì nhẹ từ vách hang ngầm |
| **W4 — Lava Core** | Nền đỏ sẫm dung nham | Tia lửa than hồng (Embers) bay lất phất từ đáy vực lên |
| **W5 — Crystal Void** | Tím thạch anh huyền bí | Bụi sao tinh tú phát sáng nhấp nháy chu kỳ |
| **W6 — Cyber Tech** | Xanh titan công nghệ cao | Lưới điện quang neon xanh quét nhẹ ngang nền |
| **W7 — Toxic Jungle** | Rừng rêu đầm lầy | Bào tử nấm lân tinh phát sáng xanh ngọc bồng bềnh |
| **W8 — Glacier Vault** | Băng giá vĩnh cửu | Bông tuyết li ti rơi chầm chậm trôi theo phương ngang |
| **W9 — Dragon Abyss** | Miệng núi lửa rực lửa | Tro tàn hỏa diệm và luồng khí nóng làm méo hình |
| **W10 — Celestial Nexus** | Cung điện hoàng kim | Bụi vàng kim lấp lánh và các vòng hào quang xoay chậm |

---

## 4. Kết luận Đánh giá Âm thanh & VFX

- **Cảm giác đập phá (Tactile Impact)**: Rất tốt, va chạm có trọng lượng rõ rệt, quái vật có phản ứng phong phú, camera shake được kiểm soát không gây mỏi mắt.
- **Tính ổn định**: Không còn hiện tượng nổ lặp hố đen, không chồng âm thanh vỡ khối, không bị giật lật hướng gà khi ngắm.
- **Tiềm năng nâng cấp tiếp theo**: Bổ sung phân luồng AudioBus con có Limiter và thêm bộ hạt môi trường Ambient Particles cho từng thế giới sẽ đưa chất lượng sản phẩm tiệm cận các game mobile thương mại hàng đầu của Rovio / Supercell.
