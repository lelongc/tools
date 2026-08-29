extends CharacterBody2D
class_name Player2D

signal hp_changed(current: float, max_hp: float)
signal fury_changed(current: float, max_fury: float)
signal combo_scored(count: int)

@export var move_speed: float = 260.0
@export var max_hp: float = 100.0
@export var max_fury: float = 100.0

var current_hp: float = 100.0
var current_fury: float = 0.0

var is_attacking: bool = false
var is_dashing: bool = false
var is_invulnerable: bool = false
var facing_direction: int = 1 # 1: Right, -1: Left

var combo_step: int = 0
var combo_reset_timer: float = 0.0
var dash_cooldown: float = 0.0
var combo_count: int = 0

@onready var sprite: Sprite2D = $Sprite2D
@onready var hitbox: Hitbox2D = $Hitbox2D
@onready var hurtbox: Hurtbox2D = $Hurtbox2D
@onready var anim_player: AnimationPlayer = $AnimationPlayer

func _ready() -> void:
	current_hp = max_hp
	current_fury = 0.0
	if hurtbox:
		hurtbox.damage_taken.connect(_on_damage_taken)
	if hitbox:
		hitbox.monitoring = false

func _physics_process(delta: float) -> void:
	if dash_cooldown > 0.0: dash_cooldown -= delta
	
	if combo_reset_timer > 0.0:
		combo_reset_timer -= delta
		if combo_reset_timer <= 0.0:
			combo_step = 0
			
	if is_dashing:
		move_and_slide()
		return
		
	if is_attacking:
		velocity = velocity.move_toward(Vector2.ZERO, 800.0 * delta)
		move_and_slide()
		return
		
	# 1. Di chuyển 8 hướng (Beat 'em Up)
	var dir = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	if Input.is_key_pressed(KEY_A): dir.x -= 1.0
	if Input.is_key_pressed(KEY_D): dir.x += 1.0
	if Input.is_key_pressed(KEY_W): dir.y -= 1.0
	if Input.is_key_pressed(KEY_S): dir.y += 1.0
	dir = dir.normalized()
	
	if dir.length_squared() > 0.01:
		velocity = dir * move_speed
		if dir.x > 0.05:
			_set_facing(1)
		elif dir.x < -0.05:
			_set_facing(-1)
	else:
		velocity = velocity.move_toward(Vector2.ZERO, 1200.0 * delta)
		
	move_and_slide()
	
	# 2. Xử lý nút bấm tấn công / lướt
	if Input.is_action_just_pressed("ui_accept") or Input.is_key_pressed(KEY_J) or Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
		_perform_attack()
	elif Input.is_key_pressed(KEY_K) or Input.is_key_pressed(KEY_SPACE):
		_perform_dash()

func _set_facing(dir: int) -> void:
	facing_direction = dir
	if sprite:
		sprite.flip_h = (dir == -1)
	if hitbox:
		hitbox.position.x = abs(hitbox.position.x) * dir

func _perform_attack() -> void:
	if is_attacking or is_dashing: return
	is_attacking = true
	combo_step = (combo_step % 3) + 1
	combo_reset_timer = 0.65
	
	# Tính lực sát thương và hất văng theo combo
	var dmg = 20.0 * combo_step
	var kb_x = (250.0 + combo_step * 100.0) * facing_direction
	var kb_y = -80.0 if combo_step < 3 else -220.0 # Đòn 3 hất tung lên trời
	
	if hitbox:
		hitbox.damage = dmg
		hitbox.knockback_force = Vector2(kb_x, kb_y)
		hitbox.monitoring = true
		
	# Animation vung đòn và hiệu ứng chém
	var tw = create_tween()
	if sprite:
		var target_rot = 0.25 * facing_direction * combo_step
		tw.tween_property(sprite, "rotation", target_rot, 0.08)
		tw.tween_property(sprite, "rotation", 0.0, 0.12)
		
	velocity = Vector2(facing_direction * 180.0, 0)
	SoundManager.play_punch()
	
	await get_tree().create_timer(0.2).timeout
	if hitbox: hitbox.monitoring = false
	is_attacking = false

func _perform_dash() -> void:
	if is_dashing or dash_cooldown > 0.0: return
	is_dashing = true
	is_invulnerable = true
	dash_cooldown = 0.8
	
	velocity = Vector2(facing_direction * 650.0, 0)
	SoundManager.play_whoosh()
	
	# Hiệu ứng mờ bóng ma
	if sprite:
		sprite.modulate = Color(0.2, 0.85, 1.0, 0.6)
		
	await get_tree().create_timer(0.22).timeout
	if sprite: sprite.modulate = Color.WHITE
	is_dashing = false
	is_invulnerable = false

func _on_damage_taken(amount: float, kb: Vector2) -> void:
	if is_invulnerable: return
	current_hp = max(0.0, current_hp - amount)
	hp_changed.emit(current_hp, max_hp)
	
	velocity = kb
	move_and_slide()
	
	# Chớp đỏ khi bị đánh
	if sprite:
		var tw = create_tween()
		tw.tween_property(sprite, "modulate", Color(1.0, 0.2, 0.2), 0.06)
		tw.tween_property(sprite, "modulate", Color.WHITE, 0.1)
		
	SoundManager.play_heavy_hit()
	if current_hp <= 0.0:
		_die()

func _die() -> void:
	SoundManager.play_game_over()
	# Game over logic
