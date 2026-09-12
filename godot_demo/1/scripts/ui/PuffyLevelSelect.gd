class_name PuffyLevelSelect
extends Control

@onready var grid_container: GridContainer = $ScrollContainer/GridContainer
@onready var world_filter_bar: HBoxContainer = $WorldFilterBar
@onready var back_btn: Button = $BackBtn
@onready var total_stars_label: Label = $HeaderContainer/TotalStarsLabel

var style_level_unlocked: StyleBoxFlat = null
var style_level_cleared: StyleBoxFlat = null
var style_level_boss: StyleBoxFlat = null
var style_level_hover: StyleBoxFlat = null
var style_tab_active: StyleBoxFlat = null
var style_tab_inactive: StyleBoxFlat = null

var current_filtered_world: int = 0 # 0: Tất cả

var world_ranges = {
	1: [1, 7],
	2: [8, 16],
	3: [17, 23],
	4: [24, 32],
	5: [33, 39],
	6: [40, 48],
	7: [49, 55],
	8: [56, 60]
}

func _ready() -> void:
	_init_styles()
	back_btn.pressed.connect(_on_back_pressed)
	var max_stars = PuffyGameManager.max_levels * 3
	total_stars_label.text = "⭐ %d / %d" % [PuffyGameManager.get_total_stars(), max_stars]
	_build_world_filter_tabs()
	_populate_level_buttons()

func _init_styles() -> void:
	# Kiểu màn thường chưa đạt sao
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

	# Kiểu màn BOSS đặc biệt
	style_level_boss = StyleBoxFlat.new()
	style_level_boss.bg_color = Color(0.55, 0.08, 0.12, 0.92)
	style_level_boss.border_width_left = 3
	style_level_boss.border_width_top = 3
	style_level_boss.border_width_right = 3
	style_level_boss.border_width_bottom = 3
	style_level_boss.border_color = Color(1.0, 0.3, 0.3, 1.0)
	style_level_boss.corner_radius_top_left = 14
	style_level_boss.corner_radius_top_right = 14
	style_level_boss.corner_radius_bottom_right = 14
	style_level_boss.corner_radius_bottom_left = 14
	style_level_boss.shadow_color = Color(0.8, 0, 0, 0.4)
	style_level_boss.shadow_size = 5

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

	# Style Tab Lọc Vùng Biển
	style_tab_active = StyleBoxFlat.new()
	style_tab_active.bg_color = Color(1.0, 0.65, 0.0, 0.95)
	style_tab_active.corner_radius_top_left = 12
	style_tab_active.corner_radius_top_right = 12
	style_tab_active.corner_radius_bottom_right = 12
	style_tab_active.corner_radius_bottom_left = 12

	style_tab_inactive = StyleBoxFlat.new()
	style_tab_inactive.bg_color = Color(0.05, 0.2, 0.3, 0.75)
	style_tab_inactive.corner_radius_top_left = 12
	style_tab_inactive.corner_radius_top_right = 12
	style_tab_inactive.corner_radius_bottom_right = 12
	style_tab_inactive.corner_radius_bottom_left = 12

func _build_world_filter_tabs() -> void:
	for child in world_filter_bar.get_children():
		child.queue_free()
		
	var tab_names = ["Tất Cả", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"]
	for i in range(tab_names.size()):
		var tab_btn = Button.new()
		tab_btn.custom_minimum_size = Vector2(85, 30)
		tab_btn.text = tab_names[i]
		tab_btn.add_theme_font_size_override("font_size", 12)
		if i == current_filtered_world:
			tab_btn.add_theme_stylebox_override("normal", style_tab_active)
			tab_btn.add_theme_color_override("font_color", Color.BLACK)
		else:
			tab_btn.add_theme_stylebox_override("normal", style_tab_inactive)
			tab_btn.add_theme_color_override("font_color", Color.WHITE)
		tab_btn.pressed.connect(_on_world_filter_selected.bind(i))
		world_filter_bar.add_child(tab_btn)

func _on_world_filter_selected(w_idx: int) -> void:
	PuffySoundManager.play_stretch()
	current_filtered_world = w_idx
	_build_world_filter_tabs()
	_populate_level_buttons()

func _populate_level_buttons() -> void:
	for child in grid_container.get_children():
		child.queue_free()
		
	var start_lvl = 1
	var end_lvl = PuffyGameManager.max_levels
	if current_filtered_world > 0 and world_ranges.has(current_filtered_world):
		start_lvl = world_ranges[current_filtered_world][0]
		end_lvl = world_ranges[current_filtered_world][1]
		
	for i in range(start_lvl, end_lvl + 1):
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(135, 66)
		var is_boss = PuffyGameManager.is_boss_level(i)
		var stars = PuffyGameManager.level_stars.get(i, 0)
		var star_str = ""
		for s in range(stars):
			star_str += "⭐"
		if star_str.is_empty():
			star_str = "☆☆☆"
			
		if is_boss:
			btn.text = "👑 BOSS %d\n%s" % [i, star_str]
			btn.add_theme_stylebox_override("normal", style_level_boss)
			btn.add_theme_color_override("font_color", Color(1.0, 0.9, 0.3))
		elif stars > 0:
			btn.text = "MÀN %d\n%s" % [i, star_str]
			btn.add_theme_stylebox_override("normal", style_level_cleared)
			btn.add_theme_color_override("font_color", Color(1.0, 0.92, 0.3))
		else:
			btn.text = "MÀN %d\n%s" % [i, star_str]
			btn.add_theme_stylebox_override("normal", style_level_unlocked)
			btn.add_theme_color_override("font_color", Color(0.85, 0.95, 1.0))
			
		btn.add_theme_font_size_override("font_size", 13)
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
