extends Node3D
class_name LevelGenerator

@export var track_length: float = 240.0
@export var road_width: float = 9.0

var gate_scene = preload("res://scenes/Gate.tscn")
var obstacle_scene = preload("res://scenes/Obstacle.tscn")
var boss_scene = preload("res://scenes/Boss.tscn")

var boss_instance: Boss = null

func _ready() -> void:
	generate_track()
	spawn_gates_and_traps()
	spawn_boss_arena()

func generate_track() -> void:
	# 1. Mặt đường chạy 3D phát sáng Neon
	var road_mesh = MeshInstance3D.new()
	var plane = BoxMesh.new()
	plane.size = Vector3(road_width, 0.4, track_length)
	road_mesh.mesh = plane
	road_mesh.position = Vector3(0, -0.2, -track_length / 2.0 + 10.0)
	
	var road_mat = StandardMaterial3D.new()
	road_mat.albedo_color = Color(0.1, 0.12, 0.18)
	road_mat.roughness = 0.4
	road_mesh.material_override = road_mat
	add_child(road_mesh)
	
	# 2. Hai dải lan can dạ quang 2 bên (Neon Rails)
	for side in [-1.0, 1.0]:
		var rail = MeshInstance3D.new()
		var rail_mesh = BoxMesh.new()
		rail_mesh.size = Vector3(0.3, 0.6, track_length)
		rail.mesh = rail_mesh
		rail.position = Vector3(side * (road_width / 2.0 + 0.15), 0.2, -track_length / 2.0 + 10.0)
		
		var rail_mat = StandardMaterial3D.new()
		rail_mat.albedo_color = Color(0.0, 0.8, 1.0)
		rail_mat.emission_enabled = true
		rail_mat.emission = Color(0.0, 0.8, 1.0)
		rail_mat.emission_energy_multiplier = 3.0
		rail.material_override = rail_mat
		add_child(rail)

func spawn_gates_and_traps() -> void:
	# Danh sách vị trí các cặp cổng theo trục Z
	var z_positions = [-30.0, -60.0, -95.0, -130.0, -165.0, -195.0]
	
	for i in range(z_positions.size()):
		var z = z_positions[i]
		
		# Tạo cặp cổng Trái / Phải
		var left_gate = gate_scene.instantiate()
		var right_gate = gate_scene.instantiate()
		
		add_child(left_gate)
		add_child(right_gate)
		
		left_gate.position = Vector3(-2.2, 1.0, z)
		right_gate.position = Vector3(2.2, 1.0, z)
		
		# Cấu hình ngẫu nhiên nhưng đảm bảo tính Rage-Bait hấp dẫn
		if i == 0:
			# Màn 1: Cổng thưởng làm quen
			left_gate.gate_type = Gate.GateType.FIRE_RATE_ADD
			left_gate.value = 5.0
			right_gate.gate_type = Gate.GateType.BULLET_COUNT_ADD
			right_gate.value = 1.0
		elif i == 1:
			# Màn 2: Cổng nhân vs Cổng trừ
			left_gate.gate_type = Gate.GateType.FIRE_RATE_MULT
			left_gate.value = 1.5
			right_gate.gate_type = Gate.GateType.FIRE_RATE_SUB
			right_gate.value = -3.0
		elif i == 2:
			# Màn 3: Cổng di chuyển qua lại (Rage Trap)
			left_gate.gate_type = Gate.GateType.BULLET_COUNT_ADD
			left_gate.value = 2.0
			left_gate.is_moving = true
			left_gate.move_speed = 3.0
			
			right_gate.gate_type = Gate.GateType.FIRE_RATE_SUB
			right_gate.value = -5.0
			right_gate.is_moving = true
			right_gate.move_speed = 3.0
		elif i == 3:
			left_gate.gate_type = Gate.GateType.POWER_ADD
			left_gate.value = 15.0
			right_gate.gate_type = Gate.GateType.FIRE_RATE_ADD
			right_gate.value = 8.0
		else:
			left_gate.gate_type = Gate.GateType.BULLET_COUNT_MULT
			left_gate.value = 2.0
			right_gate.gate_type = Gate.GateType.FIRE_RATE_MULT
			right_gate.value = 2.0
		
		left_gate.update_visuals()
		right_gate.update_visuals()
		
		# Sinh chướng ngại vật (Thùng gỗ / Bức tường cản) xen kẽ giữa các cổng
		if i < z_positions.size() - 1:
			var obs_z = z - 15.0
			var obs = obstacle_scene.instantiate()
			add_child(obs)
			obs.position = Vector3(randf_range(-2.5, 2.5), 0.6, obs_z)
			obs.max_hp = 15.0 + (i * 10.0)
			obs.current_hp = obs.max_hp
			obs.update_label()

func spawn_boss_arena() -> void:
	# Sinh Boss ở cuối đường chạy
	var boss_z = -track_length + 15.0
	boss_instance = boss_scene.instantiate()
	add_child(boss_instance)
	boss_instance.position = Vector3(0, 2.2, boss_z)
	
	# Vùng kích hoạt trận đấu Boss
	var trigger_area = Area3D.new()
	var col = CollisionShape3D.new()
	var box = BoxShape3D.new()
	box.size = Vector3(road_width, 5.0, 4.0)
	col.shape = box
	trigger_area.add_child(col)
	trigger_area.position = Vector3(0, 2.0, boss_z + 18.0)
	
	add_child(trigger_area)
	trigger_area.body_entered.connect(func(body):
		if body is Player and is_instance_valid(boss_instance):
			body.reach_boss_arena(boss_instance)
	)
