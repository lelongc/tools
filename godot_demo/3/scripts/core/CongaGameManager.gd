extends Node

## CongaGameManager.gd
## Điều phối vòng đấu 4 người chơi, tính điểm và bảng xếp hạng

signal match_timer_updated(time_left: float)
signal scores_updated(scores: Array, chain_lengths: Array)
signal match_ended(winner_id: int, final_scores: Array)

# Trạng thái từng người chơi: "human", "ai", "off"
var player_configs: Array[String] = ["human", "ai", "ai", "ai"]

var scores: Array[int] = [0, 0, 0, 0]
var chain_lengths: Array[int] = [0, 0, 0, 0]
var total_whips_landed: Array[int] = [0, 0, 0, 0]

var match_timer: float = 90.0
var is_match_running: bool = false

# Màu sắc 4 đội
const TEAM_COLORS = [
	Color(1.0, 0.28, 0.38),  # P1: Đỏ Neon
	Color(0.2, 0.75, 1.0),   # P2: Xanh Neon
	Color(1.0, 0.85, 0.15),  # P3: Vàng Neon
	Color(0.2, 0.9, 0.45)    # P4: Xanh Lá Neon
]

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS

func setup_and_start(configs: Array[String]) -> void:
	player_configs = configs
	scores = [0, 0, 0, 0]
	chain_lengths = [0, 0, 0, 0]
	total_whips_landed = [0, 0, 0, 0]
	match_timer = 90.0
	is_match_running = true
	get_tree().paused = false

func _process(delta: float) -> void:
	if not is_match_running:
		return
		
	match_timer -= delta
	if match_timer <= 0.0:
		match_timer = 0.0
		_finish_match()
		
	match_timer_updated.emit(match_timer)

func bank_mannequins(player_id: int, count: int) -> int:
	if count <= 0: return 0
	# Càng nhiều hình nhân cất cùng lúc càng nhân điểm combo
	var pts = count * 150 + (count * count * 10)
	scores[player_id - 1] += pts
	CongaSoundManager.play_sfx("bank_score", 1.0)
	scores_updated.emit(scores, chain_lengths)
	return pts

func register_whip_hit(attacker_id: int) -> void:
	total_whips_landed[attacker_id - 1] += 1
	scores[attacker_id - 1] += 50
	CongaSoundManager.play_sfx("whip_hit", randf_range(0.9, 1.3))
	scores_updated.emit(scores, chain_lengths)

func update_chain_length(player_id: int, length: int) -> void:
	chain_lengths[player_id - 1] = length
	scores_updated.emit(scores, chain_lengths)

func _finish_match() -> void:
	is_match_running = false
	CongaSoundManager.play_sfx("cheer", 1.0)
	
	# Tìm người chiến thắng
	var max_score = -1
	var winner_id = 1
	for i in range(4):
		if player_configs[i] != "off" and scores[i] > max_score:
			max_score = scores[i]
			winner_id = i + 1
			
	match_ended.emit(winner_id, scores)

func change_scene(scene_path: String) -> void:
	get_tree().change_scene_to_file.call_deferred(scene_path)
