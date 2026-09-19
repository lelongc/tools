# Hồ sơ phân tích và kế hoạch cải thiện game

**Game:** Cluck & Drop: Bunker Buster  
**Ngày lập:** 19/09/2026  
**Phạm vi:** phân tích hiện trạng và đề xuất; chưa triển khai sửa game.

## Đọc theo thứ tự

1. [Hiện trạng và kiến trúc](D:/folder/tools/godot_demo/2/docs/phan-tich-game/01-hien-trang-va-kien-truc.md): game đang có gì, luồng hoạt động, phần đã tốt và phần còn thiếu.
2. [Lỗi và hướng cải thiện kỹ thuật](D:/folder/tools/godot_demo/2/docs/phan-tich-game/02-loi-va-huong-cai-thien.md): bằng chứng, tình huống tái hiện, ảnh hưởng, hướng xử lý và điều kiện nghiệm thu.
3. [Độ khó, trải nghiệm và kinh tế](D:/folder/tools/godot_demo/2/docs/phan-tich-game/03-do-kho-trai-nghiem-kinh-te.md): phân tích chiến dịch, trứng, sao, camera, phần thưởng và hướng thiết kế.
4. [Lộ trình và kế hoạch kiểm chứng](D:/folder/tools/godot_demo/2/docs/phan-tich-game/04-lo-trinh-va-kiem-chung.md): thứ tự công việc, phụ thuộc, cách đo và điều kiện hoàn thành.
5. [Kiểm kê 200 màn](D:/folder/tools/godot_demo/2/docs/phan-tich-game/05-kiem-ke-200-man.md): số quái, HP, khối phá hủy, trứng, vật thể hỗ trợ và zoom từng màn.

## Nhận định chính

Game đã có nền tảng chơi được: phá kết cấu bằng vật lý, bảy loại trứng, mười thế giới, nhân vật có nhiều biểu cảm và một hệ thống phần thưởng cơ bản. Điểm cần ưu tiên hiện nay là **tính nhất quán của kết quả chơi và vai trò chiến thuật của từng cơ chế**, sau đó mới đến mở rộng nội dung.

Các vấn đề cần xử lý trước một đợt playtest cân bằng nghiêm túc:

- Quảng cáo mô phỏng có nút nhận thưởng không được mở khóa do tìm sai đường dẫn node.
- Bộ đếm hết trứng vẫn chạy khi pause.
- Có thể xuất hiện đồng thời kết quả thắng và thua trong Last Stand.
- Thời gian chờ thua cố định chưa theo dõi trứng và phản ứng vật lý còn hoạt động.
- Hố đen ra ngoài biên có thể gây sát thương lặp trong thời gian chờ xóa.
- Điểm hiển thị sau thắng có thể khác điểm đã ghi cho lần chơi đó.
- Quy tắc coi mọi vật gần `y = 800` là có nền đỡ không khớp các màn có đáy sâu hơn.

Các quyết định thiết kế cần chốt:

- Giữ mở toàn bộ 200 màn để thử nghiệm, hay chuyển sang tiến trình mở khóa cho người chơi mới?
- Frost là công cụ làm giòn vật liệu hay là công cụ phá hủy diện rộng ngay lập tức?
- Sao đánh giá hiệu quả giải đố, tổng phá hủy hay cả giải cứu gà con?
- Vàng và trứng tích trữ phục vụ tính năng nào? Hiện chưa thấy luồng tiêu dùng chúng trong giao diện chơi.
- Ưu tiên Android trước hay phát hành đồng thời Web/Windows? Preset hiện chưa thống nhất nhận diện game.

## Cách hiểu bằng chứng

| Nhãn | Ý nghĩa |
|---|---|
| **R — Đã tái hiện** | Quan sát được trong kiểm tra Godot headless trên bản sao cách ly. Có mô tả điều kiện; không đồng nghĩa đã xác nhận trên mọi thiết bị. |
| **T — Xác nhận từ mã** | Luồng hoặc điều kiện thể hiện trực tiếp trong mã hiện tại. Tần suất người chơi gặp có thể chưa được đo. |
| **H — Giả thuyết cần kiểm chứng** | Có cơ sở để điều tra nhưng chưa đủ bằng chứng gọi là lỗi đã xác nhận. |
| **D — Quyết định thiết kế** | Hành vi có thể chủ ý; cần chọn mục tiêu sản phẩm trước khi đổi. |

Mức ưu tiên là đề xuất: **P1** ảnh hưởng kết quả chơi, mất tiến trình hoặc chặn tính năng; **P2** ảnh hưởng tính nhất quán, cân bằng và trải nghiệm; **P3** hoàn thiện hoặc tổ chức dự án. Không có kết luận P0 trong đợt này.

## Phạm vi kiểm tra thực tế

- Đọc cấu hình, scene và các luồng mã chính; quét tham chiếu tài nguyên tĩnh.
- Chạy bộ test có sẵn trên bản sao: các assertion báo đạt, tiến trình trả mã `0`.
- Sinh đủ 200 màn trên bản sao để lấy số liệu cấu trúc, không tự chơi thắng 200 màn.
- Kiểm tra tập trung các trạng thái pause, quảng cáo, Last Stand, điểm thắng, vật mất bệ đỡ, Frost và hố đen.
- Chưa đo FPS/GPU/bộ nhớ trên Android thật; chưa kiểm tra bằng mắt toàn bộ giao diện; chưa có dữ liệu tỷ lệ thắng, giữ chân hoặc doanh thu.
- Log headless có cảnh báo đọc kho chứng chỉ của môi trường chạy và cảnh báo tài nguyên khi dừng fixture. Chưa quy những cảnh báo này thành lỗi bản phát hành.

Chỉ các file Markdown trong thư mục này là sản phẩm bàn giao. Source game có nhiều thay đổi chưa commit từ trước; phân tích dựa trên nội dung đang có trên đĩa, không dựa vào giả định rằng bản HEAD là bản mới nhất. Các số dòng là mốc của lần phân tích này.
