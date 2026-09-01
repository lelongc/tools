extends BaseEgg
class_name DrillEgg

@export var drill_duration: float = 0.85
@export var drill_speed: float = 580.0
@export var drill_damage_per_tick: float = 85.0

var is_drilling: bool = false
var drill_timer: float = 0.0

@onready var spark_particles: CPUParticles2D = get_node_or_null("SparkFX")

func _on_body_entered(body: Node) -> void:
	if is_broken: return

	if not is_drilling:
		_start_drilling()

	if body.has_method("take_damage"):
		body.take_damage(drill_damage_per_tick * 1.5, global_position)
		CameraShake2D.add_trauma(0.2)

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
		
		# Xoay tít mũi khoan
		if visual_root:
			visual_root.rotation += 45.0 * delta

		# Duy trì lực đâm thẳng xuống
		linear_velocity.y = drill_speed
		linear_velocity.x = move_toward(linear_velocity.x, 0.0, 300.0 * delta)

		# Quét sát thương liên tục xung quanh mũi khoan
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
		super._physics_process(delta)
