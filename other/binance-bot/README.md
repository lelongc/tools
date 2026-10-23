# 🤖 BINANCE DUAL-ENGINE AI TRADING BOT

Hệ thống Bot giao dịch Binance Futures thông minh thế hệ mới, kết hợp **Google Gemini AI Flash**, **Quét tin tức Web & Telegram Realtime**, và **Radar phát hiện dòng tiền bùng nổ (Volatility Radar)**.

---

## 💎 2 CHẾ ĐỘ GIAO DỊCH (THIẾT KẾ ĐÚNG Ý BẠN)

### 1. KÈO AN TOÀN (SAFE MODE - Tự động 24/7)
* **Cặp coin:** `SOL/USDT` (hoặc `BNB/USDT`, `BTC/USDT`).
* **Vốn ký quỹ:** 5$ USDT (còn 3$ dự phòng an toàn trong ví).
* **Đòn bẩy:** `x3` - `x5` (Chế độ **Isolated Margin** cô lập rủi ro).
* **Mục tiêu:** Chốt lời ròng **+0.50$** (chỉ cần giá chạy 1.5% - 2%).
* **Cắt lỗ bảo hiểm:** -0.80$ (giữ lại 7.2$ vốn đánh ván khác, không bao giờ để cháy hết $8).
* **Cơ chế hoạt động:** Hoàn toàn tự động, phân tích nến 15m + RSI + EMA + Tin tức vĩ mô. Sau khi chốt lời, bot tự động nghỉ ngơi **15 phút** đếm ngược rồi mới quét lệnh tiếp.

---

### 2. KÈO LƯỚT SÓNG MẠO HIỂM VỐN NHỎ (HUNTER MODE - Chỉ chơi khi BẠN CHO PHÉP)
* **Vốn ký quỹ:** Đúng **0.5$** USDT.
* **Đòn bẩy:** `x10` (Vị thế $5 USDT $\rightarrow$ Vừa khít mốc tối thiểu Min Notional $5 của Binance Futures).
* **Mục tiêu X1 VỐN:** Lời đúng **+0.50$** (+100% ROI trên vốn 0.5$) $\rightarrow$ Đóng vị thế chốt lời ngay lập tức!
* **Rủi ro tối đa:** Nếu đoán sai sóng, chỉ mất đúng **0.5$** ký quỹ (tài khoản vẫn còn nguyên 7.5$ an toàn tuyệt đối).
* **CƠ CHẾ "TÔI CHO PHÉP MỚI CHƠI" (Human-in-the-Loop):**
  * Khi Radar phát hiện một đồng coin đang có dòng tiền bùng nổ hoặc tin sốt dẻo trên Telegram:
  * **Bot KHÔNG ĐƯỢC TỰ Ý VÀO LỆNH**.
  * Bot sẽ hiển thị cảnh báo, nêu rõ lý do và hỏi bạn trong vòng **30 giây**:
    ```
    🚨 [PHÁT HIỆN KÈO LƯỚT SÓNG 0.5$]: AGTUSDT (LONG)
       • Lý do: Dòng tiền tăng +18.9%, có tin nóng trên Telegram
       • Ký quỹ: 0.5$ x10 | Mục tiêu x1 lời +0.50$ | Mất tối đa 0.50$
    ❓ [XIN PHÉP BẠN]: Gõ 'Y' để DUYỆT chơi | Gõ 'N' hoặc để trống để BỎ QUA
    ```
  * **Bạn gõ `Y`:** Bot giải ngân 0.5$ lướt sóng.
  * **Bạn gõ `N` hoặc để sau 30s không bấm:** Bot tự động hủy kèo lướt sóng và tiếp tục giữ an toàn với SOL/BNB/BTC.

---

## 📡 NGUỒN DỮ LIỆU REALTIME
1. **Telegram Channels:** Cào trực tiếp từ các kênh tin tức lớn (`@binance_announcements`, `@cointelegraph`, `@WatcherGuru`, `@tradinginsight_channel`...) hoàn toàn tự động, không cần đăng nhập tài khoản.
2. **Web News:** Tin tức mới nhất từ **CryptoPanic RSS**, **Cointelegraph** và **Decrypt**.
3. **Binance Breakout Radar:** Quét toàn bộ bảng điện Futures tìm các đồng coin có % tăng trưởng tốt và volume trên 30M$.
4. **Chống chặn mạng Việt Nam:** Tích hợp sẵn `dns_resolver.py` vượt mọi tường lửa DNS của VNPT, Viettel, FPT mà không cần VPN.

---

## 🚀 HƯỚNG DẪN BẮT ĐẦU

1. Mở file [.env](file:///d:/folder/tools/other/binance-bot/.env) và điền:
   - `BINANCE_API_KEY` & `BINANCE_API_SECRET` *(Bật quyền Enable Futures, KHÔNG bật quyền rút tiền).*
   - `GEMINI_API_KEY` *(Lấy miễn phí tại https://aistudio.google.com/).*
2. Nhấp đúp chuột vào file **[run.bat](file:///d:/folder/tools/other/binance-bot/run.bat)** để khởi động!
