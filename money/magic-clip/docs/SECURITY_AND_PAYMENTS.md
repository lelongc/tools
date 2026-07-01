# 🔒 NeoClip — Báo cáo Bảo mật & Chống Crack

> **Ngày kiểm tra:** 27/06/2026  
> **Phiên bản:** v3.0.1

---

## 1. Các kịch bản tấn công & trạng thái phòng thủ

### ✅ Tấn công 1: Dùng key của Store khác (Cross-Store Spoofing)
**Mô tả:** Hacker dùng license key mua từ 1 store Lemon Squeezy khác (giá rẻ hơn) để kích hoạt NeoClip.  
**Phòng thủ:** ĐÃ VÁ — Kiểm tra `VALID_STORE_ID = 416715` ở cả 3 hàm:
- `checkLicense()` — khi nhập key mới
- `restoreLicense()` — khi khôi phục từ Drive
- `validateSubscriptionBackground()` — khi check định kỳ

**Kết luận:** ✅ AN TOÀN

---

### ✅ Tấn công 2: Sửa `chrome.storage.local` bằng DevTools
**Mô tả:** Hacker mở DevTools → Application → Storage → sửa `isPro = true`.  
**Phòng thủ:** Code kiểm tra `proValidUntil` (thời điểm hết hạn). Nếu chỉ sửa `isPro` mà không có `proValidUntil` hợp lệ thì:
- `isProActive()` thấy `proValidUntil = 0` → `now > 0` = true → gọi API validate → API trả về `valid = false` (vì không có key) → revoke ngay.

**Kết luận:** ✅ AN TOÀN — Tự khóa lại ngay khi có mạng.

---

### ✅ Tấn công 3: Sửa `proValidUntil` thành số rất lớn
**Mô tả:** Hacker sửa `proValidUntil = 9999999999999` để bypass check hạn.  
**Phòng thủ:** Check định kỳ mỗi 1 giờ (`checkSubscription` alarm) sẽ gọi `validateSubscriptionBackground()` → nếu license key không hợp lệ hoặc đã bị hủy, API sẽ trả `valid = false` → revoke Pro ngay.  
**Worst case:** Hacker dùng được tối đa 1 giờ nếu đặt `proValidUntil` rất xa + chặn mạng. Nhưng ngay khi có mạng lại, alarm sẽ revoke.

**Kết luận:** ✅ AN TOÀN — Tự heal trong vòng 1 giờ.

---

### ✅ Tấn công 4: Chặn request đến Lemon Squeezy (Block API)
**Mô tả:** Hacker sửa file hosts hoặc dùng firewall để chặn `api.lemonsqueezy.com`, khiến validate luôn fail (catch block) → code không revoke.  
**Phòng thủ:** Khi subscription hết hạn thật (`proValidUntil` đã qua), `isProActive()` kiểm tra:
```
if (now > proValidUntil) {
    // dù offline hay chặn API, vẫn return false
    return false;
}
```
Subscription monthly/yearly có `expires_at` chính xác từ Lemon Squeezy. Khi qua ngày đó, Pro tự khóa bất kể có mạng hay không.

**Kết luận:** ✅ AN TOÀN — `proValidUntil` là hàng rào cuối cùng.

---

### ✅ Tấn công 5: Dùng key đã bị hủy (Canceled Subscription)
**Mô tả:** User mua 1 tháng → hủy subscription → cố dùng tiếp.  
**Phòng thủ:**
1. `proValidUntil` được set chính xác = ngày hết hạn từ Lemon Squeezy
2. Khi qua ngày đó → `isProActive()` return false
3. `validateSubscriptionBackground()` kiểm tra online → API trả `valid = false` → xóa sạch `isPro`, `proValidUntil`, `licenseKey`, `instanceId`
4. Xóa luôn license trên Drive (`deleteLicenseFromDrive()`) → không thể khôi phục

**Kết luận:** ✅ AN TOÀN

---

### ✅ Tấn công 6: Share key cho nhiều người
**Mô tả:** User mua 1 key rồi chia sẻ cho bạn bè.  
**Phòng thủ:** Lemon Squeezy có cơ chế **Activation Limit** (giới hạn số thiết bị kích hoạt). Khi vượt quá:
```javascript
} else if (data.error && data.error.includes('Activation limit')) {
    return { ok: false, error: 'Device limit reached.' };
}
```
Bạn có thể cấu hình giới hạn này trên Dashboard Lemon Squeezy (ví dụ: 3 thiết bị).

**Kết luận:** ✅ AN TOÀN — Nằm ở phía Lemon Squeezy.

---

### ⚠️ Tấn công 7: Decompile file ZIP release
**Mô tả:** Hacker tải ZIP release → unzip → đọc code đã minify.  
**Thực trạng:** Code được minify bởi Terser (xóa comment, rút gọn biến), NHƯNG:
- `VALID_STORE_ID = 416715` vẫn có thể đọc được dù đã minify
- URL API `api.lemonsqueezy.com` vẫn rõ ràng
- Logic flow vẫn có thể reverse-engineer

**Đánh giá:** Đây là **hạn chế cố hữu** của Chrome Extension (MV3 không cho phép chạy code từ server). NHƯNG:
- Dù đọc được code, hacker **vẫn không thể tạo ra license key hợp lệ** vì key được tạo bởi Lemon Squeezy server.
- Dù sửa code bỏ hết kiểm tra, user phải **tải extension sửa đổi theo cách thủ công** (Developer Mode) → Chrome sẽ hiện cảnh báo, và không thể publish lên Store.

**Kết luận:** ⚠️ CHẤP NHẬN ĐƯỢC — Không có cách nào tốt hơn cho Chrome Extension.

---

### ⚠️ Tấn công 8: Patch code local để bỏ check Pro
**Mô tả:** Hacker cài extension ở Developer Mode, sửa code bỏ hết `isProActive()`, dùng miễn phí.  
**Thực trạng:** Đây là rủi ro không thể tránh 100% với bất kỳ phần mềm client-side nào.  
**Giảm thiểu:**
- Tính năng Cloud Sync PHẢI có Google OAuth token hợp lệ + Lemon Squeezy license hợp lệ → dù patch code local, sync vẫn không hoạt động nếu không có key thật.
- Chỉ ảnh hưởng đến: historyLimit (có thể unlock), collections (có thể unlock).
- Không ảnh hưởng doanh thu lớn vì đối tượng hack thường không phải khách hàng tiềm năng.

**Kết luận:** ⚠️ CHẤP NHẬN ĐƯỢC — Rủi ro thấp, chi phí phòng thủ cao hơn thiệt hại.

---

## 2. Bảng tổng kết bảo mật

| Kịch bản | Mức rủi ro | Trạng thái |
|----------|-----------|-----------|
| Key store khác | Cao | ✅ Đã vá |
| Sửa storage local | Cao | ✅ Tự heal |
| Sửa proValidUntil | Cao | ✅ Tự heal ≤1h |
| Chặn API validate | Trung bình | ✅ proValidUntil chặn |
| Key đã hủy/hết hạn | Cao | ✅ Tự revoke |
| Share key nhiều người | Trung bình | ✅ Activation limit |
| Decompile ZIP | Thấp | ⚠️ Chấp nhận |
| Patch code local | Thấp | ⚠️ Chấp nhận |

---

## 3. Khuyến nghị bổ sung (Tùy chọn, không bắt buộc)

1. **Server-side validation (nếu có backend riêng):**  
   Thay vì gọi Lemon Squeezy API trực tiếp từ extension (lộ endpoint), có thể đặt 1 proxy API trên Vercel Functions. Nhưng điều này tăng chi phí vận hành.

2. **Webhook Lemon Squeezy:**  
   Cấu hình webhook trên Dashboard Lemon Squeezy để nhận thông báo khi subscription bị hủy/hoàn tiền. Tuy nhiên cần backend server để xử lý webhook.

3. **Giới hạn activation:** 
   Trên Dashboard Lemon Squeezy, đặt "Max Activations" = 3 hoặc 5 cho mỗi license key.


# Hướng Dẫn Chạy Thử Nghiệm Thanh Toán (Test Mode) NeoClip

Tài liệu này hướng dẫn bạn từng bước giả lập thanh toán thực tế bằng **Lemon Squeezy Test Mode** để kiểm tra xem Extension có tự động nhận diện License Key và mở khóa các tính năng Pro hoạt động ổn định 100% hay chưa trước khi phát hành chính thức.

---

## 1. Chuẩn Bị Thông Tin Cần Thiết

Bạn cần chuẩn bị sẵn 3 thông tin từ trang quản trị Lemon Squeezy (đang ở trạng thái **Test mode**):

### A. Lấy API Key của cửa hàng
1. Vào **Settings** -> **API** -> Bấm **Create API Key**.
2. Đặt tên là `NeoClip Test Key`, sau đó copy dãy ký tự có dạng `ls_...`.
3. Điền vào đây để nhớ: `..................................................`

### B. Lấy Variant ID của sản phẩm `NeoClip Pro (Yearly)`
1. Vào **Store** -> **Products** -> Click chọn sản phẩm `NeoClip Pro (Yearly)`.
2. Ở phần thông tin sản phẩm, tìm mục **Variant ID** (là một dãy số, ví dụ: `123456`).
3. Điền vào đây để nhớ: `........................`

### C. Lấy Link thanh toán thử nghiệm (Checkout URL)
1. Trong trang chi tiết sản phẩm, bấm vào nút **Share** hoặc **Get Checkout Link**.
2. Copy đường dẫn thanh toán thử nghiệm đó (Đường dẫn sẽ có dạng `https://neoclip.lemonsqueezy.com/checkout/buy/...`).

---

## 2. Các Bước Cấu Hấu Kinh Code Để Chạy Thử (Local Test)

> [!NOTE]
> Bạn cần cấu hình Extension để nó gọi API Lemon Squeezy ở chế độ kiểm tra.

1. Mở file [service_worker.js](file:///d:/folder/tools/money/magic-clip/background/service_worker.js) (hoặc file xử lý kích hoạt License của Extension).
2. Kiểm tra phần URL gọi API. Các API chính thức của Lemon Squeezy là:
   * Kích hoạt key: `https://api.lemonsqueezy.com/v1/licenses/activate`
   * Xác thực key: `https://api.lemonsqueezy.com/v1/licenses/validate`
3. Đảm bảo Extension gửi request chứa các tham số:
   * `license_key`: Mã key do người dùng nhập.
   * `instance_name`: Tên định danh thiết bị của người dùng (ví dụ: "Chrome Browser").

---

## 3. Các Bước Thực Hiện Chạy Thử (Test Flow)

Thực hiện lần lượt các bước sau để mô phỏng hành vi mua hàng của khách:

### Bước 1: Giả lập mua hàng (Free Test Purchase)
1. Dán **Checkout URL** ở mục (1.C) vào trình duyệt của bạn.
2. Trang thanh toán thử nghiệm của Lemon Squeezy xuất hiện (Có thông báo "Test Mode is enabled").
3. Nhập thông tin thanh toán giả lập:
   * **Email:** Bất kỳ email nào của bạn.
   * **Card Number (Số thẻ test):** Dùng số thẻ test tiêu chuẩn của Stripe: **`4242 4242 4242 4242`**.
   * **Expiry Date:** Bất kỳ ngày nào trong tương lai (ví dụ: `12/30`).
   * **CVC:** `123`
4. Bấm **Pay** (Thanh toán).

### Bước 2: Nhận License Key ảo
1. Sau khi thanh toán thành công, màn hình sẽ hiển thị thông báo cảm ơn cùng với một dãy **License Key** thử nghiệm (Ví dụ: `3E4F-889D-...`).
2. Đồng thời, một email chứa License Key này cũng được gửi vào hòm thư bạn vừa nhập. Hãy copy key này.

### Bước 3: Nhập Key vào Extension để xác thực
1. Mở popup Extension NeoClip của bạn lên.
2. Tìm đến mục **Upgrade to Pro** (hoặc Enter License Key).
3. Dán License Key thử nghiệm vừa nhận được vào ô nhập liệu -> Bấm **Activate / Kích hoạt**.
4. **Kiểm tra kết quả:**
   * Hệ thống phải gửi request đến API của Lemon Squeezy thành công.
   * Extension chuyển trạng thái hiển thị sang **Pro Version** (hoặc Premium).
   * Mở khóa toàn bộ giới hạn (ví dụ: tạo không giới hạn collection, sử dụng các tính năng nâng cao).

---

## 4. Khi Nào Xác Nhận "Ổn Định 100%"?

Bạn chỉ tiến hành đưa dự án lên chính thức khi checklist sau đạt trạng thái `[x]`:

- [ ] **Thanh toán ảo thành công:** Trang checkout tải bình thường, chấp nhận thẻ test `4242...` và sinh ra License Key thành công.
- [ ] **Kích hoạt Key thành công:** Extension gửi API đi, nhận kết quả `activated: true` từ Lemon Squeezy và lưu Key vào Chrome Storage local.
- [ ] **Mở khóa tính năng Pro:** Các tính năng bị giới hạn lập tức sử dụng được ngay sau khi kích hoạt mà không cần load lại Extension.
- [ ] **Xác thực tự động (Validation):** Khi khởi động lại Chrome hoặc sau 1 khoảng thời gian, Extension vẫn tự động gọi API `/validate` chạy ngầm và duy trì trạng thái Pro bình thường.
- [ ] **Xử lý Key sai/hết hạn:** Nếu nhập một key linh tinh, Extension phải hiển thị thông báo lỗi rõ ràng chứ không bị treo.

