extends Control

@onready var title_label: Label = $CenterContainer/VBoxContainer/LogoContainer/Title
@onready var subtitle_label: Label = $CenterContainer/VBoxContainer/LogoContainer/Subtitle
@onready var total_stars_label: Label = $TopBar/Margin/HBox/StarBadge/StarMargin/TotalStarsLabel
@onready var total_coins_label: Label = $TopBar/Margin/HBox/CoinBadge/CoinMargin/TotalCoinsLabel
@onready var btn_play: Button = $CenterContainer/VBoxContainer/BtnPlay
@onready var btn_levels: Button = $CenterContainer/VBoxContainer/BtnLevels
@onready var btn_wheel: Button = $CenterContainer/VBoxContainer/BtnWheel
@onready var btn_sound: Button = $TopBar/Margin/HBox/BtnSound
@onready var btn_lang: Button = $TopBar/Margin/HBox/BtnLang
@onready var footer_label: Label = $Footer

var wheel_modal_instance: Node = null

func _ready() -> void:
	if title_label:
		var tween = create_tween().set_loops()
		tween.tween_property(title_label, "scale", Vector2(1.05, 1.05), 0.6).set_trans(Tween.TRANS_SINE)
		tween.tween_property(title_label, "scale", Vector2.ONE, 0.6).set_trans(Tween.TRANS_SINE)

	_update_star_count()
	_update_coin_count()
	_update_sound_button()
	_update_language_ui()

	if has_node("/root/LocalizationManager"):
		get_node("/root/LocalizationManager").language_changed.connect(func(_code): _update_language_ui())

	if has_node("/root/SaveManager"):
		get_node("/root/SaveManager").coins_updated.connect(func(_c): _update_coin_count())

	btn_play.pressed.connect(_on_btn_play_pressed)
	btn_levels.pressed.connect(_on_btn_levels_pressed)
	btn_sound.pressed.connect(_on_btn_sound_pressed)
	if btn_lang:
		btn_lang.pressed.connect(_on_btn_lang_pressed)
	if btn_wheel:
		btn_wheel.pressed.connect(_on_btn_wheel_pressed)

func _update_language_ui() -> void:
	if not has_node("/root/LocalizationManager"): return
	var lm = get_node("/root/LocalizationManager")

	if subtitle_label: subtitle_label.text = lm.t("KEY_SUBTITLE")
	if btn_play: btn_play.text = "  " + lm.t("KEY_PLAY")
	if btn_levels: btn_levels.text = " " + lm.t("KEY_SELECT_LEVEL")
	if btn_wheel: btn_wheel.text = "🎡 " + lm.t("KEY_LUCKY_WHEEL")
	if footer_label: footer_label.text = lm.t("KEY_FOOTER")
	if btn_lang: btn_lang.text = lm.get_current_language_display()
	_update_sound_button()

func _update_star_count() -> void:
	if has_node("/root/SaveManager") and total_stars_label:
		var stars = get_node("/root/SaveManager").save_data.get("total_stars", 0)
		total_stars_label.text = "⭐ %d / 180" % stars

func _update_coin_count() -> void:
	if has_node("/root/SaveManager") and total_coins_label:
		var coins = get_node("/root/SaveManager").get_coins()
		total_coins_label.text = "🪙 %d" % coins

func _on_btn_wheel_pressed() -> void:
	if not wheel_modal_instance:
		var scene = load("res://scenes/ui/DailyWheelModal.tscn")
		wheel_modal_instance = scene.instantiate()
		add_child(wheel_modal_instance)
		wheel_modal_instance.wheel_closed.connect(func(): _update_coin_count())
	wheel_modal_instance.open_wheel()

func _update_sound_button() -> void:
	if has_node("/root/SaveManager") and btn_sound:
		var enabled = get_node("/root/SaveManager").save_data.get("sound_enabled", true)
		if has_node("/root/LocalizationManager"):
			var lm = get_node("/root/LocalizationManager")
			btn_sound.text = lm.t("KEY_SOUND_ON") if enabled else lm.t("KEY_SOUND_OFF")
		else:
			btn_sound.text = "🔊 BẬT" if enabled else "🔇 TẮT"

func _on_btn_play_pressed() -> void:
	var highest = 1
	if has_node("/root/SaveManager"):
		highest = get_node("/root/SaveManager").save_data.get("highest_unlocked_level", 1)
	GameManager.load_level(highest)

func _on_btn_levels_pressed() -> void:
	GameManager.go_to_level_select()

func _on_btn_lang_pressed() -> void:
	if has_node("/root/LocalizationManager"):
		get_node("/root/LocalizationManager").cycle_language()

func _on_btn_sound_pressed() -> void:
	if has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		var enabled = not sm.save_data.get("sound_enabled", true)
		sm.save_data["sound_enabled"] = enabled
		sm.save_game()
		_update_sound_button()
		AudioServer.set_bus_mute(0, not enabled)
