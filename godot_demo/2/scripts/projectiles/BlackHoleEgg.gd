extends RigidBody2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var egg_name: String = "Black Hole Vortex Egg"
@export var vortex_radius: float = 240.0
@export var vortex_duration: float = 1.2
@export var pull_force: float = 1200.0
@export var blast_damage: float = 400.0

var is_broken: bool = false
var is_singularity: bool = false
var vortex_timer: float = 0.0

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var vortex_particles: CPUParticles2D = get_node_or_null("VortexFX")

func _ready() -> void:
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

	ParticleHelper.setup_egg_visual(visual_root, "res://assets/sprites/projectiles/egg_blackhole.svg")

	if vortex_particles:
		ParticleHelper.apply_void_fx(vortex_particles, 0.3, 0.65)
		vortex_particles.color = Color(0.85, 0.35, 1.0, 0.95)

func _unhandled_input(event: InputEvent) -> void:
	if not is_broken and not is_singularity and event is InputEventMouseButton and event.pressed:
		_trigger_vortex()

func _on_body_entered(_body: Node) -> void:
	if is_broken or is_singularity: return
	_trigger_vortex()

func _trigger_vortex() -> void:
	if is_broken or is_singularity: return
	is_singularity = true
	vortex_timer = vortex_duration

	CameraShake.add_trauma(0.6)
	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_synth_tone(140.0, 1.0, "laser", 3.0)

	set_deferred("freeze", true)
	if visual_root: visual_root.visible = false

	if vortex_particles:
		vortex_particles.restart()
		vortex_particles.emitting = true

func _physics_process(delta: float) -> void:
	if not is_singularity:
		if linear_velocity.length() > 30.0:
			var target_rot = linear_velocity.angle() + PI * 0.5
			rotation = lerp_angle(rotation, target_rot, 12.0 * delta)
	else:
		vortex_timer -= delta

		# Hút mọi khối đá và quái vật vào tâm
		var space_state = get_world_2d().direct_space_state
		var query = PhysicsShapeQueryParameters2D.new()
		var circle = CircleShape2D.new()
		circle.radius = vortex_radius
		query.shape = circle
		query.transform = global_transform
		query.collide_with_bodies = true

		for res in space_state.intersect_shape(query, 32):
			var col = res.collider
			if is_instance_valid(col) and col != self:
				if col.has_method("wake_up"):
					col.wake_up()

				if col is RigidBody2D:
					var diff = global_position - col.global_position
					var dir = diff.normalized()
					col.apply_central_force(dir * pull_force)

		if vortex_timer <= 0.0:
			_supernova_blast()

func _supernova_blast() -> void:
	is_singularity = false
	is_broken = true

	CameraShake.hit_stop(0.08)
	CameraShake.add_trauma(0.9)
	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_explosion()

	# Bắn hạt hố đen: Tinh vân tím không gian + Mảnh vỡ không thời gian + Sao hấp dẫn neon
	ParticleHelper.spawn_egg_break_fx(get_parent(), global_position, "blackhole", false)

	var space_state = get_world_2d().direct_space_state
	var query = PhysicsShapeQueryParameters2D.new()
	var circle = CircleShape2D.new()
	circle.radius = vortex_radius
	query.shape = circle
	query.transform = global_transform
	query.collide_with_bodies = true

	for res in space_state.intersect_shape(query, 32):
		var col = res.collider
		if is_instance_valid(col) and col != self:
			var diff = col.global_position - global_position
			var dir = diff.normalized()

			if col is RigidBody2D:
				col.apply_central_impulse(dir * 1400.0)

			if col.has_method("take_damage"):
				col.take_damage(blast_damage, global_position)

	await get_tree().create_timer(0.4).timeout
	queue_free()
