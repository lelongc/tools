extends RigidBody2D
class_name RescueCage

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

var is_broken: bool = false
var is_awake: bool = false

@onready var visual_cage: Node2D = $Visual
@onready var cage_bars: Sprite2D = get_node_or_null("Visual/CageBars")
@onready var chick: Sprite2D = get_node_or_null("Visual/Chick")
@onready var confetti_fx: CPUParticles2D = $ConfettiFX

func _ready() -> void:
	add_to_group("Destructibles")
	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

	if cage_bars:
		var tc = ParticleHelper._safe_load("res://assets/sprites/obstacles/rescue_cage_cartoon.svg")
		if tc: cage_bars.texture = tc

	if chick:
		var tk = ParticleHelper._safe_load("res://assets/sprites/projectiles/chick_cute_cartoon.svg")
		if tk: chick.texture = tk

	if confetti_fx:
		ParticleHelper.apply_confetti_fx(confetti_fx, 0.3, 0.65)

var support_check_timer: float = 0.12

func _process(delta: float) -> void:
	if is_broken: return

	if chick:
		var t = Time.get_ticks_msec() * 0.005
		var breath = sin(t) * 0.05
		chick.scale = Vector2(0.65 * (1.0 + breath), 0.65 * (1.0 - breath))

	if not is_awake:
		if has_node("/root/GameManager"):
			var gm = get_node("/root/GameManager")
			if gm.current_egg_index == 0:
				return
		support_check_timer -= delta
		if support_check_timer <= 0.0:
			support_check_timer = 0.12
			_check_underlying_support()
	else:
		if sleeping:
			support_check_timer -= delta
			if support_check_timer <= 0.0:
				support_check_timer = 0.12
				_check_underlying_support()

func _check_underlying_support() -> void:
	if is_broken: return
	var floor_y = GameManager.current_floor_y if has_node("/root/GameManager") else 840.0
	if (global_position.y + 18.0) >= (floor_y - 4.0):
		return # Đang chạm nền đất cứng bedrock

	var space_state = get_world_2d().direct_space_state
	if not space_state: return

	var ray_query = PhysicsRayQueryParameters2D.create(global_position, global_position + Vector2(0, 28.0))
	ray_query.exclude = [get_rid()]
	ray_query.collide_with_bodies = true
	ray_query.collide_with_areas = false
	ray_query.hit_from_inside = true

	var hit = space_state.intersect_ray(ray_query)
	var has_support = false
	if hit and hit.collider:
		var col = hit.collider
		if is_instance_valid(col) and col != self and not col.is_queued_for_deletion():
			if col is StaticBody2D:
				has_support = true
			elif col is RigidBody2D:
				var is_failing = false
				if ("is_destroyed" in col and col.is_destroyed) \
					or ("is_defeated" in col and col.is_defeated) \
					or ("is_ignited" in col and col.is_ignited) \
					or ("is_broken" in col and col.is_broken) \
					or ("is_breaking" in col and col.is_breaking):
					is_failing = true
				elif "is_awake" in col and col.is_awake and (not col.sleeping or col.linear_velocity.y > 10.0 or col.linear_velocity.length() > 30.0):
					is_failing = true
				if not is_failing:
					has_support = true

	if not has_support:
		if not is_awake:
			wake_up()
		elif sleeping:
			sleeping = false
			apply_central_impulse(Vector2(0, 20.0))

func wake_up() -> void:
	if is_broken: return
	if has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		if gm.current_egg_index == 0:
			return # Peacetime lock
	is_awake = true
	sleeping = false
	set_deferred("freeze", false)

func _on_impact(body: Node) -> void:
	if is_broken: return
	if has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		if gm.current_egg_index == 0:
			return
	if not is_awake: wake_up()

	if body is RigidBody2D:
		var speed = (linear_velocity - body.linear_velocity).length()
		if speed > 140.0:
			take_damage(50.0, global_position)

func take_damage(_amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_broken: return
	_break_open()

func _break_open() -> void:
	if is_broken: return
	is_broken = true

	CameraShake.add_trauma(0.2)
	GameManager.add_score(1000) # Thưởng lớn khi cứu gà con
	ComicScorePopup.spawn_score_popup(get_parent(), global_position, 1000)

	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_chick_chirp()

	$CollisionShape2D.set_deferred("disabled", true)
	set_deferred("freeze", true)

	if confetti_fx:
		confetti_fx.restart()
		confetti_fx.emitting = true

	# Bé gà con vui sướng bay vút lên trời theo phương thẳng đứng toàn cục
	if chick:
		var start_global = chick.global_position
		chick.top_level = true
		chick.global_position = start_global
		chick.global_rotation = 0.0
		var tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tween.tween_property(chick, "global_position:y", start_global.y - 180.0, 0.85)
		tween.tween_property(chick, "scale", Vector2(1.15, 1.15), 0.4)
		tween.tween_property(chick, "modulate:a", 0.0, 0.85)

	if cage_bars:
		var tween = create_tween()
		tween.tween_property(cage_bars, "modulate:a", 0.0, 0.25)

	if not is_inside_tree() or not get_tree():
		queue_free()
		return

	await get_tree().create_timer(1.0).timeout
	if is_inside_tree():
		queue_free()
