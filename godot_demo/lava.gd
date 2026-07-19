extends Area3D

func _ready():
	body_entered.connect(_on_body_entered)

func _physics_process(delta):
	position.y += 0.5 * delta

func _on_body_entered(body):
	if multiplayer.is_server() and body.has_method("is_player"):
		if "is_dead" in body and body.is_dead:
			return
		GameManager.report_death(body.name.to_int())
		if body.has_method("die"):
			body.rpc("die")
