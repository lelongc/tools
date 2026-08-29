extends Area3D
class_name HighObstacle

@export var obstacle_name: String = "OVERHEAD_BEAM"
@export var danger_neck_height_threshold: float = 1.35

func _ready() -> void:
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)
	setup_visuals()

func setup_visuals() -> void:
	if ResourceLoader.exists("res://models/overhead_gate.glb"):
		var scn = load("res://models/overhead_gate.glb")
		if scn:
			var inst = scn.instantiate()
			inst.name = "DynamicModel"
			add_child(inst)
			var bar = get_node_or_null("Crossbar")
			if bar: bar.visible = false
			var lp = get_node_or_null("LeftPillar")
			if lp: lp.visible = false
			var rp = get_node_or_null("RightPillar")
			if rp: rp.visible = false
			var sign_mesh = get_node_or_null("SignBoard")
			if sign_mesh: sign_mesh.visible = false

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
	elif node.get_parent() and node.get_parent().get_parent() is CharacterBody3D:
		player = node.get_parent().get_parent()
	elif node.owner and node.owner is CharacterBody3D:
		player = node.owner

	if is_instance_valid(player) and player.has_method("bonk_overhead"):
		# Chỉ bị đập đầu nếu người chơi ĐANG VƯƠN CỔ CAO (neck > 1.35m)
		# Nếu đã thả tay thụt cổ (neck <= 1.35m) thì chui lọt an toàn!
		var current_neck = player.get("current_neck_height")
		if current_neck != null and current_neck > danger_neck_height_threshold:
			player.bonk_overhead()
