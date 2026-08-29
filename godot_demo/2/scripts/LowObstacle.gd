extends Area3D
class_name LowObstacle

@export var obstacle_name: String = "SPIKE_TRAP"
@export var spike_height: float = 2.0  # Gai cao đến mức này (cổ < spike_height → chết)

func _ready() -> void:
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)
	setup_visuals()
	build_height_indicator()

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

func build_height_indicator() -> void:
	# Dải laser xanh cho thấy phải vươn cổ cao hơn mức nào
	var laser = MeshInstance3D.new()
	var l_mesh = BoxMesh.new()
	l_mesh.size = Vector3(8.0, 0.08, 0.08)
	laser.mesh = l_mesh
	laser.position = Vector3(0, spike_height, 0)
	var l_mat = StandardMaterial3D.new()
	l_mat.albedo_color = Color(0.1, 1.0, 0.3, 0.9)
	l_mat.emission_enabled = true
	l_mat.emission = Color(0.0, 1.0, 0.2)
	l_mat.emission_energy_multiplier = 4.0
	l_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
	laser.material_override = l_mat
	add_child(laser)
	
	# Label hiển thị chiều cao cần vươn tới
	var lbl = Label3D.new()
	lbl.text = "⬆️ > %.1fm" % spike_height
	lbl.font_size = 48
	lbl.modulate = Color(0.3, 1.0, 0.5)
	lbl.outline_modulate = Color(0, 0, 0)
	lbl.outline_size = 6
	lbl.position = Vector3(0, spike_height + 0.8, 0)
	lbl.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	add_child(lbl)

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
		var current_neck = player.get("current_neck_height")
		if current_neck != null and current_neck < spike_height:
			player.poke_bottom()
