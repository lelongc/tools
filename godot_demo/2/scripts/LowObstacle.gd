extends Area3D
class_name LowObstacle

@export var obstacle_name: String = "SPIKE_TRAP"

func _ready() -> void:
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)
	setup_visuals()

func setup_visuals() -> void:
	var tex = load_dynamic_texture("res://textures/danger_stripes.png")
	if tex:
		var mat = StandardMaterial3D.new()
		mat.albedo_texture = tex
		mat.uv1_scale = Vector3(3.0, 1.0, 1.0)
		mat.roughness = 0.3
		mat.metallic = 0.6
		var base = get_node_or_null("Base")
		if base: base.material_override = mat

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
	# Kiểm tra nếu thân/mông chạm vào bãi chông
	if node.name == "BodyHitbox" or node.name == "BodyMesh":
		var player = node.get_parent()
		if not player is CharacterBody3D and node.get_parent().get_parent():
			player = node.get_parent().get_parent()
		if is_instance_valid(player) and player.has_method("poke_bottom"):
			player.poke_bottom()
	elif node is CharacterBody3D and node.has_method("poke_bottom"):
		# Nếu là Player trực tiếp và chưa vươn cổ đủ cao
		if node.get("current_neck_height") < 2.2:
			node.poke_bottom()
