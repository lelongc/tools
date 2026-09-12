# 🧩 ĐẶC TẢ TOÁN HỌC & ĐỘNG CƠ LƯỚI BALO (GRID & ADJACENCY ENGINE)
# RUNIC SLICE: TACTICAL BACKPACK SURVIVOR

---

## 🧮 1. CẤU TRÚC DỮ LIỆU LƯỚI BALO (SPATIAL GRID DATA STRUCTURE)

Hệ thống Balo được biểu diễn bằng một ma trận ô hai chiều $\text{Grid}[R][C]$, trong đó mỗi ô $\text{Cell}(x, y)$ có các trạng thái:
* `is_unlocked: bool` (Ô đã được mua mở khóa hay chưa).
* `occupied_item_id: String` (ID của vật phẩm đang chiếm giữ, rỗng nếu chưa có).
* `active_element: String` (Nguyên tố đang truyền dẫn qua ô này: "none", "fire", "frost", "lightning", "poison").
* `energy_level: float` (Mức độ xung nhịp tăng tốc).

```
   Cột 0   Cột 1   Cột 2   Cột 3   Cột 4   Cột 5
┌───────┬───────┬───────┬───────┬───────┬───────┐
│       │       │ [NỎ SĂN]      │       │       │ Hàng 0
├───────┼───────┼───────┼───────┼───────┼───────┤
│       │[LỬA] ◄-► [NỎ SĂN]     │       │       │ Hàng 1
├───────┼───────┼───────┼───────┼───────┼───────┤
│       │       │       │[ĐỒNG] │       │       │ Hàng 2
├───────┼───────┼───────┼───▲───┼───────┼───────┤
│       │ [KIẾM RỈ 1x3] │   └───►[SẤM SÉT]      │ Hàng 3
└───────┴───────┴───────┴───────┴───────┴───────┘
```

---

## 🔍 2. THUẬT TOÁN ĐÁNH GIÁ KỀ CẠNH (ADJACENCY GRAPH EVALUATION)

Mỗi khi người chơi nhấc lên, đặt xuống hoặc xoay một vật phẩm, hệ thống kích hoạt hàm đánh giá toàn diện: `GridManager.evaluate_all_synergies()`.

### Quy Tắc Tiếp Xúc Lân Cận (4-Neighbor Rule)
Hai vật phẩm $A$ và $B$ được coi là **Tiếp xúc kề cạnh (Adjacent)** nếu tồn tại ít nhất một ô $(x_A, y_A)$ thuộc vật phẩm $A$ và một ô $(x_B, y_B)$ thuộc vật phẩm $B$ thỏa mãn:
$$|x_A - x_B| + |y_A - y_B| = 1 \quad (\text{Khoảng cách Manhattan} = 1)$$

### Ma Trận Tác Động Qua Lại (Synergy Interaction Matrix):

| Vật Phẩm Nguồn (Trigger) | Vật Phẩm Tiếp Nhận (Target) | Hiệu Ứng Sinh Ra |
| :--- | :--- | :--- |
| **Ngọc Lửa (Fire Rune)** | Mọi Vũ Khí Bắn / Chém | Chuyển đạn thành Lửa: $+35\%$ Sát thương, kẻ địch bị thiêu đốt 3s |
| **Ngọc Băng (Frost Rune)** | Mọi Vũ Khí Bắn / Chém | Đạn đóng băng quái: Làm chậm $50\%$, nổ băng khi chết |
| **Lõi Sấm Sét (Lightning)** | Mọi Vũ Khí Bắn / Chém | Thêm hiệu ứng phóng sét lan sang 3 mục tiêu xung quanh |
| **Bánh Răng (Chrono Gear)** | Mọi Vũ Khí Kế Bên | Cứ mỗi khi vũ khí bên cạnh khai hỏa, giảm $25\%$ Cooldown cho vũ khí còn lại |
| **Dây Dẫn Đồng (Conductor)** | Ngọc & Vũ Khí Cách Xa | Truyền dẫn toàn bộ hiệu ứng nguyên tố từ đầu này sang đầu kia |
| **Trái Tim Ma Cà Rồng** | Vũ Khí Cận Chiến | Hồi $2\%$ lượng máu theo sát thương gây ra |
| **Gương Phản Chiếu (Mirror)** | Vũ Khí Tầm Xa | Tăng thêm $+1$ Tia đạn (Projectile Count +1) |

---

## ⚡ 3. THUẬT TOÁN TRUYỀN DẪN DÂY ĐỒNG (BREADTH-FIRST SEARCH CONDUCTION)

Dây Đồng Dẫn Điện (Copper Conductor) đóng vai trò là "dây cáp ma thuật". Thuật toán tìm kiếm theo chiều rộng (BFS) được dùng để truyền dẫn hiệu ứng nguyên tố qua mạng lưới dây dẫn:

```gdscript
func propagate_conduction() -> void:
    var queue: Array[Vector2i] = []
    var visited: Dictionary = {}
    
    # 1. Tìm tất cả các ô chứa Ngọc Nguyên Tố làm điểm bắt đầu nguồn
    for rune_cell in get_all_elemental_rune_cells():
        queue.append(rune_cell)
        visited[rune_cell] = get_cell_element(rune_cell)
        
    # 2. Lan tỏa qua các ô Dây Dẫn Đồng
    while queue.size() > 0:
        var current: Vector2i = queue.pop_front()
        var current_element: String = visited[current]
        
        for neighbor in get_4_neighbors(current):
            if is_conductor_cell(neighbor) and not visited.has(neighbor):
                visited[neighbor] = current_element
                set_cell_element(neighbor, current_element)
                queue.append(neighbor)
            elif is_weapon_cell(neighbor):
                # Vũ khí nhận được hiệu ứng nguyên tố truyền qua dây!
                apply_element_to_weapon(neighbor, current_element)
```

---

## 🔄 4. BẢO VỆ VÒNG LẶP VÔ HẠN (LOOP CYCLE GUARD)

Khi người chơi đặt 4 Bánh Răng thành hình vuông $2 \times 2$ kích hoạt lẫn nhau, hệ thống có thể dẫn đến hiện tượng tràn bộ đệm (Stack Overflow / Infinite Tick recursion).

### Giải Pháp Ngắt Mạch (Cooldown Threshold Lock):
1. Mỗi vật phẩm có một biến cờ nội tại: `is_triggering: bool = false`.
2. Giới hạn tần suất kích hoạt tối đa (*Max Trigger Frequency*): Không vũ khí nào được phép khai hỏa nhanh hơn **$0.08 \text{ giây} / \text{lần}$** ($12.5 \text{ đòn/giây}$).
3. Nếu nhịp thời gian $T < 0.08\text{s}$, hệ thống sẽ tự động ghim ở mức $0.08\text{s}$ và chuyển phần tốc độ dư thừa thành **Tỉ lệ Bạo Kích Thưởng (Bonus Crit Rate)** theo tỷ lệ:
   $$\text{BonusCrit} = \frac{0.08 - T}{0.08} \times 100\%$$
   $\Rightarrow$ Cơ chế này vừa bảo vệ hiệu năng CPU của điện thoại, vừa khiến người chơi cực kỳ phấn khích vì vũ khí chém ra toàn đòn Crit màu đỏ rực!
