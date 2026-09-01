extends Node2D

@export var rest_length: float = 110.0
@export var max_length: float = 300.0
@export var spring_stiffness: float = 22.0

var player_1: CharacterBody2D = null
var player_2: CharacterBody2D = null

@onready var line: Line2D = get_node_or_null("Line2D")
@onready var spark_particles: CPUParticles2D = get_node_or_null("Sparks")

func setup(p1: CharacterBody2D, p2: CharacterBody2D) -> void:
	player_1 = p1
	player_2 = p2
	if p1 and p2:
		p1.set_partner(p2)
		p2.set_partner(p1)

func _physics_process(delta: float) -> void:
	if not is_instance_valid(player_1) or not is_instance_valid(player_2): return

	var pos1 = player_1.global_position
	var pos2 = player_2.global_position
	var diff = pos2 - pos1
	var dist = diff.length()
	if dist <= 0.001: return
	var dir = diff / dist

	var p1_anchored = "is_anchored" in player_1 and player_1.is_anchored
	var p2_anchored = "is_anchored" in player_2 and player_2.is_anchored

	# 1. Tính toán lực kéo lò xo mượt mà
	if dist > rest_length:
		var stretch = dist - rest_length
		var force_mag = stretch * spring_stiffness
		var pull_accel = dir * force_mag * delta

		if p1_anchored and not p2_anchored:
			player_2.velocity -= pull_accel * 1.5
			# Slingshot Launch khi P2 bật nhảy
			if dist > 200.0 and (Input.is_action_just_pressed("ui_up") or Input.is_key_pressed(KEY_ENTER) or Input.is_joy_button_pressed(1, JOY_BUTTON_A)):
				var launch_dir = (-dir + Vector2.UP * 0.9).normalized()
				var launch_spd = clamp(stretch * 4.2 + 350.0, 480.0, 700.0)
				player_2.apply_slingshot_impulse(launch_dir * launch_spd)
				_trigger_slingshot_burst(pos2)
		elif p2_anchored and not p1_anchored:
			player_1.velocity += pull_accel * 1.5
			if dist > 200.0 and (Input.is_action_just_pressed("ui_accept") or Input.is_key_pressed(KEY_SPACE) or Input.is_key_pressed(KEY_W) or Input.is_joy_button_pressed(0, JOY_BUTTON_A)):
				var launch_dir = (dir + Vector2.UP * 0.9).normalized()
				var launch_spd = clamp(stretch * 4.2 + 350.0, 480.0, 700.0)
				player_1.apply_slingshot_impulse(launch_dir * launch_spd)
				_trigger_slingshot_burst(pos1)
		elif not p1_anchored and not p2_anchored:
			player_1.velocity += pull_accel * 0.7
			player_2.velocity -= pull_accel * 0.7

		# 2. Giới hạn khoảng cách tối đa (Rope Tension & Pendulum Constraint)
		if dist > max_length:
			var over = dist - max_length
			if not p1_anchored and not p2_anchored:
				var rel_vel = player_2.velocity - player_1.velocity
				var sep_speed = rel_vel.dot(dir)
				if sep_speed > 0:
					player_2.velocity -= dir * (sep_speed * 0.5)
					player_1.velocity += dir * (sep_speed * 0.5)
				player_1.global_position += dir * (over * 0.2)
				player_2.global_position -= dir * (over * 0.2)
			elif p1_anchored:
				if player_2.velocity.dot(dir) > 0:
					player_2.velocity = player_2.velocity.slide(dir)
				player_2.global_position = pos1 + dir * max_length
			elif p2_anchored:
				if player_1.velocity.dot(-dir) > 0:
					player_1.velocity = player_1.velocity.slide(-dir)
				player_1.global_position = pos2 - dir * max_length

	_draw_rope(pos1, pos2, dist)

func _draw_rope(pos1: Vector2, pos2: Vector2, dist: float) -> void:
	if not line: return

	var local_pos1 = to_local(pos1 + Vector2(0, -8))
	var local_pos2 = to_local(pos2 + Vector2(0, -8))

	var sag = clamp((rest_length - dist) * 0.4, 0.0, 40.0)
	var mid_point = (local_pos1 + local_pos2) * 0.5 + Vector2(0, sag)

	var tension = clamp((dist - rest_length) / (max_length - rest_length), 0.0, 1.0)
	if tension > 0.65:
		var jitter = sin(Time.get_ticks_msec() * 0.06) * (tension * 3.0)
		mid_point += Vector2(jitter, -jitter)

	var points: PackedVector2Array = []
	for i in range(10):
		var t = float(i) / 9.0
		var pt = (1.0 - t) * (1.0 - t) * local_pos1 + 2.0 * (1.0 - t) * t * mid_point + t * t * local_pos2
		points.append(pt)

	line.points = points

	if tension < 0.35:
		line.default_color = Color(0.2, 0.9, 1.0, 0.95)
		line.width = 6.0
	elif tension < 0.75:
		line.default_color = Color(1.0, 0.7, 0.1, 0.95)
		line.width = 5.0
	else:
		line.default_color = Color(1.0, 0.15, 0.35, 1.0)
		line.width = 4.0

func _trigger_slingshot_burst(at_pos: Vector2) -> void:
	if spark_particles:
		spark_particles.global_position = at_pos
		spark_particles.restart()
		spark_particles.emitting = true
