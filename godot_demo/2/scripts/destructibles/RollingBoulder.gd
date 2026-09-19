extends RigidBody2D
class_name RollingBoulder

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export var crush_damage: float = 400.0

var is_awake: bool = false


@onready var visual_sprite: Sprite2D = get_node_or_null("VisualSprite")
@onready var dust_fx: CPUParticles2D = get_node_or_null("DustFX")

func _ready() -> void:
	var current_lvl = GameManager.current_level if has_node("/root/GameManager") else 1
	var world_id = clamp(int(float(current_lvl - 1) / 20.0) + 1, 1, 5)

	if visual_sprite:
		var tex_path = "res://assets/sprites/obstacles/rolling_boulder_stone.svg"
		match world_id:
			4:
				tex_path = "res://assets/sprites/obstacles/rolling_boulder_magma.svg"
			5:
				tex_path = "res://assets/sprites/obstacles/rolling_boulder_crystal.svg"
			_:
				tex_path = "res://assets/sprites/obstacles/rolling_boulder_stone.svg"

		var tex = _load_svg(tex_path)
		if tex: visual_sprite.texture = tex

	if dust_fx:
		ParticleHelper.apply_smoke_fx(dust_fx, 0.25, 0.5)
		if world_id == 4:
			dust_fx.color = Color(1.0, 0.55, 0.2, 0.7)
		elif world_id == 5:
			dust_fx.color = Color(0.75, 0.45, 1.0, 0.7)

	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC
	mass = 8.0
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

	var pmat = PhysicsMaterial.new()
	pmat.friction = 0.95
	pmat.bounce = 0.05
	physics_material_override = pmat
	angular_damp = 4.0
	linear_damp = 1.2

var spawn_settle_timer: float = 0.5
var support_check_timer: float = 0.1

func _physics_process(delta: float) -> void:
	if dust_fx:
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

func _check_underlying_support() -> void:
	# 1. Nền móng bedrock: Nếu tảng đá nằm trên mặt đất (y + 28.0 >= 800.0) thì không bao giờ mất bệ đỡ
	if global_position.y + 28.0 >= 800.0:
		return

	var space_state = get_world_2d().direct_space_state
	if not space_state: return

	# Kiểm tra 3 tia phía dưới bệ đỡ tảng đá (trái, giữa, phải)
	# Tia bắt đầu từ bên trong tảng đá (y = 16.0), bắn xuống 24px (xuyên qua đáy y=28 xuống y=40)
	var test_pts = [
		global_position + Vector2(-14.0, 16.0),
		global_position + Vector2(0.0, 16.0),
		global_position + Vector2(14.0, 16.0)
	]
	var has_valid_support = false
	var ray_length = 24.0

	for pt in test_pts:
		var ray_query = PhysicsRayQueryParameters2D.create(pt, pt + Vector2(0, ray_length))
		ray_query.exclude = [get_rid()]
		ray_query.collide_with_bodies = true
		ray_query.collide_with_areas = false
		ray_query.hit_from_inside = true

		var hit = space_state.intersect_ray(ray_query)
		if hit and hit.collider:
			var col = hit.collider
			if is_instance_valid(col) and col != self:
				if col is StaticBody2D:
					has_valid_support = true
					break
				elif col is RigidBody2D:
					var is_failing = false
					if "is_destroyed" in col and col.is_destroyed:
						is_failing = true
					elif "is_awake" in col and col.is_awake and col.linear_velocity.y > 35.0:
						is_failing = true
					if not is_failing:
						has_valid_support = true
						break

	if not has_valid_support:
		wake_up()

func _load_svg(path: String) -> Texture2D:
	return ParticleHelper._safe_load(path)

func wake_up() -> void:
	if is_awake: return
	if has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		if gm.current_egg_index == 0:
			return # Peacetime lock
	is_awake = true
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

func take_damage(_amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if not is_awake: wake_up()
