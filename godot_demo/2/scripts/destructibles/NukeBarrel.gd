extends RigidBody2D
class_name NukeBarrel

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var explosion_radius: float = 450.0
@export var explosion_force: float = 2400.0
@export var explosion_damage: float = 1500.0

var is_ignited: bool = false
var is_awake: bool = false
var spawn_settle_timer: float = 0.5

@onready var visual: Polygon2D = get_node_or_null("Visual")
@onready var radiation_sparks: CPUParticles2D = get_node_or_null("RadiationSparks")
@onready var nuke_fx: CPUParticles2D = get_node_or_null("NukeFX")

func _ready() -> void:
	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC
	linear_damp = 1.0

	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

func _process(delta: float) -> void:
	if spawn_settle_timer > 0.0:
		spawn_settle_timer -= delta

func wake_up() -> void:
	if is_awake or is_ignited: return
	is_awake = true
	set_deferred("freeze", false)

func _on_impact(body: Node) -> void:
	if is_ignited or spawn_settle_timer > 0.0: return
	if not is_awake: wake_up()

	if body is RigidBody2D:
		var speed = (linear_velocity - body.linear_velocity).length()
		if speed > 150.0:
			take_damage(50.0, global_position)

func take_damage(_amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_ignited: return
	if not is_awake: wake_up()
	is_ignited = true
	_critical_meltdown()

func _critical_meltdown() -> void:
	if radiation_sparks:
		radiation_sparks.restart()
		radiation_sparks.emitting = true

	var tween = create_tween().set_loops(4)
	if visual:
		tween.tween_property(visual, "color", Color(1.0, 1.0, 1.0), 0.04)
		tween.tween_property(visual, "color", Color(0.2, 0.9, 0.2), 0.04)
	
	await tween.finished
	_detonate_nuke()

func _detonate_nuke() -> void:
	CameraShake.hit_stop(0.12)
	CameraShake.add_trauma(1.0)
	GameManager.add_score(800)

	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_synth_tone(70.0, 0.8, "boom", 4.0)

	set_deferred("freeze", true)
	if visual: visual.visible = false
	$CollisionShape2D.set_deferred("disabled", true)

	if nuke_fx:
		nuke_fx.restart()
		nuke_fx.emitting = true

	var space_state = get_world_2d().direct_space_state
	var query = PhysicsShapeQueryParameters2D.new()
	var circle_shape = CircleShape2D.new()
	circle_shape.radius = explosion_radius
	query.shape = circle_shape
	query.transform = global_transform
	query.collide_with_bodies = true

	for res in space_state.intersect_shape(query, 64):
		var col = res.collider
		if is_instance_valid(col) and col != self:
			var diff = col.global_position - global_position
			var dist = max(diff.length(), 10.0)
			var dir = diff.normalized()
			var falloff = 1.0 - clamp(dist / explosion_radius, 0.0, 0.8)

			if col.has_method("wake_up"):
				col.wake_up()

			if col is RigidBody2D:
				var push = dir * explosion_force * falloff
				if push.y > -0.2: push.y = -abs(push.y) * 0.9 - 350.0
				col.apply_central_impulse(push)

			if col.has_method("take_damage"):
				col.take_damage(explosion_damage * falloff, global_position)

	await get_tree().create_timer(0.8).timeout
	queue_free()
