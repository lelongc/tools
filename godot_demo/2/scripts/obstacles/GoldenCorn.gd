extends Area2D

signal collected()

var is_collected: bool = false
var start_y: float = 0.0

@onready var visual: Node2D = get_node_or_null("Visual")
@onready var particles: CPUParticles2D = get_node_or_null("Sparkles")

func _ready() -> void:
	start_y = position.y
	body_entered.connect(_on_body_entered)

func _process(_delta: float) -> void:
	if is_collected: return
	var t = Time.get_ticks_msec() / 1000.0
	position.y = start_y + sin(t * 4.0) * 6.0
	if visual:
		visual.rotation = sin(t * 3.0) * 0.15

func _on_body_entered(body: Node2D) -> void:
	if is_collected: return
	if body is CharacterBody2D:
		is_collected = true
		collected.emit()

		if particles:
			particles.restart()
			particles.emitting = true

		if visual:
			var tween = create_tween()
			tween.tween_property(visual, "scale", Vector2(1.5, 1.5), 0.1)
			tween.tween_property(visual, "modulate:a", 0.0, 0.15)
			await tween.finished

		queue_free()
