extends Camera3D
class_name CameraController

@export var target: Node3D
@export var offset: Vector3 = Vector3(0, 4.5, 6.0)
@export var smooth_speed: float = 12.0

func _physics_process(delta: float) -> void:
	if is_instance_valid(target):
		var target_pos = target.global_position + offset
		# Theo sau trục Z và Y, giữ trục X ổn định hơn để không bị chóng mặt
		global_position.z = lerp(global_position.z, target_pos.z, smooth_speed * delta)
		global_position.y = lerp(global_position.y, target_pos.y, smooth_speed * delta)
		global_position.x = lerp(global_position.x, target.global_position.x * 0.35, smooth_speed * delta)
