extends Camera3D
class_name PartyCamera3D

## PartyCamera3D.gd
## Camera 3D góc nhìn tiệc tùng: Tự động điều chỉnh khoảng cách và góc nhìn theo cả 4 người chơi

@export var min_distance: float = 14.0
@export var max_distance: float = 28.0
@export var smooth_speed: float = 6.0

var shake_intensity: float = 0.0
var shake_timer: float = 0.0

func _ready() -> void:
	if SumoGameManager.has_signal("screen_shake_requested"):
		SumoGameManager.screen_shake_requested.connect(_on_screen_shake)

func _on_screen_shake(intensity: float, duration: float) -> void:
	shake_intensity = maxf(shake_intensity, intensity)
	shake_timer = maxf(shake_timer, duration)

func _process(delta: float) -> void:
	var players = get_tree().get_nodes_in_group("sumo_players")
	if players.is_empty():
		players = get_tree().get_nodes_in_group("players")
		
	var center = Vector3.ZERO
	var active_count = 0
	for p in players:
		if p is Node3D and p.visible and p.global_position.y > -8.0:
			center += p.global_position
			active_count += 1
			
	if active_count > 0:
		center /= float(active_count)
	else:
		center = Vector3(0, 0.5, 0)
		
	var max_spread: float = 0.0
	for p in players:
		if p is Node3D and p.visible and p.global_position.y > -8.0:
			var d = p.global_position.distance_to(center)
			if d > max_spread:
				max_spread = d
				
	var target_dist = clampf(min_distance + max_spread * 1.3, min_distance, max_distance)
	var target_pos = center + Vector3(0, target_dist * 1.15, target_dist * 0.95)
	
	# Xử lý Rung chấn Camera (Juicy Screen Shake)
	var shake_offset = Vector3.ZERO
	if shake_timer > 0.0:
		shake_timer -= delta
		var current_amp = shake_intensity * clampf(shake_timer / 0.3, 0.0, 1.0)
		shake_offset = Vector3(
			randf_range(-current_amp, current_amp),
			randf_range(-current_amp, current_amp),
			randf_range(-current_amp, current_amp)
		)
		if shake_timer <= 0.0:
			shake_intensity = 0.0
			
	global_position = global_position.lerp(target_pos + shake_offset, smooth_speed * delta)
	
	var look_target = center + Vector3.UP * 0.5
	if global_position.distance_squared_to(look_target) > 0.01:
		look_at(look_target, Vector3.UP)
