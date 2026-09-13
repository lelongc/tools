extends Camera3D
class_name PartyCamera3D

## PartyCamera3D.gd
## Camera 3D góc nhìn tiệc tùng: Tự động điều chỉnh khoảng cách và góc nhìn theo cả 4 người chơi

@export var min_distance: float = 14.0
@export var max_distance: float = 28.0
@export var smooth_speed: float = 6.0

func _process(delta: float) -> void:
	var players = get_tree().get_nodes_in_group("players")
	if players.is_empty():
		return
		
	var center = Vector3.ZERO
	var active_count = 0
	for p in players:
		if p is Node3D and p.visible:
			center += p.global_position
			active_count += 1
			
	if active_count == 0:
		return
		
	center /= float(active_count)
	
	var max_spread: float = 0.0
	for p in players:
		if p is Node3D and p.visible:
			var d = p.global_position.distance_to(center)
			if d > max_spread:
				max_spread = d
				
	var target_dist = clamp(min_distance + max_spread * 1.4, min_distance, max_distance)
	var target_pos = center + Vector3(0, target_dist * 1.2, target_dist * 0.95)
	global_position = global_position.lerp(target_pos, smooth_speed * delta)
	
	look_at(center + Vector3.UP * 0.5, Vector3.UP)
