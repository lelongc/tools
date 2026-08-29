extends Area3D
class_name Collectable

enum FruitType {
	APPLE,       # 0: Táo vàng (+0.5m, 80 điểm)
	BANANA,      # 1: Chuối (+0.8m, 150 điểm)
	WATERMELON,  # 2: Dưa hấu (+1.2m, 250 điểm)
	STAR,        # 3: Ngôi sao (+1.8m, 400 điểm)
	MAGNET       # 4: Nam châm (+0.6m, 200 điểm, kích hoạt 6s hút)
}

@export var fruit_type: FruitType = FruitType.APPLE:
	set(val):
		fruit_type = val
		setup_fruit_visuals()

@export var score_value: int = 80
@export var neck_bonus: float = 0.5

var is_collected: bool = false

func _ready() -> void:
	add_to_group("collectables")
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)
	setup_fruit_visuals()

func _process(delta: float) -> void:
	if not is_collected:
		rotation.y += 3.2 * delta
		# Nhấp nháy nhẹ khi ở vị trí cao (risk bonus)
		if position.y > 3.0:
			var pulse = 1.0 + sin(Time.get_ticks_msec() * 0.008) * 0.15
			scale = Vector3(pulse, pulse, pulse)

func setup_fruit_visuals() -> void:
	var dyn = get_node_or_null("DynamicModel")
	if dyn: dyn.queue_free()
	
	var a_node = get_node_or_null("AppleMesh")
	var b_node = get_node_or_null("BananaMesh")
	var m_node = get_node_or_null("MelonMesh")
	var s_node = get_node_or_null("StarMesh")
	
	if a_node: a_node.visible = false
	if b_node: b_node.visible = false
	if m_node: m_node.visible = false
	if s_node: s_node.visible = false
	
	var glb_path = "res://models/golden_apple.glb"
	match fruit_type:
		FruitType.APPLE:
			neck_bonus = 0.5
			score_value = 80
			glb_path = "res://models/golden_apple.glb"
		FruitType.BANANA:
			neck_bonus = 0.8
			score_value = 150
			glb_path = "res://models/banana_item.glb"
		FruitType.WATERMELON:
			neck_bonus = 1.2
			score_value = 250
			glb_path = "res://models/watermelon_item.glb"
		FruitType.STAR:
			neck_bonus = 1.8
			score_value = 400
			glb_path = "res://models/star_item.glb"
		FruitType.MAGNET:
			neck_bonus = 0.6
			score_value = 200
			glb_path = "res://models/star_item.glb"
			
	if ResourceLoader.exists(glb_path):
		var scn = load(glb_path)
		if scn:
			var inst = scn.instantiate()
			inst.name = "DynamicModel"
			add_child(inst)

func apply_texture(node: MeshInstance3D, path: String) -> void:
	if not node: return
	var abs_p = ProjectSettings.globalize_path(path)
	if FileAccess.file_exists(abs_p):
		var img = Image.load_from_file(abs_p)
		if img:
			var mat = StandardMaterial3D.new()
			mat.albedo_texture = ImageTexture.create_from_image(img)
			mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
			mat.cull_mode = BaseMaterial3D.CULL_DISABLED
			mat.emission_enabled = true
			mat.emission_texture = mat.albedo_texture
			mat.emission_energy_multiplier = 1.5
			node.material_override = mat

func _on_body_entered(body: Node3D) -> void:
	trigger_collect(body)

func _on_area_entered(area: Area3D) -> void:
	trigger_collect(area)

func trigger_collect(collector: Node) -> void:
	if is_collected:
		return
		
	var player = null
	if collector is CharacterBody3D and collector.name == "Player":
		player = collector
	elif collector.get_parent() is CharacterBody3D and collector.get_parent().name == "Player":
		player = collector.get_parent()
	elif collector.owner and collector.owner.name == "Player":
		player = collector.owner

	if is_instance_valid(player) and player.has_method("eat_fruit"):
		is_collected = true
		# Quả ở vị trí cao hơn → bonus nhiều hơn (reward risk-taking)
		var height_multiplier = 1.0 + clamp((position.y - 1.5) * 0.2, 0.0, 1.0)
		player.eat_fruit(neck_bonus * height_multiplier, int(score_value * height_multiplier))
		
		if fruit_type == FruitType.MAGNET and player.has_method("activate_magnet"):
			player.activate_magnet(6.0)
			
		var tw = create_tween()
		tw.set_parallel(true)
		tw.tween_property(self, "scale", Vector3(1.8, 1.8, 1.8), 0.12)
		tw.tween_property(self, "position:y", position.y + 1.2, 0.12)
		tw.chain().tween_callback(queue_free)
