extends Node

const PORT = 8080
var peer = ENetMultiplayerPeer.new()

@onready var lobby_ui = $LobbyUI
@onready var address_input = $LobbyUI/VBoxContainer/AddressInput
@onready var players_node = $Players
@onready var level_container = $Level
@onready var hud = $HUD
@onready var score_label = $HUD/ScoreLabel
@onready var round_end_ui = $RoundEndUI
@onready var winner_label = $RoundEndUI/WinnerLabel
@onready var shuffle_timer_label = $HUD/ShuffleTimerLabel
@onready var copycat_label = $HUD/CopycatLabel
@onready var key_guide_label = $HUD/KeyGuidePanel/KeyGuideLabel

func _ready():
	add_to_group("main_game")
	$LobbyUI/VBoxContainer/HostBtn.pressed.connect(_on_host_pressed)
	if $LobbyUI/VBoxContainer.has_node("HostBotsBtn"):
		$LobbyUI/VBoxContainer/HostBotsBtn.pressed.connect(_on_host_bots_pressed)
	$LobbyUI/VBoxContainer/JoinBtn.pressed.connect(_on_join_pressed)
	address_input.text = "127.0.0.1"
	hud.hide()
	round_end_ui.hide()
	apply_neon_theme()

func _process(_delta):
	if hud.visible:
		# Show current mode + scores
		var mode_name = GameManager.GameMode.keys()[GameManager.current_mode]
		var score_text = "MODE: " + mode_name + "\n"
		for id in GameManager.scores:
			score_text += "P" + str(id) + ": " + str(GameManager.scores[id]) + "\n"
		# Show TAG bomb timer if applicable
		if GameManager.current_mode == GameManager.GameMode.TAG and GameManager.tag_timer > 0:
			score_text += "BOMB: %.1fs\n" % GameManager.tag_timer
		score_label.text = score_text
		
		# Show COPYCAT sequence if applicable
		if GameManager.current_mode == GameManager.GameMode.COPYCAT:
			copycat_label.visible = true
			copycat_label.text = "SEQUENCE: " + " ➔ ".join(GameManager.copycat_sequence)
		else:
			copycat_label.visible = false
		
		# Find local player and display shuffle countdown + key guide
		var local_player = players_node.get_node_or_null(str(multiplayer.get_unique_id()))
		if local_player and "shuffle_timer" in local_player and not local_player.is_dead:
			var time_left = clamp(local_player.SHUFFLE_INTERVAL - local_player.shuffle_timer, 0, local_player.SHUFFLE_INTERVAL)
			shuffle_timer_label.text = "SHUFFLE IN: %.1fs" % time_left
			
			# Format Key Guide Label
			var am = local_player.action_map
			var format_action = func(act_name):
				match act_name:
					"move_left": return "LEFT"
					"move_right": return "RIGHT"
					"move_forward": return "FORWARD"
					"move_backward": return "BACKWARD"
					"jump": return "JUMP"
					_: return act_name.to_upper()
			
			key_guide_label.text = "[A]➔%s | [D]➔%s | [W]➔%s | [S]➔%s | [SPACE]➔%s" % [
				format_action.call(am["move_left"]),
				format_action.call(am["move_right"]),
				format_action.call(am["move_forward"]),
				format_action.call(am["move_backward"]),
				format_action.call(am["jump"])
			]
		else:
			shuffle_timer_label.text = ""

func _on_host_pressed():
	if SoundManager: SoundManager.play_click()
	peer.create_server(PORT)
	multiplayer.multiplayer_peer = peer
	multiplayer.peer_connected.connect(_on_peer_connected)
	
	_add_player(1)
	start_game()

func _on_host_bots_pressed():
	if SoundManager: SoundManager.play_click()
	peer.create_server(PORT)
	multiplayer.multiplayer_peer = peer
	multiplayer.peer_connected.connect(_on_peer_connected)
	
	_add_player(1)
	_add_bot(2)
	_add_bot(3)
	start_game()

func _on_join_pressed():
	if SoundManager: SoundManager.play_click()
	peer.create_client(address_input.text, PORT)
	multiplayer.multiplayer_peer = peer
	start_game()

func start_game():
	address_input.release_focus()
	lobby_ui.hide()
	hud.show()
	round_end_ui.hide()
	if multiplayer.is_server():
		var first_map = GameManager.maps[0]
		rpc("load_map", first_map.path)
		GameManager.start_mode(first_map.mode)

func _on_peer_connected(id):
	_add_player(id)

func _add_player(id):
	GameManager.register_player(id)
	var player = preload("res://player.tscn").instantiate()
	player.name = str(id)
	player.position = Vector3(randf_range(-2, 2), 2, randf_range(-2, 2))
	players_node.add_child(player, true)

func _add_bot(id):
	GameManager.register_player(id)
	var bot = preload("res://player.tscn").instantiate()
	bot.name = str(id)
	bot.is_bot = true
	bot.position = Vector3(randf_range(-2, 2), 2, randf_range(-2, 2))
	players_node.add_child(bot, true)

@rpc("any_peer", "call_local")
func load_map(map_path):
	round_end_ui.hide()
	for child in level_container.get_children():
		child.queue_free()
	
	var level = load(map_path).instantiate()
	level_container.add_child(level)
	
	# reset players
	for child in players_node.get_children():
		child.position = Vector3(randf_range(-2, 2), 2, randf_range(-2, 2))
		child.velocity = Vector3.ZERO
		if "knockback_velocity" in child:
			child.knockback_velocity = Vector3.ZERO
		if "is_dead" in child:
			child.is_dead = false
			child.show()
			child.get_node("CollisionShape3D").set_deferred("disabled", false)
		if "shuffle_timer" in child:
			child.shuffle_timer = 0.0
		if "action_map" in child:
			child.action_map = {
				"move_left": "move_left",
				"move_right": "move_right",
				"move_forward": "move_forward",
				"move_backward": "move_backward",
				"jump": "jump"
			}
		if child.has_method("check_it"):
			child.check_it(-1)
	
	# Populate players_alive on server side
	if multiplayer.is_server():
		GameManager.players_alive.clear()
		for child in players_node.get_children():
			GameManager.players_alive.append(child.name.to_int())

@rpc("any_peer", "call_local")
func show_winner(winner_id):
	round_end_ui.show()
	if winner_id == -1:
		winner_label.text = "DRAW!"
	else:
		winner_label.text = "PLAYER " + str(winner_id) + " WINS!"
		
	if multiplayer.is_server():
		GameManager.players_alive.clear()
		for child in players_node.get_children():
			GameManager.players_alive.append(child.name.to_int())

func apply_neon_theme():
	var theme = Theme.new()
	
	# Button Style
	var btn_normal = StyleBoxFlat.new()
	btn_normal.bg_color = Color(0.02, 0.02, 0.05, 0.7)
	btn_normal.border_width_left = 2
	btn_normal.border_width_top = 2
	btn_normal.border_width_right = 2
	btn_normal.border_width_bottom = 2
	btn_normal.border_color = Color(0, 1, 1, 1) # Neon Cyan
	btn_normal.corner_radius_top_left = 8
	btn_normal.corner_radius_top_right = 8
	btn_normal.corner_radius_bottom_left = 8
	btn_normal.corner_radius_bottom_right = 8
	btn_normal.shadow_color = Color(0, 1, 1, 0.3)
	btn_normal.shadow_size = 6
	
	var btn_hover = btn_normal.duplicate()
	btn_hover.bg_color = Color(0.05, 0.05, 0.15, 0.8)
	btn_hover.border_color = Color(1, 0, 1, 1) # Neon Magenta
	btn_hover.shadow_color = Color(1, 0, 1, 0.5)
	btn_hover.shadow_size = 10
	
	var btn_pressed = btn_normal.duplicate()
	btn_pressed.bg_color = Color(0.01, 0.01, 0.03, 0.9)
	btn_pressed.border_color = Color(1, 1, 0, 1) # Neon Yellow
	btn_pressed.shadow_color = Color(1, 1, 0, 0.4)
	btn_pressed.shadow_size = 2
	
	theme.set_stylebox("normal", "Button", btn_normal)
	theme.set_stylebox("hover", "Button", btn_hover)
	theme.set_stylebox("pressed", "Button", btn_pressed)
	theme.set_stylebox("disabled", "Button", btn_normal)
	theme.set_stylebox("focus", "Button", StyleBoxEmpty.new())
	
	theme.set_color("font_color", "Button", Color(1, 1, 1))
	theme.set_color("font_hover_color", "Button", Color(1, 0.7, 1))
	theme.set_font_size("font_size", "Button", 16)
	
	# LineEdit (IP Input)
	var le_normal = StyleBoxFlat.new()
	le_normal.bg_color = Color(0.01, 0.01, 0.03, 0.8)
	le_normal.border_width_left = 2
	le_normal.border_width_top = 2
	le_normal.border_width_right = 2
	le_normal.border_width_bottom = 2
	le_normal.border_color = Color(0.2, 0.2, 0.4, 1)
	le_normal.corner_radius_top_left = 6
	le_normal.corner_radius_top_right = 6
	le_normal.corner_radius_bottom_left = 6
	le_normal.corner_radius_bottom_right = 6
	
	var le_focus = le_normal.duplicate()
	le_focus.border_color = Color(0, 1, 1, 1) # Neon Cyan on focus
	le_focus.shadow_color = Color(0, 1, 1, 0.3)
	le_focus.shadow_size = 4
	
	theme.set_stylebox("normal", "LineEdit", le_normal)
	theme.set_stylebox("focus", "LineEdit", le_focus)
	theme.set_color("font_color", "LineEdit", Color(1, 1, 1))
	theme.set_font_size("font_size", "LineEdit", 14)
	
	# Panel (Key Guide Panel)
	var pnl_style = StyleBoxFlat.new()
	pnl_style.bg_color = Color(0.01, 0.01, 0.05, 0.85)
	pnl_style.border_width_left = 2
	pnl_style.border_width_top = 2
	pnl_style.border_width_right = 2
	pnl_style.border_width_bottom = 2
	pnl_style.border_color = Color(0, 1, 1, 0.8)
	pnl_style.corner_radius_top_left = 8
	pnl_style.corner_radius_top_right = 8
	pnl_style.corner_radius_bottom_left = 8
	pnl_style.corner_radius_bottom_right = 8
	pnl_style.shadow_color = Color(0, 1, 1, 0.2)
	pnl_style.shadow_size = 4
	theme.set_stylebox("panel", "Panel", pnl_style)
	
	# Apply to components
	lobby_ui.theme = theme
	hud.theme = theme
	round_end_ui.theme = theme
