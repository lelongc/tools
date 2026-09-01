extends RigidBody2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var egg_name: String = "Acid Lava Egg"
@export var puddle_radius: float = 120.0
@export var acid_duration: float = 1.6
@export var damage_per_sec: float = 180.0

var is_broken: bool = false
var is_melting: bool = false
var melt_timer: float = 0.0

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var acid_particles: CPUParticles2D = get_node_or_null("AcidFX")

func _ready() -> void:
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

func _on_body_entered(_body: Node) -> void:
	if is_broken: return
	_start_acid_melting()

func _start_acid_melting() -> void:
	if is_broken: return
	is_broken = true
	is_melting = true
	melt_timer = acid_duration

	CameraShake.add_trauma(0.3)
	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_egg_drop()

	set_deferred("freeze", true)
	if visual_root: visual_root.visible = false

	if acid_particles:
		acid_particles.restart()
		acid_particles.emitting = true

func _physics_process(delta: float) -> void:
	if not is_melting:
		if linear_velocity.length() > 30.0:
			var target_rot = linear_velocity.angle() + PI * 0.5
			rotation = lerp_angle(rotation, target_rot, 12.0 * delta)
	else:
		melt_timer -= delta
		
		# Quét và ăn mòn toàn bộ dầm sắt / kết cấu trong vũng axit
		var space_state = get_world_2d().direct_space_state
		var query = PhysicsShapeQueryParameters2D.new()
		var circle = CircleShape2D.new()
		circle.radius = puddle_radius
		query.shape = circle
		query.transform = global_transform
		query.collide_with_bodies = true

		for res in space_state.intersect_shape(query, 16):
			var col = res.collider
			if is_instance_valid(col) and col != self:
				if col.has_method("wake_up"):
					col.wake_up()
				if col.has_method("take_damage"):
					col.take_damage(damage_per_sec * delta, global_position)

		if melt_timer <= 0.0:
			is_melting = false
			queue_free()
