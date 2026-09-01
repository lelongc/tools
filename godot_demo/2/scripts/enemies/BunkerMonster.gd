extends RigidBody2D
class_name BunkerMonster

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export_enum("sly_fox", "fox_guard", "armored_raccoon", "mine_wolf", "spike_hound", "toxic_fox", "imperial_boar", "boss_baron_pig") var monster_type: String = "sly_fox"
@export var max_health: float = 60.0
@export var score_value: int = 800

var current_health: float = 60.0
var is_defeated: bool = false
var is_awake: bool = false
var is_panicking: bool = false
var has_armor: bool = false
var spawn_settle_timer: float = 0.5

@onready var visual_root: Node2D = $VisualRoot
@onready var col_shape: CollisionShape2D = $CollisionShape2D
@onready var body_mesh: Polygon2D = get_node_or_null("VisualRoot/Body")
@onready var eye_left: Polygon2D = get_node_or_null("VisualRoot/EyeL")
@onready var eye_right: Polygon2D = get_node_or_null("VisualRoot/EyeR")
@onready var mouth: Polygon2D = get_node_or_null("VisualRoot/Mouth")
@onready var dizzy_stars: Node2D = get_node_or_null("VisualRoot/DizzyStars")
@onready var poof_fx: CPUParticles2D = get_node_or_null("PoofFX")

func _ready() -> void:
	# Khởi tạo chỉ số và kích thước theo loại quái
	_setup_monster_stats()

	# Đóng băng đứng yên trên sàn
	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC

	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)
	if dizzy_stars: dizzy_stars.visible = false

	# Animation nháy mắt / cười khẩy chào màn chơi
	_play_idle_taunt()

func _setup_monster_stats() -> void:
	match monster_type:
		"sly_fox":
			max_health = 40.0
			mass = 1.5
			score_value = 500
			if body_mesh: body_mesh.color = Color(0.95, 0.45, 0.15)
		"fox_guard":
			max_health = 60.0
			mass = 1.8
			score_value = 800
			if body_mesh: body_mesh.color = Color(0.85, 0.4, 0.2)
		"armored_raccoon":
			max_health = 120.0
			mass = 3.5
			score_value = 1200
			has_armor = true
			if body_mesh: body_mesh.color = Color(0.45, 0.5, 0.55)
		"mine_wolf":
			max_health = 150.0
			mass = 4.0
			score_value = 1500
			if body_mesh: body_mesh.color = Color(0.4, 0.42, 0.48)
		"spike_hound":
			max_health = 220.0
			mass = 5.5
			score_value = 2000
			has_armor = true
			if body_mesh: body_mesh.color = Color(0.65, 0.45, 0.25)
		"toxic_fox":
			max_health = 180.0
			mass = 3.2
			score_value = 1800
			if body_mesh: body_mesh.color = Color(0.3, 0.75, 0.4)
		"imperial_boar":
			max_health = 350.0
			mass = 7.5
			score_value = 3000
			has_armor = true
			if body_mesh: body_mesh.color = Color(0.35, 0.25, 0.3)
		"boss_baron_pig":
			max_health = 1500.0
			mass = 20.0
			score_value = 10000
			has_armor = true
			if visual_root: visual_root.scale = Vector2(1.8, 1.8)
			if col_shape and col_shape.shape is CircleShape2D:
				var big_circle = CircleShape2D.new()
				big_circle.radius = 32.0
				col_shape.shape = big_circle
			if body_mesh: body_mesh.color = Color(0.35, 0.85, 0.4)

	current_health = max_health

func _play_idle_taunt() -> void:
	if not visual_root: return
	var tween = create_tween().set_loops(2)
	tween.tween_property(visual_root, "scale", visual_root.scale * 1.1, 0.2)
	tween.tween_property(visual_root, "scale", visual_root.scale, 0.2)

func wake_up() -> void:
	if is_awake or is_defeated: return
	is_awake = true
	set_deferred("freeze", false)

func _process(delta: float) -> void:
	if spawn_settle_timer > 0.0:
		spawn_settle_timer -= delta

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
	var query = PhysicsRayQueryParameters2D.create(global_position, global_position + Vector2(0, -260.0))
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
	if is_defeated or spawn_settle_timer > 0.0: return
	if not is_awake:
		wake_up()

	if body is RigidBody2D:
		var rel_vel = (linear_velocity - body.linear_velocity).length()
		if rel_vel > 130.0:
			var crush_dmg = (rel_vel - 130.0) * (body.mass * 0.6) + 30.0
			take_damage(crush_dmg, body.global_position)

func take_damage(amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_defeated: return
	if not is_awake:
		wake_up()

	# Cơ chế nón giáp: Giáp hấp thụ sát thương đòn đầu tiên và vỡ tung
	if has_armor:
		has_armor = false
		amount = amount * 0.4
		CameraShake.add_trauma(0.3)

	current_health -= amount

	var tween = create_tween()
	tween.tween_property(visual_root, "modulate", Color(1.0, 0.3, 0.3), 0.05)
	tween.tween_property(visual_root, "modulate", Color.WHITE, 0.08)

	if monster_type == "boss_baron_pig":
		CameraShake.add_trauma(0.4)

	if current_health <= 0.0:
		_defeat_monster()

func _defeat_monster() -> void:
	if is_defeated: return
	is_defeated = true

	GameManager.register_enemy_defeat(self, score_value)
	CameraShake.add_trauma(0.5 if monster_type == "boss_baron_pig" else 0.2)

	$CollisionShape2D.set_deferred("disabled", true)
	set_deferred("freeze", true)

	if visual_root:
		var tween = create_tween().set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
		tween.tween_property(visual_root, "scale", Vector2(visual_root.scale.x * 1.5, visual_root.scale.y * 0.2), 0.12)

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
