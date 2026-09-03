extends RigidBody2D
class_name DestructibleBlock

const CameraShake = preload("res://scripts/core/CameraShake2D.gd")
const ParticleHelper = preload("res://scripts/core/ParticleHelper.gd")
const ComicScorePopup = preload("res://scripts/core/ComicScorePopup.gd")

@export_enum("wood", "stone", "glass", "steel", "obsidian") var material_type: String = "wood"
@export var max_health: float = 130.0
@export var block_size: Vector2 = Vector2(120, 24)

var current_health: float = 130.0
var is_destroyed: bool = false
var is_awake: bool = false
var spawn_settle_timer: float = 0.5

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

static var tex_pillar_wood: Texture2D = null
static var tex_pillar_stone: Texture2D = null
static var tex_pillar_glass: Texture2D = null
static var tex_girder_steel: Texture2D = null

static var tex_crack_wood_l: Texture2D = null
static var tex_crack_wood_h: Texture2D = null
static var tex_crack_stone_l: Texture2D = null
static var tex_crack_stone_h: Texture2D = null
static var tex_crack_glass_l: Texture2D = null
static var tex_crack_glass_h: Texture2D = null
static var tex_crack_steel_l: Texture2D = null
static var tex_crack_steel_h: Texture2D = null

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

	if fracture_particles:
		ParticleHelper.apply_smoke_fx(fracture_particles, 0.25, 0.5)

func _load_textures_once() -> void:
	if tex_wood == null:
		tex_wood = _safe_load_tex("res://assets/sprites/obstacles/wood_block_plank.svg")
		tex_stone = _safe_load_tex("res://assets/sprites/obstacles/stone_block_brick.svg")
		tex_glass = _safe_load_tex("res://assets/sprites/obstacles/glass_block_ice.svg")
		tex_steel = _safe_load_tex("res://assets/sprites/obstacles/steel_block_beam.svg")

		tex_pillar_wood = _safe_load_tex("res://assets/sprites/obstacles/wood_pillar_column.svg")
		tex_pillar_stone = _safe_load_tex("res://assets/sprites/obstacles/stone_pillar_column.svg")
		tex_pillar_glass = _safe_load_tex("res://assets/sprites/obstacles/glass_pillar_column.svg")
		tex_girder_steel = _safe_load_tex("res://assets/sprites/obstacles/steel_girder_column.svg")

		tex_crack_wood_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_wood_light.svg")
		tex_crack_wood_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_wood_heavy.svg")
		tex_crack_stone_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_stone_light.svg")
		tex_crack_stone_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_stone_heavy.svg")
		tex_crack_glass_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_glass_light.svg")
		tex_crack_glass_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_glass_heavy.svg")
		tex_crack_steel_l = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_steel_light.svg")
		tex_crack_steel_h = _safe_load_tex("res://assets/sprites/obstacles/cracks/crack_steel_heavy.svg")

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
		block_visual.position = Vector2(-hw, -hh)
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
				block_visual.texture = tex_pillar_stone if (is_vertical and tex_pillar_stone) else tex_stone
				block_visual.modulate = Color(0.25, 0.12, 0.32, 1.0)
			if crack_stage1: crack_stage1.texture = tex_crack_stone_l
			if crack_stage2: crack_stage2.texture = tex_crack_stone_h
			if fracture_particles: fracture_particles.color = Color(0.35, 0.18, 0.45)

	current_health = max_health

func _process(delta: float) -> void:
	if spawn_settle_timer > 0.0:
		spawn_settle_timer -= delta

func wake_up() -> void:
	if is_awake or is_destroyed: return
	is_awake = true
	set_deferred("freeze", false)
	_wake_up_neighbors()

func _wake_up_neighbors() -> void:
	var space_state = get_world_2d().direct_space_state
	if not space_state: return
	var query = PhysicsShapeQueryParameters2D.new()
	var sphere = CircleShape2D.new()
	sphere.radius = max(block_size.x, block_size.y) * 0.8 + 65.0
	query.shape = sphere
	query.transform = Transform2D(0, global_position)
	query.collide_with_bodies = true
	query.exclude = [get_rid()]

	var hits = space_state.intersect_shape(query, 32)
	for h in hits:
		var b = h.collider
		if is_instance_valid(b) and b != self:
			if b.has_method("wake_up") and not b.is_awake:
				b.wake_up()

func _on_impact(body: Node) -> void:
	if is_destroyed or spawn_settle_timer > 0.0: return
	if not is_awake:
		wake_up()

	if body is RigidBody2D:
		var b_vel = body.linear_velocity
		if "pre_impact_velocity" in body and body.pre_impact_velocity.length() > b_vel.length():
			b_vel = body.pre_impact_velocity
		var rel_vel = (linear_velocity - b_vel).length()
		if rel_vel > 140.0:
			var impact_dmg = (rel_vel - 140.0) * min(body.mass * 0.28, 2.5)
			impact_dmg = min(impact_dmg, 220.0)
			take_damage(impact_dmg, global_position)

func take_damage(amount: float, _from_pos: Vector2 = Vector2.ZERO) -> void:
	if is_destroyed: return
	if not is_awake:
		wake_up()

	current_health -= amount

	# Vết nứt đa tầng chuẩn Angry Birds
	if current_health <= max_health * 0.70 and crack_stage1:
		crack_stage1.visible = true
	if current_health <= max_health * 0.35 and crack_stage2:
		crack_stage2.visible = true

	if block_visual:
		var orig_mod = block_visual.modulate
		block_visual.modulate = Color(1.8, 1.8, 1.8, 1.0)
		var flash_tween = create_tween()
		flash_tween.tween_property(block_visual, "modulate", orig_mod, 0.07)

	if current_health <= 0.0:
		_fracture_block()

func _fracture_block() -> void:
	if is_destroyed: return
	is_destroyed = true

	_wake_up_neighbors()

	var pts = 250 if material_type in ["steel", "obsidian"] else (150 if material_type == "stone" else 75)
	GameManager.add_score(pts)
	ComicScorePopup.spawn_score_popup(get_parent(), global_position, pts)

	if has_node("/root/SoundManager"):
		var snd = get_node("/root/SoundManager")
		match material_type:
			"wood": snd.play_wood_break()
			"stone", "obsidian": snd.play_stone_break()
			"glass": snd.play_glass_break()
			"steel": snd.play_wood_break()

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

	CameraShake.add_trauma(0.12 if material_type in ["steel", "obsidian"] else 0.08)

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
	if material_type in ["stone", "obsidian"]:
		shard_tex = tex_shard_stone
	elif material_type == "glass":
		shard_tex = tex_shard_glass
	elif material_type == "steel":
		shard_tex = tex_shard_stone

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
