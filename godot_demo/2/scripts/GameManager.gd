extends Node

var score: int = 0
var level_coins_earned: int = 0
var is_game_running: bool = false

@onready var player: Node3D = get_tree().root.find_child("Player", true, false)
@onready var hud: CanvasLayer = get_tree().root.find_child("HUD", true, false)

# UI Elements - Start Lobby
@onready var start_panel: Control = get_tree().root.find_child("StartPanel", true, false)
@onready var tap_to_start_btn: Button = get_tree().root.find_child("TapToStartBtn", true, false)
@onready var tap_hint_label: Label = get_tree().root.find_child("TapHintLabel", true, false)
@onready var game_title_label: Label = get_tree().root.find_child("GameTitle", true, false)
@onready var game_sub_label: Label = get_tree().root.find_child("GameSubTitle", true, false)
@onready var start_button: Button = get_tree().root.find_child("StartButton", true, false)
@onready var shop_button: Button = get_tree().root.find_child("ShopButton", true, false)
@onready var sound_button: Button = get_tree().root.find_child("SoundButton", true, false)
@onready var lang_button: Button = get_tree().root.find_child("LangButton", true, false)
@onready var high_score_label: Label = get_tree().root.find_child("HighScoreLabel", true, false)
@onready var total_coins_label: Label = get_tree().root.find_child("TotalCoinsLabel", true, false)

# UI Elements - In-Game HUD & 2D On-Screen Touch Controls
@onready var ingame_hud: Control = get_tree().root.find_child("InGameHUD", true, false)
@onready var score_label: Label = get_tree().root.find_child("ScoreLabel", true, false)
@onready var neck_label: Label = get_tree().root.find_child("NeckLabelHUD", true, false)
@onready var level_label: Label = get_tree().root.find_child("LevelLabel", true, false)
@onready var progress_bar: ProgressBar = get_tree().root.find_child("LevelProgressBar", true, false)
@onready var btn_pause: Button = get_tree().root.find_child("BtnPause", true, false)
@onready var btn_left: Button = get_tree().root.find_child("BtnLeft", true, false)
@onready var btn_right: Button = get_tree().root.find_child("BtnRight", true, false)
@onready var btn_stretch: Button = get_tree().root.find_child("BtnStretch", true, false)

# UI Elements - Pause Panel
@onready var pause_panel: Control = get_tree().root.find_child("PausePanel", true, false)
@onready var pause_title: Label = get_tree().root.find_child("PauseTitle", true, false)
@onready var resume_button: Button = get_tree().root.find_child("ResumeButton", true, false)
@onready var pause_restart_btn: Button = get_tree().root.find_child("PauseRestartBtn", true, false)
@onready var pause_sound_btn: Button = get_tree().root.find_child("PauseSoundBtn", true, false)
@onready var home_button: Button = get_tree().root.find_child("HomeButton", true, false)

# UI Elements - Win / Fail Panels
@onready var win_panel: Control = get_tree().root.find_child("WinPanel", true, false)
@onready var win_title: Label = get_tree().root.find_child("WinTitle", true, false)
@onready var win_score_text: Label = get_tree().root.find_child("WinSub", true, false)
@onready var next_button: Button = get_tree().root.find_child("NextButton", true, false)
@onready var win_shop_btn: Button = get_tree().root.find_child("WinShopBtn", true, false)
@onready var win_home_btn: Button = get_tree().root.find_child("WinHomeBtn", true, false)

@onready var fail_panel: Control = get_tree().root.find_child("FailPanel", true, false)
@onready var fail_title: Label = get_tree().root.find_child("FailTitle", true, false)
@onready var fail_reason_label: Label = get_tree().root.find_child("FailRageText", true, false)
@onready var retry_button: Button = get_tree().root.find_child("RetryButton", true, false)
@onready var revive_button: Button = get_tree().root.find_child("ReviveButton", true, false)
@onready var fail_home_btn: Button = get_tree().root.find_child("FailHomeBtn", true, false)

# UI Elements - Shop Panel
@onready var shop_panel: Control = get_tree().root.find_child("ShopPanel", true, false)
@onready var shop_title_label: Label = get_tree().root.find_child("ShopTitle", true, false)
@onready var shop_balance_label: Label = get_tree().root.find_child("ShopBalanceLabel", true, false)
@onready var shop_close_btn: Button = get_tree().root.find_child("ShopCloseBtn", true, false)

# === COMBO & FEVER UI (Created dynamically) ===
var combo_label: Label = null
var fever_bar: ProgressBar = null
var fever_flash_timer: float = 0.0
var screen_shake_intensity: float = 0.0
var _camera: Camera3D = null

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	load_csv_translations()
	setup_ui_state()
	setup_combo_fever_ui()
	connect_signals()
	update_all_localized_text()
	PlatformBridge.notify_game_ready()

func setup_ui_state() -> void:
	if win_panel: win_panel.visible = false
	if fail_panel: fail_panel.visible = false
	if shop_panel: shop_panel.visible = false
	if pause_panel: pause_panel.visible = false
	
	if start_panel:
		start_panel.visible = true
	if ingame_hud:
		ingame_hud.visible = false
		
	if player:
		player.is_active = false

func setup_combo_fever_ui() -> void:
	# Tạo Combo Badge (hiển thị trên HUD khi combo > 0)
	combo_label = Label.new()
	combo_label.name = "ComboLabel"
	combo_label.text = ""
	combo_label.add_theme_font_size_override("font_size", 28)
	combo_label.add_theme_color_override("font_color", Color(1.0, 0.9, 0.2, 1.0))
	combo_label.add_theme_color_override("font_shadow_color", Color(0.2, 0.1, 0.3, 0.7))
	combo_label.add_theme_constant_override("shadow_offset_y", 2)
	combo_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	combo_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	combo_label.anchor_left = 0.5
	combo_label.anchor_right = 0.5
	combo_label.offset_left = -180
	combo_label.offset_right = 180
	combo_label.offset_top = 80
	combo_label.offset_bottom = 120
	combo_label.visible = false
	
	# Tạo Fever Progress Bar
	fever_bar = ProgressBar.new()
	fever_bar.name = "FeverBar"
	fever_bar.min_value = 0
	fever_bar.max_value = 100
	fever_bar.value = 0
	fever_bar.custom_minimum_size = Vector2(220, 16)
	fever_bar.anchor_left = 0.5
	fever_bar.anchor_right = 0.5
	fever_bar.offset_left = -110
	fever_bar.offset_right = 110
	fever_bar.offset_top = 122
	fever_bar.offset_bottom = 138
	fever_bar.show_percentage = false
	fever_bar.visible = false
	
	var fb_style = StyleBoxFlat.new()
	fb_style.bg_color = Color(1.0, 0.35, 0.75, 0.95)
	fb_style.border_width_left = 2
	fb_style.border_width_top = 2
	fb_style.border_width_right = 2
	fb_style.border_width_bottom = 2
	fb_style.border_color = Color(1.0, 0.85, 0.95, 1.0)
	fb_style.set_corner_radius_all(8)
	fever_bar.add_theme_stylebox_override("fill", fb_style)
	
	var fb_bg = StyleBoxFlat.new()
	fb_bg.bg_color = Color(0.9, 0.95, 1.0, 0.8)
	fb_bg.set_corner_radius_all(8)
	fever_bar.add_theme_stylebox_override("background", fb_bg)
	
	# Thêm vào HUD
	if hud:
		hud.add_child(combo_label)
		hud.add_child(fever_bar)

func connect_signals() -> void:
	if tap_to_start_btn:
		tap_to_start_btn.pressed.connect(start_gameplay)
	if start_button:
		start_button.pressed.connect(start_gameplay)
	if shop_button:
		shop_button.pressed.connect(open_shop)
	if shop_close_btn:
		shop_close_btn.pressed.connect(close_shop)
	if sound_button:
		sound_button.pressed.connect(_on_sound_toggle)
	if lang_button:
		lang_button.pressed.connect(_on_lang_toggle)
	if next_button:
		next_button.pressed.connect(next_level)
	if win_shop_btn:
		win_shop_btn.pressed.connect(func():
			if win_panel: win_panel.visible = false
			open_shop()
		)
	if win_home_btn:
		win_home_btn.pressed.connect(func():
			get_tree().reload_current_scene()
		)
	if retry_button:
		retry_button.pressed.connect(restart_game)
	if revive_button:
		revive_button.pressed.connect(revive_player)
	if fail_home_btn:
		fail_home_btn.pressed.connect(func():
			get_tree().reload_current_scene()
		)
		
	# Nút Tạm Dừng & Menu Pause
	if btn_pause:
		btn_pause.pressed.connect(open_pause_menu)
	if resume_button:
		resume_button.pressed.connect(close_pause_menu)
	if pause_restart_btn:
		pause_restart_btn.pressed.connect(func():
			get_tree().paused = false
			restart_game()
		)
	if pause_sound_btn:
		pause_sound_btn.pressed.connect(func():
			_on_sound_toggle()
			if pause_sound_btn:
				pause_sound_btn.text = tr("SOUND_ON") if SaveSystem.sound_enabled else tr("SOUND_OFF")
		)
	if home_button:
		home_button.pressed.connect(func():
			get_tree().paused = false
			get_tree().reload_current_scene()
		)
		
	# Nút Điều khiển 2D Cảm ứng trên màn hình (Touch Controls)
	if btn_left:
		btn_left.button_down.connect(func(): if player: player.touch_steer_dir = -1.0)
		btn_left.button_up.connect(func(): if player: player.touch_steer_dir = 0.0)
	if btn_right:
		btn_right.button_down.connect(func(): if player: player.touch_steer_dir = 1.0)
		btn_right.button_up.connect(func(): if player: player.touch_steer_dir = 0.0)
	if btn_stretch:
		btn_stretch.button_down.connect(func():
			if player:
				player.touch_stretch_held = true
				SoundManager.play_stretch(1.1)
		)
		btn_stretch.button_up.connect(func():
			if player:
				player.touch_stretch_held = false
				SoundManager.play_duck()
		)
		
	if player:
		if player.has_signal("player_died"):
			player.connect("player_died", on_player_died)
		if player.has_signal("neck_height_changed"):
			player.connect("neck_height_changed", _on_neck_height_changed)
		if player.has_signal("reached_finish"):
			player.connect("reached_finish", on_game_win)
		if player.has_signal("combo_changed"):
			player.connect("combo_changed", _on_combo_changed)

func _process(delta: float) -> void:
	if is_game_running and player and progress_bar:
		var z_dist = abs(player.global_position.z)
		var prog = clamp((z_dist / 260.0) * 100.0, 0.0, 100.0)
		progress_bar.value = prog
		
	if start_panel and start_panel.visible and tap_hint_label:
		var pulse = 1.0 + sin(Time.get_ticks_msec() * 0.006) * 0.06
		tap_hint_label.scale = Vector2(pulse, pulse)
		tap_hint_label.pivot_offset = tap_hint_label.size / 2.0
	
	# === FEVER FLASH EFFECT ===
	if fever_bar and fever_bar.visible:
		fever_flash_timer += delta
		var flash = 0.7 + sin(fever_flash_timer * 8.0) * 0.3
		fever_bar.modulate = Color(flash, flash, flash, 1.0)
		
		# Update fever bar progress
		if player and player.get("fever_active") and player.get("fever_timer") != null:
			var t = player.fever_timer
			var dur = player.FEVER_DURATION
			fever_bar.value = (t / dur) * 100.0
	
	# === SCREEN SHAKE ===
	if screen_shake_intensity > 0.01:
		screen_shake_intensity = lerp(screen_shake_intensity, 0.0, 6.0 * delta)
		if not _camera:
			_camera = get_viewport().get_camera_3d()
		if _camera:
			_camera.h_offset = randf_range(-screen_shake_intensity, screen_shake_intensity)
			_camera.v_offset = randf_range(-screen_shake_intensity, screen_shake_intensity)
	elif _camera:
		_camera.h_offset = 0.0
		_camera.v_offset = 0.0
	
	# === COMBO LABEL PULSE ===
	if combo_label and combo_label.visible:
		var cpulse = 1.0 + sin(Time.get_ticks_msec() * 0.01) * 0.08
		combo_label.scale = Vector2(cpulse, cpulse)
		combo_label.pivot_offset = combo_label.size / 2.0

func _on_combo_changed(combo: int, is_fever: bool) -> void:
	if combo_label:
		if combo <= 0:
			combo_label.visible = false
			combo_label.text = ""
		elif is_fever:
			combo_label.visible = true
			combo_label.text = "🔥 FEVER x3! 🔥 COMBO %d" % combo
			combo_label.add_theme_color_override("font_color", Color(1.0, 0.3, 0.8, 1.0))
			combo_label.add_theme_font_size_override("font_size", 38)
			# Screen shake on fever start
			screen_shake_intensity = 0.15
		else:
			combo_label.visible = true
			combo_label.text = "🔗 COMBO %d" % combo
			var t = clamp(float(combo) / 5.0, 0.0, 1.0)
			var col = Color(1.0, 1.0 - t * 0.7, 0.1 + t * 0.7, 1.0)  # Yellow → Orange → Pink
			combo_label.add_theme_color_override("font_color", col)
			combo_label.add_theme_font_size_override("font_size", 28 + combo * 2)
			# Small shake per combo hit
			screen_shake_intensity = 0.03 + combo * 0.01
	
	if fever_bar:
		if is_fever:
			fever_bar.visible = true
			fever_flash_timer = 0.0
		elif combo <= 0:
			fever_bar.visible = false

func update_all_localized_text() -> void:
	if game_title_label: game_title_label.text = tr("GAME_TITLE")
	if game_sub_label: game_sub_label.text = tr("GAME_SUBTITLE")
	if tap_hint_label: tap_hint_label.text = tr("TAP_TO_START")
	if start_button: start_button.text = tr("PLAY_BTN")
	if shop_button: shop_button.text = tr("SHOP_BTN")
	if high_score_label: high_score_label.text = tr("HIGH_SCORE") % SaveSystem.high_score
	if total_coins_label: total_coins_label.text = tr("TOTAL_COINS") % SaveSystem.total_coins
	if sound_button:
		sound_button.text = tr("SOUND_ON") if SaveSystem.sound_enabled else tr("SOUND_OFF")
	if lang_button:
		lang_button.text = tr("LANG_BTN")
	if level_label:
		level_label.text = tr("LEVEL_LABEL") % SaveSystem.current_level
	if score_label:
		score_label.text = tr("SCORE_LABEL") % score
	if shop_title_label:
		shop_title_label.text = tr("SHOP_TITLE")
	if shop_balance_label:
		shop_balance_label.text = tr("SHOP_BALANCE") % SaveSystem.total_coins
	if shop_close_btn:
		shop_close_btn.text = tr("SHOP_CLOSE")
	if win_title:
		win_title.text = tr("WIN_TITLE")
	if next_button:
		next_button.text = tr("NEXT_BTN")
	if win_shop_btn:
		win_shop_btn.text = tr("WIN_SHOP_BTN")
	if win_home_btn:
		win_home_btn.text = tr("HOME_BTN")
	if fail_title:
		fail_title.text = tr("FAIL_TITLE")
	if retry_button:
		retry_button.text = tr("RETRY_BTN")
	if revive_button:
		revive_button.text = tr("REVIVE_BTN")
	if fail_home_btn:
		fail_home_btn.text = tr("HOME_BTN")
	if pause_title:
		pause_title.text = tr("PAUSE_TITLE")
	if resume_button:
		resume_button.text = tr("RESUME_BTN")
	if pause_restart_btn:
		pause_restart_btn.text = tr("RETRY_BTN")
	if pause_sound_btn:
		pause_sound_btn.text = tr("SOUND_ON") if SaveSystem.sound_enabled else tr("SOUND_OFF")
	if home_button:
		home_button.text = tr("HOME_BTN")
	if btn_stretch:
		btn_stretch.text = tr("BTN_STRETCH")

func _on_lang_toggle() -> void:
	SoundManager.play_click()
	if SaveSystem.current_locale == "vi":
		SaveSystem.set_language("en")
	elif SaveSystem.current_locale == "en":
		SaveSystem.set_language("es")
	elif SaveSystem.current_locale == "es":
		SaveSystem.set_language("pt")
	else:
		SaveSystem.set_language("vi")
	update_all_localized_text()
	if shop_panel and shop_panel.visible:
		update_shop_items()

func _on_sound_toggle() -> void:
	var state = SoundManager.toggle_sound()
	SoundManager.play_click()
	if sound_button:
		sound_button.text = tr("SOUND_ON") if state else tr("SOUND_OFF")

func open_pause_menu() -> void:
	SoundManager.play_click()
	get_tree().paused = true
	if pause_panel:
		pause_panel.visible = true

func close_pause_menu() -> void:
	SoundManager.play_click()
	get_tree().paused = false
	if pause_panel:
		pause_panel.visible = false

func start_gameplay() -> void:
	SoundManager.play_click()
	is_game_running = true
	if start_panel: start_panel.visible = false
	if ingame_hud: ingame_hud.visible = true
	if player:
		player.is_active = true

func open_shop() -> void:
	SoundManager.play_click()
	if shop_panel:
		shop_panel.visible = true
		update_shop_items()

func close_shop() -> void:
	SoundManager.play_click()
	if shop_panel:
		shop_panel.visible = false
	update_all_localized_text()
	if player:
		SkinManager.apply_skin_to_node(player, SaveSystem.equipped_skin_id)

func update_shop_items() -> void:
	if shop_balance_label:
		shop_balance_label.text = tr("SHOP_BALANCE") % SaveSystem.total_coins
		
	var container = shop_panel.find_child("SkinGrid", true, false)
	if not container: return
	
	for child in container.get_children():
		child.queue_free()
		
	var skin_icons = {
		"classic_giraffe": "🦒",
		"cyber_brachio": "🤖🦕",
		"pink_flamingo": "🦩",
		"king_gold": "👑✨"
	}
		
	for skin_id in SkinManager.skins_catalog:
		var s = SkinManager.skins_catalog[skin_id]
		var card = Button.new()
		card.custom_minimum_size = Vector2(180, 110)
		card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		var is_unlocked = SaveSystem.unlocked_skins.has(skin_id)
		var is_equipped = (SaveSystem.equipped_skin_id == skin_id)
		
		var s_name = tr(s["name_key"])
		var btn_txt = s_name + "\n\n"
		if is_equipped:
			btn_txt += tr("SKIN_EQUIPPED")
		elif is_unlocked:
			btn_txt += tr("SKIN_EQUIP")
		else:
			btn_txt += tr("SKIN_BUY") % s["price"]
			
		card.text = btn_txt
		
		# Style thẻ skin - Cute Marshmallow Card Theme
		var sb = StyleBoxFlat.new()
		sb.set_corner_radius_all(20)
		sb.border_width_left = 3
		sb.border_width_top = 3
		sb.border_width_right = 3
		sb.border_width_bottom = 5
		
		if is_equipped:
			sb.bg_color = Color(0.9, 1.0, 0.92, 0.98)
			sb.border_color = Color(0.25, 0.85, 0.45, 1.0)
			card.add_theme_color_override("font_color", Color(0.1, 0.5, 0.2, 1.0))
		elif is_unlocked:
			sb.bg_color = Color(0.92, 0.97, 1.0, 0.98)
			sb.border_color = Color(0.35, 0.75, 1.0, 1.0)
			card.add_theme_color_override("font_color", Color(0.1, 0.4, 0.75, 1.0))
		else:
			sb.bg_color = Color(1.0, 0.97, 0.92, 0.98)
			sb.border_color = Color(1.0, 0.75, 0.2, 1.0)
			card.add_theme_color_override("font_color", Color(0.65, 0.4, 0.05, 1.0))
			
		card.add_theme_stylebox_override("normal", sb)
		card.add_theme_stylebox_override("hover", sb)
		card.add_theme_stylebox_override("pressed", sb)
		card.add_theme_font_size_override("font_size", 16)
		
		card.pressed.connect(func():
			if is_unlocked:
				SaveSystem.equip_skin(skin_id)
				SoundManager.play_click()
				update_shop_items()
			else:
				if SaveSystem.total_coins >= s["price"]:
					SaveSystem.total_coins -= s["price"]
					SaveSystem.unlock_skin(skin_id)
					SaveSystem.equip_skin(skin_id)
					SoundManager.play_gate_bonus()
					update_shop_items()
					update_all_localized_text()
				else:
					SoundManager.play_bonk()
		)
		container.add_child(card)

func add_score(amount: int) -> void:
	score += amount
	level_coins_earned += int(float(amount) / 5.0)
	if score_label:
		score_label.text = tr("SCORE_LABEL") % score

func _on_neck_height_changed(current_h: float, max_h: float) -> void:
	if neck_label:
		neck_label.text = tr("NECK_LABEL") % [current_h, max_h]

func on_player_died(reason_key: String) -> void:
	is_game_running = false
	if ingame_hud: ingame_hud.visible = false
	if combo_label: combo_label.visible = false
	if fever_bar: fever_bar.visible = false
	
	# Screen shake on death
	screen_shake_intensity = 0.25
	
	if fail_panel:
		fail_panel.visible = true
		if fail_reason_label:
			# Map reason keys to translated text
			var fail_messages = {
				"BONK_FAIL": tr("BONK_FAIL"),
				"SPIKE_FAIL": tr("SPIKE_FAIL"),
				"ROCK_FAIL": tr("ROCK_FAIL"),
				"AXE_FAIL": tr("AXE_FAIL"),
				"TUNNEL_CEILING": "💥 ĐẬP TRẦN ĐƯỜNG HẦM! Giữ cổ thấp hơn!",
				"TUNNEL_FLOOR": "⚡ ĐẠP CHÔNG SÀN! Vươn cổ lên cao hơn!",
			}
			fail_reason_label.text = fail_messages.get(reason_key, tr("BONK_FAIL"))

func on_game_win(final_score_mult: float) -> void:
	is_game_running = false
	if ingame_hud: ingame_hud.visible = false
	if combo_label: combo_label.visible = false
	if fever_bar: fever_bar.visible = false
	
	var total_win_score = int(score * (final_score_mult / 10.0 + 1.0))
	var is_new_record = SaveSystem.update_high_score(total_win_score)
	SaveSystem.add_coins(level_coins_earned + 100)
	
	if win_panel:
		win_panel.visible = true
		if win_score_text:
			var txt = tr("WIN_SUB") % [total_win_score, level_coins_earned + 100, final_score_mult]
			if is_new_record:
				txt += "\n" + tr("NEW_RECORD")
			win_score_text.text = txt

func next_level() -> void:
	SoundManager.play_click()
	SaveSystem.current_level += 1
	SaveSystem.save_game()
	get_tree().reload_current_scene()

func restart_game() -> void:
	SoundManager.play_click()
	get_tree().reload_current_scene()

func revive_player() -> void:
	SoundManager.play_click()
	PlatformBridge.request_rewarded_ad(func(success: bool):
		if success and player:
			if fail_panel: fail_panel.visible = false
			if ingame_hud: ingame_hud.visible = true
			player.is_active = true
			player.position.y = 0.5
			player.position.z -= 4.0
			is_game_running = true
	)

func load_csv_translations() -> void:
	var file = FileAccess.open("res://translations/translations.csv", FileAccess.READ)
	if not file: return
	var header_line = file.get_line()
	var headers = header_line.split(",")
	if headers.size() < 2: return
	var trans_dict: Dictionary = {}
	for i in range(1, headers.size()):
		var loc = headers[i].strip_edges().replace("\"", "")
		var tr_obj = Translation.new()
		tr_obj.locale = loc
		trans_dict[i] = tr_obj
	while not file.eof_reached():
		var line = file.get_csv_line()
		if line.size() < headers.size() or line[0] == "": continue
		var key = line[0].strip_edges()
		for i in range(1, headers.size()):
			if i < line.size(): trans_dict[i].add_message(key, line[i].strip_edges())
	for i in trans_dict:
		TranslationServer.add_translation(trans_dict[i])
	TranslationServer.set_locale(SaveSystem.current_locale)
