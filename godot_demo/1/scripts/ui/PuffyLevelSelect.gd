class_name PuffyLevelSelect
extends Control

@onready var grid_container: GridContainer = $ScrollContainer/GridContainer
@onready var world_filter_bar: HBoxContainer = $WorldFilterBar
@onready var back_btn: Button = $BottomBar/BackBtn
@onready var reset_btn: Button = $BottomBar/ResetBtn
@onready var total_stars_label: Label = $HeaderContainer/TotalStarsLabel

var tex_btn_gold = preload("res://textures/ui/btn_bubble_gold.svg")
var tex_btn_blue = preload("res://textures/ui/btn_bubble_blue.svg")
var tex_btn_coral = preload("res://textures/ui/btn_bubble_coral.svg")
var tex_icon_crown = preload("res://textures/icons/icon_crown.svg")

var style_level_unlocked: StyleBoxTexture = null
var style_level_cleared: StyleBoxTexture = null
var style_level_boss: StyleBoxTexture = null
var style_tab_active: StyleBoxTexture = null
var style_tab_inactive: StyleBoxTexture = null

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
	if reset_btn:
		reset_btn.pressed.connect(_on_reset_pressed)
	_update_stars_display()
	_build_world_filter_tabs()
	_populate_level_buttons()

func _update_stars_display() -> void:
	var max_stars = PuffyGameManager.max_levels * 3
	total_stars_label.text = "⭐ %d / %d" % [PuffyGameManager.get_total_stars(), max_stars]

func _init_styles() -> void:
	style_level_unlocked = StyleBoxTexture.new()
	style_level_unlocked.texture = tex_btn_blue
	style_level_unlocked.texture_margin_left = 20.0
	style_level_unlocked.texture_margin_top = 14.0
	style_level_unlocked.texture_margin_right = 20.0
	style_level_unlocked.texture_margin_bottom = 16.0

	style_level_cleared = StyleBoxTexture.new()
	style_level_cleared.texture = tex_btn_gold
	style_level_cleared.texture_margin_left = 20.0
	style_level_cleared.texture_margin_top = 14.0
	style_level_cleared.texture_margin_right = 20.0
	style_level_cleared.texture_margin_bottom = 16.0

	style_level_boss = StyleBoxTexture.new()
	style_level_boss.texture = tex_btn_coral
	style_level_boss.texture_margin_left = 20.0
	style_level_boss.texture_margin_top = 14.0
	style_level_boss.texture_margin_right = 20.0
	style_level_boss.texture_margin_bottom = 16.0

	style_tab_active = StyleBoxTexture.new()
	style_tab_active.texture = tex_btn_gold
	style_tab_active.texture_margin_left = 16.0
	style_tab_active.texture_margin_top = 10.0
	style_tab_active.texture_margin_right = 16.0
	style_tab_active.texture_margin_bottom = 12.0

	style_tab_inactive = StyleBoxTexture.new()
	style_tab_inactive.texture = tex_btn_blue
	style_tab_inactive.texture_margin_left = 16.0
	style_tab_inactive.texture_margin_top = 10.0
	style_tab_inactive.texture_margin_right = 16.0
	style_tab_inactive.texture_margin_bottom = 12.0

func _build_world_filter_tabs() -> void:
	for child in world_filter_bar.get_children():
		child.queue_free()
		
	var tab_names = ["Tất Cả", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"]
	for i in range(tab_names.size()):
		var tab_btn = Button.new()
		tab_btn.custom_minimum_size = Vector2(90, 34)
		tab_btn.text = tab_names[i]
		tab_btn.add_theme_font_size_override("font_size", 13)
		if i == current_filtered_world:
			tab_btn.add_theme_stylebox_override("normal", style_tab_active)
			tab_btn.add_theme_stylebox_override("hover", style_tab_active)
			tab_btn.add_theme_stylebox_override("pressed", style_tab_active)
			tab_btn.add_theme_color_override("font_color", Color(0.35, 0.15, 0))
		else:
			tab_btn.add_theme_stylebox_override("normal", style_tab_inactive)
			tab_btn.add_theme_stylebox_override("hover", style_tab_inactive)
			tab_btn.add_theme_stylebox_override("pressed", style_tab_inactive)
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
		btn.custom_minimum_size = Vector2(145, 68)
		var is_boss = PuffyGameManager.is_boss_level(i)
		var stars = PuffyGameManager.level_stars.get(i, 0)
		var star_str = ""
		for s in range(stars):
			star_str += "⭐"
		if star_str.is_empty():
			star_str = "☆☆☆"
			
		if is_boss:
			btn.icon = tex_icon_crown
			btn.expand_icon = true
			btn.text = " TRÙM %d\n%s" % [i, star_str]
			btn.add_theme_stylebox_override("normal", style_level_boss)
			btn.add_theme_stylebox_override("hover", style_level_boss)
			btn.add_theme_stylebox_override("pressed", style_level_boss)
			btn.add_theme_color_override("font_color", Color(1.0, 0.95, 0.4))
		elif stars > 0:
			btn.text = "MÀN %d\n%s" % [i, star_str]
			btn.add_theme_stylebox_override("normal", style_level_cleared)
			btn.add_theme_stylebox_override("hover", style_level_cleared)
			btn.add_theme_stylebox_override("pressed", style_level_cleared)
			btn.add_theme_color_override("font_color", Color(0.35, 0.15, 0))
		else:
			btn.text = "MÀN %d\n%s" % [i, star_str]
			btn.add_theme_stylebox_override("normal", style_level_unlocked)
			btn.add_theme_stylebox_override("hover", style_level_unlocked)
			btn.add_theme_stylebox_override("pressed", style_level_unlocked)
			btn.add_theme_color_override("font_color", Color(1.0, 1.0, 1.0))
			
		btn.add_theme_font_size_override("font_size", 14)
		btn.pressed.connect(_on_level_selected.bind(i))
		grid_container.add_child(btn)

func _on_level_selected(level_num: int) -> void:
	PuffySoundManager.play_stretch()
	PuffyGameManager.start_campaign_level(level_num)

func _on_back_pressed() -> void:
	PuffySoundManager.play_stretch()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyMainMenu.tscn")

func _on_reset_pressed() -> void:
	PuffySoundManager.play_deflate()
	PuffyGameManager.reset_all_saved_data()
	_update_stars_display()
	_populate_level_buttons()
