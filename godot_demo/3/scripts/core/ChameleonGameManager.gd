extends Node

## ChameleonGameManager.gd
## Bộ điều phối trò chơi Tắc Kè 3D: Hỗ trợ Chế Độ Solo Sinh Tồn Đột Biến & Đại Chiến Tiệc Tùng 4 Người

enum GameMode {
	SOLO_ROGUELITE,
	PARTY_BRAWL
}

signal scores_updated(scores: Array, bellies: Array)
signal timer_updated(time_left: float)
signal wave_started(wave_idx: int)
signal wave_finished(wave_idx: int)
signal mutation_prompt(options: Array[Dictionary])
signal match_ended(winner_id: int, summary: Dictionary)

var current_mode: GameMode = GameMode.SOLO_ROGUELITE
var player_configs: Array[String] = ["human", "ai", "ai", "ai"]

# Màu Neon 4 Đội Tắc Kè
const TEAM_COLORS = [
	Color(1.0, 0.25, 0.4),   # P1: Đỏ Hồng Neon
	Color(0.18, 0.72, 1.0),  # P2: Xanh Cyan Neon
	Color(1.0, 0.88, 0.15),  # P3: Vàng Chanh Neon
	Color(0.2, 0.95, 0.45)   # P4: Xanh Lá Chuối Neon
]

const TEAM_NAMES = ["ĐỘI ĐỎ NEON", "ĐỘI XANH NEON", "ĐỘI VÀNG NEON", "ĐỘI LÁ NEON"]

var scores: Array[int] = [0, 0, 0, 0]
var bellies: Array[int] = [0, 0, 0, 0]
var mannequins_slurped: Array[int] = [0, 0, 0, 0]
var domino_splats: Array[int] = [0, 0, 0, 0]

var current_wave: int = 1
var wave_timer: float = 40.0
var match_timer: float = 90.0
var is_match_running: bool = false
var is_mutation_active: bool = false

# Danh sách đột biến Roguelite (Solo Mode)
var active_mutations: Array[String] = []
const ALL_MUTATIONS: Array[Dictionary] = [
	{
		"id": "triple_tongue",
		"name": "🔱 LƯỠI CHIA BA",
		"desc": "Bắn ra cùng lúc 3 chiếc lưỡi quét sạch góc 45 độ!",
		"icon": "🔱"
	},
	{
		"id": "bouncy_tongue",
		"name": "⚡ LƯỠI PHẢN LỰC",
		"desc": "Lưỡi nảy bật tường 2 lần, tăng tầm với thêm 50%!",
		"icon": "⚡"
	},
	{
		"id": "giga_cannon",
		"name": "💣 ĐẠI BÁC PHÁO SƠN",
		"desc": "Khạc hình nhân bay cực nhanh với sóng chấn động cực lớn!",
		"icon": "💣"
	},
	{
		"id": "turbo_chameleon",
		"name": "💨 TẮC KÈ TỐC ĐỘ",
		"desc": "Tăng 45% tốc độ di chuyển và giảm 50% hồi chiêu khạc đạn!",
		"icon": "💨"
	},
	{
		"id": "bottomless_belly",
		"name": "🍔 BỤNG KHÔNG ĐÁY",
		"desc": "Sức chứa tăng lên 16 hình nhân, càng nuốt nhiều càng trâu bò!",
		"icon": "🍔"
	}
]

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS

func start_solo_mode() -> void:
	current_mode = GameMode.SOLO_ROGUELITE
	player_configs = ["human", "off", "off", "off"]
	scores = [0, 0, 0, 0]
	bellies = [0, 0, 0, 0]
	mannequins_slurped = [0, 0, 0, 0]
	domino_splats = [0, 0, 0, 0]
	current_wave = 1
	wave_timer = 40.0
	active_mutations.clear()
	is_match_running = true
	is_mutation_active = false
	get_tree().paused = false
	wave_started.emit(current_wave)

func start_party_mode(configs: Array[String], duration: float = 90.0) -> void:
	current_mode = GameMode.PARTY_BRAWL
	player_configs = configs
	scores = [0, 0, 0, 0]
	bellies = [0, 0, 0, 0]
	mannequins_slurped = [0, 0, 0, 0]
	domino_splats = [0, 0, 0, 0]
	match_timer = duration
	is_match_running = true
	is_mutation_active = false
	get_tree().paused = false

func _process(delta: float) -> void:
	if not is_match_running or is_mutation_active:
		return
		
	if current_mode == GameMode.SOLO_ROGUELITE:
		wave_timer -= delta
		if wave_timer <= 0.0:
			wave_timer = 0.0
			_complete_wave()
		timer_updated.emit(wave_timer)
	else:
		match_timer -= delta
		if match_timer <= 0.0:
			match_timer = 0.0
			_finish_party_match()
		timer_updated.emit(match_timer)

func register_slurp(player_id: int, count: int = 1) -> void:
	bellies[player_id - 1] += count
	mannequins_slurped[player_id - 1] += count
	scores[player_id - 1] += 50 * count
	scores_updated.emit(scores, bellies)

func register_spit(player_id: int, count: int) -> void:
	bellies[player_id - 1] = maxi(0, bellies[player_id - 1] - count)
	scores_updated.emit(scores, bellies)

func register_domino_splat(player_id: int, splat_count: int) -> void:
	domino_splats[player_id - 1] += splat_count
	var combo_bonus = splat_count * 100 + (splat_count * splat_count * 15)
	scores[player_id - 1] += combo_bonus
	scores_updated.emit(scores, bellies)

func _complete_wave() -> void:
	is_mutation_active = true
	wave_finished.emit(current_wave)
	ChameleonSoundManager.play_sfx("cheer", 1.1)
	
	# Chọn ngẫu nhiên 3 đột biến khác nhau
	var available = ALL_MUTATIONS.duplicate()
	available.shuffle()
	var choices: Array[Dictionary] = []
	for i in range(mini(3, available.size())):
		choices.append(available[i])
		
	mutation_prompt.emit(choices)

func apply_mutation(mutation_id: String) -> void:
	active_mutations.append(mutation_id)
	is_mutation_active = false
	current_wave += 1
	wave_timer = 40.0 + current_wave * 5.0
	wave_started.emit(current_wave)

func _finish_party_match() -> void:
	is_match_running = false
	ChameleonSoundManager.play_sfx("cheer", 1.0)
	
	var max_score = -1
	var winner_id = 1
	for i in range(4):
		if player_configs[i] != "off" and scores[i] > max_score:
			max_score = scores[i]
			winner_id = i + 1
			
	var summary = {
		"winner_id": winner_id,
		"scores": scores,
		"slurps": mannequins_slurped,
		"dominos": domino_splats
	}
	match_ended.emit(winner_id, summary)

func change_scene(path: String) -> void:
	get_tree().change_scene_to_file.call_deferred(path)
