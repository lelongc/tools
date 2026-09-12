class_name PuffyGameOverModal
extends CanvasLayer

@onready var title_label: Label = $Panel/VBox/Title
@onready var desc_label: Label = $Panel/VBox/Desc
@onready var reward_ad_btn: Button = $Panel/VBox/Buttons/RewardAdBtn
@onready var retry_btn: Button = $Panel/VBox/Buttons/RetryBtn
@onready var select_btn: Button = $Panel/VBox/Buttons/BottomRow/SelectBtn
@onready var menu_btn: Button = $Panel/VBox/Buttons/BottomRow/MenuBtn

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	reward_ad_btn.pressed.connect(_on_reward_ad_pressed)
	retry_btn.pressed.connect(_on_retry_pressed)
	select_btn.pressed.connect(_on_select_pressed)
	menu_btn.pressed.connect(_on_menu_pressed)
	PuffyLocaleManager.locale_changed.connect(_on_locale_changed)
	_update_localized_texts()

func _on_locale_changed(_new_locale: String) -> void:
	_update_localized_texts()

func _update_localized_texts() -> void:
	title_label.text = PuffyLocaleManager.tr_key("FAIL_TITLE")
	desc_label.text = PuffyLocaleManager.tr_key("FAIL_DESC")
	reward_ad_btn.text = PuffyLocaleManager.tr_key("FAIL_REVIVE")
	retry_btn.text = PuffyLocaleManager.tr_key("FAIL_RETRY")
	select_btn.text = " " + PuffyLocaleManager.tr_key("FAIL_SELECT")
	menu_btn.text = " " + PuffyLocaleManager.tr_key("FAIL_MENU")

func _on_reward_ad_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.play_stretch()
	reward_ad_btn.disabled = true
	var ad_wait_msg = "⏳ ..."
	if PuffyLocaleManager.current_locale == "vi":
		ad_wait_msg = "⏳ ĐANG XEM QUẢNG CÁO..."
	elif PuffyLocaleManager.current_locale in ["zh", "zh_TW"]:
		ad_wait_msg = "⏳ 正在观看广告..."
	elif PuffyLocaleManager.current_locale == "ja":
		ad_wait_msg = "⏳ 広告を視聴中..."
	elif PuffyLocaleManager.current_locale == "en":
		ad_wait_msg = "⏳ WATCHING AD..."
	reward_ad_btn.text = ad_wait_msg
	
	var tween = create_tween()
	tween.tween_interval(0.5)
	tween.tween_callback(func():
		PuffyGameManager.grant_rewarded_shot()
		queue_free()
	)

func _on_retry_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.play_stretch()
	if PuffyGameManager.current_mode == PuffyGameManager.GameMode.CAMPAIGN:
		PuffyGameManager.start_campaign_level(PuffyGameManager.current_level)
	else:
		PuffyGameManager.start_endless_mode()

func _on_select_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.play_stretch()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyLevelSelect.tscn")

func _on_menu_pressed() -> void:
	PuffySoundManager.play_ui_click()
	PuffySoundManager.play_stretch()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyMainMenu.tscn")
