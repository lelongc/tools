extends Area2D
class_name UpdraftVent

@export var wind_force: float = 1400.0

@onready var wind_fx: CPUParticles2D = $WindFX

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)

var overlapping_bodies: Array[RigidBody2D] = []

func _on_body_entered(body: Node2D) -> void:
	if body is RigidBody2D and not body in overlapping_bodies:
		overlapping_bodies.append(body)

func _on_body_exited(body: Node2D) -> void:
	if body in overlapping_bodies:
		overlapping_bodies.erase(body)

func _physics_process(delta: float) -> void:
	for body in overlapping_bodies:
		if is_instance_valid(body) and not body.freeze:
			body.apply_central_force(Vector2(0, -wind_force))
