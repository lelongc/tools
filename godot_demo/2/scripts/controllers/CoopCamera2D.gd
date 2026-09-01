extends Camera2D

@export var min_zoom: float = 0.8
@export var max_zoom: float = 1.3
@export var zoom_speed: float = 4.0
@export var follow_speed: float = 6.0

var player_1: Node2D = null
var player_2: Node2D = null

func setup(p1: Node2D, p2: Node2D) -> void:
	player_1 = p1
	player_2 = p2

func _process(delta: float) -> void:
	if not player_1 or not player_2: return

	var pos1 = player_1.global_position
	var pos2 = player_2.global_position

	# 1. Trung điểm giữa 2 người chơi
	var mid_point = (pos1 + pos2) * 0.5 + Vector2(0, -30)
	global_position = global_position.lerp(mid_point, follow_speed * delta)

	# 2. Dynamic Zoom theo khoảng cách
	var dist = pos1.distance_to(pos2)
	var target_zoom_val = remap(dist, 100.0, 450.0, max_zoom, min_zoom)
	target_zoom_val = clamp(target_zoom_val, min_zoom, max_zoom)

	zoom = zoom.lerp(Vector2(target_zoom_val, target_zoom_val), zoom_speed * delta)
