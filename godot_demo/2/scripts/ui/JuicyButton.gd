extends Button
class_name JuicyButton

@export var is_primary_green: bool = false
@export var is_wood_brown: bool = false
@export var is_gold_action: bool = false

var original_pos_y: float = 0.0
var base_scale: Vector2 = Vector2.ONE

func _ready() -> void:
	pivot_offset = size * 0.5
	base_scale = scale
	original_pos_y = position.y

	# Tự động gán StyleBox 3D Bevel chuẩn Stitch Design System
	_apply_tactile_style()

	mouse_entered.connect(_on_mouse_entered)
	mouse_exited.connect(_on_mouse_exited)
	button_down.connect(_on_button_down)
	button_up.connect(_on_button_up)
	pressed.connect(_on_pressed)

func _apply_tactile_style() -> void:
	var style_normal = StyleBoxFlat.new()
	var style_hover = StyleBoxFlat.new()
	var style_pressed = StyleBoxFlat.new()

	var radius = 16

	if is_primary_green:
		# Nút Xanh Lá Glossy (Play Now / Next Level)
		style_normal.bg_color = Color(0.3, 0.69, 0.31) # #4caf50
		style_normal.border_width_bottom = 6
		style_normal.border_width_top = 2
		style_normal.border_width_left = 2
		style_normal.border_width_right = 2
		style_normal.border_color = Color(0, 0.33, 0.07) # Bottom Lip #005313

		style_hover.bg_color = Color(0.4, 0.8, 0.4)
		style_hover.border_width_bottom = 6
		style_hover.border_width_top = 2
		style_hover.border_width_left = 2
		style_hover.border_width_right = 2
		style_hover.border_color = Color(0, 0.4, 0.1)

		style_pressed.bg_color = Color(0.24, 0.55, 0.25)
		style_pressed.border_width_bottom = 2
		style_pressed.border_width_top = 2
		style_pressed.border_width_left = 2
		style_pressed.border_width_right = 2
		style_pressed.border_color = Color(0, 0.2, 0.05)

	elif is_gold_action:
		# Nút Vàng Hoàng Gia (Nuke Ad / Big Reward)
		style_normal.bg_color = Color(1.0, 0.84, 0.0) # #ffd700
		style_normal.border_width_bottom = 6
		style_normal.border_width_top = 2
		style_normal.border_width_left = 2
		style_normal.border_width_right = 2
		style_normal.border_color = Color(0.48, 0.35, 0.0)

		style_hover.bg_color = Color(1.0, 0.9, 0.2)
		style_hover.border_width_bottom = 6
		style_hover.border_width_top = 2
		style_hover.border_width_left = 2
		style_hover.border_width_right = 2
		style_hover.border_color = Color(0.6, 0.45, 0.0)

		style_pressed.bg_color = Color(0.85, 0.7, 0.0)
		style_pressed.border_width_bottom = 2
		style_pressed.border_width_top = 2
		style_pressed.border_width_left = 2
		style_pressed.border_width_right = 2
		style_pressed.border_color = Color(0.4, 0.28, 0.0)

	else:
		# Nút Gỗ Khắc Nổi (Level Select / Settings / Normal Buttons)
		style_normal.bg_color = Color(0.46, 0.2, 0.0) # Wood brown #753401
		style_normal.border_width_bottom = 6
		style_normal.border_width_top = 2
		style_normal.border_width_left = 2
		style_normal.border_width_right = 2
		style_normal.border_color = Color(0.2, 0.07, 0.0) # Bottom Lip #321200

		style_hover.bg_color = Color(0.55, 0.25, 0.0)
		style_hover.border_width_bottom = 6
		style_hover.border_width_top = 2
		style_hover.border_width_left = 2
		style_hover.border_width_right = 2
		style_hover.border_color = Color(0.25, 0.1, 0.0)

		style_pressed.bg_color = Color(0.35, 0.15, 0.0)
		style_pressed.border_width_bottom = 2
		style_pressed.border_width_top = 2
		style_pressed.border_width_left = 2
		style_pressed.border_width_right = 2
		style_pressed.border_color = Color(0.15, 0.05, 0.0)

	for st in [style_normal, style_hover, style_pressed]:
		st.corner_radius_top_left = radius
		st.corner_radius_top_right = radius
		st.corner_radius_bottom_right = radius
		st.corner_radius_bottom_left = radius

	add_theme_stylebox_override("normal", style_normal)
	add_theme_stylebox_override("hover", style_hover)
	add_theme_stylebox_override("pressed", style_pressed)
	add_theme_color_override("font_color", Color.WHITE)
	add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.6))
	add_theme_constant_override("shadow_offset_y", 2)

func _on_mouse_entered() -> void:
	var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", base_scale * 1.05, 0.15)

func _on_mouse_exited() -> void:
	var tween = create_tween().set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", base_scale, 0.15)

func _on_button_down() -> void:
	var tween = create_tween().set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", base_scale * 0.95, 0.08)

func _on_button_up() -> void:
	var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", base_scale, 0.15)

func _on_pressed() -> void:
	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_synth_tone(520.0, 0.06, "pop", 0.8)
