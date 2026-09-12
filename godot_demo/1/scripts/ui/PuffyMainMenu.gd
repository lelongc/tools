class_name PuffyMainMenu
extends Control

@onready var campaign_btn: Button = $VBox/PrimaryModes/CampaignBtn
@onready var endless_btn: Button = $VBox/PrimaryModes/EndlessBtn
@onready var lang_btn: Button = $VBox/UtilityDock/LangBtn
@onready var tutorial_btn: Button = $VBox/UtilityDock/TutorialBtn
@onready var sound_btn: Button = $VBox/UtilityDock/SoundBtn
@onready var quit_btn: Button = $VBox/UtilityDock/QuitBtn
@onready var stats_label: Label = $VBox/StatsLabel
@onready var subtitle_label: Label = $VBox/Subtitle
@onready var puffy_logo: TextureRect = $VBox/Logo

var tutorial_modal_scene = preload("res://scenes/ui/PuffyTutorialModal.tscn")
var icon_sound_on = preload("res://textures/icons/icon_sound_on.svg")
var icon_sound_off = preload("res://textures/icons/icon_sound_off.svg")

func _ready() -> void:
	campaign_btn.pressed.connect(_on_campaign_pressed)
	endless_btn.pressed.connect(_on_endless_pressed)
	lang_btn.pressed.connect(_on_lang_pressed)
	tutorial_btn.pressed.connect(_on_tutorial_pressed)
	sound_btn.pressed.connect(_on_sound_pressed)
	quit_btn.pressed.connect(_on_quit_pressed)
	
	PuffyLocaleManager.locale_changed.connect(_on_locale_changed)
	_update_localized_texts()
	
	if OS.has_feature("web") or OS.has_feature("ios"):
		quit_btn.visible = false

func _on_locale_changed(_new_locale: String) -> void:
	_update_localized_texts()

func _update_localized_texts() -> void:
	subtitle_label.text = PuffyLocaleManager.tr_key("GAME_SUBTITLE")
	campaign_btn.text = PuffyLocaleManager.tr_key("BTN_CAMPAIGN")
	endless_btn.text = PuffyLocaleManager.tr_key("BTN_ENDLESS")
	
	var total_stars = PuffyGameManager.get_total_stars()
	var max_stars = PuffyGameManager.max_levels * 3
	stats_label.text = PuffyLocaleManager.tr_key("STATS_SUMMARY", [total_stars, max_stars, PuffyGameManager.endless_best_score])
	
	lang_btn.text = " 🌐 %s" % PuffyLocaleManager.get_current_short_code()
	
	# Nhãn nút trợ giúp gọn gàng theo ngôn ngữ
	tutorial_btn.text = " %s" % _get_short_tutorial_text()
	quit_btn.text = _get_short_quit_text()
	_update_sound_btn()

func _get_short_tutorial_text() -> String:
	match PuffyLocaleManager.current_locale:
		"vi": return "Hướng Dẫn"
		"en": return "Tutorial"
		"ja": return "遊び方"
		"ko": return "도움말"
		"zh": return "玩法说明"
		"zh_TW": return "玩法說明"
		"es": return "Guía"
		"pt": return "Tutorial"
		"ru": return "Обучение"
		"fr": return "Tutoriel"
		"de": return "Anleitung"
		"id": return "Panduan"
		"th": return "วิธีเล่น"
		_: return "Tutorial"

func _get_short_quit_text() -> String:
	match PuffyLocaleManager.current_locale:
		"vi": return "Thoát"
		"en": return "Quit"
		"ja": return "終了"
		"ko": return "종료"
		"zh": return "退出"
		"zh_TW": return "退出"
		"es": return "Salir"
		"pt": return "Sair"
		"ru": return "Выход"
		"fr": return "Quitter"
		"de": return "Beenden"
		"id": return "Keluar"
		"th": return "ออก"
		_: return "Quit"

func _update_sound_btn() -> void:
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

func _process(_delta: float) -> void:
	var time = Time.get_ticks_msec() * 0.003
	puffy_logo.scale = Vector2(1.0 + sin(time) * 0.06, 1.0 - sin(time) * 0.06)
	puffy_logo.rotation = sin(time * 0.8) * 0.08

func _on_campaign_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.play_stretch()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyLevelSelect.tscn")

func _on_endless_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.play_launch()
	PuffyGameManager.start_endless_mode()

func _on_lang_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffyLocaleManager.toggle_next_locale()

func _on_tutorial_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.play_stretch()
	var modal = tutorial_modal_scene.instantiate()
	add_child(modal)

func _on_sound_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.is_muted = not PuffySoundManager.is_muted
	PuffySoundManager.toggle_bgm()
	_update_sound_btn()

func _on_quit_pressed() -> void:
	PuffySoundManager.play_ui_click()
	get_tree().quit()
