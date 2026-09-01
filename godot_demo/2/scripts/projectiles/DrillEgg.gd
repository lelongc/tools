extends RigidBody2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var egg_name: String = "Drill Egg"
@export var drill_duration: float = 0.85
@export var drill_speed: float = 580.0
@export var drill_damage_per_tick: float = 85.0

var is_broken: bool = false
var is_drilling: bool = false
var drill_timer: float = 0.0

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var spark_particles: CPUParticles2D = get_node_or_null("SparkFX")
@onready var break_particles: CPUParticles2D = get_node_or_null("BreakFX")

func _ready() -> void:
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node) -> void:
	if is_broken: return

	if not is_drilling:
		_start_drilling()

	if body.has_method("take_damage"):
		body.take_damage(drill_damage_per_tick * 1.5, global_position)
		CameraShake.add_trauma(0.2)

func _start_drilling() -> void:
	is_drilling = true
	drill_timer = drill_duration
	gravity_scale = 2.0
	linear_velocity = Vector2(0, drill_speed)

	if spark_particles:
		spark_particles.restart()
		spark_particles.emitting = true

func _physics_process(delta: float) -> void:
	if is_broken: return

	if is_drilling:
		drill_timer -= delta
		
		if visual_root:
			visual_root.rotation += 45.0 * delta

		linear_velocity.y = drill_speed
		linear_velocity.x = move_toward(linear_velocity.x, 0.0, 300.0 * delta)

		var space_state = get_world_2d().direct_space_state
		var query = PhysicsShapeQueryParameters2D.new()
		var circle = CircleShape2D.new()
		circle.radius = 24.0
		query.shape = circle
		query.transform = global_transform
		query.collide_with_bodies = true

		for res in space_state.intersect_shape(query, 8):
			var col = res.collider
			if is_instance_valid(col) and col != self and col.has_method("take_damage"):
				col.take_damage(drill_damage_per_tick * delta * 10.0, global_position)

		if drill_timer <= 0.0:
			_crack_and_destroy()
	else:
		if linear_velocity.length() > 30.0:
			var target_rot = linear_velocity.angle() + PI * 0.5
			rotation = lerp_angle(rotation, target_rot, 12.0 * delta)

func _crack_and_destroy() -> void:
	if is_broken: return
	is_broken = true
	
	set_deferred("freeze", true)

	if break_particles:
		break_particles.restart()
		break_particles.emitting = true

	if visual_root:
		var tween = create_tween()
		tween.tween_property(visual_root, "scale", Vector2(1.4, 0.4), 0.08)
		tween.tween_property(visual_root, "modulate:a", 0.0, 0.12)
		await tween.finished

	await get_tree().create_timer(0.4).timeout
	queue_free()
