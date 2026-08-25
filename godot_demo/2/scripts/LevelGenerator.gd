extends Node3D

@export var track_length: float = 230.0
@export var road_width: float = 8.5

var high_obs_scene: PackedScene = preload("res://scenes/HighObstacle.tscn")
var low_obs_scene: PackedScene = preload("res://scenes/LowObstacle.tscn")
var apple_scene: PackedScene = preload("res://scenes/Collectable.tscn")
var gate_scene: PackedScene = preload("res://scenes/NeckGate.tscn")
var tower_scene: PackedScene = preload("res://scenes/FinishTower.tscn")

func _ready() -> void:
	generate_track()
	spawn_obstacles_and_apples()
	spawn_finish_tower()

func generate_track() -> void:
	var road = MeshInstance3D.new()
	var box = BoxMesh.new()
	box.size = Vector3(road_width, 0.4, track_length)
	road.mesh = box
	road.position = Vector3(0, -0.2, -track_length / 2.0 + 10.0)
	
	var road_mat = StandardMaterial3D.new()
	if FileAccess.file_exists("res://textures/road_texture.png"):
		var abs_path = ProjectSettings.globalize_path("res://textures/road_texture.png")
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

func spawn_obstacles_and_apples() -> void:
	var high_z = [-35.0, -90.0, -150.0]
	for z in high_z:
		var obs = high_obs_scene.instantiate()
		add_child(obs)
		obs.position = Vector3(0, 0, z)
		
	var low_z = [-60.0, -120.0, -180.0]
	for z in low_z:
		var obs = low_obs_scene.instantiate()
		add_child(obs)
		obs.position = Vector3(0, 0, z)
		
	var gate_z = [-48.0, -105.0, -165.0]
	for i in range(gate_z.size()):
		var z = gate_z[i]
		var left_gate = gate_scene.instantiate()
		var right_gate = gate_scene.instantiate()
		
		add_child(left_gate)
		add_child(right_gate)
		
		left_gate.position = Vector3(-2.2, 1.6, z)
		right_gate.position = Vector3(2.2, 1.6, z)
		
		if i == 0:
			left_gate.gate_type = 0
			left_gate.value = 2.5
			right_gate.gate_type = 2
			right_gate.value = -2.0
		elif i == 1:
			left_gate.gate_type = 1
			left_gate.value = 1.5
			right_gate.gate_type = 0
			right_gate.value = 3.0
		else:
			left_gate.gate_type = 0
			left_gate.value = 4.0
			right_gate.gate_type = 2
			right_gate.value = -3.5
			
		if left_gate.has_method("update_visuals"):
			left_gate.update_visuals()
		if right_gate.has_method("update_visuals"):
			right_gate.update_visuals()
			
	for z in range(15, int(track_length - 25), 8):
		var apple = apple_scene.instantiate()
		add_child(apple)
		
		var is_high = (int(z / 8.0) % 2 == 0)
		var h = 4.2 if is_high else 1.1
		var x = randf_range(-2.8, 2.8)
		apple.position = Vector3(x, h, -z)

func spawn_finish_tower() -> void:
	var tower_z = -track_length + 15.0
	var tower = tower_scene.instantiate()
	add_child(tower)
	tower.position = Vector3(0, 0, tower_z)
