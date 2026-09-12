class_name VictoryModal
extends CanvasLayer

@onready var stats_label: Label = $Panel/VBox/StatsLabel
@onready var copy_seed_btn: Button = $Panel/VBox/Buttons/CopySeedBtn
@onready var menu_btn: Button = $Panel/VBox/Buttons/MenuBtn

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	get_tree().paused = true
	SoundManager.play_buy()
	
	var summary = GameManager.get_run_summary()
	stats_label.text = "PHÁ ĐẢO TOÀN DIỆN 20 WAVES!\n💀 QUÁI TIÊU DIỆT: %d\n⚔️ TỔNG SÁT THƯƠNG: %d\n💎 SHARDS THU ĐƯỢC: %d\nSEED: %s" % [
		summary.get("enemies_killed", 0),
		int(summary.get("total_damage", 0)),
		summary.get("shards", 0),
		summary.get("seed", "")
	]
	
	copy_seed_btn.pressed.connect(_on_copy_seed_pressed)
	menu_btn.pressed.connect(_on_menu_pressed)

func _on_copy_seed_pressed() -> void:
	DisplayServer.clipboard_set("Tôi đã phá đảo Runic Slice với Seed: " + GameManager.run_seed)
	copy_seed_btn.text = "✅ ĐÃ SAO CHÉP VÀO CLIPBOARD!"

func _on_menu_pressed() -> void:
	get_tree().paused = false
	SaveManager.save_game()
	get_tree().change_scene_to_file("res://scenes/ui/MainMenu.tscn")
