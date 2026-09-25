extends CanvasLayer


const EGG_TEXTURES: Dictionary = {
	"normal": "res://assets/sprites/projectiles/egg_normal.svg",
	"bomb": "res://assets/sprites/projectiles/egg_bomb.svg",
	"drill": "res://assets/sprites/projectiles/egg_drill.svg",
	"frost": "res://assets/sprites/projectiles/egg_frost.svg",
	"acid": "res://assets/sprites/projectiles/egg_acid.svg",
	"blackhole": "res://assets/sprites/projectiles/egg_blackhole.svg",
	"cluster": "res://assets/sprites/projectiles/egg_cluster.svg"
}

@onready var score_label: Label = $TopBar/Margin/HBox/ScoreBox/Margin/ScoreLabel
@onready var level_label: Label = $TopBar/Margin/HBox/LevelBox/Margin/LevelLabel
@onready var coin_label: Label = $TopBar/Margin/HBox/CoinBox/Margin/HBox/CoinLabel
@onready var btn_vip_trial: Button = $TopBar/Margin/HBox/BtnVipTrial
@onready var egg_container: HBoxContainer = $EggShelf/Margin/EggIcons
@onready var btn_pause: Button = $TopBar/Margin/HBox/BtnPause
@onready var btn_restart: Button = $TopBar/Margin/HBox/BtnRestart

# Modals
@onready var modal_dimmer: ColorRect = get_node_or_null("ModalDimmer")
@onready var victory_modal: PanelContainer = $VictoryModal
@onready var victory_title: Label = $VictoryModal/VBox/Title
@onready var victory_score: Label = $VictoryModal/VBox/ScoreLabel
@onready var star1: TextureRect = $VictoryModal/VBox/StarsContainer/Star1
@onready var star2: TextureRect = $VictoryModal/VBox/StarsContainer/Star2
@onready var star3: TextureRect = $VictoryModal/VBox/StarsContainer/Star3
@onready var coin_reward_label: Label = $VictoryModal/VBox/CoinRewardBox/CoinRewardLabel
@onready var btn_claim_triple: Button = $VictoryModal/VBox/BtnClaimTriple
@onready var next_level_btn: Button = $VictoryModal/VBox/BtnNext
@onready var victory_levels_btn: Button = $VictoryModal/VBox/BtnLevels

@onready var last_stand_modal: PanelContainer = $LastStandModal
@onready var last_stand_title: Label = $LastStandModal/VBox/Title
@onready var last_stand_sub: Label = $LastStandModal/VBox/Subtitle
@onready var last_stand_timer_bar: ProgressBar = $LastStandModal/VBox/TimerBar
@onready var btn_last_stand_ad: Button = $LastStandModal/VBox/BtnLastStandAd
@onready var btn_last_stand_skip: Button = $LastStandModal/VBox/BtnLastStandSkip

@onready var fail_modal: PanelContainer = $FailModal
@onready var fail_title: Label = $FailModal/VBox/Title
@onready var retry_btn: Button = $FailModal/VBox/BtnRetry
@onready var fail_levels_btn: Button = $FailModal/VBox/BtnLevels

@onready var pause_modal: PanelContainer = $PauseModal
@onready var pause_title: Label = $PauseModal/VBox/Title
@onready var resume_btn: Button = $PauseModal/VBox/BtnResume
@onready var pause_retry_btn: Button = $PauseModal/VBox/BtnRestart
@onready var pause_levels_btn: Button = $PauseModal/VBox/BtnLevels

var current_base_coins: int = 50
var last_stand_tween: Tween = null
var tutorial_prompt_node: Control = null
var tutorial_dismissed: bool = false

func _ready() -> void:
	if modal_dimmer: modal_dimmer.visible = false
	if victory_modal: victory_modal.visible = false
	if fail_modal: fail_modal.visible = false
	if pause_modal: pause_modal.visible = false
	if last_stand_modal: last_stand_modal.visible = false

	# Chuẩn hóa Vùng An Toàn (Safe Area) cho điện thoại có tai thỏ và thanh vuốt đáy
	_apply_safe_area()
	get_viewport().size_changed.connect(_apply_safe_area)

	GameManager.score_updated.connect(_on_score_updated)
	GameManager.egg_dropped.connect(_on_egg_dropped)
	GameManager.level_started.connect(func(_lvl, _eggs): _refresh_egg_icons())
	GameManager.level_completed.connect(_on_level_completed)
	GameManager.level_failed.connect(_on_level_failed)
	GameManager.last_stand_offered.connect(_on_last_stand_offered)

	if GameManager.available_eggs.size() > 0:
		_refresh_egg_icons()

	if has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		sm.coins_updated.connect(_update_coin_display)
		_update_coin_display(sm.get_coins())

	if btn_restart: btn_restart.pressed.connect(func(): GameManager.restart_current_level())
	if btn_pause: btn_pause.pressed.connect(_toggle_pause)

	# Nút VIP Trial trên TopBar
	if btn_vip_trial:
		btn_vip_trial.pressed.connect(_on_vip_trial_pressed)
		# Grace period: chỉ hiển thị từ Màn 6 trở đi
		btn_vip_trial.visible = (GameManager.current_level > 5 and not GameManager.vip_trial_used_in_level)

	# Nút Victory Modal
	if btn_claim_triple: btn_claim_triple.pressed.connect(_on_claim_triple_pressed)
	if next_level_btn: next_level_btn.pressed.connect(_on_victory_next_pressed)
	if victory_levels_btn: victory_levels_btn.pressed.connect(_on_victory_levels_pressed)
	
	# Nút Last Stand Modal
	if btn_last_stand_ad: btn_last_stand_ad.pressed.connect(_on_last_stand_ad_pressed)
	if btn_last_stand_skip: btn_last_stand_skip.pressed.connect(_on_last_stand_skip_pressed)

	# Nút Fail Modal
	if retry_btn: retry_btn.pressed.connect(func(): GameManager.restart_current_level())
	if fail_levels_btn: fail_levels_btn.pressed.connect(func(): GameManager.go_to_level_select())

	# Nút Pause Modal
	if resume_btn: resume_btn.pressed.connect(_toggle_pause)
	if pause_retry_btn: pause_retry_btn.pressed.connect(func():
		get_tree().paused = false
		GameManager.restart_current_level()
	)
	if pause_levels_btn: pause_levels_btn.pressed.connect(func():
		get_tree().paused = false
		GameManager.go_to_level_select()
	)

	_update_ui()
	_setup_booster_tray()
	_setup_level_1_tutorial()

func _process(_delta: float) -> void:
	if tutorial_prompt_node and not tutorial_dismissed:
		if GameManager.current_egg_index > 0 or Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
			_dismiss_tutorial()

func _setup_level_1_tutorial() -> void:
	if GameManager.current_level != 1 or GameManager.current_egg_index > 0: return

	tutorial_prompt_node = Control.new()
	tutorial_prompt_node.name = "TutorialPrompt"
	tutorial_prompt_node.mouse_filter = Control.MOUSE_FILTER_IGNORE
	tutorial_prompt_node.z_index = 40
	add_child(tutorial_prompt_node)

	var panel = PanelContainer.new()
	panel.name = "Bubble"
	panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var sb = StyleBoxFlat.new()
	sb.bg_color = Color(0.1, 0.08, 0.18, 0.90)
	sb.border_width_left = 2
	sb.border_width_right = 2
	sb.border_width_top = 2
	sb.border_width_bottom = 2
	sb.border_color = Color(1.0, 0.85, 0.25, 0.95)
	sb.corner_radius_top_left = 12
	sb.corner_radius_top_right = 12
	sb.corner_radius_bottom_right = 12
	sb.corner_radius_bottom_left = 12
	sb.content_margin_left = 14
	sb.content_margin_right = 14
	sb.content_margin_top = 8
	sb.content_margin_bottom = 8
	panel.add_theme_stylebox_override("panel", sb)

	var lm = get_node_or_null("/root/LocalizationManager")
	var prompt_txt = lm.t("KEY_TUTORIAL_AIM") if lm else "👇 KÉO XUỐNG ĐỂ NGẮM & THẢ RA ĐỂ BẮN! 👇"

	var lbl = Label.new()
	lbl.name = "TutorialLabel"
	lbl.text = prompt_txt
	lbl.add_theme_font_size_override("font_size", 12)
	lbl.add_theme_color_override("font_color", Color(1.0, 0.95, 0.4))
	lbl.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.85))
	lbl.add_theme_constant_override("outline_size", 4)
	panel.add_child(lbl)

	tutorial_prompt_node.add_child(panel)

	# Bố trí căn giữa bên dưới vị trí chim gà
	panel.pivot_offset = Vector2(160, 20)
	panel.position = Vector2(270 - 160, 155.0)

	# Hoạt ảnh nhấp nháy bồng bềnh
	var tw = panel.create_tween().set_loops()
	tw.tween_property(panel, "position:y", 165.0, 0.55).set_trans(Tween.TRANS_SINE)
	tw.tween_property(panel, "position:y", 150.0, 0.55).set_trans(Tween.TRANS_SINE)

func _dismiss_tutorial() -> void:
	if tutorial_dismissed: return
	tutorial_dismissed = true
	if tutorial_prompt_node and is_instance_valid(tutorial_prompt_node):
		var tw = tutorial_prompt_node.create_tween()
		tw.tween_property(tutorial_prompt_node, "modulate:a", 0.0, 0.25)
		tw.tween_callback(tutorial_prompt_node.queue_free)

var booster_tray: HBoxContainer = null

func _setup_booster_tray() -> void:
	if booster_tray: return
	booster_tray = HBoxContainer.new()
	booster_tray.name = "BoosterTray"
	booster_tray.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
	booster_tray.anchor_left = 1.0
	booster_tray.anchor_top = 1.0
	booster_tray.anchor_right = 1.0
	booster_tray.anchor_bottom = 1.0
	booster_tray.offset_left = -175.0
	booster_tray.offset_top = -54.0
	booster_tray.offset_right = -12.0
	booster_tray.offset_bottom = -10.0
	booster_tray.add_theme_constant_override("separation", 6)
	booster_tray.alignment = BoxContainer.ALIGNMENT_END
	add_child(booster_tray)
	_render_booster_buttons()
	if has_node("/root/SaveManager"):
		get_node("/root/SaveManager").consumables_updated.connect(_render_booster_buttons)

func _render_booster_buttons() -> void:
	if not booster_tray: return
	for child in booster_tray.get_children():
		child.queue_free()

	if not has_node("/root/SaveManager"): return
	var sm = get_node("/root/SaveManager")

	var booster_types = [
		{"type": "bomb", "icon": "res://assets/ui/icons/icon_egg_bomb.svg"},
		{"type": "drill", "icon": "res://assets/ui/icons/icon_egg_drill.svg"},
		{"type": "acid", "icon": "res://assets/ui/icons/icon_egg_acid.svg"}
	]

	for b_info in booster_types:
		var b_type = b_info["type"]
		var count = sm.get_consumable(b_type)
		if count <= 0: continue

		var btn = Button.new()
		btn.custom_minimum_size = Vector2(46, 42)
		btn.text = "x%d" % count
		btn.icon_alignment = HORIZONTAL_ALIGNMENT_LEFT
		btn.vertical_icon_alignment = VERTICAL_ALIGNMENT_CENTER
		var ico_tex = ParticleHelper._safe_load(b_info["icon"])
		if ico_tex:
			btn.icon = ico_tex
			btn.expand_icon = true

		var st_norm = StyleBoxFlat.new()
		st_norm.bg_color = Color(0.18, 0.12, 0.28, 0.9)
		st_norm.border_width_bottom = 4
		st_norm.border_width_left = 2
		st_norm.border_width_right = 2
		st_norm.border_width_top = 2
		st_norm.border_color = Color(1.0, 0.8, 0.2)
		st_norm.corner_radius_top_left = 10
		st_norm.corner_radius_top_right = 10
		st_norm.corner_radius_bottom_right = 10
		st_norm.corner_radius_bottom_left = 10
		btn.add_theme_stylebox_override("normal", st_norm)
		btn.add_theme_font_size_override("font_size", 11)
		btn.add_theme_color_override("font_color", Color(1, 0.9, 0.4))

		btn.pressed.connect(func():
			if GameManager.add_active_booster_egg(b_type):
				if has_node("/root/SoundManager"):
					get_node("/root/SoundManager").play_button_click()
				_refresh_egg_icons()
				_render_booster_buttons()
		)
		booster_tray.add_child(btn)

func _apply_safe_area() -> void:
	if not is_inside_tree(): return
	var safe_rect = DisplayServer.get_display_safe_area()
	var win_size = DisplayServer.window_get_size()
	if win_size.y <= 0: return

	var vp_size = get_viewport().get_visible_rect().size
	var scale_y = vp_size.y / float(win_size.y)
	var top_inset = float(safe_rect.position.y) * scale_y
	var bottom_inset = float(win_size.y - (safe_rect.position.y + safe_rect.size.y)) * scale_y

	# Đệm thanh TopBar né camera nốt ruồi / tai thỏ
	var top_bar = get_node_or_null("TopBar") as Control
	if top_bar:
		var target_top = max(8.0, top_inset + 4.0)
		var bar_h = 52.0
		top_bar.offset_top = target_top
		top_bar.offset_bottom = target_top + bar_h

	# Đệm Kệ Trứng và Khay Đạo Cụ né thanh cử chỉ vuốt Home của Android
	var egg_shelf = get_node_or_null("EggShelf") as Control
	if egg_shelf:
		var target_bottom = min(-10.0, -(bottom_inset + 12.0))
		var shelf_h = 42.0
		egg_shelf.offset_bottom = target_bottom
		egg_shelf.offset_top = target_bottom - shelf_h

	if booster_tray:
		var target_bottom = min(-10.0, -(bottom_inset + 12.0))
		var tray_h = 42.0
		booster_tray.offset_bottom = target_bottom
		booster_tray.offset_top = target_bottom - tray_h

func _update_coin_display(amount: int) -> void:
	if coin_label:
		coin_label.text = "%d" % amount

func toggle_pause() -> void:
	_toggle_pause()

var _last_back_time: float = 0.0

func handle_back_button() -> void:
	var now = Time.get_ticks_msec() * 0.001
	if now - _last_back_time < 0.35:
		return
	_last_back_time = now

	if pause_modal and pause_modal.visible:
		_toggle_pause()
	elif victory_modal and victory_modal.visible:
		_on_victory_next_pressed()
	elif fail_modal and fail_modal.visible:
		GameManager.go_to_level_select()
	elif last_stand_modal and last_stand_modal.visible:
		_on_last_stand_skip_pressed()
	else:
		_toggle_pause()

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_GO_BACK_REQUEST:
		handle_back_button()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel"):
		handle_back_button()

func _toggle_pause() -> void:
	var is_p = not get_tree().paused
	get_tree().paused = is_p
	if modal_dimmer:
		modal_dimmer.visible = is_p
	if pause_modal:
		pause_modal.visible = is_p
		if is_p and has_node("/root/LocalizationManager"):
			var lm = get_node("/root/LocalizationManager")
			if pause_title: pause_title.text = lm.t("KEY_PAUSE")
			if resume_btn: resume_btn.text = " " + lm.t("KEY_RESUME")
			if pause_retry_btn: pause_retry_btn.text = " " + lm.t("KEY_RETRY")
			if pause_levels_btn: pause_levels_btn.text = " " + lm.t("KEY_SELECT_LEVEL")

func _update_ui() -> void:
	var lm = get_node_or_null("/root/LocalizationManager")
	if level_label:
		if lm: level_label.text = lm.t("KEY_LEVEL") % GameManager.current_level
		else: level_label.text = "MÀN %d" % GameManager.current_level
	if score_label:
		score_label.text = "%d" % GameManager.current_score
	_refresh_egg_icons()

func _refresh_egg_icons() -> void:
	if not egg_container: return
	for child in egg_container.get_children():
		child.queue_free()

	var shelf = get_node_or_null("EggShelf")
	if shelf:
		var egg_count = GameManager.available_eggs.size()
		var target_w = clamp(egg_count * 34.0 + 32.0, 130.0, 240.0)
		shelf.offset_left = -target_w * 0.5
		shelf.offset_right = target_w * 0.5

	for i in range(GameManager.available_eggs.size()):
		var egg_type = GameManager.available_eggs[i]
		var tex_path = EGG_TEXTURES.get(egg_type, EGG_TEXTURES["normal"])
		var tex = ParticleHelper._safe_load(tex_path)

		var egg_rect = TextureRect.new()
		egg_rect.custom_minimum_size = Vector2(24, 30)
		egg_rect.expand_mode = TextureRect.EXPAND_FIT_WIDTH_PROPORTIONAL
		egg_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		if tex:
			egg_rect.texture = tex

		if i < GameManager.current_egg_index:
			# Đã bắn: Mờ xám
			egg_rect.modulate = Color(0.4, 0.4, 0.4, 0.35)
			egg_rect.scale = Vector2(0.88, 0.88)
			egg_rect.pivot_offset = Vector2(12, 15)
		elif i == GameManager.current_egg_index:
			# Trứng đang trên giỏ của Gà: Sáng nổi bật & nảy nhẹ
			egg_rect.modulate = Color(1.2, 1.2, 1.1, 1.0)
			egg_rect.scale = Vector2(1.10, 1.10)
			egg_rect.pivot_offset = Vector2(12, 15)
		else:
			# Trứng trong hàng chờ
			egg_rect.modulate = Color(0.85, 0.85, 0.85, 0.85)
			egg_rect.scale = Vector2(0.95, 0.95)
			egg_rect.pivot_offset = Vector2(12, 15)

		egg_container.add_child(egg_rect)

func _on_score_updated(new_score: int) -> void:
	if not is_inside_tree(): return
	var lm = get_node_or_null("/root/LocalizationManager")
	if score_label:
		if lm: score_label.text = lm.t("KEY_SCORE") % new_score
		else: score_label.text = "SCORE: %d" % new_score

func _on_egg_dropped(_egg_type: String) -> void:
	_dismiss_tutorial()
	_refresh_egg_icons()

# ==========================================
# ĐIỂM CHẠM 3: DÙNG THỬ ĐẠN VIP (FREE TRIAL)
# ==========================================
func _on_vip_trial_pressed() -> void:
	if not has_node("/root/AdsManager"): return
	var am = get_node("/root/AdsManager")
	am.show_rewarded_ad(
		AdsManager.PLACEMENT_VIP_TRIAL,
		"egg",
		1,
		func():
			GameManager.vip_trial_used_in_level = true
			if btn_vip_trial: btn_vip_trial.visible = false
			_refresh_egg_icons()
	)

# ==========================================
# ĐIỂM CHẠM 1: CỨU THUA SUÝT THẮNG (LAST STAND)
# ==========================================
func _on_last_stand_offered(enemies_left: int) -> void:
	if not last_stand_modal: return
	if modal_dimmer: modal_dimmer.visible = true
	last_stand_modal.visible = true

	var lm = get_node_or_null("/root/LocalizationManager")
	if last_stand_title and lm:
		last_stand_title.text = lm.t("KEY_LAST_STAND_TITLE")
	if last_stand_sub:
		if lm:
			last_stand_sub.text = lm.t("KEY_LAST_STAND_SUB") % enemies_left
		else:
			last_stand_sub.text = "Chỉ còn %d quái vật! Đừng bỏ cuộc!" % enemies_left
	if btn_last_stand_ad and lm:
		btn_last_stand_ad.text = lm.t("KEY_LAST_STAND_AD")
	if btn_last_stand_skip and lm:
		btn_last_stand_skip.text = lm.t("KEY_SKIP")

	var tween_modal = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	last_stand_modal.scale = Vector2(0.6, 0.6)
	tween_modal.tween_property(last_stand_modal, "scale", Vector2.ONE, 0.3)

	# Đếm ngược 5 giây
	if last_stand_timer_bar:
		last_stand_timer_bar.max_value = 5.0
		last_stand_timer_bar.value = 5.0
		if last_stand_tween and last_stand_tween.is_valid():
			last_stand_tween.kill()
		last_stand_tween = create_tween()
		last_stand_tween.tween_property(last_stand_timer_bar, "value", 0.0, 5.0)
		last_stand_tween.finished.connect(_on_last_stand_timeout)

func _on_last_stand_timeout() -> void:
	# BUG-03: Nếu màn đã chiến thắng, tuyệt đối không kích hoạt thất bại
	if victory_modal and victory_modal.visible:
		return
	if last_stand_modal and last_stand_modal.visible:
		last_stand_modal.visible = false
		if modal_dimmer: modal_dimmer.visible = false
		GameManager.fail_level()

func _on_last_stand_ad_pressed() -> void:
	if last_stand_tween and last_stand_tween.is_valid():
		last_stand_tween.kill()

	if has_node("/root/AdsManager"):
		var am = get_node("/root/AdsManager")
		am.show_rewarded_ad(
			AdsManager.PLACEMENT_LAST_STAND,
			"egg",
			1,
			func():
				if last_stand_modal: last_stand_modal.visible = false
				if modal_dimmer: modal_dimmer.visible = false
				_refresh_egg_icons(),
			func():
				# Nếu hủy ad, tiếp tục đếm ngược còn lại hoặc fail
				_on_last_stand_timeout()
		)

func _on_last_stand_skip_pressed() -> void:
	if last_stand_tween and last_stand_tween.is_valid():
		last_stand_tween.kill()
	_on_last_stand_timeout()

# ==========================================
# ĐIỂM CHẠM 2: NHÂN BA PHẦN THƯỞNG (X3 COINS)
# ==========================================
func _on_level_completed(stars: int, final_score: int, base_coins: int = 50) -> void:
	victory_claimed = false
	current_base_coins = base_coins
	# BUG-03: Triệt tiêu Last Stand và Fail modal nếu chiến thắng xuất hiện
	if last_stand_tween and last_stand_tween.is_valid():
		last_stand_tween.kill()
	if last_stand_modal: last_stand_modal.visible = false
	if fail_modal: fail_modal.visible = false
	if modal_dimmer: modal_dimmer.visible = true

	if victory_modal:
		victory_modal.visible = true
		victory_modal.pivot_offset = victory_modal.size * 0.5
		var lm = get_node_or_null("/root/LocalizationManager")
		if victory_title:
			victory_title.text = lm.t("KEY_VICTORY") if lm else "CHIẾN THẮNG!"
			victory_title.pivot_offset = victory_title.size * 0.5
			victory_title.scale = Vector2(0.4, 0.4)
			var tt = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
			tt.tween_property(victory_title, "scale", Vector2.ONE, 0.35)

		if victory_score:
			var prev_best = 0
			if has_node("/root/SaveManager"):
				prev_best = get_node("/root/SaveManager").get_level_score(GameManager.current_level)
			var is_new_record = (final_score > prev_best and prev_best > 0)
			var unused_eggs = max(0, GameManager.available_eggs.size() - GameManager.current_egg_index)
			var egg_bonus = unused_eggs * 1200

			var score_text = lm.t("KEY_FINAL_SCORE") % final_score if lm else "Tổng Điểm: %d" % final_score
			if egg_bonus > 0:
				score_text += "\n" + (lm.t("KEY_EGG_BONUS") % egg_bonus if lm else "Thưởng Trứng: +%d" % egg_bonus)
			if is_new_record:
				score_text += "\n🏆 " + (lm.t("KEY_NEW_RECORD") if lm else "KỶ LỤC MỚI!")
			victory_score.text = score_text

		# Chuỗi hoạt ảnh 3 Ngôi Sao nảy tung nhịp nhàng và điểm chuông sao trong trẻo
		var tex_star_full = preload("res://assets/ui/icons/icon_star.svg")
		var star_nodes = [star1, star2, star3]
		for i in range(3):
			var s_node = star_nodes[i]
			if s_node:
				s_node.scale = Vector2.ZERO
				s_node.pivot_offset = s_node.size * 0.5
				s_node.texture = tex_star_full
				if i < stars:
					s_node.modulate = Color.WHITE
					var st = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
					st.tween_interval(0.25 + i * 0.32)
					var star_idx = i
					st.tween_callback(func():
						if has_node("/root/SoundManager"):
							get_node("/root/SoundManager").play_star_chime(star_idx + 1)
						if star_idx == 2 and stars == 3:
							var vp_size = get_viewport().get_visible_rect().size
							var center_y = vp_size.y * 0.45
							ParticleHelper.spawn_confetti_burst(self, Vector2(60, center_y), 32)
							ParticleHelper.spawn_confetti_burst(self, Vector2(vp_size.x - 60, center_y), 32)
					)
					st.tween_property(s_node, "scale", Vector2.ONE, 0.28)
				else:
					s_node.modulate = Color(0.25, 0.18, 0.35, 0.65)
					var st = create_tween().set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
					st.tween_interval(0.25 + i * 0.32)
					st.tween_property(s_node, "scale", Vector2(0.85, 0.85), 0.20)

		if coin_reward_label:
			if lm: coin_reward_label.text = lm.t("KEY_GOLD_REWARD") % base_coins
			else: coin_reward_label.text = "+%d VÀNG" % base_coins

		# Grace Period: Màn 1 đến 5 không có nút xem x3 ad
		if GameManager.current_level <= 5:
			if btn_claim_triple: btn_claim_triple.visible = false
			if next_level_btn:
				if lm: next_level_btn.text = " " + (lm.t("KEY_CONTINUE_REWARD") % base_coins)
				else: next_level_btn.text = " TIẾP TỤC (+%d Vàng)" % base_coins
		else:
			if btn_claim_triple:
				btn_claim_triple.visible = true
				if lm: btn_claim_triple.text = lm.t("KEY_CLAIM_TRIPLE") % (base_coins * 3)
				else: btn_claim_triple.text = "NHẬN X3 VÀNG (+%d)" % (base_coins * 3)
			if next_level_btn:
				if lm: next_level_btn.text = " " + lm.t("KEY_NEXT_LEVEL")
				else: next_level_btn.text = " TIẾP THEO"

		if victory_levels_btn and lm:
			victory_levels_btn.text = " " + lm.t("KEY_SELECT_LEVEL")

		var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		victory_modal.scale = Vector2(0.2, 0.2)
		tween.tween_property(victory_modal, "scale", Vector2.ONE, 0.32)

var victory_claimed: bool = false

func _on_claim_triple_pressed() -> void:
	if victory_claimed: return
	if not has_node("/root/AdsManager"): return
	var am = get_node("/root/AdsManager")
	am.show_rewarded_ad(
		AdsManager.PLACEMENT_TRIPLE_COINS,
		"coins",
		current_base_coins * 3,
		func():
			victory_claimed = true
			if modal_dimmer: modal_dimmer.visible = false
			GameManager.next_level()
	)

func _on_victory_next_pressed() -> void:
	if victory_claimed: return
	victory_claimed = true
	if modal_dimmer: modal_dimmer.visible = false
	if has_node("/root/SaveManager"):
		get_node("/root/SaveManager").add_coins(current_base_coins)
	GameManager.next_level()

func _on_victory_levels_pressed() -> void:
	if victory_claimed: return
	victory_claimed = true
	if modal_dimmer: modal_dimmer.visible = false
	if has_node("/root/SaveManager"):
		get_node("/root/SaveManager").add_coins(current_base_coins)
	GameManager.go_to_level_select()

# ==========================================
# THẤT BẠI (FAIL MODAL)
# ==========================================
func _on_level_failed() -> void:
	# BUG-03: Tuyệt đối không hiện fail modal nếu người chơi đã chiến thắng
	if victory_modal and victory_modal.visible:
		return
	if last_stand_tween and last_stand_tween.is_valid():
		last_stand_tween.kill()
	if last_stand_modal: last_stand_modal.visible = false

	if fail_modal:
		if modal_dimmer: modal_dimmer.visible = true
		fail_modal.visible = true
		var lm = get_node_or_null("/root/LocalizationManager")
		if fail_title and lm: fail_title.text = lm.t("KEY_FAIL")
		if retry_btn and lm: retry_btn.text = " " + lm.t("KEY_RETRY")
		if fail_levels_btn and lm: fail_levels_btn.text = " " + lm.t("KEY_SELECT_LEVEL")

		var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		fail_modal.scale = Vector2(0.5, 0.5)
		tween.tween_property(fail_modal, "scale", Vector2.ONE, 0.3)

func _exit_tree() -> void:
	if last_stand_tween and last_stand_tween.is_valid():
		last_stand_tween.kill()
	if get_viewport() and get_viewport().size_changed.is_connected(_apply_safe_area):
		get_viewport().size_changed.disconnect(_apply_safe_area)
	if get_tree().paused:
		get_tree().paused = false
