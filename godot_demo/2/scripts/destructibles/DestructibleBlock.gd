extends RigidBody2D
class_name DestructibleBlock

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")

@export_enum("wood", "stone", "glass", "steel", "obsidian", "crystal") var material_type: String = "wood"
@export var max_health: float = 130.0
@export var block_size: Vector2 = Vector2(120, 24)

var current_health: float = 130.0
var is_destroyed: bool = false
var is_awake: bool = false
var spawn_settle_timer: float = 0.5
var base_visual_pos: Vector2 = Vector2.ZERO
var damage_flash_cooldown: float = 0.0
var micro_jitter_timer: float = 0.0

@onready var col_shape: CollisionShape2D = $CollisionShape2D
@onready var block_visual: NinePatchRect = $BlockVisual
@onready var crack_stage1: NinePatchRect = $CrackStage1
@onready var crack_stage2: NinePatchRect = $CrackStage2
@onready var fracture_particles: CPUParticles2D = $FractureFX

# Texture Cache
static var tex_wood: Texture2D = null
static var tex_stone: Texture2D = null
static var tex_glass: Texture2D = null
static var tex_steel: Texture2D = null
static var tex_obsidian: Texture2D = null
static var tex_crystal: Texture2D = null
static var tex_cyber_alloy: Texture2D = null
static var tex_swamp_wood: Texture2D = null
static var tex_permafrost: Texture2D = null
static var tex_magma_brick: Texture2D = null
static var tex_celestial_stone: Texture2D = null

static var tex_pillar_wood: Texture2D = null
static var tex_pillar_stone: Texture2D = null
static var tex_pillar_glass: Texture2D = null
static var tex_girder_steel: Texture2D = null
static var tex_pillar_obsidian: Texture2D = null
static var tex_pillar_crystal: Texture2D = null
static var tex_pillar_cyber: Texture2D = null
static var tex_pillar_swamp: Texture2D = null
static var tex_pillar_permafrost: Texture2D = null
static var tex_pillar_magma: Texture2D = null
static var tex_pillar_celestial: Texture2D = null

static var tex_crack_wood_l: Texture2D = null
static var tex_crack_wood_h: Texture2D = null
static var tex_crack_stone_l: Texture2D = null
static var tex_crack_stone_h: Texture2D = null
static var tex_crack_glass_l: Texture2D = null
static var tex_crack_glass_h: Texture2D = null
static var tex_crack_steel_l: Texture2D = null
static var tex_crack_steel_h: Texture2D = null
static var tex_crack_obsidian_l: Texture2D = null
static var tex_crack_obsidian_h: Texture2D = null
static var tex_crack_crystal_l: Texture2D = null
static var tex_crack_crystal_h: Texture2D = null
static var tex_crack_cyber_l: Texture2D = null
static var tex_crack_cyber_h: Texture2D = null
static var tex_crack_swamp_l: Texture2D = null
static var tex_crack_swamp_h: Texture2D = null
static var tex_crack_frost_l: Texture2D = null
static var tex_crack_frost_h: Texture2D = null
static var tex_crack_magma_l: Texture2D = null
static var tex_crack_magma_h: Texture2D = null
static var tex_crack_celestial_l: Texture2D = null
static var tex_crack_celestial_h: Texture2D = null

static var tex_shard_wood: Texture2D = null
static var tex_shard_stone: Texture2D = null
static var tex_shard_glass: Texture2D = null
static var tex_smoke_puff: Texture2D = null

func _ready() -> void:
	add_to_group("Destructibles")
	_load_textures_once()
	_apply_block_dimensions()

	set_deferred("freeze", true)
	freeze_mode = RigidBody2D.FREEZE_MODE_KINEMATIC

	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_impact)

	linear_damp = 1.2
	angular_damp = 4.0

	var pmat = PhysicsMaterial.new()
	pmat.friction = 0.85
	pmat.bounce = 0.0
	physics_material_override = pmat

	if fracture_particles:
		ParticleHelper.apply_smoke_fx(fracture_particles, 0.25, 0.5)

func _load_textures_once() -> void:
	if tex_wood == null:
		tex_wood = _safe_load_tex("res://assets/sprites/obstacles/wood_block_plank.svg")
		tex_stone = _safe_load_tex("res://assets/sprites/obstacles/stone_block_brick.svg")
		tex_glass = _safe_load_tex("res://assets/sprites/obstacles/glass_block_ice.svg")
		tex_steel = _safe_load_tex("res://assets/sprites/obstacles/steel_block_beam.svg")
		tex_obsidian = _safe_load_tex("res://assets/sprites/obstacles/obsidian_block_runic.svg")
		tex_crystal = _safe_load_tex("res://assets/sprites/obstacles/crystal_block_prism.svg")
		tex_cyber_alloy = _safe_load_tex("res://assets/sprites/obstacles/cyber_alloy_block.svg")
		tex_swamp_wood = _safe_load_tex("res://assets/sprites/obstacles/swamp_wood_block.svg")
		tex_permafrost = _safe_load_tex("res://assets/sprites/obstacles/permafrost_block.svg")
		tex_magma_brick = _safe_load_tex("res://assets/sprites/obstacles/magma_brick_block.svg")
		tex_celestial_stone = _safe_load_tex("res://assets/sprites/obstacles/celestial_stone_block.svg")

		tex_pillar_wood = _safe_load_tex("res://assets/sprites/obstacles/wood_pillar_column.svg")
		tex_pillar_stone = _safe_load_tex("res://assets/sprites/obstacles/stone_pillar_column.svg")
		tex_pillar_glass = _safe_load_tex("res://assets/sprites/obstacles/glass_pillar_column.svg")
		tex_girder_steel = _safe_load_tex("res://assets/sprites/obstacles/steel_girder_column.svg")
		tex_pillar_obsidian = _safe_load_tex("res://assets/sprites/obstacles/obsidian_pillar_column.svg")
		tex_pillar_crystal = _safe_load_tex("res://assets/sprites/obstacles/crystal_pillar_column.svg")
		tex_pillar_cyber = _safe_load_tex("res://assets/sprites/obstacles/cyber_alloy_pillar.svg")
		tex_pillar_swamp = _safe_load_tex("res://assets/sprites/obstacles/swamp_wood_pillar.svg")
		tex_pillar_permafrost = _safe_load_tex("res://assets/sprites/obstacles/permafrost_pillar.svg")
		tex_pillar_magma = _safe_load_tex("res://assets/sprites/obstacles/magma_brick_pillar.svg")
		tex_pillar_celestial = _safe_load_tex("res://assets/sprites/obstacles/celestial_stone_pillar.svg")

		tex_crack_wood_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_wood_light.svg")
		tex_crack_wood_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_wood_heavy.svg")
		tex_crack_stone_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_stone_light.svg")
		tex_crack_stone_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_stone_heavy.svg")
		tex_crack_glass_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_glass_light.svg")
		tex_crack_glass_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_glass_heavy.svg")
		tex_crack_steel_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_steel_light.svg")
		tex_crack_steel_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_steel_heavy.svg")
		tex_crack_obsidian_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_obsidian_light.svg")
		tex_crack_obsidian_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_obsidian_heavy.svg")
		tex_crack_crystal_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_crystal_light.svg")
		tex_crack_crystal_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_crystal_heavy.svg")
		tex_crack_cyber_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_cyber_light.svg")
		tex_crack_cyber_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_cyber_heavy.svg")
		tex_crack_swamp_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_swamp_light.svg")
		tex_crack_swamp_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_swamp_heavy.svg")
		tex_crack_frost_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_frost_light.svg")
		tex_crack_frost_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_frost_heavy.svg")
		tex_crack_magma_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_magma_light.svg")
		tex_crack_magma_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_magma_heavy.svg")
		tex_crack_celestial_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_celestial_light.svg")
		tex_crack_celestial_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_celestial_heavy.svg")

		tex_shard_wood = _safe_load_tex("res://assets/sprites/vfx/debris_wood_shard.svg")
		tex_shard_stone = _safe_load_tex("res://assets/sprites/vfx/debris_stone_shard.svg")
		tex_shard_glass = _safe_load_tex("res://assets/sprites/vfx/debris_glass_shard.svg")
		tex_smoke_puff = _safe_load_tex("res://assets/sprites/vfx/smoke_puff_cartoon.svg")

func _safe_load_tex(path: String) -> Texture2D:
	return ParticleHelper._safe_load(path)

func _apply_block_dimensions() -> void:
	if col_shape:
		var rect = RectangleShape2D.new()
		rect.size = block_size
		col_shape.shape = rect

	var hw = block_size.x * 0.5
	var hh = block_size.y * 0.5

	# Tự động tính toán patch_margin thông minh để không bao giờ bị méo mó/chèn ép
	var margin_x = clamp(int(block_size.x * 0.22), 2, 8)
	var margin_y = clamp(int(block_size.y * 0.22), 2, 8)

	if block_visual:
		block_visual.size = block_size
		base_visual_pos = Vector2(-hw, -hh)
		block_visual.position = base_visual_pos
		block_visual.modulate = Color.WHITE
		block_visual.patch_margin_left = margin_x
		block_visual.patch_margin_right = margin_x
		block_visual.patch_margin_top = margin_y
		block_visual.patch_margin_bottom = margin_y

	if crack_stage1:
		crack_stage1.size = block_size
		crack_stage1.position = Vector2(-hw, -hh)
		crack_stage1.visible = false
		crack_stage1.patch_margin_left = margin_x
		crack_stage1.patch_margin_right = margin_x
		crack_stage1.patch_margin_top = margin_y
		crack_stage1.patch_margin_bottom = margin_y

	if crack_stage2:
		crack_stage2.size = block_size
		crack_stage2.position = Vector2(-hw, -hh)
		crack_stage2.visible = false
		crack_stage2.patch_margin_left = margin_x
		crack_stage2.patch_margin_right = margin_x
		crack_stage2.patch_margin_top = margin_y
		crack_stage2.patch_margin_bottom = margin_y

	var is_vertical = block_size.y > block_size.x * 1.3
	match material_type:
		"wood":
			max_health = 130.0
			mass = (block_size.x * block_size.y) * 0.0016
			if block_visual: block_visual.texture = tex_pillar_wood if (is_vertical and tex_pillar_wood) else tex_wood
			if crack_stage1: crack_stage1.texture = tex_crack_wood_l
			if crack_stage2: crack_stage2.texture = tex_crack_wood_h
			if fracture_particles: fracture_particles.color = Color(0.85, 0.60, 0.30)
		"stone":
			max_health = 340.0
			mass = (block_size.x * block_size.y) * 0.0048
			if block_visual: block_visual.texture = tex_pillar_stone if (is_vertical and tex_pillar_stone) else tex_stone
			if crack_stage1: crack_stage1.texture = tex_crack_stone_l
			if crack_stage2: crack_stage2.texture = tex_crack_stone_h
			if fracture_particles: fracture_particles.color = Color(0.65, 0.68, 0.72)
		"glass":
			max_health = 40.0
			mass = (block_size.x * block_size.y) * 0.0008
			if block_visual: block_visual.texture = tex_pillar_glass if (is_vertical and tex_pillar_glass) else tex_glass
			if crack_stage1: crack_stage1.texture = tex_crack_glass_l
			if crack_stage2: crack_stage2.texture = tex_crack_glass_h
			if fracture_particles: fracture_particles.color = Color(0.60, 0.90, 0.98, 0.85)
		"steel":
			max_health = 650.0
			mass = (block_size.x * block_size.y) * 0.0070
			if block_visual: block_visual.texture = tex_girder_steel if (is_vertical and tex_girder_steel) else tex_steel
			if crack_stage1: crack_stage1.texture = tex_crack_steel_l
			if crack_stage2: crack_stage2.texture = tex_crack_steel_h
			if fracture_particles: fracture_particles.color = Color(0.45, 0.52, 0.60)
		"obsidian":
			max_health = 950.0
			mass = (block_size.x * block_size.y) * 0.0100
			if block_visual:
				block_visual.texture = tex_pillar_obsidian if (is_vertical and tex_pillar_obsidian) else tex_obsidian
				block_visual.modulate = Color.WHITE
			if crack_stage1: crack_stage1.texture = tex_crack_obsidian_l
			if crack_stage2: crack_stage2.texture = tex_crack_obsidian_h
			if fracture_particles: fracture_particles.color = Color(0.75, 0.25, 0.95)
		"crystal":
			max_health = 220.0
			mass = (block_size.x * block_size.y) * 0.0022
			if block_visual:
				block_visual.texture = tex_pillar_crystal if (is_vertical and tex_pillar_crystal) else tex_crystal
				block_visual.modulate = Color.WHITE
			if crack_stage1: crack_stage1.texture = tex_crack_crystal_l
			if crack_stage2: crack_stage2.texture = tex_crack_crystal_h
			if fracture_particles: fracture_particles.color = Color(0.60, 0.85, 1.0, 0.9)
		"cyber_alloy":
			max_health = 750.0
			mass = (block_size.x * block_size.y) * 0.0075
			if block_visual:
				block_visual.texture = tex_pillar_cyber if (is_vertical and tex_pillar_cyber) else tex_cyber_alloy
				block_visual.modulate = Color.WHITE
			if crack_stage1: crack_stage1.texture = tex_crack_cyber_l
			if crack_stage2: crack_stage2.texture = tex_crack_cyber_h
			if fracture_particles: fracture_particles.color = Color(0.0, 0.9, 1.0, 0.95)
		"swamp_wood":
			max_health = 190.0
			mass = (block_size.x * block_size.y) * 0.0022
			if block_visual:
				block_visual.texture = tex_pillar_swamp if (is_vertical and tex_pillar_swamp) else tex_swamp_wood
				block_visual.modulate = Color.WHITE
			if crack_stage1: crack_stage1.texture = tex_crack_swamp_l
			if crack_stage2: crack_stage2.texture = tex_crack_swamp_h
			if fracture_particles: fracture_particles.color = Color(0.46, 0.85, 0.22, 0.9)
		"permafrost":
			max_health = 160.0
			mass = (block_size.x * block_size.y) * 0.0018
			if block_visual:
				block_visual.texture = tex_pillar_permafrost if (is_vertical and tex_pillar_permafrost) else tex_permafrost
				block_visual.modulate = Color.WHITE
			if crack_stage1: crack_stage1.texture = tex_crack_frost_l
			if crack_stage2: crack_stage2.texture = tex_crack_frost_h
			if fracture_particles: fracture_particles.color = Color(0.65, 0.95, 1.0, 0.9)
		"magma_brick":
			max_health = 580.0
			mass = (block_size.x * block_size.y) * 0.0065
			if block_visual:
				block_visual.texture = tex_pillar_magma if (is_vertical and tex_pillar_magma) else tex_magma_brick
				block_visual.modulate = Color.WHITE
			if crack_stage1: crack_stage1.texture = tex_crack_magma_l
			if crack_stage2: crack_stage2.texture = tex_crack_magma_h
			if fracture_particles: fracture_particles.color = Color(1.0, 0.40, 0.1, 0.95)
		"celestial_stone":
			max_health = 880.0
			mass = (block_size.x * block_size.y) * 0.0090
			if block_visual:
				block_visual.texture = tex_pillar_celestial if (is_vertical and tex_pillar_celestial) else tex_celestial_stone
				block_visual.modulate = Color.WHITE
			if crack_stage1: crack_stage1.texture = tex_crack_celestial_l
			if crack_stage2: crack_stage2.texture = tex_crack_celestial_h
			if fracture_particles: fracture_particles.color = Color(1.0, 0.85, 0.25, 0.95)

	current_health = max_health

var support_check_timer: float = 0.08

func _process(delta: float) -> void:
	if spawn_settle_timer > 0.0:
		spawn_settle_timer -= delta

func _physics_process(delta: float) -> void:
	if is_destroyed: return

	if damage_flash_cooldown > 0.0:
		damage_flash_cooldown -= delta

	# Tự động rã nứt khi khối rơi lọt khỏi sàn hang ngầm, triệt tiêu lỗi kẹt timer 9 giây
	var floor_y = GameManager.current_floor_y if has_node("/root/GameManager") else 840.0
	if global_position.y > floor_y + 180.0 or abs(global_position.x) > 2000.0:
		_fracture_block()
		return

	# Anti-Jitter & Micro-Velocity Snubber (Triệt tiêu rung giật khi thanh công trình bị kẹt / chèn ép)
	if is_awake and not is_destroyed:
		var speed = linear_velocity.length()
		var ang_speed = abs(angular_velocity)

		# Khi thanh công trình nằm kẹt/chèn ép, vận tốc dao động rất nhỏ (< 32.0 px/s, xoay < 1.4 rad/s)
		# Tuyệt đối không dập lực nếu khối đang gia tốc rơi tự do xuống dưới (linear_velocity.y > 35.0)
		if speed < 32.0 and ang_speed < 1.4 and linear_velocity.y <= 35.0:
			# Dập tắt xung lực vi mô lũy tiến theo từng tick vật lý
			linear_velocity *= 0.88
			angular_velocity *= 0.82
			micro_jitter_timer += delta

			# TUYỆT ĐỐI CHỈ CHO NGỦ VÀ TRIỆT TIÊU VẬN TỐC KHI KHỐI CÓ BỆ ĐỠ VỮNG CHẮC!
			if (micro_jitter_timer > 0.18 or (speed < 3.0 and ang_speed < 0.2)) and _has_rigid_support():
				linear_velocity = Vector2.ZERO
				angular_velocity = 0.0
				sleeping = true
				micro_jitter_timer = 0.0
		else:
			# Thanh đang bay tự do, rơi dốc hoặc bị bom hất tung -> reset bộ đếm ngay
			micro_jitter_timer = max(0.0, micro_jitter_timer - delta * 3.0)

		# Chống lơ lửng: Nếu khối đã ngủ (sleeping) nhưng mất bệ đỡ bên dưới -> đánh thức rơi ngay
		if sleeping:
			support_check_timer -= delta
			if support_check_timer <= 0.0:
				support_check_timer = 0.12
				if not _has_rigid_support():
					sleeping = false
					apply_central_impulse(Vector2(0, 25.0))

	if not is_awake:
		if spawn_settle_timer > 0.0:
			return
		# KHÓA CỐ ĐỊNH 100%: Tuyệt đối không tự rã đông khi người chơi chưa bắn quả trứng nào
		if has_node("/root/GameManager"):
			var gm = get_node("/root/GameManager")
			if gm.current_egg_index == 0:
				return
		support_check_timer -= delta
		if support_check_timer <= 0.0:
			support_check_timer = 0.12
			if not _has_rigid_support():
				wake_up()

func _has_rigid_support() -> bool:
	var hh = block_size.y * 0.5
	# 1. Nền móng bedrock: Khối tiếp xúc mặt đất thực tế của màn chơi (floor_y) vĩnh viễn vững chắc
	var floor_y = GameManager.current_floor_y if has_node("/root/GameManager") else 840.0
	if (global_position.y + hh) >= (floor_y - 4.0):
		return true

	var space_state = get_world_2d().direct_space_state
	if not space_state: return true

	var hw = block_size.x * 0.5
	# 2. Phân bổ đều các điểm quét xuyên suốt chiều rộng đáy khối để bắt trọn mọi cột trụ đỡ
	var test_points: Array[Vector2] = []
	var test_local_x: Array[float] = []
	var step = 16.0
	var x_cur = -hw + 6.0
	while x_cur <= hw - 6.0:
		test_points.append(to_global(Vector2(x_cur, hh - 4.0)))
		test_local_x.append(x_cur)
		x_cur += step
	if test_points.is_empty():
		test_points.append(to_global(Vector2(0.0, hh - 4.0)))
		test_local_x.append(0.0)

	var ray_length = 26.0
	var has_left = false
	var has_right = false
	var has_center = false
	var any_hit = false

	for idx in range(test_points.size()):
		var pt = test_points[idx]
		var lx = test_local_x[idx]
		var ray_query = PhysicsRayQueryParameters2D.create(pt, pt + Vector2(0, ray_length))
		ray_query.exclude = [get_rid()]
		ray_query.collide_with_bodies = true
		ray_query.collide_with_areas = false
		ray_query.hit_from_inside = true

		var hit = space_state.intersect_ray(ray_query)
		if hit and hit.collider:
			var col = hit.collider
			if is_instance_valid(col) and col != self and not col.is_queued_for_deletion():
				var is_failing = false
				if col is StaticBody2D:
					pass # Nền đá tĩnh hoặc tường biên vững chắc
				elif col is RigidBody2D:
					if ("is_destroyed" in col and col.is_destroyed) \
						or ("is_defeated" in col and col.is_defeated) \
						or ("is_ignited" in col and col.is_ignited) \
						or ("is_broken" in col and col.is_broken) \
						or ("is_breaking" in col and col.is_breaking):
						is_failing = true
					elif "is_awake" in col and col.is_awake and (not col.sleeping or col.linear_velocity.y > 10.0 or col.linear_velocity.length() > 30.0):
						# Khối đỡ bên dưới đã thức giấc đang rơi hoặc trượt -> không còn là bệ đỡ vững chắc
						is_failing = true
				else:
					is_failing = true

				if not is_failing:
					any_hit = true
					if lx < -hw * 0.20:
						has_left = true
					elif lx > hw * 0.20:
						has_right = true
					else:
						has_center = true

	if not any_hit:
		return false

	# Đối với khối hẹp hoặc vuông (width <= 48px): 1 điểm đỡ bất kỳ là đủ
	if block_size.x <= 48.0:
		return true

	# Đối với khối rộng (thanh dầm ngang, cầu nối, mái vòm):
	# Nếu chỉ có điểm tựa ở một bên mép duy nhất mà không có điểm tựa ở giữa hoặc mép đối diện -> Cantilever mất cân bằng
	if (has_left and not has_right and not has_center) or (has_right and not has_left and not has_center):
		return false

	return true

func _check_underlying_support() -> void:
	if not _has_rigid_support():
		wake_up()

func wake_up() -> void:
	if is_destroyed: return
	# KHÓA CỐ ĐỊNH 100%: Tuyệt đối không bao giờ rã đông trong thời gian yên tĩnh (chưa bắn trứng)
	if has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		if gm.current_egg_index == 0:
			return
	is_awake = true
	sleeping = false
	micro_jitter_timer = 0.0
	set_deferred("freeze", false)
	_wake_up_neighbors()

func _wake_up_neighbors() -> void:
	# Lan tỏa thức giấc lên trên cột để toàn bộ tháp sụp đổ đồng bộ, không bao giờ để khối trên lơ lửng
	var space_state = get_world_2d().direct_space_state
	if not space_state: return

	var hh = block_size.y * 0.5
	var box_height = max(hh * 1.5, 140.0)
	var box = RectangleShape2D.new()
	var box_width = max(block_size.x + 40.0, 70.0)
	box.size = Vector2(box_width, box_height)
	var up_query = PhysicsShapeQueryParameters2D.new()
	up_query.shape = box
	up_query.transform = Transform2D(0, global_position + Vector2(0, -hh - box_height * 0.5 + 4.0))
	up_query.collide_with_bodies = true
	up_query.exclude = [get_rid()]

	var up_hits = space_state.intersect_shape(up_query, 32)
	for uh in up_hits:
		var ub = uh.collider
		if is_instance_valid(ub) and ub != self and not ub.is_queued_for_deletion():
			if ub is RigidBody2D:
				ub.sleeping = false
				if ub.freeze:
					if ub.has_method("wake_up"):
						ub.wake_up()
					else:
						ub.freeze = false
				else:
					# Đã rã đông nhưng có thể đang đứng yên, kích hoạt rơi ngay
					ub.apply_central_impulse(Vector2(0, 20.0))

func _on_impact(body: Node) -> void:
	if is_destroyed or spawn_settle_timer > 0.0: return
	if has_node("/root/GameManager"):
		var gm = get_node("/root/GameManager")
		if gm.current_egg_index == 0:
			return

	if body is RigidBody2D:
		var b_vel = body.linear_velocity
		if "pre_impact_velocity" in body and body.pre_impact_velocity.length() > b_vel.length():
			b_vel = body.pre_impact_velocity
		var rel_vel = (linear_velocity - b_vel).length()

		# Chỉ thức giấc khi có va chạm thực sự với vận tốc > 65px/s (không kích hoạt khi chỉ chạm nhẹ hay đứng yên)
		if rel_vel > 65.0:
			if not is_awake:
				wake_up()
			sleeping = false
			micro_jitter_timer = 0.0

		if rel_vel > 140.0:
			var impact_dmg = (rel_vel - 140.0) * min(body.mass * 0.28, 2.5)
			impact_dmg = min(impact_dmg, 220.0)
			take_damage(impact_dmg, global_position)

func take_damage(amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_destroyed: return
	if not is_awake:
		wake_up()
	sleeping = false
	micro_jitter_timer = 0.0

	current_health -= amount

	# Vết nứt đa tầng chuẩn Angry Birds
	if current_health <= max_health * 0.70 and crack_stage1:
		crack_stage1.visible = true
	if current_health <= max_health * 0.35 and crack_stage2:
		crack_stage2.visible = true

	if block_visual and damage_flash_cooldown <= 0.0:
		damage_flash_cooldown = 0.12 # Tối đa 8 lần/giây, chống bão tween khi ngâm trong axit
		var orig_mod = block_visual.modulate
		block_visual.modulate = Color(1.8, 1.8, 1.8, 1.0)
		var flash_tween = create_tween()
		flash_tween.tween_property(block_visual, "modulate", orig_mod, 0.07)

		var jolt = Vector2(randf_range(-2.5, 2.5), randf_range(-1.5, 1.5))
		block_visual.position = base_visual_pos + jolt
		flash_tween.parallel().tween_property(block_visual, "position", base_visual_pos, 0.08)

	if current_health <= 0.0:
		_fracture_block()

func _fracture_block() -> void:
	if is_destroyed: return
	is_destroyed = true

	_wake_up_neighbors()

	var pts = 300 if material_type in ["steel", "obsidian", "cyber_alloy", "celestial_stone"] else (200 if material_type in ["crystal", "magma_brick"] else (150 if material_type in ["stone", "swamp_wood", "permafrost"] else 75))
	GameManager.add_score(pts)
	GameManager.register_block_destroyed()
	ComicScorePopup.spawn_score_popup(get_parent(), global_position, pts)

	if has_node("/root/SoundManager"):
		var snd = get_node("/root/SoundManager")
		match material_type:
			"wood", "swamp_wood": snd.play_wood_break()
			"stone", "magma_brick": snd.play_stone_break()
			"obsidian", "celestial_stone": snd.play_obsidian_crack()
			"glass", "permafrost": snd.play_glass_break()
			"crystal": snd.play_crystal_shatter()
			"steel", "cyber_alloy": snd.play_steel_clang()

	# 1. Bắn khói Comic Puff bồng bềnh
	_spawn_comic_smoke_poof()

	# 2. Bắn các mảnh vỡ vật lý (Flying Shards)
	_spawn_flying_shards()

	if fracture_particles:
		fracture_particles.restart()
		fracture_particles.emitting = true

	if block_visual: block_visual.visible = false
	if crack_stage1: crack_stage1.visible = false
	if crack_stage2: crack_stage2.visible = false

	$CollisionShape2D.set_deferred("disabled", true)
	set_deferred("freeze", true)

	CameraShake.add_trauma(0.12 if material_type in ["steel", "obsidian", "cyber_alloy", "celestial_stone"] else 0.08)

	await get_tree().create_timer(0.45).timeout
	queue_free()

func _spawn_comic_smoke_poof() -> void:
	if not tex_smoke_puff: return
	var p = get_parent()
	if not p: return

	var puff = Sprite2D.new()
	puff.texture = tex_smoke_puff
	puff.global_position = global_position
	puff.scale = Vector2(0.2, 0.2)
	puff.modulate = Color(1, 1, 1, 0.95)
	p.add_child(puff)

	var tween = puff.create_tween()
	tween.parallel().tween_property(puff, "scale", Vector2(0.85, 0.85), 0.32).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.parallel().tween_property(puff, "modulate:a", 0.0, 0.32).set_trans(Tween.TRANS_SINE)
	tween.parallel().tween_property(puff, "rotation", randf_range(-0.8, 0.8), 0.32)
	tween.tween_callback(puff.queue_free)

func _spawn_flying_shards() -> void:
	var shard_tex: Texture2D = tex_shard_wood
	if material_type in ["stone", "obsidian", "magma_brick", "steel", "cyber_alloy"]:
		shard_tex = tex_shard_stone
	elif material_type in ["glass", "crystal", "permafrost", "celestial_stone"]:
		shard_tex = tex_shard_glass
	elif material_type in ["wood", "swamp_wood"]:
		shard_tex = tex_shard_wood

	if not shard_tex: return
	var p = get_parent()
	if not p: return

	for i in range(3):
		var shard = Sprite2D.new()
		shard.texture = shard_tex
		shard.global_position = global_position + Vector2(randf_range(-15, 15), randf_range(-8, 8))
		shard.scale = Vector2(0.65, 0.65)
		p.add_child(shard)

		var target_offset = Vector2(randf_range(-60, 60), randf_range(-70, -20))
		var fall_y = target_offset.y + randf_range(80, 140)

		var tween = shard.create_tween()
		tween.tween_property(shard, "global_position", shard.global_position + target_offset, 0.18).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		tween.parallel().tween_property(shard, "rotation", randf_range(-3.0, 3.0), 0.5)
		tween.tween_property(shard, "global_position:y", shard.global_position.y + fall_y, 0.32).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
		tween.parallel().tween_property(shard, "modulate:a", 0.0, 0.32)
		tween.tween_callback(shard.queue_free)
