extends Camera3D
class_name CameraController

@export var target: Node3D
@export var base_offset: Vector3 = Vector3(0, 4.0, 7.5)
@export var smooth_speed: float = 10.0

func _physics_process(delta: float) -> void:
	if not is_instance_valid(target):
		return
		
	# Tinh toan chieu cao co de nang camera len khi co vuon cao
	var neck_h = 1.5
	if target.has_method("get") and target.get("current_neck_height"):
		neck_h = target.get("current_neck_height")
		
	var target_pos = target.global_position + base_offset
	# Nang camera len theo 40% chieu cao co de nhin duoc ca dau va chan
	target_pos.y += neck_h * 0.45
	target_pos.z += neck_h * 0.25 # Lui lai nhe khi co qua cao de khong bi che khuat
	
	global_position.z = lerp(global_position.z, target_pos.z, smooth_speed * delta)
	global_position.y = lerp(global_position.y, target_pos.y, smooth_speed * delta)
	global_position.x = lerp(global_position.x, target.global_position.x * 0.35, smooth_speed * delta)
