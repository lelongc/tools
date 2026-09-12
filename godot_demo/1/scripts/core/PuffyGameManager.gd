extends Node

signal level_started(level_num: int)
signal shots_changed(remaining: int)
signal pearls_changed(collected: int, total: int)
signal score_changed(score: int, combo: int)
signal level_completed(stars: int, final_score: int)
signal level_failed()

enum GameMode {
	CAMPAIGN,
	ENDLESS
}

var current_mode: GameMode = GameMode.CAMPAIGN

# Dữ liệu chiến dịch 30 Màn qua 5 Vùng Biển
var current_level: int = 1
var max_levels: int = 30
var max_shots_per_level: int = 3
var shots_remaining: int = 3
var level_pearls_collected: int = 0
var level_pearls_total: int = 3

# Hệ thống điểm và Combo
var current_score: int = 0
var bounce_combo: int = 1

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

func get_world_name(lvl: int) -> String:
	if lvl <= 6:
		return "Rạn San Hô Ngập Nắng"
	elif lvl <= 12:
		return "Vịnh Cướp Biển & Cua Đỏ"
	elif lvl <= 18:
		return "Vực Thẳm Sứa Phát Sáng"
	elif lvl <= 24:
		return "Xác Tàu Cổ Bí Ẩn"
	else:
		return "Rãnh Nham Thạch Núi Lửa"

func start_campaign_level(lvl: int) -> void:
	current_mode = GameMode.CAMPAIGN
	current_level = clamp(lvl, 1, max_levels)
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
	
	# QUY CHUẨN TÍNH SAO CHÍNH XÁC 100%:
	# 1 Sao: Chạm vòng xoáy đích đến
	# 2 Sao: Ăn ít nhất 2/3 ngọc trai
	# 3 Sao: Ăn trọn vẹn 3/3 ngọc trai VÀ còn ít nhất 1 lần bắn dự phòng!
	var stars = 1
	if level_pearls_collected >= 2:
		stars += 1
	if level_pearls_collected >= 3 and shots_remaining >= 1:
		stars = 3
	elif stars == 2 and shots_remaining >= 2:
		stars = 2 # Nếu chưa đủ ngọc nhưng bắn xuất sắc
		
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

func _save_progression() -> void:
	var config = ConfigFile.new()
	for lvl in level_stars.keys():
		config.set_value("stars", str(lvl), level_stars[lvl])
	for lvl in level_high_scores.keys():
		config.set_value("high_scores", str(lvl), level_high_scores[lvl])
	config.set_value("meta", "pearls", total_pearls_bank)
	config.set_value("meta", "endless_best", endless_best_score)
	config.save("user://puffy_progress.cfg")

func _load_progression() -> void:
	var config = ConfigFile.new()
	if config.load("user://puffy_progress.cfg") == OK:
		if config.has_section("stars"):
			for key in config.get_section_keys("stars"):
				level_stars[int(key)] = config.get_value("stars", key, 0)
		if config.has_section("high_scores"):
			for key in config.get_section_keys("high_scores"):
				level_high_scores[int(key)] = config.get_value("high_scores", key, 0)
		total_pearls_bank = config.get_value("meta", "pearls", 0)
		endless_best_score = config.get_value("meta", "endless_best", 0)
