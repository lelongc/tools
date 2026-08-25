extends Node3D

@export var track_length: float = 240.0
@export var road_width: float = 8.5

var high_obs_scene: PackedScene = preload("res://scenes/HighObstacle.tscn")
var low_obs_scene: PackedScene = preload("res://scenes/LowObstacle.tscn")
var saw_obs_scene: PackedScene = preload("res://scenes/SawObstacle.tscn")
var rock_obs_scene: PackedScene = preload("res://scenes/BlockadeObstacle.tscn")
var collectable_scene: PackedScene = preload("res://scenes/Collectable.tscn")
var gate_scene: PackedScene = preload("res://scenes/NeckGate.tscn")
var tower_scene: PackedScene = preload("res://scenes/FinishTower.tscn")

func _ready() -> void:
	generate_track()
	spawn_gameplay_elements()
	spawn_finish_tower()

func generate_track() -> void:
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
	
	for side in [-1.0, 1.0]:
		var rail = MeshInstance3D.new()
		var r_mesh = BoxMesh.new()
		r_mesh.size = Vector3(0.3, 0.6, track_length)
		rail.mesh = r_mesh
		rail.position = Vector3(side * (road_width / 2.0 + 0.15), 0.2, -track_length / 2.0 + 10.0)
		
		var rail_mat = StandardMaterial3D.new()
		rail_mat.albedo_color = Color(1.0, 0.75, 0.1)
		rail_mat.emission_enabled = true
		rail_mat.emission = Color(1.0, 0.7, 0.0)
		rail_mat.emission_energy_multiplier = 3.0
		rail.material_override = rail_mat
		add_child(rail)

func spawn_gameplay_elements() -> void:
	# 1. Cầu vượt xà ngang (Thụt đầu xuống)
	var high_z = [-35.0, -115.0, -175.0]
	for z in high_z:
		var obs = high_obs_scene.instantiate()
		add_child(obs)
		obs.position = Vector3(0, 0, z)
		
	# 2. Bãi chông gai (Vươn cổ bước qua)
	var low_z = [-65.0, -150.0]
	for z in low_z:
		var obs = low_obs_scene.instantiate()
		add_child(obs)
		obs.position = Vector3(0, 0, z)
		
	# 3. Lưỡi cưa xoay tít trên mặt đất (Vươn cổ nhảy qua)
	var saw_z = [-130.0, -195.0]
	for z in saw_z:
		var saw = saw_obs_scene.instantiate()
		add_child(saw)
		saw.position = Vector3(0, 0, z)
		
	# 4. Tảng đá cản đường (Lái lượn né sang làn bên)
	var rock_data = [
		{"x": -2.2, "z": -80.0},
		{"x": 2.2, "z": -140.0}
	]
	for rd in rock_data:
		var rock = rock_obs_scene.instantiate()
		add_child(rock)
		rock.position = Vector3(rd.x, 0, rd.z)
		
	# 5. Cổng nhân độ dài cổ (+, x, -)
	var gate_data = [
		{"z": -48.0, "l_type": 0, "l_val": 2.5, "r_type": 2, "r_val": -2.0, "moving": false},
		{"z": -95.0, "l_type": 1, "l_val": 1.5, "r_type": 0, "r_val": 3.0, "moving": true},
		{"z": -160.0, "l_type": 0, "l_val": 4.5, "r_type": 2, "r_val": -3.5, "moving": false}
	]
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
		
	# 6. Rải trái cây & vật phẩm đa dạng (Táo, Chuối, Dưa hấu, Ngôi sao)
	for z in range(12, int(track_length - 25), 5):
		var item = collectable_scene.instantiate()
		var step_idx = int(z / 5.0)
		var item_type_idx = step_idx % 4
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
