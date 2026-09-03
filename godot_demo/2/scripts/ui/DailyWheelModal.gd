extends CanvasLayer
class_name DailyWheelModal

signal wheel_closed()

@onready var wheel_pivot: Node2D = $CenterContainer/Panel/VBox/WheelContainer/WheelPivot
@onready var btn_spin: Button = $CenterContainer/Panel/VBox/BtnSpin
@onready var btn_close: Button = $CenterContainer/Panel/VBox/BtnClose
@onready var status_label: Label = $CenterContainer/Panel/VBox/StatusLabel
@onready var result_banner: Label = $CenterContainer/Panel/VBox/ResultBanner

var is_spinning: bool = false
var prizes = [
	{"name": "100 Vàng", "type": "coins", "amount": 100, "icon": "🪙 100"},
	{"name": "+1 Trứng Nổ", "type": "egg", "egg_type": "bomb", "icon": "💣 Trứng Nổ"},
	{"name": "250 Vàng", "type": "coins", "amount": 250, "icon": "🪙 250"},
	{"name": "+1 Trứng Axit", "type": "egg", "egg_type": "acid", "icon": "🧪 Trứng Axit"},
	{"name": "500 Vàng", "type": "coins", "amount": 500, "icon": "🪙 500"},
	{"name": "+1 Trứng Khoan", "type": "egg", "egg_type": "drill", "icon": "🔩 Trứng Khoan"},
	{"name": "JACKPOT 1000 Vàng", "type": "coins", "amount": 1000, "icon": "👑 1000 🪙"},
	{"name": "50 Vàng", "type": "coins", "amount": 50, "icon": "🪙 50"}
]

func _ready() -> void:
	visible = false
	if btn_close: btn_close.pressed.connect(close_wheel)
	if btn_spin: btn_spin.pressed.connect(_on_spin_pressed)
	_draw_wheel_wedges()
	_update_spin_button_state()

func open_wheel() -> void:
	visible = true
	is_spinning = false
	if result_banner: result_banner.text = "Quay để nhận quà hấp dẫn!"
	_update_spin_button_state()

func close_wheel() -> void:
	if is_spinning: return
	visible = false
	wheel_closed.emit()

func _update_spin_button_state() -> void:
	if not has_node("/root/SaveManager"): return
	var sm = get_node("/root/SaveManager")
	
	if sm.is_first_daily_spin_free():
		btn_spin.text = "🎡 QUAY MIỄN PHÍ"
		btn_spin.disabled = false
		if status_label: status_label.text = "Lượt quay đầu tiên trong ngày: MIỄN PHÍ!"
	elif sm.can_spin_daily_wheel():
		var used = sm.get_daily_spins_used()
		btn_spin.text = "🎬 QUAY THÊM (Lượt %d/4)" % (used + 1)
		btn_spin.disabled = false
		if status_label: status_label.text = "Xem 1 video ngắn để nhận thêm lượt quay!"
	else:
		btn_spin.text = "✕ ĐÃ HẾT LƯỢT HÔM NAY"
		btn_spin.disabled = true
		if status_label: status_label.text = "Bạn đã dùng hết 4 lượt quay hôm nay. Hãy quay lại vào ngày mai!"

func _draw_wheel_wedges() -> void:
	if not wheel_pivot: return
	for child in wheel_pivot.get_children():
		child.queue_free()

	var radius = 135.0
	var num_prizes = prizes.size()
	var wedge_angle = TAU / num_prizes

	var colors = [
		Color(0.85, 0.25, 0.25),
		Color(0.25, 0.55, 0.85),
		Color(0.85, 0.65, 0.15),
		Color(0.25, 0.75, 0.45),
		Color(0.65, 0.35, 0.85),
		Color(0.25, 0.65, 0.75),
		Color(0.95, 0.85, 0.15),
		Color(0.85, 0.45, 0.25)
	]

	for i in range(num_prizes):
		var poly = Polygon2D.new()
		var pts = PackedVector2Array([Vector2.ZERO])
		var start_a = i * wedge_angle - (wedge_angle * 0.5)
		var end_a = (i + 1) * wedge_angle - (wedge_angle * 0.5)
		var segments = 12
		for s in range(segments + 1):
			var a = lerp(start_a, end_a, float(s) / segments)
			pts.append(Vector2(cos(a) * radius, sin(a) * radius))
		poly.polygon = pts
		poly.color = colors[i % colors.size()]
		wheel_pivot.add_child(poly)

		# Label trên mỗi ô
		var mid_a = i * wedge_angle
		var lbl = Label.new()
		lbl.text = prizes[i]["icon"]
		lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		lbl.add_theme_font_size_override("font_size", 12)
		lbl.position = Vector2(cos(mid_a) * (radius * 0.65) - 30, sin(mid_a) * (radius * 0.65) - 10)
		wheel_pivot.add_child(lbl)

	# Vòng kim loại ngoài
	var rim = Line2D.new()
	rim.width = 6.0
	rim.default_color = Color(0.95, 0.85, 0.3)
	var rim_pts = PackedVector2Array()
	for s in range(36):
		var a = (float(s) / 36.0) * TAU
		rim_pts.append(Vector2(cos(a) * radius, sin(a) * radius))
	rim_pts.append(rim_pts[0])
	rim.points = rim_pts
	wheel_pivot.add_child(rim)

func _on_spin_pressed() -> void:
	if is_spinning: return
	if not has_node("/root/SaveManager"): return
	var sm = get_node("/root/SaveManager")

	if sm.is_first_daily_spin_free():
		_start_spin_physics()
	elif sm.can_spin_daily_wheel():
		if has_node("/root/AdsManager"):
			var am = get_node("/root/AdsManager")
			am.show_rewarded_ad(
				AdsManager.PLACEMENT_DAILY_SPIN,
				"spin",
				1,
				func(): _start_spin_physics(),
				func():
					if status_label: status_label.text = "Bạn cần xem hết video để nhận lượt quay!"
			)

func _start_spin_physics() -> void:
	is_spinning = true
	btn_spin.disabled = true
	btn_close.disabled = true

	var winning_index = randi() % prizes.size()
	var wedge_angle = TAU / prizes.size()

	# Kim chỉ ở phía trên đỉnh (-PI/2)
	# Góc đích để kim trúng winning_index:
	var target_sector_angle = - (winning_index * wedge_angle) - (PI * 0.5)
	var total_rotations = TAU * 5.0 # 5 vòng
	var final_rotation = total_rotations + target_sector_angle

	wheel_pivot.rotation = 0.0

	var tween = create_tween().set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tween.tween_property(wheel_pivot, "rotation", final_rotation, 3.8)

	await tween.finished

	# Trả thưởng
	is_spinning = false
	btn_close.disabled = false

	if has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		sm.record_daily_spin()

		var prize = prizes[winning_index]
		if prize["type"] == "coins":
			sm.add_coins(prize["amount"])
			if result_banner:
				result_banner.text = "🎉 Chúc mừng! Bạn nhận được %s!" % prize["name"]
		elif prize["type"] == "egg":
			sm.add_consumable(prize["egg_type"], 1)
			if result_banner:
				result_banner.text = "🎉 Chúc mừng! Bạn nhận được %s!" % prize["name"]

	_update_spin_button_state()
