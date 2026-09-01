extends CharacterBody2D

signal corn_collected()
signal reached_goal()

@export var player_id: int = 1 # 1: Piyo (Yellow), 2: Shelly (Pink)
@export var move_speed: float = 260.0
@export var jump_velocity: float = -420.0
@export var gravity: float = 950.0
@export var float_gravity_mult: float = 0.35

# State Variables
var is_anchored: bool = false
var is_puffed: bool = false
var is_slingshot_flying: bool = false
var is_slipping: bool = false
var is_respawning: bool = false

var slip_timer: float = 0.0
var slingshot_timer: float = 0.0

var facing_dir: int = 1
var waddle_time: float = 0.0
var current_scale: Vector2 = Vector2.ONE
var spawn_pos: Vector2 = Vector2.ZERO
var last_safe_ground_pos: Vector2 = Vector2.ZERO

var partner: CharacterBody2D = null
var is_ai_controlled: bool = false

@onready var visual_root: Node2D = get_node_or_null("VisualRoot")
@onready var body_mesh: Polygon2D = get_node_or_null("VisualRoot/Body")
@onready var anchor_glow: ColorRect = get_node_or_null("VisualRoot/AnchorGlow")
@onready var puff_aura: CPUParticles2D = get_node_or_null("VisualRoot/PuffParticles")

func _ready() -> void:
	spawn_pos = global_position
	last_safe_ground_pos = global_position
	if anchor_glow: anchor_glow.visible = false
	if puff_aura: puff_aura.emitting = false
	_setup_visual_colors()

func set_partner(other: CharacterBody2D) -> void:
	partner = other

func _setup_visual_colors() -> void:
	if not body_mesh: return
	if player_id == 1:
		body_mesh.color = Color(1.0, 0.88, 0.2, 1.0)
		if has_node("VisualRoot/Comb"):
			$VisualRoot/Comb.color = Color(1.0, 0.35, 0.3, 1.0)
	else:
		body_mesh.color = Color(1.0, 0.65, 0.78, 1.0)
		if has_node("VisualRoot/Comb"):
			$VisualRoot/Comb.color = Color(0.95, 0.9, 0.98, 1.0)

func trigger_banana_slip(slip_spd: float, dur: float) -> void:
	if is_slipping: return
	is_slipping = true
	slip_timer = dur
	velocity.x = facing_dir * slip_spd
	_trigger_squash(Vector2(1.5, 0.5))

func apply_slingshot_impulse(impulse: Vector2) -> void:
	if is_anchored: return
	velocity = impulse
	is_slingshot_flying = true
	slingshot_timer = 0.6
	_trigger_squash(Vector2(0.65, 1.5))

func bounce_off_pad(force: float) -> void:
	velocity.y = -force
	_trigger_squash(Vector2(0.7, 1.45))

func _physics_process(delta: float) -> void:
	# 1. Abyss Check (Rơi quá sâu dưới màn hình thì cứu lên)
	if global_position.y > 480.0 and not is_respawning:
		_respawn_safe()
		return

	# Ghi nhớ vị trí an toàn trên đất
	if is_on_floor() and abs(velocity.x) < 50.0 and not is_slipping:
		last_safe_ground_pos = global_position

	# Timers
	if slingshot_timer > 0.0:
		slingshot_timer -= delta
		if slingshot_timer <= 0.0:
			is_slingshot_flying = false

	if is_slipping:
		slip_timer -= delta
		if visual_root: visual_root.rotation += 20.0 * delta
		velocity.y += gravity * delta
		velocity.x = move_toward(velocity.x, 0.0, 400.0 * delta)
		move_and_slide()
		if slip_timer <= 0.0:
			is_slipping = false
			if visual_root: visual_root.rotation = 0.0
		return

	# 2. Xử lý Input
	var input_x = 0.0
	var jump_pressed = false
	var anchor_held = false
	var puff_held = false

	if is_ai_controlled and partner:
		var diff = partner.global_position.x - global_position.x
		if abs(diff) > 90.0:
			input_x = sign(diff)
		if partner.global_position.distance_to(global_position) > 230.0 and is_on_floor():
			anchor_held = true
		if partner.global_position.y < global_position.y - 70.0 and is_on_floor():
			jump_pressed = true
	else:
		if player_id == 1:
			# P1: WASD / Space / Shift / Gamepad 0
			if Input.is_key_pressed(KEY_A) or Input.get_joy_axis(0, JOY_AXIS_LEFT_X) < -0.3: input_x -= 1.0
			if Input.is_key_pressed(KEY_D) or Input.get_joy_axis(0, JOY_AXIS_LEFT_X) > 0.3: input_x += 1.0
			if Input.is_key_pressed(KEY_S) or Input.is_joy_button_pressed(0, JOY_BUTTON_B): anchor_held = true
			if Input.is_action_just_pressed("ui_accept") or Input.is_key_pressed(KEY_SPACE) or Input.is_key_pressed(KEY_W) or Input.is_joy_button_pressed(0, JOY_BUTTON_A):
				jump_pressed = true
			if Input.is_key_pressed(KEY_SHIFT) or Input.is_key_pressed(KEY_C) or Input.is_joy_button_pressed(0, JOY_BUTTON_X):
				puff_held = true
		else:
			# P2: Arrows / Enter / R_Ctrl / P / Gamepad 1
			if Input.is_action_pressed("ui_left") or Input.get_joy_axis(1, JOY_AXIS_LEFT_X) < -0.3: input_x -= 1.0
			if Input.is_action_pressed("ui_right") or Input.get_joy_axis(1, JOY_AXIS_LEFT_X) > 0.3: input_x += 1.0
			if Input.is_action_pressed("ui_down") or Input.is_joy_button_pressed(1, JOY_BUTTON_B): anchor_held = true
			if Input.is_action_just_pressed("ui_up") or Input.is_key_pressed(KEY_ENTER) or Input.is_key_pressed(KEY_KP_ENTER) or Input.is_joy_button_pressed(1, JOY_BUTTON_A):
				jump_pressed = true
			if Input.is_key_pressed(KEY_SLASH) or Input.is_key_pressed(KEY_PERIOD) or Input.is_key_pressed(KEY_P) or Input.is_key_pressed(KEY_KP_0) or Input.is_joy_button_pressed(1, JOY_BUTTON_X):
				puff_held = true

	# 3. Trạng thái Anchor (Găm Chân)
	if is_on_floor() and anchor_held:
		if not is_anchored:
			is_anchored = true
			if anchor_glow: anchor_glow.visible = true
			_trigger_squash(Vector2(1.3, 0.7))
	else:
		if is_anchored:
			is_anchored = false
			if anchor_glow: anchor_glow.visible = false

	# 4. Trạng thái Puff (Phồng Hơi)
	if puff_held and not is_anchored:
		if not is_puffed:
			is_puffed = true
			if puff_aura: puff_aura.emitting = true
	else:
		if is_puffed:
			is_puffed = false
			if puff_aura: puff_aura.emitting = false

	# 5. Trọng Lực & Nhảy
	var current_grav = gravity * (float_gravity_mult if (is_puffed and velocity.y > 0.0) else 1.0)
	if not is_on_floor():
		velocity.y += current_grav * delta
		if is_puffed and velocity.y > 110.0:
			velocity.y = 110.0
	else:
		if not is_anchored and jump_pressed:
			velocity.y = jump_velocity * (1.15 if is_puffed else 1.0)
			_trigger_squash(Vector2(0.75, 1.4))

	# 6. Di chuyển ngang
	if is_anchored:
		velocity.x = move_toward(velocity.x, 0.0, 3000.0 * delta)
	elif is_slingshot_flying:
		velocity.x = move_toward(velocity.x, input_x * move_speed, 400.0 * delta)
	else:
		var target_spd = input_x * (move_speed * (0.6 if is_puffed else 1.0))
		var accel = 1600.0 if is_on_floor() else 700.0
		velocity.x = move_toward(velocity.x, target_spd, accel * delta)

		if input_x != 0.0:
			facing_dir = 1 if input_x > 0 else -1
			if visual_root:
				visual_root.scale.x = abs(visual_root.scale.x) * facing_dir
			waddle_time += delta * 14.0
		else:
			waddle_time = 0.0

	# 7. Giới hạn vận tốc an toàn (CLAMP SPEED - Không bao giờ văng mất tích)
	velocity.x = clamp(velocity.x, -750.0, 750.0)
	velocity.y = clamp(velocity.y, -900.0, 1000.0)

	_update_jelly_physics(delta, input_x != 0.0)

	var was_on_floor = is_on_floor()
	var prev_vel_y = velocity.y
	move_and_slide()

	if not was_on_floor and is_on_floor() and prev_vel_y > 150.0:
		var squash_amount = clamp(prev_vel_y / 600.0, 0.25, 0.6)
		_trigger_squash(Vector2(1.0 + squash_amount, 1.0 - squash_amount * 0.7))

func _respawn_safe() -> void:
	is_respawning = true
	velocity = Vector2.ZERO

	var target_respawn = last_safe_ground_pos
	if partner and is_instance_valid(partner) and partner.global_position.y < 350.0:
		target_respawn = partner.global_position + Vector2(-30 if player_id == 2 else 30, -10)
	elif target_respawn.y > 400.0:
		target_respawn = spawn_pos

	global_position = target_respawn
	_trigger_squash(Vector2(1.4, 0.6))

	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 0.2, 0.1)
	tween.tween_property(self, "modulate:a", 1.0, 0.2)
	await tween.finished
	is_respawning = false

func _trigger_squash(s: Vector2) -> void:
	current_scale = s

func _update_jelly_physics(delta: float, is_walking: bool) -> void:
	if not visual_root: return

	var base_target = Vector2(1.4, 1.4) if is_puffed else (Vector2(1.25, 0.75) if is_anchored else Vector2.ONE)
	current_scale = current_scale.lerp(base_target, 12.0 * delta)

	var tilt = sin(waddle_time) * 0.14 if (is_walking and is_on_floor()) else 0.0
	visual_root.rotation = lerp_angle(visual_root.rotation, tilt, 14.0 * delta)
	visual_root.scale.y = current_scale.y
	visual_root.scale.x = abs(current_scale.x) * facing_dir
