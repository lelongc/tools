extends Area3D

@export var is_upside_down: bool = true

func _ready():
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)

func _on_body_entered(body):
	if body.has_method("is_player"):
		body.gravity_direction = Vector3.UP if is_upside_down else Vector3.DOWN
		if SoundManager and body.is_multiplayer_authority():
			SoundManager.play_bounce()

func _on_body_exited(body):
	if body.has_method("is_player"):
		body.gravity_direction = Vector3.DOWN
