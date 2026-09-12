extends Node

signal level_started(level_num: int)
signal shots_changed(remaining: int)
signal pearls_changed(collected: int, total: int)
signal score_changed(score: int, combo: int)
signal level_completed(stars: int, final_score: int)
signal level_failed()
signal rewarded_shot_granted()

enum GameMode {
	CAMPAIGN,
	ENDLESS
}

var current_mode: GameMode = GameMode.CAMPAIGN

# Dữ liệu chiến dịch 60 Màn qua 8 Vùng Biển
var current_level: int = 1
var max_levels: int = 60
var max_shots_per_level: int = 3
var shots_remaining: int = 3
var level_pearls_collected: int = 0
var level_pearls_total: int = 3

# Hệ thống điểm và Combo
var current_score: int = 0
var bounce_combo: int = 1

# Trạng thái Siêu Sao Cầu Vồng (Golden Super Puffy)
var is_golden_puffy: bool = false
var golden_timer: float = 0.0

# Lưu trữ sao và điểm kỷ lục
var level_stars: Dictionary = {}
var level_high_scores: Dictionary = {}
var total_pearls_bank: int = 0

# Chế độ Endless
var endless_score: int = 0
var endless_best_score: int = 0

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_load_progression()

func _notification(what: int) -> void:
	match what:
		NOTIFICATION_WM_GO_BACK_REQUEST:
			_handle_android_back_request()
		NOTIFICATION_APPLICATION_PAUSED:
			_save_progression()
			if PuffySoundManager.bgm_player:
				PuffySoundManager.bgm_player.stream_paused = true
		NOTIFICATION_APPLICATION_RESUMED:
			if PuffySoundManager.bgm_player and not PuffySoundManager.is_bgm_muted:
				PuffySoundManager.bgm_player.stream_paused = false
		NOTIFICATION_WM_CLOSE_REQUEST:
			_save_progression()

func _handle_android_back_request() -> void:
	var pause_modals = get_tree().get_nodes_in_group("pause_modal")
	if pause_modals.size() > 0:
		pause_modals[0]._on_resume_pressed()
		return
		
	var tutorial_modals = get_tree().get_nodes_in_group("tutorial_modal")
	if tutorial_modals.size() > 0:
		tutorial_modals[0].queue_free()
		return
		
	var current_scene = get_tree().current_scene
	if current_scene is PuffyArena:
		if is_instance_valid(current_scene.hud):
			current_scene.hud._on_pause_pressed()
	elif current_scene is PuffyLevelSelect:
		PuffySoundManager.play_stretch()
		get_tree().change_scene_to_file("res://scenes/ui/PuffyMainMenu.tscn")
	elif current_scene is PuffyMainMenu:
		_save_progression()
		get_tree().quit()

func trigger_haptic(duration_ms: int = 40) -> void:
	if OS.has_feature("mobile") or OS.has_feature("android") or OS.has_feature("ios"):
		Input.vibrate_handheld(duration_ms)

func grant_rewarded_shot() -> void:
	shots_remaining += 1
	emit_signal("shots_changed", shots_remaining)
	emit_signal("rewarded_shot_granted")
	PuffySoundManager.play_powerup()
	trigger_haptic(80)

func _process(delta: float) -> void:
	if is_golden_puffy:
		golden_timer -= delta
		if golden_timer <= 0.0:
			is_golden_puffy = false

func is_boss_level(lvl: int) -> bool:
	return lvl in [16, 32, 48, 60]

func get_world_index(lvl: int) -> int:
	if lvl <= 7:
		return 1
	elif lvl <= 16:
		return 2
	elif lvl <= 23:
		return 3
	elif lvl <= 32:
		return 4
	elif lvl <= 39:
		return 5
	elif lvl <= 48:
		return 6
	elif lvl <= 55:
		return 7
	else:
		return 8

func get_world_name(lvl: int) -> String:
	if lvl <= 7:
		return "Vùng 1: Rạn San Hô Ngập Nắng"
	elif lvl < 16:
		return "Vùng 2: Vịnh Cướp Biển & Thành Lũy"
	elif lvl == 16:
		return "👑 BOSS 1: Sào Huyệt Cua Vua Thiết Giáp"
	elif lvl <= 23:
		return "Vùng 3: Vực Thẳm Sứa Phát Sáng"
	elif lvl < 32:
		return "Vùng 4: Xác Tàu Đắm Cổ & Kho Báu"
	elif lvl == 32:
		return "👑 BOSS 2: Hang Ổ Vua Bạch Tuộc Khổng Lồ"
	elif lvl <= 39:
		return "Vùng 5: Rãnh Nham Thạch Núi Lửa"
	elif lvl < 48:
		return "Vùng 6: Rừng Tảo Băng Bắc Cực"
	elif lvl == 48:
		return "👑 BOSS 3: Động Quái Thú Băng Giá"
	elif lvl <= 55:
		return "Vùng 7: Cung Điện Atlantis Cổ Đại"
	elif lvl < 60:
		return "Vùng 8: Rãnh Mariana - Tận Cùng Vực Thẳm"
	else:
		return "👑 ĐẠI CHIẾN CHUNG KẾT: THẦN BIỂN LEVIATHAN"

func activate_golden_puffy(duration: float = 3.5) -> void:
	is_golden_puffy = true
	golden_timer = duration
	PuffySoundManager.play_powerup()


func get_max_shots_for_level(lvl: int) -> int:
	if is_boss_level(lvl):
		return 6 if lvl >= 48 else 5
	elif lvl >= 24:
		return 4 # Màn giải đố quy mô lớn nhiều cơ chế
	return 3

func start_campaign_level(lvl: int) -> void:
	current_mode = GameMode.CAMPAIGN
	current_level = clamp(lvl, 1, max_levels)
	max_shots_per_level = get_max_shots_for_level(current_level)
	shots_remaining = max_shots_per_level
	level_pearls_collected = 0
	level_pearls_total = 3
	current_score = 0
	bounce_combo = 1
	get_tree().paused = false
	emit_signal("level_started", current_level)
	emit_signal("shots_changed", shots_remaining)
	emit_signal("pearls_changed", level_pearls_collected, level_pearls_total)
	emit_signal("score_changed", current_score, bounce_combo)
	get_tree().change_scene_to_file("res://scenes/game/PuffyArena.tscn")

func start_endless_mode() -> void:
	current_mode = GameMode.ENDLESS
	endless_score = 0
	current_score = 0
	bounce_combo = 1
	shots_remaining = 5
	level_pearls_collected = 0
	level_pearls_total = 0
	get_tree().paused = false
	emit_signal("shots_changed", shots_remaining)
	emit_signal("score_changed", current_score, bounce_combo)
	get_tree().change_scene_to_file("res://scenes/game/PuffyArena.tscn")

func consume_shot() -> bool:
	if shots_remaining > 0:
		shots_remaining -= 1
		emit_signal("shots_changed", shots_remaining)
		return true
	return false

func register_bounce(base_points: int = 100) -> void:
	var pts = base_points * bounce_combo
	current_score += pts
	if current_mode == GameMode.ENDLESS:
		endless_score = current_score
		if endless_score > endless_best_score:
			endless_best_score = endless_score
	bounce_combo = min(bounce_combo + 1, 20)
	emit_signal("score_changed", current_score, bounce_combo)

func reset_bounce_combo() -> void:
	bounce_combo = 1
	emit_signal("score_changed", current_score, bounce_combo)

func add_score(pts: int) -> void:
	current_score += pts
	if current_mode == GameMode.ENDLESS:
		endless_score = current_score
		if endless_score > endless_best_score:
			endless_best_score = endless_score
	emit_signal("score_changed", current_score, bounce_combo)

func add_pearl() -> void:
	level_pearls_collected += 1
	total_pearls_bank += 1
	current_score += 500
	PuffySoundManager.play_pearl()
	emit_signal("pearls_changed", level_pearls_collected, level_pearls_total)
	emit_signal("score_changed", current_score, bounce_combo)

func finish_level_victory() -> void:
	# Điểm thưởng phát bắn còn lại: 2,000 điểm mỗi lần bắn dự phòng
	var shot_bonus = shots_remaining * 2000
	current_score += shot_bonus
	
	# QUY CHUẨN TÍNH 3 SAO CÔNG BẰNG & KHOA HỌC (SKILL-BASED):
	var stars = 1
	if is_boss_level(current_level):
		# Màn Trùm:
		# 1 Sao: Đánh bại Boss
		# 2 Sao: Còn ít nhất 1 đạn
		# 3 Sao: Còn >= 2 đạn HOẶC điểm cao >= 9,000 (dùng combo Thủy Lôi/Siêu Sao húc Boss)
		if shots_remaining >= 2 or current_score >= 9000:
			stars = 3
		elif shots_remaining >= 1:
			stars = 2
	else:
		# Màn Thường:
		# 1 Sao: Chạm vòng xoáy đích đến thành công
		# 2 Sao: Ăn >= 2 ngọc trai HOẶC còn >= 1 đạn
		if level_pearls_collected >= 2 or shots_remaining >= 1:
			stars = 2
		# 3 Sao:
		# - Thu thập đủ 3/3 ngọc trai (Người chơi khéo léo gom hết ngọc)
		# - HOẶC Bắn 1 phát trúng đích đỉnh cao (Ace / Hole-in-One: còn >= 2 đạn)
		# - HOẶC Điểm Combo nảy liên hoàn đạt mốc xuất sắc (>= 7,500 điểm)
		if level_pearls_collected >= 3 or shots_remaining >= 2 or current_score >= 7500:
			stars = 3
		
	# Lưu kỷ lục sao và điểm cao nhất
	var prev_stars = level_stars.get(current_level, 0)
	if stars > prev_stars:
		level_stars[current_level] = stars
		
	var prev_high = level_high_scores.get(current_level, 0)
	if current_score > prev_high:
		level_high_scores[current_level] = current_score
		
	_save_progression()
	PuffySoundManager.play_victory()
	emit_signal("level_completed", stars, current_score)

func trigger_level_failed() -> void:
	PuffySoundManager.play_fail()
	emit_signal("level_failed")

func get_total_stars() -> int:
	var total = 0
	for s in level_stars.values():
		total += s
	return total

const SAVE_PATH = "user://puffy_progress.cfg"
const BACKUP_PATH = "user://puffy_progress.cfg.bak"

func reset_all_saved_data() -> void:
	level_stars.clear()
	level_high_scores.clear()
	total_pearls_bank = 0
	endless_best_score = 0
	if FileAccess.file_exists(SAVE_PATH):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(SAVE_PATH))
	if FileAccess.file_exists(BACKUP_PATH):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(BACKUP_PATH))
	_save_progression()

func _save_progression() -> void:
	var config = ConfigFile.new()
	for lvl in level_stars.keys():
		config.set_value("stars", str(lvl), level_stars[lvl])
	for lvl in level_high_scores.keys():
		config.set_value("high_scores", str(lvl), level_high_scores[lvl])
	config.set_value("meta", "pearls", total_pearls_bank)
	config.set_value("meta", "endless_best", endless_best_score)
	config.save(SAVE_PATH)
	config.save(BACKUP_PATH)

func _load_progression() -> void:
	var config = ConfigFile.new()
	var err = config.load(SAVE_PATH)
	if err != OK:
		err = config.load(BACKUP_PATH)
	if err == OK:
		if config.has_section("stars"):
			for key in config.get_section_keys("stars"):
				level_stars[int(key)] = config.get_value("stars", key, 0)
		if config.has_section("high_scores"):
			for key in config.get_section_keys("high_scores"):
				level_high_scores[int(key)] = config.get_value("high_scores", key, 0)
		total_pearls_bank = config.get_value("meta", "pearls", 0)
		endless_best_score = config.get_value("meta", "endless_best", 0)
