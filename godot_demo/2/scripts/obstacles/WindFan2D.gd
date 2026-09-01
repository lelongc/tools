extends Area2D

@export var wind_force: Vector2 = Vector2(0, -650.0)
@export var fan_spin_speed: float = 12.0

@onready var blades: Node2D = get_node_or_null("Blades")
@onready var wind_particles: CPUParticles2D = get_node_or_null("WindParticles")

func _ready() -> void:
	body_entered.connect(_on_body_entered)

func _physics_process(delta: float) -> void:
	if blades:
		blades.rotation += fan_spin_speed * delta

	for body in get_overlapping_bodies():
		if body is CharacterBody2D and "velocity" in body:
			var mult = 1.6 if ("is_puffed" in body and body.is_puffed) else 0.8
			body.velocity += wind_force * delta * mult

func _on_body_entered(body: Node2D) -> void:
	if body is CharacterBody2D and body.has_method("_trigger_squash"):
		body._trigger_squash(Vector2(0.8, 1.3))
