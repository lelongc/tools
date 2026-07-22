extends Node3D
@onready var ground = $Ground

func _physics_process(delta):
	ground.scale.x = max(0.1, ground.scale.x - 0.2 * delta)
	ground.scale.z = max(0.1, ground.scale.z - 0.2 * delta)
