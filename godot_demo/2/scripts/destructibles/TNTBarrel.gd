extends RigidBody2D
class_name TNTBarrel

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var explosion_radius: float = 130.0
@export var explosion_force: float = 850.0
@export var explosion_damage: float = 320.0

var is_ignited: bool = false
var is_awake: bool = false
var spawn_settle_timer: float = 0.5

@onready var visual_sprite: Sprite2D = get_node_or_null("VisualSprite")
@onready var fuse_sparks: CPUParticles2D = get_node_or_null("FuseSparks")
@onready var explosion_fx: CPUParticles2D = get_node_or_null("ExplosionFX")

func _ready() -> void:
	if visual_sprite:
		var tex = _load_svg("res://assets/sprites/obstacles/tnt_barrel_cartoon.svg")
		if tex: visual_sprite.texture = tex

	if fuse_sparks:
		ParticleHelper.apply_spark_fx(fuse_sparks, 0.2, 0.42)
	if explosion_fx:
		ParticleHelper.apply_smoke_fx(explosion_fx, 0.35, 0.75)

	add_to_group("Destructibles")
	add_to_group("Explosives")
	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_STATIC
	linear_damp = 1.0

	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

func _load_svg(path: String) -> Texture2D:
	return ParticleHelper._safe_load(path)

var support_check_timer: float = 0.12

func _process(delta: float) -> void:
	if spawn_settle_timer > 0.0:
		spawn_settle_timer -= delta
		return

	# Đảm bảo dứt khoát: Khi thùng đã thức giấc thì freeze phải bằng false để rơi tự nhiên
	if is_awake and freeze:
		freeze = false

	if has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		if gm.current_egg_index == 0 or not gm.has_first_impact_occurred:
			return

	support_check_timer -= delta
	if support_check_timer <= 0.0:
		support_check_timer = 0.15
		_check_underlying_support()

func _check_underlying_support() -> void:
	if is_ignited: return
	var floor_y = GameManager.current_floor_y if has_node("/root/GameManager") else 840.0
	if (global_position.y + 18.0) >= (floor_y - 4.0):
		return # Đang chạm nền đất cứng bedrock

	var space_state = get_world_2d().direct_space_state
	if not space_state: return

	var ray_query = PhysicsRayQueryParameters2D.create(global_position + Vector2(0, 21.0), global_position + Vector2(0, 29.0))
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
				if not (col is DestructibleBlock):
					is_failing = true
				elif ("is_destroyed" in col and col.is_destroyed) \
					or ("is_broken" in col and col.is_broken) \
					or ("is_breaking" in col and col.is_breaking):
					is_failing = true
				elif "is_awake" in col and col.is_awake and (not col.sleeping or col.linear_velocity.y > 10.0 or col.linear_velocity.length() > 30.0):
					is_failing = true
				elif col.has_method("_quick_check_grounded") and not col._quick_check_grounded():
					is_failing = true
				if not is_failing:
					has_support = true

	if not has_support:
		if not is_awake:
			wake_up(true)
		elif sleeping or freeze:
			sleeping = false
			freeze = false
			set_deferred("freeze", false)

func wake_up(force: bool = false) -> void:
	if is_ignited or is_awake: return
	if not force and has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		if gm.is_level_active and gm.current_egg_index == 0:
			return # Peacetime lock
	is_awake = true
	sleeping = false
	set_deferred("freeze", false)

func _on_impact(body: Node) -> void:
	if is_ignited or spawn_settle_timer > 0.0: return
	if has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		if gm.current_egg_index == 0:
			return
		gm.register_first_impact()

	if body is RigidBody2D:
		var speed = (linear_velocity - body.linear_velocity).length()
		if speed > 65.0 and not is_awake:
			wake_up()
		if speed > 150.0:
			take_damage(50.0, global_position)

func take_damage(_amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_ignited: return
	if has_node("/root/GameManager"):
		get_node("/root/GameManager").register_first_impact()
	if not is_awake:
		wake_up()
	is_ignited = true
	_ignite_fuse()

func _ignite_fuse() -> void:
	if fuse_sparks:
		fuse_sparks.restart()
		fuse_sparks.emitting = true

	var tween = create_tween().set_loops(4)
	if visual_sprite:
		tween.tween_property(visual_sprite, "scale", Vector2(0.88, 0.88), 0.06).set_trans(Tween.TRANS_QUAD)
		tween.parallel().tween_property(visual_sprite, "modulate", Color(1.8, 1.8, 1.8, 1.0), 0.06)
		tween.tween_property(visual_sprite, "scale", Vector2(0.72, 0.72), 0.06).set_trans(Tween.TRANS_QUAD)
		tween.parallel().tween_property(visual_sprite, "modulate", Color(2.0, 0.5, 0.3, 1.0), 0.06)
	
	await tween.finished
	_detonate()

func _detonate() -> void:
	CameraShake.hit_stop(0.08)
	CameraShake.add_trauma(1.0)
	GameManager.add_score(300)

	if has_node("/root/SoundManager"):
		get_node("/root/SoundManager").play_explosion()
	if has_node("/root/SaveManager"):
		get_node("/root/SaveManager").vibrate(50)

	CartoonExplosionFX.spawn_comic_explosion(get_parent(), global_position, explosion_radius)
	ParticleHelper.spawn_egg_break_fx(get_parent(), global_position, "bomb", false)
	ParticleHelper.spawn_comic_popup(get_parent(), global_position, "KABOOM!", Color(1.0, 0.35, 0.1))

	set_deferred("freeze", true)
	if visual_sprite: visual_sprite.visible = false
	$CollisionShape2D.set_deferred("disabled", true)

	if explosion_fx:
		explosion_fx.restart()
		explosion_fx.emitting = true

	var space_state = get_world_2d().direct_space_state
	var query = PhysicsShapeQueryParameters2D.new()
	var circle_shape = CircleShape2D.new()
	circle_shape.radius = explosion_radius
	query.shape = circle_shape
	query.transform = global_transform
	query.collide_with_bodies = true

	for res in space_state.intersect_shape(query, 32):
		var col = res.collider
		if is_instance_valid(col) and col != self:
			var diff = col.global_position - global_position
			var dist = max(diff.length(), 10.0)
			var dir = diff.normalized()
			var falloff = 1.0 - clamp(dist / explosion_radius, 0.0, 0.8)

			if col.has_method("wake_up"):
				col.wake_up()

			if col is RigidBody2D:
				var push = dir * explosion_force * falloff
				col.apply_central_impulse(push)

			if col.has_method("take_damage"):
				col.take_damage(explosion_damage * falloff, global_position)

	if not is_inside_tree() or not get_tree():
		queue_free()
		return

	# Thông báo cho quái vật xung quanh về vụ nổ gần kề
	get_tree().call_group("Enemies", "on_near_explosion", global_position, explosion_radius)

	await get_tree().create_timer(0.6).timeout
	if is_inside_tree():
		queue_free()
