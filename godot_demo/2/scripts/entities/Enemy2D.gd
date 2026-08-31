extends CharacterBody2D
class_name Enemy2D

signal boss_hp_changed(current: float, max_hp: float)
signal boss_defeated()
signal attack_telegraphed(attack_type: String)

@export var max_hp: float = 250.0
@export var move_speed: float = 160.0
@export var gravity: float = 1100.0

var current_hp: float = 250.0
var facing_direction: int = -1

enum State { IDLE, CHASE, WINDUP, ATTACK, BACKSTEP, CYCLONE, HURT, DEAD }
var current_state: State = State.IDLE

var state_timer: float = 0.0
var attack_cooldown: float = 1.2
var combo_count: int = 0
var is_enraged: bool = false

var player: Node2D = null

@onready var hitbox: Hitbox2D = $Hitbox2D
@onready var hurtbox: Hurtbox2D = $Hurtbox2D
@onready var sprite_root: Node2D = $Visuals
@onready var left_blade: Line2D = $Visuals/LeftBlade
@onready var right_blade: Line2D = $Visuals/RightBlade
@onready var slash_trail: Line2D = $Visuals/SlashTrail

func _ready() -> void:
	current_hp = max_hp
	boss_hp_changed.emit(current_hp, max_hp)
	if hurtbox:
		hurtbox.damage_taken.connect(_on_damage_taken)
	if hitbox:
		hitbox.monitoring = false
		hitbox.is_player_hitbox = false

func set_target_player(p: Node2D) -> void:
	player = p

func _physics_process(delta: float) -> void:
	if current_state == State.DEAD:
		velocity.y += gravity * delta
		velocity.x = move_toward(velocity.x, 0.0, 500.0 * delta)
		move_and_slide()
		return

	if not is_on_floor():
		velocity.y += gravity * delta

	if state_timer > 0.0:
		state_timer -= delta

	if attack_cooldown > 0.0:
		attack_cooldown -= delta

	if not is_enraged and current_hp <= max_hp * 0.5:
		is_enraged = true
		move_speed = 210.0

	match current_state:
		State.IDLE:
			velocity.x = move_toward(velocity.x, 0.0, 800.0 * delta)
			_face_player()
			if state_timer <= 0.0:
				if _get_player_dist() > 180.0:
					_change_state(State.CHASE, randf_range(1.0, 2.0))
				elif attack_cooldown <= 0.0:
					_prepare_attack()

		State.CHASE:
			_face_player()
			velocity.x = facing_direction * move_speed
			if _get_player_dist() <= 130.0 and attack_cooldown <= 0.0:
				_prepare_attack()
			elif state_timer <= 0.0:
				_change_state(State.IDLE, randf_range(0.5, 1.0))

		State.WINDUP:
			velocity.x = move_toward(velocity.x, 0.0, 1000.0 * delta)
			if state_timer <= 0.0:
				_execute_attack()

		State.ATTACK:
			velocity.x = facing_direction * (340.0 if not is_enraged else 420.0)
			if state_timer <= 0.0:
				if hitbox: hitbox.monitoring = false
				attack_cooldown = 1.0 if not is_enraged else 0.65
				if randf() < 0.45:
					_start_backstep()
				else:
					_change_state(State.IDLE, 0.6)

		State.BACKSTEP:
			velocity.x = -facing_direction * 300.0
			if state_timer <= 0.0:
				_change_state(State.IDLE, 0.4)

		State.CYCLONE:
			velocity.x = facing_direction * 380.0
			if state_timer <= 0.0:
				if hitbox: hitbox.monitoring = false
				attack_cooldown = 1.5
				_change_state(State.IDLE, 0.8)

		State.HURT:
			velocity.x = move_toward(velocity.x, 0.0, 600.0 * delta)
			if state_timer <= 0.0:
				_change_state(State.IDLE, 0.18)

	_animate_procedural(delta)
	move_and_slide()

func _face_player() -> void:
	if not player: return
	var dir = 1 if player.global_position.x > global_position.x else -1
	if dir != facing_direction:
		facing_direction = dir
		if sprite_root:
			sprite_root.scale.x = abs(sprite_root.scale.x) * facing_direction
		if hitbox:
			hitbox.position.x = abs(hitbox.position.x) * facing_direction
			hitbox.knockback_force.x = abs(hitbox.knockback_force.x) * facing_direction

func _get_player_dist() -> float:
	if not player: return 9999.0
	return abs(player.global_position.x - global_position.x)

func _change_state(new_state: State, duration: float) -> void:
	current_state = new_state
	state_timer = duration

func _prepare_attack() -> void:
	_face_player()
	attack_telegraphed.emit("twin_slash" if not is_enraged or randf() > 0.5 else "cyclone")
	_change_state(State.WINDUP, 0.35 if not is_enraged else 0.25)

func _execute_attack() -> void:
	if hitbox:
		hitbox.damage = 20.0 if not is_enraged else 28.0
		hitbox.knockback_force = Vector2(300 * facing_direction, -100)
		hitbox.monitoring = true
	_change_state(State.ATTACK, 0.35)

func _start_backstep() -> void:
	velocity.y = -220.0
	_change_state(State.BACKSTEP, 0.35)

func _animate_procedural(_delta: float) -> void:
	if not sprite_root: return

	var t = Time.get_ticks_msec() / 1000.0
	var bob = sin(t * 5.0) * 3.0
	if has_node("Visuals/Torso"):
		$Visuals/Torso.position.y = -28.0 + bob

	if is_enraged:
		if has_node("Visuals/Cloak"): $Visuals/Cloak.color = Color(0.45, 0.08, 0.12, 0.95)
		if has_node("Visuals/EyeGlow"): $Visuals/EyeGlow.color = Color(1.0, 0.1, 0.2, 1.0)
	else:
		if has_node("Visuals/Cloak"): $Visuals/Cloak.color = Color(0.12, 0.15, 0.22, 0.9)
		if has_node("Visuals/EyeGlow"): $Visuals/EyeGlow.color = Color(0.0, 0.9, 0.95, 1.0)

	if current_state == State.WINDUP:
		if left_blade: left_blade.rotation = -0.8
		if right_blade: right_blade.rotation = 0.8
	elif current_state == State.ATTACK:
		if left_blade: left_blade.rotation = 1.2
		if right_blade: right_blade.rotation = 1.4
	else:
		if left_blade: left_blade.rotation = sin(t * 3.0) * 0.2 - 0.3
		if right_blade: right_blade.rotation = -sin(t * 3.0) * 0.2 + 0.3

func _on_damage_taken(amount: float, knockback: Vector2) -> void:
	if current_state == State.DEAD: return

	current_hp = max(0.0, current_hp - amount)
	boss_hp_changed.emit(current_hp, max_hp)

	modulate = Color(2.5, 2.5, 2.5, 1.0)
	var tween = create_tween()
	tween.tween_property(self, "modulate", Color(1.0, 1.0, 1.0, 1.0), 0.15)

	if current_state != State.ATTACK and current_state != State.WINDUP:
		velocity = knockback * 0.5
		_change_state(State.HURT, 0.18)

	if current_hp <= 0.0:
		_die()

func _die() -> void:
	current_state = State.DEAD
	if hitbox: hitbox.monitoring = false
	velocity = Vector2(-facing_direction * 180, -220)
	modulate = Color(0.5, 0.5, 0.5, 0.7)
	boss_defeated.emit()
