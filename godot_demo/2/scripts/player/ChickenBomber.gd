extends Node2D

signal egg_spawned(egg_instance)

@export var move_speed: float = 140.0
@export var min_x: float = 60.0
@export var max_x: float = 480.0
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
	"drill": preload("res://scenes/prefabs/DrillEgg.tscn")
}

func _ready() -> void:
	position = Vector2(270.0, default_y)
	if trajectory_line:
		trajectory_line.visible = false
	_prepare_next_egg()

func _process(delta: float) -> void:
	# 1. Tự động lượn ngang bầu trời nếu không chủ động kéo ngắm
	if not is_aiming:
		position.x += move_speed * move_direction * delta
		if position.x >= max_x:
			position.x = max_x
			move_direction = -1.0
		elif position.x <= min_x:
			position.x = min_x
			move_direction = 1.0

	# 2. Đập cánh bồng bềnh
	wing_flap_time += delta * 12.0
	if left_wing: left_wing.rotation = sin(wing_flap_time) * 0.4
	if right_wing: right_wing.rotation = -sin(wing_flap_time) * 0.4

	# 3. Squash & Stretch lerp
	if not is_dropping_anim:
		visual_root.scale = visual_root.scale.lerp(Vector2.ONE, 10.0 * delta)

	# 4. Xử lý Input ngắm bắn
	_handle_aim_input()

func _handle_aim_input() -> void:
	var mouse_pos = get_global_mouse_position()

	# Bắt đầu chạm / click chuột để ngắm
	if Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
		if not is_aiming:
			# Chỉ bắt đầu ngắm nếu bấm ở nửa trên màn hình
			if mouse_pos.y < 500.0:
				is_aiming = true
				aim_start_pos = mouse_pos

		if is_aiming:
			# Kéo gà tới vị trí x của chuột (trong giới hạn)
			position.x = clamp(mouse_pos.x, min_x, max_x)
			
			# Vector lực thả: hướng thẳng xuống kèm góc lệch nhẹ theo chuột
			var pull_diff = mouse_pos - global_position
			aim_vector = Vector2(clamp(pull_diff.x * 1.5, -250.0, 250.0), clamp(pull_diff.y * 2.0 + 300.0, 300.0, 750.0))
			
			# Cập nhật mắt liếc nhìn theo hướng ngắm
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
	var start_p = Vector2(0, 20) # Từ bụng gà
	var vel = initial_vel
	var gravity = Vector2(0, 980.0)
	var dt = 0.03
	var cur_p = start_p
	
	for i in range(25):
		points.append(cur_p)
		cur_p += vel * dt
		vel += gravity * dt
	
	trajectory_line.points = points

func _update_eye_direction(dir: Vector2) -> void:
	if eye_left and eye_right:
		eye_left.position = Vector2(-12, -4) + dir * 4.0
		eye_right.position = Vector2(12, -4) + dir * 4.0

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

	# Hiệu ứng rặn đẻ Squash & Stretch
	is_dropping_anim = true
	var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	visual_root.scale = Vector2(1.4, 0.6) # Phồng bẹp người
	tween.tween_property(visual_root, "scale", Vector2(0.7, 1.35), 0.12) # Bật dài người
	tween.tween_property(visual_root, "scale", Vector2.ONE, 0.2)
	tween.finished.connect(func(): is_dropping_anim = false)

	# Sinh quả trứng
	var egg_scene = egg_scenes[egg_type]
	var egg = egg_scene.instantiate()
	egg.global_position = global_position + Vector2(0, 25.0)
	egg.linear_velocity = launch_vel
	get_parent().add_child(egg)
	
	egg_spawned.emit(egg)
	_prepare_next_egg()
	GameManager.check_out_of_eggs()
