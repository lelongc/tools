extends RigidBody2D
class_name RollingBoulder

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var crush_damage: float = 400.0

var is_awake: bool = false

func _ready() -> void:
	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC
	mass = 25.0
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

func wake_up() -> void:
	if is_awake: return
	is_awake = true
	set_deferred("freeze", false)

func _on_impact(body: Node) -> void:
	if not is_awake: wake_up()

	if body.has_method("wake_up"):
		body.wake_up()

	var speed = linear_velocity.length()
	if speed > 100.0 and body.has_method("take_damage"):
		body.take_damage(crush_damage * (speed / 200.0), global_position)
		CameraShake.add_trauma(0.2)

func take_damage(_amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if not is_awake: wake_up()
