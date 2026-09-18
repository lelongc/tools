extends AnimatableBody3D

## SweeperBeam3D.gd
## Thanh gạt xoay tròn ở giữa sàn đấu Sumo: Quét văng các đấu thủ không kịp nhảy né!

@export var rotation_speed: float = 1.2
var rot_angle: float = 0.0

func _ready() -> void:
	_build_visuals()

func _build_visuals() -> void:
	var col = CollisionShape3D.new()
	var box_shape = BoxShape3D.new()
	box_shape.size = Vector3(18.0, 0.8, 0.8)
	col.shape = box_shape
	col.position.y = 0.45
	add_child(col)
	
	var mesh_inst = MeshInstance3D.new()
	var box_mesh = BoxMesh.new()
	box_mesh.size = Vector3(18.0, 0.8, 0.8)
	mesh_inst.mesh = box_mesh
	mesh_inst.position.y = 0.45
	
	var mat = StandardMaterial3D.new()
	var tex_path = "res://assets/textures/arena/hazard_stripes.png"
	if ResourceLoader.exists(tex_path):
		mat.albedo_texture = load(tex_path)
		mat.uv1_scale = Vector3(8.0, 1.0, 1.0)
		mat.uv1_triplanar = true
	else:
		mat.albedo_color = Color(1.0, 0.25, 0.1)
	mat.roughness = 0.3
	mat.metallic = 0.2
	mat.emission_enabled = true
	mat.emission = Color(0.9, 0.7, 0.1)
	mat.emission_energy_multiplier = 0.35
	mesh_inst.material_override = mat
	add_child(mesh_inst)

func _physics_process(delta: float) -> void:
	rot_angle += rotation_speed * delta
	rotation.y = rot_angle
