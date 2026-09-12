class_name PuffyPauseModal
extends CanvasLayer

@onready var title_label: Label = $Panel/VBox/Title
@onready var resume_btn: Button = $Panel/VBox/ResumeBtn
@onready var restart_btn: Button = $Panel/VBox/ActionsRow/RestartBtn
@onready var select_btn: Button = $Panel/VBox/ActionsRow/SelectBtn
@onready var sound_btn: Button = $Panel/VBox/SettingsRow/SoundBtn
@onready var lang_btn: Button = $Panel/VBox/SettingsRow/LangBtn
@onready var menu_btn: Button = $Panel/VBox/MenuBtn

var icon_sound_on = preload("res://textures/icons/icon_sound_on.svg")
var icon_sound_off = preload("res://textures/icons/icon_sound_off.svg")

func _ready() -> void:
	add_to_group("pause_modal")
	process_mode = Node.PROCESS_MODE_ALWAYS
	get_tree().paused = true
	
	resume_btn.pressed.connect(_on_resume_pressed)
	restart_btn.pressed.connect(_on_restart_pressed)
	select_btn.pressed.connect(_on_select_pressed)
	sound_btn.pressed.connect(_on_sound_pressed)
	lang_btn.pressed.connect(_on_lang_pressed)
	menu_btn.pressed.connect(_on_menu_pressed)
	
	PuffyLocaleManager.locale_changed.connect(_on_locale_changed)
	_update_localized_texts()

func _on_locale_changed(_new_locale: String) -> void:
	_update_localized_texts()

func _update_localized_texts() -> void:
	title_label.text = PuffyLocaleManager.tr_key("PAUSE_TITLE")
	resume_btn.text = PuffyLocaleManager.tr_key("PAUSE_RESUME")
	restart_btn.text = PuffyLocaleManager.tr_key("PAUSE_RESTART")
	select_btn.text = PuffyLocaleManager.tr_key("PAUSE_SELECT")
	menu_btn.text = PuffyLocaleManager.tr_key("PAUSE_MENU")
	lang_btn.text = " 🌐 %s" % PuffyLocaleManager.get_current_short_code()
	_update_sound_btn_text()

func _update_sound_btn_text() -> void:
	sound_btn.icon = icon_sound_off if PuffySoundManager.is_muted else icon_sound_on
	var on_off = "OFF" if PuffySoundManager.is_muted else "ON"
	if PuffyLocaleManager.current_locale == "vi":
		on_off = "TẮT" if PuffySoundManager.is_muted else "BẬT"
	elif PuffyLocaleManager.current_locale in ["zh", "zh_TW"]:
		on_off = "关" if PuffySoundManager.is_muted else "开"
	elif PuffyLocaleManager.current_locale == "ja":
		on_off = "オフ" if PuffySoundManager.is_muted else "オン"
	elif PuffyLocaleManager.current_locale == "ko":
		on_off = "꺼짐" if PuffySoundManager.is_muted else "켜짐"
	sound_btn.text = " %s" % on_off

func _on_lang_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffyLocaleManager.toggle_next_locale()

func _on_resume_pressed() -> void:
	PuffySoundManager.play_ui_click()
	get_tree().paused = false
	queue_free()

func _on_restart_pressed() -> void:
	PuffySoundManager.play_ui_click()
	get_tree().paused = false
	queue_free()
	if PuffyGameManager.current_mode == PuffyGameManager.GameMode.CAMPAIGN:
		PuffyGameManager.start_campaign_level(PuffyGameManager.current_level)
	else:
		PuffyGameManager.start_endless_mode()

func _on_sound_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.is_muted = not PuffySoundManager.is_muted
	PuffySoundManager.toggle_bgm()
	_update_sound_btn_text()

func _on_select_pressed() -> void:
	PuffySoundManager.play_ui_click()
	get_tree().paused = false
	queue_free()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyLevelSelect.tscn")

func _on_menu_pressed() -> void:
	PuffySoundManager.play_ui_click()
	get_tree().paused = false
	queue_free()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyMainMenu.tscn")
