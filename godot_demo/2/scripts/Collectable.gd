extends Area3D
class_name Collectable

enum FruitType {
	APPLE,       # 0: Táo vàng (+0.8m, 100 điểm)
	BANANA,      # 1: Chuối (+1.5m, 200 điểm)
	WATERMELON,  # 2: Dưa hấu (+2.5m, 350 điểm)
	STAR         # 3: Ngôi sao siêu cấp (+3.5m, 500 điểm)
}

@export var fruit_type: FruitType = FruitType.APPLE:
	set(val):
		fruit_type = val
		setup_fruit_visuals()

@export var score_value: int = 100
@export var neck_bonus: float = 0.8

var is_collected: bool = false

@onready var apple_mesh: MeshInstance3D = get_node_or_null("AppleMesh")
@onready var banana_mesh: MeshInstance3D = get_node_or_null("BananaMesh")
@onready var melon_mesh: MeshInstance3D = get_node_or_null("MelonMesh")
@onready var star_mesh: MeshInstance3D = get_node_or_null("StarMesh")

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	area_entered.connect(_on_area_entered)
	setup_fruit_visuals()

func _process(delta: float) -> void:
	if not is_collected:
		rotation.y += 3.2 * delta

func setup_fruit_visuals() -> void:
	var a_node = get_node_or_null("AppleMesh")
	var b_node = get_node_or_null("BananaMesh")
	var m_node = get_node_or_null("MelonMesh")
	var s_node = get_node_or_null("StarMesh")
	
	if a_node: a_node.visible = (fruit_type == FruitType.APPLE)
	if b_node: b_node.visible = (fruit_type == FruitType.BANANA)
	if m_node: m_node.visible = (fruit_type == FruitType.WATERMELON)
	if s_node: s_node.visible = (fruit_type == FruitType.STAR)
	
	match fruit_type:
		FruitType.APPLE:
			neck_bonus = 0.8
			score_value = 100
		FruitType.BANANA:
			neck_bonus = 1.5
			score_value = 200
			apply_texture(b_node, "res://textures/banana_item.png")
		FruitType.WATERMELON:
			neck_bonus = 2.5
			score_value = 350
			apply_texture(m_node, "res://textures/watermelon_item.png")
		FruitType.STAR:
			neck_bonus = 3.5
			score_value = 500
			apply_texture(s_node, "res://textures/star_item.png")

func apply_texture(node: MeshInstance3D, path: String) -> void:
	if not node:
		return
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
		player.eat_fruit(neck_bonus, score_value)
		
		var tw = create_tween()
		tw.set_parallel(true)
		tw.tween_property(self, "scale", Vector3(1.8, 1.8, 1.8), 0.12)
		tw.tween_property(self, "position:y", position.y + 1.2, 0.12)
		tw.chain().tween_callback(queue_free)
