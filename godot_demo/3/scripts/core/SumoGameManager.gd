extends Node

## SumoGameManager.gd
## Điều phối Đấu Trường Sumo Ragdoll: Tính mạng, đếm số lần hất văng võ đài (Ring Out), rung lắc màn hình

enum GameMode {
	SOLO_SURVIVAL,
	PARTY_SUMO
}

signal lives_updated(lives: Array, ring_outs: Array)
signal timer_updated(time_left: float)
signal round_ended(winner_id: int, summary: Dictionary)
signal screen_shake_requested(intensity: float, duration: float)
signal wave_advanced(wave: int)

var current_mode: GameMode = GameMode.PARTY_SUMO
var player_configs: Array[String] = ["human", "ai", "ai", "ai"]

const TEAM_COLORS = [
	Color(1.0, 0.28, 0.38),  # P1: Đỏ Neon
	Color(0.2, 0.75, 1.0),   # P2: Xanh Cyan Neon
	Color(1.0, 0.88, 0.15),  # P3: Vàng Neon
	Color(0.25, 0.95, 0.45)  # P4: Xanh Lá Neon
]

const TEAM_NAMES = ["ĐỘI ĐỎ", "ĐỘI XANH", "ĐỘI VÀNG", "ĐỘI LÁ"]

var lives: Array[int] = [3, 3, 3, 3]
var ring_outs: Array[int] = [0, 0, 0, 0]
var knockdowns: Array[int] = [0, 0, 0, 0]

var match_timer: float = 90.0
var is_match_running: bool = false
var solo_wave: int = 1

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS

func start_party_mode(configs: Array[String]) -> void:
	current_mode = GameMode.PARTY_SUMO
	player_configs = configs
	lives = [3, 3, 3, 3]
	ring_outs = [0, 0, 0, 0]
	knockdowns = [0, 0, 0, 0]
	match_timer = 90.0
	is_match_running = true
	get_tree().paused = false
	lives_updated.emit(lives, ring_outs)

func start_solo_mode() -> void:
	current_mode = GameMode.SOLO_SURVIVAL
	player_configs = ["human", "ai", "ai", "ai"]
	lives = [3, 1, 1, 1]
	ring_outs = [0, 0, 0, 0]
	knockdowns = [0, 0, 0, 0]
	solo_wave = 1
	match_timer = 120.0
	is_match_running = true
	get_tree().paused = false
	lives_updated.emit(lives, ring_outs)

func _process(delta: float) -> void:
	if not is_match_running:
		return
		
	match_timer -= delta
	if match_timer <= 0.0:
		match_timer = 0.0
		_evaluate_round_over()
		
	timer_updated.emit(match_timer)

func register_knockdown(attacker_id: int) -> void:
	if attacker_id > 0 and attacker_id <= 4:
		knockdowns[attacker_id - 1] += 1
	screen_shake_requested.emit(0.3, 0.2)

func register_ring_out(victim_id: int, attacker_id: int) -> void:
	if victim_id < 1 or victim_id > 4:
		return
		
	SumoSoundManager.play_sfx("ring_out", 1.1)
	screen_shake_requested.emit(0.6, 0.35)
	
	lives[victim_id - 1] = maxi(0, lives[victim_id - 1] - 1)
	
	if attacker_id > 0 and attacker_id <= 4 and attacker_id != victim_id:
		ring_outs[attacker_id - 1] += 1
		
	lives_updated.emit(lives, ring_outs)
	_check_eliminations()

func _check_eliminations() -> void:
	if current_mode == GameMode.SOLO_SURVIVAL:
		if lives[0] <= 0:
			_evaluate_round_over()
		else:
			# Kiểm tra xem cả 3 bot có chết hết chưa
			var bots_alive = 0
			for i in range(1, 4):
				if lives[i] > 0: bots_alive += 1
			if bots_alive == 0:
				solo_wave += 1
				lives[1] = 1; lives[2] = 1; lives[3] = 1
				SumoSoundManager.play_sfx("cheer", 1.2)
				lives_updated.emit(lives, ring_outs)
				wave_advanced.emit(solo_wave)
	else:
		var alive_count = 0
		var last_alive = 1
		for i in range(4):
			if player_configs[i] != "off" and lives[i] > 0:
				alive_count += 1
				last_alive = i + 1
				
		if alive_count <= 1:
			_evaluate_round_over()

func _evaluate_round_over() -> void:
	is_match_running = false
	SumoSoundManager.play_sfx("cheer", 1.0)
	
	var winner_id = 1
	var max_score = -1
	for i in range(4):
		if player_configs[i] != "off":
			var score = ring_outs[i] * 200 + knockdowns[i] * 50 + lives[i] * 100
			if score > max_score:
				max_score = score
				winner_id = i + 1
				
	var summary = {
		"winner_id": winner_id,
		"lives": lives,
		"ring_outs": ring_outs,
		"knockdowns": knockdowns,
		"wave": solo_wave
	}
	round_ended.emit(winner_id, summary)

func change_scene(path: String) -> void:
	get_tree().change_scene_to_file.call_deferred(path)
