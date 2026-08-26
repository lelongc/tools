extends Node3D

@export var track_length: float = 260.0
@export var road_width: float = 8.5

var high_obs_scene: PackedScene = preload("res://scenes/HighObstacle.tscn")
var low_obs_scene: PackedScene = preload("res://scenes/LowObstacle.tscn")
var saw_obs_scene: PackedScene = preload("res://scenes/SawObstacle.tscn")
var rock_obs_scene: PackedScene = preload("res://scenes/BlockadeObstacle.tscn")
var axe_obs_scene: PackedScene = preload("res://scenes/PendulumAxe.tscn")
var collectable_scene: PackedScene = preload("res://scenes/Collectable.tscn")
var gate_scene: PackedScene = preload("res://scenes/NeckGate.tscn")
var tower_scene: PackedScene = preload("res://scenes/FinishTower.tscn")

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
		
	# 3. Cột đèn & Cây trang trí 2 bên đường (Environment Props)
	var prop_mat = StandardMaterial3D.new()
	prop_mat.albedo_color = Color(0.2, 0.8, 0.4)
	prop_mat.roughness = 0.4
	
	var trunk_mat = StandardMaterial3D.new()
	trunk_mat.albedo_color = Color(0.45, 0.28, 0.12)
	
	for z in range(15, int(track_length - 20), 16):
		for side in [-1.0, 1.0]:
			var tree_root = Node3D.new()
			tree_root.position = Vector3(side * (road_width / 2.0 + 3.2), 0, -z)
			
			# Thân cây
			var trunk = MeshInstance3D.new()
			var t_mesh = CylinderMesh.new()
			t_mesh.top_radius = 0.2
			t_mesh.bottom_radius = 0.3
			t_mesh.height = 3.5
			t_mesh.material = trunk_mat
			trunk.mesh = t_mesh
			trunk.position.y = 1.75
			tree_root.add_child(trunk)
			
			# Tán lá tròn
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
	# Cấu trúc màn chơi theo Level
	var high_z = []
	var low_z = []
	var saw_z = []
	var rock_data = []
	var axe_z = []
	var gate_data = []
	
	if lvl == 1:
		# Level 1: Khởi động dễ
		high_z = [-40.0, -130.0]
		low_z = [-75.0, -170.0]
		gate_data = [
			{"z": -55.0, "l_type": 0, "l_val": 3.0, "r_type": 2, "r_val": -2.0, "moving": false},
			{"z": -110.0, "l_type": 1, "l_val": 1.5, "r_type": 0, "r_val": 2.5, "moving": false},
			{"z": -190.0, "l_type": 0, "l_val": 4.0, "r_type": 2, "r_val": -3.0, "moving": false}
		]
	elif lvl == 2:
		# Level 2: Lưỡi cưa & Cổng di động
		high_z = [-35.0, -120.0, -180.0]
		low_z = [-65.0]
		saw_z = [-90.0, -150.0, -210.0]
		gate_data = [
			{"z": -50.0, "l_type": 0, "l_val": 3.5, "r_type": 2, "r_val": -2.5, "moving": true},
			{"z": -105.0, "l_type": 1, "l_val": 2.0, "r_type": 0, "r_val": 3.0, "moving": true},
			{"z": -165.0, "l_type": 0, "l_val": 5.0, "r_type": 2, "r_val": -4.0, "moving": false}
		]
	elif lvl == 3:
		# Level 3: Tảng đá cản & Búa lắc tử thần
		high_z = [-40.0, -135.0]
		low_z = [-70.0, -165.0]
		saw_z = [-105.0]
		rock_data = [{"x": -2.2, "z": -85.0}, {"x": 2.2, "z": -150.0}]
		axe_z = [-120.0, -190.0]
		gate_data = [
			{"z": -50.0, "l_type": 0, "l_val": 4.0, "r_type": 2, "r_val": -3.0, "moving": false},
			{"z": -100.0, "l_type": 1, "l_val": 2.0, "r_type": 0, "r_val": 4.0, "moving": true},
			{"z": -175.0, "l_type": 0, "l_val": 6.0, "r_type": 2, "r_val": -5.0, "moving": true}
		]
	else:
		# Level 4+ (Hoặc Endless Gauntlet): Thử thách tột đỉnh
		high_z = [-35.0, -110.0, -170.0]
		low_z = [-60.0, -145.0]
		saw_z = [-85.0, -195.0]
		rock_data = [{"x": -2.4, "z": -75.0}, {"x": 2.4, "z": -135.0}, {"x": 0.0, "z": -180.0}]
		axe_z = [-100.0, -160.0, -215.0]
		gate_data = [
			{"z": -48.0, "l_type": 0, "l_val": 5.0, "r_type": 2, "r_val": -4.0, "moving": true},
			{"z": -95.0, "l_type": 1, "l_val": 2.5, "r_type": 0, "r_val": 5.0, "moving": true},
			{"z": -155.0, "l_type": 0, "l_val": 8.0, "r_type": 2, "r_val": -6.0, "moving": true}
		]
		
	# 1. Sinh cầu vượt
	for z in high_z:
		var obs = high_obs_scene.instantiate()
		add_child(obs)
		obs.position = Vector3(0, 0, z)
		
	# 2. Sinh bãi chông
	for z in low_z:
		var obs = low_obs_scene.instantiate()
		add_child(obs)
		obs.position = Vector3(0, 0, z)
		
	# 3. Sinh lưỡi cưa
	for z in saw_z:
		var saw = saw_obs_scene.instantiate()
		add_child(saw)
		saw.position = Vector3(0, 0, z)
		
	# 4. Sinh tảng đá
	for rd in rock_data:
		var rock = rock_obs_scene.instantiate()
		add_child(rock)
		rock.position = Vector3(rd.x, 0, rd.z)
		
	# 5. Sinh búa tử thần
	for z in axe_z:
		var axe = axe_obs_scene.instantiate()
		add_child(axe)
		axe.position = Vector3(0, 0, z)
		
	# 6. Sinh cổng nhân
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
		
	# 7. Sinh trái cây đa dạng (Táo, Chuối, Dưa hấu, Sao, Nam châm)
	for z in range(12, int(track_length - 25), 4):
		var item = collectable_scene.instantiate()
		var step_idx = int(z / 4.0)
		var item_type_idx = step_idx % 5
		item.fruit_type = item_type_idx
		add_child(item)
		item.setup_fruit_visuals()
		
		var is_high = (step_idx % 2 == 0)
		var h = 3.8 if is_high else 1.1
		var x = randf_range(-2.6, 2.6)
		item.position = Vector3(x, h, -z)

func spawn_finish_tower() -> void:
	var tower_z = -track_length + 15.0
	var tower = tower_scene.instantiate()
	add_child(tower)
	tower.position = Vector3(0, 0, tower_z)
