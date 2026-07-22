extends Node

enum GameMode {
	RACE,
	FLOOR_RISING,
	SUMO,
	TAG,
	COPYCAT
}

var current_mode = GameMode.RACE
var players_alive = []
var scores = {}

var tag_timer = 0.0
var tag_it_id = -1

var copycat_sequence = []
var copycat_timer = 0.0

func start_mode(mode: GameMode):
	round_ended = false
	
	# Solo play guard: skip elimination modes if only 1 or 0 players AND no bots
	if players_alive.size() <= 1 and mode != GameMode.RACE and mode != GameMode.COPYCAT:
		print("Solo play: skipping elimination mode, using RACE instead")
		mode = GameMode.RACE
	
	current_mode = mode
	print("Started Mode: ", GameMode.keys()[mode])
	
	if mode == GameMode.TAG and multiplayer.is_server():
		tag_timer = 15.0
		if players_alive.size() > 0:
			tag_it_id = players_alive[randi() % players_alive.size()]
			rpc("update_it", tag_it_id)
			
	if mode == GameMode.COPYCAT and multiplayer.is_server():
		generate_copycat_sequence()

func generate_copycat_sequence():
	var possible_actions = ["A", "D", "W", "S", "SPACE"]
	copycat_sequence.clear()
	for i in range(4):
		copycat_sequence.append(possible_actions[randi() % possible_actions.size()])
	rpc("sync_copycat_sequence", copycat_sequence)

@rpc("any_peer", "call_local")
func sync_copycat_sequence(seq):
	copycat_sequence = seq

func _process(delta):
	if multiplayer.is_server() and current_mode == GameMode.TAG:
		if tag_timer > 0:
			tag_timer -= delta
			if tag_timer <= 0:
				# BOOM explosion
				report_death(tag_it_id)
				if SoundManager:
					SoundManager.play_explosion()
				tag_timer = 15.0 # Next bomb
				if players_alive.size() > 0:
					tag_it_id = players_alive[randi() % players_alive.size()]
					rpc("update_it", tag_it_id)

@rpc("any_peer", "call_local")
func update_it(id):
	tag_it_id = id
	get_tree().call_group("player", "check_it", id)

var last_tag_time = 0.0

@rpc("any_peer", "call_local")
func request_pass_bomb(to_id):
	if multiplayer.is_server():
		if Time.get_ticks_msec() / 1000.0 - last_tag_time > 0.5:
			last_tag_time = Time.get_ticks_msec() / 1000.0
			update_it(to_id)
			rpc("update_it", to_id)

func register_player(id):
	if not scores.has(id):
		scores[id] = 0

func player_died(id):
	if players_alive.has(id):
		players_alive.erase(id)
	
	print("Player ", id, " died.")
	check_win_condition()

@rpc("any_peer", "call_local")
func report_death(id):
	if multiplayer.is_server():
		player_died(id)

func check_win_condition():
	if players_alive.size() == 0:
		end_round(-1)
	elif current_mode == GameMode.SUMO or current_mode == GameMode.FLOOR_RISING or current_mode == GameMode.TAG:
		if players_alive.size() <= 1:
			var winner = players_alive[0] if players_alive.size() == 1 else -1
			end_round(winner)

var maps = [
	{"path": "res://main.tscn", "mode": GameMode.RACE},
	{"path": "res://map_jungle_bounce.tscn", "mode": GameMode.TAG},
	{"path": "res://map_ice_panic.tscn", "mode": GameMode.SUMO},
	{"path": "res://map_wind_tunnel.tscn", "mode": GameMode.RACE},
	{"path": "res://map_conveyor.tscn", "mode": GameMode.COPYCAT},
	{"path": "res://map_gravity_flip.tscn", "mode": GameMode.RACE},
	{"path": "res://map_shrink.tscn", "mode": GameMode.SUMO},
	{"path": "res://map_rising_lava.tscn", "mode": GameMode.FLOOR_RISING},
	{"path": "res://map_gauntlet.tscn", "mode": GameMode.RACE}
]
var current_map_index = 0

var round_ended = false

func end_round(winner_id):
	if round_ended:
		return
	round_ended = true
	
	print("Round Ended! Winner: ", winner_id)
	if winner_id != -1:
		if not scores.has(winner_id):
			scores[winner_id] = 0
		scores[winner_id] += 1
		
	var main_game = get_tree().get_first_node_in_group("main_game")
	if main_game:
		main_game.rpc("show_winner", winner_id)
		
	if SoundManager:
		SoundManager.play_win()
		
	# Cycle to next map after a delay
	await get_tree().create_timer(3.0).timeout
	current_map_index = (current_map_index + 1) % maps.size()
	var next_map = maps[current_map_index]
	
	# Load map via RPC FIRST to populate players_alive
	if main_game:
		main_game.rpc("load_map", next_map.path)
	
	start_mode(next_map.mode)
