extends RigidBody2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var egg_name: String = "Bomb Egg"
@export var explosion_radius: float = 145.0
@export var explosion_force: float = 750.0
@export var explosion_damage: float = 280.0

var is_broken: bool = false
var has_boosted: bool = false

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var explosion_particles: CPUParticles2D = get_node_or_null("ExplosionFX")

func _ready() -> void:
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

	ParticleHelper.setup_egg_visual(visual_root, "res://assets/sprites/projectiles/egg_bomb.svg")

	var fuse_sparks = get_node_or_null("VisualRoot/Fuse/FuseSparks") as CPUParticles2D
	if fuse_sparks:
		ParticleHelper.apply_spark_fx(fuse_sparks, 0.3, 0.6)

	if explosion_particles:
		ParticleHelper.apply_circle_fx(explosion_particles, 0.35, 0.75)

	var trail = get_node_or_null("Trail") as CPUParticles2D
	if trail:
		ParticleHelper.apply_circle_fx(trail, 0.25, 0.5)

func _unhandled_input(event: InputEvent) -> void:
	if not is_broken and not has_boosted and (event is InputEventMouseButton or event is InputEventScreenTouch) and event.is_pressed():
		has_boosted = true
		_detonate()

func _physics_process(delta: float) -> void:
	if is_broken: return
	if linear_velocity.length() > 30.0:
		var target_rot = linear_velocity.angle() + PI * 0.5
		rotation = lerp_angle(rotation, target_rot, 12.0 * delta)

func _on_body_entered(_body: Node) -> void:
	if is_broken: return
	_detonate()

func _detonate() -> void:
	if is_broken: return
	is_broken = true

	CameraShake.hit_stop(0.06)
	CameraShake.add_trauma(0.85)

	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_explosion()

	CartoonExplosionFX.spawn_comic_explosion(get_parent(), global_position, explosion_radius)
	ParticleHelper.spawn_egg_break_fx(get_parent(), global_position, "bomb", false)

	set_deferred("freeze", true)
	if visual_root: visual_root.visible = false

	if explosion_particles:
		explosion_particles.restart()
		explosion_particles.emitting = true

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

			if collider.has_method("wake_up"):
				collider.wake_up()

			if collider is RigidBody2D:
				var push_impulse = dir * explosion_force * falloff
				if push_impulse.y > -0.2:
					push_impulse.y = -abs(push_impulse.y) * 0.7 - 200.0
				collider.apply_central_impulse(push_impulse)

			if collider.has_method("take_damage"):
				collider.take_damage(explosion_damage * falloff, global_position)

	# Thông báo cho quái vật xung quanh về vụ nổ gần kề
	var enemies = get_tree().get_nodes_in_group("Enemies")
	for enemy in enemies:
		if is_instance_valid(enemy) and enemy.has_method("on_near_explosion"):
			enemy.on_near_explosion(global_position, explosion_radius)

	await get_tree().create_timer(0.6).timeout
	queue_free()
