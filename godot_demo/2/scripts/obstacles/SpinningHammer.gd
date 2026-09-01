extends Area2D

@export var rotation_speed: float = 2.0
@export var knockback_power: float = 480.0

@onready var hammer_visual: Node2D = get_node_or_null("HammerHead")

func _ready() -> void:
	body_entered.connect(_on_body_entered)

func _physics_process(delta: float) -> void:
	rotation += rotation_speed * delta

func _on_body_entered(body: Node2D) -> void:
	if body is CharacterBody2D and "velocity" in body:
		var knock_dir = (body.global_position - global_position).normalized()
		if knock_dir.y > -0.2:
			knock_dir.y = -0.5
			knock_dir = knock_dir.normalized()
		body.velocity = knock_dir * knockback_power
		if body.has_method("_trigger_squash"):
			body._trigger_squash(Vector2(1.3, 0.6))
