class_name GameOverModal
extends CanvasLayer

@onready var stats_label: Label = $Panel/VBox/StatsLabel
@onready var revive_btn: Button = $Panel/VBox/Buttons/ReviveBtn
@onready var menu_btn: Button = $Panel/VBox/Buttons/MenuBtn

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	get_tree().paused = true
	SoundManager.play_hit()
	
	var summary = GameManager.get_run_summary()
	stats_label.text = "DỪNG BƯỚC TẠI WAVE: %d / %d\n💀 QUÁI TIÊU DIỆT: %d\n⚔️ TỔNG SÁT THƯƠNG: %d\n💎 SHARDS THU ĐƯỢC: %d\nSEED: %s" % [
		summary.get("wave", 1),
		summary.get("max_waves", 20),
		summary.get("enemies_killed", 0),
		int(summary.get("total_damage", 0)),
		summary.get("shards", 0),
		summary.get("seed", "")
	]
	
	if GameManager.has_revived_this_run:
		revive_btn.disabled = true
		revive_btn.text = "ĐÃ SỬ DỤNG HỒI SINH"
	else:
		revive_btn.pressed.connect(_on_revive_pressed)
		
	menu_btn.pressed.connect(_on_menu_pressed)

func _on_revive_pressed() -> void:
	get_tree().paused = false
	GameManager.revive_player()
	queue_free()

func _on_menu_pressed() -> void:
	get_tree().paused = false
	SaveManager.save_game()
	get_tree().change_scene_to_file("res://scenes/ui/MainMenu.tscn")
