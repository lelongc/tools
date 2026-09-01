extends BaseEgg
class_name BombEgg

@export var explosion_radius: float = 160.0
@export var explosion_force: float = 850.0
@export var explosion_damage: float = 350.0

@onready var explosion_area: Area2D = get_node_or_null("ExplosionArea")
@onready var explosion_particles: CPUParticles2D = get_node_or_null("ExplosionFX")

func _on_body_entered(body: Node) -> void:
	if is_broken: return
	_detonate()

func _detonate() -> void:
	if is_broken: return
	is_broken = true

	# Hit-stop và chấn động camera cực mạnh
	CameraShake2D.hit_stop(0.06)
	CameraShake2D.add_trauma(0.85)

	# Vô hiệu hóa vật lý quả trứng
	freeze = true
	linear_velocity = Vector2.ZERO
	if visual_root: visual_root.visible = false

	# Kích hoạt hạt lửa nổ
	if explosion_particles:
		explosion_particles.restart()
		explosion_particles.emitting = true

	# Quét toàn bộ vật thể trong bán kính nổ
	var space_state = get_world_2d().direct_space_state
	var query = PhysicsShapeQueryParameters2D.new()
	var circle_shape = CircleShape2D.new()
	circle_shape.radius = explosion_radius
	query.shape = circle_shape
	query.transform = global_transform
	query.collide_with_bodies = true
	query.collide_with_areas = true

	var results = space_state.intersect_shape(query, 32)
	for res in results:
		var collider = res.collider
		if is_instance_valid(collider) and collider != self:
			var diff = collider.global_position - global_position
			var dist = max(diff.length(), 10.0)
			var dir = diff.normalized()
			var falloff = 1.0 - clamp(dist / explosion_radius, 0.0, 0.8)

			# 1. Đẩy văng vật lý
			if collider is RigidBody2D:
				var push_impulse = dir * explosion_force * falloff
				if push_impulse.y > -0.2:
					push_impulse.y = -abs(push_impulse.y) * 0.7 - 200.0
				collider.apply_central_impulse(push_impulse)

			# 2. Gây sát thương nổ
			if collider.has_method("take_damage"):
				collider.take_damage(explosion_damage * falloff, global_position)

	await get_tree().create_timer(0.6).timeout
	queue_free()
