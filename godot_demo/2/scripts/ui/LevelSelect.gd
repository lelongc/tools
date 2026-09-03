extends Control

@export var current_world: int = 1

@onready var grid: GridContainer = $ScrollContainer/GridContainer
@onready var world_title: Label = $WorldFrame/WorldNav/WorldTitle
@onready var total_stars_label: Label = $TopBar/Margin/HBox/StarBadge/TotalStars
@onready var btn_back: Button = $TopBar/Margin/HBox/BtnBack
@onready var btn_prev_world: Button = $WorldFrame/WorldNav/BtnPrevWorld
@onready var btn_next_world: Button = $WorldFrame/WorldNav/BtnNextWorld

func _ready() -> void:
	btn_back.pressed.connect(func(): GameManager.go_to_main_menu())
	btn_prev_world.pressed.connect(_prev_world)
	btn_next_world.pressed.connect(_next_world)

	if has_node("/root/LocalizationManager"):
		get_node("/root/LocalizationManager").language_changed.connect(func(_c): _render_world_levels())

	_update_total_stars()
	_render_world_levels()

func _update_total_stars() -> void:
	if has_node("/root/SaveManager") and total_stars_label:
		var stars = get_node("/root/SaveManager").save_data.get("total_stars", 0)
		total_stars_label.text = "%d / 180" % stars

func _prev_world() -> void:
	if current_world > 1:
		current_world -= 1
		_render_world_levels()

func _next_world() -> void:
	if current_world < 4:
		current_world += 1
		_render_world_levels()

func _render_world_levels() -> void:
	if has_node("/root/LocalizationManager"):
		var lm = get_node("/root/LocalizationManager")
		world_title.text = lm.t("KEY_WORLD_%d" % current_world)
		btn_back.text = lm.t("KEY_MENU")

	btn_prev_world.disabled = (current_world <= 1)
	btn_next_world.disabled = (current_world >= 4)

	# Xóa các nút cũ
	for child in grid.get_children():
		child.queue_free()

	var start_lvl = (current_world - 1) * 15 + 1
	var end_lvl = start_lvl + 14

	var tex_star_full = preload("res://assets/ui/icons/icon_star.svg")
	var tex_star_empty = preload("res://assets/ui/icons/icon_star_empty.svg")

	for lvl in range(start_lvl, end_lvl + 1):
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(140, 95)
		btn.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		btn.text = "" # Không dùng text thô với emoji!

		var is_unlocked = true
		var stars = 0
		if has_node("/root/SaveManager"):
			is_unlocked = get_node("/root/SaveManager").is_level_unlocked(lvl)
			stars = get_node("/root/SaveManager").get_level_stars(lvl)

		var style_norm = StyleBoxFlat.new()
		var style_press = StyleBoxFlat.new()
		style_norm.corner_radius_top_left = 14
		style_norm.corner_radius_top_right = 14
		style_norm.corner_radius_bottom_right = 14
		style_norm.corner_radius_bottom_left = 14
		style_press.corner_radius_top_left = 14
		style_press.corner_radius_top_right = 14
		style_press.corner_radius_bottom_right = 14
		style_press.corner_radius_bottom_left = 14

		# Khung hiển thị nội dung thẻ màn chơi (VBoxContainer)
		var card_vbox = VBoxContainer.new()
		card_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
		card_vbox.mouse_filter = Control.MOUSE_FILTER_IGNORE
		card_vbox.set_anchors_preset(Control.PRESET_FULL_RECT)
		card_vbox.add_theme_constant_override("separation", 6)
		btn.add_child(card_vbox)

		var lvl_lbl = Label.new()
		lvl_lbl.text = str(lvl)
		lvl_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lvl_lbl.add_theme_font_size_override("font_size", 24)
		lvl_lbl.add_theme_constant_override("shadow_offset_y", 2)
		lvl_lbl.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.8))
		card_vbox.add_child(lvl_lbl)

		if is_unlocked:
			lvl_lbl.add_theme_color_override("font_color", Color(1.0, 0.9, 0.25))

			var stars_hbox = HBoxContainer.new()
			stars_hbox.alignment = BoxContainer.ALIGNMENT_CENTER
			stars_hbox.add_theme_constant_override("separation", 6)
			card_vbox.add_child(stars_hbox)

			# 3 Ngôi sao Vector cao cấp chuẩn Angry Birds
			for s_idx in range(3):
				var s_rect = TextureRect.new()
				s_rect.custom_minimum_size = Vector2(20, 20)
				s_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
				s_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
				s_rect.texture = tex_star_full if (s_idx < stars) else tex_star_empty
				stars_hbox.add_child(s_rect)

			style_norm.bg_color = Color(0.24, 0.12, 0.38, 0.95)
			style_norm.border_width_bottom = 5
			style_norm.border_width_top = 2
			style_norm.border_width_left = 2
			style_norm.border_width_right = 2
			style_norm.border_color = Color(1.0, 0.84, 0.0, 0.85) # Gold border

			style_press.bg_color = Color(0.18, 0.08, 0.28, 0.95)
			style_press.border_width_bottom = 2
			style_press.border_width_top = 2
			style_press.border_width_left = 2
			style_press.border_width_right = 2
			style_press.border_color = Color(0.8, 0.65, 0.0)

			btn.add_theme_stylebox_override("normal", style_norm)
			btn.add_theme_stylebox_override("hover", style_norm)
			btn.add_theme_stylebox_override("pressed", style_press)

			var target_lvl = lvl
			btn.pressed.connect(func():
				if has_node("/root/SoundManager"):
					get_node("/root/SoundManager").play_synth_tone(580.0, 0.08, "pop", 0.9)
				GameManager.load_level(target_lvl)
			)
		else:
			lvl_lbl.add_theme_color_override("font_color", Color(0.5, 0.45, 0.6))

			var lock_lbl = Label.new()
			lock_lbl.text = "CHƯA MỞ"
			lock_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			lock_lbl.add_theme_font_size_override("font_size", 12)
			lock_lbl.add_theme_color_override("font_color", Color(0.45, 0.4, 0.55))
			card_vbox.add_child(lock_lbl)

			style_norm.bg_color = Color(0.13, 0.08, 0.18, 0.9)
			style_norm.border_width_bottom = 3
			style_norm.border_width_top = 1
			style_norm.border_width_left = 1
			style_norm.border_width_right = 1
			style_norm.border_color = Color(0.32, 0.22, 0.4, 0.5)

			btn.disabled = true
			btn.add_theme_stylebox_override("disabled", style_norm)

		grid.add_child(btn)
