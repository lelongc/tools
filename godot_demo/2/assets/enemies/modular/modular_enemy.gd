# modular_enemy.gd
extends RigidBody2D
class_name ModularEnemy

@export var max_health: float = 100.0
var current_health: float

@onready var visual_root = $VisualRoot
@onready var eyes_sprite = $VisualRoot/Face/Eyes
@onready var mouth_snout_sprite = $VisualRoot/Face/SnoutMouth
@onready var helmet_sprite = $VisualRoot/Head/Helmet

# Textures to swap dynamically
@export var eye_normal: Texture2D
@export var eye_panic: Texture2D
@export var eye_hurt: Texture2D
@export var helmet_damaged: Texture2D

var is_dead: bool = false

func _ready():
	current_health = max_health
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

func _integrate_forces(state):
	if is_dead:
		return
	# Rotate facial expressions or lean body along physics velocity
	if linear_velocity.length() > 80.0:
		if eye_panic and eyes_sprite.texture != eye_panic:
			eyes_sprite.texture = eye_panic

func _on_impact(body: Node):
	var impact_speed = linear_velocity.length()
	if impact_speed < 40.0:
		return
		
	var damage = impact_speed * 0.2
	take_damage(damage)

func take_damage(amount: float):
	current_health -= amount
	
	# Squash and stretch spring elasticity
	var tween = create_tween().set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
	visual_root.scale = Vector2(1.28, 0.72)
	tween.tween_property(visual_root, "scale", Vector2(1.0, 1.0), 0.35)
	
	# Swap eye to hurt
	if eye_hurt:
		eyes_sprite.texture = eye_hurt
	
	# Damage helmet at <50% HP
	if current_health <= (max_health * 0.5) and helmet_damaged and helmet_sprite:
		helmet_sprite.texture = helmet_damaged
		
	if current_health <= 0:
		die()

func die():
	is_dead = true
	# Defeated state
	var tween = create_tween().set_parallel(true)
	tween.tween_property(visual_root, "scale", Vector2.ZERO, 0.4).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_IN)
	tween.tween_property(visual_root, "modulate:a", 0.0, 0.4)
	await tween.finished
	queue_free()
