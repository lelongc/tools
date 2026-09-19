extends Node2D
class_name ChickenBomber

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

signal egg_spawned(egg_instance)

@export var move_speed: float = 160.0
@export var min_x: float = 55.0
@export var max_x: float = 485.0
@export var default_y: float = 135.0

var move_direction: float = 1.0
var is_aiming: bool = false
var aim_start_pos: Vector2 = Vector2.ZERO
var aim_vector: Vector2 = Vector2(0, 480.0)
var current_egg_type: String = "normal"
var drop_cooldown: float = 0.0

# Visual Nodes
@onready var visual_root: Node2D = $VisualRoot
@onready var body_sprite: Sprite2D = get_node_or_null("VisualRoot/Body")
@onready var basket_sprite: Sprite2D = get_node_or_null("VisualRoot/Basket")
@onready var left_wing: Sprite2D = get_node_or_null("VisualRoot/LeftWing")
@onready var right_wing: Sprite2D = get_node_or_null("VisualRoot/RightWing")
@onready var trajectory_line: Line2D = $TrajectoryLine

var wing_flap_time: float = 0.0
var base_scale: Vector2 = Vector2.ONE
var is_dropping_anim: bool = false
var facing_scale: float = 1.0

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


func _safe_load(path: String) -> Texture2D:
	return ParticleHelper._safe_load(path)

func _ready() -> void:
	add_to_group("Player")
	position = Vector2(270.0, default_y)
	if trajectory_line:
		trajectory_line.visible = false

	# Nạp texture SVG hoạt hình Vector cao cấp
	if body_sprite:
		var tb = _safe_load("res://assets/sprites/player/chicken_aviator_body.svg")
		if tb: body_sprite.texture = tb
	if basket_sprite:
		var tk = _safe_load("res://assets/sprites/player/chicken_basket_wicker.svg")
		if tk: basket_sprite.texture = tk
	if left_wing:
		var tw = _safe_load("res://assets/sprites/player/chicken_wing_flap.svg")
		if tw: left_wing.texture = tw
	if right_wing:
		var tw = _safe_load("res://assets/sprites/player/chicken_wing_flap.svg")
		if tw: right_wing.texture = tw

	_prepare_next_egg()

func _process(delta: float) -> void:
	if drop_cooldown > 0.0:
		drop_cooldown -= delta

	# 1. Tự động lượn ngang bầu trời nếu không chủ động ngắm
	if not is_aiming:
		position.x += move_speed * move_direction * delta
		if position.x >= max_x:
			position.x = max_x
			move_direction = -1.0
		elif position.x <= min_x:
			position.x = min_x
			move_direction = 1.0

		# Nhấp nhô cao độ bồng bềnh theo nhịp vỗ cánh (Altitude Bobbing)
		var bob_y = default_y + sin(wing_flap_time) * 5.5
		position.y = lerp(position.y, bob_y, 8.0 * delta)

		# Quay mặt theo hướng lượn mượt mà (Không bị bay lùi)
		facing_scale = lerp(facing_scale, move_direction, 10.0 * delta)

		# Chuyển động thứ cấp giữa thân gà và giỏ trứng treo
		if body_sprite:
			body_sprite.position.y = -6.0 + sin(wing_flap_time) * 1.5
		if basket_sprite:
			basket_sprite.position.y = 22.0 - sin(wing_flap_time) * 1.2
			basket_sprite.rotation = lerp_angle(basket_sprite.rotation, -move_direction * 0.08, 6.0 * delta)

		# Nghiêng người tự nhiên theo hướng lượn (Banking Tilt)
		if visual_root:
			var target_tilt = move_direction * 0.12
			visual_root.rotation = lerp_angle(visual_root.rotation, target_tilt, 6.0 * delta)
	else:
		# Khi đang ngắm: lơ lửng tại chỗ, nghiêng theo góc kéo dây ná ngắm đạn
		position.y = lerp(position.y, default_y, 10.0 * delta)
		var target_aim_facing = sign(aim_vector.x) if abs(aim_vector.x) > 30.0 else sign(facing_scale)
		if target_aim_facing == 0.0: target_aim_facing = 1.0
		facing_scale = lerp(facing_scale, target_aim_facing, 8.0 * delta)

		if visual_root:
			var aim_tilt = clamp(aim_vector.x * 0.0006, -0.22, 0.22)
			visual_root.rotation = lerp_angle(visual_root.rotation, aim_tilt, 10.0 * delta)
		if basket_sprite and visual_root:
			basket_sprite.rotation = lerp_angle(basket_sprite.rotation, -visual_root.rotation * 0.7, 8.0 * delta)

	# 2. Đập cánh đối xứng sinh động (Cả 2 cánh cùng nâng lên / hạ xuống nhịp nhàng)
	wing_flap_time += delta * (24.0 if is_aiming else 11.0)
	var flap_angle = sin(wing_flap_time) * (0.50 if is_aiming else 0.40)
	if left_wing: left_wing.rotation = flap_angle
	if right_wing: right_wing.rotation = flap_angle

	# 3. Squash & Stretch lerp nhịp nhàng kết hợp hướng quay mặt
	if not is_dropping_anim:
		var breath = 1.0 + sin(wing_flap_time) * 0.035
		var target_scale = Vector2((2.0 - breath) * facing_scale, breath)
		visual_root.scale = visual_root.scale.lerp(target_scale, 10.0 * delta)

	# 4. Xử lý Input ngắm bắn
	_handle_aim_input()

func _handle_aim_input() -> void:
	# Bỏ qua nếu game kết thúc
	if not GameManager.is_level_active:
		if is_aiming:
			is_aiming = false
			if trajectory_line: trajectory_line.visible = false
		return

	var screen_mouse_pos = get_viewport().get_mouse_position()
	var mouse_pos = get_global_mouse_position()

	# Bắt đầu chạm / click chuột để ngắm
	if Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
		if not is_aiming:
			if drop_cooldown > 0.0:
				return
			# Không nhận click nếu bấm đè thanh menu TopBar ở trên đỉnh hoặc kệ trứng phía dưới
			if screen_mouse_pos.y < 70.0 or screen_mouse_pos.y > 880.0:
				return
			is_aiming = true
			aim_start_pos = mouse_pos
			aim_vector = Vector2(0, 480.0)

		if is_aiming:
			var drag_delta = mouse_pos - aim_start_pos
			# Di chuyển gà theo vị trí bắt đầu và độ nghiêng ngón tay
			position.x = clamp(aim_start_pos.x + drag_delta.x * 0.3, min_x, max_x)
			
			# Tính toán lực và góc bắn từ khoảng cách kéo ngón tay
			var pull_y = clamp(max(drag_delta.y, 30.0), 30.0, 320.0)
			var pull_x = clamp(drag_delta.x * 1.8, -260.0, 260.0)
			var launch_spd_y = clamp(pull_y * 2.0 + 350.0, 350.0, 850.0)
			aim_vector = Vector2(pull_x, launch_spd_y)

			# Co giãn người gà theo lực kéo (Nén lò xo)
			var tension = clamp(pull_y / 280.0, 0.0, 0.45)
			visual_root.scale = Vector2(1.0 + tension, 1.0 - tension * 0.6)
			
			# Mắt liếc nhìn xuống hầm
			_update_eye_direction(aim_vector.normalized())
			
			# Vẽ đường dự đoán quỹ đạo
			_draw_trajectory(aim_vector)
	else:
		# Nhả chuột / ngón tay -> Thả trứng ngay lập tức!
		if is_aiming:
			is_aiming = false
			if trajectory_line: trajectory_line.visible = false
			_reset_eye_direction()
			if aim_vector == Vector2.ZERO:
				aim_vector = Vector2(0, 480.0)
			_drop_egg(aim_vector)
			aim_vector = Vector2(0, 480.0)

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
	if body_sprite:
		body_sprite.rotation = clamp(dir.x * 0.15, -0.15, 0.15)

func _reset_eye_direction() -> void:
	if body_sprite:
		body_sprite.rotation = 0.0

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
	var sign_x = sign(facing_scale) if facing_scale != 0.0 else 1.0
	var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	visual_root.scale = Vector2(sign_x * 0.65, 1.45) # Bật dài người lên trên
	tween.tween_property(visual_root, "scale", Vector2(sign_x * 1.25, 0.75), 0.12)
	tween.tween_property(visual_root, "scale", Vector2(sign_x * 1.0, 1.0), 0.18)
	tween.finished.connect(func(): is_dropping_anim = false)

	# Sinh quả trứng
	var egg_scene = egg_scenes[egg_type]
	var egg = egg_scene.instantiate()
	egg.global_position = global_position + Vector2(0, 26.0)
	egg.linear_velocity = launch_vel
	get_parent().add_child(egg)
	
	egg_spawned.emit(egg)
	drop_cooldown = 0.35 # Khoảng nghỉ chống chạm nhầm 2 ngón cùng lúc
	_prepare_next_egg()
	GameManager.check_out_of_eggs()
