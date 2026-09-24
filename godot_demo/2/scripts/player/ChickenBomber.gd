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
@onready var loaded_egg: Sprite2D = get_node_or_null("VisualRoot/Basket/LoadedEgg")
@onready var left_wing: Sprite2D = get_node_or_null("VisualRoot/LeftWing")
@onready var right_wing: Sprite2D = get_node_or_null("VisualRoot/RightWing")
@onready var trajectory_line: Line2D = $TrajectoryLine
@onready var drop_poof_fx: CPUParticles2D = get_node_or_null("DropPoofFX")

# Lớp biểu cảm và chuyển động hoạt hình mới
var eyes_sprite: Sprite2D = null
var goggles_sprite: Sprite2D = null
var beak_open_sprite: Sprite2D = null
var tail_sprite: Sprite2D = null
var sweat_sprite: Sprite2D = null

# Cache Textures biểu cảm
var tex_eyes_normal: Texture2D = null
var tex_eyes_blink: Texture2D = null
var tex_eyes_aim: Texture2D = null
var tex_eyes_pop: Texture2D = null
var tex_goggles: Texture2D = null
var tex_tail: Texture2D = null
var tex_beak_open: Texture2D = null
var tex_sweat: Texture2D = null

# Biến trạng thái hoạt họa
var wing_flap_time: float = 0.0
var flight_cycle_timer: float = 0.0
var base_scale: Vector2 = Vector2.ONE
var is_dropping_anim: bool = false
var recoil_active: bool = false
var facing_scale: float = 1.0
var blink_timer: float = 3.0
var is_celebrating: bool = false
var is_defeated: bool = false
var bank_roll: float = 0.0

# Egg Scenes & Textures
const EGG_TEXTURE_PATHS: Dictionary = {
	"normal": "res://assets/sprites/projectiles/egg_normal.svg",
	"bomb": "res://assets/sprites/projectiles/egg_bomb.svg",
	"drill": "res://assets/sprites/projectiles/egg_drill.svg",
	"frost": "res://assets/sprites/projectiles/egg_frost.svg",
	"cluster": "res://assets/sprites/projectiles/egg_cluster.svg",
	"acid": "res://assets/sprites/projectiles/egg_acid.svg",
	"blackhole": "res://assets/sprites/projectiles/egg_blackhole.svg"
}

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

	if drop_poof_fx:
		drop_poof_fx.local_coords = false
		ParticleHelper.apply_feather_fx(drop_poof_fx, 0.25, 0.5)
		drop_poof_fx.color = Color(1.0, 0.95, 0.85, 0.9)

	# 1. Nạp và thiết lập các lớp Sprite biểu cảm đa tầng
	_setup_expressive_parts()

	# 2. Nạp giỏ trứng và cánh
	if basket_sprite:
		var tk = _safe_load("res://assets/sprites/player/chicken_basket_wicker.svg")
		if tk: basket_sprite.texture = tk
	if left_wing:
		var tw = _safe_load("res://assets/sprites/player/chicken_wing_flap.svg")
		if tw: left_wing.texture = tw
	if right_wing:
		var tw = _safe_load("res://assets/sprites/player/chicken_wing_flap.svg")
		if tw: right_wing.texture = tw

	# 3. Lắng nghe các sự kiện thắng / thua màn chơi từ GameManager
	if has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		gm.level_completed.connect(_on_level_completed)
		gm.level_failed.connect(_on_level_failed)

	_prepare_next_egg()

func _setup_expressive_parts() -> void:
	# Nạp các tài nguyên SVG biểu cảm
	tex_eyes_normal = _safe_load("res://assets/sprites/player/chicken_eyes_normal.svg")
	tex_eyes_blink = _safe_load("res://assets/sprites/player/chicken_eyes_blink.svg")
	tex_eyes_aim = _safe_load("res://assets/sprites/player/chicken_eyes_aim.svg")
	tex_eyes_pop = _safe_load("res://assets/sprites/player/chicken_eyes_pop.svg")
	tex_goggles = _safe_load("res://assets/sprites/player/chicken_goggles.svg")
	tex_tail = _safe_load("res://assets/sprites/player/chicken_tail_feather.svg")
	tex_beak_open = _safe_load("res://assets/sprites/player/chicken_beak_open.svg")
	tex_sweat = _safe_load("res://assets/sprites/player/chicken_sweat_drop.svg")

	# Thiết lập thân gà nền
	if body_sprite:
		var tb = _safe_load("res://assets/sprites/player/chicken_base_body.svg")
		if not tb:
			tb = _safe_load("res://assets/sprites/player/chicken_aviator_body.svg")
		if tb: body_sprite.texture = tb

		# 1. Đôi mắt hoạt họa động
		if tex_eyes_normal and not eyes_sprite:
			eyes_sprite = Sprite2D.new()
			eyes_sprite.name = "AnimatedEyes"
			eyes_sprite.texture = tex_eyes_normal
			eyes_sprite.z_index = 1
			body_sprite.add_child(eyes_sprite)

		# 2. Kính phi công steampunk trượt động
		if tex_goggles and not goggles_sprite:
			goggles_sprite = Sprite2D.new()
			goggles_sprite.name = "SlidingGoggles"
			goggles_sprite.texture = tex_goggles
			goggles_sprite.position = Vector2.ZERO # Vị trí trán mặc định y=0
			goggles_sprite.z_index = 2
			body_sprite.add_child(goggles_sprite)

		# 3. Mỏ há to kêu cục tác khi đẻ trứng
		if tex_beak_open and not beak_open_sprite:
			beak_open_sprite = Sprite2D.new()
			beak_open_sprite.name = "BeakOpen"
			beak_open_sprite.texture = tex_beak_open
			beak_open_sprite.visible = false
			beak_open_sprite.z_index = 3
			body_sprite.add_child(beak_open_sprite)

		# 4. Giọt mồ hôi truyện tranh khi kéo căng
		if tex_sweat and not sweat_sprite:
			sweat_sprite = Sprite2D.new()
			sweat_sprite.name = "SweatDrop"
			sweat_sprite.texture = tex_sweat
			sweat_sprite.position = Vector2(26.0, -12.0)
			sweat_sprite.scale = Vector2(0.8, 0.8)
			sweat_sprite.visible = false
			sweat_sprite.z_index = 4
			body_sprite.add_child(sweat_sprite)

	# 5. Chùm lông đuôi mềm mại phía sau thân
	if visual_root and tex_tail and not tail_sprite:
		tail_sprite = Sprite2D.new()
		tail_sprite.name = "DynamicTail"
		tail_sprite.texture = tex_tail
		tail_sprite.position = Vector2(-22.0, 4.0)
		tail_sprite.offset = Vector2(-16.0, 0.0)
		tail_sprite.scale = Vector2(0.85, 0.85)
		tail_sprite.z_index = -1 # Nằm dưới thân gà
		visual_root.add_child(tail_sprite)

func _process(delta: float) -> void:
	if drop_cooldown > 0.0:
		drop_cooldown -= delta

	# Chớp mắt hoạt họa tự nhiên ngẫu nhiên khi bay
	blink_timer -= delta
	if blink_timer <= 0.0:
		blink_timer = randf_range(2.6, 4.8)
		_perform_blink()

	# Xử lý hoạt ảnh khi thắng ván đấu hoặc thất bại
	if is_celebrating or is_defeated:
		return

	# 1. Tự động lượn ngang bầu trời nếu không chủ động ngắm
	if not is_aiming:
		_process_flying_movement(delta)
	else:
		_process_aiming_hover(delta)

	# 2. Xử lý Input ngắm bắn
	_handle_aim_input()

func _process_flying_movement(delta: float) -> void:
	# Di chuyển theo hướng bay
	position.x += move_speed * move_direction * delta

	# Nhận diện mép màn hình và nghiêng cánh lượn vòng chữ U (Aerodynamic Bank Turn)
	var is_near_edge = false
	if position.x >= max_x:
		position.x = max_x
		move_direction = -1.0
		bank_roll = -0.28
	elif position.x <= min_x:
		position.x = min_x
		move_direction = 1.0
		bank_roll = 0.28
	elif position.x >= max_x - 35.0 and move_direction > 0.0:
		is_near_edge = true
		bank_roll = lerp(bank_roll, -0.22, 6.0 * delta)
	elif position.x <= min_x + 35.0 and move_direction < 0.0:
		is_near_edge = true
		bank_roll = lerp(bank_roll, 0.22, 6.0 * delta)
	else:
		bank_roll = lerp(bank_roll, 0.0, 4.0 * delta)

	# CHU KỲ VỖ - LƯỢN TỰ NHIÊN (Flap-Glide Cycle: 0.45s Vỗ + 0.90s Lượn)
	flight_cycle_timer += delta
	var cycle_time = fmod(flight_cycle_timer, 1.35)
	var is_flapping = (cycle_time < 0.45)

	var target_bob_y = default_y
	var flap_angle = 0.0

	if is_flapping:
		# Pha vỗ cánh: 3 nhịp đập nhanh dứt khoát sinh lực nâng
		wing_flap_time += delta * 24.0
		flap_angle = sin(wing_flap_time) * 0.52
		target_bob_y = default_y - 4.0 + sin(wing_flap_time) * 3.5
		if body_sprite:
			body_sprite.rotation = lerp_angle(body_sprite.rotation, -move_direction * 0.04, 8.0 * delta)
	else:
		# Pha lượn xoải cánh: dang rộng cánh đón gió, hạ độ cao từ từ
		var glide_progress = (cycle_time - 0.45) / 0.90
		flap_angle = -0.10 + sin(flight_cycle_timer * 3.5) * 0.04
		target_bob_y = default_y + glide_progress * 5.0
		if body_sprite:
			body_sprite.rotation = lerp_angle(body_sprite.rotation, move_direction * 0.03, 5.0 * delta)

	position.y = lerp(position.y, target_bob_y, 7.0 * delta)

	# Vỗ cánh đối xứng nhịp nhàng
	if left_wing: left_wing.rotation = flap_angle
	if right_wing: right_wing.rotation = flap_angle

	# Quay mặt theo hướng lượn mượt mà (Không bị giật cục khi đổi hướng)
	facing_scale = lerp(facing_scale, move_direction, 9.0 * delta)

	# Nghiêng người tự nhiên kết hợp góc ôm cua (Banking Tilt)
	if visual_root:
		var target_tilt = move_direction * 0.10 + bank_roll
		visual_root.rotation = lerp_angle(visual_root.rotation, target_tilt, 7.0 * delta)

	# Chuyển động quán tính của đuôi gà (Tail Secondary Motion)
	if tail_sprite:
		var tail_rot = -move_direction * 0.12 + (sin(wing_flap_time) * 0.22 if is_flapping else sin(flight_cycle_timer * 3.0) * 0.08)
		tail_sprite.rotation = lerp_angle(tail_sprite.rotation, tail_rot, 8.0 * delta)
		tail_sprite.position.x = -22.0 * (1.0 if facing_scale >= 0.0 else -1.0)
		tail_sprite.scale.x = (0.85 if facing_scale >= 0.0 else -0.85)

	# Chuyển động con lắc của giỏ đan và quả trứng nạp
	if basket_sprite:
		var target_basket_rot = -move_direction * (0.09 if is_flapping else 0.04) + bank_roll * 0.4
		basket_sprite.position.y = 22.0 - sin(flight_cycle_timer * 4.0) * 1.2
		basket_sprite.rotation = lerp_angle(basket_sprite.rotation, target_basket_rot, 6.0 * delta)

	if loaded_egg and loaded_egg.visible:
		loaded_egg.position.y = -6.0 + sin(flight_cycle_timer * 4.5) * 1.0
		loaded_egg.rotation = lerp_angle(loaded_egg.rotation, -move_direction * 0.05, 6.0 * delta)

	# Squash & Stretch hô hấp mềm mại theo nhịp cánh
	if not is_dropping_anim:
		var breath = 1.0 + (sin(wing_flap_time) * 0.035 if is_flapping else sin(flight_cycle_timer * 4.0) * 0.015)
		var target_scale = Vector2((2.0 - breath) * facing_scale, breath)
		visual_root.scale = visual_root.scale.lerp(target_scale, 8.0 * delta)

func _process_aiming_hover(delta: float) -> void:
	# Khi ngắm: lơ lửng tại chỗ, cánh vỗ nhanh giữ thăng bằng
	wing_flap_time += delta * 22.0
	var flap_angle = sin(wing_flap_time) * 0.35
	if left_wing: left_wing.rotation = flap_angle
	if right_wing: right_wing.rotation = flap_angle

	position.y = lerp(position.y, default_y, 9.0 * delta)

	var target_aim_facing = sign(aim_vector.x) if abs(aim_vector.x) > 30.0 else sign(facing_scale)
	if target_aim_facing == 0.0: target_aim_facing = 1.0
	facing_scale = lerp(facing_scale, target_aim_facing, 8.0 * delta)

	# Toàn thân nghiêng theo góc kéo dây ná ngắm đạn
	if visual_root:
		var aim_tilt = clamp(aim_vector.x * 0.0006, -0.25, 0.25)
		visual_root.rotation = lerp_angle(visual_root.rotation, aim_tilt, 10.0 * delta)

	if basket_sprite and visual_root:
		basket_sprite.rotation = lerp_angle(basket_sprite.rotation, -visual_root.rotation * 0.75, 8.0 * delta)

	# Trứng trong giỏ rung lắc theo lực căng
	var tension_ratio = clamp(aim_vector.y / 850.0, 0.0, 1.0)
	if loaded_egg and loaded_egg.visible:
		loaded_egg.position = Vector2(randf_range(-1.5, 1.5), -6.0 + randf_range(-1.5, 1.5)) * tension_ratio

	# Thân gà rung nhẹ do lực căng dây ná (Spring Tension Shudder)
	if body_sprite:
		body_sprite.position.x = sin(Time.get_ticks_msec() * 0.05) * tension_ratio * 1.8

	# Giọt mồ hôi hiện khi kéo lực căng lớn (> 65%)
	if sweat_sprite:
		if tension_ratio > 0.60:
			sweat_sprite.visible = true
			sweat_sprite.position.y = -12.0 + sin(Time.get_ticks_msec() * 0.02) * 2.0
			sweat_sprite.scale = Vector2.ONE * (0.75 + sin(Time.get_ticks_msec() * 0.03) * 0.15)
		else:
			sweat_sprite.visible = false

func has_airborne_unboosted_egg() -> bool:
	var tree = get_tree()
	if not tree: return false
	var projectiles = tree.get_nodes_in_group("Projectiles")
	for p in projectiles:
		if is_instance_valid(p) and not p.is_queued_for_deletion():
			if "has_boosted" in p and not p.has_boosted and not ("is_broken" in p and p.is_broken):
				return true
	return false

func _handle_aim_input() -> void:
	if not GameManager.is_level_active or get_tree().paused:
		if is_aiming:
			is_aiming = false
			_on_aim_end(false)
			if trajectory_line: trajectory_line.visible = false
		return

	var screen_mouse_pos = get_viewport().get_mouse_position()
	var mouse_pos = get_global_mouse_position()

	# Bắt đầu chạm / click chuột để ngắm
	if Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
		if not is_aiming:
			if drop_cooldown > 0.0:
				return
			# Ưu tiên kích hoạt kỹ năng trên không cho quả trứng đang bay (Tap-in-Flight)
			if has_airborne_unboosted_egg():
				drop_cooldown = 0.25
				return
			# Không nhận click nếu bấm đè thanh menu TopBar ở trên đỉnh hoặc kệ trứng phía dưới
			var vp_height = get_viewport_rect().size.y
			var top_limit = 75.0
			var bottom_limit = max(800.0, vp_height - 75.0)
			if screen_mouse_pos.y < top_limit or screen_mouse_pos.y > bottom_limit:
				return

			is_aiming = true
			aim_start_pos = mouse_pos
			aim_vector = Vector2(0, 480.0)
			_on_aim_start()

		if is_aiming:
			var drag_delta = mouse_pos - aim_start_pos
			var is_cancelling = (drag_delta.length() < 24.0 or drag_delta.y < -25.0)

			# Di chuyển gà theo vị trí bắt đầu và độ nghiêng ngón tay
			position.x = clamp(aim_start_pos.x + drag_delta.x * 0.3, min_x, max_x)
			
			# Tính toán lực và góc bắn từ khoảng cách kéo ngón tay
			var pull_y = clamp(max(drag_delta.y, 30.0), 30.0, 320.0)
			var pull_x = clamp(drag_delta.x * 1.8, -260.0, 260.0)
			var launch_spd_y = clamp(pull_y * 2.0 + 350.0, 350.0, 850.0)
			aim_vector = Vector2(pull_x, launch_spd_y)

			# Co giãn người gà theo lực kéo (Nén lò xo)
			var tension = clamp(pull_y / 280.0, 0.0, 0.45)
			var sign_x = sign(facing_scale) if facing_scale != 0.0 else 1.0
			visual_root.scale = Vector2((1.0 + tension) * sign_x, 1.0 - tension * 0.6)
			
			# Mắt liếc nhìn xuống hầm
			_update_eye_direction(aim_vector.normalized())
			
			# Vẽ đường dự đoán quỹ đạo nếu không đang trong vùng hủy
			if is_cancelling:
				if trajectory_line: trajectory_line.visible = false
			else:
				_draw_trajectory(aim_vector)
	else:
		# Nhả chuột / ngón tay -> Thả trứng ngay hoặc Hủy nếu trong deadzone!
		if is_aiming:
			is_aiming = false
			if trajectory_line: trajectory_line.visible = false
			_reset_eye_direction()

			var drag_delta = mouse_pos - aim_start_pos
			var is_cancelled = (drag_delta.length() < 24.0 or drag_delta.y < -25.0)
			if not is_cancelled:
				if aim_vector == Vector2.ZERO:
					aim_vector = Vector2(0, 480.0)
				_drop_egg(aim_vector)
			else:
				_on_aim_end(false)

			aim_vector = Vector2(0, 480.0)

func _on_aim_start() -> void:
	# 1. Kính phi công trượt xuống che mắt ("CLACK!")
	if goggles_sprite:
		var gt = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		gt.tween_property(goggles_sprite, "position:y", 16.0, 0.12)
		gt.parallel().tween_property(goggles_sprite, "scale", Vector2(1.06, 1.06), 0.08)
		gt.tween_property(goggles_sprite, "scale", Vector2.ONE, 0.06)

	# 2. Mắt đổi sang trạng thái ngắm bắn tập trung (Aiming Focus)
	if eyes_sprite and tex_eyes_aim:
		eyes_sprite.texture = tex_eyes_aim

func _on_aim_end(dropped: bool) -> void:
	if not dropped:
		# Kính phi công trượt ngược lên trán êm ái
		if goggles_sprite:
			var gt = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
			gt.tween_property(goggles_sprite, "position:y", 0.0, 0.14)

		# Khôi phục mắt bình thường
		if eyes_sprite and tex_eyes_normal:
			eyes_sprite.texture = tex_eyes_normal

	if sweat_sprite:
		sweat_sprite.visible = false
	if body_sprite:
		body_sprite.position.x = 0.0

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
	if eyes_sprite:
		eyes_sprite.position = Vector2(dir.x * 2.5, clamp(dir.y * 3.0, 0.0, 4.0))

func _reset_eye_direction() -> void:
	if eyes_sprite:
		eyes_sprite.position = Vector2.ZERO

func _perform_blink() -> void:
	if is_aiming or is_dropping_anim or is_celebrating or is_defeated:
		return
	if eyes_sprite and tex_eyes_blink:
		eyes_sprite.texture = tex_eyes_blink
		var bt = create_tween()
		bt.tween_interval(0.12)
		bt.tween_callback(func():
			if is_instance_valid(eyes_sprite) and not is_aiming and not is_dropping_anim and not is_celebrating and not is_defeated:
				eyes_sprite.texture = tex_eyes_normal
		)

func _prepare_next_egg() -> void:
	if GameManager.current_egg_index < GameManager.available_eggs.size():
		current_egg_type = GameManager.available_eggs[GameManager.current_egg_index]
	else:
		current_egg_type = ""

	if loaded_egg:
		if current_egg_type != "" and EGG_TEXTURE_PATHS.has(current_egg_type):
			var tex = _safe_load(EGG_TEXTURE_PATHS[current_egg_type])
			if tex:
				loaded_egg.texture = tex
				loaded_egg.visible = true
				loaded_egg.position = Vector2(0, -6)
				loaded_egg.scale = Vector2(0.48, 0.48)
				# Nảy nhẹ báo hiệu nạp đạn xong
				var tw = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
				tw.tween_property(loaded_egg, "scale", Vector2(0.56, 0.56), 0.10)
				tw.tween_property(loaded_egg, "scale", Vector2(0.48, 0.48), 0.12)
		else:
			loaded_egg.visible = false

func _drop_egg(launch_vel: Vector2 = Vector2(0, 480.0)) -> void:
	var egg_type = GameManager.get_next_egg()
	if egg_type == "" or not egg_scenes.has(egg_type):
		GameManager.check_out_of_eggs()
		return

	# Biểu cảm đẻ trứng: Mắt trố to ngạc nhiên + Mỏ há to kêu cục tác
	if eyes_sprite and tex_eyes_pop:
		eyes_sprite.texture = tex_eyes_pop
	if beak_open_sprite:
		beak_open_sprite.visible = true

	# Kính phi công bật ngược lên trán nảy lò xo vui nhộn
	if goggles_sprite:
		var gt = create_tween().set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
		gt.tween_property(goggles_sprite, "position:y", -5.0, 0.08)
		gt.tween_property(goggles_sprite, "position:y", 0.0, 0.22)

	# Hiệu ứng rặn đẻ Squash & Stretch bùng nổ
	is_dropping_anim = true
	var sign_x = sign(facing_scale) if facing_scale != 0.0 else 1.0
	var tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	visual_root.scale = Vector2(sign_x * 0.65, 1.45) # Bật dài người lên trên
	tween.tween_property(visual_root, "scale", Vector2(sign_x * 1.25, 0.75), 0.12)
	tween.tween_property(visual_root, "scale", Vector2(sign_x * 1.0, 1.0), 0.18)
	tween.finished.connect(func():
		is_dropping_anim = false
		if not is_aiming and not is_celebrating and not is_defeated:
			if eyes_sprite and tex_eyes_normal:
				eyes_sprite.texture = tex_eyes_normal
			if beak_open_sprite:
				beak_open_sprite.visible = false
	)

	# 1. Recoil Kickback - Gà giật bắn ngược lên trên do phản lực phóng (Bắt buộc cho TestRunner)
	recoil_active = true
	var recoil_tween = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	recoil_tween.tween_property(self, "position:y", default_y - 18.0, 0.08)
	recoil_tween.tween_property(self, "position:y", default_y, 0.28).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	recoil_tween.finished.connect(func(): recoil_active = false)

	# 2. Vung giỏ con lắc cực mạnh khi trứng rời giỏ
	if basket_sprite:
		var basket_swing = create_tween().set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
		basket_swing.tween_property(basket_sprite, "rotation", -sign_x * 0.45, 0.08)
		basket_swing.tween_property(basket_sprite, "rotation", sign_x * 0.25, 0.15)
		basket_swing.tween_property(basket_sprite, "rotation", 0.0, 0.25)

	# 3. Đuôi gà ngoáy giật lên cao sau cú phóng
	if tail_sprite:
		var tail_tw = create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tail_tw.tween_property(tail_sprite, "rotation", -0.45, 0.08)
		tail_tw.tween_property(tail_sprite, "rotation", 0.0, 0.25)

	# 4. Nổ hiệu ứng khói và lông gà bung ra dưới giỏ
	if drop_poof_fx:
		drop_poof_fx.global_position = global_position + Vector2(0, 26.0)
		drop_poof_fx.restart()
		drop_poof_fx.emitting = true

	# 5. Âm thanh gà cục tác khi đẻ trứng & rung xúc giác
	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_egg_drop()
	if has_node("/root/SaveManager"):
		get_node("/root/SaveManager").vibrate(28)

	# 6. Sinh quả trứng vật lý
	var egg_scene = egg_scenes[egg_type]
	var egg = egg_scene.instantiate()
	egg.global_position = global_position + Vector2(0, 26.0)
	egg.linear_velocity = launch_vel
	if get_parent():
		get_parent().add_child(egg)
	egg.add_to_group("Eggs")

	# Tạm ẩn trứng trong giỏ, sau 0.22s chuẩn bị nạp quả tiếp theo
	if loaded_egg: loaded_egg.visible = false
	
	egg_spawned.emit(egg)
	drop_cooldown = 0.35 # Khoảng nghỉ chống chạm nhầm 2 ngón cùng lúc
	get_tree().create_timer(0.22).timeout.connect(func():
		_prepare_next_egg()
	)
	_on_aim_end(true)
	GameManager.check_out_of_eggs()

# ==============================================================================
# HOẠT HÌNH ĂN MỪNG THẮNG TRẬN & PHẢN ỨNG THẤT BẠI
# ==============================================================================

func _on_level_completed(_stars: int = 3, _score: int = 0, _coins: int = 50) -> void:
	if is_celebrating: return
	is_celebrating = true
	is_aiming = false

	# Mắt cười tít vui vẻ
	if eyes_sprite and tex_eyes_blink:
		eyes_sprite.texture = tex_eyes_blink
	if beak_open_sprite:
		beak_open_sprite.visible = true
	if goggles_sprite:
		goggles_sprite.position.y = 0.0

	# Thực hiện cú lộn vòng cung 360 độ ăn mừng (Victory 360 Loop-de-loop)
	var victory_tween = create_tween().set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN_OUT)
	victory_tween.tween_property(visual_root, "rotation", visual_root.rotation + TAU, 0.70)
	victory_tween.parallel().tween_property(self, "position:y", default_y - 30.0, 0.35)
	victory_tween.tween_property(self, "position:y", default_y, 0.35)

	# Tung hoa giấy lông gà
	if drop_poof_fx:
		drop_poof_fx.global_position = global_position + Vector2(0, 20.0)
		drop_poof_fx.restart()
		drop_poof_fx.emitting = true

func _on_level_failed() -> void:
	if is_celebrating or is_defeated: return
	is_defeated = true
	if is_aiming:
		is_aiming = false
		_on_aim_end(false)

	# Mắt trố buồn, vai xụi xuống
	if eyes_sprite and tex_eyes_pop:
		eyes_sprite.texture = tex_eyes_pop
	if goggles_sprite:
		# Kính lệch một bên comically
		var gt = create_tween().set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
		gt.tween_property(goggles_sprite, "rotation", 0.25, 0.35)
	if sweat_sprite:
		sweat_sprite.visible = true
		sweat_sprite.position = Vector2(24.0, 4.0)

	# Hai cánh buông thõng thất vọng
	if left_wing: left_wing.rotation = 0.58
	if right_wing: right_wing.rotation = 0.58
