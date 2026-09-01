extends Area2D

@export var slip_speed: float = 460.0
@export var slip_duration: float = 1.2

@onready var visual: Node2D = $Visual
@onready var particles: CPUParticles2D = $Sparks

func _ready() -> void:
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node2D) -> void:
	if body is CharacterBody2D and body.has_method("trigger_banana_slip"):
		body.trigger_banana_slip(slip_speed, slip_duration)
		if particles:
			particles.restart()
			particles.emitting = true
		if visual:
			var tween = create_tween()
			tween.tween_property(visual, "scale", Vector2(1.4, 0.4), 0.1)
			tween.tween_property(visual, "scale", Vector2(1.0, 1.0), 0.15)
