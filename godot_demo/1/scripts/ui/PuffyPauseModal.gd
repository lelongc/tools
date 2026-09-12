class_name PuffyPauseModal
extends CanvasLayer

@onready var resume_btn: Button = $Panel/VBox/Buttons/ResumeBtn
@onready var restart_btn: Button = $Panel/VBox/Buttons/RestartBtn
@onready var sound_btn: Button = $Panel/VBox/Buttons/SoundBtn
@onready var select_btn: Button = $Panel/VBox/Buttons/SelectBtn
@onready var menu_btn: Button = $Panel/VBox/Buttons/MenuBtn

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	get_tree().paused = true
	
	resume_btn.pressed.connect(_on_resume_pressed)
	restart_btn.pressed.connect(_on_restart_pressed)
	sound_btn.pressed.connect(_on_sound_pressed)
	select_btn.pressed.connect(_on_select_pressed)
	menu_btn.pressed.connect(_on_menu_pressed)
	
	_update_sound_btn_text()

func _update_sound_btn_text() -> void:
	if PuffySoundManager.is_muted:
		sound_btn.text = "🔇 Âm Thanh: TẮT"
	else:
		sound_btn.text = "🎵 Âm Thanh: BẬT"

func _on_resume_pressed() -> void:
	get_tree().paused = false
	queue_free()

func _on_restart_pressed() -> void:
	get_tree().paused = false
	queue_free()
	if PuffyGameManager.current_mode == PuffyGameManager.GameMode.CAMPAIGN:
		PuffyGameManager.start_campaign_level(PuffyGameManager.current_level)
	else:
		PuffyGameManager.start_endless_mode()

func _on_sound_pressed() -> void:
	PuffySoundManager.is_muted = not PuffySoundManager.is_muted
	PuffySoundManager.toggle_bgm()
	_update_sound_btn_text()

func _on_select_pressed() -> void:
	get_tree().paused = false
	queue_free()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyLevelSelect.tscn")

func _on_menu_pressed() -> void:
	get_tree().paused = false
	queue_free()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyMainMenu.tscn")
