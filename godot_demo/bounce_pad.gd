extends Area3D

@export var bounce_force: float = 15.0

func _ready():
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node3D):
	if body is CharacterBody3D:
		body.velocity.y = bounce_force
