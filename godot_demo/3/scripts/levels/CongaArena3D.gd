extends Node3D
class_name CongaArena3D

## CongaArena3D.gd
## Đấu trường tiệc tùng 3D: Quản lý khởi tạo 4 người chơi, sinh hình nhân liên tục và tương tác vật lý

@onready var players_node: Node3D = $Players
@onready var mannequins_node: Node3D = $Mannequins

const MannequinScript = preload("res://scripts/entities/CongaMannequin3D.gd")

var spawn_timer: float = 0.0
const MIN_FREE_MANNEQUINS = 12
const MAX_FREE_MANNEQUINS = 24

func _ready() -> void:
	_configure_players()
	_spawn_initial_mannequins()

func _configure_players() -> void:
	for i in range(4):
		var p_node = players_node.get_node_or_null("Player%d" % (i + 1))
		if p_node and p_node.is_in_group("players"):
			var cfg = CongaGameManager3D.player_configs[i]
			if cfg == "off":
				p_node.visible = false
				p_node.set_physics_process(false)
				p_node.set_process(false)
				p_node.remove_from_group("players")
				var col = p_node.get_node_or_null("CollisionShape3D")
				if col:
					col.disabled = true
			elif cfg == "ai":
				p_node.is_ai = true
				p_node.visible = true
				p_node.set_physics_process(true)
			else:
				p_node.is_ai = false
				p_node.visible = true
				p_node.set_physics_process(true)

func _spawn_initial_mannequins() -> void:
	for i in range(16):
		_spawn_one_mannequin()

func _spawn_one_mannequin() -> void:
	var m = MannequinScript.new()
	var rx = randf_range(-13.0, 13.0)
	var rz = randf_range(-13.0, 13.0)
	
	# Tránh khu vực đài trung tâm
	if Vector2(rx, rz).length() < 3.5:
		rx += 5.0 * (1.0 if rx >= 0 else -1.0)
		rz += 5.0 * (1.0 if rz >= 0 else -1.0)
		
	m.position = Vector3(rx, 1.2, rz)
	mannequins_node.add_child(m)

func _process(delta: float) -> void:
	spawn_timer += delta
	if spawn_timer >= 2.5:
		spawn_timer = 0.0
		
		var free_count = 0
		for child in mannequins_node.get_children():
			if child.is_in_group("mannequins") and ("state" in child) and child.state == 0:
				free_count += 1
				
		if free_count < MIN_FREE_MANNEQUINS:
			var needed = MIN_FREE_MANNEQUINS - free_count
			for j in range(mini(needed, 4)):
				_spawn_one_mannequin()
