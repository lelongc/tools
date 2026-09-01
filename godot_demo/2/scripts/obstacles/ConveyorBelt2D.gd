extends StaticBody2D

@export var belt_speed: float = 180.0

@onready var visual_arrow: Node2D = get_node_or_null("VisualArrows")

func _ready() -> void:
	constant_linear_velocity = Vector2(belt_speed, 0)

func _process(delta: float) -> void:
	if visual_arrow:
		visual_arrow.position.x += belt_speed * delta * 0.4
		if visual_arrow.position.x > 30.0:
			visual_arrow.position.x = -30.0
		elif visual_arrow.position.x < -30.0:
			visual_arrow.position.x = 30.0
