extends Area3D
class_name SawObstacle

@export var obstacle_name: String = "SAW_BLADE"
@export var safe_neck_height_threshold: float = 2.0
@export var spin_speed: float = 12.0

@onready var saw_mesh: MeshInstance3D = $SawBladeMesh

func _ready() -> void:
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)
	setup_visuals()

func _process(delta: float) -> void:
	if saw_mesh:
		saw_mesh.rotation.y += spin_speed * delta

func setup_visuals() -> void:
	var tex = load_dynamic_texture("res://textures/saw_blade.png")
	if tex and saw_mesh:
		var mat = StandardMaterial3D.new()
		mat.albedo_texture = tex
		mat.metallic = 0.95
		mat.roughness = 0.15
		mat.emission_enabled = true
		mat.emission = Color(1.0, 0.2, 0.1)
		mat.emission_energy_multiplier = 2.0
		saw_mesh.material_override = mat

func load_dynamic_texture(res_path: String) -> Texture2D:
	if ResourceLoader.exists(res_path):
		return load(res_path)
	var abs_path = ProjectSettings.globalize_path(res_path)
	if FileAccess.file_exists(abs_path):
		var img = Image.load_from_file(abs_path)
		if img:
			return ImageTexture.create_from_image(img)
	return null

func _on_area_entered(area: Area3D) -> void:
	check_hit(area)

func _on_body_entered(body: Node3D) -> void:
	check_hit(body)

func check_hit(node: Node) -> void:
	var player = null
	if node is CharacterBody3D and node.name == "Player":
		player = node
	elif node.get_parent() is CharacterBody3D and node.get_parent().name == "Player":
		player = node.get_parent()
	elif node.owner and node.owner is CharacterBody3D:
		player = node.owner

	if is_instance_valid(player) and player.has_method("poke_bottom"):
		var current_neck = player.get("current_neck_height")
		if current_neck != null and current_neck < safe_neck_height_threshold:
			player.poke_bottom()
