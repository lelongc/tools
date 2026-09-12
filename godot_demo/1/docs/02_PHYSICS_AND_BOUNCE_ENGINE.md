# ⚙️ THUẬT TOÁN VẬT LÝ & ĐÀN HỒI (PHYSICS & BOUNCE ENGINE)
# PUFFY POP: BOUNCY HERO

---

## 📐 1. CÔNG THỨC VẬT LÝ BẮN NÁ (SLINGSHOT LAUNCH PHYSICS)

Khi người chơi kéo tay từ vị trí gốc $P_{\text{origin}}$ tới vị trí ngón tay $P_{\text{touch}}$:
$$\vec{D} = P_{\text{origin}} - P_{\text{touch}}$$
$$\text{PullLength} = \text{clamp}(\|\vec{D}\|, \ 20.0, \ 180.0)$$
$$\vec{V}_{\text{launch}} = \frac{\vec{D}}{\|\vec{D}\|} \times (\text{PullLength} \times 6.5 + 150.0)$$

### Dự Đoán Quỹ Đạo Chấm Bi (Parabolic Trajectory Prediction):
```gdscript
func calculate_trajectory_points(origin: Vector2, initial_vel: Vector2, steps: int = 24) -> PackedVector2Array:
    var points = PackedVector2Array()
    var pos = origin
    var vel = initial_vel
    var dt = 0.03
    var gravity = Vector2(0, 520.0) # Trọng lực trong nước nhẹ nhàng
    
    for i in range(steps):
        points.append(pos)
        pos += vel * dt
        vel += gravity * dt
        vel *= 0.995 # Lực cản nước nhẹ
    return points
```

---

## 🎈 2. ĐỘNG CƠ PHỒNG TO & XÌ HƠI (INFLATION & JET DYNAMICS)

### A. Pha Phồng To (Inflate State)
* **Kích thước:** Bán kính tăng từ $22\text{px} \rightarrow 65\text{px}$ bằng Tween `TRANS_BACK` tạo độ phồng căng đàn hồi.
* **Hệ số nảy (Restitution / Bounciness):** Tăng từ $0.75 \rightarrow 1.15$ (sau mỗi cú va chạm, Puffy nảy mạnh hơn cả trước khi va chạm!).
* **Sát thương va chạm:** Khi phồng to, Puffy gây $100$ sát thương va đập, phá tan các khối đá vôi và húc văng cua.

### B. Pha Xì Hơi Phản Lực (Jet Deflate State)
* **Xung lực phản lực:** Puffy phun khí ngược hướng di chuyển và nhận một lực đẩy tức thì:
  $$\vec{V}_{\text{new}} = \vec{V}_{\text{current}} \times 1.8 + \text{Direction} \times 550.0$$
* **Hiệu ứng bọt nước:** Sinh ra một cụm $15$ hạt bọt nước trắng tinh phụt ra phía sau kèm âm thanh "Pfffrrttt!" vui tai.
