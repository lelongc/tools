extends Node

const SAVE_PATH = "user://runic_save.json"
const TEMP_PATH = "user://runic_save.json.tmp"
const BACKUP_PATH = "user://runic_save.json.bak"

var meta_data: Dictionary = {
	"high_wave": 1,
	"total_kills": 0,
	"meta_dust": 0,
	"unlocked_heroes": ["runic_knight"],
	"sound_volume": 1.0,
	"screen_shake": true
}

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	load_game()

func save_game() -> void:
	meta_data["meta_dust"] = GameManager.meta_dust
	if GameManager.current_wave > meta_data.get("high_wave", 1):
		meta_data["high_wave"] = GameManager.current_wave
	meta_data["total_kills"] = meta_data.get("total_kills", 0) + GameManager.enemies_killed
	
	# 1. Ghi ra tệp tạm thời
	var file = FileAccess.open(TEMP_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(meta_data, "\t"))
		file.flush()
		file.close()
		
		# 2. Tạo bản sao lưu an toàn
		if FileAccess.file_exists(SAVE_PATH):
			DirAccess.copy_absolute(SAVE_PATH, BACKUP_PATH)
			
		# 3. Thăng cấp nguyên tử file tạm thành file chính
		if FileAccess.file_exists(SAVE_PATH):
			DirAccess.remove_absolute(SAVE_PATH)
		DirAccess.rename_absolute(TEMP_PATH, SAVE_PATH)

func load_game() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		if FileAccess.file_exists(BACKUP_PATH):
			_recover_backup()
		return
		
	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file:
		var text = file.get_as_text()
		file.close()
		var json = JSON.new()
		var err = json.parse(text)
		if err == OK and typeof(json.data) == TYPE_DICTIONARY:
			for k in json.data.keys():
				meta_data[k] = json.data[k]
			GameManager.meta_dust = meta_data.get("meta_dust", 0)
			return
			
	# Nếu parse lỗi -> tự phục hồi từ backup
	_recover_backup()

func _recover_backup() -> void:
	if FileAccess.file_exists(BACKUP_PATH):
		var file = FileAccess.open(BACKUP_PATH, FileAccess.READ)
		if file:
			var text = file.get_as_text()
			file.close()
			var json = JSON.new()
			if json.parse(text) == OK and typeof(json.data) == TYPE_DICTIONARY:
				for k in json.data.keys():
					meta_data[k] = json.data[k]

func _notification(what: int) -> void:
	match what:
		NOTIFICATION_APPLICATION_PAUSED, NOTIFICATION_WM_CLOSE_REQUEST:
			save_game()
		NOTIFICATION_WM_GO_BACK_REQUEST:
			_handle_android_back()

func _handle_android_back() -> void:
	if GameManager.current_state == GameManager.GameState.ARENA_COMBAT:
		get_tree().paused = not get_tree().paused
	elif GameManager.current_state == GameManager.GameState.MAIN_MENU:
		save_game()
		get_tree().quit()
