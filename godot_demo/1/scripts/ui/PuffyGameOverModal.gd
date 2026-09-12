class_name PuffyGameOverModal
extends CanvasLayer

@onready var reward_ad_btn: Button = $Panel/VBox/Buttons/RewardAdBtn
@onready var retry_btn: Button = $Panel/VBox/Buttons/RetryBtn
@onready var select_btn: Button = $Panel/VBox/Buttons/SelectBtn
@onready var menu_btn: Button = $Panel/VBox/Buttons/MenuBtn

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	reward_ad_btn.pressed.connect(_on_reward_ad_pressed)
	retry_btn.pressed.connect(_on_retry_pressed)
	select_btn.pressed.connect(_on_select_pressed)
	menu_btn.pressed.connect(_on_menu_pressed)

func _on_reward_ad_pressed() -> void:
	PuffySoundManager.play_stretch()
	reward_ad_btn.disabled = true
	reward_ad_btn.text = "⏳ ĐANG XEM QUẢNG CÁO..."
	
	# Giả lập xem video quảng cáo 0.6s (hoặc callback từ Google AdMob SDK)
	var tween = create_tween()
	tween.tween_interval(0.6)
	tween.tween_callback(func():
		PuffyGameManager.grant_rewarded_shot()
		queue_free()
	)

func _on_retry_pressed() -> void:
	PuffySoundManager.play_stretch()
	if PuffyGameManager.current_mode == PuffyGameManager.GameMode.CAMPAIGN:
		PuffyGameManager.start_campaign_level(PuffyGameManager.current_level)
	else:
		PuffyGameManager.start_endless_mode()

func _on_select_pressed() -> void:
	PuffySoundManager.play_stretch()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyLevelSelect.tscn")

func _on_menu_pressed() -> void:
	PuffySoundManager.play_stretch()
	get_tree().change_scene_to_file("res://scenes/ui/PuffyMainMenu.tscn")
