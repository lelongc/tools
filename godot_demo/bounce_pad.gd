extends Area3D

@export var bounce_force: float = 15.0

func _ready():
	body_entered.connect(_on_body_entered)

func _on_body_entered(body):
	if body.has_method("is_player") and body.is_multiplayer_authority():
		if body.has_method("apply_bounce"):
			body.apply_bounce(bounce_force)
