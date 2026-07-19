extends Area3D
@export var wind_direction = Vector3(1, 0, 0)
@export var wind_force = 10.0

func _physics_process(delta):
	for body in get_overlapping_bodies():
		if body.is_in_group("player") and body.is_multiplayer_authority() and body.has_method("apply_knockback"):
			body.apply_knockback(wind_direction * wind_force * delta)
