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
@onready var btn_settings: Button = get_node_or_null("TopBar/Margin/HBox/BtnSettings") if get_node_or_null("TopBar/Margin/HBox/BtnSettings") else get_node_or_null("TopBar/Margin/HBox/BtnReset")
@onready var btn_lang: Button = $TopBar/Margin/HBox/BtnLang
@onready var footer_label: Label = $Footer

var wheel_modal_instance: Node = null
var shop_modal_instance: Node = null
var settings_modal_instance: Node = null

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

	_apply_cartoon_ui_theme()
	_apply_safe_area()
	get_viewport().size_changed.connect(_apply_safe_area)

	if has_node("/root/LocalizationManager"):
		get_node("/root/LocalizationManager").language_changed.connect(func(_code): _update_language_ui())

	if has_node("/root/SaveManager"):
		get_node("/root/SaveManager").coins_updated.connect(func(_c): _update_coin_count())

	btn_play.pressed.connect(_on_btn_play_pressed)
	btn_levels.pressed.connect(_on_btn_levels_pressed)
	btn_sound.pressed.connect(_on_btn_sound_pressed)
	if btn_settings:
		btn_settings.pressed.connect(_on_btn_settings_pressed)
	if btn_lang:
		btn_lang.pressed.connect(_on_btn_lang_pressed)
	if btn_wheel:
		btn_wheel.pressed.connect(_on_btn_wheel_pressed)
	if btn_shop:
		btn_shop.pressed.connect(_on_btn_shop_pressed)

	_update_star_count()
	_update_coin_count()
	_update_sound_button()
	_update_language_ui()
	_setup_wheel_badge()

func _apply_cartoon_ui_theme() -> void:
	var top_bar = get_node_or_null("TopBar")
	if top_bar:
		var sbt = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/panel_top_bar_hud.svg", 20, 8, 20, 16)
		if sbt: top_bar.add_theme_stylebox_override("panel", sbt)

	var sbt_badge = JuicyButton._get_or_create_sbt("res://assets/sprites/ui/panel_badge_capsule.svg", 16, 12, 16, 16)
	if sbt_badge:
		var star_badge = get_node_or_null("TopBar/Margin/HBox/StarBadge")
		if star_badge: star_badge.add_theme_stylebox_override("panel", sbt_badge)
		var coin_badge = get_node_or_null("TopBar/Margin/HBox/CoinBadge")
		if coin_badge: coin_badge.add_theme_stylebox_override("panel", sbt_badge)

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
	if btn_shop: btn_shop.text = "  " + lm.t("KEY_SHOP")
	if footer_label: footer_label.text = lm.t("KEY_FOOTER")
	if btn_lang:
		if lm.has_method("get_short_language_display"):
			btn_lang.text = lm.get_short_language_display()
		else:
			btn_lang.text = lm.get_current_language_display()
	_update_sound_button()

func _update_star_count() -> void:
	if has_node("/root/SaveManager") and total_stars_label:
		var stars = get_node("/root/SaveManager").save_data.get("total_stars", 0)
		total_stars_label.text = "%d / 600" % stars

func _update_coin_count() -> void:
	if has_node("/root/SaveManager") and total_coins_label:
		var coins = get_node("/root/SaveManager").get_coins()
		total_coins_label.text = "%d" % coins


var wheel_badge: Control = null

func _setup_wheel_badge() -> void:
	if not btn_wheel: return
	wheel_badge = Control.new()
	wheel_badge.name = "WheelBadge"
	wheel_badge.mouse_filter = Control.MOUSE_FILTER_IGNORE
	btn_wheel.add_child(wheel_badge)

	var dot = PanelContainer.new()
	dot.name = "Dot"
	dot.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var sb = StyleBoxFlat.new()
	sb.bg_color = Color(1.0, 0.22, 0.28, 1.0)
	sb.border_width_left = 2
	sb.border_width_right = 2
	sb.border_width_top = 2
	sb.border_width_bottom = 2
	sb.border_color = Color.WHITE
	sb.corner_radius_top_left = 8
	sb.corner_radius_top_right = 8
	sb.corner_radius_bottom_right = 8
	sb.corner_radius_bottom_left = 8
	sb.content_margin_left = 4
	sb.content_margin_right = 4
	sb.content_margin_top = 1
	sb.content_margin_bottom = 1
	dot.add_theme_stylebox_override("panel", sb)

	var lbl = Label.new()
	lbl.text = "FREE"
	lbl.add_theme_font_size_override("font_size", 9)
	lbl.add_theme_color_override("font_color", Color.WHITE)
	dot.add_child(lbl)

	wheel_badge.add_child(dot)
	dot.position = Vector2(btn_wheel.size.x - 28.0, -8.0)

	var tw = dot.create_tween().set_loops()
	tw.tween_property(dot, "scale", Vector2(1.15, 1.15), 0.45).set_trans(Tween.TRANS_SINE)
	tw.tween_property(dot, "scale", Vector2.ONE, 0.45).set_trans(Tween.TRANS_SINE)

	_update_wheel_badge()

func _update_wheel_badge() -> void:
	if not wheel_badge: return
	var has_free = false
	if has_node("/root/SaveManager"):
		has_free = get_node("/root/SaveManager").is_first_daily_spin_free()
	wheel_badge.visible = has_free

func _on_btn_wheel_pressed() -> void:
	if not wheel_modal_instance:
		var scene = load("res://scenes/ui/DailyWheelModal.tscn")
		wheel_modal_instance = scene.instantiate()
		add_child(wheel_modal_instance)
		wheel_modal_instance.wheel_closed.connect(func():
			_update_coin_count()
			_update_wheel_badge()
		)
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
		_update_language_ui()

func _on_btn_sound_pressed() -> void:
	if has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		var enabled = not sm.save_data.get("sound_enabled", true)
		sm.save_data["sound_enabled"] = enabled
		sm.save_game()
		_update_sound_button()
		AudioServer.set_bus_mute(0, not enabled)

func _on_btn_settings_pressed() -> void:
	if settings_modal_instance and is_instance_valid(settings_modal_instance):
		return
	var settings_scene = load("res://scenes/ui/SettingsModal.tscn")
	if settings_scene:
		settings_modal_instance = settings_scene.instantiate()
		add_child(settings_modal_instance)
		settings_modal_instance.settings_closed.connect(func():
			_update_sound_button()
			_update_star_count()
			_update_coin_count()
			_update_language_ui()
		)

func _on_btn_shop_pressed() -> void:
	if shop_modal_instance and is_instance_valid(shop_modal_instance):
		return
	var shop_scene = load("res://scenes/ui/ShopModal.tscn")
	if shop_scene:
		shop_modal_instance = shop_scene.instantiate()
		add_child(shop_modal_instance)

func _exit_tree() -> void:
	if get_viewport() and get_viewport().size_changed.is_connected(_apply_safe_area):
		get_viewport().size_changed.disconnect(_apply_safe_area)

func _handle_back_button() -> bool:
	if settings_modal_instance and is_instance_valid(settings_modal_instance):
		settings_modal_instance.queue_free()
		settings_modal_instance = null
		return true
	if wheel_modal_instance and is_instance_valid(wheel_modal_instance):
		wheel_modal_instance.queue_free()
		wheel_modal_instance = null
		return true
	if shop_modal_instance and is_instance_valid(shop_modal_instance):
		shop_modal_instance.queue_free()
		shop_modal_instance = null
		return true
	return false

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_GO_BACK_REQUEST:
		_handle_back_button()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel"):
		if not _handle_back_button():
			if has_node("/root/GameManager"):
				get_node("/root/GameManager")._handle_mobile_back()
			else:
				get_tree().quit(0)

func _apply_safe_area() -> void:
	if not is_inside_tree(): return
	var safe_rect = DisplayServer.get_display_safe_area()
	var win_size = DisplayServer.window_get_size()
	if win_size.y <= 0: return

	var vp_size = get_viewport().get_visible_rect().size
	var scale_y = vp_size.y / float(win_size.y)
	var top_inset = float(safe_rect.position.y) * scale_y
	var bottom_inset = float(win_size.y - (safe_rect.position.y + safe_rect.size.y)) * scale_y

	var top_bar = get_node_or_null("TopBar") as Control
	if top_bar:
		var target_top = max(10.0, top_inset + 6.0)
		top_bar.offset_top = target_top
		top_bar.offset_bottom = target_top + 56.0

	var footer = get_node_or_null("Footer") as Control
	if footer:
		var target_bottom = min(-8.0, -(bottom_inset + 8.0))
		footer.offset_bottom = target_bottom

