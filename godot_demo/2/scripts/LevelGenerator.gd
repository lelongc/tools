extends Node3D

@export var track_length: float = 280.0
@export var road_width: float = 8.5

var high_obs_scene: PackedScene = preload("res://scenes/HighObstacle.tscn")
var low_obs_scene: PackedScene = preload("res://scenes/LowObstacle.tscn")
var saw_obs_scene: PackedScene = preload("res://scenes/SawObstacle.tscn")
var rock_obs_scene: PackedScene = preload("res://scenes/BlockadeObstacle.tscn")
var axe_obs_scene: PackedScene = preload("res://scenes/PendulumAxe.tscn")
var collectable_scene: PackedScene = preload("res://scenes/Collectable.tscn")
var gate_scene: PackedScene = preload("res://scenes/NeckGate.tscn")
var tower_scene: PackedScene = preload("res://scenes/FinishTower.tscn")
var tunnel_scene: PackedScene = preload("res://scenes/TunnelObstacle.tscn")
var wave_scene: PackedScene = preload("res://scenes/WaveGate.tscn")

func _ready() -> void:
	generate_track_and_environment()
	spawn_stage_elements(SaveSystem.current_level)
	spawn_finish_tower()

func generate_track_and_environment() -> void:
	# 1. Mặt đường đua chính
	var road = MeshInstance3D.new()
	var box = BoxMesh.new()
	box.size = Vector3(road_width, 0.4, track_length)
	road.mesh = box
	road.position = Vector3(0, -0.2, -track_length / 2.0 + 10.0)
	
	var road_mat = StandardMaterial3D.new()
	var abs_path = ProjectSettings.globalize_path("res://textures/road_texture.png")
	if FileAccess.file_exists(abs_path):
		var img = Image.load_from_file(abs_path)
		if img:
			var tex = ImageTexture.create_from_image(img)
			road_mat.albedo_texture = tex
			road_mat.uv1_scale = Vector3(1.0, track_length / 8.0, 1.0)
	else:
		road_mat.albedo_color = Color(0.14, 0.16, 0.24)
		
	road_mat.roughness = 0.3
	road.material_override = road_mat
	add_child(road)
	
	# 2. Hai dải lan can phát sáng Neon
	for side in [-1.0, 1.0]:
		var rail = MeshInstance3D.new()
		var r_mesh = BoxMesh.new()
		r_mesh.size = Vector3(0.35, 0.6, track_length)
		rail.mesh = r_mesh
		rail.position = Vector3(side * (road_width / 2.0 + 0.18), 0.2, -track_length / 2.0 + 10.0)
		
		var rail_mat = StandardMaterial3D.new()
		rail_mat.albedo_color = Color(1.0, 0.75, 0.1)
		rail_mat.emission_enabled = true
		rail_mat.emission = Color(1.0, 0.7, 0.0)
		rail_mat.emission_energy_multiplier = 3.0
		rail.material_override = rail_mat
		add_child(rail)
		
	# 3. Cây trang trí 2 bên đường (Cute Cartoon World Props)
	var tree_scene: PackedScene = null
	if ResourceLoader.exists("res://models/cute_fluffy_tree.glb"):
		tree_scene = load("res://models/cute_fluffy_tree.glb")
		
	var prop_mat = StandardMaterial3D.new()
	prop_mat.albedo_color = Color(0.25, 0.9, 0.45)
	prop_mat.roughness = 0.3
	
	var trunk_mat = StandardMaterial3D.new()
	trunk_mat.albedo_color = Color(0.55, 0.32, 0.15)
	
	for z in range(15, int(track_length - 20), 14):
		for side in [-1.0, 1.0]:
			var tree_root = Node3D.new()
			tree_root.position = Vector3(side * (road_width / 2.0 + 3.2), 0, -z)
			
			if tree_scene:
				var tree_inst = tree_scene.instantiate()
				tree_inst.scale = Vector3(1.1, 1.1, 1.1)
				tree_root.add_child(tree_inst)
			else:
				var trunk = MeshInstance3D.new()
				var t_mesh = CylinderMesh.new()
				t_mesh.top_radius = 0.2
				t_mesh.bottom_radius = 0.3
				t_mesh.height = 3.5
				t_mesh.material = trunk_mat
				trunk.mesh = t_mesh
				trunk.position.y = 1.75
				tree_root.add_child(trunk)
				
				var foliage = MeshInstance3D.new()
				var f_mesh = SphereMesh.new()
				f_mesh.radius = 1.2
				f_mesh.height = 2.4
				f_mesh.material = prop_mat
				foliage.mesh = f_mesh
				foliage.position.y = 3.8
				tree_root.add_child(foliage)
				
			add_child(tree_root)

func spawn_stage_elements(lvl: int) -> void:
	# ========================================================================
	# Level Design dựa trên Progressive Difficulty:
	# - Level 1: Tutorial — High/Low đơn lẻ, khoảng cách xa, nhiều quả
	# - Level 2: Combo obstacles + WaveGate đầu tiên
	# - Level 3: TunnelObstacle + High/Low gần nhau tạo khe hẹp
	# - Level 4+: Tất cả mix lẫn, khe hẹp, tốc độ khó
	# ========================================================================
	
	var high_data = []   # [{z, bar_height}]
	var low_data = []    # [{z, spike_height}]
	var saw_z = []
	var rock_data = []
	var axe_z = []
	var gate_data = []
	var tunnel_data = [] # [{z, ceiling, floor}]
	var wave_data = []   # [{z, amplitude, center, speed, gap}]
	
	if lvl == 1:
		# === LEVEL 1: TUTORIAL — Học cơ bản, dễ ===
		# Chỉ high/low riêng lẻ, khoảng cách xa, label chỉ dẫn rõ ràng
		high_data = [
			{"z": -55.0, "bar_height": 4.0},   # Rất dễ, chỉ cần thả tay
			{"z": -150.0, "bar_height": 3.5},
		]
		low_data = [
			{"z": -90.0, "spike_height": 1.5},  # Rất dễ, chỉ cần giữ tay
			{"z": -200.0, "spike_height": 1.8},
		]
		gate_data = [
			{"z": -35.0, "l_type": 0, "l_val": 2.0, "r_type": 2, "r_val": -1.0, "moving": false},
			{"z": -120.0, "l_type": 0, "l_val": 2.5, "r_type": 2, "r_val": -1.5, "moving": false},
			{"z": -175.0, "l_type": 0, "l_val": 3.0, "r_type": 2, "r_val": -2.0, "moving": false},
		]
		
	elif lvl == 2:
		# === LEVEL 2: COMBO — High+Low gần nhau + WaveGate đầu tiên ===
		high_data = [
			{"z": -45.0, "bar_height": 3.8},
			{"z": -140.0, "bar_height": 3.2},
		]
		low_data = [
			{"z": -55.0, "spike_height": 1.8},   # Gần high! Phải chuyển cổ nhanh
			{"z": -150.0, "spike_height": 2.0},   # Gần high! Khe hở: 2.0–3.2
		]
		saw_z = [-100.0, -190.0]
		wave_data = [
			{"z": -75.0, "amplitude": 1.5, "center": 2.5, "speed": 1.5, "gap": 2.5},  # Dễ (gap rộng)
			{"z": -170.0, "amplitude": 2.0, "center": 3.0, "speed": 1.8, "gap": 2.2},
		]
		gate_data = [
			{"z": -30.0, "l_type": 0, "l_val": 2.5, "r_type": 2, "r_val": -1.5, "moving": false},
			{"z": -115.0, "l_type": 0, "l_val": 3.0, "r_type": 1, "r_val": 1.5, "moving": true},
			{"z": -210.0, "l_type": 0, "l_val": 4.0, "r_type": 2, "r_val": -3.0, "moving": false},
		]
		
	elif lvl == 3:
		# === LEVEL 3: PRECISION — Tunnel đầu tiên + khe hẹp ===
		high_data = [
			{"z": -40.0, "bar_height": 3.5},
			{"z": -170.0, "bar_height": 3.0},
		]
		low_data = [
			{"z": -48.0, "spike_height": 2.0},   # Khe hở chỉ 1.5m!
			{"z": -178.0, "spike_height": 2.2},   # Khe hở chỉ 0.8m!
		]
		saw_z = [-95.0]
		rock_data = [{"x": -2.0, "z": -130.0}, {"x": 2.0, "z": -200.0}]
		tunnel_data = [
			{"z": -60.0, "ceiling": 4.0, "floor": 2.0},  # Khe 2.0m (dễ-TB)
		]
		wave_data = [
			{"z": -115.0, "amplitude": 2.0, "center": 3.0, "speed": 2.0, "gap": 2.0},
			{"z": -220.0, "amplitude": 2.5, "center": 3.5, "speed": 2.5, "gap": 1.8},
		]
		gate_data = [
			{"z": -30.0, "l_type": 0, "l_val": 3.0, "r_type": 2, "r_val": -2.0, "moving": false},
			{"z": -150.0, "l_type": 1, "l_val": 1.5, "r_type": 0, "r_val": 3.5, "moving": true},
		]
		
	else:
		# === LEVEL 4+ (Endless): MIX TOÀN BỘ — Thử thách tột đỉnh ===
		var diff = clamp(lvl - 3, 1, 5)  # Tăng dần độ khó
		
		high_data = [
			{"z": -35.0, "bar_height": 3.5 - diff * 0.1},
			{"z": -110.0, "bar_height": 3.2 - diff * 0.1},
			{"z": -195.0, "bar_height": 3.0 - diff * 0.1},
		]
		low_data = [
			{"z": -42.0, "spike_height": 2.0 + diff * 0.1},  # Khe hẹp dần!
			{"z": -117.0, "spike_height": 2.2 + diff * 0.1},
			{"z": -202.0, "spike_height": 2.3 + diff * 0.1},
		]
		saw_z = [-70.0, -155.0, -230.0]
		rock_data = [
			{"x": -2.4, "z": -85.0},
			{"x": 2.4, "z": -170.0},
			{"x": 0.0, "z": -245.0}
		]
		axe_z = [-125.0, -210.0]
		tunnel_data = [
			{"z": -55.0, "ceiling": 3.5 - diff * 0.15, "floor": 2.0 + diff * 0.1},  # Khe thu hẹp dần
			{"z": -180.0, "ceiling": 3.8 - diff * 0.1, "floor": 2.5 + diff * 0.1},
		]
		wave_data = [
			{"z": -100.0, "amplitude": 2.0 + diff * 0.2, "center": 3.0, "speed": 2.0 + diff * 0.3, "gap": 2.0 - diff * 0.15},
			{"z": -145.0, "amplitude": 2.5, "center": 3.5, "speed": 2.5 + diff * 0.2, "gap": 1.8 - diff * 0.1},
		]
		gate_data = [
			{"z": -28.0, "l_type": 0, "l_val": 3.0, "r_type": 2, "r_val": -2.0, "moving": true},
			{"z": -88.0, "l_type": 1, "l_val": 1.8, "r_type": 0, "r_val": 4.0, "moving": true},
			{"z": -165.0, "l_type": 0, "l_val": 5.0, "r_type": 2, "r_val": -4.0, "moving": true},
		]
	
	# Collect all obstacle Z positions for fruit spacing
	var all_obstacle_z: Array[float] = []
	for d in high_data: all_obstacle_z.append(d.z)
	for d in low_data: all_obstacle_z.append(d.z)
	for z in saw_z: all_obstacle_z.append(z)
	for rd in rock_data: all_obstacle_z.append(rd.z)
	for z in axe_z: all_obstacle_z.append(z)
	for gd in gate_data: all_obstacle_z.append(gd.z)
	for td in tunnel_data:
		for tz_off in range(0, int(15), 3):
			all_obstacle_z.append(td.z - tz_off)
	for wd in wave_data: all_obstacle_z.append(wd.z)

	# === 1. Sinh chướng ngại vật High (Thanh chắn trên cao) ===
	for d in high_data:
		var obs = high_obs_scene.instantiate()
		add_child(obs)
		obs.position = Vector3(0, 0, d.z)
		obs.bar_height = d.bar_height
	
	# === 2. Sinh chướng ngại vật Low (Gai dưới đất) ===
	for d in low_data:
		var obs = low_obs_scene.instantiate()
		add_child(obs)
		obs.position = Vector3(0, 0, d.z)
		obs.spike_height = d.spike_height

	# === 3. Sinh lưỡi cưa ===
	for z in saw_z:
		var saw = saw_obs_scene.instantiate()
		add_child(saw)
		saw.position = Vector3(0, 0, z)
		
	# === 4. Sinh tảng đá ===
	for rd in rock_data:
		var rock = rock_obs_scene.instantiate()
		add_child(rock)
		rock.position = Vector3(rd.x, 0, rd.z)
		
	# === 5. Sinh búa tử thần ===
	for z in axe_z:
		var axe = axe_obs_scene.instantiate()
		add_child(axe)
		axe.position = Vector3(0, 0, z)
		
	# === 6. Sinh cổng nhân ===
	for gd in gate_data:
		var left_gate = gate_scene.instantiate()
		var right_gate = gate_scene.instantiate()
		add_child(left_gate)
		add_child(right_gate)
		
		left_gate.position = Vector3(-2.2, 1.6, gd.z)
		right_gate.position = Vector3(2.2, 1.6, gd.z)
		left_gate.gate_type = gd.l_type
		left_gate.value = gd.l_val
		left_gate.is_moving = gd.moving
		
		right_gate.gate_type = gd.r_type
		right_gate.value = gd.r_val
		right_gate.is_moving = gd.moving
		
		if left_gate.has_method("update_visuals"): left_gate.update_visuals()
		if right_gate.has_method("update_visuals"): right_gate.update_visuals()
	
	# === 7. Sinh TunnelObstacle (Đường hầm precision) ===
	for td in tunnel_data:
		var tunnel = tunnel_scene.instantiate()
		add_child(tunnel)
		tunnel.position = Vector3(0, 0, td.z)
		tunnel.ceiling_height = td.ceiling
		tunnel.floor_height = td.floor
	
	# === 8. Sinh WaveGate (Thanh chắn sóng timing) ===
	for wd in wave_data:
		var wave = wave_scene.instantiate()
		add_child(wave)
		wave.position = Vector3(0, 0, wd.z)
		wave.wave_amplitude = wd.amplitude
		wave.wave_center = wd.center
		wave.wave_speed = wd.speed
		wave.gap_height = wd.gap
	
	# === 9. Sinh trái cây CHIẾN LƯỢC ===
	# Quả thấp (dễ lấy, ít bonus) xen kẽ quả cao (khó lấy, nhiều bonus)
	# → Khuyến khích risk-taking: vươn cổ cao để lấy quả nhưng có thể chết
	for z in range(14, int(track_length - 25), 3):
		var target_z = -float(z)
		
		# Kiểm tra không đặt quả sát chướng ngại vật
		var is_near_obstacle = false
		for obs_z in all_obstacle_z:
			if abs(target_z - obs_z) < 2.0:
				is_near_obstacle = true
				break
		if is_near_obstacle:
			continue
			
		var item = collectable_scene.instantiate()
		var step_idx = int(z / 3.0)
		var item_type_idx = step_idx % 5
		item.fruit_type = item_type_idx
		add_child(item)
		item.setup_fruit_visuals()
		
		# Phân bổ chiều cao chiến lược:
		# - 60% quả thấp (1.0-1.5m): dễ lấy, ít bonus, không cần vươn cổ nhiều
		# - 25% quả trung (2.5-3.5m): cần vươn cổ vừa phải
		# - 15% quả cao (4.0-6.0m): phải vươn cổ rất cao (risk!)
		var height_roll = randf()
		var h: float
		if height_roll < 0.6:
			h = randf_range(1.0, 1.5)   # Quả thấp - an toàn
		elif height_roll < 0.85:
			h = randf_range(2.5, 3.5)   # Quả trung - cần effort
		else:
			h = randf_range(4.0, 6.0)   # Quả cao - high risk high reward!
		
		var x = randf_range(-2.8, 2.8)
		item.position = Vector3(x, h, target_z)

func spawn_finish_tower() -> void:
	var tower_z = -track_length + 15.0
	var tower = tower_scene.instantiate()
	add_child(tower)
	tower.position = Vector3(0, 0, tower_z)
