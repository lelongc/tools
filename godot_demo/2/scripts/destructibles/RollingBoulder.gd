extends RigidBody2D
class_name RollingBoulder

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var crush_damage: float = 400.0

var is_awake: bool = false


@onready var visual_sprite: Sprite2D = get_node_or_null("VisualSprite")
@onready var dust_fx: CPUParticles2D = get_node_or_null("DustFX")

func _ready() -> void:
	var current_lvl = GameManager.current_level if has_node("/root/GameManager") else 1
	var world_id = clamp(int(float(current_lvl - 1) / 20.0) + 1, 1, 10)

	if visual_sprite:
		var tex_path = "res://assets/sprites/obstacles/rolling_boulder_stone.svg"
		match world_id:
			4, 9:
				tex_path = "res://assets/sprites/obstacles/rolling_boulder_magma.svg"
			5, 10:
				tex_path = "res://assets/sprites/obstacles/rolling_boulder_crystal.svg"
			_:
				tex_path = "res://assets/sprites/obstacles/rolling_boulder_stone.svg"

		var tex = _load_svg(tex_path)
		if tex: visual_sprite.texture = tex

	if dust_fx:
		dust_fx.top_level = true
		ParticleHelper.apply_smoke_fx(dust_fx, 0.25, 0.5)
		if world_id in [4, 9]:
			dust_fx.color = Color(1.0, 0.55, 0.2, 0.7)
		elif world_id in [5, 10]:
			dust_fx.color = Color(0.75, 0.45, 1.0, 0.7)
		elif world_id == 6:
			dust_fx.color = Color(0.2, 0.9, 1.0, 0.7)
		elif world_id == 7:
			dust_fx.color = Color(0.4, 0.85, 0.4, 0.7)
		elif world_id == 8:
			dust_fx.color = Color(0.6, 0.85, 1.0, 0.7)

	add_to_group("Destructibles")
	continuous_cd = RigidBody2D.CCD_MODE_CAST_SHAPE
	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC
	mass = 8.0
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

	var pmat = PhysicsMaterial.new()
	pmat.friction = 0.55
	pmat.bounce = 0.12
	physics_material_override = pmat
	angular_damp = 1.2
	linear_damp = 0.5

var spawn_settle_timer: float = 0.5
var support_check_timer: float = 0.1

func _physics_process(delta: float) -> void:
	# Tự động giải phóng khi tảng đá lọt khỏi sàn hang ngầm
	var floor_y = GameManager.current_floor_y if has_node("/root/GameManager") else 840.0
	if global_position.y > floor_y + 180.0 or abs(global_position.x) > 2000.0:
		queue_free()
		return

	if dust_fx:
		dust_fx.global_position = global_position + Vector2(0, 24.0)
		dust_fx.global_rotation = 0.0
		if abs(linear_velocity.x) > 20.0:
			dust_fx.direction = Vector2(-sign(linear_velocity.x), -0.4).normalized()
		dust_fx.emitting = (is_awake and linear_velocity.length() > 65.0)

	if not is_awake:
		if spawn_settle_timer > 0.0:
			spawn_settle_timer -= delta
			return
		# KHÓA CỐ ĐỊNH 100%: Tuyệt đối không tự rã đông khi người chơi chưa bắn quả trứng nào
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
	# 1. Nền móng bedrock: Nếu tảng đá tiếp xúc sàn đất thực tế của màn chơi (floor_y) thì không bao giờ mất bệ đỡ
	var floor_y = GameManager.current_floor_y if has_node("/root/GameManager") else 840.0
	if (global_position.y + 28.0) >= (floor_y - 4.0):
		return

	var space_state = get_world_2d().direct_space_state
	if not space_state: return

	# Kiểm tra 3 tia phía dưới bệ đỡ tảng đá (trái, giữa, phải)
	# Tia bắt đầu từ bên trong tảng đá (y = 16.0), bắn xuống 26px (xuyên qua đáy y=28)
	var test_pts = [
		global_position + Vector2(-14.0, 16.0),
		global_position + Vector2(0.0, 16.0),
		global_position + Vector2(14.0, 16.0)
	]
	var has_valid_support = false
	var ray_length = 26.0

	for pt in test_pts:
		var ray_query = PhysicsRayQueryParameters2D.create(pt, pt + Vector2(0, ray_length))
		ray_query.exclude = [get_rid()]
		ray_query.collide_with_bodies = true
		ray_query.collide_with_areas = false
		ray_query.hit_from_inside = true

		var hit = space_state.intersect_ray(ray_query)
		if hit and hit.collider:
			var col = hit.collider
			if is_instance_valid(col) and col != self and not col.is_queued_for_deletion():
				if col is StaticBody2D:
					has_valid_support = true
					break
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
						has_valid_support = true
						break

	if not has_valid_support:
		if not is_awake:
			wake_up()
		elif sleeping:
			sleeping = false
			apply_central_impulse(Vector2(0, 20.0))

func _load_svg(path: String) -> Texture2D:
	return ParticleHelper._safe_load(path)

func wake_up() -> void:
	if has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		if gm.current_egg_index == 0:
			return # Peacetime lock
	is_awake = true
	sleeping = false
	set_deferred("freeze", false)

func _on_impact(body: Node) -> void:
	if has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		if gm.current_egg_index == 0:
			return # Peacetime lock

	var my_speed = linear_velocity.length()
	var body_speed = 0.0
	if body is RigidBody2D:
		body_speed = body.linear_velocity.length()

	# Chỉ thức giấc khi có xung lực va chạm thực sự
	if (my_speed > 60.0 or body_speed > 60.0) and not is_awake:
		wake_up()

	if my_speed > 80.0 and body.has_method("wake_up"):
		body.wake_up()

	if my_speed > 100.0 and body.has_method("take_damage"):
		body.take_damage(crush_damage * (my_speed / 200.0), global_position)
		CameraShake.add_trauma(0.2)
		if body.is_in_group("Enemies") and my_speed > 160.0:
			ParticleHelper.spawn_comic_popup(get_parent(), global_position, "CRUNCH!", Color(1.0, 0.6, 0.1))

func take_damage(_amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if not is_awake: wake_up()
