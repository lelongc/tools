extends Node

const SAVE_PATH = "user://savegame.json"

var save_data: Dictionary = {
	"highest_unlocked_level": 1,
	"level_stars": {},
	"level_scores": {},
	"sound_enabled": true,
	"total_stars": 0
}

func _ready() -> void:
	load_game()

func reset_save() -> void:
	save_data = {
		"highest_unlocked_level": 1,
		"level_stars": {},
		"level_scores": {},
		"sound_enabled": true,
		"total_stars": 0
	}
	save_game()

func save_game() -> void:
	# Tính toán tổng số sao
	var total = 0
	for lvl in save_data["level_stars"]:
		total += int(save_data["level_stars"][lvl])
	save_data["total_stars"] = total

	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		var json_str = JSON.stringify(save_data, "\t")
		file.store_string(json_str)
		file.close()

func load_game() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		save_game()
		return

	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file:
		var content = file.get_as_text()
		file.close()
		var json = JSON.new()
		var parse_result = json.parse(content)
		if parse_result == OK and typeof(json.data) == TYPE_DICTIONARY:
			save_data = json.data

func record_level_result(level_id: int, stars: int, score: int) -> void:
	var lvl_key = str(level_id)
	
	# Cập nhật số sao cao nhất
	var current_stars = save_data["level_stars"].get(lvl_key, 0)
	if stars > current_stars:
		save_data["level_stars"][lvl_key] = stars

	# Cập nhật điểm cao nhất
	var current_score = save_data["level_scores"].get(lvl_key, 0)
	if score > current_score:
		save_data["level_scores"][lvl_key] = score

	# Mở khóa màn tiếp theo (tối đa 60 màn)
	if level_id + 1 > save_data["highest_unlocked_level"]:
		save_data["highest_unlocked_level"] = min(level_id + 1, 60)

	save_game()

func get_level_stars(level_id: int) -> int:
	return save_data["level_stars"].get(str(level_id), 0)

func get_level_score(level_id: int) -> int:
	return save_data["level_scores"].get(str(level_id), 0)

func is_level_unlocked(level_id: int) -> bool:
	return level_id <= save_data["highest_unlocked_level"]
