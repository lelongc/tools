extends Area3D
class_name HighObstacle

@export var obstacle_name: String = "OVERHEAD_BEAM"
@export var bar_height: float = 3.5  # Thanh chắn ở độ cao cụ thể (cổ > bar_height → bonk)

func _ready() -> void:
	area_entered.connect(_on_area_entered)
	body_entered.connect(_on_body_entered)
	setup_visuals()
	build_height_indicator()

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

func build_height_indicator() -> void:
	# Dải laser đỏ ngang cho thấy phải thụt cổ dưới mức nào
	var laser = MeshInstance3D.new()
	var l_mesh = BoxMesh.new()
	l_mesh.size = Vector3(8.0, 0.08, 0.08)
	laser.mesh = l_mesh
	laser.position = Vector3(0, bar_height, 0)
	var l_mat = StandardMaterial3D.new()
	l_mat.albedo_color = Color(1.0, 0.1, 0.1, 0.9)
	l_mat.emission_enabled = true
	l_mat.emission = Color(1.0, 0.0, 0.0)
	l_mat.emission_energy_multiplier = 5.0
	l_mat.cull_mode = BaseMaterial3D.CULL_DISABLED
	laser.material_override = l_mat
	add_child(laser)
	
	# Label hiển thị độ cao tối đa
	var lbl = Label3D.new()
	lbl.text = "⬇️ < %.1fm" % bar_height
	lbl.font_size = 48
	lbl.modulate = Color(1.0, 0.3, 0.3)
	lbl.outline_modulate = Color(0, 0, 0)
	lbl.outline_size = 6
	lbl.position = Vector3(0, bar_height + 0.8, 0)
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

	if is_instance_valid(player) and player.has_method("bonk_overhead"):
		var current_neck = player.get("current_neck_height")
		if current_neck != null and current_neck > bar_height:
			player.bonk_overhead()
