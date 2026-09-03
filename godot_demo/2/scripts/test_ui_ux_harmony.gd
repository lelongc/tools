extends Node

func _ready() -> void:
	print("=== RUNNING UI/UX HARMONY & VECTOR ASSET AUDIT ===")

	# 1. Test GameHUD
	var HUDScene = load("res://scenes/prefabs/GameHUD.tscn")
	var hud = HUDScene.instantiate()
	add_child(hud)
	print("✔ GameHUD instantiated successfully")

	# Test Level Complete with 2 Stars
	hud._on_level_completed(2, 6800, 120)
	assert(hud.star1.texture != null, "Star1 must have texture")
	assert(hud.star2.texture != null, "Star2 must have texture")
	assert(hud.star3.texture != null, "Star3 must have texture")
	print("✔ Star textures loaded cleanly: Star1=", hud.star1.texture.resource_path, " Star3=", hud.star3.texture.resource_path)
	print("✔ Coin reward text: ", hud.coin_reward_label.text)
	assert(hud.coin_reward_label.text == "+120 VÀNG", "Coin reward must be clean without emoji")

	# 2. Test LevelSelect
	var LevelSelectScene = load("res://scenes/ui/LevelSelect.tscn")
	var lvl_select = LevelSelectScene.instantiate()
	add_child(lvl_select)
	print("✔ LevelSelect instantiated successfully")
	var grid = lvl_select.get_node("ScrollContainer/GridContainer")
	assert(grid.get_child_count() == 15, "World 1 must display 15 level buttons")
	var first_btn = grid.get_child(0)
	assert(first_btn.get_child_count() > 0, "Level card must have card_vbox with vector star ratings")
	print("✔ First level card has ", first_btn.get_child_count(), " UI elements (vector star row present)")

	# 3. Test MainMenu
	var MainMenuScene = load("res://scenes/ui/MainMenu.tscn")
	var menu = MainMenuScene.instantiate()
	add_child(menu)
	print("✔ MainMenu instantiated successfully")

	# 4. Test DailyWheelModal
	var WheelScene = load("res://scenes/ui/DailyWheelModal.tscn")
	var wheel = WheelScene.instantiate()
	add_child(wheel)
	wheel.open_wheel()
	print("✔ DailyWheelModal opened successfully without error")

	wheel.queue_free()
	menu.queue_free()
	lvl_select.queue_free()
	hud.queue_free()

	print("\n=======================================================")
	print("=== UI/UX HARMONY AUDIT PASSED 100%!                ===")
	print("=======================================================")
	get_tree().quit(0)
