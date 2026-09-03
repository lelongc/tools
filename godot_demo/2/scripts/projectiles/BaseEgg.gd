extends RigidBody2D
class_name BaseEgg

const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")

@export var egg_name: String = "Normal Egg"
@export var base_damage: float = 120.0
@export var min_impact_speed: float = 80.0
@export var max_bounces_before_break: int = 2

var bounces: int = 0
var is_broken: bool = false

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var trail_particles: CPUParticles2D = get_node_or_null("Trail")
@onready var break_particles: CPUParticles2D = get_node_or_null("BreakFX")

func _ready() -> void:
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

	if trail_particles:
		ParticleHelper.apply_circle_fx(trail_particles, 0.25, 0.5)
	if break_particles:
		ParticleHelper.apply_shard_fx(break_particles, 0.3, 0.6)

func _physics_process(delta: float) -> void:
	if is_broken: return

	# Tự xoay quả trứng theo chiều vector vận tốc
	if linear_velocity.length() > 30.0:
		var target_rot = linear_velocity.angle() + PI * 0.5
		rotation = lerp_angle(rotation, target_rot, 12.0 * delta)

	# Squash & Stretch theo tốc độ rơi
	if visual_root:
		var spd = linear_velocity.length()
		var stretch = clamp(spd / 600.0, 0.0, 0.4)
		visual_root.scale = Vector2(1.0 - stretch * 0.5, 1.0 + stretch)

func _on_body_entered(body: Node) -> void:
	if is_broken: return

	var speed = linear_velocity.length()
	if speed < min_impact_speed: return

	# Gây sát thương vật lý lên khối bị va chạm
	if body.has_method("take_damage"):
		var damage_dealt = base_damage * (speed / 300.0)
		body.take_damage(damage_dealt, global_position)

	# Camera micro shake khi va chạm mạnh
	if speed > 250.0:
		CameraShake2D.add_trauma(0.15)

	bounces += 1
	if bounces >= max_bounces_before_break:
		_crack_and_destroy()

func _crack_and_destroy() -> void:
	if is_broken: return
	is_broken = true
	
	linear_velocity = Vector2.ZERO
	freeze = true

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
