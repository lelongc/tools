extends Area3D
class_name BlockadeObstacle

@export var obstacle_name: String = "ROCK_BLOCKADE"

func _ready() -> void:
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)
	setup_visuals()

func setup_visuals() -> void:
	if ResourceLoader.exists("res://models/spiked_boulder.glb"):
		var scn = load("res://models/spiked_boulder.glb")
		if scn:
			var inst = scn.instantiate()
			inst.name = "DynamicModel"
			add_child(inst)
			var rock = get_node_or_null("RockMesh")
			if rock: rock.visible = false
			return
	var tex = load_dynamic_texture("res://textures/rock_texture.png")
	if tex:
		var mat = StandardMaterial3D.new()
		mat.albedo_texture = tex
		mat.roughness = 0.8
		var rock = get_node_or_null("RockMesh")
		if rock: rock.material_override = mat

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

	if is_instance_valid(player) and player.has_method("bonk_overhead"):
		player.bonk_overhead()
