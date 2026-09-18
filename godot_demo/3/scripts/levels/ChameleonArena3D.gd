extends Node3D

## ChameleonArena3D.gd
## Đấu trường 3D Tắc Kè: Điều phối sinh hình nhân theo đợt sóng (Solo) hoặc liên tục (Party), sinh bọ năng lượng

@onready var players_node: Node3D = $Players
@onready var mannequins_node: Node3D = $Mannequins
@onready var bugs_node: Node3D = $PowerBugs

const MannequinScript = preload("res://scripts/entities/ChameleonMannequin3D.gd")
const BugScript = preload("res://scripts/entities/PowerBug3D.gd")

var bug_spawn_timer: float = 0.0
var wave_spawn_timer: float = 0.0

func _ready() -> void:
	_configure_players()
	_spawn_initial_mannequins()
	ChameleonGameManager.wave_started.connect(_on_wave_started)

func _configure_players() -> void:
	if ChameleonGameManager.current_mode == 0: # SOLO_ROGUELITE
		for i in range(4):
			var p = players_node.get_node_or_null("Player%d" % (i + 1))
			if p:
				if i == 0:
					p.visible = true
					p.is_ai = false
					p.set_physics_process(true)
				else:
					p.visible = false
					p.set_physics_process(false)
					p.remove_from_group("chameleons")
	else:
		for i in range(4):
			var p = players_node.get_node_or_null("Player%d" % (i + 1))
			if p:
				var cfg = ChameleonGameManager.player_configs[i]
				if cfg == "off":
					p.visible = false
					p.set_physics_process(false)
					p.remove_from_group("chameleons")
				elif cfg == "ai":
					p.visible = true
					p.is_ai = true
					p.set_physics_process(true)
				else:
					p.visible = true
					p.is_ai = false
					p.set_physics_process(true)

func _spawn_initial_mannequins() -> void:
	var count = 18 if ChameleonGameManager.current_mode == 0 else 24
	for i in range(count):
		_spawn_one_mannequin()
	_spawn_one_bug()

func _spawn_one_mannequin() -> void:
	var m = MannequinScript.new()
	var rx = randf_range(-14.0, 14.0)
	var rz = randf_range(-14.0, 14.0)
	m.position = Vector3(rx, 1.2, rz)
	mannequins_node.add_child(m)

func _spawn_one_bug() -> void:
	var b = BugScript.new()
	var rx = randf_range(-12.0, 12.0)
	var rz = randf_range(-12.0, 12.0)
	b.position = Vector3(rx, 1.5, rz)
	bugs_node.add_child(b)

func _on_wave_started(wave_idx: int) -> void:
	# Sinh thêm một đàn hình nhân mới cho đợt quái
	var new_count = 8 + wave_idx * 3
	for i in range(new_count):
		_spawn_one_mannequin()
	_spawn_one_bug()

func _process(delta: float) -> void:
	# Quản lý sinh bọ năng lượng
	bug_spawn_timer += delta
	if bug_spawn_timer >= 12.0:
		bug_spawn_timer = 0.0
		if bugs_node.get_child_count() < 3:
			_spawn_one_bug()
			
	# Quản lý lượng hình nhân trong sàn đấu
	wave_spawn_timer += delta
	if wave_spawn_timer >= 3.0:
		wave_spawn_timer = 0.0
		var free_count = 0
		for child in mannequins_node.get_children():
			if ("state" in child) and child.state == 0:
				free_count += 1
		if free_count < 12:
			for k in range(min(4, 12 - free_count)):
				_spawn_one_mannequin()
