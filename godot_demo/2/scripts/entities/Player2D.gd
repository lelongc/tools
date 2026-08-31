extends CharacterBody2D
class_name Player2D

signal hp_changed(current: float, max_hp: float)
signal combo_scored(count: int)
signal pogo_landed()
signal player_died()

@export var move_speed: float = 280.0
@export var jump_velocity: float = -460.0
@export var double_jump_velocity: float = -400.0
@export var gravity: float = 1100.0
@export var max_hp: float = 100.0

var current_hp: float = 100.0
var facing_direction: int = 1 # 1: Right, -1: Left

var can_double_jump: bool = true
var is_dashing: bool = false
var dash_timer: float = 0.0
var dash_cooldown: float = 0.0
var dash_speed: float = 580.0

var is_attacking: bool = false
var attack_timer: float = 0.0
var is_down_slashing: bool = false

var coyote_timer: float = 0.0
var jump_buffer_timer: float = 0.0

var is_dead: bool = false
var is_invulnerable: bool = false
var invuln_timer: float = 0.0

@onready var anim_sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var hitbox: Hitbox2D = $Hitbox2D
@onready var hurtbox: Hurtbox2D = $Hurtbox2D
@onready var attack_shape: CollisionShape2D = $Hitbox2D/CollisionShape2D

func _ready() -> void:
	current_hp = max_hp
	hp_changed.emit(current_hp, max_hp)
	if hurtbox:
		hurtbox.damage_taken.connect(_on_damage_taken)
	if hitbox:
		hitbox.hit_landed.connect(_on_hitbox_hit_landed)
		hitbox.monitoring = false

func _physics_process(delta: float) -> void:
	if is_dead:
		velocity.y += gravity * delta
		move_and_slide()
		return

	# Timers
	if dash_cooldown > 0.0: dash_cooldown -= delta
	if jump_buffer_timer > 0.0: jump_buffer_timer -= delta
	if invuln_timer > 0.0:
		invuln_timer -= delta
		if invuln_timer <= 0.0:
			is_invulnerable = false
			modulate.a = 1.0

	# 1. Xử lý Dash
	if is_dashing:
		dash_timer -= delta
		velocity.x = facing_direction * dash_speed
		velocity.y = 0.0
		if dash_timer <= 0.0:
			is_dashing = false
		move_and_slide()
		return

	# 2. Xử lý Attack Timer
	if is_attacking:
		attack_timer -= delta
		if attack_timer <= 0.0:
			is_attacking = false
			is_down_slashing = false
			if hitbox:
				hitbox.monitoring = false

	# 3. Trọng lực & Coyote Time
	if is_on_floor():
		coyote_timer = 0.12
		can_double_jump = true
	else:
		coyote_timer -= delta
		velocity.y += gravity * delta
		if velocity.y > 700.0: velocity.y = 700.0 # Terminal velocity

	# 4. Nhập phím Nhảy (Jump & Jump Buffer)
	if Input.is_action_just_pressed("ui_up") or Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_SPACE):
		jump_buffer_timer = 0.12

	if jump_buffer_timer > 0.0:
		if is_on_floor() or coyote_timer > 0.0:
			velocity.y = jump_velocity
			coyote_timer = 0.0
			jump_buffer_timer = 0.0
			_create_jump_feathers()
		elif can_double_jump and not is_on_floor():
			velocity.y = double_jump_velocity
			can_double_jump = false
			jump_buffer_timer = 0.0
			_create_jump_feathers()

	# 5. Di chuyển Trái / Phải
	var input_x: float = 0.0
	if Input.is_action_pressed("ui_left") or Input.is_key_pressed(KEY_A):
		input_x -= 1.0
	if Input.is_action_pressed("ui_right") or Input.is_key_pressed(KEY_D):
		input_x += 1.0

	if input_x != 0.0:
		facing_direction = 1 if input_x > 0 else -1
		velocity.x = move_toward(velocity.x, input_x * move_speed, 1800.0 * delta)
		if anim_sprite:
			anim_sprite.flip_h = (facing_direction == -1)
	else:
		velocity.x = move_toward(velocity.x, 0.0, 1500.0 * delta)

	# 6. Tấn công (Attack / Pogo Down Slash)
	if Input.is_key_pressed(KEY_J) or Input.is_key_pressed(KEY_Z) or Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
		var holding_down = Input.is_action_pressed("ui_down") or Input.is_key_pressed(KEY_S)
		_perform_attack(holding_down and not is_on_floor())

	# 7. Lướt Dash (Shift / K / Right Click)
	if (Input.is_key_pressed(KEY_K) or Input.is_key_pressed(KEY_SHIFT) or Input.is_mouse_button_pressed(MOUSE_BUTTON_RIGHT)) and dash_cooldown <= 0.0 and not is_dashing:
		_perform_dash()

	# 8. Cập nhật Animation
	_update_animation()

	move_and_slide()

func _update_animation() -> void:
	if not anim_sprite or is_dead: return

	if is_attacking:
		if anim_sprite.animation != "talon_kick":
			anim_sprite.play("talon_kick")
		return

	if is_on_floor():
		if abs(velocity.x) > 20.0:
			if anim_sprite.animation != "run":
				anim_sprite.play("run")
		else:
			if anim_sprite.animation != "idle":
				anim_sprite.play("idle")
	else:
		if anim_sprite.animation != "hop_forward":
			anim_sprite.play("hop_forward")

func _perform_attack(is_down: bool) -> void:
	if is_attacking or is_dashing: return
	is_attacking = true
	is_down_slashing = is_down
	attack_timer = 0.25

	if hitbox:
		hitbox.is_down_slash = is_down
		hitbox.damage = 30.0 if not is_down else 35.0
		hitbox.monitoring = true
		if is_down:
			hitbox.position = Vector2(0, 32)
			hitbox.knockback_force = Vector2(0, 200)
		else:
			hitbox.position = Vector2(36 * facing_direction, 0)
			hitbox.knockback_force = Vector2(250 * facing_direction, -80)

	if anim_sprite:
		anim_sprite.play("talon_kick")

func _perform_dash() -> void:
	is_dashing = true
	dash_timer = 0.18
	dash_cooldown = 0.55
	is_invulnerable = true
	invuln_timer = 0.22
	modulate.a = 0.6
	_create_dash_particles()

func _on_hitbox_hit_landed(_target: Node2D, is_down: bool) -> void:
	combo_scored.emit(1)
	if is_down and not is_on_floor():
		# POGO BOUNCE!
		velocity.y = -440.0
		can_double_jump = true
		pogo_landed.emit()
		_create_pogo_sparks()

func _on_damage_taken(amount: float, knockback: Vector2) -> void:
	if is_dead or is_invulnerable: return

	current_hp = max(0.0, current_hp - amount)
	hp_changed.emit(current_hp, max_hp)

	# Bị đẩy lùi
	velocity = knockback
	is_invulnerable = true
	invuln_timer = 0.65
	modulate = Color(1.0, 0.3, 0.3, 0.7)

	# Chết
	if current_hp <= 0.0:
		_die()

func _die() -> void:
	is_dead = true
	velocity = Vector2(0, -250)
	if anim_sprite:
		anim_sprite.play("squashed_death")
	player_died.emit()

func _create_jump_feathers() -> void:
	# Visual effect
	pass

func _create_dash_particles() -> void:
	# Visual effect
	pass

func _create_pogo_sparks() -> void:
	# Visual effect
	pass
