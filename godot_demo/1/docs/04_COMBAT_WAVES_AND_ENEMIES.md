# 👾 THIẾT KẾ ĐẤU TRƯỜNG & QUÁI VẬT (COMBAT WAVES & ENEMIES)
# RUNIC SLICE: TACTICAL BACKPACK SURVIVOR

---

## 👹 1. PHÂN LOẠI QUÁI VẬT (ENEMY ARCHETYPES)

Trò chơi thiết kế 6 lớp quái vật với các hành vi di chuyển và chiến đấu khác nhau, đòi hỏi người chơi phải linh hoạt di chuyển và tối ưu hóa Balo:

```
┌─────────────────┬──────────┬──────────┬──────────┬───────────────────────────────────────────┐
│ Tên Quái        │ HP Cơ Bản│ Tốc Độ   │ Sát Thương│ Đặc Điểm Hành Vi                          │
├─────────────────┼──────────┼──────────┼──────────┼───────────────────────────────────────────┤
│ 1. Slime Runic  │ 30 HP    │ 120 px/s │ 8 Dmg    │ Đi bầy đàn đông, chia đôi khi chết        │
│ 2. Dơi Hư Không │ 20 HP    │ 210 px/s │ 6 Dmg    │ Bay lượn ziczac tốc độ cao, né đường đạn  │
│ 3. Khung Xương  │ 65 HP    │ 150 px/s │ 16 Dmg   │ Cầm khiên đỡ đạn mặt trước, chém cận chiến│
│ 4. Golem Bọc Đá │ 220 HP   │ 80 px/s  │ 30 Dmg   │ Cực trâu, tạo chấn động dậm đất khi đến gần│
│ 5. Quái Bắn Độc │ 45 HP    │ 110 px/s │ 12 Dmg   │ Giữ khoảng cách tầm xa, nhổ cầu độc DoT   │
│ 6. Phù Thủy Hư  │ 90 HP    │ 130 px/s │ 20 Dmg   │ Hồi máu cho bầy quái xung quanh           │
└─────────────────┴──────────┴──────────┴──────────┴───────────────────────────────────────────┘
```

---

## 📈 2. BIỂU ĐỒ 20 WAVE CHIẾN DỊCH (20-WAVE CAMPAIGN PROGRESSION)

* **Wave 1:** 30 Slime Runic (Làm quen di chuyển và đánh thường).
* **Wave 2:** 45 Slime + 15 Dơi Hư Không (Bắt đầu phải né quái nhanh).
* **Wave 3:** Xuất hiện Khung Xương Kiếm Sĩ đầu tiên.
* **Wave 4:** 70 Quái hỗn hợp Slime + Dơi + Khung Xương.
* **Wave 5 (Mini-Boss 1):** **Golem Khổng Lồ (1,200 HP)** + Đàn Slime hộ tống. Thưởng Rương Vàng.
* **Wave 6 - 9:** Xuất hiện Quái Bắn Độc, bãi độc xuất hiện trên sàn đấu ép người chơi phải liên tục di chuyển.
* **Wave 10 (Mini-Boss 2):** **Song Quái Dơi Hư Không Đột Biến (2,000 HP mỗi con)**, bay tốc độ cao ép góc.
* **Wave 11 - 14:** Xuất hiện Phù Thủy Hư Không buff giáp và hồi máu. Số lượng quái trên sân cùng lúc đạt 120 con.
* **Wave 15 (Mini-Boss 3):** **Tướng Quân Khung Xương Bọc Giáp Gai (5,500 HP)**.
* **Wave 16 - 19:** Áp lực sinh tồn cực hạn: 200 quái tràn vào liên tục mỗi wave, đạn bay ngập màn hình.
* **Wave 20 (ĐẠI CHIẾN BOSS TỐI THƯỢNG):** **Chúa Tể Hư Không - Void Monarch (18,000 HP)**.

---

## 👑 3. THIẾT KẾ ĐẠI TRÙM WAVE 20: CHÚA TỂ HƯ KHÔNG (VOID MONARCH)

Trận chiến Boss cuối cùng gồm **3 Giai Đoạn Chuyển Hóa (Phase Transitions)** kịch tính:

### Giai Đoạn 1: Cung Điện Bóng Tối (100% - 70% HP)
* Boss lơ lửng giữa sân, bắn các chùm tia Hư Không xoay tròn $360^\circ$.
* Triệu hồi 4 cột Pha Lê Hư Không ở 4 góc sân đấu. Cột pha lê tạo khiên bất tử cho Boss cho đến khi người chơi phá hủy hết 4 cột.

### Giai Đoạn 2: Mưa Sao Băng Hư Không (70% - 30% HP)
* Boss biến mất khỏi màn hình, trên sàn xuất hiện các vòng tròn cảnh báo màu đỏ rực.
* Sau $1.2\text{s}$, các thiên thạch tím lao thẳng xuống tạo sóng chấn động.
* Người chơi phải dùng Dash canh chuẩn I-Frame để lướt qua sóng chấn động.

### Giai Đoạn 3: Cơn Cuồng Nộ Cuối Cùng (Dưới 30% HP)
* Toàn bộ đấu trường bị thu hẹp dần bởi sương mù hư không (Battle Royale Zone).
* Tốc độ di chuyển của Boss tăng $40\%$, liên tục lao thẳng vào người chơi kèm theo các đợt giật sét đen.
* Âm nhạc chuyển sang tiết tấu Metal hào hùng, đẩy cảm xúc người chơi lên đỉnh điểm!
