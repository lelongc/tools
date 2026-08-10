# LỘ TRÌNH 7 NGÀY & HƯỚNG DẪN LÀM PORTFOLIO 
**Vị trí:** Chuyên viên Vận hành Dữ liệu Bản đồ (Map Operations Specialist)
**Công ty:** VinSmart Future / Tập đoàn Vingroup

Tài liệu này là cẩm nang chi tiết giúp bạn từ "Zero" đến việc sở hữu một Portfolio cực kỳ thuyết phục chỉ trong 7 ngày, giúp bạn tự tin ứng tuyển vị trí này dù chưa có kinh nghiệm.

---

## PHẦN 1: BỘ 3 DỰ ÁN THỰC CHIẾN (ĐIỂM CỘNG TUYỆT ĐỐI)

### 📌 Dự án 1: Quy hoạch Điểm Đón/Trả & Phân Luồng Khu Đô Thị (Map Data Operations)
* **Mục tiêu:** Chứng minh kỹ năng thao tác QGIS và quản lý dữ liệu bản đồ không gian (Spatial Data).
* **Công cụ:** QGIS (phần mềm miễn phí), OpenStreetMap.
* **Các bước thực hiện:**
  1. Tải và cài đặt QGIS.
  2. Dùng plugin `QuickMapServices` trong QGIS để tải lớp ảnh vệ tinh Google Satellite làm nền.
  3. Chọn một khu đô thị (VD: Vinhomes Grand Park, Ocean Park).
  4. Tạo 3 định dạng Layer:
     * **Point (Điểm):** Chấm 10 điểm đón/trả khách chuẩn xác tại sảnh tòa nhà. Cập nhật bảng thuộc tính (Attribute Table): `Tên Sảnh`, `Tọa độ Lat`, `Tọa độ Long`, `Loại: Taxi Drop-off`.
     * **Line (Đường):** Vẽ các tuyến đường nội khu. Ghi chú `Đường 1 chiều`, `Đường 2 chiều`.
     * **Polygon (Vùng):** Khoanh vùng khu vực giả định "Cấm đường - Sự kiện VinFast chạy thử", điền thuộc tính `Thời gian phong tỏa`.
  5. **Đóng gói:** Chụp 3 bức ảnh giao diện QGIS rõ nét với các màu sắc phân biệt Point, Line, Polygon. Xuất dữ liệu ra file `.GeoJSON`.
  6. **Cộng đồng:** Lên `OpenStreetMap.org`, cập nhật thực tế 15 địa điểm để lấy link Profile cá nhân.

### 📌 Dự án 2: Gán Nhãn Dữ Liệu Bản Đồ Cho AI (AI Data Labeling & QA/QC)
* **Mục tiêu:** Thể hiện sự tỉ mỉ, khả năng đánh nhãn dữ liệu chuẩn và tư duy kiểm soát chất lượng (QA/QC) - yêu cầu bắt buộc của AI.
* **Công cụ:** QGIS, Excel/Google Sheets.
* **Các bước thực hiện:**
  1. Dùng ảnh vệ tinh chụp đường phố từ QGIS.
  2. Khoanh vùng (Polygon / Bounding box) 3 loại đối tượng:
     * Vạch kẻ đường (Lane Marking)
     * Lề đường (Road Boundary)
     * Biển báo giao thông (Traffic Sign)
  3. **Tạo Bảng QA/QC Checklist:**
     * Lập 1 file Excel đóng giả làm Quản lý chất lượng.
     * Cột A: Tên file/Khu vực. Cột B: Tổng số nhãn (Total Labels). Cột C: Lỗi sai vị trí. Cột D: Lỗi sai tên.
     * Tính **Error Rate** (Tỉ lệ lỗi). VD: Nhãn 100 điểm, lỗi 2 điểm => Error Rate = 2%, Accuracy = 98%.
  4. **Đóng gói:** Chụp ảnh màn hình lúc đang vẽ nhãn + Chụp bảng QA/QC Excel.

### 📌 Dự án 3: Tự Động Hóa Quản Lý CTV Bằng Script (Outsource Team Automation)
* **Mục tiêu:** Đây là "vũ khí bí mật" của bạn! Dùng thế mạnh AI và tư duy máy tính để chứng minh bạn xử lý giấy tờ, báo cáo của CTV nhanh gấp 10 lần người thường.
* **Công cụ:** Google Sheets, Python.
* **Các bước thực hiện:**
  1. Tạo 1 file **SOP & Báo Cáo Nghiệm Thu** trên Google Sheets gồm các cột: `Tên CTV`, `Sản lượng hoàn thành`, `Tỉ lệ lỗi`, `Thành tiền`.
  2. Dùng Python viết script đọc file CSV chứa tọa độ (giả định là file CTV nộp lên) để tìm xem dòng nào thiếu tọa độ hoặc lỗi định dạng.
  3. **Script Python tham khảo:**
     ```python
     import pandas as pd

     def check_map_data(file_path):
         print(f"--- Bắt đầu kiểm tra file: {file_path} ---")
         try:
             # Đọc file dữ liệu của CTV nộp
             df = pd.read_csv(file_path)
             
             # Kiểm tra dòng bị thiếu tọa độ (Missing Latitude/Longitude)
             missing_coords = df[df['Latitude'].isnull() | df['Longitude'].isnull()]
             
             if not missing_coords.empty:
                 print(f"⚠️ Phát hiện {len(missing_coords)} dòng thiếu tọa độ!")
                 print(missing_coords[['ID', 'Tên_Địa_Điểm']])
             else:
                 print("✅ Tuyệt vời, 100% dữ liệu có đủ tọa độ!")
             
             # Xuất báo cáo tự động
             print("--- Đã xuất báo cáo QA/QC tự động ---")
             
         except Exception as e:
             print("Lỗi đọc file:", e)

     # Chạy thử nghiệm thu dữ liệu
     # check_map_data("du_lieu_ctv_thang8.csv")
     ```
  4. **Đóng gói:** Chụp màn hình bảng tính và đoạn Code Python, đính kèm giải thích: *"Script tự động quét file dữ liệu của CTV để tìm điểm lỗi tọa độ, giúp tiết kiệm 80% thời gian QA/QC bằng mắt thường."*

---

## PHẦN 2: LỘ TRÌNH THỰC HIỆN 7 NGÀY CHUẨN XÁC

* **Ngày 1 (Cài đặt & Bắt đầu):** Tải QGIS, lên YouTube gõ "QGIS Beginner Tutorial". Làm quen giao diện. Đăng ký tài khoản OpenStreetMap và thử sửa tên 5 con đường quanh nhà.
* **Ngày 2 (Làm Dự án 1):** Tải bản đồ nền vào QGIS, thực hành vẽ Point, Line, Polygon. Chụp ảnh kết quả lưu lại.
* **Ngày 3 (Làm Dự án 2):** Tiếp tục dùng QGIS để vẽ gán nhãn đường phố kỹ lưỡng. Mở Excel làm bảng QA/QC.
* **Ngày 4 (Làm Dự án 3):** Mở Google Sheets làm bảng tính lương CTV. Cài Python (hoặc dùng Google Colab / online compiler), copy chạy thử đoạn script trên.
* **Ngày 5 (Thiết kế Portfolio):** Mở Canva hoặc Word. Tạo file PDF 3-4 trang. Mỗi trang dán hình ảnh và mô tả 1 dự án như hướng dẫn trên.
* **Ngày 6 (Sửa CV):** Đưa `QGIS`, `OpenStreetMap`, `Python Automation`, `Data QA/QC` vào phần kỹ năng trên cùng của CV. Đính kèm link tải Portfolio.
* **Ngày 7 (Apply & Ôn tập):** Nộp hồ sơ vào VinSmart. Đọc lại quy trình bạn đã làm để chuẩn bị trả lời phỏng vấn trơn tru.

---

## PHẦN 3: LỜI KHUYÊN KHI DEAL LƯƠNG & PHỎNG VẤN

**1. Định vị bản thân:** 
Đừng nhận mình là "Người không biết gì". Hãy nói: *"Em có tư duy hệ thống và biết cách dùng AI/Script để tự động hóa công việc. Dù chưa có kinh nghiệm công ty 3 năm, nhưng những dự án Portfolio em tự làm sát 100% với yêu cầu công việc. Em nắm bắt quy trình vận hành cực nhanh."*

**2. Kỳ vọng lương:**
Nếu HR hỏi, hãy nói: *"Em mong muốn mức lương khởi điểm theo đúng khung Fresher/Junior của công ty, rơi vào khoảng 10 - 11.5 triệu/tháng. Đổi lại em cam kết tối ưu hóa quy trình kiểm tra dữ liệu bằng công cụ tự động hóa."*

**Chúc bạn hoàn thành xuất sắc 3 dự án và chinh phục buổi phỏng vấn!**
