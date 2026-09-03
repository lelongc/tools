extends RigidBody2D
class_name TNTBarrel

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")
const CartoonExplosionFX = preload("res://scripts/core/CartoonExplosionFX.gd")

@export var explosion_radius: float = 220.0
@export var explosion_force: float = 1200.0
@export var explosion_damage: float = 600.0

var is_ignited: bool = false
var is_awake: bool = false
var spawn_settle_timer: float = 0.5

@onready var visual: Polygon2D = get_node_or_null("Visual")
@onready var fuse_sparks: CPUParticles2D = get_node_or_null("FuseSparks")
@onready var explosion_fx: CPUParticles2D = get_node_or_null("ExplosionFX")

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

	if not is_awake:
		wake_up()

	if body is RigidBody2D:
		var speed = (linear_velocity - body.linear_velocity).length()
		if speed > 150.0:
			take_damage(50.0, global_position)

func take_damage(_amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_ignited: return
	if not is_awake:
		wake_up()
	is_ignited = true
	_ignite_fuse()

func _ignite_fuse() -> void:
	if fuse_sparks:
		fuse_sparks.restart()
		fuse_sparks.emitting = true

	var tween = create_tween().set_loops(3)
	if visual:
		tween.tween_property(visual, "color", Color(1.0, 1.0, 1.0), 0.05)
		tween.tween_property(visual, "color", Color(0.9, 0.2, 0.15), 0.05)
	
	await tween.finished
	_detonate()

func _detonate() -> void:
	CameraShake.hit_stop(0.08)
	CameraShake.add_trauma(1.0)
	GameManager.add_score(300)

	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_explosion()

	CartoonExplosionFX.spawn_comic_explosion(get_parent(), global_position, explosion_radius)

	set_deferred("freeze", true)
	if visual: visual.visible = false
	$CollisionShape2D.set_deferred("disabled", true)

	if explosion_fx:
		explosion_fx.restart()
		explosion_fx.emitting = true

	var space_state = get_world_2d().direct_space_state
	var query = PhysicsShapeQueryParameters2D.new()
	var circle_shape = CircleShape2D.new()
	circle_shape.radius = explosion_radius
	query.shape = circle_shape
	query.transform = global_transform
	query.collide_with_bodies = true

	for res in space_state.intersect_shape(query, 32):
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
				if push.y > -0.2: push.y = -abs(push.y) * 0.8 - 250.0
				col.apply_central_impulse(push)

			if col.has_method("take_damage"):
				col.take_damage(explosion_damage * falloff, global_position)

	await get_tree().create_timer(0.6).timeout
	queue_free()
