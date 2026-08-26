extends Node

# SaveSystem: Quản lý lưu trữ tiến trình chơi, điểm cao, vàng, skin mở khóa và ngôn ngữ

const SAVE_PATH = "user://save_game.json"

var high_score: int = 0
var total_coins: int = 0
var current_level: int = 1
var equipped_skin_id: String = "classic_giraffe"
var unlocked_skins: Array = ["classic_giraffe"]
var sound_enabled: bool = true
var music_enabled: bool = true
var current_locale: String = "vi"

func _ready() -> void:
	load_game()
	TranslationServer.set_locale(current_locale)

func save_game() -> void:
	var data = {
		"high_score": high_score,
		"total_coins": total_coins,
		"current_level": current_level,
		"equipped_skin_id": equipped_skin_id,
		"unlocked_skins": unlocked_skins,
		"sound_enabled": sound_enabled,
		"music_enabled": music_enabled,
		"current_locale": current_locale
	}
	
	var json_str = JSON.stringify(data)
	
	# 1. Lưu cục bộ (Android / PC)
	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(json_str)
		file.close()
		
	# 2. Đồng bộ đám mây (YouTube Playables Cloud Save)
	if PlatformBridge.current_platform == PlatformBridge.PlatformType.YOUTUBE_PLAYABLE:
		PlatformBridge.save_cloud_data(json_str)

func load_game() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		TranslationServer.set_locale(current_locale)
		return
		
	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	if not file:
		TranslationServer.set_locale(current_locale)
		return
		
	var json_str = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var err = json.parse(json_str)
	if err == OK and json.data is Dictionary:
		var d = json.data
		high_score = d.get("high_score", 0)
		total_coins = d.get("total_coins", 0)
		current_level = d.get("current_level", 1)
		equipped_skin_id = d.get("equipped_skin_id", "classic_giraffe")
		unlocked_skins = d.get("unlocked_skins", ["classic_giraffe"])
		sound_enabled = d.get("sound_enabled", true)
		music_enabled = d.get("music_enabled", true)
		current_locale = d.get("current_locale", "vi")
		TranslationServer.set_locale(current_locale)

func set_language(locale: String) -> void:
	current_locale = locale
	TranslationServer.set_locale(current_locale)
	save_game()

func update_high_score(new_score: int) -> bool:
	if new_score > high_score:
		high_score = new_score
		save_game()
		return true
	return false

func add_coins(amount: int) -> void:
	total_coins += amount
	save_game()

func unlock_skin(skin_id: String) -> bool:
	if not unlocked_skins.has(skin_id):
		unlocked_skins.append(skin_id)
		save_game()
		return true
	return false

func equip_skin(skin_id: String) -> void:
	if unlocked_skins.has(skin_id):
		equipped_skin_id = skin_id
		save_game()
