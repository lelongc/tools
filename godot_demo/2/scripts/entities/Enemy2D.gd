extends CharacterBody2D
class_name Enemy2D

signal enemy_defeated(pts: int)

enum EnemyState { IDLE, CHASE, ATTACK, HURT, DEAD }

@export var max_hp: float = 60.0
@export var move_speed: float = 140.0
@export var attack_damage: float = 15.0
@export var points_reward: int = 100

var current_hp: float = 60.0
var current_state: EnemyState = EnemyState.IDLE
var target_player: Node2D = null
var state_timer: float = 0.0

@onready var sprite: Sprite2D = $Sprite2D
@onready var hitbox: Hitbox2D = $Hitbox2D
@onready var hurtbox: Hurtbox2D = $Hurtbox2D

func _ready() -> void:
	current_hp = max_hp
	if hurtbox:
		hurtbox.damage_taken.connect(_on_damage_taken)
	if hitbox:
		hitbox.monitoring = false
		hitbox.damage = attack_damage

func _physics_process(delta: float) -> void:
	if current_state == EnemyState.DEAD:
		return
		
	if not is_instance_valid(target_player):
		target_player = get_tree().root.find_child("Player2D", true, false)
		
	match current_state:
		EnemyState.IDLE:
			velocity = velocity.move_toward(Vector2.ZERO, 600.0 * delta)
			if is_instance_valid(target_player):
				var dist = global_position.distance_to(target_player.global_position)
				if dist < 450.0:
					current_state = EnemyState.CHASE
					
		EnemyState.CHASE:
			if is_instance_valid(target_player):
				var diff = target_player.global_position - global_position
				var dist = diff.length()
				if dist <= 55.0:
					_start_attack()
				else:
					var dir = diff.normalized()
					velocity = dir * move_speed
					if sprite: sprite.flip_h = (dir.x < 0)
			else:
				current_state = EnemyState.IDLE
				
		EnemyState.ATTACK:
			velocity = velocity.move_toward(Vector2.ZERO, 800.0 * delta)
			
		EnemyState.HURT:
			velocity = velocity.move_toward(Vector2.ZERO, 500.0 * delta)
			state_timer -= delta
			if state_timer <= 0.0:
				current_state = EnemyState.CHASE
				
	move_and_slide()

func _start_attack() -> void:
	current_state = EnemyState.ATTACK
	velocity = Vector2.ZERO
	
	# Telegraph nhấp nháy đỏ trước khi ra đòn
	if sprite:
		var tw = create_tween()
		tw.tween_property(sprite, "modulate", Color(1.0, 0.4, 0.4), 0.25)
		tw.tween_property(sprite, "modulate", Color.WHITE, 0.1)
		
	await get_tree().create_timer(0.35).timeout
	if current_state == EnemyState.DEAD: return
	
	if hitbox: hitbox.monitoring = true
	SoundManager.play_punch()
	
	await get_tree().create_timer(0.18).timeout
	if hitbox: hitbox.monitoring = false
	current_state = EnemyState.CHASE

func _on_damage_taken(amount: float, kb: Vector2) -> void:
	if current_state == EnemyState.DEAD: return
	
	current_hp -= amount
	current_state = EnemyState.HURT
	state_timer = 0.35
	velocity = kb
	
	_spawn_damage_text(amount)
	
	# Chớp đỏ & nảy giật khi bị đánh
	if sprite:
		var tw = create_tween()
		tw.tween_property(sprite, "modulate", Color(1.0, 0.2, 0.2), 0.05)
		tw.tween_property(sprite, "modulate", Color.WHITE, 0.12)
		tw.tween_property(sprite, "scale", Vector2(1.3, 0.7), 0.06)
		tw.tween_property(sprite, "scale", Vector2.ONE, 0.1)
		
	SoundManager.play_punch()
	
	if current_hp <= 0.0:
		_die()

func _spawn_damage_text(dmg: float) -> void:
	var lbl = Label.new()
	lbl.text = "%d" % int(dmg)
	lbl.add_theme_color_override("font_color", Color(1.0, 0.9, 0.2))
	lbl.add_theme_font_size_override("font_size", 18)
	lbl.global_position = global_position + Vector2(randf_range(-15, 15), -40)
	get_parent().add_child(lbl)
	
	var tw = lbl.create_tween()
	tw.set_parallel(true)
	tw.tween_property(lbl, "position:y", lbl.position.y - 30.0, 0.4).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tw.chain().tween_property(lbl, "modulate:a", 0.0, 0.2)
	tw.chain().tween_callback(lbl.queue_free)

func _die() -> void:
	current_state = EnemyState.DEAD
	if hitbox: hitbox.monitoring = false
	if hurtbox: hurtbox.monitoring = false
	
	SoundManager.play_knockout()
	enemy_defeated.emit(points_reward)
	
	var tw = create_tween()
	tw.set_parallel(true)
	tw.tween_property(self, "rotation", 1.5, 0.3)
	tw.tween_property(self, "modulate:a", 0.0, 0.4)
	tw.chain().tween_callback(queue_free)
