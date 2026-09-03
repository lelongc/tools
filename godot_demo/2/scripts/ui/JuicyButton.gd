extends Button
class_name JuicyButton

@export var is_primary_green: bool = false
@export var is_wood_brown: bool = false
@export var is_gold_action: bool = false

var base_scale: Vector2 = Vector2.ONE
var anim_tween: Tween = null

func _ready() -> void:
	base_scale = scale
	_update_pivot()
	resized.connect(_update_pivot)

	# Tự động gán StyleBox 3D Bevel chuẩn Stitch Design System
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

	var radius = 16

	if is_primary_green:
		# Nút Xanh Lá Glossy (Play Now / Next Level)
		style_normal.bg_color = Color(0.28, 0.68, 0.30)
		style_normal.border_width_bottom = 5
		style_normal.border_width_top = 2
		style_normal.border_width_left = 2
		style_normal.border_width_right = 2
		style_normal.border_color = Color(0.08, 0.36, 0.12)

		style_hover.bg_color = Color(0.38, 0.78, 0.40)
		style_hover.border_width_bottom = 5
		style_hover.border_width_top = 2
		style_hover.border_width_left = 2
		style_hover.border_width_right = 2
		style_hover.border_color = Color(0.08, 0.45, 0.14)

		style_pressed.bg_color = Color(0.22, 0.52, 0.24)
		style_pressed.border_width_bottom = 2
		style_pressed.border_width_top = 2
		style_pressed.border_width_left = 2
		style_pressed.border_width_right = 2
		style_pressed.border_color = Color(0.06, 0.25, 0.08)

		add_theme_color_override("font_color", Color.WHITE)
		add_theme_color_override("font_hover_color", Color(1.0, 1.0, 0.9))
		add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
		add_theme_constant_override("shadow_offset_y", 2)

	elif is_gold_action:
		# Nút Vàng Hoàng Gia (Rewarded Ad / Spin / Claim 3x)
		style_normal.bg_color = Color(1.0, 0.84, 0.08)
		style_normal.border_width_bottom = 5
		style_normal.border_width_top = 2
		style_normal.border_width_left = 2
		style_normal.border_width_right = 2
		style_normal.border_color = Color(0.55, 0.38, 0.0)

		style_hover.bg_color = Color(1.0, 0.90, 0.25)
		style_hover.border_width_bottom = 5
		style_hover.border_width_top = 2
		style_hover.border_width_left = 2
		style_hover.border_width_right = 2
		style_hover.border_color = Color(0.68, 0.48, 0.0)

		style_pressed.bg_color = Color(0.88, 0.72, 0.05)
		style_pressed.border_width_bottom = 2
		style_pressed.border_width_top = 2
		style_pressed.border_width_left = 2
		style_pressed.border_width_right = 2
		style_pressed.border_color = Color(0.45, 0.30, 0.0)

		# Chữ màu socola đậm cực kỳ rõ ràng, không bị chìm
		add_theme_color_override("font_color", Color(0.18, 0.08, 0.0))
		add_theme_color_override("font_hover_color", Color(0.1, 0.04, 0.0))
		add_theme_color_override("font_shadow_color", Color(1.0, 0.96, 0.75, 0.9))
		add_theme_constant_override("shadow_offset_y", 1)

	else:
		# Nút Gỗ Khắc Nổi (Level Select / Settings / Back / Restart)
		style_normal.bg_color = Color(0.44, 0.22, 0.05)
		style_normal.border_width_bottom = 5
		style_normal.border_width_top = 2
		style_normal.border_width_left = 2
		style_normal.border_width_right = 2
		style_normal.border_color = Color(0.20, 0.08, 0.0)

		style_hover.bg_color = Color(0.54, 0.28, 0.08)
		style_hover.border_width_bottom = 5
		style_hover.border_width_top = 2
		style_hover.border_width_left = 2
		style_hover.border_width_right = 2
		style_hover.border_color = Color(0.25, 0.10, 0.0)

		style_pressed.bg_color = Color(0.34, 0.16, 0.04)
		style_pressed.border_width_bottom = 2
		style_pressed.border_width_top = 2
		style_pressed.border_width_left = 2
		style_pressed.border_width_right = 2
		style_pressed.border_color = Color(0.14, 0.05, 0.0)

		add_theme_color_override("font_color", Color.WHITE)
		add_theme_color_override("font_hover_color", Color(1.0, 0.95, 0.85))
		add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
		add_theme_constant_override("shadow_offset_y", 2)

	for st in [style_normal, style_hover, style_pressed]:
		st.corner_radius_top_left = radius
		st.corner_radius_top_right = radius
		st.corner_radius_bottom_right = radius
		st.corner_radius_bottom_left = radius

	add_theme_stylebox_override("normal", style_normal)
	add_theme_stylebox_override("hover", style_hover)
	add_theme_stylebox_override("pressed", style_pressed)

func _animate_scale(target_scale: Vector2, duration: float, trans: Tween.TransitionType) -> void:
	if anim_tween and anim_tween.is_valid():
		anim_tween.kill()
	anim_tween = create_tween().set_trans(trans).set_ease(Tween.EASE_OUT)
	anim_tween.tween_property(self, "scale", target_scale, duration)

func _on_mouse_entered() -> void:
	_animate_scale(base_scale * 1.05, 0.14, Tween.TRANS_BACK)

func _on_mouse_exited() -> void:
	_animate_scale(base_scale, 0.12, Tween.TRANS_SINE)

func _on_button_down() -> void:
	_animate_scale(base_scale * 0.95, 0.06, Tween.TRANS_SINE)

func _on_button_up() -> void:
	_animate_scale(base_scale, 0.12, Tween.TRANS_BACK)

func _on_pressed() -> void:
	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_synth_tone(540.0, 0.06, "pop", 0.8)
