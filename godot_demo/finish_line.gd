extends Area3D

func _ready():
	body_entered.connect(_on_body_entered)

func _on_body_entered(body):
	if multiplayer.is_server() and body.has_method("is_player"):
		if GameManager.current_mode == GameManager.GameMode.RACE:
			GameManager.end_round(body.name.to_int())
