extends Control

@export var current_world: int = 1

@onready var grid: GridContainer = $ScrollContainer/GridContainer
@onready var world_title: Label = $WorldFrame/WorldNav/WorldTitle
@onready var total_stars_label: Label = $TopBar/Margin/HBox/TotalStars
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
		total_stars_label.text = "⭐ %d / 180" % stars

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

	for lvl in range(start_lvl, end_lvl + 1):
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(140, 95)
		btn.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
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

		if is_unlocked:
			var star_str = ""
			match stars:
				1: star_str = "⭐"
				2: star_str = "⭐⭐"
				3: star_str = "⭐⭐⭐"
				_: star_str = "---"

			btn.text = "%d\n%s" % [lvl, star_str]
			btn.add_theme_font_size_override("font_size", 20)
			
			style_norm.bg_color = Color(0.24, 0.12, 0.38)
			style_norm.border_width_bottom = 5
			style_norm.border_width_top = 2
			style_norm.border_width_left = 2
			style_norm.border_width_right = 2
			style_norm.border_color = Color(1.0, 0.84, 0.0, 0.8) # Gold border

			style_press.bg_color = Color(0.18, 0.08, 0.28)
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
			btn.text = "🔒\n%d" % lvl
			btn.disabled = true
			btn.add_theme_font_size_override("font_size", 16)
			
			style_norm.bg_color = Color(0.12, 0.08, 0.16)
			style_norm.border_width_bottom = 4
			style_norm.border_width_top = 1
			style_norm.border_width_left = 1
			style_norm.border_width_right = 1
			style_norm.border_color = Color(0.3, 0.25, 0.35)

			btn.add_theme_stylebox_override("disabled", style_norm)

		grid.add_child(btn)
