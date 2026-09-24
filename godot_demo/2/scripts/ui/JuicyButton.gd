extends Button
class_name JuicyButton

@export var is_primary_green: bool = false
@export var is_wood_brown: bool = false
@export var is_gold_action: bool = false
@export var is_danger_red: bool = false

var base_scale: Vector2 = Vector2.ONE
var anim_tween: Tween = null
var is_pressed_down: bool = false
var original_pos_y: float = 0.0

func _ready() -> void:
	base_scale = scale
	_update_pivot()
	resized.connect(_update_pivot)

	# Tự động gán StyleBox 3D Bevel đúc khối xúc giác
	_apply_tactile_style()

	mouse_entered.connect(_on_mouse_entered)
	mouse_exited.connect(_on_mouse_exited)
	button_down.connect(_on_button_down)
	button_up.connect(_on_button_up)
	pressed.connect(_on_pressed)

func _update_pivot() -> void:
	pivot_offset = size * 0.5

func _apply_tactile_style() -> void:
	var style_normal = StyleBoxFlat.new()
	var style_hover = StyleBoxFlat.new()
	var style_pressed = StyleBoxFlat.new()
	var style_disabled = StyleBoxFlat.new()

	var radius = 16
	var corner_r = int(clamp(size.y * 0.32, 12, 20)) if size.y > 0 else radius

	# Cấu hình 4 bảng màu hoạt hình đúc khối chuẩn game mobile
	if is_primary_green:
		# NÚT XANH LỤC BẢO (Play / Next Level / Resume)
		# Thân xanh lá tươi, đế 3D dày 6px xanh rừng sâu, viền bóng trên
		style_normal.bg_color = Color(0.24, 0.72, 0.28)
		style_normal.border_width_bottom = 6
		style_normal.border_width_top = 2
		style_normal.border_width_left = 2
		style_normal.border_width_right = 2
		style_normal.border_color = Color(0.08, 0.34, 0.12)

		style_hover.bg_color = Color(0.32, 0.82, 0.36)
		style_hover.border_width_bottom = 6
		style_hover.border_width_top = 2
		style_hover.border_width_left = 2
		style_hover.border_width_right = 2
		style_hover.border_color = Color(0.1, 0.42, 0.15)

		style_pressed.bg_color = Color(0.18, 0.58, 0.22)
		style_pressed.border_width_bottom = 2
		style_pressed.border_width_top = 2
		style_pressed.border_width_left = 2
		style_pressed.border_width_right = 2
		style_pressed.border_color = Color(0.06, 0.26, 0.09)

		add_theme_color_override("font_color", Color(1.0, 1.0, 1.0))
		add_theme_color_override("font_hover_color", Color(1.0, 1.0, 0.92))
		add_theme_color_override("font_outline_color", Color(0.06, 0.24, 0.08))
		add_theme_constant_override("outline_size", 6)
		add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.75))
		add_theme_constant_override("shadow_offset_y", 2)

	elif is_gold_action:
		# NÚT VÀNG HOÀNG KIM (Lucky Wheel / Claim 3X / Rewarded Ad)
		# Thân vàng óng rực rỡ, đế 3D dày 6px caramel đồng, viền socola
		style_normal.bg_color = Color(1.0, 0.76, 0.10)
		style_normal.border_width_bottom = 6
		style_normal.border_width_top = 2
		style_normal.border_width_left = 2
		style_normal.border_width_right = 2
		style_normal.border_color = Color(0.50, 0.30, 0.0)

		style_hover.bg_color = Color(1.0, 0.86, 0.25)
		style_hover.border_width_bottom = 6
		style_hover.border_width_top = 2
		style_hover.border_width_left = 2
		style_hover.border_width_right = 2
		style_hover.border_color = Color(0.62, 0.38, 0.0)

		style_pressed.bg_color = Color(0.88, 0.65, 0.06)
		style_pressed.border_width_bottom = 2
		style_pressed.border_width_top = 2
		style_pressed.border_width_left = 2
		style_pressed.border_width_right = 2
		style_pressed.border_color = Color(0.40, 0.24, 0.0)

		add_theme_color_override("font_color", Color(0.24, 0.11, 0.0))
		add_theme_color_override("font_hover_color", Color(0.16, 0.06, 0.0))
		add_theme_color_override("font_outline_color", Color(1.0, 0.94, 0.65))
		add_theme_constant_override("outline_size", 4)
		add_theme_color_override("font_shadow_color", Color(1.0, 0.96, 0.8, 0.7))
		add_theme_constant_override("shadow_offset_y", 1)

	elif is_danger_red:
		# NÚT ĐỎ SAN HÔ (Close / Skip / Exit)
		style_normal.bg_color = Color(0.88, 0.24, 0.24)
		style_normal.border_width_bottom = 6
		style_normal.border_width_top = 2
		style_normal.border_width_left = 2
		style_normal.border_width_right = 2
		style_normal.border_color = Color(0.44, 0.08, 0.08)

		style_hover.bg_color = Color(0.96, 0.34, 0.34)
		style_hover.border_width_bottom = 6
		style_hover.border_width_top = 2
		style_hover.border_width_left = 2
		style_hover.border_width_right = 2
		style_hover.border_color = Color(0.55, 0.12, 0.12)

		style_pressed.bg_color = Color(0.72, 0.18, 0.18)
		style_pressed.border_width_bottom = 2
		style_pressed.border_width_top = 2
		style_pressed.border_width_left = 2
		style_pressed.border_width_right = 2
		style_pressed.border_color = Color(0.35, 0.06, 0.06)

		add_theme_color_override("font_color", Color(1.0, 1.0, 1.0))
		add_theme_color_override("font_hover_color", Color(1.0, 0.95, 0.95))
		add_theme_color_override("font_outline_color", Color(0.35, 0.06, 0.06))
		add_theme_constant_override("outline_size", 6)
		add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.75))
		add_theme_constant_override("shadow_offset_y", 2)

	else:
		# NÚT GỖ SỒI MỘC (Level Select / Settings / Restart / Back)
		style_normal.bg_color = Color(0.48, 0.26, 0.10)
		style_normal.border_width_bottom = 6
		style_normal.border_width_top = 2
		style_normal.border_width_left = 2
		style_normal.border_width_right = 2
		style_normal.border_color = Color(0.22, 0.10, 0.02)

		style_hover.bg_color = Color(0.58, 0.32, 0.14)
		style_hover.border_width_bottom = 6
		style_hover.border_width_top = 2
		style_hover.border_width_left = 2
		style_hover.border_width_right = 2
		style_hover.border_color = Color(0.28, 0.14, 0.04)

		style_pressed.bg_color = Color(0.38, 0.19, 0.06)
		style_pressed.border_width_bottom = 2
		style_pressed.border_width_top = 2
		style_pressed.border_width_left = 2
		style_pressed.border_width_right = 2
		style_pressed.border_color = Color(0.16, 0.07, 0.01)

		add_theme_color_override("font_color", Color(1.0, 0.96, 0.90))
		add_theme_color_override("font_hover_color", Color(1.0, 1.0, 0.96))
		add_theme_color_override("font_outline_color", Color(0.18, 0.08, 0.02))
		add_theme_constant_override("outline_size", 6)
		add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
		add_theme_constant_override("shadow_offset_y", 2)

	# Style khi disabled
	style_disabled.bg_color = Color(0.25, 0.22, 0.28, 0.7)
	style_disabled.border_width_bottom = 3
	style_disabled.border_width_top = 1
	style_disabled.border_width_left = 1
	style_disabled.border_width_right = 1
	style_disabled.border_color = Color(0.18, 0.15, 0.20, 0.6)

	for st in [style_normal, style_hover, style_pressed, style_disabled]:
		st.corner_radius_top_left = corner_r
		st.corner_radius_top_right = corner_r
		st.corner_radius_bottom_right = corner_r
		st.corner_radius_bottom_left = corner_r

	add_theme_stylebox_override("normal", style_normal)
	add_theme_stylebox_override("hover", style_hover)
	add_theme_stylebox_override("pressed", style_pressed)
	add_theme_stylebox_override("disabled", style_disabled)

func _animate_scale(target_scale: Vector2, duration: float, trans: Tween.TransitionType) -> void:
	if anim_tween and anim_tween.is_valid():
		anim_tween.kill()
	anim_tween = create_tween().set_trans(trans).set_ease(Tween.EASE_OUT)
	anim_tween.tween_property(self, "scale", target_scale, duration)

func _on_mouse_entered() -> void:
	if disabled: return
	_animate_scale(base_scale * 1.04, 0.12, Tween.TRANS_BACK)

func _on_mouse_exited() -> void:
	if disabled: return
	if not is_pressed_down:
		_animate_scale(base_scale, 0.10, Tween.TRANS_SINE)

func _on_button_down() -> void:
	if disabled: return
	is_pressed_down = true
	# Hiệu ứng lún mặt nút vật lý (Sink down by 3px into the 3D bevel)
	_animate_scale(base_scale * 0.94, 0.05, Tween.TRANS_SINE)

func _on_button_up() -> void:
	if disabled: return
	is_pressed_down = false
	_animate_scale(base_scale, 0.12, Tween.TRANS_BACK)

var _last_press_time: int = 0
const PRESS_DEBOUNCE_MS: int = 250

func _gui_input(event: InputEvent) -> void:
	if disabled: return
	if (event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.is_pressed()) or (event is InputEventScreenTouch and event.is_pressed()):
		var now = Time.get_ticks_msec()
		if now - _last_press_time < PRESS_DEBOUNCE_MS:
			accept_event()
			return
		_last_press_time = now

func _on_pressed() -> void:
	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_button_click()
