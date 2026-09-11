extends CanvasLayer
class_name DailyWheelModal

signal wheel_closed()

@onready var modal_panel: PanelContainer = $CenterContainer/Panel
@onready var wheel_pivot: Node2D = $CenterContainer/Panel/Margin/VBox/WheelContainer/WheelPivot
@onready var btn_spin: Button = $CenterContainer/Panel/Margin/VBox/BtnSpin
@onready var btn_close: Button = $CenterContainer/Panel/Margin/VBox/BtnClose
@onready var status_label: Label = $CenterContainer/Panel/Margin/VBox/StatusLabel
@onready var result_banner: Label = $CenterContainer/Panel/Margin/VBox/ResultBanner
@onready var title_label: Label = $CenterContainer/Panel/Margin/VBox/Title

var is_spinning: bool = false
var prizes = [
	{"type": "coins", "amount": 100, "label_key": "100"},
	{"type": "egg", "egg_type": "bomb", "label_key": "BOMB"},
	{"type": "coins", "amount": 250, "label_key": "250"},
	{"type": "egg", "egg_type": "acid", "label_key": "ACID"},
	{"type": "coins", "amount": 500, "label_key": "500"},
	{"type": "egg", "egg_type": "drill", "label_key": "DRILL"},
	{"type": "coins", "amount": 1000, "label_key": "1000"},
	{"type": "coins", "amount": 50, "label_key": "50"}
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
	if modal_panel:
		modal_panel.scale = Vector2(0.6, 0.6)
		var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_property(modal_panel, "scale", Vector2.ONE, 0.28)
	if result_banner:
		result_banner.text = ""
	_update_language_ui()
	_update_spin_button_state()

func close_wheel() -> void:
	if is_spinning: return
	visible = false
	wheel_closed.emit()

func _update_language_ui() -> void:
	var lm = get_node_or_null("/root/LocalizationManager")
	if not lm: return
	if title_label: title_label.text = lm.t("KEY_WHEEL_TITLE")
	if btn_close: btn_close.text = lm.t("KEY_WHEEL_CLOSE")

func _update_spin_button_state() -> void:
	if not has_node("/root/SaveManager"): return
	var sm = get_node("/root/SaveManager")
	var lm = get_node_or_null("/root/LocalizationManager")

	_update_language_ui()

	if sm.is_first_daily_spin_free():
		btn_spin.text = lm.t("KEY_WHEEL_SPIN_FREE") if lm else "QUAY MIỄN PHÍ"
		btn_spin.disabled = false
		if status_label:
			status_label.text = lm.t("KEY_WHEEL_STATUS_FREE") if lm else "Lượt quay đầu tiên trong ngày: MIỄN PHÍ!"
	elif sm.can_spin_daily_wheel():
		var used = sm.get_daily_spins_used()
		btn_spin.text = (lm.t("KEY_WHEEL_SPIN_AD") % (used + 1)) if lm else ("XEM VIDEO QUAY THÊM (%d/4)" % (used + 1))
		btn_spin.disabled = false
		if status_label:
			status_label.text = lm.t("KEY_WHEEL_STATUS_AD") if lm else "Xem 1 video ngắn để nhận thêm lượt quay!"
	else:
		btn_spin.text = lm.t("KEY_WHEEL_EXHAUSTED") if lm else "ĐÃ HẾT LƯỢT HÔM NAY"
		btn_spin.disabled = true
		if status_label:
			status_label.text = lm.t("KEY_WHEEL_STATUS_DONE") if lm else "Bạn đã dùng hết lượt quay hôm nay. Hãy quay lại vào ngày mai!"

func _draw_wheel_wedges() -> void:
	if not wheel_pivot: return
	for child in wheel_pivot.get_children():
		child.queue_free()

	var radius = 135.0
	var num_prizes = prizes.size()
	var wedge_angle = TAU / num_prizes

	var colors = [
		Color(0.88, 0.28, 0.28), # Đỏ dâu
		Color(0.24, 0.58, 0.90), # Xanh dương
		Color(0.92, 0.68, 0.16), # Vàng kim
		Color(0.26, 0.76, 0.44), # Xanh lá
		Color(0.68, 0.36, 0.88), # Tím thạch anh
		Color(0.24, 0.70, 0.82), # Xanh ngọc
		Color(0.98, 0.82, 0.18), # Vàng tươi độc đắc
		Color(0.88, 0.48, 0.24)  # Cam san hô
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

		# Label trên mỗi nan quạt
		var mid_a = i * wedge_angle
		var lbl = Label.new()
		var p = prizes[i]
		if p["type"] == "coins":
			lbl.text = "%d" % p["amount"]
		else:
			lbl.text = p["egg_type"].to_upper()
		lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		lbl.add_theme_font_size_override("font_size", 13)
		lbl.add_theme_color_override("font_color", Color.WHITE)
		lbl.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.85))
		lbl.add_theme_constant_override("outline_size", 4)
		lbl.position = Vector2(cos(mid_a) * (radius * 0.65) - 30, sin(mid_a) * (radius * 0.65) - 10)
		wheel_pivot.add_child(lbl)

	# Vành kim loại vàng đồng bo tròn ngoài
	var rim = Line2D.new()
	rim.width = 7.0
	rim.default_color = Color(1.0, 0.85, 0.25)
	var rim_pts = PackedVector2Array()
	for s in range(40):
		var a = (float(s) / 40.0) * TAU
		rim_pts.append(Vector2(cos(a) * radius, sin(a) * radius))
	rim_pts.append(rim_pts[0])
	rim.points = rim_pts
	wheel_pivot.add_child(rim)

	# Núm tròn vàng ở tâm vòng xoay (Hub Cap)
	var hub = Polygon2D.new()
	var hub_pts = PackedVector2Array()
	var hub_r = 18.0
	for s in range(20):
		var a = (float(s) / 20.0) * TAU
		hub_pts.append(Vector2(cos(a) * hub_r, sin(a) * hub_r))
	hub.polygon = hub_pts
	hub.color = Color(1.0, 0.84, 0.15)
	wheel_pivot.add_child(hub)

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
					var lm = get_node_or_null("/root/LocalizationManager")
					if status_label:
						status_label.text = lm.t("KEY_WHEEL_STATUS_AD") if lm else "Xem 1 video ngắn để nhận thêm lượt quay!"
			)

func _start_spin_physics() -> void:
	is_spinning = true
	btn_spin.disabled = true
	btn_close.disabled = true

	var winning_index = randi() % prizes.size()
	var wedge_angle = TAU / prizes.size()

	# Kim chỉ ở đỉnh (-PI/2)
	var target_sector_angle = - (winning_index * wedge_angle) - (PI * 0.5)
	var total_rotations = TAU * 5.0 # 5 vòng quay
	var final_rotation = total_rotations + target_sector_angle

	wheel_pivot.rotation = 0.0

	var tween = create_tween().set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	var prev_tick_sector = 0
	tween.tween_method(func(rot: float):
		wheel_pivot.rotation = rot
		var cur_sector = int(abs(rot) / wedge_angle)
		if cur_sector != prev_tick_sector:
			prev_tick_sector = cur_sector
			if has_node("/root/SoundManager"):
				var pitch_v = randf_range(0.95, 1.05)
				get_node("/root/SoundManager").play_synth_tone(780.0 * pitch_v, 0.02, "pop", -6.0)
	, 0.0, final_rotation, 3.8)

	await tween.finished

	# Trả thưởng
	is_spinning = false
	btn_close.disabled = false

	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_victory()

	if has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		sm.record_daily_spin()

		var prize = prizes[winning_index]
		if prize["type"] == "coins":
			sm.add_coins(prize["amount"])
			if result_banner:
				result_banner.text = "🎉 +%d COINS! 🎉" % prize["amount"]
		elif prize["type"] == "egg":
			sm.add_consumable(prize["egg_type"], 1)
			if result_banner:
				result_banner.text = "🎉 +1 %s EGG! 🎉" % prize["egg_type"].to_upper()

	_update_spin_button_state()
