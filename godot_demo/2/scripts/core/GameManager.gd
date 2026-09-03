extends Node

signal enemy_defeated(enemy_node, points)
signal egg_dropped(egg_type)
signal level_completed(stars, score, coins)
signal level_failed()
signal last_stand_offered(enemies_left)
signal score_updated(new_score)

var current_level: int = 1
var total_levels: int = 60

var current_score: int = 0
var remaining_enemies: int = 0
var total_enemies: int = 0
var available_eggs: Array[String] = []
var current_egg_index: int = 0

var is_level_active: bool = false
var is_settling: bool = false
var settle_timer: float = 0.0

var last_stand_used_in_level: bool = false
var vip_trial_used_in_level: bool = false

func start_level(level_id: int, enemy_count: int, egg_list: Array[String]) -> void:
	current_level = level_id
	total_enemies = enemy_count
	remaining_enemies = enemy_count
	available_eggs = egg_list.duplicate()
	current_egg_index = 0
	current_score = 0
	is_level_active = true
	is_settling = false
	settle_timer = 0.0
	last_stand_used_in_level = false
	vip_trial_used_in_level = false
	score_updated.emit(current_score)

func add_score(points: int) -> void:
	current_score += points
	score_updated.emit(current_score)

func register_enemy_defeat(enemy: Node, points: int = 800) -> void:
	if not is_level_active: return
	remaining_enemies = max(0, remaining_enemies - 1)
	add_score(points)
	enemy_defeated.emit(enemy, points)

	if remaining_enemies == 0:
		_trigger_victory_delay()

func get_next_egg() -> String:
	if current_egg_index < available_eggs.size():
		var egg = available_eggs[current_egg_index]
		current_egg_index += 1
		egg_dropped.emit(egg)
		return egg
	return ""

func check_out_of_eggs() -> void:
	if remaining_enemies > 0 and current_egg_index >= available_eggs.size():
		is_settling = true
		settle_timer = 3.5

func _process(delta: float) -> void:
	if is_settling and is_level_active:
		settle_timer -= delta
		if remaining_enemies == 0:
			is_settling = false
			_trigger_victory_delay()
		elif settle_timer <= 0.0:
			is_settling = false
			if remaining_enemies > 0:
				# Điểm chạm 1: Cứu thua "Suýt thắng" (Last Stand)
				# Grace Period: chỉ xuất hiện từ Màn 6 trở đi
				# Điều kiện: quái còn <= 2 con và chưa dùng cứu thua ở màn này
				if current_level > 5 and remaining_enemies <= 2 and not last_stand_used_in_level:
					last_stand_used_in_level = true
					last_stand_offered.emit(remaining_enemies)
				else:
					is_level_active = false
					level_failed.emit()

func _trigger_victory_delay() -> void:
	if not is_level_active: return
	is_level_active = false
	
	var unused_eggs = available_eggs.size() - current_egg_index
	add_score(unused_eggs * 1200)

	var base_target = (total_enemies * 800) + 400
	var star3_target = base_target + 1400
	var star2_target = base_target + 600

	var stars = 1
	if current_score >= star3_target and unused_eggs >= 1:
		stars = 3
	elif current_score >= star2_target or unused_eggs >= 1:
		stars = 2

	var base_coins = 50
	if stars == 2: base_coins = 80
	elif stars == 3: base_coins = 120

	# Lưu kết quả vào SaveManager
	if has_node("/root/SaveManager"):
		var sm = get_node("/root/SaveManager")
		sm.record_level_result(current_level, stars, current_score)

	await get_tree().create_timer(1.2).timeout
	level_completed.emit(stars, current_score, base_coins)

func load_level(level_id: int) -> void:
	current_level = clamp(level_id, 1, total_levels)
	get_tree().change_scene_to_file("res://scenes/levels/CampaignLevel.tscn")

func next_level() -> void:
	if current_level < total_levels:
		load_level(current_level + 1)
	else:
		go_to_level_select()

func restart_current_level() -> void:
	get_tree().reload_current_scene()

func go_to_level_select() -> void:
	get_tree().change_scene_to_file("res://scenes/ui/LevelSelect.tscn")

func go_to_main_menu() -> void:
	get_tree().change_scene_to_file("res://scenes/ui/MainMenu.tscn")
