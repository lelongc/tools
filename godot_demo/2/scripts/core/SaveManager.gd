extends Node

signal coins_updated(new_amount)
signal consumables_updated()

const SAVE_PATH = "user://savegame.json"
const TEMP_PATH = "user://savegame.json.tmp"
const BACKUP_PATH = "user://savegame.json.bak"

var save_data: Dictionary = {
	"highest_unlocked_level": 1,
	"level_stars": {},
	"level_scores": {},
	"sound_enabled": true,
	"total_stars": 0,
	"coins": 150,
	"consumables": {
		"bomb": 1,
		"drill": 0,
		"acid": 0
	},
	"daily_spins_date": "",
	"daily_spins_count": 0,
	"version": 7
}

func _ready() -> void:
	load_game()
	if save_data.get("version", 1) < 7:
		_migrate_save_version()

func _migrate_save_version() -> void:
	# SAVE-01: Bảo toàn toàn bộ tiến trình người chơi thay vì reset_save
	var cur_ver = int(save_data.get("version", 1))
	if cur_ver < 7:
		save_data["version"] = 7
		if not save_data.has("highest_unlocked_level"):
			save_data["highest_unlocked_level"] = 1
		if not (save_data.get("level_stars") is Dictionary):
			save_data["level_stars"] = {}
		if not (save_data.get("level_scores") is Dictionary):
			save_data["level_scores"] = {}
		if not (save_data.get("consumables") is Dictionary):
			save_data["consumables"] = {"bomb": 1, "drill": 0, "acid": 0}
		save_game()

func _notification(what: int) -> void:
	match what:
		NOTIFICATION_APPLICATION_PAUSED, NOTIFICATION_WM_CLOSE_REQUEST, NOTIFICATION_WM_GO_BACK_REQUEST:
			save_game()

func reset_save() -> void:
	save_data = {
		"highest_unlocked_level": 1,
		"level_stars": {},
		"level_scores": {},
		"sound_enabled": true,
		"total_stars": 0,
		"coins": 150,
		"consumables": {
			"bomb": 1,
			"drill": 0,
			"acid": 0
		},
		"daily_spins_date": "",
		"daily_spins_count": 0,
		"version": 7
	}
	save_game()
	coins_updated.emit(save_data["coins"])
	consumables_updated.emit()

func save_game() -> void:
	var total = 0
	for lvl in save_data.get("level_stars", {}):
		total += int(save_data["level_stars"][lvl])
	save_data["total_stars"] = total

	# 1. Ghi vào file tạm (.tmp) trước để chống ngắt đột ngột khi pin yếu/OS kill tiến trình
	var file = FileAccess.open(TEMP_PATH, FileAccess.WRITE)
	if file:
		var json_str = JSON.stringify(save_data, "\t")
		file.store_string(json_str)
		file.flush()
		file.close()

		# 2. Tạo bản sao lưu dự phòng (.bak) từ file save hiện tại
		var dir = DirAccess.open("user://")
		if dir:
			if dir.file_exists(SAVE_PATH):
				dir.copy(SAVE_PATH, BACKUP_PATH)
			
			# 3. Nâng cấp file tạm thành file save chính thức (Atomic promote)
			if dir.file_exists(SAVE_PATH):
				dir.remove(SAVE_PATH)
			var err = dir.rename(TEMP_PATH, SAVE_PATH)
			if err != OK:
				if dir.file_exists(BACKUP_PATH) and not dir.file_exists(SAVE_PATH):
					dir.copy(BACKUP_PATH, SAVE_PATH)

func load_game() -> void:
	# 1. Thử đọc file chính thức
	if FileAccess.file_exists(SAVE_PATH):
		var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
		if file:
			var content = file.get_as_text()
			file.close()
			var json = JSON.new()
			var parse_result = json.parse(content)
			if parse_result == OK and typeof(json.data) == TYPE_DICTIONARY:
				_apply_loaded_dict(json.data)
				coins_updated.emit(save_data.get("coins", 0))
				return

	# 2. Nếu file chính thức bị lỗi, thử đọc từ file tạm (.tmp) còn nguyên
	if FileAccess.file_exists(TEMP_PATH):
		var tfile = FileAccess.open(TEMP_PATH, FileAccess.READ)
		if tfile:
			var tcontent = tfile.get_as_text()
			tfile.close()
			var tjson = JSON.new()
			var tres = tjson.parse(tcontent)
			if tres == OK and typeof(tjson.data) == TYPE_DICTIONARY:
				_apply_loaded_dict(tjson.data)
				save_game()
				coins_updated.emit(save_data.get("coins", 0))
				return

	# 3. Kích hoạt cơ chế tự phục hồi từ bản sao lưu (.bak)
	if FileAccess.file_exists(BACKUP_PATH):
		var bfile = FileAccess.open(BACKUP_PATH, FileAccess.READ)
		if bfile:
			var bcontent = bfile.get_as_text()
			bfile.close()
			var bjson = JSON.new()
			var bres = bjson.parse(bcontent)
			if bres == OK and typeof(bjson.data) == TYPE_DICTIONARY:
				_apply_loaded_dict(bjson.data)
				save_game() # Phục hồi lại file chính
				coins_updated.emit(save_data.get("coins", 0))
				return

	# 4. Nếu hoàn toàn không có save, tạo save mới khởi đầu
	save_game()
	coins_updated.emit(save_data.get("coins", 0))

func _apply_loaded_dict(dict: Dictionary) -> void:
	# SAVE-03: Kiểm tra tính toàn vẹn và hợp lệ của cấu trúc dữ liệu lồng nhau
	for key in save_data.keys():
		if not dict.has(key):
			dict[key] = save_data[key]

	if not (dict.get("level_stars") is Dictionary):
		dict["level_stars"] = {}
	if not (dict.get("level_scores") is Dictionary):
		dict["level_scores"] = {}
	if not (dict.get("consumables") is Dictionary):
		dict["consumables"] = {"bomb": 1, "drill": 0, "acid": 0}

	var coins_val = dict.get("coins", 150)
	dict["coins"] = max(0, int(coins_val))

	var lvl_val = dict.get("highest_unlocked_level", 1)
	dict["highest_unlocked_level"] = clamp(int(lvl_val), 1, 200)

	save_data = dict

func record_level_result(level_id: int, stars: int, score: int) -> void:
	var lvl_key = str(level_id)
	
	var current_stars = save_data["level_stars"].get(lvl_key, 0)
	if stars > current_stars:
		save_data["level_stars"][lvl_key] = stars

	var current_score = save_data["level_scores"].get(lvl_key, 0)
	if score > current_score:
		save_data["level_scores"][lvl_key] = score

	if level_id + 1 > save_data.get("highest_unlocked_level", 1):
		save_data["highest_unlocked_level"] = min(level_id + 1, 200)

	save_game()

func get_level_stars(level_id: int) -> int:
	return save_data.get("level_stars", {}).get(str(level_id), 0)

func get_level_score(level_id: int) -> int:
	return save_data.get("level_scores", {}).get(str(level_id), 0)

func is_level_unlocked(level_id: int) -> bool:
	# Ở chế độ Debug/Kiểm thử: Mở khóa toàn bộ 200 màn để test tự do
	if OS.is_debug_build():
		return true
	# Ở bản phát hành Release CH Play: Mở khóa tuần tự theo chiến thắng thực tế
	return level_id <= save_data.get("highest_unlocked_level", 1)

func get_highest_unlocked_level() -> int:
	if OS.is_debug_build():
		return 200
	return save_data.get("highest_unlocked_level", 1)

func get_total_stars() -> int:
	return save_data.get("total_stars", 0)

# ==========================================
# KINH TẾ VÀNG (COINS - SOFT CURRENCY)
# ==========================================
func get_coins() -> int:
	return save_data.get("coins", 0)

func add_coins(amount: int) -> void:
	var c = max(0, get_coins() + amount)
	save_data["coins"] = c
	save_game()
	coins_updated.emit(c)

func spend_coins(amount: int) -> bool:
	var cur = get_coins()
	if cur >= amount:
		save_data["coins"] = cur - amount
		save_game()
		coins_updated.emit(save_data["coins"])
		return true
	return false

# ==========================================
# KHO TRỨNG ĐẶC BIỆT (CONSUMABLES INVENTORY)
# ==========================================
func get_consumable(egg_type: String) -> int:
	var dict = save_data.get("consumables", {})
	return dict.get(egg_type, 0)

func add_consumable(egg_type: String, count: int = 1) -> void:
	if not save_data.has("consumables"):
		save_data["consumables"] = {}
	var cur = save_data["consumables"].get(egg_type, 0)
	save_data["consumables"][egg_type] = cur + count
	save_game()
	consumables_updated.emit()

func use_consumable(egg_type: String) -> bool:
	var cur = get_consumable(egg_type)
	if cur > 0:
		save_data["consumables"][egg_type] = cur - 1
		save_game()
		consumables_updated.emit()
		return true
	return false

# ==========================================
# VÒNG QUAY MAY MẮN HÀNG NGÀY (DAILY LUCKY WHEEL)
# ==========================================
func _get_today_string() -> String:
	var dt = Time.get_date_dict_from_system()
	return "%04d-%02d-%02d" % [dt.year, dt.month, dt.day]

func _check_and_reset_daily_spins() -> void:
	var today = _get_today_string()
	if save_data.get("daily_spins_date", "") != today:
		save_data["daily_spins_date"] = today
		save_data["daily_spins_count"] = 0
		save_game()

func is_first_daily_spin_free() -> bool:
	_check_and_reset_daily_spins()
	return save_data.get("daily_spins_count", 0) == 0

func can_spin_daily_wheel() -> bool:
	_check_and_reset_daily_spins()
	return save_data.get("daily_spins_count", 0) < 4

func get_daily_spins_used() -> int:
	_check_and_reset_daily_spins()
	return save_data.get("daily_spins_count", 0)

func record_daily_spin() -> void:
	_check_and_reset_daily_spins()
	save_data["daily_spins_count"] = save_data.get("daily_spins_count", 0) + 1
	save_game()

# ==========================================
# ĐỒNG BỘ LƯU TRỮ ĐÁM MÂY (CLOUD SAVE - GOOGLE PLAY SNAPSHOTS READY)
# ==========================================
signal cloud_sync_completed(success: bool, message: String)

func export_save_json() -> String:
	return JSON.stringify(save_data, "\t")

func import_save_json(json_str: String) -> bool:
	var parsed = JSON.parse_string(json_str)
	if parsed is Dictionary and parsed.has("version"):
		# Chiến lược hợp nhất tiến trình cao nhất (High-Watermark Merge)
		var local_lvl = save_data.get("highest_unlocked_level", 1)
		var remote_lvl = parsed.get("highest_unlocked_level", 1)
		save_data["highest_unlocked_level"] = max(local_lvl, remote_lvl)

		# Hợp nhất số sao từng màn
		var local_stars = save_data.get("level_stars", {})
		var remote_stars = parsed.get("level_stars", {})
		for k in remote_stars:
			var s_remote = int(remote_stars[k])
			var s_local = int(local_stars.get(k, 0))
			local_stars[k] = max(s_local, s_remote)
		save_data["level_stars"] = local_stars

		# Hợp nhất điểm kỷ lục từng màn
		var local_scores = save_data.get("level_scores", {})
		var remote_scores = parsed.get("level_scores", {})
		for k in remote_scores:
			var sc_remote = int(remote_scores[k])
			var sc_local = int(local_scores.get(k, 0))
			local_scores[k] = max(sc_local, sc_remote)
		save_data["level_scores"] = local_scores

		# Hợp nhất tiền vàng và đạo cụ
		save_data["coins"] = max(int(save_data.get("coins", 0)), int(parsed.get("coins", 0)))
		var local_cons = save_data.get("consumables", {})
		var remote_cons = parsed.get("consumables", {})
		for c_key in ["bomb", "drill", "acid"]:
			var c_local = int(local_cons.get(c_key, 0))
			var c_remote = int(remote_cons.get(c_key, 0))
			local_cons[c_key] = max(c_local, c_remote)
		save_data["consumables"] = local_cons

		save_game()
		coins_updated.emit(save_data["coins"])
		consumables_updated.emit()
		cloud_sync_completed.emit(true, "Cloud save successfully merged")
		return true

	cloud_sync_completed.emit(false, "Invalid cloud save format")
	return false
