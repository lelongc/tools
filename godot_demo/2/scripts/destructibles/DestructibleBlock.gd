extends RigidBody2D
class_name DestructibleBlock

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export_enum("wood", "stone", "glass", "steel", "obsidian") var material_type: String = "wood"
@export var max_health: float = 100.0
@export var block_size: Vector2 = Vector2(120.0, 24.0)

var current_health: float = 100.0
var is_destroyed: bool = false
var is_awake: bool = false
var spawn_settle_timer: float = 0.5

@onready var col_shape: CollisionShape2D = $CollisionShape2D
@onready var visual_mesh: Polygon2D = get_node_or_null("Visual")
@onready var crack_overlay: Line2D = get_node_or_null("CrackOverlay")
@onready var fracture_particles: CPUParticles2D = get_node_or_null("FractureFX")

func _ready() -> void:
	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC
	linear_damp = 1.5
	angular_damp = 2.5

	var rect_shape = RectangleShape2D.new()
	rect_shape.size = block_size
	col_shape.shape = rect_shape

	if visual_mesh:
		var hw = block_size.x * 0.5
		var hh = block_size.y * 0.5
		visual_mesh.polygon = PackedVector2Array([
			Vector2(-hw, -hh), Vector2(hw, -hh), Vector2(hw, hh), Vector2(-hw, hh)
		])

	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_impact)

	match material_type:
		"wood":
			max_health = 80.0
			mass = (block_size.x * block_size.y) * 0.0012
			if visual_mesh: visual_mesh.color = Color(0.76, 0.52, 0.28, 1.0)
		"stone":
			max_health = 220.0
			mass = (block_size.x * block_size.y) * 0.0035
			if visual_mesh: visual_mesh.color = Color(0.55, 0.58, 0.62, 1.0)
		"glass":
			max_health = 25.0
			mass = (block_size.x * block_size.y) * 0.0006
			if visual_mesh: visual_mesh.color = Color(0.65, 0.88, 0.95, 0.75)
		"steel":
			max_health = 400.0
			mass = (block_size.x * block_size.y) * 0.005
			if visual_mesh: visual_mesh.color = Color(0.35, 0.42, 0.5, 1.0)
		"obsidian":
			max_health = 600.0
			mass = (block_size.x * block_size.y) * 0.008
			if visual_mesh: visual_mesh.color = Color(0.18, 0.12, 0.22, 1.0)

	current_health = max_health

func _process(delta: float) -> void:
	if spawn_settle_timer > 0.0:
		spawn_settle_timer -= delta

func wake_up() -> void:
	if is_awake or is_destroyed: return
	is_awake = true
	set_deferred("freeze", false)

	var space_state = get_world_2d().direct_space_state
	var query = PhysicsShapeQueryParameters2D.new()
	var circle = CircleShape2D.new()
	circle.radius = max(block_size.x, block_size.y) * 0.8 + 20.0
	query.shape = circle
	query.transform = global_transform
	query.collide_with_bodies = true

	for res in space_state.intersect_shape(query, 12):
		var col = res.collider
		if is_instance_valid(col) and col != self:
			if col.has_method("wake_up"):
				col.wake_up()

func _on_body_impact(body: Node) -> void:
	if is_destroyed or spawn_settle_timer > 0.0: return

	if not is_awake:
		wake_up()

	if body is RigidBody2D:
		var rel_vel = (linear_velocity - body.linear_velocity).length()
		if rel_vel > 160.0:
			var impact_dmg = (rel_vel - 160.0) * (body.mass * 0.4)
			take_damage(impact_dmg, global_position)

func take_damage(amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_destroyed: return
	if not is_awake:
		wake_up()

	current_health -= amount

	if current_health <= max_health * 0.5 and crack_overlay:
		crack_overlay.visible = true

	if visual_mesh:
		var prev_c = visual_mesh.color
		visual_mesh.color = Color(1.0, 1.0, 1.0, 1.0)
		var flash_tween = create_tween()
		flash_tween.tween_property(visual_mesh, "color", prev_c, 0.05)

	if current_health <= 0.0:
		_fracture_block()

func _fracture_block() -> void:
	if is_destroyed: return
	is_destroyed = true

	GameManager.add_score(250 if material_type in ["steel", "obsidian"] else (150 if material_type == "stone" else 75))

	if has_node("/root/SoundManager"):
		var snd = get_node("/root/SoundManager")
		match material_type:
			"wood": snd.play_wood_break()
			"stone", "obsidian": snd.play_stone_break()
			"glass": snd.play_glass_break()
			"steel": snd.play_wood_break()

	if fracture_particles:
		fracture_particles.restart()
		fracture_particles.emitting = true

	if visual_mesh:
		visual_mesh.visible = false
	if crack_overlay:
		crack_overlay.visible = false

	$CollisionShape2D.set_deferred("disabled", true)
	set_deferred("freeze", true)

	CameraShake.add_trauma(0.12 if material_type in ["steel", "obsidian"] else 0.08)

	await get_tree().create_timer(0.4).timeout
	queue_free()
