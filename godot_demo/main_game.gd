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

func _ready():
	add_to_group("main_game")
	$LobbyUI/VBoxContainer/HostBtn.pressed.connect(_on_host_pressed)
	$LobbyUI/VBoxContainer/JoinBtn.pressed.connect(_on_join_pressed)
	address_input.text = "127.0.0.1"
	hud.hide()
	round_end_ui.hide()

func _process(_delta):
	if hud.visible:
		var score_text = "SCORES:\n"
		for id in GameManager.scores:
			score_text += "P" + str(id) + ": " + str(GameManager.scores[id]) + "\n"
		score_label.text = score_text

func _on_host_pressed():
	peer.create_server(PORT)
	multiplayer.multiplayer_peer = peer
	multiplayer.peer_connected.connect(_on_peer_connected)
	
	_add_player(1)
	start_game()

func _on_join_pressed():
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
		if child.has_method("check_it"):
			child.check_it(-1)

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

