# LỘ TRÌNH ĐÀO TẠO NÂNG CAO - MAP OPERATIONS SPECIALIST
**Mục tiêu:** Đạt trình độ tương đương nhân sự có 2 - 3 năm kinh nghiệm (Mid-level) để hoàn toàn tự tin ứng tuyển vị trí Chuyên viên Vận hành Dữ liệu Bản đồ tại các tập đoàn công nghệ lớn (VinSmart, VinFast, Grab, Be...).

Lộ trình này chia thành 4 Giai đoạn (Phase). Ứng với mỗi giai đoạn, tài liệu sẽ cung cấp chi tiết nguồn tài liệu (miễn phí) và từ khóa (keyword) để bạn tự học một cách hiệu quả nhất, vì chuyên ngành này hiếm khi được dạy tại các trung tâm.

---

## GIAI ĐOẠN 1: NỀN TẢNG DỮ LIỆU KHÔNG GIAN (GEOSPATIAL FOUNDATIONS)
*Mục tiêu: Hiểu cách dữ liệu bản đồ hoạt động dưới góc nhìn của một hệ thống IT và sử dụng thành thạo QGIS.*

**1. Các hệ tọa độ (Coordinate Reference Systems - CRS) & Định dạng dữ liệu (GeoJSON, SHP)**
- **Kiến thức cần nắm:** Sự khác biệt giữa hệ tọa độ địa lý (Lat/Long - EPSG:4326) và hệ tọa độ phẳng (Projected - EPSG:3857). Cấu trúc của file GeoJSON.
- 📚 **Nguồn học & Từ khóa:** 
  - Đọc tài liệu trên trang [geojson.org](https://geojson.org/) để hiểu cấu trúc code của bản đồ.
  - Từ khóa YouTube: *"Understanding Coordinate Reference Systems GIS"*, *"GeoJSON format explained"*.

**2. Khai thác sức mạnh của QGIS (Ở mức độ vận hành)**
- **Kiến thức cần nắm:** Tải dữ liệu, mở Attribute Table, sử dụng Topology Checker để tìm lỗi hở nét, chồng lấn polygon, thiết lập Rule-based Symbology.
- 📚 **Nguồn học & Từ khóa:**
  - **Nguồn tốt nhất:** Khóa học YouTube *"Introduction to QGIS course"* của kênh **Spatial Thoughts** (Ujaval Gandhi). 
  - **Cách học:** Tập trung học kỹ **Module 3: Data Editing** trong chuỗi video này. Vừa xem vừa mở QGIS thực hành vẽ Điểm (Point), Đường (Line), Vùng (Polygon).
  - Từ khóa YouTube: *"QGIS digitizing tutorial"*, *"QGIS Topology Checker tutorial"*.

---

## GIAI ĐOẠN 2: THỰC CHIẾN CẬP NHẬT BẢN ĐỒ (OPENSTREETMAP ECOSYSTEM)
*Mục tiêu: Làm chủ quy trình cập nhật, sửa lỗi bản đồ và hệ thống gắn thẻ - Nhiệm vụ cốt lõi của Map Ops.*

**1. Hệ thống Gắn thẻ (Tagging System) của OSM**
- **Kiến thức cần nắm:** Hiểu cấu trúc `Key=Value`. Cách phân loại đường xá (highway) và địa điểm (amenity).
- 📚 **Nguồn học & Từ khóa:**
  - **Nguồn tốt nhất:** [Wiki OpenStreetMap](https://wiki.openstreetmap.org/wiki/Map_features). Đây là "từ điển" của ngành bản đồ.
  - **Cách học:** Khi không biết vẽ 1 trạm xăng thế nào, lên Google gõ *"How to map gas station OSM wiki"*. Trang Wiki sẽ chỉ cho bạn dùng tag `amenity=fuel`. Không cần học thuộc, chỉ cần biết cách tra cứu.

**2. Làm chủ công cụ OSM iD Editor & JOSM**
- **Kiến thức cần nắm:** Biết cách chỉnh sửa bản đồ trực tiếp trên nền web (iD Editor) và cách dùng phần mềm chuyên dụng (JOSM) để thiết lập luật cấm rẽ, đường một chiều (Turn Restrictions).
- 📚 **Nguồn học & Từ khóa:**
  - **Nguồn tốt nhất:** Trang web [LearnOSM.org](https://learnosm.org/) (Có hỗ trợ tiếng Việt).
  - **Cách học:** Đọc kỹ phần **"Sơ cấp"** để biết dùng iD Editor. Đọc phần **"Trung cấp"** để biết cài đặt và sử dụng phần mềm JOSM.
  - Từ khóa YouTube: *"OSM JOSM basic tutorial"*, *"How to add turn restrictions in JOSM"*.

---

## GIAI ĐOẠN 3: GÁN NHÃN DỮ LIỆU AI & KIỂM SOÁT CHẤT LƯỢNG (QA/QC)
*Mục tiêu: Biết cách vẽ dữ liệu chuẩn xác để huấn luyện Machine Learning và tính toán tỉ lệ lỗi.*

**1. Công cụ gán nhãn chuyên dụng (Annotation Tools)**
- **Kiến thức cần nắm:** Sử dụng thành thạo Bounding Box (hộp chữ nhật), Polygon (vùng) và Semantic Segmentation (tô pixel) để gán nhãn biển báo, làn đường trên ảnh vệ tinh/ảnh camera.
- 📚 **Nguồn học & Từ khóa:**
  - **Nguồn tốt nhất:** Các trang web cung cụ gán nhãn như **CVAT** (Computer Vision Annotation Tool) hoặc **Label Studio**.
  - **Cách học:** Mở trang chủ của CVAT, tạo tài khoản miễn phí, upload một bức ảnh ngã tư đường phố lên và tập dùng chuột khoanh vùng các phương tiện. Sau đó xuất (Export) ra file JSON.
  - Từ khóa YouTube: *"CVAT annotation tutorial"*, *"Label Studio bounding box tutorial"*.

**2. Thiết lập quy trình QA/QC (Quality Assurance/Quality Control)**
- **Kiến thức cần nắm:** Biết cách tính Accuracy Rate (Tỉ lệ chính xác) và tạo file Excel nghiệm thu dữ liệu.
- 📚 **Nguồn học & Từ khóa:**
  - **Cách học:** Lên ChatGPT/Claude và gõ prompt: *"Đóng vai một QA Manager, hãy hướng dẫn tôi cách lập một bảng Excel checklist để kiểm tra lỗi dữ liệu gán nhãn AI (Data Labeling QA checklist) gồm những tiêu chí nào"*.

---

## GIAI ĐOẠN 4: TỰ ĐỘNG HÓA BẰNG IT (AUTOMATION & SCRIPTING)
*Mục tiêu: Đưa tư duy IT vào Vận hành để x10 hiệu suất làm việc, biến bạn thành chuyên gia tối ưu hệ thống thay vì làm thủ công.*

**1. Python cho Dữ liệu Không gian (Spatial Python)**
- **Kiến thức cần nắm:** Biết dùng thư viện `Pandas` (xử lý CSV/Excel) và `GeoPandas` (xử lý file bản đồ GeoJSON/SHP trực tiếp bằng code).
- 📚 **Nguồn học & Từ khóa:**
  - **Nguồn tốt nhất:** Khóa học mở [Automating GIS-processes](https://autogis-site.readthedocs.io/) của Đại học Helsinki. Đây là khóa học số 1 thế giới dạy Python cho ngành bản đồ.
  - **Cách học:** Học phần Lesson 1 & 2 để làm quen với GeoPandas, cách đọc file bản đồ và tính toán tọa độ bằng code.
  - Từ khóa YouTube: *"GeoPandas crash course"*, *"Python for GIS tutorial"*.

**2. Viết Script Tự Động Hóa Báo Cáo**
- **Kiến thức cần nắm:** Tự động hóa quá trình quét lỗi tọa độ từ file của Cộng tác viên nộp lên.
- 📚 **Nguồn học & Từ khóa:**
  - **Cách học:** Bạn không cần phải code từ đầu. Hãy dùng ChatGPT. Gửi prompt: *"Tôi có 1 file CSV chứa cột Vĩ độ, Kinh độ. Hãy viết cho tôi 1 đoạn Python dùng Pandas để tìm ra các dòng bị thiếu tọa độ, và xuất danh sách lỗi ra file Excel mới."* Sau đó copy code vào chạy trên máy tính.

---
**TỔNG KẾT:** Bạn không cần tìm mua các khóa học trả phí đắt đỏ. Tất cả các tài liệu, wiki và khóa học từ Helsinki hay Spatial Thoughts liệt kê ở trên đều **hoàn toàn miễn phí** và là tiêu chuẩn cao nhất của ngành. Hãy bắt đầu từ việc học QGIS và tập vẽ nhà/đường trên OpenStreetMap nhé!
