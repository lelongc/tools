class_name PuffyLevelSelect
extends Control

@onready var grid_container: GridContainer = $ScrollContainer/GridContainer
@onready var back_btn: Button = $BackBtn
@onready var total_stars_label: Label = $HeaderContainer/TotalStarsLabel

var style_level_unlocked: StyleBoxFlat = null
var style_level_cleared: StyleBoxFlat = null
var style_level_hover: StyleBoxFlat = null

func _ready() -> void:
	_init_styles()
	back_btn.pressed.connect(_on_back_pressed)
	var max_stars = PuffyGameManager.max_levels * 3
	total_stars_label.text = "⭐ %d / %d" % [PuffyGameManager.get_total_stars(), max_stars]
	_populate_level_buttons()

func _init_styles() -> void:
	# Kiểu màn chưa đạt sao
	style_level_unlocked = StyleBoxFlat.new()
	style_level_unlocked.bg_color = Color(0.04, 0.28, 0.42, 0.88)
	style_level_unlocked.border_width_left = 2
	style_level_unlocked.border_width_top = 2
	style_level_unlocked.border_width_right = 2
	style_level_unlocked.border_width_bottom = 2
	style_level_unlocked.border_color = Color(0.18, 0.65, 0.82, 0.9)
	style_level_unlocked.corner_radius_top_left = 14
	style_level_unlocked.corner_radius_top_right = 14
	style_level_unlocked.corner_radius_bottom_right = 14
	style_level_unlocked.corner_radius_bottom_left = 14

	# Kiểu màn đã đạt sao
	style_level_cleared = StyleBoxFlat.new()
	style_level_cleared.bg_color = Color(0.06, 0.42, 0.45, 0.92)
	style_level_cleared.border_width_left = 2
	style_level_cleared.border_width_top = 2
	style_level_cleared.border_width_right = 2
	style_level_cleared.border_width_bottom = 2
	style_level_cleared.border_color = Color(1.0, 0.85, 0.25, 1.0)
	style_level_cleared.corner_radius_top_left = 14
	style_level_cleared.corner_radius_top_right = 14
	style_level_cleared.corner_radius_bottom_right = 14
	style_level_cleared.corner_radius_bottom_left = 14
	style_level_cleared.shadow_color = Color(0, 0, 0, 0.3)
	style_level_cleared.shadow_size = 4

	# Kiểu khi rê chuột
	style_level_hover = StyleBoxFlat.new()
	style_level_hover.bg_color = Color(0.08, 0.55, 0.62, 0.95)
	style_level_hover.border_width_left = 3
	style_level_hover.border_width_top = 3
	style_level_hover.border_width_right = 3
	style_level_hover.border_width_bottom = 3
	style_level_hover.border_color = Color(0.6, 1.0, 0.9, 1.0)
	style_level_hover.corner_radius_top_left = 14
	style_level_hover.corner_radius_top_right = 14
	style_level_hover.corner_radius_bottom_right = 14
	style_level_hover.corner_radius_bottom_left = 14

func _populate_level_buttons() -> void:
	for child in grid_container.get_children():
		child.queue_free()
		
	for i in range(1, PuffyGameManager.max_levels + 1):
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(125, 68)
		var stars = PuffyGameManager.level_stars.get(i, 0)
		var star_str = ""
		for s in range(stars):
			star_str += "⭐"
		if star_str.is_empty():
			star_str = "☆☆☆"
			
		btn.text = "MÀN %d\n%s" % [i, star_str]
		btn.add_theme_font_size_override("font_size", 14)
		
		if stars > 0:
			btn.add_theme_stylebox_override("normal", style_level_cleared)
			btn.add_theme_color_override("font_color", Color(1.0, 0.92, 0.3))
		else:
			btn.add_theme_stylebox_override("normal", style_level_unlocked)
			btn.add_theme_color_override("font_color", Color(0.85, 0.95, 1.0))
			
		btn.add_theme_stylebox_override("hover", style_level_hover)
		btn.add_theme_stylebox_override("pressed", style_level_cleared)
		btn.pressed.connect(_on_level_selected.bind(i))
		grid_container.add_child(btn)

func _on_level_selected(level_num: int) -> void:
	PuffySoundManager.play_stretch()
	PuffyGameManager.start_campaign_level(level_num)

func _on_back_pressed() -> void:
	PuffySoundManager.play_stretch()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyMainMenu.tscn")
