extends Camera3D
class_name SharedCamera3D

## SharedCamera3D.gd
## Camera 3D Co-op thông minh: Tự động điều chỉnh khoảng cách và góc nhìn theo 2 người chơi

@export var min_distance: float = 12.0
@export var max_distance: float = 26.0
@export var smooth_speed: float = 6.0

func _process(delta: float) -> void:
	var players = get_tree().get_nodes_in_group("players")
	if players.is_empty():
		return
		
	var center = Vector3.ZERO
	var valid_count = 0
	for p in players:
		if p is Node3D:
			center += p.global_position
			valid_count += 1
			
	if valid_count == 0:
		return
		
	center /= float(valid_count)
	
	# Tính khoảng cách xa nhất giữa các người chơi
	var max_spread: float = 0.0
	for p in players:
		if p is Node3D:
			var d = p.global_position.distance_to(center)
			if d > max_spread:
				max_spread = d
				
	var target_dist = clamp(min_distance + max_spread * 1.5, min_distance, max_distance)
	
	# Đặt vị trí camera Isometric nhìn chéo xuống
	var target_pos = center + Vector3(0, target_dist * 1.2, target_dist * 1.0)
	global_position = global_position.lerp(target_pos, smooth_speed * delta)
	
	look_at(center + Vector3.UP * 1.0, Vector3.UP)
