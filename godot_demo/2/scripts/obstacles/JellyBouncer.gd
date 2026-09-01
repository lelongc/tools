extends Area2D

@export var bounce_force: float = 680.0

@onready var visual_pad: Node2D = get_node_or_null("Visual")
@onready var spark_fx: CPUParticles2D = get_node_or_null("Sparks")

func _ready() -> void:
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node2D) -> void:
	if body is CharacterBody2D and body.has_method("bounce_off_pad"):
		body.bounce_off_pad(bounce_force)
		_trigger_jelly_squish()

func _trigger_jelly_squish() -> void:
	if spark_fx:
		spark_fx.restart()
		spark_fx.emitting = true

	if visual_pad:
		var tween = create_tween()
		tween.tween_property(visual_pad, "scale", Vector2(1.35, 0.45), 0.06)
		tween.tween_property(visual_pad, "scale", Vector2(0.85, 1.25), 0.12)
		tween.tween_property(visual_pad, "scale", Vector2(1.0, 1.0), 0.1)
