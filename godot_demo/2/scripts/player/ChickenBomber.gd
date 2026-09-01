extends Node2D

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

signal egg_spawned(egg_instance)

@export var move_speed: float = 160.0
@export var min_x: float = 80.0
@export var max_x: float = 460.0
@export var default_y: float = 110.0

var move_direction: float = 1.0
var is_aiming: bool = false
var aim_start_pos: Vector2 = Vector2.ZERO
var aim_vector: Vector2 = Vector2.ZERO
var current_egg_type: String = "normal"

# Visual Nodes
@onready var visual_root: Node2D = $VisualRoot
@onready var body_mesh: Polygon2D = $VisualRoot/Body
@onready var left_wing: Node2D = $VisualRoot/LeftWing
@onready var right_wing: Node2D = $VisualRoot/RightWing
@onready var eye_left: Node2D = $VisualRoot/EyeLeft
@onready var eye_right: Node2D = $VisualRoot/EyeRight
@onready var trajectory_line: Line2D = $TrajectoryLine

var wing_flap_time: float = 0.0
var base_scale: Vector2 = Vector2.ONE
var is_dropping_anim: bool = false

# Egg Scenes
var egg_scenes: Dictionary = {
	"normal": preload("res://scenes/prefabs/NormalEgg.tscn"),
	"bomb": preload("res://scenes/prefabs/BombEgg.tscn"),
	"drill": preload("res://scenes/prefabs/DrillEgg.tscn"),
	"frost": preload("res://scenes/prefabs/FrostEgg.tscn"),
	"cluster": preload("res://scenes/prefabs/ClusterEgg.tscn"),
	"acid": preload("res://scenes/prefabs/AcidEgg.tscn"),
	"blackhole": preload("res://scenes/prefabs/BlackHoleEgg.tscn")
}

func _ready() -> void:
	position = Vector2(270.0, default_y)
	if trajectory_line:
		trajectory_line.visible = false
	_prepare_next_egg()

func _process(delta: float) -> void:
	# 1. Tự động lượn ngang bầu trời nếu không chủ động ngắm
	if not is_aiming:
		position.x += move_speed * move_direction * delta
		if position.x >= max_x:
			position.x = max_x
			move_direction = -1.0
		elif position.x <= min_x:
			position.x = min_x
			move_direction = 1.0

	# 2. Đập cánh bồng bềnh
	wing_flap_time += delta * (22.0 if is_aiming else 12.0)
	if left_wing: left_wing.rotation = sin(wing_flap_time) * 0.45
	if right_wing: right_wing.rotation = -sin(wing_flap_time) * 0.45

	# 3. Squash & Stretch lerp
	if not is_dropping_anim and not is_aiming:
		visual_root.scale = visual_root.scale.lerp(Vector2.ONE, 10.0 * delta)

	# 4. Xử lý Input ngắm bắn
	_handle_aim_input()

func _handle_aim_input() -> void:
	if CameraShake.instance and CameraShake.instance.is_intro_playing:
		if is_aiming:
			is_aiming = false
			if trajectory_line: trajectory_line.visible = false
		return

	var mouse_pos = get_global_mouse_position()

	# Bắt đầu chạm / click chuột để ngắm
	if Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
		if not is_aiming:
			is_aiming = true
			aim_start_pos = mouse_pos

		if is_aiming:
			# Kéo gà tới vị trí X của chuột
			position.x = clamp(mouse_pos.x, min_x, max_x)
			
			# Tính toán lực và góc bắn tự nhiên
			var pull_y = clamp(mouse_pos.y - global_position.y, 40.0, 320.0)
			var pull_x = clamp((mouse_pos.x - global_position.x) * 1.8, -260.0, 260.0)
			var launch_spd_y = clamp(pull_y * 2.2 + 350.0, 350.0, 850.0)
			aim_vector = Vector2(pull_x, launch_spd_y)

			# Co giãn người gà theo lực kéo (Nén như lò xo)
			var tension = clamp(pull_y / 280.0, 0.0, 0.45)
			visual_root.scale = Vector2(1.0 + tension, 1.0 - tension * 0.6)
			
			# Mắt liếc nhìn xuống hầm
			_update_eye_direction(aim_vector.normalized())
			
			# Vẽ đường dự đoán quỹ đạo
			_draw_trajectory(aim_vector)
	else:
		# Nhả chuột -> Thả trứng!
		if is_aiming:
			is_aiming = false
			if trajectory_line: trajectory_line.visible = false
			_reset_eye_direction()
			_drop_egg(aim_vector)

func _draw_trajectory(initial_vel: Vector2) -> void:
	if not trajectory_line: return
	trajectory_line.visible = true
	
	var points: PackedVector2Array = []
	var start_p = Vector2(0, 24) # Từ bụng gà
	var vel = initial_vel
	var gravity = Vector2(0, 980.0)
	var dt = 0.025
	var cur_p = start_p
	
	for i in range(30):
		points.append(cur_p)
		cur_p += vel * dt
		vel += gravity * dt
	
	trajectory_line.points = points

func _update_eye_direction(dir: Vector2) -> void:
	if eye_left and eye_right:
		eye_left.position = Vector2(-12, -4) + dir * 5.0
		eye_right.position = Vector2(12, -4) + dir * 5.0

func _reset_eye_direction() -> void:
	if eye_left and eye_right:
		eye_left.position = Vector2(-12, -4)
		eye_right.position = Vector2(12, -4)

func _prepare_next_egg() -> void:
	if GameManager.current_egg_index < GameManager.available_eggs.size():
		current_egg_type = GameManager.available_eggs[GameManager.current_egg_index]
	else:
		current_egg_type = ""

func _drop_egg(launch_vel: Vector2) -> void:
	var egg_type = GameManager.get_next_egg()
	if egg_type == "" or not egg_scenes.has(egg_type):
		GameManager.check_out_of_eggs()
		return

	# Hiệu ứng rặn đẻ Squash & Stretch bùng nổ
	is_dropping_anim = true
	var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	visual_root.scale = Vector2(0.65, 1.45) # Bật dài người lên trên
	tween.tween_property(visual_root, "scale", Vector2(1.2, 0.8), 0.12)
	tween.tween_property(visual_root, "scale", Vector2.ONE, 0.18)
	tween.finished.connect(func(): is_dropping_anim = false)

	# Sinh quả trứng
	var egg_scene = egg_scenes[egg_type]
	var egg = egg_scene.instantiate()
	egg.global_position = global_position + Vector2(0, 26.0)
	egg.linear_velocity = launch_vel
	get_parent().add_child(egg)
	
	egg_spawned.emit(egg)
	_prepare_next_egg()
	GameManager.check_out_of_eggs()
