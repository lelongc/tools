extends RigidBody2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var egg_name: String = "Heavy Normal Egg"
@export var base_damage: float = 130.0
@export var min_impact_speed: float = 80.0
@export var max_bounces_before_break: int = 2

var bounces: int = 0
var is_broken: bool = false
var has_boosted: bool = false

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var trail_particles: CPUParticles2D = get_node_or_null("Trail")
@onready var break_particles: CPUParticles2D = get_node_or_null("BreakFX")

func _ready() -> void:
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)

func _unhandled_input(event: InputEvent) -> void:
	# Tap-in-Flight: Chạm màn hình khi đang bay để hóa Trứng Kim Cương Siêu Nặng
	if not is_broken and not has_boosted and (event is InputEventMouseButton or event is InputEventScreenTouch) and event.is_pressed():
		_activate_special_ability()

func _activate_special_ability() -> void:
	has_boosted = true
	mass = 7.0
	base_damage = 260.0
	linear_velocity = Vector2(0, max(linear_velocity.y * 1.4, 700.0))
	CameraShake.add_trauma(0.25)

	if visual_root:
		var tween = create_tween()
		tween.tween_property(visual_root, "scale", Vector2(1.6, 1.6), 0.1)
		var body = visual_root.get_node_or_null("EggBody")
		if body: body.color = Color(0.3, 0.85, 1.0) # Hóa kim cương xanh óng ánh

func _physics_process(delta: float) -> void:
	if is_broken: return

	if linear_velocity.length() > 30.0:
		var target_rot = linear_velocity.angle() + PI * 0.5
		rotation = lerp_angle(rotation, target_rot, 12.0 * delta)

	if visual_root:
		var spd = linear_velocity.length()
		var stretch = clamp(spd / 600.0, 0.0, 0.4)
		visual_root.scale = Vector2(1.0 - stretch * 0.5, 1.0 + stretch)

func _on_body_entered(body: Node) -> void:
	if is_broken: return

	var speed = linear_velocity.length()
	if speed < min_impact_speed: return

	if body.has_method("take_damage"):
		var damage_dealt = base_damage * (speed / 300.0)
		body.take_damage(damage_dealt, global_position)

	if speed > 250.0:
		CameraShake.add_trauma(0.15)

	bounces += 1
	if bounces >= max_bounces_before_break:
		_crack_and_destroy()

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
