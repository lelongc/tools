extends Area2D
class_name UpdraftVent

@export var wind_force: float = 1400.0

@onready var wind_fx: CPUParticles2D = $WindFX
@onready var base_grate: Sprite2D = get_node_or_null("BaseGrate")

func _ready() -> void:
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)
	if base_grate:
		var tg = ParticleHelper._safe_load("res://assets/sprites/obstacles/updraft_vent_grate.svg")
		if tg: base_grate.texture = tg
	if wind_fx:
		ParticleHelper.apply_wind_fx(wind_fx, 0.3, 0.6)

var overlapping_bodies: Array[RigidBody2D] = []

func _on_body_entered(body: Node2D) -> void:
	if body is RigidBody2D and not body in overlapping_bodies:
		if body is DestructibleBlock and body.mass > 1.2:
			return # Không nâng các cột trụ và dầm chịu lực của công trình
		overlapping_bodies.append(body)

func _on_body_exited(body: Node2D) -> void:
	if body in overlapping_bodies:
		overlapping_bodies.erase(body)

func _physics_process(_delta: float) -> void:
	for i in range(overlapping_bodies.size() - 1, -1, -1):
		var body = overlapping_bodies[i]
		if not is_instance_valid(body) or body.is_queued_for_deletion():
			overlapping_bodies.remove_at(i)
		elif not body.freeze:
			var lift = wind_force
			if body.linear_velocity.y < -380.0:
				lift *= 0.15 # Hãm lực khi vận tốc bốc lên đã đạt ngưỡng trần
			var turb_x = randf_range(-140.0, 140.0)
			body.apply_central_force(Vector2(turb_x, -lift))
