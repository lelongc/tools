class_name MainMenu
extends Control

@onready var play_btn: Button = $VBox/Buttons/PlayBtn
@onready var mute_btn: Button = $VBox/Buttons/MuteBtn
@onready var quit_btn: Button = $VBox/Buttons/QuitBtn
@onready var record_label: Label = $VBox/RecordLabel

func _ready() -> void:
	play_btn.pressed.connect(_on_play_pressed)
	mute_btn.pressed.connect(_on_mute_pressed)
	quit_btn.pressed.connect(_on_quit_pressed)
	
	var high_wave = SaveManager.meta_data.get("high_wave", 1)
	var kills = SaveManager.meta_data.get("total_kills", 0)
	record_label.text = "KỶ LỤC: WAVE %d | TỔNG QUÁI DIỆT: %d" % [high_wave, kills]
	
	if OS.has_feature("web") or OS.has_feature("ios"):
		quit_btn.visible = false

func _on_play_pressed() -> void:
	SoundManager.play_snap()
	GameManager.start_new_run()

func _on_mute_pressed() -> void:
	SoundManager.is_sfx_muted = not SoundManager.is_sfx_muted
	mute_btn.text = "🔊 Âm Thanh: BẬT" if not SoundManager.is_sfx_muted else "🔇 Âm Thanh: TẮT"

func _on_quit_pressed() -> void:
	SaveManager.save_game()
	get_tree().quit()
