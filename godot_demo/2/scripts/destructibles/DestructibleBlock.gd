extends RigidBody2D
class_name DestructibleBlock

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export_enum("wood", "stone", "glass", "steel", "obsidian") var material_type: String = "wood"
@export var max_health: float = 130.0
@export var block_size: Vector2 = Vector2(120, 24)

var current_health: float = 130.0
var is_destroyed: bool = false
var is_awake: bool = false
var spawn_settle_timer: float = 0.5

@onready var col_shape: CollisionShape2D = $CollisionShape2D
@onready var visual_mesh: Polygon2D = $Visual
@onready var fracture_particles: CPUParticles2D = $FractureFX

var crack_stage1: Line2D = null
var crack_stage2: Line2D = null

func _ready() -> void:
	add_to_group("Destructibles")
	_apply_block_dimensions()

	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC

	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

	_setup_procedural_cracks()

func _apply_block_dimensions() -> void:
	if col_shape:
		var rect = RectangleShape2D.new()
		rect.size = block_size
		col_shape.shape = rect

	var hw = block_size.x * 0.5
	var hh = block_size.y * 0.5

	if visual_mesh:
		visual_mesh.polygon = PackedVector2Array([
			Vector2(-hw, -hh),
			Vector2(hw, -hh),
			Vector2(hw, hh),
			Vector2(-hw, hh)
		])

	match material_type:
		"wood":
			max_health = 130.0
			mass = (block_size.x * block_size.y) * 0.0016
			if visual_mesh: visual_mesh.color = Color(0.76, 0.52, 0.28, 1.0)
		"stone":
			max_health = 340.0
			mass = (block_size.x * block_size.y) * 0.0048
			if visual_mesh: visual_mesh.color = Color(0.55, 0.58, 0.62, 1.0)
		"glass":
			max_health = 35.0
			mass = (block_size.x * block_size.y) * 0.0008
			if visual_mesh: visual_mesh.color = Color(0.65, 0.88, 0.95, 0.75)
		"steel":
			max_health = 650.0
			mass = (block_size.x * block_size.y) * 0.0070
			if visual_mesh: visual_mesh.color = Color(0.35, 0.42, 0.5, 1.0)
		"obsidian":
			max_health = 950.0
			mass = (block_size.x * block_size.y) * 0.0100
			if visual_mesh: visual_mesh.color = Color(0.18, 0.12, 0.22, 1.0)

	current_health = max_health

func _setup_procedural_cracks() -> void:
	var existing_overlay = get_node_or_null("CrackOverlay")
	if existing_overlay:
		existing_overlay.queue_free()

	var hw = block_size.x * 0.5
	var hh = block_size.y * 0.5

	# Crack Stage 1 (< 70% HP): Vết nứt chân chim thanh mảnh
	crack_stage1 = Line2D.new()
	crack_stage1.width = 1.6
	crack_stage1.default_color = Color(0.15, 0.1, 0.08, 0.8)
	crack_stage1.visible = false
	var pts1 = PackedVector2Array()
	var steps = 4
	for i in range(steps + 1):
		var t = float(i) / float(steps)
		var x = lerp(-hw * 0.7, hw * 0.7, t)
		var y = (randf() - 0.5) * hh * 0.7
		pts1.append(Vector2(x, y))
	crack_stage1.points = pts1
	add_child(crack_stage1)

	# Crack Stage 2 (< 35% HP): Vết nứt mạng nhện vỡ vụn
	crack_stage2 = Line2D.new()
	crack_stage2.width = 2.4
	crack_stage2.default_color = Color(0.1, 0.05, 0.05, 0.95)
	crack_stage2.visible = false
	var pts2 = PackedVector2Array([
		Vector2(-hw * 0.8, -hh * 0.5),
		Vector2(-hw * 0.3, hh * 0.3),
		Vector2(0, -hh * 0.6),
		Vector2(hw * 0.4, hh * 0.5),
		Vector2(hw * 0.85, -hh * 0.2)
	])
	crack_stage2.points = pts2
	add_child(crack_stage2)

func _process(delta: float) -> void:
	if spawn_settle_timer > 0.0:
		spawn_settle_timer -= delta

func wake_up() -> void:
	if is_awake or is_destroyed: return
	is_awake = true
	set_deferred("freeze", false)
	_wake_up_neighbors()

func _wake_up_neighbors() -> void:
	var space_state = get_world_2d().direct_space_state
	if not space_state: return
	var query = PhysicsShapeQueryParameters2D.new()
	var sphere = CircleShape2D.new()
	sphere.radius = max(block_size.x, block_size.y) * 0.7 + 45.0
	query.shape = sphere
	query.transform = Transform2D(0, global_position)
	query.collide_with_bodies = true
	query.exclude = [get_rid()]

	var hits = space_state.intersect_shape(query, 16)
	for h in hits:
		var b = h.collider
		if is_instance_valid(b) and b != self:
			if b.has_method("wake_up"):
				b.wake_up()

func _on_impact(body: Node) -> void:
	if is_destroyed or spawn_settle_timer > 0.0: return
	if not is_awake:
		wake_up()

	if body is RigidBody2D:
		var rel_vel = (linear_velocity - body.linear_velocity).length()
		if rel_vel > 130.0:
			var impact_dmg = (rel_vel - 130.0) * (body.mass * 0.45)
			take_damage(impact_dmg, global_position)

func take_damage(amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_destroyed: return
	if not is_awake:
		wake_up()

	current_health -= amount

	if current_health <= max_health * 0.70 and crack_stage1:
		crack_stage1.visible = true
	if current_health <= max_health * 0.35 and crack_stage2:
		crack_stage2.visible = true

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

	# Đánh thức toàn bộ các khối lân cận trước khi biến mất để chống dính lơ lửng!
	_wake_up_neighbors()

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

	if visual_mesh: visual_mesh.visible = false
	if crack_stage1: crack_stage1.visible = false
	if crack_stage2: crack_stage2.visible = false

	$CollisionShape2D.set_deferred("disabled", true)
	set_deferred("freeze", true)

	CameraShake.add_trauma(0.12 if material_type in ["steel", "obsidian"] else 0.08)

	await get_tree().create_timer(0.4).timeout
	queue_free()
