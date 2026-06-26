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
