extends Control


@onready var title_label: Label = $CenterContainer/VBoxContainer/LogoContainer/Title
@onready var subtitle_label: Label = $CenterContainer/VBoxContainer/LogoContainer/Subtitle
@onready var mascot_root: Node2D = get_node_or_null("CenterContainer/VBoxContainer/LogoContainer/MascotContainer/MascotRoot")
@onready var mascot_body: Sprite2D = get_node_or_null("CenterContainer/VBoxContainer/LogoContainer/MascotContainer/MascotRoot/Body")
@onready var mascot_basket: Sprite2D = get_node_or_null("CenterContainer/VBoxContainer/LogoContainer/MascotContainer/MascotRoot/Basket")
@onready var mascot_left_wing: Sprite2D = get_node_or_null("CenterContainer/VBoxContainer/LogoContainer/MascotContainer/MascotRoot/LeftWing")
@onready var mascot_right_wing: Sprite2D = get_node_or_null("CenterContainer/VBoxContainer/LogoContainer/MascotContainer/MascotRoot/RightWing")

@onready var total_stars_label: Label = get_node_or_null("TopBar/Margin/HBox/StarBadge/StarMargin/StarHBox/TotalStarsLabel") if get_node_or_null("TopBar/Margin/HBox/StarBadge/StarMargin/StarHBox/TotalStarsLabel") else get_node_or_null("TopBar/Margin/HBox/StarBadge/StarMargin/TotalStarsLabel")
@onready var total_coins_label: Label = get_node_or_null("TopBar/Margin/HBox/CoinBadge/CoinMargin/CoinHBox/TotalCoinsLabel") if get_node_or_null("TopBar/Margin/HBox/CoinBadge/CoinMargin/CoinHBox/TotalCoinsLabel") else get_node_or_null("TopBar/Margin/HBox/CoinBadge/CoinMargin/TotalCoinsLabel")
@onready var btn_play: Button = $CenterContainer/VBoxContainer/BtnPlay
@onready var btn_levels: Button = $CenterContainer/VBoxContainer/BtnLevels
@onready var btn_wheel: Button = $CenterContainer/VBoxContainer/BtnWheel
@onready var btn_shop: Button = get_node_or_null("CenterContainer/VBoxContainer/BtnShop")
@onready var btn_sound: Button = $TopBar/Margin/HBox/BtnSound
@onready var btn_reset: Button = get_node_or_null("TopBar/Margin/HBox/BtnReset")
@onready var btn_lang: Button = $TopBar/Margin/HBox/BtnLang
@onready var footer_label: Label = $Footer

var wheel_modal_instance: Node = null
var shop_modal_instance: Node = null

func _ready() -> void:
	var bg_sky = get_node_or_null("Background/SkyPanorama") as TextureRect
	if bg_sky:
		var t_sky = ParticleHelper._safe_load("res://assets/sprites/environment/sky_clouds_panorama.svg")
		if t_sky:
			bg_sky.texture = t_sky
			bg_sky.modulate = Color(0.9, 0.82, 0.98, 0.7)

	var bg_cav = get_node_or_null("Background/CavernBackdrop") as TextureRect
	if bg_cav:
		var t_cav = ParticleHelper._safe_load("res://assets/sprites/environment/cavern_backdrop_dungeon.svg")
		if t_cav:
			bg_cav.texture = t_cav
			bg_cav.modulate = Color(0.92, 0.88, 1.0, 0.85)

	if mascot_body:
		var tb = ParticleHelper._safe_load("res://assets/sprites/player/chicken_aviator_body.svg")
		if tb: mascot_body.texture = tb
	if mascot_basket:
		var tk = ParticleHelper._safe_load("res://assets/sprites/player/chicken_basket_wicker.svg")
		if tk: mascot_basket.texture = tk
	if mascot_left_wing:
		var tw = ParticleHelper._safe_load("res://assets/sprites/player/chicken_wing_flap.svg")
		if tw: mascot_left_wing.texture = tw
	if mascot_right_wing:
		var tw = ParticleHelper._safe_load("res://assets/sprites/player/chicken_wing_flap.svg")
		if tw: mascot_right_wing.texture = tw

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
	if btn_reset:
		btn_reset.pressed.connect(_on_btn_reset_pressed)
	if btn_lang:
		btn_lang.pressed.connect(_on_btn_lang_pressed)
	if btn_wheel:
		btn_wheel.pressed.connect(_on_btn_wheel_pressed)
	if btn_shop:
		btn_shop.pressed.connect(_on_btn_shop_pressed)

func _process(_delta: float) -> void:
	if mascot_root:
		var t = Time.get_ticks_msec() * 0.001
		mascot_root.position.y = 50.0 + sin(t * 3.0) * 8.0
		mascot_root.rotation = sin(t * 2.0) * 0.04
		if mascot_left_wing:
			mascot_left_wing.rotation = sin(t * 6.5) * 0.28
		if mascot_right_wing:
			mascot_right_wing.rotation = -sin(t * 6.5) * 0.28

func _update_language_ui() -> void:
	if not has_node("/root/LocalizationManager"): return
	var lm = get_node("/root/LocalizationManager")

	if subtitle_label: subtitle_label.text = lm.t("KEY_SUBTITLE")
	if btn_play: btn_play.text = "  " + lm.t("KEY_PLAY")
	if btn_levels: btn_levels.text = " " + lm.t("KEY_SELECT_LEVEL")
	if btn_wheel: btn_wheel.text = lm.t("KEY_LUCKY_WHEEL")
	if btn_shop: btn_shop.text = "🛍️ " + lm.t("KEY_SHOP")
	if footer_label: footer_label.text = lm.t("KEY_FOOTER")
	if btn_lang: btn_lang.text = lm.get_current_language_display()
	_update_sound_button()

func _update_star_count() -> void:
	if has_node("/root/SaveManager") and total_stars_label:
		var stars = get_node("/root/SaveManager").save_data.get("total_stars", 0)
		total_stars_label.text = "%d / 600" % stars

func _update_coin_count() -> void:
	if has_node("/root/SaveManager") and total_coins_label:
		var coins = get_node("/root/SaveManager").get_coins()
		total_coins_label.text = "%d" % coins


func _on_btn_wheel_pressed() -> void:
	if not wheel_modal_instance:
		var scene = load("res://scenes/ui/DailyWheelModal.tscn")
		wheel_modal_instance = scene.instantiate()
		add_child(wheel_modal_instance)
		wheel_modal_instance.wheel_closed.connect(func(): _update_coin_count())
	wheel_modal_instance.open_wheel()

const ICON_SOUND_ON = preload("res://assets/ui/icons/btn_sound_on.svg")
const ICON_SOUND_OFF = preload("res://assets/ui/icons/btn_sound_off.svg")

func _update_sound_button() -> void:
	if has_node("/root/SaveManager") and btn_sound:
		var enabled = get_node("/root/SaveManager").save_data.get("sound_enabled", true)
		btn_sound.text = ""
		btn_sound.icon = ICON_SOUND_ON if enabled else ICON_SOUND_OFF

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

var reset_confirm_timer: float = 0.0

func _on_btn_reset_pressed() -> void:
	var now = Time.get_ticks_msec() / 1000.0
	if now - reset_confirm_timer < 3.0:
		# Bấm lần 2 trong vòng 3 giây -> Xác nhận xóa tiến trình!
		if has_node("/root/SaveManager"):
			get_node("/root/SaveManager").reset_save()
			_update_star_count()
			_update_coin_count()
		reset_confirm_timer = 0.0
		if btn_reset:
			btn_reset.modulate = Color.WHITE
			btn_reset.tooltip_text = "Đã xóa tiến trình!"
	else:
		# Bấm lần 1 -> Cảnh báo bằng đổi màu đỏ cam và yêu cầu bấm lại
		reset_confirm_timer = now
		if btn_reset:
			btn_reset.modulate = Color(1.0, 0.4, 0.4)
			btn_reset.tooltip_text = "Bấm lại trong 3s để xác nhận xóa!"
			get_tree().create_timer(3.0).timeout.connect(func():
				if is_instance_valid(btn_reset) and reset_confirm_timer != 0.0:
					btn_reset.modulate = Color.WHITE
					btn_reset.tooltip_text = "Xóa tiến trình (Reset Progress)"
					reset_confirm_timer = 0.0
			)

func _on_btn_shop_pressed() -> void:
	if shop_modal_instance and is_instance_valid(shop_modal_instance):
		return
	var shop_scene = load("res://scenes/ui/ShopModal.tscn")
	if shop_scene:
		shop_modal_instance = shop_scene.instantiate()
		add_child(shop_modal_instance)
