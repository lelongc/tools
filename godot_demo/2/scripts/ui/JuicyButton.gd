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
	focus_mode = Control.FOCUS_NONE
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

func set_button_style(style_name: String) -> void:
	is_primary_green = (style_name == "green")
	is_gold_action = (style_name == "gold")
	is_danger_red = (style_name == "red")
	is_wood_brown = (style_name == "wood")
	_apply_tactile_style()

static var _sbt_cache: Dictionary = {}

static func _get_or_create_sbt(tex_path: String, ml: int, mt: int, mr: int, mb: int, c_ml: int = -1, c_mt: int = -1, c_mr: int = -1, c_mb: int = -1) -> StyleBoxTexture:
	var cache_key = "%s_%d_%d_%d_%d_%d_%d_%d_%d" % [tex_path, ml, mt, mr, mb, c_ml, c_mt, c_mr, c_mb]
	if _sbt_cache.has(cache_key):
		return _sbt_cache[cache_key]
	var tex = ParticleHelper._safe_load(tex_path)
	if tex:
		var sbt = StyleBoxTexture.new()
		sbt.texture = tex
		sbt.texture_margin_left = ml
		sbt.texture_margin_top = mt
		sbt.texture_margin_right = mr
		sbt.texture_margin_bottom = mb
		if c_ml >= 0:
			sbt.content_margin_left = c_ml
			sbt.content_margin_top = c_mt
			sbt.content_margin_right = c_mr
			sbt.content_margin_bottom = c_mb
		_sbt_cache[cache_key] = sbt
		return sbt
	return null

func _apply_tactile_style() -> void:
	var style_normal = StyleBoxFlat.new()
	var style_hover = StyleBoxFlat.new()
	var style_pressed = StyleBoxFlat.new()
	var style_disabled = StyleBoxFlat.new()

	var radius = 16
	var corner_r = int(clamp(size.y * 0.32, 12, 20)) if size.y > 0 else radius

	var is_square_icon = (custom_minimum_size.x <= 56 and custom_minimum_size.y <= 56 and custom_minimum_size.x > 0 and (text.strip_edges() == "" or icon != null)) \
		or (size.x <= 56 and size.y <= 56 and size.x > 0 and text.strip_edges() == "")
	var sbt_normal: StyleBoxTexture = null
	var sbt_pressed: StyleBoxTexture = null

	if is_square_icon:
		sbt_normal = _get_or_create_sbt("res://assets/sprites/ui/btn_icon_wood_normal.svg", 12, 12, 12, 12, 6, 6, 6, 6)
		sbt_pressed = _get_or_create_sbt("res://assets/sprites/ui/btn_icon_wood_pressed.svg", 12, 12, 12, 12, 6, 6, 6, 6)
		add_theme_color_override("font_color", Color(1.0, 0.96, 0.90))
		add_theme_color_override("font_outline_color", Color(0.18, 0.08, 0.02))
		add_theme_constant_override("outline_size", 4)
		add_theme_constant_override("shadow_offset_y", 0)
	elif is_primary_green:
		# NÚT XANH LỤC BẢO FLAT (Play / Next Level / Resume)
		sbt_normal = _get_or_create_sbt("res://assets/sprites/ui/btn_primary_green_normal.svg", 16, 16, 16, 16, 14, 8, 14, 8)
		sbt_pressed = _get_or_create_sbt("res://assets/sprites/ui/btn_primary_green_pressed.svg", 16, 16, 16, 16, 14, 8, 14, 8)
		add_theme_color_override("font_color", Color(1.0, 1.0, 1.0))
		add_theme_color_override("font_hover_color", Color(1.0, 1.0, 0.95))
		add_theme_color_override("font_outline_color", Color(0.08, 0.35, 0.16))
		add_theme_constant_override("outline_size", 4)
		add_theme_constant_override("shadow_offset_y", 0)
	elif is_gold_action:
		# NÚT VÀNG HOÀNG KIM FLAT (Lucky Wheel / Claim 3X / Rewarded Ad)
		sbt_normal = _get_or_create_sbt("res://assets/sprites/ui/btn_gold_action_normal.svg", 16, 16, 16, 16, 14, 8, 14, 8)
		sbt_pressed = _get_or_create_sbt("res://assets/sprites/ui/btn_gold_action_pressed.svg", 16, 16, 16, 16, 14, 8, 14, 8)
		add_theme_color_override("font_color", Color(0.20, 0.10, 0.0))
		add_theme_color_override("font_hover_color", Color(0.12, 0.05, 0.0))
		add_theme_color_override("font_outline_color", Color(1.0, 0.96, 0.8))
		add_theme_constant_override("outline_size", 3)
		add_theme_constant_override("shadow_offset_y", 0)
	elif is_danger_red:
		# NÚT ĐỎ SAN HÔ FLAT (Close / Skip / Exit)
		sbt_normal = _get_or_create_sbt("res://assets/sprites/ui/btn_danger_red_normal.svg", 16, 16, 16, 16, 14, 8, 14, 8)
		sbt_pressed = _get_or_create_sbt("res://assets/sprites/ui/btn_danger_red_pressed.svg", 16, 16, 16, 16, 14, 8, 14, 8)
		add_theme_color_override("font_color", Color(1.0, 1.0, 1.0))
		add_theme_color_override("font_hover_color", Color(1.0, 0.95, 0.95))
		add_theme_color_override("font_outline_color", Color(0.35, 0.08, 0.08))
		add_theme_constant_override("outline_size", 4)
		add_theme_constant_override("shadow_offset_y", 0)
	else:
		# NÚT GỖ SỒI MỘC FLAT (Level Select / Settings / Restart / Back)
		sbt_normal = _get_or_create_sbt("res://assets/sprites/ui/btn_wood_brown_normal.svg", 16, 16, 16, 16, 12, 8, 12, 8)
		sbt_pressed = _get_or_create_sbt("res://assets/sprites/ui/btn_wood_brown_pressed.svg", 16, 16, 16, 16, 12, 8, 12, 8)
		add_theme_color_override("font_color", Color(1.0, 0.96, 0.90))
		add_theme_color_override("font_hover_color", Color(1.0, 1.0, 0.96))
		add_theme_color_override("font_outline_color", Color(0.18, 0.08, 0.02))
		add_theme_constant_override("outline_size", 4)
		add_theme_constant_override("shadow_offset_y", 0)

	if sbt_normal:
		add_theme_stylebox_override("normal", sbt_normal)
		add_theme_stylebox_override("hover", sbt_normal)
		add_theme_stylebox_override("pressed", sbt_pressed)
		add_theme_stylebox_override("disabled", sbt_pressed)
	else:
		# Fallback StyleBoxFlat nếu không nạp được texture
		style_normal.bg_color = Color(0.48, 0.26, 0.10)
		style_normal.border_width_bottom = 6
		style_normal.border_color = Color(0.22, 0.10, 0.02)
		for st in [style_normal, style_hover, style_pressed, style_disabled]:
			st.corner_radius_top_left = corner_r
			st.corner_radius_top_right = corner_r
			st.corner_radius_bottom_right = corner_r
			st.corner_radius_bottom_left = corner_r
		add_theme_stylebox_override("normal", style_normal)
		add_theme_stylebox_override("hover", style_hover)
		add_theme_stylebox_override("pressed", style_pressed)
		add_theme_stylebox_override("disabled", style_disabled)

	add_theme_stylebox_override("focus", StyleBoxEmpty.new())

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

var _last_mouse_press_time: int = -999999
var _last_touch_press_time: int = -999999
var _last_press_time: int:
	get: return _last_mouse_press_time
	set(v): _last_mouse_press_time = v
const PRESS_DEBOUNCE_MS: int = 250

func _gui_input(event: InputEvent) -> void:
	if disabled: return
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.is_pressed():
		var now = Time.get_ticks_msec()
		if now - _last_mouse_press_time < PRESS_DEBOUNCE_MS:
			accept_event()
			return
		_last_mouse_press_time = now
	elif event is InputEventScreenTouch and event.is_pressed():
		var now = Time.get_ticks_msec()
		if now - _last_touch_press_time < PRESS_DEBOUNCE_MS:
			accept_event()
			return
		_last_touch_press_time = now

func _on_pressed() -> void:
	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_button_click()
