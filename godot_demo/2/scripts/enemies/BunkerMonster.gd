extends RigidBody2D
class_name BunkerMonster

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var monster_type: String = "fox"
@export var max_health: float = 60.0
@export var score_value: int = 800

var current_health: float = 60.0
var is_defeated: bool = false
var is_panicking: bool = false
var spawn_immunity: float = 0.25

@onready var visual_root: Node2D = $VisualRoot
@onready var eye_left: Polygon2D = get_node_or_null("VisualRoot/EyeL")
@onready var eye_right: Polygon2D = get_node_or_null("VisualRoot/EyeR")
@onready var mouth: Polygon2D = get_node_or_null("VisualRoot/Mouth")
@onready var dizzy_stars: Node2D = get_node_or_null("VisualRoot/DizzyStars")
@onready var poof_fx: CPUParticles2D = get_node_or_null("PoofFX")

func _ready() -> void:
	current_health = max_health
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)
	if dizzy_stars: dizzy_stars.visible = false

func _process(delta: float) -> void:
	if spawn_immunity > 0.0:
		spawn_immunity -= delta

	if is_defeated: return

	_check_for_falling_threats()

	if is_panicking:
		if visual_root:
			visual_root.position.x = sin(Time.get_ticks_msec() * 0.05) * 3.0
	else:
		if visual_root:
			visual_root.position.x = 0.0

func _check_for_falling_threats() -> void:
	var space_state = get_world_2d().direct_space_state
	var query = PhysicsRayQueryParameters2D.create(global_position, global_position + Vector2(0, -220.0))
	query.collide_with_bodies = true
	var res = space_state.intersect_ray(query)
	
	if res and res.collider is RigidBody2D and res.collider.linear_velocity.y > 80.0:
		_set_panic_state(true)
	else:
		_set_panic_state(false)

func _set_panic_state(panic: bool) -> void:
	if is_panicking == panic: return
	is_panicking = panic
	
	if eye_left and eye_right and mouth:
		if panic:
			eye_left.scale = Vector2(1.4, 1.4)
			eye_right.scale = Vector2(1.4, 1.4)
			mouth.scale = Vector2(1.5, 1.5)
		else:
			eye_left.scale = Vector2.ONE
			eye_right.scale = Vector2.ONE
			mouth.scale = Vector2.ONE

func _on_impact(body: Node) -> void:
	if is_defeated or spawn_immunity > 0.0: return
	if body is RigidBody2D:
		var rel_vel = (linear_velocity - body.linear_velocity).length()
		if rel_vel > 130.0:
			var crush_dmg = (rel_vel - 130.0) * (body.mass * 0.6) + 30.0
			take_damage(crush_dmg, body.global_position)

func take_damage(amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_defeated or spawn_immunity > 0.0: return
	current_health -= amount

	var tween = create_tween()
	tween.tween_property(visual_root, "modulate", Color(1.0, 0.3, 0.3), 0.05)
	tween.tween_property(visual_root, "modulate", Color.WHITE, 0.08)

	if current_health <= 0.0:
		_defeat_monster()

func _defeat_monster() -> void:
	if is_defeated: return
	is_defeated = true

	GameManager.register_enemy_defeat(self, score_value)
	CameraShake.add_trauma(0.2)

	$CollisionShape2D.set_deferred("disabled", true)
	set_deferred("freeze", true)

	if visual_root:
		var tween = create_tween().set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
		tween.tween_property(visual_root, "scale", Vector2(1.6, 0.25), 0.12)

	if dizzy_stars:
		dizzy_stars.visible = true
		var star_tween = create_tween().set_loops(2)
		star_tween.tween_property(dizzy_stars, "rotation", TAU, 0.3)

	await get_tree().create_timer(0.4).timeout

	if poof_fx:
		poof_fx.restart()
		poof_fx.emitting = true

	if visual_root: visual_root.visible = false
	await get_tree().create_timer(0.4).timeout
	queue_free()
