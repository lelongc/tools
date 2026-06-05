# PSX Horror Level Editor

Một trình soạn thảo màn chơi (Level Editor) chạy trực tiếp trên trình duyệt, mang phong cách đồ hoạ PSX retro cổ điển. Bạn có thể tự do bay lượn, thiết kế nội thất, lưu trạng thái và xuất bản vẽ 3D ra file để dùng trong Unity/Blender.

## Cách chạy dự án

Dự án này sử dụng mô-đun ES6 của Javascript, vì vậy bạn cần chạy thông qua một Web Server cục bộ (Localhost). Bạn không thể nhấp đúp vào file `.html` để chạy trực tiếp do giới hạn bảo mật CORS của trình duyệt.

**Bước 1: Mở Terminal / Command Prompt**
Tại thư mục `d:\folder\tools\3d`, bạn mở terminal lên.

**Bước 2: Chạy Server**
Nếu máy bạn có cài sẵn Python (đa số đều có), hãy gõ lệnh:
```bash
python -m http.server 8000
```
*(Nếu bạn dùng Node.js, bạn cũng có thể dùng `npx serve` hoặc `npx http-server`)*

**Bước 3: Truy cập trên trình duyệt**
Mở trình duyệt web của bạn (Chrome/Edge/Firefox) và truy cập vào đường link sau:
[http://localhost:8000/viewer/psx.html](http://localhost:8000/viewer/psx.html)

## Cách điều khiển (Creator Mode)
- **`C`**: Bật/Tắt chế độ Creator Mode.
- **W A S D**: Bay lượn tự do trong không gian 3D.
- **Nhấn giữ Nút Giữa Chuột (Cuộn chuột)** + Di chuyển chuột: Xoay camera / Nhìn xung quanh.
- **Cuộn chuột (Lăn)** hoặc **Ctrl + Kéo chuột**: Phóng to / Thu nhỏ (Zoom).
- **Click Chuột Trái**: Chọn đồ vật (bàn, ghế, cột).
- **`T`**: Bật công cụ Di chuyển (Kéo).
- **`R`**: Bật công cụ Xoay.
- **`X`**: Bật/Tắt chế độ Hít nam châm (Snap: 0.5m / 45 độ).
- **`E`**: Xuất toàn bộ map ra file `psx_house.gltf`.

Chúc bạn tạo map vui vẻ!
