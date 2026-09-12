class_name PuffyMainMenu
extends Control

@onready var campaign_btn: Button = $VBox/Buttons/CampaignBtn
@onready var endless_btn: Button = $VBox/Buttons/EndlessBtn
@onready var tutorial_btn: Button = $VBox/Buttons/TutorialBtn
@onready var sound_btn: Button = $VBox/Buttons/SoundBtn
@onready var quit_btn: Button = $VBox/Buttons/QuitBtn
@onready var stats_label: Label = $VBox/StatsLabel
@onready var puffy_logo: TextureRect = $VBox/Logo

var tutorial_modal_scene = preload("res://scenes/ui/PuffyTutorialModal.tscn")

func _ready() -> void:
	campaign_btn.pressed.connect(_on_campaign_pressed)
	endless_btn.pressed.connect(_on_endless_pressed)
	tutorial_btn.pressed.connect(_on_tutorial_pressed)
	sound_btn.pressed.connect(_on_sound_pressed)
	quit_btn.pressed.connect(_on_quit_pressed)
	
	var total_stars = PuffyGameManager.get_total_stars()
	var max_stars = PuffyGameManager.max_levels * 3
	stats_label.text = "⭐ TỔNG SAO: %d / %d | KỶ LỤC ARCADE: %d" % [total_stars, max_stars, PuffyGameManager.endless_best_score]
	sound_btn.text = "🎵 Âm Thanh & BGM: BẬT" if not PuffySoundManager.is_muted else "🔇 Âm Thanh: TẮT"
	
	if OS.has_feature("web") or OS.has_feature("ios"):
		quit_btn.visible = false

func _process(_delta: float) -> void:
	var time = Time.get_ticks_msec() * 0.003
	puffy_logo.scale = Vector2(1.0 + sin(time) * 0.06, 1.0 - sin(time) * 0.06)
	puffy_logo.rotation = sin(time * 0.8) * 0.08

func _on_campaign_pressed() -> void:
	PuffySoundManager.play_stretch()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyLevelSelect.tscn")

func _on_endless_pressed() -> void:
	PuffySoundManager.play_launch()
	PuffyGameManager.start_endless_mode()

func _on_tutorial_pressed() -> void:
	PuffySoundManager.play_stretch()
	var modal = tutorial_modal_scene.instantiate()
	add_child(modal)

func _on_sound_pressed() -> void:
	PuffySoundManager.is_muted = not PuffySoundManager.is_muted
	PuffySoundManager.toggle_bgm()
	sound_btn.text = "🎵 Âm Thanh & BGM: BẬT" if not PuffySoundManager.is_muted else "🔇 Âm Thanh: TẮT"

func _on_quit_pressed() -> void:
	get_tree().quit()
