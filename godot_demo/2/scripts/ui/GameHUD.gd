extends CanvasLayer

const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")

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

func _ready() -> void:
	if victory_modal: victory_modal.visible = false
	if fail_modal: fail_modal.visible = false
	if pause_modal: pause_modal.visible = false
	if last_stand_modal: last_stand_modal.visible = false

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
	if next_level_btn: next_level_btn.pressed.connect(_on_claim_normal_and_next)
	if victory_levels_btn: victory_levels_btn.pressed.connect(func():
		_on_claim_normal_and_next()
		GameManager.go_to_level_select()
	)
	
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

func _update_coin_display(amount: int) -> void:
	if coin_label:
		coin_label.text = "%d" % amount

func _toggle_pause() -> void:
	var is_p = not get_tree().paused
	get_tree().paused = is_p
	if pause_modal:
		pause_modal.visible = is_p
		if is_p and has_node("/root/LocalizationManager"):
			var lm = get_node("/root/LocalizationManager")
			if pause_title: pause_title.text = lm.t("KEY_PAUSE")
			if resume_btn: resume_btn.text = lm.t("KEY_RESUME")
			if pause_retry_btn: pause_retry_btn.text = lm.t("KEY_RETRY")
			if pause_levels_btn: pause_levels_btn.text = lm.t("KEY_SELECT_LEVEL")

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

		var tr = TextureRect.new()
		tr.custom_minimum_size = Vector2(24, 30)
		tr.expand_mode = TextureRect.EXPAND_FIT_WIDTH_PROPORTIONAL
		tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		if tex:
			tr.texture = tex

		if i < GameManager.current_egg_index:
			# Đã bắn: Mờ xám
			tr.modulate = Color(0.4, 0.4, 0.4, 0.35)
			tr.scale = Vector2(0.88, 0.88)
			tr.pivot_offset = Vector2(12, 15)
		elif i == GameManager.current_egg_index:
			# Trứng đang trên giỏ của Gà: Sáng nổi bật & nảy nhẹ
			tr.modulate = Color(1.2, 1.2, 1.1, 1.0)
			tr.scale = Vector2(1.10, 1.10)
			tr.pivot_offset = Vector2(12, 15)
		else:
			# Trứng trong hàng chờ
			tr.modulate = Color(0.85, 0.85, 0.85, 0.85)
			tr.scale = Vector2(0.95, 0.95)
			tr.pivot_offset = Vector2(12, 15)

		egg_container.add_child(tr)

func _on_score_updated(new_score: int) -> void:
	var lm = get_node_or_null("/root/LocalizationManager")
	if score_label:
		if lm: score_label.text = lm.t("KEY_SCORE") % new_score
		else: score_label.text = "SCORE: %d" % new_score

func _on_egg_dropped(_egg_type: String) -> void:
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
	last_stand_modal.visible = true
	if last_stand_sub:
		last_stand_sub.text = "Chỉ còn %d quái vật! Đừng bỏ cuộc!" % enemies_left

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
	if last_stand_modal and last_stand_modal.visible:
		last_stand_modal.visible = false
		GameManager.is_level_active = false
		GameManager.level_failed.emit()

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
	current_base_coins = base_coins

	if victory_modal:
		victory_modal.visible = true
		var lm = get_node_or_null("/root/LocalizationManager")
		if victory_title:
			victory_title.text = lm.t("KEY_VICTORY") if lm else "CHIẾN THẮNG!"
		if victory_score:
			victory_score.text = lm.t("KEY_FINAL_SCORE") % final_score if lm else "Điểm số: %d" % final_score

		# Chuỗi hoạt ảnh 3 Ngôi Sao Vector sinh động chuẩn Angry Birds
		var tex_star_full = preload("res://assets/ui/icons/icon_star.svg")
		var tex_star_empty = preload("res://assets/ui/icons/icon_star_empty.svg")
		var star_nodes = [star1, star2, star3]
		for i in range(3):
			var s_node = star_nodes[i]
			if s_node:
				s_node.scale = Vector2.ZERO
				s_node.pivot_offset = s_node.size * 0.5
				if i < stars:
					s_node.texture = tex_star_full
					var st = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
					st.tween_interval(0.2 + i * 0.2)
					st.tween_property(s_node, "scale", Vector2.ONE, 0.32)
					var star_idx = i
					st.tween_callback(func():
						if has_node("/root/SoundManager"):
							get_node("/root/SoundManager").play_synth_tone(520.0 + star_idx * 160.0, 0.12, "sine", 1.0)
					)
				else:
					s_node.texture = tex_star_empty
					var st = create_tween().set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
					st.tween_interval(0.2 + i * 0.2)
					st.tween_property(s_node, "scale", Vector2(0.85, 0.85), 0.22)

		if coin_reward_label:
			coin_reward_label.text = "+%d VÀNG" % base_coins

		# Grace Period: Màn 1 đến 5 không có nút xem x3 ad
		if GameManager.current_level <= 5:
			if btn_claim_triple: btn_claim_triple.visible = false
			if next_level_btn: next_level_btn.text = " TIẾP TỤC (+%d Vàng)" % base_coins
		else:
			if btn_claim_triple:
				btn_claim_triple.visible = true
				btn_claim_triple.text = "NHẬN X3 VÀNG (+%d)" % (base_coins * 3)
			if next_level_btn:
				next_level_btn.text = " TIẾP THEO"

		var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		victory_modal.scale = Vector2(0.5, 0.5)
		tween.tween_property(victory_modal, "scale", Vector2.ONE, 0.3)

func _on_claim_triple_pressed() -> void:
	if not has_node("/root/AdsManager"): return
	var am = get_node("/root/AdsManager")
	am.show_rewarded_ad(
		AdsManager.PLACEMENT_TRIPLE_COINS,
		"coins",
		current_base_coins * 3,
		func():
			GameManager.next_level()
	)

func _on_claim_normal_and_next() -> void:
	if has_node("/root/SaveManager"):
		get_node("/root/SaveManager").add_coins(current_base_coins)
	GameManager.next_level()

# ==========================================
# THẤT BẠI (FAIL MODAL)
# ==========================================
func _on_level_failed() -> void:
	if fail_modal:
		fail_modal.visible = true
		var lm = get_node_or_null("/root/LocalizationManager")
		if fail_title and lm: fail_title.text = lm.t("KEY_FAIL")
		if retry_btn and lm: retry_btn.text = lm.t("KEY_RETRY")
		if fail_levels_btn and lm: fail_levels_btn.text = lm.t("KEY_SELECT_LEVEL")

		var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		fail_modal.scale = Vector2(0.5, 0.5)
		tween.tween_property(fail_modal, "scale", Vector2.ONE, 0.3)
