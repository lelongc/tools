extends RigidBody2D

var lifetime: float = 3.0
var peck_damage: float = 50.0

@onready var visual: Node2D = $Visual

func _ready() -> void:
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

func _process(delta: float) -> void:
	lifetime -= delta
	if lifetime <= 0.0:
		queue_free()

	if visual and linear_velocity.length() > 20.0:
		visual.rotation = sin(Time.get_ticks_msec() * 0.03) * 0.3

func _on_impact(body: Node) -> void:
	if body.has_method("wake_up"):
		body.wake_up()

	if body.has_method("take_damage"):
		body.take_damage(peck_damage, global_position)
		peck_damage = max(peck_damage - 15.0, 10.0)

	# Bật nảy ngẫu nhiên
	apply_central_impulse(Vector2(randf_range(-150.0, 150.0), -200.0))
