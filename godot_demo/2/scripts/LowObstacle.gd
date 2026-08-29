extends Area3D
class_name LowObstacle

@export var obstacle_name: String = "SPIKE_TRAP"
@export var safe_neck_height_threshold: float = 2.0

func _ready() -> void:
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)
	setup_visuals()

func setup_visuals() -> void:
	if ResourceLoader.exists("res://models/spike_trap.glb"):
		var scn = load("res://models/spike_trap.glb")
		if scn:
			var inst = scn.instantiate()
			inst.name = "DynamicModel"
			add_child(inst)
			var base = get_node_or_null("Base")
			if base: base.visible = false
			for ch in get_children():
				if ch != inst and ch is MeshInstance3D:
					ch.visible = false

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

	if is_instance_valid(player) and player.has_method("poke_bottom"):
		# Chỉ bị đâm nếu người chơi KHÔNG vươn cổ (neck < 2.0m)
		var current_neck = player.get("current_neck_height")
		if current_neck != null and current_neck < safe_neck_height_threshold:
			player.poke_bottom()
