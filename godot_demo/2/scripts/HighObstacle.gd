extends Area3D
class_name HighObstacle

@export var obstacle_name: String = "OVERHEAD_BEAM"

func _ready() -> void:
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)
	setup_visuals()

func setup_visuals() -> void:
	var tex = load_dynamic_texture("res://textures/danger_stripes.png")
	if tex:
		var mat = StandardMaterial3D.new()
		mat.albedo_texture = tex
		mat.uv1_scale = Vector3(4.0, 1.0, 1.0)
		mat.roughness = 0.3
		mat.metallic = 0.5
		var bar = get_node_or_null("Crossbar")
		if bar: bar.material_override = mat
		var sign_mesh = get_node_or_null("SignBoard")
		if sign_mesh: sign_mesh.material_override = mat

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
	# Kiểm tra nếu đầu của người chơi đập vào xà ngang
	if node.name == "HeadHitbox" or node.name == "HeadRoot":
		var player = node.get_parent()
		if not player is CharacterBody3D and node.get_parent().get_parent():
			player = node.get_parent().get_parent()
		if is_instance_valid(player) and player.has_method("bonk_overhead"):
			player.bonk_overhead()
	elif node is CharacterBody3D and node.has_method("bonk_overhead"):
		# Nếu là Player trực tiếp
		if node.get("current_neck_height") > 1.2:
			node.bonk_overhead()
