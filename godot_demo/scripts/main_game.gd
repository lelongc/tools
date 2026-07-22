extends Node

const PORT = 8080
var peer = ENetMultiplayerPeer.new()

@onready var lobby_ui = $LobbyUI
@onready var address_input = $LobbyUI/MainDashboard/RoomCard/VBox/AddressInput
@onready var players_node = $Players
@onready var level_container = $Level
@onready var hud = $HUD
@onready var score_label = $HUD/ScoreLabel
@onready var round_end_ui = $RoundEndUI
@onready var winner_label = $RoundEndUI/WinnerLabel
@onready var shuffle_timer_label = $HUD/ShuffleTimerLabel
@onready var copycat_label = $HUD/CopycatLabel
@onready var key_guide_label = $HUD/KeyGuidePanel/KeyGuideLabel

# Stitch Design System Color Palette & Character Selection
var selected_color: Color = Color(0, 0.95, 1) # Neon Cyan #00f3ff
var selected_variant: int = 0 # 0: Bear, 1: Frog, 2: Bunny, 3: Cat

func _ready():
	add_to_group("main_game")
	
	# Room Buttons
	var room_vbox = $LobbyUI/MainDashboard/RoomCard/VBox
	room_vbox.get_node("HostBtn").pressed.connect(_on_host_pressed)
	room_vbox.get_node("HostBotsBtn").pressed.connect(_on_host_bots_pressed)
	room_vbox.get_node("JoinBtn").pressed.connect(_on_join_pressed)
	
	# Mute Button in Footer
	var mute_btn = $LobbyUI/BottomFooterBar/HBoxFooter/MuteBtn
	if mute_btn:
		mute_btn.pressed.connect(_on_mute_pressed)
		
	# Character Variant Buttons Setup
	var variant_box = $LobbyUI/MainDashboard/PilotCard/VBox/VariantBox
	var cute_badge = $LobbyUI/MainDashboard/PilotCard/VBox/CuteBadge
	if variant_box:
		variant_box.get_node("BearBtn").pressed.connect(func(): selected_variant = 0; if cute_badge: cute_badge.text = "SELECTED: 🌸 Pinky Bear"; if SoundManager: SoundManager.play_click())
		variant_box.get_node("FrogBtn").pressed.connect(func(): selected_variant = 1; if cute_badge: cute_badge.text = "SELECTED: 🐸 Froggo"; if SoundManager: SoundManager.play_click())
		variant_box.get_node("BunnyBtn").pressed.connect(func(): selected_variant = 2; if cute_badge: cute_badge.text = "SELECTED: 🐰 Bunny"; if SoundManager: SoundManager.play_click())
		variant_box.get_node("CatBtn").pressed.connect(func(): selected_variant = 3; if cute_badge: cute_badge.text = "SELECTED: 🐱 Neko Cat"; if SoundManager: SoundManager.play_click())
		
	# Color Picker setup matching Cute Blob Colors
	var color_box = $LobbyUI/MainDashboard/PilotCard/VBox/ColorBox
	if color_box:
		color_box.get_node("CyanBtn").pressed.connect(func(): selected_color = Color(0, 0.95, 1); if SoundManager: SoundManager.play_click())
		color_box.get_node("MagentaBtn").pressed.connect(func(): selected_color = Color(1, 0, 1); if SoundManager: SoundManager.play_click())
		color_box.get_node("YellowBtn").pressed.connect(func(): selected_color = Color(1, 0.92, 0); if SoundManager: SoundManager.play_click())
		color_box.get_node("GreenBtn").pressed.connect(func(): selected_color = Color(0, 1, 0.4); if SoundManager: SoundManager.play_click())
		color_box.get_node("OrangeBtn").pressed.connect(func(): selected_color = Color(1, 0.45, 0); if SoundManager: SoundManager.play_click())
		
	address_input.text = "127.0.0.1"
	hud.hide()
	round_end_ui.hide()
	apply_neon_theme()

func _on_mute_pressed():
	if SoundManager:
		var muted = SoundManager.toggle_mute()
		$LobbyUI/BottomFooterBar/HBoxFooter/MuteBtn.text = "🔇 SOUND: OFF" if muted else "🔊 SOUND: ON"

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
	lobby_ui.hide()
	hud.show()
	GameManager.start_next_round()

func _on_host_bots_pressed():
	if SoundManager: SoundManager.play_click()
	peer.create_server(PORT)
	multiplayer.multiplayer_peer = peer
	_add_player(1)
	for i in range(3):
		_add_bot(100 + i)
	lobby_ui.hide()
	hud.show()
	GameManager.start_next_round()

func _on_join_pressed():
	if SoundManager: SoundManager.play_click()
	peer.create_client(address_input.text, PORT)
	multiplayer.multiplayer_peer = peer
	lobby_ui.hide()
	hud.show()

func _on_peer_connected(id):
	_add_player(id)

func _add_player(id):
	GameManager.register_player(id)
	var player = preload("res://scenes/player.tscn").instantiate()
	player.name = str(id)
	player.custom_color = selected_color
	player.character_variant = selected_variant
	player.position = Vector3(randf_range(-2, 2), 2, randf_range(-2, 2))
	players_node.add_child(player, true)

func _add_bot(id):
	GameManager.register_player(id)
	var bot = preload("res://scenes/player.tscn").instantiate()
	bot.name = str(id)
	bot.is_bot = true
	bot.character_variant = (id - 100) % 4
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
		child.is_dead = false
		child.gravity_direction = Vector3.DOWN
		child.show()

@rpc("any_peer", "call_local")
func show_winner(winner_id: int):
	show_round_end(winner_id)

func show_round_end(winner_id: int):
	round_end_ui.show()
	if winner_id > 0:
		winner_label.text = "Player %d Won!" % winner_id
	else:
		winner_label.text = "Draw Game!"

func apply_neon_theme():
	pass
