class_name PuffyLevelSelect
extends Control

@onready var grid_container: GridContainer = $ScrollContainer/GridContainer
@onready var back_btn: Button = $BackBtn
@onready var total_stars_label: Label = $HeaderContainer/TotalStarsLabel

func _ready() -> void:
	back_btn.pressed.connect(_on_back_pressed)
	var max_stars = PuffyGameManager.max_levels * 3
	total_stars_label.text = "⭐ %d / %d" % [PuffyGameManager.get_total_stars(), max_stars]
	_populate_level_buttons()

func _populate_level_buttons() -> void:
	for child in grid_container.get_children():
		child.queue_free()
		
	for i in range(1, PuffyGameManager.max_levels + 1):
		var btn = Button.new()
		btn.custom_minimum_size = Vector2(120, 68)
		var stars = PuffyGameManager.level_stars.get(i, 0)
		var star_str = ""
		for s in range(stars):
			star_str += "⭐"
		if star_str.is_empty():
			star_str = "☆☆☆"
			
		btn.text = "MÀN %d\n%s" % [i, star_str]
		btn.add_theme_font_size_override("font_size", 13)
		btn.pressed.connect(_on_level_selected.bind(i))
		grid_container.add_child(btn)

func _on_level_selected(level_num: int) -> void:
	PuffySoundManager.play_stretch()
	PuffyGameManager.start_campaign_level(level_num)

func _on_back_pressed() -> void:
	PuffySoundManager.play_stretch()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyMainMenu.tscn")
